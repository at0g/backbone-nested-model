"use strict";

var CustomerOrders = require('../fixtures/models/customer-orders');
var data = require('../fixtures/data/customer-orders');

describe('CustomerOrders', function () {

    var model;

    beforeEach(function () {
        model = new CustomerOrders(data);
    });

    it('has an internal copy of data in model.attributes', function () {
        model.attributes.should.deep.equal(data);
        model.get('customer').should.deep.equal(data.customer);
        model.get('orders').should.deep.equal(data.orders);
    });

    it('creates cast instances of nested models', function () {
        var customer = model.children.customer;
        var address = customer.children.address;
        var orders = model.children.orders;
        customer.should.exist;
        customer.should.be.an.instanceOf(model.schema.customer);
        address.should.exist;
        address.should.be.an.instanceOf(customer.schema.address);
        orders.should.exist;
        orders.should.be.an.instanceOf(model.schema.orders);
    });

    it('provides object access notation to get collection children', function () {
        model.get('orders[0]').should.deep.equal(data.orders[0]);
        model.get('orders[0].id').should.equal(data.orders[0].id);
        model.get('orders[0].items[0]').should.deep.equal(data.orders[0].items[0]);
        model.get('orders[0].items[0].label').should.deep.equal(data.orders[0].items[0].label);
    });

    it('allows dot access for deeply nested properties', function () {
        var expected = data.customer.address.street;
        model.get('customer.address.street').should.equal(expected);
        model.get('customer.address').street.should.equal(expected);
        model.get('customer').address.street.should.equal(expected);
    });

});