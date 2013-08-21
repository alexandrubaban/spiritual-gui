/**
 * An instance of this thing may be referenced as `gui` inside all windows. 
 * @param {Window} win Window or Worker scope
 */
gui.Spiritual = function Spiritual ( win ) {
	this._construct ( win );
};

gui.Spiritual.prototype = {

	/**
	 * The constructor {gui.Spiritual} does not exist after first instance gets declared, 
	 * but we may keep something newable allocated by referencing it around here.
	 * @type {function}
	 */
	constructor: gui.Spiritual,

	/**
	 * Uniquely identifies this instance of `gui.Spiritual` 
	 * knowing that other instances may exist in iframes.
	 * @type {String}
	 */
	$contextid : null,

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
	 * Automatically run on DOMContentLoaded? 
	 * If set to false, run using kickstart().
	 * @TODO: rename this to something
	 * @type {boolean}
	 */
	autostart : true,

	/**
	 * Running inside an iframe?
	 * @type {boolean}
	 */
	hosted : false,

	/**
	 * This instance was portalled into this context by a {gui.Spiritul} instance in the hosting iframe?
	 * If true, members of the 'gui' namespace (spirits) might have been loaded in an ancestor context.
	 * @see {gui.Spiritual#_portal}
	 * @type {Boolean}
	 */
	portalled : false,

	/**
	 * Cross domain origin of containing iframe if:
	 *
	 * 1. We are loaded inside a {gui.IframeSpirit}
	 * 2. Containing document is on an external host
	 * @type {String} eg. `http://parenthost.com:8888`
	 */
	xhost : null,

	/**
	 * Magic attributes to trigger spirit association and configuration. 
	 * By default we support "gui" but you may prefer to use "data-gui".
	 */
	attributes : [ "gui" ],

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
	start : function () {
		this._gone = true;
		switch ( this.mode ) {
			case gui.MODE_NATIVE :
			case gui.MODE_JQUERY :
			case gui.MODE_OPTIMIZE :
			case gui.MODE_MANAGED :
				gui.DOMChanger.change ( this.context );
				break;
		}
		this._experimental ();
		gui.Tick.add ([ gui.$TICK_INSIDE, gui.$TICK_OUTSIDE ], this, this.$contextid );
		if ( this._configs !== null ) {
			this._configs.forEach ( function ( config ) {
				this.channel ( config.select, config.klass );
			}, this );
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
	 * Get spirit for argument.
	 * @TODO argument expected to be an `$instanceid` for now.
	 * @TODO fuzzy resolver to accept elements and queryselectors
	 * @param {String|Element} arg
	 * @returns {gui.Spirit}
	 */
	get : function ( arg ) {
		var spirit = null;
		switch ( gui.Type.of ( arg )) {
			case "string" :
				if ( gui.KeyMaster.isKey ( arg )) {
					spirit = this._spirits.inside [ arg ] || null;
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
	 * @param {function|String} klass Constructor or name
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
	 * Hello.
	 */
	channelModule : function ( channels ) {
		var spirit;
		channels = channels.map ( function ( channel ) {
			var query = channel [ 0 ];
			var klass = channel [ 1 ];
			if ( typeof klass === "string" ) {
				spirit = gui.Object.lookup ( klass, this.context );
			} else {
				spirit = klass;
			}
			return [ query, spirit ];
		}, this );
		this._channels = channels.concat ( this._channels );
	},

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
			// mark as portalled
			subgui.portalled = true;
			// portal gui members + custom namespaces and members.
			subgui._spaces = this._spaces.filter ( function ( ns ) {
				var nso = gui.Object.lookup ( ns, this.context );
				return nso.portals;
			}, this );
			// create object structures in remote context
			this._spaces.forEach ( function ( ns ) {
				var namespace = this.window [ ns ]; // @TODO: formalize something...
				if ( namespace.portals ) {
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
				}
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
	 * Declare something as a namespace.
	 * @param {String} ns
	 * @param {object} defs
	 * @returns {object}
	 */
	namespace : function ( ns, defs ) {
		defs = defs || {};
		if ( gui.Type.isString ( ns )) {
			if ( this._spaces.indexOf ( ns ) >-1 ) {
				return gui.Object.lookup ( ns, this.context );
			} else {
				this._spaces.push ( ns );
				defs = new gui.Namespace ( this.context, ns, defs );
			}
		} else {
			throw new TypeError ( "Expected a namespace string" );
		}
		return defs;
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
	evaluate : function ( elm ) {
		var res = null;
		if ( elm.nodeType === Node.ELEMENT_NODE ) {
			var doc = elm.ownerDocument;
			var win = doc.defaultView;
			if ( win.gui.attributes.every ( function ( fix ) {
				res = this._evaluateinline ( elm, win, fix );
				return res === null;
			}, this )) {
				win.gui._channels.every ( function ( def ) {
					var select = def [ 0 ];
					var spirit = def [ 1 ];
					if ( gui.CSSPlugin.matches ( elm, select )) {
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
		console.log ( out + "\n\n" );
	},

	/**
	 * Stop tracking the spirit.
	 * @param {gui.Spirit} spirit
	 */
	destruct : function ( spirit ) {
		var all = this._spirits;
		var key = spirit.$instanceid;
		delete all.inside [ key ];
		delete all.outside [ key ];
		this._jensen ( spirit );
	},
	
	
	// Internal .................................................................

	/**
	 * Register spirit inside a main document. 
	 * Evaluate new arrivals after 4 millisec.
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
			all.incoming.push ( spirit );
			gui.Tick.dispatch ( gui.$TICK_INSIDE, 4, this.$contextid );
		}
	},

	/**
	 * Register spirit outside document. This schedules the spirit 
	 * for destruction unless reinserted somewhere else (and soon).
	 * @TODO move? rename?
	 * @param {gui.Spirit} spirit
	 */
	outside : function ( spirit ) {
		var all = this._spirits;
		var key = spirit.$instanceid;
		if ( !all.outside [ key ]) {
			if ( all.inside [ key ]) {
				delete all.inside [ key ];
				this._jensen ( spirit );
			}
			all.outside [ key ] = spirit;
			gui.Tick.dispatch ( gui.$TICK_OUTSIDE, 0, this.$contextid ); // @TODO use 4 ms???
		}
	},

	_jensen : function ( spirit ) {
		var incoming = this._spirits.incoming;
		if ( incoming.length ) {
			var i = incoming.indexOf ( spirit );
			if ( i > -1 ) {
				gui.Array.remove ( incoming, i );
			}
		}
	},

	/**
	 * Handle tick.
	 * @param {gui.Tick} tick
	 */
	ontick : function ( tick ) {
		var spirits;
		switch ( tick.type ) {
			case gui.$TICK_INSIDE :
				gui.Guide.$goasync ( this._spirits.incoming );
				this._spirits.incoming = [];
				break;
			case gui.$TICK_OUTSIDE :
				spirits = gui.Object.each ( this._spirits.outside, function ( key, spirit ) {
					return spirit;
				});
				spirits.forEach ( function ( spirit ) {
					gui.Spirit.$exit ( spirit );
				});
				spirits.forEach ( function ( spirit ) {
					gui.Spirit.$destruct ( spirit );
				});
				spirits.forEach ( function ( spirit ) {
					gui.Spirit.$dispose ( spirit );
				});
				this._spirits.outside = Object.create ( null );
				break;
		}
	},

	/**
	 * Invoked by the {gui.Guide} on window.unload (synchronized as final event).
	 * @TODO figure out of any of this manual garbage dumping works.
	 * @TODO naming clash with method "destruct"
	 * @TODO Think of more stuff to cleanup here...
	 */
	nameDestructAlreadyUsed : function () {
		gui.Tick.remove ( gui.$TICK_OUTSIDE, this, this.$contextid );
		/*
		gui.Object.each ( this._spirits.inside, function ( id, spirit ) {
			gui.GreatSpirit.$meet ( spirit );
		});
		*/
		[ 
			"_spiritualaid", 
			"context", // window ?
			"document", 
			"_channels", 
			"_inlines",
			"_spaces", 
			"_modules", 
			"_spirits" 
		].forEach ( function ( thing ) {
			this [ thing ] = null;
		}, this );
	},

	/**
	 * @TODO: Perhaps do this some day...
	 *
	$cleanup : function () {
		gui.Tick.remove ([ gui.$TICK_INSIDE, gui.$TICK_OUTSIDE ], this, this.$contextid );
		gui.GreatSpirit.$nukeallofit ( this, this.window );
	},
	*/
	

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
		// basic setup
		this.context = context;
		this.window = context.document ? context : null;
		this.document = context.document || null;
		this.hosted = this.window && this.window !== this.window.parent;
		this._inlines = Object.create ( null );
		this._modules = Object.create ( null );
		this._arrivals = Object.create ( null );
		this._channels = [];
		this._spaces = [ "gui" ];
		this._spirits = {
			incoming : [], // spirits just entered the DOM (some milliseconds ago)
			inside : Object.create ( null ), // spirits positioned in page DOM ("entered" and "attached")
			outside : Object.create ( null ) // spirits removed from page DOM (currently "detached")
		};

		// magic properties may be found in querystring parameters
		// @tODO not in sandbox!
		this._params ( this.document.location.href );
	},

	/**
	 * Test for spirit assigned using HTML inline attribute.
	 * Special test for "[" accounts for {gui.Spirit#$debug}
	 * @param {Element} elm
	 * @param {Window} win
	 * @param {String} fix
	 * @returns {function} Spirit constructor
	 */
	_evaluateinline : function ( elm, win, fix ) {
		var res = null;
		var att = elm.getAttribute ( fix );
		if ( gui.Type.isString ( att ) && !att.startsWith ( "[" )) {
			if ( att !== "" ) {
				res = win.gui._inlines [ att ];
				if ( !gui.Type.isDefined ( res )) {
					res = gui.Object.lookup ( att, win );
				}
				if ( res ) {
					win.gui._inlines [ att ] = res;
				} else {
					console.error ( att + " is not defined." );
				}
			} else {
				res = false; // strange return value implies no spirit for empty string
			}
		}
		return res;
	},

	/**
	 * Resolve potential "gui-xhost" querystring parameter. This provides  a $contextid and a 
	 * hostname to facilitate cross domain messaging. The $contextid equals the $instanceid of 
	 * containing {gui.IframeSpirit}. If not present, we generate a random $contextid.
	 * @param {String} url
	 */
	_params : function ( url ) {
		var id, xhost, param = gui.PARAM_CONTEXTID;
		if ( url.contains ( param )) {
			var splits = gui.URL.getParam ( url, param ).split ( "/" );
			id = splits.pop ();
			xhost = splits.join ( "/" );
		} else {
			id = gui.KeyMaster.generateKey ();
			xhost = null;
		}
		this.$contextid = id;
		this.xhost = xhost;
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
				case "$contextid" :
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


	// Work in progress .............................................................

	/**
	 * @TODO action required. This methoud would enable the mutation 
	 * observer. We should remove this whole thing from Spiritual core.
	 */
	_movethismethod : function () {
		if ( this.mode === gui.MODE_JQUERY ) {
			gui.Tick.next ( function () {  // @TODO somehow not conflict with http://stackoverflow.com/questions/11406515/domnodeinserted-behaves-weird-when-performing-dom-manipulation-on-body
				gui.Observer.observe ( this.context ); // @idea move all of _step2 to next stack?
			}, this );
		} else {
			gui.Observer.observe ( this.context );
		}
	},

	/**
	 * Experimental.
	 */
	_experimental : function () {
		this._spaces.forEach ( function ( ns ) {
			this._questionable ( gui.Object.lookup ( ns, this.window ), ns );
		}, this );
	},

	/**
	 * Questionable.
	 */
	_questionable : function ( home, name ) {
		var key;
		var val;
		for ( key in home ) {
			if ( !home.hasOwnProperty || home.hasOwnProperty ( key )) {
				if ( key !== "$superclass" ) {
					val = home [ key ];
					switch ( gui.Type.of ( val )) {
						case "function" :
							if ( val.$classid ) {
								if ( val.$classname === gui.Class.ANONYMOUS ) {
									val.$classname = name + "." + key;
									this._questionable ( val, name + "." + key );
								}
							}
							break;
						case "object" :
							// questionable?
							break;
					}
				}
			}
		}
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