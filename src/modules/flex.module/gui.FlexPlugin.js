/**
 * Facilitate flexbox-like layouts in IE9 
 * provided a fixed classname structure.
 * @extends {gui.Plugin}
 */
gui.FlexPlugin = gui.Plugin.extend ( "gui.FlexPlugin", {

	/**
	 * Flex this and descendant flexboxes in document order.
	 */
	reflex : function () {
		gui.FlexPlugin.reflex ( this.spirit.element );
	},

	/**
	 * Hejsa med dig.
	 */
	unflex : function () {
		gui.FlexPlugin.unflex ( this.spirit.element );
	},

	/**
	 * Remove inline (emulated) styles.
	 */
	unstyle : function () {
		gui.FlexPlugin.unstyle ( this.spirit.element );
	}


}, {}, { // Static ................................................

	/**
	 * Flex this and descendant flexboxes in document order.
	 * @param {Element} elm
	 */
	reflex : function ( elm ) {
		this._crawl ( elm, "flex" );
	},

	/**
	 * Hejsa med dig.
	 * @param {Element} elm
	 */
	unflex : function ( elm ) {
		this._crawl ( elm, "unflex" );
	},

	/**
	 * Remove inline (emulated) styles.
	 * @param {Element} elm
	 */
	unstyle : function ( elm ) {
		this._crawl ( elm, "unstyle" );
	},


	// Private static ........................................................

	/**
	 * Flex / unflex / unstyle element and descendants.
	 * @param {Element} elm
	 * @param {String} action
	 */
	_crawl : function ( elm, action ) {
		if ( this._hasflex ( elm )) {
			var boxes = this._getflexboxes ( elm );
			boxes.forEach ( function ( box ) {
				box [ action ]();
			});
		}
	},

	/**
	 * @TODO check classses on elm itself!
	 */
	_hasflex : function ( elm ) {
		return elm.querySelector ( ".flexrow" ) || elm.querySelector ( ".flexcol" );
	},

	/**
	 * Collect descendant-and-self flexboxes.
	 * @param @optional {Element} elm
	 * @returns {Array<gui.FlexBox>}
	 */
	_getflexboxes : function ( elm ) {
		var boxes = [], contains = gui.CSSPlugin.contains;
		new gui.Crawler ( "flexcrawler" ).descend ( elm, {
			handleElement : function ( elm ) {
				if ( contains ( elm, "flexrow" ) || contains ( elm, "flexcol" )) {
					boxes.push ( new gui.FlexBox ( elm ));
				}
			}
		});
		return boxes;
	}

});