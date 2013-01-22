// # gui.TweenTracker
// Tracking tweens.
// @extends {gui.SpiritTracker}
gui.TweenTracker = gui.SpiritTracker.extend ( "gui.TweenTracker", {

	// Add one or more broadcast handlers.
	// @param {object} arg
	// @returns {gui.TweenTracker}
	add : function ( arg ) {
		var sig = this._global ? null : this._sig;
		var message = gui.BROADCAST_TWEEN;
		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._addchecks ( type, [ this._global ])) {
				if ( this._global ) {
					gui.Broadcast.addGlobal ( message, this );
				} else {
					gui.Broadcast.add ( message, this, sig );
				}
			}
		}, this );
		return this;
	},

	// Remove one or more broadcast handlers.
	// @param {object} arg
	// @returns {gui.TweenTracker}
	remove : function ( arg ) {
		var sig = this._global ? null : this._sig;
		var message = gui.BROADCAST_TWEEN;
		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._removechecks ( type, [ this._global ])) {
				// what
			}
		}, this );
		return this;
	},

	// Dispatch type(s).
	// @param {object} arg
	// @param @optional {object} data
	// @returns {gui.Tween}
	dispatch : function ( arg, data ) {
		var result = null;
		var sig = this._global ? null : this._sig;
		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._global ) {
				result = gui.Tween.dispatchGlobal ( type, data );
			} else {
				result = gui.Tween.dispatch ( type, data, sig );	
			}
		}, this );
		return result;
	},

	// Add handlers for global broadcast(s).
	// @param {object} arg
	// @returns {gui.TweenTracker}
	addGlobal : function ( arg ) {
		return this._globalize ( function () {
			return this.add ( arg );
		});
	},

	// Add handlers for global broadcast(s).
	// @param {object} arg
	// @returns {gui.TweenTracker}
	removeGlobal : function ( arg ) {
		return this._globalize ( function () {
			return this.remove ( arg );
		});
	},

	// Dispatch type(s) globally.
	// @param {object} arg
	// @param @optional {object} data
	// @returns {gui.Tween}
	dispatchGlobal : function ( arg, data ) {
		return this._globalize ( function () {
			return this.dispatch ( arg, data );
		});
	},

	// Handle broadcast.
	// @param {gui.Broadcast} b
	onbroadcast : function ( b ) {
		switch ( b.type ) {
			case gui.BROADCAST_TWEEN :
				var tween = b.data;
				if ( this._containschecks ( tween.type, [ b.isGlobal ])) {
					this.spirit.ontween ( tween );
				}
				break;
		}
	},

	// PRIVATES ...................................................................

	// Global mode?
	// @type {boolean}
	_global : false,

	// Execute operation in global mode.
	// @param {function} operation
	// @returns {object}
	_globalize : function ( operation ) {
		this._global = true;
		var res = operation.call ( this );
		this._global = false;
		return res;
	},

	// Remove broadcast subscriptions on dispose.
	// @overwrites {gui.SpiritTracker#_cleanup}
	// @param {String} type
	// @param {Array<object>} checks
	_cleanup : function ( type, checks ) {
		var message = gui.BROADCAST_TWEEN;
		if ( this._removechecks ( type, checks )) {
			var global = checks [ 0 ];
			var sig = global ? null : this._sig;
			if ( global ) {
				gui.Broadcast.removeGlobal ( message, this );
			} else {
				gui.Broadcast.remove ( message, this, this._sig );
			}
		}
	}

});