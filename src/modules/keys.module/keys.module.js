/**
 * Keys module.
 * @TODO http://www.w3.org/TR/DOM-Level-3-Events/#events-keyboardevents
 * @TODO http://dev.opera.com/articles/view/functional-key-handling-in-opera-tv-store-applications/
 */
gui.module ( "keys", {

	/*
	 * Plugins (for all spirits).
	 */
	plugins : {
		"key" : gui.KeyPlugin
	},

	/*
	 * Mixins (for all spirits).
	 */
	mixins : {
		/**
		 * Handle key.
		 * @param {gui.Key} key
		 */
		onkey : function ( key ) {}
	},

	/**
	 * Context init.
	 * @param {Window} context
	 */
	oncontextinitialize : function ( context ) {
		this._keymap = Object.create ( null );
		[ "keydown", "keypress", "keyup" ].forEach ( function ( type ) {
			context.document.addEventListener ( type, this, false );
		}, this );
	},

	/**
	 * Handle event.
	 * @param {KeyEvent} e
	 */
	handleEvent : function ( e ) {
		this._modifiers ( e );
		if ( gui.Type.isDefined ( e.repeat )) {
			this._newschool ( e );
		} else {
			this._oldschool ( e );
		}
	},

	/**
	 * DOM2.5 style events blending event keyCode (now legacy) and char (now spec). 
	 * Opera 12 appears to fire keyup repeatedly while key presses, is it correct? 
	 * @param {Event} e
	 */
	_newschool : function ( e ) {
		var c = e.char, n = e.keyCode, b = gui.BROADCAST_KEYEVENT;
		switch ( e.type ) {
			case "keydown" :
				this._keymap [ n ] = c;
				gui.Broadcast.dispatchGlobal ( null, b, {
					down : true,
					char : c,
					code : n
				});
				break;
			case "keyup" :
				delete this._keymap [ n ];
				var that = this;
				setTimeout ( function () {
					if ( !that._keymap [ n ]) {
						console.log ( Math.random ());
						gui.Broadcast.dispatchGlobal ( null, b, {
							down : false,
							char : c,
							code : n
						});
					}
				});
				/*
				gui.Tick.next ( function () {
					if ( !this._keymap [ n ]) {
						console.log ( Math.random ());
						gui.Broadcast.dispatchGlobal ( null, b, {
							down : false,
							char : c,
							code : n
						});
					}
				}, this );
				*/
				break;
		}
	},

	/**
	 * Conan the Barbarian style events.
	 * @param {Event} e
	 */
	_oldschool : function ( e ) {
		var n = e.keyCode, c = this._keymap [ n ], b = gui.BROADCAST_KEYEVENT;
		switch ( e.type ) {
			case "keydown" :			
				if ( c === undefined ) {
					this._keycode = n;
					this._keymap [ n ] = null;
					gui.Tick.next ( function () {
						c = this._keymap [ n ];
						gui.Broadcast.dispatchGlobal ( null, b, {
							down : true,
							char : c,
							code : n
						});
						this._keycode = null;
					}, this );
				}
				break;
			case "keypress" :
				if ( this._keycode ) {
					c = this._keychar ( e.keyCode, e.charCode, e.which );
					this._keymap [ this._keycode ] = c;
				}
				break;
			case "keyup" :
				if ( c !== undefined ) {
					gui.Broadcast.dispatchGlobal ( null, b, {
						down : false,
						char : c,
						code : n
					});
					delete this._keymap [ n ];
				}
				break;
		}
	},


	// Private ......................................................
	
	_keymap : null,

	/**
	 * Update key modifiers state.
	 * @TODO Cross platform abstractions "accelDown" and "accessDown"
	 * @param {KeyEvent} e
	 */
	_modifiers : function ( e ) {
		gui.Key.ctrlDown = e.ctrlKey;
		gui.Key.shiftDown = e.shiftKey;
		gui.Key.altDown = e.altKey;
		gui.Key.metaDown = e.metaKey;
	},

	/**
	 * Get character for event details on keypress only. 
	 * Returns null for special keys such as arrows etc.
	 * http://javascript.info/tutorial/keyboard-events
	 * @param {number} n
	 * @param {number} c
	 * @param {number} which
	 * @return {String}
	 */
	_keychar : function ( n, c, which ) {
		if ( which === null || which === undefined ) {
			return String.fromCharCode ( n ); // IE (below 9 or what?)
	  } else if ( which !== 0 && c ) { // c != 0
	    return String.fromCharCode ( which ); // the rest
	  }
	  return null;
	}

});

( function keybroadcasts () {
	gui.BROADCAST_KEYEVENT = "gui-broadcast-keyevent";
}());