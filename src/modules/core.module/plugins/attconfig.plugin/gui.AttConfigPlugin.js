/**
 * Configures a spirit by attribute parsing.
 * @extends {gui.Plugin}
 */
gui.AttConfigPlugin = gui.Plugin.extend ({

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
		var hit, gux = this.spirit.window.gui;
		gux.attributes.every ( function ( fix ) {
			if (( hit = name !== fix && name.startsWith ( fix ))) {
				this._evaluate ( name, value, fix );
			}
			return !hit;
		}, this );
	},


	// Private .................................................................
	
	/**
	 * Evaluate single attribute in search for "gui." prefix.
	 * @param {String} name
	 * @param {String} value
	 */
	_evaluate : function ( name, value, fix ) {
		var todo = this.spirit.window.gui.hasModule ( "edb" );
		if ( todo && value.startsWith ( "edb.get" )) {
			var key = gui.KeyMaster.extractKey ( value )[ 0 ];
			if ( key ) {
				console.error ( "TODO" );
				//alert ( this.spirit.window.edb.get ( key ));
				//value = this.spirit.window.edb.get ( key );
				//alert ( value );
			}
		} else {
			var didconfigure = false,
				struct = this.spirit,
				success = true,
				prop = null,
				cuts = null;
			name = prop = name.split ( fix + "." )[ 1 ];
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
				didconfigure = true;
			} else {
				console.error ( "No definition for \"" + name + "\": " + this.spirit.toString ());
			}

		}
	}

}, { // Static ...............................................................
	
	/**
	 * @type {boolean}
	 */
	lazy : false

});