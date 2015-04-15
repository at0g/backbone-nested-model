"use strict";

var Model = require(pathToSrc('model.js'));

describe('Events', function () {

	var TestModel, model, child, spy;

	beforeEach(function () {
		spy = sinon.spy();

		TestModel = Model.extend({
			schema: {
				test: Backbone.Model.extend({
					validate: function(attrs, options) {
						if (attrs.message !== 'hello') {
							return 'message must be "hello"';
						}
					}
				}),
				testCollection: Backbone.Collection.extend({
					model: Backbone.Model
				})
			}
		});

		model = new TestModel({
			test: { message: 'hello'}
		}, { parse: true });

		child = model.children.test;
	});

	afterEach(function () {
		spy.reset();
	});

	describe('change events', function () {
		it('on(all) sends heirarchial event names', function () {
			model.on('all', spy);
			child.set('message', 'hello!');
			spy.should.be.calledThrice;
			spy.firstCall.should.be.calledWith('change:test:message');
			spy.secondCall.should.be.calledWith('change:test');
			spy.thirdCall.should.be.calledWith('change');
		});

		it('on(change) sends 1 event', function () {
			model.on('change', spy);
			child.set('message', 'hello!');
			spy.should.be.called;
		});
	});

	describe('invalid events', function () {
		it('on(all) sends heirarchial event names', function () {
			model.on('all', spy);
			child.set('message', 'hello!', { validate: true });
			spy.should.be.calledTwice;
			spy.firstCall.should.be.calledWith('invalid:test');
			spy.secondCall.should.be.calledWith('invalid');
			spy.reset();
		});

	});

	describe('destroy events', function () {
		it('on(all) sends heirarchial event names', function () {
			model.on('all', spy);
			child.destroy();
			spy.should.be.calledOnce;
			spy.should.be.calledWith('destroy:test');
		});

		it('on(destroy) sends an event', function () {
			var spy1 = sinon.spy();
			var spy2 = sinon.spy();
			model.on('destroy', spy1);
			model.on('destroy:test', spy2);
			child.destroy();
			spy1.should.not.be.called;
			spy2.should.be.calledOnce;
			spy1.reset();
			spy2.reset();
		});
	});

});
