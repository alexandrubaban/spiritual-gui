/**
 * # gui.AttPlugin
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
		return gui.Type.cast ( 
			this.spirit.element.getAttribute ( name )
		);
	},

	/**
	 * Set single element attribute (use null to remove).
	 * @param {String} name
	 * @param {String} value
	 * @returns {Spirit}
	 */
	set : function ( name, value ) {
		if ( value === null ) {
			this.del ( name );
		} else if ( !this.__suspended__ ) {
			this.spirit.element.setAttribute ( name, String ( value ));
		}
		return this;
	},

	/**
	 * Element has attribute?
	 * @param {String} att
	 * @returns {boolean}
	 */
	has : function ( name ) {
		return this.spirit.element.getAttribute ( name ) !== null;
	},

	/**
	 * Remove element attribute.
	 * @param {String} att
	 */
	del : function ( name ) {
		if ( !this.__suspended__ ) {
			this.spirit.element.removeAttribute ( name );
		}
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
	getup : function () {
		return gui.AttPlugin.getup ( this.spirit.element );
	},

	/**
	 * Invoke multiple attributes update via hashmap 
	 * argument. Use null value to remove an attribute.
	 * @param {Map<String,String>}
	 */
	setup : function ( map ) {
		gui.Object.each ( map, function ( name, value ) {
			this.set ( name, value );
		}, this );
	},


	// Secret .................................................

	/**
	 * Attribute updates disabled?
	 * @type {boolean}
	 */
	__suspended__ : false,

	/**
	 * Suspend attribute updates for the duration of the action.
	 * @todo Figure out why and if we need this stuff
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
	 * 
	 */
	all : function ( element ) {
		return Array.map ( element.attributes, function ( att ) {
			return att;
		});
	},

	/**
	 *
	 */
	getup : function ( element ) {
		var map = Object.create ( null );
		this.all ( element ).forEach ( function ( att ) {
			map [ att.name ] = gui.Type.cast ( att.value );
		});
		return map;
	}
});