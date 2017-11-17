var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var baseWebpackConfig = require('./webpack.client.base.conf')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
	name: 'client',
	entry: {
		app: ['webpack-hot-middleware/client', baseWebpackConfig.entry.app]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	]
})
