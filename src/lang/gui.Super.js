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
	_a : gui.Combo.before ( function ( SuperC ) {
		gui.Super.__superduper__ = SuperC.__super__;
	}),

	_b :	gui.Combo.around ( function ( base ) {
		var sub = gui.Super.__subject__;
		gui.Super.__subject__ = this;
		this._super = gui.Super__superduper__;
		var result = base ();
		gui.Super.__subject__ = sub;
		return result;
	}),
	*/

	/**
	 * Stamp all properties from object onto prototype while overloading methods.
	 * @param {function} SuperC
	 * @param {function} C
	 * @param {object} object
	 */
	stamp : function ( SuperC, C, protos ) {

		var decorate = gui.Combo.around ( function ( base ) {
			var sub = gui.Super.__subject__;
			gui.Super.__subject__ = this;
			this._super = SuperC.__super__;
			var result = base ();
			gui.Super.__subject__ = sub;
			return result;
		});

		var proto = C.prototype;
		gui.Object.each ( protos, function ( key, base ) {
			if ( gui.Type.isMethod ( base )) {
				proto [ key ] = decorate ( base );
				proto [ key ].toString = function () {
					var tostring = base.toString ();
					tostring = tostring.replace ( /\t/g, "  " );
					return gui.Super._DISCLAIMER + tostring;
				};
			} else {
				var prop = Object.getOwnPropertyDescriptor ( protos, key );
				if ( gui.Type.isObject ( prop.value )) {
					var o = prop.value;
					if ( o.getter || o.setter ) {
						if ( Object.keys ( o ).every ( function ( k ) {
							return k === "getter" || k === "setter";
						})) {
							prop = gui.Super._property ( key, o, C );
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