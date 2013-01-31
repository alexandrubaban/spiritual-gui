/**
 * # Module "core"
 * Injects methods into {gui.Spirit} and such stuff.
 */
gui.module ( "core", {

	/**
	 * Methods added to gui.Spirit.prototype
	 */
	addins : {

		/**
		 * Handle action.
		 * @param {gui.Action} action
		 */
		onaction : function ( action ) {},

		/**
		 * Handle broadcast.
		 * @param {gui.Broadcast} broadcast
		 */
		onbroadcast : function ( broadcast ) {},

		/**
		 * Handle tick.
		 * @param {gui.Tick} tick
		 */
		ontick : function ( tick ) {},

		/**
		 * Handle tween.
		 * @param {gui.Tween}
		 */
		ontween : function ( tween ) {},

		/**
		 * Handle transiton end.
		 * @param {gui.TransitionEnd} transition
		 */
		ontransition : function ( transition ) {},

		/**
		 * Handle event.
		 * @param {Event} event
		 */
		onevent : function ( event ) {},

		/**
		 * Implements DOM2 EventListener.
		 * Forwards to method onevent()
		 * @param {Event} event
		 */
		handleEvent : function ( event ) {
			this.onevent(event);
		}
	},

	/**
	 * Assign plugins to prefixes.
	 */
	plugins : {
		
		action : gui.ActionPlugin,
		att : gui.AttPlugin, 
		box : gui.BoxPlugin,
		broadcast	: gui.BroadcastPlugin,
		css : gui.CSSPlugin,
		dom	: gui.DOMPlugin,
		event	: gui.EventPlugin,
		tick : gui.TickPlugin,
		tween : gui.TweenPlugin,
		transition : gui.TransitionPlugin,
		attention : gui.AttentionPlugin
	},

	/**
	 * Channel spirits for CSS selectors.
	 */
	channels : [
		
		[ "html", "gui.DocumentSpirit" ],
		[ ".gui-styles", "gui.StyleSheetSpirit" ], // @todo fix or deprecate
		[ ".gui-iframe", "gui.IframeSpirit" ],
		[ ".gui-window", "gui.WindowSpirit" ],
		[ ".gui-action", "gui.ActionSpirit" ], // @todo fix or deprecate
		[ ".gui-cover",  "gui.CoverSpirit" ],
		[ ".gui-spirit", "gui.Spirit" ]
	]
});