// http://eslint.org/docs/user-guide/configuring
const path = require('path');
const fs = require('fs');

let schema;

// Use build/schema.graphql as the schema definition. That file only exists after running node build/fetch-schema.js
try {
	schema = fs.readFileSync(path.join(__dirname, '../../build/schema.graphql')).toString();
} catch (e) {
	console.warn(e);
	schema = 'type Query { hello: String }';
}

const graphqlOptions = {
	env: 'literal',
	schemaString: schema,
};

module.exports = {
	plugins: [
		'graphql',
	],
	rules: {
		// configure graphql schema checking
		'graphql/template-strings': ['warn', graphqlOptions],
		'graphql/no-deprecated-fields': ['warn', graphqlOptions],
		'graphql/named-operations': ['error', graphqlOptions],
		'graphql/required-fields': ['error', { ...graphqlOptions, requiredFields: ['id', 'key'] }],
	}
};
