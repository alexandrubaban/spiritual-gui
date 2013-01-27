/**
 * # gui.SpiritLifeTracker
 * Tracking spirit life cycle events.
 * @extends {gui.SpiritTracker}
 */
gui.SpiritLifeTracker = gui.SpiritTracker.extend ( "gui.SpiritLifeTracker", {

	/**
	 * Spirit is constructed? This is almost certainly true by 
	 * the time you address the spirit.
	 * @type {boolean}
	 */
	constructed : false,

	/**
	 * @todo EXPERIMENT...
	 * @type {boolean}
	 */
	configured : false,

	/**
	 * Is now or has ever been in page DOM?
	 * @type {boolean}
	 */
	entered : false,

	/**
	 * Is curently located in page DOM? 
	 * False whenever detached is true. 
	 * @type {boolean}
	 */
	attached : false,

	/**
	 * Is currently not located in page DOM? Note that this is initially 
	 * true until the spirit has been discovered and registered as attached.
	 * @type {boolean}
	 */
	detached : true,

	/**
	 * Is ready? If so, it implies that all descendant spirits are also ready.
	 * @type {boolean}
	 */
	ready : false,

	/**
	 * Not hidden.
	 * @type {boolean}
	 */
	visible : true,

	/**
	 * Not shown.
	 * @type {boolean}
	 */
	invisible : false,

	/**
	 * Spirit was in page DOM, but has now been removed (ie. it was 
	 * detached and not re-attached in the same execution stack). 
	 * This schedules the spirit for destruction.
	 * @type {boolean}
	 */
	exited : false,

	/**
	 * Is destructed? If true, don't try anything funny.
	 * @type {boolean}
	 */
	destructed : false,

	/**
	 * @todo move declaration to super!
	 * @type {Map<String,Array<object>}
	 */
	_handlers : null,

	/**
	 * Construction time.
	 * @overloads {gui.SpiritTracker#construct}
	 */
	onconstruct : function () {
		this._super.onconstruct ();
		this._handlers = Object.create ( null );
	},

	/**
	 * Add one or more action handlers.
	 * @param {object} arg
	 * @param @optional {object} handler implements LifeListener interface, defaults to this.spirit
	 * @returns {gui.Spirit}
	 */
	add : function ( arg, handler ) {		
		handler = handler ? handler : this.spirit;
		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._addchecks ( type, [ handler ])) {
				if ( !this._handlers [ type ]) {
					this._handlers [ type ] = [];
				}
				this._handlers [ type ].push ( handler );
			}
		}, this );
		return this.spirit;
	},

	/**
	 * Remove one or more action handlers.
	 * @param {object} arg
	 * @param @optional {object} handler implements LifeListener interface, defaults to spirit
	 * @returns {gui.Spirit}
	 */
	remove : function ( arg, handler ) {
		handler = handler ? handler : this.spirit;
		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._removechecks ( type, [ handler ])) {
				var index = this._handlers [ type ].indexOf ( type );
				this._handlers [ type ].remove ( index );
				if ( this._handlers [ type ].length === 0 ) {
					delete this._handlers [ type ];
				}
			}
		}, this );
		return this.spirit;
	},

	/**
	 * Dispatch type and cleanup handlers for life cycle events that only occurs once.
	 * @param {String} type
	 */
	dispatch : function ( type ) {
		var list = this._handlers [ type ];
		if ( list !== undefined ) {
			var life = new gui.SpiritLife ( this.spirit, type );
			list.forEach ( function ( handler ) {
				handler.onlife ( life );
			});
			switch ( type ) {
				case gui.SpiritLife.ATTACH :
				case gui.SpiritLife.DETACH :
				case gui.SpiritLife.VISIBLE :
				case gui.SpiritLife.INVISIBLE :
					// may happen more than once
					break;
				default :
					delete this._handlers [ type ];
					break;
			}
		}
	}	
});

/**
 * Generate methods to update life cycle status:
 * 1) Update booleans entered, attached, detached etc.
 * 2) Dispatch life-event gui.SpiritLife.ATTACH etc.
 */
( function generatecode () {
	var states = {
		construct : gui.SpiritLife.CONSTRUCT,
		configure : gui.SpiritLife.CONFIGURE,
		enter : gui.SpiritLife.ENTER,
		attach : gui.SpiritLife.ATTACH,
		ready : gui.SpiritLife.READY,
		visible : gui.SpiritLife.VISIBLE,
		invisible : gui.SpiritLife.INVISIBLE,
		detach : gui.SpiritLife.DETACH,
		exit : gui.SpiritLife.EXIT,
		destruct : gui.SpiritLife.DESTRUCT
	};
	// prefix methods with "on", suffix booleans with "ed"
	gui.Object.each ( states, function ( state, event ) {
		gui.SpiritLifeTracker.addin ( "go" + state , function () {
			var prop = state;
			switch ( state ) {
				case "ready" :
				case "visible" :
				case "invisible" :
					break;
				default :
					prop += "ed";
					break;
			}
			this [ prop ] = true;
			switch ( state ) {
				case "enter" :
				case "attach" :
					this.detached = false;
					break;
				case "detach" :
					this.attached = false;
					break;
				case "visible" :
					this.invisible = false;
					break;
				case "invisible" :
					this.visible = false;
					break;
			}
			this.dispatch ( event );
		});
	});
})();

/**
 * Register plugin (not served in a module this plugin).
 */
gui.Spirit.plugin ( "life", gui.SpiritLifeTracker );