/**
 * @class
 * Tracking actions.
 * @extends {gui.SpiritTracker}
 */
gui.ActionTracker = gui.SpiritTracker.extend ( "gui.ActionTracker", {

	/**
	 * Free slot for spirit to define any single type of action to dispatch. 
	 * @type {String}
	 */
	type : null,
	
	/**
	 * Free slot for spirit to define any single type of data to dispatch.
	 * @type {Object}
	 */
	data : null,
	
	/**
	 * Add one or more action handlers.
	 * @param {array|string} arg
	 * @param @optional {object|function} handler
	 * @returns {gui.ActionTracker}
	 */
	add : function ( arg, handler ) {
		
		if ( gui.Arguments.validate ( arguments, "array|string", "(object|function)" )) {
			handler = handler ? handler : this.spirit;
			if ( gui.Interface.validate ( gui.IActionHandler, handler )) {
				this._breakdown ( arg ).forEach ( function ( type ) {
					this._addchecks ( type, [ handler, this._global ]);
				}, this );
			}
		}
		return this;
	},
		
	/**
	 * Remove one or more action handlers.
	 * @param {object} arg
	 * @param @optional {object} handler
	 * @returns {gui.ActionTracker}
	 */
	remove : function ( arg, handler ) {
		
		if ( gui.Arguments.validate ( arguments, "array|string", "(object|function)" )) {
			handler = handler ? handler : this.spirit;
			if ( gui.Interface.validate ( gui.IActionHandler, handler )) {
				this._breakdown ( arg ).forEach ( function ( type ) {
					this._removechecks ( type, [ handler, this._global ]);
				}, this );
			}
		}
		return this;
	},

	/**
	 * Add global action handler(s).
	 * @param {object} arg
	 * @param @optional {object} handler
	 * @returns {gui.ActionTracker}
	 */
	addGlobal : function ( arg, handler ) {

		return this._globalize ( function () {
			return this.add ( arg, handler );
		});
	},

	/**
	 * Remove global action handler(s).
	 * @param {object} arg
	 * @param @optional {object} handler
	 * @returns {gui.ActionTracker}
	 */
	removeGlobal : function ( arg, handler ) {

		return this._globalize ( function () {
			return this.remove ( arg, handler );
		});
	},


	// DISPATCH ...................................................
	
	/**
	 * Dispatch type(s) ascending by default.
	 * @alias {gui.ActionTracker#ascend}
	 * @param {String} type
	 * @param @optional {object} data
	 * @param @optional {String} direction "ascend" or "descend"
	 * @returns {gui.Action}
	 */
	dispatch : function ( type, data, direction ) {
		
		if ( gui.Arguments.validate ( arguments, "string", "(*)", "(string)" )) {
			return gui.Action.dispatch ( 
				this.spirit, 
				type, 
				data, 
				direction || "ascend",
				this._global 
			);
		}
	},

	/**
	 * Dispatch type(s) ascending.
	 * @alias {gui.ActionTracker#dispatch}
	 * @param {object} arg
	 * @param @optional {object} data
	 * @returns {gui.Action}
	 */
	ascend : function ( arg, data ) {

		return this.dispatch ( arg, data, "ascend" );
	},

	/**
	 * Dispatch type(s) descending.
	 * @alias {gui.ActionTracker#dispatch}
	 * @param {object} arg
	 * @param @optional {object} data
	 * @returns {gui.Action}
	 */
	descend : function ( arg, data ) {

		return this.dispatch ( arg, data, "descend" );
	},

	/**
	 * Dispatch type(s) globally (ascending).
	 * @param {object} arg
	 * @param @optional {object} data
	 * @param @optional {String} direction
	 * @returns {gui.Action}
	 */
	dispatchGlobal : function ( arg, data ) {

		return this._globalize ( function () {
			return this.dispatch ( arg, data );
		});
	},

	/**
	 * Dispatch type(s) globally ascending.
	 * @param {object} arg
	 * @param @optional {object} data
	 * @returns {gui.Action}
	 */
	ascendGlobal : function ( arg, data ) {

		return this._globalize ( function () {
			return this.ascend ( arg, data );
		});
	},

	/**
	 * Dispatch type(s) globally descending.
	 * @param {object} arg
	 * @param @optional {object} data
	 * @returns {gui.Action}
	 */
	descendGlobal : function ( arg, data ) {

		return this._globalize ( function () {
			return this.descend ( arg, data );
		});
	},
	
	/**
	 * Handle action. The dispatching spirit will not see it's own actions
	 * @see {gui.Action#dispatch}
	 * @param {gui.Action} action
	 */
	handle : function ( action ) {
		
		var list = this._xxx [ action.type ];
		if ( list ) {
			list.forEach ( function ( checks ) {
				var handler = checks [ 0 ];
				var matches = checks [ 1 ] === action.global;
				if ( matches && handler !== action.target ) {
					handler.onaction ( action );
				}
			});
		}
	},


	// PRIVATE ....................................................

	/**
	 * Global mode?
	 * @type {boolean}
	 */
	_global : false,

	/**
	 * Execute operation in global mode.
	 * @param {function} operation
	 * @returns {object}
	 */
	_globalize : function ( operation ) {

		this._global = true;
		var res = operation.call ( this );
		this._global = false;
		return res;
	},

	/**
	 * Remove delegated handlers. 
	 * @todo verify that this works
	 * @overwrites {gui.SpiritTracker#_cleanup}
	 * @param {String} type
	 * @param {Array<object>} checks
	 */
	_cleanup : function ( type, checks ) {

		if ( this._removechecks ( type, checks )) {
			var handler = checks [ 0 ], global = checks [ 1 ];
			if ( global ) {
				this.removeGlobal ( type, handler );
			} else {
				this.remove ( type, handler );
			}
		}
	}

});