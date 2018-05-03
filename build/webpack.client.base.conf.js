var config = require('../config');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var SvgStorePlugin = require('webpack-svgstore-plugin');
var VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

module.exports = merge.smart(baseWebpackConfig, {
	entry: {
		app: './src/client-entry.js'
	},
	devtool: config.build.productionSourceMap ? '#source-map' : false,
	plugins: [
		// minify and combine svg icons
		new SvgStorePlugin({
			svg: {
				'xmlns': 'http://www.w3.org/2000/svg',
				'xmlns:xlink': 'http://www.w3.org/1999/xlink',
				'style': 'display:none;',
			},
			svgoOptions: {
				plugins: [],
				floatPrecision: 2,
			},
			prefix: 'icon-',
		}),
		new VueSSRClientPlugin()
	]
});
