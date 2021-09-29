const { merge } = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var nodeExternals = require('webpack-node-externals');
var VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';

module.exports = merge(baseWebpackConfig, {
	mode: isProd ? 'production' : baseWebpackConfig.mode,
	entry: './src/server-entry.js',
	target: 'node',
	devtool: isProd ? 'source-map' : 'eval',
	output: {
		libraryTarget: 'commonjs2'
		, filename: 'server-bundle.js'
	},
	// https://webpack.js.org/configuration/externals/#externals
	// https://github.com/liady/webpack-node-externals
	externals: nodeExternals({
		allowlist: [
			// do not externalize style files in case we need to import it from a dep
			/\.css$/,
			/\.scss$/,
			/\.vue$/,
			/\?vue&type=style/,
			// allow algolia deps https://github.com/algolia/vue-instantsearch/issues/588
			// TODO: remove once they have SSR enabled
			/vue-instantsearch/,
			/instantsearch.js/,
			// allow timesync & promise to handle timesync calling require('promise')
			/timesync/,
			/promise/,
			// allow flag icon sprites
			/flag-icon-css/,
		]
	}),
	plugins: [
		// suppress client-side-only modules
		new VueSSRServerPlugin(),
		new FriendlyErrorsPlugin({
			clearConsole: false,
			compilationSuccessInfo: {
				messages: ['Server bundle compiled.\n']
			}
		})
	]
});
