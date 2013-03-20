/**
 * Wraps a flexbox container element.
 * @param {Element} elm
 */
gui.FlexBox = function FlexBox ( elm ) {
	this._onconstruct ( elm );
};

gui.FlexBox.prototype = {

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.FlexBox]";
	},

	/**
	 * Flex everything.
	 */
	flex : function () {
		this._flexself ();
		this._flexchildren ();
		/*
		if ( this._orient === "horizontal" ) {
			this._equalheight ();
		}
		*/
	},


	// Private ................................................................
	
	/**
	 * Flexbox element.
	 * @type {Element}
	 */
	_element : null,

	/**
	 * Flexed children.
	 * @type {Array<Element>}
	 */
	_children : null,

	/**
	 * Matches horizontal|vertical.
	 * @type {String}
	 */
	_orient : "horizontal",

	/**
	 * Constructor.
	 * @param {Element} elm
	 */
	_onconstruct : function ( elm ) {
		this._element = elm;
		this._children = Array.map ( elm.children, function ( child ) {
			return new gui.FlexChild ( child );
		});
		if ( this._hasclass ( "vertical" )) {
			this._orient = "vertical";
		}
	},
	
	/**
	 * Flex the container.
	 */
	_flexself : function () {
		if ( true ) { // @TODO only if not @class="flexN"
			switch ( this._orient ) {
				case "vertical" :
					var above = this._element.parentNode;
					var avail = above.offsetHeight;
					var style = this._element.style;
					style.height = "auto";
					if ( this._element.offsetHeight < avail ) {
						style.height = "100%"; //avail + "px";
					}
					break;
			}
		}
	},

	/**
	 * Flex the children.
	 */
	_flexchildren : function () {
		var flexes = this._childflexes ();
		var factor = this._computefactor ( flexes );
		if ( flexes.length ) {
			var unit = 100 / flexes.reduce ( function ( a, b ) {
				return a + b;
			});
			this._children.forEach ( function ( child, i ) {
				if ( flexes [ i ] > 0 ) {
					var percentage = flexes [ i ] * unit * factor;
					child.setoffset ( percentage, this._orient );
				}
			},this);
		}
	},
	 
	/**
	 * Collect child flexes. Unflexed members enter as 0.
	 * @return {Array<number>}
	 */
	_childflexes : function () {
		return this._children.map ( function ( child ) {
			return child.getflex ();
		},this);
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
			this._children.forEach ( function ( child, i ) {
				cut -= flexes [ i ] ? 0 : child.getoffset ( this._orient );
			}, this );
			factor = cut / all;
		}
		return factor;
	},

	/**
	 * Get width or height of element (depending on flexbox orientation).
	 * @returns {number} Offset in pixels
	 */
	_getoffset : function () {
		var elm = this._element;
		if ( this._orient === "horizontal" ) {
			return elm.offsetWidth;
		} else {
			return elm.offsetHeight;
		}
	},

	/**
	 * Equalheight (horizontal) children. 
	 * @TODO: Make it configurable? Use min-height instead?
	 *
	_equalheight : function () {
		var off = 0, max = 0;
		this._children.forEach(function ( child ){
			off = child.getdefaultoffset ( "vertical" );
			max = off > max ? off : max;
		});
		this._children.forEach ( function ( child ) {
			child.setheight ( max );
		});
	},
	*/

	/**
	 * Has classname? Using "horizontal", "vertical", "maxheight" and "equalheight"
	 * @param {String} name
	 * @returns {String}
	 */
	_hasclass : function ( name ) {
		return gui.CSSPlugin.contains ( this._element, name );
	}
};