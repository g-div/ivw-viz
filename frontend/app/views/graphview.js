define([

	'app',
	'bbloader',

], function(App, Backbone) {

	var GraphView = Backbone.Marionette.ItemView.extend({
		el: $("#chart svg"),
		data: null,

		initialize: function() {
			var that = this;
			d3.json(App.config.get("url") + 'result/result.json', function(error, data) {
				that.data = data;

				nv.addGraph(function() {
					var chart = nv.models.lineChart()
						.x(function(d) {
							return d[0]
						})
						.y(function(d) {
							return d[1]
						})
						.clipEdge(true)
						.showLegend(false);

					chart.xAxis
						.axisLabel('Zeit')
						.tickFormat(function(d) {
							return d.toString().substring(0, 4);
						});

					chart.yAxis
						.axisLabel('Auflage')

					chart.margin({
						left: 100,
						top: 20
					});

					chart.lines.dispatch.on('elementClick', function(e) {
						console.log(e.point[0][e.point[0].length - 1]);
						var res = e.point[0];
						var quart = res[res.length - 1];
						var year = res.substring(0, res.length - 1);
						console.log(year);
						App.config.set({
							quartal: quart,
							year: year

						})
					});

					d3.select(that.el)
						.datum(that.getData())
						.transition().duration(500)
						.call(chart);

					nv.utils.windowResize(chart.update);

					return chart;
				});
			});
		},

		getData: function() {
			var result = {
				"key": "Auflage",
				"values": []
			};
			for (var i = 0; i < this.data.length; i++) {
				result['values'].push([this.data[i]._id, this.data[i].value]);
			}
			console.log([result])
			return [result];
		}

	});

	return GraphView;
});