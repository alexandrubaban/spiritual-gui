/**
 * Spirit of the stylesheet.
 * @see http://www.quirksmode.org/dom/w3c_css.html
 * @extends {gui.Spirit}
 */
gui.StyleSheetSpirit = gui.Spirit.infuse ( "gui.StyleSheetSpirit", {

	/**
	 * Sheet not accessible before we hit the document.
	 */
	onenter : function () {
		this._super.onenter ();
		if ( this._rules ) {
			this.addRules ( this._rules );
			this._rules = null;
		}
	},

	/**
	 * Add rules (by JSON object for now).
	 * @param {Map<String,object>} rules
	 */
	addRules : function ( rules ) {
		var sheet = this.element.sheet, index = sheet.cssRules.length;
		gui.Object.each ( rules, function ( selector, declarations ) {
			sheet.insertRule( selector + this._ruleout ( declarations ), index ++ );
		}, this );
	},

	// Private .................................................................

	/**
	 * CSS ruleset to evaluate when inserted.
	 * @type {Map<String,object>} declarations
	 */
	_rules : null,

	/**
	 * Convert declarations to rule body.
	 * @param {Map<String,String>} declarations
	 * @return {String}
	 */
	_ruleout : function ( declarations ) {
		var body = ""; 
		gui.Object.each ( declarations, function ( property, value ) {
			if ( property.contains ( "-beta" )) {
				throw new Error ( "TODO: -beta-property" );
			}
			body += property + ":" + value + ";";
		});
		return "{" + body + "}";
	}

}, { // Static .....................................................

	/**
	 * Summon spirit.
	 * @param {Document} doc
	 * @param @optional {String} href
	 * @param @optional {Map<String,object>} rules
	 * @param @optional {boolean} disbled
	 * @returns {gui.StyleSheetSpirit}
	 */
	summon : function ( doc, href, rules, disabled ) {
		var elm = href ? this._link ( doc, href ) : this._style ( doc );
		var spirit = this.possess ( elm );
		elm.className = "gui-stylesheet";
		if ( rules ) {
			if ( href ) {
				elm.addEventListener ( "load", function () {
					spirit.addRules ( rules );
				}, false );
			} else {
				spirit._rules = rules;
			}
		}
		return spirit;
	},


	// Private static .................................................

	/**
	 * @returns {HTMLLinkElement}
	 */
	_link : function ( doc, href ) {
		var link = doc.createElement ( "link" );
		link.rel = "stylesheet";
		link.href = href;
		return link;
	},

	/**
	 * @returns {HTMLStyleElement}
	 */
	_style : function ( doc ) {
		var style = doc.createElement ( "style" );
		style.appendChild ( doc.createTextNode ( "" ));
		return style;
	}

});