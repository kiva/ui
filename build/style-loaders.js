// If document is defined, dart-sass will attempt to run as if it were in the browser. However, some
// code editors expose document, so dart-sass will sometimes throw errors when this config is loaded
// by editor plugins. We won't use webpack in a browser, so to resolve the issue we can just check
// for document before attempting to load dart-sass.
var isNode = typeof document === 'undefined';
var sass = isNode ? require('dart-sass') : function() {};

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
			implementation: sass,
			includePaths: [
				'src/assets/fonts',
				'src/assets/scss',
				'node_modules/foundation-sites/scss'
			]
		}
	}
];
