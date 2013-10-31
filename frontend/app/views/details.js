define([

	'app',
	'bbloader',
	'views/piechart',
	'models/zeitungen',
	'text!templates/details.html',
	'text!templates/piechart.html'

], function(App, Backbone, PieView, Zeitungen, DetailsTemplate, PiechartTemplate) {

	var ZeitungsView = Backbone.Marionette.ItemView.extend({
		template: _.template(DetailsTemplate),
		tagName: "li",
		className: "entry",

		events: {
			"click .publisher .value": "loadPublisher",
			"click .compare": "compareItem",
		},

		loadPublisher: function(event) {
			App.config.set("publisher", event.currentTarget.innerText)
		},

		compareItem: function(event) {
			var removeicon = document.createElement("i");
			removeicon.setAttribute("class", "icon icon-remove");
			var closebutton = document.createElement("div");
			closebutton.setAttribute("class", "close");
			closebutton.appendChild(removeicon);
			var oldbutton = this.el.childNodes[0];
			this.el.replaceChild(closebutton, this.el.childNodes[0]);

			$("#compare-area>ul").append("<li>" + event.delegateTarget.innerHTML + "</li>");
			//$("#compare-area>ul").append("<li>" + this.template(this.model.attributes) + "</li>");
			$("#compare-area ul li .close").click(function(){
				event.delegateTarget.replaceChild(oldbutton, event.delegateTarget.childNodes[0]);
				this.parentNode.remove();
			});
		}
	});

	var DetailsView = Backbone.Marionette.CompositeView.extend({
		itemView: ZeitungsView,
		template: _.template(PiechartTemplate),
		tagName: "ul",

		initialize: function() {
			this.collection = new Zeitungen([], this.options);
		},
		onShow: function() {
			var that = this;
			this.collection.fetch({
				success: function(data) {
					if (typeof(that.options.publisher) !== "undefined") {
						var activecities = _.uniq(that.collection.pluck("Ort"));
						for (var i = 0; i < activecities.length; i++) {
							var activecity = d3.selectAll("circle#" + activecities[i]).attr("class", "city active")
						};
					}
					new PieView({
						data: data
					});
				},
				error: function() {
					console.log('Failed to fetch!');
				}
			});
		}

	});
	return DetailsView;
});
