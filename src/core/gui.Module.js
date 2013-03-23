/**
 * Module base.
 */
gui.Module = gui.Class.create ( "gui.Module", Object.prototype, {

	/**
	 * Plugins for all spirits.
	 * @type {Map<String,gui.Plugin>}
	 */
	plugins : null,

	/**
	 * Mixins for all spirits.
	 * @type {Map<String,function>}
	 */
	mixins : null,

	/**
	 * Channeling spirits to CSS selectors.
	 * @type {Map<Array<Array<String,gui.Spirit>>}
	 */
	channels : null,

	/**
	 * Called immediately. Other modules may not be loaded yet.
	 * @return {Window} context
	 */
	oncontextinitialize : function ( context ) {},

	/**
	 * Called before spirits kick in.
	 * @return {Window} context
	 */
	onbeforespiritualize : function ( context ) {},

	/**
	 * Called after spirits kicked in.
	 * @return {Window} context
	 */
	onafterspiritualize : function ( context ) {},


	// Secrets ........................................................

	/**
	 * Secret constructor.
	 * 
	 * 1. extend {gui.Spirit} with mixins
	 * 2. inject plugins for (all) spirits
	 * 3. channel spirits to CSS selectors
	 * @param {Window} context
	 */
	$onconstruct : function ( context ) {
		var base = context.gui.Spirit;
		if ( gui.Type.isObject ( this.mixins )) {
			gui.Object.each ( this.mixins, function ( name, value ) {
				base.mixin ( name, value );
			});
		}
		if ( gui.Type.isObject ( this.plugins )) {
			gui.Object.each ( this.plugins, function ( prefix, plugin ) {
				if ( gui.Type.isDefined ( plugin )) {
					base.plugin ( prefix, plugin );
				} else {
					console.error ( "Undefined plugin for prefix: " + prefix );
				}
			});
		}
		if ( gui.Type.isArray ( this.channels )) {
			this.channels.forEach ( function ( channel ) {
				var query = channel [ 0 ];
				var klass = channel [ 1 ];
				context.gui.channel ( query, klass );
			}, this );
		}
		this.$setupcontext ( context );
	},

	/**
	 * Setup that context, once for every context the module has been portalled to.
	 * @see {gui.Spiritual#portal}
	 * @param {Window} context
	 */
	$setupcontext : function ( context ) {
		var that = this;
		var msg1 = gui.BROADCAST_WILL_SPIRITUALIZE;
		var msg2 = gui.BROADCAST_DID_SPIRITUALIZE;
		if ( this.oncontextinitialize ) {
			this.oncontextinitialize ( context );
		}
		gui.Broadcast.addGlobal ([
			msg1, 
			msg2
		], { 
			onbroadcast : function ( b ) {
				if ( b.data === context.gui.signature ) {
					gui.Broadcast.removeGlobal ( b.type, this );
					switch ( b.type ) {
						case msg1 :
							if ( gui.Type.isFunction ( that.onbeforespiritualize )) {
								that.onbeforespiritualize ( context );	
							}
							break;
						case msg2 :
							if ( gui.Type.isFunction ( that.onafterspiritualize )) {
								that.onafterspiritualize ( context );	
							}
							break;
				}
			}
		}});
	}

});