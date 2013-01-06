/**
 * Spirit of the button-like element.
 * TODO: Support ENTER for onaction.
 * TODO: move to some kind of plugin.
 */
gui.ActionSpirit = gui.Spirit.infuse ( "gui.ActionSpirit", {
	
	/**
	 * TODO: setup action dispatch via HTML inline 
	 * attribute. Also attribute ation data.
	 *
	action.type : null,
	*/
	
	/**
	 * TODO
	 *
	onaction : null,
	 */
	
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
					var invokable = this.window.Function;
					new invokable ( onaction ).call ( this );
				}
				break;
		}
	}
});