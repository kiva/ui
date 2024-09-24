import { loadSchema } from '@graphql-tools/load';
import { UrlLoader } from '@graphql-tools/url-loader';
import fetch from './fetch.js';

// Return a GraphQLSchema made from introspecting a remote api
export default function getRemoteGqlSchema(uri) {
	// Load schema from endpoint
	// https://www.graphql-tools.com/docs/schema-loading
	return loadSchema(uri, {
		loaders: [
			new UrlLoader()
		],
		customFetch: fetch,
	});
}
