/**
 * # gui.WindowSpirit
 * @extends {gui.Spirit}
 * Spirit of the window.
 * @todo use this name?
 */
gui.WindowSpirit = gui.Spirit.infuse ( "gui.WindowSpirit", {

	/**
	 * When to hide the loading splash cover. 
	 * @todo Match one of "ready" "load" "fit"
	 * Defaults to "fit" (harcoded for now)
	 */
	cover : "fit",

	/**
	 * Fit height to iframe contained document height?
	 * @todo setter for this to allow runtime update.
	 * @type {boolean}
	 */
	fit : true,

	/**
	 * Manage CSS internally?
	 * @type {boolean}
	 */
	style : true,

	/**
	 * Prepending iframe and cover.
	 */
	onenter : function () {
		this._super.onenter ();
		this._cover = this.dom.prepend ( gui.CoverSpirit.summon ( this.document ));
		this._frame = this.dom.prepend ( gui.IframeSpirit.summon ( this.document, this._src ));
		this.action.addGlobal ([ gui.ACTION_DOCUMENT_DONE, gui.ACTION_DOCUMENT_FIT ]);
		this._frame.att.set("sandbox",this.att.get("sandbox"));
		if ( this.style ) {
			this._style ();
		}
	},

	/**
	 * Get or set src.
	 * @param @optional {String} src
	 * @returns {String}
	 */
	src : function ( src ) {
		var result = null;
		if ( this.life.entered ) {
			if ( gui.Type.isString ( src )) {
				this._loading ();
			}
			result = this._frame.src ( src );
		} else {
			result = this._src = src;
		}
		return result;
	},

	/**
	 * Handle action.
	 * @param {gui.Action} action
	 */
	onaction : function ( action ) {
		this._super.onaction ( action );
		switch ( action.type ) {
			case gui.ACTION_DOCUMENT_DONE :
				this._loaded ();
				action.consume ();
				break;
			case gui.ACTION_DOCUMENT_FIT :
				if ( this.fit ) {
					this.css.height = action.data.height;
					this.action.dispatchGlobal ( action.type, action.data.height );
					this._height = action.data.height;
					var tick = "TICK-TEMP";
					this.tick.one ( tick ).dispatch ( tick, 0 );
				}
				action.consume ();
				break;
		}
	},

	/**
	 * Handle tick.
	 * @param {gui.Tick} tick
	 */
	ontick : function ( tick ) {
		this._super.ontick ( tick );
		if ( tick.type === "TICK-TEMP" ) {
			this.css.height = this._height;
		}
	},

	
	// Private ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

	/**
	 * Spirit of the iframe.
	 * @type {gui.IframeSpirit}
	 */
	_frame : null,

	/**
	 * Hm............
	 * @type {String}
	 */
	_src : null,

	/**
	 * Spirit of the cover.
	 * @type {gui.CoverSpirit}
	 */
	_cover : null,

	/**
	 * @type {number}
	 */
	_height : 0,
 
	/**
	 * Loading. 
	 */
	_loading : function () {
		if ( this.life.entered && this.cover ) {
			this._cover.dom.show ();
		}
		this.action.dispatch ( gui.ACTION_WINDOW_LOADING );
	},

	/**
	 * Loaded.
	 */
	_loaded : function () {
		if ( this.life.entered && this.cover ) {
			this._cover.dom.hide ();
		}
		this.action.dispatch ( gui.ACTION_WINDOW_LOADED );
	},

	/**
	 * Autostyling.
	 * @todo use top right bottom left instead of width and height?
	 * @see {gui.WindowSpirit#style}
	 */
	_style : function () {
		if ( this.css.compute ( "position" ) === "static" ) {
			this.css.position = "relative";
		}
		if ( this.fit ) {
			this.css.height = 0;
		}
		[ this._frame, this._cover ].forEach ( function ( child ) {
			child.css.style ({ position : "absolute", width: "100%", height: "100%" });
		});
	}


}, { // Static ..........................................................

	/**
	 * Summon spirit.
	 * @param {Document} doc
	 * @param @optional {String} src
	 */
	summon : function ( doc, src ) {
		var div = doc.createElement ( "div" );
		var spirit = this.possess ( div );
		if ( src ) {
			spirit.src ( src );
		}
		return spirit;
	}

});