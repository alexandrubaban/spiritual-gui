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