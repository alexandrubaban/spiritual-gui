// # gui.Spirit
// Base constructor for all spirits
gui.Spirit = gui.Exemplar.create ( "gui.Spirit", Object.prototype, {

	// Spirit DOM element.
	// @type {Element} 
	element : null,
	
	// Containing document.
	// @type {Document}
	document : null,
	
	// Containing window.
	// @type {Window} 
	window : null,
	
	// Unique key for this spirit instance.
	// @type {String}
	spiritkey : null,
	
	// Matches the property "signature" of the {gui.Spiritual} 
	// instance in local window context (the gui object). This 
	// will come in handy when Spiritual is running in iframes.
	// @todo rename "guikey"?
	// @type {String}
	signature : null,


	// ### Basics
	
	// Identification.
	// @returns {String}
	toString : function toString () {		
		return "[object gui.Spirit]";
	},
	
	
	// ### Lifecycle
	
	// You can safely overload or overwrite methods in the lifecycle section, 
	// but you should leave it to the {gui.Guide} to invoke them. Also, do make 
	// sure to always call this._super.themethod () unless you really mean it.
	
	// Invoked when spirit is newed up. Spirit element may  
	// not be positioned in the document DOM at this point. 
	onconstruct : function () {
		this.__plugin__ ();
		this.__debug__ ( true );
		this.life.goconstruct ();
	},
	
	// @todo Comments go here.
	onconfigure : function () {
		this.config.configure ();
		this.life.goconfigure ();
	},
	
	// Spirit first encounted as a node in the page DOM. This is only called once 
	// in the lifecycle of a spirit (unlike attach, see below).
	onenter : function () {
		this.window.gui.inside ( this );
		this.life.goenter ();
	},
	
	// Invoked 
	// * whenever spirit element is attached to the DOM tree
	// * when the element is in the DOM on page load and the spirit is first discovered by the framework
	// @todo Check if spirit matchesselector gui.CLASS_INVISIBLE + " *"
	onattach : function () {
		this.window.gui.inside ( this );
		this.life.goattach ();
	},
	
	// Invoked (only once) when all descendant spirits are attached and ready. 
	// From a DOM tree perspective, this fires in reverse order, innermost first. 
	onready : function () {
		this.life.goready ();
	},

	// Hello!
	onvisible : function () {
		this.life.govisible ();
	},

	// Hello.
	oninvisible : function () {
		this.life.goinvisible ();
	},

	// Invoked whenever spirit element is detached from the DOM tree. 
	ondetach : function () {
		this.window.gui.outside ( this );
		this.life.godetach ();
	},
	
	// Invoked when spirit is detached and not re-attached in the same thread. 
	// This triggers destruction *unless* you return false. In this case, make sure 
	// to manually dispose the spirit later (using method `dispose`).  
	// @returns {boolean} Optionally return false to manage your own destruction
	onexit : function () {
		this.life.goexit (); // do not call _super.onexit if you return false
		return undefined;
	},
	
	// Invoked when spirit gets disposed. Code your last wishes.
	// Should only be called by the framework, use `dispose()`.
	// @see {gui.Spirit#dispose}
	// @param {boolean} unloading
	// @returns {boolean}
	ondestruct : function ( unloading ) {
		this.window.gui.destruct ( this );
		this.life.godestruct ();
		this.__debug__ ( false );
		this.__destruct__ ( unloading );
	},
	

	// ### Handlers
	/* ............................................................................. */
	
	// Handle crawler.
	// @param {gui.Crawler} crawler
	// @returns {number}
	oncrawler : function ( crawler ) {
		return gui.Crawler.CONTINUE;
	},
	
	// Handle lifecycle event.
	// @param {gui.SpiritLife} life
	onlife : function ( life ) {},
	
	
	// ### Specials
	
	// Hello.
	// @returns {gui.Spirit}
	visible : function () {
		return gui.Spirit.visible ( this );
	},

	// Hello.
	// @returns {gui.Spirit}
	invisible : function () {
		return gui.Spirit.invisible ( this );
	},

	// @todo boolean trap in this API
	// Terminate the spirit and remove the element (optionally keep it). 
	// @param {boolean} keep True to leave the element on stage.
	dispose : function ( keep ) {
		if ( !keep ) {
			this.dom.remove ();
		}
		this.ondestruct ();
	},
	
	
	// ### Secrets
	/* ............................................................................. */
	
	// Secret constructor.
	__construct__ : function () {},

	// Experimental.
	// @type {[type]}
	__lazies__ : null,

	// Instantiate plugins.
	__plugin__ : function () {
		// core plugins first
		this.life = new gui.SpiritLifeTracker ( this );
		this.config = new gui.SpiritConfig ( this );
		this.__lazies__ = Object.create ( null );
		// bonus plugins second
		var prefixes = [], plugins = this.constructor.__plugins__;
		gui.Object.each ( plugins, function ( prefix, Plugin ) {
			switch ( Plugin ) {
				case gui.SpiritLifeTracker :
				case gui.SpiritConfig :
					break;
				default :
					if ( Plugin.lazy ) {
						gui.SpiritPlugin.later ( Plugin, prefix, this, this.__lazies__ );
					} else {
						this [ prefix ] = new Plugin ( this );
					}
					prefixes.push ( prefix );
					break;
			}
		}, this );
		// construct plugins in that order
		this.life.onconstruct ();
		this.config.onconstruct ();
		prefixes.forEach ( function ( prefix ) {
			if ( this.__lazies__ [ prefix ]) {
				// lazy plugins constructed when addressed
			} else {
				this [ prefix ].onconstruct ();
			}
		}, this );
	},

	// In debug mode, stamp the toString value onto the spirit element. 
	// The toString value is defined bt the string that may be passed as 
	// first argument to the gui.Spirit.infuse("JohnsonSpirit") method. 
	// Debug mode is set per document via local script: ui.debug=true;
	// @param {boolean} constructing
	__debug__ : function ( constructing ) {
		var val;
		if ( this.window.gui.debug ) {
			if ( constructing ) {
				if ( !this.att.has ( "gui" )) {
					val = "[" + this.displayName + "]";
					this.att.set ( "gui", val );
				}
			} else {
				val = this.att.get ( "gui" );
				if ( val && val.startsWith ( "[" )) {
					this.att.del ( "gui" );
				}
			}
		}
	},
	
	// Total destruction.
	// @param @optional {boolean} unloading If true, destruct immediately
	__destruct__ : function ( unloading ) {
		var map = this.__lazies__;
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
					if ( thing instanceof gui.SpiritPlugin ) {
						if ( thing !== this.life ) {
							thing.__destruct__ ( unloading );
						}
					}
					break;
			}
		}, this );
		// dispose life plugin last...
		this.life.__destruct__ ();
		// schedule cremation?
		if ( unloading ) {
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
						// @todo why sometimes gui.Spirit.DENIED?
					}
				}
			}, this.signature ).dispatch ( tick, 0, this.signature );
		}
	},
	
	// Null all props. We have hotfixed conflicts upon disposal by moving this to a new 
	// execution stack, but the consequences should be thought throught at some point. 
	__null__ : function () {
		var element = this.element;
		if ( element ) {
			try {
				element.spirit = null;
			} catch ( denied ) { /* explorer may deny permission in frames */ }
		}
		// null all properties
		Object.keys ( this ).forEach ( function ( prop ) {
			Object.defineProperty ( this, prop, gui.Spirit.DENIED );
		}, this );
	}


	// ## Recurring statics

}, { /* ............................................................................. */

	// Mapping plugin constructor to prefix.
	// @type {Map<String,function>}
	__plugins__ : Object.create ( null ),
	
	// Portal this spirit to descendant iframes?
	// @see {ui#portal}  
	// @type {boolean}
	portals : true,
	
	// Extends spirit and plugins (mutating plugins) plus update getters/setters.
	// @param {object} expando 
	// @param {object} recurring 
	// @param {object} statics 
	// @returns {gui.Spirit}
	infuse : function () {
		var C = gui.Exemplar.extend.apply ( this, arguments );
		C.__plugins__ = gui.Object.copy ( this.__plugins__ );
		var breakdown = gui.Exemplar.breakdown ( arguments );
		gui.Object.each ( C.__plugins__, function ( prefix, plugin ) {
			var def = breakdown.expando [ prefix ];			
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

	// Subclassing a spirit allows you to also subclass it's plugins 
	// using the same declarative syntax. To avoid potential frustration, 
	// we throw on the `extend` method which doesn't offfer this feature.
	extend : function () {
		throw new Error ( 
			'Spirits must use the "infuse" method and not "extend".\n' +
			'This method extends both the spirit and it\'s plugins.'
		);
	},

	// Create element (this will likely be removed).
	// @param {Document} doc
	// @param {String} tag
	tag : function ( doc, tag ) {
		console.warn ( "Deprecated" ); // = spirit.lazies || Object.create ( null );
		return doc.createElement ( tag );
	},

	// Set attribute (this will likely be removed).
	// @param {Element} elm
	// @param {String} att
	// @param {String} val
	att : function ( elm, att, val ) {
		console.warn ( "Deprecated" );
		elm.setAttribute ( att, String ( val ));
		return elm;
	},
	
	// Set element text (this will likely be removed).
	// @param {Element} elm
	// @param {String} txt
	text : function ( elm, txt ) {
		console.warn ( "Deprecated" );
		elm.textContent = txt;
	},

	// Parse HTML string to DOM element in given document context.
	// @todo parent element awareness when inserted in document :)
	// @param {Document} doc
	// @param {String} html
	// @returns {Element}
	parse : function ( doc, html ) {
		if ( doc.nodeType === Node.DOCUMENT_NODE ) {
			return new gui.HTMLParser ( doc ).parse ( html )[ 0 ]; // @todo parseOne?
		} else {
			throw new TypeError ( this + ".parse() expects a Document" );
		}
	},

	// Associate DOM element to Spirit instance.
	// @param {Element} element
	// @returns {Spirit}
	animate : function ( element ) {
		return gui.Guide.animate ( element, this );
	},

	// Create DOM element and associate Spirit instance.
	// @param @optional {Document} doc
	// @returns {gui.Spirit}
	summon : function ( doc ) {
		doc = doc ? doc : document;
		return this.animate ( doc.createElement ( "div" ));
	},
	
	// Assign plugin to prefix, checking for naming collision.
	// @param {String} prefix
	// @param {function} plugin Constructor for plugin
	// @param {boolean} override Disable collision detection
	plugin : function ( prefix, plugin, override ) {
		// Partly prepared for a scenario where spirits 
		// may have been declared before plugins load.
		var plugins = this.__plugins__;
		if ( !this.prototype.hasOwnProperty ( prefix ) || this.prototype.prefix === null || override ) {
			if ( !plugins [ prefix ] || override ) {
				plugins [ prefix ] = plugin;
				this.prototype.prefix = null;
				gui.Exemplar.children ( this, function ( sub ) {
					sub.plugin ( prefix, plugin, override );
				});
			}
		} else {
			console.error ( "Plugin naming crash in " + this + ": " + prefix );
		}
	}

	/*
	// @todo move to Spiritual EDB
	// @type {String}
	script : null,
	
	// @todo move to Spiritual EDB.
	// @param {Document} doc
	// @returns {String}
	run : function ( doc ) {

		var func = edb.Function.get ( this.script, doc.defaultView );
		var args = Array.filter ( arguments, function ( e, i ) {
			return i > 0;
		});
		var html = func.apply ( {}, args );
		return this.animate ( this.parse ( doc, html ));
	}
	*/
	

	// ## Statics

}, { /* ............................................................................. */

	// Hello.
	// @param {gui.Spirit} spirit
	// @returns {gui.Spirit}
	visible : function ( spirit ) {
		if ( spirit.life.invisible ) {
			this._visible ( spirit, true, spirit.life.entered );
			spirit.css.remove ( gui.CLASS_INVISIBLE );
		}
		return spirit;
	},

	// Hello.
	// @param {gui.Spirit} spirit
	// @returns {gui.Spirit}
	invisible : function ( spirit ) {
		if ( spirit.life.visible ) {
			this._visible ( spirit, false, spirit.life.entered );
			spirit.css.add ( gui.CLASS_INVISIBLE );
		}
		return spirit;
	},

	// Hello again.
	// @param {gui.Spirit} spirit
	// @param {boolean} show
	// @param {boolean} subtree
	_visible : function ( spirit, show, subtree ) {
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

	// User to access property post destruction, report that the spirit was terminated. 
	DENIED : {
		enumerable : true,
		configurable : true,
		get : function DENIED () {
			throw new Error ( "Attempt to handle destructed spirit" );
		},
		set : function DENIED () {
			throw new Error ( "Attempt to handle destructed spirit" );
		}
	}
});