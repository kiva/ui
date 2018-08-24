var path = require('path');
var assetsPath = require('./assets-path');
var styleLoaders = require('./style-loaders');
var config = require('../config');
var VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
var StylelintPlugin = require('stylelint-webpack-plugin');
var webpack = require('webpack');
var GitRevisionPlugin = require('git-revision-webpack-plugin');
var gitRevisionPlugin = new GitRevisionPlugin({
	branch: true
});

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
			// ensure we import and use the minified version (import name matches what is used in component)
			'MeteredPassword': 'vue-password-strength-meter/dist/vue-password-strength-meter.min.js',
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
				// Inject styles from the /pages/ directory as <style> tags
				test: /\/pages\/.+\.scss$/,
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
				test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
				exclude: [resolve('src/assets/icons')],
				loader: 'url-loader',
				options: {
					limit: 1, // 10000 is default but we'd need to exclude apple-touch-icons,
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
			files: ['src/**/*.scss'],
			syntax: 'scss'
		}),
		new webpack.DefinePlugin({
			UI_COMMIT: JSON.stringify(gitRevisionPlugin.commithash()),
			UI_BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
		})
	]
};
