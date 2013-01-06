/**
 * @param {String} type
 */
gui.Tween = function ( type ) {

	this.type = type;
};

gui.Tween.prototype = {

	/**
	 * @type {String}
	 */
	type : null,

	/**
	 * Between zero and one.
	 * @type {number}
	 */
	value : 0,

	/**
	 * Done when value is one.
	 * @type {boolean}
	 */
	done : false
};

// STATICS .............................

/*
gui.Tween.add = function () {
	throw new Error ( "TODO" );
};

gui.Tween.remove = function () {
	throw new Error ( "TODO" );
};

gui.Tween.addGlobal = function ( type, handler ) {

};

gui.Tween.removeGlobal = function ( type, handler ) {

};
*/

/** 
 * Coordinate a global (cross frame) animation sequence.
 * @param {ui.Animation} animation
 * @returns {gui.Tween} but why?
 */
gui.Tween.dispatchGlobal = function(type,data){

	var that = this;
	var start = new Date().getTime();
	var tween = new gui.Tween(type);
	var duration = data ? ( data.duration || 200 ) : 200;
	var timing = data ? ( data.timing || "none" ) : "none";

	tween.data = data; // ?

	function step(time) {
		var value = 1, progress = time-start;
		if(progress<duration){
			value = progress/duration;
			if(timing !== "none"){
				value = value*90*Math.PI/180;
				switch(timing){
					case "ease-in" :
						value = 1-Math.cos(value);
						break;
					case "ease-out" :
						value = Math.sin(value);
						break;
				}
			}
		}
		tween.value = value;
		if(value===1){
			tween.done = true;
		} else {
			requestAnimationFrame(step);
		}
		gui.Broadcast.dispatchGlobal(null,gui.BROADCAST_TWEEN,tween);
	}
	step(start);
	return tween;
};