gui.FlexPlugin = gui.Plugin.extend ( "gui.FlexPlugin", {

	/**
	 * Flex this and descendant flexboxes in document order. As the name suggests, 
	 * it might be required to call this again if flexboxes get added or removed.
	 */
	reflex : function () {
		var boxes = this._collectboxes ();
		boxes.forEach ( function ( box ) {
			box.flexchildren ();
		});
	},


	// Private ..................................................................

	/**
	 * @returns {Array<gui.FlexBox>}
	 */
	_collectboxes : function () {
		var boxes = [];
		new gui.Crawler ( "flexcrawler" ).descend ( this.spirit.element, {
			handleElement : function ( elm ) {
				if ( gui.CSSPlugin.contains ( elm, "flexbox" )) {
					boxes.push ( new gui.FlexBox ( elm ));
				}
			}
		});
		return boxes;
	}

});