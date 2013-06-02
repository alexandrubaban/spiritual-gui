/**
 * Injects methods into {gui.Spirit} and such.
 */
gui.module ( "core", {

	/**
	 * Channel spirits for CSS selectors.
	 */
	channels : [
		
		[ "html", "gui.DocumentSpirit" ],
		[ ".gui-styles", "gui.StyleSheetSpirit" ], // @TODO fix or deprecate
		[ ".gui-iframe", "gui.IframeSpirit" ],
		[ ".gui-action", "gui.ActionSpirit" ], // @TODO fix or deprecate
		[ ".gui-cover",  "gui.CoverSpirit" ],
		[ ".gui-spirit", "gui.Spirit" ]
	],

	/**
	 * Assign plugins to prefixes.
	 */
	plugins : {
		
		action : gui.ActionPlugin,
		att : gui.AttPlugin, 
		attconfig : gui.AttConfigPlugin,
		attention : gui.AttentionPlugin,
		box : gui.BoxPlugin,
		broadcast : gui.BroadcastPlugin,
		css : gui.CSSPlugin,
		dom : gui.DOMPlugin,
		event : gui.EventPlugin,
		life : gui.LifePlugin,
		tick : gui.TickPlugin,
		tween : gui.TweenPlugin,
		transition : gui.TransitionPlugin
 },

	/**
	 * Methods added to gui.Spirit.prototype
	 */
	mixins : {

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
		 * Implements DOM2 EventListener only to forward the event to method onevent()
		 * @see http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener
		 * @param {Event} event
		 */
		handleEvent : function ( event ) {
			this.onevent(event);
		}
	}

});