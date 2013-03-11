/**
 * Getters and setters stuff.
 */
gui.Accessor = {
	
	/**
	 * @param {function} C gui.Class constructor
	 * @param {object} protos Prototype extensions
	 */
	support : function ( C, protos ) {
		this._accessors ( C.prototype, protos );
	},


	// Private ....................................................

	/**
	 * @param {object} proto
	 * @param {object} object
	 */
	_accessors : function ( proto, protos ) {
		Object.keys ( protos ).forEach ( function ( key ) {
			var desc = Object.getOwnPropertyDescriptor ( protos, key );
			desc = this._accessor ( proto, key, desc );
			Object.defineProperty ( proto, key, desc );
		}, this );
	},

	/**
	 * Hello.
	 * @param {object} proto
	 * @param {String} key
	 * @param {object} desc
	 * @returns {object}
	 */
	_accessor : function ( proto, key, desc ) {
		if ( gui.Type.isObject ( desc.value )) {
			var o = desc.value;
			if ( o.getter || o.setter ) {
				if ( Object.keys ( o ).every ( function ( k ) {
					return k === "getter" || k === "setter";
				})) {
					desc = this._activeaccessor ( key, o, proto );
				}
			}
		}
		return desc;
	},

	/**
	 * Compute property descriptor for getter-setter type definition.
	 * @param {String} key
	 * @param {object} o
	 * @param {function} C
	 * @returns {object}
	 */
	_activeaccessor : function ( key, o, proto ) {
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
				throw new Error ( this + " getting a property that has only a setter: " + key );
			},
			set : o.setter || function () {
				throw new Error ( this + " setting a property that has only a getter: " + key );
			}
		};
	},
}