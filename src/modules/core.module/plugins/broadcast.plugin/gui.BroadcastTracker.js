/**
 * Tracking broadcasts.
 * @extends {gui.SpiritTracker}
 */
gui.BroadcastTracker = gui.SpiritTracker.extend ( "gui.BroadcastTracker", {
	
	/**
	 * Add one or more broadcast handlers.
	 * @param {object} arg
	 * @param @optional {object} handler implements BroadcastListener (defaults to spirit)
	 * @returns {gui.BroadcastTracker}
	 */
	add : function ( arg, handler ) {
		
		handler = handler ? handler : this.spirit;
		var sig = this._global ? null : this._sig;
		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._addchecks ( type, [ handler, this._global ])) {
				if ( this._global ) {
					gui.Broadcast.addGlobal ( type, handler );
				} else {
					gui.Broadcast.add ( type, handler, sig );
				}
			}
		}, this );
		return this;
	},
	
	/**
	 * Remove one or more broadcast handlers.
	 * @param {object} arg
	 * @param @optional {object} handler implements BroadcastListener (defaults to spirit)
	 * @returns {gui.BroadcastTracker}
	 */
	remove : function ( arg, handler ) {
		
		handler = handler ? handler : this.spirit;
		var sig = this._global ? null : this._sig;
		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._removechecks ( type, [ handler, this._global ])) {
				if ( this._global ) {
					gui.Broadcast.removeGlobal ( type, handler );
				} else {
					gui.Broadcast.remove ( type, handler, sig );
				}
			}
		}, this );
		return this;
	},

	/**
	 * Dispatch type(s).
	 * @param {object} arg
	 * @param @optional {object} data
	 * @returns {gui.Broadcast}
	 */
	dispatch : function ( arg, data ) {
		
		var result = null;
		var sig = this._global ? null : this._sig;
		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._global ) {
				result = gui.Broadcast.dispatchGlobal ( this.spirit, type, data );
			} else {
				result = gui.Broadcast.dispatch ( this.spirit, type, data, sig );	
			}
		}, this );
		return result;
	},

	/**
	 * Add handlers for global broadcast(s).
	 * @param {object} arg
	 * @param @optional {object} handler implements BroadcastListener (defaults to spirit)
	 * @returns {gui.BroadcastTracker}
	 */
	addGlobal : function ( arg, handler ) {
		
		return this._globalize ( function () {
			return this.add ( arg, handler );
		});
	},
	
	/**
	 * Add handlers for global broadcast(s).
	 * @param {object} arg
	 * @param @optional {object} handler implements BroadcastListener (defaults to spirit)
	 * @returns {gui.BroadcastTracker}
	 */
	removeGlobal : function ( arg, handler ) {
		
		return this._globalize ( function () {
			return this.remove ( arg, handler );
		});
	},
	
	/**
	 * Dispatch type(s) globally.
	 * @param {object} arg
	 * @param @optional {object} data
	 * @returns {gui.Broadcast}
	 */
	dispatchGlobal : function ( arg, data ) {
		
		return this._globalize ( function () {
			return this.dispatch ( arg, data );
		});
	},

	// PRIVATES ...................................................................

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
	 * @overwrites {gui.SpiritTracker#_cleanup}
	 * @param {String} type
	 * @param {Array<object>} checks
	 */
	_cleanup : function ( type, checks ) {
		
		if ( this._removechecks ( type, checks )) {
			var handler = checks [ 0 ], global = checks [ 1 ];
			var sig = global ? null : this._sig;
			if ( global ) {
				gui.Broadcast.removeGlobal ( type, handler );
			} else {
				gui.Broadcast.remove ( type, handler, this._sig );
			}
		}
	}

});

/**
 * TODO: get rid of this.
 */
( function () {
	var temp_backup = {

		/**
		 * Encode all broadcasted objects as JSON strings. This will come in 
		 * handy if we plan to use cross-domain broadcasting at some point.
		 * @returns {gui.BroadcastTracker}
		 */
		encode : function () {

			this._encoding = true;
			return this;
		},

		/**
		 * Don't encode broadcasted objects as JSON.
		 * @returns {gui.BroadcastTracker}
		 */
		normalize : function () {
			
			this._encoding = false;
			return this;
		},
		
		/**
		 * Auto-encode broadcast data as JSON string. This will conjure an exception if the 
		 * object could not be stringified. Strings, numbers and booleans are left untouched.
		 * @type {Boolean}
		 */
		_encoding : false,

		/**
		 * JSON encode broadcast data?
		 * @param {object} data
		 * @returns {String}
		 */
		_encode : function ( data ) {

			if ( this._encoding ) {
				var type = gui.Type.of ( data );
				switch ( type ) {
					case "string" :
					case "number" :
					case "boolean" :
						break;
					case "object" :
					case "array" :
						var debug = this.window.gui.debug;
						try {
							data = JSON.stringify ( data, null, debug ? "\t" : null ); // TODO: catch parse exception
						} catch ( jsonex ) {
							throw new Error ( "JSON encoding of broadcast failed: " + jsonex );
							data = null;
						}
						break;
					default :
						throw new Error ( "Will not JSON encode broadcast of type: " + type );
						break;
				}
			}
			return data;
		}
	};
});