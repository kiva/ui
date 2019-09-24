/* eslint-disable no-underscore-dangle */
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import {
	IntrospectionFragmentMatcher,
	InMemoryCache,
	defaultDataIdFromObject,
} from 'apollo-cache-inmemory';
import Auth0LinkCreator from './Auth0Link';
import BasketLinkCreator from './BasketLink';
import HttpLinkCreator from './HttpLink';
import initState from './localState';

export default function createApolloClient({
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
			if (object.__typename === 'Shop') return 'Shop';
			if (object.__typename === 'ShopMutation') return 'ShopMutation';
			return defaultDataIdFromObject(object);
		},
		// Use a simpler underlying cache for server renders
		resultCaching: typeof window !== 'undefined',
		// Block modifying cache results outside of normal operations
		// see https://github.com/apollographql/apollo-client/pull/4543
		freezeResults: true,
	});

	// initialize local state resolvers
	const { resolvers, defaults } = initState({ kvAuth0 });

	const client = new ApolloClient({
		link: ApolloLink.from([
			Auth0LinkCreator(kvAuth0),
			BasketLinkCreator(),
			HttpLinkCreator({ csrfToken, uri }),
		]),
		cache,
		resolvers,
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
		},
		// Allow optimizations that are only possible because we have freezeResults=true
		// see https://github.com/apollographql/apollo-client/pull/4543
		assumeImmutableResults: true,
	});

	// set default local state
	cache.writeData({ data: defaults });
	client.onResetStore(() => cache.writeData({ data: defaults }));

	return client;
}
