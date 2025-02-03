// http://eslint.org/docs/user-guide/configuring
const path = require('path');
const fs = require('fs');

const isProd = process.env.NODE_ENV === 'production';

// resolve path
const resolve = dir => path.resolve(__dirname, dir);

let schema;

// Use build/schema.graphql as the schema definition. That file only exists after running node build/fetch-schema.js
try {
	schema = fs.readFileSync(resolve('build/schema.graphql')).toString();
} catch (e) {
	console.warn(e);
	schema = 'type Query { hello: String }';
}

const graphqlOptions = {
	env: 'apollo',
	schemaString: schema,
};

module.exports = {
	root: true,
	reportUnusedDisableDirectives: true,
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
	},
	env: {
		node: true,
		browser: true,
		es2022: true,
	},
	extends: ['plugin:vue/vue3-strongly-recommended', 'airbnb-base', 'plugin:storybook/recommended'],
	// required to lint *.vue files
	plugins: [
		'graphql',
		'import',
		'vue'
	],
	// check if imports actually resolve
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.mjs']
			},
			alias: {
				map: [
					['#src', resolve('src')],
					['#kv-components', resolve('node_modules/@kiva/kv-components/dist/vue')],
				],
				extensions: ['.js', '.mjs', '.vue'],
			},
		}
	},
	// add your custom rules here
	rules: {
		// tabs not spaces
		indent: ['error', 'tab', { SwitchCase: 1 }],
		'no-tabs': 'off',
		'vue/html-indent': ['error', 'tab'],
		// max line length 120
		'max-len': ['error', { code: 120 }],
		// don't require .vue extension when importing
		'import/extensions': ['error', 'always', {
			js: 'never',
			vue: 'never',
			mjs: 'never',
		}],
		// allow optionalDependencies
		'import/no-extraneous-dependencies': ['error', {
			optionalDependencies: ['test/unit/index.js']
		}],
		// allow unresolved imports for svg files with a ?url suffix
		'import/no-unresolved': ['error', { ignore: ['\\.svg\\?url$'] }],
		// allow files with only one named export
		'import/prefer-default-export': 'off',
		// allow debugger during development
		'no-debugger': isProd ? 'error' : 'off',
		// allow console during development
		'no-console': isProd ? ['warn', { allow: ['error'] }] : 'off',
		// allow curly brackets around arrow function bodies
		'arrow-body-style': 'off',
		// allow no parens for single-argument arrow functions
		'arrow-parens': ['error', 'as-needed'],
		// allow no return statement
		'consistent-return': 'off',
		// allow (but do not require) dangling commas
		'comma-dangle': ['error', 'only-multiline'],
		// allow promises to be rejected with non-errors
		'prefer-promise-reject-errors': 'off',
		// allow multiple attributes per line in vue templates
		'vue/max-attributes-per-line': 'off',
		// disallow non-void html elements to be self-closing
		'vue/html-self-closing': ['error', {
			html: {
				normal: 'never'
			}
		}],
		// configure graphql schema checking
		'graphql/template-strings': ['warn', graphqlOptions],
		'graphql/no-deprecated-fields': ['warn', graphqlOptions],
		'graphql/named-operations': ['error', graphqlOptions],
		'graphql/required-fields': ['error', { ...graphqlOptions, requiredFields: ['id', 'key'] }],

		// require component names that match the file name
		'vue/require-name-property': 'error',
		'vue/match-component-file-name': [
			'error',
			{
				extensions: ['vue'],
				shouldMatchCase: true,
			},
		],

		// require v-for keys on template root
		'vue/no-v-for-template-key': 'off',
		'vue/no-v-for-template-key-on-child': 'error',
	}
};
