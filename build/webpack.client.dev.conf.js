var webpack = require('webpack');
var merge = require('webpack-merge');
var config = require('../config');
var assetsPath = require('./assets-path.js');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
var baseWebpackConfig = require('./webpack.client.base.conf');

module.exports = merge.smart(baseWebpackConfig, {
	name: 'client',
	mode: 'development',
	entry: {
		app: ['webpack-hot-middleware/client?path=/__ui_hmr', baseWebpackConfig.entry.app]
	},
	output: {
		path: config.build.assetsRoot,
		/* 	Even though these files exist only in memory...
			We tell webpack to address them in the /static directory as if they were built.
			This makes running alongside apache in the vm possible.
		*/
		filename: assetsPath('js/[name].js'),
		chunkFilename: assetsPath('js/[id].js'),
		hotUpdateChunkFilename: assetsPath('[id].hot-update.js'),
		hotUpdateMainFilename: assetsPath('hot-update.json')
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
});
