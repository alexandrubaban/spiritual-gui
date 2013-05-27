/**
 * Keys module.
 * @TODO http://www.w3.org/TR/DOM-Level-3-Events/#events-keyboardevents
 * @TODO http://dev.opera.com/articles/view/functional-key-handling-in-opera-tv-store-applications/
 */
gui.module ( "keys", {

	/**
	 * Channeling spirits to CSS selectors.
	 */
	channels : [
		[ "meta[content=key]", gui.KeySpirit ]
	],

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
		 * @implements {gui.IKeyHandler}
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
		if ( false && gui.Type.isDefined ( e.repeat )) {
			this._newschool ( e );
		} else {
			this._oldschool ( e );
		}
	},

	/**
	 * DOM3 style events. Skipped for now since Opera 12 appears 
	 * to fire it all repeatedly while key pressed, is it correct? 
	 * Also, event.repeat is always false, that doesn't make sense...
	 * @param {Event} e
	 */
	_newschool : function ( e ) {
		// skipped for now
	},

	/**
	 * Conan the Barbarian style events.
	 * @param {Event} e
	 */
	_oldschool : function ( e ) {
		var n = e.keyCode, c = this._keymap [ n ], b = gui.BROADCAST_KEYEVENT;
		var sig = e.currentTarget.defaultView.gui.$contextid;

		//e.stopPropagation ();
		//e.preventDefault ();

		switch ( e.type ) {
			case "keydown" :
				//console.log ( String.fromCharCode(e.keyCode) );
				if ( c === undefined ) {
					this._keycode = n;
					this._keymap [ n ] = null;
					gui.Tick.next ( function () {
						c = this._keymap [ n ];
						this._broadcast ( true, null, c, n , sig);
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
					this._broadcast ( false, null, c, n, sig );
					delete this._keymap [ n ];
				}
				break;
		}
	},

	/**
	 * Broadcast key details globally. Details reduced to a boolean 'down' and a 'type' 
	 * string to represent typed character (single letter) or special key (multi letter). 
	 * Note that the SPACE character is broadcasted as the multi-letter type "Space".
	 * @TODO what other pseudospecial keys are mapped to typed characters (like SPACE)?
	 * @param {boolean} down
	 * @param {String} key Newschool
	 * @param {String} c (char) Bothschool
	 * @param {number} code Oldschool
	 * @param {String} sig Contextkey
	 */
	_broadcast : function ( down, key, c, code, sig ) {
		var type = c !== null ? c : ( key !== null ? key : gui.Key.$key [ code ]);
		var msg = gui.BROADCAST_KEYEVENT;
		var arg = { down : down, type : type };
		type = type === " " ? gui.Key.SPACE : type;
		gui.Broadcast.dispatch ( null, msg, arg, sig );
		gui.Broadcast.dispatchGlobal ( null, msg, arg );
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

/*
 * Register broadcast type.
 */
gui.BROADCAST_KEYEVENT = "gui-broadcast-keyevent";