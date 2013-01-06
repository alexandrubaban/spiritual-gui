/**
 * Spirit plugin.
 */
gui.SpiritPlugin = gui.Exemplar.create ( "gui.SpiritPlugin", Object.prototype, {
	
	/**
	 * Associated spirit.
	 * @type {gui.Spirit}
	 */
	spirit : null,
	
	/**
	 * Plugins may be designed to work without an associated spirit. 
	 * In that case, an external entity might need to define this. 
	 * @type {Global} Typically identical to this.spirit.window
	 */
	context : null,
	
	/**
	 * Construct
	 */
	onconstruct : function () {},
	
	/**
	 * Destruct.
	 */
	destruct : function () {},

	/**
	 * Implements DOM2 EventListener. Forwards to onevent().
	 * @param {Event} e
	 */
	handleEvent : function ( e ) {

		if ( gui.Type.isFunction ( this.onevent )) {
			this.onevent ( e );
		}
	},
	
	
	// Secrets ...........................................................
	
	/**
	 * Secret constructor. Can we identify the 
	 * spirit and it's associated window? Not, 
	 * then we are maybe inside a Web Worker.
	 * @param {gui.Spirit} spirit
	 */
	__construct__ : function ( spirit ) {
		
		this.spirit = spirit || null;
		this.context = spirit ? spirit.window : null;
	},
	
	/**
	 * Secret destructor. Catching stuff that 
	 * might be executed on a timed schedule.
	 */
	__destruct__ : function () {
		
		this.destruct ();
		if ( this.spirit !== null ) {
			Object.defineProperty ( this, "spirit", gui.Spirit.DENIED );
		}
	}
	
}, { // recurring static fields ..................................

	/**
	 * Plugins don't infuse.
	 */
	infuse : function () {

		throw new Error ( 
			'Plugins must use the "extend" method and not "infuse".'
		);
	}
});