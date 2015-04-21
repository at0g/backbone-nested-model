"use strict";

var _ = require('underscore');
var CustomerOrders = require('../fixtures/models/customer-orders');
var data = require('../fixtures/data/customer-orders');

describe('setters', function () {

    var model, expected;

    beforeEach(function() {
        model = new CustomerOrders(data);
    });

    it('calls validate if validate option is passed', function () {
        var model = new (CustomerOrders.extend({
            validate: function () { return 'invalid' }
        }));

        model.set({name: 'a new name'}, {validate: true});
    });

    describe('child model', function () {

        it('calls set(attr, values) on child', function () {
            var spy = sinon.spy();
            model.on('all', spy);
            model.set('customer', { name: 'test'});
            model.get('customer').name.should.equal('test');
            model.changed.customer.name.should.exist;
            spy.should.be.calledThrice;
            spy.firstCall.should.be.calledWith('change:customer:name', model.children.customer);
            spy.secondCall.should.be.calledWith('change:customer', model.children.customer);
            spy.thirdCall.should.be.calledWith('change', model.children.customer);
            spy.reset();
        });

        it('calls set(obj) on child', function () {
            var spy = sinon.spy();
            model.on('all', spy);
            model.set({ customer: { name: 'test'} });
            model.get('customer').name.should.equal('test');
            model.changed.customer.name.should.exist;
            spy.should.be.calledThrice;
            spy.firstCall.should.be.calledWith('change:customer:name', model.children.customer);
            spy.secondCall.should.be.calledWith('change:customer', model.children.customer);
            spy.thirdCall.should.be.calledWith('change', model.children.customer);
            spy.reset();
        });

        it('updates the attributes of the parent if a child model is set directly', function () {
            expected = 'a new name';
            var spy = sinon.spy();
            var customer = model.children.customer;
            model.on('all', spy);
            customer.set('name', expected);
            model.get('customer.name').should.equal(expected);
            model.changed.customer.name.should.exist;
            spy.should.be.calledThrice;
            spy.firstCall.should.be.calledWith('change:customer:name', model.children.customer);
            spy.secondCall.should.be.calledWith('change:customer', model.children.customer);
            spy.thirdCall.should.be.calledWith('change', model.children.customer);
            spy.reset();
        });

        it('calls validate if the validate option is passed to set', function () {
            var spy = sinon.spy();
            model.validate = spy;
            model.set('type', 'changed type', { validate: true});
            spy.should.be.calledOnce;
        });

        it('unsets attribute if {unset: true} is passed', function () {
            model.attributes.type.should.exist;
            model.set('type', null, { unset: true});
            should.not.exist(model.attributes.type);
        });

        it('unsets a child if {unset: true} is passed', function () {
            model.attributes.customer.should.exist;
            model.set('customer', null, { unset: true });
            should.not.exist(model.attributes.customer);
            should.not.exist(model.children.customer);
        });

        it('unsets a child attribute using dot notation if {unset: true} is passed', function () {
            model.attributes.customer.name.should.exist;
            model.set('customer.name', null, { unset: true });
            model.attributes.customer.should.exist;
            should.not.exist(model.attributes.customer.name);
        });

        it('unsets a child attribute using object notation if {unset: true} is passed', function () {
            model.attributes.customer.name.should.exist;
            model.set('customer', { name: null}, { unset: true });
            model.attributes.customer.should.exist;
            should.not.exist(model.attributes.customer.name);
        });

        it('creates a child model if it does not exist', function () {
            var otherData = _.extend({}, data);
            delete otherData.customer;
            model = new CustomerOrders(otherData);
            should.not.exist(model.get('customer'));
            should.not.exist(model.children.customer);
            model.set({customer: data.customer});
            model.children.customer.should.exist;
            model.get('customer').should.deep.equal(data.customer);
            model.children.customer.should.be.an.instanceOf(CustomerOrders.prototype.schema.customer);
        });

    });

    describe('child collection', function () {

        it('resets collection children when passing an array to set', function () {
            expected = [data.orders[1]];
            model.set('orders', expected);
            model.get('orders').should.deep.equal(expected);
            model.changed.orders.should.deep.equal(expected);
        });

        it('updates a single item in a collection when using square brackets', function () {
            model.set('orders[0]', { id: '54321' });
            model.get('orders')[0].id.should.equal('54321');
            model.get('orders')[0].items.should.deep.equal(data.orders[0].items);
            model.changed.orders.should.deep.equal([{ id: '54321' }]);
        });

        it('calls set on collection children using square brackets', function () {
            expected = { id: '12345', items: []};
            model.set('orders[0]', expected);
            model.get('orders')[0].id.should.equal(expected.id);
            model.attributes.orders[0].items.length.should.equal(expected.items.length);
            model.changed.orders.should.deep.equal([expected])
        });

    });

});
