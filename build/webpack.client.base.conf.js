const { merge } = require('webpack-merge');
var assetsPath = require('./assets-path');
var baseWebpackConfig = require('./webpack.base.conf');
var CompressionPlugin = require('compression-webpack-plugin');
var SvgStorePlugin = require('webpack-svgstore-plugin');
var VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin-fixed-hashbug')
const isProd = process.env.NODE_ENV === 'production';

const compressionOptions = {
	// Compress all assets for upload
	minRatio: Infinity,
	// Ignore fonts because they are already compressed
	exclude: /\.woff|\.woff2|\.ttf|\.eot/,
};

module.exports = merge(baseWebpackConfig, {
	entry: {
		app: './src/client-entry.js'
	},
	devtool: isProd ? 'source-map' : false,
	optimization: {
		splitChunks: {
			chunks: 'all',
			maxAsyncRequests: Infinity, // default is 6
			cacheGroups: {
				vendors: false
			}
		}
	},
	plugins: [
		// minify and combine svg icons
		new SvgStorePlugin({
			svg: {
				'xmlns': 'http://www.w3.org/2000/svg',
				'xmlns:xlink': 'http://www.w3.org/1999/xlink',
				'style': 'display:none;',
			},
			svgoOptions: {
				floatPrecision: 3,
			},
			prefix: 'icon-',
		}),
		// file compression
		...(isProd ? [
			// gzip compression
			new CompressionPlugin({
				...compressionOptions,
			}),
			// brotli compression
			new CompressionPlugin({
				...compressionOptions,
				filename: "[path][base].br",
				algorithm: "brotliCompress",
			}),
		] : []),
		...(isProd ? [] : [new HardSourceWebpackPlugin.ExcludeModulePlugin([
			// Due to how some loaders emit assets, certain assets are not emitted
			// on repeated builds with those loaders and hard-source together.
			// This is true for .woff font files, jpgs/pngs referenced in
			// css, and the SVG sprite created by svgXhr
			{
				test: /url-loader.*woff|url-loader.*png|url-loader.*jpg/,
			},
			{
				test: /iconLoader.js/,
			},
		])]),
		new VueSSRClientPlugin()
	]
});
