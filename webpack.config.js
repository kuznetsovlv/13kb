"use strict";

const webpack = require('webpack');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || "development";
const DEV = NODE_ENV === "development";
const TEST = NODE_ENV === "test";
const DESTINATION = process.env.DEST || 'web';

const library = '_13kb';
const buildPath = path.resolve(__dirname, 'public');

function getOutput () {
	switch (DESTINATION) {
		case 'node':
			return {filename: 'index.js', path: path.resolve(__dirname, 'dist'), library, libraryTarget: 'umd'};
		case 'web':
		default:
			return TEST ? {filename: 'index.js', path: buildPath, library} : {filename: '[name].js', path: buildPath, library};
	}
	
}

const entries = (TEST ? 'test' : 'index').split(',');

const entry = entries.reduce((a, b) => {
	a[b] = `./${b}`;
	return a;
}, {});

const BABEL_QUERY = {
  presets: ['es2015'],
  plugins: [
    ['transform-object-rest-spread'],
    ['transform-class-properties'],
    // ['transform-decorators-legacy']
  ]
};


const plugins = [
	new webpack.NoErrorsPlugin(),
	new webpack.DefinePlugin({
		NODE_ENV: JSON.stringify(NODE_ENV),
		DEV: JSON.stringify(DEV),
		TEST: JSON.stringify(TEST)
	})
];

const productPlugins = [
	new webpack.optimize.UglifyJsPlugin({
		compress: { warnings: false, drop_console: true, unsafe: true }
	}),
	// new webpack.optimize.OccurenceOrderPlugin(),
	// new webpack.ProvidePlugin({
	// 	Promise: 'imports?this=>global!exports?global.Promise!es6-promise',
	// 	'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
	// })
];

if (entries.length > 1)
	plugins.push(new webpack.optimize.CommonsChunkPlugin({
		name: 'common',
		minChunks: 2
	}));

module.exports = {
	context: path.resolve(__dirname, 'src'),

	entry: entry,

	noInfo: true,

	target: DESTINATION,

	output: getOutput(),

	watch: DEV || TEST,

	watchOptions: {
		aggregateTimeout: 100
	},

	devtool: DEV || TEST ? "cheap-source-map" : null,

	plugins: DEV || TEST ? plugins : plugins.concat(productPlugins),

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
			loader: 'babel',
			query: BABEL_QUERY
		}]
	}
}