import ApolloClient from 'apollo-client';
import { IntrospectionFragmentMatcher, InMemoryCache } from 'apollo-cache-inmemory';
import { BatchHttpLink } from 'apollo-link-batch-http';
import fetch from 'isomorphic-fetch';

import { Agent } from 'https';

export default function createApolloClient({
	cookie,
	csrfToken = '',
	types = [],
	uri = 'https://www.kiva.org/ajax/graphql',
}) {
	// default cache options
	const cacheOpts = {
		fragmentMatcher: new IntrospectionFragmentMatcher({
			introspectionQueryResultData: {
				__schema: { types }
			}
		})
	};

	// default link options
	const linkOpts = {
		uri,
		fetch,
		headers: {},
		fetchOptions: {
			agent: new Agent({
				// fix request blocked b/c of self-signed certificate on dev-vm. maybe do a prod check?
				rejectUnauthorized: false
			})
		}
	};

	// only add the csrf token if we have one
	if (csrfToken.length > 0) {
		linkOpts.headers['x-crumb'] = csrfToken;
	}

	// setup authorization
	if (cookie) {
		linkOpts.headers.cookie = cookie;
	} else {
		linkOpts.credentials = 'same-origin';
	}

	// construct client
	return new ApolloClient({
		link: new BatchHttpLink(linkOpts),
		cache: new InMemoryCache(cacheOpts),
	});
}
