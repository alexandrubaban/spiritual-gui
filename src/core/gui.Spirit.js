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
	 * Matches the property `$contextid` of the local `gui` object.
	 * @TODO rename this property
	 * @TODO perhapse deprecate?
	 * @type {String}
	 */
	$contextid : null,

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
	onconstruct : function () {
		this.$pluginplugins ();
		this.$debug ( true );
		this.life.goconstruct ();
	},
	
	/**
	 * `onconfigure` gets callend immediately after construction. This 
	 * instructs the spirit to parse configuration attributes in markup. 
	 * @see {gui.AttConfigPlugin}
	 */
	onconfigure : function () {
		this.attconfig.configureall ();
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
	onattach : function () {
		this.window.gui.inside ( this ); // @TODO: this in {gui.Guide}
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
	 * `ondetach` gets callend whenever the spirit element is detached from the DOM tree. 
	 */
	ondetach : function () {
		this.window.gui.outside ( this ); // @TODO: this in {gui.Guide}
		this.life.godetach ();
	},
	
	/**
	 * `onexit` gets called when spirit is detached and not re-attached in the same 
	 * execution stack. This triggers destruction unless you return `false`. In this 
	 * case, make sure to manually dispose the spirit later (using method `dispose`).  
	 * @returns {udenfined|boolean} Return false to stay alive
	 */
	onexit : function () {
		this.life.goexit ();
		return undefined;

		// subclass: don't invoke `this._super.onexit` if you return false!
		// TODO: don't relay on that, just get these step things out of here

	},
	
	/**
	 * Invoked when spirit gets disposed. Code your last wishes. Should only be 
	 * called by the framework, please use `dispose()` to terminate the spirit.
	 * @see {gui.Spirit#dispose}
	 */
	ondestruct : function () {
		this.window.gui.destruct ( this );
		this.$debug ( false );
		this.life.godestruct ();
		// process continues in $ondestruct()
	},


	// Async lifecycle .......................................................................
	
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
	

	// Handlers ..............................................................................
	
	/**	
	 * Handle crawler (tell me more)
	 * @param {gui.Crawler} crawler
	 * @returns {number}
	 */
	oncrawler : function ( crawler ) {
		return gui.Crawler.CONTINUE;
	},
	
	
	// More stuff ............................................................................

	/**
	 * Terminate the spirit and remove the element (optionally keep it). 
	 * @param {boolean} keep True to leave the element on stage.
	 * @TODO Terrible boolean trap in this API 
	 */
	dispose : function ( keep ) {
		if ( !keep ) {
			this.dom.remove ();
		}
		gui.Guide.materializeOne ( this );
	},
	

	// Secret ................................................................................
	
	/**
	 * Secret constructor. Invoked before `onconstruct`. The 
	 * `$instanceid` is generated standard by the {gui.Class}
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
		this.onconstruct ();
	},

	/**
	 * Secret destructor. Invoked after `ondestruct`.
	 *
	 * - Nuke lazy plugins so that we don't accidentally instantiate them
	 * - Destruct remaining plugins, saving {gui.Life} plugin for last
	 * - Replace all properties with an accessor to throw an exception
	 */
	$ondestruct : function () {
		var prefixes = [];
		gui.Object.each ( this.life.plugins, function ( prefix, active ) {
			if ( active ) {
				if ( prefix !== "life" ) {
					prefixes.push ( prefix );
				}
			} else {
				Object.defineProperty ( this, prefix, {
					enumerable : true,
					configurable : true,
					get : function () {},
					set : function () {}
				});
			}
		}, this );
		this.$nukeplugins ( prefixes.sort ());
		this.$nukeplugins ([ "life" ]);
		this.$nukeallofit ();
	},

	/**
	 * Nuke plugins in two steps.
	 * @param {Array<String>} prefixes
	 */
	$nukeplugins : function ( prefixes ) {
		var plugins = prefixes.map ( function ( key ) {
			return this [ key ];
		}, this );
		plugins.forEach ( function ( plugin ) {
			plugin.ondestruct ();
		});
		plugins.forEach ( function ( plugin ) {
			plugin.$ondestruct ();
		});
	},

	/**
	 * Replace al properties with an accessor to throw an exception.
	 * @TODO: scan property descriptor and skip unmutable properties (would throw in strict?)
	 * @param {Array<String>} props
	 */
	$nukeallofit : function () {
		try {
			this.element.spirit = null;
		} catch ( denied ) {} // explorer may deny permission in frames (still relevant?)
		var nativ = this.window.Object;
		for ( var prop in this ) {
			if ( nativ [ prop ] === undefined ) {
				Object.defineProperty ( this, prop, gui.Spirit.DENIED );
			}
		}
	},

	/**
	 * Plug in the plugins. Lazy plugins will be newed up when needed.
	 *
	 * - {gui.LifePlugin} first
	 * - {gui.AttConfigPlugin} second
	 * - bonus plugins galore
	 */
	$pluginplugins : function () {
		var Plugin, now, plugins = this.constructor.$plugins;
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
	 * passed as first argument to the gui.Spirit.infuse("John") method.
	 * @param {boolean} constructing
	 */
	$debug : function ( constructing ) {
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
	}


}, { // Recurring static ...................................................................
	
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
		var plugins = this.$plugins;
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


	// Secret ................................................................................
	
	/**
	 * Mapping plugin prefix to plugin constructor.
	 * @type {Map<String,function>}
	 */
	$plugins : Object.create ( null )

	
}, { // Static .............................................................................

	/**
	 * Mark spirit invisible.
	 * @param {gui.Spirit} spirit
	 * @returns {gui.Spirit}
	 */
	goinvisible : function ( spirit ) {
		if ( !spirit.life.invisible ) {
			spirit.css.add ( gui.CLASS_INVISIBLE );
			this.$visible ( spirit, false );
		}
		return spirit;
	},

	/**
	 * Mark spirit visible. Once visibility has been resolved on startup, 
	 * the spirit must have been marked invisible for this to have effect.
	 * @param {gui.Spirit} spirit
	 * @returns {gui.Spirit}
	 */
	govisible : function ( spirit ) {
		var classname = gui.CLASS_INVISIBLE;
		if ( spirit.life.visible === undefined || spirit.css.contains ( classname )) {
			spirit.css.remove ( classname );
			this.$visible ( spirit, true );
		}
		return spirit;
	},

	/**
	 * Recursively update spirit and descendants visibility. Cornercase for the 
	 * {gui.DocumentSpirit} who needs to relay visibility from hosting document.
	 * @param {gui.Spirit} start
	 * @param {boolean} show
	 */
	$visible : function ( start, show ) {
		var type = show ? gui.CRAWLER_VISIBLE : gui.CRAWLER_INVISIBLE;
		new gui.Crawler ( type ).descendGlobal ( start, {
			handleSpirit : function ( spirit ) {
				if ( spirit !== start && spirit.css.contains ( gui.CLASS_INVISIBLE )) {
					return gui.Crawler.STOP;
				}
				if ( show ) {
					if ( !spirit.life.visible ) { // @TODO cornercase is obsolete???
						spirit.onvisible ();
					}
				} else {
					if ( !spirit.life.invisible ) {
						spirit.oninvisible ();
					}
				}
				return gui.Crawler.CONTINUE;
			}
		});
	},

	/**
	 * User to access property post destruction, report that the spirit was terminated. 
	 * This is used in {gui.debug} mode only, otherwise the property will simply be nulled.
	 * @TODO: Investigate whether or not this makes any difference in memory consumption
	 */
	DENIED : {
		enumerable : true,
		configurable : true,
		get : function () {
			gui.Spirit.DENY ();
		},
		set : function () {
			gui.Spirit.DENY ();
		}
	},

	/**
	 * Obscure mechanism to include the whole stacktrace in the error message.
	 * @see https://gist.github.com/jay3sh/1158940
	 */
	DENY : function ( message ) {
		var stack, e = new Error ( gui.Spirit.DENIAL );
		if ( !gui.Client.isExplorer && ( stack = e.stack )) {
			if ( gui.Client.isWebKit ) {
				stack = stack.replace ( /^[^\(]+?[\n$]/gm, "" ).
					replace ( /^\s+at\s+/gm, "" ).
					replace ( /^Object.<anonymous>\s*\(/gm, "{anonymous}()@" ).
					split ( "\n" );
			} else {
				stack = stack.split ( "\n" );
			}
			stack.shift (); stack.shift ();
			throw new Error ( e.message + "\n" + stack );
		} else {
			throw e;
		}
	},

	/**
	 * To identify our exception in a try-catch scenario, look for 
	 * this string in the *beginning* of the exception message. 
	 * @type {String}
	 */
	DENIAL : "Attempt to handle destructed spirit"

});