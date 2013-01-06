/**
 * Spirit box object (performant now: http://code.google.com/p/v8/issues/detail?id=1239)
 */
gui.SpiritBox = gui.SpiritPlugin.extend ( "gui.SpiritBox", {
	
	width   : 0, // width
	height  : 0, // height
	localX  : 0, // X relative to positioned ancestor
	localY  : 0, // Y relative to positioned ancestor
	pageX   : 0, // X relative to the full page (includes scrolling)
	pageY   : 0, // Y telative to the full page (includes scrolling)	  
	clientX : 0, // X relative to the viewport (excludes scroll offset)
	clientY : 0, // Y relative to the viewport (excludes scroll offset)
	globalX : 0, // TODO
	globalY : 0, // TODO,
	screenX : 0, // TODO,
	screenY : 0  // TODO
	
});

Object.defineProperties ( gui.SpiritBox.prototype, {
	
	/**
	 * Get width.
	 * @returns {number}
	 */
	width : {
		get : function () {
			return this.spirit.element.offsetWidth;
		}
	},
	
	/**
	 * Get height.
	 * @returns {number}
	 */
	height : {
		get : function () {
			return this.spirit.element.offsetHeight;
		}
	},
	
	/**
	 * Get offsetParent left.
	 * @returns {number}
	 */
	localX : {
		get : function () {
			return this.spirit.element.offsetLeft;
		}
	},
	
	/**
	 * Get offsetParent top.
	 * @returns {number}
	 */
	localY : {
		get : function () {
			return this.spirit.element.offsetTop;
		}
	},
	
	/**
	 * @returns {number}
	 */
	pageX : {
		get : function () {
			return this.clientX + gui.Client.scrollRoot.scrollLeft;
		}
	},
	
	/**
	 * @returns {number}
	 */
	pageY : {
		get : function () {
			
			return this.clientY + gui.Client.scrollRoot.scrollTop;
		}
	},
	
	/**
	 * TODO
	 * @returns {number}
	 */
	globalX : {
		get : function () {
			console.warn ( "TODO: gui.SpiritBox.globalX" );
			return null;
		}
	},
	
	/**
	 * TODO
	 * @returns {number}
	 */
	globalY : {
		get : function () {
			console.warn ( "TODO: gui.SpiritBox.globalY" );
			return null;
		}
	},
	
	/**
	 * @returns {number}
	 */
	clientX : {
		get : function () {
			return this.spirit.element.getBoundingClientRect ().left;
		}
	},
	
	/**
	 * @returns {number}
	 */
	clientY : {
		get : function () {
			return this.spirit.element.getBoundingClientRect ().top;
		}
	}
});