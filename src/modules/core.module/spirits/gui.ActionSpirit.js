/**
 * @class
 * @extends {gui.Spirit}
 * @deprecated
 * Spirit of the button-like element.
 * @todo Support ENTER for onaction.
 * @todo move to some kind of plugin.
 */
gui.ActionSpirit = gui.Spirit.infuse ( "gui.ActionSpirit", {
	
	/**
	 * Enter.
	 */
	onenter : function () {
		
		this._super.onenter ();
		this.event.add ( "click" );
	},
	
	/**
	 * Handle event.
	 * @param {Event} e
	 */
	onevent : function ( e ) {
		
		this._super.onevent ( e );
		switch ( e.type ) {
			case "click" :
				var onaction = this.att.get ( "onaction" );
				if ( gui.Type.isString ( onaction )) {
					var Invokable = this.window.Function;
					new Invokable ( onaction ).call ( this );
				}
				break;
		}
	}
});