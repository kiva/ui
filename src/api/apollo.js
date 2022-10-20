/* eslint-disable no-underscore-dangle */
import { ApolloLink, ApolloClient, InMemoryCache } from '@apollo/client/core';

import loanResolverFactory from '@/api/localResolvers/loan';
import Auth0LinkCreator from './Auth0Link';
import BasketLinkCreator from './BasketLink';
import ContentfulPreviewLink from './ContentfulPreviewLink';
import ExperimentIdLink from './ExperimentIdLink';
import HttpLinkCreator from './HttpLink';
import NetworkErrorLink from './NetworkErrorLink';
import SnowplowSessionLink from './SnowplowSessionLink';
// import initState from './localState';

const { resolvers } = loanResolverFactory();
const { LoanPartner, LoanDirect } = resolvers;

export const typePolicies = {
	LoanPartner: {
		fundraisingPercent: {
			read(_, { readField }) {
				return LoanPartner.fundraisingPercent(readField('loan'));
			}
		},
		fundraisingTimeLeft: {
			read(_, { readField }) {
				return LoanPartner.fundraisingTimeLeft(readField('loan'));
			}
		},
		unreservedAmount: {
			read(_, { readField }) {
				return LoanPartner.unreservedAmount(readField('loan'));
			}
		},
		fundraisingTimeLeftMilliseconds: {
			read(_, { readField }) {
				return LoanPartner.fundraisingTimeLeftMilliseconds(readField('loan'));
			}
		},
	},
	LoanDirect: {
		fundraisingPercent: {
			read(_, { readField }) {
				return LoanDirect.fundraisingPercent(readField('loan'));
			}
		},
		fundraisingTimeLeft: {
			read(_, { readField }) {
				return LoanDirect.fundraisingTimeLeft(readField('loan'));
			}
		},
		unreservedAmount: {
			read(_, { readField }) {
				return LoanDirect.unreservedAmount(readField('loan'));
			}
		},
		fundraisingTimeLeftMilliseconds: {
			read(_, { readField }) {
				return LoanDirect.fundraisingTimeLeftMilliseconds(readField('loan'));
			}
		},
	},
	Setting: {
		keyFields: ['key'],
	},
	Query: {
		// Combine top level fields without ids
		// https://www.apollographql.com/docs/react/caching/cache-field-behavior/#the-merge-function
		fields: {
			community: {
				merge: true
			},
			general: {
				merge: true
			},
			ml: {
				merge: true,
			},
			contentful: {
				merge: true,
			},
			lend: {
				merge: true,
			},
			my: {
				merge: true,
			},
			getCategories: {
				merge: true
			},
			mySubscriptions: {
				merge: true
			},
			fundraisingLoans: {
				merge: true
			},
			activeLoan: {
				merge: true
			}
		},
	},
	Mutation: {
		AutolendingMutation: {
			merge: true
		}
	}
};

export default function createApolloClient({
	cookieStore,
	kvAuth0,
	types,
	uri,
	fetch
}) {
	// initialize local state resolvers

	const possibleTypes = {};
	types.forEach(element => {
		const typeList = [element.possibleTypes.map(type => type.name)];
		// eslint-disable-next-line prefer-destructuring
		possibleTypes[element.name] = typeList[0];
	});

	const cache = new InMemoryCache({
		possibleTypes,
		typePolicies
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

	client.resetStore();

	return client;
}
