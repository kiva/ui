const { join } = require('path');
const { readFile, writeFile } = require('fs');
const { concat, map, uniqBy } = require('lodash');
const { buildSchema, printSchema } = require('graphql');
const { introspectSchema, mergeSchemas } = require('graphql-tools');
const { HttpLink } = require('apollo-link-http');
const fetch = require('isomorphic-fetch');

// Return a GraphQLSchema made from a file
function readLocalSchema(schemaPath) {
	return new Promise((resolve, reject) => {
		// Fetch local schema
		readFile(schemaPath, 'utf8', (err, data) => {
			if (err) {
				reject(err);
			} else {
				// Resolve with schema built from file data
				resolve(buildSchema(data));
			}
		});
	});
}

// Return a GraphQLSchema made from introspecting a remote api
function fetchRemoteSchema(uri) {
	// Create link to remote api
	const link = new HttpLink({ uri, fetch });

	// Do the fetch
	return introspectSchema(link);
}

// Merge GraphQLSchema objects for client usage (i.e. including directives)
function mergeClientSchemas(...schemas) {
	// Merge types
	const schema = mergeSchemas({ schemas });

	// Get the directives from each schema
	const schemaDirectives = map(schemas, '_directives');

	// Merge directives by name (directives are ignored by mergeSchemas())
	/* eslint-disable-next-line no-underscore-dangle */
	schema._directives = uniqBy(concat(...schemaDirectives), 'name');

	return schema;
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
	readLocalSchema(join(__dirname, '../src/api/localSchema.graphql')),
	fetchRemoteSchema('https://api.dev.kivaws.org/graphql')
]).then(schemas => {
	const schema = mergeClientSchemas(...schemas);
	return writeSchemaFile(schema, join(__dirname, 'schema.graphql'));
});
