process.env.NODE_ENV = 'production'

const { merge } = require('webpack-merge');
var baseWebpackConfig = require('./webpack.client.base.conf');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(baseWebpackConfig, {
	mode: 'production',
	plugins: [
		new BundleAnalyzerPlugin({
			analyzerMode: 'disabled',
			generateStatsFile: true,
			statsFilename: 'client-bundle-stats.json'
		})
	]
});
