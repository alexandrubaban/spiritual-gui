/**
 * Mechanism to skip DOM subtree already being crawled.
 * @TODO: Perhaps support this feaure for all crawlers?
 * @extends {gui.Crawler}
 */
gui.GuideCrawler = gui.Crawler.extend ({

	/**
	 * Stamp start element.
	 * @param {Element} start
	 * @param {ICrawlerHandler} handler (TODO: create this thing)
	 * @param @optional {object} arg
	 */
	descend : function ( start, handler, arg ) {
		if ( start.nodeType !== Node.DOCUMENT_NODE ) {
			var sig = start.ownerDocument.defaultView.gui.$contextid; // eh!
			gui.Tick.add ( this._TICK, this, sig ).dispatch ( this._TICK, 0, sig );
			this._stamp (( this._startelement = start ), true );
		}
		this._super.descend ( start, handler, arg );
	},

	/**
	 * Remove stamp.
	 * @TODO: handle element potentially nuked
	 * @param {gui.Tick} tick
	 */
	ontick : function ( tick ) {
		if ( tick.type === this._TICK ) {
			this._stamp ( this._startelement, false );
		}
	},

	// Private ...............................................................
	
	/**
	 * Attribute name.
	 * @type {String}
	 */
	_ATTRIBUTE : "data-gui-crawler",

	/**
	 * Tick type.
	 * @type {String}
	 */
	_TICK : "gui-tick-crawler-done",

	/**
	 * Start element.
	 * @type {Element}
	 */
	_startelement : null,

	/**
	 * Stamp that element.
	 * @param {Element} elm
	 * @param {boolean} doit
	 */
	_stamp : function ( elm, doit ) {
		elm = elm instanceof gui.Spirit ? elm.element : elm;
		var name = this._ATTRIBUTE;
		var type = this.type;
		if ( doit ) {
			elm.setAttribute ( name, type );
		} else {
			elm.removeAttribute ( name, type );
		}
	},

	/**
	 * Skip element children (@TODO and element) if already crawled.
	 * @param {Element} elm
	 * @param {ICrawlerHandler} handler
	 * @param @optional {object} arg
	 */
	_handleElement : function ( elm, handler, arg ) {
		var type = elm.getAttribute ( this._ATTRIBUTE );
		if ( elm !== this._startelement && type && type.contains ( this.type )) {
			return gui.Crawler.SKIP_CHILDREN; // + gui.Crawler.SKIP @TODO
		} else {
			return this._super._handleElement ( elm, handler, arg );
		}
	}


}, {}, { // Static .............................................

	

});