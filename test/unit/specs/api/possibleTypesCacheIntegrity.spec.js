import {
	ApolloClient, ApolloLink, InMemoryCache, Observable,
} from '@apollo/client/core/index';
import { gql } from 'graphql-tag';

/**
 * Regression test for the My Kiva refetch meltdown.
 *
 * The Apollo cache depends on the `possibleTypes` payload the server builds in
 * server/util/getGqlPossibleTypes.js. When introspection failed, that payload was cached as
 * `{ Mergable: [] }` and shipped to the browser, which cost the cache two things at once:
 *
 *   1. No Mergable list, so the `Mergable: { merge: true }` policy matched nothing and types
 *      without an `id` were replaced instead of merged. `Lend` has no `id`, so writing one loan
 *      evicted every other loan's entry from `ROOT_QUERY.lend`.
 *   2. No interface map, so `loanCardFields on LoanBasic` could not be matched against a cached
 *      `LoanPartner`.
 *
 * Either one leaves the cache read permanently incomplete, so every cache broadcast sends the
 * watch query back to the network, and each response evicts the next card's data. The result is a
 * round robin through every loan on the page that never terminates.
 */

const cardQuery = gql`
	fragment loanCardFields on LoanBasic {
		id
		loanAmount
		geocode { city state country { id isoCode } }
	}
	query kcBasicLoanCard($loanId: Int!) {
		lend {
			loan(id: $loanId) {
				id
				...loanCardFields
			}
		}
	}
`;

const LOAN_IDS = [101, 102, 103, 104, 105, 106];

const HEALTHY_POSSIBLE_TYPES = {
	Mergable: ['Lend', 'Geocode'],
	LoanBasic: ['LoanPartner', 'LoanDirect'],
};

// What the browser received while the poisoned entry was cached
const BROKEN_POSSIBLE_TYPES = { Mergable: [] };

const watchAllLoanCards = async possibleTypes => {
	const requestedLoanIds = [];

	const link = new ApolloLink(operation => {
		requestedLoanIds.push(operation.variables.loanId);
		return new Observable(observer => {
			setTimeout(() => {
				observer.next({
					data: {
						lend: {
							__typename: 'Lend',
							loan: {
								__typename: 'LoanPartner',
								id: operation.variables.loanId,
								loanAmount: '500.00',
								geocode: {
									__typename: 'Geocode',
									city: 'Nairobi',
									state: 'Nairobi County',
									country: { __typename: 'Country', id: 'KE', isoCode: 'KE' },
								},
							},
						},
					},
				});
				observer.complete();
			}, 0);
		});
	});

	const client = new ApolloClient({
		link,
		cache: new InMemoryCache({
			possibleTypes,
			typePolicies: { Mergable: { merge: true } },
		}),
		assumeImmutableResults: true,
		defaultOptions: {
			watchQuery: { errorPolicy: 'all' },
			query: { errorPolicy: 'all' },
		},
	});

	const subscriptions = LOAN_IDS.map(loanId => client
		.watchQuery({ query: cardQuery, variables: { loanId } })
		.subscribe({ next: () => {}, error: () => {} }));

	await new Promise(resolve => { setTimeout(resolve, 250); });
	subscriptions.forEach(subscription => subscription.unsubscribe());

	return requestedLoanIds;
};

describe('Apollo cache integrity with the server-built possibleTypes', () => {
	it('fetches each loan exactly once when possibleTypes is populated', async () => {
		const requestedLoanIds = await watchAllLoanCards(HEALTHY_POSSIBLE_TYPES);

		expect(requestedLoanIds.sort()).toEqual(LOAN_IDS);
	});

	it('does not refetch loans in a loop when possibleTypes is populated', async () => {
		const requestedLoanIds = await watchAllLoanCards(HEALTHY_POSSIBLE_TYPES);

		// One request per card, no matter how many times the cache broadcasts
		expect(requestedLoanIds).toHaveLength(LOAN_IDS.length);
	});

	// Documents the failure this guards against: without it the same setup issues hundreds of
	// requests in a quarter of a second and never settles.
	it('melts down into an unbounded refetch loop when possibleTypes is empty', async () => {
		const requestedLoanIds = await watchAllLoanCards(BROKEN_POSSIBLE_TYPES);

		expect(requestedLoanIds.length).toBeGreaterThan(LOAN_IDS.length * 10);
	});
});
