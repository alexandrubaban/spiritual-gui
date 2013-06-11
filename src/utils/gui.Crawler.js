/**
 * Crawling the DOM ascending or descending.
 * @TODO method <code>descendSub</code> to skip start element (and something similar for ascend)
 * @param @optional {String} type
 */
gui.Crawler = gui.Class.create ( "gui.Crawler", {

	/**
	 * Identifies crawler. @TODO spirit support for this!
	 * @type {String}
	 */
	type : null,

	/**
	 * Direction "ascending" or "descending".
	 * @type {String}
	 */
	direction : null,

	/**
	 * @type {Boolean}
	 */
	global : false,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.Crawler]";
	},

	/**
	 * Constructor.
	 * @param {String} type
	 */
	onconstruct : function ( type ) {
		this.type = type || null;
	},

	/**
	 * Crawl DOM ascending.
	 * @TODO ascendGlobal should do the global
	 * @param {Element|gui.Spirit} start
	 * @param {object} handler
	 */
	ascend : function ( start, handler ) {
		this.direction = gui.Crawler.ASCENDING;
		var win, elm = start instanceof gui.Spirit ? start.element : start;
		do {
			if ( elm.nodeType === Node.DOCUMENT_NODE ) {
				if ( this.global ) {
					win = elm.defaultView;
					if ( win.parent !== win ) {
						/*
						 * @TODO: iframed document might have navigated elsewhere, stamp this in localstorage
						 * @TODO: sit down and wonder if localstorage is even available in sandboxed iframes...
						 */
						if ( win.gui.xhost ) {
							elm = null;	
							if ( gui.Type.isFunction ( handler.transcend )) {
								handler.transcend ( win.parent, win.gui.xhost, win.gui.$contextid );
							}
						} else {
							elm = win.frameElement;
						}
					} else {
						elm = null;
					}
				} else {
					elm = null;
				}
			}
			if ( elm ) {
				var directive = this._handleElement ( elm, handler );
				switch ( directive ) {
					case gui.Crawler.STOP :
						elm = null;
						break;
					default :
						elm = elm.parentNode;
						break;
				}
			}
		} while ( elm );
	},

	/**
	 * Crawl DOM ascending, transcend into ancestor frames.
	 * @param {Element|gui.Spirit} start
	 * @param {object} handler
	 */
	ascendGlobal : function ( start, handler ) {
		this.global = true;
		this.ascend ( start, handler );
		this.global = false;
	},

	/**
	 * Crawl DOM descending.
	 * @param {object} start Spirit or Element
	 * @param {object} handler
	 * @param @optional {object} arg @TODO: is this even supported?
	 */
	descend : function ( start, handler, arg ) {
		this.direction = gui.Crawler.DESCENDING;
		var elm = start instanceof gui.Spirit ? start.element : start;
		if ( elm.nodeType === Node.DOCUMENT_NODE ) {
			elm = elm.documentElement;
		}
		this._descend ( elm, handler, arg, true );
	},

	/**
	 * Crawl DOM descending, transcend into iframes.
	 * @param {object} start Spirit or Element
	 * @param {object} handler
	 * @param @optional {object} arg @TODO: is this even supported?
	 */
	descendGlobal : function ( start, handler, arg ) {
		this.global = true;
		this.descend ( start, handler, arg );
		this.global = false;
	},


	// Private .................................................................

	/**
	 * Iterate descending.
	 * @param {Element} elm
	 * @param {object} handler
	 * @param {boolean} start
	 */
	_descend : function ( elm, handler, arg, start ) {
		var win, spirit, directive = this._handleElement ( elm, handler, arg );
		switch ( directive ) {
			case gui.Crawler.CONTINUE :
			case gui.Crawler.SKIP_CHILDREN :
				if ( directive !== gui.Crawler.SKIP_CHILDREN ) {
					if ( elm.childElementCount ) {
						this._descend ( elm.firstElementChild, handler, arg, false );
					} else if ( this.global && elm.localName === "iframe" ) {
						if (( spirit = elm.spirit )) { // @TODO && spirit instanceof gui.IframeSpirit
							if ( spirit.xguest ) {
								win = elm.ownerDocument.defaultView;
								if ( gui.Type.isFunction ( handler.transcend )) {
									handler.transcend ( spirit.contentWindow, spirit.xguest, spirit.$instanceid );// win.gui.$contextid
								}
							} else {
								var root = elm.contentDocument.documentElement;
								if ( root ) {
									this._descend ( root, handler, arg, false );
								}
							}
						}
					}
				}
				if ( !start ) {
					var next = elm.nextElementSibling;
					if ( next !== null ) {
						this._descend ( next, handler, arg, false );
					}
				}
				break;
		}
	},

	/**
	 * Handle element. Invoked by both ascending and descending crawler.
	 * @param {Element} element
	 * @param {object} handler
	 * @returns {number} directive
	 */
	_handleElement : function ( element, handler, arg ) {
		var directive = gui.Crawler.CONTINUE;
		var spirit = element.spirit;
		if ( spirit ) {
			directive = spirit.oncrawler ( this );
		}
		if ( !directive ) {
			if ( handler ) {
				if ( gui.Type.isFunction ( handler.handleElement )) {
					directive = handler.handleElement ( element, arg );
				}
				if ( directive !== gui.Crawler.STOP ) {
					if ( spirit && gui.Type.isFunction ( handler.handleSpirit )) {
						directive = this._handleSpirit ( spirit, handler );
					}
				}	
			}
		}
		if ( !directive ) {
			directive = gui.Crawler.CONTINUE;
		}
		return directive;
	},

	/**
	 * Handle Spirit.
	 * @param {Spirit} spirit
	 * @param {object} handler
	 * @returns {number}
	 */
	_handleSpirit : function ( spirit, handler ) {
		return handler.handleSpirit ( spirit );
	}


}, {}, { // Static ..............................................................

	ASCENDING : "ascending",
	DESCENDING : "descending",
	CONTINUE : 0,
	STOP : 1,
	SKIP: 2, // @TODO: support this
	SKIP_CHILDREN : 4

});