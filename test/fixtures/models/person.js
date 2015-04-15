var Model = require(pathToSrc('model.js'));
var Address = require('./address');

var Person = Model.extend({
	schema: {
		streetAddress: Address,
		postalAddress: Address
	}
});

module.exports = Person;
