// # gui.ITickHandler
// Interface TickHandler.
gui.ITickHandler = {

	// Identification.
	// @returns {String}
	toString : function () {
		return "[object ITickHandler]";
	},

	// @static
	// Handle tick.
	// @param {gui.Tick} tick
	ontick : function ( tick ) {}
};