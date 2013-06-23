/**
 * Encapsulates a callback for future use. 
 * @TODO mimic DOM Futures to some degree.
 * @param @optional {function} callback
 * @param @optional {object} thisp
 */
gui.Then = function Then ( callback, thisp ) {
  if ( callback ) {
    this.then ( callback, thisp );
  }
};

gui.Then.prototype = {

  /**
   * Identification.
   * @returns {String}
   */
  toString : function () {
    return "[object gui.Then]";
  },

  /**
   * Setup callback with optional this-pointer.
   * @param {function} callback
   * @param @optional {object} pointer
   */
  then : function ( callback, thisp ) {
    this._callback = callback ? callback : null;
    this._pointer = thisp ? thisp : null;
    if ( this._now ) {
      this.now ();
    }
  },  

  /**
   * Callback with optional this-pointer.
   * @returns {object}
   */
  now : function () {
    var c = this._callback;
    var p = this._pointer;
    if ( c ) {
      this.then ( null, null );
      c.apply ( p, arguments );
    } else {
      this._now = true;
    }
  },


  // Private .................................................

  /**
   * Callback to execute.
   * @type {function}
   */
  _callback : null,

  /**
   * "this" keyword in callback.
   * @type {object}
   */
  _pointer : null,

  /**
   * Execute as soon as callback gets delivered?
   * @type {boolean}
   */
  _now : false

};
