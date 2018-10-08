module.exports = [
	'css-loader',
	{
		loader: 'postcss-loader',
		options: {
			ident: 'postcss',
			plugins: (loader) => [
				require('autoprefixer')(),
				require('cssnano')()
			]
		}
	},
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
