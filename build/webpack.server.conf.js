var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var nodeExternals = require('webpack-node-externals');
var VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

module.exports = merge.smart(baseWebpackConfig, {
	entry: './src/server-entry.js',
	target: 'node',
	devtool: 'eval',
	output: {
		libraryTarget: 'commonjs2'
		, filename: 'server-bundle.js'
	},
	module: {
		rules: [
			{
				// Ignore styles not from the /pages/ directory, since it's extracted in the client
				test: /\.scss$/,
				exclude: /\pages\//,
				loader: 'null-loader'
			},
		]
	},
	// https://webpack.js.org/configuration/externals/#externals
	// https://github.com/liady/webpack-node-externals
	externals: nodeExternals({
		// do not externalize style files in case we need to import it from a dep
		whitelist: [
			/\.css$/,
			/\.scss$/,
			/\.vue$/,
			/\?vue&type=style/,
			// whitelist algolia deps https://github.com/algolia/vue-instantsearch/issues/588
			// TODO: remove once they have SSR enabled
			/vue-instantsearch/,
			/instantsearch.js/
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
