/**
 * DOM query and manipulation.
 * @TODO implement missing stuff
 * @TODO performance for all this
 * @using {gui.Combo#chained}
 */
( function using ( chained ) {

	/**
	 * @extends {gui.Plugin}
	 */
	gui.DOMPlugin = gui.Plugin.extend ( "gui.DOMPlugin", {

		/**
		 * Set or get element id.
		 * @param @optional {String} id
		 * @returns {String|gui.DOMPlugin}
		 */
		id : chained ( function ( id ) {
			if ( id ) {
				this.spirit.element.id = id;
			} else {
				return this.spirit.element.id || null;
			}
		}),
	 
		/**
		 * Get spirit element tagname or create an element of given tagname. 
		 * @param @optional {String} name If present, create an element
		 * @param @optional {String} text If present, also append a text node
		 * @TODO Third argument for namespace? Investigate general XML-ness.
		 */
		tag : function ( name, text ) {
			var res = null;
			var doc = this.spirit.document;
			var elm = this.spirit.element;
			if ( name ) {
				res = doc.createElement ( name );

				// @TODO "text" > "child" and let gui.DOMPlugin handle the rest....
				if ( gui.Type.isString ( text )) {
					res.appendChild ( 
						doc.createTextNode ( text )
					);
				}
			} else {
				res = elm.localName;
			}
			return res;
		},

		/**
		 * Get or set element title (tooltip).
		 * @param @optional {String} title
		 * @returns {String|gui.DOMPlugin}
		 */
		title : chained ( function ( title ) {
			var element = this.spirit.element;
			if ( gui.Type.isDefined ( title )) {
				element.title = title ? title : "";
			} else {
				return element.title;
			}
		}),

		/**
		 * Is positioned in page DOM? Otherwise plausible 
		 * createElement or documentFragment scenario.
		 * @returns {boolean}
		 */
		embedded : function () {
			return gui.DOMPlugin.embedded ( this.spirit.element );
		},

		/**
		 * Get or set element markup.
		 * @param @optional {String} html
		 * @param @optional {String} position Insert adjecant HTML
		 * @returns {String|gui.DOMPlugin}
		 */
		html : chained ( function ( html, position ) {
			var element = this.spirit.element;
			if ( gui.Type.isString ( html )) {
				if ( position ) {
					element.insertAdjacentHTML ( position, html ); // @TODO static + spiritualize!
				} else {
					gui.DOMPlugin.html ( element, html );
				}			
			} else {
				return element.innerHTML;
			}
		}),

		/**
		 * Empty spirit subtree.
		 * @returns {gui.DOMPlugin}
		 */
		empty : chained ( function () {
			this.html ( "" );
		}),

		/**
		 * Get or set element textContent.
		 * @param @optional {String} text
		 * @returns {String|gui.DOMPlugin}
		 */
		text : chained ( function ( text ) {
			var elm = this.spirit.element;
			if ( gui.Type.isString ( text )) {
				elm.textContent = text;
				return this;
			}
			return elm.textContent;
		}),

		/**
		 * Clone spirit element.
		 * @return {Element}
		 */
		clone : function () {
			return this.spirit.element.cloneNode ( true );
		},

		/**
		 * Show spirit element, recursively informing descendants.
		 * @returns {gui.DOMPlugin}
		 */
		show : chained ( function () {
			this.spirit.css.remove("_gui-invisible");
			this.spirit.visible ();
		}),

		/**
		 * Hide spirit element, recursively informing descendants.
		 * @returns {gui.DOMPlugin}
		 */
		hide : chained ( function () {
			this.spirit.css.add("_gui-invisible");
			this.spirit.invisible ();
		}),
		
		
		// Private .....................................................................

		/**
		 * @TODO Explain custom `this` keyword in selector.
		 * @param {String} selector
		 * @returns {String}
		 */
		_qualify : function ( selector ) {
			return gui.DOMPlugin._qualify ( selector, this.spirit.element );
		}
		
		
	}, {}, { // Static ...............................................................

		/**
		 * Match custom "this" keyword in CSS selector. We use this to start 
		 * selector expressions with "this>*" to find immediate child, but 
		 * maybe we should look into the spec for something instead. The goal 
		 * here is to the make lookup indenpendant of the spirits tagname.
		 * @type {RegExp}
		 */
		_thiskeyword : /^this|,this/g, // /^this\W|,this\W|^this$/g

		/**
		 * Spiritual-aware innerHTML with special setup for WebKit.
		 * Parse markup to node(s)
		 * Detach spirits and remove old nodes
		 * Append new nodes and spiritualize spirits
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
					guide.materializeSub ( element );
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
					guide.spiritualizeSub ( element );
				}
			} else {
				// throw new TypeError ();
			}
			return element.innerHTML; // @TODO skip this step on setter
		},

		/**
		 * Spiritual-aware outerHTML, special setup for WebKit.
		 * @TODO can outerHTML carry multiple nodes???
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
					guide.materialize ( element );
					guide.suspend ( function () {
						gui.Observer.suspend ( parent, function () {
							while ( nodes.length ) {
								parent.insertBefore ( nodes.pop (), element );
							}
							parent.removeChild ( element );
						});
					});
					guide.spiritualizeSub ( parent ); // @TODO optimize
					res = element; // bad API design goes here...
				}
			} else {
				throw new TypeError ();
			}
			return res; // @TODO skip this step on setter
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
		 * @TODO comprehend https://developer.mozilla.org/en/JavaScript/Reference/Operators/Bitwise_Operators#Example:_Flags_and_bitmasks
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
			selector = gui.DOMPlugin._qualify ( selector, node );
			var result = gui.Array.toArray ( node.querySelectorAll ( selector ));
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
		 * @TODO There was something about a "scope" or similar keyword in CSS4??? 
		 * @param {String} selector
		 * @param {Node} node
		 * @returns {String}
		 */
		_qualify : function ( selector, node ) {
			var result = selector.trim ();
			switch ( node.nodeType ) {
				case Node.ELEMENT_NODE :
					result = selector.replace ( gui.DOMPlugin._thiskeyword, node.localName );
					break;
				case Node.DOCUMENT_NODE :
					// @TODO use ":root" for something?
					break;
			}
			return result;
		}
			
	});


	/**
	 * DOM query methods accept a CSS selector and an optional spirit constructor 
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
		 * @returns {Element|gui.Spirit}
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
		 * @returns {Array<Element|gui.Spirit>}
		 */
		qall : function ( selector, type ) {
			selector = this._qualify ( selector );
			return gui.DOMPlugin.qall ( this.spirit.element, selector, type );
		},

		/**
		 * Same as q, but scoped from the document root. Use wisely.
		 * @param {String} selector
		 * @param @optional {function} type Spirit constructor
		 * returns {Element|gui.Spirit}
		 */
		qdoc : function ( selector, type ) {
			var root = this.spirit.document.documentElement;
			return root.spirit.dom.q.apply ( root.spirit.dom, arguments );
		},

		/**
		 * Same as qall, but scoped from the document root. Use wisely.
		 * @param {String} selector
		 * @param @optional {function} type Spirit constructor
		 * @returns {Array<Element|gui.Spirit>}
		 */
		qdocall : function ( selector, type ) {
			var root = this.spirit.document.documentElement;
			return root.spirit.dom.qall.apply ( root.spirit.dom, arguments );
		}

		/**
		 * Adding methods to gui.DOMPlugin.prototype
		 * @param {String} name
		 * @param {function} method
		 */
	}, function mixin ( name, method ) {
		gui.DOMPlugin.mixin ( name, function () {
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
		 * @param @optional {function} type Spirit constructor
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
		 * First element or first spirit of type.
		 * @param @optional {function} type Spirit constructor
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
		 * Last element or last spirit of type.
		 * @param @optional {function} type Spirit constructor
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
		 * Parent parent or parent spirit of type.
		 * @param @optional {function} type Spirit constructor
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
		 * Child element or child spirit of type.
		 * @param @optional {function} type Spirit constructor
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
		 * Children elements or children spirits of type.
		 * @TODO just use this.element.children :)
		 * @param @optional {function} type Spirit constructor
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
		 * First ancestor element (parent!) or first ancestor spirit of type.
		 * @param @optional {function} type Spirit constructor
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
		 * First ancestor elements or ancestor spirits of type.
		 * @param @optional {function} type Spirit constructor
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
		 * First descendant element (first child!) first descendant spirit of type.
		 * @param @optional {function} type Spirit constructor
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
		 * All descendant elements or all descendant spirits of type.
		 * @param @optional {function} type Spirit constructor
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
		 * Adding methods to gui.DOMPlugin.prototype
		 * @param {String} name
		 * @param {function} method
		 */
	}, function mixin ( name, method ) {
		gui.DOMPlugin.mixin ( name, function ( type ) {
			if ( !gui.Type.isDefined ( type ) || gui.Type.isFunction ( type )) {
				return method.apply ( this, arguments );
			} else {
				throw new TypeError ( 
					"Unknown spirit for query: " + name + 
					"(" + gui.Type.of ( type ) + ")" 
				);
			}
		});
	});


	/**
	 * DOM insertion methods accept one argument: one spirit OR one element OR an array of either or both. 
	 * The input argument is returned as given. This allows for the following one-liner to be constructed: 
	 * this.something = this.dom.append ( gui.SomeThingSpirit.summon ( this.document )); // imagine 15 more
	 * @TODO Go for compliance with DOM4 method matches (something about textnoding string arguments)
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
		 * @returns {object} Returns the argument
		 */
		remove : function () {
			var parent = this.spirit.element.parentNode;
			parent.removeChild ( this.spirit.element );
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
		 * Adding methods to gui.DOMPlugin.prototype. These methods come highly overloaded.
		 * 
		 * 1. Convert input to array of one or more elements
		 * 2. Confirm array of elements
		 * 3. Invoke the method
		 * 4. Return the input
		 * @param {String} name
		 * @param {function} method
		 */
	}, function mixin ( name, method ) {
		gui.DOMPlugin.mixin ( name, function ( things ) {
			var elms = Array.map ( gui.Array.toArray ( things ), function ( thing ) {
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

}( gui.Combo.chained ));