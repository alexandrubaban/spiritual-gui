/**
 * Methods to read and write DOM attributes.
 * @extends {gui.Tracker}
 * @using {gui.Combo.chained}
 */
gui.AttPlugin = ( function using ( chained ) {

	return gui.Plugin.extend ( "gui.AttPlugin", {

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
			gui.AttPlugin.has ( this.spirit.element, name );
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
			var res = action.apply ( this, arguments );
			this.$suspended = false;
			return res;
		}

		
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
					elm.setAttribute ( name, value );
					if ( spirit ) {
						spirit.attconfig.configureone ( name, value );
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
			elm.removeAttribute ( name );
			if ( spirit ) {
				spirit.attconfig.configureone ( name, null );
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

}( gui.Combo.chained ));