/* eslint-disable no-underscore-dangle */
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import {
	IntrospectionFragmentMatcher,
	InMemoryCache,
	defaultDataIdFromObject,
} from 'apollo-cache-inmemory';
import Auth0LinkCreator from './Auth0Link';
import HttpLinkCreator from './HttpLink';
import StateLinkCreator from './StateLink';

export default function createApolloClient({
	cookieStore,
	csrfToken,
	kvAuth0,
	types = [],
	uri,
}) {
	const cache = new InMemoryCache({
		fragmentMatcher: new IntrospectionFragmentMatcher({
			introspectionQueryResultData: {
				__schema: { types }
			}
		}),
		// Return a custom cache id for types that don't have an id field
		dataIdFromObject: object => {
			if (object.__typename === 'Setting' && object.key) return `Setting:${object.key}`;
			return defaultDataIdFromObject(object);
		},
	});

	return new ApolloClient({
		link: ApolloLink.from([
			Auth0LinkCreator(kvAuth0),
			StateLinkCreator({ cache, cookieStore }),
			HttpLinkCreator({ cookie: cookieStore.getCookieString(), csrfToken, uri }),
		]),
		cache,
		defaultOptions: {
			watchQuery: {
				errorPolicy: 'all',
			},
			query: {
				errorPolicy: 'all',
			},
			mutate: {
				errorPolicy: 'all',
			},
		}
	});
}
