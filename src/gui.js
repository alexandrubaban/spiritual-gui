/**
 * Top namespace object for everything Spiritual. On startup, the global variable `gui` gets 
 * redefined to an instance of {gui.Spiritual}. All these constants get copied in the process.
 */
window.gui = {

	/**
	 * @TODO comment on 'gui.Namespace' goes here.
	 * @type {boolean}
	 */
	portals : true,

	/**
	 * Native mode: Automatically spiritualize and 
	 * materialize by overriding native DOM methods.
	 * @type {String}
	 */
	MODE_NATIVE : "native",

	/**
	 * Managed mode. Spiritualize and materialize at own risk.
	 * @type {String}
	 */
	MODE_MANAGED : "managed",

	/**
	 * @TODO: leave the URL alone a see if we can postMessage these things just in time...
	 * The {gui.IframeSpirit} will stamp this querystring parameter into any URL it loads. 
	 * The value of the parameter matches the iframespirits '$contextid'. Value becomes the 
	 * '$contextid' of the local 'gui' object (a {gui.Spiritual} instance). This establishes 
	 * a relation between iframe and hosted document that can be used for xdomain stuff. 
	 * @type {String}
	 */
	PARAM_CONTEXTID : "gui-contextid",
	PARAM_XHOST : "gui-xhost",

	/**
	 * Global broadcasts
	 * @TODO harmonize some naming with action types
	 */
	BROADCAST_KICKSTART : "gui-broadcast-kickstart",
	BROADCAST_WILL_SPIRITUALIZE : "gui-broadcast-will-spiritualize",
	BROADCAST_DID_SPIRITUALIZE : "gui-broadcast-did-spiritualize",
	BROADCAST_MOUSECLICK  : "gui-broadcast-mouseevent-click",
	BROADCAST_MOUSEMOVE : "gui-broadcast-mouseevent-mousemove",
	BROADCAST_MOUSEDOWN : "gui-broadcast-mouseevent-mousedown",
	BROADCAST_MOUSEUP : "gui-broadcast-mouseevent-mouseup",
	BROADCAST_SCROLL : "gui-broadcast-window-scroll",
	BROADCAST_RESIZE : "gui-broadcast-window-resize",
	BROADCAST_RESIZE_END : "gui-broadcast-window-resize-end",
	BROADCAST_POPSTATE : "gui-broadcast-window-popstate",
	BROADCAST_HASHCHANGE : "gui-broadcast-window-hashchange",
	BROADCAST_ORIENTATIONCHANGE : "gui-broadcast-orientationchange",
	BROADCAST_LOADING_CHANNELS : "gui-broadcast-loading-channels",
	BROADCAST_CHANNELS_LOADED : "gui-broadcast-channels-loaded",
	BROADCAST_TWEEN : "gui-broadcast-tween",
	BROADCAST_WILL_UNLOAD : "gui-broadcast-will-unload",
	BROADCAST_UNLOAD : "gui-broadcast-unload",

	/** 
	 * Plugin broadcast types that should leave core.
	 */
	BROADCAST_ATTENTION_ENTER : "gui-broadcast-attention-enter",
	BROADCAST_ATTENTION_EXIT : "gui-broadcast-attention-exit",
	BROADCAST_ATTENTION_MOVE : "gui-broadcast-attention-move",
	
	/** 
	 * Global actions
	 */
	ACTION_DOC_ONCONSTRUCT : "gui-action-document-construct",
	ACTION_DOC_ONDOMCONTENT : "gui-action-document-domcontent",
	ACTION_DOC_ONLOAD : "gui-action-document-onload",
	ACTION_DOC_ONHASH : "gui-action-document-onhash",
	ACTION_DOC_ONSPIRITUALIZED : "gui-action-document-spiritualized",
	ACTION_DOC_UNLOAD : "gui-action-document-unload",
	ACTION_DOC_FIT : "gui-action-document-fit",

	/**
	 * Framework internal actions of little use.
	 */
	$ACTION_XFRAME_VISIBILITY : "gui-action-xframe-visibility",

	/**
	 * Local actions.
	 */
	ACTION_WINDOW_LOADING : "gui-action-window-loading",
	ACTION_WINDOW_LOADED : "gui-action-window-loaded",

	/**
	 * Lifecycle types (all spirits)
	 * @TODO: add _ON* to all these
	 */
	LIFE_CONSTRUCT : "gui-life-construct",
	LIFE_CONFIGURE : "gui-life-configure",
	LIFE_ENTER : "gui-life-enter",
	LIFE_ATTACH : "gui-life-attach",
	LIFE_READY : "gui-life-ready",
	LIFE_DETACH : "gui-life-detach",
	LIFE_EXIT : "gui-life-exit",
	LIFE_ASYNC : "gui-life-async",
	LIFE_DESTRUCT : "life-destruct",
	LIFE_VISIBLE : "life-visible",
	LIFE_INVISIBLE : "life-invisible",

	/**
	 * Lifecycle types (some spirits)
	 */
	LIFE_IFRAME_CONSTRUCT : "gui-life-iframe-construct",
	LIFE_IFRAME_DOMCONTENT : "gui-life-iframe-domcontent",
	LIFE_IFRAME_SPIRITUALIZED : "gui-life-iframe-spiritualized",
	LIFE_IFRAME_ONLOAD : "gui-life-iframe-onload",
	LIFE_IFRAME_ONHASH : "gui-life-iframe-onhash",
	LIFE_IFRAME_UNLOAD : "gui-life-iframe-unload",

	/**
	 * Tick types (timed events)
	 */
	TICK_DOC_FIT : "gui-tick-document-fit", // @TODO: this in DocumentSpirit
	$TICK_INSIDE : "gui-tick-spirits-inside",
	$TICK_OUTSIDE : "gui-tick-spirits-outside",

	/**
	 * Crawler types
	 */
	CRAWLER_SPIRITUALIZE : "gui-crawler-spiritualize",
	CRAWLER_MATERIALIZE : "gui-crawler-materialize",
	CRAWLER_DETACH : "gui-crawler-detach",
	CRAWLER_DISPOSE : "gui-crawler-dispose", // ??????
	CRAWLER_ACTION : "gui-crawler-action",
	CRAWLER_VISIBLE : "gui-crawler-visible",
	CRAWLER_INVISIBLE : "gui-crawler-invisible",
	CRAWLER_DOMPATCHER : "gui-crawler-webkit-dompatcher",

	/** 
	 * CSS classnames (underscore is to indicate that the classname are managed by JS)
	 */
	CLASS_INVISIBLE : "_gui-invisible",
	CLASS_HIDDEN : "_gui-hidden",
	CLASS_COVER : "_gui-cover",

	/**
	 * Timeout in milliseconds before we decide that user is finished resizing the window.
	 */
	TIMEOUT_RESIZE_END : 250,

	/**
	 * Device orientation.
	 * @TODO Get this out of here, create gui.Device or something
	 */
	orientation : 0,
	ORIENTATION_PORTRAIT : 0,
	ORIENTATION_LANDSCAPE : 1
};