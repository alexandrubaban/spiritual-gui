/*global module:false*/

module.exports = function(grunt) {

	// (npm uninstall -g grunt)
	// npm install -g grunt-cli
	// npm install -g grunt --save-dev
	// npm install grunt-contrib-concat --save-dev // https://developer.webinos.org/forums/intall-error-linux
	// npm install grunt-contrib-uglify --save-dev 
	// npm install grunt-contrib-jshint --save-dev

	var BANNER = '' +
		'/*\n' +
		' * Spiritual GUI <%= meta.version %>\n' +
		' * (c) <%= grunt.template.today("yyyy") %> Wunderbyte\n' +
		' * Spiritual is freely distributable under the MIT license.\n' +
		' */\n';

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-jshint");

	var sourcelist = grunt.file.readJSON("grunt.json");
	sourcelist.unshift("<banner:meta.banner>");

	grunt.initConfig({
		meta: {
			version: "0.0.4",
			banner : BANNER
		},
		jshint: {
			all: [ "Gruntfile.js", "src/**/*.js" ],
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true, newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true,
				smarttabs:true,
				onecase: true,
				scripturl: true,
				laxbreak: true,
				supernew: true,
				regexdash: true,
				globals: {
					gui: true,
					console: true,
					setImmediate : true,
					requestAnimationFrame : true,
					Map : true,
					Set : true,
					WeakMap : true
				}
			}
		},
		concat: {
			dist: {
				src: sourcelist,
				dest: 'dist/spiritual-gui-<%= meta.version %>.js',
				separator : "\n\n\n"
			}
		},
		uglify: {
	    options: {
	      mangle: false,
	      banner: BANNER
	    },
	    my_target: {
	      files: {
	        'dist/spiritual-gui-<%= meta.version %>.min.js': ['dist/spiritual-gui-<%= meta.version %>.js']
	      }
	    }
	  }
		//uglify: {}
	});

	// default task
	grunt.registerTask('default', [ "jshint", "concat","uglify" ]);
};
