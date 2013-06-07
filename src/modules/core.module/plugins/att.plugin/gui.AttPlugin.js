/**
 * Methods to read and write DOM attributes.
 * @extends {gui.Tracker}
 *  @using {gui.Arguments.confirmed}
 * @using {gui.Combo.chained}
 */
gui.AttPlugin = ( function using ( confirmed, chained ) {

	return gui.Tracker.extend ( "gui.AttPlugin", {

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
		 * Lookup handler for attribute update.
		 * @param {String} name
		 * @param {String} value
		 */
		$onatt : function ( name, value ) {
			var list, att, handler;
			if ( name.startsWith ( gui.AttConfigPlugin.PREFIX )) {
				this.spirit.attconfig.configureone ( name, value );
			} else {
				if (( list = this._xxx [ name ])) {
					att = new gui.Att ( name, value );
					list.forEach ( function ( checks ) {
						handler = checks [ 0 ];
						handler.onatt ( att );
					}, this );
				}
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
			if ( value === null ) {
				this.del ( elm, name );
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