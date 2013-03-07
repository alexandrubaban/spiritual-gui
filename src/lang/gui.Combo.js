/**
 * # gui.Combo
 * From Raganwalds "Method Combinators".
 * @see https://github.com/raganwald/method-combinators/blob/master/README-JS.md
 * @see https://github.com/raganwald/homoiconic/blob/master/2012/09/precondition-and-postcondition.md
 */
gui.Combo = {

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


	// Private ..........................................................

	/**
	 * Slice it once and for all.
	 * @type {function}
	 */
	_slice : [].slice
};