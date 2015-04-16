"use strict";

var CustomerOrders = require('../fixtures/models/customer-orders');
var data = require('../fixtures/data/customer-orders');

describe('getters', function () {

    var model;

    beforeEach(function() {
        model = new CustomerOrders(data);
    });

    it('gets flat attributes', function () {
        model.get('customer').should.deep.equal(data.customer);
    });

    it('gets nested attributes via dots', function () {
        model.get('customer.id').should.equal(data.customer.id);
        model.get('customer').id.should.equal(data.customer.id);
    });

    it('gets collection children via square brackets', function () {
        model.get('orders[0]').should.deep.equal(data.orders[0]);
        model.get('orders')[0].should.deep.equal(data.orders[0]);
    });

    it('gets properties of collection children via square brackets and then dots', function () {
        model.get('orders[0].id').should.equal(data.orders[0].id);
        model.get('orders[0].items').should.deep.equal(data.orders[0].items);
    });

    it('gets collection children via dots and then square brackets', function () {
        model.get('customer.emails[0]').should.deep.equal(data.customer.emails[0]);
    });

    it('returns undefined if an attribute does not exist', function () {
        should.not.exist(model.get('foo'));
        should.not.exist(model.get('orders[3]'));
        should.not.exist(model.get('orders[3].id'));
    });

});
