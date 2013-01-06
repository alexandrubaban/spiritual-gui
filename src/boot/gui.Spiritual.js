/**
 * An instance of gui.Spiritual may be referenced as "gui" inside all windows.
 * @param {Window} win Potentially a web worker global scope.
 */
gui.Spiritual = function Spiritual ( win ) {
	
	this._construct ( win );
};

gui.Spiritual.prototype = {
	
	/**
	 * The constructor gui.Spiritual does not exist after first instance gets declared, 
	 * but we may keep something newable allocated by referencing the constructor here.  
	 * @type {function}
	 */
	constructor: gui.Spiritual,
	
	/**
	 * Uniquely identifies this instance of gui.Spiritual. All 
	 * local instances of gui.Spirit gets stamped with a copy.
	 * TODO: rename "guikey"?
	 * @type {String}
	 */
	signature : null,

	/**
	 * Usually the window object. Occasionally a web worker scope.
	 * @type {Window}
	 */
	context : null,

	/**
	 * Spirit management mode. Mathces native|jquery|optimize. 
	 * Note that this will deprecate as soon as iOS supports 
	 * a mechanism for grabbing the native innerHTML setter.
	 * @type {String}
	 */
	mode : "optimize", // recommended setting for iOS support

	/**
	 * Development mode?
	 * @type {boolean}
	 */
	debug : false,
		
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		
		return "[ns gui]";
	},

	/**
	 * Channel spirits on startup.
	 * @see {gui.Guide}
	 */
	go : function () {
		
		this._ready = true;
		gui.World.descend ( this.context );
		gui.Tick.add ( gui.TICK_DESTRUCT_DETACHED, this, this.signature );
		if ( this._configs !== null ) {
			this._configs.forEach ( function ( config ) {
				this.channel ( config.select, config.klass );
			}, this );
		}
	},
	
	/**
	 * Get spirit for argument (argument expected to be a spiritkey for now).
	 * TODO: fuzzy argument resolver to accept DOM elements and ID strings.
	 * @param {object} arg
	 * @returns {gui.Spirit}
	 */
	get : function ( arg ) {
		
		var spirit = null;
		var inside = this._spirits.inside;
		var outside = this._spirits.outside;

		switch ( gui.Type.of ( arg )) {
			case "string" :
				if ( gui.KeyMaster.isKey ( arg )) {
					spirit = inside [ arg ] || outside [ arg ] || null;
				} else {
					/* lookup spirit by element id */
				}
				break;
			case "TODO" :
				break;
		}
		return spirit;
	},
	
	/**
	 * Register module.
	 * @param {String} name
	 * @param {object} module
	 */
	module : function ( name, module ) {
		
		if ( !gui.Type.isString ( name )) {
			throw new TypeError ( "Module name is now required :)" );
		}

		var base = this.context.gui.Spirit; // modules extend gui.Spirit, use init() to extend subclass
		
		// addins (TODO: "decorators")
		if ( gui.Type.isObject ( module.addins )) {
			gui.Object.each ( module.addins, function ( name, value ) {
				base.addin ( name, value );
			}, this );
		}
		
		// plugins
		if ( gui.Type.isObject ( module.plugins )) {
			gui.Object.each ( module.plugins, function ( prefix, plugin ) {
				if ( gui.Type.isDefined ( plugin )) {
					base.plugin ( prefix, plugin );
				} else {
					console.error ( "Undefined plugin for prefix: " + prefix );
				}
			}, this );
		}
		
		// channels
		if ( gui.Type.isArray ( module.channels )) {
			module.channels.forEach ( function ( channel ) {
				var query = channel [ 0 ];
				var klass = channel [ 1 ];
				this.channel ( query, klass );
			}, this );
		}

		this._modulelife ( module, this.context );
		this._modules [ name ] = module;
	},

	/**
	 * Has module? In a multi frame setup, modules may be 
	 * loaded only for the local instance of gui.Spiritual.
	 * @param {String} name
	 * @returns {boolean}
	 */
	hasModule : function ( name ) {

		return gui.Type.isDefined ( this._modules [ name ]);
	},
	
	/**
	 * Channel spirits to CSS selectors in this window 
	 * and windows that import us via the portal method.
	 * @param {String} select CSS selector
	 * @param {object} klass Spirit constructor (as object or string)
	 */
	channel : function ( select, klass ) {
		
		var spirit = null;
		
		if ( this._ready ) {
			if ( typeof klass === "string" ) {
				spirit = gui.Object.lookup ( klass, this.context );
			} else {
				spirit = klass;
			}
			if ( gui.Type.isFunction ( spirit )) {
				this._channels.push ([ select, spirit ]);
			} else {
				throw "Unknown Spirit for selector: " + select;
			}
		} else { // wait for method ready to invoke.
			
			if ( !this._configs ) {
				this._configs = [];
			}
			this._configs.push ({
				select : select,
				klass : klass
			});
		}
	},
	
	/**
	 * Transfer Spirit world to a parallel window in three easy steps.
	 * 1) Extend Element.prototype in window
	 * 2) Declare local ui object in window
	 * 3) Declare spirit world objects, pointing back to this window
	 * @param {Window} sub An external window.
	 */
	portal : function ( sub ) {
		
		if ( sub !== this.context ) {
			
			/*
			 * Create remote gui object then 
			 * portal gui namespaces and members.
			 */
			var subgui = sub.gui = new ( this.constructor )( sub );
			//var indexes = this._index ( this, subgui, this._channels ); // "gui" now via namespace()
			var indexes = [];

			/*
			 * Portal custom namespaces and members.
			 */
			subgui._spaces = this._spaces.slice ();
			this._spaces.forEach ( function ( ns ) {

				// declare (nested) namespace in external context
				// TODO: gui.Object.assert utility method for this
				var external = sub, internal = this.context;
				ns.split ( "." ).forEach ( function ( part ) {
				  if ( !gui.Type.isDefined ( external [ part ])) {
					 external [ part ] = internal [ part ];
				  }
				  external = external [ part ];
				  internal = internal [ part ];
			  });

			  // channel spirits from this namespace 
			  // preserving local channeling order
				this._index ( 
					internal, 
					external, 
					this._channels 
				).forEach ( function ( i ){
					indexes.push ( i );	
				});
			}, this );

			/*
			this._modules.forEach ( function ( module ) {
				this._modulelife ( module, subgui.context );
				subgui._modules.push ( module );
			}, this );
			*/
		
			/*
			 * Portal modules to initialize the sub context.
			 * TODO: portal only the relevant init method?
			 */
			gui.Object.each ( this._modules, function ( name, module ) {
				this._modulelife ( module, subgui.context );
				subgui._modules [ name ] = module;
			}, this );
			
			/*
			 * Sort channels
			 */
			indexes.sort ( function ( a, b ) {
				return a - b; 
			 }).forEach ( function ( i ) {
				 subgui._channels.push ( this._channels [ i ]); 
			}, this );
			
			/*
			 * Here we go
			 */
			gui.Guide.observe ( sub );
		}
	},

	/**
	 * Kickstart Spiritual manuallay. Use this if you lazyload (module-require) 
	 * Spiritual after the document.DOMContentLoaded and window.onload events fire.
	 */
	kickstart : function () {
		
		switch ( document.readyState ) {
			case "interactive" :
			case "complete" :
				gui.Broadcast.dispatchGlobal ( null, gui.BROADCAST_KICKSTART );
				break;
		}
	},
	
	/**
	 * Members of given namespace will be migrated 
	 * to descendant iframes via the portal method.
	 * @param {String} ns
	 */
	namespace : function ( ns ) {
		
		if ( gui.Type.isString ( ns )) { // TODO: must it be a string?
			this._spaces.push ( ns );
		} else {
			throw new TypeError ( "Expected a string: gui.namespace" );
		}
	},

	/**
	 * List spiritual namespaces (returns a copy).
	 * @return {Array<String>}
	 */
	namespaces : function () {

		return this._spaces.slice ();
	},
	
	/**
	 * Get Spirit implementation for DOM element.
	 * Spirit may be local to containing window.
	 * 1) Test for element "gui" attribute
	 * 2) Test if element matches selectors 
	 * @param {Element} element
	 * @returns {function} Spirit constructor
	 */
	evaluate : function ( element ) {
		
		var res = null;
		if ( element.nodeType === Node.ELEMENT_NODE ) {
			
			var doc = element.ownerDocument;
			var win = doc.defaultView;
			var att = element.getAttribute ( "gui" ); // TODO: "data-gui"

			// test for "gui" attribute in markup. "[" accounts for {gui.Spirit#__debug__}
			if ( gui.Type.isString ( att ) && !att.startsWith ( "[" )) {
				if ( att !== "" ) { // no spirit for empty string
					res = win.gui._inlines [ att ];
					if ( !gui.Type.isDefined ( res )) {
						res = gui.Object.lookup ( att, win );
					}
					if ( res ) {
						win.gui._inlines [ att ] = res;
					} else {
						console.error ( att + " is not defined." );
					}
				}
			} else { // channel spirit via CSS selectors
				win.gui._channels.every ( function ( def ) {
					var select = def [ 0 ];
					var spirit = def [ 1 ];
					if ( gui.SpiritCSS.matches ( element, select )) {
						res = spirit;
					}
					return res === null;
				}, this );
			}
		}
		return res;
	},
	
	/**
	 * Broadcast event details globally. Use this if you stopPropagate   
	 * an event for personal reasons and don't want to keep it a secret.
	 * @param {String} message gui.BROADCAST_MOUSECLICK or similar
	 * @param @optional {object} arg This could well be a MouseEvent
	 */
	broadcast : function ( message, arg ) {
		
		if ( gui.Type.of ( arg ).endsWith ( "event" )) {
			arg = new gui.EventSummary ( arg );
		}
		gui.Broadcast.dispatchGlobal ( this, message, arg );
	},
	
	/**
	 * Log channels to console.
	 * TODO: deprecate this (create gui.Developer).
	 */
	debugchannels : function () {
		
		var out = this._document.location.toString ();
		this._channels.forEach ( function ( channel ) {
			out += "\n" + channel [ 0 ] + " : " + channel [ 1 ];
		});
		console.debug ( out + "\n\n" );
	},
	
	/**
	 * Terminate spirit management.
	 * @param {gui.Spirit} spirit
	 */
	destruct : function ( spirit ) {

		var all = this._spirits;
		var key = spirit.spiritkey;
		delete all.inside [ key ];
		delete all.outside [ key ];
	},
	
	
	// INTERNALS .....................................................................................................
	
	/**
	 * Register spirit in document (framework internal method).
	 * TODO: move? rename? 
	 * @param {gui.Spirit} spirit
	 */
	inside : function ( spirit ) {
		
		var all = this._spirits;
		var key = spirit.spiritkey;
		if ( !all.inside [ key ]) {
			if ( all.outside [ key ]) {
				delete all.outside [ key ];
			}
			all.inside [ key ] = spirit;
		}
	},
	
	/**
	 * Register spirit outside document (scheduled for destruction).
	 * TODO: move? rename?
	 * @param {gui.Spirit} spirit
	 */
	outside : function ( spirit ) {
		
		var all = this._spirits;
		var key = spirit.spiritkey;
		if ( !all.outside [ key ]) {
			if ( all.inside [ key ]) {
				delete all.inside [ key ];
			}
			all.outside [ key ] = spirit;
			gui.Tick.dispatch ( gui.TICK_DESTRUCT_DETACHED, 0, this.signature );
		}
	},
	
	/**
	 * Handle tick.
	 * @param {gui.Tick} tick
	 */
	ontick : function ( tick ) {

		// TODO: do we want to loose track of potential non-exited spirit?
		if ( tick.type === gui.TICK_DESTRUCT_DETACHED ) {
			gui.Object.each ( this._spirits.outside, function ( key, spirit ) {
				if ( spirit.onexit () !== false ) { // spirit may prevent destruction
					spirit.ondestruct ();
				}
			}, this );
			this._spirits.outside = Object.create ( null );
		}
	},

	/**
	 * Invoked by the gui.Guide on window.unload (synchronized as final event).
	 * TODO: naming clash with method "destruct"
	 * TODO: Think of more stuff to cleanup here...
	 */
	nameDestructAlreadyUsed : function () {

		gui.Tick.remove ( gui.TICK_DESTRUCT_DETACHED, this, this.signature );

		/*
		 * TODO: figure out of any of this manual garbage dumping works.
		 */
		delete this._spiritualaid;
		delete this.context;
		delete this._document;
		delete this._channels;
		delete this._inlines;
		delete this._spaces;
		delete this._modules;
		delete this._spirits;
	},
	
	
	// PRIVATES ......................................................................................................
	
	/**
	 * Document context.
	 * @type {Document}
	 */
	_document : null,
	
	/**
	 * Lisitng CSS selectors associated to Spirit constructors. 
	 * Order is important: First spirit to match selector is it. 
	 * Note that each window maintains a version of gui._channels.
	 * @type {Array<Array<String,function>>}
	 */
	_channels : null,
	
	/**
	 * Cache Spirits resolved by lookup of "gui" attribute.
	 * @type {Map<String,function>}
	 */
	_inlines : null,
	
	/**
	 * Hm...
	 */
	_spaces : null,
	
	/**
	 * @type {boolean}
	 */
	_ready : false,
	
	/**
	 * @type {Array<object>}
	 */
	_configs : null,

	/**
	 * @type {Map<String,object>}
	 */
	_modules : null,
	
	/**
	 * Tracking spirits by spiritkey (detached spirits are subject to destruction).
	 * @type {Map<String,Map<String,gui.Spirit>>}
	 */
	_spirits : null,

	/** 
	 * The constructor gui.SpiritualAid does not exist after first instance gets declared, 
	 * but we may keep something newable allocated by referencing the constructor here.
	 * @type {gui.SpiritualAid}
	 */
	_spiritualaid : gui.SpiritualAid,

	/**
	 * Construction time again.
	 * @param {Window} win
	 */
	_construct : function ( win ) {
		
		// patching features
		this._spiritualaid.polyfill ( win );
		
		// generate signature
		this.signature = "sig" + String ( Math.random ()).split ( "." )[ 1 ];
		
		// basic setup
		this.context = win;
		this._document = win.document;
		this._inlines = Object.create ( null );
		this._modules = Object.create ( null );
		this._channels = [];
		this._spaces = [ "gui" ];
		this._spirits = {
			inside : Object.create ( null ), // spirits positioned in page DOM ("entered" and "attached")
			outside : Object.create ( null ) // spirits removed from page DOM (currently "detached")
		};
	},

	/**
	 * Reference local objects in remote window context while collecting channel indexes.
	 * @param {object} internal This gui.Spiritual instance
	 * @param {object} external New gui.Spiritual instance
	 * @param {Array<object>} channels
	 * @returns {Array<number>}
	 */
	_index : function ( internal, external, channels ) {
		
		var indexes = [];
		for ( var def in internal ) {
			if ( !this.constructor.prototype.hasOwnProperty ( def )) {
				if ( !def.startsWith ( "_" )) {
					switch ( def ) {
						case "signature" :
						case "context" :
							// must be kept unique in each window context
							break;
						default :
							var thing = external [ def ] = internal [ def ];
							if ( gui.Type.isSpiritConstructor ( thing )) {
								if ( thing.portals ) {
									channels.forEach ( function ( channel, index ) {
										if ( channel [ 1 ] === thing ) {
											indexes.push ( index );
										}
									});
								}
							}
							break;
					}
				}
			}
		}
		return indexes;
	},
	
	/**
	 * @param {object} module
	 * @param {Window} context
	 */
	_modulelife : function ( module, context ) {

		// invoke init now?
		if ( gui.Type.isFunction ( module.init )) {
			module.init ( context );
		}

		// invoke ready before document is spiritualized?
		if ( gui.Type.isFunction ( module.ready )) {
			gui.Broadcast.addGlobal (
				gui.BROADCAST_WILL_SPIRITUALIZE, {
					onbroadcast : function ( b ) {
						if ( b.data === context.gui.signature ) {
							module.ready ( context );
							gui.Broadcast.removeGlobal ( 
								gui.BROADCAST_WILL_SPIRITUALIZE, 
								this
							);
						}
					}
				}
			);
		}
	}
};

/*
 * TODO: comment required
 */
Object.keys ( gui ).forEach ( function ( key ) {
	gui.Spiritual.prototype [ key ] = gui [ key ];
});

/*
 * TODO: comment even more required
 */
gui = new gui.Spiritual ( window );