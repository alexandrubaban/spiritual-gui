/**
 * @class
 * From Raganwalds "Method Combinators".
 * @see https://github.com/raganwald/method-combinators/blob/master/README-JS.md
 * @see https://github.com/raganwald/homoiconic/blob/master/2012/09/precondition-and-postcondition.md
 */
gui.Combinator = {

	/**
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
	 * @param {function} decoration
	 * @returns {function}
	 */
	after : function ( decoration ) {
		return function ( base ) {
			return function () {
				var __value__ = base.apply ( this, arguments );
				decoration.apply ( this, arguments );
				return __value__;
			};
		};
	},

	/**
	 * @param {function} decoration
	 * @returns {function}
	 */
	around : function ( decoration ) {
		return function ( base ) {
			return function () {
				var argv, callback, __value__, that = this, slice = gui.Combinator.__slice;
				argv = 1 <= arguments.length ? slice.call ( arguments, 0 ) : [];
				__value__ = void 0;
				callback = function () {
					return __value__ = base.apply ( that, argv );
				};
				decoration.apply ( this, [ callback ].concat ( argv ));
				return __value__;
			};
		};
	},

	/**
	 * Note that we added support for an "otherwise" function as the second argument.
	 * @param {function} condition
	 */
	provided : function ( condition ){
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


	// PRIVATES ..........................................................

	__slice : [].slice

};