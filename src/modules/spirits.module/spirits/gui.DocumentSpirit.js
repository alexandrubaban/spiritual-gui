/**
 * Spirit of the HTML element.
 * @extends {gui.Spirit}
 */
gui.DocumentSpirit = gui.Spirit.extend ({

	/**
	 * Construct.
	 */
	onconstruct : function () {
		this._super.onconstruct ();
		this._dimension = new gui.Dimension ();
		this.event.add ( "click mousedown mouseup" ); // @TODO "pointerdown" and "pointerup"
		this.event.add ( "load message hashchange", this.window );
		if ( window === top ) {
			this.event.add ( "resize orientationchange", window );
		}
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
		/*
		 * It appears that this try catch (in and by itself) will 
		 * fix some weirdo permission exceptions in Explorer 9. 
		 * @TODO: pinpoint this stuff somewhat more precisely...
		 */
		try {
			this._super.onevent ( e );
			this._onevent ( e );
		} catch ( exception ) {
			throw ( exception );
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
			if ( ids.indexOf ( id ) >-1 ) {
				return false;
			} else {
				ids.push ( id );
				return true;
			}
		});
		var msg = gui.Broadcast.stringify ( b );
		iframes.forEach ( function ( iframe ) {
			iframe.postMessage ( msg );
		});
		if ( this.window.gui.hosted ) {
			this.window.parent.postMessage ( msg, "*" ); // this.window.gui.xhost...
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
	 * Handle event.
	 * @param {Event} e
	 */
	_onevent : function ( e ) {
		switch ( e.type ) {
			case "click" :
			case "mousedown" :
			case "mouseup" :
			case "pointerdown" :
			case "pointerup" :
				this._broadcastevent ( e );
				break;
			case "orientationchange" :
				this._onorientationchange ();
				break;
			case "resize" :
				this._onresize ();
				break;
			case "load" :
				e.stopPropagation (); // @TODO: needed?
				break;
			case "message" :
				this._onmessage ( e.data, e.origin, e.source );
				break;
			case "hashchange" :
				this.action.dispatchGlobal ( 
					gui.ACTION_DOC_ONHASH, 
					this.document.location.hash
				);
				break;
		}
	},

	/**
	 * Fire global broadcast on DOM event.
	 * @param {Event} e
	 */
	_broadcastevent : function ( e ) {
		gui.broadcastGlobal (({
			"click" : gui.BROADCAST_MOUSECLICK,
			"mousedown" : gui.BROADCAST_MOUSEDOWN,
			"mouseup" : gui.BROADCAST_MOUSEUP
		})[ e.type ], e );
	},

	/**
	 * Handle message posted from subframe or xdomain.
	 * 
	 * 1. Relay broadcasts
	 * 2. Relay descending actions
	 * @param {String} msg
	 * @param {String} origin
	 * @param {Window} source
	 */
	_onmessage : function ( msg, origin, source ) {
		var pattern = "spiritual-broadcast";
		if ( msg.startsWith ( pattern )) {
			var b = gui.Broadcast.parse ( msg );
			if ( this._relaybroadcast ( b.$contextids, origin, source )) {
				gui.Broadcast.$dispatch ( b );
			}
		} else {
			if ( source === this.window.parent ) {
				pattern = "spiritual-action";
				if ( msg.startsWith ( pattern )) {
					var a = gui.Action.parse ( msg );
					if ( a.direction === gui.Action.DESCEND ) {
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
	 * Should relay broadcast that has been postmessaged somewhat over-aggresively?
	 * @param {Array<String>} ids
	 * @param {String} origin
	 * @param {Window} source
	 * @returns {boolean}
	 */
	_relaybroadcast : function ( ids, origin, source  ) {
		var localids = [ gui.$contextid, this.window.gui.$contextid ];
		return origin === this.window.gui.xhost || localids.every ( function ( id ) {
			return ids.indexOf ( id ) < 0;
		});
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
	
});