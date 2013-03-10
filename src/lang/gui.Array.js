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
	}
}