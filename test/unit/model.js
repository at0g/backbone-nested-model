"use strict";

var requireNew = require('require-new');
var Model = require(pathToSrc('model.js'));

describe('Model', function () {

    describe('constructor', function () {

        it('extends Backbone.Model', function () {
            var spy = sinon.spy(Backbone.Model, 'extend');
            spy.should.not.be.called;
            requireNew(pathToSrc('model.js'));
            spy.should.be.calledOnce;
            spy.reset();
        });

        it('is a function', function () {
            Model.should.be.a.Function;
        });

        it('has a schema property', function () {
            Model.prototype.schema.should.be.a.Object;
        });

        it('has a children property', function () {
            Model.prototype.schema.should.be.a.Object;
        });

        it('calls model.parse without explicit { parse: true } option', function () {
            var spy = sinon.spy(Model.prototype, 'parse');
            var model = new Model({});
            Model.prototype.parse.should.be.a.Function;
            spy.should.be.called;
        });

        it('does not create children if no data or defaults are given', function () {
            var TestModel = Model.extend({
                schema: {
                    foo: Backbone.Model
                }
            });
            var model = new TestModel({ message: 'hello' });
            model.attributes.should.exist;
            model.attributes.message.should.equal('hello');
            should.not.exist(model.attributes.foo);
            should.not.exist(model.children.foo);
        });

    });

    describe('instance', function () {
        var spy, TestModel, attrs, model;

        beforeEach(function () {
            spy = sinon.spy(Backbone.Model);
            TestModel = Model.extend({
                schema: {
                    test: spy
                }
            });
            attrs = {test: { message: 'testing'}, foo: 'bar'};
            spy.should.not.be.called;
            model = new TestModel(attrs, { parse: true });
        });

        afterEach(function () {
            spy.reset();
        });

        it('creates children from the schema', function () {
            spy.should.be.calledWith({ message: 'testing'});
            model.children.should.have.key('test');
            model.children.test.should.be.an.instanceof(spy);
        });

        it('casts model.defaults to schema types', function () {
            var TestModelWithDefaults = TestModel.extend({
                defaults: {
                    test: { message: 'hello' }
                }
            });
            model = new TestModelWithDefaults();
            model.attributes.test.should.exist;
            model.attributes.test.message.should.equal('hello');
            model.children.test.should.exist;
            model.children.test.should.be.an.instanceof(Backbone.Model);
            model.children.test.get('message').should.equal('hello');
        });

        describe('get()', function () {
            it('returns the child attribute', function () {
                model.get('test').should.have.keys({ message: 'testing'});
                model.get('foo').should.equal('bar');
            });

            it('returns objects in nested arrays using object access operator', function () {
                model.schema.myCollection = Backbone.Collection;
                model.set({
                    myCollection: [
                        {name: 'model0'},
                        {name: 'model1'}
                    ]
                });
                model.get('myCollection[0]').should.exist;
            });
        });

        describe('toJSON()', function () {
            it('serializes nested models to json', function () {
                var nestedModel = model.children.test;
                var spy1 = sinon.spy(nestedModel, 'toJSON');
                var expected = {test: { message: 'testing'}, foo: 'bar'};
                spy1.should.not.be.called;
                model.toJSON().should.eql(expected);
                spy1.should.be.calledOnce;
                spy1.firstCall.thisValue.should.equal(nestedModel);
                spy1.reset();
            });
        });

        describe('set()', function () {
            it('calls set on nested models', function () {
                var nestedModel = model.children.test;
                var spy1 = sinon.spy(nestedModel, 'set');
                model.set('test', { message: 'set this' });
                model.attributes.test.should.have.keys({ message: 'set this' });
                spy1.should.be.calledOnce;

                model.set({foo: 'foo', test: { message: 'changed again'}});
                spy1.should.be.calledTwice;
                model.attributes.foo.should.equal('foo');
                model.attributes.test.should.have.keys({ message: 'changd again'});
            });

            it('updates attributes when a nested model is changed directly', function () {
                var nestedModel = model.children.test;
                nestedModel.set('message', 'message has changed');
                model.attributes.test.message.should.equal('message has changed');
            });

            it('does nothing on null keys', function () {
                model.set(null).should.equal(model);
                model.attributes.foo.should.equal('bar');
            });

            it('calls set on nested collections using object access', function () {
                var expected = 'model0 changed';
                var TestModel = Model.extend({
                    schema: {
                        myCollection: Backbone.Collection
                    }
                });
                var model = new TestModel({
                    myCollection: [{ name: 'model0'}, { name: 'model1'}]
                });

                model.set('myCollection[0].name', expected);
                model.get('myCollection')[0].name.should.equal(expected);
            });
        });

    });

});
