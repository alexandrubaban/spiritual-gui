/** 
 * ActionPlugin.
 * @extends {gui.Tracker}
 * @TODO 'one' and 'oneGlobal' methods
 * @using {gui.Arguments#confirmed}
 * @using {gui.Combo#chained}
 */
gui.ActionPlugin = ( function using ( confirmed, chained ) {
	
	return gui.Tracker.extend ( "gui.ActionPlugin", {

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
		 * Flip to a mode where the spirit will handle it's own action. Corner case scenario: 
		 * IframeSpirit watches an action while relaying the same action from external domain.
		 * @type {boolean}
		 */
		$handleownaction : false,

		/**
		 * Add one or more action handlers.
		 * @param {array|string} arg
		 * @param @optional {object|function} handler
		 * @returns {gui.ActionPlugin}
		 */
		add : confirmed ( "array|string", "(object|function)" ) (
			chained ( function ( arg, handler ) {
				handler = handler ? handler : this.spirit;
				if ( gui.Interface.validate ( gui.IActionHandler, handler )) {
					this._breakdown ( arg ).forEach ( function ( type ) {
						this._addchecks ( type, [ handler, this._global ]);
					}, this );
				}
			})
		),

		/**
		 * Remove one or more action handlers.
		 * @param {object} arg
		 * @param @optional {object} handler
		 * @returns {gui.ActionPlugin}
		 */
		remove : confirmed ( "array|string", "(object|function)" ) (
			chained ( function ( arg, handler ) {
				handler = handler ? handler : this.spirit;
				if ( gui.Interface.validate ( gui.IActionHandler, handler )) {
					this._breakdown ( arg ).forEach ( function ( type ) {
						this._removechecks ( type, [ handler, this._global ]);
					}, this );
				}
			})
		),

		/**
		 * Add global action handler(s).
		 * @param {object} arg
		 * @param @optional {object} handler
		 * @returns {gui.ActionPlugin}
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
		 * @returns {gui.ActionPlugin}
		 */
		removeGlobal : function ( arg, handler ) {
			return this._globalize ( function () {
				return this.remove ( arg, handler );
			});
		},

		/**
		 * Dispatch type(s) ascending by default.
		 * @alias {gui.ActionPlugin#ascend}
		 * @param {String} type
		 * @param @optional {object} data
		 * @param @optional {String} direction "ascend" or "descend"
		 * @returns {gui.Action}
		 */
		dispatch : confirmed ( "string", "(*)", "(string)" ) (
			function ( type, data, direction ) {
				return gui.Action.dispatch ( 
					this.spirit, 
					type, 
					data, 
					direction || "ascend",
					this._global 
				);
			}
		),

		/**
		 * Dispatch type(s) ascending.
		 * @alias {gui.ActionPlugin#dispatch}
		 * @param {object} arg
		 * @param @optional {object} data
		 * @returns {gui.Action}
		 */
		ascend : function ( arg, data ) {
			return this.dispatch ( arg, data, "ascend" );
		},

		/**
		 * Dispatch type(s) descending.
		 * @alias {gui.ActionPlugin#dispatch}
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
		 * Handle action. If it matches listeners, the action will be 
		 * delegated to the spirit. Called by `gui.Action` crawler.
		 * @see {gui.Action#dispatch}
		 * @param {gui.Action} action
		 */
		handleAction : function ( action ) {
			var list = this._xxx [ action.type ];
			if ( list ) {
				list.forEach ( function ( checks ) {
					var handler = checks [ 0 ];
					var matches = checks [ 1 ] === action.global;
					var hacking = handler === this.spirit && this.$handleownaction;
					if ( matches && ( handler !== action.target || hacking )) {
						handler.onaction ( action );
					}
				}, this );
			}
		},


		// Private ....................................................
		
		/**
		 * Remove delegated handlers. 
		 * @overwrites {gui.Tracker#_cleanup}
		 * @param {String} type
		 * @param {Array<object>} checks
		 */
		_cleanup : function ( type, checks ) {
			var handler = checks [ 0 ], global = checks [ 1 ];
			if ( global ) {
				this.removeGlobal ( type, handler );
			} else {
				this.remove ( type, handler );
			}
		}

	});

}( gui.Arguments.confirmed, gui.Combo.chained ));