/**
 * Function argument type checking studio.
 */
gui.Arguments = {

	/**
	 * Forgiving arguments matcher. 
	 * Ignores action if no match.
	 */
	provided : function ( /* type1,type2,type3... */ ) {
		var types = gui.Object.toArray ( arguments );
		return function ( action ) {
			return function () {
				if ( gui.Arguments._match ( arguments, types )) {
					return action.apply ( this, arguments );
				}
			};
		};
	},

	/**
	 * Revengeful arguments validator. 
	 * Throws an exception if no match.
	 */
	confirmed : function ( /* type1,type2,type3... */ ) {
		var types = gui.Object.toArray ( arguments );
		return function ( action ) {
			return function () {
				if ( gui.Arguments._validate ( arguments, types )) {
					return action.apply ( this, arguments );
				}
			};
		};
	},


	// Private ...........................................................
	
	/**
	 * Validating mode?
	 * @type {boolean}
	 */
	_validating : false,

	/**
	 * Use this to check the runtime signature of a function call: 
	 * gui.Arguments.match ( arguments, "string", "number" ); 
	 * Note that some args may be omitted and still pass the test, 
	 * eg. the example would pass if only a single string was given. 
	 * Note that `gui.Type.of` may return different xbrowser results 
	 * for certain exotic objects. Use the pipe char to compensate: 
	 * gui.Arguments.match ( arguments, "window|domwindow" );
	 * @returns {boolean}
	 */
	_match : function ( args, types ) {
		return types.every ( function ( type, index ) {
			return this._matches ( type, args [ index ], index );
		}, this );
	},

	/**
	 * Strict type-checking facility to throw exceptions on failure. 
	 * @TODO at some point, return true unless in developement mode.
	 * @returns {boolean}
	 */
	_validate : function ( args, types ) {
		this._validating = true;
		var is = this._match ( args, types );
		this._validating = false;
		return is;
	},

	/**
	 * Extract expected type of (optional) argument.
	 * @param {string} xpect
	 * @param {boolean} optional
	 */
	_xtract : function ( xpect, optional ) {
		return optional ? xpect.slice ( 1, -1 ) : xpect;
	},

	/**
	 * Check if argument matches expected type.
	 * @param {string} xpect
	 * @param {object} arg
	 * @param {number} index
	 * @returns {boolean}
	 */
	_matches : function ( xpect, arg, index ) {
		var needs = !xpect.startsWith ( "(" );
		var split = this._xtract ( xpect, !needs ).split ( "|" );
		var input = gui.Type.of ( arg );
		var match = ( xpect === "*" 
			|| ( !needs && input === "undefined" ) 
			|| ( !needs && split.indexOf ( "*" ) >-1 ) 
			|| split.indexOf ( input ) >-1 );
		if ( !match && this._validating ) {
			this._error ( index, xpect, input );
		}
		return match;
	},

	/**
	 * Report validation error for argument at index.
	 * @param {number} index
	 * @param {string} xpect
	 * @param {string} input
	 */
	_error : function ( index, xpect, input ) {
		console.error ( 
			"Argument " + index + ": " + 
			"Expected " + xpect + 
			", got " + input
		);
	}
};