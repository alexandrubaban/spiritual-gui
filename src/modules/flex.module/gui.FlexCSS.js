/**
 * CSS injection manager.
 */
gui.FlexCSS = {

	/**
	 * Inject styles on startup? Set this to false if you 
	 * prefer to manage these things in a real stylesheet: 
	 * <meta name="gui.FlexCSS.injected" content="false"/>
	 * @type {boolean}
	 */
	injected : true,

	/**
	 * Generating 23 unique classnames for native flex only. 
	 * Emulated flex JS-reads all values from class attribute.
	 * @type {number}
	 */
	maxflex : 23,

	/**
	 * Inject stylesheet in context. For debugging purposes 
	 * we support a setup to dynically switch the flexmode. 
	 * @param {Window} context
	 * @param {String} mode
	 */
	load : function ( context, mode ) {
		var sheets = this._getsheets ( context.gui.signature );
		if ( sheets && sheets.mode ) {
			sheets [ sheets.mode ].disable ();
		}
		if ( sheets && sheets [ mode ]) {
			sheets [ mode ].enable ();
		} else {
			var doc = context.document, ruleset = this [ mode ];
			var css = sheets [ mode ] = gui.StyleSheetSpirit.summon ( doc, null, ruleset );
			doc.querySelector ( "head" ).appendChild ( css.element );
		}
		sheets.mode = mode;
	},


	// Private .......................................................................
	
	/**
	 * Elaborate setup to track stylesheets injected into windows. 
	 * This allows us to flip the flexmode for debugging purposes. 
	 * It is only relevant for multi-window setup; we may nuke it.
	 * @type {Map<String,object>}
	 */
	_sheets : Object.create ( null ),

	/**
	 * Get stylesheet configuration for window.
	 * @param {String} sig
	 * @returns {object}
	 */
	_getsheets : function ( sig ) {
		var sheets = this._sheets;
		if ( !sheets [ sig ]) {
			sheets [ sig ] = { 
				"emulated" : null, // {gui.StyleSheetSpirit}
				"native" : null, // {gui.StyleSheetSpirit}
				"mode" : null // {String}
			};
		}
		return sheets [ sig ];
	}
};
	
/**
 * Emulated ruleset using table layout and JS.
 * @TODO Figure out how we should declare module constants 
 * first (instead of last) so we can use them around here.
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
		"display" : "table",
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
			"min-width": "100%",
			"min-height" : "100%",
			"display": "-beta-flex",
			"-beta-flex-direction" : "row",
			"-beta-flex-wrap" : "nowrap"
		},
		".flexrow" : {

		},
		".flexcol" : {
			"-beta-flex-direction" : "column"
		},
		".flexrow:not(.flexlax) > *" : { // TODO: not fixed
			"width" : "0%"
		},
		".flexcol:not(.flexlax) > *" : { // TODO: not fixed
			"height" : "0%"
		},
		".flex": { // , .flexrow > *, .flexcol > *" 
			"-beta-flex-grow" : "1",
		}
	};
	var max = gui.FlexCSS.maxflex;
	while ( ++n <= max ) {
		rules [ ".flex" + n ] = {
			"-beta-flex-grow" : String ( n )
		};
	}
	return rules;
}( 0 ));