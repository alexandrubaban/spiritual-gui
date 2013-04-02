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
	 * Decorate object method before.
	 * @param {object} target
	 * @param {String} name
	 * @param {function} decorator
	 * @returns {object}
	 */
	decorateBefore : function ( target, name, decorator ) {
		return this._decorate ( "before", target, name, decorator );
	},

	/**
	 * Decorate object method after.
	 * @param {object} target
	 * @param {String} name
	 * @param {function} decorator
	 * @returns {object}
	 */
	decorateAfter : function ( target, name, decorator ) {
		return this._decorate ( "after", target, name, decorator );
	},

	/**
	 * @TODO Decorate object method around.
	 * @param {object} target
	 * @param {String} name
	 * @param {function} decorator
	 * @returns {object}
	 */
	decorateAround : function () {
		throw new Error ( "TODO" );
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
	},


	// Private ..................................................
	
	/**
	 * Decorate object method
	 * @param {String} position
	 * @param {object|function} target
	 * @param {String} name
	 * @param {function} decorator
	 * @returns {object}
	 */
	_decorate : gui.Arguments.confirmed ( "string", "object|function", "string", "function" ) ( 
		function ( position, target, name, decorator ) {
			var base = target [ name ];
			var deco = gui.Combo [ position ] ( decorator );
			if ( !this._decorated ( target, name, decorator )) {
				target [ name ] = deco ( function () {
					return base.apply ( this, arguments );
				});
			}
			return target;
		}
	),

	/**
	 * Method was already decorated with something that looks 
	 * somewhat identical? We need this to bypass a setup where 
	 * modules in shared frames would redecorate stuff on init.
	 * @param {object|function} target
	 * @param {String} name
	 * @param {function} decorator
	 * @returns {boolean}
	 */
	_decorated : function ( target, name, decorator ) {
		var result = true;
		var string = decorator.toString ();
		var decoed = target.__decorators__ || ( function () {
			return ( target.__decorators__ = Object.create ( null ));
		}());
		if (( result = decoed [ name ] !== string )) {
			decoed [ name ] = string;
		}
		return result;
	}

};