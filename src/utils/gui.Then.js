/**
 * Encapsulates a callback for future use.
 */
gui.Then = function Then () {};

gui.Then.prototype = {

	/**
	 * Unique key.
	 * @type {String}
	 */
	key : null,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {

		return "[object gui.Then]";
	},

	/**
	 * Setup callback with optional this-pointer.
	 * @param {function} callback
	 * @param @optional {object} pointer
	 */
	then : function ( callback, thisp ) {
		
		this._callback = callback ? callback : null;
		this._pointer = thisp ? thisp : null;
	},	

	/**
	 * Callback with optional this-pointer.
	 * @returns {object}
	 */
	now : function () {
		
		var c = this._callback;
		var p = this._pointer;
		if ( c ) {
			this.then ( null, null );
			c.apply ( p, arguments );
		}
	},


	// PRIVATES .................................................

	/**
	 * Callback to execute when transition is done.
	 * @type {function}
	 */
	_callback : null,
	
	/**
	 * Preserve integrity of "this" keyword in callback function.
	 * @type {object}
	 */
	_pointer : null

};
