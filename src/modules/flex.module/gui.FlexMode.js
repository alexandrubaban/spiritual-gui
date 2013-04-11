/**
 * Properties and methods to be mixed into the context-local {gui.Spiritual} instance. 
 * Note to self: Enumerable false is to prevent portalling since this would portal the local setting too.
 */
gui.FlexMode = {
		
	/**
	 * Flexmode accessor. Note that flexmode exposes as either native or emulated (never optimized).
	 */
	flexmode : {
		configurable : true,
		enumerable : false,
		get : function () { 
			var best = gui.Client.hasFlexBox ? gui.FLEXMODE_NATIVE : gui.FLEXMODE_EMULATED;
			return this._flexmode === gui.FLEXMODE_OPTIMIZED ? best : this._flexmode;
		},
		set : function ( next ) { // supports hotswapping for debugging
			this._flexmode = next;
			var best = gui.Client.hasFlexBox ? gui.FLEXMODE_NATIVE : gui.FLEXMODE_EMULATED;
			var mode = next === gui.FLEXMODE_OPTIMIZED ? best : next;
			gui.FlexCSS.load ( this.window, mode );		
			if ( this.document.documentElement.spirit ) { // @todo life cycle markers for gui.Spiritual
				switch ( mode ) {
					case gui.FLEXMODE_EMULATED :
						this.reflex ();
						break;
					case gui.FLEXMODE_NATIVE :
						this.unflex ();
						break;
				}
			}
		}
	},

	/**
	 * Update flex in emulated mode.
	 * @todo unflexxx
	 */
	reflex : {
		configurable : true,
		enumerable : false,
		value : function ( elm ) {
			if ( this.flexmode === this.FLEXMODE_EMULATED ) {
				gui.FlexPlugin.reflex ( elm || this.document.body );
			}
		}
	},
	
	/**
	 * Remove *all* inline styles from flexbox and member elements.
	 * @todo Rename this to something flex-related.
	 */
	unflex : {
		configurable : true,
		enumerable : false,
		value : function () {
			var node = this.document;
			var body = node.body;
			var root = node.documentElement;
			( body.spirit || root.spirit ).flex.unflex ();
		}
	}
};