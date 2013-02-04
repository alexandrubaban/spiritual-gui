/*
 * Spiritual GUI 0.0.4
 * (c) 2013 Wunderbyte
 * Spiritual is freely distributable under the MIT license.
 */



var gui = { // namespace object

	/**
	 * Spiritual version. Hardcoded for now.
	 * TODO: Deprecate or generate buildtime.
	 * @type {String}
	 */
	version : "0.0.4",

	/**
	 * Spirit management mode. 
	 * native: Overloading native DOM methods and setters.
	 * jquery: Overloading JQuery DOM manipulation methods.
	 * optimize: use native if supported, fallback on jquery.
	 */
	MODE_NATIVE : "native",
	MODE_JQUERY : "jquery",
	MODE_OPTIMIZE : "optimize",

	/*
	 * Global broadcasts
	 * TODO : harmonize some naming with action types
	 */
	BROADCAST_KICKSTART : "gui-broadcast-kickstart",
	BROADCAST_DOMCONTENT : "gui-broadcast-document-domcontentloaded",
	BROADCAST_ONLOAD : "gui-broadcast-window-onload",
	BROADCAST_UNLOAD : "gui-broadcast-window-unload",
	BROADCAST_WILL_SPIRITUALIZE : "gui-broadcast-will-spiritualize",
	BROADCAST_DID_SPIRITUALIZE : "gui-broadcast-did-spiritualize",
	BROADCAST_MOUSECLICK  : "gui-broadcast-mouseevent-click",
	BROADCAST_MOUSEMOVE : "gui-broadcast-mouseevent-mousemove",
	BROADCAST_MOUSEDOWN : "gui-broadcast-mouseevent-mousedown",
	BROADCAST_MOUSEUP : "gui-broadcast-mouseevent-mouseup",
	BROADCAST_SCROLL : "gui-broadcast-window-scroll",
	BROADCAST_RESIZE : "gui-broadcast-window-resize",
	BROADCAST_RESIZE_END : "gui-broadcast-window-resize-end",
	BROADCAST_POPSTATE : "gui-broadcast-window-popstate",
	BROADCAST_HASHCHANGE : "gui-broadcast-window-hashchange",
	BROADCAST_LOADING_CHANNELS : "gui-broadcast-loading-channels",
	BROADCAST_CHANNELS_LOADED : "gui-broadcast-channels-loaded",
	BROADCAST_TWEEN : "gui-broadcast-tween",

	/*
	 * Plugin broadcast types
	 * TODO : assign these via module system at some point
	 */
	BROADCAST_ORIENTATIONCHANGE : "gui-broadcast-orientationchange",
	BROADCAST_TOUCHSTART : "gui-broadcast-touchstart",
	BROADCAST_TOUCHEND : "gui-broadcast-touchend",
	BROADCAST_TOUCHCANCEL : "gui-broadcast-touchcancel",
	BROADCAST_TOUCHLEAVE : "gui-broadcast-touchleave",
	BROADCAST_TOUCHMOVE : "gui-broadcast-touchmove",
	BROADCAST_DRAG_START : "gui-broadcast-drag-start",
	BROADCAST_DRAG_END : "gui-broadcast-drag-end",
	BROADCAST_DRAG_DROP : "gui-broadcast-drag-drop",
	BROADCAST_COMMAND : "gui-broadcast-command",
	BROADCAST_OUTPUT : "gui-broadcast-output",
	BROADCAST_INPUT : "gui-broadcast-input",
	BROADCAST_DATA_PUB : "gui-broadcast-data-pub",
	BROADCAST_DATA_SUB : "gui-broadcast-data-sub",
	BROADCAST_SCRIPT_INVOKE : "gui-broadcast-spiritscript-invoke",
	BROADCAST_ATTENTION_ON : "gui-broadcast-attention-on",
	BROADCAST_ATTENTION_OFF : "gui-broadcast-attention-off",
	BROADCAST_ATTENTION_GO : "gui-broadcast-attention-go",

	/*
	 * Global actions
	 */
	ACTION_DOCUMENT_CONSTRUCT : "gui-action-document-construct",
	ACTION_DOCUMENT_READY : "gui-action-document-ready",
	ACTION_DOCUMENT_ONLOAD : "gui-action-document-onload",
	ACTION_DOCUMENT_UNLOAD : "gui-action-document-unload",
	ACTION_DOCUMENT_FIT : "gui-action-document-fit",
	ACTION_DOCUMENT_DONE : "gui-action-document-done",

	/*
	 * Local actions.
	 */
	ACTION_WINDOW_LOADING : "gui-action-window-loading",
	ACTION_WINDOW_LOADED : "gui-action-window-loaded",

	/*
	 * Questionable types (future)
	 */
	ACTION_DRAG_START : "gui-action-drag-start",
	ACTION_COMMAND : "gui-action-command",
	
	/*
	 * Crawler types
	 */
	CRAWLER_ATTACH : "gui-crawler-attach",
	CRAWLER_DETACH : "gui-crawler-detach",
	CRAWLER_DISPOSE : "gui-crawler-dispose",
	CRAWLER_ACTION : "gui-crawler-action",
	CRAWLER_VISIBLE : "gui-crawler-visible",
	CRAWLER_INVISIBLE : "gui-crawler-invisible",

	
	//CRAWLER_APPEARANCE : "gui-crawler-appearance",

	/*
	 * Tick types (timed events)
	 */
	TICK_DESTRUCT_DETACHED : "gui-tick-destruct-detached",
	TICK_SCRIPT_UPDATE : "gui-tick-spiritscript-update", // TODO: move to EDB
	TICK_COLLECT_INPUT : "gui-tick-collect-input",
	TICK_SPIRIT_NULL : "gui-tick-spirit-null",
	TICK_FIT : "gui-tick-fit",

	/**
	 * CSS classnames. Underscore indicates 
	 * that the classname are managed by JS.
	 */
	CLASS_INVISIBLE : "_gui-invisible",
	CLASS_HIDDEN : "_gui-hidden",

	/*
	 * Device orientation.
	 * TODO : Get this out of here
	 * TODO: gui.Observerice or something
	 */
	orientation : 0,
	ORIENTATION_PORTRAIT : 0,
	ORIENTATION_LANDSCAPE : 1
};


/**
 * Upgrading client features.
 */
gui.SpiritualAid = {
	
	/**
	 * Patch potential missing features from ES5 and selected features from ES6.
	 * @param {Window} win
	 * @param @optional {boolean} worker
	 */
	polyfill : function ( win, worker ) {
		
		"use strict";
		
		this._strings	( win );
		this._arrays	( win );
		this._functions	( win );
		this._globals	( win );
		this._extras	( win );
		
		if ( !worker ) {
			//this._element ( win );
			this._effects ( win );
		}
	},
	
	
	// PRIVATES ...............................................................
		
	/**
	 * @param {object} what
	 * @param {object} whit
	 */
	_extend : function ( what, whit ) {
		
		Object.keys ( whit ).forEach ( function ( key ) {
			var def = whit [ key ];				
			if ( what [ key ] === undefined ) {
				if ( def.get && def.set ) {
					// TODO: look at element.dataset polyfill (iOS?)
				} else {
					what [ key ] = def;
				}
			}
		});
	},
	
	/**
	 * Patching String.prototype
	 * @param {Window} win
	 */
	_strings : function ( win ) {
		
		this._extend ( win.String.prototype, {
			
			trim : function () {
				return this.replace ( /^\s*/, "" ).replace ( /\s*$/, "" );
			},
			repeat : function ( n ) {
				return new win.Array ( n + 1 ).join ( this );
			},
			startsWith : function ( sub ) {
				return this.indexOf ( sub ) === 0;
			},
			endsWith : function ( sub ) {
				sub = String ( sub );
				var i = this.lastIndexOf ( sub );
				return i >= 0 && i === this.length - sub.length;
			},
			contains : function ( sub ) {
				return this.indexOf ( sub ) >-1;
			},
			toArray : function() {
				return this.split ( "" );
			}
		});
	},
	
	/**
	 * Patching Array versus Array.prototype
	 * @param {Window} win
	 */
	_arrays : function ( win ) {
		
		this._extend ( win.Array.prototype, { // non-standard, see http://ejohn.org/blog/javascript-array-remove/#comment-296114
			remove : function remove ( from, to ) {
				this.splice ( from, !to || 1 + to - from + ( ! ( to < 0 ^ from >= 0 ) && ( to < 0 || -1 ) * this.length ));
				return this.length;
			}
		});
		
		this._extend ( win.Array, {
			every : function every ( array, fun, thisp ) {
				var res = true, len = array.length >>> 0;
				for ( var i = 0; i < len; i++ ) {
					if ( array [ i ] !== undefined ) {
						if ( !fun.call ( thisp, array [ i ], i, array )) {
							res = false;
							break;
						}
					}
				}
				return res;
			},
			forEach : function forEach ( array, fun, thisp ) {
				var len = array.length >>> 0;
				for ( var i = 0; i < len; i++ ) {
					if ( array [ i ] !== undefined ) {
						fun.call ( thisp, array [ i ], i, array );
					}
				}
			},
			map : function map ( array, fun, thisp ) {
				var m = [], len = array.length >>> 0;
				for ( var i = 0; i < len; i++ ) {
					if ( array [ i ] !== undefined ) {
						m.push ( fun.call ( thisp, array [ i ], i, array ));
					}
				}
				return m;
			},
			isArray : function isArray ( o ) {
				return win.Object.prototype.toString.call ( o ) === "[object Array]";
			},
			concat : function ( a1, a2 ) {
				function map ( e ) { return e; }
				return this.map ( a1, map ).concat ( this.map ( a2, map ));				
			}
		});
	},
	
	/**
	 * Patching Function.prototype
	 * @param {Window} win
	 */
	_functions : function ( win ) {
		
		this._extend ( win.Function.prototype, {
		
			bind : function bind ( oThis ) {
				if ( typeof this !== "function" ) {
					throw new win.TypeError ( "Function bind not callable" );
				}
				var fSlice = win.Array.prototype.slice,
					aArgs = fSlice.call ( arguments, 1 ),
					fToBind = this,
					Fnop = function () {},
					fBound = function () {
						return fToBind.apply(
							this instanceof Fnop ? this : oThis || win,
							aArgs.concat ( fSlice.call ( arguments ))
						);
					};
					
				Fnop.prototype = this.prototype;
				fBound.prototype = new Fnop();
					return fBound;
			}
		});
	},
	
	/**
	 * Global objects Map and Set patched for *performance*, should only be used with primitive keys. 
	 * Need more? Include this before Spiritual loads: http://github.com/paulmillr/es6-shim
	 * @param {Window} win
	 */
	_globals : function ( win ) {
		
		this._extend ( win, { // TODO: investigate support for Object.getPrototypeOf ( win )
			
			console : {
				log : function () {},
				debug : function () {},
				warn : function () {},
				error : function () {}
			},
			
			Map : ( function () {			
				function Map () {
					this._map = Object.create ( null );
				}
				Map.prototype = {
					isNative : false,
					get : function get ( key ) {
						return this._map [ key ];
					},
					set : function set ( key, val ) {
						this._map [ key ] = val;
					},
					has : function has ( key ) {
						return this._map [ key ] !== undefined;
					},
					"delete" : function get ( key ) {
						delete this._map [ key ];
					},
					size : function () {
						return Object.keys ( this._map ).length;
					}
				};
				return Map;
			})(),
			
			Set : ( function () {
				
				function Set () {
					this._map = Object.create ( null );
				}
				Set.prototype = {
					isNative : false,
					add : function set ( key ) {
						this._map [ key ] = true;
					},
					has : function has ( key ) {
						return this._map [ key ] === true;
					},
					"delete" : function get ( key ) {
						delete this._map [ key ];
					},
					size : function () {
						return Object.keys ( this._map ).length;
					}
				};
				return Set;
			})(),
			
			WeakMap : ( function () { // TODO: clean this up
				
				function WeakMap () {

						var keys = [], values = [];

						function del(key) {
							if (has(key)) {
								keys.splice(i, 1);
								values.splice(i, 1);
							}
							return -1 < i;
						}

						function get(key, d3fault) {
							return has(key) ? values[i] : d3fault;
						}

						function has(key) {
							i = indexOf.call(keys, key);
							return -1 < i;
						}

						function set(key, value) {
							if ( has(key)) {
								values[i] = value;
							} else {
								values[keys.push(key) - 1] = value;
							}
						}

						return create(WeakMapPrototype, {
							isNative : {value : false},
							"delete": {value: del},
							del: {value: del},
							get: {value: get},
							has: {value: has},
							set: {value: set}
						});

					}

					function WeakMapInstance () {}

					var Object = win.Object, WeakMapPrototype = WeakMap.prototype,
						create = Object.create, indexOf = [].indexOf, i;

					// used to follow FF behavior where WeakMap.prototype is a WeakMap itself
					WeakMap.prototype = WeakMapInstance.prototype = WeakMapPrototype = new WeakMap();
					return WeakMap;
				
			})()

		});
	},
	
	/*
	_element : function ( win ) {
		
		function camelcase ( string ) {
			return string.replace ( /-([a-z])/ig, function ( all, letter ) {
				return letter.toUpperCase();
			});
		}
		

		this._extend ( win.Element.prototype, {
			dataset : {
				get : function () {
					var set = Object.create ( null );
					Array.forEach ( this.attributes, function ( att ) {
						if ( att.name.startsWith ( "data-" )) {
							// alert ( att );
						}
					});
					return set;
				},
				set : function ( val ) {
					
				}
			}
		});
	},
	*/
	
	/**
	 * Patching cheap DHTML effects with super-simplistic polyfills.
	 * @param [Window} win
	 */
	_effects : function ( win ) {
		
		this._extend ( win, {
			
			requestAnimationFrame : ( function () {
				var func = 
					win.requestAnimationFrame	|| 
					win.webkitRequestAnimationFrame || 
					win.mozRequestAnimationFrame || 
					win.oRequestAnimationFrame || 
					win.msRequestAnimationFrame	|| 
					(function() {
						var lastTime = 0;
						return function(callback, element) {
							var currTime = new Date().getTime();
							var timeToCall = Math.max(0, 16 - (currTime - lastTime));
							var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
								timeToCall);
							lastTime = currTime + timeToCall;
							return id;
						};
					}());
					return func;
			})(),

			/*
			 * TODO: cancelAnimationFrame!
			 *
			if (!window.cancelAnimationFrame)
				window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
			*/
			
			setImmediate : ( function () {
				var list = [], handle = 1;
				var name = "spiritual:emulated:setimmediate";
				win.addEventListener ( "message", function ( e ) {
					if ( e.data === name && list.length ) {
						list.shift ().apply ( win );
						e.stopPropagation ();
					}
				}, false );
				return function emulated ( func ) {
					list.push ( func ); 
					win.postMessage ( name, "*" );
					return handle ++;
				};
			})()
		});
	},
	
	_extras : function ( win ) {
		
		// alias delete for Map
		this._extend ( win.Map.prototype, {
			del : function del ( key ) {
				return this [ "delete" ]( key );
			}
		});
		
		// alias delete for Set
		this._extend ( win.Set.prototype, {
			del : function del ( key ) {
				return this [ "delete" ]( key );
			}
		});
		
		// console.debug bad in ie
		this._extend ( win.console, {
			debug : win.console.log
		});
		
		// ie doesn't have this
		this._extend ( XMLHttpRequest.prototype, {
			overrideMimeType : function () {}
		});
		
		// Safari on iPad has no constants to reflect request state
		this._extend ( win.XMLHttpRequest, {
			UNSENT : 0,
			OPENED : 1,
			HEADERS_RECEIVED : 2,
			LOADING : 3,
			DONE : 4
		});
	}
};


/**
 * An instance of gui.Spiritual may be referenced as "gui" inside all windows.
 * @param {Window} win Potentially a web worker global scope.
 */
gui.Spiritual = function Spiritual ( win ) {
	
	this._construct ( win );
};

gui.Spiritual.prototype = {
	
	/**
	 * The constructor gui.Spiritual does not exist after first instance gets declared, 
	 * but we may keep something newable allocated by referencing the constructor here.  
	 * @type {function}
	 */
	constructor: gui.Spiritual,
	
	/**
	 * Uniquely identifies this instance of gui.Spiritual. All 
	 * local instances of gui.Spirit gets stamped with a copy.
	 * TODO: rename "guikey"?
	 * @type {String}
	 */
	signature : null,

	/**
	 * Usually the window object. Occasionally a web worker scope.
	 * @type {Window}
	 */
	context : null,

	/**
	 * Spirit management mode. Mathces native|jquery|optimize. 
	 * Note that this will deprecate as soon as iOS supports 
	 * a mechanism for grabbing the native innerHTML setter.
	 * @type {String}
	 */
	mode : "optimize", // recommended setting for iOS support

	/**
	 * Development mode?
	 * @type {boolean}
	 */
	debug : false,
		
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		
		return "[ns gui]";
	},

	/**
	 * Channel spirits on startup.
	 * @see {gui.Guide}
	 */
	go : function () {
		
		this._ready = true;
		gui.World.descend ( this.context );
		gui.Tick.add ( gui.TICK_DESTRUCT_DETACHED, this, this.signature );
		if ( this._configs !== null ) {
			this._configs.forEach ( function ( config ) {
				this.channel ( config.select, config.klass );
			}, this );
		}
	},
	
	/**
	 * Get spirit for argument (argument expected to be a spiritkey for now).
	 * TODO: fuzzy argument resolver to accept DOM elements and ID strings.
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
					/* lookup spirit by element id */
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
	 */
	module : function ( name, module ) {
		
		if ( !gui.Type.isString ( name )) {
			throw new TypeError ( "Module name is now required :)" );
		}

		var base = this.context.gui.Spirit; // modules extend gui.Spirit, use init() to extend subclass
		
		// addins (TODO: "decorators")
		if ( gui.Type.isObject ( module.addins )) {
			gui.Object.each ( module.addins, function ( name, value ) {
				base.addin ( name, value );
			}, this );
		}
		
		// plugins
		if ( gui.Type.isObject ( module.plugins )) {
			gui.Object.each ( module.plugins, function ( prefix, plugin ) {
				if ( gui.Type.isDefined ( plugin )) {
					base.plugin ( prefix, plugin );
				} else {
					console.error ( "Undefined plugin for prefix: " + prefix );
				}
			}, this );
		}
		
		// channels
		if ( gui.Type.isArray ( module.channels )) {
			module.channels.forEach ( function ( channel ) {
				var query = channel [ 0 ];
				var klass = channel [ 1 ];
				this.channel ( query, klass );
			}, this );
		}

		this._modulelife ( module, this.context );
		this._modules [ name ] = module;
	},

	/**
	 * Has module? In a multi frame setup, modules may be 
	 * loaded only for the local instance of gui.Spiritual.
	 * @param {String} name
	 * @returns {boolean}
	 */
	hasModule : function ( name ) {

		return gui.Type.isDefined ( this._modules [ name ]);
	},
	
	/**
	 * Channel spirits to CSS selectors in this window 
	 * and windows that import us via the portal method.
	 * @param {String} select CSS selector
	 * @param {object} klass Spirit constructor (as object or string)
	 */
	channel : function ( select, klass ) {
		
		var spirit = null;
		
		if ( this._ready ) {
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
	 * Transfer Spirit world to a parallel window in three easy steps.
	 * 1) Extend Element.prototype in window
	 * 2) Declare local ui object in window
	 * 3) Declare spirit world objects, pointing back to this window
	 * @param {Window} sub An external window.
	 */
	portal : function ( sub ) {
		
		if ( sub !== this.context ) {
			
			/*
			 * Create remote gui object then 
			 * portal gui namespaces and members.
			 */
			var subgui = sub.gui = new ( this.constructor )( sub );
			//var indexes = this._index ( this, subgui, this._channels ); // "gui" now via namespace()
			var indexes = [];

			/*
			 * Portal custom namespaces and members.
			 */
			subgui._spaces = this._spaces.slice ();
			this._spaces.forEach ( function ( ns ) {

				// declare (nested) namespace in external context
				// TODO: gui.Object.assert utility method for this
				var external = sub, internal = this.context;
				ns.split ( "." ).forEach ( function ( part ) {
				  if ( !gui.Type.isDefined ( external [ part ])) {
					 external [ part ] = internal [ part ];
				  }
				  external = external [ part ];
				  internal = internal [ part ];
			  });

			  // channel spirits from this namespace 
			  // preserving local channeling order
				this._index ( 
					internal, 
					external, 
					this._channels 
				).forEach ( function ( i ){
					indexes.push ( i );	
				});
			}, this );

			/*
			this._modules.forEach ( function ( module ) {
				this._modulelife ( module, subgui.context );
				subgui._modules.push ( module );
			}, this );
			*/
		
			/*
			 * Portal modules to initialize the sub context.
			 * TODO: portal only the relevant init method?
			 */
			gui.Object.each ( this._modules, function ( name, module ) {
				this._modulelife ( module, subgui.context );
				subgui._modules [ name ] = module;
			}, this );
			
			/*
			 * Sort channels
			 */
			indexes.sort ( function ( a, b ) {
				return a - b; 
			 }).forEach ( function ( i ) {
				 subgui._channels.push ( this._channels [ i ]); 
			}, this );
			
			/*
			 * Here we go
			 */
			gui.Guide.observe ( sub );
		}
	},

	/**
	 * Kickstart Spiritual manuallay. Use this if you lazyload (module-require) 
	 * Spiritual after the document.DOMContentLoaded and window.onload events fire.
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
	 */
	namespace : function ( ns ) {
		
		if ( gui.Type.isString ( ns )) { // TODO: must it be a string?
			this._spaces.push ( ns );
		} else {
			throw new TypeError ( "Expected a string: gui.namespace" );
		}
	},

	/**
	 * List spiritual namespaces (returns a copy).
	 * @return {Array<String>}
	 */
	namespaces : function () {

		return this._spaces.slice ();
	},
	
	/**
	 * Get Spirit implementation for DOM element.
	 * Spirit may be local to containing window.
	 * 1) Test for element "gui" attribute
	 * 2) Test if element matches selectors 
	 * @param {Element} element
	 * @returns {function} Spirit constructor
	 */
	evaluate : function ( element ) {
		
		var res = null;
		if ( element.nodeType === Node.ELEMENT_NODE ) {
			
			var doc = element.ownerDocument;
			var win = doc.defaultView;
			var att = element.getAttribute ( "gui" ); // TODO: "data-gui"

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
					if ( gui.SpiritCSS.matches ( element, select )) {
						res = spirit;
					}
					return res === null;
				}, this );
			}
		}
		return res;
	},
	
	/**
	 * Broadcast event details globally. Use this if you stopPropagate   
	 * an event for personal reasons and don't want to keep it a secret.
	 * @param {String} message gui.BROADCAST_MOUSECLICK or similar
	 * @param @optional {object} arg This could well be a MouseEvent
	 */
	broadcast : function ( message, arg ) {
		
		if ( gui.Type.of ( arg ).endsWith ( "event" )) {
			arg = new gui.EventSummary ( arg );
		}
		gui.Broadcast.dispatchGlobal ( this, message, arg );
	},
	
	/**
	 * Log channels to console.
	 * TODO: deprecate this (create gui.Developer).
	 */
	debugchannels : function () {
		
		var out = this._document.location.toString ();
		this._channels.forEach ( function ( channel ) {
			out += "\n" + channel [ 0 ] + " : " + channel [ 1 ];
		});
		console.debug ( out + "\n\n" );
	},
	
	/**
	 * Terminate spirit management.
	 * @param {gui.Spirit} spirit
	 */
	destruct : function ( spirit ) {

		var all = this._spirits;
		var key = spirit.spiritkey;
		delete all.inside [ key ];
		delete all.outside [ key ];
	},
	
	
	// INTERNALS .....................................................................................................
	
	/**
	 * Register spirit in document (framework internal method).
	 * TODO: move? rename? 
	 * @param {gui.Spirit} spirit
	 */
	inside : function ( spirit ) {
		
		var all = this._spirits;
		var key = spirit.spiritkey;
		if ( !all.inside [ key ]) {
			if ( all.outside [ key ]) {
				delete all.outside [ key ];
			}
			all.inside [ key ] = spirit;
		}
	},
	
	/**
	 * Register spirit outside document (scheduled for destruction).
	 * TODO: move? rename?
	 * @param {gui.Spirit} spirit
	 */
	outside : function ( spirit ) {
		
		var all = this._spirits;
		var key = spirit.spiritkey;
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

		// TODO: do we want to loose track of potential non-exited spirit?
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
	 * Invoked by the gui.Guide on window.unload (synchronized as final event).
	 * TODO: naming clash with method "destruct"
	 * TODO: Think of more stuff to cleanup here...
	 */
	nameDestructAlreadyUsed : function () {

		gui.Tick.remove ( gui.TICK_DESTRUCT_DETACHED, this, this.signature );

		/*
		 * TODO: figure out of any of this manual garbage dumping works.
		 */
		delete this._spiritualaid;
		delete this.context;
		delete this._document;
		delete this._channels;
		delete this._inlines;
		delete this._spaces;
		delete this._modules;
		delete this._spirits;
	},
	
	
	// PRIVATES ......................................................................................................
	
	/**
	 * Document context.
	 * @type {Document}
	 */
	_document : null,
	
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
	 * Hm...
	 */
	_spaces : null,
	
	/**
	 * @type {boolean}
	 */
	_ready : false,
	
	/**
	 * @type {Array<object>}
	 */
	_configs : null,

	/**
	 * @type {Map<String,object>}
	 */
	_modules : null,
	
	/**
	 * Tracking spirits by spiritkey (detached spirits are subject to destruction).
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
	_construct : function ( win ) {
		
		// patching features
		this._spiritualaid.polyfill ( win );
		
		// generate signature
		this.signature = "sig" + String ( Math.random ()).split ( "." )[ 1 ];
		
		// basic setup
		this.context = win;
		this._document = win.document;
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

		function index ( def ) { // isolated from loop to pass JsHint...
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
	 * @param {object} module
	 * @param {Window} context
	 */
	_modulelife : function ( module, context ) {

		// invoke init now?
		if ( gui.Type.isFunction ( module.init )) {
			module.init ( context );
		}

		// invoke ready before document is spiritualized?
		if ( gui.Type.isFunction ( module.ready )) {
			gui.Broadcast.addGlobal (
				gui.BROADCAST_WILL_SPIRITUALIZE, {
					onbroadcast : function ( b ) {
						if ( b.data === context.gui.signature ) {
							module.ready ( context );
							gui.Broadcast.removeGlobal ( 
								gui.BROADCAST_WILL_SPIRITUALIZE, 
								this
							);
						}
					}
				}
			);
		}
	}
};

/*
 * TODO: comment required
 */
Object.keys ( gui ).forEach ( function ( key ) {
	gui.Spiritual.prototype [ key ] = gui [ key ];
});

/*
 * TODO: comment even more required
 */
gui = new gui.Spiritual ( window );


/**
 * Function argument type checking studio.
 */
gui.Arguments = {

	/**
	 * Use this to check the runtime signature of a function call: 
	 * gui.Arguments.match ( arguments, "string", "string", "number" );
	 * Note that some args may be omitted and still pass the test, 
	 * eg. the example would pass if only a single string was given. 
	 * @param {object} args Array-like 
	 * @returns {boolean}
	 */
	match : function () {
		
		/*
		 * Note that gui.Type.of may return different xbrowser results 
		 * for certain exotic objects. Use the pipe char to compensate: 
		 * gui.Arguments.match ( arguments, "xxx|yyy|zzz" );
		 */
		var list = Array.prototype.slice.call ( arguments );
		var args = list.shift ();

		if ( gui.Type.isArguments ( args )) {
			return list.every ( function ( test, index ) {
				return this._matches ( test, args [ index ], index );
			}, this );
		} else {
			throw new Error ( "Expected an Arguments object" );
		}
	},
	
	/**
	 * Sstrict type-checking facility to throw exceptions on failure. 
	 * TODO: at some point, return true unless in developement mode.
	 * @param {object} args Array-like 
	 * @returns {boolean}
	 */
	validate : function () {

		// return true; // TODO!

		this._validate = true;
		var is = this.match.apply ( this, arguments );
		this._validate = false;
		return is;
	},


	// PRIVATE ...........................................................
	
	/**
	 * Validating mode?
	 * @type {boolean}
	 */
	_validate : false,

	/*
	 * Extract expected type of (optional) argument.
	 * @param {string} xpect
	 * @param {boolean} optional
	 */
	_xtract : function ( xpect, optional ) {

		return optional ? xpect.slice ( 1, -1 ) : xpect;
	},

	/**
	 * Check if argument matches expected type.
	 * @param {string} xpect
	 * @param {object} arg
	 * @param {number} index
	 * @returns {boolean}
	 */
	_matches : function ( xpect, arg, index ) {

		var needs = !xpect.startsWith ( "(" );
		var split = this._xtract ( xpect, !needs ).split ( "|" );
		var input = gui.Type.of ( arg );
		var match = ( xpect === "*" 
			|| ( !needs && input === "undefined" ) 
			|| ( !needs && split.indexOf ( "*" ) >-1 ) 
			|| split.indexOf ( input ) >-1 );
		if ( !match && this._validate ) {
			this._error ( index, xpect, input );
		}
		return match;
	},

	/**
	 * Report validation error for argument at index.
	 * @param {number} index
	 * @param {string} xpect
	 * @param {string} input
	 */
	_error : function ( index, xpect, input ) {
		
		console.error ( 
			"Argument " + index + ": " + 
			"Expected " + xpect + 
			", got " + input
		);
	}
};


/**
 * The term "exemplar" has been proposed to avoid the term "class" which is misleading 
 * for prototypal inheritance. Nevertheless, this fellow allow us to create a newable 
 * constructor that can be easily "subclassed". Instances of this constructor may use a 
 * special "_super" method to overload members of the "superclass" prototype. 
 * TODO: Evaluate static stuff first so that proto can declare vals as static props 
 * TODO: Support lazy declaration via "namespace" objects
 */
gui.Exemplar = {
	
	/**
	 * Create magic constructor. Use static method "extend" on constructor to subclass further.
	 * @param {object} proto Base prototype
	 * @param {object} expando Prototype expandos
	 * @param {object} recurring Constructor and subconstructor expandos
	 * @param {object} statics Constructor expandos
	 * @returns {function}
	 */
	create : function () {
		
		var args = this._breakdown_base ( arguments );
		
		var name = args.name || "Anonymous";
		var C = this._create ( args.proto, name );
		this._name ( C, name );
		
		gui.Object.extend ( C.prototype, args.expando );
		gui.Object.extend ( C, args.statics );
		
		C.__recurring__ = Object.create ( null ); // tracking recurring static members
		C.__extenders__ = []; // tracking subclasses of this class
		
		if ( args.recurring ) {
			gui.Object.each ( args.recurring, function ( key, val ) {
				C [ key ] = C.__recurring__ [ key ] = val;
			});
		}
		
		return C;
	},
	
	/**
	 * We want to make the string (naming) argument optional, but we still want to keep is as 
	 * first argument; so the other arguments must be identified by whether or not it's present. 
	 * @param {Arguments} args
	 * @returns {object}
	 */
	breakdown : function ( args ) {
		
		var named = gui.Type.isString ( args [ 0 ]);
		
		return {
			name : named ? args [ 0 ] : null,			
			expando : args [ named ? 1 : 0 ] || Object.create ( null ),
			recurring : args [ named ? 2 : 1 ] || Object.create ( null ),
			statics : args [ named ? 3 : 2 ] || Object.create ( null )
		};
	},
	
	/**
	 * Create subclass constructor.
	 * @param {object} proto Base prototype
	 * @param {object} expando Prototype expandos
	 * @param {object} recurring Constructor and subconstructor expandos
	 * @param {object} statics Constructor expandos
	 * @returns {function} Constructor
	 */
	extend : function () { // expando, recurring, statics 
		
		var args = gui.Exemplar.breakdown ( arguments );		
		this.__super__ = this.__super__ || new gui.Super ( this ); // support _super() in subclass
		return gui.Exemplar._extend ( this, args.expando, args.recurring, args.statics, args.name );
	},
	
	// UTILITIES ....................................................
	
	/**
	 * Apply action to immediate subclasses of given class.
	 * @param {function} C constructor
	 * @param {function} action
	 * @param @optional {object} thisp
	 */
	children : function ( C, action, thisp ) {
		
		C.__extenders__.forEach ( function ( sub ) {
			action.call ( thisp, sub );
		}, thisp );
	},
	
	/**
	 * Apply action recursively to all derived subclasses of given class.
	 * @param {function} C constructor
	 * @param {function} action
	 * @param @optional {object} thisp 
	 */
	descendants : function ( C, action, thisp ) {
		
		C.__extenders__.forEach ( function ( sub ) {
			action.call ( thisp, sub );
			gui.Exemplar.descendants ( sub, action, thisp );
		}, thisp );
	},
	
	/**
	 * Apply action recursively to base class and all derived subclasses.
	 * @param {function} C constructor
	 * @param {function} action
	 * @param @optional {object} thisp
	 */
	family : function ( C, action, thisp ) {
		
		action.call ( thisp, C );
		this.descendants ( C, action, thisp );
	},
	
	/**
	 * Assign method or property to prototype, checking for naming collision.
	 * TODO: http://www.nczonline.net/blog/2012/12/11/are-your-mixins-ecmascript-5-compatible
	 * @param {String} name
	 * @param {object} value
	 * @param @optional {boolean} override Disable collision detection
	 */
	addin : function ( name, value, override ) {
				
		if ( this.prototype [ name ] === undefined || override ) {
			this.prototype [ name ] = value;
			gui.Exemplar.family ( this, function ( C ) {
				var s = C.__super__; 
				if ( s !== null ) {
					gui.Super.stubOne ( s, C.prototype, name );
				}
			});
		} else {
			console.error ( "Addin naming collision in " + this + ": " + name );
		}
	},
	
	// PRIVATES .....................................................
	
	/**
	 * Breakdown arguments for base exemplar only (has one extra argument).
	 * @see {gui.Exemplar#breakdown}
	 * @param {Arguments} args
	 * @returns {object}
	 */
	_breakdown_base : function ( args ) {
		
		var named = gui.Type.isString ( args [ 0 ]);
		
		return {
			name : named ? args [ 0 ] : null,
			proto	: args [ named ? 1 : 0 ] || {},
			expando : args [ named ? 2 : 1 ] || {},
			recurring : args [ named ? 3 : 2 ] || {},
			statics : args [ named ? 4 : 3 ] || {}
		};
	},
	
	/**
	 * Create subclass constructor.
	 * @param {object} constructor Super constructor
	 * @param {object} expando Prototype expandos
	 * @param {object} recurring Constructor and subconstructor expandos
	 * @param {object} statics Constructor expandos
	 * @param {String} generated display name (for development)
	 * @returns {function} Constructor
	 */
	_extend : function ( constructor, expando, recurring, statics, name ) {
		
		name = name || "Anonymous";
		var C = this._create ( constructor.prototype, name );
		this._name ( C, name );
		
		// extenders
		constructor.__extenders__.push ( C );
		C.__extenders__ = [];

		// static methods
		gui.Object.extend ( C, statics );

		// recurring statics
		C.__recurring__ = gui.Object.copy ( constructor.__recurring__ );
		gui.Object.extend ( C.__recurring__, recurring );
		gui.Object.each ( C.__recurring__, function ( key, val ) {
			C [ key ] = val;
		});

		// super pseudokeyword
		gui.Super.stamp ( constructor, C, expando );

		return C;
	},
	
	/**
	 * TODO: comments here!
	 * @param {object} proto Prototype of superconstructor
	 * @param {String} name Constructor name (for debug).
	 * @returns {function}
	 */
	_create : function ( proto, name ) {

		var C = this._constructor ( name );
		C.prototype = Object.create ( proto );
		C.prototype.constructor = C;
		C.__super__ = null;
		[ "extend", "addin" ].forEach ( function ( method ) {
			C [ method ] = this [ method ];
		}, this );
		return C;
	},

	/**
	 * Create named constructor.
	 * @param {String} name
	 * @returns {function} constructor
	 */
	_constructor : function ( name ) {

		if ( name.contains ( "." )) {
			var index = name.lastIndexOf ( "." );
			name = name.substring ( index + 1 );
		}

		var Invokable = Function; // TODO: perhaps scope this to a context?
		var named = new Invokable (
			"return function " + name + " () {" +
				"var con = this.__construct__ || this.onconstruct;" +
				"if ( gui.Type.isFunction ( con )) {" +
					"con.apply ( this, arguments );" +
				"}" +
			"}"
		);

		return named ();
	},
	
	/**
	 * Name constructor and instance.
	 * @param {function} C
	 * @param {String} name
	 */
	_name : function ( C, name ) {
		
		this._nameIt ( C, "function", name );
		this._nameIt ( C.prototype, "object", name );
	},
	
	/**
	 * Name constructor or instance.
	 * TODO: does it work ?????????????????????????????????
	 * @param {object} what
	 * @param {String} type
	 * @param {String} name
	 */
	_nameIt : function ( what, type, name ) {
		
		if ( !what.hasOwnProperty ( "toString" )) {
			what.toString = function toString () {
				return "[" + type + " " + name + "]";
			};
		}
		if ( !what.hasOwnProperty ( "displayName" )) {
			Object.defineProperty ( what, "displayName", {
				enumerable : false,
				configurable : true,
				get : function () {
					return name;
				}
			});
		}
	}
};



/**
 * Checks an object for required methods such as onevent, onaction, onbroadcast etc.
 */
gui.Interface = {
		
	/**
	 * Check for implemented interface; throw an exception if not.
	 * @param {object} interfais 
	 * @param {object} object
	 * @returns {boolean}
	 */
	validate : function ( interfais, object ) {
		
		var is = true;
		var expected = interfais.toString ();
		var type = gui.Type.of ( object );
		switch ( type ) {
			case "null" :
			case "string" :
			case "number" :
			case "boolean" :
			case "undefined" :
				throw new Error ( "Expected " + expected + ", got " + type + ": " + object );
			default :
				try {
					var missing = null, t = null;
					is = Object.keys ( interfais ).every ( function ( name ) {
						missing = name; t = gui.Type.of ( interfais [ name ]);
						return gui.Type.of ( object [ name ]) === t;
					});
					if ( !is ) {
						throw new Error ( "Expected " + expected + ". A required " + type + " \"" + missing + "\" is missing" );
					}
				} catch ( exception ) {
					throw new Error ( "Expected " + expected );
				}
				break;
		}
		return is;
	}
};


/**
 * From Raganwalds "Method Combinators".
 * @see https://github.com/raganwald/method-combinators/blob/master/README-JS.md
 * @see https://github.com/raganwald/homoiconic/blob/master/2012/09/precondition-and-postcondition.md
 */
gui.Combinator = {

	/**
	 * @param {function} decoration
	 * @returns {function}
	 */
	before : function ( decoration ) {
		return function ( base ) {
			return function () {
				decoration.apply ( this, arguments );
				return base.apply ( this, arguments );
			};
		};
	},

	/**
	 * @param {function} decoration
	 * @returns {function}
	 */
	after : function ( decoration ) {
		return function ( base ) {
			return function () {
				var __value__ = base.apply ( this, arguments );
				decoration.apply ( this, arguments );
				return __value__;
			};
		};
	},

	/**
	 * @param {function} decoration
	 * @returns {function}
	 */
	around : function ( decoration ) {
		return function ( base ) {
			return function () {
				var argv, callback, __value__, that = this, slice = gui.Combinator.__slice;
				argv = 1 <= arguments.length ? slice.call ( arguments, 0 ) : [];
				__value__ = void 0;
				callback = function () {
					return __value__ = base.apply ( that, argv );
				};
				decoration.apply ( this, [ callback ].concat ( argv ));
				return __value__;
			};
		};
	},

	/**
	 * Note that we added support for an "otherwise" function as the second argument.
	 * @param {function} condition
	 */
	provided : function ( condition ){
		return function ( base, otherwise ) {
			return function () {
				if ( condition.apply ( this, arguments )) {
					return base.apply ( this, arguments );
				} else if ( otherwise ) {
					return otherwise.apply ( this, arguments );
				}
			};
		};
	},


	// PRIVATES ..........................................................

	__slice : [].slice

};


/**
 * Working with objects.
 */
gui.Object = {
	
	/**
	 * Convenient facade for Object.create to default all the property descriptors. 
	 * @see http://wiki.ecmascript.org/doku.php?id=strawman:define_properties_operator
	 * @param {object} proto
	 * @param {object} props
	 */
	create : function ( proto, props ) {
		
		var resolved = Object.create ( null );
		Object.keys ( props ).forEach ( function ( prop ) {
			resolved [ prop ] = {
				value : props [ prop ],
				writable : true,
				enumerable : true,
				configurable : true
			};
		});
		
		return Object.create ( proto, resolved );
	},
	
	/**
	 * Extend target with source properties *excluding* prototype stuff.
	 * @param {object} target
	 * @param {object} source
	 * @returns {object}
	 */
	extend : function extend ( target, source ) {
		
		Object.keys ( source ).forEach ( function ( name ) {
			var desc = Object.getOwnPropertyDescriptor ( source, name );
			Object.defineProperty ( target, name, desc );
    });
    return target;
  },

  /**
   * Copy object.
   * @returns {object}
   */
  copy : function ( source ) {

		return this.extend ( Object.create ( null ), source );
  },
  
	/**
	 * Call function for each key/value in iterated object. 
	 * @param {object} object
	 * @param {function} func
	 * @param @optional {object} thisp
	 */
	each : function ( object, func, thisp ) {
		
		Object.keys ( object ).forEach ( function ( key ) {
			func.call ( thisp, key, object [ key ]);
		});
	},
	
	/**
	 * Object has any (own) properties?
	 * @param {object} object
	 * @returns {boolean}
	 */
	isEmpty : function ( object ) {
		
		return Object.keys ( object ).length === 0;
	},
	
	/**
	 * Lookup object for string of type "my.ns.Thing" in given context. 
	 * @param {String} opath Object path eg. "my.ns.Thing"
	 * @param {Window} context
	 * @returns {object}
	 */
	lookup : function ( opath, context ) {
		
		var result, struct = context;
		if ( !opath.contains ( "." )) {
			result = struct [ opath ];
		} else {
			var parts = opath.split ( "." );
			parts.forEach ( function ( part ) {
				struct = struct [ part ];
			});
			result = struct;
		}
		return result;
	},


	/**
	 * Update property of object in given context based on string input.
	 * @param {String} opath Object path eg. "my.ns.Thing.name"
	 * @param {object} value Property value eg. "Johnson"
	 * @param {Window} context
	 * @returns {object}
	 */
	assert : function ( opath, value, context ) {

		var prop, struct = context;
		if ( opath.contains ( "." )) {
			var parts = opath.split ( "." );
			prop = parts.pop ();
			parts.forEach ( function ( part ) {
				struct = struct [ part ];
			});
		} else {
			prop = opath;
		}
		struct [ prop ] = value;
		return struct;
	},
	
	/**
	 * List names of invocable methods *including* prototype stuff.
	 * @return {Array<String>}
	 */
	methods : function ( object ) {
		
		var result = [];
		for ( var def in object ) {
			if ( gui.Type.isFunction ( object [ def ])) {
				if ( !gui.Type.isConstructor ( def )) {
					result.push ( def );
				}
			}
		}
		return result;
	},
	
	/**
	 * List names of non-method properties *including* prototype stuff.
	 * @return {Array<String>}
	 */
	nonmethods : function ( object ) {
		
		var result = [];
		for ( var def in object ) {
			if ( !gui.Type.isFunction ( object [ def ])) {
				result.push ( def );
			}
		}
		return result;
	}
};


/**
 * Super :)
 * @param {function} constructor
 */
gui.Super = function Super ( constructor ) {
	
	"use strict";
	gui.Super.stubAll ( this, constructor.prototype );
};

gui.Super.prototype = Object.create ( null );


// STATICS .......................................................................

/**
 * @static
 * Instance of an i.Exemplar subclass (now invoking _super).
 * @type {object}
 */
gui.Super.subject = null;

/**
 * EXPERIMENTAL.
 * @type {boolean}
 */
gui.Super.sandbox = false;

/**
 * Prepended to the result of calling 
 * toString() on a modified function.
 * @type {String}
 */
gui.Super.disclaimer = "/**\n" +
	"  * The runtime execution of this method \n" +
	"  * has been overloaded by the framework. \n" +
	"  * This is an approximation of the code. \n" +
	"  */\n";

/**
 * @static
 * Declare all method stubs on gui.Super instance.
 * @param {gui.Super} target
 * @param {object} proto
 */
gui.Super.stubAll = function ( target, proto ) {
	
	gui.Object.methods ( proto ).forEach ( function ( method ) {
		gui.Super.stubOne ( target, proto, method );
	}, this );
};

/**
 * @static
 * Declare single method stub on gui.Super instance.
 * @param {gui.Super} target
 * @param {object} proto
 * @param {String} method Name of the method
 */
gui.Super.stubOne = function ( target, proto, method ) {
	
	var func = target [ method ] = function () {
		return proto [ method ].apply ( gui.Super.subject, arguments );
	};
	func.displayName = method;
};

/**
 * @static
 * Stamp all properties from object onto prototype while overloading methods.
 * @param {function} superconstructor
 * @param {function} constructor
 * @param {object} object
 */
gui.Super.stamp = function ( superconstructor, constructor, object ) {
	
	"use strict";
	
	var prop = null, proto = constructor.prototype;
	
	if ( gui.Type.isObject ( object )) {
		Object.keys ( object ).forEach ( function ( key ) {
			prop = Object.getOwnPropertyDescriptor ( object, key );
			switch ( gui.Type.of ( prop.value )) {
				
				case "function" : // inject _super support into method type properties.
					if ( !gui.Type.isConstructor ( prop.value )) {
						prop = gui.Super._function ( object, key, prop, superconstructor );
					}
					break;
					
				case "object" : // setup getter-and-setter type declarations
					var o = prop.value;
					if ( o.get || o.set ) {
						if ( Object.keys ( o ).every ( function ( k ) {
							return k === "get" || k === "set";
						})) {
							prop = gui.Super._property ( key, o, constructor );
						}
					}
					break;
				
			}
			
			// stamp the property
			Object.defineProperty ( proto, key, prop );
			
			// methods specials
			// TODO: not like this! If *not* a function, the property will now be accessed and fire the getter function we just declared!

			/*
			if ( gui.Type.isFunction ( proto [ key ])) {

				// update console display name (TODO: does it work?)
				Object.defineProperty ( proto [ key ], "displayName", {
					enumerable : false,
					configurable : true,
					get : function () {
						return key;
					}
				});

				// normalize toString() for debugging
				// TODO: Find the hat char for that regexp
				proto [ key ].toString = function () {
					var tostring = object [ key ].toString ();
					tostring = tostring.replace ( /\t/g, "  " );
					return gui.Super.disclaimer + tostring;
				}
			}
			*/

	  });
	}
};

/**
 * @static 
 * Compute property descriptor for function type definition.
 * @param {object} object
 * @param {String} key
 * @param {object} prop
 * @param {function} superconstructor
 * @returns {object}
 */
gui.Super._function = function ( object, key, prop, superconstructor ) {
	
	if ( !prop.value.__data__ ) { // TODO: hmm...................................... !!!
		prop.value = function () {
			
			var sub = gui.Super.subject;
			var was = gui.Super.sandbox;
			
			gui.Super.subject = this;
			gui.Super.sandbox = ( was === false && this.sandboxed === true );
			
			this._super = superconstructor.__super__;
			var result = object [ key ].apply ( this, arguments );
			
			gui.Super.subject = sub;
			gui.Super.sandbox = was;
			
			return result;
			
			// return ( gui.Super.sandbox ? gui.SandBox.censor ( result, key ) : result );
		};
	}
	return prop;
};

/**
 * @static
 * Compute property descriptor for getter-setter type definition.
 * @param {String} key
 * @param {object} o
 * @param {function} constructor
 * @returns {object}
 */
gui.Super._property = function ( key, o, constructor ) {

	"use strict";
	
	[ "get", "set" ].forEach ( function ( what ) {
		var d, p = constructor.prototype;
		while ( p && !gui.Type.isDefined ( o [ what ])) {
			p = Object.getPrototypeOf ( p );
			d = Object.getOwnPropertyDescriptor ( p, key );
			if ( d ) {
				o [ what ] = d [ what ];
				/*
				o [ what ] = function () {
					alert ( "TODO: sandbox" );
					return d [ what ].call ( this );
				};
				*/
			}
		}
	});
	
	return {
		enumerable : true,
		configurable : true,
		get : o.get || function () {
			throw new Error ( constructor + " Getting a property that has only a setter: " + key );
		},
		set : o.set || function () {
			throw new Error ( constructor + " Setting a property that has only a getter: " + key );
		}
	};
};


/**
 * Type checking studio.
 */
gui.Type = {

	/**
	 * Get (better) type of argument. Note that response may differ between user agents.
	 * http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator
	 * @param {object} o
	 * @returns {String}
	 */
	of : function ( o ) {
		
		var type = ({}).toString.call ( o ).match ( this._typeexp )[ 1 ].toLowerCase ();
		if ( type === "domwindow" && String ( typeof o ) === "undefined" ) {
			type = "undefined"; // some kind of degenerate bug in Safari on iPad
		}
		return type;
	},
	
	/**
	 * Is object defined?
	 * TODO: unlimited arguments support
	 * @param {object} o
	 * @returns {boolean}
	 */
	isDefined : function ( o ) {
		
		return this.of ( o ) !== "undefined";
	},
	
	/**
	 * Autocast string to an inferred type. "123" will 
	 * return a number, "false" will return a boolean.
	 * TODO: move to gui.Type :)
	 * @param {String} string
	 * @returns {object}
	 */
	cast : function ( string ) {
		
		var result = String ( string );
		switch ( result ) {
			case "null" :
				result = null;
				break;
			case "true" :
			case "false" :
				result = ( result === "true" );
				break;
			default :
				if ( String ( parseInt ( result, 10 )) === result ) {
					result = parseInt ( result, 10 );
				} else if ( String ( parseFloat ( result )) === result ) {
					result = parseFloat ( result );
				}
				break;	
		}
		return result;
	},
	
	/**
	 * Is function fit to be invoked via the "new" operator? 
	 * We assume true if the prototype reveals any properties.
	 * @param {function} what
	 * @returns {boolean}
	 */
	isConstructor : function ( what ) {
		
		return this.isFunction ( what ) && Object.keys ( what.prototype ).length > 0;
	},

	/**
	 * Is constructor for a Spirit?
	 * TODO: Why can't isConstructor be used here?
	 * TODO: something more reliable than "portals".
	 * @param {function} what
	 * @returns {boolean}
	 */
	isSpiritConstructor : function ( what ) {

		return this.isFunction ( what ) && this.isBoolean ( what.portals ); // lousy
	},
	
	/**
	 * Resolve single argument into an array with one 
	 * or more entries. Strings to be split at spaces.
	 * @param {object} arg
	 * @returns {Array<object>}
	 */
	list : function ( arg ) {
		
		var list = null;
		switch ( this.of ( arg )) {
			case "array" :
				list = arg;
				break;
			case "string" :
				list = arg.split ( " " );
				break;
			case "nodelist" :
			case "arguments" :
				list = Array.prototype.slice.call ( arg );
				break;
			default :
				list = [ arg ];
				break;
		}
		return list;
	},

	// PRIVATES .............................................
	
	/**
	 * Match "Array" in "[object Array]" and so on.
	 * @type {RegExp}
	 */
	_typeexp : /\s([a-zA-Z]+)/
	
};

/**
 * Generate methods for isArray, isFunction, isBoolean etc.
 */
( function generatecode () {
	
	[	"array", 
		"function", 
		"object", 
		"string", 
		"number", 
		"boolean", 
		"null",
		"arguments"
	].forEach ( function ( type ) {
		// TODO: would x[0] === x.charAt(0) in our browser stack?
		this [ "is" + type.charAt ( 0 ).toUpperCase () + type.slice ( 1 )] = function is ( o ) {
			return this.of ( o ) === type; 
		};
	}, this );
	
}).call ( gui.Type );


/**
 * Position.
 * @param {number} x
 * @param {number} y
 */
gui.Position = function ( x, y ) {

	this.x = x ? x : 0;
	this.y = y ? y : 0;
};

gui.Position.prototype = {
	
	/**
	 * X position.
	 * @type {number}
	 */
	x : 0,
	
	/**
	 * Y position.
	 * @type {number}
	 */
	y : 0,
	
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		
		return "[object gui.Position(" + this.x + "," + this.y + ")]";
	},
	
	/**
	 * Clone position.
	 * @returns {gui.Position}
	 */
	clone : function () {
		
		return new gui.Position ( this.x, this.y );
	}
};


// STATICS .............................................................

/**
 * Compare two positions.
 * @param {gui.Position} p1
 * @param {gui.Position} p2
 * @return {boolean}
 */
gui.Position.isEqual = function ( p1, p2 ) {
	
	return ( p1.x === p2.x ) && ( p1.y === p2.y );
};


/**
 * Dimension.
 * @param {number} w
 * @param {number} h
 */
gui.Dimension = function ( w, h ) {

	this.w = w ? w : 0;
	this.h = h ? h : 0;
};

gui.Dimension.prototype = {
	
	/**
	 * Width.
	 * @type {number}
	 */
	w : 0,
	
	/**
	 * Height.
	 * @type {number}
	 */
	h : 0,
	
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		
		return "[object gui.Dimension(" + this.w + "," + this.h + ")]";
	}
};


// STATICS .............................................................

/**
 * Compare two dimensions.
 * @param {gui.Dimension} dim1
 * @param {gui.Dimension} dim2
 * @return {boolean}
 */
gui.Dimension.isEqual = function ( dim1, dim2 ) {
	
	return ( dim1.w === dim2.w ) && ( dim1.h === dim2.h );
};


/**
 * Geometry.
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
gui.Geometry = function ( x, y, w, h ) {

	this.x = x ? x : 0;
	this.y = y ? y : 0;
	this.w = w ? w : 0;
	this.h = h ? h : 0;
};

gui.Geometry.prototype = {
	
	/**
	 * X position.
	 * @type {number}
	 */
	x : 0,
	
	/**
	 * Y position.
	 * @type {number}
	 */
	y : 0,
	
	/**
	 * Width.
	 * @type {number}
	 */
	w : 0,
	
	/**
	 * Height.
	 * @type {number}
	 */
	h : 0,
	
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		
		return "[object gui.Geometry(" + this.x + "," + this.y +"," + this.w +"," + this.h + ")]";
	},
	
	/**
	 * Intersects another geometry?
	 * @param {gui.Geometry} geo
	 */
	hitTest : function ( geo ) {
		
		return gui.Geometry.hitTest ( this, geo );
	}
};


// STATICS .............................................................

/**
 * Compare two geometries.
 * @param {gui.Geometry} geo1
 * @param {gui.Geometry} geo2
 * @returns {boolean}
 */
gui.Geometry.isEqual = function ( geo1, geo2 ) {
	
	return ( geo1.x === geo2.x ) && ( geo1.y === geo2.y ) && ( geo1.w === geo2.w ) && ( geo1.h === geo2.h );
};

/**
 * Hittest two geometries.
 * @param {gui.Geometry} geo1
 * @param {gui.Geometry} geo2
 * @returns {boolean}
 */
gui.Geometry.hitTest = function ( geo1, geo2 ) {
	
	function x ( g1, g2 ) {
		return g1.x >= g2.x && g1.x <= g2.x + g2.w;
	}
	
	function y ( g1, g2 ) {
		return g1.y >= g2.y && g1.y <= g2.y + g2.h;
	}
	
	var hitx = x ( geo1, geo2 ) || x ( geo2, geo1 );
	var hity = y ( geo1, geo2 ) || y ( geo2, geo1 );
	
	return hitx && hity;
};


/**
 * Split() the #fragment identifier once and for all.
 * @param {Document} doc
 * @param {String} href
 */
gui.URL = function ( doc, href ) {
	
	var link = doc.createElement ( "a" ); link.href = href;
	Object.keys ( gui.URL.prototype ).forEach ( function ( key ) {
		if ( gui.Type.isString ( link [ key ])) {
			this [ key ] = link [ key ];
		}
	}, this );
	this.id = this.hash ? this.hash.substring ( 1 ) : null;
	this.location = this.href.split ( "#" )[ 0 ];
	this.external = this.location !== String ( doc.location ).split ( "#" )[ 0 ];
};

gui.URL.prototype = {
	
	hash : null, // #test
	host : null, // www.example.com:80
	hostname : null, // www.example.com
	href : null, // http://www.example.com:80/search?q=devmo#test
	pathname : null, // search
	port : null, // 80
	protocol : null, // http:
	search : null, // ?q=devmo
	
	// CUSTOM ..........................................................
	
	id : null,	// test
	// url : null, // http://www.example.com:80/search?q=devmo
	external : false // external to the *document*, not the server host
};


/**
 * Encapsulates a callback for future use.
 */
gui.Then = function Then () {};

gui.Then.prototype = {

	/**
	 * Unique key.
	 * @type {String}
	 */
	key : null,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {

		return "[object gui.Then]";
	},

	/**
	 * Setup callback with optional this-pointer.
	 * @param {function} callback
	 * @param @optional {object} pointer
	 */
	then : function ( callback, thisp ) {
		
		this._callback = callback ? callback : null;
		this._pointer = thisp ? thisp : null;
	},	

	/**
	 * Callback with optional this-pointer.
	 * @returns {object}
	 */
	now : function () {
		
		var c = this._callback;
		var p = this._pointer;
		if ( c ) {
			this.then ( null, null );
			c.apply ( p, arguments );
		}
	},


	// PRIVATES .................................................

	/**
	 * Callback to execute when transition is done.
	 * @type {function}
	 */
	_callback : null,
	
	/**
	 * Preserve integrity of "this" keyword in callback function.
	 * @type {object}
	 */
	_pointer : null

};



/**
 * Parse HTML string to DOM node(s) in given document context.
 * Adapted from https://github.com/petermichaux/arbutus
 * TODO: High level awareness of HTMLparser elements. Plugin 
 *       ui.SpiritDOM and ui.Spirit.parse should know about 
 *       added historic HTML chrome and strip when inserted.
 * @param {Document} doc
 */
gui.HTMLParser = function HTMLParser ( doc ){

	if ( doc && doc.nodeType ) {
		this._document = doc;
	} else {
		throw new TypeError ( "Document expected" );
	}
};

gui.HTMLParser.prototype = {

	/**
	 * Context document.
	 * @type {Document}
	 */
	_document : null,

	/**
	 * Parse HTML to DOM node(s). Note that this returns an Array.
	 * @param {String} html
	 * @param @optional {Element} element
	 * @returns {Array<Node>}
	 */
	parse : function ( html, element ) {

		var match, fix, temp, frag, path,
			fixes = gui.HTMLParser._fixes,
			comments = gui.HTMLParser._comments,
			firsttag = gui.HTMLParser._firsttag,
			doc = this._document;

		/*
		 * HTML needs wrapping in obscure 
		 * structure for historic reasons?
		 */
		html = html.trim ().replace ( comments, "" );
		if (( match = html.match ( firsttag ))) {
			if (( fix = fixes.get ( match [ 1 ]))) {
				html = fix.replace ( "${html}", html );
			}
		}

		/*
		 * Parse HTML to DOM nodes.
		 */
		temp = doc.createElement ( "div" );
		temp.innerHTML = html;

		/**
		 * Extract elements from obscure 
		 * structure for historic reasons?
		 */
		var nodes = temp.childNodes;
		if ( fix && element ) {
			var name = element.localName;
			if ( fixes.has ( name )) {
				var node = temp;
				while ( node ) {
					node = node.firstElementChild;
					if ( node.localName === name ) {
						nodes = node.childNodes;
						node = null;
					}
				}	
			}
		}

		// convert from nodelist to array of nodes
		return Array.map ( nodes, function ( node ) {
			return node;
		});
	}
};

/**
 * Match comments.
 * @private @static.
 * @type {RegExp}
 */
gui.HTMLParser._comments = /<!--[\s\S]*?-->/g;

/**
 * Match first tag.
 * @private @static.
 * @type {RegExp}
 */
gui.HTMLParser._firsttag = /^<([a-z]+)/i;

/**
 * Mapping tag names to miminum viable tag structure.
 * Considerable foresight has decided that text/html 
 * must forever remain backwards compatible with IE5.
 * @private @static
 * @type {Map<String,String>}
 */
gui.HTMLParser._fixes = new Map ();

/**
 * Populate fixes.
 * TODO: "without the option in the next line, the parsed option will always be selected."
 */
( function () {
	gui.Object.each ({
		"td" : "<table><tbody><tr>${html}</tr></tbody></table>",
		"tr" : "<table><tbody>${html}</tbody></table>",
		"tbody" : "<table>${html}</table>",
		"col" : "<table><colgroup>${html}</colgroup></table>",
		"option" : "<select><option>a</option>${html}</select>" 
	}, function ( tag, fix ) {
		gui.HTMLParser._fixes.set ( tag, fix );
	});
}());

/**
 * Populate duplicated fixes.
 */
( function () {
	var fixes = gui.HTMLParser._fixes;
	fixes.set ( "th", fixes.get ( "td" ));
	[ "thead", "tfoot", "caption", "colgroup" ].forEach ( function ( tag ) {
		gui.HTMLParser._fixes.set ( tag, fixes.get ( "tbody" ));
	});
}());


/**
 * Serialize DOM element to XHTML string.
 * TODO: work on the HTML without XML...
 */
gui.DOMSerializer = function DOMSerializer () {};
	
gui.DOMSerializer.prototype = {

	/**
	 * Serialize element to XHTML string.
	 * @param {Element} element
	 * @returns {String}
	 */
	serialize : function ( element ) {

		var context = element.ownerDocument.defaultView;
		var serializer = new context.XMLSerializer ();
		return serializer.serializeToString ( element );
	},

	/**
	 * Exclude element itself from serialized result.
	 * This is considered a temporary patch for the 
	 * missing access to innerHTML setter in WebKit.
	 * @param {Element} element
	 * @returns {String}
	 */
	subserialize : function ( element ) {

		var html = this.serialize ( element );
		if ( html.contains ( "</" )) {
			html = html.slice ( 
				html.indexOf ( ">" ) + 1, 
				html.lastIndexOf ( "<" )
			);
		}
		return html;
	}
};


/**
 * We load a text file from the server. This might be used instead 
 * of a XMLHttpRequest to cache the result and save repeated lookups.
 * TODO: custom protocol handlers to load from localstorage
 */
gui.FileLoader = gui.Exemplar.create ( "gui.FileLoader", Object.prototype, {
	
	/**
	 * Construction time again.
	 * @param {Document} doc
	 */
	onconstruct : function ( doc ) {

		this._cache = gui.FileLoader._cache;
		this._document = doc;
	},

	/**
	 * Load file as text/plain and serve to callback.
	 * @param {String} src Relative to document URL
	 * @param {function} callback
	 * @param @optional {object} thisp
	 */
	load : function ( src, callback, thisp ) {
		
		var url = new gui.URL ( this._document, src );
		if ( this._cache.has ( url.location )) {
			this._cached ( url, callback, thisp );
		} else {
			this._request ( url, callback, thisp );
		}
	},
	
	/**
	 * Handle loaded file.
	 * @param {String} text
	 * @param {gui.URL} url
	 * @param {function} callback
	 * @param @optional {object} thisp
	 */
	onload : function ( text, url, callback, thisp ) {
		
		callback.call ( thisp, text );
	},
	
	
	// PRIVATES ........................................................
	
	/**
	 * Cached is shared between all instances of gui.FileLoader.
	 * @see {gui.FileLoader#_cache}
	 * @type {Map<String,String>}
	 */
	_cache : null,

	/**
	 * File address resolved relative to this document.
	 * @type {Document}
	 */
	_document : null,
	
	/**
	 * Request external file.
	 * @param {gui.URL} url
	 * @param {function} callback
	 * @param @optional {object} thisp
	 */
	_request : function ( url, callback, thisp ) {
		
		this._cache.set ( url.location, null ); // blocking similar request
		new gui.Request ( url.href ).get ( function ( status, text ) {
			this.onload ( text, url, callback, thisp );
			this._cache.set ( url.location, text );
			gui.FileLoader.unqueue ( url.location );
		}, this );
	},

	/**
	 * Hello.
	 * @param {gui.URL} url
	 * @param {Map<String,String>} cache
	 * @param {function} callback
	 * @param @optional {object} thisp
	 */
	_cached : function ( url, callback, thisp ) {

		var cached = this._cache.get ( url.location );
		if ( cached !== null ) { // note that null check is important
			this.onload ( cached, url, callback, thisp );
		} else {
			var that = this;
			gui.FileLoader.queue ( url.location, function ( text ) {
				that.onload ( text, url, callback, thisp );
			});
		}
	},
	

	// SECRETS .........................................................
	
	/**
	 * Secret constructor.
	 * @param {gui.Spirit} spirit
	 * @param {Window} window
	 * @param {function} handler
	 */
	__construct__ : function ( doc ) {
		
		if ( doc && doc.nodeType === Node.DOCUMENT_NODE ) {
			this.onconstruct ( doc );
		} else {
			throw new TypeError ( "Document expected" );
		}
	}

	
}, {}, { // STATICS ....................................................
	
	/**
	 * @static
	 * Cache previously retrieved files, mapping URL to file text.
	 * @type {Map<String,String>}
	 */
	_cache : new Map (),

	/**
	 * @static
	 * Queue handlers for identical requests, mapping URL to function.
	 * @type {Array<String,function>}
	 */
	_queue : new Map (),

	/**
	 * @static
	 * Queue onload handler for identical request.
	 * @param {String}
	 */
	queue : function ( src, action ) {

		this._queue [ src ] =  this._queue [ src ] || [];
		this._queue [ src ].push ( action );
	},

	/**
	 * @static
	 * Execute queued onload handlers.
	 * @param {String} src
	 */
	unqueue : function ( src ) {

		var text = this._cache.get ( src );
		if ( this._queue [ src ]) {
			while ( this._queue [ src ][ 0 ]) {
				this._queue [ src ].shift ()( text );
			}
		}
	}
});


gui.BlobLoader = {

	/**
	 * @type {URL}
	 */
	_URL : ( window.URL || window.webkitURL ),

	/**
	 * Load script into document from given source code.
	 * @param {Document} doc
	 * @param {String} source
	 * @param {function} callback
	 * @param {object} thisp
	 */
	loadScript : function ( doc, source, callback, thisp ) {

		var blob = new Blob ([ source ], { type: "text/javascript" });
		var script = doc.createElement ( "script" );
		script.src = this._URL.createObjectURL ( blob );

		var head = doc.querySelector ( "head" );
		gui.Observer.suspend ( head, function () {
			head.appendChild ( script );
		});

		if ( callback ) {
			script.onload = function () {
				callback.call ( thisp );
			};
		}
	}
};


/**
 * Provides convenient access to an events originating 
 * window, document and spirit of the document element. 
 * TODO: Fire this onmousemove only if has listeners!
 * TODO: Figure this out with cross-domain spirits.
 * @param {Event} e
 */
gui.EventSummary = function ( e ) {
	
	if ( gui.Type.of ( e ).endsWith ( "event" )) {
		this._construct ( e );
	} else {
		throw new TypeError ();
	}
};

gui.EventSummary.prototype = {
	
	/**
	 * The event itself.
	 * @type {Event}
	 */
	event : null,
		
	/**
	 * Originating window.
	 * @type {Window}
	 */
	window : null,
	
	/**
	 * Originating document.
	 * @type {Document}
	 */
	document : null,
	
	/**
	 * Spirit of the root element (the HTML element) in originating document.
	 * @type {gui.DocumentSpirit}
	 */
	documentspirit : null,
	
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		
		return "[object gui.EventSummary]";
	},

	/**
	 * Breakdown event argument into more manegable properties 
	 * (this method illustrates the need for en event summary).
	 * @param {Event} e
	 * @returns {object}
	 */
	_construct : function ( e ) {
		
		var win = null,
			doc = null, 
			target = e.target,
			type = target.nodeType;
		
		if ( gui.Type.isDefined ( type )) {
			doc = ( type === Node.DOCUMENT_NODE ? target : target.ownerDocument );
			win = doc.defaultView;
		} else {
			win = target;
			doc = win.document;
		}
		
		this.event = e;
		this.window = win;
		this.document = doc;
		this.documentspirit = doc.documentElement.spirit;
	}
};


/**
 * Crawling the DOM ascending or descending.
 * TODO: method descendSub to skip start element (and something similar for ascend)
 * @param @optional {String} type
 */
gui.Crawler = function ( type ) {
	
	this.type = type || null;
	return this;
};

gui.Crawler.prototype = {
		
	/**
	 * Recursion directives.
	 * TODO: skip children, skip element etc
	 */
	CONTINUE: 0,
	STOP : 1,
	
	/**
	 * Identifies crawler. TODO: spirit support for this!
	 * @type {String}
	 */
	type : null,
	
	/**
	 * Direction "ascending" or "descending".
	 * @type {String}
	 */
	direction : null,

	/**
	 * @type {Boolean}
	 */
	global : false,
	
	/**
	 * Crawl DOM ascending.
	 * TODO: ascendGlobal
	 * TODO: Transcend into parent frame.
	 * @param {object} start Spirit or Element
	 * @param {object} handler
	 */
	ascend : function ( start, handler ) {
		
		this.direction = gui.Crawler.ASCENDING;
		var elm = start instanceof gui.Spirit ? start.element : start;
		
		do {
			if ( elm.nodeType === Node.DOCUMENT_NODE ) {
				if ( this.global ) {
					elm = elm.defaultView.frameElement;
					if ( elm ) {
						try {
							var assignment = elm.ownerDocument;
						} catch ( accessDeniedException ) {
							console.warn ( "TODO: Ascend cross domain" );
							elm = null;
						}
					}
				} else {
					elm = null;
				}
			}
			if ( elm ) {
				var directive = this._handleElement ( elm, handler );
				if ( !directive ) {
					elm = elm.parentNode;
				} else {
					switch ( directive ) {
						case gui.Crawler.STOP :
							elm = null;
							break;
					}
				}
				
			}
		} while ( elm );
	},
	
	/**
	 * Crawl DOM descending.
	 * TODO: descendGlobal
	 * TODO: Transcend into iframes.
	 * @param {object} start Spirit or Element
	 * @param {object} handler
	 */
	descend : function ( start, handler ) {
		
		this.direction = gui.Crawler.DESCENDING;
		var elm = start instanceof gui.Spirit ? start.element : start;
		if ( elm.nodeType === Node.DOCUMENT_NODE ) {
			elm = elm.documentElement;
		} else if ( elm.localName === "iframe" ) {
			if ( this.global ) {
				console.log ( "TODO: descend into iframes" );
			}
		}
		this._descend ( elm, handler, true );
	},


	// PRIVATES .................................................................
	
	/**
	 * Iterate descending.
	 * @param {Element} elm
	 * @param {object} handler
	 * @param {boolean} start
	 */
	_descend : function ( elm, handler, start ) {
		
		var directive = this._handleElement ( elm, handler );
		switch ( directive ) {
			case 0 :
				if ( elm.childElementCount > 0 ) {
					this._descend ( elm.firstElementChild, handler, false );
				} else {
					if ( this.global && elm.localName === "iframe" ) {
						try {
							var assignment = elm.contentDocument;
						} catch ( accessDeniedException ) {
							console.warn ( "TODO: Descend cross domain" );
						}
						var root = elm.contentDocument.documentElement;
						if ( root && root.spirit ) { // otherwise just created or no Spiritual
							this._descend ( root, handler, false );
						}
					}
				}
				if ( !start ) {
					var next = elm.nextElementSibling;
					if ( next !== null ) {
						this._descend ( next, handler, false );
					}
				}
				break;
		}
	},
	
	/**
	 * Handle element. Invoked by both ascending and descending crawler.
	 * @param {Element} element
	 * @param {object} handler
	 * @returns {number} directive
	 */
	_handleElement : function ( element, handler ) {
		
		var directive = gui.Crawler.CONTINUE;
		var spirit = element.spirit;
		
		if ( spirit ) {
			directive = spirit.oncrawler ( this );
		}
		if ( !directive ) {
			if ( handler ) {
				if ( gui.Type.isFunction ( handler.handleElement )) {
					directive = handler.handleElement ( element );
				}
				switch ( directive ) {
					case 1 :
						break;
					default :
						if ( gui.Type.isFunction ( handler.handleSpirit )) {
							if ( spirit ) {
								directive = this._handleSpirit ( spirit, handler );
							}
						}
						break;
				}	
			}
		}
		if ( !directive ) {
			directive = gui.Crawler.CONTINUE;
		}
		return directive;
	},
	
	/**
	 * Handle Spirit.
	 * @param {Spirit} spirit
	 * @param {object} handler
	 * @returns {number}
	 */
	_handleSpirit : function ( spirit, handler ) {
		
		return handler.handleSpirit ( spirit );
	}
};


// STATICS ..............................................................

gui.Crawler.ASCENDING = "ascending";
gui.Crawler.DESCENDING = "descending";

/**
 * Bitmask setup supposed to be going on here.
 * TODO: SKIP_CHILDREN and TELEPORT_ELSEWEHERE stuff.
 */
gui.Crawler.CONTINUE = 0;
gui.Crawler.STOP = 1;


/**
 * Generating keys for unique key purposes.
 */
gui.KeyMaster = {
	
	/**
	 * @static
	 * Generate random key. Not simply incrementing a counter in order to celebrate the 
	 * rare occasion that spirits might be uniquely identified across different domains.
	 * @returns {String}
	 */
	generateKey : function () {
		
		var ran = Math.random ().toString ();
		var key = "key" + ran.slice ( 2, 11 );
		if ( this._keys.has ( key )) {
			key = this.generateKey ();
		} else {
			this._keys.add ( key );
		}
		return key;
	},

	/**
	 * @static
	 * Generate GUID. TODO: Verify integrity of this by mounting result in Java or something.
	 * @see http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
	 * @returns {String}
	 */
	generateGUID : function () {
		
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace ( /[xy]/g, function ( c ) {
			var r = Math.random () * 16 | 0, v = c === "x" ? r : ( r&0x3 | 0x8 );
			return v.toString ( 16 );
		}).toUpperCase();
	},
	
	/**
	 * @static
	 * String appears to be a generated key? We don't look it up in the key cache, 
	 * so this method can be used to check a key that was generated in old session.
	 * @param {String} string
	 * @returns {boolean}
	 */
	isKey : function ( string ) {
		
		var hit = null, looks = false;
		if ( gui.Type.isString ( string )) {
			hit = this.extractKey ( string ); 
			looks = hit && hit [ 0 ] === string;
		}
		return looks;
	},

	/**
	 * Extract (potential) key from string.
	 * @param {String} string
	 * @returns {String}
	 */
	extractKey : function ( string ) {

		return ( /key\d{9}/ ).exec ( string );
	},


	// PRIVATES .............................................................................
	
	/**
	 * Tracking generated keys to prevent doubles.
	 * @type {Set<String>}
	 */
	_keys : new Set ()
};


/**
 * Simplistic XMLHttpRequest wrapper. 
 * Work in progress, lot's to do here.
 * @param @optional {String} url
 */
gui.Request = function ( url ) {
	
	if ( url ) {
		this.url ( url );
	}
};

gui.Request.prototype = {
	
	/**
	 * Set request address.
	 * @param {String} url
	 */
	url : function ( url ) {
		
		this._url = url;
		return this;
	},
	
	/**
	 * Convert to synchronous request.
	 */
	sync : function () {
		
		this._async = false;
		return this;
	},
	
	/**
	 * Convert to asynchronous request.
	 */
	async : function () {
		
		this._async = true;
		return this;
	},
	
	/**
	 * Expected response type. Sets the accept header and formats 
	 * callback result accordingly (eg. as JSON object, XML document) 
	 * @param {String} mimetype
	 * @returns {gui.SpiritRquest}
	 */
	accept : function ( mimetype ) {
		
		this._accept = mimetype;
		return this;
	},
	
	/**
	 * Expect JSON response.
	 * @returns {gui.SpiritRquest}
	 */
	acceptJSON : function () {
		
		return this.accept ( "application/json" );
	},
	
	/**
	 * Expect XML response.
	 * @returns {gui.SpiritRquest}
	 */
	acceptXML : function () {
		
		return this.accept ( "text/xml" );
	},
	
	/**
	 * Request content type (when posting data to service).
	 * @param {String} mimetype
	 * @returns {gui.SpiritRquest}
	 */
	format : function ( mimetype ) {
		
		this._format = mimetype;
		return this;
	},
	
	/**
	 * Set request header.
	 * @param {String} name
	 * @param {String} value
	 * @returns {gui.SpiritRquest}
	 */
	header : function ( name, value ) {
		
		// TODO!
		console.warn ( "TODO: request headers" );
		return this;
	},
	
	/**
	 * Get stuff.
	 * TODO: Synchronous version
	 * TODO: Unhardcode status
	 * @param {function} callback
	 * @param {object} thisp
	 */
	get : function ( callback, thisp ) {
		
		var that = this, request = new XMLHttpRequest ();
		request.onreadystatechange = function () {
			if ( this.readyState === XMLHttpRequest.DONE ) {
				callback.call ( thisp, 200, that._parse ( this.responseText ), this.responseText );
			}
		};
		request.overrideMimeType ( this._accept );
		request.open ( "get", this._url, true );
		request.send ( null );
	},

	post : function () {},
	put : function () {},
	del : function () {},
	
	
	// PRIVATES ...................................................................................
	
	/**
	 * @type {boolean}
	 */
	_async : true,
	
	/**
	 * @type {String}
	 */
	_url : null,
	
	/**
	 * Expexted response type.
	 * TODO: an array?
	 * @type {String}
	 */
	_accept : "text/plain",
	
	/**
	 * Default request type.
	 * @type {String}
	 */
	_format : "application/x-www-form-urlencoded",
	
	/**
	 * Parse response to expected type.
	 * @param {String} text
	 * @returns {object}
	 */
	_parse : function ( text ) {
		
		var result = text;
		
		try {
			switch ( this._accept ) {
				case "application/json" :
					result = JSON.parse ( text );
					break;
				case "text/xml" :
					result = new DOMParser ().parseFromString ( text, "text/xml" );
					break;
			}
		} catch ( exception ) {
			console.error ( this._accept + " dysfunction at " + this._url );
			throw exception;
		}
		return result;
	}
};


/**
 * Spirit base constructor.
 */
gui.Spirit = gui.Exemplar.create ( "gui.Spirit", Object.prototype, {

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
	spiritkey : null,
	
	/**
	 * Matches the property "signature" of the {gui.Spiritual} 
	 * instance in local window context (the gui object). This 
	 * will come in handy when Spiritual is running in iframes.
	 * TODO: rename "guikey"?
	 * @type {String}
	 */
	signature : null,


	// Basics ..................................................................
	
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function toString () {
		
		return "[object gui.Spirit]";
	},
	
	
	// Lifecycle ...............................................................
	
	/*
	 * You can safely overload or overwrite methods in the lifecycle section, 
	 * but you should leave it to the {gui.Guide} to invoke them. Also, do make 
	 * sure to always call this._super.themethod () unless you really mean it.
	 */
	
	/**
	 * Invoked when spirit is newed up. Spirit element may  
	 * not be positioned in the document DOM at this point. 
	 */
	onconstruct : function () {

		this.__plugin__ ();
		this.__debug__ ( true );
		this.life.goconstruct ();
	},
	
	/**
	 * TODO: Comments go here.
	 * 
	 */
	onconfigure : function () {
		
		this.config.configure ();
		this.life.goconfigure ();
	},
	
	/**
	 * Spirit first encounted as a node in the page DOM. This is only called once 
	 * in the lifecycle of a spirit (unlike attach, see below).
	 */
	onenter : function () {
		
		this.window.gui.inside ( this );
		this.life.goenter ();
	},
	
	/**
	 * Invoked 1) whenever spirit element is attached to the DOM tree and 2) when the 
	 * element is in the DOM on page load and the spirit is first discovered by the framework.
	 */
	onattach : function () {
		
		// TODO: matchesselector gui.CLASS_INVISIBLE + " *"
		this.window.gui.inside ( this );
		//this.tick.dispatch ( gui.TICK_FIT, 0 );
		this.life.goattach ();
	},
	
	/**
	 * Invoked (only once) when all descendant spirits are attached and ready. 
	 * From a DOM tree perspective, this fires in reverse order, innermost first. 
	 */
	onready : function () {
		
		this.life.goready ();
	},

	/**
	 * Hello.
	 */
	onvisible : function () {

		//this.tick.dispatch ( gui.TICK_FIT, 0 );
		this.life.govisible ();
	},

	/**
	 * Hello.
	 */
	oninvisible : function () {

		//this.tick.dispatch ( gui.TICK_FIT, 0 );
		this.life.goinvisible ();
	},
	
	/**
	 * Invoked whenever spirit element is detached from the DOM tree. 
	 * 
	 */
	ondetach : function () {
		
		this.window.gui.outside ( this );
		//this.tick.dispatch ( gui.TICK_FIT, 0 );
		this.life.godetach ();
	},
	
	/**
	 * Invoked when spirit is detached and not re-attached in the same thread. 
	 * This triggers destruction *unless* you return false. In this case, make sure 
	 * to manually dispose the spirit later (using dispose method).  
	 * @returns {boolean} Optionally return false to manage your own destruction
	 */
	onexit : function () {
		
		this.life.goexit (); // do not call _super.onexit if you return false
		return undefined;
	},
	
	/**
	 * Invoked when spirit gets disposed. Code your last wishes.
	 * Should only be called by the framework, use dispose().
	 * @see {gui.Spirit#dispose}
	 * @param {boolean} unloading
	 * @returns {boolean}
	 */
	ondestruct : function ( unloading ) {
		
		this.window.gui.destruct ( this );
		this.life.godestruct ();
		this.__debug__ ( false );
		this.__destruct__ ( unloading );
	},
	

	// Handlers ....................................................................
	
	/**
	 * Handle crawler.
	 * @param {gui.Crawler} crawler
	 * @returns {number}
	 */
	oncrawler : function ( crawler ) {
		
		return gui.Crawler.CONTINUE;
	},
	
	/**
	 * Handle lifecycle event.
	 * @param {gui.SpiritLife} life
	 */
	onlife : function ( life ) {},
	
	
	// Specials ...................................................................
	
	/**
	 * Hello.
	 * @returns {gui.Spirit}
	 */
	visible : function () {

		return gui.Spirit.visible ( this );
	},

	/**
	 * Hello.
	 * @returns {gui.Spirit}
	 */
	invisible : function () {

		return gui.Spirit.invisible ( this );
	},

	/**
	 * TODO: boolean trap in this API
	 * Terminate the spirit and remove the element (optionally keep it). 
	 * @param {boolean} keep True to leave the element on stage.
	 */
	dispose : function ( keep ) {
		
		if ( !keep ) {
			this.dom.remove ();
		}
		this.ondestruct ();
	},
	
	
	// Secrets .....................................................................
	
	/**
	 * Secret constructor.
	 */
	__construct__ : function () {},

	/**
	 * Experimental.
	 * @type {[type]}
	 */
	__lazies__ : null,

	/**
	 * Instantiate plugins.
	 */
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
		
		// sequenced construction
		this.life.onconstruct ();
		this.config.onconstruct ();
		prefixes.forEach ( function ( prefix ) {
			if ( this.__lazies__ [ prefix ]) {
				// lazy constructed later
			} else {
				this [ prefix ].onconstruct ();
			}
		}, this );
	},

	/**
	 * In debug mode, stamp the toString value onto the spirit element. 
	 * The toString value is defined bt the string that may be passed as 
	 * first argument to the gui.Spirit.infuse("JohnsonSpirit") method. 
	 * Debug mode is set per document via local script: ui.debug=true;
	 * @param {boolean} constructing
	 */
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
	
	/**
	 * Total destruction.
	 * @param @optional {boolean} now
	 */
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
		
		// dispose life plugin
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
					} catch ( x ) {
						// TODO: why sometimes gui.Spirit.DENIED?
					}
				}
			}, this.signature ).dispatch ( tick, 0, this.signature );
		}
	},
	
	/**
	 * Null all props. We have hotfixed conflicts upon disposal by moving this to a new 
	 * timeout stack, but the consequences should be thought throught at some point. 
	 */
	__null__ : function () {
		
		// reset
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


}, { // STATICS (RECURRING) ......................................................

	/**
	 * Mapping plugin constructor to prefix.
	 * @type {Map<String,function>}
	 */
	__plugins__ : Object.create ( null ),
	
	/**
	 * Portal this spirit to descendant iframes?
	 * @see {ui#portal}  
	 * @type {boolean}
	 */
	portals : true,
	
	/**
	 * Extends spirit and plugins (mutating plugins) plus update getters/setters.
	 * @param {object} expando 
	 * @param {object} recurring 
	 * @param {object} statics 
	 * @returns {gui.Spirit}
	 */
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

	/**
	 * Subclassing a spirit allows you to also subclass it's plugins 
	 * using the same declarative syntax. To avoid pontential traps, 
	 * we exception on the extend method (doesn't offfer the feature).
	 */
	extend : function () {

		throw new Error ( 
			'Spirits must use the "infuse" method and not "extend".\n' +
			'This method extends both the spirit and it\'s plugins.'
		);
	},

	/**
	 * Create element (this will likely be removed).
	 * @param {Document} doc
	 * @param {String} tag
	 */
	tag : function ( doc, tag ) {

		console.warn ( "Deprecated" ); // = spirit.lazies || Object.create ( null );
		return doc.createElement ( tag );
	},

	/**
	 * Set attribute (this will likely be removed).
	 * @param {Element} elm
	 * @param {String} att
	 * @param {String} val
	 */
	att : function ( elm, att, val ) {

		console.warn ( "Deprecated" );
		elm.setAttribute ( att, String ( val ));
		return elm;
	},
	
	/**
	 * Set element text (this will likely be removed).
	 * @param {Element} elm
	 * @param {String} txt
	 */
	text : function ( elm, txt ) {

		console.warn ( "Deprecated" );
		elm.textContent = txt;
	},

	/**
	 * Parse HTML string to DOM element in given document context.
	 * TODO: parent element awareness when inserted in document :)
	 * @param {Document} doc
	 * @param {String} html
	 * @returns {Element}
	 */
	parse : function ( doc, html ) {

		if ( doc.nodeType === Node.DOCUMENT_NODE ) {
			return new gui.HTMLParser ( doc ).parse ( html )[ 0 ]; // TODO: parseOne?
		} else {
			throw new TypeError ( this + ".parse() expects a Document" );
		}
	},

	/**
	 * Associate DOM element to Spirit instance.
	 * @param {Element} element
	 * @returns {Spirit}
	 */
	animate : function ( element ) {
		
		return gui.Guide.animate ( element, this );
	},

	/**
	 * Create DOM element and associate Spirit instance.
	 * @param @optional {Document} doc
	 * @returns {Spirit}
	 */
	summon : function ( doc ) {
		
		doc = doc ? doc : document;
		return this.animate ( doc.createElement ( "div" ));
	},
	
	/**
	 * Assign plugin to prefix, checking for naming collision.
	 * @param {String} prefix
	 * @param {function} plugin Constructor for plugin
	 * @param {boolean} override Disable collision detection
	 */
	plugin : function ( prefix, plugin, override ) {
		
		/*
		 * Partly prepared for a scenario where spirits 
		 * may have been declared before plugins load.
		 */
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

	/**
	 * TODO: move to Spiritual EDB
	 * @type {String}
	 *
	script : null,
	*/

	/**
	 * TODO: move to Spiritual EDB.
	 * @param {Document} doc
	 * @returns {String}
	 *
	run : function ( doc ) {

		var func = edb.Function.get ( this.script, doc.defaultView );
		var args = Array.filter ( arguments, function ( e, i ) {
			return i > 0;
		});
		var html = func.apply ( {}, args );
		return this.animate ( this.parse ( doc, html ));
	}
	*/
	

}, { // STATICS (NON-RECURRING) ..................................................
	
	/**
	 * Hello.
	 * @param {gui.Spirit} spirit
	 * @returns {gui.Spirit}
	 */
	visible : function ( spirit ) {

		if ( spirit.life.invisible ) {
			this._visible ( spirit, true, spirit.life.entered );
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
			this._visible ( spirit, false, spirit.life.entered );
			spirit.css.add ( gui.CLASS_INVISIBLE );
		}
		return spirit;
	},

	/**
	 * Hello again.
	 * @param {gui.Spirit} spirit
	 * @param {boolean} show
	 * @param {boolean} subtree
	 */
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

	/**
	 * User to access property post destruction, 
	 * report that the spirit was terminated. 
	 */
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


/**
 * Spirit plugin.
 */
gui.SpiritPlugin = gui.Exemplar.create ( "gui.SpiritPlugin", Object.prototype, {
	
	/**
	 * Associated spirit.
	 * @type {gui.Spirit}
	 */
	spirit : null,
	
	/**
	 * Plugins may be designed to work without an associated spirit. 
	 * In that case, an external entity might need to define this. 
	 * @type {Global} Typically identical to this.spirit.window
	 */
	context : null,

	/**
	 * Construct
	 */
	onconstruct : function () {},
	
	/**
	 * Destruct.
	 */
	destruct : function () {},

	/**
	 * Implements DOM2 EventListener. Forwards to onevent().
	 * @param {Event} e
	 */
	handleEvent : function ( e ) {

		if ( gui.Type.isFunction ( this.onevent )) {
			this.onevent ( e );
		}
	},
	
	
	// Secrets ...........................................................
	
	/**
	 * Secret constructor. Can we identify the 
	 * spirit and it's associated window? Not, 
	 * then we are maybe inside a Web Worker.
	 * @param {gui.Spirit} spirit
	 */
	__construct__ : function ( spirit ) {
		
		this.spirit = spirit || null;
		this.context = spirit ? spirit.window : null;
	},
	
	/**
	 * Secret destructor. Catching stuff that 
	 * might be executed on a timed schedule.
	 */
	__destruct__ : function () {
		
		this.destruct ();
		if ( this.spirit !== null ) {
			Object.defineProperty ( this, "spirit", gui.Spirit.DENIED );
		}
	}
	

}, { // RECURRING STATICS ........................................

	/**
	 * By default constructed only when needed. 
	 * @type {Boolean}
	 */
	lazy : true,

	/**
	 * Plugins don't infuse.
	 */
	infuse : function () {

		throw new Error ( 
			'Plugins must use the "extend" method and not "infuse".'
		);
	}


}, { // STATICS ..................................................

	/**
	 * [experimental]
	 * @param {gui.SpiritPlugin} Plugin
	 * @param {String} prefix
	 * @param {gui.Spirit} spirit
	 */
	later : function ( Plugin, prefix, spirit, map ) {

		map [ prefix ] = true;

		Object.defineProperty ( spirit, prefix, {
			enumerable : true,
			configurable : true,
			get : function () {
				if ( map [ prefix ] === true ) {
					if ( prefix === "tween" ) {
						throw new Error ( "WHY?" );
					}
					map [ prefix ] = new Plugin ( spirit );
					map [ prefix ].onconstruct ();
				}
				return map [ prefix ];
			},
			set : function ( x ) {
				map [ prefix ] = x; // or what?
			}
		});
	
		// spirit [ prefix ] = new Plugin ( spirit );
	}

});


/**
 * Tracking event-type handlers. 
 * @extends {gui.SpiritPlugin}
 */
gui.SpiritTracker = gui.SpiritPlugin.extend ( "gui.SpiritTracker", {
	
	/**
	 * Bookkeeping assigned types and handlers.
	 * @type {Map<String,Array<object>}
	 */
	_xxx : null,
	
	/**
	 * Containing window's gui.signature.
	 * @type {String}
	 */
	_sig : null,
	
	/**
	 * Construction time.
	 * @param {Spirit} spirit
	 */
	onconstruct : function () {
		
		this._super.onconstruct ();
		this._sig = this.spirit.window.gui.signature;
		this._xxx = Object.create ( null );
	},
	
	/**
	 * TODO: Toggle type(s).
	 * @param {object} arg
	 * @returns {gui.SpiritTracker}
	 */
	toggle : function ( arg, checks ) {
		
		console.error ( "TODO: SpiritTracker#toggle" );
	},
	
	/**
	 * Contains handlers for type(s)? Note that handlers might 
	 * assert criterias other than type in order to be invoked.
	 * @param {object} arg
	 * @returns {boolean}
	 */
	contains : function ( arg ) {
		
		return this._breakdown ( arg ).every ( function ( type ) {
			return this._xxx [ type ];
		}, this );
		
	},
	
	/**
	 * TODO: what? 
	 */
	destruct : function () {
		
		this._super.destruct ();

		/*
		 * JsHint complains about this, but test stuff below!
		var type, list;
		for ( type in this._xxx ) {
			list = this._xxx [ type ];
			list.slice ( 0 ).forEach ( function ( checks ) {
				this._cleanup ( type, checks );
			}, this );
		}
		*/
	
		gui.Object.each ( this._xxx, function ( type, list ) {
			list.slice ( 0 ).forEach ( function ( checks ) {
				this._cleanup ( type, checks );
			}, this );
		}, this );
	},
	
	/**
	 * Isolated for subclass to overwrite.
	 * @param {String} type
	 * @param {Array<object>} checks
	 */
	_cleanup : function ( type, checks ) {
		
		if ( this._removechecks ( type, checks )) { 
			/* do cleanup here */ 
		}
	},
	
	
	// PRIVATE .....................................................
	
	/**
	 * Can add type of given checks?
	 * @param {String} type
	 * @param {Array<object>} checks
	 * @returns {boolean}
	 */
	_addchecks : function ( type, checks ) {
		
		var result = false;
		var list = this._xxx [ type ];
		if ( !list ) {
			list = this._xxx [ type ] = [];
			result = true;
		} else {
			result = !this._haschecks ( list, checks );
		}
		if ( result ) {
			list.push ( checks );
		}
		return result;
	},
	
	/**
	 * Can remove type of given checks?
	 * @param {String} type
	 * @param {Array<object>} checks
	 * @returns {boolean}
	 */
	_removechecks : function ( type, checks ) {
		
		var result = false;
		var list = this._xxx [ type ];
		if ( list ) {
			var index = this._checksindex ( list, checks );
			if ( index > -1 ) {
				list.remove ( index );
				if ( list.length === 0 ) {
					delete this._xxx [ type ];
				}
				result = true;
			}
		}
		return result;
	},
	
	/**
	 * Has list for type AND given checks?
	 * @param {String} type
	 * @param {Array<object>} checks 
	 */
	_containschecks : function ( type, checks ) {
		
		var result = false;
		var list = this._xxx [ type ];
		if ( list ) {
			//result = !this._haschecks ( list, checks );
			result = this._haschecks ( list, checks );
		}
		return result;
	},
	
	/**
	 * Has checks indexed?
	 * @param {Array<Array<object>>} list
	 * @param {Array<object>} checks
	 * @returns {boolean}
	 */
	_haschecks : function ( list, checks ) {
		
		var result = false;
		list.every ( function ( a ) {
			if ( a.every ( function ( b, i ) {
				return b === checks [ i ];
			})) {
				result = true;
			}
			return !result;
		});
		return result;
	},
	
	/**
	 * Get index of checks.
	 * @param {Array<Array<object>>} list
	 * @param {Array<object>} checks
	 * @returns {number}
	 */
	_checksindex : function ( list, checks ) {
		
		var result = -1;
		list.every ( function ( a, index ) {
			if ( a.every ( function ( b, i ) {
				return b === checks [ i ];
			})) {
				result = index;
			}
			return result === -1;
		});
		return result;
	},
	
	/**
	 * Resolve single argument into array (one or more entries).
	 * @param {object} arg
	 * @returns {Array<String>}
	 */
	_breakdown : function ( arg ) {
		
		var result = null;
		switch ( gui.Type.of ( arg )) {
			case "array" :
				result = arg;
				break;
			case "string" :
				result = arg.split ( " " );
				break;
		}
		return result;
	}
});


/**
 * SpiritLife is a non-bubbling event type 
 * that covers the life cycle of a spirit.
 * @see {gui.SpiritLifeTracker}
 * @param {gui.Spirit} target
 * @param {String} type
 */
gui.SpiritLife = function SpiritLife ( target, type ) {
	
	this.target = target;
	this.type = type;
};

gui.SpiritLife.prototype = {
	
	/**
	 * @type {gui.Spirit}
	 */
	target : null,
		
	/**
	 * @type {String}
	 */
	type : null,
	
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		
		return "[object gui.SpiritLife]";
	}
};


// STATICS .....................................

/*
 * Important milestones in the life of a spirit.
 * Feel free to add more for your custom spirit. 
 */
gui.SpiritLife.CONSTRUCT = "gui-life-construct";
gui.SpiritLife.CONFIGURE = "gui-life-configure";
gui.SpiritLife.ENTER = "gui-life-enter";
gui.SpiritLife.ATTACH = "gui-life-attach";
gui.SpiritLife.READY = "gui-life-ready";
gui.SpiritLife.SHOW = "gui-life-show";
gui.SpiritLife.HIDE = "gui-life-hide";
gui.SpiritLife.DETACH = "gui-life-detach";
gui.SpiritLife.EXIT	= "gui-life-exit";
gui.SpiritLife.DESTRUCT = "life-destruct";


/**
 * Tracking spirit life cycle events.
 * @extends {gui.SpiritTracker}
 */
gui.SpiritLifeTracker = gui.SpiritTracker.extend ( "gui.SpiritLifeTracker", {
	
	/**
	 * Spirit is constructed? This is almost certainly true by 
	 * the time you address the spirit.
	 * @type {boolean}
	 */
	constructed : false,
	
	/**
	 * TODO: EXPERIMENT...
	 * @type {boolean}
	 */
	configured : false,
	
	/**
	 * Is now or has ever been in page DOM?
	 * @type {boolean}
	 */
	entered : false,
	
	/**
	 * Is curently located in page DOM? 
	 * False whenever detached is true. 
	 * @type {boolean}
	 */
	attached : false,
	
	/**
	 * Is currently not located in page DOM? Note that this is initially 
	 * true until the spirit has been discovered and registered as attached.
	 * @type {boolean}
	 */
	detached : true,
	
	/**
	 * Is ready? If so, it implies that all descendant spirits are also ready.
	 * @type {boolean}
	 */
	ready : false,

	/**
	 * Not hidden.
	 * @type {boolean}
	 */
	visible : true,

	/**
	 * Not shown.
	 * @type {boolean}
	 */
	invisible : false,
	
	/**
	 * Spirit was in page DOM, but has now been removed (ie. it was 
	 * detached and not re-attached in the same execution stack). 
	 * This schedules the spirit for destruction.
	 * @type {boolean}
	 */
	exited : false,
	
	/**
	 * Is destructed? If true, don't try anything funny.
	 * @type {boolean}
	 */
	destructed : false,
	
	/**
	 * TODO: move declaration to super!
	 * @type {Map<String,Array<object>}
	 */
	_handlers : null,
	
	/**
	 * Construction time.
	 * @overloads {gui.SpiritTracker#construct}
	 */
	onconstruct : function () {
		
		this._super.onconstruct ();
		this._handlers = Object.create ( null );
	},
	
	/**
	 * Add one or more action handlers.
	 * @param {object} arg
	 * @param @optional {object} handler implements LifeListener interface, defaults to this.spirit
	 * @returns {gui.Spirit}
	 */
	add : function ( arg, handler ) {
		
		handler = handler ? handler : this.spirit;
		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._addchecks ( type, [ handler ])) {
				if ( !this._handlers [ type ]) {
					this._handlers [ type ] = [];
				}
				this._handlers [ type ].push ( handler );
			}
		}, this );
		
		return this.spirit;
	},
		
	/**
	 * Remove one or more action handlers.
	 * @param {object} arg
	 * @param @optional {object} handler implements LifeListener interface, defaults to spirit
	 * @returns {gui.Spirit}
	 */
	remove : function ( arg, handler ) {
		
		handler = handler ? handler : this.spirit;
		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._removechecks ( type, [ handler ])) {
				var index = this._handlers [ type ].indexOf ( type );
				this._handlers [ type ].remove ( index );
				if ( this._handlers [ type ].length === 0 ) {
					delete this._handlers [ type ];
				}
			}
		}, this );
		
		return this.spirit;
	},
	
	/**
	 * Dispatch type.
	 * @param {String} type
	 */
	dispatch : function ( type ) {
		
		var list = this._handlers [ type ];
		if ( list !== undefined ) {
			
			var life = new gui.SpiritLife ( this.spirit, type );
			list.forEach ( function ( handler ) {
				handler.onlife ( life );
			});
			
			/*
			 * Cleanup handlers for life cycle events that only occurs once.
			 */
			switch ( type ) {
				case gui.SpiritLife.ATTACH :
				case gui.SpiritLife.DETACH :
				case gui.SpiritLife.VISIBLE :
				case gui.SpiritLife.INVISIBLE :
					// may happen more than once
					break;
				default :
					delete this._handlers [ type ];
					break;
			}
		}
	}	
});

/*
 * Generate methods to update life cycle status:
 * 1) Update booleans entered, attached, detached etc.
 * 2) Dispatch life-event gui.SpiritLife.ATTACH etc.
 */
( function generatecode () {
	
	var states = {
		construct : gui.SpiritLife.CONSTRUCT,
		configure : gui.SpiritLife.CONFIGURE,
		enter : gui.SpiritLife.ENTER,
		attach : gui.SpiritLife.ATTACH,
		ready : gui.SpiritLife.READY,
		visible : gui.SpiritLife.VISIBLE,
		invisible : gui.SpiritLife.INVISIBLE,
		detach : gui.SpiritLife.DETACH,
		exit : gui.SpiritLife.EXIT,
		destruct : gui.SpiritLife.DESTRUCT
	};

	/*
	 * Prefix methods with "on", suffix booleans with "ed"
	 */
	gui.Object.each ( states, function ( state, event ) {
		gui.SpiritLifeTracker.addin ( "go" + state , function () {
			var prop = state;
			switch ( state ) {
				case "ready" :
				case "visible" :
				case "invisible" :
					break;
				default :
					prop += "ed";
					break;
			}
			this [ prop ] = true;
			switch ( state ) {
				case "enter" :
				case "attach" :
					this.detached = false;
					break;
				case "detach" :
					this.attached = false;
					break;
				case "visible" :
					this.invisible = false;
					break;
				case "invisible" :
					this.visible = false;
					break;
			}
			this.dispatch ( event );
		});
	});
	
})();

/*
 * Register plugin (not served in a module this plugin).
 */
gui.Spirit.plugin ( "life", gui.SpiritLifeTracker );


/**
 * Configures a spirit by attribute parsing.
 */
gui.SpiritConfig = gui.SpiritPlugin.extend ( "gui.SpiritConfig", {

	/**
	 * Mapping shorthands to expanded syntax.
	 * @type {Map<String,String>}
	 */
	map : null,

	/**
	 * Configure spirit by DOM attributes.
	 * TODO: reconfigure scenario
	 */
	configure : function () {
		
		this.spirit.att.all ().forEach ( function ( att ) {
			this.attribute ( this._lookup ( att.name ), att.value );
		}, this );
	},
	
	/**
	 * Parse single attribute in search for "gui." prefix
	 * @param {String} name
	 * @param {String} value
	 */
	attribute : function ( name, value ) {
		
		var prefix = "gui.",
			struct = this.spirit,
			success = true,
			prop = null,
			cuts = null;

		if ( name.startsWith ( prefix )) {
			
			name = name.split ( prefix )[ 1 ], prop = name;
			if ( name.indexOf ( "." ) >-1 ) {
				cuts = name.split ( "." );
				cuts.forEach ( function ( cut, i ) {
					if ( gui.Type.isDefined ( struct )) {
						if ( i < cuts.length - 1 ) {
							struct = struct [ cut ];
						} else {
							prop = cut;
						}
					} else {
						success = false;
					}
				});
			}
			
			if ( success && gui.Type.isDefined ( struct [ prop ])) {
				
				/*
				 * Autocast (string) value to an inferred type.
				 * "false" becomes boolean, "23" becomes number.
				 */
				value = gui.Type.cast ( value );
				if ( gui.Type.isFunction ( struct [ prop ])) {
					struct [ prop ] ( value );  // isInvocable....
				} else {
					struct [ prop ] = value;
				}
			} else {
				console.error ( "No definition for \"" + name + "\": " + this.spirit.toString ());
			}
		}
	},


	// PRIVATE .................................................................
	
	/**
	 * Lookup mapping for attribute name.
	 * @param {String} name
	 * @returns {String}
	 */
	_lookup : function ( name ) {

		var prefix = "gui.";
		if ( this.map && this.map.hasOwnProperty ( name )) {
			name = this.map [ name ];
			if ( !name.startsWith ( prefix )) {
				name = prefix + name;
			}
		}
		return name;
	}
});

/*
 * Register plugin.
 */
gui.Spirit.plugin ( "config", gui.SpiritConfig );


/**
 * SpiritAction.
 * @param {Spirit} target
 * @param {String} type
 * @param @optional {object} data
 * @param @optional {String} direction
 * @param @optional {boolean} global
 */
gui.Action = function SpiritAction ( target, type, data, direction, global ) {
	
	this.target = target;
	this.type = type;
	this.data = data;
	this.direction = direction || "ascending";
	this.global = global || false;
};

gui.Action.prototype = {
		
	/**
	 * Who dispatched the action?
	 * @type {gui.Spirit}
	 */
	target : null,
		
	/**
	 * Action type eg. "save-button-clicked".
	 * @type {String}
	 */
	type : null,
	
	/**
	 * Optional data of any type. 
	 * This might be undefined.
	 * @type {object}
	 */
	data : null,

	/**
	 * Is travelling up or down the DOM?
	 * Matches "ascending" or "descending".
	 * @type {String}
	 */
	derection : null,

	/**
	 * Traverse iframe boundaries?
	 * TODO: cross-domain actions.
	 * @type {boolean}
	 */
	global : false,
	
	/**
	 * Is action consumed?
	 * @type {boolean}
	 */
	isConsumed : false,
	
	/**
	 * Is action cancelled? 
	 * @type {boolean}
	 */
	isCancelled : false,
	
	/**
	 * Who consomed the action?
	 * @type {gui.Spirit}
	 */
	consumer : null,
	
	/**
	 * Block further ascend.
	 * @param @optional {Spirit} consumer
	 */
	consume : function ( consumer ) {
		
		this.isConsumed = true;
		this.consumer = consumer;
	},
	
	/**
	 * Consume and cancel the event. Note that it is 
	 * up to the dispatcher to honour cancellation!
	 * @param @optional {Spirit} consumer
	 */
	cancel : function ( consumer ) {
		
		this.isCancelled = true;
		this.consume ( consumer );
	},
	
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		
		return "[object gui.Action]";
	}
};

/**
 * @static
 * Dispatch SpiritAction ascending. The dispatching 
 * spirit will not onaction() its own action.
 * TODO: support custom gui.Action as only param.
 * TODO: common exemplar for action, broadcast etc?
 * @param {Spirit} target
 * @param {String} type
 * @param @optional {object} data
 * @param @optional {String} direction
 * @param @optional {boolean} global
 * @returns {gui.Action}
 */
gui.Action.dispatch = function dispatch ( target, type, data, direction, global ) {
	
	var action = new gui.Action ( target, type, data, direction, global );
	var crawler = new gui.Crawler ( gui.CRAWLER_ACTION );
	crawler.global = global || false;

	crawler [ direction || "ascend" ] ( target, {
		handleSpirit : function ( spirit ) {
			var directive = gui.Crawler.CONTINUE;
			if ( spirit.action.contains ( type )) {
				spirit.action.handle ( action );
				if ( action.isConsumed ) {
					directive = gui.Crawler.STOP;
					action.consumer = spirit;
				}
			}
			return directive;
		}
	});
	return action;
};


/**
 * Tracking actions.
 * @extends {gui.SpiritTracker}
 */
gui.ActionTracker = gui.SpiritTracker.extend ( "gui.ActionTracker", {

	/**
	 * Free slot for spirit to define any single type of action to dispatch. 
	 * @type {String}
	 */
	type : null,
	
	/**
	 * Free slot for spirit to define any single type of data to dispatch.
	 * @type {Object}
	 */
	data : null,
	
	/**
	 * Add one or more action handlers.
	 * @param {array|string} arg
	 * @param @optional {object|function} handler
	 * @returns {gui.ActionTracker}
	 */
	add : function ( arg, handler ) {
		
		if ( gui.Arguments.validate ( arguments, "array|string", "(object|function)" )) {
			handler = handler ? handler : this.spirit;
			if ( gui.Interface.validate ( gui.IActionHandler, handler )) {
				this._breakdown ( arg ).forEach ( function ( type ) {
					this._addchecks ( type, [ handler, this._global ]);
				}, this );
			}
		}
		return this;
	},
		
	/**
	 * Remove one or more action handlers.
	 * @param {object} arg
	 * @param @optional {object} handler
	 * @returns {gui.ActionTracker}
	 */
	remove : function ( arg, handler ) {
		
		if ( gui.Arguments.validate ( arguments, "array|string", "(object|function)" )) {
			handler = handler ? handler : this.spirit;
			if ( gui.Interface.validate ( gui.IActionHandler, handler )) {
				this._breakdown ( arg ).forEach ( function ( type ) {
					this._removechecks ( type, [ handler, this._global ]);
				}, this );
			}
		}
		return this;
	},

	/**
	 * Add global action handler(s).
	 * @param {object} arg
	 * @param @optional {object} handler
	 * @returns {gui.ActionTracker}
	 */
	addGlobal : function ( arg, handler ) {

		return this._globalize ( function () {
			return this.add ( arg, handler );
		});
	},

	/**
	 * Remove global action handler(s).
	 * @param {object} arg
	 * @param @optional {object} handler
	 * @returns {gui.ActionTracker}
	 */
	removeGlobal : function ( arg, handler ) {

		return this._globalize ( function () {
			return this.remove ( arg, handler );
		});
	},


	// DISPATCH ...................................................
	
	/**
	 * Dispatch type(s) ascending by default.
	 * @alias {gui.ActionTracker#ascend}
	 * @param {String} type
	 * @param @optional {object} data
	 * @param @optional {String} direction "ascend" or "descend"
	 * @returns {gui.Action}
	 */
	dispatch : function ( type, data, direction ) {
		
		if ( gui.Arguments.validate ( arguments, "string", "(*)", "(string)" )) {
			return gui.Action.dispatch ( 
				this.spirit, 
				type, 
				data, 
				direction || "ascend",
				this._global 
			);
		}
	},

	/**
	 * Dispatch type(s) ascending.
	 * @alias {gui.ActionTracker#dispatch}
	 * @param {object} arg
	 * @param @optional {object} data
	 * @returns {gui.Action}
	 */
	ascend : function ( arg, data ) {

		return this.dispatch ( arg, data, "ascend" );
	},

	/**
	 * Dispatch type(s) descending.
	 * @alias {gui.ActionTracker#dispatch}
	 * @param {object} arg
	 * @param @optional {object} data
	 * @returns {gui.Action}
	 */
	descend : function ( arg, data ) {

		return this.dispatch ( arg, data, "descend" );
	},

	/**
	 * Dispatch type(s) globally (ascending).
	 * @param {object} arg
	 * @param @optional {object} data
	 * @param @optional {String} direction
	 * @returns {gui.Action}
	 */
	dispatchGlobal : function ( arg, data ) {

		return this._globalize ( function () {
			return this.dispatch ( arg, data );
		});
	},

	/**
	 * Dispatch type(s) globally ascending.
	 * @param {object} arg
	 * @param @optional {object} data
	 * @returns {gui.Action}
	 */
	ascendGlobal : function ( arg, data ) {

		return this._globalize ( function () {
			return this.ascend ( arg, data );
		});
	},

	/**
	 * Dispatch type(s) globally descending.
	 * @param {object} arg
	 * @param @optional {object} data
	 * @returns {gui.Action}
	 */
	descendGlobal : function ( arg, data ) {

		return this._globalize ( function () {
			return this.descend ( arg, data );
		});
	},
	
	/**
	 * Handle action. The dispatching spirit will not see it's own actions
	 * @see {gui.Action#dispatch}
	 * @param {gui.Action} action
	 */
	handle : function ( action ) {
		
		var list = this._xxx [ action.type ];
		if ( list ) {
			list.forEach ( function ( checks ) {
				var handler = checks [ 0 ];
				var matches = checks [ 1 ] === action.global;
				if ( matches && handler !== action.target ) {
					handler.onaction ( action );
				}
			});
		}
	},


	// PRIVATE ....................................................

	/**
	 * Global mode?
	 * @type {boolean}
	 */
	_global : false,

	/**
	 * Execute operation in global mode.
	 * @param {function} operation
	 * @returns {object}
	 */
	_globalize : function ( operation ) {

		this._global = true;
		var res = operation.call ( this );
		this._global = false;
		return res;
	},

	/**
	 * Remove delegated handlers. 
	 * TODO: verify that this works
	 * @overwrites {gui.SpiritTracker#_cleanup}
	 * @param {String} type
	 * @param {Array<object>} checks
	 */
	_cleanup : function ( type, checks ) {

		if ( this._removechecks ( type, checks )) {
			var handler = checks [ 0 ], global = checks [ 1 ];
			if ( global ) {
				this.removeGlobal ( type, handler );
			} else {
				this.remove ( type, handler );
			}
		}
	}

});


/**
 * Interface ActionHandler.
 */
gui.IActionHandler = {
		
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {

		return "[object IActionHandler]";
	},

	/**
	 * Handle action.
	 * @param {gui.Action} action
	 */
	onaction : function ( action ) {}
};


/**
 * Methods to read and write DOM attributes on spirit element
 * @param {Spirit} spirit
 */
gui.SpiritAtt = gui.SpiritPlugin.extend ( "gui.SpiritAtt", {

	/**
	 * Get single element attribute cast to an inferred type.
	 * @param {String} att
	 * @returns {object} String, boolean or number
	 */
	get : function ( name ) {
		
		return gui.Type.cast ( 
			this.spirit.element.getAttribute ( name )
		);
	},
	
	/**
	 * Set single element attribute (use null to remove).
	 * @param {String} name
	 * @param {String} value
	 * @returns {Spirit}
	 */
	set : function ( name, value ) {
		
		if ( value === null ) {
			this.del ( name );
		} else if ( !this.__suspended__ ) {
			this.spirit.element.setAttribute ( name, String ( value ));
		}
		return this;
	},

	/**
	 * Element has attribute?
	 * @param {String} att
	 * @returns {boolean}
	 */
	has : function ( name ) {
	
		return this.spirit.element.getAttribute ( name ) !== null;
	},
	
	/**
	 * Remove element attribute.
	 * @param {String} att
	 */
	del : function ( name ) {
		
		if ( !this.__suspended__ ) {
			this.spirit.element.removeAttribute ( name );
		}
	},

	/**
	 * Collect attributes as an array (of DOMAttributes).
	 * @returns {Array<Attr>}
	 */
	all : function () {

		return Array.map ( this.spirit.element.attributes, function ( att ) {
			return att;
		});
	},

	/**
	 * Get all attributes as hashmap type object. 
	 * Values are converted to an inferred type.
	 * @returns {Map<String,String>} 
	 */
	getup : function () {

		var map = Object.create ( null );
		this.all ().forEach ( function ( att ) {
			map [ att.name ] = gui.Type.cast ( att.value );
		});
		return map;
	},

	/**
	 * Invoke multiple attributes update via hashmap 
	 * argument. Use null value to remove an attribute.
	 * @param {Map<String,String>} 
	 */
	setup : function ( map ) {
		
		gui.Object.each ( map, function ( name, value ) {
			this.set ( name, value );
		}, this );
	},


	// SECRETS .........................................

	/**
	 * Disable attribute updates.
	 * @type {boolean}
	 */
	__suspended__ : false,

	/**
	 * Suspend attribute updates for the duration of 
	 * the action (kind of framework internal stuff).
	 * @param {function} action
	 * @retruns {object}
	 */
	__suspend__ : function ( action ) {
		this.__suspended__ = true;
		var res = action.apply ( this, arguments );
		this.__suspended__ = false;
		return res;
	}
	
});


/**
 * Spirit box object (performant now: http://code.google.com/p/v8/issues/detail?id=1239)
 */
gui.SpiritBox = gui.SpiritPlugin.extend ( "gui.SpiritBox", {
	
	width   : 0, // width
	height  : 0, // height
	localX  : 0, // X relative to positioned ancestor
	localY  : 0, // Y relative to positioned ancestor
	pageX   : 0, // X relative to the full page (includes scrolling)
	pageY   : 0, // Y telative to the full page (includes scrolling)	  
	clientX : 0, // X relative to the viewport (excludes scroll offset)
	clientY : 0, // Y relative to the viewport (excludes scroll offset)
	globalX : 0, // TODO
	globalY : 0, // TODO,
	screenX : 0, // TODO,
	screenY : 0  // TODO
	
});

Object.defineProperties ( gui.SpiritBox.prototype, {
	
	/**
	 * Get width.
	 * @returns {number}
	 */
	width : {
		get : function () {
			return this.spirit.element.offsetWidth;
		}
	},
	
	/**
	 * Get height.
	 * @returns {number}
	 */
	height : {
		get : function () {
			return this.spirit.element.offsetHeight;
		}
	},
	
	/**
	 * Get offsetParent left.
	 * @returns {number}
	 */
	localX : {
		get : function () {
			return this.spirit.element.offsetLeft;
		}
	},
	
	/**
	 * Get offsetParent top.
	 * @returns {number}
	 */
	localY : {
		get : function () {
			return this.spirit.element.offsetTop;
		}
	},
	
	/**
	 * @returns {number}
	 */
	pageX : {
		get : function () {
			return this.clientX + gui.Client.scrollRoot.scrollLeft;
		}
	},
	
	/**
	 * @returns {number}
	 */
	pageY : {
		get : function () {
			
			return this.clientY + gui.Client.scrollRoot.scrollTop;
		}
	},
	
	/**
	 * TODO
	 * @returns {number}
	 */
	globalX : {
		get : function () {
			console.warn ( "TODO: gui.SpiritBox.globalX" );
			return null;
		}
	},
	
	/**
	 * TODO
	 * @returns {number}
	 */
	globalY : {
		get : function () {
			console.warn ( "TODO: gui.SpiritBox.globalY" );
			return null;
		}
	},
	
	/**
	 * @returns {number}
	 */
	clientX : {
		get : function () {
			return this.spirit.element.getBoundingClientRect ().left;
		}
	},
	
	/**
	 * @returns {number}
	 */
	clientY : {
		get : function () {
			return this.spirit.element.getBoundingClientRect ().top;
		}
	}
});


/**
 * Broadcast.
 * @param {Spirit} target
 * @param {String} type
 * @param {object} data
 * @param {boolean} global
 */
gui.Broadcast = function ( target, type, data, global ) {
	
	this.target = target;
	this.type = type;
	this.data = data;
	this.isGlobal = global;
};

gui.Broadcast.prototype = {
	
	/**
	 * Broadcast target.
	 * @type {gui.Spirit}
	 */
	target : null,
		
	/**
	 * Broadcast type.
	 * @type {String}
	 */
	type : null,
	
	/**
	 * Broadcast data.
	 * @type {object}
	 */
	data : null,
	
	/**
	 * Global broadcast?
	 * TODO: rename "global"
	 * @type {boolean}
	 */
	isGlobal : false,

	/**
	 * Data is JSON encoded?
	 * @type {boolean}
	 */
	isEncoded : false,
	
	/**
	 * Identification.
	 */
	toString : function () {
		
		return "[object gui.Broadcast]";
	}
};


// STATICS .........................................................

/**
 * @private @static
 * Tracking global handlers (mapping broadcast types to list of handlers).
 * @type {Map<String,<Array<object>>}
 */
gui.Broadcast._globals = Object.create ( null );

/**
 * @private @static
 * Tracking local handlers (mapping gui.signatures to broadcast types to list of handlers).
 * @type {Map<String,Map<String,Array<object>>>}
 */
gui.Broadcast._locals = Object.create ( null );

/**
 * @static
 * mapcribe handler to message.
 * @param {object} message String or array of strings
 * @param {object} handler Implements BroadcastListener
 * @param @optional {String} sig
 */
gui.Broadcast.add = function ( message, handler, sig ) {
	
 return	this._add ( message, handler, sig );
};

/**
 * @static
 * Unmapcribe handler from broadcast.
 * @param {object} message String or array of strings
 * @param {object} handler
 * @param @optional {String} sig
 */
gui.Broadcast.remove = function ( message, handler, sig ) {
	
	return this._remove ( message, handler, sig );
};

/**
 * @static
 * Publish broadcast in local window scope.
 * TODO: queue for incoming dispatch (finish current message first).
 * @param {Spirit} target
 * @param {String} type
 * @param {object} data
 * @param {String} sig
 * @returns {gui.Broadcast}
 */
gui.Broadcast.dispatch = function ( target, type, data, sig ) {
	
	return this._dispatch ( target, type, data, sig );
};

/**
 * @static
 * mapcribe handler to message globally.
 * @param {object} message String or array of strings
 * @param {object} handler Implements BroadcastListener
 */
gui.Broadcast.addGlobal = function ( message, handler ) {

	return this._add ( message, handler );
};

/**
 * @static
 * Unmapcribe handler from global broadcast.
 * @param {object} message String or array of strings
 * @param {object} handler
 */
gui.Broadcast.removeGlobal = function ( message, handler ) {
	
	return this._remove ( message, handler );
};

/**
 * @static
 * Dispatch broadcast in global scope (all windows).
 * TODO: queue for incoming dispatch (finish current first).
 * TODO: Handle remote domain iframes ;)
 * @param {Spirit} target
 * @param {String} type
 * @param {object} data
 */
gui.Broadcast.dispatchGlobal = function ( target, type, data ) {

	return this._dispatch ( target, type, data );
};

/**
 * @static
 * mapcribe handler to message(s).
 * @param {Array<string>|string} type
 * @param {object|function} handler Implements BroadcastListener
 * @param @optional {String} sig
 * @returns {function}
 */
gui.Broadcast._add = function ( type, handler, sig ) {
	
	if ( gui.Arguments.validate ( arguments, "array|string", "object|function", "(string)" )) {
		if ( gui.Interface.validate ( gui.IBroadcastHandler, handler )) {
			if ( gui.Type.isArray ( type )) {
				type.forEach ( function ( t ) {
					this._add ( t, handler, sig );
				}, this );
			} else {
				var map;
				if ( sig ) {
					map = this._locals [ sig ];
					if ( !map ) {
						map = this._locals [ sig ] = Object.create ( null ); 
					}
				} else {
					map = this._globals;
				}
				if ( !map [ type ]) {
					map [ type ] = [];
				}
				var array = map [ type ];
				if ( array.indexOf ( handler ) === -1 ) {
					array.push ( handler );
				}
			}
		}
	}
	return this;
};

/**
 * @static
 * @param {object} message String or array of strings
 * @param {object} handler
 * @param @optional {String} sig
 * @returns {function}
 */
gui.Broadcast._remove = function ( message, handler, sig ) {
	
	if ( gui.Interface.validate ( gui.IBroadcastHandler, handler )) {
		if ( gui.Type.isArray ( message )) {
			message.forEach ( function ( mes ) {
				this._remove ( mes, handler, sig );
			}, this );
		} else {
			var array = sig ?
					this._locals [ sig ][ message ] :
					this._globals [ message ];
			var index = array.indexOf ( handler );
			if ( index > -1 ) {
				array.remove ( index );
			}
		}
	}
	return this;
};

/**
 * @static
 * @param {Spirit} target
 * @param {String} type
 * @param {object} data
 * @param @optional {String} sig
 */
gui.Broadcast._dispatch = function ( target, type, data, sig ) {
	
	var global = !gui.Type.isString ( sig );
	var broadcast = new gui.Broadcast ( target, type, data, global );
	var map = global ? this._globals : this._locals [ sig ];
	if ( map ) {
		var handlers = map [ type ];
		if ( handlers ) {
			handlers.slice ().forEach ( function ( handler, index ) {
				handler.onbroadcast ( broadcast );
			});
		}
	}
};


/**
 * Tracking broadcasts.
 * @extends {gui.SpiritTracker}
 */
gui.BroadcastTracker = gui.SpiritTracker.extend ( "gui.BroadcastTracker", {
	
	/**
	 * Add one or more broadcast handlers.
	 * @param {object} arg
	 * @param @optional {object} handler implements BroadcastListener (defaults to spirit)
	 * @returns {gui.BroadcastTracker}
	 */
	add : function ( arg, handler ) {
		
		handler = handler ? handler : this.spirit;
		var sig = this._global ? null : this._sig;
		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._addchecks ( type, [ handler, this._global ])) {
				if ( this._global ) {
					gui.Broadcast.addGlobal ( type, handler );
				} else {
					gui.Broadcast.add ( type, handler, sig );
				}
			}
		}, this );
		return this;
	},
	
	/**
	 * Remove one or more broadcast handlers.
	 * @param {object} arg
	 * @param @optional {object} handler implements BroadcastListener (defaults to spirit)
	 * @returns {gui.BroadcastTracker}
	 */
	remove : function ( arg, handler ) {
		
		handler = handler ? handler : this.spirit;
		var sig = this._global ? null : this._sig;
		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._removechecks ( type, [ handler, this._global ])) {
				if ( this._global ) {
					gui.Broadcast.removeGlobal ( type, handler );
				} else {
					gui.Broadcast.remove ( type, handler, sig );
				}
			}
		}, this );
		return this;
	},

	/**
	 * Dispatch type(s).
	 * @param {object} arg
	 * @param @optional {object} data
	 * @returns {gui.Broadcast}
	 */
	dispatch : function ( arg, data ) {
		
		var result = null;
		var sig = this._global ? null : this._sig;
		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._global ) {
				result = gui.Broadcast.dispatchGlobal ( this.spirit, type, data );
			} else {
				result = gui.Broadcast.dispatch ( this.spirit, type, data, sig );	
			}
		}, this );
		return result;
	},

	/**
	 * Add handlers for global broadcast(s).
	 * @param {object} arg
	 * @param @optional {object} handler implements BroadcastListener (defaults to spirit)
	 * @returns {gui.BroadcastTracker}
	 */
	addGlobal : function ( arg, handler ) {
		
		return this._globalize ( function () {
			return this.add ( arg, handler );
		});
	},
	
	/**
	 * Add handlers for global broadcast(s).
	 * @param {object} arg
	 * @param @optional {object} handler implements BroadcastListener (defaults to spirit)
	 * @returns {gui.BroadcastTracker}
	 */
	removeGlobal : function ( arg, handler ) {
		
		return this._globalize ( function () {
			return this.remove ( arg, handler );
		});
	},
	
	/**
	 * Dispatch type(s) globally.
	 * @param {object} arg
	 * @param @optional {object} data
	 * @returns {gui.Broadcast}
	 */
	dispatchGlobal : function ( arg, data ) {
		
		return this._globalize ( function () {
			return this.dispatch ( arg, data );
		});
	},

	// PRIVATES ...................................................................

	/**
	 * Global mode?
	 * @type {boolean}
	 */
	_global : false,

	/**
	 * Execute operation in global mode.
	 * @param {function} operation
	 * @returns {object}
	 */
	_globalize : function ( operation ) {

		this._global = true;
		var res = operation.call ( this );
		this._global = false;
		return res;
	},

	/**
	 * Remove delegated handlers. 
	 * @overwrites {gui.SpiritTracker#_cleanup}
	 * @param {String} type
	 * @param {Array<object>} checks
	 */
	_cleanup : function ( type, checks ) {
		
		if ( this._removechecks ( type, checks )) {
			var handler = checks [ 0 ], global = checks [ 1 ];
			var sig = global ? null : this._sig;
			if ( global ) {
				gui.Broadcast.removeGlobal ( type, handler );
			} else {
				gui.Broadcast.remove ( type, handler, this._sig );
			}
		}
	}

});

/**
 * TODO: get rid of this.
 *
function GETRIDOFTHIS () {

	var temp_backup = {

		/**
		 * Encode all broadcasted objects as JSON strings. This will come in 
		 * handy if we plan to use cross-domain broadcasting at some point.
		 * @returns {gui.BroadcastTracker}
		 *
		encode : function () {

			this._encoding = true;
			return this;
		},

		/**
		 * Don't encode broadcasted objects as JSON.
		 * @returns {gui.BroadcastTracker}
		 *
		normalize : function () {
			
			this._encoding = false;
			return this;
		},
		
		/**
		 * Auto-encode broadcast data as JSON string. This will conjure an exception if the 
		 * object could not be stringified. Strings, numbers and booleans are left untouched.
		 * @type {Boolean}
		 *
		_encoding : false,

		/**
		 * JSON encode broadcast data?
		 * @param {object} data
		 * @returns {String}
		 *
		_encode : function ( data ) {

			if ( this._encoding ) {
				var type = gui.Type.of ( data );
				switch ( type ) {
					case "string" :
					case "number" :
					case "boolean" :
						break;
					case "object" :
					case "array" :
						var debug = this.window.gui.debug;
						try {
							data = JSON.stringify ( data, null, debug ? "\t" : null ); // TODO: catch parse exception
						} catch ( jsonex ) {
							throw new Error ( "JSON encoding of broadcast failed: " + jsonex );
						}
						break;
					default :
						throw new Error ( "Will not JSON encode broadcast of type: " + type );
				}
			}
			return data;
		}
	};
}
*/


/**
 * Interface BroadcastHandler.
 */
gui.IBroadcastHandler = {
		
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {

		return "[object IBroadcastHandler]";
	},

	/**
	 * Handle broadcast.
	 * @param {gui.Broadcast} broadcast
	 */
	onbroadcast : function ( broadcast ) {}
};


/**
 * Spirit styling studio.
 * @param {gui.Spirit} spirit
 */
gui.SpiritCSS = gui.SpiritPlugin.extend ( "gui.SpiritCSS", {
	
	/**
	 * Set single element.style.
	 * @param {String} prop
	 * @param {String} val
	 * @returns {gui.Spirit}
	 */
	set : function ( prop, val ) {
		
		gui.SpiritCSS.set ( this.spirit.element, prop, val );
		return this.spirit;
	},
	
	/**
	 * Get single element.style; see also compute method.
	 * @param {String} prop
	 * @returns {String}
	 */
	get : function ( prop ) {
		
		return gui.SpiritCSS.get ( this.spirit.element, prop );
	},
	
	/**
	 * Compute runtime style.
	 * @param {String} prop
	 * @returns {String}
	 */
	compute : function ( prop ) {
		
		return gui.SpiritCSS.compute ( this.spirit.element, prop );
	},
	
	/**
	 * Set multiple styles via key value map.
	 * @param {Map<String,String>} map
	 * @returns {gui.Spirit}
	 */
	style : function ( map ) {
		
		gui.SpiritCSS.style ( this.spirit.element, map );
		return this.spirit;
	},
	 
	/**
	 * Get or set (full) className.
	 * @param @optional {String} name
	 * @returns {object} gui.Spirit or String
	 */
	name : function ( name ) {
		
		var result = this.spirit.element.className;
		if ( name !== undefined ) {
			this.spirit.element.className = name;
			result = this.spirit;
		}
		return result;
	},
	
	/**
	 * classList.add
	 * @param {String} name
	 * @returns {gui.Spirit}
	 */
	add : function ( name ) {
		
		gui.SpiritCSS.add ( this.spirit.element, name );
		return this.spirit;
	},
	
	/**
	 * classList.remove
	 * @param {String} name
	 * @returns {gui.Spirit}
	 */
	remove : function ( name ) {
		
		gui.SpiritCSS.remove ( this.spirit.element, name );
		return this.spirit;
	},
	
	/**
	 * classList.toggle
	 * @param {String} name
	 * @returns {gui.Spirit}
	 */
	toggle : function ( name ) {
		
		gui.SpiritCSS.toggle ( this.spirit.element, name );
		return this.spirit;
	},
	
	/**
	 * classList.contains
	 * @param {String} name
	 * @returns {boolean}
	 */
	contains : function ( name ) {
		
		return gui.SpiritCSS.contains ( this.spirit.element, name );
	}, 

	/**
	 * Spirit element mathes selector?
	 * @param {String} selector
	 * @returns {boolean}
	 */
	matches : function ( selector ) {

		return gui.SpiritCSS.matches ( this.spirit.element, selector );
	}
	
	
}, {}, { // STATICS .............................................................

	/**
	 * @static
	 * Non-matching vendors removed after first run. First entry 
	 * gets to stay since it represents the unprefixed property.
	 * @type {Array<String>}
	 */
	_vendors : [ "", "-webkit-", "-moz-", "-ms-", "-o-" ],

	/**
	 * @static
	 * _supports Element.classList?
	 * @type {boolean}
	 */
	_supports : document.documentElement.classList !== undefined,

	/**
	 * @static
	 * classList.add
	 * @param {Element} element
	 * @param {String} names
	 */
	add : function ( element, name ) {
		
		if ( name.indexOf ( " " ) >-1 ) {
			name = name.split ( " " );
		}
		if ( Array.isArray ( name )) {
			name.forEach ( function ( n ) {
				this.add ( element, n );
			}, this );
		} else {
			if ( this._supports ) {
				element.classList.add ( name );
			} else {
				var now = element.className.split ( " " );
				if ( now.indexOf ( name ) === -1 ) {
					now.push ( name );
					element.className = now.join ( " " );
				}
			}
		}
	},

	/**
	 * @static
	 * classList.remove
	 * @param {Element} element
	 * @param {String} name
	 * @returns {gui.SpiritCSS}
	 */
	remove : function ( element, name ) {
		
		if ( name.indexOf ( " " ) >-1 ) {
			name = name.split ( " " );
		}
		if ( Array.isArray ( name )) {
			name.forEach ( function ( n ) {
				this.remove ( element, n );
			}, this );
		} else {
			if ( this._supports ) {
				element.classList.remove ( name );
			} else {
				var now = element.className.split ( " " );
				var idx = now.indexOf ( name );
				if ( idx > -1 ) {
					now.remove ( idx );
				}
				element.className = now.join ( " " );
			}
		}
	},

	/**
	 * @static
	 * classList.toggle
	 * @param {Element} element
	 * @param {String} name
	 * @returns {gui.SpiritCSS}
	 */
	toggle : function ( element, name ) {
		
		if ( this._supports ) {
			element.classList.toggle ( name );
		} else {
			if ( this.contains ( element, name )) {
				this.remove ( element, name );
			} else {
				this.add ( element, name );
			}
		}
	},

	/**
	 * @static
	 * classList.contains
	 * @param {Element} element
	 * @param {String} name
	 * @returns {boolean}
	 */
	contains : function ( element, name ) {
		
		var result = false;
		if ( this._supports ) {
			result = element.classList.contains ( name );
		} else {
			result = element.className.indexOf ( name ) >-1;
		}
		return result;
	},

	/**
	 * @static
	 * Set single element.style property (use style() for multiple)
	 * @param {Element}
	 * @param {String} prop
	 * @returns {gui.SpiritCSS}
	 */
	set : function ( element, prop, value ) {

		// TODO: also automate shorthands such as "10px 20px 10px 20px"
		if ( gui.Type.isNumber ( value )) {
			value = ( this._shorthands [ prop ] || "@" ).replace ( "@", value );
		}

		value = String ( value );
		switch ( prop ) {
			case "float": 
				prop = "cssFloat";
				break;
			default :
				value = this._normval ( element, value );
				prop = this._normprop ( element, prop );
				break;
		}
		element.style [ prop ] = value;
		return this;
	},
	
	/**
	 * @static
	 * TODO: Get element.style property; if this has been set. 
	 * Not to be confused with compute() for computedStyle!!!
	 * @param {Element}
	 * @param {String} prop
	 * @returns {String}
	 */
	get : function ( element, prop ) {

		return this._normval ( element.style [
			this._normprop ( element, prop )
		]);
	},

	/**
	 * @static
	 * Set multiple element.style properties.
	 * @param {object} thing Spirit or element.
	 * @param {Map<String,String>} styles
	 * @returns {object} Spirit or element
	 */
	style : function ( thing, styles ) {
		
		var element = thing instanceof gui.Spirit ? thing.element : thing;
		gui.Object.each ( styles, function ( prop, value ) {
			this.set ( element, prop, value );
		}, this );
		return thing;
	},

	/**
	 * @static
	 * Compute runtime style.
	 * @param {object} thing Spirit or element.
	 * @param {String} prop
	 * @returns {String}
	 */
	compute : function ( thing, prop ) {
		
		var element = thing instanceof gui.Spirit ? thing.element : thing;
		var doc = element.ownerDocument, win = doc.defaultView;
		prop = this._standardcase ( this._normprop ( element, prop ));
		return win.getComputedStyle ( element, null ).getPropertyValue ( prop );
	},

	/**
	 * Node matches CSS selector?
	 * @param {Node} node
	 * @param {String} selector
	 * @returns {boolean}
	 */
	matches : function ( node, selector ) {
		
		return node [ this._matchmethod ]( selector );
	},

	/**
	 * @static
	 * CamelCase string.
	 * @param {String} string
	 * @returns {String}
	 */
	_camelcase : function ( string ) {
		
		return string.replace ( /-([a-z])/ig, function ( all, letter ) {
			return letter.toUpperCase();
		});
	},

	/**
	 * @static
	 * standard-css-notate CamelCased string.
	 * @param {String} string
	 * @returns {String}
	 */
	_standardcase : function ( string ) {
		
		return string.replace ( /[A-Z]/g, function ( all, letter ) {
			return "-" + string.charAt ( letter ).toLowerCase ();
		});
	},	

	/**
	 * @static 
	 * Setter shorthands will autosuffix properties that require units 
	 * in support of the syntax: this.css.width = 300; // no method()
	 * TODO: add tons of things to this list
	 * @type {Map<String,String>
	 */
	_shorthands : {
			 
		top : "@px",
		right : "@px",
		bottom : "@px",
		left : "@px",
		width	: "@px",
		height : "@px",
		maxWidth : "@px",
		maxHeight : "@px",
		minWidth : "@px",
		minHeight : "@px",
		textIndent : "@px",
		fontWeight : "@",
		opacity : "@",
		zIndex : "@",
		position : "@",
		display : "@",
		visibility : "@"
	},

	/*
	 * Normalize declaration value.
	 * @param {String} value
	 * @returns {value}
	 */
	_normval : function ( element, value ) {
		
		var vendors = this._vendors;
		if ( value && value.contains ( "-beta-" )) {
			var parts = [];
			value.split ( ", " ).forEach ( function ( part ) {
				if (( part = part.trim ()).startsWith ( "-beta-" )) {
					vendors.every ( function ( vendor ) {
						var test = this._camelcase ( part.replace ( "-beta-", vendor ));
						if ( element.style [ test ] !== undefined ) {
							if ( vendors.length > 2 ) {
								this._vendors = [ "", vendor ];
							}
							parts.push ( part.replace ( "-beta-", vendor ));
							return false;
						}
						return true;
					 }, this );		
				} else {
					parts.push ( part );
				}
			}, this );
			value = parts.join ( "," );
		}
		return value;
	},

	/*
	 * Normalize declaration property.
	 * @param {Element} element
	 * @param {String} prop
	 * @returns {String}
	 */
	_normprop : function ( element, prop, xxx ) {
		
		var vendors = this._vendors, fixt = prop;
		if ( true ) {
			if ( prop.startsWith ( "-beta-" )) {
				vendors.every ( function ( vendor ) {
					var test = this._camelcase ( prop.replace ( "-beta-", vendor ));
					if ( element.style [ test ] !== undefined ) {
						if ( vendors.length > 2 ) {
							this._vendors = [ "", vendor ]; // TODO: at startup
						}
						fixt = test;
						return false;
					}
					return true;
				}, this );
			} else {
				fixt = this._camelcase ( fixt );
			}
		}
		return fixt;
	},

	/**
	 * Lookup vendors "matchesSelector" method.
	 * @type {String}
	 */ 
	_matchmethod : ( function () {

		var match = null, root = document.documentElement;
		[ 
			"mozMatchesSelector", 
			"webkitMatchesSelector", 
			"msMatchesSelector", 
			"oMatchesSelector", 
			"matchesSelector" 
		].every ( function ( method ) {
			if ( gui.Type.isDefined ( root [ method ])) {
				match = method;
			}
			return match === null;
		});
		return match;
	})()
	
});

/*
 * Generate shorthand getters/setters for top|left|width|height etc.
 */
( function shorthands () {
	
	function getset ( prop ) {
		Object.defineProperty ( gui.SpiritCSS.prototype, prop, {
			enumerable : true,
			configurable : true,
			get : function get () {
				return parseInt ( this.get ( prop ), 10 );
			},
			set : function set ( val ) {
				this.set ( prop, val );
			}
		});
	}

	var shorts = gui.SpiritCSS._shorthands;
	for ( var prop in shorts ) {
		if ( shorts.hasOwnProperty ( prop )) {
			getset ( prop );
		}
	}
	
})();


/**
 * DOM query and manipulation.
 * TODO: implement missing stuff
 * TODO: performance for all this
 */
gui.SpiritDOM = gui.SpiritPlugin.extend ( "gui.SpiritDOM", {
	
	/**
	 * Get or set element id.
	 * @param @optional {String} id
	 * @returns {object} String or gui.Spirit
	 */
	id : function ( id ) {
		
		var res = this;
		if ( id !== undefined ) {
			this.spirit.element.id = id;
		} else {
			id = this.spirit.element.id;
			res = id ? id : null;
		}
		return res;
	},

	/** 
	 * Get spirit element tagname; or magically create element of given tagname.
	 * @param {String} name If present, create an element
	 * @param @optional {String} namespace (TODO)
	 */
	tag : function ( name ) {

		var res = null;
		if ( name ) {
			res = this.spirit.document.createElement ( name );
		} else {
			res = this.spirit.element.localName;
		}
		return res;
	},
	
	/**
	 * Get or set element title (tooltip).
	 * @param @optional {String} title
	 * @returns {String}
	 */
	title : function ( title ) {
		
		var element = this.spirit.element;
		if ( gui.Type.isDefined ( title )) {
			element.title = title ? title : "";
		}
		return element.title;
	},
	
	/**
	 * Is positioned in page DOM? Otherwise plausible 
	 * createElement or documentFragment scenario.
	 * @returns {boolean}
	 */
	embedded : function () {

		return gui.SpiritDOM.embedded ( this.spirit.element );
	},

	/**
	 * Get or set element markup.
	 * @param @optional {String} html
	 * @param @optional {String} position Insert adjecant HTML
	 * @returns {object} String or gui.Spirit (returns the spirit when setting)
	 */
	html : function ( html, position ) {
		
		var res = this.spirit, element = res.element;
		if ( gui.Type.isString ( html )) {
			if ( position ) {
				element.insertAdjacentHTML ( position, html ); // TODO: spiritualize this :)
			} else {
				gui.SpiritDOM.html ( element, html );
			}			
		} else {
			res = element.innerHTML;
		}
		return res;
	},
	
	/**
	 * Empty spirit subtree.
	 * @returns {gui.Spirit}
	 */
	empty : function () {
		
		return this.html ( "" );
	},
	
	/**
	 * Get or set element textContent.
	 * @param @optional {String} text
	 * @returns {object} String or gui.Spirit
	 */
	text : function ( text ) {
		
		var elm = this.spirit.element;
		if ( gui.Type.isString ( text )) {
			elm.textContent = text;
		}
		return elm.textContent;
	},

	/**
	 * Clone spirit element.
	 * @return {Element}
	 */
	clone : function () {

		return this.spirit.element.cloneNode ( true );
	},
	
	
	// Visibility ...................................................................
	
	/**
	 * TODO: keep this updated!
	 * @type {boolean}
	 */
	apparent : true,
	
	/**
	 * Show spirit element, recursively informing descendants.
	 */
	show : function () {
		
		this.spirit.css.remove("_gui-invisible");
		this.spirit.visible ();
	},
	
	/**
	 * Hide spirit element, recursively informing descendants.
	 */
	hide : function () {
		
		this.spirit.css.add("_gui-invisible");
		this.spirit.invisible ();
	},	
	
	// PRIVATES .....................................................................
	
	/**
	 * TODO: Explain custom "this" keyword in selector.
	 * @param {String} selector
	 * @returns {String}
	 */
	_qualify : function ( selector ) {
		
		return gui.SpiritDOM._qualify ( selector, this.spirit.element );
	}
	
	
}, {}, { // STATICS ...............................................................

	/**
	 * @static
	 * Match custom "this" keyword in CSS selector. We use this to start 
	 * selector expressions with "this>*" to find immediate child, but 
	 * maybe we should look into the spec for something instead. The goal 
	 * here is to the make lookup indenpendant of spirit.element tagname.
	 * @type {RegExp}
	 */
	_thiskeyword : /^this|,this/g, // /^this\W|,this\W|^this$/g
	
	/**
	 * Spiritual-aware innerHTML, special setup for WebKit.
	 * @param {Element} element
	 * @param @optional {String} markup
	 */
	html : function ( element, markup ) {
		
		var guide = gui.Guide;
		if ( element.nodeType === Node.ELEMENT_NODE ) {
			if ( gui.Type.isString ( markup )) {

				// parse markup to node(s)
				var nodes = new gui.HTMLParser ( 
					element.ownerDocument 
				).parse ( markup, element );

				// detach spirits and remove old nodes
				// append new nodes and attach spirits
				guide.detachSub ( element );
				guide.suspend ( function () {
					gui.Observer.suspend ( element, function () {
						while ( element.firstChild ) { // TODO: why hasChildNodes() fail in Aurora?
							element.removeChild ( element.firstChild );
						}
						nodes.forEach ( function ( node ) {
							element.appendChild ( node );
						});
					});
				});
				guide.attachSub ( element );
			}
		} else {
			// throw new TypeError ();
		}
		return element.innerHTML; // TODO: skip this step on setter
	},

	/**
	 * Spiritual-aware outerHTML, special setup for WebKit.
	 * @param {Element} element
	 * @param @optional {String} markup
	 */
	outerHtml : function ( element, markup ) {

		var res = element.outerHTML;
		var guide = gui.Guide;
		if ( element.nodeType ) {
			if ( gui.Type.isString ( markup )) {

				// parse markup to node(s) - TODO: can outerHTML carry multiple nodes?
				var nodes = new gui.HTMLParser ( 
					element.ownerDocument 
				).parse ( markup, element );

				var parent = element.parentNode;
				guide.detach ( element );
				guide.suspend ( function () {
					gui.Observer.suspend ( parent, function () {
						while ( nodes.length ) {
							parent.insertBefore ( nodes.pop (), element );
						}
						parent.removeChild ( element );
					});
				});
				guide.attachSub ( parent ); // TODO: optimize
				res = element; // bad API design goes here...
			}
		} else {
			throw new TypeError ();
		}
		return res; // TODO: skip this step on setter
	},
	
	/**
	 * @static
	 * Get ordinal position of element within container.
	 * @param {Element} element
	 * @returns {number}
	 */
	ordinal : function ( element ) {
		
		var result = 0; 
		var node = element.parentNode.firstElementChild;
		while ( node !== null ) {
			if ( node === element ) {
				break;
			} else {
				node = node.nextElementSibling;
				result ++;
			}
		}
		return result;
	},

	/**
	 * Is node in found in page DOM? Otherwise probable createElement scenario.
	 * TODO: comprehend https://developer.mozilla.org/en/JavaScript/Reference/Operators/Bitwise_Operators#Example:_Flags_and_bitmasks
	 * @param {Element} element
	 * @returns {boolean}
	 */
	embedded : function ( node ) {

		node = node instanceof gui.Spirit ? node.element : node;
		var check = Node.DOCUMENT_POSITION_CONTAINS + Node.DOCUMENT_POSITION_PRECEDING;
		return node.compareDocumentPosition ( node.ownerDocument ) === check;
	},

	/**
	 * @static
	 * Get list of all elements that matches a selector.
	 * Optional type argument filters to spirits of type.
	 * @param {Node} node
	 * @param {String} selector
	 * @param @optional {function} type
	 * @returns {Array<object>} List of Element or gui.Spirit
	 */
	qall : function ( node, selector, type ) {
		
		selector = gui.SpiritDOM._qualify ( selector, node );
		var result = gui.Type.list ( node.querySelectorAll ( selector ));
		if ( type ) {
			result = result.filter ( function ( el )  {
				return el.spirit && el.spirit instanceof type;
			}).map ( function ( el ) {
				return el.spirit;
			});
		}
		return result;
	},
	
	/**
	 * @static
	 * Replace proprietary "this" keyword in CSS selector with element nodename.
	 * TODO: There was something about a "scope" or similar keyword in CSS4??? 
	 * @param {String} selector
	 * @param {Node} node
	 * @returns {String}
	 */
	_qualify : function ( selector, node ) {
		
		var result = selector.trim ();
		switch ( node.nodeType ) {
			case Node.ELEMENT_NODE :
				result = selector.replace ( gui.SpiritDOM._thiskeyword, node.localName );
				break;
			case Node.DOCUMENT_NODE :
				// TODO: use ":root" for something?
				break;
		}
		return result;
	}
		
});


// GENERATED METHODS ........................................................................

/*
 * CSS query methods accept a CSS selector and an optional spirit constructor 
 * as arguments. They return a spirit, an element or an array of either.
 */
gui.Object.each ({

	/**
	 * Get first descendant element matching selector. Optional type argument returns 
	 * spirit for first element to be associated to spirit of this type. Note that 
	 * this may not be the first element to match the selector. Also note that type 
	 * performs slower than betting on <code>this.dom.q ( "tagname" ).spirit</code>
	 * @param {String} selector
	 * @param @optional {function} type Spirit constructor (eg. gui.Spirit)
	 * @returns {object} Element or gui.Spirit
	 */
	q : function ( selector, type ) {
		
		var result = null;
		selector = this._qualify ( selector );
		if ( type ) {
			result = this.qall ( selector, type )[ 0 ] || null;
		} else {
			result = this.spirit.element.querySelector ( selector );
		}
		return result;
	},
	
	/**
	 * Get list of all descendant elements that matches a selector. Optional type  
	 * arguments returns instead all associated spirits to match the given type.
	 * @param {String} selector
	 * @param @optional {function} type Spirit constructor
	 * @returns {Array<object>} List of Element or gui.Spirit
	 */
	qall : function ( selector, type ) {
		
		selector = this._qualify ( selector );
		return gui.SpiritDOM.qall ( this.spirit.element, selector, type );
	},
	
	/**
	 * Same as q, but scoped from the document root. Use wisely.
	 * @param {String} selector
	 * @param @optional {function} type Spirit constructor
	 * @returns {object} Element or gui.Spirit
	 */
	qdoc : function ( selector, type ) {
		
		var root = this.spirit.document.documentElement;
		return root.spirit.dom.q.apply ( root.spirit.dom, arguments );
	},
	
	/**
	 * Same as qall, but scoped from the document root. Use wisely.
	 * @param {String} selector
	 * @param @optional {function} type Spirit constructor
	 * returns {Array<object>} List of Element or gui.Spirit
	 */
	qdocall : function ( selector, type ) {
		
		var root = this.spirit.document.documentElement;
		return root.spirit.dom.qall.apply ( root.spirit.dom, arguments );
	}
	
	/*
	 * Adding methods to gui.SpiritDOM.prototype
	 * @param {String} name
	 * @param {function} method
	 */
},  function addin ( name, method ) {
	
	gui.SpiritDOM.addin ( name, function () {
		var selector = arguments [ 0 ], type = arguments [ 1 ];
		if ( gui.Type.isString ( selector )) {
			if ( arguments.length === 1 || gui.Type.isFunction ( type )) {
				return method.apply ( this, arguments );
			} else {
				type = gui.Type.of ( type );
				throw new TypeError ( "Unknown spirit for query: " + name + "(" + selector + "," + type + ")" );
			}
		} else {
			throw new TypeError ( "Bad selector for query: " + name + "(" + selector + ")" );
		}
	});
});


/*
 * DOM navigation methods accept an optional spirit constructor as 
 * argument. They return a spirit, an element or an array of either.
 */
gui.Object.each ({

	/**
	 * Next element or next spirit of given type.
	 * @param @optional {function} type Spirit constructor
	 * @returns {object} Element or gui.Spirit
	 */
	next : function ( type ) {
		
		var result = null, 
			spirit = null,
			el = this.spirit.element;
		if ( type ) {
			while (( el = el.nextElementSibling ) !== null ) {
				spirit = el.spirit;
				if ( spirit !== null && spirit instanceof type ) {
					result = spirit;
					break;
				}
			}
		} else {
			result = el.nextElementSibling;
		}
		return result;
	},
	
	/**
	 * Previous element or previous spirit of given type.
	 * @param @optional {function} type
	 * @returns {object} Element or gui.Spirit
	 */
	previous : function ( type ) {
		
		var result = null,
			spirit = null,
			el = this.spirit.element;
		if ( type ) {
			while (( el = el.previousElementSibling ) !== null ) {
				spirit = el.spirit;
				if ( spirit !== null && spirit instanceof type ) {
					result = spirit;
					break;
				}
			}
		} else {
			result = el.previousElementSibling;
		}
		return result;
	},
	
	/**
	 * Hello.
	 * @param {function} type
	 * @returns {object} Element or gui.Spirit
	 */
	first : function ( type ) {
		
		var result = null,
			spirit = null,
			el = this.spirit.element.firstElementChild;
		if ( type ) {
			while ( result === null && el !== null ) {
				spirit = el.spirit;
				if ( spirit !== null && spirit instanceof type ) {
					result = spirit;
				}
				el = el.nextElementSibling;
			}
		} else {
			result = el; 
		}
		return result;
	},
	
	/**
	 * Hello.
	 * @param {function} type
	 * @returns {object} Element or gui.Spirit
	 */
	last : function ( type ) {
		
		var result = null,
			spirit = null,
			el = this.spirit.element.lastElementChild;
		if ( type ) {
			while ( result === null && el !== null ) {
				spirit = el.spirit;
				if ( spirit !== null && spirit instanceof type ) {
					result = spirit;
				}
				el = el.previoustElementSibling;
			}
		} else {
			result = el; 
		}
		return result;
	},
	
	/**
	 * Hello.
	 * @param {function} type
	 * @returns {object} Element or gui.Spirit
	 */
	parent : function ( type ) {
		
		var result = this.spirit.element.parentNode;
		if ( type ) {
			var spirit = result.spirit;
			if ( spirit && spirit instanceof type ) {
				result = spirit;
			} else {
				result = null;
			}
		}
		return result;
	},
	
	/**
	 * Hello.
	 * @param {function} type
	 * @returns {object} Element or gui.Spirit
	 */
	child : function ( type ) {
		
		var result = null,
			spirit = null,
			el = this.spirit.element.firstElementChild;
		if ( el && type ) {
			while ( el !== null && result === null ) {
				spirit = el.spirit;
				if ( spirit && spirit instanceof type ) {
					result = spirit;
				}
				el = el.nextElementSibling;
			}
		} else {
			result = el;
		}
		return result;
	},
	
	/**
	 * TODO: just use this.element.children :)
	 * @param {function} type
	 * @returns {Array<object>} Elements or gui.Spirits
	 */
	children : function ( type ) {
		
		var result = [],
			me = this.spirit.element,
			el = me.firstElementChild;
		if ( el ) {
			while ( el !== null ) {
				result.push ( el );
				el = el.nextElementSibling; 
			}
			if ( type ) {
				result = result.filter ( function ( el )  {
					return el.spirit && el.spirit instanceof type;
				}).map ( function ( el ) {
					return el.spirit;
				});
			}
		}
		return result;
	},
	
	/**
	 * First ancestor of given type.
	 * @param {function} type
	 * @returns {object} Element or gui.Spirit
	 */
	ancestor : function ( type ) {
		
		var result = this.parent ();
		if ( type ) {
			result = null;
			new gui.Crawler ().ascend ( this.spirit.element, {
				handleSpirit : function ( spirit ) {
					if ( spirit instanceof type ) {
						result = spirit;
						return gui.Crawler.STOP;
					}
				}
			});
		}
		return result;
	},
	
	/**
	 * All ancestors of given type.
	 * @param {function} type
	 * @returns {Array<object>} Elements or gui.Spirits
	 */
	ancestors : function ( type ) {
		
		var result = [];
		var crawler = new gui.Crawler ();
		if ( type ) {	
			crawler.ascend ( this.element, {
				handleSpirit : function ( spirit ) {
					if ( spirit instanceof type ) {
						result.push ( spirit );
					}
				}
			});
		} else {
			crawler.ascend ( this.element, {
				handleElement : function ( el ) {
					result.push ( el );
				}
			});
		}
		return result;
	},
	
	/**
	 * First descendant of given type.
	 * @param {function} type
	 * @returns {object} Element or gui.Spirit
	 */
	descendant : function ( type ) {
		
		var result = this.child ();
		var me = this.spirit.element;
		if ( type ) {
			new gui.Crawler ().descend ( me, {
				handleSpirit : function ( spirit ) {
					if ( spirit instanceof type ) {
						if ( spirit.element !== me ) {
							result = spirit;
							return gui.Crawler.STOP;
						}
					}
				}
			});
		}
		return result;
	},
	
	/**
	 * Descendants of given type.
	 * @param {function} type
	 * @returns {Array<object>} Elements or gui.Spirits
	 */
	descendants : function ( type ) {
		
		var result = [];
		var me = this.spirit.element;
		new gui.Crawler ().descend ( me, {
			handleElement : function ( element ) {
				if ( !type && element !== me ) {
					result.push ( element );
				}
			},
			handleSpirit : function ( spirit ) {
				if ( type && spirit instanceof type ) {
					if ( spirit.element !== me ) {
						result.push ( spirit );
					}
				}
			}
		});
		return result;
	}
	
	/*
	 * Adding methods to gui.SpiritDOM.prototype
	 * @param {String} name
	 * @param {function} method
	 */
},  function addin ( name, method ) {
	
	gui.SpiritDOM.addin ( name, function ( type ) {
		if ( !gui.Type.isDefined ( type ) || gui.Type.isFunction ( type )) {
			return method.apply ( this, arguments );
		} else {
			type = gui.Type.of ( type );
			throw new TypeError ( "Unknown spirit for query: " + name + "(" + type + ")" );
		}
	});
});


/*
 * DOM insertion methods accept one argument: one spirit OR one element OR an array of either or both. 
 * The input argument is returned as given. This allows for the following one-liner to be constructed: 
 * this.something = this.dom.append ( gui.SomeThingSpirit.summon ( this.document )); // imagine 15 more
 */
gui.Object.each ({

	/**
	 * Append spirit OR element OR array of either.
	 * @param {object} things Complicated argument
	 * @returns {object} Returns the argument
	 */
	append : function ( things ) {
		
		var els = things, element = this.spirit.element;
		els.forEach ( function ( el ) {
			element.appendChild ( el );
		});
	},
	
	/**
	 * Prepend spirit OR element OR array of either.
	 * @param {object} things Complicated argument
	 * @returns {object} Returns the argument
	 */
	prepend : function ( things ) {
		
		var els = things, element = this.spirit.element, first = element.firstChild;
		els.reverse ().forEach ( function ( el ) {
			element.insertBefore ( el, first );
		});
	},
	
	/**
	 * Insert spirit OR element OR array of either before this spirit.
	 * @param {object} things Complicated argument
	 * @returns {object} Returns the argument
	 */
	before : function ( things ) {
		
		var els = things, target = this.spirit.element, parent = target.parentNode;
		els.reverse ().forEach ( function ( el ) {
			parent.insertBefore ( el, target );
		});
	},
	
	/**
	 * Insert spirit OR element OR array of either after this spirit.
	 * @param {object} things Complicated argument
	 * @returns {object} Returns the argument
	 */
	after : function ( things ) {
		
		var els = things, target = this.spirit.element, parent = target.parentNode;
		els.forEach ( function ( el ) {
			parent.insertBefore ( el, target.nextSibling );
		});
	},

	/**
	 * Removing this spirit from it's parent container. Note that this will 
	 * schedule destruction of the spirit unless it gets reinserted somewhere. 
	 * Also note that this method is called on the spirit, not on the parent.
	 * @returns {gui.Spirit}
	 */
	remove : function () {
		
		var parent = this.spirit.element.parentNode;
		parent.removeChild ( this.spirit.element );
		return this;
	},

	/**
	 * Replace the spirit with something else. This may nuke the spirit.
	 * Note that this method is called on the spirit, not on the parent.
	 * @param {object} things Complicated argument. 
	 * @returns {object} Returns the argument
	 */
	replace : function ( things ) {

		this.after ( things );
		this.remove ();
	}
	
	/*
	 * Adding methods to gui.SpiritDOM.prototype. These methods come highly overloaded.
	 * 1) convert input to array of one or more elements
	 * 2) confirm array of elements
	 * 3) invoke the method
	 * 4) return the input
	 * @param {String} name
	 * @param {function} method
	 */

}, function addin ( name, method ) {
	
	gui.SpiritDOM.addin ( name, function ( things ) {
		var elms = Array.map ( gui.Type.list ( things ), function ( thing ) {
			return thing && thing instanceof gui.Spirit ? thing.element : thing;
		});
		if ( elms.every ( function ( elm ) { 
			return gui.Type.isNumber ( elm.nodeType );
		})) {
			method.call ( this, elms );
			return things;
		} else {
			throw new TypeError ( "Bad input for method: " + name + "(" + things + ")" );	
		}
	});
});



/**
 * Tracking DOM events.
 * TODO: Corresponding static class for non-plugin use. 
 * @extends {gui.SpiritTracker}
 */
gui.EventTracker = gui.SpiritTracker.extend ( "gui.EventTracker", {
   
	/**
	 * Add one or more DOM event handlers.
	 * TODO: Don't assume spirit handler
	 * TODO: reverse handler and capture args
	 * @param {object} arg String, array or whitespace-separated-string
	 * @param @optional {object} target Node, Window or XmlHttpRequest. Defaults to spirit element
	 * @param @optional {object} handler implements EventListener interface, defaults to spirit
	 * @param @optional {boolean} capture Defaults to false
	 * @returns {gui.Spirit}
	 */
	add : function ( arg, target, handler, capture ) {
		
		target = target ? target : this.spirit.element;
		handler = handler ? handler : this.spirit;
		capture = capture ? capture : false;
		if ( target instanceof gui.Spirit ) {
			target = target.element;
		}
		if ( gui.Interface.validate ( gui.IEventHandler, handler )) {
			var checks = [ target, handler, capture ];
			this._breakdown ( arg ).forEach ( function ( type ) {
				if ( this._addchecks ( type, checks )) {
					target.addEventListener ( type, handler, capture );
				}
			}, this );
		}
		return this;
	},
		
	/**
	 * Add one or more DOM event handlers.
	 * @param {object} arg String, array or whitespace-separated-string
	 * @param @optional {object} target Node, Window or XmlHttpRequest. Defaults to spirit element
	 * @param @optional {object} handler implements EventListener interface, defaults to spirit
	 * @param @optional {boolean} capture Defaults to false
	 */
	remove : function ( arg, target, handler, capture ) {
		
		target = target ? target : this.spirit.element;
		handler = handler ? handler : this.spirit;
		capture = capture ? capture : false;
		if ( target instanceof gui.Spirit ) {
			target = target.element;
		}
		if ( gui.Interface.validate ( gui.IEventHandler, handler )) {
			var checks = [ target, handler, capture ];
			this._breakdown ( arg ).forEach ( function ( type ) {
				if ( this._removechecks ( type, checks )) {
					target.removeEventListener ( type, handler, capture );
				}
			}, this );
		}
		return this;
	},
	
	/**
	 * Toggle one or more DOM event handlers.
	 * @param {object} arg String, array or whitespace-separated-string
	 * @param @optional {object} target Node, Window or XmlHttpRequest. Defaults to spirit element
	 * @param @optional {object} handler implements EventListener interface, defaults to spirit
	 * @param @optional {boolean} capture Defaults to false
	 */
	toggle : function ( arg, target, handler, capture ) {
		
		target = target ? target : this.spirit.element;
		handler = handler ? handler : this.spirit;
		capture = capture ? capture : false;
		if ( target instanceof gui.Spirit ) {
			target = target.element;
		}
		var checks = [ target, handler, capture ];
		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._contains ( type, checks )) {
				this.add ( type, target, handler, capture );
			} else {
				this.remove ( type, target, handler, capture );
			}
		}, this );
		return this;
	}

});


/**
 * Interface EventHandler. This matches DOM interface EventListener. 
 * If possible, we would like to forward events to method onevent().
 * http://www.w3.org/TR/DOM-Level-3-Events/#interface-EventListener
 */
gui.IEventHandler = {
	
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {

		return "[object IEventHandler]";
	},

	/**
	 * Handle event. This is likely to forward the event to onevent()
	 * @param {Event} e
	 */
	handleEvent : function ( e ) {}
};


/**
 * Use a SpiritTick for timed events. 
 * TODO: global versus local ticks
 * @param {Spirit} target
 * @param {String} type
 * @param {object} data
 */
gui.Tick = function ( type ) {
	
	this.type = type;
};

gui.Tick.prototype = {
	
	/**
	 * @type {String}
	 */
	type : null,
	
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		
		return "[object gui.Tick]";
	}
};


// STATICS .........................................................................

/**
 * Identification.
 * @returns {String}
 */
gui.Tick.toString = function () {
	
	return "[function gui.Tick]";
};

gui.Tick._global = {
	types : Object.create ( null ),
	handlers : Object.create ( null )
};

gui.Tick._local = Object.create ( null );


// LOCAL ....................................................................

/**
 * @static
 * Add handler for tick.
 * @param {object} type String or array of strings
 * @param {object} handler
 * @param @optional {boolean} one Remove handler after on tick of this type?
 * @returns {function}
 */
gui.Tick.add = function ( type, handler, sig ) {
	
	if ( !sig ) {
		console.error ( "SIG REQUIRED for tick of type: " + type );
	}

	if ( gui.Arguments.validate ( arguments, "string|array", "object|function", "string" )) {
		return this._add ( type, handler, false, sig );
	}
};

/**
 * @static
 * Add auto-removing handler for tick.
 * @param {object} type String or array of strings
 * @param {object} handler
 * @returns {function}
 */
gui.Tick.one = function ( type, handler, sig ) {

	if ( !sig ) {
		console.error ( "SIG REQUIRED for tick of type: " + type );
	}
	
	if ( gui.Arguments.validate ( arguments, "string|array", "object|function", "string" )) {
		return this._add ( type, handler, true, sig );
	}
};

/**
 * Quickfix!
 * @param {function} action
 * @param @optional {object} thisp
 */
gui.Tick.next = function ( action, thisp ) {

	setImmediate ( function () {
		action.call ( thisp );
	});
};

/**
 * @static
 * Remove handler for tick.
 * @param {object} type String or array of strings
 * @param {object} handler
 * @returns {function}
 */
gui.Tick.remove = function ( type, handler, sig ) {
	
	if ( !sig ) {
		console.error ( "SIG REQUIRED for tick of type: " + type );
	}

	return this._remove ( type, handler, sig );
};

/**
 * @static
 * Start repeated tick of given type.
 * @param {String} type Tick type
 * @param {number} time Time in milliseconds
 * @returns {function}
 */
gui.Tick.start = function ( type, time ) {
	
	console.error ( "TODO:gui.Tick.start" );
	return;

	/* TODO: something like this...
	if ( time && !this._global.types [ type ]) {
		this._global.types [ type ] = setInterval ( function () {
			gui.Tick.dispatch ( type );
		}, time );
	}
	return this;
	*/
};

/**
 * @static
 * Stop repeated tick of specified type.
 * @param {String} type Tick type
 * @returns {function}
 */
gui.Tick.stop = function ( type ) {
	
	// TODO

	console.error ( "TODO: gui.Tick#stop" );
	return this;
};

/**
 * @static
 * Dispatch tick now or in specified time. Omit time to 
 * dispatch now. Zero resolves to next available thread.
 * @param {String} type
 * @param @optional {number} time
 * @returns {gui.Tick}
 */
gui.Tick.dispatch = function ( type, time, sig ) {
	
	if ( !sig ) {
		console.error ( "SIG REQUIRED for tick of type: " + type );
	}
	
	return this._dispatch ( type, time, sig );
};


// GLOBAL ...................................................................

/**
 * @static
 * Add handler for tick.
 * @param {object} type String or array of strings
 * @param {object} handler
 * @returns {function}
 */
gui.Tick.addGlobal = function ( type, handler ) {

	if ( gui.Arguments.validate ( arguments, "string|array", "object|function" )) {
		return this._add ( type, handler, false, null );
	}
};

/**
 * @static
 * Add self-removing handler for tick.
 * @param {object} type String or array of strings
 * @param {object} handler
 * @returns {function}
 */
gui.Tick.oneGlobal = function ( type, handler ) {
	
	return this.add ( type, handler, true, null );
};

/**
 * @static
 * Remove handler for tick.
 * @param {object} type String or array of strings
 * @param {object} handler
 * @returns {function}
 */
gui.Tick.removeGlobal = function ( type, handler ) {
	
	return this._remove ( type, handler, null );
};

/**
 * @static
 * Dispatch tick now or in specified time. Omit time to 
 * dispatch now. Zero resolves to next available thread.
 * @param {String} type
 * @param @optional {number} time
 * @returns {gui.Tick}
 */
gui.Tick.dispatchGlobal = function ( type, time ) {
	
	return this._dispatch ( type, time, null );
};


// PRIVATE .........................................

gui.Tick._add = function ( type, handler, one, sig ) {

	if ( gui.Type.isArray ( type )) {
		type.forEach ( function ( t ) {
			this._add ( t, handler, one, sig );
		}, this );
	} else {
		var list, index;
		var map = sig ? this._local [ sig ] : this._global;
		if ( !map ) {
			map = this._local [ sig ] = {
				types : Object.create ( null ),
				handlers : Object.create ( null )
			};
		}
		list = map.handlers [ type ];
		if ( !list ) {
			list = map.handlers [ type ] = [];
		}
		index = list.indexOf ( handler );
		if ( index < 0 ) {
			index = list.push ( handler ) - 1;
		}
		if ( one ) {
			list._one = list._one || {};
			list._one [ index ] = true;
		}
	}
	return this;
};

/*
gui.Tick._add = function ( type, handler, one, sig ) {

	if ( gui.Type.isArray ( type )) {
		type.forEach ( function ( t ) {
			this.add ( t, handler, one, sig );
		}, this );
	} else {
		var list, index;
		
		
		if ( sig ) {



			var local = this._local [ sig ];
			if ( !local ) {
				local = this._local [ sig ] = Object.create ( null );
			}
			list = local.handlers [ type ];
		} else {
			list = this._global.handlers [ type ];
			if ( !list ) {
				list = this._global.handlers [ type ] = [];
			}
		}
		index = list.indexOf ( handler );
		if ( index < 0 ) {
			index = list.push ( handler ) - 1;
		}
		if ( one ) {
			list._one = list._one || {};
			list._one [ index ] = true;
		}
	}
	return this;
};
*/

gui.Tick._remove = function ( type, handler, sig ) {

	if ( gui.Type.isArray ( type )) {
		type.forEach ( function ( t ) {
			this.remove ( t, handler, sig );
		}, this );
	} else {
		var map = sig ? this._local [ sig] : this._global;
		var list = map.handlers [ type ];
		if ( list ) {
			list.remove ( list.indexOf ( handler ));
			if ( list.length === 0 ) {
				delete map.handlers [ type ];
			}
		}
	}
	return this;
};

gui.Tick._dispatch = function ( type, time, sig ) {

	var map = sig ? this._local [ sig ] : this._global;
	var types = map.types;

	var tick = new gui.Tick ( type );

	if ( !gui.Type.isDefined ( time )) {	
		var list = map.handlers [ type ];
		if ( list ) {
			list.slice ().forEach ( function ( handler, i ) {
				handler.ontick ( tick );
				if ( list._one && list._one [ i ]) {
					delete list._one [ i ];
					list.remove ( i );
				}
			}, this );
		}
	} else if ( !types [ type ]) {
		var that = this, id = null;
		if ( time === 0 ) {
			id = setImmediate ( function () {
				that._dispatch ( type, undefined, sig );
				delete types [ type ];
			});
		} else {
			id = setTimeout ( function () {
				that._dispatch ( type, undefined, sig );
				delete types [ type ];
			}, time );
		}	
		types [ type ] = id;
	}
	return tick;
};


/**
 * Tracking timed events.
 * TODO: Global timed events.
 * @extends {gui.SpiritTracker}
 */
gui.TickTracker = gui.SpiritTracker.extend ( "gui.TickTracker", {
	
	/**
	 * Add one or more tick handlers.
	 * @param {object} arg
	 * @param @optional {object} handler
	 * @param @optional {boolean} one Remove handler after on tick of this type?
	 * @returns {gui.TickTracker}
	 */
	add : function ( arg, handler, one ) {
		
		handler = handler ? handler : this.spirit;
		if ( gui.Interface.validate ( gui.ITickHandler, handler )) {
			this._breakdown ( arg ).forEach ( function ( type ) {
				if ( this._addchecks ( type, [ handler, this._global ])) {
					this._add ( type, handler, false );
				}
			}, this );
		}
		return this;
	},
	
	/**
	 * Add handler for single tick of given type(s).
	 * TODO: This on ALL trackers :)
	 * @param {object} arg
	 * @param @optional {object} handler
	 * @returns {gui.TickTracker}
	 */
	one : function ( arg, handler ) {
		
		return this.add ( arg, handler, true );
	},

	/**
	 * Quickfix.
	 * @param {function} action 
	 */
	next : function ( action ) {

		gui.Tick.next ( action, this.spirit );
	},
		
	/**
	 * Remove one or more tick handlers.
	 * @param {object} arg
	 * @param @optional {object} handler implements ActionListener interface, defaults to spirit
	 * @returns {gui.TickTracker}
	 */
	remove : function ( arg, handler ) {
		
		handler = handler ? handler : this.spirit;
		if ( gui.Interface.validate ( gui.ITickHandler, handler )) {
			this._breakdown ( arg ).forEach ( function ( type ) {
				if ( this._removechecks ( type, [ handler, this._global ])) {
					gui.Tick.remove ( type, handler );
				}
			}, this );
		}
		return this;
	},
	
	/**
	 * Dispatch tick after given time.
	 * @param {String} type
	 * @param {number} time Milliseconds (zero is setImmediate)
	 * @returns {gui.Tick}
	 */
	dispatch : function ( type, time ) {
		
		return this._dispatch ( type, time || 0 );
	},
	
	
	// PRIVATES ..................	...........................................................
	
	/**
	 * Global mode?
	 * @type {boolean}
	 */
	_global : false,

	/**
	 * Add handler.
	 */
	_add : function ( type, handler, one ) {

		var sig = this.spirit.signature;
		if ( one ) {
			if ( this._global ) {
				gui.Tick.oneGlobal ( type, handler );
			} else {
				gui.Tick.one ( type, handler, sig );
			}
		} else {
			if ( this._global ) {
				gui.Tick.addGlobal ( type, handler );
			} else {
				gui.Tick.add ( type, handler, sig );
			}
		}
	},

	/**
	 * Remove handler.
	 */
	_remove : function ( type, handler ) {

		var sig = this.spirit.signature;
		if ( this._global ) {
			gui.Tick.removeGlobal ( type, handler );
		} else {
			gui.Tick.remove ( type, handler, sig );
		}
	},

	/**
	 * Dispatch.
	 */
	_dispatch : function ( type, time ) {

		var tick, sig = this.spirit.signature;
		if ( this._global ) {
			tick = gui.Tick.dispatchGlobal ( type, time );
		} else {
			tick = gui.Tick.dispatch ( type, time, sig );
		}
		return tick;
	},

	/**
	 * Remove delegated handlers. 
	 * @overloads {gui.SpiritTracker#_cleanup}
	 * @param {String} type
	 * @param {Array<object>} checks
	 */
	_cleanup : function ( type, checks ) {
		
		var handler = checks [ 0 ];
		var bglobal = checks [ 1 ];
		if ( this._remove ( type, [ handler ])) {
			if ( bglobal ) {
				gui.Tick.removeGlobal ( type, handler );
			} else {
				gui.Tick.remove ( type, handler, this.signature );
			}
		}
	}
});


/**
 * Interface TickHandler.
 */
gui.ITickHandler = {
		
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {

		return "[object ITickHandler]";
	},

	/**
	 * Handle tick.
	 * @param {gui.Tick} tick
	 */
	ontick : function ( tick ) {}
};


/**
 * @param {String} type
 * @param @optional {object} data
 */
gui.Tween = function ( type, data ) {

	this.type = type;
	this.data = data;
};

gui.Tween.prototype = {

	/**
	 * Tween type.
	 * @type {String}
	 */
	type : null,

	/**
	 * Optional tween data.
	 * @type {object}
	 */
	data : null,

	/**
	 * Between zero and one.
	 * @type {number}
	 */
	value : 0,

	/**
	 * Done when value is one.
	 * @type {boolean}
	 */
	done : false
};

// STATICS .............................

/*
gui.Tween.add = function () {
	throw new Error ( "TODO" );
};

gui.Tween.remove = function () {
	throw new Error ( "TODO" );
};

gui.Tween.addGlobal = function ( type, handler ) {

};

gui.Tween.removeGlobal = function ( type, handler ) {

};
*/

/** 
 * Coordinate a global (cross frame) animation sequence.
 * @param {ui.Animation} animation
 * @returns {gui.Tween} but why?
 */
gui.Tween.dispatchGlobal = function ( type, data ){

	var that = this;
	var start = new Date ().getTime ();
	var tween = new gui.Tween ( type, data );
	var duration = data ? ( data.duration || 200 ) : 200;
	var timing = data ? ( data.timing || "none" ) : "none";
	
	function step () {
		var time = new Date ().getTime ();
		var value = 1, progress = time - start;
		if ( progress < duration ) {
			value = progress / duration;
			if ( timing !== "none" ){
				value = value * 90 * Math.PI / 180;
				switch ( timing ) {
					case "ease-in" :
						value = 1-Math.cos ( value );
						break;
					case "ease-out" :
						value = Math.sin ( value );
						break;
				}
			}
		}
		if ( value === 1 ) {
			tween.value = 1;
			tween.done = true;
		} else {
			tween.value = value;
			requestAnimationFrame ( step );
		}
		gui.Broadcast.dispatchGlobal ( null,gui.BROADCAST_TWEEN,tween );
	}

	step ( start );
	return tween;
};



/**
 * Tracking tweens.
 * @extends {gui.SpiritTracker}
 */
gui.TweenTracker = gui.SpiritTracker.extend ( "gui.TweenTracker", {

	/**
	 * Add one or more broadcast handlers.
	 * @param {object} arg
	 * @returns {gui.TweenTracker}
	 */
	add : function ( arg ) {
		
		var sig = this._global ? null : this._sig;
		var message = gui.BROADCAST_TWEEN;

		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._addchecks ( type, [ this._global ])) {
				if ( this._global ) {
					gui.Broadcast.addGlobal ( message, this );
				} else {
					gui.Broadcast.add ( message, this, sig );
				}
			}
		}, this );
		return this;
	},
	
	/**
	 * Remove one or more broadcast handlers.
	 * @param {object} arg
	 * @returns {gui.TweenTracker}
	 */
	remove : function ( arg ) {
		
		var sig = this._global ? null : this._sig;
		var message = gui.BROADCAST_TWEEN;

		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._removechecks ( type, [ this._global ])) {
				// what
			}
		}, this );
		return this;
	},

	/**
	 * Dispatch type(s).
	 * @param {object} arg
	 * @param @optional {object} data
	 * @returns {gui.Tween}
	 */
	dispatch : function ( arg, data ) {
		
		var result = null;
		var sig = this._global ? null : this._sig;
		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._global ) {
				result = gui.Tween.dispatchGlobal ( type, data );
			} else {
				result = gui.Tween.dispatch ( type, data, sig );	
			}
		}, this );
		return result;
	},

	/**
	 * Add handlers for global broadcast(s).
	 * @param {object} arg
	 * @returns {gui.TweenTracker}
	 */
	addGlobal : function ( arg ) {
		
		return this._globalize ( function () {
			return this.add ( arg );
		});
	},
	
	/**
	 * Add handlers for global broadcast(s).
	 * @param {object} arg
	 * @returns {gui.TweenTracker}
	 */
	removeGlobal : function ( arg ) {
		
		return this._globalize ( function () {
			return this.remove ( arg );
		});
	},
	
	/**
	 * Dispatch type(s) globally.
	 * @param {object} arg
	 * @param @optional {object} data
	 * @returns {gui.Tween}
	 */
	dispatchGlobal : function ( arg, data ) {
		
		return this._globalize ( function () {
			return this.dispatch ( arg, data );
		});
	},

	/**
	 * Handle broadcast.
	 * @param {gui.Broadcast} b
	 */
	onbroadcast : function ( b ) {

		switch ( b.type ) {
			case gui.BROADCAST_TWEEN :
				var tween = b.data;
				if ( this._containschecks ( tween.type, [ b.isGlobal ])) {
					this.spirit.ontween ( tween );
				}
				break;
		}
	},

	// PRIVATES ...................................................................

	/**
	 * Global mode?
	 * @type {boolean}
	 */
	_global : false,

	/**
	 * Execute operation in global mode.
	 * @param {function} operation
	 * @returns {object}
	 */
	_globalize : function ( operation ) {

		this._global = true;
		var res = operation.call ( this );
		this._global = false;
		return res;
	},

	/**
	 * Remove broadcast subscriptions on dispose.
	 * @overwrites {gui.SpiritTracker#_cleanup}
	 * @param {String} type
	 * @param {Array<object>} checks
	 */
	_cleanup : function ( type, checks ) {
		
		var message = gui.BROADCAST_TWEEN;
		if ( this._removechecks ( type, checks )) {
			var global = checks [ 0 ];
			var sig = global ? null : this._sig;
			if ( global ) {
				gui.Broadcast.removeGlobal ( message, this );
			} else {
				gui.Broadcast.remove ( message, this, this._sig );
			}
		}
	}

});


/**
 * CSS transitioning things.
 * TODO: Just add the transitonend listener on construct?
 */
gui.TransitionPlugin = gui.SpiritPlugin.extend ( "gui.TransitionPlugin", {
	
	/**
	 * Handle event.
	 * @type {TransitionEvent} e
	 */
	onevent : function ( e ) {
		
		if ( e.type === this._endevent && e.target === this.spirit.element ) {
			this._transitionend ( e );
		}
	},
	
	/**
	 * Set transition properties.
	 * @param {String} props White-space separated list of CSS properties.
	 * @returns {gui.TransitionPlugin}
	 */
	property : function ( props ) {
		
		if ( props ) {
			this.spirit.css.set ( "-beta-transition-property", props );
		}
		return this._init ();
	},
	
	/**
	 * Set transition duration.
	 * @param {object} time CSS-string or milliseconds as number.
	 * @returns {gui.TransitionPlugin}
	 */
	duration : function ( time ) {
		
		if ( time ) {
			time = gui.Type.isNumber ( time ) ? this._convert ( time ) : time;
			this.spirit.css.set ( "-beta-transition-duration", time );
		}
		return this._init ();
	},
	
	/**
	 * Set transition timing function.
	 * @param {String} timing Bezier or keyword
	 * @returns {gui.TransitionPlugin}
	 */
	timing : function ( timing ) {
		
		if ( timing ) {
			this.spirit.css.set ( "-beta-transition-timing-function", timing );
		}
		return this._init ();
	},
	
	/**
	 * Ease in.
	 * @returns {gui.TransitionPlugin}
	 */
	easeIn : function () {
		
		return this.timing ( "ease-in" );
	},
	
	/**
	 * Ease out.
	 * @returns {gui.TransitionPlugin}
	 */
	easeOut : function () {
		
		return this.timing ( "ease-out" );
	},
	
	/**
	 * Ease in and out.
	 * @returns {gui.TransitionPlugin}
	 */
	easeInOut : function () {
		
		return this.timing ( "ease-in-out" );
	},
	
	/**r
	 * Cubic-bezier.
	 * @param {number} n1
	 * @param {number} n2
	 * @param {number} n3
	 * @param {number} n4
	 * @returns {gui.TransitionPlugin}
	 */
	cubicBezier : function ( n1, n2, n3, n4 ) {
		
		return this.timing ( "cubic-bezier(" + n1 + "," + n2 + "," + n3 + "," + n4 + ")" );
	},
	
	/**
	 * Suspend transitions.
	 * @returns {gui.TransitionPlugin}
	 */
	none : function () {
		
		return this.property ( "none" );
	},
	
	/**
	 * Configure transition and run one or CSS updates. Any key in the config 
	 * argument that matches a method name in this plugin will be invoked with 
	 * the property value as argument; the rest will be treated as CSS updates.
	 * @param {Map<String,object>} config
	 * @returns {object}
	 */
	run : function ( config ) {

		// filter CSS props and call methods
		var css = Object.create ( null ); this._count = 0;
		gui.Object.each ( config, function ( key, value ) {
			if ( gui.Type.isFunction ( this [ key ])) {
				this [ key ]( value );
			} else {
				css [ key ] = value;
			}
		}, this );

		var now = this.spirit.css.compute ( "-beta-transition-property" ) === "none";
		var then = this._then = new gui.Then ();

		/*
		 * Firefox needs a break before setting the styles.
		 * http://stackoverflow.com/questions/6700137/css-3-transitions-with-opacity-chrome-and-firefox
		 */
		var that = this, spirit = this.spirit;
		if (( this._count = Object.keys ( css ).length )) {
			setImmediate ( function () {
				spirit.css.style ( css );
				if ( now && then ) {
					setImmediate(function(){
						then.now ( null ); // don't wait for transitionend
					});
				}
			});
		}

		return then;
	},

	// Privates ..............................................................................
	
	/**
	 * ???
	 * @type {String}
	 */
	_when : null,

	/**
	 * Default transition duration time milliseconds.
	 * TODO: actually default this
	 * @type {number}
	 */
	_default: 1000,
	
	/**
	 * Browsers's take on transitionend event name.
	 * @type {String}
	 */
	_endevent : null,

	/**
	 * Hello.
	 * @type {number}
	 */
	_count : 0,

	/**
	 * Monitor transitions using vendor-prefixed event name.
	 * TODO: Firefox is down
	 * TODO: this.duration ( this._default )
	 * TODO: this on static, not per instance
	 * @returns {gui.TransitionPlugin}
	 */
	_init : function () {
		
		if ( this._endevent === null ) {
			var names = {
				"webkit" : "webkitTransitionEnd",
				"explorer" : "MSTransitionEnd",
				"gecko" : "transitionend", // "MozTransitionEnd" or what?
				"opera" : "oTransitionEnd"
			};
			// TODO: confirm VendorTransitionEnd on documentElement
			this._endevent = names [ gui.Client.agent ] || "transitionend";
			this.spirit.event.add ( this._endevent, this.spirit.element, this );
		}
		
		return this;
	},

	/**
	 * Execute and reset callback on transition end.
	 * @param {TransitionEvent} e
	 */
	_transitionend : function ( e ) {

		var t = new gui.Transition ( e.propertyName, e.elapsedTime );
		this._ontransition ( t );
		this.spirit.ontransition ( t );
	},

	/**
	 * Invoke callback when properties transitioned via run() has finished.
	 * @param  {gui.Transition} t
	 */
	_ontransition : function ( t ) {

		if ( -- this._count === 0 ) {
			this._now ();
		}
	},

	/**
	 * Now what.
	 */
	_now : function () {

		var then = this._then;
		if ( then ) {
			then.now ( null ); // don't wait for transitionend
		}
	},

	/**
	 * Compute milliseconds duration in CSS terms.
	 * @param @optional {number} ms Duration in milliseconds
	 * @returns {String} Duration as string
	 */
	_convert : function ( ms ) {
		
		ms = ms ? ms : this._default;
		return ms / 1000 + "s";
	}

});


/**
 * Details for ended CSS transition.
 * @param {String} propertyName
 * @param {number} elapsedTime
 */
gui.Transition = function ( propertyName, elapsedTime ) {
	this.duration = Math.round ( elapsedTime * 1000 );
	this.type = propertyName;
};

gui.Transition.prototype = {

	/**
	 * Property that finished transitioning ("width","height").
	 * TODO: un-camelcase this to CSS syntax.
	 * TODO: adjust vendor prefix to "beta".
	 * @type {String}
	 */
	type : null,

	/**
	 * Elapsed time in milliseconds. This may 
	 * not be identical to the expected time.
	 * @type {number}
	 */
	duration : 0
};


/**
 * Keyboard TAB sequence manager.
 * TODO: nested attention traps (conflicts with missing focusin in FF?)
 * TODO: empty queue when user moves escapes (all) attention traps?
 * TODO: more life cycle hookins (hide, show, detach, exit)
 */
gui.AttentionPlugin = gui.SpiritPlugin.extend ( "gui.AttentionPlugin", {

	/**
	 * Trapping TAB navigation inside the spirit subtree.
	 * @returns {gui.AttentionPlugin}
	 */
	trap : function () {

		if ( !this._trapping ) {
			this._trapping = true;
			this._listen ();
			this._setup ();
		}
		return this;
	},

	/**
	 * Focus the last focused  element, defaulting to first focusable element.
	 * @returns {gui.AttentionPlugin}
	 */
	focus : function () {

		if ( !this._focused ) {
			if ( this._latest ) {
				this._latest.focus ();
			} else {
				this._first ();
			}
		}
		return this;
	},

	/**
	 * Blur anything that might be focused.
	 * @returns {gui.AttentionPlugin}
	 */
	blur : function () {

		// TODO: definitely not like this...
		gui.Broadcast.dispatchGlobal ( null,
			gui.BROADCAST_ATTENTION_OFF,
			this.spirit.spiritkey
		);

		if ( this._focused ) {
			if ( this._latest ) {
				this._latest.blur ();
			}
		}
		return this;
	},

	/**
	 * Something was focused or blurred.
	 * @param {Event} e
	 */
	handleEvent : function ( e ) {

		switch ( e.type ) {
			case "blur" :
			case "focusout" :
				this._onblur ( e.target );
				break;
			case "focus" :
			case "focusin" :
				this._onfocus ( e.target );
				break;
		}
	},

	/**
	 * Handle broadcast.
	 * @param {gui.Broadcast} b
	 */
	onbroadcast : function ( b ) {

		if ( b.type === gui.BROADCAST_ATTENTION_GO ) {
			if ( b.data === this.spirit.spiritkey ) {
				this.focus ();
			}
		}
	},

	/**
	 * Handle spirit life cycle.
	 * @param {gui.SpiritLife} life
	 */
	onlife : function ( life ) {

		switch ( life.type ) {
			case gui.SpiritLife.DESTRUCT :
				gui.Broadcast.removeGlobal ( gui.BROADCAST_ATTENTION_GO, this );
				gui.Broadcast.dispatchGlobal ( null,
					gui.BROADCAST_ATTENTION_OFF,
					this.spirit.spiritkey
				);
				break;
		}
	},


	// PRIVATES ........................................................................

	/**
	 * Trapping attention?
	 * @type {boolean}
	 */
	_trapping : null,

	/**
	 * Latest focused element.
	 * @type {Element}
	 */
	_latest : null,

	/**
	 * Used to determine whether attention trap was just entered.
	 * @type {number}
	 */
	_flag : false,

	/**
	 * Append hidden inputs. When these are 
	 * focused, we move the focus elsewhere.
	 */
	_setup : function () {

		[ "before", "after" ].forEach ( function ( pos ) {
			var elm = this._input ( pos );
			var dom = this.spirit.dom;
			if ( pos === "before" ) {
				dom.prepend ( elm );
			} else {
				dom.append ( elm );
			}
		}, this );
	},

	/**
	 * Listen for all sorts of stuff going on.
	 * TODO: use focusin and focusout for IE/Opera?
	 */
	_listen : function () {

		var elm = this.spirit.element;
		elm.addEventListener ( "focus", this, true );
		elm.addEventListener ( "blur", this, true );
		this.spirit.life.add ( gui.SpiritLife.DESTRUCT, this );
		gui.Broadcast.addGlobal ( gui.BROADCAST_ATTENTION_GO, this );
	},

	/**
	 * Insert hidden input at position.
	 * TODO: how to *keep* inputs at first and last position?
	 * TODO: removeEventListener on dispose perhaps
	 * @param {String} pos
	 * @returns {Element}
	 */
	_input : function ( pos ) {

		var dom = this.spirit.dom;
		var doc = this.spirit.document;
		var elm = gui.SpiritCSS.style ( 
			doc.createElement ( "input" ), {
				position : "absolute",
				opacity : 0,
				top: -5000
			}
		);

		elm.className = "_gui-focus_" + pos;
		return elm;
	},

	/**
	 * Focus first element and return it.
	 * @returns {Element}
	 */
	_first : function () {

		return this._find ( true );
	},

	/**
	 * Focus last element and return it.
	 * @returns {Element}
	 */
	_last : function () {
		
		return this._find ( false );
	},

	/**
	 * Find first or last form control.
	 * @param {boolean} isfirst
	 */
	_find : function ( isfirst ) {

		var elm = null, all = this._elements ();
		if ( all.length ) {
			elm = all [ isfirst ? 0 : all.length - 1 ];
			elm.focus ();
		}
		return elm;
	},

	/**
	 * List descendant form controls *plus* links except input @type="image".
	 * @returns {Array<Element>}
	 */
	_elements : function () {

		return this.spirit.dom.descendants ().filter ( function ( elm ) {
			return this._focusable ( elm ) ? elm : undefined;
		}, this );
	},

	/**
	 * Element is focusable form control or link?
	 * Excluding the hidden inputs for TAB contain.
	 * @param {Element} elm
	 * @returns {boolean}
	 */
	_focusable : function ( elm ) {

		var is = false;
		switch ( elm.localName ) {
			case "input" :
			case "textarea" :
			case "select" :
			case "button" :
			case "a" :
				if ( elm.tabIndex >-1 ) {
					if ( elm.type !== "image" ) {						
						if ( !elm.className.startsWith ( "_gui-focus" )) {
							is = true;
						}
					}
				}
				break;
		}
		return is;
	},

	/**
	 * Something was focused.
	 * @param {Element} elm
	 */
	_onfocus : function ( elm ) {

		this._focused = true;
		this._latest = elm;

		// first time focus?
		if ( !this._flag ) {
			this._didcatch ();
			this._flat = true;
		}

		// was hidden input?
		var klas = elm.className;
		if ( klas.startsWith ( "_gui-focus" )) {
			if ( klas.contains ( "after" )) {
				this._first ();
			} else {
				this._last ();
			}
		}
	},

	/**
	 * Something was blurred.
	 */
	_onblur : function ( node ) {

		this._focused = false;
		gui.Tick.next ( function () {
			if ( !this._focused ) {
				this._didescape ();
			}
		}, this );
	},

	/**
	 * Attention trap entered.
	 */
	_didcatch : function () {

		gui.Broadcast.dispatchGlobal ( null,
			gui.BROADCAST_ATTENTION_ON,
			this.spirit.spiritkey
		);
	},

	/**
	 * Attention trap escaped.
	 */
	_didescape : function () {

		this._flag = false;
		/*
		gui.Broadcast.dispatchGlobal ( null,
			gui.BROADCAST_ATTENTION_OFF,
			this.spirit.spiritkey
		);
		*/
	}


}, { // STATICS ........................................................................

	/**
	 * @type {Array<String>}
	 */
	_queue : [],

	/**
	 * Get next in line.
	 * TODO: continue until next is not hidden.
	 * @returns {String}
	 */
	_next : function () {

		var q = this._queue; 
		return q [ q.length - 1 ];
	},

	/**
	 * Handle broadcast.
	 * @param {gui.Broadcast} b
	 */
	onbroadcast : function ( b ) {

		var q = this._queue;
		switch ( b.type ) {
			case gui.BROADCAST_ATTENTION_ON :
				if ( this._next () !== b.data ) {
					q.push ( b.data );
				}
				break;
			case gui.BROADCAST_ATTENTION_OFF :
				q = this._queue = q.filter ( function ( key ) {
					if ( key !== b.data ) {
						return key;
					}
				});
				if ( q.length ) {
					gui.Broadcast.dispatchGlobal ( null,
						gui.BROADCAST_ATTENTION_GO,
						this._next ()
					);
				}
				break;
		}
	}

});

/**
 * Manage attention queue.
 */
( function () {

	gui.Broadcast.addGlobal ([ 
		gui.BROADCAST_ATTENTION_ON,
		gui.BROADCAST_ATTENTION_OFF
	], gui.AttentionPlugin );

}());



/*
 * Register module.
 */
gui.module ( "core", {
	
	/*
	 * Methods added to gui.Spirit.prototype
	 */
	addins : {
	
		/**
		 * Handle action.
		 * @param {gui.Action} action
		 */
		onaction : function ( action ) {},
	
		/**
		 * Handle broadcast.
		 * @param {gui.Broadcast} broadcast
		 */
		onbroadcast : function ( broadcast ) {},

		/**
		 * Handle tick.
		 * @param {gui.Tick} tick
		 */
		ontick : function ( tick ) {},

		/**
		 * @param {gui.Tween}
		 */
		ontween : function ( tween ) {},

		/**
		 * Handle transiton end.
		 * @param {gui.TransitionEnd} transition
		 */
		ontransition : function ( transition ) {},

		/**
		 * Handle event.
		 * @param {Event} event
		 */
		onevent : function ( event ) {},
	
		/**
		 * Implements DOM2 EventListener.
		 * Forwards to method onevent()
		 * @param {Event} event
		 */
		handleEvent : function ( event ) {
			this.onevent(event);
		}

	},
	
	/*
	 * Assign plugins to prefixes.
	 */
	plugins : {
		
		action : gui.ActionTracker,
		att : gui.SpiritAtt,
		box : gui.SpiritBox,
		broadcast	: gui.BroadcastTracker,
		css : gui.SpiritCSS,
		dom	: gui.SpiritDOM,
		event	: gui.EventTracker,
		tick : gui.TickTracker,
		tween : gui.TweenTracker,
		transition : gui.TransitionPlugin,
		attention : gui.AttentionPlugin
	},
	
	/*
	 * Channel spirits for CSS selectors.
	 */
	channels : [
		
		[ "html", "gui.DocumentSpirit" ],
		[ ".gui-styles", "gui.StyleSheetSpirit" ],
		[ ".gui-iframe", "gui.IframeSpirit" ],
		[ ".gui-window", "gui.WindowSpirit" ],
		[ ".gui-action", "gui.ActionSpirit" ], // TODO: fix or deprecate
		[ ".gui-cover",  "gui.CoverSpirit" ],
		[ ".gui-spirit", "gui.Spirit" ]
	]
});



/**
 * Questionable browser identity and feature detection.
 * Note that Chrome on iOS identifies itself as Safari 
 * (it basically is, so that shouldn't cause concern).
 */
gui.Client = new function Client () {
   
	/*
	 * Expecting a lot from the user agent string... 
	 */
	var agent = navigator.userAgent.toLowerCase ();
	var root = document.documentElement;

	this.isExplorer = agent.contains ( "msie" );
	this.isOpera = agent.contains ( "opera" );
	this.isWebKit = agent.contains ( "webkit" );
	this.isChrome = this.isWebKit && agent.contains ( "chrome" );
	this.isSafari = this.isWebKit && !this.isChrome && agent.contains ( "safari" );
	this.isGecko = !this.isWebKit && !this.isOpera && agent.contains ( "gecko" );

	/**
	 * "agent" is one of: "webkit" "firefox" "opera" "explorer"
	 * @type {String}
	 */
	this.agent = ( function () {
		
		var agent = "explorer";
		if ( this.isWebKit ) {
			agent = "webkit";
		} else if ( this.isGecko ) {
			agent = "gecko";
		} else if ( this.isOpera ) {
			agent = "opera";
		}
		return agent;
		
	}).call ( this );
	
	/**
	 * "system" is one of: "linux" "osx" "ios" "windows" "windowsmobile" "haiku"
	 */
	this.system = ( function () {
		
		var os = null;
		[ "window mobile", "windows", "ipad", "iphone", "haiku", "os x", "linux" ].every ( function ( test ) {
			if ( agent.contains ( test )) {
				if ( test.match ( /ipad|iphone/ )) {
					os = "ios";
				} else {
					os = test.replace ( / /g, "" ); // no spaces
				}
			}
			return os === null;
		});
		return os;
		
	})();
	
	/**
	 * Has touch support? Note that desktop Chrome has this.
	 * TODO: Investigate this in desktop IE10.
	 * @type {boolean}
	 */
	this.hasTouch = ( window.ontouchstart !== undefined || this.isChrome );

	/**
	 * Supports file blob?
	 * @type {boolean}
	 */
	this.hasBlob = ( window.Blob && ( window.URL || window.webkitURL ));
	
	/**
	 * Is mobile device? Not to be confused with this.hasTouch
	 * TODO: gui.Observerice entity?
	 * @type {boolean}
	 */
	this.isMobile = ( function () {
		
		var shortlist = [ "android", "webos", "iphone", "ipad", "ipod", "blackberry", "windows phone" ];
		return !shortlist.every ( function ( system ) {
			return !agent.contains ( system );
		});
		
	})();

	/**
	 * Supports CSS transitions?
	 * @type {boolean}
	 */
	this.hasTransitions = ( function () {
		
		return ![ 
			"transition", 
			"WebkitTransition", 
			"MozTransition", 
			"OTransition", 
			"msTransition" 
			].every ( function ( test ) {
				return root.style [ test ] === undefined;
		});
	})();

	/**
	 * Supports CSS 3D transform? (note https://bugzilla.mozilla.org/show_bug.cgi?id=677173)
	 * @type {boolean}
	 */
	this.has3D = ( function () {
		
		return ![ 
			"perspective", 
			"WebkitPerspective", 
			"MozPerspective", 
			"OPerspective", 
			"msPerspective" 
			].every ( function ( test ) {
				return root.style [ test ] === undefined;
		});
	})();

	/**
	 * Supports requestAnimationFrame somewhat natively?
   * @type {boolean}
	 */
	this.hasAnimationFrame = ( function () {

		var win = window;
		if ( 
			win.requestAnimationFrame	|| 
			win.webkitRequestAnimationFrame || 
			win.mozRequestAnimationFrame || 
			win.msRequestAnimationFrame	|| 
			win.oRequestAnimationFrame
		) {
			return true;
		} else {
			return false;
		}

	})();

	/**
	 * Supports MutationObserver feature?
	 * @type {boolean}
	 */
	this.hasMutations = ( function () {
		
		return ![ "", "WebKit", "Moz", "O", "Ms" ].every ( function ( vendor ) {
			return !gui.Type.isDefined ( window [ vendor + "MutationObserver" ]);
		});
		
	})();
	
	/**
	 * Time in milliseconds after window.onload before we can reliably measure 
	 * document height. We could in theory discriminate between browsers here, 
	 * but we won't. WebKit sucks more at this and Safari on iOS is dead to me.
	 * TODO: Now Firefox started to suck really bad. How can we fix this mess?
	 * TODO: Where to move this?
	 * @type {number}
	 */
	this.STABLETIME = 200;
	

	// TODO: Compute these only when reqeusted (via object.defineproperties)
	
	/**
	 * Browsers disagree on the primary scrolling element.
	 * Is it document.body or document.documentElement? 
	 * @see https://code.google.com/p/chromium/issues/detail?id=2891
	 * @type {HTMLElement}
	 */
	this.scrollRoot = null;

	/**
	 * Scrollbar default span in pixels. 
	 * Note that this is zero on mobiles.
	 * @type {number}
	 */
	this.scrollBarSize = 0;

	/**
	 * Supports position fixed?
	 * @type {boolean}
	 */
	this.hasPositionFixed = false;
	
	/**
	 * TODO: MOVE THIS STUFF ELSEWHERE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	 * @param {gui.Broadcast} b
	 */
	this.onbroadcast = function ( b ) {
		
		if ( b.data.document === document ) {
			
			/*
			 * What is the scroll root?
			 * Supports position fixed?
			 */
			var win = window,
			doc = document,
			html = doc.documentElement,
			body = doc.body,
			root = null;
			
			// make sure window is scrollable
			var temp = body.appendChild ( 
				gui.SpiritCSS.style ( doc.createElement ( "div" ), {
					position : "absolute",
					height : "10px",
					width: "10px",
					top : "100%"
				})
			);
			
			// what element will get scrolled?
			win.scrollBy ( 0, 10 );
			root = body.scrollTop ? body : html;
			this.scrollRoot = root;
			
			// supports position fixed?
			gui.SpiritCSS.style ( temp, {
				position : "fixed",
				top : "10px"
			});
			
			// restore scroll when finished
			var has = temp.getBoundingClientRect ().top === 10;
			this.hasPositionFixed = has;
			body.removeChild ( temp );
			win.scrollBy ( 0, -10 );
			
			// compute scrollbar size
			var inner = gui.SpiritCSS.style ( document.createElement ( "p" ), {
				width : "100%",
				height : "200px"
			});
			
			var outer = gui.SpiritCSS.style ( document.createElement ( "div" ), {
				position : "absolute",
				top : "0",
				left : "0",
				visibility : "hidden",
				width : "200px",
				height : "150px",
				overflow : "hidden"
			});
			
			outer.appendChild ( inner );
			html.appendChild ( outer );
			var w1 = inner.offsetWidth;
			outer.style.overflow = "scroll";
			var w2 = inner.offsetWidth;
			if ( w1 === w2 ) {
				w2 = outer.clientWidth;
			}
			html.removeChild ( outer );
			this.scrollBarSize = w1 - w2;
		}
	};
};

/*
 * Determine properties on startup.
 * TODO: Compute all properties only when requested (via object.defineproperties).
 */
( function initSpiritClient () {
	gui.Broadcast.addGlobal ( gui.BROADCAST_DOMCONTENT, gui.Client );
})();


/**
 * Spirit of the root element (the HTML element).
 */
gui.DocumentSpirit = gui.Spirit.infuse ( "gui.DocumentSpirit", {
	
	/**
	 * Construct.
	 */
	onconstruct : function () {
		
		this._super.onconstruct ();
		
		// document dimension
		this._dimension = new gui.Dimension ( 0, 0 );
		
		// setup vast amount of event listeners...
		Object.keys ( this._messages ).forEach ( function ( type ) {
			var target = this.document;
			switch ( type ) {
				// case "load" : 
				case "scroll" :
				case "resize" :
				//case "popstate" : // TODO: top only? tackle history?
				//case "hashchange" : // TODO: top only? tackle history?
					target = this.window;
					break;
			}
			this.event.add ( type, target );
		}, this );
		
		// setup event listeners for top document only.
		if ( this.document === document ) {
			this._constructTop ();
		}
		
		// consuming and redispatching fit-action
		this.action.addGlobal ( gui.ACTION_DOCUMENT_FIT );
		
		/* 
		 * BUG!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		 * TODO: it appears we *must* listen for touch start events
		 * for any spirit to subscribe to touch-end events only!!!!
		 * @see {gui.SpiritTouch}
		 */
		if ( gui.Type.isDefined ( this.touch )) {
			this.touch.add ( gui.SpiritTouch.FINGER_START );
		}
		
		/*
		 * TODO: iframe hello.
		 */
		this.action.dispatchGlobal ( gui.ACTION_DOCUMENT_CONSTRUCT );
	},
	
	/**
	 * Get ready.
	 * TODO: think more about late loading (module loading) scenario...
	 */
	onready : function () {
		
		this._super.onready ();
		this.action.dispatchGlobal ( gui.ACTION_DOCUMENT_READY );
		if ( this.document.readyState === "complete" && !this._isLoaded ) {
			this.onload ();
		}
	},

	/**
	 * Handle event.
	 * @param {Event} e
	 */
	onevent : function ( e ) {
		
		this._super.onevent ( e );
		
		switch ( e.type ) {
			
			// top document only
			case "orientationchange" :
				this._onorientationchange ();
				break;
			
			// all documents
			default : 
				var message = this._messages [ e.type ];
				if ( gui.Type.isDefined ( message )) {
					switch ( e.type ) { 
						
						/*
						 * Nuke all touch events for now.
						 * TODO: move to touch module
						 *
						case "touchstart" :
						case "touchend" :
						case "touchcancel" :
						case "touchleave" :
						case "touchmove" :
							e.preventDefault ();
							break;
						*/
							
						case "resize" :
							var istop = this.window === window;
							if ( istop ) {
								this._onresize ();
							}
							break;
						
						/*
						case "load" :
							if ( !this._isLoaded ) {
								this._onload ();
							}
							break;
						*/
					}
					
					/*
					 * Broadcast event globally.
					 */
					this._broadcast ( message, e );
				}
		}
	},
	
	/**
	 * Handle action.
	 * @param {gui.Action} action
	 */
	onaction : function ( action ) {
		
		this._super.onaction ( action );
		switch ( action.type ) {
			case gui.ACTION_DOCUMENT_FIT : // relay fit action, but claim ourselves as new action.target
				action.consume ();
				this.fit ( action.data === true );
				break;
		}
	},

	/**
	 * 
	 */
	onvisible : function () {

		this.css.remove ( gui.CLASS_INVISIBLE );
		this._super.onvisible ();
	},

	/**
	 * [oninvisible description]
	 * @return {[type]} [description]
	 */
	oninvisible : function () {

		this.css.add ( gui.CLASS_INVISIBLE );
		this._super.onvisible ();
	},
	
	/**
	 * Invoked onload by the {gui.Guide}.
	 */
	onload : function () {
		
		// this.action.dispatch ( gui.ACTION_DOCUMENT_ONLOAD );
		
		if ( !this._isLoaded ) {
			
			this._isLoaded = true;
			this.action.dispatchGlobal ( gui.ACTION_DOCUMENT_ONLOAD );
			
			var that = this;
			setTimeout ( function () {
				that.fit ();
				that.tick.add ( gui.TICK_FIT );
				that.action.dispatchGlobal ( gui.ACTION_DOCUMENT_DONE );
			}, gui.Client.STABLETIME );
			
		} else {
			console.warn ( "TODO: loaded twice..." );
		}
		
	},
	
	/**
	 * Invoked onunload by the {gui.Guide}.
	 */
	onunload : function () {
		
		this.action.dispatchGlobal ( gui.ACTION_DOCUMENT_UNLOAD );
	},

	/**
	 * Handle tick.
	 * @param {gui.Tick} tick
	 */
	ontick : function ( tick ) {

		this._super.ontick ( tick );
		switch ( tick.type ) {
			case gui.TICK_FIT :
				/*
				console.log("Fit " + this.document.title + " : " + Math.random());
				this.fit ( true );
				*/
				break;
		}
	},
	
	/**
	 * Dispatch fitness info. Please invoke this method whenever 
	 * height changes: Parent iframes will resize to fit content.
	 */
	fit : function ( force ) {
		
		if ( this._isLoaded || force ) {
			var dim = this._getDimension ();
			if ( !gui.Dimension.isEqual ( this._dimension, dim )) {
				this._dimension = dim;
				this._dispatchFit ();
			}
		}
	},
	
	
	// PRIVATES ...................................................................
	
	/**
	 * Flipped on window.onload
	 * @type {boolean}
	 */
	_isLoaded : false,
	
	/**
	 * Publish a global notification about an event in this document. This information 
	 * will be broadcasted to all windows. This way, a click event in one iframe might 
	 * close a menu in another iframe; and mousemove events can be listened for in all 
	 * documents at once. Important: If you stopPropagate() an event so that the 
	 * gui.DocumentSpirit cannot handle it, you should invoke this method manually.
	 * @param {String} message
	 * @param {Event} e
	 */
	_broadcast : function ( message, e ) {
		
		switch ( e.type ) {
				case "mousemove" :
				case "touchmove" :
					try { // don't fire errors onmousemove :)
						gui.broadcast ( message, e );
					} catch ( x ) {
						this.event.remove ( e.type, e.target );
						throw x;
					}
					break;
				default :
					gui.broadcast ( message, e );
					break;
		}
	},
	
	/**
	 * Mapping DOM events to broadcast messages.
	 * @type {Map<String,String>}
	 */
	_messages : {
		
		"click"	: gui.BROADCAST_MOUSECLICK,
		"mousedown"	: gui.BROADCAST_MOUSEDOWN,
		"mouseup"	: gui.BROADCAST_MOUSEUP,
		//"mousemove"	: gui.BROADCAST_MOUSEMOVE,
		"scroll" : gui.BROADCAST_SCROLL,
		"resize" : gui.BROADCAST_RESIZE,
		//"popstate" : gui.BROADCAST_POPSTATE,
		//"hashchange" : gui.BROADCAST_HASHCHANGE,
		"touchstart" : gui.BROADCAST_TOUCHSTART,
		"touchend" : gui.BROADCAST_TOUCHEND,
		"touchcancel"	: gui.BROADCAST_TOUCHCANCEL,
		"touchleave" : gui.BROADCAST_TOUCHLEAVE,
		"touchmove"	: gui.BROADCAST_TOUCHMOVE
	},
	
	/**
	 * Document width and height tracked in top document.
	 * @type {gui.Dimension} 
	 */
	_dimension : null,
	
	/**
	 * Timeout before we broadcast window resize ended. 
	 * This timeout cancels itself on each resize event.
	 * @type {number}
	 */
	_timeout : null,
	
	/**
	 * Dispatch document fit. Google Chrome may fail 
	 * to refresh the scrollbar properly at this point.
	 */
	_dispatchFit : function () {
		
		var dim = this._dimension;
		this.action.dispatchGlobal ( gui.ACTION_DOCUMENT_FIT, {
			width : dim.w,
			height : dim.h
		});

		var win = this.window;
		if( gui.Client.isWebKit ){
			win.scrollBy ( 0, 1 );
			win.scrollBy ( 0,-1 );
		}
	},
	
	/**
	 * Get current body dimension.
	 * @returns {gui.Dimension}
	 */
	_getDimension : function () {
		
		var rect = this.document.body.getBoundingClientRect ();
		return new gui.Dimension ( rect.width, rect.height );
	},
	
	/**
	 * Special setup for top document.
	 */
	_constructTop : function () {
		
		this._onorientationchange (); // broadcast orientation on startup
		this.event.add ( "orientationchange", window );
	},
	
	/**
	 * Intensive resize procedures should subscribe 
	 * to the resize-end message as broadcasted here.
	 * TODO: prevent multiple simultanious windows
	 */
	_onresize : function () {
		
		this.window.clearTimeout ( this._timeout );
		this._timeout = this.window.setTimeout ( function () {
			gui.broadcast ( gui.BROADCAST_RESIZE_END );
		}, gui.DocumentSpirit.TIMEOUT_RESIZE_END );
	},
	
	/**
	 * Device orientation changed.
	 * TODO: move to touch module
	 * TODO: gui.SpiritDevice entity
	 */
	_onorientationchange : function () {
		
		gui.orientation = window.innerWidth > window.innerHeight ? 1 : 0;
		gui.broadcast ( gui.BROADCAST_ORIENTATIONCHANGE );
	}
	
	
}, {}, { // STATICS .............................................................

	/**
	 * Timeout in milliseconds before we decide 
	 * that user is finished resizing the window.
	 */
	TIMEOUT_RESIZE_END : 50
});


/**
 * Spirit of the window.
 * TODO: use this name?
 */
gui.WindowSpirit = gui.Spirit.infuse ( "gui.WindowSpirit", {
	
	/**
	 * When to hide the loading splash cover. 
	 * TODO: Match one of "ready" "load" "fit"
	 * Defaults to "fit" (harcoded for now)
	 */
	cover : "fit",
	
	/**
	 * Fit height to iframe contained document height?
	 * TODO: setter for this to allow runtime update.
	 * @type {boolean}
	 */
	fit : true,
	
	/**
	 * Manage CSS internally?
	 * @type {boolean}
	 */
	style : true,
	
	/**
	 * Prepending iframe and cover.
	 */
	onenter : function () {
		
		this._super.onenter ();
		this._cover = this.dom.prepend ( gui.CoverSpirit.summon ( this.document ));
		this._frame = this.dom.prepend ( gui.IframeSpirit.summon ( this.document, this._src ));
		this.action.addGlobal ([ gui.ACTION_DOCUMENT_DONE, gui.ACTION_DOCUMENT_FIT ]);
		if ( this.style ) {
			this._style ();
		}
	},
	
	/**
	 * Get or set src.
	 * @param @optional {String} src
	 * @returns {String} 
	 */
	src : function ( src ) {
		
		var result = null;
		if ( this.life.entered ) {
			if ( gui.Type.isString ( src )) {
				this._loading ();
			}
			result = this._frame.src ( src );
		} else {
			result = this._src = src;
		}
		return result;
	},
	
	/**
	 * Handle action.
	 * @param {gui.Action} action
	 */
	onaction : function ( action ) {
		
		this._super.onaction ( action );
		
		switch ( action.type ) {
			
			case gui.ACTION_DOCUMENT_DONE :
				this._loaded ();
				action.consume ();
				break;
				
			case gui.ACTION_DOCUMENT_FIT :
				if ( this.fit ) {

					// immediate
					this.css.height = action.data.height;
					this.action.dispatchGlobal ( action.type, action.data.height );
					
					// backup (webkit)
					this._height = action.data.height;
					var tick = "TICK-TEMP";
					this.tick.one ( tick ).dispatch ( tick, 0 );
				}
				action.consume ();
				break;
		}
	},
	
	/**
	 * Handle tick.
	 * @param {gui.Tick} tick
	 */
	ontick : function ( tick ) {

		this._super.ontick ( tick );
		if ( tick.type === "TICK-TEMP" ) {
			this.css.height = this._height;
		}
	},

	
	// PRIVATES ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
	
	/**
	 * Spirit of the iframe.
	 * @type {gui.IframeSpirit}
	 */
	_frame : null,
	
	/**
	 * Hm............
	 * @type {String}
	 */
	_src : null,
	
	/**
	 * Spirit of the cover.
	 * @type {gui.CoverSpirit}
	 */
	_cover : null,

	/**
	 * @type {number}
	 */
	_height : 0,
	
	/** 
	 * Loading. 
	 */
	_loading : function () {
		
		if ( this.life.entered && this.cover ) {
			this._cover.dom.show ();
		}
		this.action.dispatch ( gui.ACTION_WINDOW_LOADING );
	},
	
	/**
	 * Loaded.
	 */
	_loaded : function () {
		
		if ( this.life.entered && this.cover ) {
			this._cover.dom.hide ();
		}
		this.action.dispatch ( gui.ACTION_WINDOW_LOADED );
	},
	
	/**
	 * Autostyling.
	 * TODO: use top right bottom left instead of width and height?
	 * @see {gui.WindowSpirit#style}
	 */
	_style : function () {
		
		if ( this.css.compute ( "position" ) === "static" ) {
			this.css.position = "relative";
		}
		if ( this.fit ) {
			this.css.height = 0;
		}
		[ this._frame, this._cover ].forEach ( function ( child ) {
			child.css.style ({ position : "absolute", width: "100%", height: "100%" });
		});
	}


}, { // STATICS ..........................................................

	/**
	 * Summon spirit.
	 * @param {Document} doc
	 * @param @optional {String} src
	 */
	summon : function ( doc, src ) {

		var div = doc.createElement ( "div" );
		var spirit = this.animate ( div );
		if ( src ) {
			spirit.src ( src );
		}
		return spirit;
	}

});


/**
 * Spirit of the iframe.
 */
gui.IframeSpirit = gui.Spirit.infuse ( "gui.IframeSpirit", {
	
	/**
	 * Signs iframe URLs with a unique identifier eg. to 
	 * relay spirit actions from across exotic domains.
	 * @type {String}
	 */
	signature : null,
	
	/**
	 * Construct.
	 */
	onconstruct : function () {
	
		this._super.onconstruct ();
		if ( this.signature === null ) {
			this.signature = gui.IframeSpirit.generateSignature ();
		}
	},
	
	/**
	 * Get or set iframe source.
	 * See also method path.
	 * @param {String} src
	 */
	src : function ( src ) {
		
		if ( gui.Type.isString ( src )) {
			if ( gui.IframeSpirit.isExternal ( src )) {
				src = gui.IframeSpirit.sign ( src, this.signature );
			}
			this.element.src = src;
		}
		return this.element.src;
	}
	
	
}, { // RECURRING  ...........................................................

	/**
	 * Summon spirit.
	 * @param {Document} doc
	 * @param {String} src
	 * @returns {gui.IframeSpirit}
	 */
	summon : function ( doc, src ) {
	
		/*
		 * Unique key stamped into iframe SRC.
		 */
		var sig = gui.IframeSpirit.generateSignature ();
		
		/*
		 * To avoid problems with the browser back button 
		 * and iframe history, better set iframe src now. 
		 */
		var iframe = doc.createElement ( "iframe" );
		if ( gui.Type.isString ( src )) {
			if ( !this.isExternal ( src )) {
				src = this.sign ( src, sig );
			}
			iframe.src = src; 
		} else {
			iframe.src = gui.IframeSpirit.SRC_DEFAULT;
		}
		
		var spirit = this.animate ( iframe );
		spirit.signature = sig;
		return spirit;
	}


}, { // STATIC ................................................................
	
	/*
	 * The stuff going on here has to do with a future project about supporting 
	 * cross-doman spiritualized websites (sandboxed yet integrated). Let's see 
	 * how "seamless" and "sandbox" pan out before we continue with this project.
	 */
	
	/**
	 * Presumably harmless iframe source. The issue here is that "about:blank" 
	 * may raise security concerns for some browsers when running HTTPS setup.
	 * @type {String} 
	 */
	SRC_DEFAULT : "javascript:void(false);",

	/**
	 * Overwrite this property to create a parameter name for  
	 * signing that looks somewhat less like a spyware attack.
	 * @type {String}
	 */
	KEY_SIGNATURE : "spiritual-signature",

	/**
	 * Generate unique signature (for this session).
	 * @returns {String}
	 */
	generateSignature : function () {
		
		return gui.KeyMaster.generateKey ().replace ( "key", "sig" );
	},

	/**
	 * Sign URL with signature.
	 * @param {String} url
	 * @param @optional {String} signature
	 * @returns {String}
	 */
	sign : function ( url, signature ) {
		
		return this.setParam ( url, this.KEY_SIGNATURE, signature || this.generateSignature ());
	},

	/**
	 * Remove signature from URL (prettyfied for end user). 
	 * @param {String} url
	 * @param {String} sign
	 * @returns {String}
	 */
	unsign : function ( url ) {
		
		return this.setParam ( url, this.KEY_SIGNATURE, null );
	},

	/**
	 * Extract querystring parameter value from URL.
	 * @param {String} url
	 * @param {String} name
	 * @returns {String} String or null
	 */
	getParam : function ( url, name ) {
		
		name = name.replace( /(\[|\])/g, "\\$1" ); // was: name = name.replace ( /[\[]/, "\\\[" ).replace( /[\]]/, "\\\]" ); (http://stackoverflow.com/questions/2338547/why-does-jslint-returns-bad-escapement-on-this-line-of-code)
		var results = new RegExp ( "[\\?&]" + name + "=([^&#]*)" ).exec ( url );
		return results === null ? null : results [ 1 ];
	},

	/**
	 * Add or remove querystring parameter from URL. If the parameter 
	 * already exists, we'll replace it's (first ancountered!) value. 
	 * TODO: Something simpler
	 * @param {String} url
	 * @param {String} name
	 * @param {String} value Use null to remove
	 * @returns {String} String
	 */
	setParam : function ( url, name, value ) {
		
		var params = [], cut, index = -1;
		
		name = encodeURIComponent ( name );
		if ( value !== null ) {
			value = encodeURIComponent ( value );
		}
		
		if ( url.indexOf ( "?" ) >-1 ) {
			cut = url.split ( "?" );
			url = cut [ 0 ];
			params = cut [ 1 ].split ( "&" );
			params.every ( function ( param, i ) {
				var x = param.split ( "=" );
				if ( x [ 0 ] === name ) {
					index = i;
					if ( value !== null ) {
						x [ 1 ] = value;
						params [ i ] = x.join ( "=" );
					}
				}
				return index < 0;
			});
		}
		
		if ( value === null ) {
			if ( index > -1 ) {
				params.remove ( index, index );
			}
		} else if ( index < 0 ) {
			params [ params.length ] = [ name, value ].join ( "=" );
		}
		
		return url + ( params.length > 0 ? "?" + params.join ( "&" ) : "" );
	},

	/**
	 * Is external address?
	 * @returns {boolean}
	 */
	isExternal : function ( url ) {
		
		var a = document.createElement ( "a" );
		a.href = url;
		return a.host !== location.host;
	}
});


/**
 * Spirit of the stylesheet.
 */
gui.StyleSheetSpirit = gui.Spirit.infuse ( "gui.StyleSheetSpirit", {
	
	/**
	 * Strip lines starting with @ character (for now).
	 * @type {RegExp}
	 */
	_ATSTATEMENTS : /\@.+\n/g,
	
	/**
	 * Result of parsing CSS - an array of spirit channels.
	 * @type {Array<Array}
	 */
	_channels : null,
	
	/**
	 * Constructor action.
	 */
	onconstruct : function () {
		
		this._super.onconstruct ();
		this._channels = [];
		
		/*
		 * CSS served external or inline?
		 */
		if ( !this.element.disabled ) {
			var href = this.element.href;
			if ( href !== undefined ) {
				this._parseExternal ( href );
			} else {
				this._parse ( this.element.textContent );
				this.channel ();
			}
		}
	},
	
	/**
	 * The CSSStyleSheet API doesn't expose
	 * custom properties. Let's parse text!
	 * @param {String} href
	 */
	_parseExternal : function ( href ) {
		
		/*
		 * It appears that synchronous requests no longer block 
		 * the execution thread (!), we need an elaborate setup 
		 * to momentarily halt the gui.Guide while async 
		 * requests are returned and parsed. If we are lucky, 
		 * the browser will have cached the CSS file already.
		 */
		this._done ( false );
		new gui.Request ( href ).get ( function ( status, css ) {
			if ( status === 200 ) {
				this._parse ( css );
			}
			this._done ( true );
		}, this );
	},
	
	/*
	 * If not done, instruct gui.Guide to wait for incoming channels.
	 * Otherwise, when CSS is parsed, let gui.Guide invoke channel method. 
	 * This ensures that channels are asserted in continuos (markup) order.
	 * @param {boolean} isDone
	 */
	_done : function ( isDone ) {
		
		this.broadcast.dispatchGlobal ( isDone ? 
			gui.BROADCAST_CHANNELS_LOADED : 
			gui.BROADCAST_LOADING_CHANNELS 
		);
	},
	
	/**
	 * Parse CSS, channeling Spirits to selectors.
	 * TODO: more tolerant parsing algorithm!
	 * @param {String} text (valid CSS syntax!) 
	 */
	_parse : function ( text ) {
		
		var channels = [];
		var cssprop = "-ui-spirit";
		
		if ( text.indexOf ( cssprop ) >-1 ) {
			
			var sane = [];
			var coms = text.split ( "*/" );
			coms.forEach ( function ( part ) {				
				sane.push ( part.split ( "/*" )[ 0 ]);
			});
			
			sane = sane.join ( "" ).replace ( this._ATSTATEMENTS, "" ); // replace ( /\s/g, "" );
			sane.split ( "}" ).forEach ( function ( part ) {
				
				var split = part.split ( "{" );
				var selector = split [ 0 ];
				var defs = split [ 1 ];
				
				if ( defs ) {
					defs.split ( ";" ).forEach ( function ( def ) {
						var last = def.split ( ":" );
						var prop = last [ 0 ];
							if ( prop.trim () === cssprop ) {
								var constructors = last [ 1 ].trim ();
								constructors.split ( " " ).reverse ().forEach ( function ( constructor ) {
									channels.push ([ 
										selector.trim (), 
										constructor.trim ()
									]);
								});
							}
 
					});
				}
			});
			
			/*
			 * In CSS, overriding spirits are declared last.
			 * In JS, they are declared first: Reverse list.
			 */
			this._channels = channels.reverse ();
		}
	},
	
	/**
	 * Assert channels; method isolated to support async setup.
	 * This method may have been invoked by the gui.Guide
	 */
	channel : function () {
		
		this._channels.forEach ( function ( channel ) {
			this.window.gui.channel ( channel [ 0 ], channel [ 1 ]);
		}, this );
	}
	
	
}, { // ...........................................................

	/**
	 * Summon spirit.
	 * @param {Document} doc
	 * @param {String} href
	 * @returns {gui.StyleSheetSpirit}
	 */
	summon : function ( doc, href ) {
	
		var link = doc.createElement ( "link" );
		link.className = "gui-styles";
		link.rel = "stylesheet";
		link.href = href ? href : "";
		return this.animate ( link );
	}
});


/**
 * Spirit of the button-like element.
 * TODO: Support ENTER for onaction.
 * TODO: move to some kind of plugin.
 */
gui.ActionSpirit = gui.Spirit.infuse ( "gui.ActionSpirit", {
	
	/**
	 * TODO: setup action dispatch via HTML inline 
	 * attribute. Also attribute ation data.
	 *
	action.type : null,
	*/
	
	/**
	 * TODO
	 *
	onaction : null,
	 */
	
	/**
	 * Enter.
	 */
	onenter : function () {
		
		this._super.onenter ();
		this.event.add ( "click" );
	},
	
	/**
	 * Handle event.
	 * @param {Event} e
	 */
	onevent : function ( e ) {
		
		this._super.onevent ( e );
		switch ( e.type ) {
			case "click" :
				var onaction = this.att.get ( "onaction" );
				if ( gui.Type.isString ( onaction )) {
					var Invokable = this.window.Function;
					new Invokable ( onaction ).call ( this );
				}
				break;
		}
	}
});


/**
 * Spirit of the cover. Use it to cover stuff up. Note that the cover should 
 * be fitted with a background-color in CSS in order to actually cover stuff.
 */
gui.CoverSpirit = gui.Spirit.infuse ( "gui.CoverSpirit", {

	/**
	 * Show the cover.
	 * @returns {gui.CoverSpirit}
	 */
	show : function () {

		this.dom.show ();
		return this;
	},

	/**
	 * Hide the cover.
	 * @returns {gui.CoverSpirit}
	 */
	hide : function () {

		this.dom.hide ();
		return this;
	},

	/**
	 * Show and fade to no opacity.
	 * TODO: promises goes here
	 * @param {number} duration in ms
	 * @returns {Object} then method
	 */
	fadeIn : function ( duration ) {
		
		if ( gui.Client.hasTransitions ) {
			this.transition.none ();
			this.css.opacity = 0;
			this.show ();
			this.transition.run ({
				duration : duration || 250,
				property : "opacity",
				opacity : 1
			});
		} else {
			this.show ();
		}
	},
	
	/**
	 * Fade to full opacity and hide.
	 * TODO: promises goes here
	 * @param {number} duration in ms
	 * @returns {Object} then method
	 */
	fadeOut : function ( duration ) {
		
		if ( gui.Client.hasTransitions ) {
			this.transition.none ();
			this.css.opacity = 1;
			this.show ();
			this.transition.run ({
				duration : duration || 250,
				property : "opacity",
				opacity : 0
			}).then ( function () {
				this.hide();
			}, this );
		} else {
			this.hide ();
		}
	}


}, { // STATICS .............................................

	/**
	 * Summon spirit.
	 * @param {Document} doc
	 * @returns {gui.CoverSpirit}
	 */
	summon : function ( doc ) {
		
		var spirit = this.animate ( doc.createElement ( "div" ));
		spirit.css.add ( "gui-cover" );
		return spirit;
	}
});


/**
 * Do what Spiritual does by overloading JQuery instead of native DOM methods.
 * TODO: (Angular special) handle function replaceWith, "a special jqLite.replaceWith, which can replace items which have no parents"
 * TODO: Henrik says "$(iframe.contentDocument).remove() før man skifter URL eller fjerner iframen" (jQuery.cache og jQuery.fragments)
 */
gui.module ( "jquery", {

	/**
	 * Hack Spiritual in top window.
	 * @param {Window} context
	 */
	init : function ( context ) {
		
		if ( context === top ) {
			this._spiritualdom ();
		}
	},

	/**
	 * Hack JQuery in all windows.
	 * @param {Window} context
	 */
	ready : function ( context ) {

		var root = context.document.documentElement;
		if ( context.gui.mode === gui.MODE_JQUERY ) {
			var jq = context.jQuery;
			jq.__rootnode = root;
			this._instance ( jq );
			this._expandos ( jq );
			this._overload ( jq );
		}
	},


	// PRIVATE .............................................................

	/**
	 * Injecting Spiritual awareness into 
	 * JQuery DOM manipulation methods.
	 * @param {jQuery} jq
	 */
	_expandos : function ( jq ) {

		var guide = gui.Guide;
		jq.__suspend = false;

		/*
		 * Element in page DOM?
		 * @param {Element} el
		 * @returns {boolean}
		 */
		function indom ( el ) {
			return gui.SpiritDOM.embedded ( el );
		}

		/*
		 * Attach spirits to collection.
		 */
		jq.fn.__attach = function () {
			return this.each ( function ( i, el ) {
				if ( indom ( el )) {
					guide.attach ( el );
				}
			});
		};

		/*
		 * Attach spirits to collection subtree.
		 */
		jq.fn.__attachSub = function () {
			return this.each ( function ( i, el ) {
				if ( indom ( el )) {
					guide.attachSub ( el );
				}
			});
		};

		/*
		 * Attach spirits to collection non-crawling.
		 */
		jq.fn.__attachOne = function () {
			return this.each ( function ( i, el ) {
				if ( indom ( el )) {
					guide.attachOne ( el );
				}
			});
		};

		/*
		 * Detach spirits from collection.
		 */
		jq.fn.__detach = function ( skip ) {
			return this.each ( function ( i, el ) {
				if ( indom ( el )) {
					guide.detach ( el );
				}
			});
		};

		/*
		 * Detach spirits from collection subtree.
		 */
		jq.fn.__detachSub = function ( skip ) {
			return this.each ( function ( i, el ) {
				if ( indom ( el )) {
					guide.detachSub ( el );
				}
			});
		};

		/*
		 * Detach spirits from collection non-crawling.
		 */
		jq.fn.__detachOne = function () {
			return this.each ( function ( i, el ) {
				if ( indom ( el )) {
					guide.detachOne ( el );
				}
			});
		};
	},

	/**
	 * Fixing JQuery instance constructor to detect when the user 
	 * instantiates JQuery in an external window context (iframes).
	 * @param {function} jq JQuery constructor
	 */
	_instance : function ( jq ) {

		var Init = jq.fn.init;
		var home = jq.__rootnode.ownerDocument.defaultView;

		if ( home.gui.debug ) {
			jq.fn.init = function ( selector, context, rootjQuery ){
				var inst = new Init ( selector, context, rootjQuery );
				var test = inst [ 0 ];
				if ( test && test.nodeType === Node.ELEMENT_NODE ) {
					if ( test.ownerDocument !== home.document ) {
						throw new Error ( "JQuery was used to handle elements in another window. Please use a locally loaded version of JQuery." );
					}
				}
				return inst;
			};
		}
	},

	/**
	 * Overloading DOM manipulation methods.
	 * TODO: attr and removeAttr must be hooked into gui.SpiritAtt setup...
	 * @param {function} jq Constructor
	 */
	_overload : function ( jq ) {
		
		var naive = Object.create ( null ); // mapping unmodified methods

		[
			"after", 
			"append", 
			"appendTo", 
			"before", 
			"detach", 
			"empty", 
			"html", 
			"text", 
			"insertAfter", 
			"insertBefore", 
			"prepend", 
			"prependTo", 
			"remove", 
			"replaceAll", 
			"replaceWith", 
			"unwrap", 
			"wrap", 
			"wrapAll", 
			"wrapInner"

		].forEach ( function ( name ) {

			naive [ name ] = jq.fn [ name ];
			jq.fn [ name ] = function () {

				var res;
				var that = this;
				var args = arguments;
				var set = arguments.length > 0;

				function suber () {
					return gui.Observer.suspend ( jq.__rootnode, function () {
						return naive [ name ].apply ( that, args );
					}, that );
				}

				if ( jq.__suspend ) {
					res = suber ();
				} else if ( name === "text" ) {
					if ( set ) {
						this.__detachSub ();
					}
					res = suber ();
				} else {
					var arg = function() { return set ? jq ( args [ 0 ]) : undefined; };
					var guide = gui.Guide;
					jq.__suspend = true;
					switch ( name ) {
						case "append" :
						case "prepend" :
							res = suber ();
							this.__attachSub (); // TODO: optimize!!!
							break;
						case "after" :
						case "before" :
							// Can't use arguments here since JQuery inserts clones thereof.
							// Stuff becomes extra tricky since "this" can itself be a list.
							( function () {
								var is = name === "after";
								var key = "isattached";
								var olds = is ? this.nextAll () : this.prevAll ();
								olds.data ( key, "true" ); // mark current siblings
								res = suber ();
								var news = is ? this.nextAll () : this.prevAll ();
								news.each(function ( i, m ) {
									m = jq ( m );
									if ( !m.data ( key )) {
										m.__attach (); // attach unmarked sibling
										m.data ( key, "true" );
									}
								});
								gui.Tick.next ( function () {
									news.removeData ( key ); // cleanup all this
								});
							}).call ( this );
							break;
						case "appendTo" :
							res = suber ();
							arg().each ( function ( i, m ) {
								jq ( m ).last ().__attach ();
							});
							break;
						case "prependTo" :
							res = suber ();
							arg().each ( function ( i, m ) {
								jq ( m ).first ().__attach ();
							});
							break;
						case "insertAfter" :
							res = suber ();
							arg().next ().__attach ();
							break;
						case "insertBefore" :
							res = suber ();
							arg().prev ().__attach ();
							break;
						case "detach" :
						case "remove" :
							this.__detach ();
							res = suber ();
							break;
						case "replaceAll" :
							arg().__detach ();
							res = suber ();
							this.parent ().__attachSub (); // TODO: optimize!
							break;
						case "replaceWith" :
							this.__detach ();
							var p = this.parent ();
							res = suber ();
							p.__attachSub (); // TODO: optimize!
							break;
						case "empty" :
							this.__detachSub ();
							res = suber ();
							break;
						case "html" :
							if ( set ) {
								this.__detachSub ();
							}
							res = suber ();
							if ( set ) {
								this.__attachSub ();
							}
							break;
						case "unwrap" :
							// note: detachment is skipped here!
							this.parent ().__detachOne ();
							res = suber ();
							break;
						case "wrap" :
						case "wrapAll" :
							// note: detachment is skipped here!
							res = suber ();
							this.parent ().__attachOne ();
							break;
						case "wrapInner" :
							res = suber ();
							this.__attach ();
							break;
					}
					jq.__suspend = false;
				}
				return res;
			};
		});
	},

		/*
		this.nextAll ().data ( key, "true" );
		res = suber ();
		var all = this.nextAll();
		all.each(function ( i, m ) {
			m = jq ( m );
			if ( !m.data ( key )) {
				m.data ( key, "true" );
				m.__attach ();
			};
		});

		gui.Tick.next ( function () {
			all.removeData ( key );
		});
		*/

	/**
	 * Overload Spiritual to attach/detach spirits on DOM mutation and to 
	 * suspend mutation monitoring while DOM updating. This would normally 
	 * be baked into native DOM methods appendChild, removeChild and so on.
	 * @see {gui.SpiritDOM}
	 */
	_spiritualdom : function () {

		// overloading prototype of this guy
		var plugin = gui.SpiritDOM.prototype;

		/*
		 * Desperate attempt to preserve readability
		 * in messy method overloads presented below.
		 * @param {gui.Spirit} spirit
		 * @returns {object}
		 */
		function breakdown ( spirit ) {
			var elm = spirit.element;
			var doc = elm.ownerDocument;
			var win = doc.defaultView;
			var dom = spirit.dom.embedded();
			var is$ = win.gui.mode === gui.MODE_JQUERY;
			return { elm : elm, doc : doc, win : win, dom : dom, is$ : is$ };
		}

		// manage invoker subtree
		[ "html", "empty", "text" ].forEach ( function ( method ) {
			var old = plugin [ method ];
			plugin [ method ] = function ( arg ) {
				var res, b = breakdown ( this.spirit );
				if ( b.is$ ) {
					if ( b.dom ){
						gui.Guide.detachSub ( b.elm );
					}
					res = gui.Observer.suspend ( b.elm, function () {
						return old.call ( this, arg );
					}, this );
					if ( b.dom && method === "html" ) {
						gui.Guide.attachSub ( b.elm );
					}
				} else {
					res = old.call ( this, arg );
				}
				return res;
			};

		});

		// manage invoker itself		
		[ "remove" ].forEach ( function ( method ) {
			var old = plugin [ method ];
			plugin [ method ] = function ( arg ) {
				var res, b = breakdown ( this.spirit );
				if ( b.is$ ) {
					if ( b.dom ) {
						gui.Guide.detach ( b.elm );
					}
					res = gui.Observer.suspend ( b.elm, function () {
						return old.call ( this, arg );
					}, this );
				} else {
					res = old.call ( this, arg );
				}
				return res;
			};
		});

		// manage targeted element(s)
		[ "append", "prepend", "before", "after" ].forEach ( function ( method ) {
			var old = plugin [ method ];
			plugin [ method ] = function ( things ) {
				var res, b = breakdown ( this.spirit );
				if ( b.is$ ) {
					res = gui.Observer.suspend ( b.elm, function () {
						return old.call ( this, things );
					}, this );
					if ( b.dom ) {
						var els = Array.map ( gui.Type.list ( things ), function ( thing ) {
							return thing && thing instanceof gui.Spirit ? thing.element : thing;
						});
						els.forEach ( function ( el ) {
							gui.Guide.attach ( el );
						});
					}
				} else {
					res = old.call ( this, things );
				}
				return res;
			};
		});
	}

});



/**
 * TODO: insertAdjecantHTML
 * TODO: DOM4 methods
 */
gui.UPGRADE = function () { // TODO: name this thing

	var combo = gui.Combinator;
	var guide = gui.Guide;

	// node embedded in document?
	var ifembedded = combo.provided ( function () {
		return gui.SpiritDOM.embedded ( this );
	});

	// has spirit associated?
	var ifspirit = combo.provided ( function () {
		return !gui.Type.isNull ( this.spirit );
	});

	// attach node plus subtree
	var attachafter = combo.after ( function ( node ) {
		guide.attach ( node );
	});

	// detach node plus subtree
	var detachbefore = combo.before ( function ( node ) {
		guide.detach ( node );
	});

	// attach new node plus subtree
	var attachnewafter = combo.after ( function ( newnode, oldnode ) {
		guide.attach ( newnode );
	});

	// detach old node plus subtree
	var detacholdbefore = combo.before ( function ( newnode, oldnode ) {
		guide.detach ( oldnode );
	});

	// spirit-aware setattribute
	var setattafter = combo.after ( function ( att, val ) {
		this.spirit.att.__suspend__ ( function () {
			this.set ( att, val );
		});
	});

	// spirit-aware removeattribute
	var delattafter = combo.after ( function ( att ) { // TODO: use the post combinator
		this.spirit.att.__suspend__ ( function () {
			this.del ( att );
		});
	});
	
	// disable DOM mutation observers while doing action
	var suspending = combo.around ( function ( action ) {
		return gui.Observer.suspend ( this, function () {
			return action.apply ( this, arguments );
		}, this );
	});

	// detach subtree of "this"
	var detachsubbefore = combo.before ( function () {
		guide.detachSub ( this );
	});

	// attach subtree of "this"
	var attachsubafter = combo.after ( function () {
		guide.attachSub ( this );
	});

	// detach "this"
	var parent = null; // TODO: unref this at some point
	var detachthisbefore = combo.before ( function () {
		parent = this.parentNode;
		guide.detach ( this );
	});

	// attach parent
	var attachparentafter = combo.after ( function () {
		guide.attach ( parent );
	});

	// webkit-patch property descriptors for node and subtree
	var webkitafter = combo.after ( function ( node ) {
		if ( gui.Client.isWebKit ) {
			gui.WEBKIT.patch ( node );
		}
	});

	// sugar
	var otherwise = function ( action ) {
		return action;
	};


	// PUBLIC ......................................................................

	return { // TODO: standard DOM exceptions for missing arguments and so on.

		appendChild : function ( base ) {
			return (
				ifembedded ( attachafter ( webkitafter ( suspending ( base ))), 
				otherwise ( base ))
			);
		},
		removeChild : function ( base ) {
			return (
				ifembedded ( detachbefore ( suspending ( base )),
				otherwise ( base ))
			);
		},
		insertBefore : function ( base ) {
			return (
				ifembedded ( attachafter ( webkitafter ( suspending ( base ))), 
				otherwise ( base ))
			);
		},
		replaceChild : function ( base ) {
			return (
				ifembedded ( detacholdbefore ( attachnewafter ( webkitafter ( suspending ( base )))), 
				otherwise ( base ))
			);
		},
		setAttribute : function ( base ) {
			return ( 
				ifembedded ( 
					ifspirit ( setattafter ( base ), 
					otherwise ( base )),
				otherwise ( base ))
			);
		},
		removeAttribute : function ( base ) {
			return ( 
				ifembedded ( 
					ifspirit ( delattafter ( base ),
					otherwise ( base )),
				otherwise ( base ))
			);
		},

		/*
		 * Property setters are skipped for WebKit. The stuff works only because properties 
		 * have been re-implemented using methods (see above) in all WebKit based browsers.
		 */

		innerHTML : function ( base ) {
			return (
				ifembedded ( detachsubbefore ( attachsubafter ( suspending ( base ))),
				otherwise ( base ))
			);
		},
		outerHTML : function ( base ) {
			return (
				ifembedded ( detachthisbefore ( attachparentafter ( suspending ( base ))),
				otherwise ( base ))
			);
		},
		textContent : function ( base ) {
			return (
				ifembedded ( detachsubbefore ( suspending ( base )),
				otherwise ( base ))
			);
		}
	};

};


	/**
 * Patching bad WebKit support for DOM getters and setters.
 * @see http://code.google.com/p/chromium/issues/detail?id=13175
 */
gui.WEBKIT = { // TODO: name this thing

	/**
	 * Can patch property descriptors of elements in given window? 
	 * Safari on iOS throws an epic failure exception in your face.
	 * @param {Window} win
	 * @returns {boolean}
	 */
	canpatch : function ( win ) {
		var root = win.document.documentElement;
		try {
			Object.defineProperty ( root, "innerHTML", this._innerHTML );
			return true;
		} catch ( iosexception ) {
			return false;
		}
	},

	/**
	 * Patch node plus nextsiblings and descendants recursively.
	 */
	patch : function ( node ) {
		if ( gui.World.innerhtml.local ) {
			new gui.Crawler ( "crawler-webkit-patch" ).descend ( node, this );
		} else {
			throw new Error ( "Somehow JQuery mode should have handled this :(" );
		}
	},

	/**
	 * Patch single element.
	 * @param {Element} elm
	 */
	handleElement : function ( elm ) {
		[ "innerHTML", "outerHTML", "textContent" ].forEach ( function ( descriptor ) {
			Object.defineProperty ( elm, descriptor, this [ "_" + descriptor ]);
		}, this );
	},


	// PRIVATES .........................................................

	/**
	 * Property descriptor for innerHTML.
	 * @type {Object}
	 */
	_innerHTML : {
		
		get : function () {
			return new gui.DOMSerializer ().subserialize ( this );
		},
		set : function ( html ) {
			gui.SpiritDOM.html ( this, html );
		}
	},

	/**
	 * Property descriptor for outerHTML.
	 * @type {Object}
	 */
	_outerHTML : {
		
		get : function () {
			return new gui.DOMSerializer ().serialize ( this );
		},
		set : function ( html ) {
			gui.SpiritDOM.outerHtml ( this, html );
		}
	},

	/**
	 * Property descriptor for textContent.
	 * @type {Object}
	 */
	_textContent : {
		
		get : function () {
			var node = this, res = "";
			for ( node = node.firstChild; node; node = node.nextSibling ) {
				switch ( node.nodeType ) {
					case Node.TEXT_NODE :
						res += node.data;
						break;
					case Node.ELEMENT_NODE :
						res += node.textContent; // recurse
						break;
				}
			}
			return res;
		},
		set : function ( html ) {
			gui.SpiritDOM.html ( this, html.
				replace ( /&/g, "&amp;" ).
				replace ( /</g, "&lt;" ).
				replace ( />/g, "&gt;" ).
				replace ( /"/g, "&quot" )
			);
		}
	}
};


/**
 * Monitors a document for unsolicitated 
 * DOM changes while in development mode.
 */
gui.Observer = {

	/**
	 * Enable monitoring? DISABLED FOR NOW
	 * @type {boolean}
	 */
	observes : false, // gui.Client.hasMutations,

	/**
	 * Throw exception on mutations not intercepted by the framework.
	 * @type {boolean}
	 */
	fails : false,

	/**
	 * Observe document mutations in given window context.
	 * @param {Window} win
	 */
	observe : function ( win ) {

		var sig = win.gui.signature;
		var doc = win.document;
		var obs = this._observers [ sig ];

		if ( this.observes && win.gui.debug ) {
			if ( !gui.Type.isDefined ( obs )) {
				var Observer = this._mutationobserver ();
				obs = this._observers [ sig ] = new Observer ( function ( mutations ) {
					mutations.forEach ( function ( mutation ) {
						gui.Observer._handleMutation ( mutation );
					});
				});
			}
			this._connect ( doc, true );
		}
	},

	/**
	 * Suspend mutation monitoring of document associated to node;
	 * enable monitoring again after executing provided function.
	 * @param {Node} node
	 * @param @optional {function} action
	 * @param @optional {object} thisp
	 * @returns {object} if action was defined, we might return something
	 */
	suspend : function ( node, action, thisp ) {

		var res;
		if ( node.nodeType ) {
			if ( this.observes ) {
				if ( ++ this._suspend === 1 ) {
					this._connect ( node, false );
				}
			}
			if ( gui.Type.isFunction ( action )) {
				res = action.call ( thisp );
			}
			if ( this.observes ) {
				this.resume ( node );
			}
		} else {
			throw new TypeError ();
		}
		return res;
	},

	/**
	 * Resume monitoring of mutations in document associated to node.
	 * @param {Node} node
	 */
	resume : function ( node ) {

		if ( node.nodeType ) {
			if ( this.observes ) {
				if ( -- this._suspend === 0 ) {
					this._connect ( node, true );
				}
			}
		} else {
			throw new TypeError ();
		}
	},


	// PRIVATES ..............................................................
	
	/**
	 * Is suspended? Minimize what overhead there might 
	 * be on connecting and disconnecting the observer.
	 * TODO: do we need to track this for each window?
	 * @type {number}
	 */
	_suspend : 0,

	/**
	 * Tracking MutationObservers for window contexts by gui.signature
	 * @type {Map<String,MutationObserver}
	 */
	_observers : Object.create ( null ),

	/**
	 * Get observer.
	 * @returns {function} MutationObserver
	 */
	_mutationobserver : function () {

		return window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	},

	/**
	 * Connect and disconnect observer.
	 * @param {Node} node
	 * @param {boolean} connect
	 */
	_connect : function ( node, connect ) {

		var doc = node.ownerDocument || node;
		var win = doc.defaultView;
		var sig = win.gui.signature;
		var obs = this._observers [ sig ];
		if ( obs ) {
			if ( connect ) {
				obs.observe ( doc, {
					childList: true,
					subtree: true
				});
			} else {
				obs.disconnect ();
			}			
		}
	},

	/**
	 * Handle mutation.
	 * @param {MutationRecord} mutation
	 */
	_handleMutation : function ( mutation ) {
		
		var action = false;
		Array.forEach ( mutation.removedNodes, function ( node ) {
			if ( node.nodeType === Node.ELEMENT_NODE ) {
				console.warn ( "Bad remove:", node );
				action = true;
			}
		});
		Array.forEach ( mutation.addedNodes, function ( node ) {
			if ( node.nodeType === Node.ELEMENT_NODE ) {
				console.warn ( "Bad append:", node );
				action = true;
			}
		});
		if ( action ) {
			if ( mutation.target.ownerDocument.defaultView.gui.debug ) {
				console [ this.fails ? "error" : "warn" ] (
					"Action required: DOM mutation not intercepted, Spiritual may be out of synch." 
				);
			}
		}
	}
};


/**
 * Spiritualizing documents by overloading DOM methods.
 */
gui.World = {
	
	/**
	 * True when in JQuery mode. This will be removed when 
	 * iOS supports a mechanism for intercepting innerHTML. 
	 * @type {boolean}
	 */
	jquery : false,

	/**
	 * Tracking success with overloading the innerHTML setter.
	 * @type {Map<String,boolean>}
	 */
	innerhtml : {
		global : false, // Firefox, Opera and Explorer does this on an Element.prototype level
		local : false, // Webkit does this on all *instances* of Element @see {gui.Guide#attach}
		missing : false // Safari on iOS fails completely on must fallback to use JQuery module
	},
	
	/**
	 * Declare "spirit" as a fundamental property of things 
	 * and extend native DOM methods in given window scope.
	 * @param {Window} win
	 */
	descend : function descend ( win ) {

		/*
		var ms = "";
		gui.Object.methods(win.DocumentFragment.prototype).forEach(function(m){
			ms += m + "\n";
		});
		alert(ms);
		*/

		var element = win.Element.prototype;
		if ( gui.Type.isDefined ( element.spirit )) {
			throw new Error ( "Spiritual loaded twice?" );
		} else {		
			/*
			 * TODO: WeakMap<Element,gui.Spirit> in supporting agents
			 */
			element.spirit = null; // defineProperty fails in iOS 5.0
			switch ( win.gui.mode ) {
				case gui.MODE_NATIVE :
				case gui.MODE_OPTIMIZE :
					this.upgrade ( win, gui.UPGRADE );
					break;
				case gui.MODE_JQUERY :
					this._jquery ( win );
					break;
			}
		}
	},

	/**
	 * Upgrade DOM in window.
	 * @param {Window} win
	 * @param {function} upgrade
	 */
	upgrade : function ( win, upgrade ) {
		this._change ( win, upgrade ());
	},


	// PRIVATES ........................................................................
	
	/**
	 * JQuery mode: Confirm loaded JQuery 
	 * and the "jquery" Spiritual module.
	 * @param {Window} win
	 * @returns {boolan}
	 */
	_jquery : function ( win ) {

		var ok = false;
		if (!( ok = gui.Type.isDefined ( win.jQuery ))) {
			throw new Error ( "Spiritual runs in JQuery mode: Expected JQuery to be loaded first" );
		}
		if (!( ok = win.gui.hasModule ( "jquery" ))) {
			throw new Error ( "Spiritual runs in JQuery mode: Expected the \"jquery\" module" );
		}
		return ok;
	},

	/**
	 * Observe the document by extending Element.prototype to 
	 * intercept DOM updates. Firefox ignores extending of 
	 * Element.prototype, we must step down the prototype chain.
	 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=618379
	 * TODO: Add to the bug a comment about Object.prototype
	 * TODO: Extend DocumentFragment
	 * TODO: Extend insertAdjecantHTML
	 * TODO: Support SVG elements (in XHTML)
	 * @param {Window} win
	 */
	_change : function _change ( win, upgrade ) {
		
		var did = [], doc = win.document;
		if ( !this._canchange ( win.Element.prototype, win, upgrade )) {
			if ( !win.HTMLElement || !this._canchange ( win.HTMLElement.prototype, win )) {
				this._tags ().forEach ( function ( tag ) {
					var e = doc.createElement ( tag );
					var p = e.constructor.prototype;
					// alert ( p ); this call throws a BAD_CONVERT_JS
					if ( p !== win.Object.prototype ) { // excluding object and embed tags
						if ( did.indexOf ( p ) === -1 ) {
							this._dochange ( p, win, upgrade );
							did.push ( p ); // some elements share the same prototype
						}
					}
				}, this );
			}
		}
	},

	/**
	 * Firefox has to traverse the constructor of *all* elements.
	 * Object and embed tags excluded because the constructor of 
	 * these elements appear to be identical to Object.prototype.
	 * @returns {Array<String>}
	 */
	_tags : function tags () {

		return ( "a abbr address area article aside audio b base bdi bdo blockquote " +
			"body br button canvas caption cite code col colgroup command datalist dd del " +
			"details device dfn div dl dt em fieldset figcaption figure footer form " +
			"h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen " +
			"label legend li link map menu meta meter nav noscript ol optgroup option " +
			"output p param pre progress q rp rt ruby s samp script section select small " +
			"source span strong style submark summary sup table tbody td textarea tfoot " +
			"th thead time title tr track ul unknown var video wbr" ).split ( " " );
	},

	/**
	 * Can extend given prototype object? If so, do it now.
	 * @param {object} proto
	 * @param {Window} win
	 * @returns {boolean} Success
	 */
	_canchange : function _canchange ( proto, win, upgrade ) {
		
		// attempt overwrite
		var result = false;
		var test = "it appears to work";
		var cache = proto.hasChildNodes;
		proto.hasChildNodes = function () {
			return test;
		};

		// test overwrite and reset back
		var root = win.document.documentElement;
		if ( root.hasChildNodes () === test) {
			proto.hasChildNodes = cache;
			this._dochange ( proto, win, upgrade );
			result = true;
		}

		return result;
	},
	
	/**
	 * Overloading prototype methods and properties. If we cannot get an angle on innerHTML, 
	 * we switch to JQuery mode. This is currently known to happen in Safari on iOS 5.1
	 * TODO: inserAdjecantHTML
	 * @param {object} proto
	 * @param {Window} win
	 */
	_dochange : function _dochange ( proto, win, upgrade ) {

		/*
		 * (old notes) Overloading properties (innerHTML).
		 * TODO: Flag for gui.ready-something to onenter() in correct order.
		 * TODO: Firefox creates 50-something unique functions here
		 * TODO: Test success runtime (not rely on user agent string).
		 */

		switch ( gui.Client.agent ) {
			case "explorer" : // http://msdn.microsoft.com/en-us/library/dd229916(v=vs.85).aspx
				this.innerhtml.global = true;
				break;
			case "gecko" :
			case "opera" : // TODO: Object.defineProperty supported?
				this.innerhtml.global = true;
				break;
			case "webkit" :
				if ( gui.WEBKIT.canpatch ( win )) {
					this.innerhtml.local = true;
				} else {
					this.innerhtml.local = false;
					this.innerhtml.missing = true;
				}
				break;
		}

		var title = win.document.title;
		switch ( win.gui.mode ) {
			case gui.MODE_NATIVE :
				if ( this.innerhtml.missing ) {
					throw new Error ( "Spiritual native mode is not supported on this device." );
				}
				break;
			case gui.MODE_OPTIMIZE :
				if ( this.innerhtml.missing ) {
					win.gui.mode = gui.MODE_JQUERY;
					if ( this._jquery ( win ) && win.gui.debug ) {
						console.debug ( 
							title + ": Spiritual runs in JQuery mode. To keep spirits " +
							"in synch, use JQuery or Spiritual to perform DOM updates."
						);
					}
				} else {
					win.gui.mode = gui.MODE_NATIVE;
					if ( win.gui.debug ) {
						console.debug ( title + ": Spiritual runs in native mode" );
					}
				}
				break;
		}
		
		/*
		 * Overloading methods? Only in native mode.
		 * TODO: insertAdjecantHTML
		 */
		if ( win.gui.mode === gui.MODE_NATIVE ) {
			var root = win.document.documentElement;
			gui.Object.each ( upgrade, function ( name, combo ) {
				this._docombo ( proto, name, combo, root );
			}, this );
		}
	},

	/**
	 * Property setters for Firefox and Opera.
	 * @param {object} proto
	 * @param {String} name
	 * @param {function} combo
	 * @param {Element} root
	 */
	_docombo : function ( proto, name, combo, root ) {

		if ( this._ismethod ( name )) {
			this._domethod ( proto, name, combo );
		} else {
			switch ( gui.Client.agent ) {
				case "opera" :
				case "gecko" :
					this._doboth ( proto, name, combo, root );
					break;
				case "explorer" :
					this._doie ( proto, name, combo, root );
					break;
				case "webkit" :
					// it's complicated
					break;
			}
		}
	},

	/**
	 * Is method? (non-crashing Firefox version)
	 * @returns {boolean}
	 */
	_ismethod : function ( name ) {

		var is = false;
		switch ( name ) {
			case "appendChild" : 
			case "removeChild" :
			case "insertBefore" :
			case "replaceChild" :
			case "setAttribute" :
			case "removeAttribute" :
				is = true;
				break;
		}
		return is;
	},

	/**
	 * Overload DOM method (x-browser supported).
	 * @param {object} proto
	 * @param {String} name
	 * @param {function} combo
	 */
	_domethod : function ( proto, name, combo ) {
		var base = proto [ name ];
		proto [ name ] = combo ( function () {
			return base.apply ( this, arguments );
		});
	},

	/**
	 * Overload property setter for Internet Explorer.
	 * @param {object} proto
	 * @param {String} name
	 * @param {function} combo
	 * @param {Element} root
	 */
	_doie : function ( proto, name, combo, root ) {
		var base = Object.getOwnPropertyDescriptor ( proto, name );
		Object.defineProperty ( proto, name, {
			get: function () {
				return base.get.call ( this );
			},
			set: combo ( function () {
				return base.apply ( this, arguments );
			})
		});
	},

	/**
	 * Overload property setter for Firefox and Opera.
	 * @param {object} proto
	 * @param {String} name
	 * @param {function} combo
	 * @param {Element} root
	 */
	_doboth : function ( proto, name, combo, root ) {
		var base = root.__lookupSetter__ ( name );
		proto.__defineSetter__ ( name, combo ( function () {
			return base.apply ( this, arguments );
		}));
	}
};



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