/* eslint-disable no-underscore-dangle */
import { ApolloLink, ApolloClient, InMemoryCache } from '@apollo/client/core';

import Auth0LinkCreator from './Auth0Link';
import BasketLinkCreator from './BasketLink';
import ContentfulPreviewLink from './ContentfulPreviewLink';
import ExperimentIdLink from './ExperimentIdLink';
import HttpLinkCreator from './HttpLink';
import NetworkErrorLink from './NetworkErrorLink';
import SnowplowSessionLink from './SnowplowSessionLink';
import initState from './localState';

export default function createApolloClient({
	appConfig,
	cookieStore,
	kvAuth0,
	types,
	uri,
	fetch
}) {
	// initialize local state resolvers
	const { resolvers } = initState({ appConfig, cookieStore, kvAuth0 });

	const possibleTypes = {};
	types.forEach(element => {
		const typeList = [element.possibleTypes.map(type => type.name)];
		// eslint-disable-next-line prefer-destructuring
		possibleTypes[element.name] = typeList[0];
	});

	const cache = new InMemoryCache({
		possibleTypes,
		typePolicies: {
			resolvers
		}
	});

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

	return client;
}
