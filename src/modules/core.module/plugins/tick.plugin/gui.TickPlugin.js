/**
 * Tracking timed events.
 * @TODO Global timed events.
 * @extends {gui.Tracker}
 * @using {gui.Combo.chained}
 */
gui.TickPlugin = ( function using ( chained ) {

	return gui.Tracker.extend ( "gui.TickPlugin", {

		/**
		 * Add one or more tick handlers.
		 * @param {object} arg
		 * @param @optional {object} handler
		 * @param @optional {boolean} one Remove handler after on tick of this type?
		 * @returns {gui.TickPlugin}
		 */
		add : chained ( function ( arg, handler, one ) {
			handler = handler ? handler : this.spirit;
			if ( gui.Interface.validate ( gui.ITickHandler, handler )) {
				this._breakdown ( arg ).forEach ( function ( type ) {
					if ( this._addchecks ( type, [ handler, this._global ])) {
						this._add ( type, handler, false );
					}
				}, this );
			}
		}),

		/**
		 * Remove one or more tick handlers.
		 * @param {object} arg
		 * @param @optional {object} handler implements ActionListener interface, defaults to spirit
		 * @returns {gui.TickPlugin}
		 */
		remove : chained ( function ( arg, handler ) {
			handler = handler ? handler : this.spirit;
			if ( gui.Interface.validate ( gui.ITickHandler, handler )) {
				this._breakdown ( arg ).forEach ( function ( type ) {
					if ( this._removechecks ( type, [ handler, this._global ])) {
						this._remove ( type, handler );
					}
				}, this );
			}
		}),

		/**
		 * Add handler for single tick of given type(s).
		 * @TODO This on ALL trackers :)
		 * @param {object} arg
		 * @param @optional {object} handler
		 * @returns {gui.TickPlugin}
		 */
		one : chained ( function ( arg, handler ) {
			this.add ( arg, handler, true );
		}),

		/**
		 * Execute action in next available tick, 
		 * let 'this' keyword point to the spirit.
		 * @param {function} action 
		 * @param @optional {object|function} thisp
		 * @returns {gui.TickPlugin}
		 */
		next : chained ( function ( action, thisp ) {
			gui.Tick.next ( action, thisp || this.spirit );
		}),

		/**
		 * Dispatch tick after given time.
		 * @param {String} type
		 * @param {number} time Milliseconds (zero is setImmediate)
		 * @returns {gui.Tick}
		 */
		dispatch : function ( type, time ) {
			return this._dispatch ( type, time || 0 );
		},
		
		
		// Private .............................................................................

		/**
		 * Global mode?
		 * @type {boolean}
		 */
		_global : false,

		/**
		 * Add handler.
		 * @param {String} type
		 * @param {object|function} handler
		 * @param {boolean} one
		 */
		_add : function ( type, handler, one ) {
			var sig = this.spirit.$contextid;
			if ( one ) {
				if ( this._global ) {
					gui.Tick.oneGlobal ( type, handler );
				} else {
					gui.Tick.one ( type, handler, sig );
				}
			} else {
				if ( this._global ) {
					gui.Tick.addGlobal ( type, handler );
				} else {
					gui.Tick.add ( type, handler, sig );
				}
			}
		},

		/**
		 * Remove handler.
		 * @param {String} type
		 * @param {object|function} handler
		 */
		_remove : function ( type, handler ) {
			var sig = this.spirit.$contextid;
			if ( this._global ) {
				gui.Tick.removeGlobal ( type, handler );
			} else {
				gui.Tick.remove ( type, handler, sig );
			}
		},

		/**
		 * Dispatch.
		 * @param {String} type
		 * @param @optional {number} time
		 */
		_dispatch : function ( type, time ) {
			var tick, sig = this.spirit.$contextid;
			if ( this._global ) {
				tick = gui.Tick.dispatchGlobal ( type, time );
			} else {
				tick = gui.Tick.dispatch ( type, time, sig );
			}
			return tick;
		},

		/**
		 * Remove delegated handlers. 
		 * @overwrites {gui.Tracker#_cleanup}
		 * @param {String} type
		 * @param {Array<object>} checks
		 */
		_cleanup : function ( type, checks ) {
			var handler = checks [ 0 ];
			var bglobal = checks [ 1 ];
			if ( this._remove ( type, [ handler ])) {
				if ( bglobal ) {
					gui.Tick.removeGlobal ( type, handler );
				} else {
					gui.Tick.remove ( type, handler, this.$contextid );
				}
			}
		}
	});

}( gui.Combo.chained ));