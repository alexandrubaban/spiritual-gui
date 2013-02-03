/*global module:false*/

module.exports = function(grunt) {

	var sourcelist = grunt.file.readJSON("grunt.json");
	sourcelist.unshift("<banner:meta.banner>");

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
				src: sourcelist,
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
				supernew: true,
				regexdash: true
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
