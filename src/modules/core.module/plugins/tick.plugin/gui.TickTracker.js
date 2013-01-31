/** 
 * # gui.TickTracker
 * Tracking timed events.
 * @todo Global timed events.
 * @extends {gui.SpiritTracker}
 */
gui.TickTracker = gui.SpiritTracker.extend ( "gui.TickTracker", {

	/**
	 * Add one or more tick handlers.
	 * @param {object} arg
	 * @param @optional {object} handler
	 * @param @optional {boolean} one Remove handler after on tick of this type?
	 * @returns {gui.TickTracker}
	 */
	add : function ( arg, handler, one ) {
		handler = handler ? handler : this.spirit;
		if ( gui.Interface.validate ( gui.ITickHandler, handler )) {
			this._breakdown ( arg ).forEach ( function ( type ) {
				if ( this._addchecks ( type, [ handler, this._global ])) {
					this._add ( type, handler, false );
				}
			}, this );
		}
		return this;
	},

	/**
	 * Add handler for single tick of given type(s).
	 * @todo This on ALL trackers :)
	 * @param {object} arg
	 * @param @optional {object} handler
	 * @returns {gui.TickTracker}
	 */
	one : function ( arg, handler ) {
		return this.add ( arg, handler, true );
	},

	/**
	 * Quickfix.
	 * @param {function} action 
	 */
	next : function ( action ) {
		gui.Tick.next ( action, this.spirit );
	},

	/**
	 * Remove one or more tick handlers.
	 * @param {object} arg
	 * @param @optional {object} handler implements ActionListener interface, defaults to spirit
	 * @returns {gui.TickTracker}
	 */
	remove : function ( arg, handler ) {
		handler = handler ? handler : this.spirit;
		if ( gui.Interface.validate ( gui.ITickHandler, handler )) {
			this._breakdown ( arg ).forEach ( function ( type ) {
				if ( this._removechecks ( type, [ handler, this._global ])) {
					gui.Tick.remove ( type, handler );
				}
			}, this );
		}
		return this;
	},

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
	 */
	_add : function ( type, handler, one ) {
		var sig = this.spirit.signature;
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
	 */
	_remove : function ( type, handler ) {
		var sig = this.spirit.signature;
		if ( this._global ) {
			gui.Tick.removeGlobal ( type, handler );
		} else {
			gui.Tick.remove ( type, handler, sig );
		}
	},

	/**
	 * Dispatch.
	 */
	_dispatch : function ( type, time ) {
		var tick, sig = this.spirit.signature;
		if ( this._global ) {
			tick = gui.Tick.dispatchGlobal ( type, time );
		} else {
			tick = gui.Tick.dispatch ( type, time, sig );
		}
		return tick;
	},

	/**
	 * Remove delegated handlers. 
	 * @overloads {gui.SpiritTracker#_cleanup}
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
				gui.Tick.remove ( type, handler, this.signature );
			}
		}
	}
});