var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.client.base.conf')
// var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

var webpackConfig = merge(baseWebpackConfig, {
	// module: {
		// rules: utils.styleLoaders({
		// 	sourceMap: config.build.productionSourceMap,
		// 	extract: true
		// })
	// },

	plugins: [
		// Compress extracted CSS. We are using this plugin so that possible
		// duplicated CSS from different components can be deduped.
		// new OptimizeCSSPlugin({
		// 	cssProcessorOptions: {
		// 		safe: true
		// 	}
		// }),
	]
});

if (config.build.bundleAnalyzerReport) {
	var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
	webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
