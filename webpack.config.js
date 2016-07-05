"use strict";

const webpack = require('webpack');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || "development";
const DEV = NODE_ENV === "development";

const entries = 'index'.split(',');

const entry = entries.reduce((a, b) => {
	a[b] = `./${b}`;
	return a;
}, {});


const plugins = [
	new webpack.NoErrorsPlugin(),
	new webpack.DefinePlugin({
		DEV: JSON.stringify(DEV)
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

	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'public'),
		library: '_13kb'
	},

	watch: DEV,

	watchOptions: {
		aggregateTimeout: 100
	},

	devtool: DEV ? "cheap-source-map" : null,

	plugins: DEV ? plugins : plugins.concat(new webpack.optimize.UglifyJsPlugin({compress: { warnings: false, drop_console: true, unsafe: true }})),

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