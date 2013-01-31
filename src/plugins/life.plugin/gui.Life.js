/**
 * # gui.Life
 * SpiritLife is a non-bubbling event type that covers the life cycle of a spirit.
 * @see {gui.LifePlugin}
 * @param {gui.Spirit} target
 * @param {String} type
 */
gui.Life = function SpiritLife ( target, type ) {
	this.target = target;
	this.type = type;
};

gui.Life.prototype = {

	/**
	 * @type {gui.Spirit}
	 */
	target : null,

	/**
	 * @type {String}
	 */
	type : null,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.Life]";
	}
};


 // Static .....................................

 /**
 * Important milestones in the life of a spirit.
 * @todo perhaps move to gui.js
 */
gui.Life.CONSTRUCT = "gui-life-construct";
gui.Life.CONFIGURE = "gui-life-configure";
gui.Life.ENTER = "gui-life-enter";
gui.Life.ATTACH = "gui-life-attach";
gui.Life.READY = "gui-life-ready";
gui.Life.SHOW = "gui-life-show";
gui.Life.HIDE = "gui-life-hide";
gui.Life.DETACH = "gui-life-detach";
gui.Life.EXIT	= "gui-life-exit";
gui.Life.DESTRUCT = "life-destruct";