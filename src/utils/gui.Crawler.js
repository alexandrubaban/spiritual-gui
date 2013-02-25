/**
 * # gui.Crawler
 * Crawling the DOM ascending or descending.
 * @todo method <code>descendSub</code> to skip start element (and something similar for ascend)
 * @param @optional {String} type
 */
gui.Crawler = function ( type ) {
	this.type = type || null;
	return this;
};

gui.Crawler.prototype = {

	/**
	 * Recursion directives.
	 * @todo skip children, skip element etc
	 */
	CONTINUE: 0,
	STOP : 1,

	/**
	 * Identifies crawler. @todo spirit support for this!
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
	 * Crawl DOM ascending.
	 * @todo ascendGlobal should do the global
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
						if ( win.location.search.contains ( gui.IframeSpirit.KEY_SIGNATURE )) {
							elm = null;	
							if ( gui.Type.isFunction ( handler.transcend )) {
								this._transcend ( win, win.parent, handler );
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
				if ( !directive ) {
					elm = elm.parentNode;
				} else {
					switch ( directive ) {
						case gui.Crawler.STOP :
							elm = null;
							break;
					}
				}
				
			}
		} while ( elm );
	},

	/**
	 * Crawl DOM descending.
	 * @todo descendGlobal
	 * @todo Transcend into iframes.
	 * @param {object} start Spirit or Element
	 * @param {object} handler
	 */
	descend : function ( start, handler ) {
		this.direction = gui.Crawler.DESCENDING;
		var elm = start instanceof gui.Spirit ? start.element : start;
		if ( elm.nodeType === Node.DOCUMENT_NODE ) {
			elm = elm.documentElement;
		} else if ( elm.localName === "iframe" ) {
			if ( this.global ) {
				console.log ( "@todo descend into iframes" );
			}
		}
		this._descend ( elm, handler, true );
	},


	// Private .................................................................

	/**
	 * Iterate descending.
	 * @param {Element} elm
	 * @param {object} handler
	 * @param {boolean} start
	 */
	_descend : function ( elm, handler, start ) {
		var win, spirit, directive = this._handleElement ( elm, handler );
		switch ( directive ) {
			case 0 :
				if ( elm.childElementCount > 0 ) {
					this._descend ( elm.firstElementChild, handler, false );
				} else if ( this.global && elm.localName === "iframe" ) {
					if (( spirit = elm.spirit )) {
						if ( spirit.external ) {
							win = elm.ownerDocument.defaultView;
							if ( gui.Type.isFunction ( handler.transcend )) {
								this._transcend ( win, spirit.contentWindow, handler );
							}
						} else {
							var root = elm.contentDocument.documentElement;
							this._descend ( root, handler, false );
						}
					}
				}
				if ( !start ) {
					var next = elm.nextElementSibling;
					if ( next !== null ) {
						this._descend ( next, handler, false );
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
	_handleElement : function ( element, handler ) {
		var directive = gui.Crawler.CONTINUE;
		var spirit = element.spirit;
		if ( spirit ) {
			directive = spirit.oncrawler ( this );
		}
		if ( !directive ) {
			if ( handler ) {
				if ( gui.Type.isFunction ( handler.handleElement )) {
					directive = handler.handleElement ( element );
				}
				switch ( directive ) {
					case 1 :
						break;
					default :
						if ( gui.Type.isFunction ( handler.handleSpirit )) {
							if ( spirit ) {
								directive = this._handleSpirit ( spirit, handler );
							}
						}
						break;
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
	},

	/**
	 * Teleport crawler to hosting (parent) or hosted (subframe) domain.
	 * @param {Window} thiswin Current window
	 * @param {Window} thatwin Target window
	 * @param {object} handler
	 */
	_transcend : function ( thiswin, thatwin, handler ) {
		var uri, key, cut, url = thiswin.location.href;
		var sig = gui.URL.getParam ( url, gui.IframeSpirit.KEY_SIGNATURE );
		if ( sig ) {
			cut = sig.split ( "/" ),
			key = cut.pop (),
			uri = cut.join ( "/" );
		} else {
			uri = "*"; // @todo
			key = thiswin.gui.signature;
		}
		handler.transcend ( thatwin, uri, key );
	}
};


// Static ..............................................................

gui.Crawler.ASCENDING = "ascending";
gui.Crawler.DESCENDING = "descending";

/**
 * Bitmask setup supposed to be going on here.
 * @todo SKIP_CHILDREN and TELEPORT_ELSEWEHERE stuff.
 */
gui.Crawler.CONTINUE = 0;
gui.Crawler.STOP = 1;