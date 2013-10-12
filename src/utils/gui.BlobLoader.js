/**
 * Blob file loader. Work in progress.
 * @TODO: loadStyleSheet method
 */
gui.BlobLoader = {

	 /**
	 * Load script into document from given source code.
	 * @TODO: Refactor to use {gui.Then} instead
	 * @param {Document} doc
	 * @param {String} source
	 * @param {function} callback
	 * @param {object} thisp
	 */
	loadScript : function ( doc, source, callback, thisp ) {
		var blob = new Blob ([ source ], { type: "text/javascript" });
		var script = doc.createElement ( "script" );
		script.src = this._URL.createObjectURL ( blob );
		var head = doc.querySelector ( "head" );
		gui.Observer.suspend ( head, function () {
			head.appendChild ( script );
		});
		if ( callback ) {
			/*
			 * Note: An apparent bug in Firefox prevents the 
			 * onload from firing inside sandboxed iframes :/
			 */
			script.onload = function () {
				callback.call ( thisp );
			};
		}
	},

	// Private .....................................................

	/**
	 * Weirdo URL object.
	 * @type {URL}
	 */
	_URL : ( window.URL || window.webkitURL )
	
};