/**
 * Spirit action.
 * @param {gui.Spirit} target
 * @param {String} type
 * @param @optional {object} data
 * @param @optional {String} direction
 * @param @optional {boolean} global
 */
gui.Action = function Action ( target, type, data, direction, global ) {
	this.target = target;
	this.type = type;
	this.data = data;
	this.direction = direction || gui.Action.ASCEND;
	this.global = global || false;
};

gui.Action.prototype = {

	/**
	 * Who dispatched the action?
	 * @type {gui.Spirit}
	 */
	target : null,

	/**
	 * Action type eg. "save-button-clicked".
	 * @type {String}
	 */
	type : null,

	/**
	 * Optional data of any type. 
	 * This might be undefined.
	 * @type {object}
	 */
	data : null,

	/**
	 * Is travelling up or down? Matches "ascend" or "descend".
	 * @type {String}
	 */
	direction : null,

	/**
	 * Traverse iframe boundaries?
	 * @TODO cross-domain actions.
	 * @type {boolean}
	 */
	global : false,

	/**
	 * Used when posting actions xdomain. Matches an iframespirit key.
	 * @type {String}
	 */
	$instanceid : null,

	/**
	 * Is action consumed?
	 * @type {boolean}
	 */
	isConsumed : false,

	/**
	 * Is action cancelled? 
	 * @type {boolean}
	 */
	isCancelled : false,

	/**
	 * Spirit who (potentially) consumed the action.
	 * @type {gui.Spirit}
	 */
	consumer : null,

	/**
	 * Block further ascend.
	 * @param @optional {gui.Spirit} consumer
	 */
	consume : function ( consumer ) {
		this.isConsumed = true;
		this.consumer = consumer;
	},

	/**
	 * Consume and cancel the event. Note that it is 
	 * up to the dispatcher to honour cancellation.
	 * @param @optional {gui.Spirit} consumer
	 */
	cancel : function ( consumer ) {
		this.isCancelled = true;
		this.consume ( consumer );
	},

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.Action]";
	}
};


// Static .........................................................................

gui.Action.DESCEND = "descend";
gui.Action.ASCEND = "ascend";

/**
 * Dispatch action. The dispatching spirit will not `onaction()` its own action.
 * @TODO Measure performance against https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 * @TODO Class-like thing to carry all these scoped methods...
 * @TODO support custom `gui.Action` as an argument
 * @TODO common ancestor class for action, broadcast etc?
 * @param {gui.Spirit} target
 * @param {String} type
 * @param @optional {object} data
 * @param @optional {String} direction
 * @param @optional {boolean} global
 * @returns {gui.Action}
 */
gui.Action.dispatch = function dispatch ( target, type, data, direction, global ) {
	var action = new gui.Action ( target, type, data, direction, global );
	var crawler = new gui.Crawler ( gui.CRAWLER_ACTION );
	crawler.global = global || false;
	crawler [ direction || "ascend" ] ( target, {

		/*
		 * Evaluate action for spirit.
		 * @param {gui.Spirit} spirit
		 */
		handleSpirit : function ( spirit ) {
			var directive = gui.Crawler.CONTINUE;
			if ( spirit.action.contains ( type )) {
				spirit.action.$onaction ( action );
				if ( action.isConsumed ) {
					directive = gui.Crawler.STOP;
					action.consumer = spirit;
				}
			}
			return directive;
		},
		/*
		 * Teleport action across domains.
		 * @see {gui.IframeSpirit}
		 * @param {Window} win Remote window
		 * @param {String} uri target origin
		 * @param {String} key Spiritkey of xdomain IframeSpirit (who will relay the action)
		 */
		transcend : function ( win, uri, key ) {
			var msg = gui.Action.stringify ( action, key );
			win.postMessage ( msg, uri );
		}
	});
	return action;
};

/**
 * Encode action to be posted xdomain.
 * @param {gui.Action} a
 * @param @optional {String} key Associates dispatching document 
 *        to the hosting iframespirit (ascending action scenario)
 * @returns {String}
 */
gui.Action.stringify = function ( a, key ) {
	var prefix = "spiritual-action:";
	return prefix + ( function () {
		a.target = null;
		a.data = ( function ( d ) {
			if ( gui.Type.isComplex ( d )) {
				if ( gui.Type.isFunction ( d.stringify )) {
					d = d.stringify ();
				} else {
					try {
						JSON.stringify ( d ); // @TODO: think mcfly - how come not d = JSON.stringify???? (breaks iframe test)
					} catch ( jsonexception ) {
						d = null;
					}
				}
			}
			return d;
		}( a.data ));
		a.$instanceid = key || null;
		return JSON.stringify ( a );
	}());
};

/**
 * Decode action and return an action-like object.
 * @param {String} msg
 * @returns {object}
 */
gui.Action.parse = function ( msg ) {
	var prefix = "spiritual-action:";
	if ( msg.startsWith ( prefix )) {
		return JSON.parse ( msg.split ( prefix )[ 1 ]);
	}
};