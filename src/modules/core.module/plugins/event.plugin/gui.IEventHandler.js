/**
 * Interface EventHandler. This matches DOM interface EventListener. 
 * If possible, we would like to forward events to method onevent().
 * http://www.w3.org/TR/DOM-Level-3-Events/#interface-EventListener
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
	 * Handle event. This is likely to forward the event to onevent()
	 * @param {Event} e
	 */
	handleEvent : function ( e ) {}
};