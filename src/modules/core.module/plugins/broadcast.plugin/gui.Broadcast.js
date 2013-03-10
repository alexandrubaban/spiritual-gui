/**
 * # gui.Broadcast
 * @todo "one" and "oneGlobal" methods...
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
	this.signatures = [];
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
	 * @todo rename "global"
	 * @type {boolean}
	 */
	isGlobal : false,

	/**
	 * Experimental...
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
 * @todo queue for incoming dispatch (finish current message first).
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
 * @todo queue for incoming dispatch (finish current first).
 * @todo Handle remote domain iframes ;)
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
	var b = new gui.Broadcast ( target, type, data, global );
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