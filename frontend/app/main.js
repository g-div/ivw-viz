require([
	"jquery",
	"bbloader",
	"nvd3",
	"app",
	"views/map",
	"views/verlaege",
	"views/details",
	"views/graphview",

], function($, Backbone, nv, App, MapView, VerlaegeView, DetailsView, GraphView) {

	// TODO: 1 Verlag, 1 Zeitung, Test to clean
	// 	 gesamt statt single
	// 	 BILD
	//
	// TODO: Vergleich DIAGRAMM
	// TODO: Karte mit punkte

	var MainView = Backbone.Marionette.ItemView.extend({
		model: App.config,
		map: null,
		timeline: $("#timeline"),
		interval: null,
		playstate: false,

		initialize: function() {
			this.model.on("change", this.updateDetails);

			this.map = new MapView();
			App.mainRegion.layout.map.show(this.map);

			this.initSlider();
			this.addHandlers();

			var that = this;
			$("#play").click(function() {
				if (!that.playstate) {
					that.play();
					that.playstate = true;
				}
			});
			$("#stop").click(function() {
				that.stop();
				that.playstate = false;
			});

			//var verlag = new VerlaegeView()
			var graph = new GraphView();

		},

		play: function() {
			var that = this;
			this.interval = window.setInterval(function() {
				that.playYears(this)
			}, 1000);
		},

		stop: function() {
			clearInterval(this.interval);
		},

		playYears: function() {
			var currentYear = App.config.get("year");
			if (parseInt(currentYear) <= 2012) {
				this.timeline.val(parseInt(currentYear) + 1);
				this.timeline.slider("refresh");

			} else {
				App.config.set("year", 1998);
			}
		},

		updateDetails: function(model) {
			if (typeof(model.changed.detailsId) !== "undefined") {
				var details = new DetailsView({
					detailsId: App.config.get("detailsId")
				});
			} else if (typeof(model.changed.publisher) !== "undefined") {
				var details = new DetailsView({
					quartal: App.config.get("year") + App.config.get("quartal"),
					ediction: App.config.get("ediction"),
					publisher: App.config.get("publisher")
				});
			} else {
				var details = new DetailsView({
					quartal: App.config.get("year") + App.config.get("quartal"),
					ort: App.config.get("city"),
					ediction: App.config.get("ediction")
				});
			}

			App.mainRegion.layout.details.show(details);
			//$("#details-container *").hide();
			//$("#details-container *").fadeIn("slow");
		},

		initSlider: function() {
			this.timeline.hide();
			this.timeline.slider();
		},

		addHandlers: function() {
			var that = this;
			this.timeline.change(function() {
				App.config.set({
					year: that.timeline.val()
				});
				that.map.renderCities();
			});

			$("#ediction-selector").change(function() {
				App.config.set({
					ediction: $("#ediction-selector").val()
				});
			});
		}

	});

	return new MainView();

});