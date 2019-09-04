const { join } = require('path');
const { readFile, writeFile } = require('fs');
const { extendSchema, parse, printSchema } = require('graphql');
const getRemoteGqlSchema = require('../server/util/getRemoteGqlSchema');
const argv = require('minimist')(process.argv.slice(2));
const config = require('../config/selectConfig')(argv.config);

// Return an AST made from local schema
function getLocalAST(schemaPath) {
	return new Promise((resolve, reject) => {
		// Fetch local schema
		readFile(schemaPath, 'utf8', (err, data) => {
			if (err) {
				reject(err);
			} else {
				// Resolve with AST parsed from file data
				resolve(parse(data));
			}
		});
	});
}

// Write a GraphQLSchema out to a file
function writeSchemaFile(schema, filePath) {
	return new Promise((resolve, reject) => {
		writeFile(filePath, printSchema(schema), err => {
			if (err) {
				reject(err);
			} else {
				resolve(true);
			}
		});
	});
}

// Fetch the schemas, merge them, and write them out a file
Promise.all([
	getRemoteGqlSchema(config.server.graphqlUri),
	getLocalAST(join(__dirname, '../src/api/localSchema.graphql'))
]).then(([remoteSchema, localAST]) => {
	const schema = extendSchema(remoteSchema, localAST);
	return writeSchemaFile(schema, join(__dirname, 'schema.graphql'));
});
