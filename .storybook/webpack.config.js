
const path = require('path');
const styleLoaders = require('../build/style-loaders');
const kvWebpackConfig = require('../build/webpack.base.conf');


module.exports = async ({ config, mode }) => {

	const newConfig = {
		...config,
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
					test: /\.scss$/,
					use: ["thread-loader", "vue-style-loader"].concat(styleLoaders)
				},
				...kvWebpackConfig.module.rules,
				{
					test: /\.stories\.jsx?$/,
					loaders: [require.resolve('@storybook/source-loader')],
					enforce: 'pre',
				}
			]
		}
	};

	console.dir(newConfig, { depth: null }) || config;
	return newConfig;
};
