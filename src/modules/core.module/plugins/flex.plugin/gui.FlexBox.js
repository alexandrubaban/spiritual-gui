/**
 * Wraps a flexbox container element.
 * @param {Element} elm
 */
gui.FlexBox = function FlexBox ( elm ) {
	this.element = elm;
	this.spirit = elm.spirit;
	this.children = gui.Object.toArray ( elm.children );
	this.equalheight = this._hasclass ( "equalheight" );
	if ( this._hasclass ( "vertical" )) {
		this.orient = "vertical";
	}
};

gui.FlexBox.prototype = {

	/**
	 * Flexbox container.
	 * @type {Element}
	 */
	element : null,

	/**
	 * Flexed children.
	 * @type {Array<Element>}
	 */
	children : null,

	/**
	 * Matches horizontal|vertical.
	 * @type {String}
	 */
	orient : "horizontal",

	/**
	 *
	 */
	equalheight : false,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.FlexBox]";
	},

	/**
	 * Flex children.
	 */
	flexchildren : function () {
		var flexes = this._childflexes ();
		var factor = this._computefactor ( flexes );
		if ( flexes.length ) {
			var unit = 100 / flexes.reduce ( function ( a, b ) {
				return a + b;
			});
			this.children.forEach ( function ( child, i ) {
				if ( flexes [ i ] > 0 ) {
					this._setratio ( child, flexes [ i ], unit, factor );
				}
			},this);
			if ( this.equalheight ) {
				this._equalheight ();
			}
		}
	},


	// Private ................................................................
	 
	/**
	 * Collect child flexes. Unflexed members count as 0.
	 * @return {Array<number>}
	 */
	_childflexes : function () {
		return this.children.map ( function ( child ) {
			return this._getflex ( child );
		},this);
	},

	/**
	 * Get flex value for element. We use the flexN classname to indicate this.
	 * @param {Element} elm
	 * @return {number}
	 */
	_getflex : function ( elm ) {
		var flex = 0;
		elm.className.split ( " ").forEach ( function ( name ) {
			if ( gui.FlexBox._FLEXNAME.test ( name ) && name !== "flexbox" ) { // @TODO regexp to exlude!
				flex = ( gui.FlexBox._FLEXRATE.exec ( name ) || 1 );
			}
		});
		return gui.Type.cast ( flex );
	},

	/**
	 * Get modifier for percentage widths, 
	 * accounting for fixed width members.
	 * @param {<Array<number>} flexes
	 * @return {number} Between 0 and 1
	 */
	_computefactor : function ( flexes ) {
		var all, cut, factor = 1;
		if ( flexes.indexOf ( 0 ) >-1 ) {
			all = cut = this._getoffset ();
			this.children.forEach ( function ( child, i ) {
				cut -= flexes [ i ] ? 0 : this._getoffset ( child );
			}, this );
			factor = cut / all;
		}
		return factor;
	},

	/**
	 * Get width or height of element (depending on flexbox orientation).
	 * @param @optional {Element} elm Omit for flexbox container element.
	 * @returns {number} Offset in pixels
	 */
	_getoffset : function ( elm ) {
		elm = elm || this.element;
		return this.orient === "horizontal" ? 
			elm.offsetWidth :
			elm.offsetHeight;
	},

	/**
	 * Set percentage width|height of element.
	 * @param {Element} elm
	 * @param {number} flex
	 * @param {number} unit
	 * @param {number} factor
	 */
	_setratio : function ( elm, flex, unit, factor ) {
		var prop = this.orient === "horizontal" ? "width" : "height";
		elm.style [ prop ] = flex * unit * factor + "%";
	},

	/**
	 * Equalheight (horizontal) children. 
	 * @TODO: Make it configurable? Use min-height instead?
	 */
	_equalheight : function () {
		var off = 0, max = 0;
		this.children.forEach(function ( child ){
			child.style.height = "auto"; // while we measure...
			off = child.offsetHeight;
			max = off > max ? off : max;
		});
		this.children.forEach ( function ( child ) {
			child.style.height = max + "px";
		});
	},

	/**
	 * Has classname? Using "horizontal", "vertical", "maxheight" and "equalheight"
	 * @param {String} name
	 * @returns {String}
	 */
	_hasclass : function ( name ) {
		return gui.CSSPlugin.contains ( this.element, name );
	}
};


// Static ............................................................

/**
 * Check for flexN classname.
 * @todo don't match "flexbox"
 * @type {RegExp}
 */
gui.FlexBox._FLEXNAME = /flex\d*/;

/**
 * Extract N from classname.
 * @type {RegExp}
 */
gui.FlexBox._FLEXRATE = /\d/;