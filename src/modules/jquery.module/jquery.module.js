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
			return gui.DOMPlugin.embedded ( el );
		}

		/**
		 * Attach spirits to collection.
		 */
		jq.fn.__spiritualize = function () {
			return this.each ( function ( i, el ) {
				if ( indom ( el )) {
					guide.spiritualize ( el );
				}
			});
		};

		/**
		 * Attach spirits to collection subtree.
		 */
		jq.fn.__spiritualizeSub = function () {
			return this.each ( function ( i, el ) {
				if ( indom ( el )) {
					guide.spiritualizeSub ( el );
				}
			});
		};

		/**
		 * Attach spirits to collection non-crawling.
		 */
		jq.fn.__spiritualizeOne = function () {
			return this.each ( function ( i, el ) {
				if ( indom ( el )) {
					guide.spiritualizeOne ( el );
				}
			});
		};

		/**
		 * Detach spirits from collection.
		 */
		jq.fn.__materialize = function ( skip ) {
			return this.each ( function ( i, el ) {
				if ( indom ( el )) {
					guide.materialize ( el );
				}
			});
		};

		/**
		 * Detach spirits from collection subtree.
		 */
		jq.fn.__materializeSub = function ( skip ) {
			return this.each ( function ( i, el ) {
				if ( indom ( el )) {
					guide.materializeSub ( el );
				}
			});
		};

		/**
		 * Detach spirits from collection non-crawling.
		 */
		jq.fn.__materializeOne = function () {
			return this.each ( function ( i, el ) {
				if ( indom ( el )) {
					guide.materializeOne ( el );
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
	 * @todo attr and removeAttr must be hooked into gui.AttPlugin setup...
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
						this.__materializeSub ();
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
							this.__spiritualizeSub (); // @todo optimize!!!
							break;
						case "after" :
						case "before" :
							// Can't use arguments here since JQuery inserts clones thereof.
							// Stuff becomes extra tricky since "this" can itself be a list.
							( function () {
								var is = name === "after";
								var key = "isspiritualized";
								var olds = is ? this.nextAll () : this.prevAll ();
								olds.data ( key, "true" ); // mark current siblings
								res = suber ();
								var news = is ? this.nextAll () : this.prevAll ();
								news.each(function ( i, m ) {
									m = jq ( m );
									if ( !m.data ( key )) {
										m.__spiritualize (); // spiritualize unmarked sibling
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
								jq ( m ).last ().__spiritualize ();
							});
							break;
						case "prependTo" :
							res = suber ();
							arg().each ( function ( i, m ) {
								jq ( m ).first ().__spiritualize ();
							});
							break;
						case "insertAfter" :
							res = suber ();
							arg().next ().__spiritualize ();
							break;
						case "insertBefore" :
							res = suber ();
							arg().prev ().__spiritualize ();
							break;
						case "detach" :
						case "remove" :
							this.__materialize ();
							res = suber ();
							break;
						case "replaceAll" :
							arg().__materialize ();
							res = suber ();
							this.parent ().__spiritualizeSub (); // @todo optimize!
							break;
						case "replaceWith" :
							this.__materialize ();
							var p = this.parent ();
							res = suber ();
							p.__spiritualizeSub (); // @todo optimize!
							break;
						case "empty" :
							this.__materializeSub ();
							res = suber ();
							break;
						case "html" :
							if ( set ) {
								this.__materializeSub ();
							}
							res = suber ();
							if ( set ) {
								this.__spiritualizeSub ();
							}
							break;
						case "unwrap" :
							// note: materializement is skipped here!
							this.parent ().__materializeOne ();
							res = suber ();
							break;
						case "wrap" :
						case "wrapAll" :
							// note: materializement is skipped here!
							res = suber ();
							this.parent ().__spiritualizeOne ();
							break;
						case "wrapInner" :
							res = suber ();
							this.__spiritualize ();
							break;
					}
					jq.__suspend = false;
				}
				return res;
			};
		});
	},
	
	/**
	 * Overload Spiritual to spiritualize/materialize spirits on DOM mutation and to 
	 * suspend mutation monitoring while DOM updating. This would normally 
	 * be baked into native DOM methods appendChild, removeChild and so on.
	 * @see {gui.DOMPlugin}
	 */
	_spiritualdom : function () {

		// overloading this fellow
		var plugin = gui.DOMPlugin.prototype;

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
						gui.Guide.materializeSub ( b.elm );
					}
					res = gui.Observer.suspend ( b.elm, function () {
						return old.call ( this, arg );
					}, this );
					if ( b.dom && method === "html" ) {
						gui.Guide.spiritualizeSub ( b.elm );
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
						gui.Guide.materialize ( b.elm );
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
							gui.Guide.spiritualize ( el );
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