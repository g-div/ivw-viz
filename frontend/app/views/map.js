define([
	'app',
	'spin',
	'jquerymobile',
	'topojson',
	'bbloader',

], function(App, Spinner, mobile, topojson, Backbone) {
	var MapView = Backbone.Marionette.ItemView.extend({

		width: 800,
		height: 500,
		centered: false,
		svg: {},
		path: {},
		g: {},
		zoomfactor: 0,

		initialize: function() {
			var that = this;
			_.bindAll(that, "render");
			_.bindAll(that, "clicked");
			_.bindAll(that, "setCity");
			var spinner = new Spinner().spin(this.el);
		},

		render: function() {
			this.svg = d3.select(this.el).append("svg")
				.attr("width", this.width)
				.attr("height", this.height);

			var that = this;
			d3.json(App.config.get("url") + 'geo/de.json', function(error, de) {
				$(".spinner").remove();
				var regions = topojson.feature(de, de.objects.countries);
				var center = d3.geo.centroid(regions);

				that.projection = d3.geo.mercator()
					.scale(2000)
					.center(center);

				that.path = d3.geo.path().projection(that.projection);

				that.svg.append("rect")
					.attr("class", "background")
					.attr("width", that.width)
					.attr("height", that.height)
					.on("click", that.clicked);

				that.g = that.svg.append("g");

				that.g.selectAll(".countries")
					.data(topojson.feature(de, de.objects.countries).features)
					.enter().append("path")
					.attr("class", "countries")
					.attr("id", function(d) {
						return d.properties.name;
					})
					.attr("d", that.path)
					.on("click", that.clicked);
			});
			this.renderCities();
		},

		renderCities: function() {
			var that = this;
			d3.json(App.config.get("url") + 'geo/cities/?q=' + App.config.get("year") + App.config.get("quartal"), function(error, data) {
				that.g.selectAll("circle").remove();

				that.g.selectAll("circle")
					.data(data)
					.enter()
					.append("circle")
					.attr("cx", function(d) {
						return that.projection([d.lng, d.lat])[0];
					})
					.attr("cy", function(d) {
						return that.projection([d.lng, d.lat])[1];
					})
					.attr("id", function(d) {
						return d.city;
					})
					.attr("class", "city")
					.attr("r", function(d) {
						var value;
						if (typeof(d.sold) !== "undefined") {
							value = 5
						}
						return value;
						//return d.sold / 80000;
					})
					.style("fill", function(d) {
						var color = "#ffff33";
						switch (d.publisher) {
							case "<=1":
								color = "#9eed4e";
								break;
							case "2":
								color = "#40afcb";
								break;
							case "3":
								color = "#ffff33";
								break;
							case "4":
								color = "#ff9933";
								break;
							case "5":
								color = "#961517";
								break;
							default:
								color = "#961517";
								break;
						}
						return color;
					})
					.on("click", function(event) { that.setCity(event); });
			});
		},

		setCity: function(target) {
			if (typeof(target.city) !== "undefined") {
				App.config.set({
					city: target.city,
					detailed: false,
					pie: true
				});
				d3.selectAll("circle.city.active").attr("class", "city");
			}
		},

		clicked: function(d) {
			var x, y;
			if (d && this.centered !== d) {
				var centroid = this.path.centroid(d);
				x = centroid[0];
				y = centroid[1];
				this.zoomfactor = 4;
				this.centered = d;
			} else if (typeof(d.city) === "undefined") {
				x = this.width / 2;
				y = this.height / 2;
				this.zoomfactor = 1;
				this.centered = null;
			}

			this.g.selectAll("path")
				.classed("active", this.centered && function(d) {
					return d === this.centered;
				});

			this.g.transition()
				.duration(750)
				.attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")scale(" + this.zoomfactor + ")translate(" + -x + "," + -y + ")")
				.style("stroke-width", 1.5 / this.zoomfactor + "px");
		}
	});
	return MapView;
});
