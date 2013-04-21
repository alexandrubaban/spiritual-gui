/**
 * Working with objects.
 */
gui.Object = {

	/**
	 * Convenient facade for Object.create to default all the property descriptors. 
	 * @see http://wiki.ecmascript.org/doku.php?id=strawman:define_properties_operator
	 * @param {object} proto
	 * @param {object} props
	 */
	create : function ( proto, props ) {
		var resolved = Object.create ( null );
		Object.keys ( props ).forEach ( function ( prop ) {
			resolved [ prop ] = {
				value : props [ prop ],
				writable : true,
				enumerable : true,
				configurable : true
			};
		});
		return Object.create ( proto, resolved );
	},

	/**
	 * Extend target with source properties *excluding* prototype stuff. 
	 * Optional parameter 'loose' to skips properties already declared.
	 * @TODO bypass mixin?
	 * @param {object} target
	 * @param {object} source
	 * @param @optional {boolean} loose Skip properties already declared
	 * @returns {object}
	 */
	extend : function ( target, source, loose ) {
		Object.keys ( source ).forEach ( function ( name ) {
			if ( !loose || !gui.Type.isDefined ( target [ name ])) {
				var desc = Object.getOwnPropertyDescriptor ( source, name );
				Object.defineProperty ( target, name, desc );
			}
    });
    return target;
  },

  /**
   * Extend target with source properties, 
   * skipping everything already declared.
   * @param {object} target
	 * @param {object} source
	 * @returns {object}
   */
  extendmissing : function ( target, source ) {
		return this.extend ( target, source, true );
  },

  /**
   * Mixin something with collision detection.
   * @TODO bypass extend?
   * @param {object]} target
   * @param {String} key
   * @param {object} value
   * @param {boolean} override
   * @returns {object}
   */
  mixin : function ( target, key, value, override ) {
		if ( !gui.Type.isDefined ( target [ key ]) || override ) {
			target [ key ] = value; // @TODO: warning when target is gui.Class (super support)
		} else {
			console.error ( "Mixin naming collision in " + target + ": " + key );
		}
		return target;
	},

  /**
   * Copy object.
   * @returns {object}
   */
  copy : function ( source ) {
		return this.extend ( Object.create ( null ), source );
  },

  /**
	 * Call function for each own key in object (exluding the prototype stuff) 
	 * with key and value as arguments. Returns array of function call results.
	 * @param {object} object
	 * @param {function} func
	 * @param @optional {object} thisp
	 */
	each : function ( object, func, thisp ) {
		return Object.keys ( object ).map ( function ( key ) {
			return func.call ( thisp, key, object [ key ]);
		});
	},

	 /**
	 * Call function for all properties in object (including prototype stuff) 
	 * with key and value as arguments. Returns array of function call results.
	 * @param {object} object
	 * @param {function} func
	 * @param @optional {object} thisp
	 */
	all : function ( object, func, thisp ) {
		var res = [];
		for ( var key in object ) {
			res.push ( func.call ( thisp, key, object [ key ]));
		}
		return res;
	},

	/**
	 * Lookup object for string of type "my.ns.Thing" in given context. 
	 * @param {String} opath Object path eg. "my.ns.Thing"
	 * @param {Window} context
	 * @returns {object}
	 */
	lookup : function ( opath, context ) {
		var result, struct = context;
		if ( !opath.contains ( "." )) {
			result = struct [ opath ];
		} else {
			var parts = opath.split ( "." );
			parts.forEach ( function ( part ) {
				struct = struct [ part ];
			});
			result = struct;
		}
		return result;
	},

	/**
	 * Update property of object in given context based on string input.
	 * @param {String} opath Object path eg. "my.ns.Thing.name"
	 * @param {object} value Property value eg. "Johnson"
	 * @param {Window} context
	 * @returns {object}
	 */
	assert : function ( opath, value, context ) {
		var prop, struct = context;
		if ( opath.contains ( "." )) {
			var parts = opath.split ( "." );
			prop = parts.pop ();
			parts.forEach ( function ( part ) {
				struct = struct [ part ];
			});
		} else {
			prop = opath;
		}
		struct [ prop ] = value;
		return struct;
	},

	/**
	 * List names of invocable methods *including* prototype stuff.
	 * @return {Array<String>}
	 */
	methods : function ( object ) {
		var result = [];
		for ( var def in object ) {
			if ( gui.Type.isMethod ( object [ def ])) {
				result.push ( def );
			}
		}
		return result;
	},

	/**
	 * List names of non-method properties *including* prototype stuff.
	 * @return {Array<String>}
	 */
	nonmethods : function ( object ) {
		var result = [];
		for ( var def in object ) {
			if ( !gui.Type.isFunction ( object [ def ])) {
				result.push ( def );
			}
		}
		return result;
	},

	/**
	 * Convert array-like object to array. Always returns an array.
	 * @param {object} object
	 * @returns {Array<object>}
	 */
	toArray : function ( object ) {
		var result = [];
		if ( gui.Type.isArray ( object )) {
			result = object;
		} else {
			try {
				if ( gui.Type.isDefined ( object.length ) && ( "0" in Object ( object ))) {
					result = Array.map ( object, function ( thing ) {
						return thing;
					});
				}
			} catch ( exception ) {}
	  }
		return result;
	}
};