"use strict";

const webpack = require('webpack');

const NODE_ENV = process.env.NODE_ENV || "development";
const DEV = NODE_ENV === "development";

const plugins = [
	new webpack.DefinePlugin({
		DEV: JSON.stringify(DEV)
	})
];

module.exports = {
	entry: './home',
	output: {
		filename: 'build.js',
		library: 'home'
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