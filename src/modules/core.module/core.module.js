/**
 * It's the core module.
 */
gui.module ( "core", {

	/**
	 * Assign plugins to all spirits.
	 */
	plugins : {
		"action" : gui.ActionPlugin,
		"broadcast" : gui.BroadcastPlugin,
		"tick" : gui.TickPlugin
	},

	/**
	 * Methods added to all spirits.
	 */
	mixins : {

		/**
		 * Handle action.
		 * @param {gui.Action} action
		 */
		onaction : function ( action ) {},

		/**
		 * Handle broadcast.
		 * @param {gui.Broadcast} broadcast
		 */
		onbroadcast : function ( broadcast ) {},

		/**
		 * Handle tick (timed event).
		 * @param {gui.Tick} tick
		 */
		ontick : function ( tick ) {}
	}

});