var webpack = require('webpack')
var merge = require('webpack-merge')
var path = require('path')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var nodeExternals = require('webpack-node-externals')
var VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

var noop = path.resolve(__dirname, 'no-op.js');

module.exports = merge(baseWebpackConfig, {
	entry: './src/server-entry.js',
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
		// suppress client-side-only modules
		new webpack.NormalModuleReplacementPlugin(/foundation/, noop),
		// extract css into its own file
		// new ExtractTextPlugin({
		// 	filename: utils.assetsPath('css/[name].[contenthash].css')
		// }),
		new VueSSRServerPlugin(),
		new FriendlyErrorsPlugin({
			clearConsole: false,
			compilationSuccessInfo: {
				messages: ['Server bundle compiled.\n']
			}
		})
	]
})
