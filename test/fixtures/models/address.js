var Address = Backbone.Model.extend({

	defaults: {
		street: '',
		suburb: '',
		city: '',
		state: '',
		postcode: '',
		country: ''
	},

	validate: function (attrs, options) {
		if (attrs.street.length < 5) {
			return 'Street address is too short';
		}
	}

});

module.exports = Address;
