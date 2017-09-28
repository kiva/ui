var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')


module.exports = merge(baseWebpackConfig, {
	entry: './src/server-entry.js',
	target: 'node',
	devtool: '#source-map',
	output: {
		libraryTarget: 'commonjs2'
	}
})
