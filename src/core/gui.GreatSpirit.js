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


	// Secrets ..........................................................................

	/**
	 * - Nuke lazy plugins so that we don't accidentally instantiate them
	 * - Destruct remaining plugins, saving the {gui.Life} plugin for last
	 * - Replace all properties with an accessor to throw an exception
	 */
	$meet : function ( spirit ) {
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
	 * Replace al properties with an accessor to throw an exception.
	 * @TODO: keep track of non-enumerables and nuke those as well :/
	 * @param {object} thing
	 * @param {Window} context
	 */
	$nukeallofit : function ( thing, context ) {
		var nativeprops = context.Object.prototype;
		for ( var prop in thing ) {
			if ( nativeprops [ prop ] === undefined ) {
				var desc = Object.getOwnPropertyDescriptor ( thing, prop );
				if ( !desc || desc.configurable ) {
					Object.defineProperty ( thing, prop, this.DENIED );
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
	 */
	DENY : function ( message ) {
		var stack, e = new ReferenceError ( gui.Spirit.DENIAL );
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
			throw new ReferenceError ( e.message + "\n" + stack );
		} else {
			throw e;
		}
	}
};