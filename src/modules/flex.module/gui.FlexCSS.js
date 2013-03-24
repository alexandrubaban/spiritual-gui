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
	 * @param {String} mode
	 */
	load : function ( context, mode ) {
		var sheets = this._stylesheets;
		if ( this._mode ) {
			sheets [ this._mode ].disable ();
		}
		if ( sheets [ mode ]) {
			sheets [ mode ].enable ();
		} else {
			var doc = context.document, ruleset = this [ mode ];
			var css = sheets [ mode ] = gui.StyleSheetSpirit.summon ( doc, null, ruleset );
			doc.querySelector ( "head" ).appendChild ( css.element );
		}
		this._mode = mode;
	},

	/**
	 * @type {String}
	 */
	_mode : null,

	/**
	 * Stylesheets.
	 * @type {Map<String,gui.StyleSheetSpirit}
	 */
	_stylesheets : {
		"emulated" : null,
		"native" : null
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
	console.log ( JSON.stringify ( rules, null, "\t" ));
	return rules;
}( 0 ));