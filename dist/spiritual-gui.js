/**
 * Spiritual GUI
 * 2013 Wunderbyte
 * Spiritual is freely distributable under the MIT license.
 */
( function ( window ) {

"use strict";


/**
 * Top namespace object for everything Spiritual. On startup, the global variable `gui` gets 
 * redefined to an instance of {gui.Spiritual}. All these constants get copied in the process.
 */
window.gui = {

	/**
	 * @TODO comment on 'gui.Namespace' goes here.
	 * @type {boolean}
	 */
	portals : true,

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
	 * The {gui.IframeSpirit} will stamp this querystring parameter into any URL it loads. 
	 * The value of the parameter matches the iframespirits '$contextid'. Value becomes the 
	 * '$contextid' of the local 'gui' object (a {gui.Spiritual} instance). This establishes 
	 * a relation between iframe and hosted document that can be used for xdomain stuff. 
	 * @type {String}
	 */
	PARAM_CONTEXTID : "gui-contextid",
	PARAM_XHOST : "gui-xhost",

	/**
	 * Global broadcasts
	 * @TODO harmonize some naming with action types
	 */
	BROADCAST_KICKSTART : "gui-broadcast-kickstart",
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
	BROADCAST_ORIENTATIONCHANGE : "gui-broadcast-orientationchange",
	BROADCAST_LOADING_CHANNELS : "gui-broadcast-loading-channels",
	BROADCAST_CHANNELS_LOADED : "gui-broadcast-channels-loaded",
	BROADCAST_TWEEN : "gui-broadcast-tween",
	BROADCAST_WILL_UNLOAD : "gui-broadcast-will-unload",
	BROADCAST_UNLOAD : "gui-broadcast-unload",

	/** 
	 * Plugin broadcast types that should leave core.
	 */
	BROADCAST_ATTENTION_ENTER : "gui-broadcast-attention-enter",
	BROADCAST_ATTENTION_EXIT : "gui-broadcast-attention-exit",
	BROADCAST_ATTENTION_MOVE : "gui-broadcast-attention-move",
	
	/** 
	 * Global actions
	 */
	ACTION_DOC_ONCONSTRUCT : "gui-action-document-construct",
	ACTION_DOC_ONDOMCONTENT : "gui-action-document-domcontent",
	ACTION_DOC_ONLOAD : "gui-action-document-onload",
	ACTION_DOC_ONSPIRITUALIZED : "gui-action-document-spiritualized",
	ACTION_DOC_UNLOAD : "gui-action-document-unload",
	ACTION_DOC_FIT : "gui-action-document-fit",

	/**
	 * Framework internal actions of little use.
	 */
	$ACTION_XFRAME_VISIBILITY : "gui-action-xframe-visibility",

	/**
	 * Local actions.
	 */
	ACTION_WINDOW_LOADING : "gui-action-window-loading",
	ACTION_WINDOW_LOADED : "gui-action-window-loaded",

	/**
	 * Lifecycle types (all spirits)
	 * @TODO: add _ON* to all these
	 */
	LIFE_CONSTRUCT : "gui-life-construct",
	LIFE_CONFIGURE : "gui-life-configure",
	LIFE_ENTER : "gui-life-enter",
	LIFE_ATTACH : "gui-life-attach",
	LIFE_READY : "gui-life-ready",
	LIFE_DETACH : "gui-life-detach",
	LIFE_EXIT : "gui-life-exit",
	LIFE_ASYNC : "gui-life-async",
	LIFE_DESTRUCT : "life-destruct",
	LIFE_VISIBLE : "life-visible",
	LIFE_INVISIBLE : "life-invisible",

	/**
	 * Lifecycle types (some spirits)
	 */
	LIFE_IFRAME_CONSTRUCT : "gui-life-iframe-construct",
	LIFE_IFRAME_DOMCONTENT : "gui-life-iframe-domcontent",
	LIFE_IFRAME_ONLOAD : "gui-life-iframe-construct",
	LIFE_IFRAME_SPIRITUALIZED : "gui-life-iframe-spiritualized",
	LIFE_IFRAME_UNLOAD : "gui-life-iframe-unload",

	/**
	 * Tick types (timed events)
	 */
	TICK_DOC_FIT : "gui-tick-document-fit", // @TODO: this in DocumentSpirit
	$TICK_INSIDE : "gui-tick-spirits-inside",
	$TICK_OUTSIDE : "gui-tick-spirits-outside",

	/**
	 * Crawler types
	 */
	CRAWLER_SPIRITUALIZE : "gui-crawler-spiritualize",
	CRAWLER_MATERIALIZE : "gui-crawler-materialize",
	CRAWLER_DETACH : "gui-crawler-detach",
	CRAWLER_DISPOSE : "gui-crawler-dispose", // ??????
	CRAWLER_ACTION : "gui-crawler-action",
	CRAWLER_VISIBLE : "gui-crawler-visible",
	CRAWLER_INVISIBLE : "gui-crawler-invisible",
	CRAWLER_DOMPATCHER : "gui-crawler-webkit-dompatcher",

	/** 
	 * CSS classnames (underscore is to indicate that the classname are managed by JS)
	 */
	CLASS_INVISIBLE : "_gui-invisible",
	CLASS_HIDDEN : "_gui-hidden",
	CLASS_COVER : "_gui-cover",

	/**
	 * Timeout in milliseconds before we decide that user is finished resizing the window.
	 */
	TIMEOUT_RESIZE_END : 250,

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

		/*
		 * @TODO: what is "location" supposed to mean?
		 */
		this.location = this.href.split ( "#" )[ 0 ];
		this.external = this.location !== String ( doc.location ).split ( "#" )[ 0 ];
		/*
		var parts = this.href.split ( "/" );
		parts.pop();
		parts.push("");
		this.pathbase = parts.join ( "/" );
		*/
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
	id : null,	// test,
	external : false, // external relative to the *document*, not the server host!!! (rename "outbound" to clear this up?)
	toString : function () { // behave somewhat like window.location ....
		return this.href;
	}
};


// Statics ..............................................................................................

/**
 * Convert relative path to absolute path in context of base where base is a document or an absolute path.
 * @see http://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
 * @param {String|Document} base
 * @param {String} href
 * @returns {String}
 */
gui.URL.absolute = function ( base, href ) { // return /(^data:)|(^http[s]?:)|(^\/)/.test(inUrl);
	href = href || "";
	if ( base.nodeType === Node.DOCUMENT_NODE ) {
		return new gui.URL ( base, href ).href;
	} else if ( typeof base === "string" ) {
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
 * Is URL external to document (as in external host)?
 * @TODO: fix IE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * @param {String} url
 * @param {Document} doc
 * @returns {boolean}
 */
gui.URL.external = function ( src, doc ) {
	doc = doc || document;
	var url = new gui.URL ( doc, src );
	if ( gui.Client.isExplorer9 ) {
		if(gui.debug){
			console.log ( "TODO: Fix hardcoded assesment of external URL in IE9 (always false): " + src );
		}
		return false;
	} else {
		return url.host !== doc.location.host;
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
 * Format URL with hashmap key-values as querystring parameters.
 * @param {String} baseurl
 * param @optional {Map<String,String|number|boolean|Array>} params
 * @returns {String}
 */
gui.URL.parametrize = function ( baseurl, params ) {
	if ( gui.Type.isObject ( params )) {
		gui.Object.each ( params, function ( key, value ) {
			baseurl += baseurl.contains ( "?" ) ? "&" : "?";
			switch ( gui.Type.of ( value )) {
				case "array" :
					baseurl += value.map ( function ( member ) {
						return key + "=" + String ( member );
					}).join ( "&" );
					break;
				default :
					baseurl += key + "=" + String ( value );
					break;	
			}
		});
	}
	return baseurl;
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
 * @TODO https://github.com/websanova/js-url
 * @TODO https://github.com/allmarkedup/purl
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
		/*
		this._extend ( win.Array.prototype, {
			remove : function remove ( from, to ) { 
				console.error ( "Array.prototype.remove is deprecated. Use gui.Array.remove(array,from,to);" );
				return gui.Array.remove ( this, from, to ); // (gui.Array not parsed yet) 
			}
		});
		*/
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
	 * The constructor {gui.Spiritual} does not exist after first instance gets declared, 
	 * but we may keep something newable allocated by referencing it around here.
	 * @type {function}
	 */
	constructor: gui.Spiritual,

	/**
	 * Uniquely identifies this instance of `gui.Spiritual` 
	 * knowing that other instances may exist in iframes.
	 * @type {String}
	 */
	$contextid : null,

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
	 * Automatically run on DOMContentLoaded? 
	 * If set to false, run using kickstart().
	 * @TODO: rename this to something
	 * @type {boolean}
	 */
	autostart : true,

	/**
	 * Running inside an iframe?
	 * @type {boolean}
	 */
	hosted : false,

	/**
	 * This instance was portalled into this context by a {gui.Spiritul} instance in the hosting iframe?
	 * If true, members of the 'gui' namespace (spirits) might have been loaded in an ancestor context.
	 * @see {gui.Spiritual#_portal}
	 * @type {Boolean}
	 */
	portalled : false,

	/**
	 * Cross domain origin of containing iframe if:
	 *
	 * 1. We are loaded inside a {gui.IframeSpirit}
	 * 2. Containing document is on an external host
	 * @type {String} eg. `http://parenthost.com:8888`
	 */
	xhost : null,

	/**
	 * Flipped by the {gui.Guide} after initial spiritualization (on DOMContentLoaded).
	 * @type {boolean}
	 */
	spiritualized : false,

	/**
	 * Magic attributes to trigger spirit association and configuration. 
	 * By default we support "gui" but you may prefer to use "data-gui".
	 */
	attributes : [ "gui" ], // @TODO: move from proto to constructor?

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
	start : function () {
		this._gone = true;
		switch ( this.mode ) {
			case gui.MODE_NATIVE :
			case gui.MODE_JQUERY :
			case gui.MODE_OPTIMIZE :
			case gui.MODE_MANAGED :
				gui.DOMChanger.change ( this.context );
				break;
		}
		this._experimental ();
		gui.Tick.add ([ gui.$TICK_INSIDE, gui.$TICK_OUTSIDE ], this, this.$contextid );
		if ( this._configs !== null ) {
			this._configs.forEach ( function ( config ) {
				this.channel ( config.select, config.klass );
			}, this );
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
	 * Get spirit for argument.
	 * @TODO argument expected to be an `$instanceid` for now.
	 * @TODO fuzzy resolver to accept elements and queryselectors
	 * @param {String|Element} arg
	 * @returns {gui.Spirit}
	 */
	get : function ( arg ) {
		var spirit = null;
		switch ( gui.Type.of ( arg )) {
			case "string" :
				if ( gui.KeyMaster.isKey ( arg )) {
					spirit = this._spirits.inside [ arg ] || null;
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
	 * @param {function|String} klass Constructor or name
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
	 * Hello.
	 */
	channelModule : function ( channels ) {
		var spirit;
		channels = channels.map ( function ( channel ) {
			var query = channel [ 0 ];
			var klass = channel [ 1 ];
			if ( typeof klass === "string" ) {
				spirit = gui.Object.lookup ( klass, this.context );
			} else {
				spirit = klass;
			}
			return [ query, spirit ];
		}, this );
		this._channels = channels.concat ( this._channels );
	},

	/**
	 * Portal Spiritual to a parallel window in three easy steps.
	 * 
	 * 1. Create a local instance of `gui.Spiritual` (this class) and assign it to the global variable `gui` in remote window.
	 * 2. For all members of local `gui`, stamp a reference onto remote `gui`. In remote window, the variable `gui.Spirit` now points to a class declared in this window.
	 * 3. Setup {gui.Guide} to manage spirits when the document loads.
	 *
	 * Members of the `gui` namespace can be setup not to portal by setting the static boolean `portals=false` on the constructor.
	 * @param {Window} sub An external window.
	 */
	portal : function ( sub ) {
		if ( sub !== this.context ) {
			// create remote gui object then portal gui namespaces and members.
			var subgui = sub.gui = new ( this.constructor )( sub );
			var indexes = [];
			// mark as portalled
			subgui.portalled = true;
			/*
			subgui._spaces = [];
			this._spaces.forEach ( function ( ns ) {
				var members = gui.Object.lookup ( ns, this.context );
				if ( members.portals ) {
					try {
						this.namespace ( ns, members, sub );
					} catch ( x ) {
						alert ( x );
					}
				}
			}, this );
			*/
			// portal gui members + custom namespaces and members.
			subgui._spaces = this._spaces.filter ( function ( ns ) {
				var nso = gui.Object.lookup ( ns, this.context );
				return nso.portals;
			}, this );
			this._spaces.forEach ( function ( ns ) {
				var namespace = this.window [ ns ]; // @TODO: formalize something...
				if ( namespace.portals ) {
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
				}
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
	 * Declare namespace in given context. Optionally add members to the namespace.
	 * @param {String} ns
	 * @param {Map<String,object>} members
	 * @param @optional {Window} context
	 * @returns {gui.Namespace}
	 */
	namespace : function ( ns, members, context ) {
		context = context || this.context;
		var no, spaces = context.gui._spaces;
		if ( gui.Type.isString ( ns )) {
			if ( spaces.indexOf ( ns ) >-1 ) {
				ns = gui.Object.lookup ( ns, context );
			} else {
				spaces.push ( ns );
				no = new gui.Namespace ( ns, context );
				ns = gui.Object.assert ( ns, no, context );
			}
		} else {
			throw new TypeError ( "Expected a namespace string" );
		}
		return gui.Object.extend ( ns, members || {});
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
	evaluate : function ( elm ) {
		var res = null;
		if ( elm.nodeType === Node.ELEMENT_NODE ) {
			var doc = elm.ownerDocument;
			var win = doc.defaultView;
			if ( win.gui.attributes.every ( function ( fix ) {
				res = this._evaluateinline ( elm, win, fix );
				return res === null;
			}, this )) {
				win.gui._channels.every ( function ( def ) {
					var select = def [ 0 ];
					var spirit = def [ 1 ];
					if ( gui.CSSPlugin.matches ( elm, select )) {
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
		console.log ( out + "\n\n" );
	},

	/**
	 * Stop tracking the spirit.
	 * @param {gui.Spirit} spirit
	 */
	destruct : function ( spirit ) {
		var all = this._spirits;
		var key = spirit.$instanceid;
		delete all.inside [ key ];
		delete all.outside [ key ];
		this._jensen ( spirit );
	},
	
	
	// Internal .................................................................

	/**
	 * Register spirit inside a main document. 
	 * Evaluate new arrivals after 4 millisec.
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
			all.incoming.push ( spirit );
			gui.Tick.dispatch ( gui.$TICK_INSIDE, 4, this.$contextid );
		}
	},

	/**
	 * Register spirit outside document. This schedules the spirit 
	 * for destruction unless reinserted somewhere else (and soon).
	 * @TODO move? rename?
	 * @param {gui.Spirit} spirit
	 */
	outside : function ( spirit ) {
		var all = this._spirits;
		var key = spirit.$instanceid;
		if ( !all.outside [ key ]) {
			if ( all.inside [ key ]) {
				delete all.inside [ key ];
				this._jensen ( spirit );
			}
			all.outside [ key ] = spirit;
			gui.Tick.dispatch ( gui.$TICK_OUTSIDE, 0, this.$contextid ); // @TODO use 4 ms???
		}
	},

	_jensen : function ( spirit ) {
		var incoming = this._spirits.incoming;
		if ( incoming.length ) {
			var i = incoming.indexOf ( spirit );
			if ( i > -1 ) {
				gui.Array.remove ( incoming, i );
			}
		}
	},

	/**
	 * Handle tick.
	 * @param {gui.Tick} tick
	 */
	ontick : function ( tick ) {
		var spirits;
		switch ( tick.type ) {
			case gui.$TICK_INSIDE :
				gui.Guide.$goasync ( this._spirits.incoming );
				this._spirits.incoming = [];
				break;
			case gui.$TICK_OUTSIDE :
				spirits = gui.Object.each ( this._spirits.outside, function ( key, spirit ) {
					return spirit;
				});
				spirits.forEach ( function ( spirit ) {
					gui.Spirit.$exit ( spirit );
				});
				spirits.forEach ( function ( spirit ) {
					gui.Spirit.$destruct ( spirit );
				});
				spirits.forEach ( function ( spirit ) {
					gui.Spirit.$dispose ( spirit );
				});
				this._spirits.outside = Object.create ( null );
				break;
		}
	},

	/**
	 * Invoked by the {gui.Guide} on window.unload (synchronized as final event).
	 * @TODO figure out of any of this manual garbage dumping works.
	 * @TODO naming clash with method "destruct"
	 * @TODO Think of more stuff to cleanup here...
	 */
	nameDestructAlreadyUsed : function () {
		gui.Tick.remove ( gui.$TICK_OUTSIDE, this, this.$contextid );
		/*
		gui.Object.each ( this._spirits.inside, function ( id, spirit ) {
			gui.GreatSpirit.$meet ( spirit );
		});
		*/
		[ 
			"_spiritualaid", 
			"context", // window ?
			"document", 
			"_channels", 
			"_inlines",
			"_spaces", 
			"_modules", 
			"_spirits" 
		].forEach ( function ( thing ) {
			this [ thing ] = null;
		}, this );
	},

	/**
	 * @TODO: Perhaps do this some day...
	 *
	$cleanup : function () {
		gui.Tick.remove ([ gui.$TICK_INSIDE, gui.$TICK_OUTSIDE ], this, this.$contextid );
		gui.GreatSpirit.$nukeallofit ( this, this.window );
	},
	*/
	

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
		// basic setup
		this.context = context;
		this.window = context.document ? context : null;
		this.document = context.document || null;
		this.hosted = this.window && this.window !== this.window.parent;
		this._inlines = Object.create ( null );
		this._modules = Object.create ( null );
		this._arrivals = Object.create ( null );
		this._channels = [];
		this._spaces = [ "gui" ];
		this._spirits = {
			incoming : [], // spirits just entered the DOM (some milliseconds ago)
			inside : Object.create ( null ), // spirits positioned in page DOM ("entered" and "attached")
			outside : Object.create ( null ) // spirits removed from page DOM (currently "detached")
		};

		// magic properties may be found in querystring parameters
		// @tODO not in sandbox!
		this._params ( this.document.location.href );
	},

	/**
	 * Test for spirit assigned using HTML inline attribute.
	 * Special test for "[" accounts for {gui.Spirit#$debug}
	 * @param {Element} elm
	 * @param {Window} win
	 * @param {String} fix
	 * @returns {function} Spirit constructor
	 */
	_evaluateinline : function ( elm, win, fix ) {
		var res = null;
		var att = elm.getAttribute ( fix );
		if ( gui.Type.isString ( att ) && !att.startsWith ( "[" )) {
			if ( att !== "" ) {
				res = win.gui._inlines [ att ];
				if ( !gui.Type.isDefined ( res )) {
					res = gui.Object.lookup ( att, win );
				}
				if ( res ) {
					win.gui._inlines [ att ] = res;
				} else {
					console.error ( att + " is not defined." );
				}
			} else {
				res = false; // strange return value implies no spirit for empty string
			}
		}
		return res;
	},

	/**
	 * Resolve potential "gui-xhost" querystring parameter. This provides  a $contextid and a 
	 * hostname to facilitate cross domain messaging. The $contextid equals the $instanceid of 
	 * containing {gui.IframeSpirit}. If not present, we generate a random $contextid.
	 * @param {String} url
	 */
	_params : function ( url ) {
		var id, xhost, param = gui.PARAM_CONTEXTID;
		if ( url.contains ( param )) {
			var splits = gui.URL.getParam ( url, param ).split ( "/" );
			id = splits.pop ();
			xhost = splits.join ( "/" );
		} else {
			id = gui.KeyMaster.generateKey ();
			xhost = null;
		}
		this.$contextid = id;
		this.xhost = xhost;
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
				case "$contextid" :
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


	// Work in progress .............................................................

	/**
	 * @TODO action required. This methoud would enable the mutation 
	 * observer. We should remove this whole thing from Spiritual core.
	 */
	_movethismethod : function () {
		if ( this.mode === gui.MODE_JQUERY ) {
			gui.Tick.next ( function () {  // @TODO somehow not conflict with http://stackoverflow.com/questions/11406515/domnodeinserted-behaves-weird-when-performing-dom-manipulation-on-body
				gui.Observer.observe ( this.context ); // @idea move all of _step2 to next stack?
			}, this );
		} else {
			gui.Observer.observe ( this.context );
		}
	},

	/**
	 * Experimental.
	 */
	_experimental : function () {
		this._spaces.forEach ( function ( ns ) {
			this._questionable ( gui.Object.lookup ( ns, this.window ), ns );
		}, this );
	},

	/**
	 * Questionable.
	 */
	_questionable : function ( home, name ) {
		var key;
		var val;
		for ( key in home ) {
			if ( !home.hasOwnProperty || home.hasOwnProperty ( key )) {
				if ( key !== "$superclass" ) {
					val = home [ key ];
					switch ( gui.Type.of ( val )) {
						case "function" :
							if ( val.$classid ) {
								if ( val.$classname === gui.Class.ANONYMOUS ) {
									val.$classname = name + "." + key;
									this._questionable ( val, name + "." + key );
								}
							}
							break;
						case "object" :
							// questionable?
							break;
					}
				}
			}
		}
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
 * Working with objects.
 */
gui.Object = {

	/**
	 * Object.create with default property descriptors. 
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
		if ( gui.Type.isObject ( source )) {
			Object.keys ( source ).forEach ( function ( key ) {
				if ( !loose || !gui.Type.isDefined ( target [ key ])) {
					var desc = Object.getOwnPropertyDescriptor ( source, key );
					Object.defineProperty ( target, key, desc );
				}
			});
		} else {
			throw new TypeError ( "Expected an object, got " + gui.Type.of ( source ));
		}
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
   * @TODO There's an 'Object.mixin' thing now...
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
			parts.every ( function ( part ) {
				struct = struct [ part ];
				return gui.Type.isDefined ( struct );
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
		return value;
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
	 * List names of invocable methods *excluding* prototype stuff.
	 * @return {Array<String>}
	 */
	ownmethods : function ( object ) {
		return Object.keys ( object ).filter ( function ( key ) {
			return gui.Type.isMethod ( object [ key ]);
		}).map ( function ( key ) {
			return key;
		});
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
	 * Bind the "this" keyword for all public instance methods. 
	 * Stuff descending from the prototype chain is ignored. 
	 * @TODO does this belong here?
	 * @param {object} object
	 * @returns {object}
	 */
	bindall : function ( object ) {
		gui.Object.ownmethods ( object ).filter ( function ( name ) {
			return name [ 0 ] !== "_";
		}).forEach ( function ( name ) {
			object [ name ] = object [ name ].bind ( object );
		});
		return object;
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
					// @TODO: investigate all round usefulness of [].slice.call ( object )
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
		return this.isFunction ( what ) && Object.keys ( what.prototype ).length;
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
 * @TODO can we do a "isError" here?
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
 * Bind the "this" keyword for all methods. 
 */
gui.Object.bindall ( gui.Type );


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
 * Experimental namespace concept.
 * @param {Window|WorkerScope}
 * @param {String} ns
 * @param {Object} defs
 */
gui.Namespace = function Namespace ( ns, context ) {
	//gui.Namespace.validate ( context, ns, this );
	//gui.Object.extend ( this, defs );
	this.$context = context;
	this.$ns = ns;
};

gui.Namespace.prototype = {

	/**
	 * Members may be portalled into subframes via the 'gui.portal' method?
	 * @type {boolean}
	 */
	portals : false,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[namespace " + this.$ns + "]";
	},


	// Secrets .............................................

	/**
	 * Namespace string.
	 * @type {String}
	 */
	$ns : null,

	/**
	 * Declaration context.
	 * @type {Window|WorkerScope}
	 */
	$context : null
};

/**
 * Hm.
 * @param {Window|WorkerScope} context
 * @param {String} objectpath
 * @param {gui.Namespace} namespace
 * @throws {ReferenceError}
 */
gui.Namespace.validate = function ( context, ns, namespace ) {
	gui.Tick.next ( function () {
		if ( gui.Object.lookup ( ns, context ) !== namespace ) {
			throw new ReferenceError ( "The string \"" + ns + "\" must evaluate to a namespace object." );
		}
	}, this );
};


/**
 * This fellow allow us to create a newable constructor that can be "subclassed" via an extend method. 
 * Instances of the "class" may use a special `_super` method to override members of the "superclass".
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
				var desc = Object.getOwnPropertyDescriptor ( C, key );
				if ( !desc || desc.writable ) {
					C [ key ] = C.$recurring [ key ] = val;
				}
			});
		}
		return C;
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


	// Secret ...............................................................................

	/**
	 * The 'this' keyword around here points to the instance via 'apply'.
	 * @param {object} instance
	 * @param {Arguments} arg
	 */
	$constructor : function () {
		var constructor = this.$onconstruct || this.onconstruct;
		var nonenumprop = gui.Property.nonenumerable;
		window.Object.defineProperties ( this, {
			"$instanceid" : nonenumprop ({
				value: gui.KeyMaster.generateKey ()
			}),
			displayName : nonenumprop ({
				value : this.constructor.displayName,
				writable : true
			})
		});
		if ( gui.Type.isFunction ( constructor )) {
			constructor.apply ( this, arguments );
		}
		return this;
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
	ANONYMOUS	 : "Anonymous",

	/**
	 * Self-executing function creates a string property _BODY 
	 * which we can as constructor body for classes. The $name 
	 * will be substituted for the class name. Note that if 
	 * called without the 'new' keyword, the function acts 
	 * as a shortcut the the MyClass.extend method (against 
	 * convention, which is to silently imply the 'new' keyword).
	 * @type {String}
	 */
	_BODY : ( function ( $name ) {
		var body = $name.toString ().trim ();
		return body.slice ( body.indexOf ( "{" ) + 1, -1 );
	}(
		function $name () {
			if ( this instanceof $name ) {
				return gui.Class.$constructor.apply ( this, arguments );	
			} else {
				return $name.extend.apply ( $name, arguments );	
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
		name = name || gui.Class.ANONYMOUS;
		var C = gui.Function.create ( name, null, this._namedbody ( name ));
		C.$classid = gui.KeyMaster.generateKey ( "class" );
		C.prototype = Object.create ( proto || null );
		C.prototype.constructor = C;
		C = this._internals ( C, SuperC );
		C = this._interface ( C );
		C = this._classname ( C, name );
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
			var desc = Object.getOwnPropertyDescriptor ( C, key );
			if ( !desc || desc.writable ) {
				C [ key ] = val;
			}
		});
		gui.Property.extendall ( protos, C.prototype ); // @TODO what about base?
		gui.Super.support ( SuperC, C, protos );
		C = this._classname ( C, name );
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
		[ "extend", "mixin", "isInstance" ].forEach ( function ( method ) {
			C [ method ] = this [ method ];
		}, this );
		return C;
	},

	/**
	 * Assign toString() return value to function constructor and instance object.
	 * @TODO validate unique name
	 * @param {function} C
	 * @param {String} name
	 * @returns {function}
	 */
	_classname : function ( C, name ) {
		C.$classname = name || gui.Class.ANONYMOUS;
		C.toString = function () {
			return "[function " + this.$classname + "]";
		};
		C.prototype.toString = function () {
			return "[object " + this.constructor.$classname + "]";
		};
		[ C, C.prototype ].forEach ( function ( thing ) { 
			Object.defineProperty ( thing, "displayName", 
				gui.Property.nonenumerable ({
					writable : true,
					value : name
				})
			);
		});
		return C;
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
	}

	/**
	 * This might do something in the profiler. Not much luck with stack traces.
	 * @see http://www.alertdebugging.com/2009/04/29/building-a-better-javascript-profiler-with-webkit/
	 * @see https://code.google.com/p/chromium/issues/detail?id=17356
	 * @param {function} C
	 * @returns {function}
	 *
	_profiling : function ( C ) {
		var name = C.name || gui.Class.ANONYMOUS;
		[ C, C.prototype ].forEach ( function ( thing ) {
			gui.Object.each ( thing, function ( key, value ) {
				if ( gui.Type.isMethod ( value )) {
					this._displayname ( value, name + "." + key );
				}
			}, this );
		}, this );
		return C;
	},
	*/
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
	},

	/**
	 * Is instance of this?
	 * @param {object} object
	 * @returns {boolean}
	 */
	isInstance : function ( object ) {
		return gui.Type.isObject ( object ) && ( object instanceof this );
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
 * Bind the "this" keyword for all public methods. 
 */
gui.Object.bindall ( gui.Property );


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
 * @param @optional {function} callback
 * @param @optional {object} thisp
 */
gui.Then = function Then ( callback, thisp ) {
  if ( callback ) {
    this.then ( callback, thisp );
  }
};

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
   * Callback to execute.
   * @type {function}
   */
  _callback : null,

  /**
   * "this" keyword in callback.
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
 * Parsing markup strings to DOM objects.
 */
gui.HTMLParser = {

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.HTMLParser]";
	},

	/**
	 * Parse to document. Bear in mind that the 
	 * document.defaultView of this thing is null.
	 * @TODO: Use DOMParser for text/html supporters
	 * @param {String} markup
	 * @returns {HTMLDocument}
	 */
	parseToDocument : function ( markup ) {
		markup = markup || "";
		return gui.Guide.suspend ( function () {
			var doc = document.implementation.createHTMLDocument ( "" );
			if ( markup.toLowerCase().contains ( "<!doctype" )) {
				doc.documentElement.innerHTML = markup;
			} else {
				doc.body.innerHTML = markup;
			}
			return doc;
		});
	},

	/**
	 * Parse to array of one or more nodes.
	 * @param {String} markup
	 * @param @optional {Document} targetdoc
	 * @returns {Array<Node>}
	 */
	parseToNodes : function ( markup, targetdoc ) {
		var elm, doc = this._document || 
			( this._document = document.implementation.createHTMLDocument ( "" ));
		return gui.Guide.suspend ( function () {
			doc.body.innerHTML = this._insaneitize ( markup );
			elm = doc.querySelector ( "." + this._classname ) || doc.body;
			return Array.map ( elm.childNodes, function ( node ) {
				return targetdoc ? targetdoc.importNode ( node, true ) : node;
			});
		}, this );
	},


	// Private ...............................................................................
	
	/**
	 * Classname for obscure wrapping containers.
	 * @type {String}
	 */
	_classname : "_gui-htmlparser",

	/**
	 * Match comments.
	 * @type {RegExp}
	 */
	_comments : /<!--[\s\S]*?-->/g,

	/**
	 * Match first tag.
	 * @type {RegExp}
	 */
	_firsttag : /^<([a-z]+)/i,

	/**
	 * Recycled for parseToNodes operations.
	 * @TODO Create on first demand 
	 * @type {HTMLDocument}
	 */
	_document : null,

	/**
	 * Some elements must be created in obscure markup 
	 * structures in order to be rendered correctly.
	 * @param {String} markup
	 * @returns {String}
	 */
	_insaneitize : function ( markup ) {
		var match, fix;
		markup = markup.trim ().replace ( this._comments, "" );
		if (( match = markup.match ( this._firsttag ))) {
			if (( fix = this._fixes [ match [ 1 ]])) {
				markup = fix.
					replace ( "${class}", this._classname ).
					replace ( "${markup}", markup );
			}
		}
		return markup;
	},

	/**
	 * Mapping tag names to miminum viable tag structure.
	 * @see https://github.com/petermichaux/arbutus
	 * @TODO "without the option in the next line, the parsed option will always be selected."
	 * @type {Map<String,String>}
	 */
	_fixes : ( function () {
		var map = {
			"td" : '<table><tbody><tr class="${class}">${markup}</tr></tbody></table>',
			"tr" : '<table><tbody class="${class}">${markup}</tbody></table>',
			"tbody" : '<table class="${class}">${markup}</table>',
			"col" : '<table><colgroup class="${class}">${markup}</colgroup></table>',
			"option" : '<select class="${class}"><option>a</option>${markup}</select>' 
		};
		map [ "th" ] = map [ "td" ]; // duplucate fixes.
		[ "thead", "tfoot", "caption", "colgroup" ].forEach ( function ( tag ) {
			map [ tag ] = map [ "tbody" ];
		});
		return map;
	}())
};


/**
 * Serialize DOM elements to XHTML strings (for now).
 * @TODO: Work on the HTML (without XML)
 */
gui.DOMSerializer = {

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.DOMParser]";
	},

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
	 * missing access to innerHTML getter in WebKit.
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
 * @TODO perhaps rename to TextLoader or something...
 */
gui.FileLoader = gui.Class.create ( Object.prototype, {

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
		new gui.Request ( url.href ).acceptText ().get ().then ( function ( status, text ) {
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
 * @TODO: loadStyleSheet method
 */
gui.BlobLoader = {

	 /**
	 * Load script into document from given source code.
	 * @TODO: Refactor to use {gui.Then} instead
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

	// Private .....................................................

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
gui.Crawler = gui.Class.create ( Object.prototype, {

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
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.Crawler]";
	},

	/**
	 * Constructor.
	 * @param {String} type
	 */
	onconstruct : function ( type ) {
		this.type = type || null;
	},

	/**
	 * Crawl DOM ascending.
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
						/*
						 * @TODO: iframed document might have navigated elsewhere, stamp this in localstorage
						 * @TODO: sit down and wonder if localstorage is even available in sandboxed iframes...
						 */
						if ( win.gui.xhost ) {
							elm = null;	
							if ( gui.Type.isFunction ( handler.transcend )) {
								handler.transcend ( win.parent, win.gui.xhost, win.gui.$contextid );
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
				switch ( directive ) {
					case gui.Crawler.STOP :
						elm = null;
						break;
					default :
						elm = elm.parentNode;
						break;
				}
			}
		} while ( elm );
	},

	/**
	 * Crawl DOM ascending, transcend into ancestor frames.
	 * @param {Element|gui.Spirit} start
	 * @param {object} handler
	 */
	ascendGlobal : function ( start, handler ) {
		this.global = true;
		this.ascend ( start, handler );
		this.global = false;
	},

	/**
	 * Crawl DOM descending.
	 * @param {object} start Spirit or Element
	 * @param {object} handler
	 * @param @optional {object} arg @TODO: is this even supported?
	 */
	descend : function ( start, handler, arg ) {
		this.direction = gui.Crawler.DESCENDING;
		var elm = start instanceof gui.Spirit ? start.element : start;
		if ( elm.nodeType === Node.DOCUMENT_NODE ) {
			elm = elm.documentElement;
		}
		this._descend ( elm, handler, arg, true );
	},

	/**
	 * Crawl DOM descending, transcend into iframes.
	 * @param {object} start Spirit or Element
	 * @param {object} handler
	 * @param @optional {object} arg @TODO: is this even supported?
	 */
	descendGlobal : function ( start, handler, arg ) {
		this.global = true;
		this.descend ( start, handler, arg );
		this.global = false;
	},


	// Private .................................................................

	/**
	 * Iterate descending.
	 * @param {Element} elm
	 * @param {object} handler
	 * @param {boolean} start
	 */
	_descend : function ( elm, handler, arg, start ) {
		var win, doc, root, spirit, directive = this._handleElement ( elm, handler, arg );
		switch ( directive ) {
			case gui.Crawler.CONTINUE :
			case gui.Crawler.SKIP_CHILDREN :
				if ( directive !== gui.Crawler.SKIP_CHILDREN ) {
					if ( elm.childElementCount ) {
						this._descend ( elm.firstElementChild, handler, arg, false );
					} else if ( this.global && elm.localName === "iframe" ) {
						if (( spirit = elm.spirit ) && ( spirit instanceof gui.IframeSpirit )) {
							if ( spirit.xguest ) {
								win = elm.ownerDocument.defaultView;
								if ( gui.Type.isFunction ( handler.transcend )) {
									handler.transcend ( spirit.contentWindow, spirit.xguest, spirit.$instanceid );// win.gui.$contextid
								}
							} else {
								if (( doc = elm.contentDocument ) && ( root = doc.documentElement )) {
									this._descend ( root, handler, arg, false );
								}
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
				if ( directive !== gui.Crawler.STOP ) {
					if ( spirit && gui.Type.isFunction ( handler.handleSpirit )) {
						directive = this._handleSpirit ( spirit, handler );
					}
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


}, {}, { // Static ..............................................................

	ASCENDING : "ascending",
	DESCENDING : "descending",
	CONTINUE : 0,
	STOP : 1,
	SKIP: 2, // @TODO: support this
	SKIP_CHILDREN : 4

});


/**
 * Simplistic XMLHttpRequest wrapper.
 * @param @optional {String} url
 * @param @optional {Document} doc Resolve URL relative to given document location.
 */
gui.Request = function ( url, doc ) {
	this._headers = {
		"Accept" : "application/json"
	};
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
	 * @returns {gui.Request}
	 */
	accept : function ( mimetype ) {
		this._headers.Accept = mimetype;
		return this;
	},

	/**
	 * Expect JSON response.
	 * @returns {gui.Request}
	 */
	acceptJSON : function () {
		return this.accept ( "application/json" );
	},

	/**
	 * Expect XML response.
	 * @returns {gui.Request}
	 */
	acceptXML : function () {
		return this.accept ( "text/xml" );
	},

	/**
	 * Expect text response.
	 * @returns {gui.Request}
	 */
	acceptText : function () {
		return this.accept ( "text/plain" );
	},

	/**
	 * Format response to this type.
	 * @param {String} mimetype
	 * @returns {gui.Request}
	 */
	format : function ( mimetype ) {
		this._format = mimetype;
		return this;
	},

	/**
	 * Override mimetype to fit accept.
	 * @returns {gui.Request}
	 */
	override : function ( doit ) {
		this._override = doit || true;
		return this;
	},

	/**
	 * Append request headers.
	 * @param {Map<String,String>} headers
	 * @returns {gui.Request}
	 */
	headers : function ( headers ) {
		if ( gui.Type.isObject ( headers )) {
			gui.Object.each ( headers, function ( name, value ) {
				this._headers [ name ] = String ( value );
			}, this );
		} else {
			throw new TypeError ( "Object expected" );
		}
		return this;
	},
	
	
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
	 * Default request type. Defaults to JSON.
	 * @type {String}
	 */
	_format : "application/json",

	/**
	 * Override response mimetype?
	 * @type {String}
	 */
	_override : false,

	/**
	 * Request headers.
	 * @type {Map<String,String}
	 */
	_headers : null,

	/**
	 * Do the XMLHttpRequest.
	 * @TODO http://mathiasbynens.be/notes/xhr-responsetype-json
	 * @param {String} method
	 * @param {object} payload
	 * @param {function} callback
	 */
	_request : function ( method, payload, callback ) {
		var that = this, request = new XMLHttpRequest ();
		request.onreadystatechange = function () {
			if ( this.readyState === XMLHttpRequest.DONE ) {
				var data = that._response ( this.responseText );
				callback ( this.status, data, this.responseText );
			}
		};
		if ( this._override ) {
			request.overrideMimeType ( this._headers.Accept );
		}
		request.open ( method.toUpperCase (), this._url, true );
		gui.Object.each ( this._headers, function ( name, value ) {
			request.setRequestHeader ( name, value, false );
		});
		request.send ( payload );
	},

	/**
	 * Parse response to expected type.
	 * @param {String} text
	 * @returns {object}
	 */
	_response : function ( text ) {	
		var result = text;
		try {
			switch ( this._headers.Accept ) {
				case "application/json" :
					result = JSON.parse ( text );
					break;
				case "text/xml" :
					result = new DOMParser ().parseFromString ( text, "text/xml" );
					break;
			}
		} catch ( exception ) {
			console.error ( 
				this._headers.Accept + " dysfunction at " + this._url + "\n" + 
				"Note that gui.Request defaults to accept and send JSON. " + 
				"Use request.accept(mime) and request.format(mime) to change this stuff."
			);
		}
		return result;
	}
};

/**
 * Generating methods for GET PUT POST DELETE.
 * @param @optional {object} payload
 */
[ "get", "post", "put", "delete" ].forEach ( function ( method ) {
	gui.Request.prototype [ method ] = function ( payload ) {
		if ( gui.Type.isFunction ( payload )) {
			throw new Error ( "Deprecated: gui.Request returns a gui.Then" );
		}
		var then = new gui.Then ();
		payload = method === "get" ? null : payload;
		this._request ( method, payload, function ( status, data, text ) {
			then.now ( status, data, text );
		});
		return then;
	};
});


/**
 * Module base.
 */
gui.Module = gui.Class.create ( Object.prototype, {

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
			context.gui.channelModule ( this.channels );
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
				if ( b.data === context.gui.$contextid ) {
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
		/*
		 * @TODO: move to EDB module somehow...
		 */
		if ( !this._startstates ) {
			if ( !gui.Spirit._didsayso ) {
				console.warn ( "TODO: _startstates not setup nowadays" );
				gui.Spirit._didsayso = true;
			}
		} else {
			if ( !this._startstates ()) {
				gui.Spirit.$oninit ( this );
			}
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


/**
 * Base constructor for all plugins.
 * @TODO "context" should be required in constructor (sandbox scenario)
 */
gui.Plugin = gui.Class.create ( Object.prototype, {

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
	ondestruct : function () {},

	/**
	 * Implements DOM2 EventListener (native event handling). 
	 * We forwards the event to method 'onevent' IF that has 
	 * been specified on the plugin.
	 * @param {Event} e
	 */
	handleEvent : function ( e ) {
		if ( gui.Type.isFunction ( this.onevent )) {
			this.onevent ( e );
		}
	},
	
	
	// Secret ............................................................

	/**
	 * Secret constructor. Called before `onconstruct`. 
	 * @param {gui.Spirit} spirit
	 */
	$onconstruct : function ( spirit ) {
		this.spirit = spirit || null;
		this.context = spirit ? spirit.window : null; // web worker scenario
		this.onconstruct ();
	},

	/**
	 * Secret destructor. Called after `ondestruct`.
	 */
	$ondestruct : function () {
		gui.GreatSpirit.$nukeallofit ( this, this.spirit.window );
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
	 * Lazy plugins are newed up only when needed. We'll create an 
	 * accessor for the prefix that will instantiate the plugin and 
	 * create a new accesor to return it. To detect if a plugin 
	 * has been instantiated, check with {gui.LifePlugin#plugins}, 
	 * a hashmap that maps prefixes to a boolean status.
	 * @param {gui.Spirit} spirit
	 * @param {String} prefix
	 * @param {function} Plugin
	 */
	runonaccessor : function ( spirit, prefix, Plugin ) {
		Object.defineProperty ( spirit, prefix, {
			enumerable : true,
			configurable : true,
			get : function () {
				var plugin = new Plugin ( this );
				this.life.plugins [ prefix ] = true;
				Object.defineProperty ( this, prefix, {
					enumerable : true,
					configurable : true,
					get : function () {
						return plugin;
					}
				});
				return plugin;
			}
		});
	}

});


/**
 * Comment goes here.
 * @extends {gui.Plugin}
 */
gui.Tracker = gui.Plugin.extend ({

	/**
	 * Bookkeeping types and handlers.
	 * @type {Map<String,Array<object>}
	 */
	_trackedtypes : null,

	/**
	 * Containing window's gui.$contextid.
	 * @TODO: Get rid of it
	 * @type {String}
	 */
	_sig : null,

	/**
	 * Construction time.
	 * @param {Spirit} spirit
	 */
	onconstruct : function () {
		this._super.onconstruct ();
		this._trackedtypes = Object.create ( null );
		if ( this.spirit ) {
			this._sig = this.spirit.window.gui.$contextid;
		}
	},

	/**
	 * Cleanup on destruction.
	 */
	ondestruct : function () {
		var type, list;
		this._super.ondestruct ();
		gui.Object.each ( this._trackedtypes, function ( type, list ) {
			list.slice ( 0 ).forEach ( function ( checks ) {
				this._cleanup ( type, checks );
			}, this );
		}, this );
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
			return this._trackedtypes [ type ];
		}, this );
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
		var list = this._trackedtypes [ type ];
		if ( !list ) {
			list = this._trackedtypes [ type ] = [];
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
		var list = this._trackedtypes [ type ];
		if ( list ) {
			var index = this._checksindex ( list, checks );
			if ( index > -1 ) {
				result = true;
				if ( gui.Array.remove ( list, index ) === 0 ) {
					delete this._trackedtypes [ type ];
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
		var list = this._trackedtypes [ type ];
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
		return Object.keys ( this._trackedtypes ).length > 0;
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
	}

});


/**
 * Where spirits go to be garbage collected. Not for public 
 * consumption: Please dispose of spirits via the {gui.Guide}.
 * @see {gui.Guide#materialize}
 * @see {gui.Guide#materializeOne}
 * @see {gui.Guide#materializeSub}
 */
gui.GreatSpirit = {

	/**
	 * To identify our exception in a try-catch scenario, look for 
	 * this string in the *beginning* of the exception message. 
	 * @type {String}
	 */
	DENIAL : "Attempt to handle destructed spirit",

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.GreatSpirit]";
	},


	// Secrets ..........................................................................

	/**
	 * - Nuke lazy plugins so that we don't accidentally instantiate them
	 * - Destruct remaining plugins, saving the {gui.Life} plugin for last
	 * - Replace all properties with an accessor to throw an exception
	 */
	$meet : function ( spirit ) {
		var prefixes = [], plugins = spirit.life.plugins;
		gui.Object.each ( plugins, function ( prefix, instantiated ) {
			if ( instantiated ) {
				if ( prefix !== "life" ) {
					prefixes.push ( prefix );
				}
			} else {
				Object.defineProperty ( spirit, prefix, {
					enumerable : true,
					configurable : true,
					get : function () {},
					set : function () {}
				});
			}
		});
		this.$nukeplugins ( spirit, prefixes.sort ());
		this.$nukeplugins ( spirit, [ "life" ]);
		this.$nukeelement ( spirit );
		this.$nukeallofit ( spirit, spirit.window );
	},

	/**
	 * Nuke plugins in two steps to minimize access violations.
	 * @param {gui.Spirit} spirit
	 * @param {Array<String>} prefixes
	 */
	$nukeplugins : function ( spirit, prefixes ) {
		var plugins = prefixes.map ( function ( key ) {
			return spirit [ key ];
		}, this );
		plugins.forEach ( function ( plugin ) {
			plugin.ondestruct ();
		});
		plugins.forEach ( function ( plugin ) {
			plugin.$ondestruct ();
		});
	},

	/**
	 * Unreference spirit associated element. 
	 * Explorer may deny permission in frames.
	 * @TODO: Is IE exception still relevant?
	 */
	$nukeelement : function ( spirit ) {
		try {
			spirit.element.spirit = null;
		} catch ( denied ) {}
	},

	/**
	 * Replace own properties with an accessor to throw an exception. 
	 * In 'gui.debug' mode we replace all props, not just own props, 
	 * so that we may fail fast on attempt to handle destructed spirit.
	 * @TODO: keep track of non-enumerables and nuke those as well :/
	 * @param {object} thing
	 * @param {Window} context
	 */
	$nukeallofit : function ( thing, context ) {
		var nativeprops = context.Object.prototype;
		for ( var prop in thing ) {
			if ( thing.hasOwnProperty ( prop ) || gui.debug ) {
				if ( nativeprops [ prop ] === undefined ) {
					var desc = Object.getOwnPropertyDescriptor ( thing, prop );
					if ( !desc || desc.configurable ) {
						Object.defineProperty ( thing, prop, this.DENIED );
					}
				}
			}
		}
	},

	/**
	 * User to access property post destruction, report that the spirit was terminated.
	 */
	DENIED : {
		enumerable : true,
		configurable : true,
		get : function () {
			gui.GreatSpirit.DENY ();
		},
		set : function () {
			gui.GreatSpirit.DENY ();
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
			stack.shift (); stack.shift (); // @TODO: shift one more now?
			throw new Error ( e.message + "\n" + stack );
		} else {
			throw e;
		}
	}
};


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
	 * Spirit who (potentially) consumed the action.
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
		 * Evaluate action for spirit.
		 * @param {gui.Spirit} spirit
		 */
		handleSpirit : function ( spirit ) {
			var directive = gui.Crawler.CONTINUE;
			if ( spirit.action.contains ( type )) {
				spirit.action.$onaction ( action );
				if ( action.isConsumed ) {
					directive = gui.Crawler.STOP;
					action.consumer = spirit;
				}
			}
			return directive;
		},
		/*
		 * Teleport action across domains.
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
						JSON.stringify ( d ); // @TODO: think mcfly - how come not d = JSON.stringify???? (breaks iframe test)
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
 * @TODO 'one' and 'oneGlobal' methods
 * @using {gui.Arguments#confirmed}
 * @using {gui.Combo#chained}
 */
gui.ActionPlugin = ( function using ( confirmed, chained ) {
	
	return gui.Tracker.extend ({ // "gui.ActionPlugin"

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


		// Private ............................................................................
		
		/**
		 * Remove delegated handlers. 
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
		},


		// Secret ...........................................................................
		
		/**
		 * Flip to a mode where the spirit will handle it's own action. Corner case scenario: 
		 * IframeSpirit watches an action while relaying the same action from external domain.
		 * @type {boolean}
		 */
		$handleownaction : false,

		/**
		 * Handle action. If it matches listeners, the action will be 
		 * delegated to the spirit. Called by crawler in `gui.Action`.
		 * @see {gui.Action#dispatch}
		 * @param {gui.Action} action
		 */
		$onaction : function ( action ) {
			var list = this._trackedtypes [ action.type ];
			if ( list ) {
				list.forEach ( function ( checks ) {
					var handler = checks [ 0 ];
					var matches = checks [ 1 ] === action.global;
					var hacking = handler === this.spirit && this.$handleownaction;
					if ( matches && ( handler !== action.target || hacking )) {
						handler.onaction ( action );
					}
				}, this );
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
 * Broadcast instance.
 * @using gui.Arguments#confirmed
 * @using gui.Combo#chained
 */
gui.Broadcast = ( function using ( confirmed, chained ) {

	return gui.Class.create ( Object.prototype, {

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
		global : false,

		/**
		 * Signature of dispatching context. 
		 * Unimportant for global broadcasts.
		 * @type {String}
		 */
		$contextid : null,

		/**
		 * Experimental...
		 * @todo Still used?
		 * @type {Array<String>}
		 */
		$contextids : null,
	
		/**
		 * Constructor.
		 * @param {Map<String,object>} defs
		 */		
		$onconstruct : function ( defs ) {
			gui.Object.extend ( this, defs );
			this.$contextids = this.$contextids || [];
		}


	}, {}, { // Static ................................................................................

		/**
		 * Tracking global handlers (mapping broadcast types to list of handlers).
		 * @type {Map<String,<Array<object>>}
		 */
		_globals : Object.create ( null ),

		/**
		 * Tracking local handlers (mapping gui.$contextids to broadcast types to list of handlers).
		 * @type {Map<String,Map<String,Array<object>>>}
		 */
		_locals : Object.create ( null ),

		/**
		 * mapcribe handler to message.
		 * @param {object} message String or array of strings
		 * @param {object} handler Implements BroadcastListener
		 * @param @optional {String} sig
		 * @returns {function}
		 */
		add : chained ( function ( message, handler, sig ) {
			this._add ( message, handler, sig || gui.$contextid );
		}),

		/**
		 * Unmapcribe handler from broadcast.
		 * @param {object} message String or array of strings
		 * @param {object} handler
		 * @param @optional {String} sig
		 * @returns {function}
		 */
		remove : chained ( function ( message, handler, sig ) {
			this._remove ( message, handler, sig || gui.$contextid );
		}),

		/**
		 * Publish broadcast in specific window scope (defaults to this window)
		 * @TODO queue for incoming dispatch (finish current message first).
		 * @param {Spirit} target
		 * @param {String} type
		 * @param {object} data
		 * @param {String} contextid
		 * @returns {gui.Broadcast}
		 */
		dispatch : function ( target, type, data, contextid ) {
			var id = contextid || gui.$contextid;
			return this.$dispatch ({
				target : target,
				type : type,
				data : data,
				global : false,
				$contextid : id
			});
		},

		/**
		 * mapcribe handler to message globally.
		 * @param {object} message String or array of strings
		 * @param {object} handler Implements BroadcastListener
		 * @returns {function}
		 */
		addGlobal : chained ( function ( message, handler ) {
			this._add ( message, handler );
		}),

		/**
		 * Unmapcribe handler from global broadcast.
		 * @param {object} message String or array of strings
		 * @param {object} handler
		 * @returns {function}
		 */
		removeGlobal : chained ( function ( message, handler ) {
			this._remove ( message, handler );
		}),

		/**
		 * Dispatch broadcast in global scope (all windows).
		 * @TODO queue for incoming dispatch (finish current first).
		 * @TODO Handle remote domain iframes ;)
		 * @param {Spirit} target
		 * @param {String} type
		 * @param {object} data
		 * @returns {gui.Broadcast}
		 */
		dispatchGlobal : function ( target, type, data ) {
			return this.$dispatch ({
				target : target,
				type : type,
				data : data,
				global : true,
				$contextid : gui.$contextid
			});
		},

		/**
		 * Encode broadcast to be posted xdomain.
		 * @param {gui.Broacast} b
		 * @returns {String}
		 */
		stringify : function ( b ) {
			var prefix = "spiritual-broadcast:";
			return prefix + ( function () {
				b.target = null;
				b.data = ( function ( d ) {
					if ( gui.Type.isComplex ( d )) {
						if ( gui.Type.isFunction ( d.stringify )) {
							d = d.stringify ();
						} else {
							try {
								JSON.stringify ( d ); // @TODO: think mcfly - how come not d = JSON.stringify????
							} catch ( jsonexception ) {
								d = null;
							}
						}
					}
					return d;
				}( b.data ));
				return JSON.stringify ( b );
			}());
		},

		/**
		 * Decode broadcast posted from xdomain and return a broadcast-like object.
		 * @param {String} msg
		 * @returns {object}
		 */
		parse : function ( msg ) {
			var prefix = "spiritual-broadcast:";
			if ( msg.startsWith ( prefix )) {
				return JSON.parse ( msg.split ( prefix )[ 1 ]);
			}
		},


		// PRIVATE ...................................................................................

		/**
		 * Subscribe handler to message(s).
		 * @param {Array<string>|string} type
		 * @param {object|function} handler Implements BroadcastListener
		 * @param @optional {String} sig
		 */
		_add : confirmed ( "array|string", "object|function", "(string)" ) (
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
			}
		),

		/**
		 * Hello.
		 * @param {object} message String or array of strings
		 * @param {object} handler
		 * @param @optional {String} sig
		 */
		_remove : function ( message, handler, sig ) {
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
		},

		/**
		 * Dispatch broadcast.
		 * @param {gui.Broadcast|Map<String,object>} b
		 */
		$dispatch : function ( b ) {
		 /*
		 * @param {Spirit} target
		 * @param {String} type
		 * @param {object} data
		 * @param @optional {String} sig
		 * @returns {gui.Broadcast}
		 */
			var map = b.global ? this._globals : this._locals [ b.$contextid ];
			if ( b instanceof gui.Broadcast === false ) {
				b = new gui.Broadcast ( b );	
			}
			if ( map ) {
				var handlers = map [ b.type ];
				if ( handlers ) {
					handlers.slice ().forEach ( function ( handler ) {
						handler.onbroadcast ( b );
					});
				}
			}
			if ( b.global ) {
				var root = document.documentElement.spirit;
				if ( root ) { // no spirit before DOMContentLoaded
					root.propagateBroadcast ( b );
				}
			}
			return b;
		}

	});
	

}( gui.Arguments.confirmed, gui.Combo.chained ));


/**
 * Tracking broadcasts.
 * @extends {gui.Tracker}
 * @using {gui.Combo.chained}
 */
gui.BroadcastPlugin = ( function using ( chained ) {

	return gui.Tracker.extend ({

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
			return this._add ( type, handler, false, sig || gui.$contextid );
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
			return this._add ( type, handler, true, sig || gui.$contextid );
		}
	);

	/**
	 * Schedule action for next available execution stack.
	 * @TODO: deprecate setImmedate polyfix and kove the fix here
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
		return this._remove ( type, handler,  sig || gui.$contextid );
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
		return this._dispatch ( type, time, sig || gui.$contextid );
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

	return gui.Tracker.extend ({

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
		 * @param @optional {object|function} thisp
		 * @returns {gui.TickPlugin}
		 */
		next : chained ( function ( action, thisp ) {
			gui.Tick.next ( action, thisp || this.spirit );
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
			var sig = this.spirit.$contextid;
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
			var sig = this.spirit.$contextid;
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
			var tick, sig = this.spirit.$contextid;
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
					gui.Tick.remove ( type, handler, this.$contextid );
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
 * It's the core module.
 */
gui.module ( "core", {

	/**
	 * Assign plugins to all spirits.
	 */
	plugins : {
		"action" : gui.ActionPlugin,
		"broadcast" : gui.BroadcastPlugin,
		"tick" : gui.TickPlugin
	},

	/**
	 * Methods added to all spirits.
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
		 * Handle tick (timed event).
		 * @param {gui.Tick} tick
		 */
		ontick : function ( tick ) {}
	}

});


/**
 * Questionable browser identity and feature detection. Note that Chrome on iOS 
 * identifies itself as Safari (it basically is, so that shouldn't cause concern).
 * @TODO Load earlier by not using gui.Broadcast
 * @TODO Lazycompute properties when requested.
 */
gui.Client = ( new function Client () {

	var agent = navigator.userAgent.toLowerCase ();
	var root = document.documentElement;

	this.isExplorer = agent.contains ( "msie" );
	this.isExplorer9 = this.isExplorer && agent.contains ( "msie 9" ); // @TODO feature detect something
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
	this.hasHistory = ( window.history && window.history.pushState ) ? true : false;

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
						console.log ( 
							title + ": Spiritual runs in JQuery mode. To keep spirits " +
							"in synch, use JQuery or Spiritual to perform DOM updates."
						);
					}
				} else {
					win.gui.mode = gui.MODE_NATIVE;
					if ( win.gui.debug ) {
						console.log ( title + ": Spiritual runs in native mode" );
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
		 * Spiritualize node plus subtree.
		 * @param {Node} node
		 */
		var spiritualizeAfter = combo.after ( function ( node ) {
			guide.spiritualize ( node );
		});

		/**
		 * Spiritualize new node plus subtree.
		 * @param {Node} oldnode
		 */
		var spiritualizeNewAfter = combo.after ( function ( newnode, oldnode ) {
			guide.spiritualize ( newnode );
		});
		
		/**
		 * Materialize old node plus subtree
		 * @TODO perhaps just detach oldnode instead???
		 * @param {Node} newnode
		 * @param {Node} oldnode
		 */
		var materializeOldBefore = combo.before ( function ( newnode, oldnode ) {
			guide.materialize ( oldnode );
		});

		/**
		 * Detach node plus subtree.
		 * @param {Node} node
		 */
		var detachBefore = combo.before ( function ( node ) {
			guide.detach ( node );
		});

		/**
		 * Spirit-aware setattribute.
		 * @param {String} name
		 * @param {String} value
		 */
		var setAttBefore = combo.before ( function ( name, value ) {
			this.spirit.att.set ( name, value );
		});

		/**
		 * Spirit-aware removeattribute.
		 * @TODO use the post combo?
		 * @param {String} att
		 */
		var delAttBefore = combo.before( function ( name ) {
			this.spirit.att.del ( name );
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
		 * Pretend nothing happened when running in managed mode.
		 * @TODO Simply mirror this prop with an internal boolean
		 */
		var ifEnabled = combo.provided ( function () {
			var win = this.ownerDocument.defaultView;
			if ( win ) {
				return win.gui.mode !== gui.MODE_MANAGED;
			} else {
				return false; // abstract HTMLDocument might adopt DOM combos
			}
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
						ifEmbedded ( detachBefore ( suspending ( base )),
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
			replaceChild : function ( base ) { // @TODO: detach instead (also in jquery module)
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
							ifSpirit ( setAttBefore ( base ), 
							otherwise ( base )),
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			removeAttribute : function ( base ) {
				return ( 
					ifEnabled ( 
						ifEmbedded ( 
							ifSpirit ( delAttBefore ( base ),
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
			new gui.Crawler ( gui.CRAWLER_DOMPATCHER ).descend ( node, this );
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
			return gui.DOMSerializer.subserialize ( this );
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
			return gui.DOMSerializer.serialize ( this );
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
		var sig = win.gui.$contextid;
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
	 * Tracking MutationObservers for window contexts by gui.$contextid
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
		var sig = win.gui.$contextid;
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
		} else {
			elm.spirit = new Spirit ( elm, doc, win, sig );
		}
		return elm.spirit;
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
	 * Suspend spiritualization and materialization during operation.
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
		if(sum.documentspirit){
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
		if(sum.documentspirit){
			sum.documentspirit.onload ();
		}
	},

	/**
	 * Fires on window unload.
	 * @param {gui.EventSummary} sum
	 */
	_unload : function ( sum ) {
		if(sum.documentspirit){
			sum.documentspirit.onunload ();
		}
		this.materialize(sum.document);
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
		win.gui.start (); // channel spirits
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
			win.gui.spiritualized = true;
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
	 * Evaluate spirits for element and subtree.
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
		new gui.Crawler ( gui.CRAWLER_SPIRITUALIZE ).descend ( element, {
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
	 * Nuke spirits in reverse document order. This to allow an ascending {gui.Action} to escape 
	 * from the subtree of a spirit that decides to remove itself from the DOM during destruction.
	 * @TODO 'one' appears to be unsupported here???
	 * @param {Element} element
	 * @param {boolean} skip Skip the element?
	 * @param {boolean} one Skip the subtree?
	 */
	_materialize : function ( element, skip, one ) {
		this._collect ( element, skip, gui.CRAWLER_MATERIALIZE ).reverse ().filter ( function ( spirit ) {
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


	// Secret .........................................................................

	/**
	 * Invoked by {gui.Spiritual} some milliseconds after 
	 * all spirits have been attached to the page DOM.
	 * @param {Array<gui.Spirit>} spirits
	 */
	$goasync : function ( spirits ) {
		spirits.forEach ( function ( spirit ) {
			gui.Spirit.$async ( spirit );
		});
		this._visibility ( spirits );
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
gui.LifePlugin = gui.Tracker.extend ({

	/**
	 * Spirit is constructed? This is almost certainly true by 
	 * the time you address the spirit.
	 * @type {boolean}
	 */
	constructed : false,

	/**
	 * Spirit is configured?
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
	 * @TODO: make udefined on startup
	 * @type {boolean}
	 */
	attached : false,

	/**
	 * Is currently not located in page DOM? Note that this is initially 
	 * true until the spirit has been discovered and registered as attached.
	 * @TODO: make udefined on startup
	 * @type {boolean}
	 */
	detached : true,

	/**
	 * Is ready? If so, it implies that all descendant spirits are also ready.
	 * @type {boolean}
	 */
	ready : false,

	/**
	 * Is after whatever happens roughly 4 milliseconds after 'ready'?
	 * @type {boolean}
	 */
	async : false,

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
	 * Is visible?
	 * @type {boolean}
	 */
	visible : undefined,

	/**
	 * Mapping plugin prefix to initialized status, 'false' 
	 * is a lazy plugin that has not yet been constructed. 
	 * @type {[type]}
	 */
	plugins : null,

	/**
	 * Construction time.
	 * @overrides {gui.Tracker#construct}
	 */
	onconstruct : function () {
		this._super.onconstruct ();
		this._handlers = Object.create ( null );
		this.plugins = Object.create ( null );
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
				gui.Array.remove ( this._handlers [ type ], index );
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
	_handlers : null,

	/**
	 * Cleanup.
	 */
	_cleanup : function ( type, checks ) {
		var handler = checks [ 0 ];
		this.remove ( type, handler );
	}

});


/**
 * Configures a spirit by attribute parsing.
 * @extends {gui.Plugin}
 */
gui.AttConfigPlugin = gui.Plugin.extend ({

	/**
	 * Invoked by the {gui.Spirit} once all plugins have been plugged in. 
	 * @TODO: Simple props with no setter does nothing when updated now. 
	 * Perhaps it would be possible to somehow configure those *first*?
	 * @TODO Figure out whether or not this should postpone to onenter()
	 * @IDEA we'll configure properties onconfigure and call methods onready :)
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
		var hit, gux = this.spirit.window.gui;
		gux.attributes.every ( function ( fix ) {
			if (( hit = name !== fix && name.startsWith ( fix ))) {
				this.$evaluate ( name, value, fix );
			}
			return !hit;
		}, this );
	},


	// Secrets .................................................................
	
	/**
	 * Evaluate single attribute in search for "gui." prefix.
	 * The string value will be autocast to an inferred type.
	 * "false" becomes a boolean while "23" becomes a number.
	 * Note that the EDB module is *overriding* this method!
	 * @param {String} name
	 * @param {String} value
	 * @param {String} fix
	 */
	$evaluate : function ( name, value, fix ) {
		var struct = this.spirit,
			success = true,
			prop = null,
			cuts = null;
		name = prop = name.split ( fix + "." )[ 1 ];
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
			if ( gui.Type.isString ( value )) {
				value = gui.Type.cast ( value );
			}
			if ( gui.Type.isFunction ( struct [ prop ])) {
				struct [ prop ] ( value );
			} else {
				struct [ prop ] = value;
			}
		} else {
			console.error ( "No definition for \"" + name + "\": " + this.spirit.toString ());
		}
	}

}, { // Static ...............................................................
	
	/**
	 * Run on spirit startup (don't wait for implementation to require it).
	 * @type {boolean}
	 */
	lazy : false

});


/**
 * Attribute wrapper.
 * @param {String} name
 * @param {String} value
 */
gui.Att = function Att ( name, value ) {
	this.value = gui.Type.cast ( value );
	this.name = this.type = name;
};

gui.Att.prototype = {

	/**
	 * Attribute name.
	 * @type {String}
	 */
	name : null,

	/**
	 * Alias 'name' to conform the API with events, broadcasts, actions etc.
	 * @type {String}
	 */
	type : null,

	/**
	 * Attribute value will be cast to an inferred type, eg. "false" becomes 
	 * boolean and "23" becomes number. When handling an attribute, 'null' 
	 * implies that the attribute WILL be deleted (it happens after 'onatt').
	 * @TODO look into deleting the attribute first
	 * @type {String|number|boolean|null}
	 */
	value : null
};


/**
 * Methods to read and write DOM attributes.
 * @extends {gui.Tracker}
 *  @using {gui.Arguments.confirmed}
 * @using {gui.Combo.chained}
 */
gui.AttPlugin = ( function using ( confirmed, chained ) {

	return gui.Tracker.extend ({

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
			return gui.AttPlugin.has ( this.spirit.element, name );
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

		/**
		 * Add one or more action handlers.
		 * @param {array|string} arg
		 * @param @optional {object|function} handler
		 * @returns {gui.ActionPlugin}
		 */
		add : confirmed ( "array|string", "(object|function)" ) (
			chained ( function ( arg, handler ) {
				handler = handler ? handler : this.spirit;
				if ( gui.Interface.validate ( gui.IAttHandler, handler )) {
					this._breakdown ( arg ).forEach ( function ( type ) {
						this._addchecks ( type, [ handler ]);
						this._onadd ( type );
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
				if ( gui.Interface.validate ( gui.IAttHandler, handler )) {
					this._breakdown ( arg ).forEach ( function ( type ) {
						this._removechecks ( type, [ handler ]);
					}, this );
				}
			})
		),


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
			var res = action ();
			this.$suspended = false;
			return res;
		},

		/**
		 * Trigger potential handlers for attribute update.
		 * @param {String} name
		 * @param {String} value
		 */
		$onatt : function ( name, value ) {
			var list, att, handler, trigger;
			var triggers = !gui.attributes.every ( function ( prefix ) {
				if (( trigger = name.startsWith ( prefix ))) {
					this.spirit.attconfig.configureone ( name, value );	
				}
				return !trigger;
			}, this );
			if ( !trigger && ( list = this._trackedtypes [ name ])) {
				att = new gui.Att ( name, value );
				list.forEach ( function ( checks ) {
					handler = checks [ 0 ];
					handler.onatt ( att );
				}, this );
			}
		},


		// Private .................................................
		
		/**
		 * Resolve attribute listeners immediately when added.
		 * @param {String} name
		 */
		_onadd : function ( name ) {
			if ( this.has ( name )) {
				var value = this.get ( name );
				if ( name.startsWith ( gui.AttConfigPlugin.PREFIX )) {
					this.spirit.attconfig.configureone ( name, value );
				} else {
					this.$onatt ( name, value );
				}
			}
		}


		// @TODO: Remember to think about _cleanup () !!!!!
		
		
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
			var change = false;
			// checkbox or radio?
			if ( this._ischecked ( elm, name )) {
				change = elm.checked !== value;
				elm.checked = String ( value ) === "false" ? false : value !== null;
				if ( change ) {
					spirit.att.$onatt ( name, value );
				}
			// input value?
			} else if ( this._isvalue ( elm, name )) {
				change = elm.value !== String ( value );
				if ( change ) {
					elm.value = String ( value );
					spirit.att.$onatt ( name, value );
				}
			// deleted?
			} else if ( value === null ) {
				this.del ( elm, name );
			// added or changed
			} else {
				value = String ( value );
				if ( elm.getAttribute ( name ) !== value ) {
					if ( spirit ) {
						spirit.att.$suspend ( function () {
							elm.setAttribute ( name, value );	
						});
						spirit.att.$onatt ( name, value );
					} else {
						elm.setAttribute ( name, value );	
					}
				}
			}
		}),

		_ischecked : function ( elm, name ) {
			return elm.type && elm.checked !== undefined && name === "checked";
		},

		_isvalue : function ( elm, name ) {
			return elm.value !== undefined && name === "value";
		},

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
			if ( this._ischecked ( elm, name )) {
				elm.checked = false;
			} else if ( this._isvalue ( elm, name )) {
				elm.value = ""; // or what?
			} else {
				if ( spirit ) {
					spirit.att.$suspend ( function () {
						elm.removeAttribute ( name );
					});
					if ( !spirit.attconfig.configureone ( name, null )) {
						spirit.att.$onatt ( name, null );
					}
				} else {
					elm.removeAttribute ( name );
				}
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

}( gui.Arguments.confirmed, gui.Combo.chained ));


/**
 * Interface AttHandler.
 */
gui.IAttHandler = {

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object IAttHandler]";
	},

	/**
	 * Handle attribute update.
	 * @param {gui.Action} action
	 */
	onatt : function ( att ) {}
};


/**
 * Spirit box object. Note that these are all properties, not methods. 
 * @extends {gui.Plugin}
 * @TODO Support globalX, globalY, screenX, screenY
 */
gui.BoxPlugin = gui.Plugin.extend ({
	
	width   : 0, // width
	height  : 0, // height
	localX  : 0, // X relative to positioned ancestor
	localY  : 0, // Y relative to positioned ancestor
	pageX   : 0, // X relative to the full page (includes scrolling)
	pageY   : 0, // Y telative to the full page (includes scrolling)	  
	clientX : 0, // X relative to the viewport (excludes scrolling)
	clientY : 0,  // Y relative to the viewport (excludes scrolling)

	/**
	 * Returns local scrolling element (hotfixed)
	 * @TODO Fix this in gui.Client...
	 * @returns {Element}
	 */
	_scrollroot : function () {
		return ( function ( doc ) {
			if ( gui.Client.scrollRoot.localName === "html" ) {
				return doc.documentElement;
			} else {
				return doc.body;
			}
		}( this.spirit.document ));
	}
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
			return this.clientX + this._scrollroot ().scrollLeft;
		}
	},

	/**
	 * Y relative to the full page (includes scrolling).
	 * @TODO IMPORTANT scrollroot must be local to context
	 * @type {number}
	 */
	pageY : {
		get : function () {
			return this.clientY + this._scrollroot ().scrollTop;
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
 * Spirit styling studio.
 * @extends {gui.Plugin}
 * @using {gui.Combo.chained}
 */
gui.CSSPlugin = ( function using ( chained ) {

	return gui.Plugin.extend ({

		/**
		 * Add classname.
		 * @param {String} name
		 * @returns {gui.CSSPlugin}
		 */
		add : chained ( function ( name ) {
			gui.CSSPlugin.add ( this.spirit.element, name );
		}),

		/**
		 * Remove classname.
		 * @param {String} name
		 * @returns {gui.CSSPlugin}
		 */
		remove : chained ( function ( name ) {
			gui.CSSPlugin.remove ( this.spirit.element, name );
		}),

		/**
		 * Toggle classname.
		 * @param {String} name
		 * @returns {gui.CSSPlugin}
		 */
		toggle : chained ( function ( name ) {
			gui.CSSPlugin.toggle ( this.spirit.element, name );
		}),

		/**
		 * Contains classname?
		 * @param {String} name
		 * @returns {boolean}
		 */
		contains : function ( name ) {
			return gui.CSSPlugin.contains ( this.spirit.element, name );
		}, 
		
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
		 * Set multiple styles via key value map.
		 * @param {Map<String,String>} map
		 * @returns {gui.CSSPlugin}
		 */
		style : chained ( function ( map ) {
			gui.CSSPlugin.style ( this.spirit.element, map );
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
		 * Get or set (full) className.
		 * @param @optional {String} name
		 * @returns {String|gui.CSSPlugin}
		 */
		name : chained ( function ( name ) {
			var result = this.spirit.element.className;
			if ( name !== undefined ) {
				this.spirit.element.className = name;
				result = this.spirit;
			}
			return result;
		}),

		/**
		 * Spirit element mathes selector?
		 * @TODO: move to gui.DOMPlugin!
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
		 * @returns {function}
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
		 * Set single CSS property. Use style() for multiple properties.
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
		 * Set multiple element.style properties via hashmap. Note that 
		 * this method returns the element (ie. it is not chainable).
		 * @param {Element|gui.Spirit} thing Spirit or element.
		 * @param {Map<String,String>} styles
		 * @returns {Element|gui.Spirit}
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
		 * in support of the syntax: this.css.width = 300 (no method call)
		 * @TODO add more properties
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
 * @TODO add following and preceding
 * @using {gui.Combo#chained}
 */
gui.DOMPlugin = ( function using ( chained ) {

	return gui.Plugin.extend ({

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
		 * Hide spirit element and mark as invisible. Adds the `._gui-hidden` classname.
		 * @returns {gui.DOMPlugin}
		 */
		hide : chained ( function () {
			if ( !this.spirit.css.contains ( gui.CLASS_HIDDEN )) {
				this.spirit.css.add ( gui.CLASS_HIDDEN );
				this.spirit.visibility.off ();
			}
		}),

		/**
		 * Show spirit element and mark as visible. Removes the `._gui-hidden` classname.
		 * @returns {gui.DOMPlugin}
		 */
		show : chained ( function () {
			if ( this.spirit.css.contains ( gui.CLASS_HIDDEN )) {
				this.spirit.css.remove ( gui.CLASS_HIDDEN );
				this.spirit.visibility.on ();
			}
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
		 * Clone spirit element.
		 * @return {Element}
		 */
		clone : function () {
			return this.spirit.element.cloneNode ( true );
		},

		/**
		 * @returns {number}
		 */
		ordinal : function () {
			return gui.DOMPlugin.ordinal ( this.spirit.element );
		},

		/**
		 * Compare the DOM position of this spirit against something else.
		 * @see http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-compareDocumentPosition
		 * @param {Element|gui.Spirit} other
		 * @returns {number}
		 */
		compare : function ( other ) {
			return gui.DOMPlugin.compare ( this.spirit.element, other );
		}
		
		
	}, {}, { // Static ...............................................................

		/**
		 * Spiritual-aware innerHTML with special setup for bad WebKit.
		 * @see http://code.google.com/p/chromium/issues/detail?id=13175
		 * @param {Element} element
		 * @param @optional {String} markup
		 */
		html : function ( element, markup ) {
			var nodes, guide = gui.Guide;
			if ( element.nodeType === Node.ELEMENT_NODE ) {
				if ( gui.Type.isString ( markup )) {
					nodes = gui.HTMLParser.parseToNodes ( markup, element.ownerDocument );
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
		 * Spiritual-aware outerHTML with special setup for WebKit.
		 * @TODO can outerHTML carry multiple nodes???
		 * @param {Element} element
		 * @param @optional {String} markup
		 */
		outerHtml : function ( element, markup ) {
			var nodes, parent, res = element.outerHTML;
			var guide = gui.Guide;
			if ( element.nodeType ) {
				if ( gui.Type.isString ( markup )) {
					nodes = gui.HTMLParser.parseToNodes ( markup, element.ownerDocument );
					parent = element.parentNode;
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
			var parent = element.parentNode;
			if ( parent ) {
				var node = parent.firstElementChild;
				while ( node !== null ) {
					if ( node === element ) {
						break;
					} else {
						node = node.nextElementSibling;
						result ++;
					}
				}
			}
			return result;
		},

		/**
		 * Compare document position of two nodes.
		 * @see http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-compareDocumentPosition
		 * @param {Node|gui.Spirit} node1
		 * @param {Node|gui.Spirit} node2
		 * @returns {number}
		 */
		compare : function ( node1, node2 ) {
			node1 = node1 instanceof gui.Spirit ? node1.element : node1;
			node2 = node2 instanceof gui.Spirit ? node2.element : node2;
			return node1.compareDocumentPosition ( node2 );
		},

		/**
		 * Node contains other node?
		 * @param {Node|gui.Spirit} node
		 * @param {Node|gui.Spirit} othernode
		 * @returns {boolean}
		 */
		contains : function ( node, othernode ) {
			var check = Node.DOCUMENT_POSITION_CONTAINS + Node.DOCUMENT_POSITION_PRECEDING;
			return this.compare ( othernode, node ) === check;
		},

		/**
		 * Other node is a following sibling to node?
		 * @param {Node|gui.Spirit} node
		 * @param {Node|gui.Spirit} othernode
		 * @returns {boolean}
		 */
		follows : function ( node, othernode ) {
			return this.compare ( othernode, node ) === Node.DOCUMENT_POSITION_FOLLOWING;
		},

		/**
		 * Other node is a preceding sibling to node?
		 * @param {Node|gui.Spirit} node
		 * @param {Node|gui.Spirit} othernode
		 * @returns {boolean}
		 */
		precedes : function ( node, othernode ) {
			return this.compare ( othernode, node ) === Node.DOCUMENT_POSITION_PRECEDING;
		},

		/**
		 * Is node positioned in page DOM?
		 * @TODO comprehend https://developer.mozilla.org/en/JavaScript/Reference/Operators/Bitwise_Operators#Example:_Flags_and_bitmasks
		 * @param {Element|gui.Spirit} node
		 * @returns {boolean}
		 */
		embedded : function ( node ) {
			node = node instanceof gui.Spirit ? node.element : node;
			return this.contains ( node.ownerDocument, node );
		},

		/**
		 * Remove from list all nodes that are contained by others.
		 * @param {Array<Element|gui.Spirit>} nodes
		 * @returns {Array<Element|gui.Spirit>}
		 */
		group : function ( nodes ) {
			var node, groups = [];
			function containedby ( target, others ) {
				return others.some ( function ( other ) {
					return gui.DOMPlugin.contains ( other, target );
				});
			}
			while (( node = nodes.pop ())) {
				if ( !containedby ( node, nodes )) {
					groups.push ( node );
				}
			}
			return groups;
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
					try {
						result = node.querySelector ( selector );
					} catch ( exception ) {
						console.error ( "Dysfunctional selector: " + selector );
						throw exception;
					}
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
				result = gui.Object.toArray ( node.querySelectorAll ( selector ));
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
 * @TODO: Support two arguments + arguments magic for all of these :/
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
	 * @TODO test for undefined type (spelling mistake etc.)
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
 * @TODO Validate add/remove arguments (important because arguments signature doesn't match other trackers)
 * @TODO Throw an error on remove not added!
 * @TODO Static interface for general consumption.
 * @extends {gui.Tracker}
 * @using {gui.Combo.chained}
 */
gui.EventPlugin = ( function using ( chained ) {

	return gui.Tracker.extend ({

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
 * Interface EventHandler.
 * 
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
	 * Native DOM interface. We'll forward the event to the method `onevent`.
	 * @see http://www.w3.org/TR/DOM-Level-3-Events/#interface-EventListener
	 * @param {Event} e
	 */
	handleEvent : function ( e ) {},

	/**
	 * Conforms to other Spiritual event handlers.
	 * @param {Event} e
	 */
	onevent : function ( e ) {}
};


/**
 * Spirit of the root HTML element.
 * @extends {gui.Spirit}
 */
gui.DocumentSpirit = gui.Spirit.extend ({

	/**
	 * Construct.
	 */
	onconstruct : function () {
		this._super.onconstruct ();
		this._dimension = new gui.Dimension ();
		this.event.add ( "message", this.window );
		this.action.addGlobal ( gui.ACTION_DOC_FIT );
		this._broadcastevents ();
		if ( this.document === document ) {
			this._constructTop ();
		}
		// @TODO iframe hello.
		this.action.dispatchGlobal ( gui.ACTION_DOC_ONCONSTRUCT );
	},

	/**
	 * Get ready.
	 * @TODO think more about late loading (module loading) scenario
	 * @TODO let's go _waiting only if parent is a Spiritual document
	 */
	onready : function () {
		this._super.onready ();
		if (( this.waiting = this.window.gui.hosted )) {
			this.action.addGlobal ( gui.$ACTION_XFRAME_VISIBILITY );
		}
		this.action.dispatchGlobal ( gui.ACTION_DOC_ONSPIRITUALIZED );
		if ( this.document.readyState === "complete" && !this._loaded ) {
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
						if ( !this._loaded ) {
							this._onload (); // @TODO huh? that doesn't exist!
						}
						break;
					case "message" :
						this._onmessage ( e.data );
						break;
				}
				// broadcast event globally?
				var message = gui.DocumentSpirit.broadcastevents [ e.type ];
				if ( gui.Type.isDefined ( message )) {
					this._broadcastevent ( e, message );
				}
		}
	},

	/**
	 * Handle action.s
	 * @param {gui.Action} a
	 */
	onaction : function ( a ) {
		this._super.onaction ( a );
		this.action.$handleownaction = false;
		switch ( a.type ) {
			case gui.ACTION_DOC_FIT : // relay fit, but claim ourselves as new target
				a.consume ();
				this.fit ( a.data === true );
				break;
			case gui.$ACTION_XFRAME_VISIBILITY : 
				this._waiting = false;
				if ( a.data === true ) {
					this.visibility.on ();
				} else {
					this.visibility.off ();
				}
				a.consume ();
				if ( this.window.gui.hasModule ( "flex" )){
					this.flex.reflex ();
				}
				break;
		}
	},

	/**
	 * Don't crawl for visibility inside iframed documents until 
	 * hosting {gui.IframeSpirit} has reported visibility status.
	 * @param {gui.Crawler} crawler
	 */
	oncrawler : function ( crawler ) {
		var dir = this._super.oncrawler ( crawler );
		if ( dir === gui.Crawler.CONTINUE ) {
			switch ( crawler.type ) {
				case gui.CRAWLER_VISIBLE : 
				case gui.CRAWLER_INVISIBLE :
					if ( this._waiting ) {
						dir = gui.Crawler.STOP;
					}
					break;
			}
		}
		return dir;
	},

	/**
	 * Relay visibility from ancestor frame (match iframe visibility).
	 */
	onvisible : function () {
		this.css.remove ( gui.CLASS_INVISIBLE );
		this._super.onvisible ();
	},

	/**
	 * Relay visibility from ancestor frame (match iframe visibility).
	 */
	oninvisible : function () {
		this.css.add ( gui.CLASS_INVISIBLE );
		this._super.onvisible ();
	},

	/**
	 * Invoked onDOMContentLoaded by the {gui.Guide}.
	 * Intercepted by the hosting {gui.IframeSpirit}.
	 */
	ondom : function () {
		this.action.dispatchGlobal ( gui.ACTION_DOC_ONDOMCONTENT );	
	},

	/**
	 * Invoked at window.onload by the {gui.Guide}.
	 * Intercepted by the hosting {gui.IframeSpirit}.
	 */
	onload : function () {
		if ( !this._loaded ) {
			this._loaded = true;
			this.action.dispatchGlobal ( gui.ACTION_DOC_ONLOAD );
			var that = this;
			setTimeout ( function () {
				that.fit ();
			}, gui.Client.STABLETIME );
		} else {
			console.warn ( "@TODO loaded twice..." );
		}
	},

	/**
	 * Invoked at window.onunload by the {gui.Guide}.
	 * Action intercepted by the hosting {gui.IframeSpirit}.
	 * Broadcast intercepted by whoever might need to know. 
	 * @TODO broadcast into global space?
	 */
	onunload : function () {
		var id = this.window.gui.$contextid;
		this.action.dispatchGlobal ( gui.ACTION_DOC_UNLOAD );
		this.broadcast.dispatchGlobal ( gui.BROADCAST_WILL_UNLOAD, id );
		this.broadcast.dispatchGlobal ( gui.BROADCAST_UNLOAD, id );
	},

	/**
	 * TODO: rename to "seamless" or "fitiframe" ?
	 * Dispatch fitness info. Please invoke this method whenever 
	 * height changes: Parent iframes will resize to fit content.
	 */
	fit : function ( force ) {
		if ( this._loaded || force ) {
			var dim = this._getDimension ();
			if ( !gui.Dimension.isEqual ( this._dimension, dim )) {
				this._dimension = dim;
				this._dispatchFit ();
			}
		}
	},

	/**
	 * Propagate broadcast cross-iframes, recursively posting to neighboring documentspirits.
	 *
	 * 1. Propagate descending
	 * 2. Propagate ascending
	 * @TODO Don't post to universal domain "*" let's bypass the iframe spirit for this...
	 * @param {gui.Broadcast} b
	 */
	propagateBroadcast : function ( b ) {
		var id, ids = b.$contextids;
		ids.push ( this.window.gui.$contextid );
		var iframes = this.dom.qall ( "iframe", gui.IframeSpirit ).filter ( function ( iframe ) {
			id = iframe.$instanceid;
			if ( ids.indexOf ( id ) > -1 ) {
				return false;
			} else {
				ids.push ( id );
				return true;
			}
		});
		var msg = gui.Broadcast.stringify ( b );
		iframes.forEach ( function ( iframe ) {
			iframe.contentWindow.postMessage ( msg, "*" );
		});
		if ( this.window !== this.window.parent ) {
			this.window.parent.postMessage ( msg, "*" );
		}
	},
	
	
	// Private ...................................................................

	/**
	 * Flipped on window.onload
	 * @type {boolean}
	 */
	_loaded : false,

	/**
	 * Waiting for hosting {gui.IframeSpirit} to relay visibility status?
	 * @type {boolean}
	 */
	_waiting : false,

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
	 * Setup to fire global broadcasts on common DOM events.
	 * @see {gui.DocumentSpirit#onevent}
	 */
	_broadcastevents : function () {
		Object.keys ( gui.DocumentSpirit.broadcastevents ).forEach ( function ( type ) {
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
	},

	/**
	 * Fire global broadcast on DOM event.
	 * @param {Event} e
	 * @param {String} message
	 */
	_broadcastevent : function ( e, message ) {
		switch ( e.type ) {
				case "mousemove" :
				case "touchmove" :
					try {
						gui.broadcastGlobal ( message, e );
					} catch ( exception ) {
						this.event.remove ( e.type, e.target );
						throw exception;
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
	 * @param {String} msg
	 */
	_onmessage : function ( msg ) {
		var pattern = "spiritual-broadcast";
		if ( msg.startsWith ( pattern )) {
			var b = gui.Broadcast.parse ( msg );
			if ( this._relaybroadcast ( b.$contextids )) {
				gui.Broadcast.$dispatch ( b );
			}
		} else {
			pattern = "spiritual-action";
			if ( msg.startsWith ( pattern )) {
				var a = gui.Action.parse ( msg );
				if ( a.direction === gui.Action.DESCEND ) {
					if ( a.$instanceid === this.window.gui.$contextid ) {
						this.action.$handleownaction = true;
						this.action.descendGlobal ( 
							a.type, 
							a.data
						);
					}
				}
			}
		}
	},

	/**
	 * Should relay broadcast that has been postmessaged somwhat over-aggresively?
	 * @param {Array<String>} ids
	 * @returns {boolean}
	 */
	_relaybroadcast : function ( ids ) {
		return [ gui.$contextid, this.window.gui.$contextid ].every ( function ( id ) {
			return ids.indexOf ( id ) < 0;
		});
	},

	/**
	 * Dispatch document fit. Google Chrome may fail 
	 * to refresh the scrollbar properly at this point.
	 */
	_dispatchFit : function () {
		var dim = this._dimension;
		this.action.dispatchGlobal ( gui.ACTION_DOC_FIT, {
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
		}, gui.TIMEOUT_RESIZE_END );
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
	 * Mapping DOM events to broadcast messages.
	 * @type {Map<String,String>}
	 */
	broadcastevents : {
		"click" : gui.BROADCAST_MOUSECLICK,
		"mousedown" : gui.BROADCAST_MOUSEDOWN,
		"mouseup" : gui.BROADCAST_MOUSEUP,
		"scroll" : gui.BROADCAST_SCROLL, // top ?
		"resize" : gui.BROADCAST_RESIZE, // top ?
		"hashchange" : gui.BROADCAST_HASHCHANGE, // top ?
		"popstate" : gui.BROADCAST_POPSTATE // top ?
		// "mousemove" : gui.BROADCAST_MOUSEMOVE (pending simplified gui.EventSummay)
	}
});


/**
 * Spirit of the iframe.
 * @extends {gui.Spirit}
 */
gui.IframeSpirit = gui.Spirit.extend ({

	/**
	 * Flipped when the *hosted* document is loaded and spiritualized.
	 * @type {boolean}
	 */
	spiritualized : false,

	/**
	 * Cover content while loading?
	 * @type {boolean}
	 */
	cover : false,

	/**
	 * Fit height to contained document height (seamless style)?
	 * @type {boolean}
	 */
	fit : false,

	/**
	 * Cross domain origin of hosted document (if that's the case).
	 * @type {String} `http://iframehost.com:8888`
	 */
	xguest : null,

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
			// @TODO Or else the getter malfunctions! (still relevant?)
		}
	},

	/**
	 * Stamp SRC on startup.
	 */
	onenter : function () {
		this._super.onenter ();
		this.event.add ( "message", this.window, this );
		this.action.addGlobal ([ // in order of appearance
			gui.ACTION_DOC_ONCONSTRUCT,
			gui.ACTION_DOC_ONDOMCONTENT,
			gui.ACTION_DOC_ONLOAD,
			gui.ACTION_DOC_ONSPIRITUALIZED,
			gui.ACTION_DOC_UNLOAD,
			gui.ACTION_DOC_FIT
		]);
		if ( this.fit ) {
			this.css.height = 0;
		}
		if ( this.cover ) {
			this._coverup ();
		}
		var src = this.element.src;
		if ( src && src !== gui.IframeSpirit.SRC_DEFAULT ) {
			this.src ( src );
		}
	},

	/**
	 * Handle action.
	 * @param {gui.Action} a
	 */
	onaction : function ( a ) {
		this._super.onaction ( a );
		this.action.$handleownaction = false;
		switch ( a.type ) {
			case gui.ACTION_DOC_ONCONSTRUCT :
				this.life.dispatch ( gui.LIFE_IFRAME_CONSTRUCT );
				this.action.remove ( a.type );
				a.consume ();
				break;
			case gui.ACTION_DOC_ONDOMCONTENT :
				this.life.dispatch ( gui.LIFE_IFRAME_DOMCONTENT );
				this.action.remove ( a.type );
				a.consume ();
				break;
			case gui.ACTION_DOC_ONLOAD :
				this.life.dispatch ( gui.LIFE_IFRAME_ONLOAD );
				this.action.remove ( a.type );
				a.consume ();
				break;
			case gui.ACTION_DOC_ONSPIRITUALIZED :
				this._onspiritualized ();
				this.life.dispatch ( gui.LIFE_IFRAME_SPIRITUALIZED );
				this.action.remove ( a.type );
				a.consume (); 
				break;
			case gui.ACTION_DOC_UNLOAD :
				this._onunload ();
				this.life.dispatch ( gui.LIFE_IFRAME_UNLOAD );
				this.action.add ([
					gui.ACTION_DOC_ONCONSTRUCT,
					gui.ACTION_DOC_ONDOMCONTENT,
					gui.ACTION_DOC_ONLOAD,
					gui.ACTION_DOC_ONSPIRITUALIZED
				]);
				a.consume ();
				break;
			case gui.ACTION_DOC_FIT :
				this._onfit ( a.data.height );
				a.consume ();
				break;
		}
	},
	
	/**
	 * Handle event.
	 * @param {Event} e
	 */
	onevent : function ( e ) {
		this._super.onevent ( e );
		if ( e.type === "message" && this.xguest ) {
			this._onmessage ( e.data );
		}
	},

	/**
	 * Status visible.
	 */
	onvisible : function () {
		this._super.onvisible ();
		if ( this.spiritualized ) {
			this._visibility ();
		}
	},

	/*
	 * Status invisible.
	 */
	oninvisible : function () {
		this._super.oninvisible ();
		if ( this.spiritualized ) {
			this._visibility ();
		}
	},

	/**
	 * Get and set the iframe source. Set in markup using <iframe gui.src="x"/> 
	 * if you need to postpone iframe loading until the spirit gets initialized.
	 * @param @optional {String} src
	 */
	src : function ( src ) {
		var doc = this.document;
		if ( gui.Type.isString ( src )) {
			if ( gui.URL.external ( src, doc )) {
				var url = new gui.URL ( doc, src );
				this.xguest = url.protocol + "//" + url.host;
				src = gui.IframeSpirit.sign ( src, doc, this.$instanceid );
			}
			this.element.src = src;
		} else {
			return this.element.src;
		}
	},


	// Private ..................................................................
	
	/**
	 * Optionally covers the iframe while loading using <iframe gui.fit="true"/>
	 * @type {gui.CoverSpirit}
	 */
	_cover : null,

	/**
	 * Hosted document spiritualized.
	 * @return {[type]} [description]
	 */
	_onspiritualized : function () {
		this.spiritualized = true;
		this._visibility ();
		if ( this.cover && !this.fit ) {
			this._coverup ( false );
		}
	},

	/**
	 * Hosted document changed size. Resize to fit? 
	 * Dispatching an action to {gui.DocumentSpirit}
	 * @param {number} height
	 */
	_onfit : function ( height ) {
		if ( this.fit ) {
			this.css.height = height;
			this.action.dispatchGlobal ( gui.ACTION_DOC_FIT );
		}
		if ( this.cover ) {
			this._coverup ( false );
		}
	},

	/**
	 * Hosted document unloading.
	 */
	_onunload : function () {
		this.spiritualized = false;
		if ( this.fit ) {
			this.css.height = 0;
		}
		if ( this.cover ) {
			this._coverup ( true );
		}
	},

	/**
	 * Handle posted message, scanning for ascending actions. 
	 * Descending actions are handled by the documentspirit.
	 * @TODO Don't claim this as action target!
	 * @see {gui.DocumentSpirit._onmessage}
	 * @param {String} msg
	 */
	_onmessage : function ( msg ) {
		if ( this.xguest && msg.startsWith ( "spiritual-action:" )) {
			var a = gui.Action.parse ( msg );
			if ( a.direction === gui.Action.ASCEND ) {
				if ( a.$instanceid === this.$instanceid ) {
					this.action.$handleownaction = true;
					this.action.ascendGlobal ( a.type, a.data );
				}
			}
		}
	},

	/**
	 * Teleport visibility crawler to hosted document. 
	 * Action intercepted by the {gui.DocumentSpirit}.
	 */
	_visibility : function () {
		if ( gui.Type.isDefined ( this.life.visible )) {
			this.action.descendGlobal ( gui.$ACTION_XFRAME_VISIBILITY, this.life.visible );
		}
	},

	/**
	 * Hosting external document?
	 * @param {String} src
	 * @returns {boolean}
	 */
	_xguest : function ( src ) {
		return this.att.get ( "sandbox" ) || gui.URL.external ( src, this.document );
	},

	/**
	 * Cover the iframe while loading to block flashing effects. Please note that the 
	 * ".gui-cover" classname must be fitted with a background color for this to work.
	 * @param {boolean} cover
	 */
	_coverup : function ( cover ) {
		var box = this.box;
		this._cover = this._cover || this.dom.after ( gui.CoverSpirit.summon ( this.document ));
		if ( cover ) {
			this._cover.position ( new gui.Geometry ( box.localX, box.localY, box.width, box.height ));
			this._cover.dom.show ();
		} else {
			this._cover.dom.hide ();
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
			if ( gui.URL.external ( src, doc )) { // should be moved to src() method (but fails)!!!!!
				var url = new gui.URL ( doc, src );
				spirit.xguest = url.protocol + "//" + url.host;
				src = this.sign ( src, doc, spirit.$instanceid );
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
	 * Sign URL with cross-domain credentials 
	 * and key to identify the IframeSpirit.
	 * @param {String} url
	 * @param {Document} doc
	 * @param {String} contextid
	 * @returns {String}
	 */
	sign : function ( url, doc, contextid ) {
		var loc = doc.location;
		var uri = loc.protocol + "//" + loc.host;
		var sig = uri + "/" + contextid;
		url = gui.URL.setParam ( url, gui.PARAM_CONTEXTID, sig );
		console.log ( "IframeSpirit", url );
		return url;
	},

	/**
	 * Remove $contextid from URL (for whatever reason).
	 * @param {String} url
	 * @param {String} sign
	 * @returns {String}
	 */
	unsign : function ( url ) {	
		return gui.URL.setParam ( url, gui.PARAM_CONTEXTID, null );
	}

});


/**
 * Spirit of the stylesheet.
 * @see http://www.quirksmode.org/dom/w3c_css.html
 * @extends {gui.Spirit}
 */
gui.StyleSheetSpirit = gui.Spirit.extend ({

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
	 * @param {Map<String,Map<String,String>>} rules
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
 * @deprecated
 * Spirit of the cover. Use it to cover stuff up. Note that the cover should 
 * be fitted with a background-color in CSS in order to actually cover stuff.
 * TODO: get this out of here...
 * @extends {gui.Spirit}
 */
gui.CoverSpirit = gui.Spirit.extend ({

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
	 * Position cover.
	 * @TODO: inject default styling
	 * @param {gui.Geometry} geo
	 */
	position : function ( geo ) {
		this.css.style ({
			top : geo.y,
			left : geo.x,
			width : geo.w,
			height : geo.h
		});
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
	 * @param @optional {gui.Geometry} geo
	 * @returns {gui.CoverSpirit}
	 */
	summon : function ( doc, geo ) {
		var spirit = this.possess ( doc.createElement ( "div" ));
		spirit.css.add ( gui.CLASS_COVER );
		if ( geo ) {
			spirit.position ( geo );
		}
		return spirit;
	}
});


/**
 * It's the spirits module.
 */
gui.module ( "spirits", {

	/**
	 * Channel spirits for CSS selectors.
	 */
	channels : [
		
		[ "html", gui.DocumentSpirit ],
		[ ".gui-styles", gui.StyleSheetSpirit ], // @TODO fix or deprecate
		[ ".gui-iframe", gui.IframeSpirit ],
		[ ".gui-cover", gui.CoverSpirit ],
		[ ".gui-spirit", gui.Spirit ]
	],

	/**
	 * Assign plugins to prefixes for all {gui.Spirit}.
	 */
	plugins : {
		
		"att" : gui.AttPlugin, 
		"attconfig" : gui.AttConfigPlugin,
		"box" : gui.BoxPlugin,
		"css" : gui.CSSPlugin,
		"dom" : gui.DOMPlugin,
		"event" : gui.EventPlugin,
		"life" : gui.LifePlugin
 },

	/**
	 * Methods added to {gui.Spirit.prototype}
	 */
	mixins : {

		/**
		 * Handle attribute.
		 * @param {gui.Att} att
		 */
		onatt : function ( att ) {},

		/**
		 * Handle event.
		 * @param {Event} event
		 */
		onevent : function ( event ) {},

		/**
		 * Handle lifecycle event.
		 * @param {gui.Life} life
		 */
		onlife : function ( life ) {},

		/**
		 * Native DOM interface. We'll forward the event to the method `onevent`.
		 * @see http://www.w3.org/TR/DOM-Level-3-Events/#interface-EventListener
		 * @param {Event} e
		 */
		handleEvent : function ( e ) {
			this.onevent ( e );
		}
	}

});


}( this ));