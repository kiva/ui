var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

var env = process.env.NODE_ENV === 'testing'
? require('../config/test.env')
: config.build.env

module.exports = merge(baseWebpackConfig, {
	entry: {
		app: './src/client-entry.js'
	},
	devtool: config.build.productionSourceMap ? '#source-map' : false,
	plugins: [
		// http://vuejs.github.io/vue-loader/en/workflow/production.html
		new webpack.DefinePlugin({
			'process.env': env,
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
			'process.env.VUE_ENV': '"client"'
		}),
		// extract vendor chunks for better caching
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function (module) {
			// a module is extracted into the vendor chunk if...
			return (
				// it's inside node_modules
				/node_modules/.test(module.context) &&
				// and not a CSS file (due to extract-text-webpack-plugin limitation)
				!/\.css$/.test(module.request)
			)
			}
		}),
		// extract webpack runtime & manifest to avoid vendor chunk hash changing
		// on every build.
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest'
		}),
		new VueSSRClientPlugin()
	]
})
