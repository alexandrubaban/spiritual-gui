/**
 * @class
 * Interface ActionHandler.
 */
gui.IActionHandler = {
		
	/**
	 * @ignore
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