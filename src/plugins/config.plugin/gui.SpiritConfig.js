/**
 * Configures a spirit by attribute parsing.
 */
gui.SpiritConfig = gui.SpiritPlugin.extend ( "gui.SpiritConfig", {

	/**
	 * Mapping shorthands to expanded syntax.
	 * @type {Map<String,String>}
	 */
	map : null,

	/**
	 * Configure spirit by DOM attributes.
	 * TODO: reconfigure scenario
	 */
	configure : function () {
		
		this.spirit.att.all ().forEach ( function ( att ) {
			this.attribute ( this._lookup ( att.name ), att.value );
		}, this );
	},
	
	/**
	 * Parse single attribute in search for "gui." prefix
	 * @param {String} name
	 * @param {String} value
	 */
	attribute : function ( name, value ) {
		
		var prefix = "gui.",
			struct = this.spirit,
			success = true,
			prop = null,
			cuts = null;

		if ( name.startsWith ( prefix )) {
			
			name = name.split ( prefix )[ 1 ], prop = name;
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
				
				/*
				 * Autocast (string) value to an inferred type.
				 * "false" becomes boolean, "23" becomes number.
				 */
				value = gui.Type.cast ( value );
				if ( gui.Type.isFunction ( struct [ prop ])) {
					struct [ prop ] ( value );  // isInvocable....
				} else {
					struct [ prop ] = value;
				}
			} else {
				console.error ( "No definition for \"" + name + "\": " + this.spirit.toString ());
			};
		}
	},


	// PRIVATE .................................................................
	
	/**
	 * Lookup mapping for attribute name.
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
});

/*
 * Register plugin.
 */
gui.Spirit.plugin ( "config", gui.SpiritConfig );