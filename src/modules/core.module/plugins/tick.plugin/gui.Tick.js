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