/**
 * Parsing markup strings to DOM objects.
 */
gui.HTMLParser = {

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.HTMLParser]";
	},

	/**
	 * Parse to document. Bear in mind that the 
	 * document.defaultView of this thing is null.
	 * @TODO: Use DOMParser for text/html supporters
	 * @param {String} markup
	 * @returns {HTMLDocument}
	 */
	parseToDocument : function ( markup ) {
		markup = markup || "";
		return gui.Guide.suspend ( function () {
			var doc = doc = document.implementation.createHTMLDocument ( "" );
			if ( markup.toLowerCase().contains ( "<!doctype" )) {
				try {
					doc.documentElement.innerHTML = markup;
				} catch ( ie9exception ) {
					doc = new ActiveXObject ( "htmlfile" );
					doc.open ();
					doc.write ( markup );
					doc.close ();
				}
			} else {
				doc.body.innerHTML = markup;
			}
			return doc;
		});
	},

	/**
	 * Parse to array of one or more nodes.
	 * @param {String} markup
	 * @param @optional {Document} targetdoc
	 * @returns {Array<Node>}
	 */
	parseToNodes : function ( markup, targetdoc ) {
		var elm, doc = this._document || 
			( this._document = document.implementation.createHTMLDocument ( "" ));
		return gui.Guide.suspend ( function () {
			doc.body.innerHTML = this._insaneitize ( markup );
			elm = doc.querySelector ( "." + this._classname ) || doc.body;
			return Array.map ( elm.childNodes, function ( node ) {
				return targetdoc ? targetdoc.importNode ( node, true ) : node;
			});
		}, this );
	},


	// Private ...............................................................................
	
	/**
	 * Classname for obscure wrapping containers.
	 * @type {String}
	 */
	_classname : "_gui-htmlparser",

	/**
	 * Match comments.
	 * @type {RegExp}
	 */
	_comments : /<!--[\s\S]*?-->/g,

	/**
	 * Match first tag.
	 * @type {RegExp}
	 */
	_firsttag : /^<([a-z]+)/i,

	/**
	 * Recycled for parseToNodes operations.
	 * @TODO Create on first demand 
	 * @type {HTMLDocument}
	 */
	_document : null,

	/**
	 * Some elements must be created in obscure markup 
	 * structures in order to be rendered correctly.
	 * @param {String} markup
	 * @returns {String}
	 */
	_insaneitize : function ( markup ) {
		var match, fix;
		markup = markup.trim ().replace ( this._comments, "" );
		if (( match = markup.match ( this._firsttag ))) {
			if (( fix = this._fixes [ match [ 1 ]])) {
				markup = fix.
					replace ( "${class}", this._classname ).
					replace ( "${markup}", markup );
			}
		}
		return markup;
	},

	/**
	 * Mapping tag names to miminum viable tag structure.
	 * @see https://github.com/petermichaux/arbutus
	 * @TODO "without the option in the next line, the parsed option will always be selected."
	 * @type {Map<String,String>}
	 */
	_fixes : ( function () {
		var map = {
			"td" : '<table><tbody><tr class="${class}">${markup}</tr></tbody></table>',
			"tr" : '<table><tbody class="${class}">${markup}</tbody></table>',
			"tbody" : '<table class="${class}">${markup}</table>',
			"col" : '<table><colgroup class="${class}">${markup}</colgroup></table>',
			"option" : '<select class="${class}"><option>a</option>${markup}</select>' 
		};
		map [ "th" ] = map [ "td" ]; // duplucate fixes.
		[ "thead", "tfoot", "caption", "colgroup" ].forEach ( function ( tag ) {
			map [ tag ] = map [ "tbody" ];
		});
		return map;
	}())
};