/**
 * Base constructor for all plugins.
 * @TODO "context" should be required in constructor (sandbox scenario)
 * @TODO Rename "gui.Plugin"
 * @TODO Rename *all* plugins to gui.SomethingPlugin :)
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
	ondestruct : function () {},

	/**
	 * Implements DOM2 EventListener (native event handling). 
	 * We forwards the event to method 'onevent' IF that has 
	 * been specified on the plugin.
	 * @param {Event} e
	 */
	handleEvent : function ( e ) {
		if ( gui.Type.isFunction ( this.onevent )) {
			this.onevent ( e );
		}
	},
	
	
	// Secret ............................................................

	/**
	 * Secret constructor. Called before `onconstruct`. 
	 * @param {gui.Spirit} spirit
	 */
	$onconstruct : function ( spirit ) {
		this.spirit = spirit || null;
		this.context = spirit ? spirit.window : null; // web worker scenario
		this.onconstruct ();
	},

	/**
	 * Secret destructor. Called after `ondestruct`.
	 */
	$ondestruct : function () {
		gui.GreatSpirit.$nukeallofit ( this, this.spirit.window );
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
	 * Lazy plugins are newed up only when needed. We'll create an 
	 * accessor for the prefix that will instantiate the plugin and 
	 * create a new accesor to return it. To detect if a plugin 
	 * has been instantiated, check with {gui.LifePlugin#plugins}, 
	 * a hashmap that maps prefixes to a boolean status.
	 * @param {gui.Spirit} spirit
	 * @param {String} prefix
	 * @param {function} Plugin
	 */
	runonaccessor : function ( spirit, prefix, Plugin ) {
		Object.defineProperty ( spirit, prefix, {
			enumerable : true,
			configurable : true,
			get : function () {
				var plugin = new Plugin ( this );
				this.life.plugins [ prefix ] = true;
				Object.defineProperty ( this, prefix, {
					enumerable : true,
					configurable : true,
					get : function () {
						return plugin;
					}
				});
				return plugin;
			}
		});
	}

});