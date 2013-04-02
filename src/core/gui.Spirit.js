/**
 * Base constructor for all spirits
 */
gui.Spirit = gui.Class.create ( "gui.Spirit", Object.prototype, {

	/**
	 * Spirit DOM element.
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
	 * Unique key for this spirit instance.
	 * @type {String}
	 */
	$instanceid : null,
	
	/**
	 * Matches the property `signature` of the local `gui` object.
	 * @TODO rename this property
	 * @TODO perhapse deprecate?
	 * @type {String}
	 */
	signature : null,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {		
		return "[object gui.Spirit]";
	},
	
	
	// Lifecycle ..............................................................

	/**
	 * You can safely overload or overwrite methods in the lifecycle section, 
	 * but you should always leave it to the {gui.Guide} to invoke them. Also, do make 
	 * sure to always call `this._super.method()` unless you really mean it.
	 */
	
	/**
	 * `onconstruct` gets called when the spirit is newed up. Spirit 
	 * element may not be positioned in the document DOM at this point. 
	 */
	onconstruct : function () {
		this.__plugin__ ();
		if ( this.window.gui.debug ) {
			this.__debug__ ( true );
		}
		this.life.goconstruct ();
	},
	
	/**
	 * @deprecated
	 * `onconfigure` gets callend immediately after construction. This 
	 * instructs the spirit to parse configuration attributes in markup. 
	 * @TODO Explain this
	 */
	onconfigure : function () {
		//this.config.configure ();
		this.life.goconfigure ();
	},
	
	/**
	 * `onenter` gets called when the spirit element is first encounted in the page DOM. 
	 * This is only called once in the lifecycle of a spirit (unlike `attach`, see below).
	 */
	onenter : function () {
		this.window.gui.inside ( this );
		this.life.goenter ();
	},
	
	/**
	 * `onattach` gets called whenever
	 * 
	 * - the spirit element is attached to the DOM
	 * - the element is already in DOM when the page loads and the spirit gets injected by the framework
	 */
	onattach : function () { // @TODO Check if spirit matchesselector gui.CLASS_INVISIBLE + " *"
		this.window.gui.inside ( this );
		this.life.goattach ();
	},
	
	/**
	 * `onready` gets called (only once) when all descendant spirits are attached and 
	 * ready. From a DOM tree perspective, this fires in reverse order, innermost first. 
	 */
	onready : function () {
		this.life.goready ();
	},

	/**
	 * `onvisible` has some explaining to do.
	 */
	onvisible : function () {
		this.life.govisible ();
	},

	/**
	 * `oninvisible` has some explaining to do.
	 */
	oninvisible : function () {
		this.life.goinvisible ();
	},

	/**
	 * `ondetach` gets callend whenever the spirit element is detached from the DOM tree. 
	 */
	ondetach : function () {
		this.window.gui.outside ( this );
		this.life.godetach ();
	},
	
	/**
	 * `onexit` gets called when spirit is detached and not re-attached in the same 
	 * execution stack. This triggers destruction unless you return `false`. In this 
	 * case, make sure to manually dispose the spirit later (using method `dispose`).  
	 * @returns {udenfined|boolean} False to stay alive
	 */
	onexit : function () {
		this.life.goexit (); // do not call _super.onexit if you return false
		return undefined;
	},
	
	/**
	 * Invoked when spirit gets disposed. Code your last wishes. Should only be 
	 * called by the framework, please use `dispose()` to terminate the spirit.
	 * @see {gui.Spirit#dispose}
	 * @param {boolean} now Triggers immediate destruction when true
	 * @returns {boolean}
	 */
	ondestruct : function ( now ) {
		this.window.gui.destruct ( this );
		if ( this.window.gui.debug ) {
			this.__debug__ ( false );
		}
		this.life.godestruct ();
		this.__destruct__ ( now );
	},
	
	// Handlers .....................................................................

	/**	
	 * Handle crawler (tell me more)
	 * @param {gui.Crawler} crawler
	 * @returns {number}
	 */
	oncrawler : function ( crawler ) {
		return gui.Crawler.CONTINUE;
	},
	
	/**
	 * Handle life (tell me more)
	 * @param {gui.Life} life
	 */
	onlife : function ( life ) {},
	
	
	// More stuff ........................................................................

	/**
	 * Mark spirit visible. THis adds the classname "_gui-invisible" and 
	 * triggers a call to `oninvisible()` on this and all descendant spirits.
	 * @returns {gui.Spirit}
	 */
	invisible : function () {
		return gui.Spirit.invisible ( this );
	},
	
	/**
	 * Mark spirit visible. Removes the classname "_gui-invisible" and 
	 * triggers a call to `onvisible()` on this and all descendant spirits.
	 * @returns {gui.Spirit}
	 */
	visible : function () {
		return gui.Spirit.visible ( this );
	},

	/**
	 * Terminate the spirit and remove the element (optionally keep it). 
	 * @param {boolean} keep True to leave the element on stage.
	 * @TODO Terrible boolean trap in this API
	 */
	dispose : function ( keep ) {
		if ( !keep ) {
			this.dom.remove ();
		}
		this.ondestruct ();
	},
	
	
	// Secret ....................................................................
	
	/**
	 * Secret constructor. The $instanceid is generated standard by the {gui.Class}
	 * @param {Element} elm
	 * @param {Document} doc
	 * @param {Window} win
	 * @param {String} sig
	 */
	$onconstruct : function ( elm, doc, win, sig ) {
		this.element = elm;
		this.document = doc;
		this.window = win;
		this.signature = sig;
		this.onconstruct ();
	},

	/**
	 * Mapping lazy plugins to prefixes.
	 * @type {Map<String,gui.Plugin>}
	 */
	__lazyplugins__ : null,

	/**
	 * Plug in the plugins.
	 *
	 * - life plugin first
	 * - config plugin second
	 * - bonus plugins galore
	 */
	__plugin__ : function () {
		this.life = new gui.LifePlugin ( this );
		this.config = new gui.ConfigPlugin ( this );
		this.__lazyplugins__ = Object.create ( null );
		var prefixes = [], plugins = this.constructor.__plugins__;
		gui.Object.each ( plugins, function ( prefix, Plugin ) {
			switch ( Plugin ) {
				case gui.LifePlugin :
				case gui.ConfigPlugin :
					break;
				default :
					if ( Plugin.lazy ) {
						gui.Plugin.later ( Plugin, prefix, this, this.__lazyplugins__ );
					} else {
						this [ prefix ] = new Plugin ( this );
					}
					prefixes.push ( prefix );
					break;
			}
		}, this );
		this.life.onconstruct ();
		this.config.onconstruct ();
		prefixes.forEach ( function ( prefix ) {
			if ( !this.__lazyplugins__ [ prefix ]) {
				this [ prefix ].onconstruct ();
			}
		}, this );
	},

	/**
	 * In debug mode, stamp the toString value onto the spirit element. 
	 * @note The toString value is defined by the string that may be 
	 * passed as first argument to the gui.Spirit.infuse("John") method.
	 * @param {boolean} constructing
	 */
	__debug__ : function ( constructing ) {
		var val, elm = this.element;
		if ( constructing ) {
			if ( !elm.hasAttribute ( "gui" )) {
				val = "[" + this.displayName + "]";
				elm.setAttribute ( "gui", val );
			}
		} else {
			val = elm.getAttribute ( "gui" );
			if ( val && val.startsWith ( "[" )) {
				elm.removeAttribute ( "gui" );
			}
		}
	},
	
	/**
	 * Total destruction. We have hotfixed conflicts upon destruction by moving the property nulling 
	 * to a new execution stack, but the consequences should be thought throught at some point.
	 * @param @optional {boolean} now Destruct immediately (for example when the window unloads)
	 */
	__destruct__ : function ( now ) {
		var map = this.__lazyplugins__;
		gui.Object.each ( map, function ( prefix ) {
			if ( map [ prefix ] === true ) {
				delete this [ prefix ]; // otherwise next iterator will instantiate the lazy plugin...
			}
		}, this );
		// dispose plugins (plugins should not invoke external stuff during this phase)
		gui.Object.each ( this, function ( prop ) {
			var thing = this [ prop ];
			switch ( gui.Type.of ( thing )) {
				case "object" :
					if ( thing instanceof gui.Plugin ) {
						if ( thing !== this.life ) {
							thing.__destruct__ ( now );
						}
					}
					break;
			}
		}, this );
		this.life.__destruct__ (); // dispose life plugin last
		if ( now ) {
			this.__null__ ();
		} else {
			var that = this;
			var tick = gui.TICK_SPIRIT_NULL;
			var spirit = this;
			var title = this.document.title;
			gui.Tick.one ( tick, {
				ontick : function () {
					try {
						that.__null__ ();
					} catch ( exception ) {
						// @TODO why sometimes gui.Spirit.DENIED?
					}
				}
			}, this.signature ).dispatch ( tick, 0, this.signature );
		}
	},
	
	/**
	 * Null all props.
	 */
	__null__ : function () {
		var myelm = this.element;
		var debug = this.window.gui.debug;
		var ident = this.toString ();
		if ( myelm ) {
			try {
				myelm.spirit = null;
			} catch ( denied ) {} // explorer may deny permission in frames
		}
		Object.keys ( this ).forEach ( function ( prop ) {
			var desc = debug ? gui.Spirit.denial ( ident, prop ) : gui.Spirit.DENIED;
			Object.defineProperty ( this, prop, desc );
		}, this );
	}


}, { // Recurring static ...............................................................
	
	/**
	 * Portal spirit into iframes via the `gui.portal` method?
	 * @see {ui#portal}  
	 * @type {boolean}
	 */
	portals : true,
	
	/**
	 * Extends spirit and plugins (mutating plugins) plus updates getters/setters.
	 * @param {object} extension 
	 * @param {object} recurring 
	 * @param {object} statics 
	 * @returns {gui.Spirit}
	 */
	infuse : function () {
		var C = gui.Class.extend.apply ( this, arguments );
		C.__plugins__ = gui.Object.copy ( this.__plugins__ );
		var b = gui.Class.breakdown ( arguments );
		gui.Object.each ( C.__plugins__, function ( prefix, plugin ) {
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
	 * Create DOM element and associate Spirit instance.
	 * @param @optional {Document} doc
	 * @returns {gui.Spirit}
	 */
	summon : function ( doc ) {
		return this.possess (( doc || document ).createElement ( "div" ));
	},

	/**
	 * Associate Spirit instance to DOM element.
	 * @param {Element} element
	 * @returns {Spirit}
	 */
	possess : function ( element ) {
		return gui.Guide.possess ( element, this );
	},

	/**
	 * Subclassing a spirit via `infuse` allows us to also subclass it's plugins 
	 * using a nice declarative syntax. To avoid potential frustration, we throw 
	 * on the `extend` method which doesn't offfer this feature.
	 */
	extend : function () {
		throw new Error ( 
			'Spirits must use the "infuse" method and not "extend".\n' +
			'This method extends both the spirit and it\'s plugins.'
		);
	},
	
	/**
	 * Parse HTML string to DOM element in given document context. 
	 * @TODO This should be either powerful or removed from core.
	 * @TODO parent element awareness when inserted in document :)
	 * @param {Document} doc
	 * @param {String} html
	 * @returns {Element}
	 */
	parse : function ( doc, html ) {
		if ( doc.nodeType === Node.DOCUMENT_NODE ) {
			return new gui.HTMLParser ( doc ).parse ( html )[ 0 ]; // @TODO parseOne?
		} else {
			throw new TypeError ( this + ".parse() expects a Document" );
		}
	},
	
	/**
	 * Assign plugin to prefix, checking for naming collision. Prepared for 
	 * a scenario where spirits may have been declared before plugins load.
	 * @param {String} prefix "att", "dom", "action", "event" etc
	 * @param {function} plugin Constructor for plugin
	 * @param @optional {boolean} override Disable collision detection
	 */
	plugin : function ( prefix, plugin, override ) {
		var plugins = this.__plugins__;
		var proto = this.prototype;
		if ( !proto.hasOwnProperty ( prefix ) || proto.prefix === null || override ) {
			if ( !plugins [ prefix ] || override ) {
				plugins [ prefix ] = plugin;
				proto.prefix = null;
				gui.Class.children ( this, function ( child ) {
					child.plugin ( prefix, plugin, override ); // recurses to descendants
				});
			}
		} else {
			console.error ( "Plugin naming crash in " + this + ": " + prefix );
		}
	},

	/**
	 * Mapping plugin constructor to plugin prefix.
	 * @type {Map<String,function>}
	 */
	__plugins__ : Object.create ( null )

	
}, { // Static ....................................................................

	/**
	 * Hello.
	 * @param {gui.Spirit} spirit
	 * @returns {gui.Spirit}
	 */
	visible : function ( spirit ) {
		if ( spirit.life.invisible ) {
			this._setvisibility ( spirit, true, spirit.life.entered );
			spirit.css.remove ( gui.CLASS_INVISIBLE );
		}
		return spirit;
	},

	/**
	 * Hello.
	 * @param {gui.Spirit} spirit
	 * @returns {gui.Spirit}
	 */
	invisible : function ( spirit ) {
		if ( spirit.life.visible ) {
			this._setvisibility ( spirit, false, spirit.life.entered );
			spirit.css.add ( gui.CLASS_INVISIBLE );
		}
		return spirit;
	},

	/**
	 * Update spirit visibility. Recursively updagtes descendant spirits.
	 * @param {gui.Spirit} spirit
	 * @param {boolean} show Visible or invisible?
	 * @param {boolean} subtree Recurse?
	 */
	_setvisibility : function ( spirit, show, subtree ) {
		var crawler = new gui.Crawler ( show ? 
			gui.CRAWLER_VISIBLE : gui.CRAWLER_INVISIBLE 
		);
		crawler.global = true;
		crawler.descend ( spirit, {
			handleSpirit : function ( s ) {
				if ( show ) {
					s.onvisible ();
				} else {
					s.oninvisible ();
				}
				return subtree ?
					gui.Crawler.CONTINUE :
					gui.Crawler.STOP;
			}
		});
	},

	/**
	 * Custom property access denial for debug mode.
	 * @param {String} name
	 * @param {String} prop
	 */
	denial : function ( name, prop ) {
		return {
			enumerable : true,
			configurable : true,
			get : function DENIED () {
				throw new Error ( gui.Spirit.DENIAL + ": " + name + ":" + prop );
			},
			set : function DENIED () {
				throw new Error ( gui.Spirit.DENIAL + ": " + name + ":" + prop );
			}
		};	
	},

	/**
	 * Standard propety access denial: User to access property 
	 * post destruction, report that the spirit was terminated. 
	 */
	DENIED : {
		enumerable : true,
		configurable : true,
		get : function DENIED () {
			throw new Error ( gui.Spirit.DENIAL );
		},
		set : function DENIED () {
			throw new Error ( gui.Spirit.DENIAL );
		}
	},

	/**
	 * Spirit was terminated.
	 * @type {String}
	 */
	DENIAL : "Attempt to handle destructed spirit"

});