/**
 * CSS injection manager.
 */
gui.FlexCSS = {

	/**
	 * Inject styles on startup? Set this to false if you 
	 * prefer to manage these things in a real stylesheet.
	 * @type {boolean}
	 */
	injected : true,

	/**
	 * Generating 23 unique classnames for native flex only. 
	 * Emulated flex extracts all values from class attribute.
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
 */
gui.FlexCSS [ "emulated" ] = {
	".flexcol" : {
		"display" : "block",
		"height" : "100%"
	},
	".flexcol:not(.flexlax)" : {
		"max-height" : "100%"
	},
	".flexcol > *" : {
		"display" : "table",
		"width" : "100%"
	},
	".flexrow" : {
		"display" : "block",
		"table-layout" : "fixed",
		"width" : "100%"
	},
	".flexrow > *" : {
		"display" : "table-cell"
	},
};

/**
 * Native flexbox classnames.
 */
gui.FlexCSS [ "native" ] = ( function ( n ) {
	var rules = {
		".flexrow, .flexcol" : {
			//"height" : "100%",
			//"width": "100%",
			"display": "-beta-flex",
			"-beta-flex-direction" : "row",
			"-beta-flex-wrap" : "nowrap"
		},
		".flexcol" : {
			"-beta-flex-direction" : "column"
		},
		".flex, .flexrow > *, .flexcol > *" : {
			"-beta-flex" : "1 0 auto",
		},
		
		".flexrow:not(.flexlax) > *" : {
			"width" : "0"
		},
		/*
		".flexcol:not(.flexlax) > *" : {
			"height" : "0"
		}
		*/
	};
	var max = gui.FlexCSS.maxflex;
	while ( ++n <= max ) {
		rules [ ".flex" + n ] = {
			"-beta-flex" : n + " 0 auto"
		};
	}
	return rules;
}( 0 ));