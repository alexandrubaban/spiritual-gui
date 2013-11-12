/**
 * Det er bare super.
 * @param {function} C
 */
gui.Super = function Super ( C ) {
	gui.Super.generateStubs ( this, C.prototype );
};

gui.Super.prototype = Object.create ( null );


// Static .......................................................................

gui.Object.each ({ // generating static methods

	/**
	 * Instance of gui.Class which is now invoking _super()
	 * @type {object}
	 */
	$subject : null,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[function gui.Super]";
	},

	/**
	 * Declare all method stubs on {gui.Super} instance.
	 * @param {gui.Super} suber
	 * @param {object} proto
	 */
	generateStubs : function ( suber, proto ) {
		gui.Object.methods ( proto ).forEach ( function ( name ) {
			gui.Super.generateStub ( suber, proto, name );
		}, this );
	},

	/**
	 * Declare single method stub on {gui.Super} instance.
	 * @param {gui.Super} suber
	 * @param {object} proto
	 * @param {String} name Method name
	 */
	generateStub : function ( suber, proto, name ) {
		var func = suber [ name ] = function () {
			return proto [ name ].apply ( gui.Super.$subject, arguments );
		};
		func.displayName = name;
	},

	/**
	 * Transfer methods from protos to proto 
	 * while decorating for `_super` support.
	 * @param {function} SuperC
	 * @param {object} C
	 * @param {object} protos
	 */
	support : function ( SuperC, C, protos ) {
		var proto = C.prototype;
		var combo = this._decorator ( SuperC );
		gui.Object.each ( protos, function ( key, base ) {
			if ( gui.Type.isMethod ( base )) {
				proto [ key ] = combo ( base );
				proto [ key ].toString = function () {
					var original = base.toString ().replace ( /\t/g, "  " );
					return gui.Super._DISCLAIMER + original;
				};
			}
		}, this );
	},


	// Private static .......................................................

	/**
	 * Prepended to the result of calling 
	 * toString() on a modified function.
	 * @type {String}
	 */
	_DISCLAIMER : "/**\n" +
		"  * Method was mutated by the framework. \n" +
		"  * This is an approximation of the code. \n" +
		"  */\n",

	/**
	 * @type {String}
	 */
	_ASYNCERROR : "" +
		"'this._super' only works in synchronous code. Are you using a timeout? " +
		"Move the '_super' call to another method or use 'otherfunction.apply()'",

	/**
	 * Get tricky decorator.
	 * @param {function} SuperC
	 * @returns {function}
	 */
	_decorator : function ( SuperC ) {
		return function ( base ) {
			return function () {
				return gui.Super._super ( this, base, arguments, SuperC );
			};
		};
	},

	/**
	 * Attempt to apply base method of superclass to instance.
	 * @param {object} that
	 * @param {function} base
	 * @param {Arguments} args
	 * @param {function} SuperC
	 * @returns {object}
	 */
	_super : function ( that, base, args, SuperC ) {
		var res, sub = gui.Super.$subject;
		if ( that ) {
			gui.Super.$subject = that;
			that._super = SuperC.$super;
			res = base.apply ( that, args );
			gui.Super.$subject = sub;
		} else {
			gui.Super._fail ();
		}
		return res;
	},

	/**
	 * Fails on async execution given the tricky setup above.
	 */
	_fail : function () {
		throw new Error ( gui.Super._ASYNCERROR );
	}

}, function ( name, value ) {
	gui.Super [ name ] = value;
});