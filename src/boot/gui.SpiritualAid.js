/**
 * @class
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
					// @todo look at element.dataset polyfill (iOS?)
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
		
		this._extend ( win, { // @todo investigate support for Object.getPrototypeOf ( win )
			
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
			
			WeakMap : ( function () { // @todo clean this up
				
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
			 * @todo cancelAnimationFrame!
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