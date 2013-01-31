/**
 * # Module "jquery"
 * Do what Spiritual does by overloading JQuery methods instead of native DOM methods.
 * @todo (Angular special) handle function replaceWith, "a special jqLite.replaceWith, which can replace items which have no parents"
 * @todo Henrik says "$(iframe.contentDocument).remove() før man skifter URL eller fjerner iframen" (jQuery.cache og jQuery.fragments)
 */
gui.module ( "jquery", {

	/**
	 * Hack Spiritual in top window.
	 * @param {Window} context
	 */
	init : function ( context ) {
		if ( context === top ) {
			this._spiritualdom ();
		}
	},

	/**
	 * Hack JQuery in all windows.
	 * @param {Window} context
	 */
	ready : function ( context ) {
		var root = context.document.documentElement;
		if ( context.gui.mode === gui.MODE_JQUERY ) {
			var jq = context.jQuery;
			jq.__rootnode = root;
			this._instance ( jq );
			this._expandos ( jq );
			this._overload ( jq );
		}
	},


	// Private .............................................................

	/**
	 * Injecting Spiritual awareness into 
	 * JQuery DOM manipulation methods.
	 * @param {jQuery} jq
	 */
	_expandos : function ( jq ) {
		var guide = gui.Guide;
		jq.__suspend = false;

		/**
		 * Element in page DOM?
		 * @param {Element} el
		 * @returns {boolean}
		 */
		function indom ( el ) {
			return gui.SpiritDOM.embedded ( el );
		}

		/**
		 * Attach spirits to collection.
		 */
		jq.fn.__attach = function () {
			return this.each ( function ( i, el ) {
				if ( indom ( el )) {
					guide.attach ( el );
				}
			});
		};

		/**
		 * Attach spirits to collection subtree.
		 */
		jq.fn.__attachSub = function () {
			return this.each ( function ( i, el ) {
				if ( indom ( el )) {
					guide.attachSub ( el );
				}
			});
		};

		/**
		 * Attach spirits to collection non-crawling.
		 */
		jq.fn.__attachOne = function () {
			return this.each ( function ( i, el ) {
				if ( indom ( el )) {
					guide.attachOne ( el );
				}
			});
		};

		/**
		 * Detach spirits from collection.
		 */
		jq.fn.__detach = function ( skip ) {
			return this.each ( function ( i, el ) {
				if ( indom ( el )) {
					guide.detach ( el );
				}
			});
		};

		/**
		 * Detach spirits from collection subtree.
		 */
		jq.fn.__detachSub = function ( skip ) {
			return this.each ( function ( i, el ) {
				if ( indom ( el )) {
					guide.detachSub ( el );
				}
			});
		};

		/**
		 * Detach spirits from collection non-crawling.
		 */
		jq.fn.__detachOne = function () {
			return this.each ( function ( i, el ) {
				if ( indom ( el )) {
					guide.detachOne ( el );
				}
			});
		};
	},

	/**
	 * Fixing JQuery instance constructor to detect when the user 
	 * instantiates JQuery in an external window context (iframes).
	 * @param {function} jq JQuery constructor
	 */
	_instance : function ( jq ) {
		var Init = jq.fn.init;
		var home = jq.__rootnode.ownerDocument.defaultView;
		if ( home.gui.debug ) {
			jq.fn.init = function ( selector, context, rootjQuery ){
				var inst = new Init ( selector, context, rootjQuery );
				var test = inst [ 0 ];
				if ( test && test.nodeType === Node.ELEMENT_NODE ) {
					if ( test.ownerDocument !== home.document ) {
						throw new Error ( "JQuery was used to handle elements in another window. Please use a locally loaded version of JQuery." );
					}
				}
				return inst;
			};
		}
	},

	/**
	 * Overloading DOM manipulation methods.
	 * @todo attr and removeAttr must be hooked into gui.SpiritAtt setup...
	 * @param {function} jq Constructor
	 */
	_overload : function ( jq ) {
		var naive = Object.create ( null ); // mapping unmodified methods
		[
			"after", 
			"append", 
			"appendTo", 
			"before", 
			"detach", 
			"empty", 
			"html", 
			"text", 
			"insertAfter", 
			"insertBefore", 
			"prepend", 
			"prependTo", 
			"remove", 
			"replaceAll", 
			"replaceWith", 
			"unwrap", 
			"wrap", 
			"wrapAll", 
			"wrapInner"
		].forEach ( function ( name ) {
			naive [ name ] = jq.fn [ name ];
			jq.fn [ name ] = function () {
				var res;
				var that = this;
				var args = arguments;
				var set = arguments.length > 0;
				function suber () {
					return gui.Observer.suspend ( jq.__rootnode, function () {
						return naive [ name ].apply ( that, args );
					}, that );
				}
				if ( jq.__suspend ) {
					res = suber ();
				} else if ( name === "text" ) {
					if ( set ) {
						this.__detachSub ();
					}
					res = suber ();
				} else {
					var arg = function() { return set ? jq ( args [ 0 ]) : undefined; };
					var guide = gui.Guide;
					jq.__suspend = true;
					switch ( name ) {
						case "append" :
						case "prepend" :
							res = suber ();
							this.__attachSub (); // @todo optimize!!!
							break;
						case "after" :
						case "before" :
							// Can't use arguments here since JQuery inserts clones thereof.
							// Stuff becomes extra tricky since "this" can itself be a list.
							( function () {
								var is = name === "after";
								var key = "isattached";
								var olds = is ? this.nextAll () : this.prevAll ();
								olds.data ( key, "true" ); // mark current siblings
								res = suber ();
								var news = is ? this.nextAll () : this.prevAll ();
								news.each(function ( i, m ) {
									m = jq ( m );
									if ( !m.data ( key )) {
										m.__attach (); // attach unmarked sibling
										m.data ( key, "true" );
									}
								});
								gui.Tick.next ( function () {
									news.removeData ( key ); // cleanup all this
								});
							}).call ( this );
							break;
						case "appendTo" :
							res = suber ();
							arg().each ( function ( i, m ) {
								jq ( m ).last ().__attach ();
							});
							break;
						case "prependTo" :
							res = suber ();
							arg().each ( function ( i, m ) {
								jq ( m ).first ().__attach ();
							});
							break;
						case "insertAfter" :
							res = suber ();
							arg().next ().__attach ();
							break;
						case "insertBefore" :
							res = suber ();
							arg().prev ().__attach ();
							break;
						case "detach" :
						case "remove" :
							this.__detach ();
							res = suber ();
							break;
						case "replaceAll" :
							arg().__detach ();
							res = suber ();
							this.parent ().__attachSub (); // @todo optimize!
							break;
						case "replaceWith" :
							this.__detach ();
							var p = this.parent ();
							res = suber ();
							p.__attachSub (); // @todo optimize!
							break;
						case "empty" :
							this.__detachSub ();
							res = suber ();
							break;
						case "html" :
							if ( set ) {
								this.__detachSub ();
							}
							res = suber ();
							if ( set ) {
								this.__attachSub ();
							}
							break;
						case "unwrap" :
							// note: detachment is skipped here!
							this.parent ().__detachOne ();
							res = suber ();
							break;
						case "wrap" :
						case "wrapAll" :
							// note: detachment is skipped here!
							res = suber ();
							this.parent ().__attachOne ();
							break;
						case "wrapInner" :
							res = suber ();
							this.__attach ();
							break;
					}
					jq.__suspend = false;
				}
				return res;
			};
		});
	},
	
	/**
	 * Overload Spiritual to attach/detach spirits on DOM mutation and to 
	 * suspend mutation monitoring while DOM updating. This would normally 
	 * be baked into native DOM methods appendChild, removeChild and so on.
	 * @see {gui.SpiritDOM}
	 */
	_spiritualdom : function () {

		// overloading this fellow
		var plugin = gui.SpiritDOM.prototype;

		/*
		 * @param {gui.Spirit} spirit
		 * @returns {object}
		 */
		function breakdown ( spirit ) {
			var elm = spirit.element;
			var doc = elm.ownerDocument;
			var win = doc.defaultView;
			var dom = spirit.dom.embedded();
			var is$ = win.gui.mode === gui.MODE_JQUERY;
			return { elm : elm, doc : doc, win : win, dom : dom, is$ : is$ };
		}
		/**
		 * Manage invoker subtree.
		 */
		[ "html", "empty", "text" ].forEach ( function ( method ) {
			var old = plugin [ method ];
			plugin [ method ] = function ( arg ) {
				var res, b = breakdown ( this.spirit );
				if ( b.is$ ) {
					if ( b.dom ){
						gui.Guide.detachSub ( b.elm );
					}
					res = gui.Observer.suspend ( b.elm, function () {
						return old.call ( this, arg );
					}, this );
					if ( b.dom && method === "html" ) {
						gui.Guide.attachSub ( b.elm );
					}
				} else {
					res = old.call ( this, arg );
				}
				return res;
			};
		});
		/**
		 * Manage invoker itself.
		 */
		[ "remove" ].forEach ( function ( method ) {
			var old = plugin [ method ];
			plugin [ method ] = function ( arg ) {
				var res, b = breakdown ( this.spirit );
				if ( b.is$ ) {
					if ( b.dom ) {
						gui.Guide.detach ( b.elm );
					}
					res = gui.Observer.suspend ( b.elm, function () {
						return old.call ( this, arg );
					}, this );
				} else {
					res = old.call ( this, arg );
				}
				return res;
			};
		});
		/**
		 * Manage targeted element(s)
		 */
		[ "append", "prepend", "before", "after" ].forEach ( function ( method ) {
			var old = plugin [ method ];
			plugin [ method ] = function ( things ) {
				var res, b = breakdown ( this.spirit );
				if ( b.is$ ) {
					res = gui.Observer.suspend ( b.elm, function () {
						return old.call ( this, things );
					}, this );
					if ( b.dom ) {
						var els = Array.map ( gui.Type.list ( things ), function ( thing ) {
							return thing && thing instanceof gui.Spirit ? thing.element : thing;
						});
						els.forEach ( function ( el ) {
							gui.Guide.attach ( el );
						});
					}
				} else {
					res = old.call ( this, things );
				}
				return res;
			};
		});
	}
});