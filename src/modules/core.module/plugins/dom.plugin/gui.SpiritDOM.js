/**
 * # gui.SpiritDOM
 * DOM query and manipulation.
 * @extends {gui.SpiritPlugin}
 * @todo implement missing stuff
 * @todo performance for all this
 */
gui.SpiritDOM = gui.SpiritPlugin.extend ( "gui.SpiritDOM", {

	/**
	 * Get or set element id.
	 * @param @optional {String} id
	 * @returns {object} String or gui.Spirit
	 */
	id : function ( id ) {	
		var res = this;
		if ( id !== undefined ) {
			this.spirit.element.id = id;
		} else {
			id = this.spirit.element.id;
			res = id ? id : null;
		}
		return res;
	},
 
	/**
	 * Get spirit element tagname or create an element of given tagname.
	 * @param {String} name If present, create an element
	 * @param @optional {String} namespace (TODO)
	 */
	tag : function ( name ) {
		var res = null;
		if ( name ) {
			res = this.spirit.document.createElement ( name );
		} else {
			res = this.spirit.element.localName;
		}
		return res;
	},

	/**
	 * Get or set element title (tooltip).
	 * @param @optional {String} title
	 * @returns {String}
	 */
	title : function ( title ) {
		var element = this.spirit.element;
		if ( gui.Type.isDefined ( title )) {
			element.title = title ? title : "";
		}
		return element.title;
	},

	/**
	 * Is positioned in page DOM? Otherwise plausible 
	 * createElement or documentFragment scenario.
	 * @returns {boolean}
	 */
	embedded : function () {
		return gui.SpiritDOM.embedded ( this.spirit.element );
	},

	/**
	 * Get or set element markup.
	 * @param @optional {String} html
	 * @param @optional {String} position Insert adjecant HTML
	 * @returns {object} String or gui.Spirit (returns the spirit when setting)
	 */
	html : function ( html, position ) {
		var res = this.spirit, element = res.element;
		if ( gui.Type.isString ( html )) {
			if ( position ) {
				element.insertAdjacentHTML ( position, html ); // @todo spiritualize this :)
			} else {
				gui.SpiritDOM.html ( element, html );
			}			
		} else {
			res = element.innerHTML;
		}
		return res;
	},

	/**
	 * Empty spirit subtree.
	 * @returns {gui.Spirit}
	 */
	empty : function () {
		return this.html ( "" );
	},

	/**
	 * Get or set element textContent.
	 * @param @optional {String} text
	 * @returns {object} String or gui.Spirit
	 */
	text : function ( text ) {
		var elm = this.spirit.element;
		if ( gui.Type.isString ( text )) {
			elm.textContent = text;
		}
		return elm.textContent;
	},

	/**
	 * Clone spirit element.
	 * @return {Element}
	 */
	clone : function () {
		return this.spirit.element.cloneNode ( true );
	},
	
	
	// Visibility ...................................................................

	/**
	 * Show spirit element, recursively informing descendants.
	 */
	show : function () {
		this.spirit.css.remove("_gui-invisible");
		this.spirit.visible ();
	},

	/**
	 * Hide spirit element, recursively informing descendants.
	 */
	hide : function () {
		this.spirit.css.add("_gui-invisible");
		this.spirit.invisible ();
	},	
	
	// PRIVATES .....................................................................

	/**
	 * @todo Explain custom "this" keyword in selector.
	 * @param {String} selector
	 * @returns {String}
	 */
	_qualify : function ( selector ) {
		return gui.SpiritDOM._qualify ( selector, this.spirit.element );
	}
	
	
}, {}, { // STATICS ...............................................................

	/**
	 * Match custom "this" keyword in CSS selector. We use this to start 
	 * selector expressions with "this>*" to find immediate child, but 
	 * maybe we should look into the spec for something instead. The goal 
	 * here is to the make lookup indenpendant of spirit.element tagname.
	 * @type {RegExp}
	 */
	_thiskeyword : /^this|,this/g, // /^this\W|,this\W|^this$/g

	/**
	 * Spiritual-aware innerHTML with special setup for WebKit.
	 * Parse markup to node(s)
	 * Detach spirits and remove old nodes
	 * Append new nodes and attach spirits
	 * @param {Element} element
	 * @param @optional {String} markup
	 */
	html : function ( element, markup ) {
		var guide = gui.Guide;
		if ( element.nodeType === Node.ELEMENT_NODE ) {
			if ( gui.Type.isString ( markup )) {
				var nodes = new gui.HTMLParser ( 
					element.ownerDocument 
				).parse ( markup, element );
				guide.detachSub ( element );
				guide.suspend ( function () {
					gui.Observer.suspend ( element, function () {
						while ( element.firstChild ) {
							element.removeChild ( element.firstChild );
						}
						nodes.forEach ( function ( node ) {
							element.appendChild ( node );
						});
					});
				});
				guide.attachSub ( element );
			}
		} else {
			// throw new TypeError ();
		}
		return element.innerHTML; // @todo skip this step on setter
	},

	/**
	 * Spiritual-aware outerHTML, special setup for WebKit.
	 * @todo can outerHTML carry multiple nodes???
	 * @param {Element} element
	 * @param @optional {String} markup
	 */
	outerHtml : function ( element, markup ) {
		var res = element.outerHTML;
		var guide = gui.Guide;
		if ( element.nodeType ) {
			if ( gui.Type.isString ( markup )) {
				var nodes = new gui.HTMLParser ( 
					element.ownerDocument 
				).parse ( markup, element );
				var parent = element.parentNode;
				guide.detach ( element );
				guide.suspend ( function () {
					gui.Observer.suspend ( parent, function () {
						while ( nodes.length ) {
							parent.insertBefore ( nodes.pop (), element );
						}
						parent.removeChild ( element );
					});
				});
				guide.attachSub ( parent ); // @todo optimize
				res = element; // bad API design goes here...
			}
		} else {
			throw new TypeError ();
		}
		return res; // @todo skip this step on setter
	},

	/**
	 * Get ordinal position of element within container.
	 * @param {Element} element
	 * @returns {number}
	 */
	ordinal : function ( element ) {
		var result = 0; 
		var node = element.parentNode.firstElementChild;
		while ( node !== null ) {
			if ( node === element ) {
				break;
			} else {
				node = node.nextElementSibling;
				result ++;
			}
		}
		return result;
	},

	/**
	 * Is node in found in page DOM? Otherwise probable createElement scenario.
	 * @todo comprehend https://developer.mozilla.org/en/JavaScript/Reference/Operators/Bitwise_Operators#Example:_Flags_and_bitmasks
	 * @param {Element} element
	 * @returns {boolean}
	 */
	embedded : function ( node ) {
		node = node instanceof gui.Spirit ? node.element : node;
		var check = Node.DOCUMENT_POSITION_CONTAINS + Node.DOCUMENT_POSITION_PRECEDING;
		return node.compareDocumentPosition ( node.ownerDocument ) === check;
	},

	/**
	 * Get list of all elements that matches a selector.
	 * Optional type argument filters to spirits of type.
	 * @param {Node} node
	 * @param {String} selector
	 * @param @optional {function} type
	 * @returns {Array<object>} List of Element or gui.Spirit
	 */
	qall : function ( node, selector, type ) {
		selector = gui.SpiritDOM._qualify ( selector, node );
		var result = gui.Type.list ( node.querySelectorAll ( selector ));
		if ( type ) {
			result = result.filter ( function ( el )  {
				return el.spirit && el.spirit instanceof type;
			}).map ( function ( el ) {
				return el.spirit;
			});
		}
		return result;
	},

	/**
	 * Replace proprietary "this" keyword in CSS selector with element nodename.
	 * @todo There was something about a "scope" or similar keyword in CSS4??? 
	 * @param {String} selector
	 * @param {Node} node
	 * @returns {String}
	 */
	_qualify : function ( selector, node ) {
		var result = selector.trim ();
		switch ( node.nodeType ) {
			case Node.ELEMENT_NODE :
				result = selector.replace ( gui.SpiritDOM._thiskeyword, node.localName );
				break;
			case Node.DOCUMENT_NODE :
				// @todo use ":root" for something?
				break;
		}
		return result;
	}
		
});


// GENERATED METHODS ........................................................................

/**
 * CSS query methods accept a CSS selector and an optional spirit constructor 
 * as arguments. They return a spirit, an element or an array of either.
 */
gui.Object.each ({

	/**
	 * Get first descendant element matching selector. Optional type argument returns 
	 * spirit for first element to be associated to spirit of this type. Note that 
	 * this may not be the first element to match the selector. Also note that type 
	 * performs slower than betting on <code>this.dom.q ( "tagname" ).spirit</code>
	 * @param {String} selector
	 * @param @optional {function} type Spirit constructor (eg. gui.Spirit)
	 * @returns {object} Element or gui.Spirit
	 */
	q : function ( selector, type ) {	
		var result = null;
		selector = this._qualify ( selector );
		if ( type ) {
			result = this.qall ( selector, type )[ 0 ] || null;
		} else {
			result = this.spirit.element.querySelector ( selector );
		}
		return result;
	},

	/**
	 * Get list of all descendant elements that matches a selector. Optional type  
	 * arguments returns instead all associated spirits to match the given type.
	 * @param {String} selector
	 * @param @optional {function} type Spirit constructor
	 * @returns {Array<object>} List of Element or gui.Spirit
	 */
	qall : function ( selector, type ) {
		selector = this._qualify ( selector );
		return gui.SpiritDOM.qall ( this.spirit.element, selector, type );
	},

	/**
	 * Same as q, but scoped from the document root. Use wisely.
	 * @param {String} selector
	 * @param @optional {function} type Spirit constructor
	 * @returns {object} Element or gui.Spirit
	 */
	qdoc : function ( selector, type ) {
		var root = this.spirit.document.documentElement;
		return root.spirit.dom.q.apply ( root.spirit.dom, arguments );
	},

	/**
	 * Same as qall, but scoped from the document root. Use wisely.
	 * @param {String} selector
	 * @param @optional {function} type Spirit constructor
	 * @returns {Array<object>} List of Element or gui.Spirit
	 */
	qdocall : function ( selector, type ) {
		var root = this.spirit.document.documentElement;
		return root.spirit.dom.qall.apply ( root.spirit.dom, arguments );
	}

	/**
	 * Adding methods to gui.SpiritDOM.prototype
	 * @param {String} name
	 * @param {function} method
	 */
}, function addin ( name, method ) {
	gui.SpiritDOM.addin ( name, function () {
		var selector = arguments [ 0 ], type = arguments [ 1 ];
		if ( gui.Type.isString ( selector )) {
			if ( arguments.length === 1 || gui.Type.isFunction ( type )) {
				return method.apply ( this, arguments );
			} else {
				type = gui.Type.of ( type );
				throw new TypeError ( "Unknown spirit for query: " + name + "(" + selector + "," + type + ")" );
			}
		} else {
			throw new TypeError ( "Bad selector for query: " + name + "(" + selector + ")" );
		}
	});
});

/**
 * DOM navigation methods accept an optional spirit constructor as 
 * argument. They return a spirit, an element or an array of either.
 */
gui.Object.each ({

	/**
	 * Next element or next spirit of given type.
	 * @param @optional {function} type Spirit constructor
	 * @returns {Element|gui.Spirit}
	 */
	next : function ( type ) {	
		var result = null, 
			spirit = null,
			el = this.spirit.element;
		if ( type ) {
			while (( el = el.nextElementSibling ) !== null ) {
				spirit = el.spirit;
				if ( spirit !== null && spirit instanceof type ) {
					result = spirit;
					break;
				}
			}
		} else {
			result = el.nextElementSibling;
		}
		return result;
	},

	/**
	 * Previous element or previous spirit of given type.
	 * @param @optional {function} type
	 * @returns {Element|gui.Spirit}
	 */
	previous : function ( type ) {
		var result = null,
			spirit = null,
			el = this.spirit.element;
		if ( type ) {
			while (( el = el.previousElementSibling ) !== null ) {
				spirit = el.spirit;
				if ( spirit !== null && spirit instanceof type ) {
					result = spirit;
					break;
				}
			}
		} else {
			result = el.previousElementSibling;
		}
		return result;
	},

	/**
	 * Hello.
	 * @param {function} type
	 * @returns {Element|gui.Spirit}
	 */
	first : function ( type ) {
		var result = null,
			spirit = null,
			el = this.spirit.element.firstElementChild;
		if ( type ) {
			while ( result === null && el !== null ) {
				spirit = el.spirit;
				if ( spirit !== null && spirit instanceof type ) {
					result = spirit;
				}
				el = el.nextElementSibling;
			}
		} else {
			result = el; 
		}
		return result;
	},

	/**
	 * Hello.
	 * @param {function} type
	 * @returns {Element|gui.Spirit}
	 */
	last : function ( type ) {
		var result = null,
			spirit = null,
			el = this.spirit.element.lastElementChild;
		if ( type ) {
			while ( result === null && el !== null ) {
				spirit = el.spirit;
				if ( spirit !== null && spirit instanceof type ) {
					result = spirit;
				}
				el = el.previoustElementSibling;
			}
		} else {
			result = el; 
		}
		return result;
	},

	/**
	 * Hello.
	 * @param {function} type
	 * @returns {Element|gui.Spirit}
	 */
	parent : function ( type ) {
		var result = this.spirit.element.parentNode;
		if ( type ) {
			var spirit = result.spirit;
			if ( spirit && spirit instanceof type ) {
				result = spirit;
			} else {
				result = null;
			}
		}
		return result;
	},

	/**
	 * Hello.
	 * @param {function} type
	 * @returns {Element|gui.Spirit}
	 */
	child : function ( type ) {
		var result = null,
			spirit = null,
			el = this.spirit.element.firstElementChild;
		if ( el && type ) {
			while ( el !== null && result === null ) {
				spirit = el.spirit;
				if ( spirit && spirit instanceof type ) {
					result = spirit;
				}
				el = el.nextElementSibling;
			}
		} else {
			result = el;
		}
		return result;
	},

	/**
	 * @todo just use this.element.children :)
	 * @param {function} type
	 * @returns {Array<Element|gui.Spirit>}
	 */
	children : function ( type ) {
		var result = [],
			me = this.spirit.element,
			el = me.firstElementChild;
		if ( el ) {
			while ( el !== null ) {
				result.push ( el );
				el = el.nextElementSibling; 
			}
			if ( type ) {
				result = result.filter ( function ( el )  {
					return el.spirit && el.spirit instanceof type;
				}).map ( function ( el ) {
					return el.spirit;
				});
			}
		}
		return result;
	},

	/**
	 * First ancestor of given type.
	 * @param {function} type
	 * @returns {Element|gui.Spirit}
	 */
	ancestor : function ( type ) {
		var result = this.parent ();
		if ( type ) {
			result = null;
			new gui.Crawler ().ascend ( this.spirit.element, {
				handleSpirit : function ( spirit ) {
					if ( spirit instanceof type ) {
						result = spirit;
						return gui.Crawler.STOP;
					}
				}
			});
		}
		return result;
	},

	/**
	 * All ancestors of given type.
	 * @param {function} type
	 * @returns {Array<Element|gui.Spirit>}
	 */
	ancestors : function ( type ) {
		var result = [];
		var crawler = new gui.Crawler ();
		if ( type ) {	
			crawler.ascend ( this.element, {
				handleSpirit : function ( spirit ) {
					if ( spirit instanceof type ) {
						result.push ( spirit );
					}
				}
			});
		} else {
			crawler.ascend ( this.element, {
				handleElement : function ( el ) {
					result.push ( el );
				}
			});
		}
		return result;
	},

	/**
	 * First descendant of given type.
	 * @param {function} type
	 * @returns {Element|gui.Spirit}
	 */
	descendant : function ( type ) {
		var result = this.child ();
		var me = this.spirit.element;
		if ( type ) {
			new gui.Crawler ().descend ( me, {
				handleSpirit : function ( spirit ) {
					if ( spirit instanceof type ) {
						if ( spirit.element !== me ) {
							result = spirit;
							return gui.Crawler.STOP;
						}
					}
				}
			});
		}
		return result;
	},

	/**
	 * Descendants of given type.
	 * @param {function} type
	 * @returns {Array<Element|gui.Spirit>}
	 */
	descendants : function ( type ) {
		var result = [];
		var me = this.spirit.element;
		new gui.Crawler ().descend ( me, {
			handleElement : function ( element ) {
				if ( !type && element !== me ) {
					result.push ( element );
				}
			},
			handleSpirit : function ( spirit ) {
				if ( type && spirit instanceof type ) {
					if ( spirit.element !== me ) {
						result.push ( spirit );
					}
				}
			}
		});
		return result;
	}

	/**
	 * Adding methods to gui.SpiritDOM.prototype
	 * @param {String} name
	 * @param {function} method
	 */
},  function addin ( name, method ) {
	gui.SpiritDOM.addin ( name, function ( type ) {
		if ( !gui.Type.isDefined ( type ) || gui.Type.isFunction ( type )) {
			return method.apply ( this, arguments );
		} else {
			type = gui.Type.of ( type );
			throw new TypeError ( "Unknown spirit for query: " + name + "(" + type + ")" );
		}
	});
});

/**
 * DOM insertion methods accept one argument: one spirit OR one element OR an array of either or both. 
 * The input argument is returned as given. This allows for the following one-liner to be constructed: 
 * this.something = this.dom.append ( gui.SomeThingSpirit.summon ( this.document ));  * imagine 15 more
 */
gui.Object.each ({

	/**
	 * Append spirit OR element OR array of either.
	 * @param {object} things Complicated argument
	 * @returns {object} Returns the argument
	 */
	append : function ( things ) {
		var els = things, element = this.spirit.element;
		els.forEach ( function ( el ) {
			element.appendChild ( el );
		});
	},

	/**
	 * Prepend spirit OR element OR array of either.
	 * @param {object} things Complicated argument
	 * @returns {object} Returns the argument
	 */
	prepend : function ( things ) {
		var els = things, element = this.spirit.element, first = element.firstChild;
		els.reverse ().forEach ( function ( el ) {
			element.insertBefore ( el, first );
		});
	},

	/**
	 * Insert spirit OR element OR array of either before this spirit.
	 * @param {object} things Complicated argument
	 * @returns {object} Returns the argument
	 */
	before : function ( things ) {
		var els = things, target = this.spirit.element, parent = target.parentNode;
		els.reverse ().forEach ( function ( el ) {
			parent.insertBefore ( el, target );
		});
	},

	/**
	 * Insert spirit OR element OR array of either after this spirit.
	 * @param {object} things Complicated argument
	 * @returns {object} Returns the argument
	 */
	after : function ( things ) {
		var els = things, target = this.spirit.element, parent = target.parentNode;
		els.forEach ( function ( el ) {
			parent.insertBefore ( el, target.nextSibling );
		});
	},

	/**
	 * Removing this spirit from it's parent container. Note that this will 
	 * schedule destruction of the spirit unless it gets reinserted somewhere. 
	 * Also note that this method is called on the spirit, not on the parent.
	 * @returns {gui.Spirit}
	 */
	remove : function () {
		var parent = this.spirit.element.parentNode;
		parent.removeChild ( this.spirit.element );
		return this;
	},

	/**
	 * Replace the spirit with something else. This may nuke the spirit.
	 * Note that this method is called on the spirit, not on the parent.
	 * @param {object} things Complicated argument. 
	 * @returns {object} Returns the argument
	 */
	replace : function ( things ) {
		this.after ( things );
		this.remove ();
	}

	/**
	 * Adding methods to gui.SpiritDOM.prototype. These methods come highly overloaded.
	 * 1) convert input to array of one or more elements
	 * 2) confirm array of elements
	 * 3) invoke the method
	 * 4) return the input
	 * @param {String} name
	 * @param {function} method
	 */
}, function addin ( name, method ) {
	gui.SpiritDOM.addin ( name, function ( things ) {
		var elms = Array.map ( gui.Type.list ( things ), function ( thing ) {
			return thing && thing instanceof gui.Spirit ? thing.element : thing;
		});
		if ( elms.every ( function ( elm ) { 
			return gui.Type.isNumber ( elm.nodeType );
		})) {
			method.call ( this, elms );
			return things;
		} else {
			throw new TypeError ( "Bad input for method: " + name + "(" + things + ")" );	
		}
	});
});