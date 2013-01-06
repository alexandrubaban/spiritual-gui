/**
 * The spirit guide crawls the document while channeling 
 * spirits into DOM elements that matches CSS selectors.
 */
gui.Guide = {
	
	/**
	 * Tracking which gui.StyleSheetSpirit goes into what window.
	 * @type {Map<String,Array<String>>}
	 */
	_windows : Object.create ( null ),
	
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
	  
		return "[object gui.Guide]";
	},
	
	/**
	 * Manage spirits in window.
	 * @param {Window} win
	 */
	observe : function ( win ) {
		
		win.document.addEventListener ( "DOMContentLoaded", this, false );
		win.addEventListener ( "load", this, false );
		win.addEventListener ( "unload", this, false );
	},
	
	/**
	 * Events.
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
	 * Elaborate setup to spiritualize document 
	 * after async evaluation of ui stylesheets.
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
					while ( spirit = spirits.shift ()) {
						spirit.channel ();
					}
					this._step2 ( b.target.document );
				}
				break;
		}
	},

	/**
	 * Construct spirits for element and descendants, 
	 * then attach all spirits in document order.
	 * TODO: JUMP DETACHED SPIRIT IF MATCHING ID!
	 * @param {Element} elm
	 * @param {boolean} skip Eval descendants only
	 */
	attach : function ( elm ) {
		
		this._attach ( elm, false, false );
	},

	/**
	 * Construct spirits for descendants.
	 * @param {Element} elm
	 */
	attachSub : function ( elm ) {

		this._attach ( elm, true, false );
	},

	/**
	 * Attach one spirit non-crawling.
	 * @param {Element} elm
	 */
	attachOne : function ( elm ) {

		this._attach ( elm, false, true );
	},

	/**
	 * Detach spirits from element and descendants.
	 * @param {Element} elm
	 * @param @optional {boolean} skip Eval descendants only 
	 */
	detach : function ( elm ) {

		this._detach ( elm, false, false );
	},

	/**
	 * Detach spirits for descendants.
	 * @param {Element} elm
	 */
	detachSub : function ( elm ) {

		this._detach ( elm, true, false );
	},

	/**
	 * Detach one spirit non-crawling.
	 * @param {Element} elm
	 */
	detachOne : function ( elm ) {

		this._detach ( elm, false, true );
	},
	
	/**
	 * Detach spirits from element and descendants.
	 * @param {Node} node
	 * @param @optional {boolean} skip Eval descendants only 
	 */
	dispose : function ( node, unloading ) {
		
		this._collect ( node, false, gui.CRAWLER_DISPOSE ).forEach ( function ( spirit ) {
			if ( !spirit.life.destructed ) {
				spirit.ondestruct ( unloading );
			}
		}, this );
	},
	
	/**
	 * Associate DOM element to Spirit instance.
	 * @param {Element} element
	 * @param {function} C spirit constructor
	 * @returns {Spirit}
	 */
	animate : function ( element, C ) {
		
		var spirit = new C ();
		
		spirit.element = element;
		spirit.document = element.ownerDocument;
		spirit.window = spirit.document.defaultView;
		spirit.spiritkey = gui.KeyMaster.generateKey ();
		spirit.signature = spirit.window.gui.signature;
		
		/*
		 * TODO: weakmap for this stunt
		 */
		element.spirit = spirit;
		if ( !spirit.life || spirit.life.constructed ) {
			spirit.onconstruct ();
		} else {
			throw "Constructed twice: " + spirit.toString ();
		}
		
		return spirit;
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
	
	
	// PRIVATES .....................................................................

	/**
	 * Ignore DOM mutations?
	 * @type {boolean}
	 */
	_suspended : false,

	/**
	 * Continue with attachment/detachment of given node?
	 * @returns {boolean}
	 */
	_handles : function ( node ) {

		return !this._suspended && 
			gui.Type.isDefined ( node ) && 
			gui.SpiritDOM.embedded ( node ) &&
			node.nodeType === Node.ELEMENT_NODE;
	},

	/**
	 * Fires on document.DOMContentLoaded.
	 * @param {gui.EventSummary} sum
	 */
	_ondom : function ( sum ) {
		
		gui.broadcast ( gui.BROADCAST_DOMCONTENT, sum );

		// TODO: gui.Observer crashes with JQuery when both do stuff on DOMContentLoaded, pushing Spiritual to next stack for now
		// see http://stackoverflow.com/questions/11406515/domnodeinserted-behaves-weird-when-performing-dom-manipulation-on-body
		var that = this, doc = sum.document;
		//setImmediate(function(){ // can't do, we risk onload being fired first :(
			that._step1 ( doc );
		//});
	},
	
	/**
	 * Fires on window.onload
	 * @param {gui.EventSummary} sum
	 */
	_onload : function ( sum ) {
		
		if ( sum.documentspirit ) {
			sum.documentspirit.onload ();
		}
		gui.broadcast ( gui.BROADCAST_ONLOAD, sum );
	},
	
	/**
	 * Fires on window.unload
	 * TODO: handle disposal in gui.Spiritual (no crawling)
	 * @param {gui.EventSummary} sum
	 */
	_unload : function ( sum ) {
		
		if ( sum.documentspirit ) {
			sum.documentspirit.onunload ();
		}
		
		gui.broadcast ( gui.BROADCAST_UNLOAD, sum );
		this.dispose ( sum.document.documentElement, true );
		sum.window.gui.nameDestructAlreadyUsed ();
	},
	
	/**
	 * Step 1. Great name...
	 * @param {Document} doc
	 */
	_step1 : function ( doc ) {

		var win = doc.defaultView;
		var sig = win.gui.signature;

		this._metatags ( win ); // configure runtime
		win.gui.go (); // channel spirits
		this._stylesheets ( win ); // more spirits?
		
		/*
		 * resolving spiritual stylesheets? 
		 * If not, skip directly to _step2.
		 */
		if ( !this._windows [ sig ]) {
			this._step2 ( doc );
		}
	},

	/**
	 * Attach all spirits and proclaim document 
	 * spiritualized (isolated for async invoke).
	 * @param {Document} doc
	 */
	_step2 : function ( doc ) {

		var win = doc.defaultView;
		var sig = win.gui.signature;

		/*
		 * In development mode, we setup a mutation observer 
		 * to monitor the document for unhandled DOM updates. 
		 */
		if ( win.gui.debug ){
			if ( win.gui.mode === gui.MODE_JQUERY ) {
				setImmediate(function(){ // TODO: somehow not conflict with http://stackoverflow.com/questions/11406515/domnodeinserted-behaves-weird-when-performing-dom-manipulation-on-body
					gui.Observer.observe ( win ); // IDEA: move all of _step2 to next stack?
				});
			} else {
				gui.Observer.observe ( win );
			}
		}

		if ( gui.Client.isWebKit ) {
			if ( win.gui.mode === gui.MODE_NATIVE ) {
				gui.WEBKIT.patch ( doc.documentElement );
			}
		}

		// broadcast before and after spirits attach
		gui.broadcast ( gui.BROADCAST_WILL_SPIRITUALIZE, sig );
		this.attach ( doc.documentElement );
		gui.broadcast ( gui.BROADCAST_DID_SPIRITUALIZE, sig );
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

	/*
	 * Resolve stylesheets (channel spirits).
	 * @param {Window} win
	 */
	_stylesheets : function ( win ) {

		var doc = win.document;
		var xpr = ".gui-styles";
		var css = doc.querySelectorAll ( xpr );
		Array.forEach ( css, function ( elm ) {
			this.attachOne ( elm );
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
		if ( node.nodeType === Node.ELEMENT_NODE ) {
			new gui.Crawler ( id ).descend ( node, {
			   handleSpirit : function ( spirit ) {
				   if ( skip && spirit.element === node ) {}
				   else if ( !spirit.life.destructed ) {
					   list.push ( spirit );
				   }
			   }
			});
		}
		return list;
	},

	/**
	 * Attach spirits to element and subtree.
	 * @param {Element} elm
	 * @param {boolean} skip Skip the element?
	 * @param {boolean} one Skip the subtree?
	 */
	_attach : function ( node, skip, one ) {

		if ( this._handles ( node )) {
			
			var attach = [];
			var readys = [];

			// construct spirits in document order
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
			
			// fire life cycle events in document order
			attach.forEach ( function ( spirit ) {
				if ( !spirit.life.configured ) {
					spirit.onconfigure ();
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
			
			// fire ready in reverse document order (innermost first)
			readys.reverse ().forEach ( function ( spirit ) {
				spirit.onready ();
			}, this );
		}
	},

	/**
	 * Detach spirits from element and subtree.
	 * @param {Element} elm
	 * @param {boolean} skip Skip the element?
	 * @param {boolean} one Skip the subtree?
	 */
	_detach : function ( elm, skip, one ) {
		
		if ( this._handles ( elm )) {
			this._collect ( elm, skip, gui.CRAWLER_DETACH ).forEach ( function detach ( spirit ) {
				if ( spirit.life.attached && !spirit.life.destructed ) {
					spirit.ondetach ();
				}
			}, this );
		}
	},
	
	/**
	 * If possible, construct and return spirit for element.
	 * TODO: what's this? http://code.google.com/p/chromium/issues/detail?id=20773
	 * TODO: what's this? http://forum.jquery.com/topic/elem-ownerdocument-defaultview-breaks-when-elem-iframe-document
	 * @param {Element} element
	 * @returns {Spirit} or null
	 */
	_evaluate : function ( element ) {
		
		if ( !element.spirit ) {
			var doc = element.ownerDocument;
			var win = doc.defaultView;
			var hit = win.gui.evaluate ( element );
			if ( hit ) {
				this.animate ( element, hit );
			}
		}
		return element.spirit;
	},

	/**
	 * Spirit is invisible? TODO: only test for 
	 * this if something is indeed invisible. 
	 * Consider maintaining this via crawlers.
	 * @param {gui.Spirit} spirit
	 * @returns {boolean}
	 */
	_invisible : function ( spirit ) {

		return spirit.css.contains ( gui.CLASS_INVISIBLE ) || 
		spirit.css.matches ( "." + gui.CLASS_INVISIBLE + " *" );
	}
};

/*
 * We are ready to start managing the top level window.
 */
( function startup () {
	
	gui.Guide.observe ( window );
	gui.Broadcast.addGlobal ([ 
		gui.BROADCAST_LOADING_CHANNELS,
		gui.BROADCAST_CHANNELS_LOADED,
		gui.BROADCAST_KICKSTART
	], gui.Guide );
	
})();