/**
 * # gui.DOMCombos
 * This is where it gets interesting.
 * @todo Standard DOM exceptions for missing arguments and so on.
 * @todo insertAdjecantHTML
 * @todo DOM4 methods
 */
gui.DOMCombos = {

	/**
	 * Get combinations to overload native DOM methods and getters.
	 * @type {Map<String,function>}
	 */
	getem : function () {
		return this._creation || ( this._creation = this._create ());
	},

	// Private .......................................................................
	
	/**
	 * Cache combinations for reuse when next requested.
	 * @type {Map<String,function>}
	 */
	_creation : null,

	/**
	 * Building combinations when first requested. Note that property setters such as 
	 * innerHTML and textContent are skipped for WebKit where the stuff only works because 
	 * properties have been re-implemented using methods in all WebKit based browsers. 
	 * @see {gui.DOMPatcher}
	 */
	_create : function () {

		var combo = gui.Combinator;
		var guide = gui.Guide;
		
		/**
		 * Is `this` embedded in document?
		 * @returns {boolean}
		 */
		var ifembedded = combo.provided ( function () {
			return gui.SpiritDOM.embedded ( this );
		});

		/**
		 * Has spirit associated?
		 * @returns {boolean}
		 */
		var ifspirit = combo.provided ( function () {
			return !gui.Type.isNull ( this.spirit );
		});

		/**
		 * Attach node plus subtree.
		 * @param {Node} node
		 */
		var attachafter = combo.after ( function ( node ) {
			guide.attach ( node );
		});

		/**
		 * Detach node plus subtree.
		 * @param {Node} node
		 */
		var detachbefore = combo.before ( function ( node ) {
			guide.detach ( node );
		});

		/**
		 * Attach new node plus subtree.
		 * @param {Node} newnode
		 * @param {Node} oldnode
		 */
		var attachnewafter = combo.after ( function ( newnode, oldnode ) {
			guide.attach ( newnode );
		});

		/**
		 * Detach old node plus subtree
		 * @param {Node} newnode
		 * @param {Node} oldnode
		 */
		var detacholdbefore = combo.before ( function ( newnode, oldnode ) {
			guide.detach ( oldnode );
		});

		/**
		 * Spirit-aware setattribute.
		 * @param {String} att
		 * @param {String} val
		 */
		var setattafter = combo.after ( function ( att, val ) {
			this.spirit.att.__suspend__ ( function () {
				this.set ( att, val );
			});
		});

		/**
		 * Spirit-aware removeattribute.
		 * @todo use the post combo?
		 * @param {String} att
		 */
		var delattafter = combo.after ( function ( att ) {
			this.spirit.att.__suspend__ ( function () {
				this.del ( att );
			});
		});

		/**
		 * Disable DOM mutation observers while doing action.
		 * @param {function} action
		 */
		var suspending = combo.around ( function ( action ) {
			return gui.Observer.suspend ( this, function () {
				return action.apply ( this, arguments );
			}, this );
		});

		/**
		 * Detach subtree of `this`.
		 */
		var detachsubbefore = combo.before ( function () {
			guide.detachSub ( this );
		});

		/**
		 * Attach subtree of `this`
		 */
		var attachsubafter = combo.after ( function () {
			guide.attachSub ( this );
		});

		/**
		 * Detach `this`.
		 */
		var parent = null; // @todo unref this at some point
		var detachthisbefore = combo.before ( function () {
			parent = this.parentNode;
			guide.detach ( this );
		});

		/**
		 * Attach parent.
		 */
		var attachparentafter = combo.after ( function () {
			guide.attach ( parent );
		});

		/**
		 * Webkit-patch property descriptors for node and subtree.
		 * @param {Node} node
		 */
		var patchafter = combo.after ( function ( node ) {
			if ( gui.Client.isWebKit ) {
				gui.DOMPatcher.patch ( node );
			}
		});

		/**
		 * Pretend nothing happened when running in "managed" mode.
		 * @todo Simply mirror this prop with an internal boolean
		 */
		var ifenabled = combo.provided ( function () {
			return this.ownerDocument.defaultView.gui.mode !== gui.MODE_MANAGED;
		});

		/**
		 * Sugar for combo readability.
		 * @param {function} action
		 * @returns {function}
		 */
		var otherwise = function ( action ) {
			return action;
		};

		/**
		 * Here we go.
		 */
		return {

			appendChild : function ( base ) {
				return (
					ifenabled ( 
						ifembedded ( attachafter ( patchafter ( suspending ( base ))), 
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			removeChild : function ( base ) {
				return (
					ifenabled ( 
						ifembedded ( detachbefore ( suspending ( base )),
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			insertBefore : function ( base ) {
				return (
					ifenabled ( 
						ifembedded ( attachafter ( patchafter ( suspending ( base ))), 
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			replaceChild : function ( base ) {
				return (
					ifenabled ( 
						ifembedded ( detacholdbefore ( attachnewafter ( patchafter ( suspending ( base )))), 
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			setAttribute : function ( base ) {
				return ( 
					ifenabled ( 
						ifembedded ( 
							ifspirit ( setattafter ( base ), 
							otherwise ( base )),
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			removeAttribute : function ( base ) {
				return ( 
					ifenabled ( 
						ifembedded ( 
							ifspirit ( delattafter ( base ),
							otherwise ( base )),
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			innerHTML : function ( base ) {
				return (
					ifenabled ( 
						ifembedded ( detachsubbefore ( attachsubafter ( suspending ( base ))),
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			outerHTML : function ( base ) {
				return (
					ifenabled ( 
						ifembedded ( detachthisbefore ( attachparentafter ( suspending ( base ))),
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			textContent : function ( base ) {
				return (
					ifenabled ( 
						ifembedded ( detachsubbefore ( suspending ( base )),
						otherwise ( base )),
					otherwise ( base ))
				);
			}
		};
	}
};