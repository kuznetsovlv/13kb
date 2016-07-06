"use strict";

const webpack = require('webpack');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || "development";
const DEV = NODE_ENV === "development";
const TEST = NODE_ENV === "test";

const entries = (TEST ? 'test' : 'index').split(',');

const entry = entries.reduce((a, b) => {
	a[b] = `./${b}`;
	return a;
}, {});


const plugins = [
	new webpack.NoErrorsPlugin(),
	new webpack.DefinePlugin({
		NODE_ENV: JSON.stringify(NODE_ENV),
		DEV: JSON.stringify(DEV),
		TEST: JSON.stringify(TEST)
	})
];

if (entries.length > 1)
	plugins.push(new webpack.optimize.CommonsChunkPlugin({
		name: 'common',
		minChunks: 2
	}));

module.exports = {
	context: path.resolve(__dirname, 'src'),

	entry: entry,

	output: TEST ? {
		filename: 'index.js',
		path: path.resolve(__dirname, 'public'),
		library: '_13kb'
	} : {
		filename: '[name].js',
		path: path.resolve(__dirname, 'public'),
		library: '_13kb'
	},

	watch: DEV || TEST,

	watchOptions: {
		aggregateTimeout: 100
	},

	devtool: DEV || TEST ? "cheap-source-map" : null,

	plugins: DEV || TEST ? plugins : plugins.concat(new webpack.optimize.UglifyJsPlugin({compress: { warnings: false, drop_console: true, unsafe: true }})),

	resolve: {
		modulesDirectories: ['node_modules'],
		extensions: ['', '.js']
	},

	resolveLoader: {
		modulesDirectories: ['node_modules'],
		moduleTemplates: ['*-loader', '*'],
		extensions: ['', '.js']
	},

	module: {
		loaders: [{
			exclude: /node_modules/,
			test: /\.js$/,
			loader: 'babel?optional[]=runtime'
		}]
	}
}