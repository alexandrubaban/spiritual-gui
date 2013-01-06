/**
 * Position.
 * @param {number} x
 * @param {number} y
 */
gui.Position = function ( x, y ) {

	this.x = x ? x : 0;
	this.y = y ? y : 0;
};

gui.Position.prototype = {
	
	/**
	 * X position.
	 * @type {number}
	 */
	x : 0,
	
	/**
	 * Y position.
	 * @type {number}
	 */
	y : 0,
	
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		
		return "[object gui.Position(" + this.x + "," + this.y + ")]";
	},
	
	/**
	 * Clone position.
	 * @returns {gui.Position}
	 */
	clone : function () {
		
		return new gui.Position ( this.x, this.y );
	}
};


// STATICS .............................................................

/**
 * Compare two positions.
 * @param {gui.Position} p1
 * @param {gui.Position} p2
 * @return {boolean}
 */
gui.Position.isEqual = function ( p1, p2 ) {
	
	return ( p1.x === p2.x ) && ( p1.y === p2.y );
};