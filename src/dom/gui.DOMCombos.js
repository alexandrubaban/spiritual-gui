/**
 * This is where it gets interesting.
 * @TODO Standard DOM exceptions for missing arguments and so on.
 * @TODO insertAdjecantHTML
 * @TODO DOM4 methods
 */
gui.DOMCombos = ( function scoped () {

	var combo = gui.Combo,
		before = combo.before,
		after = combo.after,
		around = combo.around,
		provided = combo.provided;
	
	/**
	 * Is `this` embedded in document?
	 * @returns {boolean}
	 */
	var ifEmbedded = provided ( function () {
		return gui.DOMPlugin.embedded ( this );
	});

	/**
	 * Element has spirit?
	 * @returns {boolean}
	 */
	var ifSpirit = provided ( function () {
		return !gui.Type.isNull ( this.spirit );
	});

	/**
	 * Spiritualize node plus subtree.
	 * @param {Node} node
	 */
	var spiritualizeAfter = after ( function ( node ) {
		gui.Guide.spiritualize ( node );
	});

	/**
	 * Spiritualize new node plus subtree.
	 * @param {Node} oldnode
	 */
	var spiritualizeNewAfter = after ( function ( newnode, oldnode ) {
		gui.Guide.spiritualize ( newnode );
	});
	
	/**
	 * Materialize old node plus subtree
	 * @TODO perhaps just detach oldnode instead???
	 * @param {Node} newnode
	 * @param {Node} oldnode
	 */
	var materializeOldBefore = before ( function ( newnode, oldnode ) {
		gui.Guide.materialize ( oldnode );
	});

	/**
	 * Detach node plus subtree.
	 * @param {Node} node
	 */
	var detachBefore = before ( function ( node ) {
		gui.Guide.detach ( node );
	});

	/**
	 * Spirit-aware setattribute.
	 * @param {String} name
	 * @param {String} value
	 */
	var setAttBefore = before ( function ( name, value ) {
		this.spirit.att.set ( name, value );
	});

	/**
	 * Spirit-aware removeattribute.
	 * @TODO use the post combo?
	 * @param {String} name
	 */
	var delAttBefore = before ( function ( name ) {
		this.spirit.att.del ( name );
	});

	/**
	 * Disable DOM mutation observers while doing action.
	 * @TODO: only do this stuff in debug mode and so on.
	 * @param {function} action
	 */
	var suspending = around ( function ( action ) {
		return gui.Observer.suspend ( this, function () {
			return action ();
		}, this );
	});

	/**
	 * Materialize node.
	 */
	var materializeBefore = before ( function ( node ) {
		gui.Guide.materialize ( node );
	});

	/**
	 * Materialize subtree of `this`.
	 */
	var materializeSubBefore = before ( function () {
		gui.Guide.materializeSub ( this );
	});

	/**
	 * Spiritualize subtree of `this`
	 */
	var spiritualizeSubAfter = after ( function () {
		gui.Guide.spiritualizeSub ( this );
	});

	/**
	 * Detach `this`.
	 */
	var parent = null; // @TODO unref this at some point
	var materializeThisBefore = before ( function () {
		parent = this.parentNode;
		gui.Guide.materialize ( this );
	});

	/**
	 * Attach parent.
	 */
	var spiritualizeParentAfter = after ( function () {
		gui.Guide.spiritualize ( parent );
	});

	/**
	 * @param {String} position
	 * @param {String} html
	 */
	var spiritualizeAdjecantAfter = after ( function ( position, html ) {
		console.log ( position );
		/*
		'beforebegin'
		Before the element itself.
		'afterbegin'
		Just inside the element, before its first child.
		'beforeend'
		Just inside the element, after its last child.
		'afterend'
		After the element itself.
		*/
	});

	/**
	 * Pretend nothing happened when running in managed mode.
	 * @TODO Simply mirror this prop with an internal boolean
	 */
	var ifEnabled = provided ( function () {
		var win = this.ownerDocument.defaultView;
		if ( win ) {
			return win.gui.mode !== gui.MODE_MANAGED;
		} else {
			return false; // abstract HTMLDocument might adopt DOM combos
		}
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
				ifEnabled ( 
					ifEmbedded ( spiritualizeAfter ( suspending ( base )), 
					otherwise ( base )),
				otherwise ( base ))
			);
		},
		removeChild : function ( base ) {
			return (
				ifEnabled ( 
					ifEmbedded ( detachBefore ( suspending ( base )), // detachBefore suspended for flex hotfix!
					otherwise ( base )),
				otherwise ( base ))
			);
		},
		insertBefore : function ( base ) {
			return (
				ifEnabled ( 
					ifEmbedded ( spiritualizeAfter ( suspending ( base )), 
					otherwise ( base )),
				otherwise ( base ))
			);
		},
		replaceChild : function ( base ) { // @TODO: detach instead (also in jquery module)
			return (
				ifEnabled ( 
					ifEmbedded ( materializeOldBefore ( spiritualizeNewAfter ( suspending ( base ))), 
					otherwise ( base )),
				otherwise ( base ))
			);
		},
		setAttribute : function ( base ) {
			return ( 
				ifEnabled ( 
					ifEmbedded ( 
						ifSpirit ( setAttBefore ( base ), 
						otherwise ( base )),
					otherwise ( base )),
				otherwise ( base ))
			);
		},
		removeAttribute : function ( base ) {
			return ( 
				ifEnabled ( 
					ifEmbedded ( 
						ifSpirit ( delAttBefore ( base ),
						otherwise ( base )),
					otherwise ( base )),
				otherwise ( base ))
			);
		},
		insertAdjecantHTML : function ( base ) {
			return ( 
				ifEnabled ( 
					ifEmbedded ( spiritualizeAdjecantAfter ( suspending ( base ))),
					otherwise ( base )),
				otherwise ( base )
			);
		},

		// Disabled pending http://code.google.com/p/chromium/issues/detail?id=13175 ..............

		innerHTML : function ( base ) {
			return (
				ifEnabled ( 
					ifEmbedded ( materializeSubBefore ( spiritualizeSubAfter ( suspending ( base ))),
					otherwise ( base )),
				otherwise ( base ))
			);
		},
		outerHTML : function ( base ) {
			return (
				ifEnabled ( 
					ifEmbedded ( materializeThisBefore ( spiritualizeParentAfter ( suspending ( base ))),
					otherwise ( base )),
				otherwise ( base ))
			);
		},
		textContent : function ( base ) {
			return (
				ifEnabled ( 
					ifEmbedded ( materializeSubBefore ( suspending ( base )),
					otherwise ( base )),
				otherwise ( base ))
			);
		}
	};

}());