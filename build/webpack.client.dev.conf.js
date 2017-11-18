var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.client.base.conf')

module.exports = merge(baseWebpackConfig, {
	name: 'client',
	entry: {
		app: ['webpack-hot-middleware/client', baseWebpackConfig.entry.app]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	]
})
