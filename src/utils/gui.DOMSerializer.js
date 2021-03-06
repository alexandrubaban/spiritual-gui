/**
 * Serialize DOM elements to XHTML strings (for now).
 * @TODO: Work on the HTML (without XML)
 */
gui.DOMSerializer = {

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.DOMParser]";
	},

	/**
	 * Serialize element to XHTML string.
	 * @param {Element} element
	 * @returns {String}
	 */
	serialize : function ( element ) {
		var context = element.ownerDocument.defaultView;
		var serializer = new context.XMLSerializer ();
		return serializer.serializeToString ( element );
	},

	/**
	 * Exclude element itself from serialized result.
	 * This is considered a temporary patch for the 
	 * missing access to innerHTML getter in WebKit.
	 * @param {Element} element
	 * @returns {String}
	 */
	subserialize : function ( element ) {
		var html = this.serialize ( element );
		if ( html.contains ( "</" )) {
			html = html.slice ( 
				html.indexOf ( ">" ) + 1, 
				html.lastIndexOf ( "<" )
			);
		}
		return html;
	}
};