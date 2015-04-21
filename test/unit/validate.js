"use strict";

var Model = require(pathToSrc('model.js'));

describe('Model.validate', function () {
    var spy, ValidationModel, TestModel, model;

    beforeEach(function () {
        spy = sinon.spy(function(attrs, otions) {
            if (attrs.test !== 'testing') {
                return '[test] must equal "testing"';
            }
        });
        ValidationModel = Backbone.Model.extend({
            validate: spy
        });
        TestModel = Model.extend({
            schema: {
                validateMe: ValidationModel
            }
        });

        model = new TestModel({
            foo: 'foo',
            validateMe: {
                test: 'testing'
            }
        });
    });

    afterEach(function () {
        spy.reset();
    });

    it('calls validate on children', function () {
        spy.should.not.be.called;
        model.isValid().should.be.true;
        spy.should.be.calledOnce;
        spy.firstCall.should.be.calledWith({ test: 'testing' });
        spy.firstCall.thisValue.should.equal(model.children.validateMe);
    });

    it('returns validation errors from children', function () {
        var spy1 = sinon.spy();
        spy.should.not.be.called;
        model.on('invalid', spy1);
        model.children.validateMe.set({test: 'not valid'});
        model.isValid().should.be.false;
        spy.should.be.calledOnce;
        spy1.should.be.calledOnce;
    });

    it('only calls validate on a child if the method is implemented', function () {
        var ModelUnderTest = Model.extend({
            schema: {
                noValidate: Backbone.Model
            }
        });
        var m = new ModelUnderTest({ noValidate: {message: 'hi'}});
        m.set({noValidate: {message: 'hi'}}, { validate: true});
        
    });

});