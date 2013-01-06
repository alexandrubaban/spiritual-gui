/**
 * Interface ActionHandler.
 */
gui.IActionHandler = {
		
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {

		return "[object IActionHandler]";
	},

	/**
	 * Handle action.
	 * @param {gui.Action} action
	 */
	onaction : function ( action ) {}
};