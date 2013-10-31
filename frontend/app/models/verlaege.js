define([
	"app",
	"bbloader",
	"models/verlag",

], function(App, Backbone, Verlag) {

	var Verlaege = Backbone.Collection.extend({
		model: Verlag,
		url: "",

		initialize: function(models, options) {
			this.url = App.config.get("url") + "zeitung/";
			if (typeof(options.vid) !== "undefined")
				this.url = this.url + "?vid=" + options.quartal;
			return this;
		}
	});
	return Verlaege
});