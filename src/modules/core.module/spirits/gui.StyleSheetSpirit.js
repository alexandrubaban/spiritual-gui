/**
 *Spirit of the stylesheet. To be refactored.
 * @extends {gui.Spirit}
 */
gui.StyleSheetSpirit = gui.Spirit.infuse ( "gui.StyleSheetSpirit", {

	/**
	 * Strip lines starting with @ character (for now).
	 * @type {RegExp}
	 */
	_ATSTATEMENTS : /\@.+\n/g,

	/**
	 * Result of parsing CSS - an array of spirit channels.
	 * @type {Array<Array}
	 */
	_channels : null,

	/**
	 * Constructor action.
	 */
	onconstruct : function () {
		this._super.onconstruct ();
		this._channels = [];
		// CSS served external or inline?
		if ( !this.element.disabled ) {
			var href = this.element.href;
			if ( href !== undefined ) {
				this._parseExternal ( href );
			} else {
				this._parse ( this.element.textContent );
				this.channel ();
			}
		}
	},

	/**
	 * The CSSStyleSheet API doesn't expose
	 * custom properties. Let's parse text!
	 * @param {String} href
	 */
	_parseExternal : function ( href ) {
		/**
		 * It appears that synchronous requests no longer block 
		 * the execution thread (!), we need an elaborate setup 
		 * to momentarily halt the gui.Guide while async 
		 * requests are returned and parsed. If we are lucky, 
		 * the browser will have cached the CSS file already.
		 */
		this._done ( false );
		new gui.Request ( href ).get ( function ( status, css ) {
			if ( status === 200 ) {
				this._parse ( css );
			}
			this._done ( true );
		}, this );
	},

	/**
	 * If not done, instruct gui.Guide to wait for incoming channels.
	 * Otherwise, when CSS is parsed, let gui.Guide invoke channel method. 
	 * This ensures that channels are asserted in continuos (markup) order.
	 * @param {boolean} isDone
	 */
	_done : function ( isDone ) {
		this.broadcast.dispatchGlobal ( isDone ? 
			gui.BROADCAST_CHANNELS_LOADED : 
			gui.BROADCAST_LOADING_CHANNELS 
		);
	},

	/**
	 * Parse CSS, channeling Spirits to selectors.
	 * @todo more tolerant parsing algorithm!
	 * @param {String} text (valid CSS syntax!) 
	 */
	_parse : function ( text ) {
		var channels = [];
		var cssprop = "-ui-spirit";
		if ( text.indexOf ( cssprop ) >-1 ) {
			var sane = [];
			var coms = text.split ( "*/" );
			coms.forEach ( function ( part ) {				
				sane.push ( part.split ( "/*" )[ 0 ]);
			});
			sane = sane.join ( "" ).replace ( this._ATSTATEMENTS, "" ); // replace ( /\s/g, "" );
			sane.split ( "}" ).forEach ( function ( part ) {
				var split = part.split ( "{" );
				var selector = split [ 0 ];
				var defs = split [ 1 ];
				if ( defs ) {
					defs.split ( ";" ).forEach ( function ( def ) {
						var last = def.split ( ":" );
						var prop = last [ 0 ];
							if ( prop.trim () === cssprop ) {
								var constructors = last [ 1 ].trim ();
								constructors.split ( " " ).reverse ().forEach ( function ( constructor ) {
									channels.push ([ 
										selector.trim (), 
										constructor.trim ()
									]);
								});
							}
					});
				}
			});
			/*
			 * In CSS, overriding spirits are declared last.
			 * In JS, they are declared first: Reverse list.
			 */
			this._channels = channels.reverse ();
		}
	},

	/**
	 * Assert channels; method isolated to support async setup.
	 * This method may have been invoked by the gui.Guide
	 */
	channel : function () {
		this._channels.forEach ( function ( channel ) {
			this.window.gui.channel ( channel [ 0 ], channel [ 1 ]);
		}, this );
	}
	
	
}, {

	/**
	 * Summon spirit.
	 * @param {Document} doc
	 * @param {String} href
	 * @returns {gui.StyleSheetSpirit}
	 */
	summon : function ( doc, href ) {
		var link = doc.createElement ( "link" );
		link.className = "gui-styles";
		link.rel = "stylesheet";
		link.href = href ? href : "";
		return this.possess ( link );
	}
});