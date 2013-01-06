/*
 * Register module.
 */
gui.module ( "core", {
	
	/*
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
	
	/*
	 * Assign plugins to prefixes.
	 */
	plugins : {
		
		action : gui.ActionTracker,
		att : gui.SpiritAtt,
		box : gui.SpiritBox,
		broadcast	: gui.BroadcastTracker,
		css : gui.SpiritCSS,
		dom	: gui.SpiritDOM,
		event	: gui.EventTracker,
		tick : gui.TickTracker,
		tween : gui.TweenTracker,
		transition : gui.TransitionPlugin,
		attention : gui.AttentionPlugin
	},
	
	/*
	 * Channel spirits for CSS selectors.
	 */
	channels : [
		
		[ "html", "gui.DocumentSpirit" ],
		[ ".gui-styles", "gui.StyleSheetSpirit" ],
		[ ".gui-iframe", "gui.IframeSpirit" ],
		[ ".gui-window", "gui.WindowSpirit" ],
		[ ".gui-action", "gui.ActionSpirit" ], // TODO: fix or deprecate
		[ ".gui-cover",  "gui.CoverSpirit" ],
		[ ".gui-spirit", "gui.Spirit" ]
	]
});
