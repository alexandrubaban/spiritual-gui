/**
 * Working with arrays.
 */
gui.Array = {

	/**
	 * Initialize fresh array with a variable number of 
	 * arguments regardless of number or type of argument.
	 * http://wiki.ecmascript.org/doku.php?id=strawman:array_extras
	 * @returns {Array}
	 */
	of : ( function () {
		return ( Array.of ) || function () {
			return Array.prototype.slice.call ( arguments );
		};
	}()),

	/**
	 * Converts a single argument that is an array-like object or list into a fresh array.
	 * https://gist.github.com/rwaldron/1074126
	 * @param {object} arg
	 * @return {Array}
	 */
	from : ( function () {
		return ( Array.from ) || function ( arg ) {
			var array = [];
			var object = Object ( arg );
			var len = object.length >>> 0;
			var i = 0;
			while ( i < len ) {
				if ( i in object ) {
					array [ i ] = object [ i ];
				}
				i ++;
			}
			return array;
		};
	})(),

	/**
	 * Resolve single argument into an array with one or more 
	 * entries with special handling of single string argument:
	 * 
	 * 1. Strings to be split at spaces into an array
	 * 3. Arrays are converted to a similar but fresh array
	 * 2. Array-like objects transformed into real arrays. 
	 * 3. Other objects are pushed into a one entry array.
	 *
	 * @param {object} arg
	 * @returns {Array} Always return an array
	 */
	make : function ( arg ) {
		switch ( gui.Type.of ( arg )) {
			case "string" :
				return arg.split ( " " );
			case "array" :
				return this.from ( arg );
			default :
				return this.of ( arg );
		}
	},

	/**
	 * Remove array member(s) by index (given numbers) or reference (given elsewhat).
	 * @see http://ejohn.org/blog/javascript-array-remove/#comment-296114
	 * @todo Handle strings and handle the `to` argument
	 * @param {Array} array
	 * @param {number|object} from
	 * @param {number|object} to
	 * @returns {number} new length
	 */
	remove : function ( array, from, to ) {
		if ( isNaN ( from )) {
			return this.remove ( array, 
				array.indexOf ( from ), 
				array.indexOf ( to )
			);
		} else {
			array.splice ( from, !to || 1 + to - from + ( ! ( to < 0 ^ from >= 0 ) && ( to < 0 || -1 ) * array.length ));
			return array.length;
		}
	}
};