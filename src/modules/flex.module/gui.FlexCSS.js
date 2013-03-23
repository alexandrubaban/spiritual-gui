/**
 * Injected CSS.
 */
gui.FlexCSS = {

	/**
	 * Inject styles on startup? Set this to false if you 
	 * prefer to manage these things in a real stylesheet.
	 * @type {boolean}
	 */
	injected : true,

	/**
	 * Generating 23 unique classnames for *native* flex. 
	 * Emulated flex extracts the value from the classname.
	 * @type {number}
	 */
	maxflex : 23,

	/**
	 * Inject stylesheet in context.
	 * @param {Window} context
	 */
	inject : function ( context, mode ) {
		var doc = context.document, ruleset = this [ mode ];
		var stylesheet = gui.StyleSheetSpirit.summon ( doc, null, ruleset );
		doc.querySelector ( "head" ).appendChild ( stylesheet.element );
	}
};
	
/**
 * Emulated ruleset using table layout and JS.
 * @TODO: gui.FLEXMODE_EMULATED instead...
 */
gui.FlexCSS [ "emulated" ] = {
	"flexbox" : {
		"display" : "block"
	},
	".flexbox.vertical > *" : {
		"display" : "block"
	},
	".flexbox:not(.vertical)" : {
		"display" : "table",
		"width" : "100%"
	},
	".flexbox:not(.vertical) > *" : {
		"display" : "table-cell"
	}
};

/**
 * Native flexbox classnames.
 */
gui.FlexCSS [ "native" ] = ( function ( flex ) {
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
	var max = gui.FlexCSS.maxflex;
	while ( ++flex <= max ) {
		rules [ ".flex" + flex ] = {
			"-beta-flex" : flex + " 0 auto"
		};
	}
	return rules;
}( 0 ));