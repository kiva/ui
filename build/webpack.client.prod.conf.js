var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.client.base.conf')
// var HtmlWebpackPlugin = require('html-webpack-plugin')
// var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

var env = process.env.NODE_ENV === 'testing'
	? require('../config/test.env')
	: config.build.env;

var webpackConfig = merge(baseWebpackConfig, {
	// module: {
		// rules: utils.styleLoaders({
		// 	sourceMap: config.build.productionSourceMap,
		// 	extract: true
		// })
	// },

	// This Pushes JS Files to the /js sub-folder inside /static
	output: {
		filename: utils.assetsPath('js/[name].[chunkhash].js'),
		chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
	},

	plugins: [
		// Compress extracted CSS. We are using this plugin so that possible
		// duplicated CSS from different components can be deduped.
		// new OptimizeCSSPlugin({
		// 	cssProcessorOptions: {
		// 		safe: true
		// 	}
		// }),

		// Why?
		// new HtmlWebpackPlugin({
		// 	filename: process.env.NODE_ENV === 'testing'
		// 		? 'index.html'
		// 		: config.build.index,
		// 	template: './src/index.template.html',
		// 	inject: true,
		// 	minify: {
		// 		removeComments: true,
		// 		collapseWhitespace: true,
		// 		removeAttributeQuotes: true
		// 	},
		// 	chunksSortMode: 'dependency'
		// }),
	]
});

if (config.build.productionGzip) {
	var CompressionWebpackPlugin = require('compression-webpack-plugin');

	webpackConfig.plugins.push(
		new CompressionWebpackPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp(
				'\\.(' +
				config.build.productionGzipExtensions.join('|') +
				')$'
			),
			threshold: 10240,
			minRatio: 0.8
		})
	);
}

if (config.build.bundleAnalyzerReport) {
	var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
	webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
