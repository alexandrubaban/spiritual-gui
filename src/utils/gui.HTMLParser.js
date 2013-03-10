/**
 * Parse HTML string to DOM node(s) in given document context. 
 * Adapted from https://github.com/petermichaux/arbutus
 * @todo High level awareness of HTMLparser elements. Plugin ui.SpiritDOM and ui.Spirit.parse should know about added historic HTML chrome and strip when inserted.
 * @param {Document} doc
 * @todo: make this whole thing static
 */
gui.HTMLParser = function HTMLParser ( doc ) {
	if ( doc && doc.nodeType ) {
		this._document = doc;
	} else {
		throw new TypeError ( "Document expected" );
	}
};

gui.HTMLParser.prototype = {

	/**
	 * Context document.
	 * @type {Document}
	 */
	_document : null,

	/**
	 * Parse HTML to DOM node(s). Note that this always returns an array.
	 * @param {String} html
	 * @param @optional {Element} element
	 * @returns {Array<Node>}
	 */
	parse : function ( html, element ) {
		var match, fix, temp, frag, path,
			fixes = gui.HTMLParser._fixes,
			comments = gui.HTMLParser._comments,
			firsttag = gui.HTMLParser._firsttag,
			doc = this._document;
		// HTML needs wrapping in obscure structure for historic reasons?
		html = html.trim ().replace ( comments, "" );
		if (( match = html.match ( firsttag ))) {
			if (( fix = fixes.get ( match [ 1 ]))) {
				html = fix.replace ( "${html}", html );
			}
		}
		// Parse HTML to DOM nodes.
		temp = doc.createElement ( "div" );
		temp.innerHTML = html;
		// Extract elements from obscure structure for historic reasons?
		var nodes = temp.childNodes;
		if ( fix && element ) {
			var name = element.localName;
			if ( fixes.has ( name )) {
				var node = temp;
				while ( node ) {
					node = node.firstElementChild;
					if ( node.localName === name ) {
						nodes = node.childNodes;
						node = null;
					}
				}	
			}
		}
		// convert from nodelist to array of nodes
		return Array.map ( nodes, function ( node ) {
			return node;
		});
	}
};

/**
 * Match comments.
 * @type {RegExp}
 */
gui.HTMLParser._comments = /<!--[\s\S]*?-->/g;

/**
 * Match first tag.
 * @type {RegExp}
 */
gui.HTMLParser._firsttag = /^<([a-z]+)/i;

/**
 * Mapping tag names to miminum viable tag structure.
 * Considerable foresight has decided that text/html 
 * must forever remain backwards compatible with IE5.
 * @type {Map<String,String>}
 */
gui.HTMLParser._fixes = new Map ();

/**
 * Populate fixes.
 * @todo "without the option in the next line, the parsed option will always be selected."
 */
( function () {
	gui.Object.each ({
		"td" : "<table><tbody><tr>${html}</tr></tbody></table>",
		"tr" : "<table><tbody>${html}</tbody></table>",
		"tbody" : "<table>${html}</table>",
		"col" : "<table><colgroup>${html}</colgroup></table>",
		"option" : "<select><option>a</option>${html}</select>" 
	}, function ( tag, fix ) {
		gui.HTMLParser._fixes.set ( tag, fix );
	});
}());

/**
 * Populate duplicated fixes.
 */
( function () {
	var fixes = gui.HTMLParser._fixes;
	fixes.set ( "th", fixes.get ( "td" ));
	[ "thead", "tfoot", "caption", "colgroup" ].forEach ( function ( tag ) {
		gui.HTMLParser._fixes.set ( tag, fixes.get ( "tbody" ));
	});
}());