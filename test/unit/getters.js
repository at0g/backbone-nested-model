"use strict";

var CustomerOrders = require('../fixtures/models/customer-orders');
var data = require('../fixtures/data/customer-orders');

describe('getters', function () {

    var model, expected, result;

    beforeEach(function() {
        model = new CustomerOrders(data);
    });

    it('gets flat attributes from nested models', function () {
        model.get('customer').should.deep.equal(data.customer);
    });

    it('gets flat attributes from primative attributes', function () {
        model.get('type').should.equal('customer orders');
    });

    it('gets nested attributes via dots', function () {
        expected = data.customer.id;
        model.get('customer.id').should.equal(expected);
        model.get('customer').id.should.equal(expected);
    });

    it('gets a collection as an array', function () {
        result = model.get('orders');
        result.should.be.an.Array;
        result.should.deep.equal(data.orders);
    });

    it('get a collection as an array using a dot', function () {
        result = model.get('orders[1].items');
        expected = data.orders[1].items;
        result.should.be.an.Array;
        result.should.deep.equal(expected);
    });

    it('gets collection children via square brackets', function () {
        expected = data.orders[0];
        model.get('orders[0]').should.deep.equal(expected);
        model.get('orders')[0].should.deep.equal(expected);
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
        should.not.exist(model.get('foo[0]'));
    });

});
