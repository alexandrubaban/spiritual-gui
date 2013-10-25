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
	 * @IDEA we'll configure properties onconfigure and call methods onready :)
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
				this.$evaluate ( name, value, fix );
			}
			return !hit;
		}, this );
	},


	// Secrets .................................................................
	
	/**
	 * Evaluate single attribute in search for "gui." prefix.
	 * The string value will be autocast to an inferred type.
	 * "false" becomes a boolean while "23" becomes a number.
	 * Note that the EDB module is *overriding* this method!
	 * @param {String} name
	 * @param {String} value
	 * @param {String} fix
	 */
	$evaluate : function ( name, value, fix ) {
		var struct = this.spirit,
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
			if ( gui.Type.isString ( value )) {
				value = gui.Type.cast ( value );
			}
			if ( gui.Type.isFunction ( struct [ prop ])) {
				struct [ prop ] ( value );
			} else {
				struct [ prop ] = value;
			}
		} else {
			console.error ( "No definition for \"" + name + "\": " + this.spirit.toString ());
			console.error ( struct [ prop ]);
		}
	}

}, { // Static ...............................................................
	
	/**
	 * Run on spirit startup (don't wait for implementation to require it).
	 * @type {boolean}
	 */
	lazy : false

});