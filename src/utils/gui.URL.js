 /**
 * Resolve an URL string relative to a document.
 * @param {Document} doc
 * @param {String} href
 */
gui.URL = function ( doc, href ) {
	if ( doc && doc.nodeType === Node.DOCUMENT_NODE ) {
		var link = doc.createElement ( "a" ); link.href = href;
		Object.keys ( gui.URL.prototype ).forEach ( function ( key ) {
			if ( gui.Type.isString ( link [ key ])) {
				this [ key ] = link [ key ];
			}
		}, this );
		this.id = this.hash ? this.hash.substring ( 1 ) : null;
		this.location = this.href.split ( "#" )[ 0 ];
		this.external = this.location !== String ( doc.location ).split ( "#" )[ 0 ];
	} else {
		throw new TypeError ( "Document expected" );
	}
};

gui.URL.prototype = {
	hash : null, // #test
	host : null, // www.example.com:80
	hostname : null, // www.example.com
	href : null, // http://www.example.com:80/search?q=devmo#test
	pathname : null, // search
	port : null, // 80
	protocol : null, // http:
	search : null, // ?q=devmo
	id : null,	// test
	external : false // external relative to the *document*, not the server host
};


// Statics ....................................................................

/**
 * Convert relative path to absolute path in context of base where base is a document or an absolute path.
 * @see  http://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
 * @param {String|Document} base
 * @param {String} href
 * @returns {String}
 */
gui.URL.absolute = function ( base, href ) {
	if ( base.nodeType === Node.DOCUMENT_NODE ) {
		return new gui.URL ( base, href ).href;
	} else if ( typeof base === "string" ) { // TODO: load gui.Type first...
		var stack = base.split ( "/" );
		var parts = href.split ( "/" );
		stack.pop();// remove current filename (or empty string) (omit if "base" is the current folder without trailing slash)
		parts.forEach ( function ( part ) {
			if ( part !== "." ) {
				if ( part === ".." ) {
					stack.pop ();
				}	else {
					stack.push ( part );	
				}
			}
		});
		return stack.join ( "/" );	
	}
};

/**
 * Extract querystring parameter value from URL.
 * @param {String} url
 * @param {String} name
 * @returns {String} String or null
 */
gui.URL.getParam = function ( url, name ) {
	name = name.replace ( /(\[|\])/g, "\\$1" );
	var results = new RegExp ( "[\\?&]" + name + "=([^&#]*)" ).exec ( url );
	return results === null ? null : results [ 1 ];
};

/**
 * Add or remove (unencoded) querystring parameter from URL. If it 
 * already exists, we'll replace it's (first ancountered) value. 
 * @TODO Something simpler
 * @param {String} url
 * @param {String} name
 * @param {String} value Use null to remove
 * @returns {String} String
 */
gui.URL.setParam = function ( url, name, value ) {
	var params = [], cut, index = -1;
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
};