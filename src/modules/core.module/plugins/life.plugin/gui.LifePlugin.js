/**
 * Tracking spirit life cycle events.
 * @TODO Support optional data argument
 * @extends {gui.Tracker}
 */
gui.LifePlugin = gui.Tracker.extend ( "gui.LifePlugin", {

	/**
	 * Spirit is constructed? This is almost certainly true by 
	 * the time you address the spirit.
	 * @type {boolean}
	 */
	constructed : false,

	/**
	 * @TODO EXPERIMENT...
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
	 * Is visible?
	 * @type {boolean}
	 */
	visible : undefined,

	/**
	 * Is invisible?
	 * @type {boolean}
	 */
	invisible : undefined,

	/**
	 * Mapping plugin prefix to initialized status, 'false' 
	 * is a lazy plugin that has not yet been constructed. 
	 * @type {[type]}
	 */
	plugins : null,

	/**
	 * Construction time.
	 * @overloads {gui.Tracker#construct}
	 */
	onconstruct : function () {
		this._super.onconstruct ();
		this._handlers = Object.create ( null );
		this.plugins = Object.create ( null );
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
	 * @TODO support optional data argument
	 * @param {String} type
	 */
	dispatch : function ( type ) {
		var list = this._handlers [ type ];
		if ( list !== undefined ) {
			var life = new gui.Life ( this.spirit, type );
			list.forEach ( function ( handler ) {
				handler.onlife ( life );
			});
			switch ( type ) {
				case gui.Life.CONSTRUCT :
				case gui.Life.CONFIGURE :
				case gui.Life.ENTER :
				case gui.Life.READY :
				case gui.Life.DETACH :
				case gui.Life.EXIT :
				case gui.Life.DESTRUCT :
					delete this._handlers [ type ];
					break;
			}
		}
	},

	/**
	 * @TODO move declaration to super or something (?)
	 * @type {Map<String,Array<object>}
	 */
	_handlers : null

});

/**
 * Generate methods to update life cycle status:
 * 1) Update booleans entered, attached, detached etc.
 * 2) Dispatch life-event gui.Life.ATTACH etc.
 */
( function generatecode () {
	var states = {
		construct : gui.LIFE_CONSTRUCT,
		configure : gui.LIFE_CONFIGURE,
		enter : gui.LIFE_ENTER,
		attach : gui.LIFE_ATTACH,
		ready : gui.LIFE_READY,
		visible : gui.LIFE_VISIBLE,
		invisible : gui.LIFE_INVISIBLE,
		detach : gui.LIFE_DETACH,
		exit : gui.LIFE_EXIT,
		destruct : gui.LIFE_DESTRUCT
	};
	// prefix methods with "on", suffix booleans with "ed"
	gui.Object.each ( states, function ( state, event ) {
		gui.LifePlugin.mixin ( "go" + state , function () {
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