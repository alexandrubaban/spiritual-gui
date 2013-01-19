/**
 * @class
 * Function argument type checking studio.
 */
gui.Arguments = {

	/**
	 * @static
	 * Use this to check the runtime signature of a function call: 
	 * gui.Arguments.match ( arguments, "string", "string", "number" );
	 * Note that some args may be omitted and still pass the test, 
	 * eg. the example would pass if only a single string was given. 
	 * @param {object} args Array-like 
	 * @returns {boolean}
	 */
	match : function () {
		
		/*
		 * Note that gui.Type.of may return different xbrowser results 
		 * for certain exotic objects. Use the pipe char to compensate: 
		 * gui.Arguments.match ( arguments, "xxx|yyy|zzz" );
		 */
		var list = Array.prototype.slice.call ( arguments );
		var args = list.shift ();

		if ( gui.Type.isArguments ( args )) {
			return list.every ( function ( test, index ) {
				return this._matches ( test, args [ index ], index );
			}, this );
		} else {
			throw new Error ( "Expected an Arguments object" );
		}
	},
	
	/**
	 * @static
	 * Strict type-checking facility to throw exceptions on failure. 
	 * @todo at some point, return true unless in developement mode.
	 * @param {object} args Array-like 
	 * @returns {boolean}
	 */
	validate : function () {

		// return true; // TODO!

		this._validate = true;
		var is = this.match.apply ( this, arguments );
		this._validate = false;
		return is;
	},


	// PRIVATE ...........................................................
	
	/*
	 * Validating mode?
	 * @type {boolean}
	 */
	_validate : false,

	/*
	 * Extract expected type of (optional) argument.
	 * @param {string} xpect
	 * @param {boolean} optional
	 */
	_xtract : function ( xpect, optional ) {

		return optional ? xpect.slice ( 1, -1 ) : xpect;
	},

	/*
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
		if ( !match && this._validate ) {
			this._error ( index, xpect, input );
		}
		return match;
	},

	/*
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