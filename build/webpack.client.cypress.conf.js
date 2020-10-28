const { mergeWithRules } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.client.prod.conf');

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
