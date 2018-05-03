var merge = require('webpack-merge');
var assetsPath = require('./assets-path');
var styleLoaders = require('./style-loaders');
var baseWebpackConfig = require('./webpack.client.base.conf');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge.smart(baseWebpackConfig, {
	mode: 'production',
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
	},
	// module: {
	// 	rules: [
	// 		{
	// 			test: /\.scss$/,
	// 			use: ExtractTextPlugin.extract({
	// 				use: styleLoaders,
	// 				fallback: 'vue-style-loader'
	// 			})
	// 		},
	// 	]
	// },
	plugins: [
		// new ExtractTextPlugin({
		// 	filename: assetsPath('css/[name].[chunkhash].css')
		// }),
		// new OptimizeCSSPlugin({
		// 	cssProcessorOptions: {
		// 		safe: true
		// 	}
		// }),
		new BundleAnalyzerPlugin({
			analyzerMode: 'disabled',
			generateStatsFile: true,
			statsFilename: 'client-bundle-stats.json'
		})
	]
});
