/**
 * The task ""grunt-spiritual" may be installed 
 * via `npm install wunderbyte/grunt-spiritual`.
 */
module.exports = function ( grunt ) {

	"use strict";
	
	[ "grunt-spiritual" ].forEach ( grunt.loadNpmTasks );
	grunt.initConfig ({
		spiritual : {
			gui : {
				options : {
					banner : (
						'/**\n' +
						' * Spiritual GUI\n' +
						' * (c) 2013 Wunderbyte\n' +
						' * Spiritual is freely distributable under the MIT license.\n' +
						' */\n'
					 )
				},
				files : {
					"dist/spiritual-gui.js" : [ "src/build.json" ]
				}
			}
		}
	});
	grunt.registerTask ( "default", "spiritual" ); // "spiritualdox"
};