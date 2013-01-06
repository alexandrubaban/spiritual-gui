/*global module:false*/

module.exports = function(grunt) {
	grunt.initConfig({
		meta: {
			version: '0.0.4',
			banner : '' +
				'/*\n' +
				' * Spiritual GUI <%= meta.version %>\n' +
				' * (c) <%= grunt.template.today("yyyy") %> Wunderbyte\n' +
				' * Spiritual is freely distributable under the MIT license.\n' +
				' */'
		},
		lint: {
			files: ['grunt.js', 'src/**/*.js']
		},
		concat: {
			dist: {
				src: [
					'<banner:meta.banner>',
					"src/boot/gui.js",
					"src/boot/gui.SpiritualAid.js",
					"src/boot/gui.Spiritual.js",
	
					"src/lang/gui.Arguments.js",
					"src/lang/gui.Exemplar.js",
					"src/lang/gui.Interface.js",
					"src/lang/gui.Combinator.js",
					"src/lang/gui.Object.js",
					"src/lang/gui.Super.js",
					"src/lang/gui.Type.js",
	
					"src/abstract/gui.Position.js",
					"src/abstract/gui.Dimension.js",
					"src/abstract/gui.Geometry.js",
	
					"src/utils/gui.URL.js",
					"src/utils/gui.Then.js",
					"src/utils/gui.HTMLParser.js",
					"src/utils/gui.DOMSerializer.js",
					"src/utils/gui.FileLoader.js",
					"src/utils/gui.BlobLoader.js",
					"src/utils/gui.EventSummary.js",
					"src/utils/gui.Crawler.js",
					"src/utils/gui.KeyMaster.js",
					"src/utils/gui.Request.js",
	
					"src/core/gui.Spirit.js",
	
					"src/plugins/gui.SpiritPlugin.js",
					"src/plugins/gui.SpiritTracker.js",
					"src/plugins/life.plugin/gui.SpiritLife.js",
					"src/plugins/life.plugin/gui.SpiritLifeTracker.js",
					"src/plugins/config.plugin/gui.SpiritConfig.js",
	
					"src/modules/core.module/plugins/action.plugin/gui.Action.js",
					"src/modules/core.module/plugins/action.plugin/gui.ActionTracker.js",
					"src/modules/core.module/plugins/action.plugin/gui.IActionHandler.js",
					"src/modules/core.module/plugins/att.plugin/gui.SpiritAtt.js",
					"src/modules/core.module/plugins/box.plugin/gui.SpiritBox.js",
					"src/modules/core.module/plugins/broadcast.plugin/gui.Broadcast.js",
					"src/modules/core.module/plugins/broadcast.plugin/gui.BroadcastTracker.js",
					"src/modules/core.module/plugins/broadcast.plugin/gui.IBrodcastHandler.js",
					"src/modules/core.module/plugins/css.plugin/gui.SpiritCSS.js",
					"src/modules/core.module/plugins/dom.plugin/gui.SpiritDOM.js",
					"src/modules/core.module/plugins/event.plugin/gui.EventTracker.js",
					"src/modules/core.module/plugins/event.plugin/gui.IEventHandler.js",
					"src/modules/core.module/plugins/tick.plugin/gui.Tick.js",
					"src/modules/core.module/plugins/tick.plugin/gui.TickTracker.js",
					"src/modules/core.module/plugins/tick.plugin/gui.ITickHandler.js",
					"src/modules/core.module/plugins/tween.plugin/gui.Tween.js",
					"src/modules/core.module/plugins/tween.plugin/gui.TweenTracker.js",
					"src/modules/core.module/plugins/transition.plugin/gui.TransitionPlugin.js",
					"src/modules/core.module/plugins/transition.plugin/gui.Transition.js",
					"src/modules/core.module/plugins/attention.plugin/gui.AttentionPlugin.js",
					"src/modules/core.module/core.module.js",
				
					"src/core/gui.Client.js",
					
					"src/modules/core.module/spirits/gui.DocumentSpirit.js",
					"src/modules/core.module/spirits/gui.WindowSpirit.js",
					"src/modules/core.module/spirits/gui.IframeSpirit.js",
					"src/modules/core.module/spirits/gui.StyleSheetSpirit.js",
					"src/modules/core.module/spirits/gui.ActionSpirit.js",
					"src/modules/core.module/spirits/gui.CoverSpirit.js",
				
					"src/modules/jquery.module/jquery.module.js",
	
					"src/core/gui.UPGRADE.js",
					"src/core/gui.WEBKIT.js",

					"src/core/gui.Observer.js",
					"src/core/gui.World.js",
					"src/core/gui.Guide.js"
				],
				dest: 'dist/spiritual-gui-<%= meta.version %>.js',
				separator : "\n\n\n"
			}
		},
		min: {
			dist: {
				src: ['<banner:meta.banner>','<config:concat.dist.dest>'],
				dest: 'dist/spiritual-gui-<%= meta.version %>.min.js'
			}
		},
		watch: {
			files: '<config:.files>',
			tasks: 'lint'
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true,
				smarttabs:true, // https://github.com/jshint/jshint/issues/585
				onecase: true,
				scripturl: true,
				laxbreak: true,
				supernew: true
			},
			globals: {
				gui: true,
				console: true,
				setImmediate : true,
				requestAnimationFrame : true,
				Map : true,
				Set : true,
				WeakMap : true
			}
		},
		uglify: {}
	});

	// default task
	grunt.registerTask('default', 'lint concat min');
};
