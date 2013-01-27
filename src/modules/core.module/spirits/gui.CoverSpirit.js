 /**
 * # gui.CoverSpirit
 * @extends {gui.Spirit}
 * Spirit of the cover. Use it to cover stuff up. Note that the cover should 
 * be fitted with a background-color in CSS in order to actually cover stuff.
 */
gui.CoverSpirit = gui.Spirit.infuse ( "gui.CoverSpirit", {

	/**
	 * Show the cover.
	 * @returns {gui.CoverSpirit}
	 */
	show : function () {
		this.dom.show ();
		return this;
	},

	/**
	 * Hide the cover.
	 * @returns {gui.CoverSpirit}
	 */
	hide : function () {
		this.dom.hide ();
		return this;
	},

	/**
	 * Show and fade to no opacity.
	 * @todo promises goes here
	 * @param {number} duration in ms
	 * @returns {object} then method
	 */
	fadeIn : function ( duration ) {
		if ( gui.Client.hasTransitions ) {
			this.transition.none ();
			this.css.opacity = 0;
			this.show ();
			this.transition.run ({
				duration : duration || 250,
				property : "opacity",
				opacity : 1
			});
		} else {
			this.show ();
		}
	},

	/**
	 * Fade to full opacity and hide.
	 * @todo promises goes here
	 * @param {number} duration in ms
	 * @returns {Object} then method
	 */
	fadeOut : function ( duration ) {
		if ( gui.Client.hasTransitions ) {
			this.transition.none ();
			this.css.opacity = 1;
			this.show ();
			this.transition.run ({
				duration : duration || 250,
				property : "opacity",
				opacity : 0
			}).then ( function () {
				this.hide();
			}, this );
		} else {
			this.hide ();
		}
	}


}, { 

	// STATICS ............................................................

	/**
	 * Summon spirit.
	 * @param {Document} doc
	 * @returns {gui.CoverSpirit}
	 */
	summon : function ( doc ) {
		var spirit = this.animate ( doc.createElement ( "div" ));
		spirit.css.add ( "gui-cover" );
		return spirit;
	}
});