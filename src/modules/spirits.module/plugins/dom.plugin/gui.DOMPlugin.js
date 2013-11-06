/**
 * DOM query and manipulation.
 * @extends {gui.Plugin}
 * @TODO add following and preceding
 * @using {gui.Combo#chained}
 * @using {gui.Guide}
 * @using {gui.Observer}
 */
gui.DOMPlugin = ( function using ( chained, guide, observer ) {

	return gui.Plugin.extend ({

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
		 * Get or set element markup.
		 * @param @optional {String} html
		 * @param @optional {String} position
		 * @returns {String|gui.DOMPlugin}
		 */
		html : chained ( function ( html, position ) {
			return gui.DOMPlugin.html ( this.spirit.element, html, position );
		}),

		/**
		 * Get or set element outer markup.
		 * @param @optional {String} html
		 * @returns {String|gui.DOMPlugin}
		 */
		outerHtml : chained ( function ( html ) {
			return gui.DOMPlugin.outerHtml ( this.spirit.element, html );
		}),

		/**
		 * Get or set element textContent.
		 * @param @optional {String} text
		 * @returns {String|gui.DOMPlugin}
		 */
		text : chained ( function ( text ) {
			return gui.DOMPlugin.text ( this.spirit.element, text );
		}),

		/**
		 * Empty spirit subtree.
		 * @returns {gui.DOMPlugin}
		 */
		empty : chained ( function () {
			this.html ( "" );
		}),

		/**
		 * Hide spirit element and mark as invisible. Adds the `._gui-hidden` classname.
		 * @returns {gui.DOMPlugin}
		 */
		hide : chained ( function () {
			if ( !this.spirit.css.contains ( gui.CLASS_HIDDEN )) {
				this.spirit.css.add ( gui.CLASS_HIDDEN );
				this.spirit.visibility.off ();
			}
		}),

		/**
		 * Show spirit element and mark as visible. Removes the `._gui-hidden` classname.
		 * @returns {gui.DOMPlugin}
		 */
		show : chained ( function () {
			if ( this.spirit.css.contains ( gui.CLASS_HIDDEN )) {
				this.spirit.css.remove ( gui.CLASS_HIDDEN );
				this.spirit.visibility.on ();
			}
		}),

		/**
		 * Get spirit element tagname (identicased with HTML).
		 * @returns {String}
		 */
		tag : function () {
			return this.spirit.element.localName;
		},

		/**
		 * Is positioned in page DOM? Otherwise plausible 
		 * createElement or documentFragment scenario.
		 * @returns {boolean}
		 */
		embedded : function () {
			return gui.DOMPlugin.embedded ( this.spirit.element );
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
		 * Clone spirit element.
		 * @return {Element}
		 */
		clone : function () {
			return this.spirit.element.cloneNode ( true );
		},

		/**
		 * @returns {number}
		 */
		ordinal : function () {
			return gui.DOMPlugin.ordinal ( this.spirit.element );
		},

		/**
		 * Compare the DOM position of this spirit against something else.
		 * @see http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-compareDocumentPosition
		 * @param {Element|gui.Spirit} other
		 * @returns {number}
		 */
		compare : function ( other ) {
			return gui.DOMPlugin.compare ( this.spirit.element, other );
		}
		
		
	}, {}, { // Static ...............................................................

		/**
		 * Spiritual-aware innerHTML (since this is not intercepted).
		 * @param {Element} elm
		 * @param @optional {String} html
		 * @param @optional {String} pos
		 */
		html : function ( elm, html, pos ) {
			if ( gui.Type.isString ( html )) {
				if ( pos ) {
					elm.insertAdjacentHTML ( pos, html );
				} else {
					if ( this._shouldhandle ( elm )) {
						guide.materializeSub ( elm );
						observer.suspend ( elm, function () {
							elm.innerHTML = html;
						});
						guide.spiritualizeSub ( elm );
					} else {
						elm.innerHTML = html;
					}
				}
			} else {
				return elm.innerHTML;
			}
		},

		/**
		 * Spiritual-aware outerHTML (since this is not intercepted).
		 * @TODO deprecate and support "replace" value for position?
		 * @TODO can outerHTML carry multiple root-nodes?
		 * @param {Element} elm
		 * @param @optional {String} html
		 */
		outerHtml : function ( elm, html ) {
			var guide = gui.Guide;
			if ( gui.Type.isString ( html )) {
				if ( this._shouldhandle ( elm )) {
					guide.materialize ( elm );
					observer.suspend ( elm, function () {
						elm.outerHTML = html;
					});
					guide.spiritualize ( elm );
				} else {
					elm.outerHTML = html;
				}
			} else {
				return elm.outerHTML;
			}
		},

		/**
		 * Spiritual-aware textContent (since this is not intercepted).
		 * @param {Element} elm
		 * @param @optional {String} html
		 * @param @optional {String} position
		 */
		text : function ( elm, text ) {
			var guide = gui.Guide;
			if ( gui.Type.isString ( text )) {
				if ( this._shouldhandle ( elm )) {
					guide.materializeSub ( elm );
					observer.suspend ( elm, function () {
						elm.textContent = text;
					});
				} else {
					elm.textContent = text;
				}
			} else {
				return elm.textContent;
			}
		},

		/**
		 * Get ordinal position of element within container.
		 * @param {Element} element
		 * @returns {number}
		 */
		ordinal : function ( element ) {
			var result = 0;
			var parent = element.parentNode;
			if ( parent ) {
				var node = parent.firstElementChild;
				while ( node ) {
					if ( node === element ) {
						break;
					} else {
						node = node.nextElementSibling;
						result ++;
					}
				}
			}
			return result;
		},

		/**
		 * Compare document position of two nodes.
		 * @see http://mdn.io/compareDocumentPosition
		 * @param {Node|gui.Spirit} node1
		 * @param {Node|gui.Spirit} node2
		 * @returns {number}
		 */
		compare : function ( node1, node2 ) {
			node1 = node1 instanceof gui.Spirit ? node1.element : node1;
			node2 = node2 instanceof gui.Spirit ? node2.element : node2;
			return node1.compareDocumentPosition ( node2 );
		},

		/**
		 * Node contains other node?
		 * @param {Node|gui.Spirit} node
		 * @param {Node|gui.Spirit} othernode
		 * @returns {boolean}
		 */
		contains : function ( node, othernode ) {
			var check = Node.DOCUMENT_POSITION_CONTAINS + Node.DOCUMENT_POSITION_PRECEDING;
			return this.compare ( othernode, node ) === check;
		},

		/**
		 * Other node is a following sibling to node?
		 * @param {Node|gui.Spirit} node
		 * @param {Node|gui.Spirit} othernode
		 * @returns {boolean}
		 */
		follows : function ( node, othernode ) {
			return this.compare ( othernode, node ) === Node.DOCUMENT_POSITION_FOLLOWING;
		},

		/**
		 * Other node is a preceding sibling to node?
		 * @param {Node|gui.Spirit} node
		 * @param {Node|gui.Spirit} othernode
		 * @returns {boolean}
		 */
		precedes : function ( node, othernode ) {
			return this.compare ( othernode, node ) === Node.DOCUMENT_POSITION_PRECEDING;
		},

		/**
		 * Is node positioned in page DOM?
		 * @param {Element|gui.Spirit} node
		 * @returns {boolean}
		 */
		embedded : function ( node ) {
			node = node instanceof gui.Spirit ? node.element : node;
			return this.contains ( node.ownerDocument, node );
		},

		/**
		 * Remove from list all nodes that are contained by others.
		 * @param {Array<Element|gui.Spirit>} nodes
		 * @returns {Array<Element|gui.Spirit>}
		 */
		group : function ( nodes ) {
			var node, groups = [];
			function containedby ( target, others ) {
				return others.some ( function ( other ) {
					return gui.DOMPlugin.contains ( other, target );
				});
			}
			while (( node = nodes.pop ())) {
				if ( !containedby ( node, nodes )) {
					groups.push ( node );
				}
			}
			return groups;
		},

		/**
		 * Get first elements that matches a selector.
		 * Optional type argument filters to spirit of type.
		 * @param {Node} node
		 * @param {String} selector
		 * @param @optional {function} type
		 * @returns {Element|gui.Spirit}
		 */
		q : function ( node, selector, type ) {
			var result = null;
			return this._qualify ( node, selector )( function ( node, selector ) {
				if ( type ) {
					result = this.qall ( node, selector, type )[ 0 ] || null;
				} else {
					try {
						result = node.querySelector ( selector );
					} catch ( exception ) {
						console.error ( "Dysfunctional selector: " + selector );
						throw exception;
					}
				}
				return result;
			});
		},

		/**
		 * Get list of all elements that matches a selector.
		 * Optional type argument filters to spirits of type. 
		 * Method always returns a (potentially empty) array.
		 * @param {Node} node
		 * @param {String} selector
		 * @param @optional {function} type
		 * @returns {Array<Element|gui.Spirit>}
		 */
		qall : function ( node, selector, type ) {
			var result = [];
			return this._qualify ( node, selector )( function ( node, selector ) {
				result = gui.Object.toArray ( node.querySelectorAll ( selector ));
				if ( type ) {
					result = result.filter ( function ( el )  {
						return el.spirit && ( el.spirit instanceof type );
					}).map ( function ( el ) {
						return el.spirit;
					});
				}
				return result;
			});
		},


		// Private static .........................................................

		/**
		 * Support direct children selection using proprietary 'this' keyword 
		 * by temporarily assigning the element an ID and modifying the query.
		 * @param {Node} node
		 * @param {String} selector
		 * @param {function} action
		 * @returns {object}
		 */
		_qualify : function ( node, selector, action ) {
			var hadid = true, id, regexp = this._thiskeyword;
			if ( node.nodeType === Node.ELEMENT_NODE ) {
				if ( regexp.test ( selector )) {
					hadid = node.id;
					id = node.id = ( node.id || gui.KeyMaster.generateKey ());
					selector = selector.replace ( regexp, "#" + id );
					node = node.ownerDocument;
				}
			}
			return function ( action ) {
				var res = action.call ( gui.DOMPlugin, node, selector );
				if ( !hadid ) {
					node.id = "";
				}
				return res;
			};
		},

		/**
		 * Element exists in native mode environment? Hotfix 
		 * for bug with native getters and setters in WebKit.
		 * @param {Element} elm
		 * @returns {boolean}
		 */
		_shouldhandle : function ( elm ) {
			var doc = elm.ownerDocument;
			var win = doc.defaultView;
			return win.gui.mode === gui.MODE_NATIVE;
		},

		/**
		 * Match custom 'this' keyword in CSS selector. You can start 
		 * selector expressions with "this>*" to find immediate child
		 * @TODO skip 'this' and support simply ">*" and "+*" instead.
		 * @type {RegExp}
		 */
		_thiskeyword : /^this|,this/g
			
	});

}( 
	gui.Combo.chained, 
	gui.Guide, 
	gui.Observer 
));

/**
 * Bind the "this" keyword for all static methods.
 */
gui.Object.bindall ( gui.DOMPlugin );

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
		return gui.DOMPlugin.q ( this.spirit.element, selector, type );
	},

	/**
	 * Get list of all descendant elements that matches a selector. Optional type  
	 * arguments returns instead all associated spirits to match the given type.
	 * @param {String} selector
	 * @param @optional {function} type Spirit constructor
	 * @returns {Array<Element|gui.Spirit>}
	 */
	qall : function ( selector, type ) {
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
 * @TODO: Support two arguments + arguments magic for all of these :/
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
		var result = this.spirit.element.firstElementChild;
		if ( type ) {
			result = this.children ( type )[ 0 ] || null;
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
		var result = gui.Object.toArray ( this.spirit.element.children );
		if ( type ) {
			result = result.filter ( function ( elm ) {
				return elm.spirit && elm.spirit instanceof type;
			}).map ( function ( elm ) {
				return elm.spirit;
			});
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
	},

	preceding : function ( type ) {
		console.error ( "TODO" );
	},

	following : function ( type ) {
		var result = [], spirit, el = this.spirit.element;
		while (( el = el.nextElementSibling )) {
			if ( type && ( spirit = el.spirit )) {
				if ( spirit instanceof type ) {
					result.push ( spirit );
				}
			} else {
				result.push ( el );
			}
		}
		return result;
	}

	/**
	 * Adding methods to gui.DOMPlugin.prototype
	 * @TODO test for undefined type (spelling mistake etc.)
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
	 * 1. Convert arguments to array of one or more elements
	 * 2. Confirm array of elements (exception supressed pending IE9 issue)
	 * 3. Invoke the method
	 * 4. Return the input
	 * @param {String} name
	 * @param {function} method
	 */
}, function mixin ( name, method ) {
	gui.DOMPlugin.mixin ( name, function ( things ) {
		var elms = Array.map ( gui.Array.toArray ( things ), function ( thing ) {
			return thing && thing instanceof gui.Spirit ? thing.element : thing;
		}).filter ( function ( thing ) { // @TODO IE9 may sometimes for some reason throw and array in here :/ must investigate!!!
			return thing && gui.Type.isNumber ( thing.nodeType ); // first check added for FF which now may fail as well :/
		});
		if ( elms.length ) {
			method.call ( this, elms );
		}
		return things;
	});
});