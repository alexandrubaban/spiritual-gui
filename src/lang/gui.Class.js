/**
 * This fellow allow us to create a newable constructor that can be 'subclassed' via an extend method. 
 * Instances of the "class" may use a special `_super` method to overload members of the "superclass".
 * @TODO Evaluate static stuff first so that proto can declare vals as static props 
 * @TODO Check if static stuff shadows recurring static (vice versa) and warn about it.
 * @TODO It's possible for a prototype to be a prototype, investigate this inception
 */
gui.Class = {

	/**
	 * Create constructor. Use method `extend` on the constructor to subclass further.
	 * @param @optional {String} name
	 * @param {object} proto Base prototype
	 * @param {object} protos Prototype extensions
	 * @param {object} recurring Constructor and subconstructor extensions
	 * @param {object} statics Constructor extensions
	 * @returns {function}
	 */
	create : function () {
		var b = this._breakdown_base ( arguments );
		var C = this._createclass ( null, b.proto, b.name );
		gui.Object.extend ( C.prototype, b.protos );
		gui.Object.extend ( C, b.statics );
		if ( b.recurring ) {
			gui.Object.each ( b.recurring, function ( key, val ) {
				C [ key ] = C.__recurring__ [ key ] = val;
			});
		}
		return this._profiling ( C );
	},

	/**
	 * Break down class constructor arguments. We want to make the string (naming) 
	 * argument optional, but we still want to keep is as first argument, so the 
	 * other arguments must be identified by whether or not it's present. 
	 * @param {Arguments} args
	 * @returns {object}
	 */
	breakdown : function ( args ) {
		return this._breakdown_subs ( args );
	},
	

	// Private ..................................................................

	/**
	 * Nameless name.
	 * @type {String}
	 */
	_ANONYMOUS : "Anonymous",

	/**
	 * Mapping classes to keys.
	 * @type {Map<String,gui.Class>}
	 */
	_classes : Object.create ( null ),
	
	/**
	 * Breakdown arguments for base exemplar only (has one extra argument).
	 * @TODO Something in gui.Arguments instead.
	 * @see {gui.Class#breakdown}
	 * @param {Arguments} args
	 * @returns {object}
	 */
	_breakdown_base : function ( args ) {
		var named = gui.Type.isString ( args [ 0 ]);
		return {
			name : named ? args [ 0 ] : null,
			proto	: args [ named ? 1 : 0 ] || {},
			protos : args [ named ? 2 : 1 ] || {},
			recurring : args [ named ? 3 : 2 ] || {},
			statics : args [ named ? 4 : 3 ] || {}
		};
	},

	/**
	 * Break down class constructor arguments. We want to make the string (naming) 
	 * argument optional, but we still want to keep is as first argument, so the 
	 * other arguments must be identified by whether or not it's present. 
	 * @TODO Something in gui.Arguments instead.
	 * @param {Arguments} args
	 * @returns {object}
	 */
	_breakdown_subs : function ( args ) {
		var named = gui.Type.isString ( args [ 0 ]);
		return {
			name : named ? args [ 0 ] : null,			
			protos : args [ named ? 1 : 0 ] || Object.create ( null ),
			recurring : args [ named ? 2 : 1 ] || Object.create ( null ),
			statics : args [ named ? 3 : 2 ] || Object.create ( null )
		};
	},

	/**
	 * @TODO comments here!
	 * @param {object} proto Prototype of superconstructor
	 * @param {String} name Constructor name (for debug).
	 * @returns {function}
	 */
	_createclass : function ( SuperC, proto, name ) {
		var C = gui.Function.create ( name, null, this._body );
		C.$classid = gui.KeyMaster.generateKey ( "class" );
		C.prototype = Object.create ( proto || null );
		C.prototype.constructor = C;
		this._internals ( C, SuperC );
		[ "extend", "mixin" ].forEach ( function ( method ) {
			C [ method ] = this [ method ];
		}, this );
		this._name ( C, name );
		return C;
	},

	_createsubclass : function ( SuperC, args ) {
		args = this.breakdown ( args );
		SuperC.__super__ = SuperC.__super__ || new gui.Super ( SuperC );
		return this._extend_fister ( SuperC, args.protos, args.recurring, args.statics, args.name );
	},

	/**
	 * Create subclass constructor.
	 * @param {object} SuperC super constructor
	 * @param {object} protos Prototype extensions
	 * @param {object} recurring Constructor and subconstructor extensions
	 * @param {object} statics Constructor extensions
	 * @param {String} generated display name (for development)
	 * @returns {function} Constructor
	 */
	_extend_fister : function ( SuperC, protos, recurring, statics, name ) {
		var C = this._createclass ( SuperC, SuperC.prototype, name );
		gui.Object.extend ( C, statics );
		gui.Object.extend ( C.__recurring__, recurring );
		gui.Object.each ( C.__recurring__, function ( key, val ) {
			C [ key ] = val;
		});
		gui.Accessors.support ( C, protos ); // @TODO what about base?
		gui.Super.support ( SuperC, C, protos );
		this._name ( C, name );
		return this._profiling ( C );
	},

	/**
	 * Might do something in the profiler, no such luck with stack traces.
	 * @see http://www.alertdebugging.com/2009/04/29/building-a-better-javascript-profiler-with-webkit/
	 * @see https://code.google.com/p/chromium/issues/detail?id=17356
	 * @param {function} C
	 * @returns {function}
	 */
	_profiling : function ( C ) {
		var name = C.name || gui.Class._ANONYMOUS;
		[ C, C.prototype ].forEach ( function ( thing ) {
			gui.Object.each ( thing, function ( key, value ) {
				if ( gui.Type.isMethod ( value )) {
					value.displayName = value.displayName || name + "." + key; 
				}
			});
		});
		return C;
	},

	/**
	 * Computing internal class propeties.
	 * @param {function} C
	 * @param @optional {function} superclass
	 * @param @optional {Map<String,object>} recurring
	 * @returns {function}
	 */
	_internals : function ( C, SuperC ) {
		C.__super__ = null;
		C.__subclasses__ = [];
		C.__superclass__ = SuperC || null;
		C.__recurring__ = SuperC ? gui.Object.copy ( SuperC.__recurring__ ) : Object.create ( null );
		if ( SuperC ) {
			SuperC.__subclasses__.push ( C );
		}
		return C;
	},

	/**
	 * Name constructor and instance.
	 * @param {function} C
	 * @param {String} name
	 * @returns {function}
	 */
	_name : function ( C, name ) {
		name = name || gui.Class._ANONYMOUS;
		this._doname ( C, "function", name );
		this._doname ( C.prototype, "object", name );
		return C;
	},

	/**
	 * Name constructor or instance.
	 * @param {object} what
	 * @param {String} type
	 * @param {String} name
	 */
	_doname : function ( what, type, name ) {
		what.displayName = name; // not working :/
		if ( !what.hasOwnProperty ( "toString" )) {
			what.toString = function toString () {
				return "[" + type + " " + name + "]";
			};
		}
	},

	/**
	 * Constructor body common to all exemplars.
	 * @TODO Return new this if not called with new keyword
	 * @TODO Why doesn't all this stuff work???????????????
	 * @type {String}
	 */
	_body : "" +
	  "this.$instanceid = gui.KeyMaster.generateKey ( \"id\" );\n" +
		"var constructor = this.$onconstruct || this.onconstruct;\n" +
		"if ( gui.Type.isFunction ( constructor )) {\n" +
			"constructor.apply ( this, arguments );\n" +
		"}"
};


// Class members .............................................................................

gui.Object.each ({

	/**
	 * Create subclass. This method is called on the class constructor: MyClass.extend()
	 * @param @optional {String} name
	 * @param {object} proto Base prototype
	 * @param {object} protos Prototype methods and properties
	 * @param {object} recurring Constructor and subconstructor extensions
	 * @param {object} statics Constructor extensions
	 * @returns {function} Constructor
	 */
	extend : function () { // protos, recurring, statics 
		return gui.Class._createsubclass ( this, arguments );
	},

	/**
	 * Mixin something on prototype while checking for naming collision.
	 * This method is called on the class constructor: MyClass.mixin()
	 * @TODO http://www.nczonline.net/blog/2012/12/11/are-your-mixins-ecmascript-5-compatible
	 * @param {String} name
	 * @param {object} value
	 * @param @optional {boolean} override Disable collision detection
	 */
	mixin : function ( name, value, override ) {
		if ( !gui.Type.isDefined ( this.prototype [ name ]) || override ) {
			this.prototype [ name ] = value;
			gui.Class.descendantsAndSelf ( this, function ( C ) {
				if ( C.__super__ ) { // mixin added to _super objects as well...
					gui.Super.generateStub ( C.__super__, C.prototype, name );
				}
			});
		} else {
			console.error ( "Addin naming collision in " + this + ": " + name );
		}
	}

}, function ( name, method ) {
	gui.Class [ name ] = method;
});


// Class navigation .........................................................................

gui.Object.each ({

	/**
	 * Return superclass. If action is provided, return an array of the results 
	 * of executing the action for each subclass with the subclass as argument.
	 * @param {function} C constructor
	 * @param @optional {function} action
	 * @param @optional {object} thisp
	 * @returns {Array<gui.Class|object>}
	 */
	children : function ( C, action, thisp ) {
		var results = [];
		action = action || gui.Combo.identity;
		C.__subclasses__.forEach ( function ( sub ) {
			results.push ( action.call ( thisp, sub ));
		}, thisp );
		return results;
	},

	/**
	 * Apply action recursively to all derived subclasses of given class.
	 * Returns an array of accumulated results. If no action is provided, 
	 * returns array of descendant sublasses.
	 * @param {function} C constructor
	 * @param @optional {function} action
	 * @param @optional {object} thisp 
	 * @param @internal {Array<gui.Class|object>} results
	 * @returns {Array<gui.Class|object>}
	 */
	descendants : function ( C, action, thisp, results ) {
		results = results || [];
		action = action || gui.Combo.identity;
		C.__subclasses__.forEach ( function ( sub ) {
			results.push ( action.call ( thisp, sub ));
			gui.Class.descendants ( sub, action, thisp, results );
		}, thisp );
		return results;
	},

	/**
	 * Return descendant classes and class itself. If action is provided, return array of the results 
	 * of executing the action for each descendant class and class itself with the class as argument.
	 * @param {function} C constructor
	 * @param @optional {function} action
	 * @param @optional {object} thisp
	 * @returns {Array<gui.Class|object>}
	 */
	descendantsAndSelf : function ( C, action, thisp ) {
		var results = [];
		action = action || gui.Combo.identity;
		results.push ( action.call ( thisp, C ));
		return this.descendants ( C, action, thisp, results );
	},

	/**
	 * Return superclass. If action is provided, return the result 
	 * of executing the action with the superclass as argument.
	 * @param {function} C constructor
	 * @param @optional {function} action
	 * @param @optional {object} thisp
	 * @returns {gui.Class|object}
	 */
	parent : function ( C, action, thisp ) {
		action = action || gui.Combo.identity;
		return action.call ( thisp, C.__superclass__ );
	},

	/**
	 * Return ancestor classes. If action is provided, return array of the results 
	 * of executing the action for each ancestor class with the class as argument.
	 * @param {function} C constructor
	 * @param @optional {function} action
	 * @param @optional {object} thisp 
	 * @param @internal {<gui.Class|object>} results
	 * @returns {Array<gui.Class|object>}
	 */
	ancestors : function ( C, action, thisp, results ) {
		results = results || [];
		action = action || gui.Combo.identity;
		if ( C.__superclass__ ) {
			results.push ( action.call ( thisp, C.__superclass__ ));
			gui.Class.ancestors ( C.__superclass__, action, thisp, results );
		}
		return results;
	},

	/**
	 * Return ancestor classes and class itself. If action is provided, return array of the results 
	 * of executing the action for each ancestor class and class itself with the class as argument.
	 * @param {function} C constructor
	 * @param @optional {function} action Takes the class as argument
	 * @param @optional {object} thisp
	 * @returns {Array<<gui.Class|object>>}
	 */
	ancestorsAndSelf : function ( C, action, thisp ) {
		var results = [];
		action = action || gui.Combo.identity;
		results.push ( action.call ( thisp, C ));
		return this.ancestors ( C, action, thisp, results );
	}

}, function ( name, method ) {
	gui.Class [ name ] = method;
});