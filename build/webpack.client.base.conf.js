const { merge } = require('webpack-merge');
var assetsPath = require('./assets-path');
var baseWebpackConfig = require('./webpack.base.conf');
var styleLoaders = require('./style-loaders');
var SvgStorePlugin = require('webpack-svgstore-plugin');
var VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin-fixed-hashbug')
const isProd = process.env.NODE_ENV === 'production';

module.exports = merge(baseWebpackConfig, {
	entry: {
		app: './src/client-entry.js'
	},
	devtool: isProd ? 'source-map' : false,
	optimization: {
		splitChunks: {
			chunks: 'all',
			maxAsyncRequests: 8, // default is 6
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
		...(isProd ? [] : [new HardSourceWebpackPlugin.ExcludeModulePlugin([
			{
				// HardSource works with mini-css-extract-plugin but due to how
				// mini-css emits assets, assets are not emitted on repeated builds with
				// mini-css and hard-source together. Ignoring the mini-css loader
				// modules, but not the other css loader modules, excludes the modules
				// that mini-css needs rebuilt to output assets every time.
				// The above is also true for .woff font files, jpgs/pngs referenced in
				// css, and the SVG sprite created by svgXhr
				test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
			},
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
