define([

	'bbloader',
	'nvd3',
	'app'

], function(Backbone, nv, App) {

	var ChartView = Backbone.Marionette.ItemView.extend({
		initialize: function() {
			if (App.config.get("pie")) {
				var publishers = {};
				var chart = nv.models.pieChart()
					.x(function(d) {
						if (App.config.get("detailed")) {
							return d.Titel;
						} else {
							return d.publisher;
						}
					})
					.y(function(d) {
						if (App.config.get("detailed")) {
							if (typeof(d.Verbreitung) === "undefined") {
								return null;
							} else {
								return d.Verbreitung;
							}

						} else {
							return d.quota;
						}
					})
					.showLegend(false)
					.showLabels(false);

				chart.pie.dispatch.on('elementClick.customNameSpace', function(e) {
					$(".nvtooltip").remove();
					console.log(App.config.get("detailed"));
					if (App.config.get("detailed") === true) {
						App.config.set({
							detailsId: e.point._id.$oid,
							pie: false,
						});
					} else {
						App.config.set({
							publisher: e.label,
							detailed: true
						});
					}
				});

				var that = this;
				nv.addGraph(function() {
					d3.select("#pie svg")
						.datum(that.getData(that.options.data))
						.transition().duration(1200)
						.call(chart);
				});
			} else {
				$("#pie").hide();
			}
		},

		getData: function(data) {
			var remodeled = {
				key: "Zeitungsdata",
				values: []
			};
			if (App.config.get("detailed")) {
				for (var i = 0; i < data.models.length; i++) {
					remodeled.values[i] = data.models[i].attributes;
				}
			} else {
				var publishers = _.uniq(data.pluck("Verlagsnummer"));
				for (var i = 0; i < publishers.length; i++) {
					remodeled.values[i] = {
						"publisher": publishers[i],
						"quota": _.filter(data.pluck("Verlagsnummer"), function(pub) {
							return pub === publishers[i];
						}).length
					};
				}
			}
			return [remodeled];
		},

	});
	return ChartView;
});