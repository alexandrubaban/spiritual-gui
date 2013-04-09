/**
 * Computer for flexbox child.
 * @param {Element} elm
 */
gui.FlexChild = function FlexChild ( elm ) {
	this._element = elm;
};

gui.FlexChild.prototype = {

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.FlexBox]";
	},

	/**
	 * Get flex value for element. We use the flexN classname to markup this.
	 * @returns {number}
	 */
	getflex : function ( elm ) {
		var flex = 0;
		this._element.className.split ( " ").forEach ( function ( name ) {
			if ( gui.FlexChild._FLEXNAME.test ( name )) { // @TODO regexp to exlude!
				flex = ( gui.FlexChild._FLEXRATE.exec ( name ) || 1 );
			}
		});
		return gui.Type.cast ( flex );
	},

	/**
	 * Get width or height of element depending on flexbox orientation.
	 * @param {boolean} vertical
	 * @returns {number} Offset in pixels
	 */
	getoffset : function ( vertical ) {
		var elm = this._element;
		if ( vertical ) {
			return elm.offsetHeight;
		} else {
			return elm.offsetWidth;
		}
	},

	/**
	 * Set percentage width|height of element.
	 * @param {number} pct
	 * @param {boolean} vertical
	 */
	setoffset : function ( pct, vertical ) {
		var prop = vertical ? "height" : "width";
		this._element.style [ prop ] = pct + "%";
	},

	unflex : function () {

	},

	/**
	 * Remove inline styles (also unrelated styles) to reset emulated flex.
	 */
	unstyle : function () {
		this._element.removeAttribute ( "style" );
	},


	// Private .........................................................
		
	/**
	 * Flexchild element.
	 * @type {Element}
	 */
	_element : null

};


// Static ............................................................

/**
 * Check for flexN classname.
 * @type {RegExp}
 */
gui.FlexChild._FLEXNAME = /^flex\d*$/;

/**
 * Extract N from classname (eg .flex23).
 * @type {RegExp}
 */
gui.FlexChild._FLEXRATE = /\d/;