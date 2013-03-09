/**
 * # gui.Class
 * This fellow allow us to create a newable constructor that can be easily subclassed. 
 * Instances of this constructor may use a special `_super` method to overload members 
 * of the `superclass` prototype. 
 * @todo Evaluate static stuff first so that proto can declare vals as static props 
 * @todo Check if static stuff shadows recurring static (vice versa) and warn about it.
 * @todo "expando" should be universally renamed "extension" or something.
 * @todo It's possible for a prototype to be a prototype, investigate this inception
 */
gui.Class = { 

	/**
	 * Create class. Use method `extend` on the constructor to subclass further.
	 * @param {object} proto Base prototype
	 * @param {object} expando Prototype expandos
	 * @param {object} recurring Constructor and subconstructor expandos
	 * @param {object} statics Constructor expandos
	 * @returns {function}
	 */
	create : function () {
		var args = this._breakdown_base ( arguments );
		var C = this._create ( args.proto, args.name || "Anonymous" );
		this._internals ( C );
		gui.Object.extend ( C.prototype, args.expando );
		gui.Object.extend ( C, args.statics );
		if ( args.recurring ) {
			gui.Object.each ( args.recurring, function ( key, val ) {
				C [ key ] = C.__recurring__ [ key ] = val;
			});
		}
		return C;
	},

	/**
	 * Create subclass. This method is called on the superclass constructor: MyClass.extend()
	 * @param {object} proto Base prototype
	 * @param {object} expando Prototype expandos
	 * @param {object} recurring Constructor and subconstructor expandos
	 * @param {object} statics Constructor expandos
	 * @returns {function} Constructor
	 */
	extend : function () { // expando, recurring, statics 
		var args = gui.Class.breakdown ( arguments );		
		this.__super__ = this.__super__ || new gui.Super ( this ); // support _super() in subclass
		return gui.Class._extend ( this, args.expando, args.recurring, args.statics, args.name );
	},

	/**
	 * Assign method or property to prototype, checking for naming collision.
	 * This method is called on the class constructor: MyClass.mixin(name,value)
	 * @todo http://www.nczonline.net/blog/2012/12/11/are-your-mixins-ecmascript-5-compatible
	 * @param {String} name
	 * @param {object} value
	 * @param @optional {boolean} override Disable collision detection
	 */
	mixin : function ( name, value, override ) {
		if ( this.prototype [ name ] === undefined || override ) {
			this.prototype [ name ] = value;
			gui.Class.descendantsAndSelf ( this, function ( C ) {
				var s = C.__super__; 
				if ( s !== null ) {
					gui.Super.stubOne ( s, C.prototype, name );
				}
			});
		} else {
			console.error ( "Addin naming collision in " + this + ": " + name );
		}
	},

	/**
	 * Break down class constructor arguments. We want to make the string (naming) 
	 * argument optional, but we still want to keep is as first argument, so the 
	 * other arguments must be identified by whether or not it's present. 
	 * @param {Arguments} args
	 * @returns {object}
	 */
	breakdown : function ( args ) {
		var named = gui.Type.isString ( args [ 0 ]);
		return {
			name : named ? args [ 0 ] : null,			
			expando : args [ named ? 1 : 0 ] || Object.create ( null ),
			recurring : args [ named ? 2 : 1 ] || Object.create ( null ),
			statics : args [ named ? 3 : 2 ] || Object.create ( null )
		};
	},
	
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
		var results = this.descendants.apply ( this, arguments );
		action = action || gui.Combo.identity;
		results.push ( action.call ( thisp, C ));
		return results;
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
		var results = this.ancestors.apply ( this, arguments );
		action = action || gui.Combo.identity;
		results.push ( action.call ( thisp, C ));
		return results;
	},

	
	// Private .....................................................

	/**
	 * Breakdown arguments for base exemplar only (has one extra argument).
	 * @see {gui.Class#breakdown}
	 * @param {Arguments} args
	 * @returns {object}
	 */
	_breakdown_base : function ( args ) {
		var named = gui.Type.isString ( args [ 0 ]);
		return {
			name : named ? args [ 0 ] : null,
			proto	: args [ named ? 1 : 0 ] || {},
			expando : args [ named ? 2 : 1 ] || {},
			recurring : args [ named ? 3 : 2 ] || {},
			statics : args [ named ? 4 : 3 ] || {}
		};
	},

	/**
	 * @todo comments here!
	 * @param {object} proto Prototype of superconstructor
	 * @param {String} name Constructor name (for debug).
	 * @returns {function}
	 */
	_create : function ( proto, name ) {
		var C = gui.Function.create ( name, null, this._body );
		C.prototype = Object.create ( proto || null );
		C.prototype.constructor = C;
		C.__super__ = null;
		[ "extend", "mixin" ].forEach ( function ( method ) {
			C [ method ] = this [ method ];
		}, this );
		return this._name ( C, name );
	},

	/**
	 * Create subclass constructor.
	 * @param {object} constructor Super constructor
	 * @param {object} expando Prototype expandos
	 * @param {object} recurring Constructor and subconstructor expandos
	 * @param {object} statics Constructor expandos
	 * @param {String} generated display name (for development)
	 * @returns {function} Constructor
	 */
	_extend : function ( constructor, expando, recurring, statics, name ) {
		name = name || "Anonymous";
		var C = this._create ( constructor.prototype, name );
		constructor.__subclasses__.push ( C );
		this._internals ( C, constructor, gui.Object.copy ( constructor.__recurring__ ));
		gui.Object.extend ( C, statics );
		gui.Object.extend ( C.__recurring__, recurring );
		gui.Object.each ( C.__recurring__, function ( key, val ) {
			C [ key ] = val;
		});
		gui.Super.stamp ( constructor, C, expando );
		return this._name ( C, name );
	},

	/**
	 * Create some properties that probably should be renamed.
	 * @param {function} C
	 * @param @optional {function} superclass
	 * @param @optional {Map<String,function>} recurring
	 * @returns {function}
	 */
	_internals : function ( C, superclass, recurring ) {
		C.__recurring__ = recurring || Object.create ( null );
		C.__subclasses__ = [];
		C.__superclass__ = superclass || null;
		C.__indexident__ = gui.KeyMaster.generateKey ( "class" );
		return C;
	},

	/**
	 * Name constructor and instance.
	 * @param {function} C
	 * @param {String} name
	 * @returns {function}
	 */
	_name : function ( C, name ) {
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
		if ( !what.hasOwnProperty ( "toString" )) {
			what.displayName = name;
			what.toString = function toString () {
				return "[" + type + " " + name + "]";
			};
		}
	},

	/**
	 * Constructor body common to all exemplars.
	 * @todo Return new this if not called with new keyword
	 * @todo Why doesn't all this stuff work???????????????
	 * @type {String}
	 */
	_body : "var constructor = this.__construct__ || this.onconstruct;" +
		"if ( gui.Type.isFunction ( constructor )) {" +
			"constructor.apply ( this, arguments );" +
		"}"
};