var _ = require('underscore');

describe('tree', function () {

	var Tree, tree, data;
	Tree = require('../fixtures/models/tree');

	beforeEach(function () {
		data = {
			label: 'Tree root',
			children: [
			{
				label: 'file.txt'
			},
			{
				label: 'pictures',
				children: [
					{
						label: 'profile.jpg'
					},
					{
						label: 'holiday',
						children: [
							{ label: 'picture-1.jpg'},
							{ label: 'picture-2.jpg'},
							{ label: 'picture-3.jpg'}
						]
					}
				]
			}]
		};
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
		var spy = sinon.spy();
		var expected = [{ label: 'hello' }];
		tree.set('children', expected);
		tree.attributes.children.should.deep.equal(expected);
	});

	it('uses object access [] to set individual children', function () {
		tree.set('children[1].label', 'photos');
		tree.attributes.children[1].label.should.equal('photos');
	});

});
