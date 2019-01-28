var config = require('../config');
var merge = require('webpack-merge');
var assetsPath = require('./assets-path');
var baseWebpackConfig = require('./webpack.base.conf');
var styleLoaders = require('./style-loaders');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var SvgStorePlugin = require('webpack-svgstore-plugin');
var VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

module.exports = merge.smart(baseWebpackConfig, {
	entry: {
		app: './src/client-entry.js'
	},
	devtool: config.build.productionSourceMap ? '#source-map' : false,
	module: {
		rules: [
			{
				// Extract styles, excluding the /pages/ directory as those are injected
				test: /\.scss$/,
				exclude: /\pages\//,
				use: [MiniCssExtractPlugin.loader].concat(styleLoaders)
			},
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: assetsPath('css/[name].[contenthash].css'),
			chunkFilename: assetsPath('css/[name].[contenthash].css'),
		}),
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
		new VueSSRClientPlugin()
	]
});
