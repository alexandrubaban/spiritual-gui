/**
 * Experimental namespace concept.
 * @param {Window|WorkerScope}
 * @param {String} ns
 * @param {Object} defs
 */
gui.Namespace = function Namespace ( ns, context ) {
	this.$context = context;
	this.$ns = ns;
};

gui.Namespace.prototype = {

	/**
	 * @deprecated
	 * Members may be portalled into subframes via the 'gui.portal' method?
	 * @type {boolean}
	 */
	portals : false,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[namespace " + this.$ns + "]";
	},

	/**
	 * Compute classnames for class-type members.
	 * @returns {gui.Namespace}
	 */
	spacename : function () {
		this._spacename ( this, this.$ns );
		return this;
	},

	/**
	 * Name members recursively.
	 * @TODO: Recurse on object values to name deeply nested?
	 * @param {object|function} o
	 * @param {String} name
	 */
	_spacename : function ( o, name ) {
		var key, val;
		for ( key in o ) {
			if ( !o.hasOwnProperty || o.hasOwnProperty ( key )) {
				if ( key !== "$superclass" ) {
					if ( gui.Type.isFunction (( val = o [ key ]))) {
						if ( val.$classname === gui.Class.ANONYMOUS ) {
							this._spacename ( val, name + "." + key );
							val.$classname = name + "." + key;
						}
					}
				}
			}
		}
	},


	// Secrets .............................................

	/**
	 * Namespace string.
	 * @type {String}
	 */
	$ns : null,

	/**
	 * Declaration context.
	 * @type {Window|WorkerScope}
	 */
	$context : null
};

/**
 * Hm.
 * @param {Window|WorkerScope} context
 * @param {String} objectpath
 * @param {gui.Namespace} namespace
 * @throws {ReferenceError}
 */
gui.Namespace.validate = function ( context, ns, namespace ) {
	gui.Tick.next ( function () {
		if ( gui.Object.lookup ( ns, context ) !== namespace ) {
			throw new ReferenceError ( "The string \"" + ns + "\" must evaluate to a namespace object." );
		}
	}, this );
};