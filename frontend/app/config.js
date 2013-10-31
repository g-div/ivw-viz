// Set the require.js configuration for your application.
require.config({
	urlArgs: "bust=" + (new Date()).getTime(),
	deps: ["main"],
	paths: {
		"underscore": "../lib/underscore/underscore",
		"lodash": "../lib/underscore/lodash.underscore",

		"backbone": "../lib/backbone/backbone",
		"backbone.wreqr": "../lib/backbone/backbone.wreqr",
		"backbone.babysitter": "../lib/backbone/backbone.babysitter",
		"backbone.marionette": "../lib/backbone/backbone.marionette",

		"d3": "../lib/d3/d3.v3",
		"nvd3": "../lib/d3/nv.d3",
		"topojson": "../lib/topojson",

		"jquery": "../lib/jquery/jquery",
		"jquerymobile": "../lib/jquery/jquery.mobile.custom",

		"spin": "../lib/spin",
		"text": "../lib/require/text",

	},

	map: {
		"*": {
			"underscore": "lodash",
		}
	},

	shim: {
		"d3": {
			"exports": "d3"
		},

		"nvd3": {
			"exports": "nv",
			"deps": ["d3"]
		},

		"topojson": {
			"exports": 'topojson'
		},

		"jquerymobile": {
			"deps": ["jquery"]
		},

		"backbone": {
			"deps": ["jquery", "underscore"],
			"exports": "Backbone"
		}
	}
});