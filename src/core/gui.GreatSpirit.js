/**
 * Where spirits go to be garbage collected. Not for public 
 * consumption: Please dispose of spirits via the {gui.Guide}.
 * @see {gui.Guide#materialize}
 * @see {gui.Guide#materializeOne}
 * @see {gui.Guide#materializeSub}
 */
gui.GreatSpirit = {

	/**
	 * To identify our exception in a try-catch scenario, look for 
	 * this string in the *beginning* of the exception message. 
	 * @type {String}
	 */
	DENIAL : "Attempt to handle destructed spirit",

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.GreatSpirit]";
	},

	/**
	 * Nukefication moved to next tick. This will minimize chaos, 
	 * but does imply that for the duration of this tick, methods 
	 * might be called on spirits that don't exist in the DOM. 
	 * @TODO: Flag for this behavior (defaulting to off)?
	 */
	ontick : function ( t ) {
		var spirit, spirits = this._spirits.slice ();
		if ( t.type === gui.$TICK_DESTRUCT ) {
			while (( spirit = spirits.shift ())) {
				this.$nuke ( spirit );
			}
			this._spirits = [];
		}
	},


	// Secret ..........................................................................

	/**
	 * Schedule to nuke the spirit.
	 * @TODO: on `window.unload` nuke the spirit now
	 * @param {gui.Spirit} spirit
	 */
	$meet : function ( spirit ) {
		this._spirits.push ( spirit );
		gui.Tick.dispatch ( gui.$TICK_DESTRUCT, 0 );
	},

	/**
	 * Nuke that spirit.
	 * 
	 * - Nuke lazy plugins so that we don't accidentally instantiate them
	 * - Destruct remaining plugins, saving the {gui.Life} plugin for last
	 * - Replace all properties with an accessor to throw an exception
	 * 
	 * @param {gui.Spirit} spirit
	 */
	$nuke : function ( spirit ) {
		var prefixes = [], plugins = spirit.life.plugins;
		gui.Object.each ( plugins, function ( prefix, instantiated ) {
			if ( instantiated ) {
				if ( prefix !== "life" ) {
					prefixes.push ( prefix );
				}
			} else {
				Object.defineProperty ( spirit, prefix, {
					enumerable : true,
					configurable : true,
					get : function () {},
					set : function () {}
				});
			}
		});
		this.$nukeplugins ( spirit, prefixes.sort ());
		this.$nukeplugins ( spirit, [ "life" ]);
		this.$nukeelement ( spirit );
		this.$nukeallofit ( spirit, spirit.window );
	},

	/**
	 * Nuke plugins in two steps to minimize access violations.
	 * @param {gui.Spirit} spirit
	 * @param {Array<String>} prefixes
	 */
	$nukeplugins : function ( spirit, prefixes ) {
		var plugins = prefixes.map ( function ( key ) {
			return spirit [ key ];
		}, this );
		plugins.forEach ( function ( plugin ) {
			plugin.ondestruct ();
		});
		plugins.forEach ( function ( plugin ) {
			plugin.$ondestruct ();
		});
	},

	/**
	 * Unreference spirit associated element. 
	 * Explorer may deny permission in frames.
	 * @TODO: Is IE exception still relevant?
	 */
	$nukeelement : function ( spirit ) {
		try {
			spirit.element.spirit = null;
		} catch ( denied ) {}
	},

	/**
	 * Replace own properties with an accessor to throw an exception. 
	 * In 'gui.debug' mode we replace all props, not just own props, 
	 * so that we may fail fast on attempt to handle destructed spirit.
	 * @TODO: keep track of non-enumerables and nuke those as well :/
	 * @param {object} thing
	 * @param {Window} context
	 */
	$nukeallofit : function ( thing, context ) {
		var nativeprops = context.Object.prototype;
		for ( var prop in thing ) {
			if ( thing.hasOwnProperty ( prop ) || gui.debug ) {
				if ( nativeprops [ prop ] === undefined ) {
					var desc = Object.getOwnPropertyDescriptor ( thing, prop );
					if ( !desc || desc.configurable ) {
						if ( context.gui.debug ) {
							this._definePropertyItentified ( thing, prop );
						} else {
							Object.defineProperty ( thing, prop, this.DENIED );
						}
					}
				}
			}
		}
	},

	/**
	 * User to access property post destruction, report that the spirit was terminated.
	 */
	DENIED : {
		enumerable : true,
		configurable : true,
		get : function () {
			gui.GreatSpirit.DENY ();
		},
		set : function () {
			gui.GreatSpirit.DENY ();
		}
	},

	/**
	 * Obscure mechanism to include the whole stacktrace in the error message.
	 * @see https://gist.github.com/jay3sh/1158940
	 * @param @optional {String} message
	 */
	DENY : function ( message ) {
		var stack, e = new Error ( gui.GreatSpirit.DENIAL + ( message ? ": " + message : "" ));
		if ( !gui.Client.isExplorer && ( stack = e.stack )) {
			if ( gui.Client.isWebKit ) {
				stack = stack.replace ( /^[^\(]+?[\n$]/gm, "" ).
					replace ( /^\s+at\s+/gm, "" ).
					replace ( /^Object.<anonymous>\s*\(/gm, "{anonymous}()@" ).
					split ( "\n" );
			} else {
				stack = stack.split ( "\n" );
			}
			stack.shift (); stack.shift (); // @TODO: shift one more now?
			throw new Error ( e.message + "\n" + stack );
		} else {
			throw e;
		}
	},


	// Private ..........................................................................

	/**
	 * Spirits scheduled for destruction.
	 * @type {Array<gui.Spirit>}
	 */
	_spirits : [],

	/**
	 * In debug mode, throw a more qualified "attempt to handle destructed spirit".
	 * @param {object} thing
	 * @param {String} prop
	 */
	_definePropertyItentified : function ( thing, prop ) {
			Object.defineProperty ( thing, prop, {
			enumerable : true,
			configurable : true,
			get : function () {
				gui.GreatSpirit.DENY ( thing );
			},
			set : function () {
				gui.GreatSpirit.DENY ( thing );
			}
		});
	},
};

gui.Tick.add ( gui.$TICK_DESTRUCT, gui.GreatSpirit );