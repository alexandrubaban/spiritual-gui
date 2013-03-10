/**
 * Tracking DOM events.
 * @todo Throw an error on remove not added!
 * @todo Static interface for general consumption.
 * @extends {gui.Tracker}
 */
gui.EventPlugin = gui.Tracker.extend ( "gui.EventPlugin", {

	/**
	 * Add one or more DOM event handlers.
	 * @todo Don't assume spirit handler
	 * @todo reverse handler and capture args
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
	},


	// PRIVATE ..........................................................

	/**
	 * Remove event listeners.
	 * @overwrites {gui.Tracker#_cleanup}
	 * @param {String} type
	 * @param {Array<object>} checks
	 */
	_cleanup : function ( type, checks ) {
		if ( this._removechecks ( type, checks )) {
			var target = checks [ 0 ];
			var handler = checks [ 1 ];
			var capture = checks [ 2 ];
			target.removeEventListener ( type, handler, capture );
		}
	}

});