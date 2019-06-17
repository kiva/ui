// http://eslint.org/docs/user-guide/configuring
const path = require('path');
const fs = require('fs');

let schema;

// Use build/schema.graphql as the schema definition. That file only exists after running node build/fetch-schema.js
try {
	const contents = fs.readFileSync(path.join(__dirname, '../../build/schema.graphql'));
	schema = contents.toString();
} catch (e) {
	console.error(e);
	schema = 'type Query { hello: String }';
}

module.exports = {
	plugins: [
		'graphql',
	],
	rules: {
		// configure graphql schema checking
		'graphql/template-strings': ['warn', {
			env: 'literal',
			schemaString: schema,
		}],
		'graphql/no-deprecated-fields': ['warn', {
			env: 'literal',
			schemaString: schema,
		}],
		"graphql/named-operations": ['error', {
			env: 'literal',
			schemaString: schema,
		}],
	}
}
