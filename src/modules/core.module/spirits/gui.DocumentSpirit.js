/**
 * # gui.DocumentSpirit
 * @extends {gui.Spirit}
 * Spirit of the HTML element.
 */
gui.DocumentSpirit = gui.Spirit.infuse ( "gui.DocumentSpirit", {

	/**
	 * Construct.
	 */
	onconstruct : function () {
		this._super.onconstruct ();
		this._dimension = new gui.Dimension ( 0, 0 );
		Object.keys ( this._messages ).forEach ( function ( type ) {
			var target = this.document;
			switch ( type ) {
				// case "load" : 
				case "scroll" :
				case "resize" :
				//case "popstate" :  * @todo top only? tackle history?
				//case "hashchange" :  * @todo top only? tackle history?
					target = this.window;
					break;
			}
			this.event.add ( type, target );
		}, this );
		// setup event listeners for top document only.
		if ( this.document === document ) {
			this._constructTop ();
		}
		// consuming and redispatching fit-action
		this.action.addGlobal ( gui.ACTION_DOCUMENT_FIT );
		/*
		 * BUG!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		 * @todo it appears we *must* listen for touch start events
		 * for any spirit to subscribe to touch-end events only!!!!
		 * @see {gui.SpiritTouch}
		 */
		if ( gui.Type.isDefined ( this.touch )) {
			this.touch.add ( gui.SpiritTouch.FINGER_START );
		}
		// @todo iframe hello.
		this.action.dispatchGlobal ( gui.ACTION_DOCUMENT_CONSTRUCT );
	},

	/**
	 * Get ready.
	 * @todo think more about late loading (module loading) scenario...
	 */
	onready : function () {
		this._super.onready ();
		this.action.dispatchGlobal ( gui.ACTION_DOCUMENT_READY );
		if ( this.document.readyState === "complete" && !this._isLoaded ) {
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
			// all documents
			default : 
				var message = this._messages [ e.type ];
				if ( gui.Type.isDefined ( message )) {
					switch ( e.type ) { 
						/*
						 * Nuke all touch events for now @todo move to touch module
						case "touchstart" :
						case "touchend" :
						case "touchcancel" :
						case "touchleave" :
						case "touchmove" :
							e.preventDefault ();
							break;
						*/
						case "resize" :
							var istop = this.window === window;
							if ( istop ) {
								this._onresize ();
							}
							break;
						case "load" :
							if ( !this._isLoaded ) {
								this._onload ();
							}
							break;
					}
					// Broadcast event globally.
					this._broadcast ( message, e );
				}
		}
	},

	/**
	 * Handle action.
	 * @param {gui.Action} action
	 */
	onaction : function ( action ) {
		this._super.onaction ( action );
		switch ( action.type ) {
			case gui.ACTION_DOCUMENT_FIT : // relay fit action, but claim ourselves as new action.target
				action.consume ();
				this.fit ( action.data === true );
				break;
		}
	},

	/**
	 * Hello.
	 */
	onvisible : function () {
		this.css.remove ( gui.CLASS_INVISIBLE );
		this._super.onvisible ();
	},

	/**
	 * Hello.
	 */
	oninvisible : function () {
		this.css.add ( gui.CLASS_INVISIBLE );
		this._super.onvisible ();
	},

	/**
	 * Invoked onload by the {gui.Guide}.
	 */
	onload : function () {
		// this.action.dispatch ( gui.ACTION_DOCUMENT_ONLOAD );
		if ( !this._isLoaded ) {
			this._isLoaded = true;
			this.action.dispatchGlobal ( gui.ACTION_DOCUMENT_ONLOAD );
			var that = this;
			setTimeout ( function () {
				that.fit ();
				that.tick.add ( gui.TICK_FIT );
				that.action.dispatchGlobal ( gui.ACTION_DOCUMENT_DONE );
			}, gui.Client.STABLETIME );
		} else {
			console.warn ( "@todo loaded twice..." );
		}
	},

	/**
	 * Invoked onunload by the {gui.Guide}.
	 */
	onunload : function () {
		this.action.dispatchGlobal ( gui.ACTION_DOCUMENT_UNLOAD );
	},

	/**
	 * Handle tick.
	 * @param {gui.Tick} tick
	 */
	ontick : function ( tick ) {
		this._super.ontick ( tick );
		switch ( tick.type ) {
			case gui.TICK_FIT :
				console.log("Fit " + this.document.title + " : " + Math.random());
				this.fit ( true );
				break;
		}
	},

	/**
	 * TODO: rename to "seamless" or "fitiframe" ?
	 * Dispatch fitness info. Please invoke this method whenever 
	 * height changes: Parent iframes will resize to fit content.
	 */
	fit : function ( force ) {
		if ( this._isLoaded || force ) {
			var dim = this._getDimension ();
			if ( !gui.Dimension.isEqual ( this._dimension, dim )) {
				this._dimension = dim;
				this._dispatchFit ();
			}
		}
	},
	
	
	// Private ...................................................................

	/**
	 * Flipped on window.onload
	 * @type {boolean}
	 */
	_isLoaded : false,

	/**
	 * Publish a global notification about an event in this document. This information 
	 * will be broadcasted to all windows. This way, a click event in one iframe might 
	 * close a menu in another iframe; and mousemove events can be listened for in all 
	 * documents at once. Important: If you stopPropagate() an event so that the 
	 * gui.DocumentSpirit cannot handle it, you should invoke this method manually.
	 * @param {String} message
	 * @param {Event} e
	 */
	_broadcast : function ( message, e ) {
		switch ( e.type ) {
				case "mousemove" :
				case "touchmove" :
					try { // * don't fire errors onmousemove :)
						gui.broadcast ( message, e );
					} catch ( x ) {
						this.event.remove ( e.type, e.target );
						throw x;
					}
					break;
				default :
					gui.broadcast ( message, e );
					break;
		}
	},

	/**
	 * Mapping DOM events to broadcast messages.
	 * @type {Map<String,String>}
	 */
	_messages : {
		"click"	: gui.BROADCAST_MOUSECLICK,
		"mousedown"	: gui.BROADCAST_MOUSEDOWN,
		"mouseup"	: gui.BROADCAST_MOUSEUP,
		//"mousemove"	: gui.BROADCAST_MOUSEMOVE,
		"scroll" : gui.BROADCAST_SCROLL,
		"resize" : gui.BROADCAST_RESIZE,
		//"popstate" : gui.BROADCAST_POPSTATE,
		//"hashchange" : gui.BROADCAST_HASHCHANGE,
		"touchstart" : gui.BROADCAST_TOUCHSTART,
		"touchend" : gui.BROADCAST_TOUCHEND,
		"touchcancel"	: gui.BROADCAST_TOUCHCANCEL,
		"touchleave" : gui.BROADCAST_TOUCHLEAVE,
		"touchmove"	: gui.BROADCAST_TOUCHMOVE
	},

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
	 * Dispatch document fit. Google Chrome may fail 
	 * to refresh the scrollbar properly at this point.
	 */
	_dispatchFit : function () {
		var dim = this._dimension;
		this.action.dispatchGlobal ( gui.ACTION_DOCUMENT_FIT, {
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
	 * Special setup for top document. Broadcast 
	 * orientation on startup and when it changes.
	 */
	_constructTop : function () {
		this._onorientationchange ();
		this.event.add ( "orientationchange", window );
	},

	/**
	 * Intensive resize procedures should subscribe 
	 * to the resize-end message as broadcasted here.
	 * @todo prevent multiple simultaneous windows
	 */
	_onresize : function () {
		this.window.clearTimeout ( this._timeout );
		this._timeout = this.window.setTimeout ( function () {
			gui.broadcast ( gui.BROADCAST_RESIZE_END );
		}, gui.DocumentSpirit.TIMEOUT_RESIZE_END );
	},

	/**
	 * Device orientation changed.
	 * @todo move to touch module
	 * @todo gui.SpiritDevice entity
	 */
	_onorientationchange : function () {
		gui.orientation = window.innerWidth > window.innerHeight ? 1 : 0;
		gui.broadcast ( gui.BROADCAST_ORIENTATIONCHANGE );
	}
	
	
}, {}, { 

	// Static .............................................................

	/**
	 * Timeout in milliseconds before we decide 
	 * that user is finished resizing the window.
	 */
	TIMEOUT_RESIZE_END : 50
});