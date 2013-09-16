/**
 * Spiritual GUI
 * 2013 Wunderbyte
 * Spiritual is freely distributable under the MIT license.
 */
( function ( window ) {

// "use strict";


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
	polyfill : function ( win, worker ) {this._strings	( win );
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
		/*
		 * @TODO: clean this up!
		 * @TODO: use framelement!
		 */
		var id, xhost, splits, param = gui.PARAM_CONTEXTID;
		if ( url.contains ( param )) {
			splits = gui.URL.getParam ( url, param ).split ( "/" );
			id = splits.pop ();
			xhost = splits.join ( "/" );
		} else if ( document.referrer.contains ( param )) {
			splits = gui.URL.getParam ( document.referrer, param ).split ( "/" );
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
		gui.Broadcast.removeGlobal (gui.BROADCAST_KICKSTART, this); //we don't need to listen anymore
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
				//@TODO: DANIEL WAS HERE, WE NEED A BETTER FIX
				//@TODO: if inputspirit uses the cssplugin, when listing the methods on infuse, isMethod will call get() here on the prototype, which doesn't have a spirit, so it'll fail miserably.
				if (!this.spirit){ 
					return;
				}
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
						return el.spirit && ( el.spirit instanceof type );
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


/**
 * Do what Spiritual does by overloading JQuery methods instead of native DOM methods.
 * @TODO reduce crawled collections using compareDocumentPosition (also on following and preceding)
 * @TODO (Angular special) handle function replaceWith, "a special jqLite.replaceWith, which can replace items which have no parents"
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
	 * Note that we add a double underscore.
	 * @param {jQuery} jq
	 */
	_expandos : function ( jq ) {
		jq.__suspend = false;
		[ 
			"spiritualize", 
			"spiritualizeSub", 
			"spiritualizeOne",
			"materialize", 
			"materializeSub", 
			"materializeOne",
			"detach"
		].forEach ( function ( method ) {
			jq.fn [ "__" + method ] = function () {
				gui.DOMPlugin.group ( Array.map ( this, function ( elm ) {
					return elm; // this.toArray () doesn't seem to compute :/
				})).forEach ( function ( elm ) {
					gui.Guide [ method ] ( elm );
				});
				return this;
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
				var del = name === "removeAttr";
				val = del ? null : val;
				if ( val !== undefined || del ) {
					this.each ( function ( i, elm ) {
						if ( elm.spirit ) {
							if ( val !== undefined || del ) {
								elm.spirit.att.set ( nam, val ); // trigger attribute setters
							}
						}
					});
				}
				return naive [ name ].apply ( this, arguments ); // @TODO: before spirit.att.set?
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
							this.__detach ();
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
							// note: materialize(sub) is skipped here!
							this.parent ().__materializeOne ();
							res = suber ();
							break;
						case "wrap" :
						case "wrapAll" :
							// note: materialize(sub) is skipped here!
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
						gui.Guide.detach ( b.elm );
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
	 * @TODO Replicate setup in {gui.Guide-_containerspirits} to minimize crawling
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

	return gui.Tracker.extend ({

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
				if ( this._removechecks ( type, [ this._global ])) {
					if ( this._global ) {
						gui.Broadcast.removeGlobal ( message, this );
					} else {
						gui.Broadcast.remove ( message, this, sig );
					}
				}
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
					if ( this._containschecks ( tween.type, [ b.global ])) {
						this.spirit.ontween ( tween ); // @TODO: try-catch for destructed spirit
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
gui.TransitionPlugin = gui.Plugin.extend ({

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
				"explorer" : "transitionend",
				"gecko" : "transitionend",
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
 * @using {gui.Combo.chained}
 */
gui.AttentionPlugin = ( function using ( chained ) {

	return gui.Plugin.extend ({

		/**
		 * Trapping TAB navigation inside the spirit subtree.
		 * @returns {gui.AttentionPlugin}
		 */
		trap : chained ( function () {
			if ( !this._trapping ) {
				this._trapping = true;
				this._listen ( true );
				this._setup ();
			}
		}),

		/**
		 * Focus the latest focused element, if any, defaulting to first focusable element.
		 * @returns {gui.AttentionPlugin}
		 */
		enter : chained ( function () {
			if ( !this._focused ) {
				if ( this._latest ) {
					this._latest.focus ();
				} else {
					this._first ();
				}
			}
		}),

		/**
		 * Blur anything that might be focused and instigate attention move.
		 * @returns {gui.AttentionPlugin}
		 */
		exit : chained ( function () {
			if ( this._focused && this._latest ) {
				this._latest.blur ();
			}
			this._exit ();
		}),

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
			if ( b.type === gui.BROADCAST_ATTENTION_MOVE ) {
				if ( b.data === this.spirit.$instanceid ) {
					this.enter();
				}
			}
		},

		/**
		 * Destuction time.
		 */
		ondestruct : function () {
			this._super.ondestruct ();
			if ( this._trapping ) {
				this._listen ( false );
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
		 * Attention trap entered?
		 * @type {number}
		 */
		_entered : false,

		/**
		 * Append hidden inputs. When these are 
		 * focused, we move the focus elsewhere.
		 */
		_setup : function () {
			[ "before", "after" ].forEach ( function ( pos ) {
				var elm = this._input ( pos );
				var dom = this.spirit.dom;
				if ( pos === "before" ) {
					dom.prepend ( elm ); // @TODO try before
				} else {
					dom.append ( elm ); // @TODO try after
				}
			}, this );
		},

		/**
		 * Listen and unlisten for all sorts of stuff going on.
		 * @TODO use focusin and focusout for IE/Opera?
		 * @param {boolean} listen
		 */
		_listen : function ( listen ) {
			var element = this.spirit.element;
			var action1 = listen ? "addEventListener" : "removeEventListener";
			var action2 = listen ? "addGlobal" : "removeGlobal";
			element [ action1 ] ( "focus", this, true );
			element [ action1 ] ( "blur", this, true );
			gui.Broadcast [ action2 ] ( gui.BROADCAST_ATTENTION_MOVE, this );
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
					height : 10,
					width : 10,
					top: -5000
				}
			);
			elm.className = "_gui-focus_" + pos;
			return elm;
		},

		/**
		 * Focus first focusable element and return it.
		 * @returns {Element}
		 */
		_first : function () {
			return this._find ( true );
		},

		/**
		 * Focus last focusable element and return it.
		 * @returns {Element}
		 */
		_last : function () {
			return this._find ( false );
		},

		/**
		 * Focus first or last focusable element and return it.
		 * @param {boolean} isfirst
		 * @returns {Element}
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
		 * List descendant links plus form controls minus input @type="image".
		 * @returns {Array<Element>}
		 */
		_elements : function () {
			return this.spirit.dom.descendants ().filter ( function ( elm ) {
				return this._focusable ( elm );
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
			if ( !this._entered ) { // trap just entered?
				this._entered = true;
				this._enter ();
			}
			var klas = elm.className; // was hidden input?
			if ( klas.startsWith ( "_gui-focus" )) {
				if ( klas.contains ( "after" )) {
					this._first ();
				} else {
					this._last ();
				}
			}
		},

		/**
		 * Something was blurred. If nothing new gets focused soon, we determine 
		 * that an exit was performed. Not that this doesn't move to focus back 
		 * to any previous zone, you must invoke a manual 'exit()' for this.
		 * @param {Element} elm (not used)
		 */
		_onblur : function ( elm ) {
			var that = this;
			this._focused = false;
			setTimeout(function(){
				if ( !that._focused ) {
					that._entered = false;
				}
			});
		},

		/**
		 * Broadcast zone entered-
		 */
		_enter : function () {
			gui.Broadcast.dispatchGlobal ( null,
				gui.BROADCAST_ATTENTION_ENTER,
				this.spirit.$instanceid
			);
		},

		/**
		 * Broadcast zone exited.
		 */
		_exit : function () {
			gui.Broadcast.dispatchGlobal ( null,
				gui.BROADCAST_ATTENTION_EXIT,
				this.spirit.$instanceid
			);
		}


	}, { // Static ........................................................................

		/**
		 * Listing $instanceids.
		 * @type {Array<String>}
		 */
		_queue : [],

		/**
		 * Get latest $instanceid.
		 * @TODO continue until next is not hidden.
		 * @returns {String}
		 */
		_last : function () {
			var q = this._queue; 
			return q [ q.length - 1 ];
		},

		/**
		 * Handle broadcast.
		 * @param {gui.Broadcast} b
		 */
		onbroadcast : function ( b ) {
			var q = this._queue;
			var id = b.data;
			switch ( b.type ) {
				case gui.BROADCAST_ATTENTION_ENTER :
					if ( this._last () !== id ) {
						q.push ( id );
					}
					break;
				case gui.BROADCAST_ATTENTION_EXIT :
					var that = this;
					setTimeout ( function () {
						that._update ( id );
					}, 0 );
					break;
			}
		},

		/**
		 * Update attention.
		 * @param {String} id
		 */
		_update : function ( id ) {
			var q = this._queue;
			if ( this._last () === id ) {
				q = this._queue = q.filter ( function ( i ) {
					return i !== id;
				});
			}
			if ( q.length ) {
				gui.Broadcast.dispatchGlobal ( null,
					gui.BROADCAST_ATTENTION_MOVE,
					this._last ()
				);
			}
		}

	});

}( gui.Combo.chained ));

/**
 * Manage attention queue.
 */
( function () {
	gui.Broadcast.addGlobal ([ 
		gui.BROADCAST_ATTENTION_ENTER,
		gui.BROADCAST_ATTENTION_EXIT
	], gui.AttentionPlugin );
}());


/**
 * Visibility is an abstract status. When you mark a spirit as visible or invisible, 
 * the methods `onvisible` or `oninvisible` will be called on spirit and descendants. 
 * Current visibility status can be read in the {gui.LifePlugin}: `spirit.life.visible`.
 * Visibility is resolved async, so this property is `undefined` on startup. If you need 
 * to take an action that depends on visibility, just wait for `onvisible` to be invoked.
 * @TODO: Figure out if document.elementFromPoint() could be used to detect hidden stuff.
 * @TODO: hook this up to http://www.w3.org/TR/page-visibility/
 * @TODO: Make sure that visibility is updated after `appendChild` to another position.
 * @extends {gui.Plugin}
 * @using {gui.Combo.chained}
 */
gui.VisibilityPlugin = ( function using ( chained ) {

	return gui.Plugin.extend ({

		/**
		 * Mark spirit visible.
		 * @returns {gui.VisibilityPlugin}
		 */
		on : chained ( function () {
			gui.VisibilityPlugin.on ( this.spirit );
		}),

		/**
		 * Mark spirit invisible.
		 * @returns {gui.VisibilityPlugin}
		 */
		off : chained ( function () {
			gui.VisibilityPlugin.off ( this.spirit );
		})


	}, {}, { // Static ................................................................

		/**
		 * Mark spirit visible. This will remove the `._gui-invisible` 
		 * classname and invoke `onvisible` on spirit and descendants. 
		 * Once visibility has been resolved on startup, the target 
		 * spirit must be marked invisible for this to have effect.
		 * @param {gui.Spirit} spirit
		 */
		on : function ( spirit ) {
			var classname = gui.CLASS_INVISIBLE;
			if ( spirit.life.visible === undefined || spirit.css.contains ( classname )) {
				spirit.css.remove ( classname );
				this._go ( spirit, true );
			}
		},

		/**
		 * Mark spirit invisible. This will append the `._gui-invisible` 
		 * classname and invoke `oninvisible` on spirit and descendants.
		 * @param {gui.Spirit} spirit
		 */
		off : function ( spirit ) {
			var classname = gui.CLASS_INVISIBLE;
			switch ( spirit.life.visible ) {
				case true :
				case undefined :
					spirit.css.add ( classname );
					this._go ( spirit, false );
					break;
			}
		},


		// Secret static ..............................................................
		 
		/**
		 * Initialize spirit visibility. 
		 * @TODO again after `appendChild` to another position.
		 * Invoked by the {gui.Guide}.
		 * @param {gui.Spirit} spirit
		 */
		$init : function ( spirit ) {
			this._go ( spirit, !this._invisible ( spirit ));
		},


		// Private static ..............................................................
		
		/**
		 * Spirit is invisible? The point here is to not evaluate these potentially 
		 * costly selectors for all new spirits, so do prefer not to use this method. 
		 * Wait instread for methods `onvisible` and `oninvisible` to be invoked.
		 * @param {gui.Spirit} spirit
		 * @returns {boolean}
		 */
		_invisible : function ( spirit ) {
			return spirit.css.contains ( gui.CLASS_INVISIBLE ) || 
			spirit.css.matches ( "." + gui.CLASS_INVISIBLE + " *" );
		},

		/**
		 * Recursively update spirit and descendants visibility.
		 * @param {gui.Spirit} first
		 * @param {boolean} show
		 */
		_go : function ( first, visible ) {
			var type = visible ? gui.CRAWLER_VISIBLE : gui.CRAWLER_INVISIBLE;
			new gui.Crawler ( type ).descendGlobal ( first, {
				handleSpirit : function ( spirit ) {
					var init = spirit.life.visible === undefined;
					if ( spirit !== first && spirit.css.contains ( gui.CLASS_INVISIBLE )) {
						return gui.Crawler.SKIP_CHILDREN;
					} else if ( visible ) {
						if ( !spirit.life.visible || init ) {
							spirit.life.visible = true;
							spirit.life.dispatch ( gui.LIFE_VISIBLE ); // TODO: somehow after the fact!
							spirit.onvisible ();
						}
					} else {
						if ( spirit.life.visible || init ) {
							spirit.life.visible = false;
							spirit.life.dispatch ( gui.LIFE_INVISIBLE );
							spirit.oninvisible ();
						}
					}
				}
			});
		}

	});

}( gui.Combo.chained ));


/**
 * It's the layout module.
 */
gui.module ( "layout", {

	/**
	 * Assign plugins to prefixes for all {gui.Spirit}.
	 */
	plugins : {
		
		"attention" : gui.AttentionPlugin,
		"tween" : gui.TweenPlugin,
		"transition" : gui.TransitionPlugin,
		"visibility" : gui.VisibilityPlugin
 },

	/**
	 * Methods added to {gui.Spirit.prototype}
	 */
	mixins : {

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
		 * Handle visibility.
		 */
		onvisible : function () {},

		/**
		 * Handle invisibility.
		 */
		oninvisible : function () {}
	}

});


/**
 * Facilitate flexbox-like layouts in IE9 
 * provided a fixed classname structure.
 * @extends {gui.Plugin}
 */
gui.FlexPlugin = gui.Plugin.extend ({

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
		var display, boxes = [];
		new gui.Crawler ( "flexcrawler" ).descend ( elm, {
			handleElement : function ( elm ) {
				try {
					display = gui.CSSPlugin.compute ( elm, "display" );
				} catch ( geckoexception ) { // probably display:none
					return gui.Crawler.STOP;
				}
				if ( display === "none" ) { 
					return gui.Crawler.SKIP_CHILDREN;
				} else if ( gui.FlexPlugin._isflex ( elm, disabled )) {
					boxes.push ( new gui.FlexBox ( elm ));
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
	 * Collect child flexes. Disabled members enter as 0.
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
	 * Generating 10 unique classnames. For native flex only; 
	 * emulated flex reads the value from the class attribute.
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
			var sheets = this._getsheets ( context.gui.$contextid );
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
		delete this._sheets [ context.gui.$contextid ];
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
		"display" : "block"
		//"width" : "100%",
		//"height" : "100%"
	},
	/*
	".flexcol > .flexrow" : { // hmm...
		"height" : "100%"
	},
	*/
	".flexrow" : {
		"white-space" : "nowrap"
	},
	".flexrow > *" : {
		"display" : "inline-block",
		"vertical-align" : "top",
		"white-space" : "normal",
		"height" : "100%"
	},
	".flexrow > ._flexcorrect" : {
		"margin" : "0 0 0 -4px !important" // @TODO correlate to computed font-size :)
	},
	".flexcol > *" : {
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
			writable : true,
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
	},

	/**
	 * Inject the relevant stylesheet (native or emulated) before startup spiritualization.
	 * @todo Make sure stylesheet onload has fired to prevent flash of unflexed content?
	 * @param {Window} context
	 */
	onbeforespiritualize : function ( context ) {
		this._edbsetup ( context );
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
		var root = context.document.documentElement.spirit;
		if ( context.gui.flexmode === gui.FLEXMODE_EMULATED ) {
			try {
				gui.CSSPlugin.compute ( root, "display" );
				context.gui.reflex ();
			} catch ( geckoexception ) {
				/*
				if ( !gui.Type.isDefined ( root.life.visibility )) {
					root.life.add ( gui.LIFE_VISIBLE, this ); // doesn't work...
				}
				*/
			}
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

	/**
	 * Still no luck with Gecko unless we alert at this point :(
	 * Perhaps onvisible not updated right in gui.DocumentSpirit?
	 * @param {gui.Life} life
	 *
	onlife : function ( life ) {
		if ( life.type === gui.LIFE_VISIBLE ) {
			setTimeout(function(){
				life.target.window.gui.reflex ();
			},250);
		}
	},
	*/


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
					/* 
					 * @TODO: We think that some kind of DOM-hookin will do this 
					 * again after some milliseconds, it should only happen once.
					 */
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
	 * @param {Node|gui.Spirit} child
	 */
	function flexparent ( child ) {
		var doc, win;
		child = child instanceof gui.Spirit ? child.element : child;
		doc = child.ownerDocument;
		win = doc.defaultView;
		if ( win.gui.flexmode === gui.FLEXMODE_EMULATED ) {
			if ( gui.DOMPlugin.embedded ( child )) {
				child = child === doc.documentElement ? child : child.parentNode;
				gui.Tick.next ( function () {
					try {
						gui.FlexPlugin.reflex ( child );
					} catch ( unloadedexception ) {
						// TODO: Don't go here
					}
				});
			}
		}
	}

	/*
	 * @TODO: public hooks for this kind of thing
	 */
	[ "_spiritualize", "_materialize" ].forEach ( function ( method ) {
		gui.Function.decorateAfter ( guide, method, flexparent );
	});

}( gui.Guide ));


/**
 * Key event summary.
 * @TODO check out http://mozilla.pettay.fi/moztests/events/browser-keyCodes.htm
 * @param {boolean} down
 * @param {number} n KeyCode
 * @param {number} c Character
 * @param {boolean} g Global?
 */
gui.Key = function Key ( down, type, isglobal ) {
	this.down = down;
	this.type = type;
	this.global = isglobal;
};

gui.Key.prototype = {

	/**
	 * Key down? Otherwise up.
	 * @type {boolean}
	 */
	down : false,

	/**
	 * Reducing 'key', 'char' and potentially 'keyCode' to a single string. If 
	 * the string length is greater than one, we are dealing with a special key. 
	 * @TODO: Note about the SPACE character - how exactly should we handle it?
	 * @type {[type]}
	 */
	type : null,

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
 * Mapping DOM0 key codes to DOM3 key values. Note that keycodes aren't used on an API level.
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#key-values
 */
( function keymappings () {
	gui.Key.$key = gui.Object.extend ({
		
		// navigation

		38 : "Up",
		40 : "Down",
		37 : "Left",
		39 : "Right",

		// modifiers

		18 : "Alt",
		17 : "Control",
		16 : "Shift",
		32 : "Space",

		// extras

		27 : "Esc",
		13 : "Enter"

	}, Object.create ( null ));
}());

/*
"Alt"
"AltGraph"
"CapsLock"
"Control"
"Fn"
"FnLock"
"Meta"
"Process"
"NumLock"
"Shift"
"SymbolLock"
"OS"
"Compose"


/**
 * Create constant 'gui.Key.DOWN' to alias the string "Down" for those who prefer such a syntax.
 * @TODO Compute appropriate translation of pascal-case to underscores.
 */
( function keyconstants () {
	gui.Object.each ( gui.Key.$key, function ( key, value ) {
		gui.Key [ value.toUpperCase ()] = value;
	});
}());



/**
 * These key codes "do not usually change" with keyboard layouts.
 * @TODO Read http://www.w3.org/TR/DOM-Level-3-Events/#key-values
 * @TODO http://www.w3.org/TR/DOM-Level-3-Events/#fixed-virtual-key-codes
 * @TODO http://www.w3.org/TR/DOM-Level-3-Events/#key-values-list
 *
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
*/

/**
 * These codes are somewhat likely to match a US or European keyboard, 
 * but they are not listed in "do not usually change" section above. 
 *
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
*/





/**
 * Tracking keys.
 * @extends {gui.Tracker}
 * @using {gui.Arguments#confirmed}
 * @using {gui.Combo#chained}
 */
gui.KeyPlugin = ( function using ( confirmed, chained ) {

	return gui.Tracker.extend ({
	
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
						if ( this._addchecks ( String ( a ), [ handler, this._global ])) {
							this._setupbroadcast ( true );
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
						if ( this._removechecks ( String ( a ), [ handler, this._global ])) {
							if ( !this._hashandlers ()) {
								this._setupbroadcast ( false );
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
			var list, checks, handler, isglobal;
			if ( b.type === gui.BROADCAST_KEYEVENT ) {
				var down = b.data.down, type = b.data.type;
				if (( list = ( this._trackedtypes [ type ]))) {
					list.forEach ( function ( checks ) {
						handler = checks [ 0 ];
						isglobal = checks [ 1 ];
						if ( isglobal === b.global ) {
							handler.onkey ( new gui.Key ( down, type, isglobal ));
						}
					});
				}
			}
		},


		// Private .....................................................................
		
		/**
		 * Start and stop listening for broadcasted key event details.
		 * @param {boolean} add
		 */
		_setupbroadcast : function ( add ) {
			var act, sig = this.context.gui.$contextid;
			var type = gui.BROADCAST_KEYEVENT;
			if ( this._global ) {
				act = add ? "addGlobal" : "removeGlobal";
				gui.Broadcast [ act ] ( type, this );
			} else {
				act = add ? "add" : "remove";
				gui.Broadcast [ act ] ( type, this, sig );
			}
		},

		/**
		 * Remove delegated handlers. 
		 * @TODO same as in gui.ActionPlugin, perhaps superize this stuff somehow...
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
 * Spirit of the key combo listener.
 * <meta content="key" value="Control s" onkey="alert(this)"/>
 */
gui.KeySpirit = gui.Spirit.extend ({

	/**
	 * Get ready.
	 */
	onready : function () {
		this._super.onready ();
		this._map = Object.create ( null );
		this._setup ();
	},

	/**
	 * Handle key.
	 * @param {gui.Key} key
	 */
	onkey : function ( key ) {
		this._super.onkey ( key );
		console.log ( key.type );
		var map = this._map;
		map [ key.type ] = key.down;
		if ( Object.keys ( map ).every ( function ( type ) {
			//console.log ( type + ": " + map [ type ]);
			return map [ type ] === true;
		})) {
			console.log ( "fis!" );
		}

	},

	// https://github.com/jeresig/jquery.hotkeys/blob/master/jquery.hotkeys.js
	// http://stackoverflow.com/questions/3845009/how-to-handle-ctrl-s-event-on-chrome-and-ie-using-jquery
	// http://stackoverflow.com/questions/11000826/ctrls-preventdefault-in-chrome
	// http://stackoverflow.com/questions/93695/best-cross-browser-method-to-capture-ctrls-with-jquery


	// Private ...........................................
	
	_map : null,

	/**
	 * Parsing the 'key' attribute, setup key listeners.
	 */
	_setup : function () {
		var key = this.att.get ( "key" );
		if ( key ) {
			key.split ( " " ).forEach ( function ( token ) {
				token = token.trim ();
				this.key.addGlobal ( token );
				this._map [ token ] = false;
			}, this );
		}
	}
});


/**
 * Keys module.
 * @TODO http://www.w3.org/TR/DOM-Level-3-Events/#events-keyboardevents
 * @TODO http://dev.opera.com/articles/view/functional-key-handling-in-opera-tv-store-applications/
 */
gui.KeysModule = gui.module ( "keys", {

	/**
	 * Channeling spirits to CSS selectors.
	 */
	channels : [
		[ ".gui-key", gui.KeySpirit ]
	],

	/*
	 * Plugins (for all spirits).
	 * @TODO: combo
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
		 * @implements {gui.IKeyHandler}
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
		this._oldschool ( e );
		/*
		if ( gui.Type.isDefined ( e.repeat )) { // bypass DOM3 for now
			this._newschool ( e );
		} else {
			this._oldschool ( e );
		}
		*/
	},


	// Private ..........................................................
	 
	/**
	 * Mapping keycodes to characters between keydown and keypress event.
	 * @type {Map<number,String>}
	 */
	_keymap : null,

	/*
	 * Snapshot latest broadcast to prevent 
	 * doubles in mysterious Gecko cornercase.
	 * @type {String}
	 */
	_snapshot : null,


	/**
	 * DOM3 style events. Skipped for now since Opera 12 appears 
	 * to fire all events repeatedly while key pressed, that correct? 
	 * Also, event.repeat is always false, that doesn't make sense...
	 * @param {Event} e
	 */
	_newschool : function ( e ) {},

	/**
	 * Conan the Barbarian style events. 
	 * At least they suck in a known way.
	 * @param {Event} e
	 */
	_oldschool : function ( e ) {
		var n = e.keyCode, c = this._keymap [ n ], b = gui.BROADCAST_KEYEVENT;
		var id = e.currentTarget.defaultView.gui.$contextid;
		
		/*
		// TODO: THIS!
		if ( e.ctrlKey && gui.Key.$key [ e.keyCode ] !== "Control" ) {
			e.preventDefault ();
		}
		*/

		switch ( e.type ) {
			case "keydown" :
				if ( c === undefined ) {
					this._keycode = n;
					this._keymap [ n ] = null;
					this._keymap [ n ] = String.fromCharCode ( e.which ).toLowerCase ();
					gui.Tick.next ( function () {
						c = this._keymap [ n ];
						this._broadcast ( true, null, c, n , id );
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
					this._broadcast ( false, null, c, n, id );
					delete this._keymap [ n ];
				}
				break;
		}
	},

	/**
	 * Broadcast key details globally. Details reduced to a boolean 'down' and a 'type' 
	 * string to represent typed character (eg "b") or special key (eg "Shift" or "Alt"). 
	 * Note that the SPACE character is broadcasted as the multi-letter type "Space" (TODO!)
	 * @TODO what other pseudospecial keys are mapped to typed characters (like SPACE)?
	 * @param {boolean} down
	 * @param {String} key Newschool ABORTED FOR NOW
	 * @param {String} c (char) Bothschool
	 * @param {number} code Oldschool
	 * @param {String} sig Contextkey
	 */
	_broadcast : function ( down, key, c, code, sig ) {
		var type, msg, arg;
		type = gui.Key.$key [ code ] ||  c;
		type = type === " " ? gui.Key.SPACE : type;
		msg = gui.BROADCAST_KEYEVENT;
		arg = { down : down, type : type };
		/*
		 * Never broadcast same message twice. Fixes something about Firefox 
		 * registering multiple keystrokes on certain chars (notably the 's').
		 */
		var snapshot = JSON.stringify ( arg );
		if ( snapshot !== this._snapshot ) {
			gui.Broadcast.dispatch ( null, msg, arg, sig ); // do we want this?
			gui.Broadcast.dispatchGlobal ( null, msg, arg );
			this._snapshot = snapshot;
		}
	},

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

/*
 * Register broadcast type.
 */
gui.BROADCAST_KEYEVENT = "gui-broadcast-keyevent";


}( this ));
/**
 * Spiritual EDB
 * 2013 Wunderbyte
 * Spiritual is freely distributable under the MIT license.
 */
( function ( window ) {

"use strict";


/*
 * Namepace object.
 */
window.edb = gui.namespace ( "edb", {
	
	/**
	 * Although it should probably be false until we have full support...
	 * @type {boolean}
	 */
	portals : true,

	/**
	 * Mount compiled functions as blob files 
	 * (if at all supported) to aid debugging?
	 * @type {boolean}
	 */
	useblobs : true, // @TODO: somehow map to local gui.debug

	/**
	 * Constants.
	 */
	BROADCAST_ACCESS : "edb-broadcast-access",
	BROADCAST_CHANGE : "edb-broadcast-change",
	BROADCAST_OUTPUT : "edb-broadcast-output",
	BROADCAST_SCRIPT_INVOKE : "edb-broadcast-script-invoke",
	LIFE_SCRIPT_WILL_RUN : "edb-life-script-will-run",
	LIFE_SCRIPT_DID_RUN : "edb-life-script-did-run",
	TICK_SCRIPT_UPDATE : "edb-tick-script-update",
	TICK_COLLECT_INPUT : "edb-tick-collect-input",
	TICK_PUBLISH_CHANGES : "edb-tick-update-changes",

	/**
	 * Register action to execute later.
	 * @param {function} action
	 * @param {object} thisp
	 * @returns {function}
	 */
	set : function ( action, thisp ) {
		return edb.Script.$assign ( action, thisp );
	},

	get : function ( key, sig ) {
		return edb.Script.$tempname ( key, sig );
	},

	/**
	 * Execute action.
	 * @TODO: why was this split up in two steps? Sandboxing?
	 * @param {Event} e
	 * @param {String} key
	 * @param @optional {String} sig
	 */
	go : function ( e, key, sig ) { // NOTE: gui.UpdateManager#_attschanged hardcoded "edb.go" ...
		edb.Script.$register ( e );
		edb.Script.$invoke ( key, sig ); // this._log
	}
	
});



/**
 * Conceptual superclass for {edb.Object} and {edb.Array}, not a real 
 * superclass. We use the following only as a pool for mixin methods.
 */
edb.Type = function () {};

/*
 * Types by default take on the structure of whatever JSON you put 
 * into them (as constructor argument). We declare expando properties 
 * with a $dollar prefix so that we may later normalize the JSON back. 
 * Props prefixed by underscore will also be ingnored in this process.
 */
edb.Type.prototype = {
	
	/**
	 * Resource ID (serverside or localstorage key).
	 * @type {String}
	 */
	$id : null,

	/**
	 * Output context (for cross-context cornercases).
	 * @type {Window|WorkerGlobalScope}
	 */
	$context : null,

	/**
	 * Output context ID equivalent to 'this.$context.gui.$contextid'. 
	 * The ID is not persistable (generated random on session startup).
	 * @type {String}
	 */
	$contextid : null,
		
	/**
	 * Instance key (clientside session only).
	 * TODO: Safari on iPad would exceed call stack when this property was prefixed with "$" 
	 * because all getters would call $sub which would then get $instkey (ie. overflow).
	 * Why was this only the case only for Safari iPad?
	 * @type {String}
	 */
	_instanceid : null,
	
	/**
	 * Called after $onconstruct (by gui.Class convention).
	 * @TODO kill this and use $onconstruct only ($-prefixes only)
	 */
	onconstruct : function () {},

	/**
	 * Validate persistance on startup.
	 * @TODO: make it less important to forget _super() in the subclass.
	 */
	$onconstruct : function () {
		edb.Type.underscoreinstanceid ( this ); // iOS bug...
		edb.Type.$confirmpersist ( this );
	},

	/**
	 * Hello.
	 */
	$oninit : function () {},

	/**
	 * Called by {edb.Output} when the output context shuts down 
	 * (when the window unloads or the web worker is terminated).
	 */
	$ondestruct : function () {
		edb.Type.$maybepersist ( this );
	},

	/**
	 * Output to context.
	 * @param @optional {Window|WorkerGlobalScope} context
	 * @returns {edb.Type}
	 */
	$output : function ( context ) {
		edb.Output.dispatch ( this, context || self );
		return this;
	},
	
	/**
	 * Serialize to JSON string without private and expando properties.
	 * @todo Declare $normalize as a method stub here (and stull work in subclass)
	 * @param {function} filter
	 * @param {String|number} tabber
	 * @returns {String}
	 */
	$stringify : function ( filter, tabber ) {
		return JSON.stringify ( this.$normalize (), filter, tabber );
	},


	// CRUD .............................................................................

	/**
	 * Use some kind of factory pattern.
	 */
	$GET : function () {
		throw new Error ( "Not supported. Use " + this.constructor + ".$GET(optionalid)" );
	},

	/**
	 * PUT resource.
	 * @param @optional {Map<String,object>} options
	 * @returns {gui.Then}
	 */
	$PUT : function ( options ) {
		return this.constructor.PUT ( this, options );
	},

	/**
	 * POST resource.
	 * @param @optional {Map<String,object>} options
	 * @returns {gui.Then}
	 */
	$POST : function ( options ) {
		return this.constructor.POST ( this, options );
	},

	/**
	 * DELETE resource.
	 * @param @optional {Map<String,object>} options
	 * @returns {gui.Then}
	 */
	$DELETE : function ( options ) {
		return this.constructor.DELETE ( this, options );
	}
};


// Static ........................................................................

gui.Object.each ({ // static mixins edb.Type

	/*
	 * Dispatch a getter broadcast before base function.
	 */
	getter : gui.Combo.before ( function () {
		gui.Broadcast.dispatchGlobal ( this, edb.BROADCAST_ACCESS, this._instanceid );
	}),

	/*
	 * Dispatch a setter broadcast after base function.
	 */
	setter : gui.Combo.after ( function () {
		gui.Broadcast.dispatchGlobal ( this, edb.BROADCAST_CHANGE, this._instanceid );
	}),

	/**
	 * Decorate getter methods on prototype.
	 * @param {object} proto Prototype to decorate
	 * @param {Array<String>} methods List of method names
	 * @returns {object}
	 */
	decorateGetters : function ( proto, methods ) {
		methods.forEach ( function ( method ) {
			proto [ method ] = edb.Type.getter ( proto [ method ]);
		});
		return proto;
	},

	/**
	 * Decorate setter methods on prototype.
	 * @param {object} proto Prototype to decorate
	 * @param {Array<String>} methods List of method names
	 * @returns {object}
	 */
	decorateSetters : function ( proto, methods ) {
		methods.forEach ( function ( method ) {
			proto [ method ] = edb.Type.setter ( proto [ method ]);
		});
		return proto;
	},

	/**
	 * Redefine the $instid to start with an underscore 
	 * because of some iOS weirdness (does it still apply?)
	 * @param {edb.Type} inst
	 */
	underscoreinstanceid : function ( inst ) {
		Object.defineProperty ( inst, "_instanceid", {
			value: inst.$instanceid
		});
	},

	/**
	 * Is inst of {edb.Object} or {edb.Array}?
	 * @param {object} o
	 * @returns {boolean}
	 */
	isInstance : function ( o ) {
		if ( gui.Type.isComplex ( o )) {
			return ( o instanceof edb.Object ) || ( o instanceof edb.Array );
		}
		return false;
	},

	/**
	 * Lookup edb.Type constructor for argument (if not already an edb.Type).
	 * @TODO Confirm that it is actually an edb.Type thing...
	 * @param {Window|WorkerGlobalScope} arg
	 * @param {function|string} arg
	 * @returns {function} 
	 */
	lookup : function ( context, arg ) {	
		var type = null;
		switch ( gui.Type.of ( arg )) {
			case "function" :
				type = arg; // @TODO: confirm
				break;
			case "string" :
				type = gui.Object.lookup ( arg, context );
				break;
			case "object" :
				console.error ( this + ": expected edb.Type constructor (not an object)" );
				break;
		}
		if ( !type ) {
			throw new TypeError ( "The type \"" + arg + "\" does not exist" );
		}
		return type;
	},

	/**
	 * @param {object} value
	 */
	cast : function fix ( value ) {
		if ( gui.Type.isComplex ( value ) && !edb.Type.isInstance ( value )) {
			switch ( gui.Type.of ( value )) {
				case "object" :
					return new edb.Object ( value );
				case "array" :
					return new edb.Array ( value );
			}
		} 
		return value;
	},

	/**
	 * Type constructed. Validate persistance OK.
	 * @param {edb.Model|edb.Collection} type
	 */
	$confirmpersist : function ( type ) {
		var Type = type.constructor;
		if ( Type.storage && edb.Storage.$typecheck ( type )) {
			if ( arguments.length > 1 ) {
				throw new Error ( 
					"Persisted models and collections " +
					"must construct with a single arg" 
				);
			}
		}
	},

	/**
	 * Type destructed. Persist if required.
	 * @param {edb.Model|edb.Collection} type
	 */
	$maybepersist : function ( type ) {
		var Type = type.constructor;
		if ( Type.storage ) {
			Type.$store ( type, true );
		}
	}

}, function mixin ( key, value ) {
	edb.Type [ key ] = value;
});


// Mixins .............................................................

/**
 * Setup for mixin to {edb.Object} and {edb.Array}.
 */
( function () {

	var iomixins = { // input-output methods

		/**
		 * Instance of this Type has been output to context?
		 * @param @optional {Window|WorkerGlobalScope} context
		 * @returns {boolean}
		 */
		out : function ( context ) {
			return edb.Output.out ( this, context || self );
		}
	};

	var persistancemixins = {

		/**
		 * @type {edb.Storage}
		 */
		storage : null,

		/**
		 * Restore instance from client storage. Note that the constructor 
		 * (this constructor) will be called with only one single argument.
		 * @returns {gui.Then}
		 */
		restore : function ( context ) {
			return this.storage.getItem ( this.$classname, context || self );
		},

		/**
		 * Persist instance. Managed by the framework via instance.$ondestruct.
		 * @param {edb.Object|edb.Array} type
		 */
		$store : function ( type, now ) {
			this.storage.setItem ( this.$classname, type, type.$context, now );
		}
	};

	var httpmixins = { // http crud and server resources

		/**
		 * The resource URI-reference is the base URL for 
		 * resources of this type excluding the resource 
		 * primary key. This might be inferred from JSON. 
		 * @type {String}
		 */
		uri : null,

		/**
		 * When requesting a list of resources, a property 
		 * of this name should be found in the JSON for 
		 * each individual resource. The property value 
		 * will be auto-inserted into URL paths when 
		 * the resource is fetched, updated or deleted. 
		 * @type {String}
		 */
		primarykey : "_id",

		/**
		 * GET resource.
		 * 
		 * 1. Any string argument will become the resource ID.
		 * 2. Any object argument will resolve to querystring paramters.
		 *
		 * @param @optional {Map<String,object>|String} arg1
		 * @param @optional {Map<String,object>} arg2
		 * @returns {gui.Then}
		 */
		GET : function () {
			return this.$httpread.apply ( this, arguments );
		},

		/**
		 * PUT resource.
		 * @param {edb.Object|edb.Array} inst
		 * @param @optional {Map<String,object>} options
		 * @param {String} $method (Framework internal)
		 * @returns {gui.Then}
		 */
		PUT : function ( inst, options ) {
			return this.$httpupdate ( "PUT", inst, options );
		},

		/**
		 * POST resource.
		 * @param {edb.Object|edb.Array} inst
		 * @param @optional {Map<String,object>} options
		 * @param {String} $method (Framework internal)
		 * @returns {gui.Then}
		 */
		POST : function ( inst, options ) {
			return this.$httpupdate ( "POST", inst, options );
		},

		/**
		 * DELETE resource.
		 * @param {edb.Object|edb.Array} inst
		 * @param @optional {Map<String,object>} options
		 * @param {String} $method (Framework internal)
		 * @returns {gui.Then}
		 */
		DELETE : function ( inst, options ) {
			return this.$httpupdate ( "DELETE", inst, options );
		},


		// Static secret .......................................................

		/**
		 * GET resource.
		 */
		$httpread : function ( ) {
			var type = this;
			var then = new gui.Then ();
			var href, id, options;
			Array.forEach ( arguments, function ( arg ) {
				switch ( gui.Type.of ( arg )) {
					case "string" :
						id = arg;
						break;
					case "object" :
						options = arg;
						break;
				}
			});
			href = gui.URL.parametrize ( this.uri, options );
			this.$httprequest ( href, "GET", null, function ( response ) {
				then.now ( type.$httpresponse ( response ));
			});
			return then;
		},

		/**
		 * PUT POST DELETE resource.
		 * @param {String} method (Framework internal)
		 * @param {edb.Object|edb.Array} inst
		 * @param @optional {Map<String,object>} options
		 * @returns {gui.Then}
		 */
		$httpupdate : function ( method, inst, options ) {
			var type = this;
			var then = new gui.Then ();
			var href = gui.URL.parametrize ( inst.uri, options );
			var data = gui.Type.isInstance ( inst ) ? inst.$normalize () : inst;
			this.$httprequest ( href, method || "PUT", data, function ( response ) {
				then.now ( type.$httpresponse ( response, options, method ));
			});
			return then;
		},

		/**
		 * Performs the request. Perhaps you would like to overwrite this method.
		 * @TODO: Somehow handle HTTP status codes.
		 * @param {String} url
		 * @param {String} method
		 * @param {object} payload
		 * @param {function} callback
		 */
		$httprequest : function ( url, method, payload, callback ) {
			var request = new gui.Request ( url );
			method = method.toLowerCase ();
			request [ method ] ( payload ).then ( function ( status, data, text ) {
				callback ( data );
			});
		},

		/**
		 * Formats the reponse. Perhaps you would like to overwrite this method. 
		 * If the service returns an object or an array, we assume that the service 
		 * is echoing the posted data and new up an instance of this constructor.
		 * @param {object} response
		 * param @optional {Map<String,object>} options
		 * @param {String} $method GET PUT POST DELETE
		 * @returns {object}
		 */
		$httpresponse : function ( response, options, method ) {
			var Type = this;
			switch ( gui.Type.of ( response )) {
				case "object" :
				case "array" :
					response = new Type ( response );
					break;
			}
			return response;
		}

	};

	/**
	 * Declare the fields on edb.Type.
	 */
	[ iomixins, persistancemixins, httpmixins ].forEach ( function ( mixins ) {
		gui.Object.each ( mixins, function mixin ( key, value ) {
			edb.Type [ key ] = value;
		});
	});

	/**
	 * Create one-liner for mixin to subclass constructors recurring static fields.
	 * @TODO: come up with a formalized setup for this
	 * @returns {Map<String,String|function>}
	 */
	edb.Type.$staticmixins = function () {
		var mixins = {};
		[ httpmixins, iomixins, persistancemixins ].forEach ( function ( set ) {
			Object.keys ( set ).forEach ( function ( key ) {
				mixins [ key ] = this [ key ];
			}, this );
		}, this );
		return mixins;
	};

}());


/**
 * edb.Object
 * @extends {edb.Type} at least in principle.
 * @using {gui.Type.isDefined}
 * @using {gui.Type.isComplex}, 
 * @using {gui.Type.isFunction} 
 * @using {gui.Type.isConstructor}
 */
edb.Object = ( function using ( isdefined, iscomplex, isfunction, isconstructor ) {
	
	return gui.Class.create ( Object.prototype, {
		
		/**
		 * Constructor.
		 * @overrides {edb.Type#onconstruct}
		 */
		$onconstruct : function ( data ) {
			edb.Type.prototype.$onconstruct.apply ( this, arguments );
			switch ( gui.Type.of ( data )) {
				case "object" : 
				case "undefined" :
					edb.Object._approximate ( this, data || Object.create ( null ));
					break;
				default :
					throw new TypeError ( 
						"Unexpected edb.Object constructor argument of type " + 
						gui.Type.of ( data ) + ": " + String ( data )
					);
			}
			this.onconstruct.apply ( this, arguments ); // @TODO do we want this?
			this.$oninit ();
		},
		
		/**
		 * Create clone of this object filtering out 
		 * underscore and dollar prefixed properties. 
		 * Recursively normalizing nested EDB types.
		 * TODO: WHITELIST stuff that *was* in JSON!
		 * @returns {object}
		 */
		$normalize : function () {
			var c, o = {};
			gui.Object.each ( this, function ( key, value ) {
				c = key [ 0 ];
				if ( c !== "$" && c !== "_" ) {
					if ( edb.Type.isInstance ( value  )) {
						value = value.$normalize ();	
					}
					o [ key ] = value;	
				}
			});
			return o;
		}


	}, ( function mixins () { // Recurring static ..........................................

		/*
		 * edb.Object and edb.Array don't really subclass edb.Type, 
		 * so we'll just have to hack in these shared static fields. 
		 * @TODO: formalized mixin strategy for recurring statics...
		 */
		return edb.Type.$staticmixins ();
		

	}()), { // Static ......................................................................

		/**
		 * TODO
		 * @param {edb.Object} object
		 * @param {edb.IChangeHandler} handler
		 * @returns {edb.Object}
		 */
		observe : function ( object, handler ) {
			var id = object.$instanceid || object._instanceid;
			var obs = this._observers;
			var handlers = obs [ id ] || ( obs [ id ] = []);
			if ( handlers.indexOf ( handler ) === -1 ) {
				handlers.push ( handler );
			}
			return object;
		},

		/**
		 * TODO
		 * @param {edb.Object} object
		 * @param {edb.IChangeHandler} handler
		 * @returns {edb.Object}
		 */
		unobserve : function ( object, handler ) {
			var id = object.$instanceid || object._instanceid;
			var obs = this._observers;
			var index, handlers = obs [ id ];
			if ( handlers ) {
				if (( index = handlers.indexOf ( handler )) >-1 ) {
					if ( gui.Array.remove ( handlers, index ) === 0	) {
						delete obs [ id ];
					}
				}
			}
			return object;
		},

		/**
		 * Publishing change summaries async.
		 * @TODO: clean this up...
		 * @TODO: move to edb.Type (edb.Type.observe)
		 * @param {gui.Tick} tick
		 */
		ontick : function ( tick ) {
			var snapshot, changes, change, handlers, observers = this._observers;
			if ( tick.type === edb.TICK_PUBLISH_CHANGES ) {
				snapshot = gui.Object.copy ( this._changes );
				this._changes = Object.create ( null );
				gui.Object.each ( snapshot, function ( instanceid, propdef ) {
					if (( handlers = observers [ instanceid ])) {
						changes = gui.Object.each ( snapshot, function ( id, propdef ) {
							change = propdef [ Object.keys ( propdef )[ 0 ]];
							return id === instanceid ? change : null;
						}).filter ( function ( change ) {
							return change !== null;
						});
						handlers.forEach ( function ( handler ) {
							handler.onchange ( changes );
						});
					}
					gui.Broadcast.dispatchGlobal ( null, edb.BROADCAST_CHANGE, instanceid ); // @TODO deprecate
				});
			}
		},


		// Private static ....................................................................

		/**
		 * Object observers.
		 * @type {}
		 */
		_observers : Object.create ( null ),

		/**
		 * Create getter for key.
		 * @param {String} key
		 * @param {function} base
		 * @returns {function}
		 */
		_getter : function ( key, base ) {
			return function () {
				var result = base.apply ( this );
				edb.Object._onaccess ( this, key );
				return result;
			};
		},

		/**
		 * Create setter for key.
		 * @param {String} key
		 * @param {function} base
		 * @returns {function}
		 */
		_setter : function ( key, base ) {
			return function ( newval ) {
				var oldval = this [ key ]; // @TODO suspend something?
				base.apply ( this, arguments );
				edb.Object._onchange ( this, key, oldval, newval );
				oldval = newval;
			};
		},

		/**
		 * Primarily for iternal use: Publish a notification on property 
		 * accessors so that {edb.Script} may register change observers.
		 * @param {String} instanceid
		 * @param {edb.ObjectAccess} access
		 */
		_onaccess : function ( object, name ) {
			var access = new edb.ObjectAccess ( object, name );
			gui.Broadcast.dispatchGlobal ( null, edb.BROADCAST_ACCESS, access.instanceid );
		},

		/**
		 * Register change summary for publication in next tick.
		 * @param {edb.Object} object
		 * @param {String} name
		 * @param {object} oldval
		 * @param {object} newval
		 */
		_onchange : function ( object, name, oldval, newval ) {
			var all = this._changes, id = object._instanceid;
			var set = all [ id ] = all [ id ] || ( all [ id ] = Object.create ( null ));
			set [ name ] = new edb.ObjectChange ( object, name, edb.ObjectChange.TYPE_UPDATED, oldval, newval );
			gui.Tick.dispatch ( edb.TICK_PUBLISH_CHANGES );
		},

		/**
		 * Mapping instanceids to maps that map property names to change summaries.
		 * @type {Map<String,Map<String,edb.ObjectChange>>}
		 */
		_changes : Object.create ( null ),

		/**
		 * Servers two purposes:
		 * 
		 * 1. Simplistic proxy mechanism to dispatch {gui.Type} broadcasts on object setters and getters. 
		 * 2. Supporting model hierarchy unfolding be newing up all that can be indentified as constructors.
		 * 
		 * @param {edb.Object} handler The edb.Object instance that intercepts properties
		 * @param {object} proxy The object whose properties are being intercepted (the JSON object)
		 */
		/**
		 * Servers two purposes:
		 * 
		 * 1. Simplistic proxy mechanism to dispatch {gui.Type} broadcasts on object setters and getters. 
		 * 2. Supporting model hierarchy unfolding be newing up all that can be indentified as constructors.
		 * 
		 * @param {edb.Object} handler The edb.Object instance that intercepts properties
		 * @param {object} proxy The object whose properties are being intercepted (the JSON object)
		 */
		_approximate : function ( handler, proxy ) {
			var name = handler.constructor.$classname;
			var Def, def, val, types = Object.create ( null );
			this._definitions ( handler ).forEach ( function ( key ) {
				def = handler [ key ];
				val = proxy [ key ];
				if ( isdefined ( val )) {
					if ( isdefined ( def )) {
						if ( iscomplex ( def )) {
							if ( isfunction ( def )) {
								if ( !isconstructor ( def )) {
									def = def ( val );
								}
								if ( isconstructor ( def )) {
									Def = def;
									types [ key ] = new Def ( proxy [ key ]);
								} else {
									throw new TypeError ( name + " \"" + key + "\" must resolve to a constructor" );
								}
							} else {
								types [ key ] = edb.Type.cast ( isdefined ( val ) ? val : def );
							}
						} else {
							// ??????????????????????
							//proxy [ key ] = def;
						}
					} else {
						throw new TypeError ( name + " declares \"" + key + "\" as something undefined" );
					}
				} else {
					proxy [ key ] = def;
				}
			});

			/* 
			 * Setup property accessors for handler.
			 *
			 * 1. Objects by default convert to edb.Object
			 * 2. Arrays by default convert to edb.Array
			 * 3. Simple properties get proxy accessors
			 */
			gui.Object.nonmethods ( proxy ).forEach ( function ( key ) {
				def = proxy [ key ];
				if ( gui.Type.isComplex ( def )) {
					if ( !types [ key ]) {
						types [ key ] = edb.Type.cast ( def );
					}
				}
				gui.Property.accessor ( handler, key, {
					getter : edb.Object._getter ( key, function () {
						return types [ key ] || proxy [ key ];
					}),
					setter : edb.Object._setter ( key, function ( value ) {
						/*
						 * TODO: when resetting array, make sure that 
						 * it becomes xx.MyArray (not plain edb.Array)
						 */
						var target = types [ key ] ? types : proxy;
						target [ key ] = edb.Type.cast ( value );
					})
				});
			});
		},

		/**
		 * List non-private fields names from handler that are not 
		 * mixed in from {edb.Type} and not inherited from Object.
		 * @param {edb.Object} handler
		 * @returns {Array<String>}
		 */
		_definitions : function ( handler ) {
			var keys = [];
			gui.Object.all ( handler, function ( key ) {
				if ( !gui.Type.isDefined ( Object.prototype [ key ])) {
					if ( !gui.Type.isDefined ( edb.Type.prototype [ key ])) {
						if ( !key.startsWith ( "_" )) {
							keys.push ( key );
						}
					}
				}	
			});
			return keys;
		}
	});

}) ( 
	gui.Type.isDefined, 
	gui.Type.isComplex, 
	gui.Type.isFunction, 
	gui.Type.isConstructor
);

/*
 * Mixin methods and properties common to both {edb.Object} and {edb.Array}
 */
( function setup () {
	gui.Tick.add ( edb.TICK_PUBLISH_CHANGES, edb.Object );
	gui.Object.extendmissing ( edb.Object.prototype, edb.Type.prototype );
}());


/**
 * @using {Array.prototype}
 */
( function using ( proto ) {

	/**
	 * edb.Array
	 * @extends {edb.Type} ...although not really...
	 */
	edb.Array = gui.Class.create ( proto, {

		
		// Overrides ...........................................................................
		
		/**
		 * Push.
		 */
		push : function() {
			var res = proto.push.apply ( this, arguments );
			Array.forEach ( arguments, function ( arg ) {
				edb.Array._onchange ( this, 1, arg );
			}, this );
			return res;
		},
		
		/**
		 * Pop.
		 */
		pop : function () {
			var res = proto.pop.apply ( this, arguments );
			edb.Array._onchange ( this, 0, res );
			return res;
		},
		
		/**
		 * Shift.
		 */
		shift : function () {
			var res = proto.shift.apply ( this, arguments );
			edb.Array._onchange ( this, 0, res );
			return res;
		},

		/**
		 * Unshift.
		 */
		unshift : function () {
			var res = proto.unshift.apply ( this, arguments );
			Array.forEach ( arguments, function ( arg ) {
				edb.Array._onchange ( this, 1, arg );
			}, this );
			return res;
		},

		/**
		 * Splice.
		 */
		splice : function () {
			var res = proto.splice.apply ( this, arguments );
			var add = [].slice.call ( arguments, 2 );
			res.forEach ( function ( r ) {
				edb.Array._onchange ( this, 0, r );
			}, this );
			add.forEach ( function ( a ) {
				edb.Array._onchange ( this, 1, a );
			}, this );
			return res;
		},


		// Custom ..............................................................................

		/**
		 * The content type can be declared as:
		 *
		 * 1. An edb.Type constructor function (my.ns.MyType)
		 * 2. A filter function to accept JSON (for analysis) and return an edb.Type constructor.
		 * @type {function} Type constructor or filter function
		 */
		$of : null,

		/**
		 * Constructor.
		 * @overrides {edb.Type#onconstruct}
		 */
		$onconstruct : function () {
			edb.Type.prototype.$onconstruct.apply ( this, arguments );
			edb.Array.populate ( this, arguments );
			edb.Array.approximate ( this );
			this.onconstruct.call ( this, arguments );
			this.$oninit ();
		},

		/**
		 * Create true array without expando properties, recursively normalizing nested EDB 
		 * types. Returns the type of array we would typically transmit back to the server. 
		 * @returns {Array}
		 */
		$normalize : function () {
			return Array.map ( this, function ( thing ) {
				if ( edb.Type.isInstance ( thing )) {
					return thing.$normalize ();
				}
				return thing;
			});
		}
		
		
	}, ( function mixins () { // Recurring static ..........................................

		/*
		 * edb.Object and edb.Array don't really subclass edb.Type, 
		 * so we'll just have to hack in these shared static fields. 
		 * @TODO: formalized mixin strategy for recurring statics...
		 */
		return edb.Type.$staticmixins ();
		

	}()), { // Static ......................................................................

		/**
		 * Populate {edb.Array} from constructor arguments.
		 *
		 * 1. Populate as normal array, one member for each argument
		 * 2. If the first argument is an array, populate using this.
		 *
		 * For case number two, we ignore the remaining arguments. 
		 * @TODO read something about http://www.2ality.com/2011/08/spreading.html
		 * @param {edb.Array}
		 * @param {Arguments} args
		 */
		populate : function ( array, args ) {
			var members;
			if ( args.length ) {
				members = [];
				if ( gui.Type.isArray ( args [ 0 ])) {
					members = args [ 0 ];
				} else {
					members = Array.prototype.slice.call ( args );
				}
				if ( gui.Type.isFunction ( array.$of )) {
					members = edb.Array._populatefunction ( members, array.$of );
				} else {
					members = edb.Array._populatedefault ( members );
				}
				Array.prototype.push.apply ( array, members );
			}
		},

		/**
		 * Simplistic proxy mechanism. 
		 * @param {object} handler The object that intercepts properties (the edb.Array)
		 * @param {object} proxy The object whose properties are being intercepted (raw JSON data)
		 */
		approximate : function ( handler, proxy ) {
			var def = null;
			proxy = proxy || Object.create ( null );	
			this._definitions ( handler ).forEach ( function ( key ) {
				def = handler [ key ];
				switch ( gui.Type.of ( def )) {
					case "function" :
						break;
					case "object" :
					case "array" :
						console.warn ( "TODO: complex stuff on edb.Array :)" );
						break;
					default :
						if ( !gui.Type.isDefined ( proxy [ key ])) {
							proxy [ key ] = handler [ key ];
						}
						break;
				}
			});
			
			/* 
			 * Handler intercepts all accessors for simple properties.
			 */
			gui.Object.nonmethods ( proxy ).forEach ( function ( key ) {
				Object.defineProperty ( handler, key, {
					enumerable : true,
					configurable : true,
					get : edb.Type.getter ( function () {
						return proxy [ key ];
					}),
					set : edb.Type.setter ( function ( value ) {
						proxy [ key ] = value;
					})
				});
			});
		},


		// Private static .........................................................

		/**
		 * Collect list of definitions to transfer from proxy to handler.
		 * @param {object} handler
		 * @returns {Array<String>}
		 */
		_definitions : function ( handler ) {
			var keys = [];
			for ( var key in handler ) {
				if ( this._define ( key )) {
					keys.push ( key );
				}
			}
			return keys;
		},

		/**
		 * Should define given property?
		 * @param {String} key
		 * @returns {boolean}
		 */
		_define : function ( key ) {
			if ( !gui.Type.isNumber ( gui.Type.cast ( key ))) {
				if ( !gui.Type.isDefined ( Array.prototype [ key ])) {
					if ( !gui.Type.isDefined ( edb.Type.prototype [ key ])) {
						if ( !key.startsWith ( "_" )) {
							return true;
						}
					}
				}
			}
			return false;
		},

		/**
		 * Parse field declared via constructor or via 
		 * filter function (which returns a constructor).
		 */
		_populatefunction : function ( members, func ) {
			return members.map ( function ( o ) {
				if ( o !== undefined && !o._instanceid ) {
					var Type = func;
					if ( !gui.Type.isConstructor ( Type )) {
						Type = func ( o );
					}
					o = new Type ( o );
				}
				return o;
			});
		},

		/**
		 * Parse field default. Objects and arrays automatically  
		 * converts to instances of {edb.Object} and {edb.Array}
		 */
		_populatedefault : function ( members ) {
			return members.map ( function ( o ) {
				if ( !edb.Type.isInstance ( o )) {
					switch ( gui.Type.of ( o )) {
						case "object" : 
							return new edb.Object ( o );
						case "array" :
							return new edb.Array ( o );
					}
				}
				return o;
			});
		},

		/**
		 * TODO.
		 * @param {edb.Array} array
		 */
		_onaccess : function ( array ) {},

		/**
		 * Register change summary for publication in next tick.
		 * @param {edb.Array} array
		 * @param {number} type
		 * @param {object} item
		 */
		_onchange : function ( array, type, item ) {
			type = {
				0 : edb.ArrayChange.TYPE_REMOVED,
				1 : edb.ArrayChange.TYPE_ADDED
			}[ type ];
			// console.log ( array, type, item ); TODO :)
		}

	});

}( Array.prototype ));

/*
 * Overloading array methods.
 * @using {edb.Array.prototype}
 */
( function using ( proto ) {
	
	/*
	 * Dispatch a broadcast whenever the list is inspected or traversed.
	 */
	edb.Type.decorateGetters ( proto, [
		"filter", 
		"forEach", 
		"every", 
		"map", 
		"some", 
		"indexOf", 
		"lastIndexOf"
	]);

	/*
	 * Dispatch a broadcast whenever the list changes content or structure.
	 * @TODO we now have two systems for this (moving to precise observers)
	 */
	edb.Type.decorateSetters ( proto, [
		"push", // add
		"unshift", // add
		"splice", // add or remove
		"pop", // remove
		"shift", // remove
		"reverse" // reversed (copies???????)
	]);
	
	/*
	 * TODO: This is wrong on so many...
	 * @param {edb.Array} other
	 */
	proto.concat = function ( other ) {
		var clone = new this.constructor (); // must not construct() the instance!
		this.forEach ( function ( o ) {
			clone.push ( o );
		});
		other.forEach ( function ( o ) {
			clone.push ( o );
		});
		return clone;
	};

	// @TODO "sort", "reverse", "join"
	
}( edb.Array.prototype ));

/*
 * Mixin methods and properties common 
 * to both {edb.Object} and {edb.Array}
 */
( function setup () {
	// TODO gui.Tick.add ( edb.TICK_PUBLISH_CHANGES, edb.Array );
	gui.Object.extendmissing ( edb.Array.prototype, edb.Type.prototype );
}());


/**
 * @param {edb.Type} type
 * @param {String} name
 */
edb.ObjectAccess = function ( object, name ) {
	this.instanceid = object._instanceid;
	this.object = object;
	this.name = name;
};

edb.ObjectAccess.prototype = {
	instanceid : null,
	object : null,
	name : null
};


/**
 * edb.Object change summary.
 * @param {edb.Object} object
 * @param {String} name
 * @param {String} type
 * @param {object} oldval
 * @param {object} newval
 */
edb.ObjectChange = function ( object, name, type, oldval, newval ) {
	//this.instanceid = object._instanceid;
	this.object = object;
	this.name = name;
	this.type = type;
	this.oldValue = oldval;
	this.newValue = newval;
};

edb.ObjectChange.prototype = {
	//instanceid : null,
	object: null,
	name: null,
	type: null,
	oldValue: undefined,
	newValue: undefined
};

/**
 * We only support type "updated" until 
 * native 'Object.observe' comes along.
 * @type {String}
 */
edb.ObjectChange.TYPE_UPDATED = "updated";


/**
 * @param {edb.Array} array
 */
edb.ArrayAccess = function ( array ) {
	this.instanceid = array._instanceid;
	this.array = array;
};

edb.ArrayAccess.prototype = {
	instanceid : null,
	array : null
};


/**
 * @param {edb.Array} array
 */
edb.ArrayChange = function ( array ) {
	this.instanceid = array._instanceid;
};

edb.ArrayChange.prototype = {
	instanceid : null,
	array : null
};

edb.ArrayChange.TYPE_ADDED = "added";
edb.ArrayChange.TYPE_REMOVED = "removed";


/**
 * Output all the inputs.
 * @TODO add and remove methods.
 */
edb.Output = {
	
	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object edb.Output]";
	},

	/**
	 * Output Type instance in context. @TODO: some complicated argument combos to explain here
	 * @param {Window|WorkerGlobalScope|IInputHandler} context @TODO input handler!
	 * @param {Object|Array|edb.Object|edb.Array} data Raw JSON or Type instance
	 * @param @optional {function|string} Type Optional edb.Type constructor
	 * @returns {edb.Object|edb.Array}
	 */
	dispatch : function ( type, context ) {
		context = context || self;
		this._configure ( type.constructor, type, context );
		gui.Broadcast.dispatch ( 
			null, 
			edb.BROADCAST_OUTPUT, 
			new edb.Input ( type ), 
			context.gui.$contextid 
		);
		gui.Broadcast.addGlobal ( gui.BROADCAST_WILL_UNLOAD, this );
	},

	/**
	 * Instance of given Type has been output to context?
	 * @param {function} type Type constructor
	 * @param {Window|WorkerGlobalScope} context
	 * @returns {boolean}
	 */
	out : function ( Type, context ) {
		context = context || self;
		var contxid = context.gui.$contextid;
		var contmap = this._contexts [ contxid ];
		var classid = Type.$classid;
		return contmap && contmap [ classid ] ? true : false;
	},

	/**
	 * Handle broadcast.
	 * @param {gui.Broadcast} b
	 */
	onbroadcast : function ( b ) {
		if ( b.type === gui.BROADCAST_WILL_UNLOAD ) {
			this._onunload ( b.data );
		}
	},


	// Private ............................................................................

	/**
	 * Mapping contextid to map mapping Type classname to Type instance.
	 * @type {Map<String,Map<String,edb.Object|edb.Array>>}
	 */
	_contexts : {},

	/**
	 * Configure Type instance for output.
	 * @param {function} Type constructor
	 * @param {edb.Object|edb.Array} type instance
	 * @param {Window|WorkerGlobalScope} context
	 */
	_configure : function ( Type, type, context ) {
		var contxid = context.gui.$contextid;
		var contmap = this._contexts [ contxid ] || ( this._contexts [ contxid ] = {});
		var classid = Type.$classid;
		contmap [ classid ] = type;
		type.$context = context;
		//alert ( Type.$classname + ": "+ context.document.title );
		type.$contextid = contxid;
	},

	/**
	 * Stop tracking output for expired context.
	 * @param {String} contextid
	 */
	_onunload : function ( contextid ) {
		var context = this._contexts [ contextid ];
		if ( context ) {
			gui.Object.each ( context, function ( classid, type ) {
				type.$ondestruct ();
			}, this );
			delete this._contexts [ contextid ];
		}
	},


	// Secrets .................................................................

	/**
	 * Get output of type in given context. Note that this returns an edb.Input. 
	 * @TODO Officially this should be supported via methods "add" and "remove".
	 * @param {Window|WorkerGlobalScope} context
	 * @param {function} Type
	 * @returns {edb.Input}
	 */
	$get : function ( Type, context ) {
		context = context || self;
		if ( Type.out ( context )) {
			var contxid = context.gui.$contextid;
			var contmap = this._contexts [ contxid ];
			var classid = Type.$classid;
			var typeobj = contmap [ classid ];
			return new edb.Input ( typeobj );
		}
		return null;
	}

};


/**
 * @deprecated
 * Note: This plugin may be used standalone, so don't reference any spirits around here.
 * @TODO formalize how this is supposed to be clear
 * @TODO static interface for all this stuff
 */
edb.OutputPlugin = gui.Plugin.extend ({

	/**
	 * Output data as type.
	 * @param {object} data JSON object or array (demands arg 2) or an edb.Type instance (omit arg 2).
	 * @param @optional {function|String} type edb.Type constructor or "my.ns.MyType"
	 * @returns {edb.Object|edb.Array}
	 */
	dispatch : function ( data, Type ) {
		console.error ( "edb.OutputPlugin is deprecated" );
		return edb.Output.dispatch ( this.context, data, Type );
	},

	/**
	 * Given Type has been output already?
	 * @param {edb.Object|edb.Array} Type
	 * @returns {boolean}
	 */
	exists : function ( Type ) {
		console.error ( "edb.OutputPlugin is deprecated" );
		return edb.Output.out ( Type, this.context || self );
	}

});


/**
 * Adopt the format of {gui.Broadcast} to facilitate easy switch cases 
 * on the Type constructor instead of complicated 'instanceof' checks. 
 * The Type instance object may be picked out of the 'data' property.
 * @param {edb.Object|edb.Array} type
 */
edb.Input = function Input ( type ) {
	if ( edb.Type.isInstance ( type )) {
		this.type = type.constructor;
		this.data = type;
	} else {
		throw new TypeError ( type + " is not a Type" );
	}
};

edb.Input.prototype = {
	
	/**
	 * Input Type (function constructor)
	 * @type {function}
	 */
	type : null,
	
	/**
	 * Input instance (instance of this.Type)
	 * @type {object|edb.Type} data
	 */
	data : null,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object edb.Input]";
	}
};


/**
 * Tracking EDB input. Note that the {edb.Script} is using this plugin: Don't assume a spirit around here.
 * @extends {gui.Tracker}
 */
edb.InputPlugin = gui.Tracker.extend ({
   
	/**
	 * True when one of each expected input type has been collected.
	 * @type {boolean}
	 */
	done : true,
	
	/**
	 * Construction time.
	 * @overrides {gui.Tracker#construct}
	 */
	onconstruct : function () {
		this._super.onconstruct ();
		this._watches = [];
		this._matches = [];
	},

	/**
	 * Destruction time.
	 */
	ondestruct : function () {
		this._super.ondestruct ();
		this.remove ( this._watches );
		this._xxx ( false );
	},
	
	/**
	 * Add handler for one or more input types.
	 * @param {edb.Type|String|Array<edb.Type|String>} arg 
	 * @param @optional {object} IInputHandler Defaults to this.spirit
	 * @returns {gui.InputPlugin}
	 */
	add : gui.Combo.chained ( function ( arg, handler ) {
		this.done = false;
		handler = handler ? handler : this.spirit;
		arg = edb.InputPlugin._breakdown ( arg, this.context );
		this._add ( arg, handler );
		this._xxx ( true );
	}),

	/**
	 * Remove handler for one or more input types.
	 * @TODO Cleanup more stuff?
	 * @param {edb.Type|String|Array<edb.Type|String>} arg 
	 * @param @optional {object} handler implements InputListener (defaults to this)
	 * @returns {gui.InputPlugin}
	 */
	remove : gui.Combo.chained ( function ( arg, handler ) {
		handler = handler ? handler : this.spirit;
		arg = edb.InputPlugin._breakdown ( arg, this.context );
		this._remove ( arg, handler );
		if (( this.done = this._matches.length === this._watches.length )) { // right?
			this._xxx ( false );
		}
	}),

	/**
	 * Get data for latest input of type (or best match).
	 * @TODO Safeguard somewhat
	 * @param {function} type
	 * @returns {object}
	 */
	get : function ( type ) {
		var types = this._matches.map ( function ( input ) {
			return input.data.constructor;
		});
		var best = edb.InputPlugin._bestmatch ( type, types );
		var input = best ? this._matches.filter ( function ( input ) {
			return input.type === best;
		}).shift () : null;
		/*
		if ( input ) {
			console.log ( "Bestmatch: " + input.data );
		}
		*/
		return input ? input.data : null;
	},

	/**
	 * Dispatch private data. Only the associated {edb.Script} can see this!
	 * @TODO the dispatching spirit should be able to intercept this as well...
	 * @param {object} data JSON object or array (demands arg 2) or an edb.Type instance (omit arg 2).
	 * @param @optional {function|String} type edb.Type constructor or "my.ns.MyType"
	 * @returns {edb.Object|edb.Array}
	 */
	dispatch : function ( data, Type ) {
		if ( this.spirit ) {
			return this.spirit.script.input ( data, Type );
		} else {
			console.error ( "TODO: not implemented (private sandbox input)" );
		}
	},
	
	/**
	 * Evaluate new input.
	 * @param {gui.Broadcast} b
	 */
	onbroadcast : function ( b ) {
		if ( b.type === edb.BROADCAST_OUTPUT ) {
			this.match ( b.data );
		}
	},

	/**
	 * Collect matching input.
	 * @param {edb.Input} input
	 */
	match : function ( input ) {
		this._maybeinput ( input );
	},
	
	
	// PRIVATES ...............................................................................
	
	/**
	 * Expecting instances of these types (or best match).
	 * @type {Array<function>}
	 */
	_watches : null,

	/**
	 * Latest (best) matches, one of each expected type.
	 * @type {Array<edb.Input>} 
	 */
	_matches : null,

	/**
	 * Add input handler for types.
	 * @TODO Are we sure that tick works synch in all browsers 
	 * (FF)? If not, better to wait for this.spirit.life.ready
	 * @param {Array<function>} types
	 * @param {IInputHandler} handler
	 */
	_add : function ( types, handler ) {
		types.forEach ( function ( Type ) {
			if ( gui.Type.isDefined ( Type )) {
				this._watches.push ( Type );
				this._addchecks ( Type.$classid, [ handler ]);
				if ( Type.out ( this.context )) { // type has been output already?
					// alert ( edb.Output.$get ( this.context, Type ));

					this._maybeinput ( edb.Output.$get ( Type, this.context ));
					/*
					 * TODO: this tick was needed at some point (perhaps in Spiritual Dox?)
					 */
					// gui.Tick.next(function(){ // allow nested {edb.ScriptSpirit} to spiritualize first
						//this._todoname ();
					// }, this );

				}
			} else {
				throw new TypeError ( "Could not register input for undefined Type" );
			}
		}, this );
	},

	/**
	 * Remove input handler for types.
	 * @param {Array<function>} types
	 * @param {IInputHandler} handler
	 */
	_remove : function ( types, handler ) {
		types.forEach ( function ( type ) {
			var index = this._watches.indexOf ( type );
			if ( index >-1 ) {
				gui.Array.remove ( this._watches, ( index ));
				this._removechecks ( type.$classid, [ handler ]);
			}
		}, this );
	},

	/**
	 * If input matches registered type, update handlers.
	 * @param {edb.Input} input
	 */
	_maybeinput : function ( input ) {
		var best = edb.InputPlugin._bestmatch ( input.type, this._watches );
		if ( best ) {
			this._updatematch ( input );
			this.done = this._matches.length === this._watches.length;
			this._updatehandlers ( input );
		}
	},

	/**
	 * Register match for type (remove old match if any).
	 * @param {edb.Input} input
	 * @param {function} best
	 */
	_updatematch : function ( newinput, newbest ) {
		var matches = this._matches;
		var types = matches.map ( function ( input ) {
			return input.type;
		});
		var best = edb.InputPlugin._bestmatch ( newinput.type, types );
		if ( best ) {
			var oldinput = matches.filter ( function ( input ) {
				return input.type === best;
			})[ 0 ];
			var index = matches.indexOf ( oldinput );
			matches [ index ] = newinput;
		} else {
			matches.push ( newinput );
		}
	},

	/**
	 * Update input handlers.
	 * @param {edb.Input} input
	 */
	_updatehandlers : function ( input ) {
		gui.Class.ancestorsAndSelf ( input.type, function ( Type ) {
			var list = this._trackedtypes [ Type.$classid ];
			if ( list ) {
				list.forEach ( function ( checks ) {
					var handler = checks [ 0 ];
					handler.oninput ( input );
				});
			}
		}, this );
	},

	/**
	 * @param {boolean} is
	 */
	_xxx : function ( is ) {
		gui.Broadcast [ is ? "add" : "remove" ] ( edb.BROADCAST_OUTPUT, this, this.context.gui.$contextid );
	}


}, {}, { // Static .............................................................

	/**
	 * Breakdown argument into array of one or more types.
	 * @param {object} arg
	 * @param {Window} context
	 * @returns {Array<function>}
	 */
	_breakdown : function ( arg, context ) {
		if ( gui.Type.isArray ( arg )) {
			return this._breakarray ( arg, context );
		} else {
			return this._breakother ( arg, context );
		}
	},
	
	/**
	 * Breakdown array.
	 * @param {Array<function|String|object>}
	 * @returns {Array<function>}
	 * @param {Window} context
	 * @returns {Array<function>}
	 */
	_breakarray : function ( array, context ) {
		return array.map ( function ( o ) {
			switch ( gui.Type.of ( o )) {
				case "function" :
					return o;
				case "string" :
					return gui.Object.lookup ( o, context );
				case "object" :
					console.error ( "Expected function. Got object." );
			}
		}, this );
	},
	
	/**
	 * Breakdown unarray.
	 * @param {function|String|object} arg
	 * @returns {Array<function>}
	 * @param {Window} context
	 * @returns {Array<function>}
	 */
	_breakother : function ( arg, context ) {
		switch ( gui.Type.of ( arg )) {
			case "function" :
				return [ arg ];
			case "string" :
				return this._breakarray ( arg.split ( " " ), context );
			case "object" :
				console.error ( "Expected function. Got object." );
		}
	},

	/**
	 * Lookup ancestor or identical constructor.
	 * @param {function} target type constructor
	 * @param {Array<function>} types type constructors
	 * @returns {function} type constructor
	 */
	_bestmatch : function ( target, types ) {
		var best = null, rating = Number.MAX_VALUE;
		this._rateall ( target, types, function ( type, rate ) {
			if ( rate >-1 && rate < rating ) {
				best = type;
			}
		});
		return best;
	},

	/**
	 * Match all types.
	 * @param {function} t
	 * @param {Array<function>} types
	 * @param {function} action
	 */
	_rateall : function ( target, types, action ) {
		types.forEach ( function ( type ) {
			action ( type, this._rateone ( target, type ));
		}, this );
	},

	/**
	 * Match single type.
	 * @type {function} t
	 * @type {function} type
	 * @returns {number} -1 for no match
	 */
	_rateone : function ( target, type ) {
		if ( target === type ) {
			return 0;
		} else {
			var tops = gui.Class.ancestorsAndSelf ( target );
			var subs = gui.Class.descendantsAndSelf ( target );
			var itop = tops.indexOf ( type );
			var isub = subs.indexOf ( type );
			return itop < 0 ? isub : itop;
		}
	}

});


/**
 * The ScriptPlugin shall render the spirits HTML.
 * @extends {gui.Plugin} (should perhaps extend some kind of genericscriptplugin)
 */
edb.ScriptPlugin = gui.Plugin.extend ({

	/**
	 * Script has been loaded and compiled?
	 * @type {boolean}
	 */
	loaded : false,

	/**
	 * Automatically run the script on spirit.onenter()? 
	 * @TODO implement 'required' attribute on params instead...
	 *
	 * - any added <?param?> value will be undefined at this point
	 * - adding <?input?> will delay run until all input is loaded
	 * @type {boolean}
	 */
	autorun : true,

	/**
	 * Script has been run? Flipped after first run.
	 * @type {boolean}
	 */
	ran : false,

	/**
	 * Use minimal updates (let's explain exactly what this is)?
	 * If false, we write the entire HTML subtree on all updates. 
	 * @type {boolean}
	 */
	diff : true,

	/**
	 * Log development stuff to console?
	 * @type {boolean}
	 */
	debug : false,

	/**
	 * Hm...
	 * @type {Map<String,object>}
	 */
	extras : null,

	/**
	 * Script SRC. Perhaps this should be implemented as a method.
	 * @type {String}
	 */
	src : {
		getter : function () {
			return this._src;
		},
		setter : function ( src ) {
			this.load ( src );
		}
	},
	
	/**
	 * Construction time.
	 *
	 * 1. don't autorun service scripts
	 * 2. use minimal updating system?
	 * 3. import script on startup 
	 */
	onconstruct : function () {
		this._super.onconstruct ();
		var spirit = this.spirit;
		this.inputs = this.inputs.bind ( this );
		spirit.life.add ( gui.LIFE_DESTRUCT, this );
		if ( spirit instanceof edb.ScriptSpirit ) {
			this.autorun = false;
		} else if ( this.diff ) {
			this._updater = new edb.UpdateManager ( spirit );
		}
	},

	/**
	 * Destruction time.
	 */
	ondestruct : function () {
		this._super.ondestruct ();
		if ( this._script ) {
			this._script.dispose ();
		}
	},

	/**
	 * Handle attribute update.
	 * @param {gui.Att} att
	 */
	onatt : function ( att ) {
		if ( att.name === "src" ) {
			this.src = att.value;
		}
	},

	/**
	 * If in an iframe, now is the time to fit the iframe 
	 * to potential new content (emulating seamless iframes).
	 * @TODO: at least make sure IframeSpirit consumes this if not set to fit
	 * @param {gui.Tick} tick
	 */
	ontick : function ( tick ) {
		if ( tick.type === gui.TICK_DOC_FIT ) {
			this.spirit.action.dispatchGlobal ( gui.ACTION_DOC_FIT );
		}
	},
	
	/**
	 * @TODO: The issue here is that the {ui.UpdateManager} can't diff propertly unless we 
	 * wait for enter because it looks up the spirit via {gui.Spiritual#_spirits.inside}...
	 * @param {gui.Life} life
	 */
	onlife : function ( life ) {
		if ( life.type ===  gui.LIFE_ENTER ) {
			this.spirit.life.remove ( life.type, this );
			if ( this._dosrc ) {
				this.load ( this._dosrc );
				this._dosrc = null;
			}
		}
	},

	/**
	 * Load script from SRC. This happens async unless the SRC 
	 * points to a script embedded in the spirits own document 
	 * (and unless script has already been loaded into context).
	 * @param {String} src (directives resolved on target SCRIPT)
	 */
	load : function ( src ) {
		var win = this.context;
		var doc = win.document;
		var abs = gui.URL.absolute ( doc, src );
		if ( this.spirit.life.entered ) {
			if ( abs !== this._src ) {
				edb.Script.load ( win, doc, src, function onreadystatechange ( script ) {
					this._onreadystatechange ( script );
				}, this );
				this._src = abs;
			}
		} else { // {edb.UpdateManager} needs to diff
			this.spirit.life.add ( gui.LIFE_ENTER, this );
			this._dosrc = src;
		}
	},

	/**
	 * Compile script from source TEXT and run it when ready.
	 * @param {String} source Script source code
	 * @param @optional {HashMap<String,object>} directives Optional compiler directives
	 */
	compile : function ( source, directives ) {
		var win = this.context, url = new gui.URL ( this.context.document );
		edb.Script.compile ( win, url, source, directives, function onreadystatechange ( script ) {
			this._onreadystatechange ( script );
		}, this );
	},

	/**
	 * Run script (with implicit arguments) and write result to DOM.
	 * @see {gui.SandBoxView#render}
	 */
	run : function ( /* arguments */ ) {
		if ( this.loaded ) {
			this._script.pointer = this.spirit; // TODO!
			this.write ( 
				this._script.execute.apply ( 
					this._script, 
					arguments 
				)	
			);
		} else {
			this._dorun = arguments;
		}
	},
	
	/**
	 * Write the actual HTML to screen. You should probably only 
	 * call this method if you are producing your own markup 
	 * somehow, ie. not using EDBML templates out of the box. 
	 * @param {String} html
	 */
	write : function ( html ) {
		var changed = this._html !== html;
		if ( changed ) {
			this._html = html;
			this._stayfocused ( function () {
				if ( this.diff ) {
					this._updater.update ( html );
				} else {
					this.spirit.dom.html ( html ); // TODO: forms markup make valid!
				}
			});
			this.ran = true;
			this.spirit.life.dispatch ( 
				edb.LIFE_SCRIPT_DID_RUN, changed // @TODO Support this kind of arg...
			);
			if ( this.context.gui.hosted ) { // fit any containing iframe in next tick.
				var tick = gui.TICK_DOC_FIT;
				var id = this.context.gui.$contextid;
				gui.Tick.one ( tick, this, id ).dispatch ( tick, 0, id );
			}
		}
	},

	/**
	 * Private input for this script only.
	 * @see {edb.InputPlugin#dispatch}
	 * @param {object} data JSON object or array (demands arg 2) or an edb.Type instance (omit arg 2).
	 * @param @optional {function|String} type edb.Type constructor or "my.ns.MyType"
	 * @returns {edb.Object|edb.Array}
	 */
	input : function ( data, Type ) {
		var input = edb.Input.format ( this.context, data, Type );
		if ( this._script ) {
			this._script.input.match ( input );
		} else {
			this._doinput = this._doinput || [];
			this._doinput.push ( input );
		}
		return input.data;
	},

	/**
	 * Return data for input of type.
	 * @param {function} type
	 * @returns {object}
	 */
	inputs : function ( type ) {
		return this._script.input.get ( type );
	},


	// PRIVATES ...........................................................................

	/**
	 * Script SRC.
	 * @type {String}
	 */
	_src : null,

	/**
	 * Script thing.
	 * @type {edb.Script}
	 */
	_script : null,

	/**
	 * Update manager. 
	 * @type {edb.UpdateManager}
	 */
	_updater : null,

	/*
	 * Listing private input to be injected into script once loaded.
	 * @type {Array<edb.Input>}
	 */
	_doinput : null,

	/**
	 * @type {String}
	 */
	_dosrc : null,

	/**
	 * Run arguments on script loaded.
	 * @type {Arguments}
	 */
	_dorun : null,

	/**
	 * Snapshot latest HTML to avoid parsing duplicates.
	 * @type {String}
	 */
	_html : null,

	/**
	 * Handle script state change.
	 * @param {edb.Script} script
	 */
	_onreadystatechange : function ( script ) {
		this._script = this._script || script;
		switch ( script.readyState ) {
			case edb.Function.WAITING :
				if ( this._doinput ) {
					if ( this._doinput.length ) { // strange bug...
						while ( this._doinput.length ) {
							this.input ( this._doinput.shift ());
						}
						this._doinput = null;
					}
				}
				break;
			case edb.Function.READY :
				if ( !this.loaded ) {
					this.loaded = true;
					if ( this.debug ) {
						script.debug ();
					}
				}
				if ( this._dorun ) {
					this.run.apply ( this, this._dorun );
					this._dorun = null;
				} else if ( this.autorun ) {
					this.run (); // @TODO: only if an when entered!
				}
				break;
		}
	},

	/**
	 * Preserve form field focus before and after action.
	 * @param {function} action
	 */
	_stayfocused : function ( action ) {
		var field, selector = edb.EDBModule.fieldselector;
		action.call ( this );
		if ( selector ) {
			field = gui.DOMPlugin.q ( this.spirit.document, selector );
			if ( field && "#" + field.id !== selector ) {
				if ( field && gui.DOMPlugin.contains ( this.spirit, field )) {
					field.focus ();
					var text = "textarea,input:not([type=checkbox]):not([type=radio])";
					if ( gui.CSSPlugin.matches ( field, text )) {
						field.setSelectionRange ( 
							field.value.length, 
							field.value.length 
						);
					}
					this._restorefocus ( field );
					this._debugwarning ();
				}
			}
		}
	},

	/**
	 * Focus form field.
	 * @param {Element} field
	 */
	_restorefocus : function ( field ) {
		var text = "textarea,input:not([type=checkbox]):not([type=radio])";
		field.focus ();
		if ( gui.CSSPlugin.matches ( field, text )) {
			field.setSelectionRange ( 
				field.value.length, 
				field.value.length 
			);
		}
	},

	/**
	 * We're only gonna say this once.
	 */
	_debugwarning : function () {
		var This = edb.ScriptPlugin;
		if ( This._warning && this.spirit.window.gui.debug ) {
			console.debug ( This._warning );
			This._warning = null;
		}
	}

}, {}, { // Static .......................................................

	/**
	 * TODO: STACK LOST ANYWAY!
	 * @type {String}
	 */
	_warning : "Spiritual: Form elements with a unique @id may be updated without losing the undo-redo stack (now gone)."

});


/**
 * Init parent spirit {edb.ScriptPlugin} if there is a parent spirit. 
 * When the parent spirit runs the script, this spirit will destruct.
 */
edb.ScriptSpirit = gui.Spirit.extend ({

	/**
	 * Log compiled source to console?
	 * @type {boolean}
	 */
	debug : false,

	/**
	 * Hello.
	 */
	onconfigure : function () {
		this._super.onconfigure ();
		var parent = this.dom.parent ( gui.Spirit );
		if ( parent ) {
			this._initparentplugin ( parent );
		}
	},
	
	
	// Private .....................................................................

	/**
	 * Init {edb.ScriptPlugin} in parent spirit.
	 * @param {gui.Spirit} parent
	 */
	_initparentplugin : function ( parent ) {
		var src = this.att.get ( "src" );
		if ( src ) {
			parent.script.load ( src ); // diretives resolved from target script element
		} else {
			var directives = this.att.getmap ();
			directives.debug = directives.debug || this.debug;
			parent.script.compile ( this.dom.text (), directives );
		}
	}

});



/**
 * Spirit of the data service.
 * @see http://wiki.whatwg.org/wiki/ServiceRelExtension
 */
edb.ServiceSpirit = gui.Spirit.extend ({
	
	/**
	 * Default to accept JSON and fetch data immediately.
	 */
	onconstruct : function () {
		this._super.onconstruct ();
		var Type, type = this.att.get ( "type" );
		if ( type ) {
			Type = gui.Object.lookup ( type, this.window );
			if ( !Type ) {
				throw new TypeError ( "\"" + type + "\" is not a Type (in this context)." );
			}
		}
		if ( this.att.get ( "href" )) {
			new gui.Request ( this.element.href ).get ().then ( function ( status, data ) {
				type = ( function () {
					if ( Type ) {
						return new Type ( data );
					} else {
						switch ( gui.Type.of ( data )) {
							case "object" :
								return new edb.Object ( data );
							case "array" :
								return new edb.Array ( data );
						}
					}
				}());
				if ( type ) {
					//this.output.dispatch ( type );
					type.$output ( this.window );
				} else {
					console.error ( "TODO: handle unhandled response type" );
				}
			}, this );
		} else if ( Type ) {
			new Type ().$output ( this.window );
		}
	}

	// /**
	//  * TODO: enable this pipeline stuff
	//  * @param {edb.Input} input
	//  */
	// oninput : function ( input ) {
	// 	this._super.oninput ( input );
	// 	if ( this.att.get ( "type" ) && this.input.done ) {
	// 		this._pipeline ();
	// 	}
	// },
	
	// PRIVATES ...............................................................................................
	
	/**
	 * If both input type and output type is specified, the service will automatically output new data when all 
	 * input is recieved. Input data will be supplied as constructor argument to output function; if A and B is 
	 * input types while C is output type, then input instance a and b will be output as new C ( a, b ) 
	 * @TODO Implement support for this some day :)
	 *
	_pipeline : function () {		
		console.error ( "TODO: might this be outdated???" );
		 *
		 * TODO: use method apply with array-like arguments substitute pending universal browser support.
		 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/apply#Description
		 *
		var data = new this.output._type (
			this._arg ( 0 ),
			this._arg ( 1 ),
			this._arg ( 2 ),
			this._arg ( 3 ),
			this._arg ( 4 ),
			this._arg ( 5 ),
			this._arg ( 6 ),
			this._arg ( 7 ),
			this._arg ( 8 ),
			this._arg ( 9 )
		);
		this.output.dispatch ( data );
	},
	
	 *
	 * Return data for index. Index follows the order of which the input handler was added, not in which data was recieved. 
	 * Alright, so this implies that first index will return object of type MyData if handler for this type was added first.
	 * @param {number} index
	 * @returns {object}
	 *
	_arg : function ( index ) {
		var type = this.input._types [ index ]; // function type
		return this.input.get ( type ); // instance of function
	}
	*/
});


/**
 * EDB processing instruction.
 * @TODO Problem with one-letter variable names in <?input name="a" type="TestData"?>
 * @param {String} pi
 */
edb.Instruction = function ( pi ) {
	this.atts = Object.create ( null );
	this.type = pi.split ( "<?" )[ 1 ].split ( " " )[ 0 ]; // TODO: regexp this
	var hit, atexp = edb.Instruction._ATEXP;
	while (( hit = atexp.exec ( pi ))) {
		var n = hit [ 1 ], v = hit [ 2 ];
		this.atts [ n ] = gui.Type.cast ( v );
	}
};

/**
 * Identification.
 * @returns {String}
 */
edb.Instruction.prototype = {
	type : null, // instruction type
	atts : null, // instruction attributes
	toString : function () {
		return "[object edb.Instruction]";
	}
};


// STATICS .............................................................................

/**
 * Extract processing instructions from source.
 * @param {String} source
 * @returns {Array<edb.Instruction>}
 */
edb.Instruction.from = function ( source ) {
	var pis = [], hit = null; 
	while (( hit = this._PIEXP.exec ( source ))) {
			pis.push ( new edb.Instruction ( hit [ 0 ]));
	}
	return pis;
};

/**
 * Remove processing instructions from source.
 * @param {String} source
 * @returns {String}
 */
edb.Instruction.clean = function ( source ) {
	return source.replace ( this._PIEXP, "" );
};

/**
 * Math processing instruction.
 * @type {RegExp}
 */
edb.Instruction._PIEXP = /<\?.[^>?]+\?>/g;

/**
 * Match attribute name and value.
 * @type {RegExp}
 */
edb.Instruction._ATEXP = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g;


/**
 * Script runner.
 */
edb.Runner = function Runner () {};

edb.Runner.prototype = {

	firstline : false,
	lastline : false,
	firstchar : false,
	lastchar : false,

	/**
	 * Run script.
	 * @param {edb.Compiler} compiler
	 * @param {String} script
	 * @param {edb.Status} status
	 * @param {edb.Result} result
	 */
	run : function ( compiler, script, status, result ) {
		this._runlines ( compiler, script.split ( "\n" ), status, result );
	},

	/**
	 * Line text ahead equals given string?
	 * @param {String} string
	 * @returns {boolean}
	 */
	ahead : function ( string ) {
		var line = this._line;
		var index = this._index;
		var i = index + 1;
		var l = string.length;
		return line.length > index + l && line.substring ( i, i + l ) === string;
	},

	/**
	 * Line text behind equals given string?
	 * @param {String} line
	 * @param {number} index
	 * @param {String} string
	 * @returns {boolean}
	 */
	behind : function ( string ) {
		var line = this._line;
		var index = this._index;
		var length = string.length, start = index - length;
		return start >= 0 && line.substr ( start, length ) === string;
	},

	/**
	 * Get line string from current position.
	 * @returns {String}
	 */
	lineahead : function () {
		return this._line.substring ( this._index + 1 );
	},

	/**
	 * Space-stripped line text at index equals string?
	 * @param {String} string
	 * @returns {boolean}
	 */
	skipahead : function ( string ) {
		console.error ( "TODO" );
		/*
		line = line.substr ( index ).replace ( / /g, "" );
		return this._ahead ( line, 0, string );
		*/
	},

	// Private ..........................................................

	/**
	 * Current line string.
	 * @type {String}
	 */
	_line : null,

	/**
	 * Current character index.
	 * @type {number}
	 */
	_index : -1,

	/**
	 * Run all lines.
	 * @param {edb.Compiler} compiler
	 * @param {Array<String>} lines
	 * @param {edb.Status} status
	 * @param {edb.Result} result
	 */
	_runlines : function ( compiler, lines, status, result ) {
		var stop = lines.length - 1;
		lines.forEach ( function ( line, index ) {
			this.firstline = index === 0;
			this.lastline = index === stop;
			this._runline ( line, index, compiler, status, result );
		}, this );
	},

	/**
	 * Run single line.
	 * @param {String} line
	 * @param {number} index
	 * @param {edb.Compiler} compiler
	 * @param {edb.Status} status
	 * @param {edb.Result} result
	 */
	_runline : function ( line, index, compiler, status, result ) {
		line = this._line = line.trim ();
		if ( line.length ) {
			compiler.newline ( line, this, status, result );
			this._runchars ( compiler, line.split ( "" ), status, result );
			compiler.endline ( line, this, status, result );
		}
	},

	/**
	 * Run all chars.
	 * @param {edb.Compiler} compiler
	 * @param {Array<String>} chars
	 * @param {edb.Status} status
	 * @param {edb.Result} result
	 */
	_runchars : function ( compiler, chars, status, result ) {
		var stop = chars.length - 1;
		chars.forEach ( function ( c, i ) {
			this._index = i;
			this.firstchar = i === 0;
			this.lastchar = i === stop;
			compiler.nextchar ( c, this, status, result );
		}, this );
	}
};


/**
 * Stateful compiler stuff.
 * @param {String} body
 */
edb.Status = function Status () {
	this.conf = [];
};

// Static ....................................................

edb.Status.MODE_JS = "js";
edb.Status.MODE_HTML = "html";
edb.Status.MODE_TAG = "tag";

// Instance ..................................................

edb.Status.prototype = {
	mode : edb.Status.MODE_JS,
	peek : false,
	poke : false,
	cont : false,
	adds : false,
	func : null,
	conf : null,
	curl : null,
	skip : 0,
	last : 0,
	spot : 0,
	indx : 0,

	// tags
	refs : false, // pass by reference in tags

	/**
	 * Is JS mode?
	 * @returns {boolean}
	 */
	isjs : function () {
		return this.mode === edb.Status.MODE_JS;
	},

	/**
	 * Is HTML mode?
	 * @returns {boolean}
	 */
	ishtml : function () {
		return this.mode === edb.Status.MODE_HTML;
	},

	/**
	 * Is tag mode?
	 * @returns {boolean}
	 */
	istag : function () {
		return this.mode === edb.Status.MODE_TAG;
	},

	/**
	 * Go JS mode.
	 */
	gojs : function () {
		this.mode = edb.Status.MODE_JS;
	},

	/**
	 * Go HTML mode.
	 */
	gohtml : function () {
		this.mode = edb.Status.MODE_HTML;
	},

	/**
	 * Go tag mode.
	 */
	gotag : function () {
		this.mode = edb.Status.MODE_TAG;
	}
};


/**
 * Collecting compiler result.
 * @param @optional {String} body
 */
edb.Result = function Result ( body ) {
	this.body = body || "";
};

edb.Result.prototype = {

	/**
	 * Main result string.
	 * @type {String}
	 */
	body : null,

	/**
	 * Temp string buffer.
	 * @type {String}
	 */
	temp : null,

	/**
	 * Format result for readability.
	 * @returns {String}
	 */
	format : function () {
		return edb.Result.format ( this.body );
	}
};

/**
 * Format JS for readability.
 * @TODO Indent switch cases
 * @TODO Remove blank lines
 * @param {String} body
 * @returns {String}
 */
edb.Result.format = function ( body ) {
	var result = "",
		tabs = "\t",
		init = null,
		last = null,
		fixt = null,
		hack = null;
	body.split ( "\n" ).forEach ( function ( line ) {
		line = line.trim ();
		init = line.charAt ( 0 );
		last = line.charAt ( line.length - 1 );
		fixt = line.split ( "//" )[ 0 ].trim ();
		hack = fixt.charAt ( fixt.length - 1 );
		if (( init === "}" || init === "]" ) && tabs !== "" ) {				
			tabs = tabs.slice ( 0, -1 );
		}
		result += tabs + line + "\n";
		if ( last === "{" || last === "[" || hack === "{" || hack === "[" ) {
			tabs += "\t";
		}
	});
	return result;
};


/**
 * An abstract storage stub. We've rigged this up to 
 * store {edb.Object} and {edb.Array} instances only.
 * @TODO propagate "context" throughout all methods.
 */
edb.Storage = gui.Class.create ( Object.prototype, {

}, { // Recurring static ...........................

	/**
	 * Let's make this async and on-demand.
	 * @throws {Error}
	 */
	length : {
		getter : function () {
			throw new Error ( "Not supported." );
		}
	},

	/**
	 * Get type.
	 * @param {String} key
	 * @param {Window|WorkerScope} context
	 * @returns {gui.Then}
	 */
	getItem : function ( key, context ) {
		var then = new gui.Then ();
		var type = this [ key ];
		if ( false && type ) { // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			then.now ( type || null );
		} else {
			this.$getItem ( key, context, function ( type ) {
				this [ key ] = type;
				gui.Tick.next ( function () { // @TODO bug in gui.Then!
					then.now ( type || null );
				});
			});
		}
		return then;
	},

	/**
	 * Set type.
	 * @param {String} key
	 * @param {object} type
	 * @param {Window|WorkerScope} context
	 * @returns {object}
	 */
	setItem : function ( key, type, context ) {
		var then = new gui.Then ();
		if ( edb.Storage.$typecheck ( type )) {
			this.$setItem ( key, type, context, function () {
				this [ key ] = type;
				then.now ( type );
			});
		}
		return then;
	},

	/**
	 * Remove type.
	 * @param {String} key
	 */
	removeItem : function ( key ) {
		var then = new gui.Then ();
		delete this [ key ];
		this.$removeItem ( key, function () {
			then.now ();
		});
		return then;
	},

	/**
	 * Clear the store.
	 */
	clear : function () {
		var then = new gui.Then ();
		this.$clear ( function () {
			Object.keys ( this ).filter ( function ( key ) {
				return this.prototype [ key ]	=== undefined;
			}, this ).forEach ( function ( key ) {
				delete this [ key ];
			}, this );
			then.now ();
		});
		return then;
	},


	// Secrets ...........................................

	/**
	 * Get type.
	 * @param {String} key
	 * @param {edb.Model|edb.Collection} type
	 */
	$getItem : function ( key, context, callback ) {},

	/**
	 * Set type.
	 * @param {String} key
	 * @param {function} callback
	 * @param {edb.Model|edb.Collection} type
	 */
	$setItem : function ( key, type, context, callback ) {},

	/**
	 * Remove type.
	 * @param {String} key
	 * @param {function} callback
	 */
	$removeItem : function ( key, callback ) {},

	/**
	 * Clear.
	 * @param {function} callback
	 */
	$clear : function ( callback ) {}


}, { // Static ...................................................

	/**
	 * @param {object} type
	 * @returns {boolean}
	 */
	$typecheck : function ( type ) {
		if ( edb.Type.isInstance ( type )) {
			if ( type.constructor.$classname !== gui.Class.ANONYMOUS ) {
				return true;
			} else {
				throw new Error ( "Cannot persist ANONYMOUS Type" );
			}
		} else {
			throw new TypeError ( "Persist only models and collections" );
		}
	}

});


/**
 * DOM storage.
 */
edb.DOMStorage = edb.Storage.extend ({

}, { // Recurring static ................................

	/**
	 * Write to storage blocking on top context shutdown.
	 * @param {gui.Broadcast} b
	 *
	onbroadcast : function ( b ) {
		if ( b.type === gui.BROADCAST_UNLOAD ) {
			if ( b.data === gui.$contextid ) {
				this.$write ( b.target.window, true );
			}
		}
	},
	*/


	// Private static .....................................

	/**
	 * We're storing the whole thing under one single key. 
	 * @TODO: this key is hardcoded for now (see subclass).
	 * @type {String}
	 */
	_storagekey : null,

	/**
	 * Mapping Type constructors to (normalized) instance JSON.
	 * @type {Map<String,String>}
	 */
	_storagemap : null,

	/**
	 * Returns is either sessionStorage or localStorage.
	 * @returns {Storage}
	 */
	_domstorage : function () {},

	/**
	 * Timeout key for async write to storage.
	 * @type {number}
	 */
	_timeout : -1,


	// Secret static ......................................

	/**
	 * Get item.
	 * @param {String} key
	 * @param @optional {Window|WorkerScope} context
	 * @param {function} callback
	 */
	$getItem : function ( key, context, callback ) {
		var json = null;
		var type = null;
		var Type = null;
		var xxxx = this.$read ( context );
		if (( json = xxxx [ key ])) {
			json = JSON.parse ( json );
			Type = gui.Object.lookup ( key, context || self );
			type = Type ? new Type ( json ) : null;
		}
		callback.call ( this, type );
	},

	/**
	 * Set item.
	 * @param {String} key
	 * @param {function} callback
	 * @param {edb.Model|edb.Collection} item
	 * @param @optional {boolean} now (temp mechanism)
	 */
	$setItem : function ( key, item, context, callback, now ) {
		var xxxx = this.$read ( context );
		xxxx [ key ] = item.$stringify ();
		this.$write ( context, true );
		callback.call ( this );
	},

	/**
	 * Remove item.
	 * @param {String} key
	 * @param {function} callback
	 */
	$removeItem : function ( key, context, callback ) {
		var xxxx = this.$read ( context );
		delete xxxx [ key ];
		this.$write ( context, false );
		callback.call ( this );
	},

	/**
	 * Clear the store.
	 * @param {function} callback
	 */
	$clear : function ( context, callback ) {
		this._domstorage ( context ).removeItem ( this._storagekey );
		this._storagemap = null;
		callback.call ( this );
	},

	/**
	 * Read from storage sync and blocking.
	 * @returns {Map<String,String>}
	 */
	$read : function ( context ) {
		context = window;
		if ( !this._storagemap ) {
			var map = this._domstorage ( context ).getItem ( this._storagekey );
			this._storagemap = map ? JSON.parse ( map ) : {};
		}
		return this._storagemap;
	},

	/**
	 * We write continually in case the browser crashes, 
	 * but async unless the (top???) context is shutting down.
	 * @param {boolean} now
	 */
	$write : function ( context, now ) {
		clearTimeout ( this._timeout );
		var map = this._storagemap;
		var key = this._storagekey;
		var dom = this._domstorage ( context );
		context = window;
		function write () {
			try {
				dom.setItem ( key, JSON.stringify ( map ));
			} catch ( x ) {
				alert ( x );
			}
		}
		if ( map ) {
			if ( now || true ) {
				write ();
			} else {
				this._timeout = setTimeout ( function unfreeze () {
					write ();
				}, 50 );
			}
		}
	}

});


/**
 * Session persistant storage.
 * @extends {edb.DOMStorage}
 */
edb.SessionStorage = edb.DOMStorage.extend ({

}, { // Static .................................

	/**
	 * Storage target.
	 * @returns {SessionStorage}
	 */
	_domstorage : function ( context ) {
		return context.sessionStorage;
	},

	/**
	 * Storage key.
	 * @type {String}
	 */
	_storagekey : "MyVendor.MyApp.SessionStorage"

});

/**
 * Write sync on context shutdown.
 *
( function shutdown () {
	gui.Broadcast.addGlobal ( 
		gui.BROADCAST_UNLOAD, 
		edb.SessionStorage 
	);
}());
*/


/**
 * Device persistant storage.
 * @extends {edb.DOMStorage}
 */
edb.LocalStorage = edb.DOMStorage.extend ({

}, {  // Static ............................

	/**
	 * Storage target.
	 * @returns {LocalStorage}
	 */
	_domstorage : function ( context ) {
		return context.localStorage;
	},

	/**
	 * Storage key.
	 * @type {String}
	 */
	_storagekey : "MyVendor.MyApp.LocalStorage"

});

/**
 * Write sync on context shutdown.
 *
( function shutdown () {
	gui.Broadcast.addGlobal ( 
		gui.BROADCAST_UNLOAD, 
		edb.LocalStorage 
	);
}());
*/


/**
 * States are a conceptual rebranding of edb.Objects to serve primarily as spirit viewstate.
 */
edb.State = edb.Object.extend ({

}, { // Static ......................

	/**
	 * Non-persistant state. This is not particularly useful.
	 * @see {edb.SessionState}
	 * @see {edb.LocalState}
	 * @type {String}
	 */
	storage : null

});


/**
 * Session persistant state.
 * @extends {edb.SessionState}
 */
edb.SessionState = edb.State.extend ({

}, { // Static .............................

	/**
	 * @type {edb.Storage}
	 */
	storage : edb.SessionStorage

});


/**
 * Device persistant state.
 * @extends {edb.LocalState}
 */
edb.LocalState = edb.State.extend ({

}, { // Static ...........................

	/**
	 * @type {edb.Storage}
	 */
	storage : edb.LocalStorage

});


/**
 * Core compiler business logic. This is where we parse the strings.
 */
edb.Compiler = gui.Class.create ( Object.prototype, {

	/**
	 * Line begins.
	 * @param {String} line
	 * @param {edb.Runner} runner
	 * @param {edb.Status} status
	 * @param {edb.Result} result
	 */
	newline : function ( line, runner, status, result ) {
		status.last = line.length - 1;
		status.adds = line [ 0 ] === "+";
		status.cont = status.cont || ( status.ishtml () && status.adds );
	},

	/**
	 * Line ends.
	 * @param {String} line
	 * @param {edb.Runner} runner
	 * @param {edb.Status} status
	 * @param {edb.Result} result
	 */
	endline : function  ( line, runner, status, result ) {
		if ( status.ishtml ()) {
			if ( !status.cont ) {
				result.body += "';\n";
				status.gojs ();
			}
		} else {
			result.body += "\n";
		}
		status.cont = false;
	},

	/**
	 * Next char.
	 * @param {String} c
	 * @param {edb.Runner} runner
	 * @param {edb.Status} status
	 * @param {edb.Result} result
	 */
	nextchar : function ( c, runner, status, result ) {
		switch ( status.mode ) {
			case edb.Status.MODE_JS :
				this._compilejs ( c, runner, status, result );
				break;
			case edb.Status.MODE_HTML :
				this._compilehtml ( c, runner, status, result);
				break;
			case edb.Status.MODE_TAG :
				this._compiletag ( c, runner, status, result );
				break;
		}
		if ( status.skip-- <= 0 ) {
			if ( status.poke || status.geek ) {
				result.temp += c;
			} else {
				if ( !status.istag ()) {
					result.body += c;
				}
			}
		}
	},


	// Private .....................................................
	
	/**
	 * Compile EDBML source to function body.
	 * @param {String} script
	 * @returns {String}
	 */
	_compile : function ( script ) {
		var runner = new edb.Runner (); 
		var status = new edb.Status ();
		var result = new edb.Result ( '"use strict";\n' );
		runner.run ( this, script, status, result );
		result.body += ( status.ishtml () ? "';" : "" ) + "\nreturn out.write ();";
		return result.format ();
	},

	/**
	 * Compile character as script.
	 * @param {String} c
	 * @param {edb.Runner} runner
	 * @param {edb.Status} status
	 * @param {edb.Result} result
	 */
	_compilejs : function ( c, runner, status, result ) {
		switch ( c ) {
			case "<" :
				if ( runner.firstchar ) {
					var line = "JSHINT";
					var i = "JSHINT";
					var tag;
					if ( false && ( tag = this._tagstart ( line ))) {
						status.gotag ();
						this._aaa ( status, line, i );
					} else if ( false && ( tag = this._tagstop ( line ))) {
						status.gotag (); // js?
						this._bbb ( status );
					} else {
						status.gohtml ();
						status.spot = result.body.length - 1;
						result.body += "out.html += '";
					}
				}
				break;
			case "@" :
				this._scriptatt ( runner, status, result );
				break;
		}
	},
	
	/**
	 * Compile character as HTML.
	 * @param {String} c
	 * @param {edb.Runner} runner
	 * @param {edb.Status} status
	 * @param {edb.Result} result
	 */
	_compilehtml : function ( c, runner, status, result ) {
		var special = status.peek || status.poke || status.geek;
		switch ( c ) {
			case "{" :
				if ( special ) {
					status.curl ++;
				}
				break;
			case "}" :
				if ( -- status.curl === 0 ) {
					if ( status.peek ) {
						status.peek = false;
						status.skip = 1;
						status.curl = 0;
						result.body += ") + '";
					}
					if ( status.poke ) {
						this._poke ( status, result );
						status.poke = false;
						result.temp = null;
						status.spot = -1;
						status.skip = 1;
						status.curl = 0;
					}
					if ( status.geek ) {
						this._geek ( status, result );
						status.geek = false;
						result.temp = null;
						status.spot = -1;
						status.skip = 1;
						status.curl = 0;
					}
				}
				break;
			case "$" :
				if ( !special && runner.ahead ( "{" )) {
					if ( runner.behind ( "gui.test=\"" )) {
						status.geek = true;
						status.skip = 2;
						status.curl = 0;
						result.temp = "";
					} else {
						status.peek = true;
						status.skip = 2;
						status.curl = 0;
						result.body += "' + (";
					}			
				}
				break;
			case "#" :
				if ( !special && runner.ahead ( "{" )) {
					status.poke = true;
					status.skip = 2;
					status.curl = 0;
					result.temp = "";
				}
				break;
			case "+" :
				if ( runner.firstchar ) {
					status.skip = status.adds ? 1 : 0;
				} else if ( runner.lastchar ) {
					status.cont = true;
					status.skip = 1;
				}
				break;
			case "'" :
				if ( !special ) {
					result.body += "\\";
				}
				break;
			case "@" :
				this._htmlatt ( runner, status, result );
				break;
		}
	},

	/**
	 * Compile character as tag.
	 * @param {String} c
	 * @param {edb.Runner} runner
	 * @param {edb.Status} status
	 * @param {edb.Result} result
	 */
	_compiletag : function ( status, c, i, line ) {
		switch ( c ) {
			case "$" :
				if ( this._ahead ( line, i, "{" )) {
					status.refs = true;
					status.skip = 2;
				}
				break;
			case ">" :
				status.gojs ();
				status.skip = 1;
				break;
		}
	},

	/*
	 * Parse @ notation in JS.
	 * TODO: preserve email address and allow same-line @
	 * @param {String} line
	 * @param {number} i
	 */
	_scriptatt : function ( runner, status, result ) {
		var attr = edb.Compiler._ATTREXP;
		var rest, name;
		if ( runner.behind ( "@" )) {} 
		else if ( runner.ahead ( "@" )) {
			result.body += "var att = new edb.Att ();";
			status.skip = 2;
		} else {
			rest = runner.lineahead ();
			name = attr.exec ( rest )[ 0 ];
			if ( name ) {
				result.body += rest.replace ( name, "att['" + name + "']" );
				status.skip = rest.length;
			} else {
				throw "Bad @name: " + rest;
			}
		}
	},

	/*
	 * Parse @ notation in HTML.
	 * @param {String} line
	 * @param {number} i
	 */
	_htmlatt : function ( runner, status, result ) {
		var attr = edb.Compiler._ATTREXP;
		var rest, name, dels, what;
		if ( runner.behind ( "@" )) {}
		else if ( runner.behind ( "#{" )) { console.error ( "todo" );} // onclick="#{@passed}"
		else if ( runner.ahead ( "@" )) {
			result.body += "' + att._all () + '";
			status.skip = 2;
		} else {
			rest = runner.lineahead ();
			name = attr.exec ( rest )[ 0 ];
			dels = runner.behind ( "-" );
			what = dels ? "att._pop" : "att._out";
			result.body = dels ? result.body.substring ( 0, result.body.length - 1 ) : result.body;
			result.body += "' + " + what + " ( '" + name + "' ) + '";
			status.skip = name.length + 1;
		}
	},

	/**
	 * Generate poke at marked spot.
	 * @param {edb.Status} status
	 * @param {edb.Result} result
	 */
	_poke : function ( status, result ) {
		this._inject ( status, result, edb.Compiler._POKE );
	},

	/**
	 * Generate geek at marked spot.
	 * @param {edb.Status} status
	 * @param {edb.Result} result
	 */
	_geek : function ( status, result ) {
		this._inject ( status, result, edb.Compiler._GEEK );
	},

	/**
	 * Inject JS (outline and inline combo) at marked spot.
	 * @param {edb.Status} status
	 * @param {edb.Result} result
	 * @param {Map<String,String>} js
	 */
	_inject : function ( status, result, js ) {
		var body = result.body,
			temp = result.temp,
			spot = status.spot,
			prev = body.substring ( 0, spot ),
			next = body.substring ( spot ),
			name = gui.KeyMaster.generateKey ();
		result.body = 
			prev + "\n" + 
			js.outline.replace ( "$name", name ).replace ( "$temp", temp ) + 
			next +
			js.inline.replace ( "$name", name );
	}
	

	// TAGS .....................................................................

	/**
	 * Tag start?
	 * @param {String} line
	 *
	_tagstart : function ( line ) {
		return this._ahead ( line, 0, "ole" );
	},

	/**
	 * Tag stop?
	 * @param {String} line
	 *
	_tagstop : function ( line ) {
		return this._ahead ( line, 0, "/ole>" );
	},
	
	_aaa : function ( status, line, i ) {
		result.body += "out.html += Tag.get ( '#ole', window )( function ( out ) {";
		var elem = new gui.HTMLParser ( document ).parse ( line + "</ole>" )[ 0 ];
		var json = JSON.stringify ( gui.AttPlugin.getmap ( elem ), null, "\t" );
		var atts = this._fixerupper ( json );
		status.conf.push ( atts );
	},

	_bbb : function ( status ) {
		result.body += "}, " + status.conf.pop () + ");";
		status.conf = null;
	},

	_fixerupper : function ( json ) {

		var status = new edb.State ();
		result.body = "";


		var lines = json.split ( "\n" );
		lines.forEach ( function ( line, index ) {
			Array.forEach ( line, function ( c, i ) {
				switch ( c ) {
					case "\"" :
						if ( !status.peek && !status.poke ) {
							if ( this._ahead ( line, i, "${" )) {
								status.peek = true;
								status.skip = 3;
							} else if ( this._ahead ( line, i, "#{" )) {
								status.poke = true;
								status.skip = 3;
								result.temp = " function () {\n";
								status.spot = result.body.length - 1;
							}
						}
						break;
					case "}" :
						if ( status.peek || status.poke ) {
							if ( this._skipahead ( line, i, "\"" )) {
								if ( status.poke ) {
									result.temp += "\n}";
									result.body = result.body.substring ( 0, status.spot ) + 
									result.temp + result.body.substring ( status.spot );
								}
								status.peek = false;
								status.poke = false;
								status.skip = 2;
							}
						}
						break;
				}
				if ( status.skip-- <= 0 ) {
					if ( status.poke ) {
						result.temp += c;
					} else {
						result.body += c;
					}
				}
			}, this );
			if ( index < lines.length - 1 ) {
				result.body += "\n";
			}
		}, this );
		return result.body; //.replace ( /"\${/g, "" ).replace ( /\}"/g, "" );
	}
	*/


}, {}, { // Static ............................................................................

	/**
	 * Poke.
	 * @type {String}
	 */
	_POKE : {
		outline : "var $name = edb.set ( function ( value, checked ) {\n$temp;\n}, this );",
		inline: "edb.go(event,&quot;\' + $name + \'&quot;);"
	},

	/**
	 * Geek.
	 * @type {String}
	 */
	_GEEK : {
		outline : "var $name = edb.set ( function () {\nreturn $temp;\n}, this );",
		inline: "edb.get(&quot;\' + $name + \'&quot;);"
	},

	/**
	 * Matches a qualified attribute name (class,id,src,href) allowing 
	 * underscores, dashes and dots while not starting with a number. 
	 * @TODO class and id may start with a number nowadays!!!!!!!!!!!!
	 * @TODO https://github.com/jshint/jshint/issues/383
	 * @type {RegExp}
	 */
	_ATTREXP : /^[^\d][a-zA-Z0-9-_\.]+/

});


/**
 * Compile EDB function.
 * @TODO precompiler to strip out both JS comments and HTML comments.
 */
edb.FunctionCompiler = edb.Compiler.extend ({

	/**
	 * Source of compiled function.
	 * @type {String}
	 */
	source : null,

	/**
	 * Imported functions and tags.
	 * @type {Array<edb.Import>}
	 */
	dependencies : null,

	/**
	 * Mapping script tag attributes.
	 * @type {HashMap<String,String>}
	 */
	directives : null,

	/**
	 * Compile sequence.
	 * @type {Array<string>}
	 */
	sequence : null,

	/**
	 * Construction.
	 * @param {String} source
	 * @param {Map<String,String} directives
	 */
	onconstruct : function ( source, directives ) {
		this.directives = directives || Object.create ( null );
		this.source = source;
		this.sequence = [ 
			"_validate", 
			"_extract", 
			"_direct", 
			"_declare", 
			"_define", 
			"_compile"
		];
	},
		
	/**
	 * Compile source to invocable function.
	 * @param {Window} context
	 * @param {Document} basedoc
	 * @returns {function}
	 */
	compile : function ( context, url ) {
		var result = null;
		this.dependencies = [];
		this._params = [];
		this._context = context;
		this._url = url;
		this._vars = [];
		var head = {
			declarations : Object.create ( null ), // Map<String,boolean>
			functiondefs : [] // Array<String>
		};
		this.sequence.forEach ( function ( step ) {
			this.source = this [ step ] ( this.source, head );
		}, this );
		try {
			result = this._convert ( this.source, this._params );
			this.source = this._source ( this.source, this._params );
		} catch ( exception ) {
			result = this._fail ( exception );
		}
		return result;
	},

	/**
	 * Sign generated methods with a gui.$contextid key. This allows us to evaluate assigned 
	 * functions in a context different to where the template HTML is used (sandbox scenario).
	 * @param {String} contextid
	 * @returns {edb.ScriptCompiler}
	 */
	sign : function ( contextid ) {
		this._$contextid = contextid;
		return this;
	},
	

	// PRIVATE ..............................................................................
	
	/**
	 * Function to be declared in this window (or worker scope).
	 * @type {Window}
	 */
	_context : null,

	/**
	 * (Optionally) stamp a $contextid into edb.ScriptCompiler.invoke() callbacks.
	 * @type {String} 
	 */
	_$contextid : null,

	/**
	 * Script processing intstructions.
	 * @type {Array<edb.Instruction>}
	 */
	_instructions : null,

	/**
	 * Compiled function arguments list. 
	 * @type {Array<String>}
	 */
	_params : null,

	/**
	 * Did compilation fail just yet?
	 * @type {boolean}
	 */
	_failed : false,

	/**
	 * Confirm no nested EDBML scripts because it's not parsable in the browser.
	 * @see http://stackoverflow.com/a/6322601
	 * @param {String} script
	 * @param {What?} head
	 * @returns {String}
	 */
	_validate : function ( script ) {
		if ( edb.FunctionCompiler._NESTEXP.test ( script )) {
			throw "Nested EDBML dysfunction";
		}
		return script;
	},

	/**
	 * Handle directives. Nothing by default.
	 * @see {edb.TagCompiler._direct}
	 * @param  {String} script
	 * @returns {String}
	 */
	_direct : function ( script ) {
		return script;
	},
	
	/**
	 * Extract and evaluate processing instructions.
	 * @param {String} script
	 * @param {What?} head
	 * @returns {String}
	 */
	_extract : function ( script, head ) {
		edb.Instruction.from ( script ).forEach ( function ( pi ) {
			this._instruct ( pi );
		}, this );
		return edb.Instruction.clean ( script );
	},

	/**
	 * Evaluate processing instruction.
	 * @param {edb.Instruction} pi
	 */
	_instruct : function ( pi ) {
		var type = pi.type;
		var atts = pi.atts;
		var href = atts.src;
		var name = atts.name;
		var cont = this._context;
		switch ( type ) {
			case "param" :
				this._params.push ( name );
				break;
			case "function" :
			case "tag" :
				if ( type === edb.Import.TYPE_TAG ) {
					if ( href.contains ( "#" )) {
						name = href.split ( "#" )[ 1 ];
					} else {
						throw new Error ( "Missing tag #identifier: " + href );
					}
				}
				var base = this._basedocument ();
				this.dependencies.push ( 
					new edb.Import ( cont, base, type, href, name )
				);
				break;
		}
	},

	/**
	 * Remove processing instrutions and translate collected inputs to variable declarations.
	 * @param {String} script
	 * @param {What?} head
	 * @returns {String}
	 */
	_declare : function ( script, head ) {
		var funcs = [];
		this.dependencies.forEach ( function ( dep ) {
			head.declarations [ dep.name ] = true;
			funcs.push ( dep.name + " = get ( self, '" + dep.tempname () + "' );\n" );
		}, this );
		if ( funcs [ 0 ]) {
			head.functiondefs.push ( 
				"( function functions ( get ) {\n" +
				funcs.join ( "" ) +
				"}( edb.Function.get ));"
			);
		}
		return script;
	},

	/**
	 * Define more stuff in head.
	 * @param {String} script
	 * @param {What?} head
	 * @returns {String}
	 */
	_define : function ( script, head ) {
		var vars = "", html = "var ";
		Object.keys ( head.declarations ).forEach ( function ( name ) {
			vars += ", " + name;
		});
		if ( this._params.indexOf ( "out" ) < 0 ) {
			html += "Out = edb.Out, out = new Out (), ";
		}
		if ( this._params.indexOf ( "att" ) < 0 ) {
			html += "Att = edb.Att, att = new Att (), ";
		}
		html += "Tag = edb.Tag " + vars + ";\n";
		head.functiondefs.forEach ( function ( def ) {
			html += def +"\n";
		});
		return html + script;
	},
	
	/**
	 * Evaluate script to invocable function.
	 * @param {String} script
	 * @param @optional (Array<String>} params
	 * @returns {function}
	 */
	_convert : function ( script, params ) {
		var args = "", context = this._context;
		if ( gui.Type.isArray ( params )) {
			args = params.join ( "," );
		}
		return new context.Function ( args, script );
	},

	/**
	 * Compilation failed. Output a fallback rendering.
	 * @param {Error} exception
	 * @returns {function}
	 */
	_fail : function ( exception ) {
		var context = this._context;
		if ( !this._failed ) {
			this._failed = true;
			this._debug ( edb.Result.format ( this.source ));
			this.source = "<p class=\"error\">" + exception.message + "</p>";
			return this.compile ( context, true );
		} else {
			throw ( exception );
		}
	},
	
	/**
	 * Transfer broken script source to script element and import on page.
	 * Hopefully this will allow the developer console to aid in debugging.
	 * TODO: Fallback for IE9 (see http://stackoverflow.com/questions/7405345/data-uri-scheme-and-internet-explorer-9-errors)
	 * TODO: Migrate this stuff to the gui.BlobLoader
	 * @param {String} source
	 */
	_debug : function ( source ) {
		var context = this._context;
		if ( window.btoa ) {
			source = context.btoa ( "function debug () {\n" + source + "\n}" );
			var script = context.document.createElement ( "script" );
			script.src = "data:text/javascript;base64," + source;
			context.document.querySelector ( "head" ).appendChild ( script );
			script.onload = function () {
				this.parentNode.removeChild ( this );
			};
	  } else {
			// TODO: IE!
	  }
	},

	/**
	 * Compute full script source (including arguments) for debugging stuff.
	 * @returns {String}
	 */
	_source : function ( source, params ) {
		var lines = source.split ( "\n" ); lines.pop (); // empty line :/
		var args = params.length ? "( " + params.join ( ", " ) + " )" : "()";
		return "function " + args + " {\n" + lines.join ( "\n" ) + "\n}";
	},

	/**
	 * Base document to resolve relative URLs in templates. 
	 * @TODO: Works not in IE9, on the server or in workers.
	 */
	_basedocument : function () {
		return this._document || ( this._document = ( function ( href ) {
			var doc = document.implementation.createHTMLDocument ( "temp" );
	    var base = doc.createElement ( "base" );
			base.href = href;
			doc.querySelector ( "head" ).appendChild ( base );
			return doc;
		}( this._url.href )));
	}
	

}, {}, { // Static ............................................................................

	/**
	 * RegExp used to validate no nested scripts (because those are not parsable in the browser). 
	 * http://stackoverflow.com/questions/1441463/how-to-get-regex-to-match-multiple-script-tags
	 * http://stackoverflow.com/questions/1750567/regex-to-get-attributes-and-body-of-script-tags
	 * TODO: stress test for no SRC attribute!
	 * @type {RegExp}
	 */
	_NESTEXP : /<script.*type=["']?text\/edbml["']?.*>([\s\S]+?)/g

});


/**
 * Add support for data types.
 * @extends {edb.FunctionCompiler}
 */
edb.ScriptCompiler = edb.FunctionCompiler.extend ({

	/**
	 * Observed data types.
	 * @type {Map<String,String}
	 */
	inputs : null,

	/**
	 * Handle instruction.
	 */
	_instruct : function ( pi ) {
		this._super._instruct ( pi );
		var atts = pi.atts;
		switch ( pi.type ) {
			case "input" :
				this.inputs [ atts.name ] = atts.type;
				break;
		}
	},

	/**
	 * Compile script to invocable function.
	 * @param {Window} scope Function to be declared in scope of this window (or worker context).
	 * @param @optional {boolean} fallback
	 * @returns {function}
	 */
	compile : function ( context, url ) {
		this.inputs = Object.create ( null );
		return this._super.compile ( context, url );
	},

	/**
	 * Declare.
	 * @overrides {edb.FunctionCompiler} declare
	 * @param {String} script
	 * @returns {String}
	 */
	_declare : function ( script, head ) {
		this._super._declare ( script, head );
		return this._declareinputs ( script, head );
	},

	/**
	 * Declare inputs.
	 * @param {String} script
	 * @returns {String}
	 */
	_declareinputs : function ( script, head ) {
		var defs = [];
		gui.Object.each ( this.inputs, function ( name, type ) {
			head.declarations [ name ] = true;
			defs.push ( name + " = get ( " + type + " );\n" );
		}, this );
		if ( defs [ 0 ]) {
			head.functiondefs.push ( 
				"( function inputs ( get ) {\n" +
				defs.join ( "" ) +
				"})( this.script.inputs );" 
			);
		}
		return script;
	}

});


/**
 * Compile function as tag. Tags are functions with boilerplate code.
 * @extends {edb.FunctionCompiler}
 */
edb.TagCompiler = edb.FunctionCompiler.extend ({

	/**
	 * We added the "tag" directive ourselves.
	 * @overrides {edb.FunctionCompiler._direct}
	 * @param  {String} script
	 * @returns {String}
	 */
	_direct : function ( script ) {
		if ( this.directives.tag ) {
			var content = edb.TagCompiler._CONTENT;
			this._params.push ( "content" );
			this._params.push ( "attribs" );
			this._params.push ( "COMPILED_AS_TAG" );
			script = "att = new Att ( attribs );\n" + script;
			script = script.replace ( content, "content ( out );" );

		}
		return this._super._direct ( script );
	}


}, {}, { // Static .................................................

	/**
	 * Match <content/> tag in whatever awkward form.
	 * @type {RegExp}
	 */
	_CONTENT : /<content(.*)>(.*)<\/content>|<content(.*)(\/?)>/

});


/**
 * The function loader will fetch a function string from an external 
 * document or scan the local document for functions in SCRIPT tags.
 * @extends {gui.FileLoader}
 */
edb.Loader = gui.FileLoader.extend ({

	/**
	 * Mapping script element attributes to be used as compiler directives. 
	 * @type {Map<String,object>}
	 */
	directives : null,

	/**
	 * Load script source as text/plain.
	 * @overwrites {gui.FileLoader#load}
	 * @param {String} src
	 * @param {function} callback
	 * @param @optional {object} thisp
	 */
	load : function ( src, callback, thisp ) {
		var url = new gui.URL ( this._document, src );
		if ( this._cache.has ( url.location )) {
			this._cached ( url, callback, thisp );
		} else if ( url.external ) {				
			this._request ( url, callback, thisp );
		} else if ( url.hash ) {
			this._lookup ( url, callback, thisp );
		} else {
			console.error ( "Now what?" );
		}
	},

	/**
	 * Handle loaded script source. Externally loaded file may contain multiple scripts.
	 * @overwrites {gui.FileLoader#onload}
	 * @param {String} text
	 * @param {gui.URL} url
	 * @param {function} callback
	 * @param @optional {object} thisp
	 */
	onload : function ( text, url, callback, thisp ) {
		if ( url.external ) {
			text = this._extract ( text, url );
		}
		callback.call ( thisp, text, this.directives, url );
		this.directives = null;
	},
	

	// PRIVATES ........................................................................
	
	/**
	 * Lookup script in document DOM (as opposed to HTTP request).
	 * @param {gui.URL} url
	 * @param {Map<String,String>} cache
	 * @param {function} callback
	 * @param @optional {object} thisp
	 */
	_lookup : function ( url, callback, thisp ) {
		var script = this._document.querySelector ( url.hash );
		if ( script ) {
			this.directives = gui.AttPlugin.getmap ( script );
			this.onload ( script.textContent, url, callback, thisp );
		} else {
			console.error ( "No such script: " + url );
		}
	},

	/**
	 * Templates are loaded as HTML documents with one or more script tags. 
	 * The requested script should have an @id to match the URL #hash.  
	 * If no hash was given, we return the source code of first script found.
	 * @param {String} text HTML with one or more script tags
	 * TODO: cache this stuff for repeated lookups!
	 * @param {gui.URL} url
	 * @returns {String} Template source code
	 */
	_extract : function ( text, url ) {
		var doc = gui.HTMLParser.parseToDocument ( text ); // @TODO: cache this
		var script = doc.querySelector ( url.hash || "script" );
		if ( script ) {	
			this.directives = gui.AttPlugin.getmap ( script );
			return script.textContent;
		} else {
			console.error ( "No such script: " + url.location + url.hash || "" );
		}
	}


});


/**
 * This fellow compiles an EDBML source string into an executable 
 * JS function. The onreadystatechange method fires when ready. 
 * The method "execute" may by then invoke the compiled function.
 */
edb.Function = gui.Class.create ( Object.prototype, {
	
	/**
	 * EDBML source compiled to executable JS function.
	 * @type {function}
	 */
	executable : null,

	/**
	 * Executable JS function compiled into this context.
	 * @type {Window|WorkerGlobalScope}
	 */
	context : null,

	/**
	 * Origin of the EDBML template (specifically in 'url.href')
	 * @type {gui.URL}
	 */
	url : null,

	/**
	 * Function may be executed when this switches to 'ready'. 
	 * You can overwrite the onreadystatechange method below.
	 * @type {String}
	 */
	readyState : null,
	
	/**
	 * Overwrite this to get notified on readyState changes. 
	 * The method recieves the {edb.Function} as an argument.
	 * @type {function}
	 */
	onreadystatechange : null,
	
	/**
	 * Construct.
	 * @param {Document} basedoc
	 * @param {Global} context
	 * @param {function} handler
	 */
	onconstruct : function ( context, url, handler ) {
		this.context = context || null;
		this.url = url || null;
		this.onreadystatechange = handler || null;
		this._imports = Object.create ( null );
	},
	
	/**
	 * Compile source to function.
	 *
	 * 1. Create the compiler (signed for sandbox usage)
	 * 2. Compile source to invokable function 
	 * 3. Preserve source for debugging
	 * 4. Copy expected params
	 * 5. Load required functions.
	 * 6. Report done whan all is loaded.
	 * @overwrites {edb.Template#compile}
	 * @param {String} source
	 * @param {HashMap<String,String>} directives
	 * @returns {edb.Function}
	 */
	compile : function ( source, directives ) { // @TODO gui.Combo.chained
		if ( this.executable === null ) {
			var Compiler = this._compiler ();
			var compiler = new Compiler ( source, directives );
			if ( this._$contextid ) {
				compiler.sign ( this._$contextid );
			}
			this.executable = compiler.compile ( this.context, this.url );
			this._source = compiler.source;
			this._dependencies ( compiler );
			this._oncompiled ( compiler, directives );
			return this;
		} else {
			throw new Error ( "TODO: recompile the script :)" );
		}
	},

	/**
	 * Log function source to console.
	 */
	debug : function () {
		console.debug ( this._source );
	},

	/**
	 * Resolve dependencies.
	 * @param {edb.Compiler} compiler
	 */
	_dependencies : function ( compiler ) {
		compiler.dependencies.map ( function ( dep ) {
			this._imports [ dep.name ] = null; // null all first
			return dep;
		}, this ).forEach ( function ( dep ) {
			dep.resolve ().then ( function ( resolved ) {
				this._imports [ dep.name ] = resolved;
				this._maybeready ();
			}, this );
		}, this );
	},

	/**
	 * Sign generated methods for sandbox scenario.
	 * @param {String} $contextid
	 * @returns {edb.Function}
	 */
	sign : function ( $contextid ) {
		this._$contextid = $contextid;
		return this;
	},
	
	/**
	 * Execute compiled function, most likely returning a HTML string.
	 * @returns {String} 
	 */
	execute : function ( /* arguments */ ) {
		var result = null;
		if ( this.executable ) {
			try {
				this._subscribe ( true );
				result = this.executable.apply ( this.pointer, arguments );
				this._subscribe ( false );
			} catch ( exception ) {
				console.error ( exception.message + ":\n\n" + this._source );
			}
		} else {
			throw new Error ( this + " not compiled" );
		}
		return result;
	},
	

	// PRIVATES ..........................................................................................
	
	/**
	 * Optionally stamp a $contextid into generated edb.Script.invoke() callbacks.
	 * @type {String} 
	 */
	_$contextid : null,

	/**
	 * Tracking imported functions.
	 * 
	 * 1. Mapping {edb.Import} instances while booting
	 * 2. Mapping {edb.Function} instances once resolved.
	 * @type {Map<String,edb.Import|function>}
	 */
	_imports : null,

	/**
	 * Get compiler implementation (subclass may overwrite this method).
	 * @returns {function}
	 */
	_compiler : function () {
		return edb.FunctionCompiler;
	},

	/**
	 * If supported, load invokable function 
	 * as blob file. Otherwise skip to init.
	 * @param {edb.FunctionCompiler} compiler
	 * @param {Map<String,String|number|boolean>} directives
	 */
	_oncompiled : function ( compiler, directives ) {
		if ( directives.debug ) {
			this.debug ();
		}
		try {
			if ( this._useblob ()) {
				this._loadblob ( compiler );
			} else {
				this._maybeready ();
			}
		} catch ( workerexception ) { // TODO: sandbox scenario
			this._maybeready ();
		}
	},

	/**
	 * Use blob files?
	 * @TODO: Investigate potential overheads and asyncness
	 */
	_useblob : function () {
		return this.context.edb.useblobs && 
			gui.Client.hasBlob && 
			!gui.Client.isExplorer && 
			!gui.Client.isOpera;
	},
	
	/**
	 * Mount compiled function as file. 
	 * @param {edb.Compiler} compiler
	 */
	_loadblob : function ( compiler ) {
		var win = this.context;
		var doc = win.document;
		var key = gui.KeyMaster.generateKey ();
		var src = compiler.source.replace ( "function", "function " + key );
		this._gostate ( edb.Function.LOADING );
		gui.BlobLoader.loadScript ( doc, src, function onload () {
			this._gostate ( edb.Function.WORKING );
			this.executable = win [ key ];
			this._maybeready ();
		}, this );
	},

	/**
	 * Update readystate and poke the statechange handler.
	 * @param {String} state
	 */
	_gostate : function ( state ) {
		if ( state !== this.readyState ) {
			this.readyState = state;
			if ( gui.Type.isFunction ( this.onreadystatechange )) {
				this.onreadystatechange ();
			}
		}
	},

	/**
	 * Report ready? Otherwise waiting 
	 * for data types to initialize...
	 */
	_maybeready : function () {
		if ( this.readyState !== edb.Function.LOADING ) {
			this._gostate ( edb.Function.WORKING );
			if ( this._done ()) {
				this._gostate ( edb.Function.READY );
			} else {
				this._gostate ( edb.Function.WAITING );
			}
		}
	},

	/**
	 * Ready to run?
	 * @returns {boolean}
	 */
	_done : function () {
		return Object.keys ( this._imports ).every ( function ( name ) {
			return this._imports [ name ] !== null;
		}, this );
	}


}, { // Recurring static ................................................

	/**
	 * Get function loaded from given SRC and compiled into given context.
	 * @param {Window} context
	 * @param {String} src
	 * @returns {function}
	 */
	get : function ( context, src ) {
		var ex = this._executables;
		var id = context.gui.$contextid;
		if ( gui.URL.absolute ( src )) {
			return ex [ id ] ? ex [ id ][ src ] || null : null;
		} else {
			throw new Error ( "Absolute URL expected" );
		}
	},

	/**
	 * Loaded and compile function for SRC. When compiled, you can 
	 * get the invokable function using 'edb.Function.get()' method. 
	 * @param {Window} context Compiler target context
	 * @param {Document} basedoc Used to resolve relative URLs
	 * @param {String} src Document URL to load and parse (use #hash to target a SCRIPT id)
	 * @param {function} callback
	 * @param {object} thisp
	 */
	load : function ( context, basedoc, src, callback, thisp ) {
		var exe = this._executablecontext ( context );
		new edb.Loader ( basedoc ).load ( src, function onload ( source, directives, url ) {
			this.compile ( context, url, source, directives, function onreadystatechange ( fun ) {
				if ( !exe [ url.href ] && fun.readyState === edb.Function.READY ) {
					exe [ url.href ] = fun.executable; // now avilable using edb.Function.get()
				}
				callback.call ( thisp, fun );
			});
		}, this );
	},

	/**
	 * Compile EDBML source to {edb.Function} instance in given context.
	 * @TODO: If <SCRIPT> has an id, we can store this in _executables...
	 * @param {Window} context
	 * @param {gui.URL} url
	 * @param {String} src
	 * @param {Map<String,String|number|boolean>} directives
	 * @param {function} callback
	 * @param {object} thisp
	 */
	compile : function ( context, url, source, directives, callback, thisp ) {
		var Fun = this;
		new Fun ( context, url, function onreadystatechange () {
			callback.call ( thisp, this );
		}).compile ( source, directives );
	},


	// Private recurring static ..............................................................

	/**
	 * Mapping contextid to map that maps URIs to functions.
	 * @type {Map<String,Map<String,function>>}
	 */
	_executables : Object.create ( null ),

	/**
	 * Get (and possibly create) map for context.
	 * @param {Window} context
	 * @returns {Map<String,function>}
	 */
	_executablecontext : function ( context ) {
		var exe = this._executables, id = context.gui.$contextid;
		return exe [ id ] || ( exe [ id ] = Object.create ( null ));
	}


}, { // Static .............................................................................

	/**
	 * Function is loading.
	 * @type {String}
	 */
	LOADING : "loading",

	/**
	 * Function is waiting for something.
	 * @type {String}
	 */
	WAITING : "waiting",

	/**
	 * Function is processing something.
	 * @type {String}
	 */
	WORKING : "working",

	/**
	 * Function is ready to run.
	 * @type {String}
	 */
	READY : "ready"

});

/**
 * Allow function get to be thrown around. 
 * Might benefit some template readability.
 */
( function bind () {
	edb.Function.get = edb.Function.get.bind ( edb.Function );
}());


/**
 * EDB script.
 * @extends {edb.Function}
 */
edb.Script = edb.Function.extend ({

	/**
	 * Hijacking the {edb.InputPlugin} which has been 
	 * designed to work without an associated spirit.
	 * @type {edb.InputPlugin}
	 */
	input : null,

	/**
	 * Target for the "this" keyword in compiled script.
	 * @type {object}
	 */
	pointer : null,

	/**
	 * Construct.
	 * @poverloads {edb.Function#onconstruct}
	 * @param {Global} context
	 * @param {function} handler
	 */
	onconstruct : function ( context, url, handler ) {
		this._super.onconstruct ( context, url, handler );
		this.input = new edb.InputPlugin ();
		this.input.context = this.context; // as constructor arg?
		this.input.onconstruct (); // huh?

		// @TODO this!
		// console.warn ( "Bad: onconstruct should autoinvoke" );

		this._keys = new Set (); // tracking data changes

		// @TODO this *must* be added before it can be removed ?
		gui.Broadcast.addGlobal ( edb.BROADCAST_CHANGE, this );
	},

	/**
	 * Handle broadcast.
	 * @param {gui.Broadcast} broadcast
	 */
	onbroadcast : function ( b ) {
		switch ( b.type ) {
			case edb.BROADCAST_ACCESS :
				this._keys.add ( b.data );
				break;
			case edb.BROADCAST_CHANGE :
				if ( this._keys.has ( b.data )) {
					if ( this.readyState !== edb.Function.WAITING ) {
						var tick = edb.TICK_SCRIPT_UPDATE;
						var sig = this.context.gui.$contextid;
						gui.Tick.one ( tick, this, sig ).dispatch ( tick, 0, sig );	
						this._gostate ( edb.Function.WAITING );
					}
				}
				break;
		}
	},

	/**
	 * Handle tick.
	 * @param {gui.Tick} tick
	 */
	ontick : function ( tick ) {
		switch ( tick.type ) {
			case edb.TICK_SCRIPT_UPDATE :
				this._gostate ( edb.Function.READY );
				break;
		}
	},

	/**
	 * Handle input.
	 * @param {edb.Input} input
	 */
	oninput : function ( input ) {
		this._maybeready (); // see {edb.Function} superclass
	},

	/**
	 * Execute the script, most likely returning a HTML string.
	 * @overrides {edb.Function#execute}
	 * @returns {String}
	 */
	execute : function () {
		this._keys = new Set ();
		var result = null;
		if ( this.input.done ) {
			this._subscribe ( true );
			result = this._super.execute.apply ( this, arguments );
			this._subscribe ( false );
		} else {
			 throw new Error ( "Script awaits input" );
		}
		return result;
	},

	/**
	 * Experimental...
	 */
	dispose : function () {
		this.onreadystatechange = null;
		this.input.ondestruct ();
	},


	// Private ............................................................

	/**
	 * Compiler implementation.
	 * @overwrites {edb.Function#_Compiler}
	 * @type {function}
	 */
	_Compiler : edb.ScriptCompiler,

	/**
	 * Tracking keys in edb.Type and edb.Array
	 * @type {Set<String>}
	 */
	_keys : null,

	/**
	 * Flipped when expected inputs have been determined.
	 * @type {boolean}
	 */
	_inputresolved : false,

	/**
	 * Get compiler implementation.
	 * @returns {function}
	 */
	_compiler : function () {
		return edb.ScriptCompiler;
	},

	/**
	 * Setup input listeners when compiled.
	 * @param {edb.ScriptCompiler} compiler
	 * @param {Map<String,String|number|boolean>} directives
	 * @overrides {edb.Function#_oncompiled}
	 */
	_oncompiled : function ( compiler, directives ) {
		gui.Object.each ( compiler.inputs, function ( name, type ) {
			this.input.add ( type, this );
		}, this );
		this._inputresolved = true;
		this._super._oncompiled ( compiler, directives );
	},

	/**
	 * Ready to run?
	 * @overrides {edb.Function#_done}
	 * @returns {boolean}
	 */
	_done : function () {
		return this._inputresolved && this.input.done && this._super._done ();
	},

	/**
	 * Add-remove broadcast handlers.
	 * @param {boolean} isBuilding
	 */
	_subscribe : function ( isBuilding ) {
		gui.Broadcast [ isBuilding ? "addGlobal" : "removeGlobal" ] ( edb.BROADCAST_ACCESS, this );
		gui.Broadcast [ isBuilding ? "removeGlobal" : "addGlobal" ] ( edb.BROADCAST_CHANGE, this );
	}


}, { // Recurring static .......................................................................
	
	/**
	 * @static
	 * Mapping compiled functions to keys.
	 * @type {Map<String,function>}
	 */
	_invokables : Object.create ( null ),

	/**
	 * Loggin event details.
	 * @type {Map<String,object>}
	 */
	_log : null,
	
	/**
	 * @static
	 * Map function to generated key and return the key.
	 * @param {function} func
	 * @param {object} thisp
	 * @returns {String}
	 */
	$assign : function ( func, thisp ) {
		var key = gui.KeyMaster.generateKey ();
		edb.Script._invokables [ key ] = function ( value, checked ) {
			return func.apply ( thisp, [ gui.Type.cast ( value ), checked ]);
		};
		return key;
	},

	/**
	 * Garbage collect function that isn't called by the 
	 * GUI using whatever strategy they prefer nowadays.
	 */
	$revoke : function ( key ) {
		edb.Script._invokables [ key ] = null; // garbage one
		delete edb.Script._invokables [ key ]; // garbage two
	},

	/**
	 * @static
	 * TODO: Revoke invokable on spirit destruct (release memory)
	 * @param {string} key
	 * @param @optional {String} sig
	 * @param @optional {Map<String,object>} log
	 */
	$invoke : function ( key, sig, log ) {
		var func = null;
		log = log || this._log;
		/*
		  * Relay invokation to edb.Script in sandboxed context?
		 */
		if ( sig ) {
			gui.Broadcast.dispatchGlobal ( this, edb.BROADCAST_SCRIPT_INVOKE, {
				key : key,
				sig : sig,
				log : log
			});
		} else {
			/*
			 * Timeout is a cosmetic stunt to unfreeze a pressed 
			 * button in case the function takes a while to complete. 
			 */
			if (( func = this._invokables [ key ])) {
				if ( log.type === "click" ) {
					gui.Tick.next ( function () {
						func ( log.value, log.checked );
					});
				} else {
					func ( log.value, log.checked );
				}
			} else {
				throw new Error ( "Invokable does not exist: " + key );
			}
		}
	},

	/**
	 * Keep a log on the latest DOM event.
	 * @param {Event} e
	 */
	$register : function ( e ) {
		this._log = {
			type : e.type,
			value : e.target.value,
			checked : e.target.checked
		};
		return this;
	},

	/**
	 * Yerh.
	 */
	$tempname : function ( key, sig ) {
		var func;
		if ( sig ) {
			console.error ( "TODO" );
		} else {
			if (( func = this._invokables [ key ])) {
				return func ();
			} else {
				throw new Error ( "out of synch" );
			}
		}
	}
	
});


/**
 * Here it is.
 * @extends {edb.Function}
 */
edb.Tag = edb.Function.extend ({

	/**
	 * Get compiler implementation.
	 * @returns {function}
	 */
	_compiler : function () {
		return edb.TagCompiler;
	},

	/**
	 * Adding the "tag" directive.
	 * @overrides {edb.Template#compile}
	 * @param {String} source
	 * @param {HashMap<String,String>} directives
	 * @returns {edb.Function}
	 */
	compile : function ( source, directives ) {
		directives.tag = true;
		return this._super.compile ( source, directives );
	}

});


/**
 * Tracking a single import (function dependency).
 * @param {Window} context Compiler target context
 * @param {Document} basedoc Resolving relative URLs
 * @param {String} type
 * @param {String} href
 * @param {String} name
 */
edb.Import = function ( context, basedoc, type, href, name ) {
	this._context = context;
	this._document = basedoc;
	this.type = type;
	this.name = name;
	this.href = href;
};

edb.Import.prototype = {

	/**
	 * Matches function|tag
	 * @type {String}
	 */
	type : null,

	/**
	 * Runtime name (variable name).
	 * @type {String}
	 */
	name : null,

	/**
	 * Dependency address.
	 * @type {String}
	 */
	href : null,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object edb.Import]";
	},

	/**
	 * Resolve dependency.
	 */
	resolve : function () {
		var pool = this._functionpool ();
		var func = pool.get ( this._context, this.tempname ());
		var then = new gui.Then ();
		if ( func ) {
			then.now ( func );
		} else {
			pool.load ( this._context, this._document, this.href, function onreadystatechange ( func ) {
				if ( func.readyState === edb.Function.READY ) {
					then.now ( func );
				}
			});
		}
		return then;
	},

	/**
	 * Hm.
	 * @returns {String}
	 */
	tempname : function () {
		return new gui.URL ( this._document, this.href ).href;
	},

	/**
	 * Where to lookup functions that may already be compiled?
	 * @returns {function}
	 */
	_functionpool : function () {
		switch ( this.type ) {
			case edb.Import.TYPE_FUNCTION :
				return edb.Function;
			case edb.Import.TYPE_TAG :
				return edb.Tag;
		}
	},


	// Private .......................................

	/**
	 * Context to compile into.
	 * @type {Window|WorkerGlobalScope}
	 */
	_context : null

};

/**
 * Function dependency.
 * @type {String}
 */
edb.Import.TYPE_FUNCTION = "function";

/**
 * Tag dependency.
 * @type {String}
 */
edb.Import.TYPE_TAG = "tag";


/**
 * Converts JS props to HTML attributes during EDBML rendering phase. 
 * Any methods added to this prototype will become available in EDBML 
 * scripts as: att.mymethod() TODO: How can Att instances be passed?
 * @param @optional Map<String,object> atts Default properties
 */
edb.Att = function Att ( atts ) {
	if ( atts ) {
		gui.Object.extend ( this, atts );
	}
};

edb.Att.prototype = gui.Object.create ( null, {

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object edb.Att]";
	},

	/**
	 * Resolve key-value to HTML attribute declaration.
	 * @TODO Rename "_html"
	 * @param {String} att
	 * @returns {String} 
	 */
	_out : function ( att ) {
		var val = this [ att ], html = "";
		switch ( gui.Type.of ( val )) {
			case "null" :
			case "undefined" :
				break;
			default :
				val = edb.Att.encode ( this [ att ]);
				html += att + "=\"" + val + "\" ";
				break;
		}
		return html;
	},

	/**
	 * Resolve key-value, then delete it to prevent reuse.
	 * @param {String} att
	 */
	_pop : function ( att ) {
		var html = this._out ( att );
		delete this [ att ];
		return html;
	},

	/**
	 * Resolve all key-values to HTML attribute declarations.
	 * @returns {String} 
	 */
	_all : function () {
		var html = "";
		gui.Object.nonmethods ( this ).forEach ( function ( att ) {
			html += this._out ( att );
		}, this );
		return html;
	}

});

/**
 * @static
 * Stringify stuff to be used as HTML attribute values.
 * @param {object} data
 * @returns {String}
 */
edb.Att.encode = function ( data ) {
	var type = gui.Type.of ( data );
	switch ( type ) {
		case "string" :
			break;
		case "number" :
		case "boolean" :
			data = String ( data );
			break;
		case "object" :
		case "array" :
			try {
				data = encodeURIComponent ( JSON.stringify ( data ));
			} catch ( jsonex ) {
				throw new Error ( "Could not create HTML attribute: " + jsonex );
			}
			break;
		case "date" :
			throw new Error ( "TODO: edb.Att.encode standard date format?" );
		default :
			throw new Error ( "Could not create HTML attribute for " + type );
	}
	return data;
};


/**
 * Collects HTML output during EDBML rendering phase.
 * Any methods added to this prototype will become 
 * available in EDBML scripts as: out.mymethod()
 */
edb.Out = function Out () {};

edb.Out.prototype = {

	/**
	 * HTML string (not well-formed while parsing).
	 * @type {String}
	 */
	html : "",

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object edb.Out]";
	},

	/**
	 * Get HTML result (output override scenario).
	 * @returns {String}
	 */
	write : function () {
		return this.html;
	}
};


/**
 * Utilities for the {edb.UpdateManager}.
 */
edb.UpdateAssistant = {

	/**
	 * @static
	 * Get ID for element.
	 * @param {Element} element
	 * @returns {String}
	 */
	id : function ( element ) {
		return gui.Type.isDefined ( element.id ) ? 
			element.id || null : 
			element.getAttribute ( "id" ) || null;
	},

	/**
	 * @static
	 * Parse markup to element.
	 * TODO: Use DOMParser versus "text/html" for browsers that support it?
	 * TODO: All sorts of edge cases for IE6 compatibility. Hooray for HTML5.
	 * TODO: Evaluate well-formedness in debug mode for XHTML documents.
	 * @param {Document} doc
	 * @param {String} markup
	 * @param {String} id
	 * @param {Element} element
	 * @returns {Element}
	 */
	parse : function ( doc, markup, id, element ) { // gonna need to know the parent element type here...
		element = doc.createElement ( element.localName );
		element.innerHTML = markup;
		element.id = id;
		// TODO: Plugin this!
		Array.forEach ( element.querySelectorAll ( "option" ), function ( option ) {
			switch ( option.getAttribute ( "selected" )) {
				case "true" :
					option.setAttribute ( "selected", "selected" );
					break;
				case "false" :
					option.removeAttribute ( "selected" );
					break;
			}
		});
		// TODO: Plugin this!
		Array.forEach ( element.querySelectorAll ( "input[type=checkbox],input[type=radio]" ), function ( option ) {
			switch ( option.getAttribute ( "checked" )) {
				case "true" :
					option.setAttribute ( "checked", "checked" );
					break;
				case "false" :
					option.removeAttribute ( "checked" );
					break;
			}
		});
		return element;
	},

	/**
	 * @static
	 * Mapping element id to it's ordinal position.
	 * @returns {Map<String,number>}
	 */
	order : function ( nodes ) {
		var order = new Map ();
		Array.forEach ( nodes, function ( node, index ) {
			if ( node.nodeType === Node.ELEMENT_NODE ) {
				order.set ( this.id ( node ), index );
			}
		}, this );
		return order;
	},
	
	/**
	 * @static
	 * Convert an NodeList into an ID-to-element map.
	 * @param {NodeList} nodes
	 * @return {Map<String,Element>}
	 */
	index : function ( nodes ) {
		var result = Object.create ( null );
		Array.forEach ( nodes, function ( node, index ) {
			if ( node.nodeType === Node.ELEMENT_NODE ) {
				result [ this.id ( node )] = node;
			}
		}, this );
		return result;
	}	
};


/**
 * It's the update manager.
 * @param {gui.Spirit} spirit
 */
edb.UpdateManager = function UpdateManager ( spirit ) {
	this._keyid = spirit.dom.id () || spirit.$instanceid;
	this._spirit = spirit;
	this._doc = spirit.document;
};

edb.UpdateManager.prototype = {
	
	/**
	 * Update.
	 * @param {String} html
	 */
	update : function ( html ) {
		this._updates = new edb.UpdateCollector ();
		this._functions = {};
		if ( !this._olddom ) {
			this._first ( html );
		} else {
			this._next ( html );
			this._updates.collect ( 
				new edb.FunctionUpdate ( this._doc ).setup ( 
					this._keyid, 
					this._functions 
				)
			);
		}
		this._updates.eachRelevant ( function ( update ) {
			update.update ();
			update.dispose ();
		});
		//this._fisse ( this._functions );
		//edb.FunctionUpdate.remap ( this._spirit, this._functions );
		if ( this._updates ) { // huh? how can it be null?
			this._updates.dispose ();
		}
		delete this._updates;
	},
	
	
	// PRIVATE ..............................................................

	/**
	 * This can be one of two:
	 * 1) Spirit element ID (if element has ID).
	 * 2) Spirits $instanceid (if no element ID).
	 * @type {String}
	 */
	_keyid : null,

	/**
	 * Spirit document.
	 * @type {Document}
	 */
	_doc : null,

	/**
	 * Associated spirit.
	 * @type {gui.Spirit}
	 */
	_spirit : null,
		
	/**
	 * Current DOM subtree.
	 * @type {Document}
	 */
	_olddom : null,
	
	/**
	 * Incoming DOM subtree.
	 * @type {Document}
	 */
	_nedwdom : null,
	
	/**
	 * List of updates to apply.
	 * @type {[type]}
	 */
	_updates : null,

	/**
	 * Assistant utilities.
	 * @type {edb.UpdateAssistant}
	 */
	_assistant : edb.UpdateAssistant,

	/*
	_fisse : function ( remappings ) {
		var count = 0;
		if ( Object.keys ( remappings ).length ) {
			new gui.Crawler ( "John" ).descend ( this._spirit, {
				handleElement : function ( elm ) {
					Array.forEach ( elm.attributes, function ( att ) {
						var oldkeys = gui.KeyMaster.extractKey ( att.value );
						if ( oldkeys ) {
							var newkey;
							oldkeys.forEach ( function ( oldkey ) {
								if (( newkey = remappings [ oldkey ])) {
									att.value = att.value.replace ( oldkey, newkey );
									edb.Script.$revoke ( oldkey );
									count ++;
								}
							});
						}
					});
				}
			});
		}
		if ( count ) {
			console.debug ( "Updated " + count + " function keys." );
		}
	},
	*/

	/**
	 * First update (always a hard update).
	 * @param {String} html
	 */
	_first : function ( html ) {
		this._olddom = this._parse ( html );
		this._updates.collect ( 
			new edb.HardUpdate ( this._doc ).setup ( this._keyid, this._olddom )
		);
	},

	/**
	 * Next update.
	 * @param {String} html
	 */
	_next : function ( html ) {
		this._newdom = this._parse ( html );
		this._crawl ( this._newdom, this._olddom, this._newdom, this._keyid, {});
		this._olddom = this._newdom;
	},

	/**
	 * Parse markup to element.
	 * @param {String} html
	 * @returns {Element}
	 */
	_parse : function ( html ) {
		return this._assistant.parse ( 
			this._doc, 
			html, 
			this._keyid, 
			this._spirit.element 
		);
	},
	
	/**
	 * Crawl.
	 * @param {Element} newnode
	 * @param {Element} oldnode
	 * @param {Element} lastnode
	 * @param {String} id
	 * @param {Map<String,boolean>} ids
	 * @returns {boolean}
	 */
	_crawl : function ( newchild, oldchild, lastnode, id, ids ) {
		var result = true;
		while ( newchild && oldchild && !this._updates.hardupdates ( id )) {
			switch ( newchild.nodeType ) {
				case Node.TEXT_NODE :
					result = this._check ( newchild, oldchild, lastnode, id, ids );
					break;
				case Node.ELEMENT_NODE :
					result = this._scan ( newchild, oldchild, lastnode, id, ids );
					break;
			}
			newchild = newchild.nextSibling;
			oldchild = oldchild.nextSibling;
		}
		return result;
	},

	/**
	 * Scan elements.
	 * @param {Element} newnode
	 * @param {Element} oldnode
	 * @param {Element} lastnode
	 * @param {String} id
	 * @param {Map<String,boolean>} ids
	 * @returns {boolean}
	 */
	_scan : function ( newnode, oldnode, lastnode, id, ids ) {
		var result = true, oldid = this._assistant.id ( oldnode );
		if (( result = this._check ( newnode, oldnode, lastnode, id, ids )))  {	
			if ( oldid ) {
				ids = gui.Object.copy ( ids );
				lastnode = newnode;
				ids [ oldid ] = true;
				id = oldid;
			}
			result = this._crawl ( newnode.firstChild, oldnode.firstChild, lastnode, id, ids );
		}
		return result;
	},
	
	/**
	 * Hello.
	 * @param {Element} newnode
	 * @param {Element} oldnode
	 * @param {Element} lastnode
	 * @param {String} id
	 * @param {Map<String,boolean>} ids
	 * @returns {boolean}
	 */
	_check : function ( newnode, oldnode, lastnode, id, ids ) {
		var result = true;
		var isSoftUpdate = false;
		var isPluginUpdate = false; // TODO: plugins...
		if (( newnode && !oldnode ) || ( !newnode && oldnode )) {  
			result = false;
		} else if (( result = newnode.nodeType === oldnode.nodeType )) {
			switch ( oldnode.nodeType ) {
				case Node.TEXT_NODE :
					if ( newnode.data !== oldnode.data ) {
						result = false;
					}
					break;
				case Node.ELEMENT_NODE :
					if (( result = this._familiar ( newnode, oldnode ))) {
						if (( result = this._checkatts ( newnode, oldnode, ids ))) {
							if ( this._maybesoft ( newnode, oldnode )) {
								if ( this._confirmsoft ( newnode, oldnode )) {
									this._updatesoft ( newnode, oldnode, ids );
									isSoftUpdate = true; // prevents the replace update
								}
								result = false; // crawling continued in _updatesoft
							} else {
								if ( oldnode.localName !== "textarea" ) { // TODO: better forms support!
									result = newnode.childNodes.length === oldnode.childNodes.length;
									if ( !result && oldnode.id ) {
										lastnode = newnode;
										id = oldnode.id;
									}
								}
							}
						}
					}
					break;
			}
		}
		if ( !result && !isSoftUpdate && !isPluginUpdate ) {
			this._updates.collect ( new edb.FunctionUpdate ( this._doc ).setup ( id ));
			this._updates.collect ( new edb.HardUpdate ( this._doc ).setup ( id, lastnode ));
		}
		return result;
	},

	/**
	 * Roughly estimate whether two elements could be identical.
	 * @param {Element} newnode
	 * @param {Element} oldnode
	 * @returns {boolean}
	 */
	_familiar : function ( newnode, oldnode ) {
		return [ "namespaceURI", "localName" ].every ( function ( prop ) {
			return newnode [ prop ] === oldnode [ prop ];
		});
	},
	
	/**
   * Same id trigges attribute synchronization;
	 * different id triggers hard update of ancestor.
	 * @param {Element} newnode
	 * @param {Element} oldnode
	 * @param {Map<String,boolean>} ids
	 * @returns {boolean} When false, replace "hard" and stop crawling.
	 */
	_checkatts : function ( newnode, oldnode, ids ) {
		var result = true;
		var update = null;
		if ( this._attschanged ( newnode.attributes, oldnode.attributes, ids )) {
			var newid = this._assistant.id ( newnode );
			var oldid = this._assistant.id ( oldnode );
			if ( newid && newid === oldid ) {
				update = new edb.AttsUpdate ( this._doc ).setup ( oldid, newnode, oldnode );
				this._updates.collect ( update, ids );
			} else {
				result = false;
			}
		}
		return result;
	},

	/**
	 * Attributes changed? When an attribute update is triggered by a EDB poke, we verify 
	 * that this was the *only* thing that changed and substitute the default update with 
	 * a edb.FunctionUpdate. This will bypass the need  for an ID attribute on the associated 
	 * element (without which a hardupdate would happen).
	 * @see {edb.FunctionUpdate}
	 * @param {NodeList} newatts
	 * @param {NodeList} oldatts
	 * @param {?} ids
	 * @returns {boolean}
	 */
	_attschanged : function ( newatts, oldatts, ids ) {
		var changed = newatts.length !== oldatts.length;
		if ( !changed ) {
			changed = !Array.every ( newatts, function ischanged ( newatt ) {
				var oldatt = oldatts.getNamedItem ( newatt.name );
				return oldatt && oldatt.value === newatt.value;
			});
			if ( changed ) {
				changed = !Array.every ( newatts, function isfunctionchanged ( newatt ) {
					var oldatt = oldatts.getNamedItem ( newatt.name );
					if ( this._functionchanged ( newatt.value, oldatt.value ) ) {
						return true;
					} else {
						return newatt.value === oldatt.value;
					}
				}, this );
			}
		}
		return changed;
	},

	_functionchanged : function ( newval, oldval ) {
		var newkeys = gui.KeyMaster.extractKey ( newval );
		var oldkeys = gui.KeyMaster.extractKey ( oldval );
		if ( newkeys && oldkeys ) {
			oldkeys.forEach ( function ( oldkey, i ) {
				this._functions [ oldkey ] = newkeys [ i ];
			}, this );
			return true;
		}
		return false;
	},
	
	/**
	 * Are element children candidates for "soft" sibling updates?
	 * 1) Both parents must have the same ID
	 * 2) All children must have a specified ID
	 * 3) All children must be elements or whitespace-only textnodes
	 * @param {Element} newnode
	 * @param {Element} oldnode
	 * @return {boolean}
	 */
	_maybesoft : function ( newnode, oldnode ) {
		if ( newnode && oldnode ) {
			return newnode.id && newnode.id === oldnode.id && 
				this._maybesoft ( newnode ) && 
				this._maybesoft ( oldnode );
		} else {	
			return Array.every ( newnode.childNodes, function ( node ) {
				var res = true;
				switch ( node.nodeType ) {
					case Node.TEXT_NODE :
						res = node.data.trim () === "";
						break;
					case Node.ELEMENT_NODE :
						res = this._assistant.id ( node ) !== null;
						break;
				}
				return res;
			}, this );
		}
	},

	/**
	 * "soft" siblings can only be inserted and removed. This method verifies that 
	 * elements retain their relative positioning before and after an update. Changing 
	 * the ordinal position of elements is not supported since this might destruct UI 
	 * state (moving eg. an iframe around using DOM methods would reload the iframe). 
	 * TODO: Default support ordering and make it opt-out instead?
	 * @param {Element} newnode
	 * @param {Element} oldnode
	 * @returns {boolean}
	 */
	_confirmsoft : function ( newnode, oldnode ) {
		var res = true, prev = null;
		var oldorder = this._assistant.order ( oldnode.childNodes );
		return Array.every ( newnode.childNodes, function ( node, index ) {
			if ( node.nodeType === Node.ELEMENT_NODE ) {
				var id = this._assistant.id ( node );
				if ( oldorder.has ( id ) && oldorder.has ( prev )) {
					res = oldorder.get ( id ) > oldorder.get ( prev );
				}
				prev = id;
			}
			return res;
		}, this );
	},
	
	/**
	 * Update "soft" siblings.
	 * @param {Element} newnode
	 * @param {Element} oldnode
	 * @param {Map<String,boolean>} ids
	 * @return {boolean}
	 */
	_updatesoft : function ( newnode, oldnode, ids ) {
		var updates = [];
		var news = this._assistant.index ( newnode.childNodes );
		var olds = this._assistant.index ( oldnode.childNodes );
		/*
		 * Add elements?
		 */
		var child = newnode.lastElementChild,
			topid = this._assistant.id ( oldnode ),
			oldid = null,
			newid = null;
		while ( child ) {
			newid = this._assistant.id ( child );
			if ( !olds [ newid ]) {
				if ( oldid ) {
					updates.push (
						new edb.InsertUpdate ( this._doc ).setup ( oldid, child ) 
					);
				} else {
					updates.push (
						new edb.AppendUpdate ( this._doc ).setup ( topid, child ) 
					);
				}
			} else {
				oldid = newid;
			}
			child = child.previousElementSibling;
		}
		
		/*
		 * Remove elements?
		 */
		Object.keys ( olds ).forEach ( function ( id ) {
			if ( !news [ id ]) {
				updates.push (
					new edb.RemoveUpdate ( this._doc ).setup ( id ) 
				);
				updates.push (
					new edb.FunctionUpdate ( this._doc ).setup ( id ) 
				);
			} else { // note that crawling continues here...
				var n1 = news [ id ];
				var n2 = olds [ id ];
				this._scan ( n1, n2, n1, id, ids );
			}
		}, this );
		
		/*
		 * Register updates
		 */
		updates.reverse ().forEach ( function ( update ) {
			this._updates.collect ( update, ids );
		}, this );
	}
};


/**
 * We collect updates over-aggresively in an attempt to traverse 
 * the DOM tree in one direction only. The fellow will helps us 
 * reduce the collected updates to the minimum required subset.
 */
edb.UpdateCollector = function UpdateCollector () {
	this._updates = []; 
	this._hardupdates = new Set ();
};

edb.UpdateCollector.prototype = {
	
	/**
	 * Collecting updates.
	 * @type {Array<edb.Update>}
	 */
	_updates : null,

	/**
	 * Tracking hard-updated element IDs.
	 * @type {Set<String>}
	 */
	_hardupdates : null,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object edb.UpdateCollector]";
	},

	/**
	 * Collect update candidate. All updates may not be evaluated, see below.
	 * @param {edb.Update} update
	 * @param {Map<String,boolean>} ids Indexing ID of ancestor elements
	 * @returns {edb.UpdateCollector}
	 */
	collect : function ( update, ids ) {
		this._updates.push ( update );
		if ( update.type === edb.Update.TYPE_HARD ) {
			this._hardupdates.add ( update.id );
		} else {
			update.ids = ids || {};
		}
		return this;
	},

	/**
	 * Will this element be hardupdated?
	 * @param {String} id Element ID
	 * @returns {boolean}
	 */
	hardupdates : function ( id ) {
		return this._hardupdates.has ( id );
	},

	/**
	 * Apply action to all relevant updates. For example: 
	 * An attribute update is not considered relevant if 
	 * the parent is scheduled to perform a full replace 
	 * of it's children.
	 * @param {function} action
	 */
	eachRelevant : function ( action ) {
		this._updates.filter ( function ( update ) {
			return ( 
				update.type === edb.Update.TYPE_HARD || 
				Object.keys ( update.ids ).every ( function ( id ) {
					return !this.hardupdates ( id );
				}, this )
			);
		}, this ).forEach ( function ( update ) {
			action ( update );
		});
	},

	/**
	 * TODO: At some point, figure out what exactly to do here.
	 */
	dispose : function () {
		delete this._hardupdates;
		delete this._updates;
	}
};


/**
 * Year!
 */
edb.Update = gui.Class.create ( Object.prototype, {
		
	/**
	 * Matches hard|atts|insert|append|remove|function
	 * @type {String}
	 */
	type : null,
	
	/**
	 * Identifies associated element in one of two ways:
	 *
	 * 1) It's the id of an element in this.window. Or if no id:
	 * 2) It's the $instanceid of a {gui.Spirít} in this.window
	 * @see  {edb.Update#element}
	 * @type {String}
	 */
	id : null,

	/**
	 * Tracking ancestor element IDs. We use this to regulate whether an 
	 * update should be discarded because a hard replace has obsoleted it.
	 * @type {Map<String,boolean>}
	 */
	ids : null,
	
	/**
	 * Update context window.
	 * @type {Window}
	 */
	window : null,
	
	/**
	 * Update context document.
	 * @type {Document}
	 */
	document : null,
	
	/**
	 * Invoked when update is newed up.
	 * @param {Document} doc
	 */
	onconstruct : function ( doc ) {
		this.window = doc.defaultView;
		this.document = doc;
	},
	
	/**
	 * Hello.
	 * @returns {edb.Update}
	 */
	setup : function () {
		return this;
	},
	
	/**
	 * The update method performs the actual update. Expect methods  
	 * _beforeUpdate and _afterUpdate to be invoked at this point.
	 */
	update : function () {},
	
	/**
	 * Get element associated to this.id. Depending on update type, 
	 * this element will be removed or added or updated and so on.
	 * The root element (the one whose spirit is assigned the script) 
	 * may be indexed by "$instanceid" if no ID attribute is specified.
	 * @returns {Element}
	 */
	element : function () {
		var spirit, element = null;
		if ( gui.KeyMaster.isKey ( this.id )) {
			if (( spirit = this.window.gui.get ( this.id ))) {
				element = spirit.element;
			}
		}
		element = element || this.document.getElementById ( this.id );
		if ( !element ) {
			console.error ( "No element to match @id: " + this.id );
		}
		return element;
	},

	/**
	 * Clean stuff up for what it's worth.
	 */
	dispose: function () {
		this.window = null;
		this.document = null;
	},
	
	
	// Private ...................................................................
	
	/**
	 * When something changed, dispatch pre-update event. 
	 * @param {Element} element
	 * @return {boolean}
	 */
	_beforeUpdate : function ( element ) {
		var event = "x-beforeupdate-" + this.type;
		return this._dispatch ( element, event );
	},
	
	/**
	 * When something changed, dispatch post-update event.
	 * @param {Element} element
	 * @return {boolean}
	 */
	_afterUpdate : function ( element ) {
		var event = "x-afterupdate-" + this.type;
		return this._dispatch ( element, event );
	},
	
	/**
	 * Dispatch bubbling DOM event for potential handlers to intercept the update.
	 * @param {Element} element
	 * @param {String} name
	 * @return {boolean} False if event was canceled
	 */
	_dispatch : function ( element, name ) {
		var event = this.document.createEvent ( "UIEvents" );
		event.initEvent ( name, true, true );
		return element.dispatchEvent ( event );
	},
	
	/**
	 * Report update in debug mode.
	 * @param {String} report
	 */
	_report : function ( report ) {
		if ( this.window.gui.debug ) {
			if ( gui.KeyMaster.isKey ( this.id )) {
				report = report.replace ( this.id, "(anonymous)" );
			}
			console.debug ( report );
		}
	}
	

}, {}, { // Static .......................................................
	
	/**
	 * Default replace update. A section of the DOM tree is replaced. 
	 * {@see ReplaceUpdate}
	 * @type {String}
	 */
	TYPE_HARD : "hard",

	/**
	 * Attribute update. The element must have an ID specified.
	 * {@see UpdateManager#hasSoftAttributes}
	 * {@see AttributesUpdate}
	 * @type {String}
	 */
	TYPE_ATTS : "atts",

	/**
	 * Insertion update: Inserts a child without replacing the parent. Child 
	 * siblings must all be Elements and they must all have an ID specified.
	 * {@see SiblingUpdate}
	 * @type {String}
	 */
	TYPE_INSERT : "insert",

	/**
	 * {@see SiblingUpdate}
	 * @type {String}
	 */
	TYPE_APPEND : "append",

	/**
	 * Removal update: Removes a child without replacing the parent. Child 
	 * siblings must all be Elements and they must all have an ID specified.
	 * {@see SiblingUpdate}
	 * @type {String}
	 */
	TYPE_REMOVE : "remove",

	/**
	 * EDB function update. Dereferencing functions bound to GUI 
	 * events that are no longer associated to any DOM element.
	 * @type {String}
	 */
	TYPE_FUNCTION : "function"

});


/**
 * Update attributes. Except for the ID which 
 * is required to be the same before and after.
 */
edb.AttsUpdate = edb.Update.extend ({
	
	/**edv
	 * Update type.
	 * @type {String}
	 */
	type : edb.Update.TYPE_ATTS,
	
	/**
	 * (XML) element before update.
	 * @type {Element}  
	 */
	_xold : null,
	
	/**
	 * (XML) element after update. 
	 * @type {Element}  
	 */
	_xnew : null,
	
	/**
	 * Tracking attribute changes for debugging.
	 * @type {Array<String>}
	 */
	_summary : null,
	
	/**
	 * Construct.
	 * @param {Document} doc
	 */
	onconstruct : function ( doc ) {
		this._super.onconstruct ( doc );
		this._summary = [];
	},
	
	/**
	 * Setup update.
	 * @param {String} id
	 * @param {Element} xnew
	 * @param {Element} xold
	 * @returns {edb.AttsUpdate}
	 */
	setup : function ( id, xnew, xold ) {
		this._super.setup ();
		this.id = id;
		this._xnew = xnew;
		this._xold = xold;
		return this;
	},
	
	/**
	 * Update attributes.
	 */
	update : function () {
		this._super.update ();
		var element = this.element ();
		if ( this._beforeUpdate ( element )) {
			this._update ( element );
			this._afterUpdate ( element );
			this._report ();
		}
	},
	
	/**
	 * Better not keep a reference to any DOM element around here.
	 * @overrides {edb.Update#dispose}
	 */
	dispose : function () {
		this._super.dispose ();
		delete this._xold;
		delete this._xnew;
	},
	
	
	// PRIVATE ....................................................................
	
	/**
	 * Actually update attributes.
	 * 1. Create and update attributes.
	 * 2. Remove attributes
	 * @param {HTMLElement} element
	 */
	_update : function ( element ) {
		Array.forEach ( this._xnew.attributes, function ( newatt ) {
			var oldatt = this._xold.getAttribute ( newatt.name );
			if ( oldatt === null || oldatt !== newatt.value ) {
				this._set ( element, newatt.name, newatt.value );
				this._summary.push ( "@" + newatt.name );
			}
		}, this );
		Array.forEach ( this._xold.attributes, function ( oldatt ) {
			if ( !this._xnew.hasAttribute ( oldatt.name )) {
				this._del ( element, oldatt.name, null );
				this._summary.push ( "@" + oldatt.value );
			}
		}, this );
	},
	
	/**
	 * Set element attribute. 
	 * @param {Element} element
	 * @param {String} name
	 * @param {String} value
	 * @return
	 */
	_set : function ( element, name, value ) {
		var spirit = element.spirit;
		if ( spirit ) {
			spirit.att.set ( name, value );
		} else {
			element.setAttribute ( name, value );
			switch ( name ) {
				case "checked" :
					if ( !element.checked ) {
						element.checked = true;
					}
					break;
				case "value" :
					if ( element.value !== value ) {
						element.value = String ( value ); // ?
					}
					break;
			}
		}
	},

	/**
	 * Set element attribute. 
	 * @param {Element} element
	 * @param {String} name
	 * @param {String} value
	 * @return
	 */
	_del : function ( element, name ) {
		var spirit = element.spirit;
		if ( spirit ) {
			spirit.att.del ( name ); // TODO!!!!!!!!!!!!!!
		} else {
			switch ( name ) {
				case "checked" :
					element.checked = false;
					break;
				default :
					element.removeAttribute ( name );
					break;
			}
		}
	},
	
	/**
	 * Debug changes.
	 */
	_report : function () {
		this._super._report ( "edb.AttsUpdate \"#" + this.id + "\" " + this._summary.join ( ", " ));
	}
	
});


/**
 * Hey.
 */
edb.HardUpdate = edb.Update.extend ({
	
	/**
	 * Update type.
	 * @type {String}
	 */
	type : edb.Update.TYPE_HARD,
	
	/**
	 * XML element.
	 * @type {Element}
	 */
	xelement : null,
	
	/**
	 * Setup update.
	 * @param {String} id
	 * @param {Element} xelement
	 * @returns {edb.HardUpdate}
	 */
	setup : function ( id, xelement ) {
		this._super.setup ();
		this.id = id;
		this.xelement = xelement;
		return this;
	},
	
	/**
	 * Replace target subtree. 
	 */
	update : function () {
		this._super.update ();
		var element = this.element ();
		if ( element && this._beforeUpdate ( element )) {
			gui.DOMPlugin.html ( element, this._serialize ());
			this._afterUpdate ( element );
			this._report ();
		}
	},
	
	/**
	 * Clean up.
	 */
	dispose : function () {
		this._super.dispose ();
		delete this.xelement;
	},
	
	
	// PRIVATE ..........................................................................
	
	/**
	 * Serialize XML element to XHTML string.
	 * TODO: Probably prefer DOM methods to innerHTML.
	 * @returns {String}
	 */
	_serialize : function () {
		var xhtml = new XMLSerializer ().serializeToString ( this.xelement );
		if ( xhtml.contains ( "</" )) {
			xhtml = xhtml.slice ( xhtml.indexOf ( ">" ) + 1, xhtml.lastIndexOf ( "<" ));
		}
		return xhtml;
	},
	
	/**
	 * Hello.
	 */
	_report : function () {
		this._super._report ( "edb.HardUpdate #" + this.id );
	}
});


/**
 * Soft update.
 * @extends {edb.Update}
 */
edb.SoftUpdate = edb.Update.extend ({
	
	/**
	 * XML element stuff (not used by edb.RemoveUpdate).
	 * @type {Element}
	 */
	xelement : null,
	
	/**
	 * Update type defined by descendants. 
	 * Matches insert|append|remove
	 * @type {String}
	 */
	type : null,
	
	/**
	 * Clean stuff up for what it's worth.
	 */
	dispose : function () {
		this._super.dispose ();
		delete this.xelement;
	},
	
	/**
	 * TODO: make static, argument xelement
	 * Convert XML element to HTML element. Method document.importNode can not 
	 * be used in Firefox, it will kill stuff such as the document.forms object.
	 * TODO: Support namespaces and what not
	 * @param {HTMLElement} element
	 */
	_import : function ( parent ) {
		var temp = this.document.createElement ( parent.nodeName );
		temp.innerHTML = new XMLSerializer ().serializeToString ( this.xelement );
		return temp.firstChild;
	}
});


/**
 * Insert.
 * @extends {edb.SoftUpdate}
 */
edb.InsertUpdate = edb.SoftUpdate.extend ({
	
	/**
	 * Update type.
	 * @type {String}
	 */
	type : edb.Update.TYPE_INSERT,
	
	/**
	 * XML element.
	 * @type {Element}
	 */
	xelement : null,
	
	/**
	 * Setup update.
	 * @param {String} id Insert before this ID
	 * @param {Element} xelement
	 * @returns {edb.InsertUpdate}
	 */
	setup : function ( id, xelement ) {
		this.id = id;
		this.xelement = xelement;
		return this;
	},
	
	/**
	 * Execute update.
	 */
	update : function () {
		var sibling = this.element ();
		var parent = sibling.parentNode;
		var child = this._import ( parent );
		if ( this._beforeUpdate ( parent )) {
			parent.insertBefore ( child, sibling );
			this._afterUpdate ( child );
			this._report ();
		}
	},
	
	/**
	 * Report.
	 * TODO: Push to update manager.
	 */
	_report : function () {
		this._super._report ( "edb.InsertUpdate #" + this.xelement.getAttribute ( "id" ));
	}
});


/**
 * Append.
 * @extends {edb.SoftUpdate}
 */
edb.AppendUpdate = edb.SoftUpdate.extend ({
	
	/**
	 * Update type.
	 * @type {String}
	 */
	type : edb.Update.TYPE_APPEND,
	
	/**
	 * Setup update.
	 * @param {String} id
	 * @param {Element} xelement
	 * @returns {edb.AppendUpdate}
	 */
	setup : function ( id, xelement ) {
		this.id = id;
		this.xelement = xelement;
		return this;
	},
	
	/**
	 * Execute update.
	 */
	update : function () {
		var parent = this.element ();
		var child = this._import ( parent );
		if ( this._beforeUpdate ( parent )) {
			parent.appendChild ( child );
			this._afterUpdate ( child );
			this._report ();
		}
	},
	
	/**
	 * Report.
	 * TODO: Push to update manager.
	 */
	_report : function () {
		this._super._report ( "edb.AppendUpdate #" + this.xelement.getAttribute ( "id" ));
	}
});


/**
 * Remove.
 * @extends {edb.SoftUpdate}
 */
edb.RemoveUpdate = edb.SoftUpdate.extend ({
	
	/**
	 * Update type.
	 * @type {String}
	 */
	type : edb.Update.TYPE_REMOVE,
	
	/**
	 * Setup update.
	 * @param {String} id
	 * @returns {edb.RemoveUpdate}
	 */
	setup : function ( id ) {
		this.id = id;
		return this;
	},
	
	/**
	 * Execute update.
	 */
	update : function () {
		var element = this.element ();
		var parent = element.parentNode;
		if ( this._beforeUpdate ( element )) {
			parent.removeChild ( element );
			this._afterUpdate ( parent );
			this._report ();
		}
	},
	
	/**
	 * Report.
	 * TODO: Push to update manager.
	 */
	_report : function () {
		this._super._report ( "edb.RemoveUpdate #" + this.id );
	}
});


/**
 * Updating the functions it is.
 * @TODO: revoke all functions in context on window.unload (if portalled)
 */
edb.FunctionUpdate = edb.Update.extend ({

	/**
	 * Update type.
	 * @type {String}
	 */
	type : edb.Update.TYPE_FUNCTION,

	/**
	 * Setup update.
	 * @param {String} id
	 * @param @optional {Map<String,String>} map
	 */
	setup : function ( id, map ) {
		this.id = id;
		this._map = map || null;
		return this;
	},

	/**
	 * Do the update.
	 */
	update : function () {
		var count = 0, elm = this.element ();
		if ( this._map ) {
			if (( count = edb.FunctionUpdate._remap ( elm, this._map ))) {
				this._report ( "remapped " + count + " keys" );
			}
		} else {
			if (( count = edb.FunctionUpdate._revoke ( elm ))) {
				this._report ( "revoked " + count + " keys" );
			}
		}
	},

	/**
	 * Report the update.
	 * @param {String} report
	 */
	_report : function ( report ) {
		this._super._report ( "edb.FunctionUpdate " + report );
	}

}, { // Static ......................................................

	/**
	 * @param {Element} element
	 */
	_revoke : function ( element ) {
		var count = 0, keys;
		this._getatts ( element ).forEach ( function ( att ) {
			keys = gui.KeyMaster.extractKey ( att.value );
			if ( keys ) {
				keys.forEach ( function ( key ) {
					edb.Script.$revoke ( key );
					count ++;
				});
			}
		});
		return count;
	},

	/**
	 * @param {Element} element
	 * @param {Map<String,String>} map
	 */
	_remap : function ( element, map ) {
		var count = 0, oldkeys, newkey;
		if ( Object.keys ( map ).length ) {
			this._getatts ( element ).forEach ( function ( att ) {
				if (( oldkeys = gui.KeyMaster.extractKey ( att.value ))) {
					oldkeys.forEach ( function ( oldkey ) {
						if (( newkey = map [ oldkey ])) {
							att.value = att.value.replace ( oldkey, newkey );
							edb.Script.$revoke ( oldkey );
							count ++;
						}
					});
				}
			});
		}
		return count;
	},

	/**
	 * Collect attributes from DOM subtree that 
	 * somewhat resemble EDBML poke statements.
	 * @returns {Array<Attribute>}
	 */
	_getatts : function ( element ) {
		var atts = [];
		new gui.Crawler ().descend ( element, {
			handleElement : function ( elm ) {
				Array.forEach ( elm.attributes, function ( att ) {
					if ( att.value.contains ( "edb.go" )) {
						atts.push ( att );
					}
				});
			}
		});
		return atts;
	}

});


/*
 * Register module.
 */
edb.EDBModule = gui.module ( "edb", {
	
	/**
	 * CSS selector for currently focused form field.
	 * @TODO: Support links and buttons as well
	 * @TODO: Migrate to (future) EDBMLModule
	 * @type {String}
	 */
	fieldselector : null,

	/*
	 * Extending {gui.Spirit}
	 */
	mixins : {
		
		/**
		 * Handle input.
		 * @param {edb.Input} input
		 */
		oninput : function ( input ) {
			if ( input.data instanceof edb.State ) {
				if ( this._statesstarted ( input.type, input.data )) {
					gui.Spirit.$oninit ( this );
				}
			}
		},

		/**
		 * Optional State instance.
		 * @type {edb.Controller.State}
		 */
		_state : null,

		/**
		 * Optional SessionState instance.
		 * @type {edb.Controller.SessionState}
		 */
		_sessionstate : null,

		/**
		 * Optional LocalState instance.
		 * @type {edb.Controller.LocalState}
		 */
		_localstate : null,

		/**
		 * Fire up potential state models. Returns 
		 * `true` if any state models are declared.
		 * @returns {boolean}
		 */
		_startstates : function () {
			var State;

			// @TODO: don't use some here!!!
			return Object.keys ( gui.Spirit.$states ).some ( function ( state ) {
				if (( State = this.constructor [ state ])) {
					this._startstate ( State );
					return true;
				} else {
					return false;
				}
			}, this );
		},

		/**
		 * Output state model only when the first 
		 * instance of this spirit is constructed. 
		 * Attempt to restore the stage from storage.
		 * @param {function} State
		 */
		_startstate : function ( State ) {
			this.input.add ( State );
			if ( !State.out ( this.window )) {
				State.restore ( this.window ).then ( function ( state ) {
					state = state || new State ();
					state.$output ( this.window );
				}, this );
			}
		},

		/**
		 * Assign state instance to private property name. 
		 * Returns true when all expected states are done.
		 * @param {function} State constructor
		 * @param {edb.State} state instance
		 * @returns {boolean}
		 */
		_statesstarted : function ( State, state ) {
			var MyState, propname, states = gui.Spirit.$states;
			return Object.keys ( states ).every ( function ( typename ) {
				MyState = this.constructor [ typename ];
				propname = states [ typename ];
				this [ propname ] = State === MyState ? state : null;
				return !MyState || this [ propname ] !== null;
			}, this ); 
		},

		/**
		 * Handle changes.
		 * @param {Array<edb.ObjectChange|edb.ArrayChange>}
		 */
		onchange : function ( changes ) {}
	},
	
	/*
	 * Register default plugins for all spirits.
	 */
	plugins : {
		script : edb.ScriptPlugin,
		input : edb.InputPlugin,
		output : edb.OutputPlugin
	},
	
	/*
	 * Channeling spirits to CSS selectors.
	 */
	channels : [
		[ "script[type='text/edbml']", "edb.ScriptSpirit" ],
		[ "link[rel='service']", "edb.ServiceSpirit" ]
	],

	oncontextinitialize : function ( context ) {
		var plugin, proto, method;
		if ( !context.gui.portalled ) {
			if (( plugin = context.gui.AttConfigPlugin )) {
				proto = plugin.prototype;
				method = proto.$evaluate;
				proto.$evaluate = function ( name, value, fix ) {
					if ( value.startsWith ( "edb.get" )) {
						var key = gui.KeyMaster.extractKey ( value )[ 0 ];
						value = key ? context.edb.get ( key ) : key;
					}
					return method.call ( this, name, value, fix );
				};
			}
		}
	},

	/**
	 * Context spiritualized.
	 * @param {Window} context
	 */
	onafterspiritualize : function ( context ) {
		var doc = context.document;
		if ( gui.Client.isGecko ) { // @TODO: patch in Spiritual?
			doc.addEventListener ( "focus", this, true );
			doc.addEventListener ( "blur", this, true );
		} else {
			doc.addEventListener ( "focusin", this, true );
			doc.addEventListener ( "focusout", this, true );
		}
		
	},

	/**
	 * Handle event.
	 * @param {Event} e
	 */
	handleEvent : function ( e ) {
		switch ( e.type ) {
			case "focusin" :
			case "focus" :
				this.fieldselector = this._fieldselector ( e.target );
				break;
			case "focusout" :
			case "blur" :
				this.fieldselector = null;
				break;
		}
	},


	// Private ...................................................

	/**
	 * Compute selector for form field. We scope it to 
	 * nearest element ID or fallback to document body.
	 * @param {Element} element
	 */
	_fieldselector : function ( elm ) {
		var index = -1;
		var parts = [];
		function hasid ( elm ) {
			if ( elm.id ) {
				try {
					gui.DOMPlugin.q ( elm.parentNode, elm.id );
					return true;
				} catch ( malformedexception ) {}
			}
			return false;
		}
		while ( elm && elm.nodeType === Node.ELEMENT_NODE ) {
			if ( hasid ( elm )) {
				parts.push ( "#" + elm.id );
				elm = null;
			} else {
				if ( elm.localName === "body" ) {
					parts.push ( "body" );
					elm = null;
				} else {
					index = gui.DOMPlugin.ordinal ( elm ) + 1;
					parts.push ( ">" + elm.localName + ":nth-child(" + index + ")" );
					elm = elm.parentNode;
				}
			}
		}
		return parts.reverse ().join ( "" );
	}

});


}( this ));
//
// showdown.js -- A javascript port of Markdown.
//
// Copyright (c) 2007 John Fraser.
//
// Original Markdown Copyright (c) 2004-2005 John Gruber
//   <http://daringfireball.net/projects/markdown/>
//
// Redistributable under a BSD-style open source license.
// See license.txt for more information.
//
// The full source distribution is at:
//
//				A A L
//				T C A
//				T K B
//
//   <http://www.attacklab.net/>
//
//
// Wherever possible, Showdown is a straight, line-by-line port
// of the Perl version of Markdown.
//
// This is not a normal parser design; it's basically just a
// series of string substitutions.  It's hard to read and
// maintain this way,  but keeping Showdown close to the original
// design makes it easier to port new features.
//
// More importantly, Showdown behaves like markdown.pl in most
// edge cases.  So web applications can do client-side preview
// in Javascript, and then build identical HTML on the server.
//
// This port needs the new RegExp functionality of ECMA 262,
// 3rd Edition (i.e. Javascript 1.5).  Most modern web browsers
// should do fine.  Even with the new regular expression features,
// We do a lot of work to emulate Perl's regex functionality.
// The tricky changes in this file mostly have the "attacklab:"
// label.  Major or self-explanatory changes don't.
//
// Smart diff tools like Araxis Merge will be able to match up
// this file with markdown.pl in a useful way.  A little tweaking
// helps: in a copy of markdown.pl, replace "#" with "//" and
// replace "$text" with "text".  Be sure to ignore whitespace
// and line endings.
//
//
// Showdown usage:
//
//   var text = "Markdown *rocks*.";
//
//   var converter = new Showdown.converter();
//   var html = converter.makeHtml(text);
//
//   alert(html);
//
// Note: move the sample code to the bottom of this
// file before uncommenting it.
//
//
// Showdown namespace
//
var Showdown={extensions:{}},forEach=Showdown.forEach=function(a,b){if(typeof a.forEach=="function")a.forEach(b);else{var c,d=a.length;for(c=0;c<d;c++)b(a[c],c,a)}},stdExtName=function(a){return a.replace(/[_-]||\s/g,"").toLowerCase()};Showdown.converter=function(a){var b,c,d,e=0,f=[],g=[];if(typeof module!="undefind"&&typeof exports!="undefined"&&typeof require!="undefind"){var h=require("fs");if(h){var i=h.readdirSync((__dirname||".")+"/extensions").filter(function(a){return~a.indexOf(".js")}).map(function(a){return a.replace(/\.js$/,"")});Showdown.forEach(i,function(a){var b=stdExtName(a);Showdown.extensions[b]=require("./extensions/"+a)})}}this.makeHtml=function(a){return b={},c={},d=[],a=a.replace(/~/g,"~T"),a=a.replace(/\$/g,"~D"),a=a.replace(/\r\n/g,"\n"),a=a.replace(/\r/g,"\n"),a="\n\n"+a+"\n\n",a=M(a),a=a.replace(/^[ \t]+$/mg,""),Showdown.forEach(f,function(b){a=k(b,a)}),a=z(a),a=m(a),a=l(a),a=o(a),a=K(a),a=a.replace(/~D/g,"$$"),a=a.replace(/~T/g,"~"),Showdown.forEach(g,function(b){a=k(b,a)}),a};if(a&&a.extensions){var j=this;Showdown.forEach(a.extensions,function(a){typeof a=="string"&&(a=Showdown.extensions[stdExtName(a)]);if(typeof a!="function")throw"Extension '"+a+"' could not be loaded.  It was either not found or is not a valid extension.";Showdown.forEach(a(j),function(a){a.type?a.type==="language"||a.type==="lang"?f.push(a):(a.type==="output"||a.type==="html")&&g.push(a):g.push(a)})})}var k=function(a,b){if(a.regex){var c=new RegExp(a.regex,"g");return b.replace(c,a.replace)}if(a.filter)return a.filter(b)},l=function(a){return a+="~0",a=a.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|(?=~0))/gm,function(a,d,e,f,g){return d=d.toLowerCase(),b[d]=G(e),f?f+g:(g&&(c[d]=g.replace(/"/g,"&quot;")),"")}),a=a.replace(/~0/,""),a},m=function(a){a=a.replace(/\n/g,"\n\n");var b="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del|style|section|header|footer|nav|article|aside",c="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|style|section|header|footer|nav|article|aside";return a=a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,n),a=a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|style|section|header|footer|nav|article|aside)\b[^\r]*?<\/\2>[ \t]*(?=\n+)\n)/gm,n),a=a.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,n),a=a.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g,n),a=a.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,n),a=a.replace(/\n\n/g,"\n"),a},n=function(a,b){var c=b;return c=c.replace(/\n\n/g,"\n"),c=c.replace(/^\n/,""),c=c.replace(/\n+$/g,""),c="\n\n~K"+(d.push(c)-1)+"K\n\n",c},o=function(a){a=v(a);var b=A("<hr />");return a=a.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,b),a=a.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm,b),a=a.replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm,b),a=x(a),a=y(a),a=E(a),a=m(a),a=F(a),a},p=function(a){return a=B(a),a=q(a),a=H(a),a=t(a),a=r(a),a=I(a),a=G(a),a=D(a),a=a.replace(/  +\n/g," <br />\n"),a},q=function(a){var b=/(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;return a=a.replace(b,function(a){var b=a.replace(/(.)<\/?code>(?=.)/g,"$1`");return b=N(b,"\\`*_"),b}),a},r=function(a){return a=a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,s),a=a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,s),a=a.replace(/(\[([^\[\]]+)\])()()()()()/g,s),a},s=function(a,d,e,f,g,h,i,j){j==undefined&&(j="");var k=d,l=e,m=f.toLowerCase(),n=g,o=j;if(n==""){m==""&&(m=l.toLowerCase().replace(/ ?\n/g," ")),n="#"+m;if(b[m]!=undefined)n=b[m],c[m]!=undefined&&(o=c[m]);else{if(!(k.search(/\(\s*\)$/m)>-1))return k;n=""}}n=N(n,"*_");var p='<a href="'+n+'"';return o!=""&&(o=o.replace(/"/g,"&quot;"),o=N(o,"*_"),p+=' title="'+o+'"'),p+=">"+l+"</a>",p},t=function(a){return a=a.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,u),a=a.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,u),a},u=function(a,d,e,f,g,h,i,j){var k=d,l=e,m=f.toLowerCase(),n=g,o=j;o||(o="");if(n==""){m==""&&(m=l.toLowerCase().replace(/ ?\n/g," ")),n="#"+m;if(b[m]==undefined)return k;n=b[m],c[m]!=undefined&&(o=c[m])}l=l.replace(/"/g,"&quot;"),n=N(n,"*_");var p='<img src="'+n+'" alt="'+l+'"';return o=o.replace(/"/g,"&quot;"),o=N(o,"*_"),p+=' title="'+o+'"',p+=" />",p},v=function(a){function b(a){return a.replace(/[^\w]/g,"").toLowerCase()}return a=a.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,function(a,c){return A('<h1 id="'+b(c)+'">'+p(c)+"</h1>")}),a=a.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,function(a,c){return A('<h2 id="'+b(c)+'">'+p(c)+"</h2>")}),a=a.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,function(a,c,d){var e=c.length;return A("<h"+e+' id="'+b(d)+'">'+p(d)+"</h"+e+">")}),a},w,x=function(a){a+="~0";var b=/^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;return e?a=a.replace(b,function(a,b,c){var d=b,e=c.search(/[*+-]/g)>-1?"ul":"ol";d=d.replace(/\n{2,}/g,"\n\n\n");var f=w(d);return f=f.replace(/\s+$/,""),f="<"+e+">"+f+"</"+e+">\n",f}):(b=/(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g,a=a.replace(b,function(a,b,c,d){var e=b,f=c,g=d.search(/[*+-]/g)>-1?"ul":"ol",f=f.replace(/\n{2,}/g,"\n\n\n"),h=w(f);return h=e+"<"+g+">\n"+h+"</"+g+">\n",h})),a=a.replace(/~0/,""),a};w=function(a){return e++,a=a.replace(/\n{2,}$/,"\n"),a+="~0",a=a.replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,function(a,b,c,d,e){var f=e,g=b,h=c;return g||f.search(/\n{2,}/)>-1?f=o(L(f)):(f=x(L(f)),f=f.replace(/\n$/,""),f=p(f)),"<li>"+f+"</li>\n"}),a=a.replace(/~0/g,""),e--,a};var y=function(a){return a+="~0",a=a.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,function(a,b,c){var d=b,e=c;return d=C(L(d)),d=M(d),d=d.replace(/^\n+/g,""),d=d.replace(/\n+$/g,""),d="<pre><code>"+d+"\n</code></pre>",A(d)+e}),a=a.replace(/~0/,""),a},z=function(a){return a+="~0",a=a.replace(/(?:^|\n)```(.*)\n([\s\S]*?)\n```/g,function(a,b,c){var d=b,e=c;return e=C(e),e=M(e),e=e.replace(/^\n+/g,""),e=e.replace(/\n+$/g,""),e="<pre><code"+(d?' class="'+d+'"':"")+">"+e+"\n</code></pre>",A(e)}),a=a.replace(/~0/,""),a},A=function(a){return a=a.replace(/(^\n+|\n+$)/g,""),"\n\n~K"+(d.push(a)-1)+"K\n\n"},B=function(a){return a=a.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,function(a,b,c,d,e){var f=d;return f=f.replace(/^([ \t]*)/g,""),f=f.replace(/[ \t]*$/g,""),f=C(f),b+"<code>"+f+"</code>"}),a},C=function(a){return a=a.replace(/&/g,"&amp;"),a=a.replace(/</g,"&lt;"),a=a.replace(/>/g,"&gt;"),a=N(a,"*_{}[]\\",!1),a},D=function(a){return a=a.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,"<strong>$2</strong>"),a=a.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g,"<em>$2</em>"),a},E=function(a){return a=a.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,function(a,b){var c=b;return c=c.replace(/^[ \t]*>[ \t]?/gm,"~0"),c=c.replace(/~0/g,""),c=c.replace(/^[ \t]+$/gm,""),c=o(c),c=c.replace(/(^|\n)/g,"$1  "),c=c.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm,function(a,b){var c=b;return c=c.replace(/^  /mg,"~0"),c=c.replace(/~0/g,""),c}),A("<blockquote>\n"+c+"\n</blockquote>")}),a},F=function(a){a=a.replace(/^\n+/g,""),a=a.replace(/\n+$/g,"");var b=a.split(/\n{2,}/g),c=[],e=b.length;for(var f=0;f<e;f++){var g=b[f];g.search(/~K(\d+)K/g)>=0?c.push(g):g.search(/\S/)>=0&&(g=p(g),g=g.replace(/^([ \t]*)/g,"<p>"),g+="</p>",c.push(g))}e=c.length;for(var f=0;f<e;f++)while(c[f].search(/~K(\d+)K/)>=0){var h=d[RegExp.$1];h=h.replace(/\$/g,"$$$$"),c[f]=c[f].replace(/~K\d+K/,h)}return c.join("\n\n")},G=function(a){return a=a.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;"),a=a.replace(/<(?![a-z\/?\$!])/gi,"&lt;"),a},H=function(a){return a=a.replace(/\\(\\)/g,O),a=a.replace(/\\([`*_{}\[\]()>#+-.!])/g,O),a},I=function(a){return a=a.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi,'<a href="$1">$1</a>'),a=a.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,function(a,b){return J(K(b))}),a},J=function(a){var b=[function(a){return"&#"+a.charCodeAt(0)+";"},function(a){return"&#x"+a.charCodeAt(0).toString(16)+";"},function(a){return a}];return a="mailto:"+a,a=a.replace(/./g,function(a){if(a=="@")a=b[Math.floor(Math.random()*2)](a);else if(a!=":"){var c=Math.random();a=c>.9?b[2](a):c>.45?b[1](a):b[0](a)}return a}),a='<a href="'+a+'">'+a+"</a>",a=a.replace(/">.+:/g,'">'),a},K=function(a){return a=a.replace(/~E(\d+)E/g,function(a,b){var c=parseInt(b);return String.fromCharCode(c)}),a},L=function(a){return a=a.replace(/^(\t|[ ]{1,4})/gm,"~0"),a=a.replace(/~0/g,""),a},M=function(a){return a=a.replace(/\t(?=\t)/g,"    "),a=a.replace(/\t/g,"~A~B"),a=a.replace(/~B(.+?)~A/g,function(a,b,c){var d=b,e=4-d.length%4;for(var f=0;f<e;f++)d+=" ";return d}),a=a.replace(/~A/g,"    "),a=a.replace(/~B/g,""),a},N=function(a,b,c){var d="(["+b.replace(/([\[\]\\])/g,"\\$1")+"])";c&&(d="\\\\"+d);var e=new RegExp(d,"g");return a=a.replace(e,O),a},O=function(a,b){var c=b.charCodeAt(0);return"~E"+c+"E"}},typeof module!="undefined"&&(module.exports=Showdown),typeof define=="function"&&define.amd&&define("showdown",function(){return Showdown});
/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

(function(){

// Private helper vars
var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

var _ = self.Prism = {
	util: {
		type: function (o) { 
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},
		
		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};
					
					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}
					
					return clone;
					
				case 'Array':
					return o.slice();
			}
			
			return o;
		}
	},
	
	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);
			
			for (var key in redef) {
				lang[key] = redef[key];
			}
			
			return lang;
		},
		
		// Insert a token before another token in a language literal
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];
			var ret = {};
				
			for (var token in grammar) {
			
				if (grammar.hasOwnProperty(token)) {
					
					if (token == before) {
					
						for (var newToken in insert) {
						
							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}
					
					ret[token] = grammar[token];
				}
			}
			
			return root[inside] = ret;
		},
		
		// Traverse a language definition with Depth First Search
		DFS: function(o, callback) {
			for (var i in o) {
				callback.call(o, i, o[i]);
				
				if (_.util.type(o) === 'Object') {
					_.languages.DFS(o[i], callback);
				}
			}
		}
	},

	highlightAll: function(async, callback) {
		var elements = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, callback);
		}
	},
		
	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;
		
		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}
		
		if (parent) {
			language = (parent.className.match(lang) || [,''])[1];
			grammar = _.languages[language];
		}

		if (!grammar) {
			return;
		}
		
		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
		
		// Set language on the parent, for styling
		parent = element.parentNode;
		
		if (/pre/i.test(parent.nodeName)) {
			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language; 
		}

		var code = element.textContent;
		
		if(!code) {
			return;
		}
		
		code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
		
		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};
		
		_.hooks.run('before-highlight', env);
		
		if (async && self.Worker) {
			var worker = new Worker(_.filename);	
			
			worker.onmessage = function(evt) {
				env.highlightedCode = Token.stringify(JSON.parse(evt.data), language);

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;
				
				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
			};
			
			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language)

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;
			
			callback && callback.call(element);
			
			_.hooks.run('after-highlight', env);
		}
	},
	
	highlight: function (text, grammar, language) {
		return Token.stringify(_.tokenize(text, grammar), language);
	},
	
	tokenize: function(text, grammar, language) {
		var Token = _.Token;
		
		var strarr = [text];
		
		var rest = grammar.rest;
		
		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}
			
			delete grammar.rest;
		}
								
		tokenloop: for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}
			
			var pattern = grammar[token], 
				inside = pattern.inside,
				lookbehind = !!pattern.lookbehind,
				lookbehindLength = 0;
			
			pattern = pattern.pattern || pattern;
			
			for (var i=0; i<strarr.length; i++) { // Don’t cache length as it changes during the loop
				
				var str = strarr[i];
				
				if (strarr.length > text.length) {
					// Something went terribly wrong, ABORT, ABORT!
					break tokenloop;
				}
				
				if (str instanceof Token) {
					continue;
				}
				
				pattern.lastIndex = 0;
				
				var match = pattern.exec(str);
				
				if (match) {
					if(lookbehind) {
						lookbehindLength = match[1].length;
					}

					var from = match.index - 1 + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    len = match.length,
					    to = from + len,
						before = str.slice(0, from + 1),
						after = str.slice(to + 1); 

					var args = [i, 1];
					
					if (before) {
						args.push(before);
					}
					
					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match);
					
					args.push(wrapped);
					
					if (after) {
						args.push(after);
					}
					
					Array.prototype.splice.apply(strarr, args);
				}
			}
		}

		return strarr;
	},
	
	hooks: {
		all: {},
		
		add: function (name, callback) {
			var hooks = _.hooks.all;
			
			hooks[name] = hooks[name] || [];
			
			hooks[name].push(callback);
		},
		
		run: function (name, env) {
			var callbacks = _.hooks.all[name];
			
			if (!callbacks || !callbacks.length) {
				return;
			}
			
			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content) {
	this.type = type;
	this.content = content;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (Object.prototype.toString.call(o) == '[object Array]') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}
	
	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};
	
	if (env.type == 'comment') {
		env.attributes['spellcheck'] = 'true';
	}
	
	_.hooks.run('wrap', env);
	
	var attributes = '';
	
	for (var name in env.attributes) {
		attributes += name + '="' + (env.attributes[name] || '') + '"';
	}
	
	return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';
	
};

if (!self.document) {
	// In worker
	self.addEventListener('message', function(evt) {
		var message = JSON.parse(evt.data),
		    lang = message.language,
		    code = message.code;
		
		self.postMessage(JSON.stringify(_.tokenize(code, _.languages[lang])));
		self.close();
	}, false);
	
	return;
}

// Get current script and highlight
var script = document.getElementsByTagName('script');

script = script[script.length - 1];

if (script) {
	_.filename = script.src;
	
	if (document.addEventListener && !script.hasAttribute('data-manual')) {
		document.addEventListener('DOMContentLoaded', _.highlightAll);
	}
}

})();;
Prism.languages.markup = {
	'comment': /&lt;!--[\w\W]*?-->/g,
	'prolog': /&lt;\?.+?\?>/,
	'doctype': /&lt;!DOCTYPE.+?>/,
	'cdata': /&lt;!\[CDATA\[[\w\W]*?]]>/i,
	'tag': {
		pattern: /&lt;\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|\w+))?\s*)*\/?>/gi,
		inside: {
			'tag': {
				pattern: /^&lt;\/?[\w:-]+/i,
				inside: {
					'punctuation': /^&lt;\/?/,
					'namespace': /^[\w-]+?:/
				}
			},
			'attr-value': {
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,
				inside: {
					'punctuation': /=|>|"/g
				}
			},
			'punctuation': /\/?>/g,
			'attr-name': {
				pattern: /[\w:-]+/g,
				inside: {
					'namespace': /^[\w-]+?:/
				}
			}
			
		}
	},
	'entity': /&amp;#?[\da-z]{1,8};/gi
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});;
Prism.languages.css = {
	'comment': /\/\*[\w\W]*?\*\//g,
	'atrule': {
		pattern: /@[\w-]+?.*?(;|(?=\s*{))/gi,
		inside: {
			'punctuation': /[;:]/g
		}
	},
	'url': /url\((["']?).*?\1\)/gi,
	'selector': /[^\{\}\s][^\{\};]*(?=\s*\{)/g,
	'property': /(\b|\B)[\w-]+(?=\s*:)/ig,
	'string': /("|')(\\?.)*?\1/g,
	'important': /\B!important\b/gi,
	'ignore': /&(lt|gt|amp);/gi,
	'punctuation': /[\{\};:]/g
};

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/style(>|&gt;)/ig,
			inside: {
				'tag': {
					pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)|(&lt;|<)\/style(>|&gt;)/ig,
					inside: Prism.languages.markup.tag.inside
				},
				rest: Prism.languages.css
			}
		}
	});
};
Prism.languages.clike = {
	'comment': {
		pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|(^|[^:])\/\/.*?(\r?\n|$))/g,
		lookbehind: true
	},
	'string': /("|')(\\?.)*?\1/g,
	'class-name': {
		pattern: /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/ig,
		lookbehind: true,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g,
	'boolean': /\b(true|false)\b/g,
	'function': {
		pattern: /[a-z0-9_]+\(/ig,
		inside: {
			punctuation: /\(/
		}
	},
	'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
	'operator': /[-+]{1,2}|!|&lt;=?|>=?|={1,3}|(&amp;){1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,
	'ignore': /&(lt|gt|amp);/gi,
	'punctuation': /[{}[\];(),.:]/g
};
;
Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(var|let|if|else|while|do|for|return|in|instanceof|function|new|with|typeof|try|throw|catch|finally|null|break|continue)\b/g,
	'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|NaN|-?Infinity)\b/g
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,
		lookbehind: true
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/script(>|&gt;)/ig,
			inside: {
				'tag': {
					pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)|(&lt;|<)\/script(>|&gt;)/ig,
					inside: Prism.languages.markup.tag.inside
				},
				rest: Prism.languages.javascript
			}
		}
	});
}
;
/**
 * Dox namespace.
 */
window.dox = gui.namespace ( "dox" );
/**
 * Filesystem node (abstract)
 * @extends {edb.Object}
 */
dox.Node = edb.Object ({

	/**
	 * Node name.
	 * @type {String}
	 */
	name : null
});
/**
 * File nodes.
 * @extends {dox.Node}
 */
dox.File = dox.Node.extend ({

	/**
	 * File location.
	 * @type {String}
	 */
	src : null,

	/**
	 * File type (extension).
	 * @type {String}
	 */
	type : null,

	/**
	 * File name minus extension assumed to be "what" the file is.
	 * @type {String}
	 */
	what : null,

	/**
	 * Doc object generated by gui.DocServiceSpirit when file source 
	 * is requested. This contains the actual documentation sections.
	 * @type {dox.Doc}
	 */
	doc : null,

	/**
	 * Filename matches term? Used in search.
	 * @param {String} term
	 * @return {boolean}
	 */
	matches : function ( term ) {
		var name = this.name.toLowerCase ();
		return name.contains (
			term.toLowerCase ()
		);
	}
});
/**
 * Folder nodes.
 * @extends {dox.Node}
 */
dox.Folder = dox.Node.extend ({

	/**
	 * Contains files or folders.
	 * @type {Array<dox.Node>}
	 */
	nodes : edb.Array ({
		$of : function ( json ) {
			if ( json.nodes ) {
				return dox.Folder;
			} else {
				return dox.File;
			}
		}
	}),

	// ...................................................

	/**
	 * Open/close.
	 * @type {boolean}
	 */
	open : false,

	/**
	 * Listing filesnames in this and descendant folders. 
	 * @type {Array<String>}
	 */
	filenames : null,

	/**
	 * Search for filesname in this and descendant folders. 
	 * @param {String} term
	 * @return {boolean}
	 */
	matches : function ( term ) {
		return this.filenames.contains (
			term.toLowerCase ()
		);
	}
});
/**
 * @extends {edb.Object}
 */
dox.Tag = edb.Object ({
	text : null, // need arg to onconstruct!
	desc : null,
	name : null,
	type : null,
	onconstruct : function ( json ) { // TODO: JSON as arg here!
		this.desc = "";
		this.name = "";
		this.type = "";
		var names = [];
		var parts = this.text.split ( / +/ );
		parts.forEach ( function ( part ) {
			switch ( part.charAt ( 0 )) {
				case "@" :
					names.push ( part ); // introducing multiple @statements per tag
					break;
				case "{" :
					this.type = part; // only on {name} per tag 
					break;
				default :
					this.desc += part + " ";
					break;
			}
		}, this );
		this.name = names.join ( " " );
	}
});
/**
 * @extends {edb.Object}
 */
dox.Doc = edb.Object ();
/**
 * @extends {edb.Object}
 */
dox.Chapter = edb.Object ({
	blocks : edb.Array ({
		$of : dox.Section
	})
});
/**
 * @extends {edb.Object}
 */
dox.Section = edb.Object ({
	
	line : -1,
	desc : null,
	code : null,

	/**
	 * Hello.
	 * @type {edb.Array}
	 */
	tags : edb.Array ({
		$of : dox.Tag
	}),

	/**
	 * Get code encoded.
	 * @deprecated
	 */
	$encode : function () {
		return this.code.
			replace(/&(?!\w+;)/g, '&amp;').
			replace(/</g, '&lt;').
			replace(/>/g, '&gt;');
	}
});
/**
 * @extends {dox.Doc}
 */
dox.JSDoc = dox.Doc.extend ({

	/**
	 * Document chapters.
	 * @type {edb.Array}
	 */
	chapters : edb.Array ({ // TODO: externalize to trigger bug: script.sections [ 0 ];
		$of : dox.Chapter
	}),

	/**
	 * Iterator util. Apply action for all chapters and sections.
	 * @param {function} action
	 * @param @optional {object} thisp
	 */
	forEach : function ( action, thisp ) {
		this.chapters.forEach ( function ( chapter ) {
			chapter.sections.forEach ( function ( section, index ) {
				action.call ( thisp, chapter, section, index );
			});
		});
	}
});
/**
 * @extends {dox.Doc}
 */
dox.MDDoc = dox.Doc.extend ();
/**
 * Spirit of the file service.
 * @extends {gui.Spirit}
 */
dox.FileServiceSpirit = gui.Spirit.extend ({

	/**
	 * Fetch JSON data on startup.
	 * @return {[type]} [description]
	 */
	onconfigure : function () {
		this._super.onconfigure ();
		new gui.Request ( "dox.json" ).get ().then ( function ( status, data ) {
			if ( status === 200 ) {
				var tree = this._maketree ( data );
				new dox.Folder ( tree ).$output ();
			} else {
				alert ( "Server responded: " + status + "\nHas the files been indexed?" );
			}
		}, this );
	},


	// PRIVATES .................................................................

	/**
	 * Parse list of strings into directory structure and return the root folder.
	 * @param {Array<String>} srcs
	 * @returns {dox.Folder}
	 */
	_maketree : function ( srcs ) {

		/*
		 * Distribute foldernames and filenames in hashmaps.
		 */
		function step1 ( srcs ) {
			var map = Object.create ( null );
			function next ( source, parts, map ) {
				var part = parts.shift ();
				if ( !parts.length ) {
					map [ part ] = source;
				} else {
					map [ part ] = map [ part ] || Object.create ( null );
					next ( source, parts, map [ part ]);
				}
			}
			srcs.forEach ( function ( source ) {
				next ( source, source.split ( "/" ), map );
			});
			return map;
		}

		/*
		 * Transforming hashmaps into objects and arrays.
		 */
		function step2 ( map ) {
			var root = { name : "/", nodes : []};
			return ( function next ( map, parent, level ) {
				gui.Object.each ( map, function ( key, val ) {
					var node = { name : key };
					if ( typeof ( val ) === "object" ) {
						node.nodes = [];
						node.open = level < 2;
						next ( val, node, level + 1 );
					} else {
						node.src = val;
					}
					parent.nodes.push ( node );
				});
				return parent;
			}) ( map, root, 0 );
		}

		/*
		 * Section files from folders and sort them alphabetically.
		 */
		function step3 ( folder ) {
			var is, nodes = folder.nodes, alpha = function ( n1, n2 ) {
				return n1.name < n2.name ? -1 : n1.name > n2.name ? 1 : 0;
			};
			folder.nodes = nodes.filter ( function ( node ) {
				return (( is = node.nodes )) ? step3 ( node ) : false;
			}).sort ( alpha ).concat ( nodes.filter ( function ( node ) {
				return !node.nodes;
			}).sort ( alpha ));
			return folder;
		}

		/**
		 * Reduce to minimum viable root folder.
		 */
		function step4 ( folder ) {
			while ( folder.nodes.length === 1 && folder.nodes [ 0 ].nodes ) {
				folder = folder.nodes [ 0 ];
			}
			return folder;
		}

		/**
		 * Preoptimize search by stamping descendant filenames onto folders.
		 */
		function step5 ( folder ) {
			folder.filenames = folder.filenames || folder.nodes.map ( function ( node ) {
				return node.nodes ? step5 ( node ).filenames : node.name.toLowerCase ();
			}).join ( " " );
			return folder;
		}

		// here we go
		return step5 ( step4 ( step3 ( step2 ( step1 ( srcs )))));
	}
	
});
/**
 * Spirit of the doc service.
 * @TODO Delete consecutive empty lines from code.
 * @extends {gui.Spirit}
 */
dox.DocServiceSpirit = gui.Spirit.extend ({

	/**
	 * Get ready.
	 * @TODO re-enable hashchange broadcast in {gui.DocumentSpirit}!
	 */
	onready : function () {
		this._super.onready ();
		var fetch = function () {
			var hash = window.location.hash;
			if ( hash ) {
				this._fetch ( hash.substring ( 1 ));
			}
		}.bind ( this );
		this.window.addEventListener ( "hashchange", fetch );
		fetch ();
	},


	// PRIVATES ......................................................
	
	/**
	 * Markdown parser.
	 * @type {object}
	 */
	_showdown : null,

	/**
	 * Fetch file from server.
	 * @return {String} src
	 */
	_fetch : function ( src ) {
		var cuts = src.split ( "/" );
		var name = cuts.pop ();
		var dots = src.split ( "." );
		var type = dots.pop ();
		new gui.Request ( src ).acceptText ().get ().then ( function ( status, data ) {
			this._output ( name, type, data );
		}, this );
	},

	/**
	 * Publish Doc object. The constructor for this is variabel, 
	 * so we wrap the Doc in a File before we output to page, 
	 * this will make the output easier to manage in templates.
	 * @param {String} name File name
	 * @param {String} type File type
	 * @param {String} text File text
	 */
	_output : function ( name, type, text ) {
		this._computedoc ( text, type ).$output ();
		/*
		this.output.dispatch (
			new dox.File ({
				name : name,
				type : type,
				what : name.split ( "." + type )[ 0 ],
				doc : this._computedoc ( text, type )
			})
		);
		*/
	},

	/**
	 * Compute Doc object for file text.
	 * @param {String} text File text
	 * @param {String} type File type
	 * @returns {dox.JSDoc|dox.MDDoc}
	 */
	_computedoc : function ( text, type ) {
		switch ( type ) {
			case "js" :
				return new dox.JSDoc ({
					chapters : this._chapters ( text )
				});
			case "md" :
				return new dox.MDDoc ({
					markup : this._markup ( text )
				});
		}
	},

	/**
	 * Parse source code to chapters.
	 * @param {String} source
	 * @return {Array<dox.Chapter>}
	 */
	_chapters : function ( source ) {

		var comment = false;
		var chapters = [];
		var chapter = null;
		var sections = [];
		var section = null;
		var marker = new Showdown.converter ();

		function nextchapter ( title ) {
			if ( chapter ) {
				chapter.sections = sections.map ( function ( section ) {
					section.desc = marker.makeHtml ( section.desc );
					return section;
				});
				chapters.push ( chapter );
			}
			chapter = new dox.Chapter ({
				title : title || null
			});
			sections = [];
		}

		function nextsection ( line ) {
			if ( section && section.code ) {
				sections.push ( section );
			}
			section = new dox.Section ({
				line : line || 0,
				tags : [],
				desc : "",
				code : ""
			});
		}

		nextsection ();
		nextchapter ();
		source.split ( "\n" ).forEach ( function ( line, index ) {
			var md, trim = line.trim ();
			if ( comment ) {
				if ( trim.startsWith ( "*/" )) {
					comment = false;
				} else {
					if ( trim === "*" ) {
						section.desc += "\n\n";
					} else {
						md = line.replace ( this._REX_GUTTER, "" );
						switch ( md [ 0 ]) {
							case "@" :
								section.tags.push ( new dox.Tag ({
									text : this._encode ( md )
								}));
								break;
							case "#" :
								section.desc += "\n" + md + "\n\n";	
								break;
							default :
								if ( !md.match ( this._REX_LETTER )) {
									section.desc += "\n";
								}
								section.desc += md;
								break;
						}
					}
				}
			} else {
				if ( line.match ( this._REX_CHAPTER )) {
					nextsection ( index );
					nextchapter ( this._REX_TITLE.exec ( line )[ 0 ]);
					section.code += this._REX_HELLO.exec ( line )[ 0 ];
				} else {
					if ( trim.startsWith ( "/**" )) {
						comment = true;
						nextsection ( index );
					} else {
						section.code += line + "\n";
					}
				}
			}
		}, this );
		nextsection ();
		nextchapter ();
		return chapters;
	},

	/**
	 * Encode string as HTML.
	 * @param {String} string
	 * @returns {String}
	 */
	_encode : function ( string ) {
		return string.
			replace ( /&(?!\w+;)/g, "&amp;" ).
			replace ( /</g, "&lt;" ).
			replace ( />/g, "&gt;" );
	},

	/**
	 * Markdown to HTML.
	 * @param {String} markup
	 * @returna {String}
	 */
	_markup : function ( markdown ) {
		this._showdown = this._showdown || new Showdown.converter ();
		return this._showdown.makeHtml ( markdown );
	},

	/**
	 * No line of markdown would ever start with these charcodes.
	 * @TODO This is not used...
	 * @type {Map<String,number}
	 */
	_alfnumumeric : {
		NUMBERS_START : 48,
		NUMBERS_END : 57,
		LETTERS_START : 65,
		LETTERS_END: 90
	},

	/**
	 * JSDoc style comment marker.
	 * @type {RegExp}
	 */
	_REX_GUTTER : /^\s+\* +/,

	/**
	 * Regular characters.
	 * @TODO Bring back 0-9 but add a check for ordered list markdown
	 * @type {RegExp}
	 */
	_REX_LETTER : /^[A-Za-z]/,

	/**
	 * Comment to mark a chapter: Single line comment 
	 * with some text followed by at least four dots. 
	 * Chars } and { and , and ; may precede the comment.
	 * @type {RegExp}
	 */
	_REX_CHAPTER : /^[\s|{|}|,|;]*\/\/\s*[A-Za-z0-9 ]*\s*\.{4,}$/,

	/**
	 * Extract chapter title (from regexp above).
	 * @type {RegExp}
	 */
	_REX_TITLE : /[A-Za-z0-9]+ [A-Za-z0-9 ]*/,

	/**
	 * Hello.
	 * @type {RegExp}
	 */
	_REX_HELLO : /^[\s|{|}|,|;]*/

});
/**
 * Spirit of the MAIN element.
 */
dox.MainSpirit = gui.Spirit.extend ({

	/**
	 * Get ready.
	 */
	onready : function () {
		this._super.onready ();
		this.life.add ( edb.LIFE_SCRIPT_DID_RUN );
	},

	/**
	 * Insert heading if docs doesn't provide one.
	 * @param {gui.SpiritLife} life
	 */
	onlife : function ( life ) {
		this._super.onlife ( life );
		if ( life.type === edb.LIFE_SCRIPT_DID_RUN ) {
			var desc = this.dom.q ( ".desc" );
			if ( desc && !desc.querySelector ( "h1" )) {
				this._heading ( desc, this._filename ());
			}
		}
	},

	/**
	 * Insert default heading.
	 * @param {HTMLDivElement} desc
	 * @param {String} name
	 */
	_heading : function ( desc, name ) {
		var h1 = this.dom.tag ( "h1", name );
		desc.insertBefore ( h1, desc.firstChild );
	},

	/**
	 * Compute filename.
	 * @returns {String}
	 */
	_filename : function () {
		var hash = this.document.location.hash;
		var cuts = hash.split ( "/" );
		var name = cuts.pop () || "";
		if (( cuts = name.split ( "." )).length ) {
			cuts.pop ();
		}
		return cuts.join ( "." );
	}
	
});
/**
 * Spirit of the element that gets inspired by Prism.js
 * @see http://prismjs.com
 * @extends {gui.Spirit}
 */
dox.PrismSpirit = gui.Spirit.extend ({

	/**
	 * Visible code get's highlighted now while 
	 * unseen code is treated on a timeout. The 
	 * internal async thing in Prism is broken.
	 */
	onenter : function () {
		this._super.onenter ();
		if ( this.box.pageY < this.window.innerHeight ) {
			this._hilite ();
		} else {
			var that = this;
			setTimeout ( function () { // using timeout for now...
				that._hilite ();
			}, 200 );
		}
	},

	/**
	 * Handle tick.
	 * @param {gui.Tick} tick
	 */
	ontick : function ( tick ) {
		this._super.ontick ( tick );
		if ( tick.type === "tick-prism" ) {
			this._hilite ();
			console.log ( this.dom.text ());
		}
	},


	// PRIVATES .............................................

	/**
	 * Highlight code block and apply hotfix.
	 */
	_hilite : function () {
		var code = this.dom.q ( "code" );
		Prism.highlightElement ( code );
		this._hotfix ( code );
	},

	/**
	 * Prism appears to have a regexp dysfunction on 
	 * leading whitespace in the first line of code.
	 * @param {HTMLCodeElement} code
	 */
	_hotfix : function ( code ) {
		var text = code.firstChild;
		if ( text ) {
			text.data = text.data.substring ( 1 ); // we inserted a #
		}
	}

});
/**
 * Spirit of the ASIDE panel.
 * @extends {gui.Spirit}
 */
dox.AsideSpirit = gui.Spirit.extend ({

	/**
	 * Get ready.
	 */
	onready : function () {
		this._super.onready ();
		this.event.add ( "click focusin input" );
	},

	/**
	 * Handle event.
	 * @param {Event} e
	 */
	onevent : function ( e ) {
		this._super.onevent ( e );
		switch ( e.type ) {
			case "click" :
				if ( e.currentTarget === this.document.body ) {
					this._togglefiles ();
				} else {
					e.stopPropagation ();
				}
				break;
			case "focusin" :
				if ( e.target.id === "search" ) {
					if ( !this._filesopen ) {
						this._togglefiles ();
					}
				}
				break;
			case "input" :
				var input = e.target;
				if ( input.id === "search" ) {
					gui.Tick.next ( function () {
						this.script.run ( input.value );
					}, this );
				}
				break;
		}
	},


	// PRIVATES .............................................................

	/**
	 * Files menu open?
	 * @type {boolean}
	 */
	_filesopen : false,

	/**
	 * Toggle files menu.
	 */
	_togglefiles : function () {
		var root = this.dom.q ( "#root" );
		var form = this.dom.q ( "fieldset" );
		var open = ( this._filesopen = !this._filesopen );
		if ( open ) {
			this.css.bottom = 0;
		}
		gui.Tick.next ( function () {
			this.event [ open ? "add" : "remove" ] ( "click", this.document.body );
			root.className = open ? "on" : "off";
			form.className = open ? "on" : "off";
			if ( !open ) {
				var that = this;
				setTimeout ( function () {
					that.css.bottom = "auto";
				}, 50 );
			}
		}, this );
	}

});
/**
 * Spirit of the form.
 * @extends {gui.Spirit}
 */
dox.FormSpirit = gui.Spirit.extend ({

	/**
	 * Layout fixes on startup.
	 */
	onenter : function () {
		this._super.onenter ();
		this.element.action = "javascript:void(0)";
		this._scrollbar ( gui.Client.scrollBarSize );
		this._input = this.dom.q ( "input" );
		this.event.add ( "focusin" );
		this._flexboxerize ( 
			this.dom.q ( "label" ),
			this.dom.q ( "input" )
		);
	},

	/**
	 * Select input on focus.
	 * @param {Event} e
	 */
	onevent : function ( e ) {
		this._super.onevent ( e );
		switch ( e.type ) {
			case "focusin" :
				if ( e.target === this._input ) {
					this._input.select ();
				}
				break;
		}
	},

	/**
	 * Grab file name when location changes.
	 * @param {gui.Broadcast} b
	 *
	onbroadcast : function ( b ) {
		this._super.onbroadcast ( b );
		if ( b.type === gui.BROADCAST_HASHCHANGE ) {
			var hash = document.location.hash;
			var cuts = hash.split ( "/" );
			this._input.value = cuts.pop () || "";
		}
	},
	*/

	// PRIVATES ............................................................
	
	/**
	 * Input element.
	 * @type {HTMLInputElement}
	 */
	_input : null,
	
	/**
	 * Never show two scrollbars.
	 * @param {number} scrollbar Width in pixels
	 */
	_scrollbar : function ( scrollbar ) {
		if ( scrollbar > 0 ) {
			var nextwidth = 320 - scrollbar;
			this.css.right = scrollbar;
			this.css.width = nextwidth;
			this.element.style.clip = "rect(0px," + nextwidth + "px,64px,-20px)";
		}
	},

	/**
	 * 
	 * @param {HTMLInputElement} input
	 */
	_flexboxerize : function ( label, input ) {
		input.style.width = this.box.width - label.offsetWidth - 3 + "px";
	}

});
