/**
 * # gui.AttentionPlugin
 * Keyboard TAB manager (to be exported out of Spiritual core).
 * @extends {gui.SpiritTracker}
 * @todo nested attention traps (conflicts with missing focusin in FF?)
 * @todo empty queue when user moves escapes (all) attention traps?
 * @todo more life cycle hookins (hide, show, detach, exit)
 */
gui.AttentionPlugin = gui.SpiritPlugin.extend ( "gui.AttentionPlugin", {

	/**
	 * Trapping TAB navigation inside the spirit subtree.
	 * @returns {gui.AttentionPlugin}
	 */
	trap : function () {
		if ( !this._trapping ) {
			this._trapping = true;
			this._listen ();
			this._setup ();
		}
		return this;
	},

	/**
	 * Focus the last focused  element, defaulting to first focusable element.
	 * @returns {gui.AttentionPlugin}
	 */
	focus : function () {
		if ( !this._focused ) {
			if ( this._latest ) {
				this._latest.focus ();
			} else {
				this._first ();
			}
		}
		return this;
	},

	/**
	 * Blur anything that might be focused.
	 * @todo definitely not like this...
	 * @returns {gui.AttentionPlugin}
	 */
	blur : function () { 
		gui.Broadcast.dispatchGlobal ( null,
			gui.BROADCAST_ATTENTION_OFF,
			this.spirit.spiritkey
		);
		if ( this._focused ) {
			if ( this._latest ) {
				this._latest.blur ();
			}
		}
		return this;
	},

	/**
	 * Something was focused or blurred.
	 * @param {Event} e
	 */
	handleEvent : function ( e ) {
		switch ( e.type ) {
			case "blur" :
			case "focusout" :
				this._onblur ( e.target );
				break;
			case "focus" :
			case "focusin" :
				this._onfocus ( e.target );
				break;
		}
	},

	/**
	 * Handle broadcast.
	 * @param {gui.Broadcast} b
	 */
	onbroadcast : function ( b ) {
		if ( b.type === gui.BROADCAST_ATTENTION_GO ) {
			if ( b.data === this.spirit.spiritkey ) {
				this.focus ();
			}
		}
	},

	/**
	 * Handle spirit life cycle.
	 * @param {gui.SpiritLife} life
	 */
	onlife : function ( life ) {
		switch ( life.type ) {
			case gui.SpiritLife.DESTRUCT :
				gui.Broadcast.removeGlobal ( gui.BROADCAST_ATTENTION_GO, this );
				gui.Broadcast.dispatchGlobal ( null,
					gui.BROADCAST_ATTENTION_OFF,
					this.spirit.spiritkey
				);
				break;
		}
	},


	// PRIVATES ........................................................................

	/**
	 * Trapping attention?
	 * @type {boolean}
	 */
	_trapping : null,

	/**
	 * Latest focused element.
	 * @type {Element}
	 */
	_latest : null,

	/**
	 * Used to determine whether attention trap was just entered.
	 * @type {number}
	 */
	_flag : false,

	/**
	 * Append hidden inputs. When these are 
	 * focused, we move the focus elsewhere.
	 */
	_setup : function () {
		[ "before", "after" ].forEach ( function ( pos ) {
			var elm = this._input ( pos );
			var dom = this.spirit.dom;
			if ( pos === "before" ) {
				dom.prepend ( elm );
			} else {
				dom.append ( elm );
			}
		}, this );
	},

	/**
	 * Listen for all sorts of stuff going on.
	 * @todo use focusin and focusout for IE/Opera?
	 */
	_listen : function () {
		var elm = this.spirit.element;
		elm.addEventListener ( "focus", this, true );
		elm.addEventListener ( "blur", this, true );
		this.spirit.life.add ( gui.SpiritLife.DESTRUCT, this );
		gui.Broadcast.addGlobal ( gui.BROADCAST_ATTENTION_GO, this );
	},

	/**
	 * Insert hidden input at position.
	 * @todo how to *keep* inputs at first and last position?
	 * @todo removeEventListener on dispose perhaps
	 * @param {String} pos
	 * @returns {Element}
	 */
	_input : function ( pos ) {
		var dom = this.spirit.dom;
		var doc = this.spirit.document;
		var elm = gui.SpiritCSS.style ( 
			doc.createElement ( "input" ), {
				position : "absolute",
				opacity : 0,
				top: -5000
			}
		);
		elm.className = "_gui-focus_" + pos;
		return elm;
	},

	/**
	 * Focus first element and return it.
	 * @returns {Element}
	 */
	_first : function () {
		return this._find ( true );
	},

	/**
	 * Focus last element and return it.
	 * @returns {Element}
	 */
	_last : function () {
		return this._find ( false );
	},

	/**
	 * Find first or last form control.
	 * @param {boolean} isfirst
	 */
	_find : function ( isfirst ) {
		var elm = null, all = this._elements ();
		if ( all.length ) {
			elm = all [ isfirst ? 0 : all.length - 1 ];
			elm.focus ();
		}
		return elm;
	},

	/**
	 * List descendant form controls *plus* links except input @type="image".
	 * @returns {Array<Element>}
	 */
	_elements : function () {
		return this.spirit.dom.descendants ().filter ( function ( elm ) {
			return this._focusable ( elm ) ? elm : undefined;
		}, this );
	},

	/**
	 * Element is focusable form control or link?
	 * Excluding the hidden inputs for TAB contain.
	 * @param {Element} elm
	 * @returns {boolean}
	 */
	_focusable : function ( elm ) {
		var is = false;
		switch ( elm.localName ) {
			case "input" :
			case "textarea" :
			case "select" :
			case "button" :
			case "a" :
				if ( elm.tabIndex >-1 ) {
					if ( elm.type !== "image" ) {						
						if ( !elm.className.startsWith ( "_gui-focus" )) {
							is = true;
						}
					}
				}
				break;
		}
		return is;
	},

	/**
	 * Something was focused.
	 * @param {Element} elm
	 */
	_onfocus : function ( elm ) {
		this._focused = true;
		this._latest = elm;
		// first time focus?
		if ( !this._flag ) {
			this._didcatch ();
			this._flat = true;
		}
		// was hidden input?
		var klas = elm.className;
		if ( klas.startsWith ( "_gui-focus" )) {
			if ( klas.contains ( "after" )) {
				this._first ();
			} else {
				this._last ();
			}
		}
	},

	/**
	 * Something was blurred.
	 */
	_onblur : function ( node ) {
		this._focused = false;
		gui.Tick.next ( function () {
			if ( !this._focused ) {
				this._didescape ();
			}
		}, this );
	},

	/**
	 * Attention trap entered.
	 */
	_didcatch : function () {
		gui.Broadcast.dispatchGlobal ( null,
			gui.BROADCAST_ATTENTION_ON,
			this.spirit.spiritkey
		);
	},

	/**
	 * Attention trap escaped.
	 */
	_didescape : function () {
		this._flag = false;
		gui.Broadcast.dispatchGlobal ( null,
			gui.BROADCAST_ATTENTION_OFF,
			this.spirit.spiritkey
		);
	}


}, { // STATICS ........................................................................

	/**
	 * @type {Array<String>}
	 */
	_queue : [],

	/**
	 * Get next in line.
	 * @todo continue until next is not hidden.
	 * @returns {String}
	 */
	_next : function () {
		var q = this._queue; 
		return q [ q.length - 1 ];
	},

	/**
	 * Handle broadcast.
	 * @param {gui.Broadcast} b
	 */
	onbroadcast : function ( b ) {
		var q = this._queue;
		switch ( b.type ) {
			case gui.BROADCAST_ATTENTION_ON :
				if ( this._next () !== b.data ) {
					q.push ( b.data );
				}
				break;
			case gui.BROADCAST_ATTENTION_OFF :
				q = this._queue = q.filter ( function ( key ) {
					if ( key !== b.data ) {
						return key;
					}
				});
				if ( q.length ) {
					gui.Broadcast.dispatchGlobal ( null,
						gui.BROADCAST_ATTENTION_GO,
						this._next ()
					);
				}
				break;
		}
	}

});

/**
 * Manage attention queue.
 */
( function () {
	gui.Broadcast.addGlobal ([ 
		gui.BROADCAST_ATTENTION_ON,
		gui.BROADCAST_ATTENTION_OFF
	], gui.AttentionPlugin );
}());