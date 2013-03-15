/**
 * Base class for all spirit plugins.
 * @todo "context" should be required in constructor
 * @todo Rename "gui.Plugin"
 * @todo Rename *all* plugins to gui.SomethingPlugin :)
 */
gui.Plugin = gui.Class.create ( "gui.Plugin", Object.prototype, {

	/**
	 * Associated spirit.
	 * @type {gui.Spirit}
	 */
	spirit : null,

	/**
	 * Plugins may be designed to work without an associated spirit. 
	 * In that case, an external entity might need to define this. 
	 * @type {Global} Typically identical to this.spirit.window
	 */
	context : null,

	/**
	 * Construct
	 */
	onconstruct : function () {},

	/**
	 * Destruct.
	 */
	destruct : function () {},

	/**
	 * Implements DOM2 EventListener. Forwards to onevent().
	 * @param {Event} e
	 */
	handleEvent : function ( e ) {
		if ( gui.Type.isFunction ( this.onevent )) {
			this.onevent ( e );
		}
	},
	
	
	// Secret ...........................................................

	/**
	 * Secret constructor. Can we identify the 
	 * spirit and it's associated window? Not, 
	 * then we are maybe inside a Web Worker.
	 * @param {gui.Spirit} spirit
	 */
	$onconstruct : function ( spirit ) {
		this.spirit = spirit || null;
		this.context = spirit ? spirit.window : null;
	},

	/**
	 * Secret destructor. Catching stuff that 
	 * might be executed on a timed schedule.
	 */
	__destruct__ : function () {
		this.destruct ();
		if ( this.spirit !== null ) {
			Object.defineProperty ( this, "spirit", gui.Spirit.DENIED );
		}
	}
	

}, { // Recurring static ........................................

	/**
	 * Construct only when requested?
	 * @type {boolean}
	 */
	lazy : true,

	/**
	 * Plugins don't infuse.
	 */
	infuse : function () {
		throw new Error ( 
			'Plugins must use the "extend" method and not "infuse".'
		);
	}


}, { // Static ..................................................

	/**
	 * Lazy initialization stuff.
	 * @experimental
	 * @param {gui.Plugin} Plugin
	 * @param {String} prefix
	 * @param {gui.Spirit} spirit
	 */
	later : function ( Plugin, prefix, spirit, map ) {
		map [ prefix ] = true;
		Object.defineProperty ( spirit, prefix, {
			enumerable : true,
			configurable : true,
			get : function () {
				if ( map [ prefix ] === true ) {
					map [ prefix ] = new Plugin ( spirit );
					map [ prefix ].onconstruct ();
				}
				return map [ prefix ];
			},
			set : function ( x ) {
				map [ prefix ] = x; // or what?
			}
		});
	}

});