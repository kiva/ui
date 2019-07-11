const { introspectSchema } = require('graphql-tools');
const { HttpLink } = require('apollo-link-http');
const fetch = require('./fetch');

// Return a GraphQLSchema made from introspecting a remote api
module.exports = function getRemoteGqlSchema(uri) {
	// Create link to remote api
	const link = new HttpLink({ uri, fetch });

	// Do the fetch
	return introspectSchema(link);
};
