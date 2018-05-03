var path = require('path');
var assetsPath = require('./assets-path');
var styleLoaders = require('./style-loaders');
var config = require('../config');
var VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
var StylelintPlugin = require('stylelint-webpack-plugin');

function resolve (dir) {
	return path.join(__dirname, '..', dir);
}

module.exports = {
	mode: 'none',
	output: {
		path: config.build.assetsRoot,
		// This Pushes JS Files to the /js sub-folder inside /static
		filename: assetsPath('js/[name].[hash].js'),
		chunkFilename: assetsPath('js/[name].[chunkhash].js'),
		publicPath: '/',
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'@': resolve('src'),
			'foundation': 'foundation-sites/js',
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
				options: {
					transformAssetUrls: {
						video: 'src',
						source: 'src',
						img: 'src',
						image: 'xlink:href'
					}
				}
			},
			{
				test: /\.scss$/,
				use: ['vue-style-loader'].concat(styleLoaders)
			},
			{
				test: /\.html$/,
				loader: resolve('build/template-string-loader'),
				include: [resolve('src'), resolve('test')]
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
				test: /\.(graphql|gql)$/,
				exclude: /node_modules/,
				loader: 'graphql-tag/loader'
			},
			{
				test: /fonts\/.+\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: assetsPath('fonts/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				exclude: /(icons|fonts)\//,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: assetsPath('media/[name].[hash:7].[ext]')
				}
			}
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		new StylelintPlugin({
			files: ['src/**/*.vue', 'src/**/*.scss'],
			syntax: 'scss'
		})
	]
};
