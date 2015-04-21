var path = require('path');

module.exports = {

	context: path.join(__dirname, 'src'),

	entry: {
		model: './model'
	},

	output: {
		path: path.join(__dirname, 'lib'),
		filename: '[name].js',
		libraryTarget: 'umd'
	},

	externals: {
		'backbone': {
			root: 'Backbone',
			commonjs2: 'backbone',
			commonjs: 'backbone',
			amd: 'backbone'
		},
		'underscore': {
			root: '_',
			commonjs2: 'underscore',
			commonjs: 'underscore',
			amd: 'underscore'
		}
	}

};
