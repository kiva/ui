/* eslint-disable no-underscore-dangle */
import { ApolloLink, ApolloClient } from '@apollo/client/core';
import { ApolloCache, InMemoryCache } from '@apollo/client/cache';

import Auth0LinkCreator from './Auth0Link';
import BasketLinkCreator from './BasketLink';
import ContentfulPreviewLink from './ContentfulPreviewLink';
import ExperimentIdLink from './ExperimentIdLink';
import HttpLinkCreator from './HttpLink';
import NetworkErrorLink from './NetworkErrorLink';
import SnowplowSessionLink from './SnowplowSessionLink';
import initState from './localState';
import gql from 'graphql-tag';

export default function createApolloClient({
	appConfig,
	cookieStore,
	kvAuth0,
	types,
	uri,
	fetch
}) {
	const possibleTypes = {};
	types.forEach(e=> {
		const types = [e.possibleTypes.map(type => type.name)];
		possibleTypes[e.name] = types[0];
	});

	const cache = new InMemoryCache({
		possibleTypes
	});

	// initialize local state resolvers
	const { resolvers, defaults } = initState({ appConfig, cookieStore, kvAuth0 });

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

	// // set default local state
	// client.writeQuery({
	// 	query: gql`
	// 		query GetCartItems {
	// 			cartItems
	// 		}`
	// 	,
	// 	data: defaults
	// })

	return client;
}
