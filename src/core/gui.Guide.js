/**
 * The spirit guide crawls the document while channeling 
 * spirits into DOM elements that matches CSS selectors.
 */
gui.Guide = {

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.Guide]";
	},

	/**
	 * Setup spirit management.
	 * @param {Window} win
	 */
	observe : function ( win ) {
		win.document.addEventListener ( "DOMContentLoaded", this, false );
		win.addEventListener ( "load", this, false );
		win.addEventListener ( "unload", this, false );
	},

	/**
	 * Handle startup and shutdown events.
	 * @param {Event} e
	 */
	handleEvent : function ( e ) {
		var sum = new gui.EventSummary ( e );
		switch ( e.type ) {
			case "DOMContentLoaded" :
				this._ondom ( sum );
				break;
			case "load" :
				this._onload ( sum );
				break;
			case "unload" :
				this._unload ( sum );
				break;
		}
		e.currentTarget.removeEventListener ( e.type, this, false );
		e.stopPropagation ();
	},

	/**
	 * Elaborate setup to spiritualize document after async 
	 * evaluation of gui-stylesheets (future project).
	 * @see {gui.StyleSheetSpirit}
	 * @param {gui.Broadcast} b
	 */
	onbroadcast : function ( b ) {
		var sig = b.data;
		var spirit = null;
		var spirits = this._windows [ sig ];
		switch ( b.type ) {
			case gui.BROADCAST_KICKSTART :
				gui.Broadcast.removeGlobal ( b.type, this );
				this._step1 ( document );
				break;
			case gui.BROADCAST_LOADING_CHANNELS :
				if ( !spirits ) {
					spirits = this._windows [ sig ] = [];
					spirits.__loading__ = 0;
				}
				spirits.push ( b.target );
				spirits.__loading__ ++;
				break;
			case gui.BROADCAST_CHANNELS_LOADED :
				if ( -- spirits.__loading__ === 0 ) {
					while (( spirit = spirits.shift ())) {
						spirit.channel ();
					}
					this._step2 ( b.target.document );
				}
				break;
		}
	},

	/**
	 * Possess element and descendants.
	 * @TODO Jump detached spirit if matching id (!)
	 * @param {Element} elm
	 */
	spiritualize : function ( elm ) {
		this._spiritualize ( elm, false, false );
	},

	/**
	 * Possess descendants.
	 * @param {Element} elm
	 */
	spiritualizeSub : function ( elm ) {
		this._spiritualize ( elm, true, false );
	},

	/**
	 * Possess one element non-crawling.
	 * @param {Element} elm
	 */
	spiritualizeOne : function ( elm ) {
		this._spiritualize ( elm, false, true );
	},

	/**
	 * Dispell spirits from element and descendants.
	 * @param {Element} elm
	 */
	materialize : function ( elm ) {
		this._materialize ( elm, false, false );
	},

	/**
	 * Dispell spirits for descendants.
	 * @param {Element} elm
	 */
	materializeSub : function ( elm ) {
		this._materialize ( elm, true, false );
	},

	/**
	 * Dispell one spirit non-crawling.
	 * @param {Element} elm
	 */
	materializeOne : function ( elm ) {
		this._materialize ( elm, false, true );
	},

	/**
	 * Associate DOM element to Spirit instance.
	 * @param {Element} elm
	 * @param {function} Spirit constructor
	 * @returns {Spirit}
	 */
	possess : function ( elm, Spirit ) {
		var doc = elm.ownerDocument;
		var win = doc.defaultView;
		var sig = win.gui.signature;
		return ( elm.spirit = new Spirit ( elm, doc, win, sig ));

		/*
		spirit.element = element;
		spirit.document = element.ownerDocument;
		spirit.window = spirit.document.defaultView;
		spirit.signature = spirit.window.gui.signature;
		// @TODO weakmap for this stunt
		element.spirit = spirit;
		if ( !spirit.life || spirit.life.constructed ) {
			spirit.onconstruct ();
		} else {
			throw "Constructed twice: " + spirit.toString ();
		}
		return spirit;
		*/
	},

	/**
	 * Dispell spirits from element and descendants. This destructs the spirit (immediately).
	 * @param {Element|Document} node
	 */
	exorcise : function ( node ) {
		this._collect ( node, false, gui.CRAWLER_DISPOSE ).forEach ( function ( spirit ) {
			if ( !spirit.life.destructed ) {
				spirit.ondestruct ( true );
			}
		}, this );
	},

	/**
	 * Suspend spirit attachment/detachment during operation.
	 * @param {function} operation
	 * @param @optional {object} thisp
	 * @returns {object}
	 */
	suspend : function ( operation, thisp ) {
		this._suspended = true;
		var res = operation.call ( thisp );
		this._suspended = false;
		return res;
	},
	
	
	 // Private .....................................................................

	 /**
	 * Tracking which gui.StyleSheetSpirit goes into what window.
	 * @type {Map<String,Array<String>>}
	 */
	_windows : Object.create ( null ),

	 /**
	  * Ignore DOM mutations?
	  * @type {boolean}
	  */
	_suspended : false,

	/**
	 * Continue with spiritualize/materialize of given node?
	 * @returns {boolean}
	 */
	_handles : function ( node ) {
		return !this._suspended && 
			gui.Type.isDefined ( node ) && 
			gui.DOMPlugin.embedded ( node ) &&
			node.nodeType === Node.ELEMENT_NODE;
	},

	/**
	 * Fires on document.DOMContentLoaded.
	 * @TODO gui.Observer crashes with JQuery when both do stuff on DOMContentLoaded
	 * @TODO (can't setImmedeate to bypass JQuery, we risk onload being fired first)
	 * @see http://stackoverflow.com/questions/11406515/domnodeinserted-behaves-weird-when-performing-dom-manipulation-on-body
	 * @param {gui.EventSummary} sum
	 */
	_ondom : function ( sum ) {
		gui.broadcastGlobal ( gui.BROADCAST_DOMCONTENT, sum );
		if ( gui.autostart ) {
			var meta = sum.document.querySelector ( "meta[name='gui.autostart']" );
			if ( !meta || gui.Type.cast ( meta.getAttribute ( "content" )) !== false ) {
				this._step1 ( sum.document ); // else await gui.kickstart()
			}
		}
	},

	/**
	 * Fires on window.onload
	 * @param {gui.EventSummary} sum
	 */
	_onload : function ( sum ) {
		if ( sum.documentspirit ) {
			sum.documentspirit.onload ();
		}
		gui.broadcastGlobal ( gui.BROADCAST_ONLOAD, sum );
	},

	/**
	 * Fires on window.unload
	 * @TODO handle disposal in {gui.Spiritual} (no crawling)
	 * @param {gui.EventSummary} sum
	 */
	_unload : function ( sum ) {
		if ( sum.documentspirit ) {
			sum.documentspirit.onunload ();
		}
		gui.broadcastGlobal ( gui.BROADCAST_UNLOAD, sum );
		this.exorcise ( sum.document );
		sum.window.gui.nameDestructAlreadyUsed ();
	},

	/**
	 * Step 1. Great name.
	 * @param {Document} doc
	 */
	_step1 : function ( doc ) {
		var win = doc.defaultView;
		var sig = win.gui.signature;
		this._metatags ( win ); // configure runtime
		win.gui.go (); // channel spirits
		this._stylesheets ( win ); // more spirits?
		// resolving spiritual stylesheets? If not, skip directly to _step2.
		if ( !this._windows [ sig ]) {
			this._step2 ( doc );
		}
	},

	/**
	 * Attach all spirits and proclaim document spiritualized (isolated for async invoke).
	 * @param {Document} doc
	 */
	_step2 : function ( doc ) {
		var win = doc.defaultView;
		var sig = win.gui.signature;
		// broadcast before and after spirits attach
		this.spiritualizeOne ( doc.documentElement );
		if ( win.gui.mode !== gui.MODE_MANAGED ) {
			gui.broadcastGlobal ( gui.BROADCAST_WILL_SPIRITUALIZE, sig );
			this.spiritualizeSub ( doc.documentElement );
			gui.broadcastGlobal ( gui.BROADCAST_DID_SPIRITUALIZE, sig );
		}
	},

	/**
	 * Resolve metatags (configure runtime).
	 * @param {Window} win
	 */
	_metatags : function ( win ) {
		var doc = win.document;
		var spaces = win.gui.namespaces ();
		var metas = doc.querySelectorAll ( "meta[name]" );
		Array.forEach ( metas, function ( meta ) {
			var prop = meta.getAttribute ( "name" );
			spaces.forEach ( function ( ns ) {
				if ( prop.startsWith ( ns + "." )) {
					var value = gui.Type.cast ( 
						meta.getAttribute ( "content" )
					);
					gui.Object.assert ( prop, value, win );
				}
			});
		});
	},

	/**
	 * Resolve stylesheets (channel spirits).
	 * @param {Window} win
	 */
	_stylesheets : function ( win ) {
		var doc = win.document;
		var xpr = ".gui-styles";
		var css = doc.querySelectorAll ( xpr );
		Array.forEach ( css, function ( elm ) {
			this.spiritualizeOne ( elm );
		}, this );
	},

	/**
	 * Collect spirits from element and descendants.
	 * @param {Node} node
	 * @param @optional {boolean} skip
	 * @returns {Array<gui.Spirit>}
	 */
	_collect : function ( node, skip, id ) {
		var list = [];
		new gui.Crawler ( id ).descend ( node, {
		   handleSpirit : function ( spirit ) {
			   if ( skip && spirit.element === node ) {}
			   else if ( !spirit.life.destructed ) {
				   list.push ( spirit );
			   }
		   }
		});
		return list;
	},

	/**
	 * Attach spirits to element and subtree.
	 * * Construct spirits in document order
	 * * Fire life cycle events except ready in document order
	 * * Fire ready in reverse document order (innermost first)
	 * @param {Element} elm
	 * @param {boolean} skip Skip the element?
	 * @param {boolean} one Skip the subtree?
	 */
	_spiritualize : function ( node, skip, one ) {
		node = node.nodeType === Node.DOCUMENT_NODE ? node.documentElement : node;
		if ( this._handles ( node )) {
			var attach = [];
			var readys = [];
			new gui.Crawler ( gui.CRAWLER_ATTACH ).descend ( node, {
				handleElement : function ( elm ) {
					if ( !skip || elm !== node ) {
						var spirit = elm.spirit;
						if ( !spirit ) {
							spirit = gui.Guide._evaluate ( elm );
						}
						if ( spirit !== null ) {
							if ( !spirit.life.attached ) {
								attach.push ( spirit );
							}
						}
					}
					return one ? gui.Crawler.STOP : gui.Crawler.CONTINUE;
				}
			});
			attach.forEach ( function ( spirit ) {
				if ( !spirit.life.configured ) {
					spirit.onconfigure (); // @TODO deprecated :(
				}
				if ( this._invisible ( spirit )) {
					if ( spirit.life.visible ) {
						spirit.oninvisible ();
					}
				} else {
					if ( spirit.life.invisible ) {
						spirit.onvisible ();
					}
				}
				if ( !spirit.life.entered ) {
					spirit.onenter ();
				}
				spirit.onattach ();
				if ( !spirit.life.ready ) {
					readys.push ( spirit );
				}
			}, this );
			readys.reverse ().forEach ( function ( spirit ) {
				spirit.onready ();
			}, this );
		}
	},

	/**
	 * Detach spirits from element and subtree.
	 * @param {Node} node
	 * @param {boolean} skip Skip the element?
	 * @param {boolean} one Skip the subtree?
	 */
	_materialize : function ( node, skip, one ) {
		node = node.nodeType === Node.DOCUMENT_NODE ? node.documentElement : node;
		if ( this._handles ( node )) {
			this._collect ( node, skip, gui.CRAWLER_DETACH ).forEach ( function ( spirit ) {
				if ( spirit.life.attached && !spirit.life.destructed ) {
					spirit.ondetach ();
				}
			}, this );
		}
	},

	/**
	 * If possible, construct and return spirit for element.
	 * @TODO what's this? http://code.google.com/p/chromium/issues/detail?id=20773
	 * @TODO what's this? http://forum.jquery.com/topic/elem-ownerdocument-defaultview-breaks-when-elem-iframe-document
	 * @param {Element} element
	 * @returns {Spirit} or null
	 */
	_evaluate : function ( element ) {
		if ( !element.spirit ) {
			var doc = element.ownerDocument;
			var win = doc.defaultView;
			var hit = win.gui.evaluate ( element );
			if ( hit ) {
				this.possess ( element, hit );
			}
		}
		return element.spirit;
	},

	/**
	 * Spirit is invisible? 
	 * @TODO only test for this if something is indeed invisible. 
	 * Consider maintaining this via crawlers.
	 * @param {gui.Spirit} spirit
	 * @returns {boolean}
	 */
	_invisible : function ( spirit ) {
		return spirit.css.contains ( gui.CLASS_INVISIBLE ) || 
		spirit.css.matches ( "." + gui.CLASS_INVISIBLE + " *" );
	}
};

/**
 * Start managing the top level window.
 */
( function startup () {
	gui.Guide.observe ( window );
	gui.Broadcast.addGlobal ([ 
		gui.BROADCAST_LOADING_CHANNELS,
		gui.BROADCAST_CHANNELS_LOADED,
		gui.BROADCAST_KICKSTART
	], gui.Guide );
})();