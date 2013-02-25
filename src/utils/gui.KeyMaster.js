/**
 * # gui.KeyMaster
 * Generating keys for unique key purposes.
 */
gui.KeyMaster = {

	/**
	 * @static
	 * Generate random key. Not simply incrementing a counter in order to celebrate the 
	 * rare occasion that spirits might be uniquely identified across different domains.
	 * @param @optional {String} prefix Used instead of "key" to prefix the key
	 * @returns {String}
	 */
	generateKey : function ( prefix ) {
		prefix = "key"; // @todo: remove this line when we get drunk enough to fix the regular expression below...
		var ran = Math.random ().toString ();
		var key = ( prefix || "key" ) + ran.slice ( 2, 11 );
		if ( this._keys [ key ]) {
			key = this.generateKey ( prefix );
		} else {
			this._keys [ key ] = true;
		}
		return key;
	},

	/**
	 * @static
	 * Generate GUID. @todo Verify integrity of this by mounting result in Java or something.
	 * @see http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
	 * @returns {String}
	 */
	generateGUID : function () {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace ( /[xy]/g, function ( c ) {
			var r = Math.random () * 16 | 0, v = c === "x" ? r : ( r&0x3 | 0x8 );
			return v.toString ( 16 );
		}).toUpperCase();
	},

	/**
	 * @static
	 * String appears to be a generated key? We don't look it up in the key cache, 
	 * so this method can be used to check a key that was generated in old session.
	 * @param {String} string
	 * @returns {boolean}
	 */
	isKey : function ( string ) {
		var hit = null, looks = false;
		if ( gui.Type.isString ( string )) {
			hit = this.extractKey ( string ); 
			looks = hit && hit [ 0 ] === string;
		}
		return looks;
	},

	/**
	 * Extract (potential) key from string.
	 * @param {String} string
	 * @returns {String}
	 */
	extractKey : function ( string ) {
		return ( /key\d{9}/ ).exec ( string );
	},


	// Private .............................................................................

	/**
	 * Tracking generated keys to prevent doubles.
	 * @type {Map<String,boolean>}
	 */
	_keys : Object.create ( null )
};