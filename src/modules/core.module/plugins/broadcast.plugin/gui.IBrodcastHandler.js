/**
 * # gui.IBroadcastHandler
 * Interface BroadcastHandler.
 */
gui.IBroadcastHandler = {

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object IBroadcastHandler]";
	},

	/**
	 * Handle broadcast.
	 * @param {gui.Broadcast} broadcast
	 */
	onbroadcast : function ( broadcast ) {}
};