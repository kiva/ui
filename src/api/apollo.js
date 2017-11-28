import ApolloClient from 'apollo-client';
import { IntrospectionFragmentMatcher, InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-fetch';

import { Agent } from 'https';

export default function createApolloClient({
	cookie,
	csrfToken = '',
	types = [],
	uri = 'https://api-vm.kiva.org/graphql?app_id=org.kiva.www&scopes=access&user_id=1017419',
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
		headers: {
			'x-crumb': csrfToken,
		},
		fetchOptions: {
			agent: new Agent({
				// fix request blocked b/c of self-signed certificate on dev-vm. maybe do a prod check?
				rejectUnauthorized: false
			})
		}
	};

	// setup authorization
	if (cookie) {
		linkOpts.headers.cookie = cookie;
	} else {
		linkOpts.credentials = 'same-origin';
	}

	// construct client
	return new ApolloClient({
		link: new HttpLink(linkOpts),
		cache: new InMemoryCache(cacheOpts),
	});
}
