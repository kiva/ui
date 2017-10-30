var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var nodeExternals = require('webpack-node-externals')
var VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(baseWebpackConfig, {
	entry: './src/server-entry-promise.js',
	target: 'node',
	devtool: '#source-map',
	output: {
		libraryTarget: 'commonjs2'
		, filename: 'server-bundle.js'
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
		// new ExtractTextPlugin({
		// 	filename: utils.assetsPath('css/[name].[contenthash].css')
		// }),
		new VueSSRServerPlugin()
	]
})
