// If document is defined, sass will attempt to run as if it were in the browser. However, some
// code editors expose document, so sass will sometimes throw errors when this config is loaded
// by editor plugins. We won't use webpack in a browser, so to resolve the issue we can just check
// for document before attempting to load sass.
var isNode = typeof document === 'undefined';
var sass = isNode ? require('sass') : function() {};

module.exports = [
	{ loader: 'css-loader' },
	{
		loader: 'postcss-loader',
		options: {
			postcssOptions: {
				plugins: [
					require('autoprefixer'),
					require('cssnano')
				]
			}
		}
	},
	{
		loader: 'sass-loader',
		options: {
			implementation: sass,
			sassOptions: {
				fiber: false, // to disable automatic use of fibers package
				includePaths: [
					'src/assets/fonts',
					'src/assets/scss',
					'node_modules/foundation-sites/scss'
				]
			}
		}
	}
];
