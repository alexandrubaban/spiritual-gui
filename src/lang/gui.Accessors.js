/**
 * Assisting {gui.Class} with property cloning plus getters and setters stuff.
 */
gui.Accessors = {
	
	/**
	 * Copy non-method properties from configuration object to class 
	 * prototype. Property will be modified to a getter or setter if:
	 * 
	 * 1) The property value is an object
	 * 2) It has only one or both properties "getter" and "setter"
	 * 3) These are both functions
	 * 
	 * @param {function} C gui.Class constructor
	 * @param {object} protos Prototype extensions
	 */
	support : function ( C, protos ) {
		this._accessors ( protos, C.prototype );
	},


	// Private .....................................................

	/**
	 * Copy properties from definitions object to function prototype.
	 * @param {object} protos Source
	 * @param {object} proto Target
	 */
	_accessors : function ( protos, proto ) {
		Object.keys ( protos ).forEach ( function ( key ) {
			var desc = Object.getOwnPropertyDescriptor ( protos, key );
			desc = this._accessor ( proto, key, desc );
			Object.defineProperty ( proto, key, desc );
		}, this );
	},

	/**
	 * Copy single property to function prototype.
	 * @param {object} proto
	 * @param {String} key
	 * @param {object} desc
	 * @returns {object}
	 */
	_accessor : function ( proto, key, desc ) {
		var val = desc.value;
		if ( gui.Type.isObject ( val )) {
			if ( val.getter || val.setter ) {
				if ( this._isactive ( val )) {
					desc = this._activeaccessor ( proto, key, val );
				}
			}
		}
		return desc;
	},

	/**
	 * Object is getter-setter definition?
	 * @param {object} obj
	 * @returns {boolean}
	 */
	_isactive : function ( obj ) {
		return Object.keys ( obj ).every ( function ( key ) {
			var is = false;
			switch ( key ) {
				case "getter" :
				case "setter" :
					is = gui.Type.isFunction ( obj [ key ]);
					break;
			}
			return is;
		});
	},

	/**
	 * Compute property descriptor for getter-setter 
	 * type definition and assign it to the prototype.
	 * @param {object} proto
	 * @param {String} key
	 * @param {object} def
	 * @returns {defect}
	 */
	_activeaccessor : function ( proto, key, def ) {
		var desc;
		[ "getter", "setter" ].forEach ( function ( name, set ) {
			while ( proto && !gui.Type.isDefined ( def [ name ])) {
				proto = Object.getPrototypeOf ( proto );
				desc = Object.getOwnPropertyDescriptor ( proto, key );
				if ( desc ) {
					def [ name ] = desc [ set ? "set" : "get" ];
				}
			}
		});
		return {
			enumerable : true,
			configurable : true,
			get : def.getter || this._NOGETTER,
			set : def.setter || this._NOSETTER
		};
	},

	/**
	 * Bad getter.
	 */
	_NOGETTER : function () {
		throw new Error ( "Getting a property that has only a setter" );
	},

	/**
	 * Bad setter.
	 */
	_NOSETTER : function () {
		throw new Error ( "Setting a property that has only a getter" );
	}
};