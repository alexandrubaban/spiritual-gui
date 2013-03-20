/**
 * Wraps a flexbox child element.
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
			if ( gui.FlexChild._FLEXNAME.test ( name ) && name !== "flexbox" ) { // @TODO regexp to exlude!
				flex = ( gui.FlexChild._FLEXRATE.exec ( name ) || 1 );
			}
		});
		return gui.Type.cast ( flex );
	},

	/**
	 * Get width or height of element depending on flexbox orientation.
	 * @param {String} orient
	 * @returns {number} Offset in pixels
	 */
	getoffset : function ( orient ) {
		var elm = this._element;
		if ( orient === "horizontal" ) {
			return elm.offsetWidth;
		} else {
			return elm.offsetHeight;
		}
	},

	/**
	 * Set percentage width|height of element.
	 * @param {number} flex
	 * @param {number} unit
	 * @param {number} factor
	 * @param {String} orient
	 */
	setoffset : function ( pct, orient ) {
		var line = orient === "horizontal";
		var prop = line ? "width" : "height";
		//var span = this._fit ( pct, orient );
		//this._element.style [ prop ] = span;
		this._element.style [ prop ] = pct + "%";
	},

	/**
	 * @param {number} pct
	 * @param {String} orient
	 *
	_fit : function ( pct, orient ) {
		if ( orient === "horizontal" ) {
			var above = this._element.parentNode;
			var avail = above.offsetWidth;
			var width = this.getdefaultoffset ( orient );
			if ( width > pct * 0.01 * avail ) {
				alert ( "?" )
				return width + "px";
			}
		}
		return pct + "%";
	},

	/**
	 * Get default height when equalheighting horizontal children.
	 * @returns {number} Unmanaged height in pixels.
	 *
	getdefaultoffset : function ( orient ) {
		var elm = this._element;
		if ( orient === "vertical" ) {
			elm.style.height = "auto";
			return elm.offsetHeight;
		} else {
			elm.style.width = "auto";
			return elm.offsetWidth;
		}
	},

	/**
	 * Set height when equalheighting horizontal children.
	 * @param {number} height
	 *
	setheight : function ( height ) {
		this._element.style.height = height + "px";
	},
	*/


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
 * @todo don't match "flexbox"
 * @type {RegExp}
 */
gui.FlexChild._FLEXNAME = /flex\d*/;

/**
 * Extract N from classname.
 * @type {RegExp}
 */
gui.FlexChild._FLEXRATE = /\d/;