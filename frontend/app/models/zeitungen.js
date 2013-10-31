define([
	"app",
	"bbloader",
	"models/zeitung",

], function(App, Backbone, Zeitung) {

	var Zeitungen = Backbone.Collection.extend({
		model: Zeitung,
		url: "",

		initialize: function(models, options) {
			this.url = App.config.get("url") + "zeitung/";
			if (typeof(options.quartal) !== "undefined") this.url = this.url + "?q=" + options.quartal;
			if (typeof(options.ort) !== "undefined") this.url = this.url + "&o=" + options.ort;
			if (typeof(options.titel) !== "undefined") this.url = this.url + "&t=" + options.titel;
			if (typeof(options.ediction) !== "undefined") this.url = this.url + "&e=" + options.ediction;
			if (typeof(options.publisher) !== "undefined") this.url = this.url + "&v="  + options.publisher;
			if (typeof(options.detailsId) !== "undefined") this.url = App.config.get("url") + "zeitung/id/?oid=" + options.detailsId;
			return this;
		}
	});
	return Zeitungen;
});