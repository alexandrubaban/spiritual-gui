gui.FLEXMODE_NATIVE = "native";
gui.FLEXMODE_EMULATED = "emulated";
gui.FLEXMODE_OPTIMIZED = "optimized",

gui.flexmode = gui.FLEXMODE_OPTIMIZED;

/**
 * Provides a subset of flexible boxes that works in IE9 
 * as long as flex is implemented using a predefined set 
 * of classnames: flexrow, flexcol and flexN where N is 
 * a number to indicate the flexiness of things.
 * @see {gui.FlexCSS}
 */
gui.module ( "flex", {

	/** 
	 * gui.FlexPlugin with flex prefix.
	 */
	plugins : {
		flex : gui.FlexPlugin
	},

	/**
	 * Support flex control on the local "gui" object 
	 * (this must be localized to portalled iframes).
	 * @TODO get a grip on this dilemma
	 * @param {Window} context
	 */
	oncontextinitialize : function ( context ) {
		var override = true; // fix this!
		gui.Object.mixin ( context.gui, "reflex", function () {
			var node = this.document;
			var body = node.body;
			var root = node.documentElement;
			if ( this.flexmode === this.FLEXMODE_EMULATED ) {
				( body.spirit || root.spirit ).flex.reflex ();
			}
		}, override );
	},

	/**
	 * 1. Inject the relevant stylesheet
	 * 2. Setup to flex on EDBML updates
	 * @param {Window} context
	 */
	onbeforespiritualize : function ( context ) {
		gui.FlexCSS.load ( context, context.gui.flexmode );
		if ( context.gui.hasModule ( "edb" )) {
			var script = context.edb.ScriptPlugin.prototype;
			gui.Function.decorateAfter ( script, "write", function () {
				if ( this.spirit.window.gui.flexmode === gui.FLEXMODE_EMULATED ) {
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
		if ( context.gui.flexmode === gui.FLEXMODE_EMULATED ) {
			context.gui.reflex ();
		}
	}
	
});