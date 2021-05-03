var path = require('path');
var assetsPath = require('./assets-path');
var styleLoaders = require('./style-loaders');
var config = require('../config');
var VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
var FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
var webpack = require('webpack');
var GitRevisionPlugin = require('git-revision-webpack-plugin');
var gitRevisionPlugin = new GitRevisionPlugin({
	branch: true
});
const isProd = process.env.NODE_ENV === 'production';
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin-fixed-hashbug')

function resolve (dir) {
	return path.join(__dirname, '..', dir);
}

// When webpack encounters an .SVG in one of these directories, it will inline it as a vue component using vue-svg-loader
const inlineSvgDirs = [
	resolve('src/assets/icons/inline/'),
	resolve('src/assets/inline-svgs/'),
	resolve('node_modules/flag-icon-css/flags/4x3/'),
	resolve('node_modules/flag-icon-css/flags/1x1/')
];

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
			'~': resolve('node_modules'),
			'@': resolve('src'),
			'foundation': 'foundation-sites/js',
			// alias promise module to handle timesync calling require('promise')
			'promise': resolve('build/promise.js')
		}
	},
	module: {
		rules: [
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
				test: /(manifest\.webmanifest|manifest\.json|browserconfig\.xml)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: assetsPath('manifest/[name].[hash:7].[ext]'),
						}
					},
					{
						loader: "app-manifest-loader",
					}
				],
			},
			{
				// Inject styles from the /pages/ directory as <style> tags
				// Also injects TheHeader styles to each page css file
				test: /(\/pages\/.+\.scss|\/TheHeader\.scss)/,
				use: [
					{ loader: 'thread-loader' },
					{ loader: 'vue-style-loader' },
				].concat(styleLoaders)
			},
			{
				test: /\.html$/,
				loader: resolve('build/template-string-loader'),
				include: [resolve('src'), resolve('test')]
			},
			{
				test: /\.js$/,
				use: [
					{ loader: 'thread-loader' },
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
						},
					},
				],
				include: [resolve('src'), resolve('test')]
			},
			{
				test: /\.(graphql|gql)$/,
				exclude: /node_modules/,
				use: [
					{ loader: 'thread-loader' },
					{ loader: 'graphql-tag/loader' },
				],
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
					name: assetsPath('fonts/[name].[hash:7].[ext]'),
					esModule: false,
				}
			},
			{
				test: /\.(png|jpe?g|gif|webp|avif|svg|ico)(\?.*)?$/,
				exclude: inlineSvgDirs,
				loader: 'url-loader',
				options: {
					limit: 1, // 10000 is default but we'd need to exclude apple-touch-icons,
					name: assetsPath('img/[name].[hash:7].[ext]'),
					esModule: false,
				}
			},
			{
				test: /\.svg$/,
				include: inlineSvgDirs,
				use: [
					{ loader: 'babel-loader' },
					{
						loader: 'vue-svg-loader',
						options: {
							svgo: {
								plugins: [
									{ removeTitle: false },
								],
							},
						},
					},
				],
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: assetsPath('media/[name].[hash:7].[ext]'),
					esModule: false,
				}
			},
			{
				test: /assets\/binary\//,
				loader: 'file-loader',
				options: {
					name: assetsPath('binary/[name].[hash:7].[ext]'),
					esModule: false,
				}
			},
			{
				test: /assets\/wasm\//,
				loader: 'file-loader',
				// This prevents webpack from trying to load these as modules, which
				// avoids the "Module parse failed: magic header not detected" error
				type: 'javascript/auto',
				options: {
					name: assetsPath('wasm/[name].[hash:7].[ext]'),
					esModule: false,
				}
			},
		]
	},
	plugins: [
		new FilterWarningsPlugin({
			exclude: /vue-loader.*type=style/
		}),
		new VueLoaderPlugin(),
		new webpack.DefinePlugin({
			UI_COMMIT: JSON.stringify(gitRevisionPlugin.commithash()),
			UI_BRANCH: JSON.stringify(gitRevisionPlugin.branch())
		}),
		...(isProd ? [] : [new HardSourceWebpackPlugin({
			configHash(webpackConfig) {
				return `${process.env.NODE_ENV.substring(0,3)}_${require('node-object-hash')({sort: false}).hash(webpackConfig)}`
			},
			cachePrune: {
				// Caches younger than `maxAge` are not considered for deletion. They must
				// be at least this (default: 2 days) old in milliseconds.
				maxAge: 2 * 24 * 60 * 60 * 1000,
				// Prune once cache reaches 500MB
				sizeThreshold: 500 * 1024 * 1024
			}
		})])
	]
};
