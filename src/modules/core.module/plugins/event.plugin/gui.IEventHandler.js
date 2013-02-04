/**
 * # gui.IEventHandler
 * Interface EventHandler. This is a real DOM interface, it's used for native event 
 * handling. We usually choose to forward the event to the spirits `onevent` method.
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#interface-EventListener
 */
gui.IEventHandler = {

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object IEventHandler]";
	},

	/**
	 * Handle event.
	 * @param {Event} e
	 */
	handleEvent : function ( e ) {}
};