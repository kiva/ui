var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var baseWebpackConfig = require('./webpack.server.base.conf')

// module.exports = merge(baseWebpackConfig, {
// 	output: {
// 		filename: utils.assetsPath('js/[name].[chunkhash].js'),
// 		chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
// 	},
// })

module.exports = merge(baseWebpackConfig, {
	output: {
		filename: 'server-bundle.js'
	}
})
