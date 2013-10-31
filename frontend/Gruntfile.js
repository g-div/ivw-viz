module.exports = function(grunt) {

	grunt.loadNpmTasks("grunt-cssjoin");
	grunt.loadNpmTasks("grunt-targethtml");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-requirejs");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-jst");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-compass");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-uglify");

	grunt.registerTask("default", ["release"]);
	grunt.registerTask("debug", [
		"clean:debug", "jst", "requirejs", "compass:debug", "concat:debug",
		"cssjoin", "targethtml:debug", "copy:debug"]);
	grunt.registerTask("release", [
		"debug", "uglify", "cssmin", "targethtml:release", "copy:release"]);

	grunt.initConfig({

		// The clean task ensures all files are removed from the dist/ directory so
		// that no files linger from previous builds.
		clean: {
			debug: "dist/debug/",
			release: "dist/release/"
		},

		// The jst task compiles all application templates into JavaScript
		// functions with the underscore.js template function
		jst: {
			"dist/debug/templates.js": [
				"app/templates/**/*.html"]
		},

		// The concatenate task is used here to merge the almond require/define
		// shim and the templates into the application code.  It's named
		// dist/debug/require.js, because we want to only load one script file in
		// index.html.
		concat: {
			debug: {
				src: [
					"lib/require/almond.js",
					"dist/debug/templates.js",
					"dist/debug/require.js"],
				dest: "dist/debug/require.js",
				separator: ";"
			}
		},

		// watch sass files
		watch: {
			files: ["app/sass/**/*.sass"],
			tasks: "compass"
		},

		// compile sass
		compass: {
			debug: {
				options: {
					sassDir: "app/sass",
					cssDir: "app/styles",
					debugInfo: true,
					fontDir: "font/",
					relativeAssets: true
				}
			},
			release: {
				options: {
					sassDir: "app/sass",
					cssDir: "app/styles",
					debugInfo: false
				}
			}
		},

		// index.html to dist
		targethtml: {
			debug: {
				src: "index.html",
				dest: "dist/debug/index.html"
			},
			release: {
				src: "index.html",
				dest: "dist/release/index.html"
			}
		},

		// joins @include
		cssjoin: {
			join: {
				files: {
					"dist/debug/index.css": "app/styles/index.css"
				}
			}
		},

		// Builds optimized require.js including all dependencies
		// https://github.com/gruntjs/grunt-contrib-requirejs
		requirejs: {
			debug: {
				options: {
					mainConfigFile: "app/config.js",
					out: "dist/debug/require.js",
					name: "config"
				}
			}
		},

		uglify: {
			release: {
				files: {
					"dist/release/require.js": ["dist/debug/require.js"]
				}
			}
		},

		cssmin: {
			release: {
				src: "dist/debug/index.css",
				dest: "dist/release/index.css"
			}
		},

		// copy font files
		copy: {
			debug: {
				files: [{
					expand: true,
					cwd: "app/styles/font-awesome/font/",
					src: "fontawesome-webfont.{eot,woff,ttf}",
					dest: "dist/debug/font/"
				}]
			},
			release: {
				files: [{
					expand: true,
					cwd: "app/styles/font-awesome/font/",
					src: "fontawesome-webfont.{eot,woff,ttf}",
					dest: "dist/release/font/"
				}]
			}
		},

		// The headless QUnit testing environment is provided for "free" by Grunt.
		// Simply point the configuration to your test directory.
		qunit: {
			all: ["test/qunit/*.html"]
		},

		// The headless Jasmine testing is provided by grunt-jasmine-task. Simply
		// point the configuration to your test directory.
		jasmine: {
			all: ["test/jasmine/*.html"]
		},

		// dev server
		connect: {
			server: {
				options: {
					port: 7000,
					keepalive: true
				}
			}
		}

	});

};