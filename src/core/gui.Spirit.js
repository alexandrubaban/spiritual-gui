/**
 * Base constructor for all spirits
 */
gui.Spirit = gui.Class.create ( Object.prototype, {

	/**
	 * Unique key for this spirit instance.
	 * @TODO: Uppercase to imply read-only.
	 * @type {String}
	 */
	$instanceid : null,
	
	/**
	 * Matches the property `$contextid` of the local `gui` object.
	 * @TODO rename this property
	 * @TODO perhapse deprecate?
	 * @type {String}
	 */
	$contextid : null,

	/**
	 * Spirit element.
	 * @type {Element} 
	 */
	element : null,
	
	/**
	 * Containing document.
	 * @type {Document}
	 */
	document : null,
	
	/**
	 * Containing window.
	 * @type {Window} 
	 */
	window : null,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {		
		return "[object gui.Spirit]";
	},
	
	
	// Sync lifecycle .................................................................

	/**
	 * You can safely overload or overwrite methods in the lifecycle section, 
	 * but you should always leave it to the {gui.Guide} to invoke them. Also, do make 
	 * sure to always call `this._super.method()` unless you really mean it.
	 */
	
	/**
	 * `onconstruct` gets called when the spirit is newed up. Spirit 
	 * element may not be positioned in the document DOM at this point. 
	 */
	onconstruct : function () {},
	
	/**
	 * `onconfigure` gets callend immediately after construction. This 
	 * instructs the spirit to parse configuration attributes in markup. 
	 * @see {gui.AttConfigPlugin}
	 */
	onconfigure : function () {
		if ( !this._startstates ()) {
			gui.Spirit.$oninit ( this );
		}
	},
	
	/**
	 * `onenter` gets called when the spirit element is first encounted in the page DOM. 
	 * This is only called once in the lifecycle of a spirit (unlike `attach`, see below).
	 */
	onenter : function () {},
	
	/**
	 * `onattach` gets called whenever
	 * 
	 * - the spirit element is attached to the document DOM by some guy
	 * - the element is already in DOM when the page loads and the spirit gets injected by the framework
	 */
	onattach : function () {},
	
	/**
	 * `onready` gets called (only once) when all descendant spirits are attached and 
	 * ready. From a DOM tree perspective, this fires in reverse order, innermost first. 
	 */
	onready : function () {},

	/**
	 * Experimental.
	 */
	oninit : function () {},

	/**
	 * `ondetach` gets callend whenever the spirit element is about to be detached from the DOM tree. 
	 * Unless the element is appended somewhere else, this will schedule the spirit for destruction.
	 */
	ondetach : function () {},

	/**
	 * `onexit` gets if the spirit element has been *manually* detached and not re-attached in 
	 * the same execution stack. Spirit is not positioned in the document DOM at this point.
	 */
	onexit : function () {},
	
	/**
	 * Invoked when spirit is about to be destroyed. Code your last wishes here. 
	 * Spirit element may not be positioned in the document DOM at this point. 
	 * @TODO: This method currently is NOT CALLED during window.unload, in 
	 * that case we skip directly to {gui.GreatSpirit}. Would be nice if the 
	 * spirit could eg. save stuff to localstorage at this point...
	 */
	ondestruct : function () {},


	// Async lifecycle .......................................................................

	/**
	 * Invoked some milliseconds after `onattach` to give the browser a repaint break.
	 * @TODO: this should be evaluated after 'appendChild' to another position.
	 */
	onasync : function () {},
	

	// Handlers ..............................................................................
	
	/**	
	 * Handle crawler (tell me more)
	 * @param {gui.Crawler} crawler
	 * @returns {number}
	 */
	oncrawler : function ( crawler ) {},
	

	// Secret ................................................................................
	
	/**
	 * Secret constructor. Invoked before `onconstruct`. The `$instanceid` has 
	 * been set already at this point (as a standard property of any {gui.Class}).
	 * @param {Element} elm
	 * @param {Document} doc
	 * @param {Window} win
	 * @param {String} sig
	 */
	$onconstruct : function ( elm, doc, win, sig ) {
		this.element = elm;
		this.document = doc;
		this.window = win;
		this.$contextid = sig;
		gui.Spirit.$construct ( this );
	},

	/**
	 * Secret destructor. Invoked after `ondestruct`.
	 */
	$ondestruct : function () {},

	/**
	 * Plug in the plugins. Lazy plugins will be newed up when needed.
	 *
	 * - {gui.LifePlugin} first
	 * - {gui.AttConfigPlugin} second
	 * - bonus plugins galore
	 */
	$pluginplugins : function () {
		var Plugin, plugins = this.constructor.$plugins;
		this.life = new gui.LifePlugin ( this );
		this.attconfig = new gui.AttConfigPlugin ( this );
		Object.keys ( plugins ).filter ( function ( prefix ) {
			return prefix !== "life" && prefix !== "attconfig";
		}).sort ().forEach ( function ( prefix ) {
			Plugin = plugins [ prefix ];
			if (( this.life.plugins [ prefix ] = !Plugin.lazy )) {
				this [ prefix ] = new Plugin ( this );
			} else {
				gui.Plugin.runonaccessor ( this, prefix, Plugin );
			}
		}, this );
	},

	/**
	 * In debug mode, stamp the toString value onto the spirit element. 
	 * @note The toString value is defined by the string that may be 
	 * passed as first argument to the gui.Spirit.extend("John") method.
	 * @param {boolean} constructing
	 */
	$debug : function ( constructing ) {
		var val, elm = this.element;
		if ( constructing ) {
			if ( !elm.hasAttribute ( "gui" )) {
				val = "[" + this.constructor.$classname + "]";
				elm.setAttribute ( "gui", val );
			}
		} else {
			val = elm.getAttribute ( "gui" );
			if ( val && val.startsWith ( "[" )) {
				elm.removeAttribute ( "gui" );
			}
		}
	}


}, { // Recurring static ...................................................................
	
	/**
	 * Portal spirit into iframes via the `gui.portal` method?
	 * @see {ui#portal}  
	 * @type {boolean}
	 */
	portals : true,
	
	/**
	 * It was fun.
	 * @deprecated
	 */
	infuse : function () {
		console.warn ( "Spirit.infuse() is deprecated. Use Spirit.extend()" );
		return this.extend.apply ( this, arguments );
	},

	/**
	 * Create DOM element and associate gui.Spirit instance.
	 * @param @optional {Document} doc
	 * @returns {gui.Spirit}
	 */
	summon : function ( doc ) {
		return this.possess (( doc || document ).createElement ( "div" ));
	},

	/**
	 * Associate gui.Spirit instance to DOM element.
	 * @param {Element} element
	 * @returns {gui.Spirit}
	 */
	possess : function ( element ) {
		return gui.Guide.possess ( element, this );
	},

	/**
	 * Extends spirit and plugins (mutating plugins) plus updates getters/setters.
	 * @TODO: validate that user isn't declaring non-primitives on the prototype (log warning).
	 * @param {object} extension 
	 * @param {object} recurring 
	 * @param {object} statics 
	 * @returns {gui.Spirit}
	 */
	extend : function () {
		
		var args = [], def, br = gui.Class.breakdown ( arguments );
		[ "name", "protos", "recurring", "statics" ].forEach ( function ( key ) {
			if (( def = br [ key ])) {
				args.push ( key === "recurring" ? gui.Spirit.$longhand ( def ) : def );
			}
		}, this );
		
		var C = gui.Class.extend.apply ( this, args );
		C.$plugins = gui.Object.copy ( this.$plugins );
		var b = gui.Class.breakdown ( arguments );
		gui.Object.each ( C.$plugins, function ( prefix, plugin ) {
			var def = b.protos [ prefix ];			
			switch ( gui.Type.of ( def )) {
				case "object" :
					var mutant = plugin.extend ( def );
					C.plugin ( prefix, mutant, true );
					break;
				case "undefined" :
					break;
				default :
					throw new TypeError ( C + ": Bad definition: " + prefix );
			}
		}, this );
		return C;
	},
	
	/**
	 * Assign plugin to prefix, checking for naming collision. Prepared for 
	 * a scenario where spirits may have been declared before plugins load.
	 * @param {String} prefix "att", "dom", "action", "event" etc
	 * @param {function} plugin Constructor for plugin
	 * @param @optional {boolean} override Disable collision detection
	 */
	plugin : function ( prefix, plugin, override ) {
		var plugins = this.$plugins;
		var proto = this.prototype;
		if ( !proto.hasOwnProperty ( prefix ) || proto.prefix === null || override ) {
			if ( !plugins [ prefix ] || override ) {
				plugins [ prefix ] = plugin;
				proto.prefix = null;
				gui.Class.children ( this, function ( child ) {
					child.plugin ( prefix, plugin, override ); // recursing to descendants
				});
			}
		} else {
			console.error ( "Plugin naming crash in " + this + ": " + prefix );
		}
	},


	// Secret ................................................................................
	
	/**
	 * Mapping plugin prefix to plugin constructor.
	 * @type {Map<String,function>}
	 */
	$plugins : Object.create ( null )

	
}, { // Static .............................................................................
	
	/**
	 * Spirit construct. Called by the secret constructor {gui.Spirit#$onconstruct}.
	 * @param {gui.Spirit} spirit
	 */
	$construct : function ( spirit ) {
		spirit.$pluginplugins ();
		spirit.$debug ( true );
		spirit.life.constructed = true;
		spirit.onconstruct ();
		spirit.life.dispatch ( gui.LIFE_CONSTRUCT );
	},
	
	/**
	 * Spirit configure.
	 * @param {gui.Spirit} spirit
	 */
	$configure : function ( spirit ) {
		spirit.attconfig.configureall ();
		spirit.life.configured = true;
		spirit.onconfigure ();
		spirit.life.dispatch ( gui.LIFE_CONFIGURE );
	},
	
	/**
	 * Spirit enter.
	 * @param {gui.Spirit} spirit
	 */
	$enter : function ( spirit ) {
		spirit.window.gui.inside ( spirit );
		spirit.life.entered = true;
		spirit.onenter ();
		spirit.life.dispatch ( gui.LIFE_ENTER );
	},
	
	/**
	 * Spirit attach.
	 * @param {gui.Spirit} spirit
	 */
	$attach : function ( spirit ) {
		spirit.window.gui.inside ( spirit );
		spirit.life.attached = true;
		spirit.onattach ();
		spirit.life.dispatch ( gui.LIFE_ATTACH );
	},
	
	/**
	 * Spirit ready.
	 * @param {gui.Spirit} spirit
	 */
	$ready : function ( spirit ) {
		spirit.life.ready = true;
		spirit.onready ();
		spirit.life.dispatch ( gui.LIFE_READY );
	},

	/**
	 * Spirit detach.
	 * @param {gui.Spirit} spirit
	 */
	$detach : function ( spirit ) {
		spirit.window.gui.outside ( spirit );
		spirit.life.detached = true;
		spirit.life.visible = false;
		spirit.life.dispatch ( gui.LIFE_DETACH );
		spirit.life.dispatch ( gui.LIFE_INVISIBLE );
		spirit.ondetach ();
	},
	
	/**
	 * Spirit exit.
	 * @param {gui.Spirit} spirit
	 */
	$exit : function ( spirit ) {
		spirit.life.exited = true;
		spirit.life.dispatch ( gui.LIFE_EXIT );
		spirit.onexit ();
	},

	/**
	 * Spirit async.
	 * @TODO: This should be evaluated after `appendChild` to another position.
	 * @param {gui.Spirit} spirit
	 */
	$async : function ( spirit ) {
		spirit.life.async = true;
		spirit.onasync (); // TODO: life cycle stuff goes here
		spirit.life.dispatch ( gui.LIFE_ASYNC );
	},
	
	/**
	 * Spirit destruct.
	 * @param {gui.Spirit} spirit
	 */
	$destruct : function ( spirit ) {
		spirit.$debug ( false );
		spirit.life.destructed = true;
		spirit.life.dispatch ( gui.LIFE_DESTRUCT );
		spirit.ondestruct ();
	},

	/**
	 * Spirit dispose. This calls the secret destructor {gui.Spirit#$ondestruct}.
	 * @see {gui.Spirit#$ondestruct}
	 * @param {gui.Spirit} spirit
	 */
	$dispose : function ( spirit ) {
		spirit.$ondestruct ();
		spirit.window.gui.destruct ( spirit );
		gui.GreatSpirit.$meet ( spirit );
	},



	// TEMP ...................................................................

	/**
	 * Mapping constructor identifiers to private property names.
	 * @type {Map<String,String>}
	 */
	$states : {
		"State" : "_state",
		"SessionState" : "_sessionstate",
		"LocalState" : "_localstate"
	}, 

	/**
	 * @TODO: Init that spirit (work in progress)
	 * @TODO wait and done methods to support this
	 * @param {gui.Spirit} spirit
	 */
	$oninit : function ( spirit ) {
		spirit.life.initialized = true;
		spirit.life.dispatch ( "life-initialized" );
		spirit.oninit ();
	},

	/**
	 * Resolve shorthand notation for State constructors.
	 * @param {object} recurring Recurring static fields.
	 * @returns {object}
	 */
	$longhand : function ( recurring ) {
		var State;
		var edb = window.edb || null;
		if ( !edb ) {
			return recurring; // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		}
		Object.keys ( this.$states ).forEach ( function ( typename ) {
			if (( State = recurring [ typename ])) {
				if ( gui.Type.isObject ( State ) && !State.$classid ) {
					recurring [ typename ] = edb [ typename ].extend ( State );
				}
			}
		});
		return recurring;
	}

});






/**
 * Spirit of the spirit. A similar interface, only without spirit dependencies, 
 * should eventually be concieved to function inside the web worker context.
 * @extends {ts.gui.Spirit}
 *
ts.edb.Controller = ts.gui.Spirit.extend ({

	/**
	 * Called when all viewstates are restored/created and has been output on the page.
	 *
	oninit : function () {},

	/**
	 * Output viewstate models in public context. Invoke 
	 * `oninit` when all viewstates are accounted for.
	 *
	onconfigure : function () {
		this._super.onconfigure ();
		this.att.add ( "view" );
		if ( !this._startstates ()) {
			ts.edb.Controller.$oninit ( this );
		}
	},

	/**
	 * Handle attribute updated. This also fires when the attribute listener gets added.
	 * @param {gui.Att} att
	 *
	onatt : function ( att ) {
		this._super.onatt ( att );
		switch ( att.name ) {
			case "view" :
				this.script.load ( att.value );
				break;
		}
	},

	/**
	 * Handle input. In this case our own state models.
	 * @param {edb.Input} input
	 *
	oninput : function ( input ) {
		this._super.oninput ( input );
		if ( input.data instanceof ts.edb.State ) {
			if ( this._statesstarted ( input.type, input.data )) {
				ts.edb.Controller.$oninit ( this );
			}
		}
	},


	// Private .......................................................................

	/**
	 * Optional State instance.
	 * @type {ts.edb.Controller.State}
	 *
	_state : null,

	/**
	 * Optional SessionState instance.
	 * @type {ts.edb.Controller.SessionState}
	 *
	_sessionstate : null,

	/**
	 * Optional LocalState instance.
	 * @type {ts.edb.Controller.LocalState}
	 *
	_localstate : null,

	/**
	 * Fire up potential state models. Returns 
	 * `true` if any state models are declared.
	 * @returns {boolean}
	 *
	_startstates : function () {
		var State;
		return Object.keys ( ts.edb.Controller.$states ).some ( function ( state ) {
			if (( State = this.constructor [ state ])) {
				this._startstate ( State );
				return true;
			} else {
				return false;
			}
		}, this );
	},

	/**
	 * Output the state model only when the first 
	 * instance of this spirit is constructed. 
	 * Attempt to restore the stage from storage.
	 * @param {function} State
	 *
	_startstate : function ( State ) {
		this.input.add ( State );
		if ( !State.out ( self )) {
			State.restore ().then ( function ( state ) {
				state = state || new State ();
				state.$output ( self );
			}, this );
		}
	},

	/**
	 * Assign state instance to private property name. 
	 * Returns true when all expected states are done.
	 * @param {function} State constructor
	 * @param {ts.edb.State} state instance
	 * @returns {boolean}
	 *
	_statesstarted : function ( State, state ) {
		var MyState, propname, states = ts.edb.Controller.$states;
		return Object.keys ( states ).every ( function ( typename ) {
			MyState = this.constructor [ typename ];
			propname = states [ typename ];
			this [ propname ] = State === MyState ? state : null;
			return !MyState || this [ propname ] !== null;
		}, this ); 
	}



}, { // Recurring static ...........................................................

	/**
	 * Optional State constructor. The class will be declared using the spirit 
	 * classname as a namespacing mechanism of some kind: `myns.MyController.State`. 
	 * @extends {ts.edb.State}
	 *
	State : null,

	/**
	 * Optional SessionState constructor.
	 * @extends {ts.edb.SessionState}
	 *
	SessionState : null,

	/**
	 * Optional LocalState constructor.
	 * @extends {ts.edb.LocalState}
	 *
	LocalState : null,

	/**
	 * Allow State constructors to be created by nice shorhand notation. 
	 * Simply declare an object instead of `ts.edb.State.extend(object)`
	 * @overwrites {gui.Spirit.extend} 
	 * @TODO no spirits in worker context
	 *
	extend : function () {
		var args = [], def, breakdown = gui.Class.breakdown ( arguments );
		[ "name", "protos", "recurring", "statics" ].forEach ( function ( key ) {
			if (( def = breakdown [ key ])) {
				args.push ( key === "recurring" ? ts.edb.Controller.$longhand ( def ) : def );
			}
		}, this );
		return ts.gui.Spirit.extend.apply ( this, args );
	}


}, { // Static .....................................................................

	/**
	 * Mapping constructor identifiers to private property names.
	 * @type {Map<String,String>}
	 *
	$states : {
		"State" : "_state",
		"SessionState" : "_sessionstate",
		"LocalState" : "_localstate"
	}, 

	/**
	 * Init that spirit.
	 * @param {ts.edb.Controller} spirit
	 *
	$oninit : function ( spirit ) {
		spirit.life.initialized = true;
		spirit.life.dispatch ( "life-initialized" );
		spirit.oninit ();
	},

	/**
	 * Resolve shorthand notation for State constructors.
	 * @param {object} recurring Recurring static fields.
	 * @returns {object}
	 *
	$longhand : function ( recurring ) {
		var State;
		Object.keys ( this.$states ).forEach ( function ( typename ) {
			if (( State = recurring [ typename ])) {
				if ( gui.Type.isObject ( State ) && !State.$classid ) {
					recurring [ typename ] = ts.edb [ typename ].extend ( State );
				}
			}
		});
		return recurring;
	}

});
*/