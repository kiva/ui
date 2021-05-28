process.env.NODE_ENV = 'production'

const { mergeWithRules } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.client.base.conf');

module.exports = mergeWithRules({
	module: {
		rules: {
			test: 'match',
			use: {
				loader: 'match',
				options: 'replace',
			},
		},
	},
})(baseWebpackConfig, {
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							plugins: ['istanbul'],
						},
					},
				],
			}
		],
	},
});
