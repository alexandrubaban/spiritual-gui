/**
 * Base constructor for all spirits
 */
gui.Spirit = gui.Class.create ( "gui.Spirit", Object.prototype, {

	/**
	 * Unique key for this spirit instance. Uppercase implies read-only.
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
	onconfigure : function () {},
	
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
	 * `ondetach` gets callend whenever the spirit element is about to be detached from the DOM tree. 
	 * Unless the element is appended somewhere else, this will schedule the spirit for destruction.
	 */
	ondetach : function () {},

	/**
	 * `onexit` gets if the spirit element has been manually detached and not re-attached in 
	 * the same execution stack. Spirit is not positioned in the document DOM at this point.
	 */
	onexit : function () {},
	
	/**
	 * Invoked when spirit is about to be destroyed. Code your last wishes here. 
	 * Spirit element may not be positioned in the document DOM at this point. 
	 */
	ondestruct : function () {},


	// Async lifecycle .......................................................................

	/**
	 * Invoked some milliseconds after `onattach`. Postpone 
	 * operations to here to give the browser a repaint break.
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
	 * @TODO: validate that user isn't declaring non-primitives on the prototype (log warning).
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
		spirit.onconstruct ();
		spirit.life.goconstruct ();
	},
	
	/**
	 * Spirit configure.
	 * @param {gui.Spirit} spirit
	 */
	$configure : function ( spirit ) {
		spirit.attconfig.configureall ();
		spirit.onconfigure ();
		spirit.life.goconfigure ();
	},
	
	/**
	 * Spirit enter.
	 * @param {gui.Spirit} spirit
	 */
	$enter : function ( spirit ) {
		spirit.window.gui.inside ( spirit );
		spirit.onenter ();
		spirit.life.goenter ();
	},
	
	/**
	 * Spirit attach.
	 * @param {gui.Spirit} spirit
	 */
	$attach : function ( spirit ) {
		spirit.window.gui.inside ( spirit );
		spirit.onattach ();
		spirit.life.goattach ();
	},
	
	/**
	 * Spirit ready.
	 * @param {gui.Spirit} spirit
	 */
	$ready : function ( spirit ) {
		spirit.onready ();
		spirit.life.goready ();
	},

	/**
	 * Spirit detach.
	 * @param {gui.Spirit} spirit
	 */
	$detach : function ( spirit ) {
		spirit.window.gui.outside ( spirit );
		spirit.life.godetach ();
		spirit.life.govisible ( false );
		spirit.ondetach ();
	},
	
	/**
	 * Spirit exit.
	 * @param {gui.Spirit} spirit
	 */
	$exit : function ( spirit ) {
		spirit.life.goexit ();
		spirit.onexit ();
	},
	
	/**
	 * Spirit destruct.
	 * @param {gui.Spirit} spirit
	 */
	$destruct : function ( spirit ) {
		spirit.window.gui.destruct ( spirit );
		spirit.$debug ( false );
		spirit.life.godestruct ();
		spirit.ondestruct ();
	},

	/**
	 * Spirit dispose. This calls the secret destructor {gui.Spirit#$ondestruct}.
	 * @see {gui.Spirit#$ondestruct}
	 * @param {gui.Spirit} spirit
	 */
	$dispose : function ( spirit ) {
		spirit.$ondestruct ();
		gui.GreatSpirit.$meet ( spirit );
	},

	/**
	 * Spirit async lifecycle.
	 * @TODO: This should be evaluated after `appendChild` to another position.
	 * @param {gui.Spirit} spirit
	 */
	$async : function ( spirit ) {
		spirit.onasync ();
	}

});