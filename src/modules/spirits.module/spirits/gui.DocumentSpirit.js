/**
 * Spirit of the root HTML element.
 * @extends {gui.Spirit}
 */
gui.DocumentSpirit = gui.Spirit.extend ({

	/**
	 * Construct.
	 */
	onconstruct : function () {
		this._super.onconstruct ();
		this._dimension = new gui.Dimension ();
		this.event.add ( "message", this.window );
		this.action.addGlobal ( gui.ACTION_DOC_FIT );
		this._broadcastevents ();
		if ( this.document === document ) {
			this._constructTop ();
		}
		// @TODO iframe hello.
		this.action.dispatchGlobal ( 
			gui.ACTION_DOC_ONCONSTRUCT, 
			this.window.location.href 
		);
	},

	/**
	 * Get ready.
	 * @TODO think more about late loading (module loading) scenario
	 * @TODO let's go _waiting only if parent is a Spiritual document
	 */
	onready : function () {
		this._super.onready ();
		if (( this.waiting = this.window.gui.hosted )) {
			this.action.addGlobal ( gui.$ACTION_XFRAME_VISIBILITY );
		}
		this.action.dispatchGlobal ( gui.ACTION_DOC_ONSPIRITUALIZED );
		if ( this.document.readyState === "complete" && !this._loaded ) {
			this.onload ();
		}
	},

	/**
	 * Handle event.
	 * @param {Event} e
	 */
	onevent : function ( e ) {
		this._super.onevent ( e );
		switch ( e.type ) {
			// top document only
			case "orientationchange" :
				this._onorientationchange ();
				break;
			default : // all documents
				switch ( e.type ) {
					case "resize" :
						try {
							if ( parent === window ) { // @TODO: gui.isTop or something...
								try {
									this._onresize ();
								} catch ( normalexception ) {
									throw ( normalexception );
								}
							}
						} catch ( explorerexception ) {}
						break;
					case "load" :
						e.stopPropagation ();
						if ( !this._loaded ) {
							this._onload (); // @TODO huh? that doesn't exist!
						}
						break;
					case "message" :
						this._onmessage ( e.data );
						break;
				}
				// broadcast event globally?
				var message = gui.DocumentSpirit.broadcastevents [ e.type ];
				if ( gui.Type.isDefined ( message )) {
					this._broadcastevent ( e, message );
				}
		}
	},

	/**
	 * Handle action.s
	 * @param {gui.Action} a
	 */
	onaction : function ( a ) {
		this._super.onaction ( a );
		this.action.$handleownaction = false;
		switch ( a.type ) {
			case gui.ACTION_DOC_FIT : // relay fit, but claim ourselves as new target
				a.consume ();
				this.fit ( a.data === true );
				break;
			case gui.$ACTION_XFRAME_VISIBILITY : 
				this._waiting = false;
				if ( a.data === true ) {
					this.visibility.on ();
				} else {
					this.visibility.off ();
				}
				a.consume ();
				if ( this.window.gui.hasModule ( "flex" )){
					this.flex.reflex ();
				}
				break;
		}
	},

	/**
	 * Don't crawl for visibility inside iframed documents until 
	 * hosting {gui.IframeSpirit} has reported visibility status.
	 * @param {gui.Crawler} crawler
	 */
	oncrawler : function ( crawler ) {
		var dir = this._super.oncrawler ( crawler );
		if ( dir === gui.Crawler.CONTINUE ) {
			switch ( crawler.type ) {
				case gui.CRAWLER_VISIBLE : 
				case gui.CRAWLER_INVISIBLE :
					if ( this._waiting ) {
						dir = gui.Crawler.STOP;
					}
					break;
			}
		}
		return dir;
	},

	/**
	 * Relay visibility from ancestor frame (match iframe visibility).
	 */
	onvisible : function () {
		this.css.remove ( gui.CLASS_INVISIBLE );
		this._super.onvisible ();
	},

	/**
	 * Relay visibility from ancestor frame (match iframe visibility).
	 */
	oninvisible : function () {
		this.css.add ( gui.CLASS_INVISIBLE );
		this._super.onvisible ();
	},

	/**
	 * Invoked onDOMContentLoaded by the {gui.Guide}.
	 * Intercepted by the hosting {gui.IframeSpirit}.
	 */
	ondom : function () {
		this.action.dispatchGlobal (
			gui.ACTION_DOC_ONDOMCONTENT,
			this.window.location.href
		);
	},

	/**
	 * Invoked at window.onload by the {gui.Guide}.
	 * Intercepted by the hosting {gui.IframeSpirit}.
	 */
	onload : function () {
		if ( !this._loaded ) {
			this._loaded = true;
			this.action.dispatchGlobal (
				gui.ACTION_DOC_ONLOAD,
				this.window.location.href
			);
			/*
			var that = this;
			setTimeout ( function () {
				that.fit ();
			}, gui.Client.STABLETIME );
			*/
		} else {
			console.warn ( "@TODO loaded twice..." );
		}
	},

	/**
	 * Invoked at window.onunload by the {gui.Guide}.
	 * Action intercepted by the hosting {gui.IframeSpirit}.
	 * Broadcast intercepted by whoever might need to know. 
	 * @TODO broadcast into global space?
	 */
	onunload : function () {
		var id = this.window.gui.$contextid;
		this.action.dispatchGlobal ( gui.ACTION_DOC_UNLOAD, this.window.location.href );
		this.broadcast.dispatchGlobal ( gui.BROADCAST_WILL_UNLOAD, id );
		this.broadcast.dispatchGlobal ( gui.BROADCAST_UNLOAD, id );
	},

	/**
	 * TODO: rename to "seamless" or "fitiframe" ?
	 * Dispatch fitness info. Please invoke this method whenever 
	 * height changes: Parent iframes will resize to fit content.
	 */
	fit : function ( force ) {
		if ( this._loaded || force ) {
			var dim = this._getDimension ();
			if ( !gui.Dimension.isEqual ( this._dimension, dim )) {
				this._dimension = dim;
				this._dispatchFit ();
			}
		}
	},

	/**
	 * Propagate broadcast cross-iframes, recursively posting to neighboring documentspirits.
	 *
	 * 1. Propagate descending
	 * 2. Propagate ascending
	 * @TODO Don't post to universal domain "*" let's bypass the iframe spirit for this...
	 * @param {gui.Broadcast} b
	 */
	propagateBroadcast : function ( b ) {
		var id, ids = b.$contextids;
		ids.push ( this.window.gui.$contextid );
		var iframes = this.dom.qall ( "iframe", gui.IframeSpirit ).filter ( function ( iframe ) {
			id = iframe.$instanceid;
			if ( ids.indexOf ( id ) > -1 ) {
				return false;
			} else {
				ids.push ( id );
				return true;
			}
		});
		var msg = gui.Broadcast.stringify ( b );
		iframes.forEach ( function ( iframe ) {
			iframe.contentWindow.postMessage ( msg, "*" );
		});
		if ( this.window !== this.window.parent ) {
			this.window.parent.postMessage ( msg, "*" );
		}
	},
	
	
	// Private ...................................................................

	/**
	 * Flipped on window.onload
	 * @type {boolean}
	 */
	_loaded : false,

	/**
	 * Waiting for hosting {gui.IframeSpirit} to relay visibility status?
	 * @type {boolean}
	 */
	_waiting : false,

	/**
	 * Document width and height tracked in top document.
	 * @type {gui.Dimension} 
	 */
	_dimension : null,

	/**
	 * Timeout before we broadcast window resize ended. 
	 * This timeout cancels itself on each resize event.
	 * @type {number}
	 */
	_timeout : null,

	/**
	 * Setup to fire global broadcasts on common DOM events.
	 * @see {gui.DocumentSpirit#onevent}
	 */
	_broadcastevents : function () {
		Object.keys ( gui.DocumentSpirit.broadcastevents ).forEach ( function ( type ) {
			var target = this.document;
			switch ( type ) {
				case "scroll" :
				case "resize" : // ??????
				case "popstate" :
				case "hashchange" :
					var win = this.window;
					target = win === top ? win : null;
					break;
			}
			if ( target ) {
				this.event.add ( type, target );
			}
		}, this );
	},

	/**
	 * Fire global broadcast on DOM event.
	 * @param {Event} e
	 * @param {String} message
	 */
	_broadcastevent : function ( e, message ) {
		switch ( e.type ) {
				case "mousemove" :
				case "touchmove" :
					try {
						gui.broadcastGlobal ( message, e );
					} catch ( exception ) {
						this.event.remove ( e.type, e.target );
						throw exception;
					}
					break;
				default :
					gui.broadcastGlobal ( message, e );
					break;
		}
	},

	/**
	 * Handle message posted from subframe or xdomain.
	 * 
	 * 1. Relay broadcasts
	 * 2. Relay descending actions
	 * @param {String} msg
	 */
	_onmessage : function ( msg ) {
		var pattern = "spiritual-broadcast";
		if ( msg.startsWith ( pattern )) {
			var b = gui.Broadcast.parse ( msg );
			if ( this._relaybroadcast ( b.$contextids )) {
				gui.Broadcast.$dispatch ( b );
			}
		} else {
			pattern = "spiritual-action";
			if ( msg.startsWith ( pattern )) {
				var a = gui.Action.parse ( msg );
				if ( a.direction === gui.Action.DESCEND ) {
					if ( a.$instanceid === this.window.gui.$contextid ) {
						this.action.$handleownaction = true;
						this.action.descendGlobal ( 
							a.type, 
							a.data
						);
					}
				}
			}
		}
	},

	/**
	 * Should relay broadcast that has been postmessaged somwhat over-aggresively?
	 * @param {Array<String>} ids
	 * @returns {boolean}
	 */
	_relaybroadcast : function ( ids ) {
		return [ gui.$contextid, this.window.gui.$contextid ].every ( function ( id ) {
			return ids.indexOf ( id ) < 0;
		});
	},

	/**
	 * Dispatch document fit. Google Chrome may fail 
	 * to refresh the scrollbar properly at this point.
	 */
	_dispatchFit : function () {
		var dim = this._dimension;
		this.action.dispatchGlobal ( gui.ACTION_DOC_FIT, {
			width : dim.w,
			height : dim.h
		});
		var win = this.window;
		if( gui.Client.isWebKit ){
			win.scrollBy ( 0, 1 );
			win.scrollBy ( 0,-1 );
		}
	},

	/**
	 * Get current body dimension.
	 * @returns {gui.Dimension}
	 */
	_getDimension : function () {
		var rect = this.document.body.getBoundingClientRect ();
		return new gui.Dimension ( rect.width, rect.height );
	},

	/**
	 * Special setup for top document: Broadcast 
	 * orientation on startup and when it changes.
	 */
	_constructTop : function () {
		if ( parent === window ) {
			this._onorientationchange ();
			this.event.add ( "orientationchange", window );
		}
	},

	/**
	 * Intensive resize procedures should subscribe 
	 * to the resize-end message as broadcasted here.
	 * @TODO prevent multiple simultaneous windows
	 */
	_onresize : function () {
		this.window.clearTimeout ( this._timeout );
		this._timeout = this.window.setTimeout ( function () {
			gui.broadcastGlobal ( gui.BROADCAST_RESIZE_END );
		}, gui.TIMEOUT_RESIZE_END );
	},

	/**
	 * Device orientation changed.
	 * @TODO Move to touch module?
	 * @TODO Only in top-loaded window :)
	 * @TODO gui.SpiritDevice entity
	 */
	_onorientationchange : function () {
		gui.orientation = window.innerWidth > window.innerHeight ? 1 : 0;
		gui.broadcastGlobal ( gui.BROADCAST_ORIENTATIONCHANGE );
	}

	
}, {}, { // Static .............................................................

	/**
	 * Mapping DOM events to broadcast messages.
	 * @type {Map<String,String>}
	 */
	broadcastevents : {
		"click" : gui.BROADCAST_MOUSECLICK,
		"mousedown" : gui.BROADCAST_MOUSEDOWN,
		"mouseup" : gui.BROADCAST_MOUSEUP,
		"scroll" : gui.BROADCAST_SCROLL, // top ?
		"resize" : gui.BROADCAST_RESIZE, // top ?
		"hashchange" : gui.BROADCAST_HASHCHANGE, // top ?
		"popstate" : gui.BROADCAST_POPSTATE // top ?
		// "mousemove" : gui.BROADCAST_MOUSEMOVE (pending simplified gui.EventSummay)
	}
});