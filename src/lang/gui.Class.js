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
				C [ key ] = C.$recurring [ key ] = val;
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
	

	// Private ..............................................................................

	/**
	 * Mapping classes to keys.
	 * @type {Map<String,gui.Class>}
	 */
	_classes : Object.create ( null ),

	/**
	 * Nameless name.
	 * @type {String}
	 */
	_ANONYMOUS : "Anonymous",

	/**
	 * Compute class constructor body (as a string). The $name 
	 * will be substituted for the class name. Note that if 
	 * called without the 'new' keyword, the function acts 
	 * as a shortcut the the MyClass.extend method.
	 * @type {String}
	 */
	_BODY : ( function ( $name ) {
		var body = $name.toString ().trim ();
		return body.slice ( body.indexOf ( "{" ) + 1, -1 );
	}(
		function $name () {
			if ( this instanceof $name === false ) {
				return $name.extend.apply ( $name, arguments );
			} else {
				var constructor = this.$onconstruct || this.onconstruct;
				var nonenumprop = gui.Property.nonenumerable;
				window.Object.defineProperties ( this, {
					"$instanceid" : nonenumprop ({
						value: gui.KeyMaster.generateKey ( "instance" )
					}),
					displayName : nonenumprop ({
						value : this.constructor.displayName,
						writable : true
					})
				});
				if ( gui.Type.isFunction ( constructor )) {
					constructor.apply ( this, arguments );
				}
			}
		}
	)),
	
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
			proto	: args [ named ? 1 : 0 ] || Object.create ( null ),
			protos : args [ named ? 2 : 1 ] || Object.create ( null ),
			recurring : args [ named ? 3 : 2 ] || Object.create ( null ),
			statics : args [ named ? 4 : 3 ] || Object.create ( null )
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
		name = name || gui.Class._ANONYMOUS;
		var C = gui.Function.create ( name, null, this._namedbody ( name ));
		C.$classid = gui.KeyMaster.generateKey ( "class" );
		C.prototype = Object.create ( proto || null );
		C.prototype.constructor = C;
		C = this._internals ( C, SuperC );
		C = this._interface ( C );
		C = this._nameclass ( C, name );
		return C;
	},

	/**
	 * Create subclass for given class.
	 * @param {funciton} SuperC
	 * @param {Object} args
	 * @return {function}
	 */
	_createsubclass : function ( SuperC, args ) {
		args = this.breakdown ( args );
		if ( gui.Type.isDefined ( args.config )) {
			console.warn ( "'config' has been renamed 'attconfig'" );
		}
		SuperC.$super = SuperC.$super || new gui.Super ( SuperC );
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
		gui.Object.extend ( C.$recurring, recurring );
		gui.Object.each ( C.$recurring, function ( key, val ) {
			C [ key ] = val;
		});
		gui.Property.extendall ( protos, C.prototype ); // @TODO what about base?
		gui.Super.support ( SuperC, C, protos );
		C = this._nameclass ( C, name );
		return this._profiling ( C );
	},

	/**
	 * This might do something in the profiler. Not much luck with stack traces.
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
					this._displayname ( value, name + "." + key );
				}
			}, this );
		}, this );
		return C;
	},

	/**
	 * Setup framework internal propeties.
	 * @param {function} C
	 * @param @optional {function} superclass
	 * @param @optional {Map<String,object>} recurring
	 * @returns {function}
	 */
	_internals : function ( C, SuperC ) {
		C.$super = null;
		C.$subclasses = [];
		C.$superclass = SuperC || null;
		C.$recurring = SuperC ? gui.Object.copy ( SuperC.$recurring ) : Object.create ( null );
		if ( SuperC ) {
			SuperC.$subclasses.push ( C );
		}
		return C;
	},

	/**
	 * Setup standard static methods for extension and mixins.
	 * @param {function} C
	 * @returns {function}
	 */
	_interface : function ( C ) {
		[ "extend", "mixin" ].forEach ( function ( method ) {
			C [ method ] = this [ method ];
		}, this );
		return C;
	},

	/**
	 * Name constructor and instance.
	 * @param {function} C
	 * @param {String} name
	 * @returns {function}
	 */
	_nameclass : function ( C, name ) {
		name = name || gui.Class._ANONYMOUS;
		this._namedthing ( C, "function", name );
		this._namedthing ( C.prototype, "object", name );
		return C;
	},

	/**
	 * Name constructor or instance.
	 * @param {object} what
	 * @param {String} type
	 * @param {String} name
	 */
	_namedthing : function ( what, type, name ) {
		this._displayname ( what, name );
		if ( !what.hasOwnProperty ( "toString" )) {
			what.toString = function toString () {
				return "[" + type + " " + name + "]";
			};
		}
	},

	/**
	 * Compute constructor body for class of given name.
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	_namedbody : function ( name ) {
		return this._BODY.replace ( 
			new RegExp ( "\\$name", "gm" ), 
			gui.Function.safename ( name )
		);
	},

	/**
	 * Set the elusive displayName property. Doesn't seem to work a lot.
	 * @param  {[type]} what [description]
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	_displayname : function ( thing, name ) {
		if ( !gui.Type.isDefined ( thing.displayName )) {
			Object.defineProperty ( thing, "displayName", 
				gui.Property.nonenumerable ({
					writable : true,
					value : name
				})
			);
		}
		return thing;
	}

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
				if ( C.$super ) { // mixed in method gets added to the _super objects...
					gui.Super.generateStub ( C.$super, C.prototype, name );
				}
			});
		} else {
			console.error ( "Mixin naming collision in " + this + ": " + name );
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
		C.$subclasses.forEach ( function ( sub ) {
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
		C.$subclasses.forEach ( function ( sub ) {
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
		return action.call ( thisp, C.$superclass );
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
		if ( C.$superclass ) {
			results.push ( action.call ( thisp, C.$superclass ));
			gui.Class.ancestors ( C.$superclass, action, thisp, results );
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