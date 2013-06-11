/**
 * @TODO !
 * @extends {gui.Crawler}
 */
gui.GuideCrawler = gui.Crawler.extend ( "gui.GuideCrawler", {

	descend : function ( start, handler ) {
		this._hans ( start );
		this._super.descend ( start, handler );
	},

	_hans : function ( elm ) {
		elm = elm instanceof gui.Spirit ? elm.element : elm;
		elm.setAttribute ( "data-gui-crawler", this.type );
		var id = elm.ownerDocument.defaultView.gui.$contextid;
		gui.Tick.add ( "john", {
			ontick : function () {
				elm.removeAttribute ( "data-gui-crawler" );
			}
		}, id ).dispatch ( "john", 0, id );
	}

});