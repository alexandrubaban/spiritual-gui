gui.BlobLoader = {

	/**
	 * @type {URL}
	 */
	_URL : ( window.URL || window.webkitURL ),

	/**
	 * Load script into document from given source code.
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
			script.onload = function () {
				callback.call ( thisp );
			};
		}
	}
};