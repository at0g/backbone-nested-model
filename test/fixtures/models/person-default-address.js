var Person = require('./person');
var Address = require('./address');

var PersonWithDefaultAddress = Person.extend({
	defaults: {
		streetAddress: Address.prototype.defaults
	}
});

module.exports = PersonWithDefaultAddress;
