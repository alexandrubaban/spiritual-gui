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
				console.error ( "Array.prototype.remove is deprecated. Use gui.Array.remove(array,from,to);" );
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