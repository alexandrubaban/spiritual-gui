/**
 * Det er bare super.
 * @param {function} C
 */
gui.Super = function Super ( C ) {
	gui.Super.generateStubs ( this, C.prototype );
};

gui.Super.prototype = Object.create ( null );


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
	 * @param {gui.Super} suber
	 * @param {object} proto
	 */
	generateStubs : function ( suber, proto ) {
		gui.Object.methods ( proto ).forEach ( function ( name ) {
			gui.Super.generateStub ( suber, proto, name );
		}, this );
	},

	/**
	 * Declare single method stub on {gui.Super} instance.
	 * @param {gui.Super} suber
	 * @param {object} proto
	 * @param {String} name Method name
	 */
	generateStub : function ( suber, proto, name ) {
		var func = suber [ name ] = function () {
			return proto [ name ].apply ( gui.Super.__subject__, arguments );
		};
		func.displayName = name;
	},

	/**
	 * Stamp all properties from protos onto prototype 
	 * while decorating methods for `_super` support.
	 * @param {function} SuperC
	 * @param {object} proto
	 * @param {object} object
	 */
	stamp : function ( SuperC, proto, protos ) {
		var combo = this._decorator ( SuperC );
		gui.Object.each ( protos, function ( key, base ) {
			if ( gui.Type.isMethod ( base )) {
				proto [ key ] = combo ( base );
				proto [ key ].toString = function () {
					original = base.toString ().replace ( /\t/g, "  " );
					return gui.Super._DISCLAIMER + original;
				};
			} else {
				var prop = Object.getOwnPropertyDescriptor ( protos, key );
				if ( gui.Type.isObject ( prop.value )) {
					var o = prop.value;
					if ( o.getter || o.setter ) {
						if ( Object.keys ( o ).every ( function ( k ) {
							return k === "getter" || k === "setter";
						})) {
							prop = gui.Super._property ( key, o, proto );
						}
					}
				}
				Object.defineProperty ( proto, key, prop );
			}
		}, this );
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
	 * Get tricky decorator.
	 * @param {function} SuperC
	 * @returns {function}
	 */
	_decorator : function ( SuperC ) {
		return function ( base ) {
			return function () {
				var sub = gui.Super.__subject__;
				gui.Super.__subject__ = this;
				this._super = SuperC.__super__;
				var result = base.apply ( this, arguments );
				gui.Super.__subject__ = sub;
				return result;
			};
		};
	},

	 /**
	 * Compute property descriptor for getter-setter type definition.
	 * @param {String} key
	 * @param {object} o
	 * @param {function} C
	 * @returns {object}
	 */
	_property : function ( key, o, proto ) {
		"use strict";
		[ "getter", "setter" ].forEach ( function ( what ) {
			var d;
			while ( proto && !gui.Type.isDefined ( o [ what ])) {
				proto = Object.getPrototypeOf ( proto );
				d = Object.getOwnPropertyDescriptor ( proto, key );
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