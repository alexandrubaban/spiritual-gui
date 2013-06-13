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
					spirits.$loading = 0;
				}
				spirits.push ( b.target );
				spirits.$loading ++;
				break;
			case gui.BROADCAST_CHANNELS_LOADED :
				if ( -- spirits.$loading === 0 ) {
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
	 * @param {Element} target
	 */
	spiritualize : function ( target ) {
		target = target instanceof gui.Spirit ? target.element : target;
		this._maybespiritualize ( target, false, false );
	},

	/**
	 * Possess descendants.
	 * @param {Element|gui.Spirit} target
	 */
	spiritualizeSub : function ( target ) {
		this._maybespiritualize ( target, true, false );
	},

	/**
	 * Possess one element non-crawling.
	 * @param {Element|gui.Spirit} target
	 */
	spiritualizeOne : function ( target ) {
		this._maybespiritualize ( target, false, true );
	},

	/**
	 * Dispell spirits from element and descendants.
	 * @param {Element|gui.Spirit} target
	 */
	materialize : function ( target ) {
		this._maybematerialize ( target, false, false );
	},

	/**
	 * Dispell spirits for descendants.
	 * @param {Element|gui.Spirit} target
	 */
	materializeSub : function ( target ) {
		this._maybematerialize ( target, true, false );
	},

	/**
	 * Dispell one spirit non-crawling.
	 * @param {Element|gui.Spirit} target
	 */
	materializeOne : function ( target ) {
		this._maybematerialize ( target, false, true );
	},

	/**
	 * Invoke ondetach for element spirit and descendants spirits.
	 * @param {Element|gui.Spirit} target
	 */
	detach : function ( target ) {
		this._maybedetach ( target );
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
		var sig = win.gui.$contextid;
		if ( elm.spirit ) {
			throw new Error ( "Cannot repossess element with spirit " + elm.spirit + " (exorcise first)" );
		}
		return ( elm.spirit = new Spirit ( elm, doc, win, sig ));
	},

	/**
	 * Disassociate DOM element from Spirit instance.
	 * @param {gui.Spirit} spirit
	 */
	exorcise : function  ( spirit ) {
		if ( !spirit.life.destructed ) {
			gui.Spirit.$destruct ( spirit ); // API user should cleanup here
			gui.Spirit.$dispose ( spirit ); // everything is destroyed here
		}
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

	/**
	 * Invoked by {gui.Spiritual} some milliseconds after 
	 * the spirits have been attached to the page DOM.
	 * @param {Array<gui.Spirit>} spirits
	 */
	afterattach : function ( spirits ) {
		spirits.forEach ( function ( spirit ) {
			gui.Spirit.$async ( spirit );
		});
		this._visibility ( spirits );
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
		return node && !this._suspended && 
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
		if ( sum.documentspirit ) {
			sum.documentspirit.ondom ();
		}
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
	},

	/**
	 * Fires on window unload.
	 * @param {gui.EventSummary} sum
	 */
	_unload : function ( sum ) {
		if ( sum.documentspirit ) {
			sum.documentspirit.onunload ();
		}
		sum.window.gui.nameDestructAlreadyUsed ();
	},

	/**
	 * Step 1. Great name.
	 * @param {Document} doc
	 */
	_step1 : function ( doc ) {
		var win = doc.defaultView;
		var sig = win.gui.$contextid;
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
		var sig = win.gui.$contextid;
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
	 * Collect non-destructed spirits from element and descendants.
	 * @param {Node} node
	 * @param @optional {boolean} skip Skip start element
	 * @returns {Array<gui.Spirit>}
	 */
	_collect : function ( node, skip, id ) {
		var list = [];
		new gui.GuideCrawler ( id ).descend ( node, {
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
	 * Spiritualize node.
	 * @param {Node|gui.Spirit} node
	 * @param {boolean} skip Skip the element?
	 * @param {boolean} one Skip the subtree?
	 */
	_maybespiritualize : function ( node, skip, one ) {
		node = node instanceof gui.Spirit ? node.element : node;
		node = node.nodeType === Node.DOCUMENT_NODE ? node.documentElement : node;
		if ( this._handles ( node )) {
			this._spiritualize ( node, skip, one );
		}
	},

	/**
	 * Evaluate spiritis for element and subtree.
	 * 
	 * - Construct spirits in document order
	 * - Fire life cycle events except `ready` in document order
	 * - Fire `ready` in reverse document order (innermost first)
	 * @param {Element} element
	 * @param {boolean} skip Skip the element?
	 * @param {boolean} one Skip the subtree?
	 */
	_spiritualize : function ( element, skip, one ) {
		var attach = [];
		var readys = [];
		new gui.GuideCrawler ( gui.CRAWLER_SPIRITUALIZE ).descend ( element, {
			handleElement : function ( elm ) {
				if ( !skip || elm !== element ) {
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
				gui.Spirit.$configure ( spirit );
			}
			if ( !spirit.life.entered ) {
				gui.Spirit.$enter ( spirit );
			}
			gui.Spirit.$attach ( spirit );
			if ( !spirit.life.ready ) {
				readys.push ( spirit );
			}
		}, this );
		readys.reverse ().forEach ( function ( spirit ) {
			gui.Spirit.$ready ( spirit );
		});
	},

	/**
	 * Destruct spirits from element and subtree. Using a two-phased destruction sequence 
	 * to minimize the risk of plugins invoking already destructed plugins during destruct.
	 * @param {Node|gui.Spirit} node
	 * @param {boolean} skip Skip the element?
	 * @param {boolean} one Skip the subtree?
	 * @param {boolean} force
	 */
	_maybematerialize : function ( node, skip, one, force ) {
		node = node instanceof gui.Spirit ? node.element : node;
		node = node.nodeType === Node.DOCUMENT_NODE ? node.documentElement : node;
		if ( force || this._handles ( node )) {
			this._materialize ( node, skip, one );
		}
	},

	/**
	 * @TODO 'one' appears to be unsupported here???
	 * @param {Element} element
	 * @param {boolean} skip Skip the element?
	 * @param {boolean} one Skip the subtree?
	 */
	_materialize : function ( element, skip, one ) {
		this._collect ( element, skip, gui.CRAWLER_MATERIALIZE ).filter ( function ( spirit ) {
			if ( spirit.life.attached && !spirit.life.destructed ) {
				gui.Spirit.$destruct ( spirit );
				return true; // @TODO: handle 'one' arg!
			}
			return false;
		}).forEach ( function ( spirit ) {
			gui.Spirit.$dispose ( spirit );
		});
	},

	/**
	 * @param {Element|gui.Spirit} element
	 */
	_maybedetach : function ( element ) {
		element = element instanceof gui.Spirit ? element.element : element;
		if ( this._handles ( element )) {
			this._collect ( element, false, gui.CRAWLER_DETACH ).forEach ( function ( spirit ) {
				gui.Spirit.$detach ( spirit );
			});
		}
	},

	/**½
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
	 * Evaluate spirits visibility.
	 * @TODO: Test for this stuff.
	 * @param {Array<gui.Spirit>}
	 */
	_visibility : function ( spirits ) {
		gui.DOMPlugin.group ( spirits ).forEach ( function ( spirit ) {
			gui.VisibilityPlugin.$init ( spirit );
		}, this );
	},

	/**
	 * Isolate from list all spirits that aren't contained by others (top spirits).
	 * @param {Array<gui.Spirit>}
	 * @returns {Array<gui.Spirit>}
	 *
	_containerspirits : function ( spirits ) {
		var spirit, groups = [];
		function iscontainer ( target, others ) {
			var contains = Node.DOCUMENT_POSITION_CONTAINS + Node.DOCUMENT_POSITION_PRECEDING;
			return others.every ( function ( other ) {
				return target.dom.compare ( other ) !== contains;
			});
		}
		while (( spirit = spirits.pop ())) {
			if ( !spirits.length || iscontainer ( spirit, spirits )) {
				groups.push ( spirit );
			}
		}
		return groups;
	},
	*/
	
	/**
	 * Destruct all spirits in document. Spirit instances, unless locally loaded, 
	 * might be newed up in another context. Destruction will null all properties 
	 * so that the spirit might be garbage collected sooner, let's hope it works. 
	 * (not using _maybematerialize because that might have been overloaded somehow)
	 * @param {Window} win
	 * @param {Document} doc
	 *
	_cleanup : function ( win, doc ) {
		var spirits = this._collect ( doc, false );
		spirits.forEach ( function ( spirit ) {
			gui.Spirit.$destruct ( spirit );
			//spirit.ondestruct (); // API user should cleanup here	
		});
		spirits.forEach ( function ( spirit ) {
			gui.Spirit.$dispose ( spirit );
			//spirit.$ondestruct (); // everything is destroyed here		
		});
		win.gui.nameDestructAlreadyUsed ();
	}
	*/

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
