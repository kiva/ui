var path = require('path');
var webpack = require('webpack');
var utils = require('./utils');
var config = require('../config');
var vueLoaderConfig = require('./vue-loader.conf');

const isProd = process.env.NODE_ENV === 'production';

function resolve (dir) {
	return path.join(__dirname, '..', dir);
}

let webpackConfig = {
	output: {
		path: config.build.assetsRoot,
		filename: '[name].[chunkhash].js',
		// filename: '[name].js',
		publicPath: process.env.NODE_ENV === 'production'
			? config.build.assetsPublicPath
			: config.dev.assetsPublicPath
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'@': resolve('src'),
			'foundation': 'foundation-sites/js/foundation',
			'modernizr': 'npm-modernizr',
			'moment': 'moment/src/moment',
		}
	},
	module: {
		rules: [
			{
				test: /\.(js|vue)$/,
				loader: 'eslint-loader',
				enforce: 'pre',
				include: [resolve('src'), resolve('test')],
				options: {
					formatter: require('eslint-friendly-formatter')
				}
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: vueLoaderConfig
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [resolve('src'), resolve('test')]
			},
			{
				test: /js\/foundation/,
				use: 'imports-loader?jQuery=jquery'
			},
			{
				test: /npm-modernizr/,
				use: 'imports-loader?this=>window'
			},
			{
				test: /\.(graphql|gql)$/,
				exclude: /node_modules/,
				loader: 'graphql-tag/loader'
			},
			{
				test: /icons\/[a-zA-Z0-9\-]+\.svg$/,
				use: ['svg-sprite-loader', 'svgo-loader']
			},
			{
				test: /fonts\/.+\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				exclude: /(icons|fonts)\//,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('media/[name].[hash:7].[ext]')
				}
			}
		]
	},
	plugins: [
		// TODO: Consider profiding $ + Foundation globally
		// - meaning it's always available within a component with no need to import
		// new webpack.ProvidePlugin({
		// 	$: 'jquery',
		// 	jQuery: 'jquery',
		// 	Foundation: 'foundation'
		// })
	]
}

if (isProd) {
	const ExtractTextPlugin = require('extract-text-webpack-plugin');
	const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

	webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
			compress: { warnings: false }
			, sourceMap: true
		}),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new ExtractTextPlugin({
			// filename: 'static/css/common.[chunkhash].css'
			filename: 'static/css/[name].[chunkhash].css'
		}),
		new OptimizeCSSPlugin({
			cssProcessorOptions: {
				safe: true
			}
		})
	);
} else {
	const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

	webpackConfig.plugins.push(
		new FriendlyErrorsPlugin()
	);
}

module.exports = webpackConfig;
