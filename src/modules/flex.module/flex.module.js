/**
 * Flex module.
 */
gui.module ( "flex", {

	/**
	 * Emulated ruleset.
	 */
	_RULESET_EMULATED : {
		"flexbox" : {
			"display" : "block"
		},
		".flexbox.vertical > *" : {
			"display" : "block"
		},
		".flexbox:not(.vertical)" : {
			"display" : "table",
			"width" : "100%"
		},
		".flexbox:not(.vertical) > *" : {
			"display" : "table-cell"
		}
	},

	/**
	 * Native ruleset.
	 */
	_RULESET_NATIVE : ( function ( flex ) {
		var rules = {
			".flexbox" : {
				"height" : "100%",
				"width": "100%",
				"display": "-beta-flex",
				"-beta-flex-direction" : "row",
				"-beta-flex-wrap" : "nowrap"
			},
			".flexbox.vertical" : {
				"-beta-flex-direction" : "column"
			},
			".flex, .flexbox > *" : {
				"-beta-flex" : "1 0 auto",
				"height" : "auto"
			}
		};
		while ( ++flex <= 23 ) {
			rules [ ".flex" + flex ] = {
				"-beta-flex" : flex + " 0 auto"
			};
		}
		return rules;
	}( 0 )),

	/** 
	 * Assign FlexPlugin to the "flex" prefix.
	 * All spirits may now trigger reflexes.
	 */
	plugins : {
		flex : gui.FlexPlugin
	},

	/**
	 * @param {Window} context
	 */
	init : function ( context ) {
		var doc = context.document, rules = this._RULESET_EMULATED;
		var stylesheet = gui.StyleSheetSpirit.summon ( doc, null, rules );
		doc.querySelector ( "head" ).appendChild ( stylesheet.element );

		/*
		alert ( context.gui.hasModule ( "edb" ));
		if ( context.gui.hasModule ( "edb" )) {
			alert("HEIL");
		}
		*/

		// @TODO standard for this...
		gui.Broadcast.addGlobal ( gui.BROADCAST_DID_SPIRITUALIZE, {
			onbroadcast : function ( b ) {
				if ( b.data === context.gui.signature ) {
					if ( context.gui.hasModule ( "edb" )) {

						var proto = edb.ScriptPlugin.prototype;
						if ( !proto.__flexoverloaded__ ) { // Mein Gott...........
							proto.__flexoverloaded__ = true; 

							var combo = gui.Combo.after ( function () {
								if ( this.spirit.window.gui.flexmode === "emulated" ) {
									this.spirit.flex.reflex ();
								}
							});

							var base = proto.write;
							proto.write = combo ( function () {
								return base.apply ( this, arguments );
							});

						}
					}
				}
			}
		});
	}
	
});

/**
 * Mixin global reflex method that flexes everything (at least on startup).
 * @TODO reflex on startup by default...
 * @TODO nicer interface for this kind of thing
 */
( function defaultsettings () {
	gui.mixin ( "flexmode", "emulated" );
	gui.mixin ( "reflex", function () {
		var node = this.document;
		var html = node.documentElement;
		var root = html.spirit;
		if ( this.flexmode === "emulated" ) {
			root.flex.reflex ( node.body );
		}
	});
}());