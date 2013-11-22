/**
 * It's the spirits module.
 */
gui.module ( "spirits@wunderbyte.com", {

	/**
	 * Channel spirits for CSS selectors.
	 */
	channels : [
		
		[ "html", gui.DocumentSpirit ],
		[ ".gui-styles", gui.StyleSheetSpirit ], // @TODO fix or deprecate
		[ ".gui-iframe", gui.IframeSpirit ],
		[ ".gui-cover", gui.CoverSpirit ],
		[ ".gui-spirit", gui.Spirit ]
	],

	/**
	 * Assign plugins to prefixes for all {gui.Spirit}.
	 */
	plugins : {
		
		"att" : gui.AttPlugin, 
		"attconfig" : gui.AttConfigPlugin,
		"box" : gui.BoxPlugin,
		"css" : gui.CSSPlugin,
		"dom" : gui.DOMPlugin,
		"event" : gui.EventPlugin,
		"life" : gui.LifePlugin,
		"sprite" : gui.SpritePlugin
 },

	/**
	 * Methods added to {gui.Spirit.prototype}
	 */
	mixins : {

		/**
		 * Handle attribute.
		 * @param {gui.Att} att
		 */
		onatt : function ( att ) {},

		/**
		 * Handle event.
		 * @param {Event} event
		 */
		onevent : function ( event ) {},

		/**
		 * Handle lifecycle event.
		 * @param {gui.Life} life
		 */
		onlife : function ( life ) {},

		/**
		 * Native DOM interface. We'll forward the event to the method `onevent`.
		 * @see http://www.w3.org/TR/DOM-Level-3-Events/#interface-EventListener
		 * @param {Event} e
		 */
		handleEvent : function ( e ) {
			
			/*
			 * TODO: Move this code into {gui.EventPlugin}
			 */
			if ( e.type === "webkitTransitionEnd" ) {
				e = {
					type : "transitionend",
					target : e.target,
					propertyName : e.propertyName,
					elapsedTime : e.elapsedTime,
					pseudoElement : e.pseudoElement
				};
			}

			this.onevent ( e );
		},

		$ondestruct : gui.Combo.before ( function () {
			this.handleEvent = function () {};
		})( gui.Spirit.prototype.$ondestruct )
	}

});