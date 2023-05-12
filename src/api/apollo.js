import { ApolloLink, ApolloClient, InMemoryCache } from '@apollo/client/core';
import Auth0LinkCreator from './Auth0Link';
import BasketLinkCreator from './BasketLink';
import ContentfulPreviewLink from './ContentfulPreviewLink';
import ExperimentIdLink from './ExperimentIdLink';
import HttpLinkCreator from './HttpLink';
import NetworkErrorLink from './NetworkErrorLink';
import SnowplowSessionLink from './SnowplowSessionLink';
import { initState, setLocalState } from './localState';

export default function createApolloClient({
	appConfig,
	cookieStore,
	kvAuth0,
	types,
	uri,
	fetch,
	route,
}) {
	const cache = new InMemoryCache({
		possibleTypes: types,
		typePolicies: {
			Mergable: {
				merge: true,
			},
			Setting: {
				keyFields: ['key'],
			},
		}
	});

	const { resolvers } = initState({
		appConfig,
		cookieStore,
		kvAuth0,
		route,
	});

	const client = new ApolloClient({
		link: ApolloLink.from([
			NetworkErrorLink(),
			SnowplowSessionLink({ cookieStore }),
			ExperimentIdLink(),
			Auth0LinkCreator({ cookieStore, kvAuth0 }),
			BasketLinkCreator({ cookieStore }),
			ContentfulPreviewLink({ cookieStore }),
			HttpLinkCreator({
				kvAuth0,
				uri,
				fetch,
				apolloBatching: appConfig?.apolloBatching ?? true,
			}),
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
	setLocalState({ appConfig, cookieStore, kvAuth0 }, cache);
	client.onResetStore(() => setLocalState({ appConfig, cookieStore, kvAuth0 }, cache));

	return client;
}
