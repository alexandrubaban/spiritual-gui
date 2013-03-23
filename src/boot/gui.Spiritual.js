/**
 * An instance of this thing may be referenced as `gui` inside all windows. 
 * @param {Window} win Window or Worker scope
 */
gui.Spiritual = function Spiritual ( win ) {
	this._construct ( win );
};

gui.Spiritual.prototype = {

	/**
	 * The constructor gui.Spiritual does not exist after first instance gets declared, 
	 * but we may keep something newable allocated by referencing it around here.
	 * @type {function}
	 */
	constructor: gui.Spiritual,

	/**
	 * Uniquely identifies this instance of `gui.Spiritual` 
	 * knowing that other instances may exist in iframes.
	 * @TODO rename guikey or windowkey or contextkey
	 * @type {String}
	 */
	signature : null,

	/**
	 * Usually the window object. Occasionally a web worker scope.
	 * @type {GlobalScope}
	 */
	context : null,

	/**
	 * Context window (if not in a worker).
	 * @type {Window}
	 */
	window : null,

	/**
	 * Context document (if not in a worker).
	 * @type {Document}
	 */
	document : null,

	/**
	 * Spirit management mode. Matches one of 
	 * 
	 * - native
	 * - jquery
	 * - optimize.
	 * - managed
	 *  
	 * @note This will deprecate as soon as iOS supports a mechanism for grabbing the native innerHTML setter.
	 * @type {String}
	 */
	mode : "optimize", // recommended setting for iOS support

	/**
	 * Development mode? Enable this to log more console messages or something.
	 * @type {boolean}
	 */
	debug : false,

	/**
	 * Automatically run on DOMContentLoaded? 
	 * If set to false, run using kickstart().
	 * @type {boolean}
	 */
	autostart : true,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[namespace gui]";
	},

	/**
	 * Channel spirits on startup. 
	 * Called by the {gui.Guide}
	 * @see {gui.Guide}
	 */
	go : function () {
		this._gone = true;
		if ( this.debug ) {
			if ( this.mode === gui.MODE_JQUERY ) {
				gui.Tick.next ( function () {  // @TODO somehow not conflict with http://stackoverflow.com/questions/11406515/domnodeinserted-behaves-weird-when-performing-dom-manipulation-on-body
					gui.Observer.observe ( this.context ); // @idea move all of _step2 to next stack?
				}, this );
			} else {
				gui.Observer.observe ( this.context );
			}
		}
		switch ( this.mode ) {
			case gui.MODE_NATIVE :
			case gui.MODE_JQUERY :
			case gui.MODE_OPTIMIZE :
			case gui.MODE_MANAGED :
				gui.DOMChanger.change ( this.context );
				break;
		}
		gui.Tick.add ( gui.TICK_DESTRUCT_DETACHED, this, this.signature );
		if ( this._configs !== null ) {
			this._configs.forEach ( function ( config ) {
				this.channel ( config.select, config.klass );
			}, this );
		}
	},

	/**
	 * Get spirit for argument (argument expected to be a `$instanceid` for now).
	 * @TODO fuzzy resolver to accept elements and queryselectors
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
					var element = this.document.querySelector ( arg );
					spirit = element ? element.spirit : null;
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
	 * @returns {object}
	 */
	module : function ( name, module ) {
		if ( !gui.Type.isString ( name )) {
			throw new Error ( "Module requires a name" );
		} else {
			module = this._modules [ name ] = new ( 
				gui.Module.extend ( name, module )
			)( this.context );
		}
		this._modulelife ( module, this.context );
		return module;
	},

	/**
	 * Has module registered?
	 * @param {String} name Module name
	 * @returns {boolean}
	 */
	hasModule : function ( name ) {
		return gui.Type.isDefined ( this._modules [ name ]);
	},

	/**
	 * Channel spirits to CSS selectors.
	 * @param {String} select CSS selector
	 * @param {object|String} klass Constructor or name
	 */
	channel : function ( select, klass ) {
		var spirit = null;
		if ( this._gone ) {
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
	 * Mixin prototype property. Checking for naming collision.
	 * @param {String} key
	 * @param {object} value
	 * @param @optional {boolean} override
	 * @returns {object} Returns the mixin value
	 *
	mixin : function ( key, value, override ) {
		var proto = this.constructor.prototype;
		return gui.Object.mixin ( proto, key, value, override );
	},
	*/

	/**
	 * Portal Spiritual to a parallel window in three easy steps.
	 * 
	 * 1. Create a local instance of `gui.Spiritual` (this class) and assign it to the global variable `gui` in remote window.
	 * 2. For all members of local `gui`, stamp a reference onto remote `gui`. In remote window, the variable `gui.Spirit` now points to a class declared in this window.
	 * 3. Setup {gui.Guide} to attach remote spirits when the document loads.
	 *
	 * Members of the `gui` namespace can be setup not to portal by setting the static boolean `portals=false` on the constructor.
	 * @param {Window} sub An external window.
	 */
	portal : function ( sub ) {
		if ( sub !== this.context ) {
			// create remote gui object then portal gui namespaces and members.
			var subgui = sub.gui = new ( this.constructor )( sub );
			var indexes = [];
			// portal custom namespaces and members.
			subgui._spaces = this._spaces.slice ();
			this._spaces.forEach ( function ( ns ) {
				 // declare (nested) namespace in external context @TODO use gui.Object.assert
				var external = sub, internal = this.context;
				ns.split ( "." ).forEach ( function ( part ) {
				  if ( !gui.Type.isDefined ( external [ part ])) {
					 external [ part ] = internal [ part ];
				  }
				  external = external [ part ];
				  internal = internal [ part ];
			  });
			  // channel spirits from this namespace preserving local channeling order
				this._index ( 
					internal, 
					external, 
					this._channels 
				).forEach ( function ( i ){
					indexes.push ( i );	
				});
			}, this );
			// Portal modules to initialize the sub context
			// @TODO portal only the relevant init method?
			gui.Object.each ( this._modules, function ( name, module ) {
				module.$setupcontext ( subgui.context );
				subgui._modules [ name ] = module;
			}, this );
			// Sort channels
			indexes.sort ( function ( a, b ) {
				return a - b; 
			 }).forEach ( function ( i ) {
				 subgui._channels.push ( this._channels [ i ]); 
			}, this );
			// Here we go
			gui.Guide.observe ( sub );
		}
	},

	/**
	 * Kickstart Spiritual manuallay. Use this if you somehow 
	 * load Spiritual after DOMContentLoaded event has fired.
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
	 * @param {object} nsobject
	 * @returns {object}
	 */
	namespace : function ( ns, nsobject ) {	
		if ( gui.Type.isString ( ns )) { // @TODO must it be a string?
			this._spaces.push ( ns );
		} else {
			throw new TypeError ( "Expected a string: gui.namespace" );
		}
		return nsobject;
	},

	/**
	 * List spiritual namespaces (returns a copy).
	 * @return {Array<String>}
	 */
	namespaces : function () {
		return this._spaces.slice ();
	},

	/**
	 * Get Spirit constructor for element.
	 * 
	 * 1. Test for element `gui` attribute
	 * 2. Test if element matches selectors 
	 * @param {Element} element
	 * @returns {function} Spirit constructor
	 */
	evaluate : function ( element ) {
		var res = null;
		if ( element.nodeType === Node.ELEMENT_NODE ) {
			var doc = element.ownerDocument;
			var win = doc.defaultView;
			var att = element.getAttribute ( "gui" ); // @TODO "data-gui"
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
					if ( gui.CSSPlugin.matches ( element, select )) {
						res = spirit;
					}
					return res === null;
				}, this );
			}
		}
		return res;
	},

	/**
	 * Broadcast something globally. Events will be wrapped in an EventSummary.
	 * @param {String} message gui.BROADCAST_MOUSECLICK or similar
	 * @param @optional {object} arg This could well be a MouseEvent
	 */
	broadcastGlobal : function ( msg, arg ) {
		if ( gui.Type.isEvent ( arg )) {
			arg = new gui.EventSummary ( arg );
		}
		gui.Broadcast.dispatchGlobal ( this, msg, arg );
	},

	/**
	 * Log channels to console.
	 * @TODO deprecate this (create gui.Developer).
	 */
	debugchannels : function () {
		var out = this.document.location.toString ();
		this._channels.forEach ( function ( channel ) {
			out += "\n" + channel [ 0 ] + " : " + channel [ 1 ];
		});
		console.debug ( out + "\n\n" );
	},

	/**
	 * Stop tracking the spirit. Called 
	 * by the spirit when it destructs.
	 * @param {gui.Spirit} spirit
	 */
	destruct : function ( spirit ) {
		var all = this._spirits;
		var key = spirit.$instanceid;
		delete all.inside [ key ];
		delete all.outside [ key ];
	},
	
	
	// Internal .................................................................

	/**
	 * Register spirit in document (framework internal method).
	 * @TODO move? rename? 
	 * @param {gui.Spirit} spirit
	 */
	inside : function ( spirit ) {
		var all = this._spirits;
		var key = spirit.$instanceid;
		if ( !all.inside [ key ]) {
			if ( all.outside [ key ]) {
				delete all.outside [ key ];
			}
			all.inside [ key ] = spirit;
		}
	},

	/**
	 * Register spirit outside document (now scheduled for destruction).
	 * @TODO move? rename?
	 * @param {gui.Spirit} spirit
	 */
	outside : function ( spirit ) {
		var all = this._spirits;
		var key = spirit.$instanceid;
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
		// @TODO do we want to loose track of potential non-exited spirit?
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
	 * Invoked by the {gui.Guide} on window.unload (synchronized as final event).
	 * @TODO figure out of any of this manual garbage dumping works.
	 * @TODO naming clash with method "destruct"
	 * @TODO Think of more stuff to cleanup here...
	 */
	nameDestructAlreadyUsed : function () {
		gui.Tick.remove ( gui.TICK_DESTRUCT_DETACHED, this, this.signature );
		[ 
			"_spiritualaid", 
			"context", 
			"document", 
			"_channels", 
			"_inlines",
			"_spaces", 
			"_modules", 
			"_spirits" 
		].forEach ( function ( thing ) {
			delete this [ thing ];
		}, this );
	},
	

	// Private .................................................................

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
	 * Spaceous.
	 */
	_spaces : null,

	/**
	 * Flipped to `true` after `go()`
	 * @type {boolean}
	 */
	_gone : false,

	/**
	 * Comment back.
	 * @type {Array<object>}
	 */
	_configs : null,

	/**
	 * Yet another comment.
	 * @type {Map<String,object>}
	 */
	_modules : null,

	/**
	 * Tracking spirits by $instanceid (detached spirits are subject to destruction).
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
	_construct : function ( context ) {

		// patching features
		this._spiritualaid.polyfill ( context );		
		// compute signature (possibly identical to $instanceid of hosting iframe spirit)
		this.signature = ( function () {
			var sig, url = location.href;
			var key = "spiritual-signature"; // ouch, must remain configurable!
			if ( url.contains ( key )) {
				return gui.URL.getParam ( url, key ).split ( "/" ).pop ();
			} else {
				return gui.KeyMaster.generateKey ();	
			}
		}());
		
		// basic setup
		this.context = context;
		this.window = context.document ? context : null;
		this.document = context.document || null;
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
		function index ( def ) {
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
		for ( var def in internal ) {
			if ( !this.constructor.prototype.hasOwnProperty ( def )) {
				if ( !def.startsWith ( "_" )) {
					index ( def );
				}
			}
		}
		return indexes;
	},

	/**
	 * @TODO clean this up...
	 * @param {object} module
	 * @param {Window} context
	 */
	_modulelife : function ( module, context ) {
		/*
		var msg1 = gui.BROADCAST_WILL_SPIRITUALIZE;
		var msg2 = gui.BROADCAST_DID_SPIRITUALIZE;
		if ( module.oncontextinitialize ) {
			module.oncontextinitialize ( context );
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
							if ( gui.Type.isFunction ( module.onbeforespiritualize )) {
								module.onbeforespiritualize ( context );	
							}
							break;
						case msg2 :
							if ( gui.Type.isFunction ( module.onafterspiritualize )) {
								module.onafterspiritualize ( context );	
							}
							break;
				}
			}
		}});
		if ( module.init || module.ready ) {
			console.error ( "deprecated" );
		}
		*/
	}
};

/** 
 * @TODO comment required to explain this stunt
 */
Object.keys ( gui ).forEach ( function ( key ) {
	gui.Spiritual.prototype [ key ] = gui [ key ];
});

/**
 * @TODO comment even more required!
 */
gui = new gui.Spiritual ( window );