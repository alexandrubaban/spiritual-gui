/**
 * TODO: insertAdjecantHTML
 * TODO: DOM4 methods
 */
gui.UPGRADE = function () { // TODO: name this thing

	var combo = gui.Combinator;
	var guide = gui.Guide;

	// node embedded in document?
	var ifembedded = combo.provided ( function () {
		return gui.SpiritDOM.embedded ( this );
	});

	// has spirit associated?
	var ifspirit = combo.provided ( function () {
		return !gui.Type.isNull ( this.spirit );
	});

	// attach node plus subtree
	var attachafter = combo.after ( function ( node ) {
		guide.attach ( node );
	});

	// detach node plus subtree
	var detachbefore = combo.before ( function ( node ) {
		guide.detach ( node );
	});

	// attach new node plus subtree
	var attachnewafter = combo.after ( function ( newnode, oldnode ) {
		guide.attach ( newnode );
	});

	// detach old node plus subtree
	var detacholdbefore = combo.before ( function ( newnode, oldnode ) {
		guide.detach ( oldnode );
	});

	// spirit-aware setattribute
	var setattafter = combo.after ( function ( att, val ) {
		this.spirit.att.__suspend__ ( function () {
			this.set ( att, val );
		});
	});

	// spirit-aware removeattribute
	var delattafter = combo.after ( function ( att ) { // TODO: use the post combo
		this.spirit.att.__suspend__ ( function () {
			this.del ( att );
		});
	});
	
	// disable DOM mutation observers while doing action
	var suspending = combo.around ( function ( action ) {
		return gui.Observer.suspend ( this, function () {
			return action.apply ( this, arguments );
		}, this );
	});

	// detach subtree of "this"
	var detachsubbefore = combo.before ( function () {
		guide.detachSub ( this );
	});

	// attach subtree of "this"
	var attachsubafter = combo.after ( function () {
		guide.attachSub ( this );
	});

	// detach "this"
	var parent = null; // TODO: unref this at some point
	var detachthisbefore = combo.before ( function () {
		parent = this.parentNode;
		guide.detach ( this );
	});

	// attach parent
	var attachparentafter = combo.after ( function () {
		guide.attach ( parent );
	});

	// webkit-patch property descriptors for node and subtree
	var webkitafter = combo.after ( function ( node ) {
		if ( gui.Client.isWebKit ) {
			gui.WEBKIT.patch ( node );
		}
	});

	// sugar
	var otherwise = function ( action ) {
		return action;
	};


	// PUBLIC ......................................................................

	return { // TODO: standard dom exceptions for missing arguments and so on.

		appendChild : function ( base ) {
			return (
				ifembedded ( attachafter ( webkitafter ( suspending ( base ))), 
				otherwise ( base ))
			);
		},
		removeChild : function ( base ) {
			return (
				ifembedded ( detachbefore ( suspending ( base )),
				otherwise ( base ))
			);
		},
		insertBefore : function ( base ) {
			return (
				ifembedded ( attachafter ( webkitafter ( suspending ( base ))), 
				otherwise ( base ))
			);
		},
		replaceChild : function ( base ) {
			return (
				ifembedded ( detacholdbefore ( attachnewafter ( webkitafter ( suspending ( base )))), 
				otherwise ( base ))
			);
		},
		setAttribute : function ( base ) {
			return ( 
				ifembedded ( 
					ifspirit ( setattafter ( base )),
					otherwise ( base )
				),
				otherwise ( base )
			);
		},
		removeAttribute : function ( base ) {
			return ( 
				ifembedded ( 
					ifspirit ( delattafter ( base )), 
					otherwise ( base )
				),
				otherwise ( base )
			);
		},

		/*
		 * Property setters are ignored for WebKit; this stuff works only because properties 
		 * have been re-implemented using methods (see above) in all WebKit based browsers :)
		 */

		innerHTML : function ( base ) {
			return (
				ifembedded ( detachsubbefore ( attachsubafter ( suspending ( base ))),
				otherwise ( base ))
			);
		},
		outerHTML : function ( base ) {
			return (
				ifembedded ( detachthisbefore ( attachparentafter ( suspending ( base ))),
				otherwise ( base ))
			);
		},
		textContent : function ( base ) {
			return (
				ifembedded ( detachsubbefore ( suspending ( base )),
				otherwise ( base ))
			);
		}
	};

};