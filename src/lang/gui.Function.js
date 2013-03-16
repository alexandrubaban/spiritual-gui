/**
 * Working with functions.
 */
gui.Function = {

	/**
	 * Create named function.
	 * @see https://mail.mozilla.org/pipermail/es-discuss/2009-March/008954.html
	 * @see http://wiki.ecmascript.org/doku.php?id=strawman:name_property_of_functions
	 * @param @optional {String} name
	 * @param @optional {Array<String>} params
	 * @param @optional {String} body
	 * @param @optional {Window} context
	 * @returns {function}
	 */
	create : function ( name, params, body, context ) {
		var F = context ? context.Function : Function;
		name = this.safename ( name );
		params = params ? params.join ( "," ) : "";
		body = body || "";
		return new F (
			"return function " + name + " ( " + params + " ) {" +  body + "}"
		)();
	},

	/**
	 * Strip namespaces from name to create valid function name. 
	 * @TODO Return a safe name no matter what has been input.
	 * @param {String} name
	 * @return {String}
	 */
	safename : function ( name ) {
		if ( name && name.contains ( "." )) {
			name = name.split ( "." ).pop ();
		}
		return name || "";
	}

};