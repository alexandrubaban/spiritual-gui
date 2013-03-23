/**
 * Spirit styling studio.
 * @extends {gui.Plugin}
 */
gui.CSSPlugin = gui.Plugin.extend ( "gui.CSSPlugin", {
	
	/**
	 * Set single element.style.
	 * @param {String} prop
	 * @param {String} val
	 * @returns {gui.CSSPlugin}
	 */
	set : function ( prop, val ) {
		gui.CSSPlugin.set ( this.spirit.element, prop, val );
		return this;
	},

	/**
	 * Get single element.style; see also compute method.
	 * @param {String} prop
	 * @returns {String}
	 */
	get : function ( prop ) {
		return gui.CSSPlugin.get ( this.spirit.element, prop );
	},

	/**
	 * Compute runtime style.
	 * @param {String} prop
	 * @returns {String}
	 */
	compute : function ( prop ) {
		return gui.CSSPlugin.compute ( this.spirit.element, prop );
	},

	/**
	 * Set multiple styles via key value map.
	 * @param {Map<String,String>} map
	 * @returns {gui.CSSPlugin}
	 */
	style : function ( map ) {
		gui.CSSPlugin.style ( this.spirit.element, map );
		return this;
	},

	/**
	 * Get or set (full) className.
	 * @param @optional {String} name
	 * @returns {object} gui.Spirit or String
	 */
	name : function ( name ) {
		var result = this.spirit.element.className;
		if ( name !== undefined ) {
			this.spirit.element.className = name;
			result = this.spirit;
		}
		return result;
	},

	/**
	 * classList.add
	 * @param {String} name
	 * @returns {gui.CSSPlugin}
	 */
	add : function ( name ) {
		gui.CSSPlugin.add ( this.spirit.element, name );
		return this;
	},

	/**
	 * classList.remove
	 * @param {String} name
	 * @returns {gui.CSSPlugin}
	 */
	remove : function ( name ) {
		gui.CSSPlugin.remove ( this.spirit.element, name );
		return this;
	},

	/**
	 * classList.toggle
	 * @param {String} name
	 * @returns {gui.CSSPlugin}
	 */
	toggle : function ( name ) {
		gui.CSSPlugin.toggle ( this.spirit.element, name );
		return this;
	},

	/**
	 * classList.contains
	 * @param {String} name
	 * @returns {boolean}
	 */
	contains : function ( name ) {
		return gui.CSSPlugin.contains ( this.spirit.element, name );
	}, 

	/**
	 * Spirit element mathes selector?
	 * @param {String} selector
	 * @returns {boolean}
	 */
	matches : function ( selector ) {
		return gui.CSSPlugin.matches ( this.spirit.element, selector );
	}
	
	
}, {}, {

	 // Static ......................................................................

	 /**
	 * classList.add
	 * @param {Element} element
	 * @param {String} names
	 */
	add : function ( element, name ) {
		if ( name.indexOf ( " " ) >-1 ) {
			name = name.split ( " " );
		}
		if ( gui.Type.isArray ( name )) {
			name.forEach ( function ( n ) {
				this.add ( element, n );
			}, this );
		} else {
			if ( this._supports ) {
				element.classList.add ( name );
			} else {
				var now = element.className.split ( " " );
				if ( now.indexOf ( name ) === -1 ) {
					now.push ( name );
					element.className = now.join ( " " );
				}
			}
		}
	},

	/**
	 * classList.remove
	 * @param {Element} element
	 * @param {String} name
	 * @returns {gui.CSSPlugin}
	 */
	remove : function ( element, name ) {
		if ( name.indexOf ( " " ) >-1 ) {
			name = name.split ( " " );
		}
		if ( gui.Type.isArray ( name )) {
			name.forEach ( function ( n ) {
				this.remove ( element, n );
			}, this );
		} else {
			if ( this._supports ) {
				element.classList.remove ( name );
			} else {
				var now = element.className.split ( " " );
				var idx = now.indexOf ( name );
				if ( idx > -1 ) {
					gui.Array.remove ( now, idx );
				}
				element.className = now.join ( " " );
			}
		}
	},

	/**
	 * classList.toggle
	 * @param {Element} element
	 * @param {String} name
	 * @returns {gui.CSSPlugin}
	 */
	toggle : function ( element, name ) {
		if ( this._supports ) {
			element.classList.toggle ( name );
		} else {
			if ( this.contains ( element, name )) {
				this.remove ( element, name );
			} else {
				this.add ( element, name );
			}
		}
	},

	/**
	 * classList.contains
	 * @param {Element} element
	 * @param {String} name
	 * @returns {boolean}
	 */
	contains : function ( element, name ) {
		var result = false;
		if ( this._supports ) {
			result = element.classList.contains ( name );
		} else {
			var classnames = element.className.split ( " " );
			result = classnames.indexOf ( name ) >-1;
		}
		return result;
	},

	 /**
	 * Set single element.style property (use style() for multiple)
	 * @TODO also automate shorthands such as "10px 20px 10px 20px"
	 * @param {Element}
	 * @param {String} prop
	 * @returns {gui.CSSPlugin}
	 */
	set : function ( element, prop, value ) {
		if ( gui.Type.isNumber ( value )) {
			value = ( this._shorthands [ prop ] || "@" ).replace ( "@", value );
		}
		value = String ( value );
		switch ( prop ) {
			case "float": 
				prop = "cssFloat";
				break;
			default :
				value = this.jsvalue ( value );
				prop = this.jsproperty ( prop );
				break;
		}
		element.style [ prop ] = value;
		return this;
	},

	 /**
	 * @TODO Get element.style property; if this has been set. 
	 * Not to be confused with compute() for computedStyle!!!
	 * @param {Element}
	 * @param {String} prop
	 * @returns {String}
	 */
	get : function ( element, prop ) {
		return this.jsvalue ( element.style [
			this.jsproperty ( prop )
		]);
	},

	/**
	 * Set multiple element.style properties.
	 * @param {object} thing Spirit or element.
	 * @param {Map<String,String>} styles
	 * @returns {object} Spirit or element
	 */
	style : function ( thing, styles ) {
		var element = thing instanceof gui.Spirit ? thing.element : thing;
		gui.Object.each ( styles, function ( prop, value ) {
			this.set ( element, prop, value );
		}, this );
		return thing;
	},

	/**
	 * Compute runtime style.
	 * @param {object} thing Spirit or element.
	 * @param {String} prop
	 * @returns {String}
	 */
	compute : function ( thing, prop ) {
		var element = thing instanceof gui.Spirit ? thing.element : thing;
		var doc = element.ownerDocument, win = doc.defaultView;
		prop = this._standardcase ( this.jsproperty ( prop ));
		return win.getComputedStyle ( element, null ).getPropertyValue ( prop );
	},

	/**
	 * Node matches CSS selector?
	 * @param {Node} node
	 * @param {String} selector
	 * @returns {boolean}
	 */
	matches : function ( node, selector ) {
		return node [ this._matchmethod ]( selector );
	},

	/**
	 * Normalize declaration property for use in element.style scenario.
	 * @param {String} prop
	 * @returns {String}
	 */
	jsproperty : function ( prop ) {
		var vendors = this._vendors, fixt = prop;
		var element = document.documentElement;
		if ( prop.startsWith ( "-beta-" )) {
			vendors.every ( function ( vendor ) {
				var test = this._camelcase ( prop.replace ( "-beta-", vendor ));
				if ( element.style [ test ] !== undefined ) {
					fixt = test;
					return false;
				}
				return true;
			}, this );
		} else {
			fixt = this._camelcase ( fixt );
		}
		return fixt;
	},

	/**
	 * Normalize declaration value for use in element.style scenario.
	 * @param {String} value
	 * @returns {String}
	 */
	jsvalue : function ( value ) {
		var vendors = this._vendors;
		var element = document.documentElement;
		if ( value && value.contains ( "-beta-" )) {
			var parts = [];
			value.split ( ", " ).forEach ( function ( part ) {
				if (( part = part.trim ()).startsWith ( "-beta-" )) {
					vendors.every ( function ( vendor ) {
						var test = this._camelcase ( part.replace ( "-beta-", vendor ));
						if ( element.style [ test ] !== undefined ) {
							parts.push ( part.replace ( "-beta-", vendor ));
							return false;
						}
						return true;
					 }, this );		
				} else {
					parts.push ( part );
				}
			}, this );
			value = parts.join ( "," );
		}
		return value;
	},

	/**
	 * Normalize declaration property for use in CSS text.
	 * @param {String} prop
	 * @returns {String}
	 */
	cssproperty : function ( prop ) {
		return this._standardcase ( this.jsproperty ( prop ));
	},

	/**
	 * Normalize declaration value for use in CSS text.
	 * @param {String} prop
	 * @returns {String}
	 */
	cssvalue : function ( value ) {
		return this._standardcase ( this.jsvalue ( value ));
	},
	

	// Private statics ...................................................................... 

	 /**
	 * Non-matching vendors removed after first run. First entry 
	 * gets to stay since it represents the unprefixed property.
	 * @type {Array<String>}
	 */
	_vendors : [ "", "-webkit-", "-moz-", "-ms-", "-o-" ],

	/**
	 * _supports Element.classList?
	 * @type {boolean}
	 */
	_supports : document.documentElement.classList !== undefined,

	/**
	 * CamelCase string.
	 * @param {String} string
	 * @returns {String}
	 */
	_camelcase : function ( string ) {
		return string.replace ( /-([a-z])/ig, function ( all, letter ) {
			return letter.toUpperCase();
		});
	},

	/**
	 * standard-css-notate CamelCased string.
	 * @param {String} string
	 * @returns {String}
	 */
	_standardcase : function ( string ) {
		return string.replace ( /[A-Z]/g, function ( all, letter ) {
			return "-" + string.charAt ( letter ).toLowerCase ();
		});
	},	

	/**
	 * Setter shorthands will autosuffix properties that require units 
	 * in support of the syntax: this.css.width = 300;  * no method()
	 * @TODO add tons of things to this list
	 * @type {Map<String,String>
	 */
	_shorthands : {
		top : "@px",
		right : "@px",
		bottom : "@px",
		left : "@px",
		width	: "@px",
		height : "@px",
		maxWidth : "@px",
		maxHeight : "@px",
		minWidth : "@px",
		minHeight : "@px",
		textIndent : "@px",
		fontWeight : "@",
		opacity : "@",
		zIndex : "@",
		position : "@",
		display : "@",
		visibility : "@"
	},

	// /**
	//  * Normalize declaration value.
	//  * @param {String} value
	//  * @returns {value}
	//  */
	// _normval : function ( element, value ) {
	// 	var vendors = this._vendors;
	// 	if ( value && value.contains ( "-beta-" )) {
	// 		var parts = [];
	// 		value.split ( ", " ).forEach ( function ( part ) {
	// 			if (( part = part.trim ()).startsWith ( "-beta-" )) {
	// 				vendors.every ( function ( vendor ) {
	// 					var test = this._camelcase ( part.replace ( "-beta-", vendor ));
	// 					if ( element.style [ test ] !== undefined ) {
	// 						parts.push ( part.replace ( "-beta-", vendor ));
	// 						return false;
	// 					}
	// 					return true;
	// 				 }, this );		
	// 			} else {
	// 				parts.push ( part );
	// 			}
	// 		}, this );
	// 		value = parts.join ( "," );
	// 	}
	// 	return value;
	// },

	// /**
	//  * Normalize declaration property.
	//  * @param {Element} element
	//  * @param {String} prop
	//  * @returns {String}
	//  */
	// _normprop : function ( element, prop ) {
	// 	var vendors = this._vendors, fixt = prop;
	// 	if ( true ) {
	// 		if ( prop.startsWith ( "-beta-" )) {
	// 			vendors.every ( function ( vendor ) {
	// 				var test = this._camelcase ( prop.replace ( "-beta-", vendor ));
	// 				if ( element.style [ test ] !== undefined ) {
	// 					fixt = test;
	// 					return false;
	// 				}
	// 				return true;
	// 			}, this );
	// 		} else {
	// 			fixt = this._camelcase ( fixt );
	// 		}
	// 	}
	// 	return fixt;
	// },

	/**
	 * Lookup vendors "matchesSelector" method.
	 * @type {String} 
	 */
	_matchmethod : ( function () {
		var match = null, root = document.documentElement;
		[ 
			"mozMatchesSelector", 
			"webkitMatchesSelector", 
			"msMatchesSelector", 
			"oMatchesSelector", 
			"matchesSelector" 
		].every ( function ( method ) {
			if ( gui.Type.isDefined ( root [ method ])) {
				match = method;
			}
			return match === null;
		});
		return match;
	})()
	
});

/**
 * Generate shorthand getters/setters for top|left|width|height etc.
 */
( function shorthands () {
	function getset ( prop ) {
		Object.defineProperty ( gui.CSSPlugin.prototype, prop, {
			enumerable : true,
			configurable : true,
			get : function get () {
				return parseInt ( this.get ( prop ), 10 );
			},
			set : function set ( val ) {
				this.set ( prop, val );
			}
		});
	}
	var shorts = gui.CSSPlugin._shorthands;
	for ( var prop in shorts ) {
		if ( shorts.hasOwnProperty ( prop )) {
			getset ( prop );
		}
	}
})();