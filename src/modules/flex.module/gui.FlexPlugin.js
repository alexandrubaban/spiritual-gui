/**
 * Facilitate flexbox-like layouts in IE9 
 * provided a fixed classname structure.
 * @extends {gui.Plugin}
 */
gui.FlexPlugin = gui.Plugin.extend ( "gui.FlexPlugin", {

	/**
	 * Flex this and descendant flexboxes in document order. As the name suggests, 
	 * it might be required to call this again if flexboxes get added or removed.
	 * @param @optional {Element} elm Flex from this element (or 'this.element')
	 */
	reflex : function ( elm ) {
		elm = elm || this.spirit.element;
		if ( this.spirit.dom.q ( ".flexbox" )) {
			var boxes = this._collectboxes ( elm );
			boxes.forEach ( function ( box ) {
				box.flex ();
			});
		}
	},


	// Private ..................................................................

	/**
	 * Collect descendant-and-self flexboxes.
	 * @param @optional {Element} elm
	 * @returns {Array<gui.FlexBox>}
	 */
	_collectboxes : function ( elm ) {
		var boxes = [];
		new gui.Crawler ( "flexcrawler" ).descend ( elm, {
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


/*
var rules = {
	".flexbox" : {
			"height" : "100%",
			"width": "100%",
			"display": "-beta-flex",
			"-beta-flex-direction" : "row",
			"-beta-flex-wrap" : "nowrap"
	},
	".flexbox.vertical" : {
			"-beta-flex-direction" : "column"
	},
	".flex, .flexbox > *" : {
			"-beta-flex" : "1 0 auto",
			"height" : "auto"
	}
};

var i = 0; while ( ++i < 23 ) {
	rules [ ".flex" + i ] = {
		"-beta-flex" : i + " 0 auto"
	}
}

console.log ( JSON.stringify ( rules, null, "\t" ));

//gui.CSSPlugin.addRules ( document, rules )
*/