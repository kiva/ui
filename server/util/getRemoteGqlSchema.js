const { loadSchema } = require('@graphql-tools/load');
const { UrlLoader } = require('@graphql-tools/url-loader');
const fetch = require('./fetch');

// Return a GraphQLSchema made from introspecting a remote api
module.exports = function getRemoteGqlSchema(uri) {
	// Load schema from endpoint
	// https://www.graphql-tools.com/docs/schema-loading
	return loadSchema(uri, {
		loaders: [
			new UrlLoader()
		],
		customFetch: fetch,
	});
};
