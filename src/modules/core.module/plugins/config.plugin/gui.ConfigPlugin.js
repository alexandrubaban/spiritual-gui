/**
 * Configures a spirit by attribute parsing.
 * @extends {gui.Plugin}
 */
gui.ConfigPlugin = gui.Plugin.extend ( "gui.ConfigPlugin", {

	/**
	 * Mapping attribute names to an expanded syntax (eg. "myatt" becomes "my.plugin.att").
	 * @type {Map<String,String>}
	 */
	map : null,

	/**
	 * Invoked by the {gui.Spirit} once all plugins have been plugged in. 
	 * @TODO: Simple props with no setter does nothing when updated now. 
	 * Perhaps it would be possible to somehow configure those *first*?
	 * @TODO Figure out whether or not this should postpone to onenter()
	 */
	configureall : function () {
		var atts = this.spirit.element.attributes;
		Array.forEach ( atts, function ( att ) {
			this.configureone ( att.name, att.value );
		}, this );
	},

	/**
	 * Setup configuration (if applicable) after an attribute update. 
	 * This should probably only ever be invoked by the {gui.AttPlugin}.
	 * @param {String} name
	 * @param {String} value
	 */
	configureone : function ( name, value ) {
		this._evaluate ( this._lookup ( name ), value );
	},


	// Private .................................................................
	
	/**
	 * Evaluate single attribute in search for "gui." prefix.
	 * @param {String} name
	 * @param {String} value
	 */
	_evaluate : function ( name, value ) {
		var prefix = "gui.",
			struct = this.spirit,
			success = true,
			prop = null,
			cuts = null;
		if ( name.startsWith ( prefix )) {
			name = name.split ( prefix )[ 1 ];
			prop = name;
			if ( name.indexOf ( "." ) >-1 ) {
				cuts = name.split ( "." );
				cuts.forEach ( function ( cut, i ) {
					if ( gui.Type.isDefined ( struct )) {
						if ( i < cuts.length - 1 ) {
							struct = struct [ cut ];
						} else {
							prop = cut;
						}
					} else {
						success = false;
					}
				});
			}
			if ( success && gui.Type.isDefined ( struct [ prop ])) {
				// Autocast (string) value to an inferred type.
				// "false" becomes boolean, "23" becomes number.
				value = gui.Type.cast ( value );
				if ( gui.Type.isFunction ( struct [ prop ])) {
					struct [ prop ] ( value );
				} else {
					struct [ prop ] = value;
				}
			} else {
				console.error ( "No definition for \"" + name + "\": " + this.spirit.toString ());
			}
		}
	},

	/**
	 * Lookup mapping for attribute name, eg. "my.nested.complex.prop" 
	 * can be mapped to a simple attribute declaration such as "myprop".
	 * @param {String} name
	 * @returns {String}
	 */
	_lookup : function ( name ) {
		var prefix = "gui.";
		if ( this.map && this.map.hasOwnProperty ( name )) {
			name = this.map [ name ];
			if ( !name.startsWith ( prefix )) {
				name = prefix + name;
			}
		}
		return name;
	}


}, { // Static ...............................................................


	/**
	 * @type {boolean}
	 */
	lazy : false

});