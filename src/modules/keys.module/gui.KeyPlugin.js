/**
 * Tracking keys.
 * @extends {gui.Tracker}
 * @using {gui.Arguments#confirmed}
 * @using {gui.Combo#chained}
 */
gui.KeyPlugin = ( function using ( confirmed, chained ) {

	return gui.Tracker.extend ( "gui.KeyPlugin", {
	
		/**
		 * Add one or more action handlers.
		 * @param {Array<String,Number>|String|number} arg @TODO Strings!
		 * @param @optional {object|function} handler
		 * @returns {gui.KeyPlugin}
		 */
		add : confirmed ( "array|string", "(object|function)" ) (
			chained ( function ( arg, handler ) {
				handler = handler ? handler : this.spirit;
				if ( gui.Interface.validate ( gui.IKeyHandler, handler )) {
					this._breakdown ( arg ).forEach ( function ( a ) {
						a = gui.Type.cast ( a );
						if ( this._addchecks ( a, [ handler, this._global ])) {
							gui.Broadcast.addGlobal ( gui.BROADCAST_KEYEVENT, this );
						}
					}, this );
				}
			})
		),

		/**
		 * Remove one or more action handlers.
		 * @param {Array<String,Number>|String|number} arg
		 * @param @optional {object} handler
		 * @returns {gui.KeyPlugin}
		 */
		remove : confirmed ( "array|string", "(object|function)" ) (
			chained ( function ( arg, handler ) {
				handler = handler ? handler : this.spirit;
				if ( gui.Interface.validate ( gui.IKeyHandler, handler )) {
					this._breakdown ( arg ).forEach ( function ( a ) {
						a = gui.Type.cast ( a );
						if ( this._removechecks ( a, [ handler, this._global ])) {
							if ( !this._hashandlers ()) {
								gui.Broadcast.removeGlobal ( gui.BROADCAST_KEYEVENT, this );
							}	
						}
					}, this );
				}
			})
		),

		/**
		 * Add handlers for global key(s).
		 * @param {object} arg
		 * @param @optional {gui.IKeyListener} handler (defaults to spirit)
		 * @returns {gui.KeyPlugin}
		 */
		addGlobal : function ( arg, handler ) {
			return this._globalize ( function () {
				return this.add ( arg, handler );
			});
		},

		/**
		 * Add handlers for global keys(s).
		 * @param {object} arg
		 * @param @optional {gui.IKeyListener} handler (defaults to spirit)
		 * @returns {gui.KeyPlugin}
		 */
		removeGlobal : function ( arg, handler ) {
			return this._globalize ( function () {
				return this.remove ( arg, handler );
			});
		},

		/**
		 * Handle broadcast.
		 * @param {gui.Broadcast} b
		 */
		onbroadcast : function ( b ) {
			var list, checks, handler, global;
			if ( b.type === gui.BROADCAST_KEYEVENT ) {
				var d = b.data.down, n = b.data.code, c = b.data.char;
				if (( list = ( this._xxx [ n ] || this._xxx [ c ]))) {
					list.forEach ( function ( checks ) {
						handler = checks [ 0 ];
						global = checks [ 1 ];
						if ( global === b.isGlobal ) {
							handler.onkey ( 
								new gui.Key ( d, n, c, global )
							);
						}
					});
				}
			}
		},


		// Private .....................................................................
		
		/**
		 * Remove delegated handlers. 
		 * @TODO same as in gui.ActionPlugin, perhaps superize this stuff somehow...
		 */
		_cleanup : function ( type, checks ) {
			//if ( this._removechecks ( type, checks )) {
				var handler = checks [ 0 ], global = checks [ 1 ];
				if ( global ) {
					this.removeGlobal ( type, handler );
				} else {
					this.remove ( type, handler );
				}
			//}
		}

	}, {}, { // Static ...............................................................

	});

}( gui.Arguments.confirmed, gui.Combo.chained ));