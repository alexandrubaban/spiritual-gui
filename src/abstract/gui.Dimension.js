/**
 * @class
 * Dimension.
 * @param {number} w
 * @param {number} h
 */
gui.Dimension = function ( w, h ) {

	this.w = w ? w : 0;
	this.h = h ? h : 0;
};

gui.Dimension.prototype = {
	
	/**
	 * Width.
	 * @type {number}
	 */
	w : 0,
	
	/**
	 * Height.
	 * @type {number}
	 */
	h : 0,
	
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		
		return "[object gui.Dimension(" + this.w + "," + this.h + ")]";
	}
};


// STATICS .............................................................

/**
 * Compare two dimensions.
 * @param {gui.Dimension} dim1
 * @param {gui.Dimension} dim2
 * @return {boolean}
 */
gui.Dimension.isEqual = function ( dim1, dim2 ) {
	
	return ( dim1.w === dim2.w ) && ( dim1.h === dim2.h );
};