/**
 * Key event summary.
 * @TODO check out http://mozilla.pettay.fi/moztests/events/browser-keyCodes.htm
 * @param {boolean} down
 * @param {number} n KeyCode
 * @param {number} c Character
 * @param {boolean} g Global?
 */
gui.Key = function Key ( down, n, c, g ) {
	this.up = !down;
	this.down = down;
	this.code = n;
	this.char = c;
	this.global = g;
};

gui.Key.prototype = {

	/**
	 * Key released?
	 * @type {boolean}
	 */
	up : false,

	/**
	 * Key down?
	 * @type {boolean}
	 */
	down : false,

	/**
	 * Identifies physical keys by keyCode.
	 * @type {number}
	 */
	code : -1,

	/**
	 * Identifies typed character. This is `null` for 
	 * special keys such as arrow keys and page down.
	 * http://stackoverflow.com/questions/7226402/help-with-regex-pattern-for-delete-arrows-and-escape-keys
	 * http://javascript.info/tutorial/keyboard-events
	 * @TODO keyword breaks parsers?
	 * @type {String}
	 */
	char : null,

	/**
	 * Reserved for a distant future where browsers implement DOM3 keys.
	 * @type {String}
	 */
	key : null,

	/**
	 * Global key?
	 * @TODO Deprecate this?
	 * @type {boolean}
	 */
	global : false
};


// Static .........................................................................................

/**
 * Key modifiers.
 * @TODO: platform specific variations "accelDown" and "accessDown" (get a Mac and figure this out)
 * @TODO Update from http://askubuntu.com/questions/19558/what-are-the-meta-super-and-hyper-keys
 */
( function keymodifiers () {
	gui.Object.each ({
		shiftDown : false, // The Shift key.
		ctrlDown : false,  // The Control key.
		altDown : false,   // The Alt key. On the Macintosh, this is the Option key
		metaDown : false,  // The Meta key. On the Macintosh, this is the Command key.
		accelDown : false, // The key used for keyboard shortcuts on the user's platform. Usually, this would be the value you would use.
		accessDown : false // The access key for activating menus and other elements. On Windows, this is the Alt key, used in conjuction with an element's accesskey.
	}, function ( key, value ) {
		gui.Key [ key ] = value;
	});
}());

/**
 * These key codes "do not usually change" with keyboard layouts.
 * @TODO Read http://www.w3.org/TR/DOM-Level-3-Events/#key-values
 * @TODO http://www.w3.org/TR/DOM-Level-3-Events/#fixed-virtual-key-codes
 * @TODO http://www.w3.org/TR/DOM-Level-3-Events/#key-values-list
 */
( function keyconstants () {
	gui.Object.each ({
		BACKSPACE :	8,
		TAB	: 9,
		ENTER	: 13,
		SHIFT	: 16,
		CONTROL	: 17,
		ALT	: 18,
		CAPSLOCK : 20,
		ESCAPE : 27,
		SPACE	: 32,
		PAGE_UP	: 33,
		PAGE_DOWN	: 34,
		END	: 35,
		HOME : 36,
		LEFT : 37,
		UP : 38,
		RIGHT : 39,
		DOWN : 40,
		DELETE : 46
	}, function ( key, value ) {
		gui.Key [ key ] = value;
	});
}());

/**
 * These codes are somewhat likely to match a US or European keyboard, 
 * but they are not listed in the above "do not usually change" section. 
 */
( function questionablekeys () {
	gui.Object.each ({
		PLUS: 187,
		MINUS: 189,
		NUMPLUS: 107,
		NUMMINUS: 109
	}, function ( key, value ) {
		gui.Key [ key ] = value;
	});
}());