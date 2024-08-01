import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFile, writeFile } from 'fs';
import { extendSchema, parse, printSchema } from 'graphql';
import minimist from 'minimist';
import getRemoteGqlSchema from '../server/util/getRemoteGqlSchema.js';
import selectConfig from '../config/selectConfig.js';

const argv = minimist(process.argv.slice(2));
const config = await selectConfig(argv.config);

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

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
