/**
 * Flexible boxes for IE9.
 */
gui.FlexModule = gui.module ( "flex", {

	MODE_NATIVE : "native",
	MODE_EMULATED : "emulated",
	MODE_OPTIMIZED : "optimized",

	/** 
	 * Assign FlexPlugin to prefix "flex".
	 */
	plugins : {
		flex : gui.FlexPlugin
	},

	/**
	 * Properties added to the 'gui' object get copied 
	 * to portalled iframes automatically, we have to  
	 * overwrite is subframes for localized flex control.
	 * @param {Window} context
	 */
	oncontextinitialize : function ( context ) {
		var override = true;
		gui.Object.mixin ( context.gui, "flex", {
			mode : "emulated",
			reflex : function () {
				var node = context.document;
				var html = node.documentElement;
				var root = html.spirit;
				if ( this.mode === "emulated" ) {
					root.flex.reflex ( node.body );
				}	
			}
		}, override );
	},

	/**
	 * 1. Inject the relevant stylesheet
	 * 2. Setup to flex on EDBML updates
	 * @param {Window} context
	 */
	onbeforespiritualize : function ( context ) {

		var doc = context.document, rules = gui.FlexModule.RULESET_EMULATED;
		var stylesheet = gui.StyleSheetSpirit.summon ( doc, null, rules );
		doc.querySelector ( "head" ).appendChild ( stylesheet.element );
		
		if ( context.gui.hasModule ( "edb" )) {
			var proto = context.edb.ScriptPlugin.prototype;
			gui.Function.decorateAfter ( proto, "write", function () {
				if ( this.spirit.window.gui.flexmode === "emulated" ) { // check in reflex!
					this.spirit.flex.reflex ();
				}
			});
		}
	},

	/**
	 * Flex everything on startup.
	 * @param {Window} context
	 */
	onafterspiritualize : function ( context ) {
		context.gui.flex.reflex ();
	},
	
});

/**
 * Emulated CSS ruleset.
 */
gui.FlexModule.RULESET_EMULATED = {
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
 * Native CSS ruleset.
 */
gui.FlexModule.RULESET_NATIVE = ( function ( flex ) {
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
	while ( ++flex <= 23 ) {
		rules [ ".flex" + flex ] = {
			"-beta-flex" : flex + " 0 auto"
		};
	}
	return rules;
}( 0 ));