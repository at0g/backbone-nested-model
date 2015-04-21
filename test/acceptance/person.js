"use strict";

describe('Person', function () {
	var Person = require('../fixtures/models/person');
	var PersonWithDefaultAddress = require('../fixtures/models/person-default-address');
	var Address = require('../fixtures/models/address');

	it('creates an empty attributes hash', function () {
		var model = new Person();
		model.attributes.should.deep.equals({});
	});

	it('creates defaults.streetAddress ', function () {
		var model = new PersonWithDefaultAddress();
		var child = model.children.streetAddress;

		should.not.exist(model.attributes.postalAddress);
		should.not.exist(model.children.postalAddress);
		model.attributes.should.deep.equal({ streetAddress: Address.prototype.defaults });
		model.children.should.deep.equal({ streetAddress: child });
		child.should.be.an.instanceOf(Address);
	});

	it('updates parent attributes when a child is set directly', function () {
		var model = new PersonWithDefaultAddress();
		var child = model.children.streetAddress;
		var expected = '123 testing';
		model.attributes.streetAddress.street.should.equal('');
		child.set('street', expected);
		model.attributes.streetAddress.street.should.equal(expected);
	});

	it('creates a child instance when model.set() is called on an undefined attribute', function () {
		var model = new Person();
		var expected = {
			streetAddress: Address.prototype.defaults
		};
		should.not.exist(model.children.streetAddress);
		model.set(expected);
		model.attributes.should.deep.equal(expected);
		model.children.streetAddress.should.be.an.instanceof(Address);
	});

	it('calls child.set() from model.set()', function () {
		var model = new PersonWithDefaultAddress();
		var spy = sinon.spy(model.children.streetAddress, 'set');
		var values = { street: 'somewhere nice in the country'};
		var expected = { streetAddress: values };

		model.set(expected);
		spy.should.be.calledOnce;
		spy.should.be.calledWith(values);
		model.attributes.should.deep.equal(expected);
		spy.restore();
	});

	it('dispatches change events when children are updated', function (){
		var model = new Person();
		var spy = sinon.spy();
		var values = { streetAddress: { postcode: '1234' } };

		model.on('all', spy);
		spy.should.not.be.called;
		model.set(values);
		spy.should.be.calledTwice;
		spy.firstCall.should.be.calledWith('change:streetAddress');
		spy.secondCall.should.be.calledWith('change');
	});

	it('calls set with dot syntax', function () {
		var model = new PersonWithDefaultAddress();
		model.set('streetAddress.street', 'somewhere nice');
		model.attributes.streetAddress.street.should.equal('somewhere nice');
		model.children.streetAddress.get('street').should.equal('somewhere nice');
	});

	it('isValid() calls validate() on children', function () {
		var model = new PersonWithDefaultAddress();
		var spyValidate = sinon.spy(model.children.streetAddress, 'validate');
		var spyEvt = sinon.spy();
		model.on('invalid', spyEvt);
		model.isValid().should.be.false;
		spyValidate.should.be.calledOnce;
		spyEvt.should.be.calledOnce;
		spyValidate.reset();
		spyEvt.reset();

		model.set({streetAddress: { street: 'at least 5 chars'}});
		model.isValid().should.be.true;
		spyValidate.should.be.calledOnce;
		spyValidate.restore();
	});

});
