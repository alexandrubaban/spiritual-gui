/**
 * # gui.SpiritBox
 * Spirit box object. Note that all these are properties and not methods. 
 * @extends {gui.SpiritPlugin}
 * @todo Support globalX, globalY, screenX, screenY
 */
gui.SpiritBox = gui.SpiritPlugin.extend ( "gui.SpiritBox", {
	
	width   : 0, // width
	height  : 0, // height
	localX  : 0, // X relative to positioned ancestor
	localY  : 0, // Y relative to positioned ancestor
	pageX   : 0, // X relative to the full page (includes scrolling)
	pageY   : 0, // Y telative to the full page (includes scrolling)	  
	clientX : 0, // X relative to the viewport (excludes scrolling)
	clientY : 0  // Y relative to the viewport (excludes scrolling)
});

Object.defineProperties ( gui.SpiritBox.prototype, {

	/**
	 * Width.
	 * @type {number}
	 */
	width : {
		get : function () {
			return this.spirit.element.offsetWidth;
		}
	},

	/**
	 * Height.
	 * @type {number}
	 */
	height : {
		get : function () {
			return this.spirit.element.offsetHeight;
		}
	},

	/**
	 * X relative to positioned ancestor.
	 * @type {number}
	 */
	localX : {
		get : function () {
			return this.spirit.element.offsetLeft;
		}
	},

	/**
	 * Y relative to positioned ancestor.
	 * @type {number}
	 */
	localY : {
		get : function () {
			return this.spirit.element.offsetTop;
		}
	},

	/**
	 * X relative to the full page (includes scrolling).
	 * @todo IMPORTANT scrollroot must be local to context
	 * @type {number}
	 */
	pageX : {
		get : function () {
			return this.clientX + gui.Client.scrollRoot.scrollLeft;
		}
	},

	/**
	 * Y relative to the full page (includes scrolling).
	 * @todo IMPORTANT scrollroot must be local to context
	 * @type {number}
	 */
	pageY : {
		get : function () {
			return this.clientY + gui.Client.scrollRoot.scrollTop;
		}
	},

	/**
	 * X relative to the viewport (excludes scrolling).
	 * @type {number}
	 */
	clientX : {
		get : function () {
			return this.spirit.element.getBoundingClientRect ().left;
		}
	},

	/**
	 * Y relative to the viewport (excludes scrolling).
	 * @type {number}
	 */
	clientY : {
		get : function () {
			return this.spirit.element.getBoundingClientRect ().top;
		}
	}
});