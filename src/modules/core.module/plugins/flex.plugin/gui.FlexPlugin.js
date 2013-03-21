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
		var boxes = this._collectboxes ();
		boxes.forEach ( function ( box ) {
			box.flex ();
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


}, { // Static ................................................................

	MODE_NATIVE : "native",
	MODE_EMULATED : "emulated",
	MODE_OPTIMIZED : "optimized"

});

/**
 * @TODO reflex on startup by default...
 * @TODO nicer interface for this kind of thing
 */
( function defaultsettings () {
	gui.mixin ( "flexmode", "emulated" );
	gui.mixin ( "reflex", function () {
		var html = this._document.documentElement;
		var root = html.spirit;
		if ( this.flexmode === "emulated" ) {
			root.flex.reflex ();
		}
	});
}());