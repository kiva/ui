const path = require('path');
const assetsPath = require('./assets-path');
const config = require('../config');
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const webpack = require('webpack');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin-fixed-hashbug');
const gitRevisionPlugin = new GitRevisionPlugin({
	branch: true,
	lightweightTags: true,
});

const isProd = process.env.NODE_ENV === 'production';
const isNode = typeof document === 'undefined';

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
			'promise': resolve('build/promise.js'),
			// required for src/components/Contentful/DynamicRichText.vue
			'vue$': 'vue/dist/vue.esm.js'
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
				test: /\.css$/,
				exclude: [resolve('src/assets/scss/tailwind')],
				use: [
					{ loader: 'thread-loader' },
					{ loader: 'vue-style-loader' }, // Inject styles as <style> tags
					{ loader: 'css-loader' },
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									require('autoprefixer'),
									require('cssnano'),
								]
							}
						}
					},
				]
			},
			{
				// Allow Tailwind @apply in Vue using <style lang="postcss">
				test: /\.(postcss)$/,
				use: [
					'vue-style-loader',
					{ loader: 'css-loader' },
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									require('cssnano'),
									require('tailwindcss'),
									require('autoprefixer'),
								]
							}
						}
					},
				]
			},
			{
				// Extract tailwind styles since they are global
				test: /\.css$/,
				include: [resolve('src/assets/scss/tailwind')],
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							esModule: true,
						}
					},
					{ loader: 'css-loader' },
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									require('cssnano'),
									require('tailwindcss'),
									require('autoprefixer'),
								]
							}
						}
					},
				],
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'thread-loader',
						options: {
							workerParallelJobs: 2
						}
					},
					{ loader: 'vue-style-loader' }, // Inject styles as <style> tags
					{ loader: 'css-loader' },
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									require('autoprefixer'),
									require('cssnano'),
								]
							}
						}
					},
					{
						loader: 'sass-loader',
						options: {
							// If document is defined, sass will attempt to run as if it were in the browser. However, some
							// code editors expose document, so sass will sometimes throw errors when this config is loaded
							// by editor plugins. We won't use webpack in a browser, so to resolve the issue we can just check
							// for document before attempting to load sass.
							implementation: isNode ? require('sass') : function() {},
							sassOptions: {
								fiber: false, // to disable automatic use of fibers package
								includePaths: [
									'src/assets/fonts',
									'src/assets/scss',
									'node_modules/foundation-sites/scss'
								]
							}
						}
					}
				]
			},
			{
				test: /\.html$/,
				loader: resolve('build/template-string-loader'),
				include: [resolve('src'), resolve('test')]
			},
			{
				test: /\.js$/,
				include: [
					resolve('src'),
					resolve('test'),
					resolve('node_modules/@kiva'),
				],
				use: [
					{ loader: 'thread-loader' },
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
							// These babelrc and configFile settings ensure that all files processed by this loader get
							// transformed using this project's babel config. Without this, babel will search for the
							// config in the package directory of the file being processed, which means that files from
							// node_modules will not use this project's babel config; they will use their own babel
							// config file, or no config at all if they do not have one.
							babelrc: false,
							configFile: resolve('babel.config.js'),
						},
					},
				],
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
		new MiniCssExtractPlugin({
			filename: isProd ? assetsPath('css/[name].[contenthash].css') : assetsPath('css/[name].css'),
			chunkFilename: isProd ? assetsPath('css/[name].[contenthash].css') : assetsPath('css/[name].css'),
		}),
		new VueLoaderPlugin(),
		new webpack.DefinePlugin({
			UI_COMMIT: JSON.stringify(gitRevisionPlugin.commithash()),
			UI_BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
			UI_TAG: JSON.stringify(gitRevisionPlugin.version())
		}),
		...(isProd ? [] : [new HardSourceWebpackPlugin.ExcludeModulePlugin([
			{
				// HardSource works with mini-css-extract-plugin but due to how
				// mini-css emits assets, assets are not emitted on repeated builds with
				// mini-css and hard-source together. Ignoring the mini-css loader
				// modules, but not the other css loader modules, excludes the modules
				// that mini-css needs rebuilt to output assets every time.
				test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
			},
		])]),
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
		})]),
	]
};
