"use strict";

var _ = require('underscore');
var CustomerOrders = require('../fixtures/models/customer-orders');
var data = require('../fixtures/data/customer-orders');

describe('setters', function () {

    var model;

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
            spy.should.be.calledThrice;
            spy.firstCall.should.be.calledWith('change:customer:name', model.children.customer);
            spy.secondCall.should.be.calledWith('change:customer', model.children.customer);
            spy.thirdCall.should.be.calledWith('change', model.children.customer);
            spy.reset();
        });

        it('updates the attributes of the parent if a child model is set directly', function () {
            var expected = 'a new name';
            var spy = sinon.spy();
            var customer = model.children.customer;
            model.on('all', spy);
            customer.set('name', expected);
            model.get('customer.name').should.equal(expected);
            spy.should.be.calledThrice;
            spy.firstCall.should.be.calledWith('change:customer:name', model.children.customer);
            spy.secondCall.should.be.calledWith('change:customer', model.children.customer);
            spy.thirdCall.should.be.calledWith('change', model.children.customer);
            spy.reset();
        });
        
    });

    describe('child collection', function () {
        it('calls set on collection children using square brackets', function () {
            model.set('orders[0]', { id: '12345', items: []});
            model.get('orders')[0].id.should.equal('12345');
        });

    });

});