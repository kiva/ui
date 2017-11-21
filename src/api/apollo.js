import ApolloClient from 'apollo-client';
import { IntrospectionFragmentMatcher, InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-fetch';

export default ({
	cookie,
	csrfToken = '',
	types = [],
	uri = 'https://api-vm.kiva.org/graphql?app_id=org.kiva.www&scopes=access&user_id=1017419',
}) => {
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
};
