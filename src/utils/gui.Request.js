/**
 * # gui.Request
 * Simplistic XMLHttpRequest wrapper. 
 * Work in progress, lot's to do here.
 * @param @optional {String} url
 */
gui.Request = function ( url ) {
	if ( url ) {
		this.url ( url );
	}
};

gui.Request.prototype = {

	/**
	 * Set request address.
	 * @param {String} url
	 */
	url : function ( url ) {
		this._url = url;
		return this;
	},

	/**
	 * Convert to synchronous request.
	 */
	sync : function () {
		this._async = false;
		return this;
	},

	/**
	 * Convert to asynchronous request.
	 */
	async : function () {
		this._async = true;
		return this;
	},

	/**
	 * Expected response type. Sets the accept header and formats 
	 * callback result accordingly (eg. as JSON object, XML document) 
	 * @param {String} mimetype
	 * @returns {gui.SpiritRquest}
	 */
	accept : function ( mimetype ) {
		this._accept = mimetype;
		return this;
	},

	/**
	 * Expect JSON response.
	 * @returns {gui.SpiritRquest}
	 */
	acceptJSON : function () {
		return this.accept ( "application/json" );
	},

	/**
	 * Expect XML response.
	 * @returns {gui.SpiritRquest}
	 */
	acceptXML : function () {
		return this.accept ( "text/xml" );
	},

	/**
	 * Expect text response.
	 * @returns {gui.SpiritRquest}
	 */
	acceptText : function () {
		return this.accept ( "text/plain" );
	},

	/**
	 * Request content type (when posting data to service).
	 * @param {String} mimetype
	 * @returns {gui.SpiritRquest}
	 */
	format : function ( mimetype ) {
		this._format = mimetype;
		return this;
	},

	/**
	 * Set request header.
	 * @param {String} name
	 * @param {String} value
	 * @returns {gui.SpiritRquest}
	 */
	header : function ( name, value ) {
		console.warn ( "@todo request headers" );
		return this;
	},

	/**
	 * Get stuff.
	 * @todo Synchronous version
	 * @todo Unhardcode status
	 * @param {function} callback
	 * @param {object} thisp
	 */
	get : function ( callback, thisp ) {	
		var that = this, request = new XMLHttpRequest ();
		request.onreadystatechange = function () {
			if ( this.readyState === XMLHttpRequest.DONE ) {
				callback.call ( thisp, 200, that._parse ( this.responseText ), this.responseText );
			}
		};
		request.overrideMimeType ( this._accept );
		request.open ( "get", this._url, true );
		request.send ( null );
	},

	post : function () {},
	put : function () {},
	del : function () {},
	
	
	// PRIVATES ...................................................................................

	/**
	 * @type {boolean}
	 */
	_async : true,

	/**
	 * @type {String}
	 */
	_url : null,

	/**
	 * Expected response type.
	 * @todo an array?
	 * @type {String}
	 */
	_accept : "text/plain",

	/**
	 * Default request type.
	 * @type {String}
	 */
	_format : "application/x-www-form-urlencoded",

	/**
	 * Parse response to expected type.
	 * @param {String} text
	 * @returns {object}
	 */
	_parse : function ( text ) {	
		var result = text;
		try {
			switch ( this._accept ) {
				case "application/json" :
					result = JSON.parse ( text );
					break;
				case "text/xml" :
					result = new DOMParser ().parseFromString ( text, "text/xml" );
					break;
			}
		} catch ( exception ) {
			console.error ( this._accept + " dysfunction at " + this._url );
			throw exception;
		}
		return result;
	}
};