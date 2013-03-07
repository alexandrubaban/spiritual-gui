/**
 * Working with functions.
 */
gui.Function = {

	/**
	 * Create named function.
	 * @see https://mail.mozilla.org/pipermail/es-discuss/2009-March/008954.html
	 * @see http://wiki.ecmascript.org/doku.php?id=strawman:name_property_of_functions
	 * @param @optional {String} name
	 * @param @optional {Array<String>} args
	 * @param @optional {String} body
	 * @param @optional {Window} context
	 * @returns {function}
	 */
	create : function ( name, params, body, context ) {
		var F = context ? context.Function : Function;
		name = this._safe ( name );
		params = params ? params.join ( "," ) : "";
		body = body || "";
		return new F (
			"return function " + name + " ( " + params + " ) {" +  body + "}"
		)();
	},


	// Private ......................................................................

	/**
	 * Should someone file a namespaced function name...
	 * @param {String} name
	 * @return {String}
	 */
	_safe : function ( name ) {
		if ( name && name.contains ( "." )) {
			name = name.substring ( name.lastIndexOf ( "." ) + 1 );
		}
		return name || "";
	}

};