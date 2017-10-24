var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var baseWebpackConfig = require('./webpack.server.base.conf')

const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

// module.exports = merge(baseWebpackConfig, {
// 	output: {
// 		filename: utils.assetsPath('js/[name].[chunkhash].js'),
// 		chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
// 	},
// })

module.exports = merge(baseWebpackConfig, {
	output: {
		filename: 'server-bundle.js'
	},
	// https://webpack.js.org/configuration/externals/#externals
	// https://github.com/liady/webpack-node-externals
	externals: nodeExternals({
		// do not externalize CSS files in case we need to import it from a dep
		whitelist: /\.css$/
	}),
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
			'process.env.VUE_ENV': '"server"'
		}),
		// extract css into its own file
		new ExtractTextPlugin({
			filename: utils.assetsPath('css/[name].[contenthash].css')
		}),
		new VueSSRServerPlugin()
	]
})
