/**
 * Spirit of the iframe.
 * @extends {gui.Spirit}
 */
gui.IframeSpirit = gui.Spirit.infuse ( "gui.IframeSpirit", {

	/**
	 * True when hosting xdomain stuff.
	 * @type {boolean}
	 */
	external : false,

	/**
	 * Hosted window.
	 * @type {Window}
	 */
	contentWindow : {
		getter : function () {
			return this.element ? this.element.contentWindow : null;
		},
		setter : function () {
			// @TODO Or else the getter malfunctions!
		}
	},

	/**
	 * Hosted document.
	 * @type {Document}
	 */
	contentDocument : {
		getter : function () {
			return this.element ? this.element.contentDocument : null;
		},
		setter : function () {
			// @TODO Or else the getter malfunctions!
		}
	},

	/**
	 * Get ready.
	 */
	onready : function () {
		this._super.onready ();
		this.event.add ( "message", this.window, this );
	},

	/**
	 * Handle event.
	 * @param {Event} e
	 */
	onevent : function ( e ) {
		this._super.onevent ( e );
		if ( e.type === "message" && this.external ) {
			this._onmessage ( e.data );
		}
	},

	/**
	 * Get and set the iframe source.
	 * @param @optional {String} src
	 */
	src : function ( src ) {
		if ( gui.Type.isString ( src )) {
			if ( gui.IframeSpirit.isExternal ( src )) {
				src = gui.IframeSpirit.sign ( src, this.document, this.$instanceid );
				this.external = true;
			}
			this.element.src = src;
		} else {
			return this.element.src;
		}
	},


	// Private ..................................................................
	
	/**
	 * Handle posted message, scanning for ascending actions. 
	 * Descending actions are handled by the documentspirit.
	 * @TODO Don't claim this as action target!
	 * @see {gui.DocumentSpirit._onmessage}
	 * @param {String} msg
	 */
	_onmessage : function ( msg ) {
		if ( this.external && msg.startsWith ( "spiritual-action:" )) {
			var a = gui.Action.parse ( msg );
			if ( a.direction === gui.Action.ASCEND ) {
				if ( a.$instanceid === this.$instanceid ) {
					this.action.ascendGlobal ( a.type, a.data );
				}
			}
		}
	}

	
}, { // Recurring static ......................................................

	/**
	 * Summon spirit.
	 * @TODO why does spirit.src method fail strangely just now? using iframe.src instead...
	 * @param {Document} doc
	 * @param @optional {String} src
	 * @returns {gui.IframeSpirit}
	 */
	summon : function ( doc, src ) {
		var iframe = doc.createElement ( "iframe" );
		var spirit = this.possess ( iframe );
		spirit.css.add ( "gui-iframe" );
		if ( src ) {
			if ( gui.IframeSpirit.isExternal ( src )) { // should be moved to src() method!!!!!
				src = this.sign ( src, doc, spirit.$instanceid );
				spirit.external = true;
			}
		} else {
			src = this.SRC_DEFAULT;	
		}
		iframe.src = src;
		return spirit;
	}


}, { // Static ................................................................

	/**
	 * Presumably harmless iframe source. The issue here is that "about:blank" 
	 * may raise security concerns for some browsers when running HTTPS setup.
	 * @type {String}
	 */
	SRC_DEFAULT : "javascript:void(false);",

	/**
	 * Overwrite this property to create a parameter name for  
	 * signing that looks somewhat less like a spyware attack.
	 * @type {String}
	 */
	KEY_SIGNATURE : "spiritual-signature",

	/**
	 * Sign URL with cross-domain credentials 
	 * and key to identify the IframeSpirit.
	 * @param {String} url
	 * @param {Document} doc
	 * @param {String} key
	 * @returns {String}
	 */
	sign : function ( url, doc, key ) {
		var loc = doc.location;
		var uri = loc.protocol + "//" + loc.host;
		var sig = uri + "/" + key;
		return gui.URL.setParam ( url, this.KEY_SIGNATURE, sig );
	},

	/**
	 * Remove signature from URL (for whatever reason).
	 * @param {String} url
	 * @param {String} sign
	 * @returns {String}
	 */
	unsign : function ( url ) {	
		return gui.URL.setParam ( url, this.KEY_SIGNATURE, null );
	},

	/**
	 * Is external address?
	 * @returns {boolean}
	 */
	isExternal : function ( url ) {
		var a = document.createElement ( "a" );
		a.href = url;
		return a.host !== location.host;
	}
});