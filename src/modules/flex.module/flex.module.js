gui.FLEXMODE_NATIVE = "native";
gui.FLEXMODE_EMULATED = "emulated";
gui.FLEXMODE_OPTIMIZED = "optimized",

/**
 * Provides a subset of flexible boxes that works in IE9 
 * as long as flex is implemented using a predefined set 
 * of classnames: flexrow, flexcol and flexN where N is 
 * a number to indicate the flexiness of things.
 * @see {gui.FlexCSS}
 */
gui.module ( "flex", {

	/** 
	 * Setup gui.FlexPlugin for all spirits. 
	 * Trigger flex using this.flex.reflex()
	 */
	plugins : {
		flex : gui.FlexPlugin
	},

	/**
	 * Setup flex control on the local "gui" object. Note that we  assign non-enumerable properties 
	 * to prevent the setup from being portalled into subframes (when running a multi-frame setup).
	 * @param {Window} context
	 */
	oncontextinitialize : function ( context ) {
		var mode = [ 
			gui.FLEXMODE_OPTIMIZED, 
			gui.FLEXMODE_NATIVE, 
			gui.FLEXMODE_EMULATED 
		];
		( function scoped () {
			var flexmode = mode [ 0 ];
			Object.defineProperties ( context.gui, {
				"flexmode" : {
					configurable : true,
					enumerable : false,
					get : function () {
						var bestmode = mode [ gui.Client.hasFlexBox ? 1 : 2 ];
						return flexmode === mode [ 0 ] ? bestmode : flexmode;
					},
					set : function ( mode ) {
						flexmode = mode;
						gui.FlexCSS.load ( context, mode );
					}
				},
				"reflex" : {
					configurable : true,
					enumerable : false,
					value : function () {
						var node = this.document;
						var body = node.body;
						var root = node.documentElement;
						if ( this.flexmode === this.FLEXMODE_EMULATED ) {
							( body.spirit || root.spirit ).flex.reflex ();
						}
					}
				}
			});
		}());
	},

	/**
	 * 1. Inject the relevant stylesheet
	 * 2. Setup to flex on EDBML updates
	 * @param {Window} context
	 */
	onbeforespiritualize : function ( context ) {
		if ( gui.FlexCSS.injected ) {
			gui.FlexCSS.load ( context, context.gui.flexmode );
		}
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
	},

	/**
	 * TODO: make gui.FlexCSS forget this context.
	 * @param {Window} context
	 */
	oncontextunload : function ( context ) {}
	
});