/**
 * Methods to read and write DOM attributes.
 * @extends {gui.Tracker}
 */
gui.AttPlugin = gui.Plugin.extend ( "gui.AttPlugin", {

	/**
	 * Get single element attribute cast to an inferred type.
	 * @param {String} att
	 * @returns {object} String, boolean or number
	 */
	get : function ( name ) {
		return gui.AttPlugin.get ( this.spirit.element, name );
	},

	/**
	 * Set single element attribute (use null to remove).
	 * @param {String} name
	 * @param {String} value
	 * @returns {gui.AttPlugin}
	 */
	set : function ( name, value ) {
		if ( !this.__suspended__ ) {
			gui.AttPlugin.set ( this.spirit.element, name, value );
		}
		return this;
	},

	/**
	 * Element has attribute?
	 * @param {String} att
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
	del : function ( name ) {
		if ( !this.__suspended__ ) {
			gui.AttPlugin.del ( this.spirit.element, name );
		}
		return this;
	},

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
	__suspended__ : false,

	/**
	 * Suspend attribute updates for the duration of the 
	 * action. This to prevent endless attribute updates
	 * @param {function} action
	 * @retruns {object}
	 */
	__suspend__ : function ( action ) {
		this.__suspended__ = true;
		var res = action.apply ( this, arguments );
		this.__suspended__ = false;
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
	 * @returns {gui.AttPlugin}
	 */
	set : function ( elm, name, value ) {
		if ( value === null ) {
			this.del ( elm, name );
		} else {
			value = String ( value );
			if ( elm.getAttribute ( name ) !== value ) {
				elm.setAttribute ( name, value );
			}
		}
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
	 */
	del : function ( elm, name ) {
		elm.removeAttribute ( name );
	},

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
	 */
	setmap : function ( elm, map) {
		gui.Object.each ( map, function ( name, value ) {
			this.set ( elm, name, value );
		}, this );
	}
});