"use strict";

var _ = require('underscore');
var Person = require('../fixtures/models/person');

describe('defaults', function () {
    var model;

    it('does not create default children if no defaults are specified', function () {
        model = new Person();
        model.attributes.should.deep.equal({});
    });

    it('creates children if there are default keys', function () {
        var PersonWithStreetAddress = Person.extend({
            defaults: { streetAddress: {} }
        });
        model = new PersonWithStreetAddress();
        model.attributes.should.have.key('streetAddress');
        model.get('streetAddress').should.deep.equal(model.schema.streetAddress.prototype.defaults);
    });

    it('uses attributes in model.defaults to override child defaults', function () {
        var PersonWithCustomStreetAddressDefaults = Person.extend({
            defaults: {
                streetAddress: {
                    street: 'super custom',
                    postcode: '12345'
                }
            }
        });
        var expected = _.extend({},
            Person.prototype.schema.streetAddress.prototype.defaults,
            PersonWithCustomStreetAddressDefaults.prototype.defaults.streetAddress
        );
        model = new PersonWithCustomStreetAddressDefaults();
        model.get('streetAddress').should.deep.equal(expected);
    });

});
