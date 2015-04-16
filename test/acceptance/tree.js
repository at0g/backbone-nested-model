var _ = require('underscore');
var data = require('../fixtures/data/tree');

describe('tree', function () {

	var Tree, tree;
	Tree = require('../fixtures/models/tree');

	beforeEach(function () {
		tree = new Tree(data);
	});

	it('creates a tree', function () {
		tree.attributes.should.deep.equal(data);
		tree.toJSON().should.deep.equal(data);
		tree.get('children').should.deep.equal(data.children);
	});

	it('sets the root label', function () {
		var spy = sinon.spy();
		var expected = { label: 'new label'};
		tree.on('change', spy);
		tree.on('change:label', spy);
		tree.set(expected);
		tree.attributes.label.should.equal(expected.label);
		spy.should.be.calledTwice;
	});

	it('sets the children array', function () {
		var expected = [{ label: 'hello' }];
		tree.set('children', expected);
		//tree.attributes.children.should.deep.equal(expected);
	});

	it('uses object access [] to set individual children', function () {
		tree.set('children[1].label', 'photos');
		tree.attributes.children[1].label.should.equal('photos');
	});

});
