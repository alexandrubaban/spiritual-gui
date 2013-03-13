/**
 * Top namespace object for everything Spiritual. On startup, the global variable `gui` gets 
 * redefined to an instance of {gui.Spiritual}. All these constants get copied in the process.
 */
window.gui = {

	/**
	 * Spiritual version. Hardcoded for now.
	 * @todo Deprecate or generate buildtime.
	 * @type {String}
	 */
	version : "0.0.5",

	/**
	 * Native mode: Overloading native DOM methods.
	 * @type {String}
	 */
	MODE_NATIVE : "native",

	/**
	 * jquery mode: Overloading JQuery DOM methods.
	 * @type {String}
	 */
	MODE_JQUERY : "jquery",

	/**
	 * Optimized mode: try native and fallback on jquery.
	 * @type {String}
	 */
	MODE_OPTIMIZE : "optimize",

	/**
	 * Managed mode.
	 * @type {String}
	 */
	MODE_MANAGED : "managed",

	/**
	 * Global broadcasts
	 * @todo harmonize some naming with action types
	 */
	BROADCAST_KICKSTART : "gui-broadcast-kickstart",
	BROADCAST_DOMCONTENT : "gui-broadcast-document-domcontentloaded",
	BROADCAST_ONLOAD : "gui-broadcast-window-onload",
	BROADCAST_UNLOAD : "gui-broadcast-window-unload",
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
	BROADCAST_LOADING_CHANNELS : "gui-broadcast-loading-channels",
	BROADCAST_CHANNELS_LOADED : "gui-broadcast-channels-loaded",
	BROADCAST_TWEEN : "gui-broadcast-tween",

	/** 
	 * Plugin broadcast types
	 */
	BROADCAST_ORIENTATIONCHANGE : "gui-broadcast-orientationchange",
	BROADCAST_TOUCHSTART : "gui-broadcast-touchstart",
	BROADCAST_TOUCHEND : "gui-broadcast-touchend",
	BROADCAST_TOUCHCANCEL : "gui-broadcast-touchcancel",
	BROADCAST_TOUCHLEAVE : "gui-broadcast-touchleave",
	BROADCAST_TOUCHMOVE : "gui-broadcast-touchmove",
	BROADCAST_DRAG_START : "gui-broadcast-drag-start",
	BROADCAST_DRAG_END : "gui-broadcast-drag-end",
	BROADCAST_DRAG_DROP : "gui-broadcast-drag-drop",
	BROADCAST_COMMAND : "gui-broadcast-command",
	BROADCAST_OUTPUT : "gui-broadcast-output",
	BROADCAST_INPUT : "gui-broadcast-input",
	BROADCAST_DATA_PUB : "gui-broadcast-data-pub",
	BROADCAST_DATA_SUB : "gui-broadcast-data-sub",
	BROADCAST_SCRIPT_INVOKE : "gui-broadcast-spiritscript-invoke",
	BROADCAST_ATTENTION_ON : "gui-broadcast-attention-on",
	BROADCAST_ATTENTION_OFF : "gui-broadcast-attention-off",
	BROADCAST_ATTENTION_GO : "gui-broadcast-attention-go",

	/** 
	 * Global actions
	 */
	ACTION_DOCUMENT_CONSTRUCT : "gui-action-document-construct",
	ACTION_DOCUMENT_READY : "gui-action-document-ready",
	ACTION_DOCUMENT_ONLOAD : "gui-action-document-onload",
	ACTION_DOCUMENT_UNLOAD : "gui-action-document-unload",
	ACTION_DOCUMENT_FIT : "gui-action-document-fit",
	ACTION_DOCUMENT_DONE : "gui-action-document-done",

	/**
	 * Local actions.
	 */
	ACTION_WINDOW_LOADING : "gui-action-window-loading",
	ACTION_WINDOW_LOADED : "gui-action-window-loaded",

	/**
	 * Lifecycle types.
	 */
	LIFE_CONSTRUCT : "gui-life-construct",
	LIFE_CONFIGURE : "gui-life-configure",
	LIFE_ENTER : "gui-life-enter",
	LIFE_ATTACH : "gui-life-attach",
	LIFE_READY : "gui-life-ready",
	LIFE_SHOW : "gui-life-show",
	LIFE_HIDE : "gui-life-hide",
	LIFE_DETACH : "gui-life-detach",
	LIFE_EXIT	: "gui-life-exit",
	LIFE_DESTRUCT : "life-destruct",

	/**
	 * Tick types (timed events)
	 */
	TICK_DESTRUCT_DETACHED : "gui-tick-destruct-detached",
	TICK_SPIRIT_NULL : "gui-tick-spirit-null",
	TICK_FIT : "gui-tick-fit",

	/**
	 * Crawler types
	 */
	CRAWLER_ATTACH : "gui-crawler-attach",
	CRAWLER_DETACH : "gui-crawler-detach",
	CRAWLER_DISPOSE : "gui-crawler-dispose",
	CRAWLER_ACTION : "gui-crawler-action",
	CRAWLER_VISIBLE : "gui-crawler-visible",
	CRAWLER_INVISIBLE : "gui-crawler-invisible",

	/** 
	 * CSS classnames. Underscore indicates that the classname are managed by JS.
	 */
	CLASS_INVISIBLE : "_gui-invisible",
	CLASS_HIDDEN : "_gui-hidden",

	/**
	 * Device orientation.
	 * @todo Get this out of here, create gui.Device or something
	 */
	orientation : 0,
	ORIENTATION_PORTRAIT : 0,
	ORIENTATION_LANDSCAPE : 1
};