const styleLoaders = require('../build/style-loaders');
const kvWebpackConfig = require('../build/webpack.base.conf');
var SvgStorePlugin = require('webpack-svgstore-plugin');

module.exports = {
	stories: [
		'./stories/**/*.stories.@(js|mdx)'
	],
	addons: [
		'@storybook/addon-essentials',
		'@storybook/addon-knobs',
		'@storybook/addon-links',
		'@storybook/addon-a11y',
		'@storybook/addon-storysource'
	],
	webpackFinal: (config) => {
		const newConfig = {
			...config,
			resolve: {
				...config.resolve,
				...kvWebpackConfig.resolve,
				alias: {
					...config.resolve.alias,
					...kvWebpackConfig.resolve.alias,
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
						test: /\.scss$/,
						use: ["vue-style-loader"].concat(styleLoaders)
					},
					...kvWebpackConfig.module.rules,
					{
						test: /\.vue$/,
						loader: 'vue-docgen-loader', // necessary for storybook prop tables
						enforce: 'post',
					},
				]
			},
		};
		newConfig.devtool = false;
		newConfig.plugins.push(
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
			})
		)
		return newConfig;
	}
};
