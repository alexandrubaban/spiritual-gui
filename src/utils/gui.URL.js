/**
 * Split() the #fragment identifier once and for all.
 * @param {Document} doc
 * @param {String} href
 */
gui.URL = function ( doc, href ) {
	
	var link = doc.createElement ( "a" ); link.href = href;
	Object.keys ( gui.URL.prototype ).forEach ( function ( key ) {
		if ( gui.Type.isString ( link [ key ])) {
			this [ key ] = link [ key ];
		}
	}, this );
	this.id = this.hash ? this.hash.substring ( 1 ) : null;
	this.location = this.href.split ( "#" )[ 0 ];
	this.external = this.location !== String ( doc.location ).split ( "#" )[ 0 ];
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
	
	// CUSTOM ..........................................................
	
	id : null,	// test
	// url : null, // http://www.example.com:80/search?q=devmo
	external : false // external to the *document*, not the server host
};