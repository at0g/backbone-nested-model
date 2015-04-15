var Hello = Backbone.Model.extend({
	defaults: {
		message: 'Hello world'
	},
	validate: function (attrs, options) {
		if (attrs.message.toLowercase.indexOf('hello') === -1) {
			return 'message must contain hello';
		}
	}
});

module.exports = Hello;
