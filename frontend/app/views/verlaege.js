define([

	'bbloader',
	'models/verlag',
	'models/verlaege',
	'text!templates/verlag.html'

], function(Backbone, Verlag, Verlaege, Details) {

	var VerlagView = Backbone.Marionette.ItemView.extend({
		template: _.template(Details),
	});

	var VerlaegeView = Backbone.Marionette.CollectionView.extend({
		itemView: VerlagView,
		events: {
			'click button#add': 'getPost'
		},
		initialize: function() {
			this.collection = new Verlaege([], this.options);
		},
		onShow: function() {
			var that = this;
			this.collection.fetch({
				success: function() {
					console.log(that.collection.models);
				},
				error: function() {
					console.log('Failed to fetch!');
				}

			});
		}

	});
	return VerlaegeView
});