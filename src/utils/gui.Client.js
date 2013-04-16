/**
 * Questionable browser identity and feature detection. Note that Chrome on iOS 
 * identifies itself as Safari (it basically is, so that shouldn't cause concern).
 * @TODO Load earlier by not using gui.Broadcast?
 * @TODO Lazycompute properties when requested.
 */
gui.Client = ( new function Client () {

	var agent = navigator.userAgent.toLowerCase ();
	var root = document.documentElement;

	this.isExplorer = agent.contains ( "msie" );
	this.isOpera = agent.contains ( "opera" );
	this.isWebKit = agent.contains ( "webkit" );
	this.isChrome = this.isWebKit && agent.contains ( "chrome" );
	this.isSafari = this.isWebKit && !this.isChrome && agent.contains ( "safari" );
	this.isGecko = !this.isWebKit && !this.isOpera && agent.contains ( "gecko" );

	/**
	 * Supports CSS feature?
	 * @param {String} feature
	 * @returns {boolean}
	 */
	function supports ( feature ) {
		var root = document.documentElement;
		var fixt = feature [ 0 ].toUpperCase () + feature.substring ( 1 );
		return ![ "", "Webkit", "Moz", "O", "ms" ].every ( function ( prefix ) {
			return root.style [ prefix ? prefix + fixt : feature ] === undefined;
		});
	}

	/**
	 * Agent is one of "webkit" "firefox" "opera" "explorer"
	 * @type {String}
	 */
	this.agent = ( function () {
		var agent = "explorer";
		if ( this.isWebKit ) {
			agent = "webkit";
		} else if ( this.isGecko ) {
			agent = "gecko";
		} else if ( this.isOpera ) {
			agent = "opera";
		}
		return agent;
	}).call ( this );

	/**
	 * System is one of "linux" "osx" "ios" "windows" "windowsmobile" "haiku"
	 */
	this.system = ( function () {
		var os = null;
		[ "window mobile", "windows", "ipad", "iphone", "haiku", "os x", "linux" ].every ( function ( test ) {
			if ( agent.contains ( test )) {
				if ( test.match ( /ipad|iphone/ )) {
					os = "ios";
				} else {
					os = test.replace ( / /g, "" );  // no spaces
				}
			}
			return os === null;
		});
		return os;
	})();

	/**
	 * Has touch support? Note that desktop Chrome has this.
	 * @TODO Investigate this in desktop IE10.
	 * @type {boolean}
	 */
	this.hasTouch = ( window.ontouchstart !== undefined || this.isChrome );

	/**
	 * Supports file blob?
	 * @type {boolean}
	 */
	this.hasBlob = ( window.Blob && ( window.URL || window.webkitURL ));

	/**
	 * Supports the History API?
	 * @type {boolean}
	 */
	this.hasHistory = ( window.history && window.history.pushState );

	/**
	 * Is mobile device? Not to be confused with this.hasTouch
	 * @TODO gui.Observerice entity?
	 * @type {boolean}
	 */
	this.isMobile = ( function () {
		var shortlist = [ "android", "webos", "iphone", "ipad", "ipod", "blackberry", "windows phone" ];
		return !shortlist.every ( function ( system ) {
			return !agent.contains ( system );
		});
	}());

	/**
	 * Supports CSS transitions?
	 * @type {boolean}
	 */
	this.hasTransitions = supports ( "transition" );

	/**
	 * Supports CSS 3D transform? (note https://bugzilla.mozilla.org/show_bug.cgi?id=677173)
	 * @type {boolean}
	 */
	this.has3D = supports ( "perspective" );

	/**
	 * Supports flexible box module?
	 * @todo Firefox and Safari only a few versions back should NOT report true on this...
	 * @type {boolean}
	 */
	this.hasFlexBox = supports ( "flex" );

	/**
	 * Supports requestAnimationFrame somewhat natively?
   * @type {boolean}
   */
	this.hasAnimationFrame = ( function () {
		var win = window;
		if ( 
			win.requestAnimationFrame	|| 
			win.webkitRequestAnimationFrame || 
			win.mozRequestAnimationFrame || 
			win.msRequestAnimationFrame	|| 
			win.oRequestAnimationFrame
		) {
			return true;
		} else {
			return false;
		}
	})();

	/**
	 * Supports MutationObserver feature?
	 * @type {boolean}
	 */
	this.hasMutations = ( function () {
		return ![ "", "WebKit", "Moz", "O", "Ms" ].every ( function ( vendor ) {
			return !gui.Type.isDefined ( window [ vendor + "MutationObserver" ]);
		});
	})();

	/**
	 * Time in milliseconds after window.onload before we can reliably measure 
	 * document height. We could in theory discriminate between browsers here, 
	 * but we won't. WebKit sucks more at this and Safari on iOS is dead to me.
	 * @see https://code.google.com/p/chromium/issues/detail?id=35980
	 * @TODO Now Firefox started to suck really bad. What to do?
	 * @type {number}
	 */
	this.STABLETIME = 200;
	
	/**
	 * Browsers disagree on the primary scrolling element.
	 * Is it document.body or document.documentElement? 
	 * @see https://code.google.com/p/chromium/issues/detail?id=2891
	 * @type {HTMLElement}
	 */
	this.scrollRoot = null;

	/**
	 * Scrollbar default span in pixels. 
	 * Note that this is zero on mobiles.
	 * @type {number}
	 */
	this.scrollBarSize = 0;

	/**
	 * Supports position fixed?
	 * @type {boolean}
	 */
	this.hasPositionFixed = false;

	/**
	 * Before we start any spirits:
	 * - What is the scroll root?
	 * - Supports position fixed?
	 * @param {gui.Broadcast} b
	 */
	this.onbroadcast = function ( b ) {
		var type = gui.BROADCAST_WILL_SPIRITUALIZE;
		if ( b.type === type && b.target === gui ) {
			gui.Broadcast.removeGlobal ( type, this );
			extras.call ( this );
		}
	};

	/**
	 * @TODO Probably move this out of here?
	 */
	function extras () {
		var win = window,
		doc = document,
		html = doc.documentElement,
		body = doc.body,
		root = null;
		// make sure window is scrollable
		var temp = body.appendChild ( 
			gui.CSSPlugin.style ( doc.createElement ( "div" ), {
				position : "absolute",
				height : "10px",
				width: "10px",
				top : "100%"
			})
		);
		// what element will get scrolled?
		win.scrollBy ( 0, 10 );
		root = body.scrollTop ? body : html;
		this.scrollRoot = root;
		// supports position fixed?
		gui.CSSPlugin.style ( temp, {
			position : "fixed",
			top : "10px"
		});
		// restore scroll when finished
		var has = temp.getBoundingClientRect ().top === 10;
		this.hasPositionFixed = has;
		body.removeChild ( temp );
		win.scrollBy ( 0, -10 );
		// compute scrollbar size
		var inner = gui.CSSPlugin.style ( document.createElement ( "p" ), {
			width : "100%",
			height : "200px"
		});
		var outer = gui.CSSPlugin.style ( document.createElement ( "div" ), {
			position : "absolute",
			top : "0",
			left : "0",
			visibility : "hidden",
			width : "200px",
			height : "150px",
			overflow : "hidden"
		});
		outer.appendChild ( inner );
		html.appendChild ( outer );
		var w1 = inner.offsetWidth;
		outer.style.overflow = "scroll";
		var w2 = inner.offsetWidth;
		if ( w1 === w2 ) {
			w2 = outer.clientWidth;
		}
		html.removeChild ( outer );
		this.scrollBarSize = w1 - w2;

		/*
		 * Temp hotfix for IE...
		 */
		if ( this.isExplorer ) {
			this.scrollBarSize = 17; // wat
		}
	}

});

/**
 * Hm.
 */
( function waitfordom () {
	gui.Broadcast.addGlobal ( gui.BROADCAST_WILL_SPIRITUALIZE, gui.Client );
})();