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