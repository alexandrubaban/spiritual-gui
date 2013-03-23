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
	 * Support flex control on the local "gui" object 
	 * (this must be localized to portalled iframes).
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
		gui.FlexCSS.inject ( context, context.gui.flex.mode );
		if ( context.gui.hasModule ( "edb" )) {
			var proto = context.edb.ScriptPlugin.prototype;
			gui.Function.decorateAfter ( proto, "write", function () {
				if ( this.spirit.window.gui.flex.mode === "emulated" ) { // check in reflex!
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
		//alert(context.gui.flex.mode)
		context.gui.flex.reflex ();
	}
	
});