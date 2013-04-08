/**
 * Facilitate flexbox-like layouts in IE9 
 * provided a fixed classname structure.
 * @extends {gui.Plugin}
 */
gui.FlexPlugin = gui.Plugin.extend ( "gui.FlexPlugin", {

	/**
	 * Flex this and descendant flexboxes in document order. As the name suggests, 
	 * it might be required to call this again if flexboxes get added or removed.
	 */
	reflex : function () {
		this._doflex ( true );
	},

	/**
	 * Hejsa.
	 */
	unflex : function () {
		this._doflex ( false );
	},


	// Private ..................................................................

	/**
	 * Flex/unflex descendants.
	 * @param {boolean} isflex
	 */
	_doflex : function ( isflex ) {
		var dom = this.spirit.dom;
		if ( dom.q ( ".flexrow" ) || dom.q ( ".flexcol" )) {
			var boxes = this._getflexboxes ( this.spirit.element );
			boxes.forEach ( function ( box ) {
				if ( isflex ) {
					box.flex ();
				} else {
					box.unflex ();
				}
			});
		}
	},

	/**
	 * Collect descendant-and-self flexboxes.
	 * @param @optional {Element} elm
	 * @returns {Array<gui.FlexBox>}
	 */
	_getflexboxes : function ( elm ) {
		var boxes = [], hasclass = gui.CSSPlugin.contains;
		new gui.Crawler ( "flexcrawler" ).descend ( elm, {
			handleElement : function ( elm ) {
				if ( hasclass ( elm, "flexrow" ) || hasclass ( elm, "flexcol" )) {
					boxes.push ( new gui.FlexBox ( elm ));
				}
			}
		});
		return boxes;
	}


});