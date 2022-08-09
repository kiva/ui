const path = require('path');

module.exports = {
	stories: [
		'./stories/**/*.stories.@(js|mdx)'
	],
	addons: [
		'@storybook/addon-essentials',
		'@storybook/addon-links',
		'@storybook/addon-a11y',
		'@storybook/addon-postcss',
		'@storybook/addon-storysource'
	],
	webpackFinal: async (config) => {
		config.module.rules.push({
		  	test: /\,css&/,
		  	exclude: [/\.module\.css$/, /@storybook/],
		  	use: [
				"style-loader",
				{
					loader: "css-loader",
					options: { importLoaders: 1, sourceMap: false },
				},
				{
				loader: 'postcss-loader',
					options: {
						ident: 'postcss',
						plugins: [
						require('tailwindcss'),
						require('autoprefixer')
						]
					}
				}
		  	],
		  	include: path.resolve(__dirname, '../'),
		})
		return config
	}
}
