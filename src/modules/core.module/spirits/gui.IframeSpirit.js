/**
 * # gui.IframeSpirit
 * @extends {gui.Spirit}
 * Spirit of the iframe.
 */
gui.IframeSpirit = gui.Spirit.infuse ( "gui.IframeSpirit", {

	/**
	 * Signs iframe URLs with a unique identifier eg. to 
	 * relay spirit actions from across exotic domains.
	 * @type {String}
	 */
	signature : null,

	/**
	 * Construct.
	 */
	onconstruct : function () {
		this._super.onconstruct ();
		if ( this.signature === null ) {
			this.signature = gui.IframeSpirit.generateSignature ();
		}
	},

	/**
	 * Get or set iframe source.
	 * See also method path.
	 * @param {String} src
	 */
	src : function ( src ) {
		if ( gui.Type.isString ( src )) {
			if ( gui.IframeSpirit.isExternal ( src )) {
				src = gui.IframeSpirit.sign ( src, this.signature );
			}
			this.element.src = src;
		}
		return this.element.src;
	}
	
	
}, { 

	// RECURRING  ...........................................................

	/**
	 * Summon spirit.
	 * @param {Document} doc
	 * @param {String} src
	 * @returns {gui.IframeSpirit}
	 */
	summon : function ( doc, src ) {
		// Unique key stamped into iframe SRC.
		var sig = gui.IframeSpirit.generateSignature ();
		// To avoid problems with the browser back button 
		// and iframe history, better set iframe src now. 
		var iframe = doc.createElement ( "iframe" );
		if ( gui.Type.isString ( src )) {
			if ( !this.isExternal ( src )) {
				src = this.sign ( src, sig );
			}
			iframe.src = src; 
		} else {
			iframe.src = gui.IframeSpirit.SRC_DEFAULT;
		}
		var spirit = this.animate ( iframe );
		spirit.signature = sig;
		return spirit;
	}


}, { 

	// Static ................................................................

	/**
	 * The stuff going on here has to do with a future project 
	 * about supporting cross-doman spiritualized websites
	 */

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
	 * Generate unique signature (for this session).
	 * @returns {String}
	 */
	generateSignature : function () {
		return gui.KeyMaster.generateKey ().replace ( "key", "sig" );
	},

	/**
	 * Sign URL with signature.
	 * @param {String} url
	 * @param @optional {String} signature
	 * @returns {String}
	 */
	sign : function ( url, signature ) {
		return this.setParam ( url, this.KEY_SIGNATURE, signature || this.generateSignature ());
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
		name = encodeURIComponent ( name );
		if ( value !== null ) {
			value = encodeURIComponent ( value );
		}
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