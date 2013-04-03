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
 * Emulated ruleset.
 * @TODO font-size-zero trick to eliminate inline spacing...
 */
gui.FlexCSS [ "emulated" ] = {
	".flexrow, .flexcol" : {
		"display" : "block",
		"width" : "100%",
		"height" : "100%"
	},
	".flexrow > *" : {
		"display" : "inline-block",
		"vertical-align" : "top",
		//"max-height" : "100%",
		"height" : "100%"
	},
	"flexcol > *" : {
		"display" : "block",
		"width" : "100%"
	},
	".flexlax > .flexrow" : {
		"display" : "table"
	},
	".flexlax > .flexrow > *" : {
		"display" : "table-cell"
	}
};

/**
 * Native ruleset.
 */
gui.FlexCSS [ "native" ] = ( function () {
	var rules = {
		".flexrow, .flexcol" : {
			"display": "-beta-flex",
			"-beta-flex-wrap" : "nowrap",
			"-beta-flex-direction" : "row",
			"min-height" : "100%",
			"min-width": "100%"
		},
		".flexcol" : {
			"-beta-flex-direction" : "column"
		},
		".flexrow:not(.flexlax) > *, .flexcol:not(.flexlax) > *" : {
			"-beta-flex-basis" : 1
		}
	};
	/*
	 * Can't parse 'contains' selector (says DOM exception), 
	 * so let's just create one billion unique classnames...
	 */
	function declare ( n ) {
		rules [ ".flex" + n ] = {
			"-beta-flex-grow" : n || 1
		};
		rules [ ".flexrow:not(.flexlax) > .flex" + n ] = {
			"width" : "0%"
		};
		rules [ ".flexcol:not(.flexlax) > .flex" + n ] = {
			"height" : "0"
		};
	}
	var n = -1, max = gui.FlexCSS.maxflex;
	while ( ++n <= max ) {
		declare ( n || "" );
	}
	return rules;
}());