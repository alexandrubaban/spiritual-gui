/**
 * We load a text file from the server. This might be used instead 
 * of a XMLHttpRequest to cache the result and save repeated lookups.
 * @TODO custom protocol handlers to load from localstorage
 * @TODO perhaps rename to TextLoader or something...
 */
gui.FileLoader = gui.Class.create ( "gui.FileLoader", Object.prototype, {

	/**
	 * Construction time again.
	 * @param {Document} doc
	 */
	onconstruct : function ( doc ) {
		this._cache = gui.FileLoader._cache;
		this._document = doc;
	},

	/**
	 * Load file as text/plain and serve to callback.
	 * @param {String} src Relative to document URL
	 * @param {function} callback
	 * @param @optional {object} thisp
	 */
	load : function ( src, callback, thisp ) {
		var url = new gui.URL ( this._document, src );
		if ( this._cache.has ( url.location )) {
			this._cached ( url, callback, thisp );
		} else {
			this._request ( url, callback, thisp );
		}
	},

	/**
	 * Handle loaded file.
	 * @param {String} text
	 * @param {gui.URL} url
	 * @param {function} callback
	 * @param @optional {object} thisp
	 */
	onload : function ( text, url, callback, thisp ) {
		callback.call ( thisp, text );
	},
	
	
	// Private ........................................................

	/**
	 * Cached is shared between all instances of gui.FileLoader.
	 * @see {gui.FileLoader#_cache}
	 * @type {Map<String,String>}
	 */
	_cache : null,

	/**
	 * File address resolved relative to this document.
	 * @type {Document}
	 */
	_document : null,

	/**
	 * Request external file while blocking subsequent similar request.
	 * @param {gui.URL} url
	 * @param {function} callback
	 * @param @optional {object} thisp
	 */
	_request : function ( url, callback, thisp ) {
		this._cache.set ( url.location, null );
		new gui.Request ( url.href ).get ( function ( status, text ) {
			this.onload ( text, url, callback, thisp );
			this._cache.set ( url.location, text );
			gui.FileLoader.unqueue ( url.location );
		}, this );
	},

	/**
	 * Hello.
	 * @param {gui.URL} url
	 * @param {Map<String,String>} cache
	 * @param {function} callback
	 * @param @optional {object} thisp
	 */
	_cached : function ( url, callback, thisp ) {
		var cached = this._cache.get ( url.location );
		if ( cached !== null ) { // note that null type is important
			this.onload ( cached, url, callback, thisp );
		} else {
			var that = this;
			gui.FileLoader.queue ( url.location, function ( text ) {
				that.onload ( text, url, callback, thisp );
			});
		}
	},
	

	// Secrets ..........................................................

	/**
	 * Secret constructor.
	 * @param {gui.Spirit} spirit
	 * @param {Window} window
	 * @param {function} handler
	 */
	$onconstruct : function ( doc ) {
		if ( doc && doc.nodeType === Node.DOCUMENT_NODE ) {
			this.onconstruct ( doc );
		} else {
			throw new TypeError ( "Document expected" );
		}
	}

	
}, {}, { // Static ....................................................

	/**
	 * Cache previously retrieved files, mapping URL to file text.
	 * @type {Map<String,String>}
	 */
	_cache : new Map (),

	/**
	 * Queue handlers for identical requests, mapping URL to function.
	 * @type {Array<String,function>}
	 */
	_queue : new Map (),

	/**
	 * Queue onload handler for identical request.
	 * @param {String}
	 */
	queue : function ( src, action ) {
		this._queue [ src ] =  this._queue [ src ] || [];
		this._queue [ src ].push ( action );
	},

	/**
	 * Execute queued onload handlers.
	 * @param {String} src
	 */
	unqueue : function ( src ) {
		var text = this._cache.get ( src );
		if ( this._queue [ src ]) {
			while ( this._queue [ src ][ 0 ]) {
				this._queue [ src ].shift ()( text );
			}
		}
	}
});