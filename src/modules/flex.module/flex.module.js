gui.FLEXMODE_NATIVE = "native";
gui.FLEXMODE_EMULATED = "emulated";
gui.FLEXMODE_OPTIMIZED = "optimized",

/**
 * Provides a subset of flexible boxes that works in IE9 
 * as long as flex is implemented using a predefined set 
 * of classnames: flexrow, flexcol and flexN where N is 
 * a number to indicate the flexiness of child elements.
 * @todo Reflex on window resize...
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
		context.gui._flexmode = gui.FLEXMODE_OPTIMIZED;
		context.Object.defineProperties ( context.gui, gui.FlexMode );
	},

	/**
	 * Inject the relevant stylesheet (native or emulated) before startup spiritualization.
	 * @todo Make sure stylesheet onload has fired to prevent flash of unflexed content?
	 * @param {Window} context
	 */
	onbeforespiritualize : function ( context ) {
		if ( !context.gui.flexloaded ) { // @see {gui.FlexCSS}
			gui.FlexCSS.load ( context, context.gui.flexmode );
		}
		/*
		 * Bake reflex into EDBML updates to catch flex related attribute updates etc. 
		 * (by default we only reflex whenever DOM elements get inserted or removed)
		 * @todo Suspend default flex to only flex once
		 */
		if ( context.gui.hasModule ( "edb" )) {
			var script = context.edb.ScriptPlugin.prototype;
			gui.Function.decorateAfter ( script, "write", function () {
				if ( this.spirit.window.gui.flexmode === gui.FLEXMODE_EMULATED ) {
					this.spirit.flex.reflex ();
				}
			});
		}

		console.log ( "TODO: resize-end hookup" );
	},

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

/**
 * Manage emulated flex whenever DOM elements get added and removed.
 * Mixing into 'gui.Guide._spiritualize' and 'gui.Guide._materialize'
 * @todo Both of these methods should be made public we presume...
 * @using {gui.Guide}
 */
( function decorate ( guide ) {

	/*
	 * Flex subtree starting from the parent node of given node.
	 * @param {Node} node
	 */
	function flexparent ( node ) {
		var doc = node.ownerDocument;
		var win = doc.defaultView;
		if ( win.gui.flexmode === gui.FLEXMODE_EMULATED ) {
			if ( gui.DOMPlugin.embedded ( node )) {
				node = node === doc.documentElement ? node : node.parentNode;
				gui.Tick.next ( function () {
					gui.FlexPlugin.reflex ( node );
				});
			}
		}
	}

	[ "_spiritualize", "_materialize" ].forEach ( function ( method ) {
		gui.Function.decorateAfter ( guide, method, flexparent );
	});

}( gui.Guide ));