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
	 * Disable styles.
	 */
	disable : function () {
		this.element.disabled = true;
	},

	/**
	 * Enable styles.
	 */
	enable : function () {
		this.element.disabled = false;
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
		var body = "", plugin = gui.CSSPlugin;
		gui.Object.each ( declarations, function ( property, value ) {
			body += 
				plugin.cssproperty ( property ) + ":" +
				plugin.cssvalue ( value ) + ";";
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
		var elm = href ? this._createlink ( doc, href ) : this._createstyle ( doc );
		var spirit = this.possess ( elm );
		if ( rules ) {
			if ( href ) {
				elm.addEventListener ( "load", function () {
					spirit.addRules ( rules );
				}, false );
			} else {
				spirit._rules = rules;
			}
		}
		if ( disabled ) {
			spirit.disable ();
		}
		return spirit;
	},


	// Private static .................................................

	/**
	 * External styles in LINK element.
	 * @returns {HTMLLinkElement}
	 */
	_createlink : function ( doc, href ) {
		var link = doc.createElement ( "link" );
		link.className = "gui-stylesheet";
		link.rel = "stylesheet";
		link.href = href;
		return link;
	},

	/**
	 * Inline styles in STYLE element.
	 * @returns {HTMLStyleElement}
	 */
	_createstyle : function ( doc ) {
		var style = doc.createElement ( "style" );
		style.className = "gui-stylesheet";
		style.appendChild ( doc.createTextNode ( "" ));
		return style;
	}

});