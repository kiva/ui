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
	activeLoan: {
		merge: true
	},
	LoanChannel: {
		keyFields: ['id'],
	},
	RecLoanChannel: {
		keyFields: ['id'],
	},
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
	loanSearchState: {
		keyFields: ['id'],
	},
	Manifest: {
		keyFields: ['id'],
	},
	shop: {
		keyFields: ['id'],
	},
	Setting: {
		keyFields: ['key'],
	},
	Query: {
		fields: {
			community: {
				merge: true
			},
			general: {
				merge: true
			},
			// The ml field doesn't have an ID
			ml: {
				merge: true,
			},
			// The contentful field doesn't have an ID
			contentful: {
				merge: true,
			},
			// The lend field doesn't have an ID
			lend: {
				merge: true,
			},
			// The my field doesn't have an ID
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
	// appConfig,
	cookieStore,
	kvAuth0,
	types,
	uri,
	fetch
}) {
	// initialize local state resolvers
	// TODO: convert resolvers into typePolicies
	// const { resolvers } = initState({ appConfig, cookieStore, kvAuth0 });

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
