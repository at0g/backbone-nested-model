var Model = require(pathToSrc('model.js'));

var Tree = Model.extend({
	schema: {},
	defaults: {
		label: 'tree label'
	}
});

Tree.prototype.schema.children = Backbone.Collection.extend({
	model: Tree
});

module.exports = Tree;
