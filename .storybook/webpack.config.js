
const path = require('path');
// your app's webpack.config.js
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
