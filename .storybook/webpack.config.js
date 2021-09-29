const kvWebpackConfig = require('../build/webpack.base.conf');
var SvgStorePlugin = require('webpack-svgstore-plugin');

module.exports = async ({ config, mode }) => {

	const newConfig = {
		...config,
		devtool: false,
		optimization: {
			minimize: false,
			minimizer: [],
		},
		resolve: {
			...config.resolve,
			alias: {
				...config.resolve.alias,
				...kvWebpackConfig.resolve.alias
			}
		},
		module: {
			...config.module,
			rules: [
				{
					test: /\.stories\.jsx?$/,
					loaders: [require.resolve('@storybook/source-loader')],
					enforce: 'pre',
				},
				{
					test: /\.vue$/,
					loader: 'vue-docgen-loader', // necessary for storybook prop tables
					enforce: 'post',
				},
				...kvWebpackConfig.module.rules,
			]
		},
		plugins: [
			...config.plugins,
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
		]
	};

	return newConfig;
};
