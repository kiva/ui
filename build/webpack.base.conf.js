var path = require('path');
var assetsPath = require('./assets-path');
var styleLoaders = require('./style-loaders');
var config = require('../config');
var VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
var StylelintPlugin = require('stylelint-webpack-plugin');
var FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
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
		extensions: ['.mjs', '.js', '.vue', '.json'],
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
				test: /\.(graphql|gql)$/,
				exclude: /node_modules/,
				loader: 'graphql-tag/loader'
			},
			{
				// Modules who define their `browser` or `module` key as `mjs` force
				// the use of this extension, so we need to tell webpack to fall back
				// to auto mode (ES Module interop, allows ESM to import CommonJS).
				test: /\.mjs$/,
				include: /node_modules/,
				type: 'javascript/auto'
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
		new FilterWarningsPlugin({
			exclude: /vue-loader.*type=style/
		}),
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
