module.exports = [
	{
		loader: 'css-loader',
		options: {
			minimize: {
				safe: true,
				discardComments: {
					removeAll: true
				},
			}
		}
	},
	'postcss-loader',
	{
		loader: 'sass-loader',
		options: {
			implementation: require('dart-sass'),
			includePaths: [
				'src/assets/fonts',
				'src/assets/scss',
				'node_modules/foundation-sites/scss'
			]
		}
	}
];
