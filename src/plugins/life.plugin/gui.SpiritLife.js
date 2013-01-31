/**
 * # gui.SpiritLife
 * SpiritLife is a non-bubbling event type that covers the life cycle of a spirit.
 * @see {gui.SpiritLifeTracker}
 * @param {gui.Spirit} target
 * @param {String} type
 */
gui.SpiritLife = function SpiritLife ( target, type ) {
	this.target = target;
	this.type = type;
};

gui.SpiritLife.prototype = {

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
		return "[object gui.SpiritLife]";
	}
};


 // Static .....................................

 /**
 * Important milestones in the life of a spirit.
 * @todo perhaps move to gui.js
 */
gui.SpiritLife.CONSTRUCT = "gui-life-construct";
gui.SpiritLife.CONFIGURE = "gui-life-configure";
gui.SpiritLife.ENTER = "gui-life-enter";
gui.SpiritLife.ATTACH = "gui-life-attach";
gui.SpiritLife.READY = "gui-life-ready";
gui.SpiritLife.SHOW = "gui-life-show";
gui.SpiritLife.HIDE = "gui-life-hide";
gui.SpiritLife.DETACH = "gui-life-detach";
gui.SpiritLife.EXIT	= "gui-life-exit";
gui.SpiritLife.DESTRUCT = "life-destruct";