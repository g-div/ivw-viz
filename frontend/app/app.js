define([

	'bbloader',
	'text!templates/main.html'

], function(Backbone, MainTemplate) {

	var App = new Backbone.Marionette.Application();

	var Config = Backbone.Model.extend({
		defaults: {
			url: "http://localhost:5000/api/",
			year: "1998",
			quartal: "1",
			city: "Berlin",
			ediction: "Mo-Fr",
			detailsId: "",
			publisher: "",
			detailed: false,
			pie: true
		}
	});

	App.config = new Config();

	App.addRegions({
		mainRegion: "body"
	});

	MapRegion = Backbone.Marionette.Layout.extend({
		template: _.template(MainTemplate),

		regions: {
			details: "#details-container",
			map: "#map-container",
			timeline: "#timeline-container"
		}

	});

	App.mainRegion.layout = new MapRegion();
	App.mainRegion.layout.render();


	App.mainRegion.show(App.mainRegion.layout);

	App.on('initialize:after', function() {
		Backbone.history.start();
	});

	return App
});
