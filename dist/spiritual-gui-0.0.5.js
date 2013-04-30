/*
 * Spiritual GUI 0.0.5
 * (c) 2013 Wunderbyte
 * Spiritual is freely distributable under the MIT license.
 */



/**
 * Top namespace object for everything Spiritual. On startup, the global variable `gui` gets 
 * redefined to an instance of {gui.Spiritual}. All these constants get copied in the process.
 */
window.gui = {

	/**
	 * Spiritual version. Hardcoded for now.
	 * @TODO Deprecate or generate buildtime.
	 * @type {String}
	 */
	version : "0.0.5",

	/**
	 * Native mode: Overloading native DOM methods.
	 * @type {String}
	 */
	MODE_NATIVE : "native",

	/**
	 * jquery mode: Overloading JQuery DOM methods.
	 * @type {String}
	 */
	MODE_JQUERY : "jquery",

	/**
	 * Optimized mode: try native and fallback on jquery.
	 * @type {String}
	 */
	MODE_OPTIMIZE : "optimize",

	/**
	 * Managed mode.
	 * @type {String}
	 */
	MODE_MANAGED : "managed",

	/**
	 * Global broadcasts
	 * @TODO harmonize some naming with action types
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

	/** 
	 * Plugin broadcast types
	 */
	BROADCAST_ORIENTATIONCHANGE : "gui-broadcast-orientationchange",
	BROADCAST_ATTENTION_ON : "gui-broadcast-attention-on",
	BROADCAST_ATTENTION_OFF : "gui-broadcast-attention-off",
	BROADCAST_ATTENTION_GO : "gui-broadcast-attention-go",

	/*
	 * @TODO: offload to modules
	 */
	// BROADCAST_TOUCHSTART : "gui-broadcast-touchstart",
	// BROADCAST_TOUCHEND : "gui-broadcast-touchend",
	// BROADCAST_TOUCHCANCEL : "gui-broadcast-touchcancel",
	// BROADCAST_TOUCHLEAVE : "gui-broadcast-touchleave",
	// BROADCAST_TOUCHMOVE : "gui-broadcast-touchmove",
	// BROADCAST_DRAG_START : "gui-broadcast-drag-start",
	// BROADCAST_DRAG_END : "gui-broadcast-drag-end",
	// BROADCAST_DRAG_DROP : "gui-broadcast-drag-drop",

	/** 
	 * Global actions
	 */
	ACTION_DOCUMENT_CONSTRUCT : "gui-action-document-construct",
	ACTION_DOCUMENT_READY : "gui-action-document-ready",
	ACTION_DOCUMENT_ONLOAD : "gui-action-document-onload",
	ACTION_DOCUMENT_UNLOAD : "gui-action-document-unload",
	ACTION_DOCUMENT_FIT : "gui-action-document-fit",
	ACTION_DOCUMENT_DONE : "gui-action-document-done",

	/**
	 * Local actions.
	 */
	ACTION_WINDOW_LOADING : "gui-action-window-loading",
	ACTION_WINDOW_LOADED : "gui-action-window-loaded",

	/**
	 * Lifecycle types.
	 */
	LIFE_CONSTRUCT : "gui-life-construct",
	LIFE_CONFIGURE : "gui-life-configure",
	LIFE_ENTER : "gui-life-enter",
	LIFE_ATTACH : "gui-life-attach",
	LIFE_READY : "gui-life-ready",
	LIFE_SHOW : "gui-life-show",
	LIFE_HIDE : "gui-life-hide",
	LIFE_DETACH : "gui-life-detach",
	LIFE_EXIT	: "gui-life-exit",
	LIFE_DESTRUCT : "life-destruct",

	/**
	 * Tick types (timed events)
	 */
	TICK_DESTRUCT_DETACHED : "gui-tick-destruct-detached",
	TICK_SPIRIT_NULL : "gui-tick-spirit-null",
	TICK_FIT : "gui-tick-fit",

	/**
	 * Crawler types
	 */
	CRAWLER_ATTACH : "gui-crawler-attach",
	CRAWLER_DETACH : "gui-crawler-detach",
	CRAWLER_DISPOSE : "gui-crawler-dispose",
	CRAWLER_ACTION : "gui-crawler-action",
	CRAWLER_VISIBLE : "gui-crawler-visible",
	CRAWLER_INVISIBLE : "gui-crawler-invisible",

	/** 
	 * CSS classnames. Underscore indicates that the classname are managed by JS.
	 */
	CLASS_INVISIBLE : "_gui-invisible",
	CLASS_HIDDEN : "_gui-hidden",

	/**
	 * Device orientation.
	 * @TODO Get this out of here, create gui.Device or something
	 */
	orientation : 0,
	ORIENTATION_PORTRAIT : 0,
	ORIENTATION_LANDSCAPE : 1
};


/**
 * Resolve an URL string relative to a document.
 * @todo Read https://gist.github.com/jlong/2428561
 * @param {Document} doc
 * @param {String} href
 */
gui.URL = function ( doc, href ) {
	if ( doc && doc.nodeType === Node.DOCUMENT_NODE ) {
		var val, link = gui.URL._createLink ( doc, href );
		Object.keys ( gui.URL.prototype ).forEach ( function ( key ) { // @todo exclude toString somehow...
			if ( gui.Type.isString (( val = link [ key ]))) {
				if ( key === "pathname" && !val.startsWith ( "/" )) {
					val = "/" + val; // http://stackoverflow.com/questions/956233/javascript-pathname-ie-quirk
				}
				this [ key ] = val;
			}
		}, this );
		this.id = this.hash ? this.hash.substring ( 1 ) : null;
		this.location = this.href.split ( "#" )[ 0 ];
		this.external = this.location !== String ( doc.location ).split ( "#" )[ 0 ];
	} else {
		throw new TypeError ( "Document expected" );
	}
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
	id : null,	// test
	external : false, // external relative to the *document*, not the server host!!! (rename "outbound" to clear this up?)
	toString : function () { // behave somewhat like window.location ....
		return this.href;
	}
};


// Statics ....................................................................

/**
 * Convert relative path to absolute path in context of base where base is a document or an absolute path.
 * @see  http://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
 * @param {String|Document} base
 * @param {String} href
 * @returns {String}
 */
gui.URL.absolute = function ( base, href ) {
	if ( base.nodeType === Node.DOCUMENT_NODE ) {
		return new gui.URL ( base, href ).href;
	} else if ( typeof base === "string" ) { // TODO: load gui.Type first...
		var stack = base.split ( "/" );
		var parts = href.split ( "/" );
		stack.pop();// remove current filename (or empty string) (omit if "base" is the current folder without trailing slash)
		parts.forEach ( function ( part ) {
			if ( part !== "." ) {
				if ( part === ".." ) {
					stack.pop ();
				}	else {
					stack.push ( part );	
				}
			}
		});
		return stack.join ( "/" );	
	}
};

/**
 * Extract querystring parameter value from URL.
 * @param {String} url
 * @param {String} name
 * @returns {String} String or null
 */
gui.URL.getParam = function ( url, name ) {
	name = name.replace ( /(\[|\])/g, "\\$1" );
	var results = new RegExp ( "[\\?&]" + name + "=([^&#]*)" ).exec ( url );
	return results === null ? null : results [ 1 ];
};

/**
 * Add or remove (unencoded) querystring parameter from URL. If it 
 * already exists, we'll replace it's (first ancountered) value. 
 * @TODO Something simpler
 * @param {String} url
 * @param {String} name
 * @param {String} value Use null to remove
 * @returns {String} String
 */
gui.URL.setParam = function ( url, name, value ) {
	var params = [], cut, index = -1;
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
};

/**
 * @param {Document} doc
 * @param @optional {String} href
 */
gui.URL._createLink = function ( doc, href ) {
	var link = doc.createElement ( "a" );
	link.href = href || "";
	if ( gui.Client.isExplorer ) {
	  var uri = gui.URL.parseUri ( link.href );
	  Object.keys ( uri ).forEach ( function ( key ) {
			if ( !link [ key ]) {
				link [ key ] = uri [ key ]; // this is wrong...
			}
	  });

	}
	return link;
};

/**
 * Temp IE hotfix...
 * @see http://blog.stevenlevithan.com/archives/parseuri
 */
gui.URL.parseUri = function ( str ) {
	var	o = gui.URL.parseOptions,
		m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i = 14;
	while (i--) {
		uri[o.key[i]] = m[i] || "";
	}
	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) {
			uri[o.q.name][$1] = $2;
		}
	});
	return uri;
};

/**
 * Temp IE hotfix...
 */
gui.URL.parseOptions = {
	strictMode: true,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name: "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};


/**
 * Generating keys for unique key purposes.
 */
gui.KeyMaster = {

	/**
	 * @static
	 * Generate random key. Not simply incrementing a counter in order to celebrate the 
	 * rare occasion that spirits might be uniquely identified across different domains.
	 * @param @optional {String} prefix Used instead of "key" to prefix the key
	 * @returns {String}
	 */
	generateKey : function ( prefix ) {
		prefix = "key"; // @TODO: remove this line when we get drunk enough to fix the regular expression below...
		var ran = Math.random ().toString ();
		var key = ( prefix || "key" ) + ran.slice ( 2, 11 );
		if ( this._keys [ key ]) {
			key = this.generateKey ( prefix );
		} else {
			this._keys [ key ] = true;
		}
		return key;
	},

	/**
	 * @static
	 * Generate GUID. @TODO Verify integrity of this by mounting result in Java or something.
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


	// Private .............................................................................

	/**
	 * Tracking generated keys to prevent doubles.
	 * @type {Map<String,boolean>}
	 */
	_keys : Object.create ( null )
};


/**
 * Polyfilling missing features from ES5 and selected features from ES6. 
 * Some of these are implemented weakly and should be used with caution 
 * (See Map, Set and WeakMap).
 */
gui.SpiritualAid = {

	/**
	 * Polyfill window or Web Worker context.
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
			this._effects ( win );
		}
	},
	
	
	// Private ...............................................................

	/**
	 * Extend one object with another.
	 * @param {object} what Native prototype
	 * @param {object} whit Extension methods
	 */
	_extend : function ( what, whit ) {
		Object.keys ( whit ).forEach ( function ( key ) {
			var def = whit [ key ];				
			if ( what [ key ] === undefined ) {
				if ( def.get && def.set ) {
					 // @TODO look at element.dataset polyfill (iOS?)
				} else {
					what [ key ] = def;
				}
			}
		});
	},

	/**
	 * Patching `String.prototype`
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
	 * Patching arrays. Note that `Array.prototype.remove` is not part of standard.
	 * @see http://ejohn.org/blog/javascript-array-remove/#comment-296114
	 * @param {Window} win
	 */
	_arrays : function ( win ) {
		this._extend ( win.Array.prototype, {
			remove : function remove ( from, to ) { 
				console.warn ( "Array.prototype.remove is deprecated. Use gui.Array.remove(array,from,to);" );
				return gui.Array.remove ( this, from, to ); // (gui.Array not parsed yet) 
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
			filter : function map ( array, fun, thisp ) {
				return Array.prototype.filter.call ( array, fun, thisp );
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
	 * Patching `Function.prototype`
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
	 * ES6 `Map` and `Set` are polyfilled as simple sugar and should only be used with primitive keys. 
	 * @TODO investigate support for Object.getPrototypeOf(win)
	 * @TODO credit whatever source we grabbed WeakMap from (?)
	 * @param {Window} win
	 */
	_globals : function ( win ) {
		this._extend ( win, {
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
			WeakMap : ( function () { // @TODO clean this up
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
					var Object = win.Object, 
						WeakMapPrototype = WeakMap.prototype,
						create = Object.create, 
						indexOf = [].indexOf, i;
					// used to follow FF behavior where WeakMap.prototype is a WeakMap itself
					WeakMap.prototype = WeakMapInstance.prototype = WeakMapPrototype = new WeakMap();
					return WeakMap;
			})()
		});
	},

	/**
	 * Patching cheap DHTML effects with super-simplistic polyfills.
	 * @TODO cancelAnimationFrame
	 * @TODO use MessageChannel (@http://www.nonblocking.io/2011/06/windownexttick.html) pending moz bug#677638
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
							var timeToCall = Math.max ( 0, 16 - (currTime - lastTime));
							var id = window.setTimeout ( function () { callback ( currTime + timeToCall ); }, 
								timeToCall);
							lastTime = currTime + timeToCall;
							return id;
						};
					}());
					return func;
			})(),
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
	
	/**
	 * Alias methods plus IE and Safari mobile patches.
	 * @param {Window} win
	 */
	_extras : function ( win ) {
		this._extend ( win.Map.prototype, {
			del : function del ( key ) {
				return this [ "delete" ]( key );
			}
		});
		this._extend ( win.Set.prototype, {
			del : function del ( key ) {
				return this [ "delete" ]( key );
			}
		});
		this._extend ( win.console, {
			debug : win.console.log
		});
		this._extend ( XMLHttpRequest.prototype, {
			overrideMimeType : function () {}
		});
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
 * An instance of this thing may be referenced as `gui` inside all windows. 
 * @param {Window} win Window or Worker scope
 */
gui.Spiritual = function Spiritual ( win ) {
	this._construct ( win );
};

gui.Spiritual.prototype = {

	/**
	 * The constructor gui.Spiritual does not exist after first instance gets declared, 
	 * but we may keep something newable allocated by referencing it around here.
	 * @type {function}
	 */
	constructor: gui.Spiritual,

	/**
	 * Uniquely identifies this instance of `gui.Spiritual` 
	 * knowing that other instances may exist in iframes.
	 * @TODO rename guikey or windowkey or contextkey
	 * @type {String}
	 */
	signature : null,

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
	 * Development mode? Enable this to log more console messages or something.
	 * @type {boolean}
	 */
	debug : false,

	/**
	 * Automatically run on DOMContentLoaded? 
	 * If set to false, run using kickstart().
	 * @type {boolean}
	 */
	autostart : true,

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
	go : function () {
		this._gone = true;
		if ( this.debug ) {
			if ( this.mode === gui.MODE_JQUERY ) {
				gui.Tick.next ( function () {  // @TODO somehow not conflict with http://stackoverflow.com/questions/11406515/domnodeinserted-behaves-weird-when-performing-dom-manipulation-on-body
					gui.Observer.observe ( this.context ); // @idea move all of _step2 to next stack?
				}, this );
			} else {
				gui.Observer.observe ( this.context );
			}
		}
		switch ( this.mode ) {
			case gui.MODE_NATIVE :
			case gui.MODE_JQUERY :
			case gui.MODE_OPTIMIZE :
			case gui.MODE_MANAGED :
				gui.DOMChanger.change ( this.context );
				break;
		}
		gui.Tick.add ( gui.TICK_DESTRUCT_DETACHED, this, this.signature );
		if ( this._configs !== null ) {
			this._configs.forEach ( function ( config ) {
				this.channel ( config.select, config.klass );
			}, this );
		}
	},

	/**
	 * Get spirit for argument (argument expected to be a `$instanceid` for now).
	 * @TODO fuzzy resolver to accept elements and queryselectors
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
	 * @param {object|String} klass Constructor or name
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
	 * Mixin prototype property. Checking for naming collision.
	 * @param {String} key
	 * @param {object} value
	 * @param @optional {boolean} override
	 * @returns {object} Returns the mixin value
	 *
	mixin : function ( key, value, override ) {
		var proto = this.constructor.prototype;
		return gui.Object.mixin ( proto, key, value, override );
	},
	*/

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
			// portal custom namespaces and members.
			subgui._spaces = this._spaces.slice ();
			this._spaces.forEach ( function ( ns ) {
				 // declare (nested) namespace in external context @TODO use gui.Object.assert
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
	 * Members of given namespace will be migrated 
	 * to descendant iframes via the portal method.
	 * @param {String} ns
	 * @param {object} nsobject
	 * @returns {object}
	 */
	namespace : function ( ns, nsobject ) {	
		if ( gui.Type.isString ( ns )) { // @TODO must it be a string?
			this._spaces.push ( ns );
		} else {
			throw new TypeError ( "Expected a string: gui.namespace" );
		}
		return nsobject;
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
	evaluate : function ( element ) {
		var res = null;
		if ( element.nodeType === Node.ELEMENT_NODE ) {
			var doc = element.ownerDocument;
			var win = doc.defaultView;
			var att = element.getAttribute ( "gui" ); // @TODO "data-gui"
			// test for "gui" attribute in markup. "[" accounts for {gui.Spirit#$debug}
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
					if ( gui.CSSPlugin.matches ( element, select )) {
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
		console.debug ( out + "\n\n" );
	},

	/**
	 * Stop tracking the spirit. Called 
	 * by the spirit when it destructs.
	 * @param {gui.Spirit} spirit
	 */
	destruct : function ( spirit ) {
		var all = this._spirits;
		var key = spirit.$instanceid;
		delete all.inside [ key ];
		delete all.outside [ key ];
	},
	
	
	// Internal .................................................................

	/**
	 * Register spirit in document (framework internal method).
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
		}
	},

	/**
	 * Register spirit outside document (now scheduled for destruction).
	 * @TODO move? rename?
	 * @param {gui.Spirit} spirit
	 */
	outside : function ( spirit ) {
		var all = this._spirits;
		var key = spirit.$instanceid;
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
		// @TODO do we want to loose track of potential non-exited spirit?
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
	 * Invoked by the {gui.Guide} on window.unload (synchronized as final event).
	 * @TODO figure out of any of this manual garbage dumping works.
	 * @TODO naming clash with method "destruct"
	 * @TODO Think of more stuff to cleanup here...
	 */
	nameDestructAlreadyUsed : function () {
		gui.Tick.remove ( gui.TICK_DESTRUCT_DETACHED, this, this.signature );
		[ 
			"_spiritualaid", 
			"context", 
			"document", 
			"_channels", 
			"_inlines",
			"_spaces", 
			"_modules", 
			"_spirits" 
		].forEach ( function ( thing ) {
			delete this [ thing ];
		}, this );
	},
	

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
		// compute signature (possibly identical to $instanceid of hosting iframe spirit)
		this.signature = ( function () {
			var sig, url = location.href;
			var key = "spiritual-signature"; // ouch, must remain configurable!
			if ( url.contains ( key )) {
				return gui.URL.getParam ( url, key ).split ( "/" ).pop ();
			} else {
				return gui.KeyMaster.generateKey ();	
			}
		}());
		
		// basic setup
		this.context = context;
		this.window = context.document ? context : null;
		this.document = context.document || null;
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
		function index ( def ) {
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


/**
 * Type checking studio. All checks are string based not to cause 
 * confusion when checking the types of objects in another window.
 */
gui.Type = {

	/**
	 * Get type of argument. Note that response may differ between user agents.
	 * @see  http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator
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
	 * @TODO unlimited arguments support
	 * @param {object} o
	 * @returns {boolean}
	 */
	isDefined : function ( o ) {
		return this.of ( o ) !== "undefined";
	},

	/**
	 * Is complex type?
	 * @param {object} o
	 * @returns {boolean}
	 */
	isComplex : function ( o ) {
		switch ( this.of ( o )) {
			case "undefined" :
			case "boolean" :
			case "number" :
			case "string" :
			case "null" :
				return false;
		}
		return true;
	},

	/**
	 * Is Window object?
	 * @param {object} o
	 * @returns {boolean}
	 */
	isWindow : function ( o ) {
		return o && o.document && o.location && o.alert && o.setInterval;
	},

	/**
	 * Is Event object?
	 * @pram {object} o
	 * @returns {boolean}
	 */
	isEvent : function ( o ) {
		return this.of ( o ).endsWith ( "event" ) && this.isDefined ( o.type );
	},

	/**
	 * Is likely a method?
	 * @param {object} o
	 * @return {boolean}
	 */
	isMethod : function ( o ) {
		return this.isFunction ( o ) && !this.isConstructor ( o );
	},

	/**
	 * Is spirit instance?
	 * @returns {boolean}
	 */
	isSpirit : function ( o ) {
		return o && o instanceof gui.Spirit;
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
	 * @TODO Why can't isConstructor be used here?
	 * @TODO something more reliable than "portals".
	 * @param {function} what
	 * @returns {boolean}
	 */
	isSpiritConstructor : function ( what ) {
		return this.isFunction ( what ) && this.isBoolean ( what.portals ); // lousy
	},

	/**
	 * Autocast string to an inferred type. "123" will 
	 * return a number, "false" will return a boolean.
	 * @TODO move to gui.Type :)
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

	
	// Private ...........................................................

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
		"arguments",
		"file"
	].forEach ( function ( type ) {
		this [ "is" + type [ 0 ].toUpperCase () + type.slice ( 1 )] = function is ( o ) {
			return this.of ( o ) === type; 
		};
	}, this );
}).call ( gui.Type );


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
	 * Optional parameter 'loose' to skips properties already declared.
	 * @TODO bypass mixin?
	 * @param {object} target
	 * @param {object} source
	 * @param @optional {boolean} loose Skip properties already declared
	 * @returns {object}
	 */
	extend : function ( target, source, loose ) {
		Object.keys ( source ).forEach ( function ( name ) {
			if ( !loose || !gui.Type.isDefined ( target [ name ])) {
				var desc = Object.getOwnPropertyDescriptor ( source, name );
				Object.defineProperty ( target, name, desc );
			}
    });
    return target;
  },

  /**
   * Extend target with source properties, 
   * skipping everything already declared.
   * @param {object} target
	 * @param {object} source
	 * @returns {object}
   */
  extendmissing : function ( target, source ) {
		return this.extend ( target, source, true );
  },

  /**
   * Mixin something with collision detection.
   * @TODO bypass extend?
   * @param {object]} target
   * @param {String} key
   * @param {object} value
   * @param {boolean} override
   * @returns {object}
   */
  mixin : function ( target, key, value, override ) {
		if ( !gui.Type.isDefined ( target [ key ]) || override ) {
			target [ key ] = value; // @TODO: warning when target is gui.Class (super support)
		} else {
			console.error ( "Mixin naming collision in " + target + ": " + key );
		}
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
	 * Call function for each own key in object (exluding the prototype stuff) 
	 * with key and value as arguments. Returns array of function call results.
	 * @param {object} object
	 * @param {function} func
	 * @param @optional {object} thisp
	 */
	each : function ( object, func, thisp ) {
		return Object.keys ( object ).map ( function ( key ) {
			return func.call ( thisp, key, object [ key ]);
		});
	},

	 /**
	 * Call function for all properties in object (including prototype stuff) 
	 * with key and value as arguments. Returns array of function call results.
	 * @param {object} object
	 * @param {function} func
	 * @param @optional {object} thisp
	 */
	all : function ( object, func, thisp ) {
		var res = [];
		for ( var key in object ) {
			res.push ( func.call ( thisp, key, object [ key ]));
		}
		return res;
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
			if ( gui.Type.isMethod ( object [ def ])) {
				result.push ( def );
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
	},

	/**
	 * Convert array-like object to array. Always returns an array.
	 * @param {object} object
	 * @returns {Array<object>}
	 */
	toArray : function ( object ) {
		var result = [];
		if ( gui.Type.isArray ( object )) {
			result = object;
		} else {
			try {
				if ( gui.Type.isDefined ( object.length ) && ( "0" in Object ( object ))) {
					result = Array.map ( object, function ( thing ) {
						return thing;
					});
				}
			} catch ( exception ) {}
	  }
		return result;
	}
};


/**
 * Working with arrays.
 */
gui.Array = {

	/**
	 * Remove array member(s) by index.
	 * @see http://ejohn.org/blog/javascript-array-remove/#comment-296114
	 * @param {Array} array
	 * @param {number} from
	 * @param {number} to
	 * @returns {number} new length
	 */
	remove : function ( array, from, to ) {
		array.splice ( from, !to || 1 + to - from + ( ! ( to < 0 ^ from >= 0 ) && ( to < 0 || -1 ) * array.length ));
		return array.length;
	},

	/**
	 * Resolve single argument into an array with one or more 
	 * entries. Mostly because we use this setup quite often.
	 * 
	 * 1. Strings to be split at spaces. 
	 * 2. Array-like objects transformed to real arrays. 
	 * 3. Other objects are pushed into a one entry array.
	 * 
	 * @see {gui.Object#toArray} for array-like conversion
	 * @param {object} arg
	 * @returns {Array<object>} Always returns an array
	 */
	toArray : function ( arg ) {
		var list;
		switch ( gui.Type.of ( arg )) {
			case "array" :
				list = arg;
				break;
			case "string" :
				list = arg.split ( " " );
				break;
			default :
				list = gui.Object.toArray ( arg );
				break;
		}
		return list.length ? list : [ arg ];
	}
};


/**
 * Function argument type checking studio.
 */
gui.Arguments = {

	/**
	 * Forgiving arguments matcher. 
	 * Ignores action if no match.
	 */
	provided : function ( /* type1,type2,type3... */ ) {
		var types = gui.Object.toArray ( arguments );
		return function ( action ) {
			return function () {
				if ( gui.Arguments._match ( arguments, types )) {
					return action.apply ( this, arguments );
				}
			};
		};
	},

	/**
	 * Revengeful arguments validator. 
	 * Throws an exception if no match.
	 */
	confirmed : function ( /* type1,type2,type3... */ ) {
		var types = gui.Object.toArray ( arguments );
		return function ( action ) {
			return function () {
				if ( gui.Arguments._validate ( arguments, types )) {
					return action.apply ( this, arguments );
				}
			};
		};
	},


	// Private ...........................................................
	
	/**
	 * Validating mode?
	 * @type {boolean}
	 */
	_validating : false,

	/**
	 * Use this to check the runtime signature of a function call: 
	 * gui.Arguments.match ( arguments, "string", "number" ); 
	 * Note that some args may be omitted and still pass the test, 
	 * eg. the example would pass if only a single string was given. 
	 * Note that `gui.Type.of` may return different xbrowser results 
	 * for certain exotic objects. Use the pipe char to compensate: 
	 * gui.Arguments.match ( arguments, "window|domwindow" );
	 * @returns {boolean}
	 */
	_match : function ( args, types ) {
		return types.every ( function ( type, index ) {
			return this._matches ( type, args [ index ], index );
		}, this );
	},

	/**
	 * Strict type-checking facility to throw exceptions on failure. 
	 * @TODO at some point, return true unless in developement mode.
	 * @returns {boolean}
	 */
	_validate : function ( args, types ) {
		this._validating = true;
		var is = this._match ( args, types );
		this._validating = false;
		return is;
	},

	/**
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
		if ( !match && this._validating ) {
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
 * Working with functions.
 */
gui.Function = {

	/**
	 * Create named function.
	 * @see https://mail.mozilla.org/pipermail/es-discuss/2009-March/008954.html
	 * @see http://wiki.ecmascript.org/doku.php?id=strawman:name_property_of_functions
	 * @param @optional {String} name
	 * @param @optional {Array<String>} params
	 * @param @optional {String} body
	 * @param @optional {Window} context
	 * @returns {function}
	 */
	create : function ( name, params, body, context ) {
		var F = context ? context.Function : Function;
		name = this.safename ( name );
		params = params ? params.join ( "," ) : "";
		body = body || "";
		return new F (
			"return function " + name + " ( " + params + " ) {" +  body + "}"
		)();
	},

	/**
	 * Decorate object method before.
	 * @param {object} target
	 * @param {String} name
	 * @param {function} decorator
	 * @returns {object}
	 */
	decorateBefore : gui.Arguments.confirmed ( "object|function", "string", "function" ) ( 
		function ( target, name, decorator ) {
			return this._decorate ( "before", target, name, decorator );
		}
	),

	/**
	 * Decorate object method after.
	 * @param {object} target
	 * @param {String} name
	 * @param {function} decorator
	 * @returns {object}
	 */
	decorateAfter : gui.Arguments.confirmed ( "object|function", "string", "function" ) ( 
		function ( target, name, decorator ) {
			return this._decorate ( "after", target, name, decorator );
		}
	),

	/**
	 * @TODO Decorate object method around.
	 * @param {object} target
	 * @param {String} name
	 * @param {function} decorator
	 * @returns {object}
	 */
	decorateAround : function () {
		throw new Error ( "TODO" );
	},

	/**
	 * Strip namespaces from name to create valid function name. 
	 * @TODO Return a safe name no matter what has been input.
	 * @param {String} name
	 * @return {String}
	 */
	safename : function ( name ) {
		if ( name && name.contains ( "." )) {
			name = name.split ( "." ).pop ();
		}
		return name || "";
	},


	// Private .................................................................
	
	/**
	 * Decorate object method
	 * @param {String} position
	 * @param {object|function} target
	 * @param {String} name
	 * @param {function} decorator
	 * @returns {object}
	 */
	_decorate : function ( position, target, name, decorator ) {
		target [ name ] = gui.Combo [ position ] ( decorator ) ( target [ name ]);
		return target;
	},

	/**
	 * Method was already decorated with something that looks 
	 * somewhat identical? We need this to bypass a setup where 
	 * modules in shared frames would redecorate stuff on init.
	 * @param {object|function} target
	 * @param {String} name
	 * @param {function} decorator
	 * @returns {boolean}
	 */
	_decorated : function ( target, name, decorator ) {
		var result = true;
		var string = decorator.toString ();
		var decoed = target.$decorators || ( function () {
			return ( target.$decorators = Object.create ( null ));
		}());
		if (( result = decoed [ name ] !== string )) {
			decoed [ name ] = string;
		}
		return result;
	}

};


/**
 * This fellow allow us to create a newable constructor that can be 'subclassed' via an extend method. 
 * Instances of the "class" may use a special `_super` method to overload members of the "superclass".
 * @TODO Evaluate static stuff first so that proto can declare vals as static props 
 * @TODO Check if static stuff shadows recurring static (vice versa) and warn about it.
 * @TODO It's possible for a prototype to be a prototype, investigate this inception
 */
gui.Class = {

	/**
	 * Create constructor. Use method `extend` on the constructor to subclass further.
	 * @param @optional {String} name
	 * @param {object} proto Base prototype
	 * @param {object} protos Prototype extensions
	 * @param {object} recurring Constructor and subconstructor extensions
	 * @param {object} statics Constructor extensions
	 * @returns {function}
	 */
	create : function () {
		var b = this._breakdown_base ( arguments );
		var C = this._createclass ( null, b.proto, b.name );
		gui.Object.extend ( C.prototype, b.protos );
		gui.Object.extend ( C, b.statics );
		if ( b.recurring ) {
			gui.Object.each ( b.recurring, function ( key, val ) {
				C [ key ] = C.$recurring [ key ] = val;
			});
		}
		return this._profiling ( C );
	},

	/**
	 * Break down class constructor arguments. We want to make the string (naming) 
	 * argument optional, but we still want to keep is as first argument, so the 
	 * other arguments must be identified by whether or not it's present. 
	 * @param {Arguments} args
	 * @returns {object}
	 */
	breakdown : function ( args ) {
		return this._breakdown_subs ( args );
	},
	

	// Private ..............................................................................

	/**
	 * Mapping classes to keys.
	 * @type {Map<String,gui.Class>}
	 */
	_classes : Object.create ( null ),

	/**
	 * Nameless name.
	 * @type {String}
	 */
	_ANONYMOUS : "Anonymous",

	/**
	 * Compute class constructor body (as a string). The $name 
	 * will be substituted for the class name. Note that if 
	 * called without the 'new' keyword, the function acts 
	 * as a shortcut the the MyClass.extend method.
	 * @type {String}
	 */
	_BODY : ( function ( $name ) {
		var body = $name.toString ().trim ();
		return body.slice ( body.indexOf ( "{" ) + 1, -1 );
	}(
		function $name () {
			if ( this instanceof $name === false ) {
				return $name.extend.apply ( $name, arguments );
			} else {
				var constructor = this.$onconstruct || this.onconstruct;
				var nonenumprop = gui.Property.nonenumerable;
				window.Object.defineProperties ( this, {
					"$instanceid" : nonenumprop ({
						value: gui.KeyMaster.generateKey ( "instance" )
					}),
					displayName : nonenumprop ({
						value : this.constructor.displayName,
						writable : true
					})
				});
				if ( gui.Type.isFunction ( constructor )) {
					constructor.apply ( this, arguments );
				}
			}
		}
	)),
	
	/**
	 * Breakdown arguments for base exemplar only (has one extra argument).
	 * @TODO Something in gui.Arguments instead.
	 * @see {gui.Class#breakdown}
	 * @param {Arguments} args
	 * @returns {object}
	 */
	_breakdown_base : function ( args ) {
		var named = gui.Type.isString ( args [ 0 ]);
		return {
			name : named ? args [ 0 ] : null,
			proto	: args [ named ? 1 : 0 ] || Object.create ( null ),
			protos : args [ named ? 2 : 1 ] || Object.create ( null ),
			recurring : args [ named ? 3 : 2 ] || Object.create ( null ),
			statics : args [ named ? 4 : 3 ] || Object.create ( null )
		};
	},

	/**
	 * Break down class constructor arguments. We want to make the string (naming) 
	 * argument optional, but we still want to keep is as first argument, so the 
	 * other arguments must be identified by whether or not it's present. 
	 * @TODO Something in gui.Arguments instead.
	 * @param {Arguments} args
	 * @returns {object}
	 */
	_breakdown_subs : function ( args ) {
		var named = gui.Type.isString ( args [ 0 ]);
		return {
			name : named ? args [ 0 ] : null,			
			protos : args [ named ? 1 : 0 ] || Object.create ( null ),
			recurring : args [ named ? 2 : 1 ] || Object.create ( null ),
			statics : args [ named ? 3 : 2 ] || Object.create ( null )
		};
	},

	/**
	 * @TODO comments here!
	 * @param {object} proto Prototype of superconstructor
	 * @param {String} name Constructor name (for debug).
	 * @returns {function}
	 */
	_createclass : function ( SuperC, proto, name ) {
		name = name || gui.Class._ANONYMOUS;
		var C = gui.Function.create ( name, null, this._namedbody ( name ));
		C.$classid = gui.KeyMaster.generateKey ( "class" );
		C.prototype = Object.create ( proto || null );
		C.prototype.constructor = C;
		C = this._internals ( C, SuperC );
		C = this._interface ( C );
		C = this._nameclass ( C, name );
		return C;
	},

	/**
	 * Create subclass for given class.
	 * @param {funciton} SuperC
	 * @param {Object} args
	 * @return {function}
	 */
	_createsubclass : function ( SuperC, args ) {
		args = this.breakdown ( args );
		if ( gui.Type.isDefined ( args.config )) {
			console.warn ( "'config' has been renamed 'attconfig'" );
		}
		SuperC.$super = SuperC.$super || new gui.Super ( SuperC );
		return this._extend_fister ( SuperC, args.protos, args.recurring, args.statics, args.name );
	},

	/**
	 * Create subclass constructor.
	 * @param {object} SuperC super constructor
	 * @param {object} protos Prototype extensions
	 * @param {object} recurring Constructor and subconstructor extensions
	 * @param {object} statics Constructor extensions
	 * @param {String} generated display name (for development)
	 * @returns {function} Constructor
	 */
	_extend_fister : function ( SuperC, protos, recurring, statics, name ) {
		var C = this._createclass ( SuperC, SuperC.prototype, name );
		gui.Object.extend ( C, statics );
		gui.Object.extend ( C.$recurring, recurring );
		gui.Object.each ( C.$recurring, function ( key, val ) {
			C [ key ] = val;
		});
		gui.Property.extendall ( protos, C.prototype ); // @TODO what about base?
		gui.Super.support ( SuperC, C, protos );
		C = this._nameclass ( C, name );
		return this._profiling ( C );
	},

	/**
	 * This might do something in the profiler. Not much luck with stack traces.
	 * @see http://www.alertdebugging.com/2009/04/29/building-a-better-javascript-profiler-with-webkit/
	 * @see https://code.google.com/p/chromium/issues/detail?id=17356
	 * @param {function} C
	 * @returns {function}
	 */
	_profiling : function ( C ) {
		var name = C.name || gui.Class._ANONYMOUS;
		[ C, C.prototype ].forEach ( function ( thing ) {
			gui.Object.each ( thing, function ( key, value ) {
				if ( gui.Type.isMethod ( value )) {
					this._displayname ( value, name + "." + key );
				}
			}, this );
		}, this );
		return C;
	},

	/**
	 * Setup framework internal propeties.
	 * @param {function} C
	 * @param @optional {function} superclass
	 * @param @optional {Map<String,object>} recurring
	 * @returns {function}
	 */
	_internals : function ( C, SuperC ) {
		C.$super = null;
		C.$subclasses = [];
		C.$superclass = SuperC || null;
		C.$recurring = SuperC ? gui.Object.copy ( SuperC.$recurring ) : Object.create ( null );
		if ( SuperC ) {
			SuperC.$subclasses.push ( C );
		}
		return C;
	},

	/**
	 * Setup standard static methods for extension and mixins.
	 * @param {function} C
	 * @returns {function}
	 */
	_interface : function ( C ) {
		[ "extend", "mixin" ].forEach ( function ( method ) {
			C [ method ] = this [ method ];
		}, this );
		return C;
	},

	/**
	 * Name constructor and instance.
	 * @param {function} C
	 * @param {String} name
	 * @returns {function}
	 */
	_nameclass : function ( C, name ) {
		name = name || gui.Class._ANONYMOUS;
		this._namedthing ( C, "function", name );
		this._namedthing ( C.prototype, "object", name );
		return C;
	},

	/**
	 * Name constructor or instance.
	 * @param {object} what
	 * @param {String} type
	 * @param {String} name
	 */
	_namedthing : function ( what, type, name ) {
		this._displayname ( what, name );
		if ( !what.hasOwnProperty ( "toString" )) {
			what.toString = function toString () {
				return "[" + type + " " + name + "]";
			};
		}
	},

	/**
	 * Compute constructor body for class of given name.
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	_namedbody : function ( name ) {
		return this._BODY.replace ( 
			new RegExp ( "\\$name", "gm" ), 
			gui.Function.safename ( name )
		);
	},

	/**
	 * Set the elusive displayName property. Doesn't seem to work a lot.
	 * @param  {[type]} what [description]
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	_displayname : function ( thing, name ) {
		if ( !gui.Type.isDefined ( thing.displayName )) {
			Object.defineProperty ( thing, "displayName", 
				gui.Property.nonenumerable ({
					writable : true,
					value : name
				})
			);
		}
		return thing;
	}

};


// Class members .............................................................................

gui.Object.each ({

	/**
	 * Create subclass. This method is called on the class constructor: MyClass.extend()
	 * @param @optional {String} name
	 * @param {object} proto Base prototype
	 * @param {object} protos Prototype methods and properties
	 * @param {object} recurring Constructor and subconstructor extensions
	 * @param {object} statics Constructor extensions
	 * @returns {function} Constructor
	 */
	extend : function () { // protos, recurring, statics 
		return gui.Class._createsubclass ( this, arguments );
	},

	/**
	 * Mixin something on prototype while checking for naming collision.
	 * This method is called on the class constructor: MyClass.mixin()
	 * @TODO http://www.nczonline.net/blog/2012/12/11/are-your-mixins-ecmascript-5-compatible
	 * @param {String} name
	 * @param {object} value
	 * @param @optional {boolean} override Disable collision detection
	 */
	mixin : function ( name, value, override ) {
		if ( !gui.Type.isDefined ( this.prototype [ name ]) || override ) {
			this.prototype [ name ] = value;
			gui.Class.descendantsAndSelf ( this, function ( C ) {
				if ( C.$super ) { // mixed in method gets added to the _super objects...
					gui.Super.generateStub ( C.$super, C.prototype, name );
				}
			});
		} else {
			console.error ( "Mixin naming collision in " + this + ": " + name );
		}
	}

}, function ( name, method ) {
	gui.Class [ name ] = method;
});


// Class navigation .........................................................................

gui.Object.each ({

	/**
	 * Return superclass. If action is provided, return an array of the results 
	 * of executing the action for each subclass with the subclass as argument.
	 * @param {function} C constructor
	 * @param @optional {function} action
	 * @param @optional {object} thisp
	 * @returns {Array<gui.Class|object>}
	 */
	children : function ( C, action, thisp ) {
		var results = [];
		action = action || gui.Combo.identity;
		C.$subclasses.forEach ( function ( sub ) {
			results.push ( action.call ( thisp, sub ));
		}, thisp );
		return results;
	},

	/**
	 * Apply action recursively to all derived subclasses of given class.
	 * Returns an array of accumulated results. If no action is provided, 
	 * returns array of descendant sublasses.
	 * @param {function} C constructor
	 * @param @optional {function} action
	 * @param @optional {object} thisp 
	 * @param @internal {Array<gui.Class|object>} results
	 * @returns {Array<gui.Class|object>}
	 */
	descendants : function ( C, action, thisp, results ) {
		results = results || [];
		action = action || gui.Combo.identity;
		C.$subclasses.forEach ( function ( sub ) {
			results.push ( action.call ( thisp, sub ));
			gui.Class.descendants ( sub, action, thisp, results );
		}, thisp );
		return results;
	},

	/**
	 * Return descendant classes and class itself. If action is provided, return array of the results 
	 * of executing the action for each descendant class and class itself with the class as argument.
	 * @param {function} C constructor
	 * @param @optional {function} action
	 * @param @optional {object} thisp
	 * @returns {Array<gui.Class|object>}
	 */
	descendantsAndSelf : function ( C, action, thisp ) {
		var results = [];
		action = action || gui.Combo.identity;
		results.push ( action.call ( thisp, C ));
		return this.descendants ( C, action, thisp, results );
	},

	/**
	 * Return superclass. If action is provided, return the result 
	 * of executing the action with the superclass as argument.
	 * @param {function} C constructor
	 * @param @optional {function} action
	 * @param @optional {object} thisp
	 * @returns {gui.Class|object}
	 */
	parent : function ( C, action, thisp ) {
		action = action || gui.Combo.identity;
		return action.call ( thisp, C.$superclass );
	},

	/**
	 * Return ancestor classes. If action is provided, return array of the results 
	 * of executing the action for each ancestor class with the class as argument.
	 * @param {function} C constructor
	 * @param @optional {function} action
	 * @param @optional {object} thisp 
	 * @param @internal {<gui.Class|object>} results
	 * @returns {Array<gui.Class|object>}
	 */
	ancestors : function ( C, action, thisp, results ) {
		results = results || [];
		action = action || gui.Combo.identity;
		if ( C.$superclass ) {
			results.push ( action.call ( thisp, C.$superclass ));
			gui.Class.ancestors ( C.$superclass, action, thisp, results );
		}
		return results;
	},

	/**
	 * Return ancestor classes and class itself. If action is provided, return array of the results 
	 * of executing the action for each ancestor class and class itself with the class as argument.
	 * @param {function} C constructor
	 * @param @optional {function} action Takes the class as argument
	 * @param @optional {object} thisp
	 * @returns {Array<<gui.Class|object>>}
	 */
	ancestorsAndSelf : function ( C, action, thisp ) {
		var results = [];
		action = action || gui.Combo.identity;
		results.push ( action.call ( thisp, C ));
		return this.ancestors ( C, action, thisp, results );
	}

}, function ( name, method ) {
	gui.Class [ name ] = method;
});


/**
 * Working with properties.
 */
gui.Property = {

	/**
	 * Clone properties from source to target.
	 * @param {object} source
	 * @param {object} target
	 * @returns {object}
	 */
	extendall : function ( source, target ) {
		Object.keys ( source ).forEach ( function ( key ) {
			this.extend ( source, target, key );
		}, this );
		return target;
	},

	/**
	 * Copy property from source to target. Main feature is that it 
	 * will be setup to a property accessor (getter/setter) provided:
	 * 
	 * 1) The property value is an object
	 * 2) It has (only) one or both properties "getter" and "setter"
	 * 3) These are both functions
	 */
	extend : function ( source, target, key ) {
		var desc = Object.getOwnPropertyDescriptor ( source, key );
		desc = this._accessor ( target, key, desc );
		Object.defineProperty ( target, key, desc );
		return target;
	},

	/**
	 * Provide sugar for non-enumerable propety descriptors. 
	 * Omit "writable" since accessors must not define that.
	 * @param {object} desc
	 * @returns {object}
	 */
	nonenumerable : function ( desc ) {
		return gui.Object.extendmissing ({
			configurable : true,
			enumerable : false
		}, desc );
	},

	/**
	 * Create getter/setter for object assuming enumerable and configurable.
	 * @param {object} object The property owner
	 * @param {string} key The property name
	 * @param {object} def An object with methods "get" and/or "set"
	 * @returns {object}
	 */
	accessor : function ( object, key, def ) {
		if ( this._isaccessor ( def )) {
			return Object.defineProperty ( object, key, {
				enumerable : true,
				configurable : true,
				get : def.getter || this._NOGETTER,
				set : def.setter || this._NOSETTER
			});
		} else {
			throw new TypeError ( "Expected getter and/or setter method" );
		}
	},


	// Private ............................................................

	/**
	 * Object is getter-setter definition?
	 * @param {object} obj
	 * @returns {boolean}
	 */
	_isaccessor : function ( obj ) {
		return Object.keys ( obj ).every ( function ( key ) {
			var is = false;
			switch ( key ) {
				case "getter" :
				case "setter" :
					is = gui.Type.isFunction ( obj [ key ]);
					break;
			}
			return is;
		});
	},

	/**
	 * Copy single property to function prototype.
	 * @param {object} proto
	 * @param {String} key
	 * @param {object} desc
	 * @returns {object}
	 */
	_accessor : function ( proto, key, desc ) {
		var val = desc.value;
		if ( gui.Type.isObject ( val )) {
			if ( val.getter || val.setter ) {
				if ( this._isactive ( val )) {
					desc = this._activeaccessor ( proto, key, val );
				}
			}
		}
		return desc;
	},

	/**
	 * Object is getter-setter definition?
	 * @param {object} obj
	 * @returns {boolean}
	 */
	_isactive : function ( obj ) {
		return Object.keys ( obj ).every ( function ( key ) {
			var is = false;
			switch ( key ) {
				case "getter" :
				case "setter" :
					is = gui.Type.isFunction ( obj [ key ]);
					break;
			}
			return is;
		});
	},

	/**
	 * Compute property descriptor for getter-setter 
	 * type definition and assign it to the prototype.
	 * @param {object} proto
	 * @param {String} key
	 * @param {object} def
	 * @returns {defect}
	 */
	_activeaccessor : function ( proto, key, def ) {
		var desc;
		[ "getter", "setter" ].forEach ( function ( name, set ) {
			while ( proto && !gui.Type.isDefined ( def [ name ])) {
				proto = Object.getPrototypeOf ( proto );
				desc = Object.getOwnPropertyDescriptor ( proto, key );
				if ( desc ) {
					def [ name ] = desc [ set ? "set" : "get" ];
				}
			}
		});
		return {
			enumerable : true,
			configurable : true,
			get : def.getter || this._NOGETTER,
			set : def.setter || this._NOSETTER
		};
	},

	/**
	 * Bad getter.
	 */
	_NOGETTER : function () {
		throw new Error ( "Getting a property that has only a setter" );
	},

	/**
	 * Bad setter.
	 */
	_NOSETTER : function () {
		throw new Error ( "Setting a property that has only a getter" );
	}
};


/**
 * Checks an object for required methods and properties.
 */
gui.Interface = {

	/**
	 * Check object interface. Throw exception on fail.
	 * @param {object} interfais 
	 * @param {object} osbject
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
gui.Combo = {

	/**
	 * Decorate function before.
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
	 * Decorate function after.
	 * @param {function} decoration
	 * @returns {function}
	 */
	after : function ( decoration ) {
		return function ( base ) {
			return function () {
				var result = base.apply ( this, arguments );
				decoration.apply ( this, arguments );
				return result;
			};
		};
	},

	/**
	 * Decorate function around.
	 * @param {function} decoration
	 * @returns {function}
	 */
	around : function ( decoration ) {
		return function ( base ) {
			return function () {
				var argv, callback, result, that = this, slice = gui.Combo._slice;
				argv = 1 <= arguments.length ? slice.call ( arguments, 0 ) : [];
				result = void 0;
				callback = function () {
					return result = base.apply ( that, argv );
				};
				decoration.apply ( this, [ callback ].concat ( argv ));
				return result;
			};
		};
	},

	/**
	 * Decorate function provided with support for an otherwise operation.
	 * @param {function} condition
	 */
	provided : function ( condition ) {
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

	/**
	 * Make function return `this` if otherwise it would return `undefined`. 
	 * Variant of the `fluent` combinator which would always returns `this`. 
	 * We (will) use this extensively to ensure API consistancy, but we might 
	 * remove it for a theoretical performance gain once we have a test suite.
	 * @param {function} base
	 * @returns {function}
	 */
	chained : function ( base ) {
		return function () {
			var result = base.apply ( this, arguments );
			return result === undefined ? this : result;
		};
	},

	/**
	 * Simply output the input. Wonder what it could be.
	 * @param {object} subject
	 * @return {object}
	 */
	identity : function ( subject ) {
		return subject;
	},


	// Private ..........................................................

	/**
	 * Slice it once and for all.
	 * @type {function}
	 */
	_slice : [].slice
	
};


/**
 * Det er bare super.
 * @param {function} C
 */
gui.Super = function Super ( C ) {
	gui.Super.generateStubs ( this, C.prototype );
};

gui.Super.prototype = Object.create ( null );


// Static .......................................................................

gui.Object.each ({ // generating static methods

	/**
	 * Instance of gui.Class which is now invoking _super()
	 * @type {object}
	 */
	$subject : null,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[function gui.Super]";
	},

	/**
	 * Declare all method stubs on {gui.Super} instance.
	 * @param {gui.Super} suber
	 * @param {object} proto
	 */
	generateStubs : function ( suber, proto ) {
		gui.Object.methods ( proto ).forEach ( function ( name ) {
			gui.Super.generateStub ( suber, proto, name );
		}, this );
	},

	/**
	 * Declare single method stub on {gui.Super} instance.
	 * @param {gui.Super} suber
	 * @param {object} proto
	 * @param {String} name Method name
	 */
	generateStub : function ( suber, proto, name ) {
		var func = suber [ name ] = function () {
			return proto [ name ].apply ( gui.Super.$subject, arguments );
		};
		func.displayName = name;
	},

	/**
	 * Transfer methods from protos to proto 
	 * while decorating for `_super` support.
	 * @param {function} SuperC
	 * @param {object} C
	 * @param {object} protos
	 */
	support : function ( SuperC, C, protos ) {
		var proto = C.prototype;
		var combo = this._decorator ( SuperC );
		gui.Object.each ( protos, function ( key, base ) {
			if ( gui.Type.isMethod ( base )) {
				proto [ key ] = combo ( base );
				proto [ key ].toString = function () {
					var original = base.toString ().replace ( /\t/g, "  " );
					return gui.Super._DISCLAIMER + original;
				};
			}
		}, this );
	},


	// Private static .......................................................

	/**
	 * Prepended to the result of calling 
	 * toString() on a modified function.
	 * @type {String}
	 */
	_DISCLAIMER : "/**\n" +
		"  * Method was overloaded by the framework. \n" +
		"  * This is an approximation of the code :) \n" +
		"  */\n",

		/**
	 * Get tricky decorator.
	 * @param {function} SuperC
	 * @returns {function}
	 */
	_decorator : function ( SuperC ) {
		return function ( base ) {
			return function () {
				var sub = gui.Super.$subject;
				gui.Super.$subject = this;
				this._super = SuperC.$super;
				var result = base.apply ( this, arguments );
				gui.Super.$subject = sub;
				return result;
			};
		};
	}

}, function ( name, value ) {
	gui.Super [ name ] = value;
});


/**
 * Something that has position.
 * @param {number} x
 * @param {number} y
 */
gui.Position = function ( x, y ) {
	this.x = x || 0;
	this.y = y || 0;
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


// Static .............................................................

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
 * Something that has width and height.
 * @param {number} w
 * @param {number} h
 */
gui.Dimension = function ( w, h ) {
	this.w = w || 0;
	this.h = h || 0;
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


// Static .........................................................

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
 * Something that has position and width and height.
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
gui.Geometry = function ( x, y, w, h ) {
	this.x = x || 0;
	this.y = y || 0;
	this.w = w || 0;
	this.h = h || 0;
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


// Static .............................................................

/**
 * Compare two geometries.
 * @param {gui.Geometry} geo1
 * @param {gui.Geometry} geo2
 * @returns {boolean}
 */
gui.Geometry.isEqual = function ( geo1, geo2 ) {
	return ( 
		( geo1.x === geo2.x ) && 
		( geo1.y === geo2.y ) && 
		( geo1.w === geo2.w ) && 
		( geo1.h === geo2.h )
	);
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
 * Encapsulates a callback for future use. 
 * @TODO mimic DOM Futures to some degree.
 */
gui.Then = function Then () {};

gui.Then.prototype = {

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
    if ( this._now ) {
      this.now ();
    }
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
    } else {
      this._now = true;
    }
  },


  // Private .................................................

  /**
   * Callback to execute when transition is done.
   * @type {function}
   */
  _callback : null,

  /**
   * Preserve integrity of "this" keyword in callback function.
   * @type {object}
   */
  _pointer : null,

  /**
   * Execute as soon as callback gets delivered?
   * @type {boolean}
   */
  _now : false

};



/**
 * Parse HTML string to DOM node(s) in given document context. 
 * Adapted from https://github.com/petermichaux/arbutus
 * @TODO High level awareness of HTMLparser elements. Plugin ui.SpiritDOM and ui.Spirit.parse should know about added historic HTML chrome and strip when inserted.
 * @param {Document} doc
 * @TODO: make this whole thing static
 */
gui.HTMLParser = function HTMLParser ( doc ) {
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
	 * Parse HTML to DOM node(s). Note that this always returns an array.
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
		// HTML needs wrapping in obscure structure for historic reasons?
		html = html.trim ().replace ( comments, "" );
		if (( match = html.match ( firsttag ))) {
			if (( fix = fixes.get ( match [ 1 ]))) {
				html = fix.replace ( "${html}", html );
			}
		}
		// Parse HTML to DOM nodes.
		temp = doc.createElement ( "div" );
		temp.innerHTML = html;
		// Extract elements from obscure structure for historic reasons?
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
 * @type {RegExp}
 */
gui.HTMLParser._comments = /<!--[\s\S]*?-->/g;

/**
 * Match first tag.
 * @type {RegExp}
 */
gui.HTMLParser._firsttag = /^<([a-z]+)/i;

/**
 * Mapping tag names to miminum viable tag structure.
 * Considerable foresight has decided that text/html 
 * must forever remain backwards compatible with IE5.
 * @type {Map<String,String>}
 */
gui.HTMLParser._fixes = new Map ();

/**
 * Populate fixes.
 * @TODO "without the option in the next line, the parsed option will always be selected."
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
 * @TODO work on the HTML without XML...
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
 * @TODO custom protocol handlers to load from localstorage
 */
gui.FileLoader = gui.Class.create ( "gui.FileLoader", Object.prototype, {

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
	
	
	// Private ........................................................

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
	 * Request external file while blocking subsequent similar request.
	 * @param {gui.URL} url
	 * @param {function} callback
	 * @param @optional {object} thisp
	 */
	_request : function ( url, callback, thisp ) {
		this._cache.set ( url.location, null );
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
		if ( cached !== null ) { // note that null type is important
			this.onload ( cached, url, callback, thisp );
		} else {
			var that = this;
			gui.FileLoader.queue ( url.location, function ( text ) {
				that.onload ( text, url, callback, thisp );
			});
		}
	},
	

	// Secrets ..........................................................

	/**
	 * Secret constructor.
	 * @param {gui.Spirit} spirit
	 * @param {Window} window
	 * @param {function} handler
	 */
	$onconstruct : function ( doc ) {
		if ( doc && doc.nodeType === Node.DOCUMENT_NODE ) {
			this.onconstruct ( doc );
		} else {
			throw new TypeError ( "Document expected" );
		}
	}

	
}, {}, { // Static ....................................................

	/**
	 * Cache previously retrieved files, mapping URL to file text.
	 * @type {Map<String,String>}
	 */
	_cache : new Map (),

	/**
	 * Queue handlers for identical requests, mapping URL to function.
	 * @type {Array<String,function>}
	 */
	_queue : new Map (),

	/**
	 * Queue onload handler for identical request.
	 * @param {String}
	 */
	queue : function ( src, action ) {
		this._queue [ src ] =  this._queue [ src ] || [];
		this._queue [ src ].push ( action );
	},

	/**
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


/**
 * Blob file loader. Work in progress.
 */
gui.BlobLoader = {

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
	},

	// Private .............................

	/**
	 * Weirdo URL object.
	 * @type {URL}
	 */
	_URL : ( window.URL || window.webkitURL )
	
};


/**
 * Provides convenient access to an events originating 
 * window, document and spirit of the document element. 
 * @TODO Fire this onmousemove only if has listeners!
 * @param {Event} e
 */
gui.EventSummary = function ( e ) {
	this._construct ( e );
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


	// Private ..............................................

	/**
	 * Breakdown event argument into more manegable properties 
	 * (this method illustrates the need for en event summary).
	 * @param {Event} e
	 * @returns {object}
	 */
	_construct : function ( e ) {
		var win = null, doc = null, target = e.target, type = target.nodeType;
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
 * @TODO method <code>descendSub</code> to skip start element (and something similar for ascend)
 * @param @optional {String} type
 */
gui.Crawler = function ( type ) {
	this.type = type || null;
	return this;
};

gui.Crawler.prototype = {

	/**
	 * Recursion directives.
	 * @TODO skip children, skip element etc
	 */
	CONTINUE: 0,
	STOP : 1,

	/**
	 * Identifies crawler. @TODO spirit support for this!
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
	 * @TODO ascendGlobal should do the global
	 * @param {Element|gui.Spirit} start
	 * @param {object} handler
	 */
	ascend : function ( start, handler ) {
		this.direction = gui.Crawler.ASCENDING;
		var win, elm = start instanceof gui.Spirit ? start.element : start;
		do {
			if ( elm.nodeType === Node.DOCUMENT_NODE ) {
				if ( this.global ) {
					win = elm.defaultView;
					if ( win.parent !== win ) {
						if ( win.location.search.contains ( gui.IframeSpirit.KEY_SIGNATURE )) {
							elm = null;	
							if ( gui.Type.isFunction ( handler.transcend )) {
								this._transcend ( win, win.parent, handler );
							}
						} else {
							elm = win.frameElement;
						}
					} else {
						elm = null;
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
	 * @TODO descendGlobal
	 * @TODO Transcend into iframes.
	 * @param {object} start Spirit or Element
	 * @param {object} handler
	 */
	descend : function ( start, handler, arg ) {
		this.direction = gui.Crawler.DESCENDING;
		var elm = start instanceof gui.Spirit ? start.element : start;
		if ( elm.nodeType === Node.DOCUMENT_NODE ) {
			elm = elm.documentElement;
		}
		this._descend ( elm, handler, arg, true );
	},


	// Private .................................................................

	/**
	 * Iterate descending.
	 * @param {Element} elm
	 * @param {object} handler
	 * @param {boolean} start
	 */
	_descend : function ( elm, handler, arg, start ) {
		var win, spirit, directive = this._handleElement ( elm, handler, arg );
		switch ( directive ) {
			case 0 :
			case 2 :
				if ( directive !== 2 ) {
					if ( elm.childElementCount > 0 ) {
						this._descend ( elm.firstElementChild, handler, arg, false );
					} else if ( this.global && elm.localName === "iframe" ) {
						if (( spirit = elm.spirit )) {
							if ( spirit.external ) {
								win = elm.ownerDocument.defaultView;
								if ( gui.Type.isFunction ( handler.transcend )) {
									this._transcend ( win, spirit.contentWindow, handler );
								}
							} else {
								var root = elm.contentDocument.documentElement;
								this._descend ( root, handler, arg, false );
							}
						}
					}
				}
				if ( !start ) {
					var next = elm.nextElementSibling;
					if ( next !== null ) {
						this._descend ( next, handler, arg, false );
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
	_handleElement : function ( element, handler, arg ) {
		var directive = gui.Crawler.CONTINUE;
		var spirit = element.spirit;
		if ( spirit ) {
			directive = spirit.oncrawler ( this );
		}
		if ( !directive ) {
			if ( handler ) {
				if ( gui.Type.isFunction ( handler.handleElement )) {
					directive = handler.handleElement ( element, arg );
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
	},

	/**
	 * Teleport crawler to hosting (parent) or hosted (subframe) domain.
	 * @param {Window} thiswin Current window
	 * @param {Window} thatwin Target window
	 * @param {object} handler
	 */
	_transcend : function ( thiswin, thatwin, handler ) {
		var uri, key, cut, url = thiswin.location.href;
		var sig = gui.URL.getParam ( url, gui.IframeSpirit.KEY_SIGNATURE );
		if ( sig ) {
			cut = sig.split ( "/" ),
			key = cut.pop (),
			uri = cut.join ( "/" );
		} else {
			uri = "*"; // @TODO
			key = thiswin.gui.signature;
		}
		handler.transcend ( thatwin, uri, key );
	}
};


// Static ..............................................................

gui.Crawler.ASCENDING = "ascending";
gui.Crawler.DESCENDING = "descending";

/**
 * Bitmask setup supposed to be going on here.
 * @TODO TELEPORT_ELSEWEHERE stuff.
 */
gui.Crawler.CONTINUE = 0;
gui.Crawler.STOP = 1;
gui.Crawler.SKIP_CHILDREN = 2;


/**
 * Simplistic XMLHttpRequest wrapper. 
 * Work in progress, lot's to do here.
 * @param @optional {String} url
 * @param @optional {Document} doc Resolve URL relative tó this document (portal mode)
 */
gui.Request = function ( url, doc ) {
	if ( url ) {
		this.url ( url, doc );
	}
};

gui.Request.prototype = {

	/**
	 * Set request address.
	 * @param {String} url
	 * @param @optional {Document} doc Resolve URL relative tó this document
	 */
	url : function ( url, doc ) {
		this._url = doc ? new gui.URL ( doc, url ).href : url;
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
	 * Expect text response.
	 * @returns {gui.SpiritRquest}
	 */
	acceptText : function () {
		return this.accept ( "text/plain" );
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
		console.warn ( "@TODO request headers" );
		return this;
	},

	/**
	 * Get stuff.
	 * @TODO Synchronous version
	 * @TODO Unhardcode status
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
	
	
	// Private ...................................................................................

	/**
	 * @type {boolean}
	 */
	_async : true,

	/**
	 * @type {String}
	 */
	_url : null,

	/**
	 * Expected response type.
	 * @TODO an array?
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
	
	
	// Lifecycle .............................................................................

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
		this.$plugin ();
		this.$debug ( true );
		this.life.goconstruct ();
	},
	
	/**
	 * `onconfigure` gets callend immediately after construction. This 
	 * instructs the spirit to parse configuration attributes in markup. 
	 * @TODO Explain this
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
		this.$debug ( false );
		this.life.godestruct ();
		this.$ondestruct ( now );
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
	
	/**
	 * Handle life (tell me more)
	 * @param {gui.Life} life
	 */
	onlife : function ( life ) {},
	
	
	// More stuff ............................................................................

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
	

	// Secret ................................................................................
	
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
	$lazyplugins : null,

	/**
	 * Plug in the plugins.
	 *
	 * - life plugin first
	 * - config plugin second
	 * - bonus plugins galore
	 */
	$plugin : function () {
		this.life = new gui.LifePlugin ( this );
		this.attconfig = new gui.AttConfigPlugin ( this );
		this.$lazyplugins = Object.create ( null );
		var prefixes = [], plugins = this.constructor.$plugins;
		gui.Object.each ( plugins, function ( prefix, Plugin ) {
			switch ( Plugin ) {
				case gui.LifePlugin :
				case gui.ConfigPlugin :
					break;
				default :
					if ( Plugin.lazy ) {
						gui.Plugin.later ( Plugin, prefix, this, this.$lazyplugins );
					} else {
						this [ prefix ] = new Plugin ( this );
					}
					prefixes.push ( prefix );
					break;
			}
		}, this );
		this.life.onconstruct ();
		this.attconfig.onconstruct ();
		prefixes.forEach ( function ( prefix ) {
			if ( !this.$lazyplugins [ prefix ]) {
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
	},
	
	/**
	 * Total destruction. We have hotfixed conflicts upon destruction by moving the property nulling 
	 * to a new execution stack, but the consequences should be thought throught at some point.
	 * @param @optional {boolean} now Destruct immediately (for example when the window unloads)
	 */
	$ondestruct : function ( now ) {
		var map = this.$lazyplugins;
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
							thing.$ondestruct ( now );
						}
					}
					break;
			}
		}, this );
		this.life.$ondestruct (); // dispose life plugin last
		if ( now ) {
			this.$null ();
		} else {
			var that = this;
			var tick = gui.TICK_SPIRIT_NULL;
			var spirit = this;
			var title = this.document.title;
			gui.Tick.one ( tick, {
				ontick : function () {
					try {
						that.$null ();
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
	$null : function () {
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

	/**
	 * Mapping plugin constructor to plugin prefix.
	 * @type {Map<String,function>}
	 */
	$plugins : Object.create ( null )

	
}, { // Static .............................................................................

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


/**
 * Base class for all spirit plugins.
 * @TODO "context" should be required in constructor
 * @TODO Rename "gui.Plugin"
 * @TODO Rename *all* plugins to gui.SomethingPlugin :)
 */
gui.Plugin = gui.Class.create ( "gui.Plugin", Object.prototype, {

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
	 * @TODO rename ondestruct
	 * @param @optional {boolean} now @TODO: we might not need this arg in plugins...
	 */
	ondestruct : function ( now ) {},

	/**
	 * @deprecated
	 * Deprecated ondestruct alias.
	 * @param @optional {boolean} now
	 */
	destruct : function ( now ) {
		console.log ("Deprecated");
		this.ondestruct ( now );
	},

	/**
	 * Implements DOM2 EventListener. Forwards to onevent().
	 * @param {Event} e
	 */
	handleEvent : function ( e ) {
		if ( gui.Type.isFunction ( this.onevent )) {
			this.onevent ( e );
		}
	},
	
	
	// Secret ...........................................................

	/**
	 * Secret constructor. Can we identify the 
	 * spirit and it's associated window? Not, 
	 * then we are maybe inside a Web Worker.
	 * @param {gui.Spirit} spirit
	 */
	$onconstruct : function ( spirit ) {
		this.spirit = spirit || null;
		this.context = spirit ? spirit.window : null;
		this.onconstruct ();
	},

	/**
	 * Secret destructor.
	 * @param @optional {boolean} now
	 */
	$ondestruct : function ( now ) {
		this.ondestruct ( now );
		if ( this.spirit !== null ) {
			Object.defineProperty ( this, "spirit", gui.Spirit.DENIED );
		}
	}
	

}, { // Recurring static ........................................

	/**
	 * Construct only when requested?
	 * @type {boolean}
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


}, { // Static ..................................................

	/**
	 * Lazy initialization stuff.
	 * @experimental
	 * @param {gui.Plugin} Plugin
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
					map [ prefix ] = new Plugin ( spirit );
					map [ prefix ].onconstruct ();
				}
				return map [ prefix ];
			},
			set : function ( x ) {
				map [ prefix ] = x; // or what?
			}
		});
	}

});


/**
 * Comment goes here.
 * @extends {gui.Plugin}
 */
gui.Tracker = gui.Plugin.extend ( "gui.Tracker", {

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
		this._xxx = Object.create ( null );
		if ( this.spirit ) {
			this._sig = this.spirit.window.gui.signature;
		}
	},

	/**
	 * @TODO Toggle type(s).
	 * @param {object} arg
	 * @returns {gui.Tracker}
	 */
	toggle : function ( arg, checks ) {
		console.error ( "@TODO SpiritTracker#toggle" );
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
	 * Cleanup on destruction.
	 */
	ondestruct : function () {
		var type, list;
		this._super.ondestruct ();
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
			// do cleanup here (perhaps overwrite all this to perform _removechecks elsewhere)
		}
	},
	
	
	// Private .....................................................
		
	/**
	 * Global mode? This doesn't nescessarily makes 
	 * sense for all {gui.Tracker} implementations.
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
	 * Can remove type of given checks? If so, do it now.
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
				result = true;
				if ( gui.Array.remove ( list, index ) === 0 ) {
					delete this._xxx [ type ];
				}
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
	 * All checks removed?
	 * @returns {boolean}
	 */
	_hashandlers : function () {
		return Object.keys ( this._xxx ).length > 0;
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
	 * Resolve single argument into array with one or more entries.
	 * @param {Array<String>|String} arg
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
 * Module base.
 */
gui.Module = gui.Class.create ( "gui.Module", Object.prototype, {

	/**
	 * Plugins for all spirits.
	 * @type {Map<String,gui.Plugin>}
	 */
	plugins : null,

	/**
	 * Mixins for all spirits.
	 * @type {Map<String,function>}
	 */
	mixins : null,

	/**
	 * Channeling spirits to CSS selectors.
	 * @type {Map<Array<Array<String,gui.Spirit>>}
	 */
	channels : null,

	/**
	 * Called immediately. Other modules may not be loaded yet.
	 * @return {Window} context
	 */
	oncontextinitialize : function ( context ) {},

	/**
	 * Called before spirits kick in.
	 * @return {Window} context
	 */
	onbeforespiritualize : function ( context ) {},

	/**
	 * Called after spirits kicked in.
	 * @return {Window} context
	 */
	onafterspiritualize : function ( context ) {},

	/**
	 * @TODO support this
	 * @param {Window} context
	 */
	oncontextload : function ( context ) {},

	/**
	 * @TODO support this
	 * @param {Window} context
	 */
	oncontextunload : function ( context ) {},


	// Secrets ........................................................

	/**
	 * Secret constructor.
	 * 
	 * 1. extend {gui.Spirit} with mixins
	 * 2. inject plugins for (all) spirits
	 * 3. channel spirits to CSS selectors
	 * @param {Window} context
	 */
	$onconstruct : function ( context ) {
		var base = context.gui.Spirit;
		if ( gui.Type.isObject ( this.mixins )) {
			gui.Object.each ( this.mixins, function ( name, value ) {
				base.mixin ( name, value );
			});
		}
		if ( gui.Type.isObject ( this.plugins )) {
			gui.Object.each ( this.plugins, function ( prefix, plugin ) {
				if ( gui.Type.isDefined ( plugin )) {
					base.plugin ( prefix, plugin );
				} else {
					console.error ( "Undefined plugin for prefix: " + prefix );
				}
			});
		}
		if ( gui.Type.isArray ( this.channels )) {
			this.channels.forEach ( function ( channel ) {
				var query = channel [ 0 ];
				var klass = channel [ 1 ];
				context.gui.channel ( query, klass );
			}, this );
		}
		this.$setupcontext ( context );
	},

	/**
	 * Setup that context, once for every context the module has been portalled to.
	 * @see {gui.Spiritual#portal}
	 * @param {Window} context
	 */
	$setupcontext : function ( context ) {
		var that = this;
		var msg1 = gui.BROADCAST_WILL_SPIRITUALIZE;
		var msg2 = gui.BROADCAST_DID_SPIRITUALIZE;
		if ( this.oncontextinitialize ) {
			this.oncontextinitialize ( context );
		}
		gui.Broadcast.addGlobal ([
			msg1, 
			msg2
		], { 
			onbroadcast : function ( b ) {
				if ( b.data === context.gui.signature ) {
					gui.Broadcast.removeGlobal ( b.type, this );
					switch ( b.type ) {
						case msg1 :
							if ( gui.Type.isFunction ( that.onbeforespiritualize )) {
								that.onbeforespiritualize ( context );	
							}
							break;
						case msg2 :
							if ( gui.Type.isFunction ( that.onafterspiritualize )) {
								that.onafterspiritualize ( context );	
							}
							break;
				}
			}
		}});
	}

});


/**
 * SpiritLife is a non-bubbling event type that covers the life cycle of a spirit.
 * @see {gui.LifePlugin}
 * @param {gui.Spirit} target
 * @param {String} type
 */
gui.Life = function SpiritLife ( target, type ) {
	this.target = target;
	this.type = type;
};

gui.Life.prototype = {

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
		return "[object gui.Life]";
	}
};


/**
 * Tracking spirit life cycle events.
 * @TODO Support optional data argument
 * @extends {gui.Tracker}
 */
gui.LifePlugin = gui.Tracker.extend ( "gui.LifePlugin", {

	/**
	 * Spirit is constructed? This is almost certainly true by 
	 * the time you address the spirit.
	 * @type {boolean}
	 */
	constructed : false,

	/**
	 * @TODO EXPERIMENT...
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
	 * Construction time.
	 * @overloads {gui.Tracker#construct}
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
	 * Dispatch type and cleanup handlers for life cycle events that only occurs once.
	 * @TODO support optional data argument
	 * @param {String} type
	 */
	dispatch : function ( type ) {
		var list = this._handlers [ type ];
		if ( list !== undefined ) {
			var life = new gui.Life ( this.spirit, type );
			list.forEach ( function ( handler ) {
				handler.onlife ( life );
			});
			switch ( type ) {
				case gui.Life.CONSTRUCT :
				case gui.Life.CONFIGURE :
				case gui.Life.ENTER :
				case gui.Life.READY :
				case gui.Life.DETACH :
				case gui.Life.EXIT :
				case gui.Life.DESTRUCT :
					delete this._handlers [ type ];
					break;
			}
		}
	},

	/**
	 * @TODO move declaration to super or something (?)
	 * @type {Map<String,Array<object>}
	 */
	_handlers : null

});

/**
 * Generate methods to update life cycle status:
 * 1) Update booleans entered, attached, detached etc.
 * 2) Dispatch life-event gui.Life.ATTACH etc.
 */
( function generatecode () {
	var states = {
		construct : gui.LIFE_CONSTRUCT,
		configure : gui.LIFE_CONFIGURE,
		enter : gui.LIFE_ENTER,
		attach : gui.LIFE_ATTACH,
		ready : gui.LIFE_READY,
		visible : gui.LIFE_VISIBLE,
		invisible : gui.LIFE_INVISIBLE,
		detach : gui.LIFE_DETACH,
		exit : gui.LIFE_EXIT,
		destruct : gui.LIFE_DESTRUCT
	};
	// prefix methods with "on", suffix booleans with "ed"
	gui.Object.each ( states, function ( state, event ) {
		gui.LifePlugin.mixin ( "go" + state , function () {
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


/**
 * Configures a spirit by attribute parsing.
 * @extends {gui.Plugin}
 */
gui.AttConfigPlugin = gui.Plugin.extend ( "gui.AttConfigPlugin", {

	/**
	 * Mapping attribute names to an expanded syntax (eg. "myatt" becomes "my.plugin.att").
	 * @type {Map<String,String>}
	 */
	map : null,

	/**
	 * Invoked by the {gui.Spirit} once all plugins have been plugged in. 
	 * @TODO: Simple props with no setter does nothing when updated now. 
	 * Perhaps it would be possible to somehow configure those *first*?
	 * @TODO Figure out whether or not this should postpone to onenter()
	 */
	configureall : function () {
		var atts = this.spirit.element.attributes;
		Array.forEach ( atts, function ( att ) {
			this.configureone ( att.name, att.value );
		}, this );
	},

	/**
	 * Setup configuration (if applicable) after an attribute update. 
	 * This should probably only ever be invoked by the {gui.AttPlugin}.
	 * @param {String} name
	 * @param {String} value
	 */
	configureone : function ( name, value ) {
		this._evaluate ( this._lookup ( name ), value );
	},


	// Private .................................................................
	
	/**
	 * Evaluate single attribute in search for "gui." prefix.
	 * @param {String} name
	 * @param {String} value
	 */
	_evaluate : function ( name, value ) {
		var prefix = "gui.",
			struct = this.spirit,
			success = true,
			prop = null,
			cuts = null;
		if ( name.startsWith ( prefix )) {
			name = name.split ( prefix )[ 1 ];
			prop = name;
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
				// Autocast (string) value to an inferred type.
				// "false" becomes boolean, "23" becomes number.
				value = gui.Type.cast ( value );
				if ( gui.Type.isFunction ( struct [ prop ])) {
					struct [ prop ] ( value );
				} else {
					struct [ prop ] = value;
				}
			} else {
				console.error ( "No definition for \"" + name + "\": " + this.spirit.toString ());
			}
		}
	},

	/**
	 * Lookup mapping for attribute name, eg. "my.nested.complex.prop" 
	 * can be mapped to a simple attribute declaration such as "myprop".
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


}, { // Static ...............................................................


	/**
	 * @type {boolean}
	 */
	lazy : false

});


/**
 * Spirit action.
 * @param {gui.Spirit} target
 * @param {String} type
 * @param @optional {object} data
 * @param @optional {String} direction
 * @param @optional {boolean} global
 */
gui.Action = function Action ( target, type, data, direction, global ) {
	this.target = target;
	this.type = type;
	this.data = data;
	this.direction = direction || gui.Action.ASCEND;
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
	 * Is travelling up or down? Matches "ascend" or "descend".
	 * @type {String}
	 */
	direction : null,

	/**
	 * Traverse iframe boundaries?
	 * @TODO cross-domain actions.
	 * @type {boolean}
	 */
	global : false,

	/**
	 * Used when posting actions xdomain. Matches an iframespirit key.
	 * @type {String}
	 */
	$instanceid : null,

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
	 * Which spirit consumed the action?
	 * @type {gui.Spirit}
	 */
	consumer : null,

	/**
	 * Block further ascend.
	 * @param @optional {gui.Spirit} consumer
	 */
	consume : function ( consumer ) {
		this.isConsumed = true;
		this.consumer = consumer;
	},

	/**
	 * Consume and cancel the event. Note that it is 
	 * up to the dispatcher to honour cancellation.
	 * @param @optional {gui.Spirit} consumer
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


// Static .........................................................................

gui.Action.DESCEND = "descend";
gui.Action.ASCEND = "ascend";

/**
 * Dispatch action. The dispatching spirit will not `onaction()` its own action.
 * @TODO Class-like thing to carry all these scoped methods...
 * @TODO support custom `gui.Action` as an argument
 * @TODO common exemplar for action, broadcast etc?
 * @param {gui.Spirit} target
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
		/*
		 * @param {gui.Spirit} spirit
		 */
		handleSpirit : function ( spirit ) {
			var directive = gui.Crawler.CONTINUE;
			if ( spirit.action.contains ( type )) {
				spirit.action.handleAction ( action );
				if ( action.isConsumed ) {
					directive = gui.Crawler.STOP;
					action.consumer = spirit;
				}
			}
			return directive;
		},
		/*
		 * Teleport action across domains (through iframe boundaries).
		 * @see {gui.IframeSpirit}
		 * @param {Window} win Remote window
		 * @param {String} uri target origin
		 * @param {String} key Spiritkey of xdomain IframeSpirit (who will relay the action)
		 */
		transcend : function ( win, uri, key ) {
			var msg = gui.Action.stringify ( action, key );
			win.postMessage ( msg, uri );
		}
	});
	return action;
};

/**
 * Encode action to be posted xdomain.
 * @param {gui.Action} a
 * @param @optional {String} key Associates dispatching document 
 *        to the hosting iframespirit (ascending action scenario)
 * @returns {String}
 */
gui.Action.stringify = function ( a, key ) {
	var prefix = "spiritual-action:";
	return prefix + ( function () {
		a.target = null;
		a.data = ( function ( d ) {
			if ( gui.Type.isComplex ( d )) {
				if ( gui.Type.isFunction ( d.stringify )) {
					d = d.stringify ();
				} else {
					try {
						JSON.stringify ( d );
					} catch ( jsonexception ) {
						d = null;
					}
				}
			}
			return d;
		}( a.data ));
		a.$instanceid = key || null;
		return JSON.stringify ( a );
	}());
};

/**
 * Decode action posted from xdomain and return an action-like object.
 * @param {String} msg
 * @returns {object}
 */
gui.Action.parse = function ( msg ) {
	var prefix = "spiritual-action:";
	if ( msg.startsWith ( prefix )) {
		return JSON.parse ( msg.split ( prefix )[ 1 ]);
	}
};


/** 
 * ActionPlugin.
 * @extends {gui.Tracker}
 * @using {gui.Arguments#confirmed}
 * @using {gui.Combo#chained}
 */
gui.ActionPlugin = ( function using ( confirmed, chained ) {
	
	return gui.Tracker.extend ( "gui.ActionPlugin", {

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
		 * @returns {gui.ActionPlugin}
		 */
		add : confirmed ( "array|string", "(object|function)" ) (
			chained ( function ( arg, handler ) {
				handler = handler ? handler : this.spirit;
				if ( gui.Interface.validate ( gui.IActionHandler, handler )) {
					this._breakdown ( arg ).forEach ( function ( type ) {
						this._addchecks ( type, [ handler, this._global ]);
					}, this );
				}
			})
		),

		/**
		 * Remove one or more action handlers.
		 * @param {object} arg
		 * @param @optional {object} handler
		 * @returns {gui.ActionPlugin}
		 */
		remove : confirmed ( "array|string", "(object|function)" ) (
			chained ( function ( arg, handler ) {
				handler = handler ? handler : this.spirit;
				if ( gui.Interface.validate ( gui.IActionHandler, handler )) {
					this._breakdown ( arg ).forEach ( function ( type ) {
						this._removechecks ( type, [ handler, this._global ]);
					}, this );
				}
			})
		),

		/**
		 * Add global action handler(s).
		 * @param {object} arg
		 * @param @optional {object} handler
		 * @returns {gui.ActionPlugin}
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
		 * @returns {gui.ActionPlugin}
		 */
		removeGlobal : function ( arg, handler ) {
			return this._globalize ( function () {
				return this.remove ( arg, handler );
			});
		},

		/**
		 * Dispatch type(s) ascending by default.
		 * @alias {gui.ActionPlugin#ascend}
		 * @param {String} type
		 * @param @optional {object} data
		 * @param @optional {String} direction "ascend" or "descend"
		 * @returns {gui.Action}
		 */
		dispatch : confirmed ( "string", "(*)", "(string)" ) (
			function ( type, data, direction ) {
				return gui.Action.dispatch ( 
					this.spirit, 
					type, 
					data, 
					direction || "ascend",
					this._global 
				);
			}
		),

		/**
		 * Dispatch type(s) ascending.
		 * @alias {gui.ActionPlugin#dispatch}
		 * @param {object} arg
		 * @param @optional {object} data
		 * @returns {gui.Action}
		 */
		ascend : function ( arg, data ) {
			return this.dispatch ( arg, data, "ascend" );
		},

		/**
		 * Dispatch type(s) descending.
		 * @alias {gui.ActionPlugin#dispatch}
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
		 * Handle action. If it matches listeners, the action will be 
		 * delegated to the spirit. Called by `gui.Action` crawler.
		 * @see {gui.Action#dispatch}
		 * @param {gui.Action} action
		 */
		handleAction : function ( action ) {
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


		// Private ....................................................
		
		/**
		 * Remove delegated handlers. 
		 * @TODO verify that this works
		 * @overwrites {gui.Tracker#_cleanup}
		 * @param {String} type
		 * @param {Array<object>} checks
		 */
		_cleanup : function ( type, checks ) {
			var handler = checks [ 0 ], global = checks [ 1 ];
			if ( global ) {
				this.removeGlobal ( type, handler );
			} else {
				this.remove ( type, handler );
			}
		}

	});

}( gui.Arguments.confirmed, gui.Combo.chained ));


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
 * Methods to read and write DOM attributes.
 * @extends {gui.Tracker}
 * @using {gui.Combo.chained}
 */
gui.AttPlugin = ( function using ( chained ) {

	return gui.Plugin.extend ( "gui.AttPlugin", {

		/**
		 * Get single element attribute cast to an inferred type.
		 * @param {String} att
		 * @returns {String|number|boolean} Autoconverted
		 */
		get : function ( name ) {
			return gui.AttPlugin.get ( this.spirit.element, name );
		},

		/**
		 * Set single element attribute (use null to remove).
		 * @param {String} name
		 * @param {String|number|boolean} value
		 * @returns {gui.AttPlugin}
		 */
		set : chained ( function ( name, value ) {
			if ( !this.$suspended ) {
				gui.AttPlugin.set ( this.spirit.element, name, value );
			}
		}),

		/**
		 * Element has attribute?
		 * @param {String|number|boolean} att
		 * @returns {boolean}
		 */
		has : function ( name ) {
			gui.AttPlugin.has ( this.spirit.element, name );
		},

		/**
		 * Remove element attribute.
		 * @param {String} att
		 * @returns {gui.AttPlugin}
		 */
		del : chained ( function ( name ) {
			if ( !this.$suspended ) {
				gui.AttPlugin.del ( this.spirit.element, name );
			}
		}),

		/**
		 * Collect attributes as an array (of DOMAttributes).
		 * @returns {Array<Attr>}
		 */
		all : function () {
			return gui.AttPlugin.all ( this.spirit.element );
		},

		/**
		 * Get all attributes as hashmap type object. 
		 * Values are converted to an inferred type.
		 * @returns {Map<String,String>} 
		 */
		getmap : function () {
			return gui.AttPlugin.getmap ( this.spirit.element );
		},

		/**
		 * Invoke multiple attributes update via hashmap 
		 * argument. Use null value to remove an attribute.
		 * @param {Map<String,String>}
		 */
		setmap : function ( map ) {
			gui.AttPlugin.setmap ( this.spirit.element, map );
		},


		// Secret .................................................

		/**
		 * Attribute updates disabled?
		 * @type {boolean}
		 */
		$suspended : false,

		/**
		 * Suspend attribute updates for the duration of the 
		 * action. This to prevent endless attribute updates.
		 * @param {function} action
		 * @retruns {object}
		 */
		$suspend : function ( action ) {
			this.$suspended = true;
			var res = action.apply ( this, arguments );
			this.$suspended = false;
			return res;
		}

		
	}, {}, { // Static ...........................................

		/**
		 * Get single element attribute cast to an inferred type.
		 * @param {Element} elm
		 * @param {String} att
		 * @returns {object} String, boolean or number
		 */
		get : function ( elm, name ) {
			return gui.Type.cast ( elm.getAttribute ( name ));
		},

		/**
		 * Set single element attribute (use null to remove).
		 * @param {Element} elm
		 * @param {String} name
		 * @param {String} value
		 * @returns {function}
		 */
		set : chained ( function ( elm, name, value ) {
			var spirit = elm.spirit;
			if ( value === null ) {
				this.del ( elm, name );
			} else {
				value = String ( value );
				if ( elm.getAttribute ( name ) !== value ) {
					elm.setAttribute ( name, value );
					if ( spirit ) {
						spirit.attconfig.configureone ( name, value );
					}
				}
			}
		}),

		/**
		 * Element has attribute?
		 * @param {Element} elm
		 * @param {String} name
		 * @returns {boolean}
		 */
		has : function ( elm, name ) {
			return elm.hasAttribute ( name );
		},

		/**
		 * Remove element attribute.
		 * @param {Element} elm
		 * @param {String} att
		 * @returns {function}
		 */
		del : chained ( function ( elm, name ) {
			var spirit = elm.spirit;
			elm.removeAttribute ( name );
			if ( spirit ) {
				spirit.attconfig.configureone ( name, null );
			}
		}),

		/**
		 * Collect attributes as an array (of DOMAttributes).
		 * @param {Element} elm
		 * @returns {Array<Attr>}
		 */
		all : function ( elm ) {
			return gui.Object.toArray ( elm.attributes );
		},

		/**
		 * Get all attributes as hashmap type object. 
		 * Values are converted to an inferred type.
		 * @param {Element} elm
		 * @returns {Map<String,String>} 
		 */
		getmap : function ( elm ) {
			var map = Object.create ( null );
			this.all ( elm ).forEach ( function ( att ) {
				map [ att.name ] = gui.Type.cast ( att.value );
			});
			return map;
		},

		/**
		 * Invoke multiple attributes update via hashmap 
		 * argument. Use null value to remove an attribute.
		 * @param {Element} elm
		 * @param {Map<String,String>}
		 * @returns {function}
		 */
		setmap : chained ( function ( elm, map) {
			gui.Object.each ( map, function ( name, value ) {
				this.set ( elm, name, value );
			}, this );
		})

	});

}( gui.Combo.chained ));


/**
 * Spirit box object. Note that these are all properties, not methods. 
 * @extends {gui.Plugin}
 * @TODO Support globalX, globalY, screenX, screenY
 */
gui.BoxPlugin = gui.Plugin.extend ( "gui.BoxPlugin", {
	
	width   : 0, // width
	height  : 0, // height
	localX  : 0, // X relative to positioned ancestor
	localY  : 0, // Y relative to positioned ancestor
	pageX   : 0, // X relative to the full page (includes scrolling)
	pageY   : 0, // Y telative to the full page (includes scrolling)	  
	clientX : 0, // X relative to the viewport (excludes scrolling)
	clientY : 0  // Y relative to the viewport (excludes scrolling)
});

Object.defineProperties ( gui.BoxPlugin.prototype, {

	/**
	 * Width.
	 * @type {number}
	 */
	width : {
		get : function () {
			return this.spirit.element.offsetWidth;
		}
	},

	/**
	 * Height.
	 * @type {number}
	 */
	height : {
		get : function () {
			return this.spirit.element.offsetHeight;
		}
	},

	/**
	 * X relative to positioned ancestor.
	 * @type {number}
	 */
	localX : {
		get : function () {
			return this.spirit.element.offsetLeft;
		}
	},

	/**
	 * Y relative to positioned ancestor.
	 * @type {number}
	 */
	localY : {
		get : function () {
			return this.spirit.element.offsetTop;
		}
	},

	/**
	 * X relative to the full page (includes scrolling).
	 * @TODO IMPORTANT scrollroot must be local to context
	 * @type {number}
	 */
	pageX : {
		get : function () {
			return this.clientX + gui.Client.scrollRoot.scrollLeft;
		}
	},

	/**
	 * Y relative to the full page (includes scrolling).
	 * @TODO IMPORTANT scrollroot must be local to context
	 * @type {number}
	 */
	pageY : {
		get : function () {
			return this.clientY + gui.Client.scrollRoot.scrollTop;
		}
	},

	/**
	 * X relative to the viewport (excludes scrolling).
	 * @type {number}
	 */
	clientX : {
		get : function () {
			return this.spirit.element.getBoundingClientRect ().left;
		}
	},

	/**
	 * Y relative to the viewport (excludes scrolling).
	 * @type {number}
	 */
	clientY : {
		get : function () {
			return this.spirit.element.getBoundingClientRect ().top;
		}
	}
});


/** 
 * Broadcast instance.
 * @using gui.Arguments#confirmed
 */
( function using ( confirmed ) {

	/**
	 * Broadcast constructor.
	 * @TODO "one" and "oneGlobal" methods...
	 * @param {Spirit} target
	 * @param {String} type
	 * @param {object} data
	 * @param {boolean} global
	 */
	gui.Broadcast = function ( target, type, data, global, sig ) {
		
		this.target = target;
		this.type = type;
		this.data = data;
		this.isGlobal = global;
		this.signatures = [];
		this.signature = sig || gui.signature;
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
		 * @TODO rename "global"
		 * @type {boolean}
		 */
		isGlobal : false,

		/**
		 * Signature of dispatching context. 
		 * Unimportant for global broadcasts.
		 * @type {String}
		 */
		signature : null,

		/**
		 * Experimental...
		 * @todo Still used?
		 * @type {Array<String>}
		 */
		signatures : null,

		/**
		 * Identification
		 * @returns {String}
		 */
		toString : function () {	
			return "[object gui.Broadcast]";
		}
	};


	// Static .........................................................

	/**
	 * Tracking global handlers (mapping broadcast types to list of handlers).
	 * @type {Map<String,<Array<object>>}
	 */
	gui.Broadcast._globals = Object.create ( null );

	/**
	 * Tracking local handlers (mapping gui.signatures to broadcast types to list of handlers).
	 * @type {Map<String,Map<String,Array<object>>>}
	 */
	gui.Broadcast._locals = Object.create ( null );

	/**
	 * mapcribe handler to message.
	 * @param {object} message String or array of strings
	 * @param {object} handler Implements BroadcastListener
	 * @param @optional {String} sig
	 */
	gui.Broadcast.add = function ( message, handler, sig ) {
	 return	this._add ( message, handler, sig || gui.signature );
	};

	/**
	 * Unmapcribe handler from broadcast.
	 * @param {object} message String or array of strings
	 * @param {object} handler
	 * @param @optional {String} sig
	 */
	gui.Broadcast.remove = function ( message, handler, sig ) {
		return this._remove ( message, handler, sig || gui.signature );
	};

	/**
	 * Publish broadcast in local window scope.
	 * @TODO queue for incoming dispatch (finish current message first).
	 * @param {Spirit} target
	 * @param {String} type
	 * @param {object} data
	 * @param {String} sig
	 * @returns {gui.Broadcast}
	 */
	gui.Broadcast.dispatch = function ( target, type, data, sig ) {
		return this._dispatch ( target, type, data, sig || gui.signature );
	};

	/**
	 * mapcribe handler to message globally.
	 * @param {object} message String or array of strings
	 * @param {object} handler Implements BroadcastListener
	 */
	gui.Broadcast.addGlobal = function ( message, handler ) {
		return this._add ( message, handler );
	};

	/**
	 * Unmapcribe handler from global broadcast.
	 * @param {object} message String or array of strings
	 * @param {object} handler
	 */
	gui.Broadcast.removeGlobal = function ( message, handler ) {
		return this._remove ( message, handler );
	};

	/**
	 * Dispatch broadcast in global scope (all windows).
	 * @TODO queue for incoming dispatch (finish current first).
	 * @TODO Handle remote domain iframes ;)
	 * @param {Spirit} target
	 * @param {String} type
	 * @param {object} data
	 */
	gui.Broadcast.dispatchGlobal = function ( target, type, data ) {
		return this._dispatch ( target, type, data );
	};

	/**
	 * Encode broadcast to be posted xdomain.
	 * @param {gui.Broacast} b
	 * @returns {String}
	 */
	gui.Broadcast.stringify = function ( b ) {
		var prefix = "spiritual-broadcast:";
		return prefix + ( function () {
			b.target = null;
			b.data = ( function ( d ) {
				if ( gui.Type.isComplex ( d )) {
					if ( gui.Type.isFunction ( d.stringify )) {
						d = d.stringify ();
					} else {
						try {
							JSON.stringify ( d );
						} catch ( jsonexception ) {
							d = null;
						}
					}
				}
				return d;
			}( b.data ));
			return JSON.stringify ( b );
		}());
	};

	/**
	 * Decode broadcast posted from xdomain and return a broadcast-like object.
	 * @param {String} msg
	 * @returns {object}
	 */
	gui.Broadcast.parse = function ( msg ) {
		var prefix = "spiritual-broadcast:";
		if ( msg.startsWith ( prefix )) {
			return JSON.parse ( msg.split ( prefix )[ 1 ]);
		}
	};

	// PRIVATE ...................................................................................

	/**
	 * Subscribe handler to message(s).
	 * @param {Array<string>|string} type
	 * @param {object|function} handler Implements BroadcastListener
	 * @param @optional {String} sig
	 * @returns {function}
	 */
	gui.Broadcast._add = confirmed ( "array|string", "object|function", "(string)" ) (
		function ( type, handler, sig ) {
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
			return this;
		}
	);

	/**
	 * Hello.
	 * @param {object} message String or array of strings
	 * @param {object} handler
	 * @param @optional {String} sig
	 * @returns {function}
	 */
	gui.Broadcast._remove = function ( message, handler, sig ) {
		if ( gui.Interface.validate ( gui.IBroadcastHandler, handler )) {
			if ( gui.Type.isArray ( message )) {
				message.forEach ( function ( msg ) {
					this._remove ( msg, handler, sig );
				}, this );
			} else {
				var index, array = ( function ( locals, globals) {
					if ( sig ) {
						if ( locals [ sig ]) {
							return locals [ sig ][ message ];
						}
					} else {
						return globals [ message ];
					}
				}( this._locals, this._globals ));
				if ( array ) {
					index = array.indexOf ( handler );
					if ( index > -1 ) {
						gui.Array.remove ( array, index );
					}
				}
			}
		}
		return this;
	};

	/**
	 * Hello.
	 * @param {Spirit} target
	 * @param {String} type
	 * @param {object} data
	 * @param @optional {String} sig
	 */
	gui.Broadcast._dispatch = function ( target, type, data, sig ) {
		var global = !gui.Type.isString ( sig );
		var map = global ? this._globals : this._locals [ sig ];
		var b = new gui.Broadcast ( target, type, data, global, sig );
		if ( map ) {
			var handlers = map [ type ];
			if ( handlers ) {
				handlers.slice ().forEach ( function ( handler ) {
					handler.onbroadcast ( b );
				});
			}
		}
		if ( global ) {
			var root = document.documentElement.spirit;
			if ( root ) { // no spirit before DOMContentLoaded
				root.propagateBroadcast ( b );
			}
		}
	};

}( gui.Arguments.confirmed ));


/**
 * Tracking broadcasts.
 * @extends {gui.Tracker}
 * @using {gui.Combo.chained}
 */
gui.BroadcastPlugin = ( function using ( chained ) {

	return gui.Tracker.extend ( "gui.BroadcastPlugin", {

		/**
		 * Add one or more broadcast handlers.
		 * @param {object} arg
		 * @param @optional {object} handler implements BroadcastListener (defaults to spirit)
		 * @returns {gui.BroadcastPlugin}
		 */
		add : chained ( function ( arg, handler ) {
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
		}),

		/**
		 * Remove one or more broadcast handlers.
		 * @param {object} arg
		 * @param @optional {object} handler implements BroadcastListener (defaults to spirit)
		 * @returns {gui.BroadcastPlugin}
		 */
		remove : chained ( function ( arg, handler ) {
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
		}),

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
		 * @returns {gui.BroadcastPlugin}
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
		 * @returns {gui.BroadcastPlugin}
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

		// Private ...................................................................
		
		/**
		 * Remove delegated handlers. 
		 * @overwrites {gui.Tracker#_cleanup}
		 * @param {String} type
		 * @param {Array<object>} checks
		 */
		_cleanup : function ( type, checks ) {
			var handler = checks [ 0 ], global = checks [ 1 ];
			var sig = global ? null : this._sig;
			if ( global ) {
				gui.Broadcast.removeGlobal ( type, handler );
			} else {
				gui.Broadcast.remove ( type, handler, this._sig );
			}
		}

	});

}( gui.Combo.chained ));


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
 * @extends {gui.Plugin}
 * @using {gui.Combo.chained}
 */
gui.CSSPlugin = ( function using ( chained ) {

	return gui.Plugin.extend ( "gui.CSSPlugin", {
		
		/**
		 * Set single element.style.
		 * @param {String} prop
		 * @param {String} val
		 * @returns {gui.CSSPlugin}
		 */
		set : chained ( function ( prop, val ) {
			gui.CSSPlugin.set ( this.spirit.element, prop, val );
		}),

		/**
		 * Get single element.style; see also compute method.
		 * @param {String} prop
		 * @returns {String}
		 */
		get : function ( prop ) {
			return gui.CSSPlugin.get ( this.spirit.element, prop );
		},

		/**
		 * Compute runtime style.
		 * @param {String} prop
		 * @returns {String}
		 */
		compute : function ( prop ) {
			return gui.CSSPlugin.compute ( this.spirit.element, prop );
		},

		/**
		 * Set multiple styles via key value map.
		 * @param {Map<String,String>} map
		 * @returns {gui.CSSPlugin}
		 */
		style : chained ( function ( map ) {
			gui.CSSPlugin.style ( this.spirit.element, map );
		}),

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
		 * @returns {gui.CSSPlugin}
		 */
		add : chained ( function ( name ) {
			gui.CSSPlugin.add ( this.spirit.element, name );
		}),

		/**
		 * classList.remove
		 * @param {String} name
		 * @returns {gui.CSSPlugin}
		 */
		remove : chained ( function ( name ) {
			gui.CSSPlugin.remove ( this.spirit.element, name );
		}),

		/**
		 * classList.toggle
		 * @param {String} name
		 * @returns {gui.CSSPlugin}
		 */
		toggle : chained ( function ( name ) {
			gui.CSSPlugin.toggle ( this.spirit.element, name );
			return this;
		}),

		/**
		 * classList.contains
		 * @param {String} name
		 * @returns {boolean}
		 */
		contains : function ( name ) {
			return gui.CSSPlugin.contains ( this.spirit.element, name );
		}, 

		/**
		 * Spirit element mathes selector?
		 * @param {String} selector
		 * @returns {boolean}
		 */
		matches : function ( selector ) {
			return gui.CSSPlugin.matches ( this.spirit.element, selector );
		}
		
		
	}, {}, { // Static ......................................................................

		 /**
		 * classList.add
		 * @param {Element} element
		 * @param {String} names
		 * @returns {function}
		 */
		add : chained ( function ( element, name ) {
			if ( name.indexOf ( " " ) >-1 ) {
				name = name.split ( " " );
			}
			if ( gui.Type.isArray ( name )) {
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
		}),

		/**
		 * classList.remove
		 * @param {Element} element
		 * @param {String} name
		 * @returns {function}
		 */
		remove : chained ( function ( element, name ) {
			if ( name.indexOf ( " " ) >-1 ) {
				name = name.split ( " " );
			}
			if ( gui.Type.isArray ( name )) {
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
						gui.Array.remove ( now, idx );
					}
					element.className = now.join ( " " );
				}
			}
		}),

		/**
		 * classList.toggle
		 * @param {Element} element
		 * @param {String} name
		 * @returns {gui.CSSPlugin}
		 */
		toggle : chained ( function ( element, name ) {
			if ( this._supports ) {
				element.classList.toggle ( name );
			} else {
				if ( this.contains ( element, name )) {
					this.remove ( element, name );
				} else {
					this.add ( element, name );
				}
			}
		}),

		/**
		 * classList.contains
		 * @param {Element} element
		 * @param {String} name
		 * @returns {boolean}
		 */
		contains : function ( element, name ) {
			if ( this._supports ) {
				return element.classList.contains ( name );
			} else {
				var classnames = element.className.split ( " " );
				return classnames.indexOf ( name ) >-1;
			}
		},

		 /**
		 * Set single element.style property (use style() for multiple)
		 * @TODO also automate shorthands such as "10px 20px 10px 20px"
		 * @param {Element}
		 * @param {String} prop
		 * @returns {function}
		 */
		set : chained ( function ( element, prop, value ) {
			if ( gui.Type.isNumber ( value )) {
				value = ( this._shorthands [ prop ] || "@" ).replace ( "@", value );
			}
			value = String ( value );
			if ( prop === "float" ) {
				prop = "cssFloat";
			} else {
				value = this.jsvalue ( value );
				prop = this.jsproperty ( prop );
			}
			element.style [ prop ] = value;
		}),

		 /**
		 * @TODO Get element.style property; if this has been set. 
		 * Not to be confused with compute() for computedStyle!!!
		 * @param {Element}
		 * @param {String} prop
		 * @returns {String}
		 */
		get : function ( element, prop ) {
			prop = this.jsproperty ( prop );
			return this.jsvalue ( element.style [ prop ]);
		},

		/**
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
		 * Compute runtime style.
		 * @param {object} thing Spirit or element.
		 * @param {String} prop
		 * @returns {String}
		 */
		compute : function ( thing, prop ) {
			var element = thing instanceof gui.Spirit ? thing.element : thing;
			var doc = element.ownerDocument, win = doc.defaultView;
			prop = this._standardcase ( this.jsproperty ( prop ));
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
		 * Normalize declaration property for use in element.style scenario.
		 * @param {String} prop
		 * @returns {String}
		 */
		jsproperty : function ( prop ) {
			var vendors = this._vendors, fixt = prop;
			var element = document.documentElement;
			prop = String ( prop );
			if ( prop.startsWith ( "-beta-" )) {
				vendors.every ( function ( vendor ) {
					var test = this._camelcase ( prop.replace ( "-beta-", vendor ));
					if ( element.style [ test ] !== undefined ) {
						fixt = test;
						return false;
					}
					return true;
				}, this );
			} else {
				fixt = this._camelcase ( fixt );
			}
			return fixt;
		},

		/**
		 * Normalize declaration value for use in element.style scenario.
		 * @param {String} value
		 * @returns {String}
		 */
		jsvalue : function ( value ) {
			var vendors = this._vendors;
			var element = document.documentElement;
			value = String ( value );
			if ( value && value.contains ( "-beta-" )) {
				var parts = [];
				value.split ( ", " ).forEach ( function ( part ) {
					if (( part = part.trim ()).startsWith ( "-beta-" )) {
						vendors.every ( function ( vendor ) {
							var test = this._camelcase ( part.replace ( "-beta-", vendor ));
							if ( element.style [ test ] !== undefined ) {
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

		/**
		 * Normalize declaration property for use in CSS text.
		 * @param {String} prop
		 * @returns {String}
		 */
		cssproperty : function ( prop ) {
			return this._standardcase ( this.jsproperty ( prop ));
		},

		/**
		 * Normalize declaration value for use in CSS text.
		 * @param {String} prop
		 * @returns {String}
		 */
		cssvalue : function ( value ) {
			return this._standardcase ( this.jsvalue ( value ));
		},
		

		// Private statics ...................................................................... 

		 /**
		 * Non-matching vendors removed after first run. First entry 
		 * gets to stay since it represents the unprefixed property.
		 * @type {Array<String>}
		 */
		_vendors : [ "", "-webkit-", "-moz-", "-ms-", "-o-" ],

		/**
		 * _supports Element.classList?
		 * @type {boolean}
		 */
		_supports : document.documentElement.classList !== undefined,

		/**
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
		 * Setter shorthands will autosuffix properties that require units 
		 * in support of the syntax: this.css.width = 300;  * no method()
		 * @TODO add tons of things to this list
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

}( gui.Combo.chained ));

/**
 * Generate shorthand getters/setters for top|left|width|height etc.
 */
( function shorthands () {
	function getset ( prop ) {
		Object.defineProperty ( gui.CSSPlugin.prototype, prop, {
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
	var shorts = gui.CSSPlugin._shorthands;
	for ( var prop in shorts ) {
		if ( shorts.hasOwnProperty ( prop )) {
			getset ( prop );
		}
	}
})();


/**
 * DOM query and manipulation.
 * @extends {gui.Plugin}
 * @TODO implement missing stuff
 * @TODO performance for all this
 * @TODO add following and preceding
 * @using {gui.Combo#chained}
 */
gui.DOMPlugin = ( function using ( chained ) {

	return gui.Plugin.extend ( "gui.DOMPlugin", {

		/**
		 * Set or get element id.
		 * @param @optional {String} id
		 * @returns {String|gui.DOMPlugin}
		 */
		id : chained ( function ( id ) {
			if ( id ) {
				this.spirit.element.id = id;
			} else {
				return this.spirit.element.id || null;
			}
		}),
	 
		/**
		 * Get or set element title (tooltip).
		 * @param @optional {String} title
		 * @returns {String|gui.DOMPlugin}
		 */
		title : chained ( function ( title ) {
			var element = this.spirit.element;
			if ( gui.Type.isDefined ( title )) {
				element.title = title ? title : "";
			} else {
				return element.title;
			}
		}),

		/**
		 * Get or set element markup.
		 * @param @optional {String} html
		 * @param @optional {String} position Insert adjecant HTML
		 * @returns {String|gui.DOMPlugin}
		 */
		html : chained ( function ( html, position ) {
			var element = this.spirit.element;
			if ( gui.Type.isString ( html )) {
				if ( position ) {
					element.insertAdjacentHTML ( position, html ); // @TODO static + spiritualize!
				} else {
					gui.DOMPlugin.html ( element, html );
				}			
			} else {
				return element.innerHTML;
			}
		}),

		/**
		 * Empty spirit subtree.
		 * @returns {gui.DOMPlugin}
		 */
		empty : chained ( function () {
			this.html ( "" );
		}),

		/**
		 * Get or set element textContent.
		 * @param @optional {String} text
		 * @returns {String|gui.DOMPlugin}
		 */
		text : chained ( function ( text ) {
			var elm = this.spirit.element;
			if ( gui.Type.isString ( text )) {
				elm.textContent = text;
				return this;
			}
			return elm.textContent;
		}),

		/**
		 * Show spirit element, recursively informing descendants.
		 * @returns {gui.DOMPlugin}
		 */
		show : chained ( function () {
			this.spirit.css.remove("_gui-invisible");
			this.spirit.visible ();
		}),

		/**
		 * Hide spirit element, recursively informing descendants.
		 * @returns {gui.DOMPlugin}
		 */
		hide : chained ( function () {
			this.spirit.css.add("_gui-invisible");
			this.spirit.invisible ();
		}),

		/**
		 * Get spirit element tagname or create an element of given tagname. 
		 * @param @optional {String} name If present, create an element
		 * @param @optional {String} text If present, also append a text node
		 * @TODO Third argument for namespace? Investigate general XML-ness.
		 */
		tag : function ( name, text ) {
			var res = null;
			var doc = this.spirit.document;
			var elm = this.spirit.element;
			if ( name ) {
				res = doc.createElement ( name );

				// @TODO "text" > "child" and let gui.DOMPlugin handle the rest....
				if ( gui.Type.isString ( text )) {
					res.appendChild ( 
						doc.createTextNode ( text )
					);
				}
			} else {
				res = elm.localName;
			}
			return res;
		},

		/**
		 * Is positioned in page DOM? Otherwise plausible 
		 * createElement or documentFragment scenario.
		 * @returns {boolean}
		 */
		embedded : function () {
			return gui.DOMPlugin.embedded ( this.spirit.element );
		},

		/**
		 * Clone spirit element.
		 * @return {Element}
		 */
		clone : function () {
			return this.spirit.element.cloneNode ( true );
		}
		
		
	}, {}, { // Static ...............................................................

		/**
		 * Spiritual-aware innerHTML with special setup for WebKit.
		 * Parse markup to node(s)
		 * Detach spirits and remove old nodes
		 * Append new nodes and spiritualize spirits
		 * @param {Element} element
		 * @param @optional {String} markup
		 */
		html : function ( element, markup ) {
			var guide = gui.Guide;
			if ( element.nodeType === Node.ELEMENT_NODE ) {
				if ( gui.Type.isString ( markup )) {
					var nodes = new gui.HTMLParser ( 
						element.ownerDocument 
					).parse ( markup, element );
					guide.materializeSub ( element );
					guide.suspend ( function () {
						gui.Observer.suspend ( element, function () {
							while ( element.firstChild ) {
								element.removeChild ( element.firstChild );
							}
							nodes.forEach ( function ( node ) {
								element.appendChild ( node );
							});
						});
					});
					guide.spiritualizeSub ( element );
				}
			} else {
				// throw new TypeError ();
			}
			return element.innerHTML; // @TODO skip this step on setter
		},

		/**
		 * Spiritual-aware outerHTML, special setup for WebKit.
		 * @TODO can outerHTML carry multiple nodes???
		 * @param {Element} element
		 * @param @optional {String} markup
		 */
		outerHtml : function ( element, markup ) {
			var res = element.outerHTML;
			var guide = gui.Guide;
			if ( element.nodeType ) {
				if ( gui.Type.isString ( markup )) {
					var nodes = new gui.HTMLParser ( 
						element.ownerDocument 
					).parse ( markup, element );
					var parent = element.parentNode;
					guide.materialize ( element );
					guide.suspend ( function () {
						gui.Observer.suspend ( parent, function () {
							while ( nodes.length ) {
								parent.insertBefore ( nodes.pop (), element );
							}
							parent.removeChild ( element );
						});
					});
					guide.spiritualizeSub ( parent ); // @TODO optimize
					res = element; // bad API design goes here...
				}
			} else {
				throw new TypeError ();
			}
			return res; // @TODO skip this step on setter
		},

		/**
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
		 * @TODO comprehend https://developer.mozilla.org/en/JavaScript/Reference/Operators/Bitwise_Operators#Example:_Flags_and_bitmasks
		 * @param {Element} element
		 * @returns {boolean}
		 */
		embedded : function ( node ) {
			node = node instanceof gui.Spirit ? node.element : node;
			var check = Node.DOCUMENT_POSITION_CONTAINS + Node.DOCUMENT_POSITION_PRECEDING;
			return node.compareDocumentPosition ( node.ownerDocument ) === check;
		},

		/**
		 * Get first elements that matches a selector.
		 * Optional type argument filters to spirit of type.
		 * @param {Node} node
		 * @param {String} selector
		 * @param @optional {function} type
		 * @returns {Element|gui.Spirit}
		 */
		q : function ( node, selector, type ) {
			var result = null;
			return this._qualify ( node, selector )( function ( node, selector ) {
				if ( type ) {
					result = this.qall ( node, selector, type )[ 0 ] || null;
				} else {
					result = node.querySelector ( selector );
				}
				return result;
			});
		},

		/**
		 * Get list of all elements that matches a selector.
		 * Optional type argument filters to spirits of type. 
		 * Method always returns a (potentially empty) array.
		 * @param {Node} node
		 * @param {String} selector
		 * @param @optional {function} type
		 * @returns {Array<Element|gui.Spirit>}
		 */
		qall : function ( node, selector, type ) {
			var result = [];
			return this._qualify ( node, selector )( function ( node, selector ) {
				result = gui.Array.toArray ( node.querySelectorAll ( selector ));
				if ( type ) {
					result = result.filter ( function ( el )  {
						return el.spirit && el.spirit instanceof type;
					}).map ( function ( el ) {
						return el.spirit;
					});
				}
				return result;
			});
		},


		// Private static .........................................................

		/**
		 * Support direct children selection using proprietary 'this' keyword 
		 * by temporarily assigning the element an ID and modifying the query.
		 * @param {Node} node
		 * @param {String} selector
		 * @param {function} action
		 * @returns {object}
		 */
		_qualify : function ( node, selector, action ) {
			var hadid = true, id, regexp = this._thiskeyword;
			if ( node.nodeType === Node.ELEMENT_NODE ) {
				if ( regexp.test ( selector )) {
					hadid = node.id;
					id = node.id = ( node.id || gui.KeyMaster.generateKey ());
					selector = selector.replace ( regexp, "#" + id );
					node = node.ownerDocument;
				}
			}
			return function ( action ) {
				var res = action.call ( gui.DOMPlugin, node, selector );
				if ( !hadid ) {
					node.id = "";
				}
				return res;
			};
		},

		/**
		 * Match custom 'this' keyword in CSS selector. You can start 
		 * selector expressions with "this>*" to find immediate child
		 * @TODO skip 'this' and support simply ">*" and "+*" instead.
		 * @type {RegExp}
		 */
		_thiskeyword : /^this|,this/g
			
	});

}( gui.Combo.chained ));

/**
 * DOM query methods accept a CSS selector and an optional spirit constructor 
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
	 * @returns {Element|gui.Spirit}
	 */
	q : function ( selector, type ) {
		return gui.DOMPlugin.q ( this.spirit.element, selector, type );
	},

	/**
	 * Get list of all descendant elements that matches a selector. Optional type  
	 * arguments returns instead all associated spirits to match the given type.
	 * @param {String} selector
	 * @param @optional {function} type Spirit constructor
	 * @returns {Array<Element|gui.Spirit>}
	 */
	qall : function ( selector, type ) {
		return gui.DOMPlugin.qall ( this.spirit.element, selector, type );
	},

	/**
	 * Same as q, but scoped from the document root. Use wisely.
	 * @param {String} selector
	 * @param @optional {function} type Spirit constructor
	 * returns {Element|gui.Spirit}
	 */
	qdoc : function ( selector, type ) {
		var root = this.spirit.document.documentElement;
		return root.spirit.dom.q.apply ( root.spirit.dom, arguments );
	},

	/**
	 * Same as qall, but scoped from the document root. Use wisely.
	 * @param {String} selector
	 * @param @optional {function} type Spirit constructor
	 * @returns {Array<Element|gui.Spirit>}
	 */
	qdocall : function ( selector, type ) {
		var root = this.spirit.document.documentElement;
		return root.spirit.dom.qall.apply ( root.spirit.dom, arguments );
	}

	/**
	 * Adding methods to gui.DOMPlugin.prototype
	 * @param {String} name
	 * @param {function} method
	 */
}, function mixin ( name, method ) {
	gui.DOMPlugin.mixin ( name, function () {
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

/**
 * DOM navigation methods accept an optional spirit constructor as 
 * argument. They return a spirit, an element or an array of either.
 */
gui.Object.each ({

	preceding : function ( type ) {
		console.error ( "TODO" );
	},

	following : function ( type ) {
		console.error ( "TODO" );
	},

	/**
	 * Next element or next spirit of given type.
	 * @param @optional {function} type Spirit constructor
	 * @returns {Element|gui.Spirit}
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
	 * @param @optional {function} type Spirit constructor
	 * @returns {Element|gui.Spirit}
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
	 * First element or first spirit of type.
	 * @param @optional {function} type Spirit constructor
	 * @returns {Element|gui.Spirit}
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
	 * Last element or last spirit of type.
	 * @param @optional {function} type Spirit constructor
	 * @returns {Element|gui.Spirit}
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
	 * Parent parent or parent spirit of type.
	 * @param @optional {function} type Spirit constructor
	 * @returns {Element|gui.Spirit}
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
	 * Child element or child spirit of type.
	 * @param @optional {function} type Spirit constructor
	 * @returns {Element|gui.Spirit}
	 */
	child : function ( type ) {
		var result = this.spirit.element.firstElementChild;
		if ( type ) {
			result = this.children ( type )[ 0 ] || null;
		}
		return result;
	},

	/**
	 * Children elements or children spirits of type.
	 * @TODO just use this.element.children :)
	 * @param @optional {function} type Spirit constructor
	 * @returns {Array<Element|gui.Spirit>}
	 */
	children : function ( type ) {
		var result = gui.Object.toArray ( this.spirit.element.children );
		if ( type ) {
			result = result.filter ( function ( elm ) {
				return elm.spirit && elm.spirit instanceof type;
			}).map ( function ( elm ) {
				return elm.spirit;
			});
		}
		return result;
	},

	/**
	 * First ancestor element (parent!) or first ancestor spirit of type.
	 * @param @optional {function} type Spirit constructor
	 * @returns {Element|gui.Spirit}
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
	 * First ancestor elements or ancestor spirits of type.
	 * @param @optional {function} type Spirit constructor
	 * @returns {Array<Element|gui.Spirit>}
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
	 * First descendant element (first child!) first descendant spirit of type.
	 * @param @optional {function} type Spirit constructor
	 * @returns {Element|gui.Spirit}
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
	 * All descendant elements or all descendant spirits of type.
	 * @param @optional {function} type Spirit constructor
	 * @returns {Array<Element|gui.Spirit>}
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

	/**
	 * Adding methods to gui.DOMPlugin.prototype
	 * @param {String} name
	 * @param {function} method
	 */
}, function mixin ( name, method ) {
	gui.DOMPlugin.mixin ( name, function ( type ) {
		if ( !gui.Type.isDefined ( type ) || gui.Type.isFunction ( type )) {
			return method.apply ( this, arguments );
		} else {
			throw new TypeError ( 
				"Unknown spirit for query: " + name + 
				"(" + gui.Type.of ( type ) + ")" 
			);
		}
	});
});


/**
 * DOM insertion methods accept one argument: one spirit OR one element OR an array of either or both. 
 * The input argument is returned as given. This allows for the following one-liner to be constructed: 
 * this.something = this.dom.append ( gui.SomeThingSpirit.summon ( this.document )); // imagine 15 more
 * @TODO Go for compliance with DOM4 method matches (something about textnoding string arguments)
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
	 * @returns {object} Returns the argument
	 */
	remove : function () {
		var parent = this.spirit.element.parentNode;
		parent.removeChild ( this.spirit.element );
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

	/**
	 * Adding methods to gui.DOMPlugin.prototype. These methods come highly overloaded.
	 * 
	 * 1. Convert arguments to array of one or more elements
	 * 2. Confirm array of elements (exception supressed pending IE9 issue)
	 * 3. Invoke the method
	 * 4. Return the input
	 * @param {String} name
	 * @param {function} method
	 */
}, function mixin ( name, method ) {
	gui.DOMPlugin.mixin ( name, function ( things ) {
		var elms = Array.map ( gui.Array.toArray ( things ), function ( thing ) {
			return thing && thing instanceof gui.Spirit ? thing.element : thing;
		}).filter ( function ( thing ) { // @TODO IE9 may sometimes for some reason throw and array in here :/ must investigate!!!
			return thing && gui.Type.isNumber ( thing.nodeType ); // first check added for FF which now may fail as well :/
		});
		if ( elms.length ) {
			method.call ( this, elms );
		}
		return things;
	});
});


/**
 * Tracking DOM events.
 * @TODO Throw an error on remove not added!
 * @TODO Static interface for general consumption.
 * @extends {gui.Tracker}
 * @using {gui.Combo.chained}
 */
gui.EventPlugin = ( function using ( chained ) {

	return gui.Tracker.extend ( "gui.EventPlugin", {

		/**
		 * Add one or more DOM event handlers.
		 * @TODO Don't assume spirit handler
		 * @TODO reverse handler and capture args
		 * @param {object} arg String, array or whitespace-separated-string
		 * @param @optional {object} target Node, Window or XmlHttpRequest. Defaults to spirit element
		 * @param @optional {object} handler implements EventListener interface, defaults to spirit
		 * @param @optional {boolean} capture Defaults to false
		 * @returns {gui.EventPlugin}
		 */
		add : chained ( function ( arg, target, handler, capture ) {
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
		}),

		/**
		 * Add one or more DOM event handlers.
		 * @param {object} arg String, array or whitespace-separated-string
		 * @param @optional {object} target Node, Window or XmlHttpRequest. Defaults to spirit element
		 * @param @optional {object} handler implements EventListener interface, defaults to spirit
		 * @param @optional {boolean} capture Defaults to false
		 * @returns {gui.EventPlugin}
		 */
		remove : chained ( function ( arg, target, handler, capture ) {
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
		}),

		/**
		 * Toggle one or more DOM event handlers.
		 * @param {object} arg String, array or whitespace-separated-string
		 * @param @optional {object} target Node, Window or XmlHttpRequest. Defaults to spirit element
		 * @param @optional {object} handler implements EventListener interface, defaults to spirit
		 * @param @optional {boolean} capture Defaults to false
		 * @returns {gui.EventPlugin}
		 */
		toggle : chained ( function ( arg, target, handler, capture ) {
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
		}),


		// PRIVATE ..........................................................

		/**
		 * Remove event listeners.
		 * @overwrites {gui.Tracker#_cleanup}
		 * @param {String} type
		 * @param {Array<object>} checks
		 */
		_cleanup : function ( type, checks ) {
			var target = checks [ 0 ];
			var handler = checks [ 1 ];
			var capture = checks [ 2 ];
			this.remove ( type, target, handler, capture );
		}

	});

}( gui.Combo.chained ));


/**
 * Interface EventHandler. This is a real DOM interface, it's used for native event 
 * handling. We usually choose to forward the event to the spirits `onevent` method.
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#interface-EventListener
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
	 * Handle event.
	 * @param {Event} e
	 */
	handleEvent : function ( e ) {}
};


/** 
 * Ticks are used for timed events. 
 * @TODO Global versus local ticks
 * @TODO Tick.push
 * @using gui.Arguments#confirmed
 */
( function using ( confirmed ) {

	/**
	 * @param {String} type
	 */
	gui.Tick = function ( type ) {
		this.type = type;
	};

	gui.Tick.prototype = {

		/**
		 * Tick type.
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


	// Static .........................................................................

	/**
	 * Identification.
	 * @returns {String}
	 */
	gui.Tick.toString = function () {
		return "[function gui.Tick]";
	};

	/**
	 * Hello.
	 */
	gui.Tick._global = {
		types : Object.create ( null ),
		handlers : Object.create ( null )
	};

	/**
	 * Hej.
	 */
	gui.Tick._local = Object.create ( null );

	/**
	 * Add handler for tick.
	 * @param {object} type String or array of strings
	 * @param {object} handler
	 * @param @optional {boolean} one Remove handler after on tick of this type?
	 * @returns {function}
	 */
	gui.Tick.add = confirmed ( "string|array", "object|function", "(string)" ) (
		function ( type, handler, sig ) {
			return this._add ( type, handler, false, sig || gui.signature );
		}
	);

	/**
	 * Add auto-removing handler for tick.
	 * @param {object} type String or array of strings
	 * @param {object} handler
	 * @returns {function}
	 */
	gui.Tick.one = confirmed ( "string|array", "object|function", "(string)" ) (
		function ( type, handler, sig ) {
			return this._add ( type, handler, true, sig || gui.signature );
		}
	);

	/**
	 * Schedule action for next available execution stack.
	 * @param {function} action
	 * @param @optional {object} thisp
	 */
	gui.Tick.next = function ( action, thisp ) {
		setImmediate ( function () {
			action.call ( thisp );
		});
	};

	/**
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
	 * Start repeated tick of given type.
	 * @param {String} type Tick type
	 * @param {number} time Time in milliseconds
	 * @returns {function}
	 */
	gui.Tick.start = function ( type, time ) {
		console.error ( "@TODO gui.Tick.start" );
	};

	/**
	 * Stop repeated tick of specified type.
	 * @param {String} type Tick type
	 * @returns {function}
	 */
	gui.Tick.stop = function ( type ) {
		console.error ( "@TODO gui.Tick#stop" );
	};

	/**
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

	/**
	 * Add handler for tick.
	 * @param {object} type String or array of strings
	 * @param {object} handler
	 * @returns {function}
	 */
	gui.Tick.addGlobal = confirmed ( "string|array", "object|function" ) (
		function ( type, handler ) {
			return this._add ( type, handler, false, null );
		}
	);

	/**
	 * Add self-removing handler for tick.
	 * @param {object} type String or array of strings
	 * @param {object} handler
	 * @returns {function}
	 */
	gui.Tick.oneGlobal = function ( type, handler ) {
		return this.add ( type, handler, true, null );
	};

	/**
	 * Remove handler for tick.
	 * @param {object} type String or array of strings
	 * @param {object} handler
	 * @returns {function}
	 */
	gui.Tick.removeGlobal = function ( type, handler ) {
		return this._remove ( type, handler, null );
	};

	/**
	 * Dispatch tick now or in specified time. Omit time to 
	 * dispatch now. Zero resolves to next available thread.
	 * @param {String} type
	 * @param @optional {number} time
	 * @returns {gui.Tick}
	 */
	gui.Tick.dispatchGlobal = function ( type, time ) {
		return this._dispatch ( type, time, null );
	};


	// Private static .....................................................

	/**
	 * Hello.
	 */
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
			/*
			 * @TODO
			 * Adding a property to an array will 
			 * make it slower in Firefox. Fit it!
			 */
			if ( one ) {
				list._one = list._one || Object.create ( null );
				list._one [ index ] = true;
			}
		}
		return this;
	};

	/**
	 * Hello.
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
				var index = list.indexOf ( handler );
				if ( gui.Array.remove ( list, index ) === 0 ) {
					delete map.handlers [ type ];
				}
			}
		}
		return this;
	};

	/**
	 * Hofmeister remix.
	 * @TODO refactor to default to zero somehow...
	 */
	gui.Tick._dispatch = function ( type, time, sig ) {
		var map = sig ? this._local [ sig ] : this._global;
		var types = map.types;
		var tick = new gui.Tick ( type );
		if ( !gui.Type.isDefined ( time )) {	
			var list = map.handlers [ type ];
			if ( list ) {
				list.slice ().forEach ( function ( handler, i ) {
					//try {
						handler.ontick ( tick );
					// } catch ( exception ) { // @TODO figure out how destructed spirits should behave while we loop
					// 	if ( exception.message !== gui.Spirit.DENIAL ) {
					// 		throw new Error ( exception.message );
					// 	}
					// }
					// if ( list._one && list._one [ i ]) {
					// 	delete list._one [ i ];
					// }
				});
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

}( gui.Arguments.confirmed ));


/**
 * Tracking timed events.
 * @TODO Global timed events.
 * @extends {gui.Tracker}
 * @using {gui.Combo.chained}
 */
gui.TickPlugin = ( function using ( chained ) {

	return gui.Tracker.extend ( "gui.TickPlugin", {

		/**
		 * Add one or more tick handlers.
		 * @param {object} arg
		 * @param @optional {object} handler
		 * @param @optional {boolean} one Remove handler after on tick of this type?
		 * @returns {gui.TickPlugin}
		 */
		add : chained ( function ( arg, handler, one ) {
			handler = handler ? handler : this.spirit;
			if ( gui.Interface.validate ( gui.ITickHandler, handler )) {
				this._breakdown ( arg ).forEach ( function ( type ) {
					if ( this._addchecks ( type, [ handler, this._global ])) {
						this._add ( type, handler, false );
					}
				}, this );
			}
		}),

		/**
		 * Add handler for single tick of given type(s).
		 * @TODO This on ALL trackers :)
		 * @param {object} arg
		 * @param @optional {object} handler
		 * @returns {gui.TickPlugin}
		 */
		one : chained ( function ( arg, handler ) {
			this.add ( arg, handler, true );
		}),

		/**
		 * Execute action in next available tick, 
		 * let 'this' keyword point to the spirit.
		 * @param {function} action 
		 * @returns {gui.TickPlugin}
		 */
		next : chained ( function ( action ) {
			gui.Tick.next ( action, this.spirit );
		}),

		/**
		 * Remove one or more tick handlers.
		 * @param {object} arg
		 * @param @optional {object} handler implements ActionListener interface, defaults to spirit
		 * @returns {gui.TickPlugin}
		 */
		remove : chained ( function ( arg, handler ) {
			handler = handler ? handler : this.spirit;
			if ( gui.Interface.validate ( gui.ITickHandler, handler )) {
				this._breakdown ( arg ).forEach ( function ( type ) {
					if ( this._removechecks ( type, [ handler, this._global ])) {
						this._remove ( type, handler );
					}
				}, this );
			}
		}),

		/**
		 * Dispatch tick after given time.
		 * @param {String} type
		 * @param {number} time Milliseconds (zero is setImmediate)
		 * @returns {gui.Tick}
		 */
		dispatch : function ( type, time ) {
			return this._dispatch ( type, time || 0 );
		},
		
		
		// Private .............................................................................

		/**
		 * Global mode?
		 * @type {boolean}
		 */
		_global : false,

		/**
		 * Add handler.
		 * @param {String} type
		 * @param {object|function} handler
		 * @param {boolean} one
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
		 * @param {String} type
		 * @param {object|function} handler
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
		 * @param {String} type
		 * @param @optional {number} time
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
		 * @overwrites {gui.Tracker#_cleanup}
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

}( gui.Combo.chained ));


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
 * Tweening away.
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
	done : false,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.Tween]";
	}
};

// Static .............................................

/** 
 * Coordinate a global (cross-frame) animation sequence.
 * @TODO Coordinate this more or less cross-domain.
 * @param {ui.Animation} animation
 * @returns {gui.Tween} but why?
 */
gui.Tween.dispatchGlobal = function ( type, data ){
	var that = this;
	var start = Date.now ();
	var tween = new gui.Tween ( type, data );
	var duration = data ? ( data.duration || 200 ) : 200;
	var timing = data ? ( data.timing || "none" ) : "none";
	function step () {
		var time = Date.now ();
		var value = 1, progress = time - start;
		if ( progress < duration ) {
			value = progress / duration;
			if ( timing !== "none" ){
				value = value * 90 * Math.PI / 180;
				switch ( timing ) {
					case "ease-in" :
						value = 1 - Math.cos ( value );
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
		gui.Broadcast.dispatchGlobal ( null, gui.BROADCAST_TWEEN, tween );
	}
	step ( start );
	return tween;
};


/**
 * Tracking tweens.
 * @extends {gui.Tracker}
 * @using {gui.Combo.chained}
 */
gui.TweenPlugin = ( function using ( chained ) {

	return gui.Tracker.extend ( "gui.TweenPlugin", {

		/**
		 * Add one or more broadcast handlers.
		 * @param {object} arg
		 * @returns {gui.TweenPlugin}
		 */
		add : chained ( function ( arg ) {
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
		}),

		/**
		 * Remove one or more broadcast handlers.
		 * @param {object} arg
		 * @returns {gui.TweenPlugin}
		 */
		remove : chained ( function ( arg ) {
			var sig = this._global ? null : this._sig;
			var message = gui.BROADCAST_TWEEN;
			this._breakdown ( arg ).forEach ( function ( type ) {
				this._removechecks ( type, [ this._global ]);
			}, this );
		}),

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
		 * @returns {gui.TweenPlugin}
		 */
		addGlobal : function ( arg ) {
			return this._globalize ( function () {
				return this.add ( arg );
			});
		},

		/**
		 * Add handlers for global broadcast(s).
		 * @param {object} arg
		 * @returns {gui.TweenPlugin}
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

		// Private ...................................................................
		
		/**
		 * Remove broadcast subscriptions on dispose.
		 * @overwrites {gui.Tracker#_cleanup}
		 * @param {String} type
		 * @param {Array<object>} checks
		 */
		_cleanup : function ( type, checks ) {
			var message = gui.BROADCAST_TWEEN;
			var global = checks [ 0 ];
			var sig = global ? null : this._sig;
			if ( global ) {
				gui.Broadcast.removeGlobal ( message, this );
			} else {
				gui.Broadcast.remove ( message, this, this._sig );
			}
		}

	});

}( gui.Combo.chained ));


/**
 * Experimental CSS transitioning plugin. Work in progress.
 * @extends {gui.Plugin}
 * @TODO Just add the transitonend listener on construct?
 */
gui.TransitionPlugin = gui.Plugin.extend ( "gui.TransitionPlugin", {

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
	
	/**
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
		// Firefox needs a break before setting the styles.
		// http://stackoverflow.com/questions/6700137/css-3-transitions-with-opacity-chrome-and-firefox
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


	// Private ..............................................................................

	/**
	 * Default transition duration time milliseconds.
	 * @TODO actually default this
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
	 * @TODO confirm VendorTransitionEnd on documentElement
	 * @TODO Firefox is down
	 * @TODO this.duration ( this._default )
	 * @TODO this on static, not per instance
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
	this.duration = Math.round ( elapsedTime / 1000 );
	this.type = propertyName;
};

gui.Transition.prototype = {

	/**
	 * Property that finished transitioning ("width","height").
	 * @TODO un-camelcase this to CSS syntax.
	 * @TODO adjust vendor prefix to "beta".
	 * @type {String}
	 */
	type : null,

	/**
	 * Elapsed time in milliseconds. This may 
	 * not be identical to the specified time.
	 * @type {number}
	 */
	duration : 0
};


/**
 * Work in progress keyboard TAB manager.
 * @extends {gui.Tracker}
 * @TODO Get this out of here
 * @TODO Nested attention traps (conflicts with missing focusin in FF?)
 * @TODO Empty queue when user moves escapes (all) attention traps?
 * @TODO More life cycle hookins (hide, show, detach, exit)
 */
gui.AttentionPlugin = gui.Plugin.extend ( "gui.AttentionPlugin", {

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
	 * @TODO definitely not like this...
	 * @returns {gui.AttentionPlugin}
	 */
	blur : function () { 
		gui.Broadcast.dispatchGlobal ( null,
			gui.BROADCAST_ATTENTION_OFF,
			this.spirit.$instanceid
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
			if ( b.data === this.spirit.$instanceid ) {
				this.focus ();
			}
		}
	},

	/**
	 * Handle spirit life cycle.
	 * @param {gui.Life} life
	 */
	onlife : function ( life ) {
		switch ( life.type ) {
			case gui.LIFE_DESTRUCT :
				gui.Broadcast.removeGlobal ( gui.BROADCAST_ATTENTION_GO, this );
				gui.Broadcast.dispatchGlobal ( null,
					gui.BROADCAST_ATTENTION_OFF,
					this.spirit.$instanceid
				);
				break;
		}
	},


	// Private ........................................................................

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
	 * @TODO use focusin and focusout for IE/Opera?
	 */
	_listen : function () {
		var elm = this.spirit.element;
		elm.addEventListener ( "focus", this, true );
		elm.addEventListener ( "blur", this, true );
		this.spirit.life.add ( gui.LIFE_DESTRUCT, this );
		gui.Broadcast.addGlobal ( gui.BROADCAST_ATTENTION_GO, this );
	},

	/**
	 * Insert hidden input at position.
	 * @TODO how to *keep* inputs at first and last position?
	 * @TODO removeEventListener on dispose perhaps
	 * @param {String} pos
	 * @returns {Element}
	 */
	_input : function ( pos ) {
		var dom = this.spirit.dom;
		var doc = this.spirit.document;
		var elm = gui.CSSPlugin.style ( 
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
			this.spirit.$instanceid
		);
	},

	/**
	 * Attention trap escaped.
	 */
	_didescape : function () {
		this._flag = false;
		gui.Broadcast.dispatchGlobal ( null,
			gui.BROADCAST_ATTENTION_OFF,
			this.spirit.$instanceid
		);
	}


}, { // Static ........................................................................

	/**
	 * @type {Array<String>}
	 */
	_queue : [],

	/**
	 * Get next in line.
	 * @TODO continue until next is not hidden.
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


/**
 * Injects methods into {gui.Spirit} and such.
 */
gui.module ( "core", {

	/**
	 * Channel spirits for CSS selectors.
	 */
	channels : [
		
		[ "html", "gui.DocumentSpirit" ],
		[ ".gui-styles", "gui.StyleSheetSpirit" ], // @TODO fix or deprecate
		[ ".gui-iframe", "gui.IframeSpirit" ],
		[ ".gui-window", "gui.WindowSpirit" ],
		[ ".gui-action", "gui.ActionSpirit" ], // @TODO fix or deprecate
		[ ".gui-cover",  "gui.CoverSpirit" ],
		[ ".gui-spirit", "gui.Spirit" ]
	],

	/**
	 * Assign plugins to prefixes.
	 */
	plugins : {
		
		action : gui.ActionPlugin,
		att : gui.AttPlugin, 
		attconfig : gui.AttConfigPlugin,
		attention : gui.AttentionPlugin,
		box : gui.BoxPlugin,
		broadcast : gui.BroadcastPlugin,
		css : gui.CSSPlugin,
		dom : gui.DOMPlugin,
		event : gui.EventPlugin,
		life : gui.LifePlugin,
		tick : gui.TickPlugin,
		tween : gui.TweenPlugin,
		transition : gui.TransitionPlugin
 },

	/**
	 * Methods added to gui.Spirit.prototype
	 */
	mixins : {

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
		 * Handle tween.
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
		 * Implements DOM2 EventListener only to forward the event to method onevent()
		 * @see http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener
		 * @param {Event} event
		 */
		handleEvent : function ( event ) {
			this.onevent(event);
		}
	}

});


/**
 * Questionable browser identity and feature detection. Note that Chrome on iOS 
 * identifies itself as Safari (it basically is, so that shouldn't cause concern).
 * @TODO Load earlier by not using gui.Broadcast?
 * @TODO Lazycompute properties when requested.
 */
gui.Client = ( new function Client () {

	var agent = navigator.userAgent.toLowerCase ();
	var root = document.documentElement;

	this.isExplorer = agent.contains ( "msie" );
	this.isOpera = agent.contains ( "opera" );
	this.isWebKit = agent.contains ( "webkit" );
	this.isChrome = this.isWebKit && agent.contains ( "chrome" );
	this.isSafari = this.isWebKit && !this.isChrome && agent.contains ( "safari" );
	this.isGecko = !this.isWebKit && !this.isOpera && agent.contains ( "gecko" );

	/**
	 * Supports CSS feature?
	 * @param {String} feature
	 * @returns {boolean}
	 */
	function supports ( feature ) {
		var root = document.documentElement;
		var fixt = feature [ 0 ].toUpperCase () + feature.substring ( 1 );
		return ![ "", "Webkit", "Moz", "O", "ms" ].every ( function ( prefix ) {
			return root.style [ prefix ? prefix + fixt : feature ] === undefined;
		});
	}

	/**
	 * Agent is one of "webkit" "firefox" "opera" "explorer"
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
	 * System is one of "linux" "osx" "ios" "windows" "windowsmobile" "haiku"
	 */
	this.system = ( function () {
		var os = null;
		[ "window mobile", "windows", "ipad", "iphone", "haiku", "os x", "linux" ].every ( function ( test ) {
			if ( agent.contains ( test )) {
				if ( test.match ( /ipad|iphone/ )) {
					os = "ios";
				} else {
					os = test.replace ( / /g, "" );  // no spaces
				}
			}
			return os === null;
		});
		return os;
	})();

	/**
	 * Has touch support? Note that desktop Chrome has this.
	 * @TODO Investigate this in desktop IE10.
	 * @type {boolean}
	 */
	this.hasTouch = ( window.ontouchstart !== undefined || this.isChrome );

	/**
	 * Supports file blob?
	 * @type {boolean}
	 */
	this.hasBlob = ( window.Blob && ( window.URL || window.webkitURL ));

	/**
	 * Supports the History API?
	 * @type {boolean}
	 */
	this.hasHistory = ( window.history && window.history.pushState );

	/**
	 * Is mobile device? Not to be confused with this.hasTouch
	 * @TODO gui.Observerice entity?
	 * @type {boolean}
	 */
	this.isMobile = ( function () {
		var shortlist = [ "android", "webos", "iphone", "ipad", "ipod", "blackberry", "windows phone" ];
		return !shortlist.every ( function ( system ) {
			return !agent.contains ( system );
		});
	}());

	/**
	 * Supports CSS transitions?
	 * @type {boolean}
	 */
	this.hasTransitions = supports ( "transition" );

	/**
	 * Supports CSS 3D transform? (note https://bugzilla.mozilla.org/show_bug.cgi?id=677173)
	 * @type {boolean}
	 */
	this.has3D = supports ( "perspective" );

	/**
	 * Supports flexible box module?
	 * @todo Firefox and Safari only a few versions back should NOT report true on this...
	 * @type {boolean}
	 */
	this.hasFlexBox = supports ( "flex" );

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
	 * @see https://code.google.com/p/chromium/issues/detail?id=35980
	 * @TODO Now Firefox started to suck really bad. What to do?
	 * @type {number}
	 */
	this.STABLETIME = 200;
	
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
	 * Before we start any spirits:
	 * - What is the scroll root?
	 * - Supports position fixed?
	 * @param {gui.Broadcast} b
	 */
	this.onbroadcast = function ( b ) {
		var type = gui.BROADCAST_WILL_SPIRITUALIZE;
		if ( b.type === type && b.target === gui ) {
			gui.Broadcast.removeGlobal ( type, this );
			extras.call ( this );
		}
	};

	/**
	 * @TODO Probably move this out of here?
	 */
	function extras () {
		var win = window,
		doc = document,
		html = doc.documentElement,
		body = doc.body,
		root = null;
		// make sure window is scrollable
		var temp = body.appendChild ( 
			gui.CSSPlugin.style ( doc.createElement ( "div" ), {
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
		gui.CSSPlugin.style ( temp, {
			position : "fixed",
			top : "10px"
		});
		// restore scroll when finished
		var has = temp.getBoundingClientRect ().top === 10;
		this.hasPositionFixed = has;
		body.removeChild ( temp );
		win.scrollBy ( 0, -10 );
		// compute scrollbar size
		var inner = gui.CSSPlugin.style ( document.createElement ( "p" ), {
			width : "100%",
			height : "200px"
		});
		var outer = gui.CSSPlugin.style ( document.createElement ( "div" ), {
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

		/*
		 * Temp hotfix for IE...
		 */
		if ( this.isExplorer ) {
			this.scrollBarSize = 17; // wat
		}
	}

});

/**
 * Hm.
 */
( function waitfordom () {
	gui.Broadcast.addGlobal ( gui.BROADCAST_WILL_SPIRITUALIZE, gui.Client );
})();


/**
 * Spirit of the root HTML element.
 * @extends {gui.Spirit}
 * Spirit of the HTML element.
 */
gui.DocumentSpirit = gui.Spirit.infuse ( "gui.DocumentSpirit", {

	/**
	 * Construct.
	 */
	onconstruct : function () {
		this._super.onconstruct ();
		this._dimension = new gui.Dimension ( 0, 0 );
		this.action.addGlobal (gui.ACTION_DOCUMENT_FIT);
		this.event.add ( "message", this.window );
		Object.keys ( this._messages ).forEach ( function ( type ) {
			var target = this.document;
			switch ( type ) {
				case "scroll" :
				case "resize" : // ??????
				case "popstate" :
				case "hashchange" :
					var win = this.window;
					target = win === top ? win : null;
					break;
			}
			if ( target ) {
				this.event.add ( type, target );
			}
		}, this );
		if ( this.document === document ) {
			this._constructTop ();
		}
		/*
		 * BUG!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		 * @TODO it appears we *must* listen for touch start events
		 * for any spirit to subscribe to touch-end events only!!!!
		 * @see {gui.SpiritTouch}
		 */
		if ( gui.Type.isDefined ( this.touch )) {
			this.touch.add ( gui.SpiritTouch.FINGER_START );
		}
		// @TODO iframe hello.
		this.action.dispatchGlobal ( gui.ACTION_DOCUMENT_CONSTRUCT );
	},

	/**
	 * Get ready.
	 * @TODO think more about late loading (module loading) scenario...
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
			default : // all documents
				switch ( e.type ) {
					case "resize" :
						try {
							if ( parent === window ) { // @TODO: gui.isTop or something...
								try {
									this._onresize ();
								} catch ( normalexception ) {
									throw ( normalexception );
								}
							}
						} catch ( explorerexception ) {}
						break;
					case "load" :
						e.stopPropagation ();
						if ( !this._isLoaded ) {
							this._onload ();
						}
						break;
					case "message" :
						this._onmessage ( e.data );
						break;
				}
				// broadcast event globally?
				var message = this._messages [ e.type ];
				if ( gui.Type.isDefined ( message )) {
					this._broadcastEvent ( e, message );
				}
		}
	},

	/**
	 * Handle action.
	 * @param {gui.Action} a
	 */
	onaction : function ( a ) {
		this._super.onaction ( a );
		switch ( a.type ) {
			case gui.ACTION_DOCUMENT_FIT : // relay fit a, but claim ourselves as new a.target
				a.consume ();
				this.fit ( a.data === true );
				break;
		}
	},

	/**
	 * Hello.
	 */
	onvisible : function () {
		this.css.remove ( gui.CLASS_INVISIBLE );
		this._super.onvisible ();
	},

	/**
	 * Hello.
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
			console.warn ( "@TODO loaded twice..." );
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
				console.log("Fit " + this.document.title + " : " + Math.random());
				this.fit ( true );
				break;
		}
	},

	/**
	 * TODO: rename to "seamless" or "fitiframe" ?
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

	/**
	 * Propagate broadcast xdomain, recursively posting to neighboring documentspirits.
	 *
	 * 1. Propagate descending
	 * 2. Propagate ascending
	 * @TODO Don't post to universal domain "*" let's bypass the iframe spirit for this...
	 * @param {gui.Broadcast} b
	 */
	propagateBroadcast : function ( b ) {
		b.signatures.push ( this.signature );
		var msg = gui.Broadcast.stringify ( b );
		var win = this.window;
		var sup = win.parent;
		if ( win !== sup ) {
			this.dom.qall ( "iframe", gui.IframeSpirit ).forEach ( function ( iframe ) {
				if ( iframe.external ) {
					iframe.contentWindow.postMessage ( msg, "*" );
				}
			});
			if ( sup !== win ) {
				sup.postMessage ( msg, "*" );
			}
		}
	},
	
	
	// Private ...................................................................

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
	 * gui.DocumentSpirit cannot handle it, you should broadcast this stuff *manually*.
	 * @param {Event} e
	 * @param {String} message
	 */
	_broadcastEvent : function ( e, message ) {
		switch ( e.type ) {
				case "mousemove" :
				case "touchmove" :
					try {
						gui.broadcastGlobal ( message, e );
					} catch ( x ) {
						this.event.remove ( e.type, e.target );
						throw x;
					}
					break;
				default :
					gui.broadcastGlobal ( message, e );
					break;
		}
	},

	/**
	 * Handle message posted from subframe or xdomain.
	 * 
	 * 1. Relay broadcasts
	 * 2. Relay descending actions
	 * @TODO Don't claim this as action target!
	 * @param {String} msg
	 */
	_onmessage : function ( msg ) {
		var pattern = "spiritual-broadcast";
		if ( msg.startsWith ( pattern )) {
			var b = gui.Broadcast.parse ( msg );
			if ( b.signatures.indexOf ( this.signature ) < 0 ) {
				gui.Broadcast.dispatchGlobal ( 
					b.target, 
					b.type, 
					b.data 
				);
			}
		} else {
			pattern = "spiritual-action";
			if ( msg.startsWith ( pattern )) {
				var a = gui.Action.parse ( msg );
				if ( a.direction === gui.Action.DESCEND ) {
					this.action.descendGlobal ( 
						a.type, 
						a.data
					);
				}
			}
		}
	},

	/**
	 * Mapping DOM events to broadcast messages.
	 * @type {Map<String,String>}
	 */
	_messages : {
		"click" : gui.BROADCAST_MOUSECLICK,
		"mousedown" : gui.BROADCAST_MOUSEDOWN,
		"mouseup" : gui.BROADCAST_MOUSEUP,
		"scroll" : gui.BROADCAST_SCROLL, // top ??????????
		"resize" : gui.BROADCAST_RESIZE, // top ??????????
		"hashchange" : gui.BROADCAST_HASHCHANGE, // top ??????????
		"popstate" : gui.BROADCAST_POPSTATE // top ??????????
		// "mousemove" : gui.BROADCAST_MOUSEMOVE,
		// "touchstart" : gui.BROADCAST_TOUCHSTART,
		//"touchend" : gui.BROADCAST_TOUCHEND,
		//"touchcancel" : gui.BROADCAST_TOUCHCANCEL,
		//"touchleave" : gui.BROADCAST_TOUCHLEAVE,
		//"touchmove" : gui.BROADCAST_TOUCHMOVE,
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
	 * Special setup for top document: Broadcast 
	 * orientation on startup and when it changes.
	 */
	_constructTop : function () {
		if ( parent === window ) {
			this._onorientationchange ();
			this.event.add ( "orientationchange", window );
		}
	},

	/**
	 * Intensive resize procedures should subscribe 
	 * to the resize-end message as broadcasted here.
	 * @TODO prevent multiple simultaneous windows
	 */
	_onresize : function () {
		this.window.clearTimeout ( this._timeout );
		this._timeout = this.window.setTimeout ( function () {
			gui.broadcastGlobal ( gui.BROADCAST_RESIZE_END );
		}, gui.DocumentSpirit.TIMEOUT_RESIZE_END );
	},

	/**
	 * Device orientation changed.
	 * @TODO Move to touch module?
	 * @TODO Only in top-loaded window :)
	 * @TODO gui.SpiritDevice entity
	 */
	_onorientationchange : function () {
		gui.orientation = window.innerWidth > window.innerHeight ? 1 : 0;
		gui.broadcastGlobal ( gui.BROADCAST_ORIENTATIONCHANGE );
	}

	
}, {}, { // Static .............................................................

	/**
	 * Timeout in milliseconds before we decide 
	 * that user is finished resizing the window.
	 */
	TIMEOUT_RESIZE_END : 250
});


/**
 * Spirit of the window.
 * @TODO use this name?
 * @extends {gui.Spirit}
 */
gui.WindowSpirit = gui.Spirit.infuse ( "gui.WindowSpirit", {

	/**
	 * When to hide the loading splash cover. 
	 * @TODO Match one of "ready" "load" "fit"
	 * Defaults to "fit" (harcoded for now)
	 */
	cover : "fit",

	/**
	 * Fit height to iframe contained document height?
	 * @TODO setter for this to allow runtime update.
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
		this._frame.att.set ( "sandbox", this.att.get ( "sandbox" ));
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
					this.css.height = action.data.height;
					this.action.dispatchGlobal ( action.type, action.data.height );
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

	
	// Private ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

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
	 * @TODO use top right bottom left instead of width and height?
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


}, { // Static ..........................................................

	/**
	 * Summon spirit.
	 * @param {Document} doc
	 * @param @optional {String} src
	 */
	summon : function ( doc, src ) {
		var div = doc.createElement ( "div" );
		var spirit = this.possess ( div );
		if ( src ) {
			spirit.src ( src );
		}
		return spirit;
	}

});


/**
 * Spirit of the iframe.
 * @extends {gui.Spirit}
 */
gui.IframeSpirit = gui.Spirit.infuse ( "gui.IframeSpirit", {

	/**
	 * True when hosting xdomain stuff.
	 * @type {boolean}
	 */
	external : false,

	/**
	 * Hosted window.
	 * @type {Window}
	 */
	contentWindow : {
		getter : function () {
			return this.element ? this.element.contentWindow : null;
		},
		setter : function () {
			// @TODO Or else the getter malfunctions!
		}
	},

	/**
	 * Hosted document.
	 * @type {Document}
	 */
	contentDocument : {
		getter : function () {
			return this.element ? this.element.contentDocument : null;
		},
		setter : function () {
			// @TODO Or else the getter malfunctions!
		}
	},

	/**
	 * Get ready.
	 */
	onready : function () {
		this._super.onready ();
		this.event.add ( "message", this.window, this );
	},

	/**
	 * Handle event.
	 * @param {Event} e
	 */
	onevent : function ( e ) {
		this._super.onevent ( e );
		if ( e.type === "message" && this.external ) {
			this._onmessage ( e.data );
		}
	},

	/**
	 * Get and set the iframe source.
	 * @param @optional {String} src
	 */
	src : function ( src ) {
		if ( gui.Type.isString ( src )) {
			if ( gui.IframeSpirit.isExternal ( src )) {
				src = gui.IframeSpirit.sign ( src, this.document, this.$instanceid );
				this.external = true;
			}
			this.element.src = src;
		} else {
			return this.element.src;
		}
	},


	// Private ..................................................................
	
	/**
	 * Handle posted message, scanning for ascending actions. 
	 * Descending actions are handled by the documentspirit.
	 * @TODO Don't claim this as action target!
	 * @see {gui.DocumentSpirit._onmessage}
	 * @param {String} msg
	 */
	_onmessage : function ( msg ) {
		if ( this.external && msg.startsWith ( "spiritual-action:" )) {
			var a = gui.Action.parse ( msg );
			if ( a.direction === gui.Action.ASCEND ) {
				if ( a.$instanceid === this.$instanceid ) {
					this.action.ascendGlobal ( a.type, a.data );
				}
			}
		}
	}

	
}, { // Recurring static ......................................................

	/**
	 * Summon spirit.
	 * @TODO why does spirit.src method fail strangely just now? using iframe.src instead...
	 * @param {Document} doc
	 * @param @optional {String} src
	 * @returns {gui.IframeSpirit}
	 */
	summon : function ( doc, src ) {
		var iframe = doc.createElement ( "iframe" );
		var spirit = this.possess ( iframe );
		spirit.css.add ( "gui-iframe" );
		if ( src ) {
			if ( gui.IframeSpirit.isExternal ( src )) { // should be moved to src() method!!!!!
				src = this.sign ( src, doc, spirit.$instanceid );
				spirit.external = true;
			}
		} else {
			src = this.SRC_DEFAULT;	
		}
		iframe.src = src;
		return spirit;
	}


}, { // Static ................................................................

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
	 * Sign URL with cross-domain credentials 
	 * and key to identify the IframeSpirit.
	 * @param {String} url
	 * @param {Document} doc
	 * @param {String} key
	 * @returns {String}
	 */
	sign : function ( url, doc, key ) {
		var loc = doc.location;
		var uri = loc.protocol + "//" + loc.host;
		var sig = uri + "/" + key;
		return gui.URL.setParam ( url, this.KEY_SIGNATURE, sig );
	},

	/**
	 * Remove signature from URL (for whatever reason).
	 * @param {String} url
	 * @param {String} sign
	 * @returns {String}
	 */
	unsign : function ( url ) {	
		return gui.URL.setParam ( url, this.KEY_SIGNATURE, null );
	},

	/**
	 * Is external address?
	 * @todo Always external in IE because url.host is empty(!).
	 * @returns {boolean}
	 */
	isExternal : function ( url ) {
		var doc = document; // TODO: scope this somehow...
		url = new gui.URL ( doc, url );
		return url.host !== doc.location.host;
	}
});


/**
 * Spirit of the stylesheet.
 * @see http://www.quirksmode.org/dom/w3c_css.html
 * @extends {gui.Spirit}
 */
gui.StyleSheetSpirit = gui.Spirit.infuse ( "gui.StyleSheetSpirit", {

	/**
	 * Sheet not accessible before we hit the document.
	 */
	onenter : function () {
		this._super.onenter ();
		if ( this._rules ) {
			this.addRules ( this._rules );
			this._rules = null;
		}
	},

	/**
	 * Disable styles.
	 */
	disable : function () {
		this.element.disabled = true;
	},

	/**
	 * Enable styles.
	 */
	enable : function () {
		this.element.disabled = false;
	},

	/**
	 * Add rules (by JSON object for now).
	 * @param {Map<String,object>} rules
	 */
	addRules : function ( rules ) {
		var sheet = this.element.sheet, index = sheet.cssRules.length;
		gui.Object.each ( rules, function ( selector, declarations ) {
			sheet.insertRule( selector + this._ruleout ( declarations ), index ++ );
		}, this );
	},

	// Private .................................................................

	/**
	 * CSS ruleset to evaluate when inserted.
	 * @type {Map<String,object>} declarations
	 */
	_rules : null,

	/**
	 * Convert declarations to rule body.
	 * @param {Map<String,String>} declarations
	 * @return {String}
	 */
	_ruleout : function ( declarations ) {
		var body = "", plugin = gui.CSSPlugin;
		gui.Object.each ( declarations, function ( property, value ) {
			body += 
				plugin.cssproperty ( property ) + ":" +
				plugin.cssvalue ( value ) + ";";
		});
		return "{" + body + "}";
	}


}, { // Static .....................................................

	/**
	 * Summon spirit.
	 * @param {Document} doc
	 * @param @optional {String} href
	 * @param @optional {Map<String,object>} rules
	 * @param @optional {boolean} disbled
	 * @returns {gui.StyleSheetSpirit}
	 */
	summon : function ( doc, href, rules, disabled ) {
		var elm = href ? this._createlink ( doc, href ) : this._createstyle ( doc );
		var spirit = this.possess ( elm );
		if ( rules ) {
			if ( href ) {
				elm.addEventListener ( "load", function () {
					spirit.addRules ( rules );
				}, false );
			} else {
				spirit._rules = rules;
			}
		}
		if ( disabled ) {
			spirit.disable ();
		}
		return spirit;
	},


	// Private static .................................................

	/**
	 * External styles in LINK element.
	 * @returns {HTMLLinkElement}
	 */
	_createlink : function ( doc, href ) {
		var link = doc.createElement ( "link" );
		link.className = "gui-stylesheet";
		link.rel = "stylesheet";
		link.href = href;
		return link;
	},

	/**
	 * Inline styles in STYLE element.
	 * @returns {HTMLStyleElement}
	 */
	_createstyle : function ( doc ) {
		var style = doc.createElement ( "style" );
		style.className = "gui-stylesheet";
		style.appendChild ( doc.createTextNode ( "" ));
		return style;
	}

});


/**
 * @extends {gui.Spirit}
 * @deprecated
 * Spirit of the button-like element.
 * @TODO Support ENTER for onaction.
 * @TODO move to some kind of plugin.
 */
gui.ActionSpirit = gui.Spirit.infuse ( "gui.ActionSpirit", {

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
 * @extends {gui.Spirit}
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
	 * @TODO promises goes here
	 * @param {number} duration in ms
	 * @returns {object} then method
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
	 * @TODO promises goes here
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


}, { 

	// Static ............................................................

	/**
	 * Summon spirit.
	 * @param {Document} doc
	 * @returns {gui.CoverSpirit}
	 */
	summon : function ( doc ) {
		var spirit = this.possess ( doc.createElement ( "div" ));
		spirit.css.add ( "gui-cover" );
		return spirit;
	}
});


/**
 * Do what Spiritual does by overloading JQuery methods instead of native DOM methods.
 * @TODO (Angular special) handle function replaceWith, "a special jqLite.replaceWith, which can replace items which have no parents"
 * @TODO Henrik says "$(iframe.contentDocument).remove() før man skifter URL eller fjerner iframen" (jQuery.cache og jQuery.fragments)
 */
gui.module ( "jquery", {

	/**
	 * Hack Spiritual in top window.
	 * @param {Window} context
	 */
	oncontextinitialize : function ( context ) {
		if ( context === top ) {
			this._spiritualdom ();
		}
	},

	/**
	 * Hack JQuery in all windows.
	 * @param {Window} context
	 */
	onbeforespiritualize : function ( context ) {
		var root = context.document.documentElement;
		if ( context.gui.mode === gui.MODE_JQUERY ) {
			var jq = context.jQuery;
			jq.__rootnode = root;
			this._instance ( jq );
			this._expandos ( jq );
			this._overload ( jq, context );
		}
	},


	// Private .............................................................

	/**
	 * Generating spirit management methods.
	 * @param {jQuery} jq
	 */
	_expandos : function ( jq ) {
		var guide = gui.Guide;
		jq.__suspend = false;
		[ 
			"spiritualize", 
			"spiritualizeSub", 
			"spiritualizeOne",
			"materialize", 
			"materializeSub", 
			"materializeOne" 
		].forEach ( function ( method ) {
			jq.fn [ "__" + method ] = function () {
				return this.each ( function ( i, el ) {
					gui.Guide [ method ] ( el );
				});
			};
		});
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
	 * @param {function} jq Constructor
	 * @param {Window} context
	 */
	_overload : function ( jq, context ) {
		var module = this;
		var naive = Object.create ( null ); // mapping unmodified methods
		[ 
			"attr", 
			"removeAttr"
		].forEach ( function ( name ) {
			naive [ name ] = jq.fn [ name ];
			jq.fn [ name ] = function () {
				var nam = arguments [ 0 ];
				var val = arguments [ 1 ];
				var res = naive [ name ].apply ( this, arguments );
				var del = name === "removeAttr";
				val = del ? null : val;
				this.each ( function ( i, elm ) {
					if ( elm.spirit ) {
						if ( val !== undefined || del ) {
							elm.spirit.att.set ( nam, val );
						} else {
							res = elm.spirit.att.get ( nam );
						}
					}
				});
				return res;
			};
		});
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
				if ( context.gui.mode !== gui.MODE_JQUERY ) {
					res = suber ();
				} else if ( jq.__suspend ) {
					res = suber ();
				} else if ( name === "text" ) {
					if ( set ) {
						this.__materializeSub ();
					}
					res = suber ();
				} else {
					var arg = function() { return set ? jq ( args [ 0 ]) : undefined; };
					var guide = gui.Guide;
					jq.__suspend = true;
					switch ( name ) {
						case "append" :
						case "prepend" :
							res = module._append_prepend.call ( this, name === "append", suber, jq );
							break;
						case "after" :
						case "before" :
							res = module._after_before.call ( this, name === "after", suber, jq );
							break;
						case "appendTo" :
							res = suber ();
							arg ().each ( function ( i, m ) {
								jq ( m ).last ().__spiritualize ();
							});
							break;
						case "prependTo" :
							res = suber ();
							arg ().each ( function ( i, m ) {
								jq ( m ).first ().__spiritualize ();
							});
							break;
						case "insertAfter" :
							res = suber ();
							arg ().next ().__spiritualize ();
							break;
						case "insertBefore" :
							res = suber ();
							arg ().prev ().__spiritualize ();
							break;
						case "detach" :
						case "remove" :
							this.__materialize ();
							res = suber ();
							break;
						case "replaceAll" :	
							res = module._replaceall_replacewith ( this, arg (), suber );
							break;
						case "replaceWith" :
							res = module._replaceall_replacewith ( arg (), this, suber );
							break;
						case "empty" :
							this.__materializeSub ();
							res = suber ();
							break;
						case "html" :
							if ( set ) {
								this.__materializeSub ();
							}
							res = suber ();
							if ( set ) {
								this.__spiritualizeSub ();
							}
							break;
						case "unwrap" :
							// note: materialize is skipped here!
							this.parent ().__materializeOne ();
							res = suber ();
							break;
						case "wrap" :
						case "wrapAll" :
							// note: materialize is skipped here!
							res = suber ();
							this.parent ().__spiritualizeOne ();
							break;
						case "wrapInner" :
							res = suber ();
							this.__spiritualize ();
							break;
					}
					jq.__suspend = false;
				}
				return res;
			};
		});
	},
	
	/**
	 * Overload Spiritual to spiritualize/materialize spirits on DOM mutation and to 
	 * suspend mutation monitoring while DOM updating. This would normally (in native 
	 * mode) be baked into native DOM methods appendChild, removeChild and so on.
	 * @see {gui.DOMPlugin}
	 */
	_spiritualdom : function () {
		// overloading this fellow
		var plugin = gui.DOMPlugin.prototype;
		// @param {gui.Spirit} spirit
		// @returns {object}
		function breakdown ( spirit ) {
			var elm = spirit.element;
			var doc = elm.ownerDocument;
			var win = doc.defaultView;
			var dom = spirit.dom.embedded();
			var is$ = win.gui.mode === gui.MODE_JQUERY;
			return { elm : elm, doc : doc, win : win, dom : dom, is$ : is$ };
		}
		// manage invoker subtree.
		[ "html", "empty", "text" ].forEach ( function ( method ) {
			var old = plugin [ method ];
			plugin [ method ] = function () {
				var args = arguments, res;
				var b = breakdown ( this.spirit );
				if ( b.is$ ) {
					if ( b.dom ){
						gui.Guide.materializeSub ( b.elm );
					}
					res = gui.Observer.suspend ( b.elm, function () {
						return old.apply ( this, args );
					}, this );
					if ( b.dom && method === "html" ) {
						gui.Guide.spiritualizeSub ( b.elm );
					}
				} else {
					res = old.apply ( this, args );
				}
				return res;
			};
		});
		// manage invoker itself.
		[ "remove" ].forEach ( function ( method ) {
			var old = plugin [ method ];
			plugin [ method ] = function () {
				var args = arguments, res;
				var b = breakdown ( this.spirit );
				if ( b.is$ ) {
					if ( b.dom ) {
						gui.Guide.materialize ( b.elm );
					}
					res = gui.Observer.suspend ( b.elm, function () {
						return old.apply ( this, args );
					}, this );
				} else {
					res = old.apply ( this, args );
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
						things = gui.Array.toArray ( things );
						var els = Array.map ( things, function ( thing ) {
							return thing && thing instanceof gui.Spirit ? thing.element : thing;
						});
						els.forEach ( function ( el ) {
							gui.Guide.spiritualize ( el );
						});
					}
				} else {
					res = old.call ( this, things );
				}
				return res;
			};
		});
	},

	/**
	 * JQuery append() and prepend().
	 * @param {boolean} append
	 * @param {function} suber
	 */
	_append_prepend : function ( append, suber ) {
		var last = "lastElementChild";
		var fist = "firstElementChild";
		var next = "nextElementSibling";
		var prev = "previousElementSibling";
		var current = Array.map ( this, function ( elm ) {
			return elm [ append ? last : fist ];
		});
		var old, res = suber ();
		this.each ( function ( index, elm ) {
			if (( old = current [ index ])) {
				elm = old [ append ? next : prev ];
			} else {
				elm = elm.firstElementChild;
			}	
			while ( elm ) {
				gui.Guide.spiritualize ( elm );	
				elm = elm [ append ? next : prev ];
			}
		});
		return res;
	},
	
	/**
	 * JQuery after() and before(). We can't reliably use the arguments 
	 * here becayse JQuery will switch them to clones in the process. 
	 * @param {boolean} after
	 * @param {function} suber
	 */
	_after_before : function ( after, suber ) {
		var res, sib, current = [];
		var target = after ? "nextSibling" : "previousSibling";
		function sibling ( node ) {	// (node may be a comment)
			node = node [ target ];
			while ( node && node.nodeType !== Node.ELEMENT_NODE ) {
				node = node [ target ];
			}
			return node;
		}
		this.each ( function ( i, elm ) {
			while ( elm && current.indexOf ( elm ) === -1 ) {
				current.push ( elm );
				elm = sibling ( elm );
			}
		});
		res = suber ();
		this.each ( function ( i, elm ) {
			sib = sibling ( elm );
			while ( sib && current.indexOf ( sib ) === -1 ) {
				gui.Guide.spiritualize ( sib );
				sib = sibling ( sib );
			}
		});
		return res;
	},

	/**
	 * JQuery replaceAll() and replaceWith().
	 * @param {$} source
	 * @param {$} target
	 * @param {function} suber
	 */
	_replaceall_replacewith : function ( source, target, suber ) {
		var parent, parents = [], current = [];
		target.each ( function ( i, elm ) {
			gui.Guide.materialize ( elm );
			parent = elm.parentNode;
			if ( parents.indexOf ( parent ) === -1 ) {
				parents.push ( parent );
				current = current.concat ( 
					Array.map ( parent.children, function ( child ) {
						return child;
					})
				);
			}
		});
		var res = suber ();
		parents.forEach ( function ( parent ) {
			if ( parent ) {
				Array.forEach ( parent.children, function ( elm ) {
					if ( current.indexOf ( elm ) === -1 ) {
						gui.Guide.spiritualize ( elm );
					}
				});
			}		
		});
		return res;
	}
	
});


/**
 * Spiritualizing documents by overloading DOM methods.
 */
gui.DOMChanger = {

	/**
	 * True when in JQuery mode. This will be removed when 
	 * iOS supports a mechanism for intercepting `innerHTML`. 
	 * @type {boolean}
	 */
	jquery : false,

	/**
	 * Tracking success with overloading `innerHTML`.
	 * 
	 * - Firefox, Opera and Explorer does this on an Element.prototype level
	 * - Webkit must do this on all *instances* of Element (pending WebKit issue 13175)
	 * - Safari on iOS fails completely and must fallback to use the jQquery module
	 * @type {Map<String,boolean>}
	 */
	innerhtml : {
		global : false,
		local : false, 
		missing : false 
	},

	/**
	 * Declare "spirit" as a fundamental property of things 
	 * and extend native DOM methods in given window scope.
	 * @TODO WeakMap<Element,gui.Spirit> in supporting agents
	 * @param {Window} win
	 */
	change : function ( win ) {
		var element = win.Element.prototype;
		if ( gui.Type.isDefined ( element.spirit )) {
			throw new Error ( "Spiritual loaded twice?" );
		} else {
			element.spirit = null; // defineProperty fails in iOS5
			switch ( win.gui.mode ) {
				case gui.MODE_MANAGED :
				case gui.MODE_NATIVE :
				case gui.MODE_OPTIMIZE : 
					this.upgrade ( win, gui.DOMCombos.getem ());
					break;
				case gui.MODE_JQUERY :
					this._jquery ( win );
					break;
			}
		}
	},

	/**
	 * Upgrade DOM methods in window. 
	 * @param {Window} win
	 * @param {Map<String,function>} combos
	 */
	upgrade : function ( win, combos ) {
		this._change ( win, combos );
	},


	// Private ........................................................................

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
	 * @TODO Extend DocumentFragment
	 * @TODO Support insertAdjecantHTML
	 * @TODO Support SVG elements
	 * @param {Window} win
	 * @param {Map<String,function} combos
	 */
	_change : function _change ( win, combos ) {
		var did = [], doc = win.document;
		if ( !this._canchange ( win.Element.prototype, win, combos )) {
			if ( !win.HTMLElement || !this._canchange ( win.HTMLElement.prototype, win )) {
				this._tags ().forEach ( function ( tag ) {
					var e = doc.createElement ( tag );
					var p = e.constructor.prototype;
					// alert ( p ); this call throws a BAD_CONVERT_JS
					if ( p !== win.Object.prototype ) { // excluding object and embed tags
						if ( did.indexOf ( p ) === -1 ) {
							this._dochange ( p, win, combos );
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
			"label legend li link main map menu meta meter nav noscript ol optgroup option " +
			"output p param pre progress q rp rt ruby s samp script section select small " +
			"source span strong style submark summary sup table tbody td textarea tfoot " +
			"th thead time title tr track ul unknown var video wbr" ).split ( " " );
	},

	/**
	 * Can extend given prototype object? If so, do it now.
	 * @param {object} proto
	 * @param {Window} win
	 * @param {Map<String,function} combos
	 * @returns {boolean} Success
	 */
	_canchange : function _canchange ( proto, win, combos ) {
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
			this._dochange ( proto, win, combos );
			result = true;
		}
		return result;
	},

	/**
	 * Overloading prototype methods and properties. If we cannot get an angle on innerHTML, 
	 * we switch to JQuery mode. This is currently known to happen in Safari on iOS 5.1
	 * @TODO Firefox creates 50-something unique functions here
	 * @TODO Test success runtime (not rely on user agent string).
	 * @TODO inserAdjecantHTML
	 * @param {object} proto
	 * @param {Window} win
	 * @param {Map<String,function} combos
	 */
	_dochange : function _dochange ( proto, win, combos ) {
		switch ( gui.Client.agent ) {
			case "explorer" : // http://msdn.microsoft.com/en-us/library/dd229916(v=vs.85).aspx
				this.innerhtml.global = true;
				break;
			case "gecko" :
			case "opera" : // @TODO Object.defineProperty supported?
				this.innerhtml.global = true;
				break;
			case "webkit" :
				if ( gui.DOMPatcher.canpatch ( win )) {
					this.innerhtml.local = true;
					gui.DOMPatcher.patch ( win.document );
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
		// Overloading methods? Only in native mode.
		// @TODO insertAdjecantHTML
		if ( win.gui.mode === gui.MODE_NATIVE ) {
			var root = win.document.documentElement;
			gui.Object.each ( combos, function ( name, combo ) {
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
					//try {
						this._doboth ( proto, name, combo, root );
					/*
					} catch ( exception ) { // firefox 21 is changing to IE style?
						alert("??")
						this._doie ( proto, name, combo );	
					}
					*/
					break;
				case "explorer" :
					this._doie ( proto, name, combo );
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
	 * Overload DOM method (same for all browsers).
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
	 * Overload property setter for IE.
	 * @param {object} proto
	 * @param {String} name
	 * @param {function} combo
	 * @param {Element} root
	 */
	_doie : function ( proto, name, combo ) {
		var base = Object.getOwnPropertyDescriptor ( proto, name );
		Object.defineProperty ( proto, name, {
			get: function () {
				return base.get.call ( this );
			},
			set: combo ( function () {
				base.apply ( this, arguments );
			})
		});
	},

	/**
	 * Overload property setter for Firefox and Opera. 
	 * Looks like Gecko is moved towards IE setup (?)
	 * @param {object} proto
	 * @param {String} name
	 * @param {function} combo
	 * @param {Element} root
	 */
	_doboth : function ( proto, name, combo, root ) {
		var getter = root.__lookupGetter__ ( name );
		var setter = root.__lookupSetter__ ( name );
		if ( getter ) {
			// firefox 20 needs a getter for this to work
			proto.__defineGetter__ ( name, function () {
				return getter.apply ( this, arguments );
			});
			// the setter still seems to work as expected
			proto.__defineSetter__ ( name, combo ( function () {
				setter.apply ( this, arguments );
			}));
		} else {
			// firefox 21 can't lookup textContent getter *sometimes*
			throw new Error ( "Can't lookup getter for " + name );
		}
	}
};


/**
 * This is where it gets interesting.
 * @TODO Standard DOM exceptions for missing arguments and so on.
 * @TODO insertAdjecantHTML
 * @TODO DOM4 methods
 */
gui.DOMCombos = {

	/**
	 * Get combinations to overload native DOM methods and getters.
	 * @type {Map<String,function>}
	 */
	getem : function () {
		return this._creation || ( this._creation = this._create ());
	},

	// Private .......................................................................
	
	/**
	 * Cache combinations for reuse when next requested.
	 * @type {Map<String,function>}
	 */
	_creation : null,

	/**
	 * Building combinations when first requested. Note that property setters such as 
	 * innerHTML and textContent are skipped for WebKit where the stuff only works because 
	 * properties have been re-implemented using methods in all WebKit based browsers. 
	 * @see {gui.DOMPatcher}
	 */
	_create : function () {

		var combo = gui.Combo;
		var guide = gui.Guide;
		
		/**
		 * Is `this` embedded in document?
		 * @returns {boolean}
		 */
		var ifEmbedded = combo.provided ( function () {
			return gui.DOMPlugin.embedded ( this );
		});

		/**
		 * Element has spirit?
		 * @returns {boolean}
		 */
		var ifSpirit = combo.provided ( function () {
			return !gui.Type.isNull ( this.spirit );
		});

		/**
		 * Attach node plus subtree.
		 * @param {Node} node
		 */
		var spiritualizeAfter = combo.after ( function ( node ) {
			guide.spiritualize ( node );
		});

		/**
		 * Detach node plus subtree.
		 * @param {Node} node
		 */
		var materializeBefore = combo.before ( function ( node ) {
			guide.materialize ( node );
		});

		/**
		 * Attach new node plus subtree.
		 * @param {Node} newnode
		 * @param {Node} oldnode
		 */
		var spiritualizeNewAfter = combo.after ( function ( newnode, oldnode ) {
			guide.spiritualize ( newnode );
		});

		/**
		 * Detach old node plus subtree
		 * @param {Node} newnode
		 * @param {Node} oldnode
		 */
		var materializeOldBefore = combo.before ( function ( newnode, oldnode ) {
			guide.materialize ( oldnode );
		});

		/**
		 * Spirit-aware setattribute.
		 * @param {String} att
		 * @param {String} val
		 */
		var setAttAfter = combo.after ( function ( att, val ) {
			this.spirit.att.$suspend ( function () {
				this.set ( att, val );
			});
		});

		/**
		 * Spirit-aware removeattribute.
		 * @TODO use the post combo?
		 * @param {String} att
		 */
		var delAttAfter = combo.after ( function ( att ) {
			this.spirit.att.$suspend ( function () {
				this.del ( att );
			});
		});

		/**
		 * Disable DOM mutation observers while doing action.
		 * @param {function} action
		 */
		var suspending = combo.around ( function ( action ) {
			return gui.Observer.suspend ( this, function () {
				return action ();
			}, this );
		});

		/**
		 * Detach subtree of `this`.
		 */
		var materializeSubBefore = combo.before ( function () {
			guide.materializeSub ( this );
		});

		/**
		 * Attach subtree of `this`
		 */
		var spiritualizeSubAfter = combo.after ( function () {
			guide.spiritualizeSub ( this );
		});

		/**
		 * Detach `this`.
		 */
		var parent = null; // @TODO unref this at some point
		var materializeThisBefore = combo.before ( function () {
			parent = this.parentNode;
			guide.materialize ( this );
		});

		/**
		 * Attach parent.
		 */
		var spiritualizeParentAfter = combo.after ( function () {
			guide.spiritualize ( parent );
		});

		/**
		 * Webkit-patch property descriptors for node and subtree.
		 * @see {gui.DOMPatcher}
		 * @param {Node} node
		 */
		var patchAfter = combo.after ( function ( node ) {
			if ( gui.Client.isWebKit ) {
				gui.DOMPatcher.patch ( node );
			}
		});

		/**
		 * Pretend nothing happened when running in "managed" mode.
		 * @TODO Simply mirror this prop with an internal boolean
		 */
		var ifEnabled = combo.provided ( function () {
			return this.ownerDocument.defaultView.gui.mode !== gui.MODE_MANAGED;
		});

		/**
		 * Sugar for combo readability.
		 * @param {function} action
		 * @returns {function}
		 */
		var otherwise = function ( action ) {
			return action;
		};

		/**
		 * Here we go.
		 */
		return {

			appendChild : function ( base ) {
				return (
					ifEnabled ( 
						ifEmbedded ( spiritualizeAfter ( patchAfter ( suspending ( base ))), 
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			removeChild : function ( base ) {
				return (
					ifEnabled ( 
						ifEmbedded ( materializeBefore ( suspending ( base )),
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			insertBefore : function ( base ) {
				return (
					ifEnabled ( 
						ifEmbedded ( spiritualizeAfter ( patchAfter ( suspending ( base ))), 
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			replaceChild : function ( base ) {
				return (
					ifEnabled ( 
						ifEmbedded ( materializeOldBefore ( spiritualizeNewAfter ( patchAfter ( suspending ( base )))), 
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			setAttribute : function ( base ) {
				return ( 
					ifEnabled ( 
						ifEmbedded ( 
							ifSpirit ( setAttAfter ( base ), 
							otherwise ( base )),
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			removeAttribute : function ( base ) {
				return ( 
					ifEnabled ( 
						ifEmbedded ( 
							ifSpirit ( delAttAfter ( base ),
							otherwise ( base )),
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			innerHTML : function ( base ) {
				return (
					ifEnabled ( 
						ifEmbedded ( materializeSubBefore ( spiritualizeSubAfter ( suspending ( base ))),
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			outerHTML : function ( base ) {
				return (
					ifEnabled ( 
						ifEmbedded ( materializeThisBefore ( spiritualizeParentAfter ( suspending ( base ))),
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			textContent : function ( base ) {
				return (
					ifEnabled ( 
						ifEmbedded ( materializeSubBefore ( suspending ( base )),
						otherwise ( base )),
					otherwise ( base ))
				);
			}
		};
	}
};


/**
 * Patching bad WebKit support for overloading DOM getters and setters, 
 * specifically innerHTML, outerHTML and textContent.This operation is 
 * very time consuming, so let's pray for the related bug to fix soon.
 * @see http://code.google.com/p/chromium/issues/detail?id=13175
 */
gui.DOMPatcher = {

	/**
	 * Can patch property descriptors of elements in given 
	 * window? Safari on iOS throws an epic failure exception.
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
		if ( gui.DOMChanger.innerhtml.local ) {
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


	// Private .........................................................

	/**
	 * Property descriptor for innerHTML.
	 * @type {Object}
	 */
	_innerHTML : {	
		get : function () {
			return new gui.DOMSerializer ().subserialize ( this );
		},
		set : function ( html ) {
			gui.DOMPlugin.html ( this, html );
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
			gui.DOMPlugin.outerHtml ( this, html );
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
			gui.DOMPlugin.html ( this, html.
				replace ( /&/g, "&amp;" ).
				replace ( /</g, "&lt;" ).
				replace ( />/g, "&gt;" ).
				replace ( /"/g, "&quot" )
			);
		}
	}
};


/**
 * Monitors a document for unsolicitated DOM changes in development mode.
 */
gui.Observer = {

	/**
	 * Enable monitoring? Disabled due to WebKit bug.
	 * @see https://code.google.com/p/chromium/issues/detail?id=160985
	 * @type {boolean}
	 */
	observes : false, // gui.Client.hasMutations,

	/**
	 * Throw exception on mutations not intercepted by the framework?
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


	// Private ..............................................................

	/**
	 * Is suspended? Minimize what overhead there might 
	 * be on connecting and disconnecting the observer.
	 * @TODO do we need to track this for each window?
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


/**
 * Key event summary.
 * @TODO check out http://mozilla.pettay.fi/moztests/events/browser-keyCodes.htm
 * @param {boolean} down
 * @param {number} n KeyCode
 * @param {number} c Character
 * @param {boolean} g Global?
 */
gui.Key = function Key ( down, n, c, g ) {
	this.up = !down;
	this.down = down;
	this.code = n;
	this.char = c;
	this.global = g;
};

gui.Key.prototype = {

	/**
	 * Key released?
	 * @type {boolean}
	 */
	up : false,

	/**
	 * Key down?
	 * @type {boolean}
	 */
	down : false,

	/**
	 * Identifies physical keys by keyCode.
	 * @type {number}
	 */
	code : -1,

	/**
	 * Identifies typed character. This is `null` for 
	 * special keys such as arrow keys and page down.
	 * http://stackoverflow.com/questions/7226402/help-with-regex-pattern-for-delete-arrows-and-escape-keys
	 * http://javascript.info/tutorial/keyboard-events
	 * @TODO keyword breaks parsers?
	 * @type {String}
	 */
	char : null,

	/**
	 * Reserved for a distant future where browsers implement DOM3 keys.
	 * @type {String}
	 */
	key : null,

	/**
	 * Global key?
	 * @TODO Deprecate this?
	 * @type {boolean}
	 */
	global : false
};


// Static .........................................................................................

/**
 * Key modifiers.
 * @TODO: platform specific variations "accelDown" and "accessDown" (get a Mac and figure this out)
 * @TODO Update from http://askubuntu.com/questions/19558/what-are-the-meta-super-and-hyper-keys
 */
( function keymodifiers () {
	gui.Object.each ({
		shiftDown : false, // The Shift key.
		ctrlDown : false,  // The Control key.
		altDown : false,   // The Alt key. On the Macintosh, this is the Option key
		metaDown : false,  // The Meta key. On the Macintosh, this is the Command key.
		accelDown : false, // The key used for keyboard shortcuts on the user's platform. Usually, this would be the value you would use.
		accessDown : false // The access key for activating menus and other elements. On Windows, this is the Alt key, used in conjuction with an element's accesskey.
	}, function ( key, value ) {
		gui.Key [ key ] = value;
	});
}());

/**
 * These key codes "do not usually change" with keyboard layouts.
 * @TODO Read http://www.w3.org/TR/DOM-Level-3-Events/#key-values
 * @TODO http://www.w3.org/TR/DOM-Level-3-Events/#fixed-virtual-key-codes
 * @TODO http://www.w3.org/TR/DOM-Level-3-Events/#key-values-list
 */
( function keyconstants () {
	gui.Object.each ({
		BACKSPACE :	8,
		TAB	: 9,
		ENTER	: 13,
		SHIFT	: 16,
		CONTROL	: 17,
		ALT	: 18,
		CAPSLOCK : 20,
		ESCAPE : 27,
		SPACE	: 32,
		PAGE_UP	: 33,
		PAGE_DOWN	: 34,
		END	: 35,
		HOME : 36,
		LEFT : 37,
		UP : 38,
		RIGHT : 39,
		DOWN : 40,
		DELETE : 46
	}, function ( key, value ) {
		gui.Key [ key ] = value;
	});
}());

/**
 * These codes are somewhat likely to match a US or European keyboard, 
 * but they are not listed in the above "do not usually change" section. 
 */
( function questionablekeys () {
	gui.Object.each ({
		PLUS: 187,
		MINUS: 189,
		NUMPLUS: 107,
		NUMMINUS: 109
	}, function ( key, value ) {
		gui.Key [ key ] = value;
	});
}());


/**
 * Tracking keys.
 * @extends {gui.Tracker}
 * @using {gui.Arguments#confirmed}
 * @using {gui.Combo#chained}
 */
gui.KeyPlugin = ( function using ( confirmed, chained ) {

	return gui.Tracker.extend ( "gui.KeyPlugin", {
	
		/**
		 * Add one or more action handlers.
		 * @param {Array<String,Number>|String|number} arg @TODO Strings!
		 * @param @optional {object|function} handler
		 * @returns {gui.KeyPlugin}
		 */
		add : confirmed ( "array|string", "(object|function)" ) (
			chained ( function ( arg, handler ) {
				handler = handler ? handler : this.spirit;
				if ( gui.Interface.validate ( gui.IKeyHandler, handler )) {
					this._breakdown ( arg ).forEach ( function ( a ) {
						a = gui.Type.cast ( a );
						if ( this._addchecks ( a, [ handler, this._global ])) {
							gui.Broadcast.addGlobal ( gui.BROADCAST_KEYEVENT, this );
						}
					}, this );
				}
			})
		),

		/**
		 * Remove one or more action handlers.
		 * @param {Array<String,Number>|String|number} arg
		 * @param @optional {object} handler
		 * @returns {gui.KeyPlugin}
		 */
		remove : confirmed ( "array|string", "(object|function)" ) (
			chained ( function ( arg, handler ) {
				handler = handler ? handler : this.spirit;
				if ( gui.Interface.validate ( gui.IKeyHandler, handler )) {
					this._breakdown ( arg ).forEach ( function ( a ) {
						a = gui.Type.cast ( a );
						if ( this._removechecks ( a, [ handler, this._global ])) {
							if ( !this._hashandlers ()) {
								gui.Broadcast.removeGlobal ( gui.BROADCAST_KEYEVENT, this );
							}	
						}
					}, this );
				}
			})
		),

		/**
		 * Add handlers for global key(s).
		 * @param {object} arg
		 * @param @optional {gui.IKeyListener} handler (defaults to spirit)
		 * @returns {gui.KeyPlugin}
		 */
		addGlobal : function ( arg, handler ) {
			return this._globalize ( function () {
				return this.add ( arg, handler );
			});
		},

		/**
		 * Add handlers for global keys(s).
		 * @param {object} arg
		 * @param @optional {gui.IKeyListener} handler (defaults to spirit)
		 * @returns {gui.KeyPlugin}
		 */
		removeGlobal : function ( arg, handler ) {
			return this._globalize ( function () {
				return this.remove ( arg, handler );
			});
		},

		/**
		 * Handle broadcast.
		 * @param {gui.Broadcast} b
		 */
		onbroadcast : function ( b ) {
			var list, checks, handler, global;
			if ( b.type === gui.BROADCAST_KEYEVENT ) {
				var d = b.data.down, n = b.data.code, c = b.data.char;
				if (( list = ( this._xxx [ n ] || this._xxx [ c ]))) {
					list.forEach ( function ( checks ) {
						handler = checks [ 0 ];
						global = checks [ 1 ];
						if ( global === b.isGlobal ) {
							handler.onkey ( 
								new gui.Key ( d, n, c, global )
							);
						}
					});
				}
			}
		},


		// Private .....................................................................
		
		/**
		 * Remove delegated handlers. 
		 * @TODO same as in gui.ActionPlugin, perhaps superize this stuff somehow...
		 */
		_cleanup : function ( type, checks ) {
			//if ( this._removechecks ( type, checks )) {
				var handler = checks [ 0 ], global = checks [ 1 ];
				if ( global ) {
					this.removeGlobal ( type, handler );
				} else {
					this.remove ( type, handler );
				}
			//}
		}

	}, {}, { // Static ...............................................................

	});

}( gui.Arguments.confirmed, gui.Combo.chained ));


/**
 * Interface KeyHandler
 */
gui.IKeyHandler = {

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object IKeyHandler]";
	},

	/**
	 * Handle key
	 * @param {gui.Key} key
	 */
	onkey : function ( key ) {}
};


/**
 * Keys module.
 * @TODO http://www.w3.org/TR/DOM-Level-3-Events/#events-keyboardevents
 * @TODO http://dev.opera.com/articles/view/functional-key-handling-in-opera-tv-store-applications/
 */
gui.module ( "keys", {

	/*
	 * Plugins (for all spirits).
	 */
	plugins : {
		"key" : gui.KeyPlugin
	},

	/*
	 * Mixins (for all spirits).
	 */
	mixins : {
		/**
		 * Handle key.
		 * @param {gui.Key} key
		 */
		onkey : function ( key ) {}
	},

	/**
	 * Context init.
	 * @param {Window} context
	 */
	oncontextinitialize : function ( context ) {
		this._keymap = Object.create ( null );
		[ "keydown", "keypress", "keyup" ].forEach ( function ( type ) {
			context.document.addEventListener ( type, this, false );
		}, this );
	},

	/**
	 * Handle event.
	 * @param {KeyEvent} e
	 */
	handleEvent : function ( e ) {
		this._modifiers ( e );
		if ( gui.Type.isDefined ( e.repeat )) {
			this._newschool ( e );
		} else {
			this._oldschool ( e );
		}
	},

	/**
	 * DOM2.5 style events blending event keyCode (now legacy) and char (now spec). 
	 * Opera 12 appears to fire keyup repeatedly while key presses, is it correct? 
	 * @param {Event} e
	 */
	_newschool : function ( e ) {
		var c = e.char, n = e.keyCode, b = gui.BROADCAST_KEYEVENT;
		switch ( e.type ) {
			case "keydown" :
				this._keymap [ n ] = c;
				gui.Broadcast.dispatchGlobal ( null, b, {
					down : true,
					char : c,
					code : n
				});
				break;
			case "keyup" :
				delete this._keymap [ n ];
				var that = this;
				setTimeout ( function () {
					if ( !that._keymap [ n ]) {
						console.log ( Math.random ());
						gui.Broadcast.dispatchGlobal ( null, b, {
							down : false,
							char : c,
							code : n
						});
					}
				});
				/*
				gui.Tick.next ( function () {
					if ( !this._keymap [ n ]) {
						console.log ( Math.random ());
						gui.Broadcast.dispatchGlobal ( null, b, {
							down : false,
							char : c,
							code : n
						});
					}
				}, this );
				*/
				break;
		}
	},

	/**
	 * Conan the Barbarian style events.
	 * @param {Event} e
	 */
	_oldschool : function ( e ) {
		var n = e.keyCode, c = this._keymap [ n ], b = gui.BROADCAST_KEYEVENT;
		switch ( e.type ) {
			case "keydown" :			
				if ( c === undefined ) {
					this._keycode = n;
					this._keymap [ n ] = null;
					gui.Tick.next ( function () {
						c = this._keymap [ n ];
						gui.Broadcast.dispatchGlobal ( null, b, {
							down : true,
							char : c,
							code : n
						});
						this._keycode = null;
					}, this );
				}
				break;
			case "keypress" :
				if ( this._keycode ) {
					c = this._keychar ( e.keyCode, e.charCode, e.which );
					this._keymap [ this._keycode ] = c;
				}
				break;
			case "keyup" :
				if ( c !== undefined ) {
					gui.Broadcast.dispatchGlobal ( null, b, {
						down : false,
						char : c,
						code : n
					});
					delete this._keymap [ n ];
				}
				break;
		}
	},


	// Private ......................................................
	
	_keymap : null,

	/**
	 * Update key modifiers state.
	 * @TODO Cross platform abstractions "accelDown" and "accessDown"
	 * @param {KeyEvent} e
	 */
	_modifiers : function ( e ) {
		gui.Key.ctrlDown = e.ctrlKey;
		gui.Key.shiftDown = e.shiftKey;
		gui.Key.altDown = e.altKey;
		gui.Key.metaDown = e.metaKey;
	},

	/**
	 * Get character for event details on keypress only. 
	 * Returns null for special keys such as arrows etc.
	 * http://javascript.info/tutorial/keyboard-events
	 * @param {number} n
	 * @param {number} c
	 * @param {number} which
	 * @return {String}
	 */
	_keychar : function ( n, c, which ) {
		if ( which === null || which === undefined ) {
			return String.fromCharCode ( n ); // IE (below 9 or what?)
	  } else if ( which !== 0 && c ) { // c != 0
	    return String.fromCharCode ( which ); // the rest
	  }
	  return null;
	}

});

( function keybroadcasts () {
	gui.BROADCAST_KEYEVENT = "gui-broadcast-keyevent";
}());


/**
 * Facilitate flexbox-like layouts in IE9 
 * provided a fixed classname structure.
 * @extends {gui.Plugin}
 */
gui.FlexPlugin = gui.Plugin.extend ( "gui.FlexPlugin", {

	/**
	 * Flex this and descendant flexboxes in document order.
	 */
	reflex : function () {
		gui.FlexPlugin.reflex ( this.spirit.element );
	},

	/**
	 * Remove inline (emulated) styles.
	 */
	unflex : function () {
		gui.FlexPlugin.unflex ( this.spirit.element );
	},

	/**
	 * Hejsa med dig.
	 */
	enable : function () {
		gui.FlexPlugin.enable ( this.spirit.element );
	},

	/**
	 * Hejsa med dig.
	 */
	disable : function () {
		gui.FlexPlugin.disable ( this.spirit.element );
	}


}, {}, { // Static ................................................

	/**
	 * Flex this and descendant flexboxes in document order.
	 * @param {Element} elm
	 */
	reflex : function ( elm ) {
		if ( this._emulated ( elm )) {
			this._crawl ( elm, "flex" );
		}
	},

	/**
	 * Remove inline (emulated) styles.
	 * @param {Element} elm
	 * @param @optional {boolean} hotswap Switching from emulated to native?
	 */
	unflex : function ( elm, hotswap ) {
		if ( this._emulated ( elm ) || hotswap ) {
			this._crawl ( elm, "unflex" );
		}
	},

	/**
	 * Hejsa med dig.
	 * @param {Element} elm
	 */
	enable : function ( elm ) {
		this._crawl ( elm, "enable" );
		if ( this._emulated ( elm )) {
			this.reflex ( elm );
		}
	},

	/**
	 * Hejsa med dig.
	 * @param {Element} elm
	 */
	disable : function ( elm ) {
		if ( this._emulated ( elm )) {
			this.unflex ( elm );
		}
		this._crawl ( elm, "disable" );
	},


	// Private static ........................................................

	/**
	 * Element context runs in emulated mode?
	 * @param {Element} elm
	 * @returns {boolean}
	 */
	_emulated : function ( elm ) {
		var doc = elm.ownerDocument;
		var win = doc.defaultView;
		return win.gui.flexmode === gui.FLEXMODE_EMULATED;
	},

	/**
	 * Flex / disable / unflex element and descendants.
	 * @param {Element} elm
	 * @param {String} action
	 */
	_crawl : function ( elm, action ) {
		var disabled = action === "enable";
		if ( this._shouldflex ( elm, disabled )) {
			var boxes = this._getflexboxes ( elm, disabled );
			boxes.forEach ( function ( box ) {
				box [ action ]();
			});
		}
	},

	/**
	 * Element is flexbox or contains flexible stuff?
	 * @param {Element} elm
	 * @returns {boolean}
	 */
	_shouldflex : function ( elm, disabled ) {
		return elm.nodeType === Node.ELEMENT_NODE && 
			this._isflex ( elm, disabled ) || 
			this._hasflex ( elm, disabled ); 
	},

	/**
	 * Element is (potentially disabled) flexbox?
	 * @param {Element} elm
	 * @param {boolean} disabled
	 * @return {boolean}
	 */
	_isflex : function ( elm, disabled ) {
		return [ "flexrow", "flexcol" ].some ( function ( name ) {
			name = name + ( disabled ? "-disabled" : "" );
			return gui.CSSPlugin.contains ( elm, name );
		});
	},

	/**
	 * Element contains flexbox(es)?
	 * @param {Element} elm
	 * @param {boolean} disabled
	 * @return {boolean}
	 */
	_hasflex : function ( elm, disabled ) {
		return [ "flexrow", "flexcol" ].some ( function ( name ) {
			name = name + ( disabled ? "-disabled" : "" );
			return elm.querySelector ( "." + name );
		});
	},

	/**
	 * Collect descendant-and-self flexboxes.
	 * @param @optional {Element} elm
	 * @returns {Array<gui.FlexBox>}
	 */
	_getflexboxes : function ( elm, disabled ) {
		var boxes = [];
		new gui.Crawler ( "flexcrawler" ).descend ( elm, {
			handleElement : function ( elm ) {
				if ( gui.CSSPlugin.compute ( elm, "display" ) !== "none" ) {
					if ( gui.FlexPlugin._isflex ( elm, disabled )) {
						boxes.push ( new gui.FlexBox ( elm ));
					}
				} else {
					return gui.Crawler.SKIP_CHILDREN;
				}
			}
		});
		return boxes;
	}

});


/**
 * Computer for flexbox.
 * @param {Element} elm
 */
gui.FlexBox = function FlexBox ( elm ) {
	this._onconstruct ( elm );
};

gui.FlexBox.prototype = {

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.FlexBox]";
	},

	/**
	 * Flex everything using inline styles.
	 */
	flex : function () {
		this._flexself ();
		this._flexchildren ();
		this._flexcorrect ();
	},

	/**
	 * Remove *all* inline styles from flexbox element.
	 */
	unflex : function () {
		this._element.removeAttribute ( "style" );
		this._children.forEach ( function ( child ) {
			child.unflex ();
		});
	},

	/**
	 * Disable flex (perhaps to fit a mobile screen).
	 */
	disable : function () {
		this._enable ( false );
	},

	/**
	 * Enable flex.
	 */
	enable : function () {
		this._enable ( true );
	},


	// Private ................................................................
	
	/**
	 * Flexbox element.
	 * @type {Element}
	 */
	_element : null,

	/**
	 * Flexed children.
	 * @type {Array<Element>}
	 */
	_children : null,

	/**
	 * Vertical flexbox?
	 * @type {boolean}
	 */
	_flexcol : false,

	/**
	 * Loosen up to contain content.
	 * @type {Boolean}
	 */
	_flexlax : false,

	/**
	 * Constructor.
	 * @param {Element} elm
	 */
	_onconstruct : function ( elm ) {
		this._element = elm;
		this._flexcol = this._hasclass ( "flexcol" );
		this._flexlax = this._hasclass ( "flexlax" );
		this._children = this._collectchildren ( elm );
	},

	/**
	 * Collecting children that are not hidden.
	 * @todo Discompute absolute and floated (vertical) children
	 * @param {Element} elm
	 * @return {Array<gui.FlexChild>}
	 */
	_collectchildren : function ( elm ) {
		return Array.filter ( elm.children, function ( child ) {
			return this._shouldflex ( child );
		}, this ).map ( function ( child ) {
			return new gui.FlexChild ( child );
		});
	},
	
	/**
	 * Flex the container. Tick.next solves an issue with _relaxflex that 
	 * would manifest when going from native to emulated layout (but not 
	 * when starting out in emulated), this setup would better be avoided. 
	 * Note to self: Bug is apparent in demo "colspan-style variable flex"
	 */
	_flexself : function () {
		var elm = this._element;
		if ( this._flexcol && this._flexlax ) {
			this._relaxflex ( elm ); // first time to minimize flashes in FF (does it work?)
			gui.Tick.next(function(){ // second time to setup expected layout
				this._relaxflex ( elm );
			},this);
		}
	},

	/**
	 * Relax flex to determine whether or not to maxheight (own) element.
	 * @param {Element} elm
	 */
	_relaxflex : function ( elm ) {
		var style = elm.style;
		var given = style.height;
		var above = elm.parentNode;
		var avail = above.offsetHeight;
		style.height = "auto";
		if ( elm.offsetHeight < avail ) {
			style.height = given || "100%";
		}
	},

	/**
	 * Flex the children.
	 */
	_flexchildren : function () {
		var flexes = this._childflexes ();
		var factor = this._computefactor ( flexes );
		if ( flexes.length ) {
			var unit = 100 / flexes.reduce ( function ( a, b ) {
				return a + b;
			});
			this._children.forEach ( function ( child, i ) {
				if ( flexes [ i ] > 0 ) {
					var percentage = flexes [ i ] * unit * factor;
					child.setoffset ( percentage, this._flexcol );
				}
			},this);
		}
	},

	/**
	 * Eliminate spacing between inline-block children. Potentially 
	 * adds a classname "_flexcorrect" to apply negative left margin.
	 * @see {gui.FlexCSS}
	 */
	_flexcorrect : function () {
		if ( !this._flexcol ) {
			this._children.forEach ( function ( child, i ) {
				if ( i > 0 ) {
					child.flexcorrect ();
				}
			});
		}
	},

	/**
	 * Collect child flexes. disableed members enter as 0.
	 * @return {Array<number>}
	 */
	_childflexes : function () {
		return this._children.map ( function ( child ) {
			return child.getflex ();
		},this);
	},

	/**
	 * Get modifier for percentage widths 
	 * accounting for fixed width members.
	 * @param {<Array<number>} flexes
	 * @return {number} Between 0 and 1
	 */
	_computefactor : function ( flexes ) {
		var all, cut, factor = 1;
		if ( flexes.indexOf ( 0 ) >-1 ) {
			all = cut = this._getoffset ();
			this._children.forEach ( function ( child, i ) {
				cut -= flexes [ i ] ? 0 : child.getoffset ( this._flexcol );
			}, this );
			factor = cut / all;
		}
		return factor;
	},

	/**
	 * Get width or height of element (depending on flexbox orientation).
	 * @returns {number} Offset in pixels
	 */
	_getoffset : function () {
		var elm = this._element;
		if ( this._flexcol ) {
			return elm.offsetHeight;
		} else {
			return elm.offsetWidth;
		}
	},

	/**
	 * Enable/disable flex classname. Child element flexN classname 
	 * becomes disabled by being scoped to flexrow or flexcol class.
	 * @param {boolean} enable
	 */
	_enable : function ( enable ) {
		var name, next, elm = this._element, css = gui.CSSPlugin;
		[ "flexrow", "flexcol" ].forEach ( function ( klass ) {
			name = enable ? klass + "-disabled" : klass;
			next = enable ? klass : klass + "-disabled";
			if ( css.contains ( elm, name )) {
				css.remove ( elm, name ).add ( elm, next );
			}
		});
	},

	/**
	 * Should child element be fed to computer for emulated mode?
	 * @todo Position absolute might qualify for exclusion...
	 * @param {Element} elm
	 * @returns {boolean}
	 */
	_shouldflex : function ( elm ) {
		return gui.CSSPlugin.compute ( elm, "display" ) !== "none";
	},

	/**
	 * Has classname?
	 * @param {String} name
	 * @returns {String}
	 */
	_hasclass : function ( name ) {
		return gui.CSSPlugin.contains ( this._element, name );
	}
};


/**
 * Computer for flexbox child.
 * @param {Element} elm
 */
gui.FlexChild = function FlexChild ( elm ) {
	this._element = elm;
};

gui.FlexChild.prototype = {

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.FlexChild]";
	},

	/**
	 * Get flex value for element. We use the flexN classname to markup this.
	 * @returns {number}
	 */
	getflex : function () {
		var flex = 0;
		this._element.className.split ( " ").forEach ( function ( name ) {
			if ( gui.FlexChild._FLEXNAME.test ( name )) {
				flex = ( gui.FlexChild._FLEXRATE.exec ( name ) || 1 );
			}
		});
		return gui.Type.cast ( flex );
	},

	/**
	 * Get width or height of element depending on flexbox orientation.
	 * @param {boolean} vertical
	 * @returns {number} Offset in pixels
	 */
	getoffset : function ( vertical ) {
		var elm = this._element;
		if ( vertical ) {
			return elm.offsetHeight;
		} else {
			return elm.offsetWidth;
		}
	},

	/**
	 * Set percentage width|height of element.
	 * @param {number} pct
	 * @param {boolean} vertical
	 */
	setoffset : function ( pct, vertical ) {
		var prop = vertical ? "height" : "width";
		this._element.style [ prop ] = pct + "%";
	},

	/**
	 * Remove *all* inline styles from flexchild element.
	 */
	unflex : function () {
		this._element.removeAttribute ( "style" );
	},

	/**
	 * Potentially adds a classname "_flexcorrect" to apply negative left margin. 
	 * @todo Measure computed font-size and correlate to negative margin value.
	 */
	flexcorrect : function () {
		var elm = this._element;
		if ( elm.previousSibling.nodeType === Node.TEXT_NODE ) {
			gui.CSSPlugin.add ( elm, gui.FlexChild._FLEXCORRECT );
		}
	},

	// Private .........................................................
		
	/**
	 * Flexchild element.
	 * @type {Element}
	 */
	_element : null,

	_enable : function ( enable ) {
		var name, next, elm = this._element, css = gui.CSSPlugin;
		this._element.className.split ( " ").forEach ( function ( klass ) {
			name = enable ? klass + "-disabled" : klass;
			next = enable ? klass : klass + "-disabled";
			if ( gui.FlexChild._FLEXNAME.test ( klass )) {	
				if ( css.contains ( elm, name )) {
					css.remove ( elm, name ).add ( elm, next );
				}
			}
		});
	}

};


// Static ............................................................

/**
 * Classname applies negative left margin to counter 
 * horizontal spacing on inline-block elements.
 * @type {String}
 */
gui.FlexChild._FLEXCORRECT = "_flexcorrect";

/**
 * Check for flexN classname.
 * @type {RegExp}
 */
gui.FlexChild._FLEXNAME = /^flex\d*$/;

/**
 * Extract N from classname (eg .flex23).
 * @type {RegExp}
 */
gui.FlexChild._FLEXRATE = /\d/;


/**
 * CSS injection manager.
 */
gui.FlexCSS = {

	/**
	 * Inject styles on startup? Set this to false if you 
	 * prefer to manage these things in a real stylesheet: 
	 * <meta name="gui.FlexCSS.injected" content="false"/>
	 * @type {boolean}
	 */
	injected : true,

	/**
	 * Generating 10 unique classnames for native flex only. 
	 * Emulated flex JS-reads all values from class attribute.
	 * @type {number}
	 */
	maxflex : 10,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.FlexCSS]";
	},

	/**
	 * Inject stylesheet in context. For debugging purposes 
	 * we support a setup to dynamically switch the flexmode. 
	 * @param {Window} context
	 * @param {String} mode
	 */
	load : function ( context, mode ) {
		if ( this.injected ) {
			var sheets = this._getsheets ( context.gui.signature );
			if ( sheets && sheets.mode ) {
				sheets [ sheets.mode ].disable ();
			}
			if ( sheets && sheets [ mode ]) {
				sheets [ mode ].enable ();
			} else {
				var doc = context.document, ruleset = this [ mode ];
				var css = sheets [ mode ] = gui.StyleSheetSpirit.summon ( doc, null, ruleset );
				doc.querySelector ( "head" ).appendChild ( css.element );
			}
			sheets.mode = mode;
			context.gui.flexloaded = true;
		}
	},

	/**
	 * Don't reference dead spirits.
	 * @param {Window} context
	 */
	unload : function ( context ) {
		delete this._sheets [ context.gui.signature ];
	},


	// Private .......................................................................
	
	/**
	 * Elaborate setup to track stylesheets injected into windows. 
	 * This allows us to flip the flexmode for debugging purposes. 
	 * It is only relevant for multi-window setup; we may nuke it.
	 * @type {Map<String,object>}
	 */
	_sheets : Object.create ( null ),

	/**
	 * Get stylesheet configuration for window.
	 * @param {String} sig
	 * @returns {object}
	 */
	_getsheets : function ( sig ) {
		var sheets = this._sheets;
		if ( !sheets [ sig ]) {
			sheets [ sig ] = { 
				"emulated" : null, // {gui.StyleSheetSpirit}
				"native" : null, // {gui.StyleSheetSpirit}
				"mode" : null // {String}
			};
		}
		return sheets [ sig ];
	}
};

/**
 * Emulated ruleset.
 * @todo Attempt all this using floats instead of inline-block and table layouts.
 */
gui.FlexCSS.emulated =  {
	".flexrow, .flexcol" : {
		"display" : "block",
		"width" : "100%",
		"height" : "100%"
	},
	".flexrow > *" : {
		"display" : "inline-block",
		"vertical-align" : "top",
		"height" : "100%"
	},
	".flexrow > ._flexcorrect" : {
		"margin-left" : "-4px !important" // @todo Correlate this to computed font-size :)
	},
	"flexcol > *" : {
		"display" : "block",
		"width" : "100%"
	},
	".flexlax > .flexrow" : {
		"display" : "table"
	},
	".flexlax > .flexrow > *" : {
		"display" : "table-cell"
	}
};

/**
 * Native ruleset. Engine can't parse [*=xxxxx] selector (says DOM 
 * exception), so let's just create one billion unique classnames.
 */
gui.FlexCSS [ "native" ] = ( function () {
	var rules = {
		".flexrow, .flexcol" : {
			"display": "-beta-flex",
			"-beta-flex-wrap" : "nowrap"
		},
		".flexcol" : {
			"-beta-flex-direction" : "column",
			"min-height" : "100%"
		},
		".flexrow" : {
			"-beta-flex-direction" : "row",
			"min-width": "100%"
		},
		".flexrow:not(.flexlax) > *, .flexcol:not(.flexlax) > *" : {
				"-beta-flex-basis" : 1
		},
		".flexrow > .flexrow" : {
			"min-width" : "auto"
		}
	};
	function declare ( n ) {
		rules [ ".flexrow > .flex" + n + ", .flexcol > .flex" + n ] = {
			"-beta-flex-grow" : n || 1
		};
		rules [ ".flexrow:not(.flexlax) > .flex" + n ] = {
			"width" : "0"
		};
		rules [ ".flexcol:not(.flexlax) > .flex" + n ] = {
			"height" : "0"
		};
		
	}
	var n = -1, max = gui.FlexCSS.maxflex;
	while ( ++n <= max ) {
		declare ( n || "" );
	}
	return rules;
}());


/**
 * Properties and methods to be mixed into the context-local {gui.Spiritual} instance. 
 * @using {gui.Property#nonenumerable}
 */
gui.FlexMode = ( function using ( nonenumerable ) {

	return {
		
		/**
		 * Flipped on CSS injected.
		 * @type {boolean}
		 */
		flexloaded : nonenumerable ({
			value : false
		}),

		/**
		 * Flexmode accessor. Note that flexmode exposes as either native or emulated (never optimized).
		 * Note to self: enumerable false is to prevent portalling since this would portal the flexmode.
		 */
		flexmode : nonenumerable ({
			get : function () { 
				var best = gui.Client.hasFlexBox ? gui.FLEXMODE_NATIVE : gui.FLEXMODE_EMULATED;
				return this._flexmode === gui.FLEXMODE_OPTIMIZED ? best : this._flexmode;
			},
			set : function ( next ) { // supports hotswapping for debugging
				this._flexmode = next;
				var best = gui.Client.hasFlexBox ? gui.FLEXMODE_NATIVE : gui.FLEXMODE_EMULATED;
				var mode = next === gui.FLEXMODE_OPTIMIZED ? best : next;
				gui.FlexCSS.load ( this.window, mode );
				if ( this.document.documentElement.spirit ) { // @todo life cycle markers for gui.Spiritual
					switch ( mode ) {
						case gui.FLEXMODE_EMULATED :
							this.reflex ();
							break;
						case gui.FLEXMODE_NATIVE :
							this.unflex ();
							break;
					}
				}
			}
		}),

		/**
		 * Flex everything.
		 */
		reflex : nonenumerable ({
			value : function ( elm ) {
				if ( this.flexmode === this.FLEXMODE_EMULATED ) {
					gui.FlexPlugin.reflex ( elm || this.document.body );
				}
			}
		}),
		
		/**
		 * Remove flex (removes all inline styling on flexbox elements).
		 */
		unflex : nonenumerable ({
			value : function ( elm ) {
				gui.FlexPlugin.unflex ( elm || this.document.body, true );
			}
		})
	};

}( gui.Property.nonenumerable ));


gui.FLEXMODE_NATIVE = "native";
gui.FLEXMODE_EMULATED = "emulated";
gui.FLEXMODE_OPTIMIZED = "optimized",

/**
 * Provides a subset of flexible boxes that works in IE9 
 * as long as flex is implemented using a predefined set 
 * of classnames: flexrow, flexcol and flexN where N is 
 * a number to indicate the flexiness of child elements.
 * @todo Reflex on window resize...
 * @see {gui.FlexCSS}
 */
gui.module ( "flex", {

	/** 
	 * Setup gui.FlexPlugin for all spirits. Spirits may 
	 * update subtree flex by using `this.flex.reflex()`
	 */
	plugins : {
		flex : gui.FlexPlugin
	},

	/**
	 * Setup flex control on the local "gui" object. Note that we  assign non-enumerable properties 
	 * to prevent the setup from being portalled into subframes (when running a multi-frame setup).
	 * @param {Window} context
	 */
	oncontextinitialize : function ( context ) {
		context.gui._flexmode = gui.FLEXMODE_OPTIMIZED;
		context.Object.defineProperties ( context.gui, gui.FlexMode );
		this._edbsetup ( context );
	},

	/**
	 * Inject the relevant stylesheet (native or emulated) before startup spiritualization.
	 * @todo Make sure stylesheet onload has fired to prevent flash of unflexed content?
	 * @param {Window} context
	 */
	onbeforespiritualize : function ( context ) {
		if ( !context.gui.flexloaded ) { // @see {gui.FlexCSS}
			gui.FlexCSS.load ( context, context.gui.flexmode );
		}
	},

	/**
	 * Flex everything on startup and resize. 
	 * @TODO put broadcast into if statement
	 * @param {Window} context
	 */
	onafterspiritualize : function ( context ) {
		if ( context.gui.flexmode === gui.FLEXMODE_EMULATED ) {
			context.gui.reflex ();
		}
		gui.Broadcast.addGlobal ( gui.BROADCAST_RESIZE_END, {
			onbroadcast : function () {
				if ( context.gui.flexmode === gui.FLEXMODE_EMULATED )	{
					context.gui.reflex ();
				}
			}
		});
	},

	/**
	 * Cleanup on window unload.
	 * @param {Window} context
	 */
	oncontextunload : function ( context ) {
		gui.FlexCSS.unload ( context );
	},


	// Private ...................................................
	 
	/*
	 * Bake reflex into EDBML updates to catch flex related attribute updates etc. 
	 * (by default we only reflex whenever DOM elements get inserted or removed)
	 * @todo Suspend default flex to only flex once
	 */
	_edbsetup : function ( context ) {
		if ( context.gui.hasModule ( "edb" )) {
			var script = context.edb.ScriptPlugin.prototype;
			gui.Function.decorateAfter ( script, "write", function () {
				if ( this.spirit.window.gui.flexmode === gui.FLEXMODE_EMULATED ) {
					this.spirit.flex.reflex ();
				}
			});
		}
	}
	
});

/**
 * Manage emulated flex whenever DOM elements get added and removed.
 * Mixing into 'gui.Guide._spiritualize' and 'gui.Guide._materialize'
 * @todo Both of these methods should be made public we presume...
 * @using {gui.Guide}
 */
( function decorate ( guide ) {

	/*
	 * Flex subtree starting from the parent node of given node.
	 * @param {Node} node
	 */
	function flexparent ( node ) {
		var doc = node.ownerDocument;
		var win = doc.defaultView;
		if ( win.gui.flexmode === gui.FLEXMODE_EMULATED ) {
			if ( gui.DOMPlugin.embedded ( node )) {
				node = node === doc.documentElement ? node : node.parentNode;
				gui.Tick.next ( function () {
					gui.FlexPlugin.reflex ( node );
				});
			}
		}
	}

	[ "_spiritualize", "_materialize" ].forEach ( function ( method ) {
		gui.Function.decorateAfter ( guide, method, flexparent );
	});

}( gui.Guide ));