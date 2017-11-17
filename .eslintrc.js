// http://eslint.org/docs/user-guide/configuring
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module'
	},
	env: {
		browser: true,
	},
	extends: 'airbnb-base',
	// required to lint *.vue files
	plugins: [
		'import',
		'html'
	],
	// check if imports actually resolve
	'settings': {
		'import/resolver': {
			'webpack': {
				'config': 'build/webpack.base.conf.js'
			}
		}
	},
	// add your custom rules here
	'rules': {
		// tabs not spaces
		'indent': ['error', 'tab'],
		'no-tabs': 'off',
		// don't require .vue extension when importing
		'import/extensions': ['error', 'always', {
			'js': 'never',
			'vue': 'never'
		}],
		// allow optionalDependencies
		'import/no-extraneous-dependencies': ['error', {
			'optionalDependencies': ['test/unit/index.js']
		}],
		// allow debugger during development
		'no-debugger': isProd ? 'error' : 'off',
		// allow console during development
		'no-console': isProd ? 'warn' : 'off',
		// allow curly brackets around arrow function bodies
		'arrow-body-style': 'off',
		// allow no parens for single-argument arrow functions
		'arrow-parens': ['error','as-needed'],
		// allow no return statement
		'consistent-return': 'off',
		// allow (but do not require) dangling commas
		'comma-dangle': ['error', 'only-multiline'],
	}
}
