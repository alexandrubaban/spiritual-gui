/**
 * # gui.IframeSpirit
 * @extends {gui.Spirit}
 * Spirit of the iframe.
 */
gui.IframeSpirit = gui.Spirit.infuse ( "gui.IframeSpirit", {

	/**
	 * TODO: only setup this listener if indeed xdomain stuff.
	 */
	onconstruct : function () {
		this._super.onconstruct ();
		this.event.add ( "message", this.window, this );
	},

	/**
	 * Handle event.
	 * @param {Event} e
	 */
	onevent : function ( e ) {
		this._super.onevent ( e );
		if ( e.type === "message" ) {
			this._onmessage ( e.data );
		}
	},

	/**
	 * Get or set iframe source.
	 * @param {String} src
	 */
	src : function ( src ) {
		if ( src ) {
			if ( gui.IframeSpirit.isExternal ( src )) {
				src = gui.IframeSpirit.sign ( src, this.document, this.spiritkey );
			}
			this.element.src = src;
		} else {
			return this.element.src;
		}
	},


	// Private ..................................................................
	
	/**
	 * Handle posted message.
	 * @param {String} msg
	 */
	_onmessage : function ( msg ) {
		if ( msg.startsWith ( "spiritual-action:" )) {
			var key = msg.split ( ":" )[ 1 ];
			alert ( key + ":" + this.spiritkey );
			return;
			if ( key === this.spiritkey ) {
				 var json = msg.split ( key + ":" )[ 1 ];
				 alert ( json );
			}
		}
	}
	
	
}, { // Recurring static ......................................................

	/**
	 * Summon spirit.
	 * @param {Document} doc
	 * @param @optional {String} src
	 * @returns {gui.IframeSpirit}
	 */
	summon : function ( doc, src ) {
		var iframe = doc.createElement ( "iframe" );
		var spirit = this.possess ( iframe );
		// @todo why does spirit.src method fail strangely just now? using iframe.src instead...
		if ( src ) {
			if ( gui.IframeSpirit.isExternal ( src )) {
				src = this.sign ( src, doc, spirit.spiritkey );
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
		return this.setParam ( url, this.KEY_SIGNATURE, sig );
	},

	/**
	 * Remove signature from URL (prettyfied for end user). 
	 * @param {String} url
	 * @param {String} sign
	 * @returns {String}
	 */
	unsign : function ( url ) {	
		return this.setParam ( url, this.KEY_SIGNATURE, null );
	},

	/**
	 * Extract querystring parameter value from URL.
	 * @param {String} url
	 * @param {String} name
	 * @returns {String} String or null
	 */
	getParam : function ( url, name ) {
		name = name.replace( /(\[|\])/g, "\\$1" ); // was: name = name.replace ( /[\[]/, "\\\[" ).replace( /[\]]/, "\\\]" ); (http://stackoverflow.com/questions/2338547/why-does-jslint-returns-bad-escapement-on-this-line-of-code)
		var results = new RegExp ( "[\\?&]" + name + "=([^&#]*)" ).exec ( url );
		return results === null ? null : results [ 1 ];
	},

	/**
	 * Add or remove querystring parameter from URL. If the parameter 
	 * already exists, we'll replace it's (first ancountered!) value. 
	 * @todo Something simpler
	 * @param {String} url
	 * @param {String} name
	 * @param {String} value Use null to remove
	 * @returns {String} String
	 */
	setParam : function ( url, name, value ) {
		var params = [], cut, index = -1;
		/*
		name = encodeURIComponent ( name );
		if ( value !== null ) {
			value = encodeURIComponent ( value );
		}
		*/
		if ( url.indexOf ( "?" ) >-1 ) {
			cut = url.split ( "?" );
			url = cut [ 0 ];
			params = cut [ 1 ].split ( "&" );
			params.every ( function ( param, i ) {
				var x = param.split ( "=" );
				if ( x [ 0 ] === name ) {
					index = i;
					if ( value !== null ) {
						x [ 1 ] = value;
						params [ i ] = x.join ( "=" );
					}
				}
				return index < 0;
			});
		}
		if ( value === null ) {
			if ( index > -1 ) {
				params.remove ( index, index );
			}
		} else if ( index < 0 ) {
			params [ params.length ] = [ name, value ].join ( "=" );
		}
		return url + ( params.length > 0 ? "?" + params.join ( "&" ) : "" );
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