// # gui.Client
// Questionable browser identity and feature detection.
// Note that Chrome on iOS identifies itself as Safari 
// (it basically is, so that shouldn't cause concern).
gui.Client = new function Client () {

	// Expecting a lot from the user agent string... 
	var agent = navigator.userAgent.toLowerCase ();
	var root = document.documentElement;

	this.isExplorer = agent.contains ( "msie" );
	this.isOpera = agent.contains ( "opera" );
	this.isWebKit = agent.contains ( "webkit" );
	this.isChrome = this.isWebKit && agent.contains ( "chrome" );
	this.isSafari = this.isWebKit && !this.isChrome && agent.contains ( "safari" );
	this.isGecko = !this.isWebKit && !this.isOpera && agent.contains ( "gecko" );

	// "agent" is one of: "webkit" "firefox" "opera" "explorer"
	// @type {String}
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

	// "system" is one of: "linux" "osx" "ios" "windows" "windowsmobile" "haiku"
	this.system = ( function () {
		var os = null;
		[ "window mobile", "windows", "ipad", "iphone", "haiku", "os x", "linux" ].every ( function ( test ) {
			if ( agent.contains ( test )) {
				if ( test.match ( /ipad|iphone/ )) {
					os = "ios";
				} else {
					os = test.replace ( / /g, "" ); // no spaces
				}
			}
			return os === null;
		});
		return os;
	})();

	// Has touch support? Note that desktop Chrome has this.
	// @todo Investigate this in desktop IE10.
	// @type {boolean}
	this.hasTouch = ( window.ontouchstart !== undefined || this.isChrome );

	// Supports file blob?
	// @type {boolean}
	this.hasBlob = ( window.Blob && ( window.URL || window.webkitURL ));

	// Is mobile device? Not to be confused with this.hasTouch
	// @todo gui.Observerice entity?
	// @type {boolean}
	this.isMobile = ( function () {
		
		var shortlist = [ "android", "webos", "iphone", "ipad", "ipod", "blackberry", "windows phone" ];
		return !shortlist.every ( function ( system ) {
			return !agent.contains ( system );
		});
		
	})();

	// Supports CSS transitions?
	// @type {boolean}
	this.hasTransitions = ( function () {
		return ![ 
			"transition", 
			"WebkitTransition", 
			"MozTransition", 
			"OTransition", 
			"msTransition" 
			].every ( function ( test ) {
				return root.style [ test ] === undefined;
		});
	})();

	// Supports CSS 3D transform? (note https://bugzilla.mozilla.org/show_bug.cgi?id=677173)
	// @type {boolean}
	this.has3D = ( function () {
		return ![ 
			"perspective", 
			"WebkitPerspective", 
			"MozPerspective", 
			"OPerspective", 
			"msPerspective" 
			].every ( function ( test ) {
				return root.style [ test ] === undefined;
		});
	})();

	// Supports requestAnimationFrame somewhat natively?
  // @type {boolean}
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

	// Supports MutationObserver feature?
	// @type {boolean}
	this.hasMutations = ( function () {
		return ![ "", "WebKit", "Moz", "O", "Ms" ].every ( function ( vendor ) {
			return !gui.Type.isDefined ( window [ vendor + "MutationObserver" ]);
		});
	})();

	// Time in milliseconds after window.onload before we can reliably measure 
	// document height. We could in theory discriminate between browsers here, 
	// but we won't. WebKit sucks more at this and Safari on iOS is dead to me.
	// @todo Now Firefox started to suck really bad. How can we fix this mess?
	// @todo Where to move this?
	// @type {number}
	this.STABLETIME = 200;
	
	// Browsers disagree on the primary scrolling element.
	// Is it document.body or document.documentElement? 
	// @see https://code.google.com/p/chromium/issues/detail?id=2891
	// @type {HTMLElement}
	this.scrollRoot = null;

	// Scrollbar default span in pixels. 
	// Note that this is zero on mobiles.
	// @type {number}
	this.scrollBarSize = 0;

	// Supports position fixed?
	// @type {boolean}
	this.hasPositionFixed = false;

	// @todo Move this somewhere else...
	// @param {gui.Broadcast} b
	this.onbroadcast = function ( b ) {		
		if ( b.data.document === document ) {
			// What is the scroll root?
			// Supports position fixed?
			var win = window,
			doc = document,
			html = doc.documentElement,
			body = doc.body,
			root = null;
			// make sure window is scrollable
			var temp = body.appendChild ( 
				gui.SpiritCSS.style ( doc.createElement ( "div" ), {
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
			gui.SpiritCSS.style ( temp, {
				position : "fixed",
				top : "10px"
			});
			// restore scroll when finished
			var has = temp.getBoundingClientRect ().top === 10;
			this.hasPositionFixed = has;
			body.removeChild ( temp );
			win.scrollBy ( 0, -10 );
			// compute scrollbar size
			var inner = gui.SpiritCSS.style ( document.createElement ( "p" ), {
				width : "100%",
				height : "200px"
			});
			var outer = gui.SpiritCSS.style ( document.createElement ( "div" ), {
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
		}
	};
};

// Determine properties on startup.
// @todo Compute all properties only when requested (via object.defineproperties).
( function initSpiritClient () {
	gui.Broadcast.addGlobal ( gui.BROADCAST_DOMCONTENT, gui.Client );
})();