/**
 * @class
 * Interface BroadcastHandler.
 */
gui.IBroadcastHandler = {
		
	/**
	 * @ignore
	 */
	toString : function () {

		return "[object IBroadcastHandler]";
	},

	/**
	 * @static
	 * Handle broadcast.
	 * @param {gui.Broadcast} broadcast
	 */
	onbroadcast : function ( broadcast ) {}
};