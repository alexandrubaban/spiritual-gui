/**
 * Det er bare super.
 * @param {function} C
 */
gui.Super = function Super ( C ) {
	gui.Super.generateStubs ( this, C.prototype );
};

gui.Super.prototype = Object.create ( null );

/*
( function () {
	var subject = null;
	gui.Super.decorate = function ( func, SuperC ) {
		return function () {
			var sub = subject;
			subject = this;
			this._super = SuperC.__super__;
			alert ( func )
			var result = func.apply ( this, arguments );
			subject = sub;
			return result;
		}
	}
	gui.Super.__subject__ = subject;
}());
*/

// Static .......................................................................

gui.Object.each ({ // generating static methods

	/**
	 * Instance of gui.Class which is now invoking _super()
	 * @type {object}
	 */
	__subject__ : null,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[function gui.Super]";
	},

	/**
	 * Declare all method stubs on {gui.Super} instance.
	 * @param {gui.Super} instance
	 * @param {object} proto
	 */
	generateStubs : function ( instance, proto ) {
		gui.Object.methods ( proto ).forEach ( function ( method ) {
			gui.Super.generateStub ( instance, proto, method );
		}, this );
	},

	/**
	 * Declare single method stub on {gui.Super} instance.
	 * @param {gui.Super} instance
	 * @param {object} proto
	 * @param {String} name Method name
	 */
	generateStub : function ( instance, proto, name ) {
		var func = instance [ name ] = function () {
			return proto [ name ].apply ( gui.Super.__subject__, arguments );
		};
		func.displayName = name;
	},

	/*
	stamp_xxx : function ( SuperC, C, protos ) {
		var proto = C.prototype;
		gui.Object.each ( protos, function ( key, value ) {
			if ( gui.Type.isMethod ( value )) {
				proto [ key ] = this.decorate ( value, SuperC );
			}
		}, this );
	},
	*/

	/**
	 * Stamp all properties from object onto prototype while overloading methods.
	 * @param {function} SuperC
	 * @param {function} C
	 * @param {object} object
	 */
	stamp : function ( SuperC, C, object ) {
		"use strict";

		// this.stamp_xxx ( SuperC, C, object );

		var prop = null, proto = C.prototype;
		if ( gui.Type.isObject ( object )) {
			Object.keys ( object ).forEach ( function ( key ) {
				prop = Object.getOwnPropertyDescriptor ( object, key );
				if ( gui.Type.isMethod ( prop.value )) {
					prop = gui.Super._function ( object, key, prop, SuperC );
					// prop = null;
				} else if ( gui.Type.isObject ( prop.value )) {
					var o = prop.value;
					if ( o.getter || o.setter ) {
						if ( Object.keys ( o ).every ( function ( k ) {
							return k === "getter" || k === "setter";
						})) {
							prop = gui.Super._property ( key, o, C );
						}
					}
				}
				// stamp the property
				if ( prop ) {
					Object.defineProperty ( proto, key, prop );
					// methods specials
					// @todo not like this! If *not* a function, the property will 
					// now be accessed and fire the getter function we just declared!
					if ( gui.Type.isFunction ( proto [ key ])) {
						// update console display name (@todo does it work?)
						Object.defineProperty ( proto [ key ], "displayName", {
							enumerable : false,
							configurable : true,
							get : function () {
								return key;
							}
						});
						// normalize toString() for debugging
						// @todo Find the hat char for that regexp
						proto [ key ].toString = function () {
							var tostring = object [ key ].toString ();
							tostring = tostring.replace ( /\t/g, "  " );
							return gui.Super._DISCLAIMER + tostring;
						};
					}
				}
		  });
		}
	},


	// Private static .......................................................

	/**
	 * Prepended to the result of calling 
	 * toString() on a modified function.
	 * @type {String}
	 */
	_DISCLAIMER : "/**\n" +
		"  * Method was overloaded by the framework. \n" +
		"  * This is an approximation of the code :) \n" +
		"  */\n",

	/**
	 * Compute property descriptor for function type definition.
	 * @param {object} object
	 * @param {String} key
	 * @param {object} prop
	 * @param {function} SuperC
	 * @returns {object}
	 */
	_function : function ( object, key, prop, SuperC ) {
		if ( !prop.value.__data__ ) { // @todo hmm...
			prop.value = function () {
				var sub = gui.Super.__subject__;
				gui.Super.__subject__ = this;
				this._super = SuperC.__super__;
				var result = object [ key ].apply ( this, arguments );
				gui.Super.__subject__ = sub;
				return result;
			};
		}
		return prop;
	},

	 /**
	 * Compute property descriptor for getter-setter type definition.
	 * @param {String} key
	 * @param {object} o
	 * @param {function} C
	 * @returns {object}
	 */
	_property : function ( key, o, C ) {
		"use strict";
		[ "getter", "setter" ].forEach ( function ( what ) {
			var d, p = C.prototype;
			while ( p && !gui.Type.isDefined ( o [ what ])) {
				p = Object.getPrototypeOf ( p );
				d = Object.getOwnPropertyDescriptor ( p, key );
				if ( d ) {
					o [ what ] = d [ what === "getter" ? "get" : "set" ];
				}
			}
		});
		return {
			enumerable : true,
			configurable : true,
			get : o.getter || function () {
				throw new Error ( C + " Getting a property that has only a setter: " + key );
			},
			set : o.setter || function () {
				throw new Error ( C + " Setting a property that has only a getter: " + key );
			}
		};
	}

}, function ( name, value ) {
	gui.Super [ name ] = value;
});