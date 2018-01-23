var webpack = require('webpack')
var merge = require('webpack-merge')
var config = require('../config')
var utils = require('./utils')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var baseWebpackConfig = require('./webpack.client.base.conf')

module.exports = merge(baseWebpackConfig, {
	name: 'client',
	entry: {
		app: ['webpack-hot-middleware/client?path=/__ui_hmr', baseWebpackConfig.entry.app]
	},
	output: {
		path: config.build.assetsRoot,
		/* 	Even though these files exist only in memory...
			We tell webpack to address them in the /static directory as if they were built.
			This makes running alongside apache in the vm possible.
		*/
		filename: utils.assetsPath('js/[name].js'),
		chunkFilename: utils.assetsPath('js/[id].js'),
		hotUpdateChunkFilename: utils.assetsPath('[id].hot-update.js'),
		hotUpdateMainFilename: utils.assetsPath('hot-update.json')
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new FriendlyErrorsPlugin({
			clearConsole: false,
			compilationSuccessInfo: {
				messages: ['Client bundle compiled.\n']
			}
		})
	]
})
