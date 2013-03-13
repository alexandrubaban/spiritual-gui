/**
 * Working with arrays.
 */
gui.Array = {

	/**
	 * Remove array member(s) by index.
	 * @see http://ejohn.org/blog/javascript-array-remove/#comment-296114
	 * @param {Array} array
	 * @param {number} from
	 * @param {number} to
	 * @returns {number} new length
	 */
	remove : function ( array, from, to ) {
		array.splice ( from, !to || 1 + to - from + ( ! ( to < 0 ^ from >= 0 ) && ( to < 0 || -1 ) * array.length ));
		return array.length;
	},

	/**
	 * Resolve single argument into an array with one or more 
	 * entries. Mostly because we use this setup quite often.
	 * 
	 * 1. Strings to be split at spaces. 
	 * 2. Array-like objects transformed to real arrays. 
	 * 3. Other objects are pushed into a one entry array.
	 * 
	 * @see {gui.Object#toArray} for array-like conversion
	 * @param {object} arg
	 * @returns {Array<object>} Always returns an array
	 */
	toArray : function ( arg ) {
		var list;
		switch ( gui.Type.of ( arg )) {
			case "array" :
				list = arg;
				break;
			case "string" :
				list = arg.split ( " " );
				break;
			default :
				list = gui.Object.toArray ( arg );
				break;
		}
		return list.length ? list : [ arg ];
	}
};