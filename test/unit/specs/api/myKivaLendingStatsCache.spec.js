import { InMemoryCache } from '@apollo/client/core';
import myKivaLendingStatsQuery from '#src/graphql/query/myKivaLendingStats.graphql';
import loanStatsByYearQuery from '#src/graphql/query/loanStatsByYear.graphql';

const YEAR = 2026;

// MyKivaPage's prefetch no longer issues loanStatsByYear on its own — the field is folded
// into myKivaLendingStats, which selects the same LendingStats entity. useGoalData still
// reads it through the standalone query, so the two field keys have to agree: both must
// pass `year` explicitly, or Apollo stores `loanStatsByYear` and
// `loanStatsByYear({"year":2026})` as different fields and the hydration read misses.
// Mirrors the typePolicies in src/api/apollo.js.
const buildCache = () => new InMemoryCache({
	typePolicies: {
		Mergable: { merge: true },
		Setting: { keyFields: ['key'] },
		UserAchievements: { keyFields: false },
		TieredLendingAchievement: { keyFields: false },
	},
});

const writeLendingStats = (cache, year) => cache.writeQuery({
	query: myKivaLendingStatsQuery,
	variables: { year },
	data: {
		my: {
			__typename: 'My',
			id: 99,
			lendingStats: {
				__typename: 'LendingStats',
				id: 7,
				countriesLentTo: [{ __typename: 'Country', id: 1, region: 'Africa' }],
				lentTo: {
					__typename: 'LentTo',
					borrowers: { __typename: 'BorrowerCollection', totalCount: 12 },
					countries: { __typename: 'CountryCollection', totalCount: 3 },
				},
				loanStatsByYear: { __typename: 'LoanStatsByYear', amount: '175.00', count: 7 },
			},
			userStats: { __typename: 'UserStats', amount_of_loans: '450.00' },
		},
	},
});

describe('myKivaLendingStats / loanStatsByYear cache sharing', () => {
	it('serves the standalone loanStatsByYear query from the folded write', () => {
		const cache = buildCache();
		writeLendingStats(cache, YEAR);

		const read = cache.readQuery({ query: loanStatsByYearQuery, variables: { year: YEAR } });

		expect(read?.my?.lendingStats?.loanStatsByYear?.count).toBe(7);
		expect(read?.my?.lendingStats?.loanStatsByYear?.amount).toBe('175.00');
	});

	it('does not serve a different year from that write', () => {
		const cache = buildCache();
		writeLendingStats(cache, YEAR);

		// A miss is the correct answer here: hydrateFromCache treats null as "unknown" and
		// keeps the skeleton up rather than rendering a confident wrong count.
		expect(cache.readQuery({ query: loanStatsByYearQuery, variables: { year: YEAR - 1 } })).toBe(null);
	});
});
