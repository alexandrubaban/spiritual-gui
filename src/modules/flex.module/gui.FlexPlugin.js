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
	 * Remove inline (emulated) styles.
	 */
	unflex : function () {
		gui.FlexPlugin.unflex ( this.spirit.element );
	},

	/**
	 * Hejsa med dig.
	 */
	enable : function () {
		gui.FlexPlugin.enable ( this.spirit.element );
	},

	/**
	 * Hejsa med dig.
	 */
	disable : function () {
		gui.FlexPlugin.disable ( this.spirit.element );
	}


}, {}, { // Static ................................................

	/**
	 * Flex this and descendant flexboxes in document order.
	 * @param {Element} elm
	 */
	reflex : function ( elm ) {
		if ( this._emulated ( elm )) {
			this._crawl ( elm, "flex" );
		}
	},

	/**
	 * Remove inline (emulated) styles.
	 * @param {Element} elm
	 */
	unflex : function ( elm ) {
		if ( this._emulated ( elm )) {
			this._crawl ( elm, "unflex" );
		}
	},

	/**
	 * Hejsa med dig.
	 * @param {Element} elm
	 */
	enable : function ( elm ) {
		this._crawl ( elm, "enable" );
		if ( this._emulated ( elm )) {
			this.reflex ( elm );
		}
	},

	/**
	 * Hejsa med dig.
	 * @param {Element} elm
	 */
	disable : function ( elm ) {
		if ( this._emulated ( elm )) {
			this.unflex ( elm );
		}
		this._crawl ( elm, "disable" );
	},


	// Private static ........................................................

	/**
	 * Element context runs in emulated mode?
	 * @param {Element} elm
	 * @returns {boolean}
	 */
	_emulated : function ( elm ) {
		var doc = elm.ownerDocument;
		var win = doc.defaultView;
		return win.gui.flexmode === gui.FLEXMODE_EMULATED;
	},

	/**
	 * Flex / disable / unflex element and descendants.
	 * @param {Element} elm
	 * @param {String} action
	 */
	_crawl : function ( elm, action ) {
		if ( this._hasflex ( elm ) || action === "enable" ) {
			var boxes = this._getflexboxes ( elm );
			boxes.forEach ( function ( box ) {
				box [ action ]();
			});
		}
	},

	/**
	 * Element is flexbox or contains flexible stuff?
	 * @param {Element} elm
	 * @returns {boolean}
	 */
	_hasflex : function ( elm ) {
		if ( elm.nodeType === Node.ELEMENT_NODE ) {
			return (
				gui.CSSPlugin.contains ( elm, "flexrow" ) || 
				gui.CSSPlugin.contains ( elm, "flexcol" ) ||
				elm.querySelector ( ".flexrow" ) ||
				elm.querySelector ( ".flexcol" )
			);
		}
		return false;
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
					boxes.push ( new gui.FlexBox ( elm )); // TODO CLASSNAME FOR -disabled
				}
			}
		});
		return boxes;
	}

});