/**
 * From Raganwalds "Method Combinators".
 * @see https://github.com/raganwald/method-combinators/blob/master/README-JS.md
 * @see https://github.com/raganwald/homoiconic/blob/master/2012/09/precondition-and-postcondition.md
 */
gui.Combo = { // @todo gui.Deco would perhaps fit better for some of these....

	/**
	 * Decorate before.
	 * @param {function} decoration
	 * @returns {function}
	 */
	before : function ( decoration ) {
		return function ( base ) {
			return function () {
				decoration.apply ( this, arguments );
				return base.apply ( this, arguments );
			};
		};
	},

	/**
	 * Decorate after.
	 * @param {function} decoration
	 * @returns {function}
	 */
	after : function ( decoration ) {
		return function ( base ) {
			return function () {
				var result = base.apply ( this, arguments );
				decoration.apply ( this, arguments );
				return result;
			};
		};
	},

	/**
	 * Decorate around.
	 * @param {function} decoration
	 * @returns {function}
	 */
	around : function ( decoration ) {
		return function ( base ) {
			return function () {
				var argv, callback, result, that = this, slice = gui.Combo._slice;
				argv = 1 <= arguments.length ? slice.call ( arguments, 0 ) : [];
				result = void 0;
				callback = function () {
					return result = base.apply ( that, argv );
				};
				decoration.apply ( this, [ callback ].concat ( argv ));
				return result;
			};
		};
	},

	/**
	 * Decorate provided. Note that we added support for an otherwise otherwise.
	 * @param {function} condition
	 */
	provided : function ( condition ) {
		return function ( base, otherwise ) {
			return function () {
				if ( condition.apply ( this, arguments )) {
					return base.apply ( this, arguments );
				} else if ( otherwise ) {
					return otherwise.apply ( this, arguments );
				}
			};
		};
	},

	/**
	 * Output the input.
	 * @param {object} subject
	 * @return {object}
	 */
	identity : function ( subject ) {
		return subject;
	},

	/**
	 * Make function return "this" if otherwise it would return undefined.
	 * @param {function} base
	 * @returns {function}
	 */
	chained : function ( base ) {
		return function () {
			var result = base.apply ( this, arguments );
			return result === undefined ? this : result;
		};
	},


	// Private ..........................................................

	/**
	 * Slice it once and for all.
	 * @type {function}
	 */
	_slice : [].slice
};