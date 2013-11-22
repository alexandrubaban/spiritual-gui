/**
 * Simplistic support for pseudokeyword 'this._super'. 
 * @param {function} C
 */
gui.Super = function Super ( C ) {
	gui.Super.generateStubs ( this, C.prototype );
};

gui.Super.prototype = Object.create ( null );


// Static .......................................................................

gui.Object.extend ( gui.Super, {

	/**
	 * Class instance which is now invoking _super()
	 * @type {gui.Class}
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
				if ( gui.debug ) {
					proto [ key ].toString = function () {
						var original = base.toString ().replace ( /\t/g, "  " );
						return gui.Super._DISCLAIMER + original;
					};
				}
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
	 * Excuses.
	 * @type {String}
	 */
	_ERROR : "" +
		"Lost the track in 'this._super'. Super doesn't work well in asynchronous code, are we using " +
		"a timeout? Perhaps move the 'this._super' call to another method or use 'othermethod.apply(this)'",

	/**
	 * Get tricky decorator.
	 * @param {function} SuperC
	 * @returns {function}
	 */
	_decorator : function ( SuperC ) {
		return function ( base ) {
			return function supercall () {
				return gui.Super._supercall ( this, base, arguments, SuperC );
			};
		};
	},

	/**
	 * Attempt to apply base method of superclass to instance.
	 * Fails on async execution given the fishy setup we have.
	 * @param {object} that
	 * @param {function} base
	 * @param {Arguments} args
	 * @param {function} SuperC
	 * @returns {object}
	 */
	_supercall : function ( that, base, args, SuperC ) {
		var res, sub = gui.Super.$subject;
		if ( that ) {
			gui.Super.$subject = that;
			that._super = SuperC.$super;
			res = base.apply ( that, args );
			gui.Super.$subject = sub;
		} else {
			throw new ReferenceError ( gui.Super._ERROR );
		}
		return res;
	}

});