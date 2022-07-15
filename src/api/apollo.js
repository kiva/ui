/* eslint-disable no-underscore-dangle */
import { ApolloClient, ApolloLink } from '@apollo/client';
// import {
// 	IntrospectionFragmentMatcher,
// 	InMemoryCache,
// 	defaultDataIdFromObject,
// } from 'apollo-cache-inmemory';
import Auth0LinkCreator from './Auth0Link';
import BasketLinkCreator from './BasketLink';
import ContentfulPreviewLink from './ContentfulPreviewLink';
import ExperimentIdLink from './ExperimentIdLink';
import HttpLinkCreator from './HttpLink';
import NetworkErrorLink from './NetworkErrorLink';
import SnowplowSessionLink from './SnowplowSessionLink';
import initState from './localState';
import cache from './cache';

export default function createApolloClient({
	appConfig,
	cookieStore,
	kvAuth0,
	uri,
	fetch
}) {
	// initialize local state resolvers
	const { defaults } = initState({ appConfig, cookieStore, kvAuth0 });

	const client = new ApolloClient({
		link: ApolloLink.from([
			NetworkErrorLink(),
			SnowplowSessionLink({ cookieStore }),
			ExperimentIdLink({ cookieStore }),
			Auth0LinkCreator({ cookieStore, kvAuth0 }),
			BasketLinkCreator({ cookieStore }),
			ContentfulPreviewLink({ cookieStore }),
			HttpLinkCreator({ kvAuth0, uri, fetch }),
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
