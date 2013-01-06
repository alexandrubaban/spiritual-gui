/**
 * Super :)
 * @param {function} constructor
 */
gui.Super = function Super ( constructor ) {
	
	"use strict";
	gui.Super.stubAll ( this, constructor.prototype );
};

gui.Super.prototype = Object.create ( null );


// STATICS .......................................................................

/**
 * @static
 * Instance of an i.Exemplar subclass (now invoking _super).
 * @type {object}
 */
gui.Super.subject = null;

/**
 * EXPERIMENTAL.
 * @type {boolean}
 */
gui.Super.sandbox = false;

/**
 * Prepended to the result of calling 
 * toString() on a modified function.
 * @type {String}
 */
gui.Super.disclaimer = "/**\n" +
	"  * The runtime execution of this method \n" +
	"  * has been overloaded by the framework. \n" +
	"  * This is an approximation of the code. \n" +
	"  */\n"

/**
 * @static
 * Declare all method stubs on gui.Super instance.
 * @param {gui.Super} target
 * @param {object} proto
 */
gui.Super.stubAll = function ( target, proto ) {
	
	gui.Object.methods ( proto ).forEach ( function ( method ) {
		gui.Super.stubOne ( target, proto, method );
	}, this );
};

/**
 * @static
 * Declare single method stub on gui.Super instance.
 * @param {gui.Super} target
 * @param {object} proto
 * @param {String} method Name of the method
 */
gui.Super.stubOne = function ( target, proto, method ) {
	
	var func = target [ method ] = function () {
		return proto [ method ].apply ( gui.Super.subject, arguments );
	};
	func.displayName = method;
};

/**
 * @static
 * Stamp all properties from object onto prototype while overloading methods.
 * @param {function} superconstructor
 * @param {function} constructor
 * @param {object} object
 */
gui.Super.stamp = function ( superconstructor, constructor, object ) {
	
	"use strict";
	
	var prop = null, proto = constructor.prototype;
	
	if ( gui.Type.isObject ( object )) {
		Object.keys ( object ).forEach ( function ( key ) {
			prop = Object.getOwnPropertyDescriptor ( object, key );
			switch ( gui.Type.of ( prop.value )) {
				
				case "function" : // inject _super support into method type properties.
					if ( !gui.Type.isConstructor ( prop.value )) {
						prop = gui.Super._function ( object, key, prop, superconstructor );
					}
					break;
					
				case "object" : // setup getter-and-setter type declarations
					var o = prop.value;
					if ( o.get || o.set ) {
						if ( Object.keys ( o ).every ( function ( k ) {
							return k === "get" || k === "set";
						})) {
							prop = gui.Super._property ( key, o, constructor );
						}
					}
					break;
				
			}
			
			// stamp the property
			Object.defineProperty ( proto, key, prop );
			
			// methods specials
			// TODO: not like this! If *not* a function, the property will now be accessed and fire the getter function we just declared!

			/*
			if ( gui.Type.isFunction ( proto [ key ])) {

				// update console display name (TODO: does it work?)
				Object.defineProperty ( proto [ key ], "displayName", {
					enumerable : false,
					configurable : true,
					get : function () {
						return key;
					}
				});

				// normalize toString() for debugging
				// TODO: Find the hat char for that regexp
				proto [ key ].toString = function () {
					var tostring = object [ key ].toString ();
					tostring = tostring.replace ( /\t/g, "  " );
					return gui.Super.disclaimer + tostring;
				}
			}
			*/

	  });
	}
};

/**
 * @static 
 * Compute property descriptor for function type definition.
 * @param {object} object
 * @param {String} key
 * @param {object} prop
 * @param {function} superconstructor
 * @returns {object}
 */
gui.Super._function = function ( object, key, prop, superconstructor ) {
	
	if ( !prop.value.__data__ ) { // TODO: hmm...................................... !!!
		prop.value = function () {
			
			var sub = gui.Super.subject;
			var was = gui.Super.sandbox;
			
			gui.Super.subject = this;
			gui.Super.sandbox = ( was === false && this.sandboxed === true );
			
			this._super = superconstructor.__super__;
			var result = object [ key ].apply ( this, arguments );
			
			gui.Super.subject = sub;
			gui.Super.sandbox = was;
			
			return result;
			
			// return ( gui.Super.sandbox ? gui.SandBox.censor ( result, key ) : result );
		};
	}
	return prop;
};

/**
 * @static
 * Compute property descriptor for getter-setter type definition.
 * @param {String} key
 * @param {object} o
 * @param {function} constructor
 * @returns {object}
 */
gui.Super._property = function ( key, o, constructor ) {

	"use strict";
	
	[ "get", "set" ].forEach ( function ( what ) {
		var d, p = constructor.prototype;
		while ( p && !gui.Type.isDefined ( o [ what ])) {
			p = Object.getPrototypeOf ( p );
			d = Object.getOwnPropertyDescriptor ( p, key );
			if ( d ) {
				o [ what ] = d [ what ];
				/*
				o [ what ] = function () {
					alert ( "TODO: sandbox" );
					return d [ what ].call ( this );
				};
				*/
			}
		}
	});
	
	return {
		enumerable : true,
		configurable : true,
		get : o.get || function () {
			throw new Error ( constructor + " Getting a property that has only a setter: " + key );
		},
		set : o.set || function () {
			throw new Error ( constructor + " Setting a property that has only a getter: " + key );
		}
	};
};