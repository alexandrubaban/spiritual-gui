/**
 * # gui.Exemplar
 * The term "exemplar" has been proposed to avoid the term "class" which is misleading 
 * for prototypal inheritance. Nevertheless, this fellow allow us to create a newable 
 * constructor that can be easily subclassed. Instances of this constructor may use a 
 * special `_super` method to overload members of the superclass prototype. 
 * @todo Evaluate static stuff first so that proto can declare vals as static props 
 * @todo Check if static stuff shadows recurring static (vice versa) and warn about it.
 * @todo "expando" should be universally renamed "extension" or something.
 * @todo It's possible for a prototype to be a prototype, investigate this inception
 * @todo Formalize naming of __indexident__ and __children__ and __recurring__
 */
gui.Exemplar = { 

	/**
	 * Create magic constructor. Use static method `extend` on the constructor to subclass further.
	 * @param {object} proto Base prototype
	 * @param {object} expando Prototype expandos
	 * @param {object} recurring Constructor and subconstructor expandos
	 * @param {object} statics Constructor expandos
	 * @returns {function}
	 */
	create : function () {
		var args = this._breakdown_base ( arguments );
		var name = args.name || "Anonymous";
		var C = this._create ( args.proto, name );
		this._name ( C, name );
		gui.Object.extend ( C.prototype, args.expando );
		gui.Object.extend ( C, args.statics );
		C.__recurring__ = Object.create ( null ); // tracking recurring static members
		C.__children__ = []; // tracking immediate subclasses of this class
		C.__parent__ = null;
		C.__indexident__ = gui.KeyMaster.generateKey (); // make it easy to use class as key in map
		//C.__ = deprecated!
		if ( args.recurring ) {
			gui.Object.each ( args.recurring, function ( key, val ) {
				C [ key ] = C.__recurring__ [ key ] = val;
			});
		}
		return C;
	},

	/**
	 * We want to make the string (naming) argument optional, but we still want to keep is as 
	 * first argument; so the other arguments must be identified by whether or not it's present. 
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
	 * Create subclass constructor.
	 * @param {object} proto Base prototype
	 * @param {object} expando Prototype expandos
	 * @param {object} recurring Constructor and subconstructor expandos
	 * @param {object} statics Constructor expandos
	 * @returns {function} Constructor
	 */
	extend : function () { // expando, recurring, statics 
		var args = gui.Exemplar.breakdown ( arguments );		
		this.__super__ = this.__super__ || new gui.Super ( this ); // support _super() in subclass
		return gui.Exemplar._extend ( this, args.expando, args.recurring, args.statics, args.name );
	},
	
	/**
	 * Apply action to all immediate subclasses of given type. Returns an array of 
	 * results. If no action is provided, returns array of descendant sublasses.
	 * @param {function} C constructor
	 * @param @optionaæ {function} action
	 * @param @optional {object} thisp
	 * @returns {Array<object>}
	 */
	children : function ( C, action, thisp ) {
		var results = [];
		action = action || gui.Combo.identity;
		C.__children__.forEach ( function ( sub ) {
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
	 * @returns {Array<object>}
	 */
	descendants : function ( C, action, thisp, results ) {
		results = results || [];
		action = action || gui.Combo.identity;
		C.__children__.forEach ( function ( sub ) {
			results.push ( action.call ( thisp, sub ));
			gui.Exemplar.descendants ( sub, action, thisp, results );
		}, thisp );
		return results;
	},

	/**
	 * @param {function} C constructor
	 * @param @optional {function} action
	 * @param @optional {object} thisp
	 * @returns {object}
	 */
	parent : function ( C, action, thisp ) {
		action = action || gui.Combo.identity;
		return action.call ( thisp, C.__parent__ );
	},

	/*
	 * 
	 */
	ancestors : function ( C, action, thisp, results ) {
		results = results || [];
		action = action || gui.Combo.identity;
		if ( C.__parent__ ) {
			results.push ( action.call ( thisp, C.__parent__ ));
			gui.Exemplar.ancestors ( C.__parent__, action, thisp, results );
		}
		return results;
	},

	/**
	 * Apply action recursively to base class and all derived subclasses.
	 * @todo Rename "descendantsAndSelf" or something
	 * @deprecated (must be)
	 * @param {function} C constructor
	 * @param {function} action
	 * @param @optional {object} thisp
	 */
	family : function ( C, action, thisp ) {
		action = action || gui.Combo.identity;
		return this.descendants ( C, action, thisp, [ action.call ( thisp, C )]);
	},

	/**
	 * Assign method or property to prototype, checking for naming collision.
	 * @todo http://www.nczonline.net/blog/2012/12/11/are-your-mixins-ecmascript-5-compatible
	 * @todo Rename this method
	 * @param {String} name
	 * @param {object} value
	 * @param @optional {boolean} override Disable collision detection
	 */
	mixin : function ( name, value, override ) {
		if ( this.prototype [ name ] === undefined || override ) {
			this.prototype [ name ] = value;
			gui.Exemplar.family ( this, function ( C ) {
				var s = C.__super__; 
				if ( s !== null ) {
					gui.Super.stubOne ( s, C.prototype, name );
				}
			});
		} else {
			console.error ( "Addin naming collision in " + this + ": " + name );
		}
	},
	
	// Private .....................................................

	/**
	 * Breakdown arguments for base exemplar only (has one extra argument).
	 * @see {gui.Exemplar#breakdown}
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
		this._name ( C, name );
		// used for key in maps (if no native Map)
		C.__indexident__ = gui.KeyMaster.generateKey ();
		// extenders
		C.__children__ = [];
		C.__parent__ = constructor;
		constructor.__children__.push ( C );
		// static methods
		gui.Object.extend ( C, statics );
		// recurring statics
		C.__recurring__ = gui.Object.copy ( constructor.__recurring__ );
		gui.Object.extend ( C.__recurring__, recurring );
		gui.Object.each ( C.__recurring__, function ( key, val ) {
			C [ key ] = val;
		});
		// super pseudokeyword
		gui.Super.stamp ( constructor, C, expando );
		return C;
	},

	/**
	 * @todo comments here!
	 * @param {object} proto Prototype of superconstructor
	 * @param {String} name Constructor name (for debug).
	 * @returns {function}
	 */
	_create : function ( proto, name ) {
		var C = gui.Function.create ( name, null, this._body );
		C.prototype = Object.create ( proto );
		C.prototype.constructor = C;
		C.__super__ = null;
		[ "extend", "mixin" ].forEach ( function ( method ) {
			C [ method ] = this [ method ];
		}, this );
		return C;
	},

	/**
	 * Create named constructor.
	 * @todo Perhaps gui.Function.create (@see http://wiki.ecmascript.org/doku.php?id=strawman:name_property_of_functions)
	 * @param {String} name
	 * @returns {function} constructor
	 *
	_constructor : function ( name ) {
		if ( name.contains ( "." )) {
			var index = name.lastIndexOf ( "." );
			name = name.substring ( index + 1 );
		}
		var Invokable = Function; // @todo perhaps scope this to a context?
		var named = new Invokable (
			"return function " + name + " () {" +
				"var con = this.__construct__ || this.onconstruct;" +
				"if ( gui.Type.isFunction ( con )) {" +
					"con.apply ( this, arguments );" +
				"}" +
			"}"
		);
		return named ();
	},
	*/

	/**
	 * Name constructor and instance.
	 * @param {function} C
	 * @param {String} name
	 */
	_name : function ( C, name ) {
		this._nameIt ( C, "function", name );
		this._nameIt ( C.prototype, "object", name );
	},

	/**
	 * Name constructor or instance.
	 * @todo does it work ?
	 * @param {object} what
	 * @param {String} type
	 * @param {String} name
	 */
	_nameIt : function ( what, type, name ) {
		if ( !what.hasOwnProperty ( "toString" )) {
			what.toString = function toString () {
				return "[" + type + " " + name + "]";
			};
		}
		if ( !what.hasOwnProperty ( "displayName" )) {
			Object.defineProperty ( what, "displayName", {
				enumerable : false,
				configurable : true,
				get : function () {
					return name;
				}
			});
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