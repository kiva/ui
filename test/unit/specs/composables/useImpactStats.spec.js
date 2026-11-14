import { render } from '@testing-library/vue';
import {
	ApolloClient, ApolloLink, InMemoryCache, Observable,
} from '@apollo/client/core';
import { globalOptions } from '#src/../test/unit/specUtils';
import { preFetchOperations } from '#src/composables/useImpactStats';
import logReadQueryError from '#src/util/logReadQueryError';
import UsesImpactStats from '#src/../test/unit/fixtures/composables/UsesImpactStats';

vi.mock('#src/util/logReadQueryError');

const flushPromises = () => new Promise(resolve => { setTimeout(resolve); });

function makeClient(respond) {
	const link = new ApolloLink(operation => new Observable(observer => { respond(observer, operation); }));
	return new ApolloClient({ link, cache: new InMemoryCache() });
}

const [mainOperation, givingFundOperation] = preFetchOperations;

const facet = isoCode => ({
	__typename: 'CountryFacet',
	country: { __typename: 'Country', id: isoCode.charCodeAt(0) * 100 + isoCode.charCodeAt(1), isoCode },
});

const publicData = ({ codes = ['KE', 'PE', 'ZA'], excluded = '"ZA, AU"' } = {}) => ({
	lend: { __typename: 'Lend', countryFacets: codes && codes.map(facet) },
	general: {
		__typename: 'General',
		excluded_countries: { __typename: 'Setting', key: 'ui.excluded_countries', value: excluded },
	},
});

const respondWith = (my, rest = publicData()) => observer => {
	observer.next({ data: { my, ...rest } });
	observer.complete();
};

const fund = (id, currentAmountDonated) => ({ __typename: 'GivingFund', id, currentAmountDonated });

const lender = ({
	firstName = 'James',
	balance = '0.00',
	promoBalance = '0.00',
	amountOutstanding = '0.00',
	deposits = '0.00',
	depositCount = 0,
	funds = [],
	borrowers = 0,
	countries = 0,
	donated = '0.00',
	lifetimeLent = '0.00',
} = {}) => ({
	__typename: 'My',
	id: 1,
	userAccount: {
		__typename: 'UserAccount', id: 1, firstName, balance, promoBalance,
	},
	userStats: {
		__typename: 'UserStatistics',
		amount_outstanding: amountOutstanding,
		amount_donated: donated,
		amount_of_loans: lifetimeLent,
	},
	lendingStats: {
		__typename: 'LendingStats',
		id: 1,
		lentTo: {
			__typename: 'LentTo',
			borrowers: { __typename: 'BorrowerCollection', totalCount: borrowers },
			countries: { __typename: 'CountryCollection', totalCount: countries },
		},
	},
	givingFundParticipation: {
		__typename: 'GivingFundParticipationCollection', totalAmount: deposits, totalCount: depositCount,
	},
	givingFunds: { __typename: 'GivingFundCollection', totalCount: funds.length, values: funds },
});

// Loads the operations the way the server prefetch does before the components read them
async function renderFixture(respond, { prefetchMain = false } = {}) {
	const apollo = makeClient(respond);
	if (prefetchMain) {
		await apollo.query({ query: mainOperation.query });
	}
	await givingFundOperation.preFetch(givingFundOperation, apollo);
	const { getByTestId } = render(UsesImpactStats, {
		global: { ...globalOptions, provide: { ...globalOptions.provide, apollo } },
	});
	await flushPromises();
	return getByTestId;
}

async function renderFirstName(respond) {
	const getByTestId = await renderFixture(respond);
	return getByTestId('first-name').textContent;
}

async function renderStats(respond, options) {
	const getByTestId = await renderFixture(respond, options);
	return {
		firstName: getByTestId('first-name').textContent,
		availableToLend: getByTestId('available-to-lend').textContent,
		lentOut: getByTestId('lent-out').textContent,
		givingFundDeposits: getByTestId('giving-fund-deposits').textContent,
		fundraisersRaised: getByTestId('fundraisers-raised').textContent,
		ownsGivingFunds: getByTestId('owns-giving-funds').textContent,
		showGivingFund: getByTestId('show-giving-fund').textContent,
		livesTouched: getByTestId('lives-touched').textContent,
		countriesLentTo: getByTestId('countries-lent-to').textContent,
		countriesAvailable: getByTestId('countries-available').textContent,
		donations: getByTestId('donations').textContent,
		totalImpact: getByTestId('total-impact').textContent,
	};
}

describe('useImpactStats', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('returns the lender\'s first name', async () => {
		expect(await renderFirstName(respondWith(lender({ firstName: 'James' })))).toBe('James');
	});

	it('trims the first name', async () => {
		expect(await renderFirstName(respondWith(lender({ firstName: '  James ' })))).toBe('James');
	});

	it.each([null, '', '   '])('returns an empty name for %j', async firstName => {
		expect(await renderFirstName(respondWith(lender({ firstName })))).toBe('');
	});

	it('returns an empty name when my is null', async () => {
		expect(await renderFirstName(respondWith(null))).toBe('');
	});

	it('returns an empty name when the response carries GraphQL errors', async () => {
		const respond = observer => {
			observer.next({ data: null, errors: [{ message: 'not privileged' }] });
			observer.complete();
		};

		expect(await renderFirstName(respond)).toBe('');
	});

	it('logs a failed request and returns an empty name', async () => {
		expect(await renderFirstName(observer => observer.error(new Error('Network error')))).toBe('');
		expect(logReadQueryError).toHaveBeenCalledWith(expect.anything(), 'useImpactStats impactStats');
	});

	it('returns available to lend as balance plus promo balance', async () => {
		const stats = await renderStats(respondWith(lender({ balance: '800.23', promoBalance: '47.00' })));

		expect(Number(stats.availableToLend)).toBeCloseTo(847.23);
	});

	it('returns lent out as the amount outstanding', async () => {
		const stats = await renderStats(respondWith(lender({ amountOutstanding: '3240.00' })));

		expect(Number(stats.lentOut)).toBe(3240);
	});

	it('returns null account values when my is null', async () => {
		expect(await renderStats(respondWith(null))).toMatchObject({ availableToLend: 'null', lentOut: 'null' });
	});

	it('returns null available to lend when the balance field fails', async () => {
		const stats = await renderStats(respondWith(lender({ balance: null, promoBalance: '47.00' })));

		expect(stats.availableToLend).toBe('null');
	});

	it('counts a null promo balance as 0', async () => {
		const stats = await renderStats(respondWith(lender({ balance: '800.23', promoBalance: null })));

		expect(Number(stats.availableToLend)).toBeCloseTo(800.23);
	});

	it('returns null fundraisers raised when the fund list fails', async () => {
		const my = lender();
		my.givingFunds = { __typename: 'GivingFundCollection', totalCount: 2, values: null };
		const stats = await renderStats(respondWith(my));

		expect(stats.fundraisersRaised).toBe('null');
		expect(stats.ownsGivingFunds).toBe('true');
	});

	it('returns giving fund deposits', async () => {
		const stats = await renderStats(respondWith(lender({ deposits: '1000.00', depositCount: 3 })));

		expect(Number(stats.givingFundDeposits)).toBe(1000);
	});

	it('sums what the lender\'s own funds raised', async () => {
		const stats = await renderStats(respondWith(lender({ funds: [fund('a', '1000.00'), fund('b', '25.00')] })));

		expect(Number(stats.fundraisersRaised)).toBe(1025);
		expect(stats.ownsGivingFunds).toBe('true');
	});

	it('shows the giving fund card for a fund owner who never deposited', async () => {
		const stats = await renderStats(respondWith(lender({ funds: [fund('a', '0.00')] })));

		expect(stats.showGivingFund).toBe('true');
	});

	it('hides the giving fund card without giving fund activity', async () => {
		const stats = await renderStats(respondWith(lender()));

		expect(stats.showGivingFund).toBe('false');
		expect(stats.ownsGivingFunds).toBe('false');
	});

	it('returns null giving fund values and hides the card when my is null', async () => {
		expect(await renderStats(respondWith(null))).toMatchObject({
			givingFundDeposits: 'null',
			fundraisersRaised: 'null',
			ownsGivingFunds: 'false',
			showGivingFund: 'false',
		});
	});

	it('keeps the account values and name when the giving fund query fails', async () => {
		const failGivingFunds = (observer, operation) => {
			if (operation.operationName === 'impactStatsGivingFunds') {
				observer.next({ data: { my: null }, errors: [{ message: 'giving funds unavailable' }] });
			} else {
				observer.next({ data: { my: lender({ balance: '847.23' }), ...publicData() } });
			}
			observer.complete();
		};
		const stats = await renderStats(failGivingFunds, { prefetchMain: true });

		expect(stats.firstName).toBe('James');
		expect(Number(stats.availableToLend)).toBeCloseTo(847.23);
		expect(stats).toMatchObject({ givingFundDeposits: 'null', showGivingFund: 'false' });
		expect(logReadQueryError).toHaveBeenCalledWith(expect.anything(), 'useImpactStats impactStatsGivingFunds');
	});

	it('returns lives touched and countries lent to', async () => {
		const stats = await renderStats(respondWith(lender({ borrowers: 284, countries: 7 })));

		expect(stats).toMatchObject({ livesTouched: '284', countriesLentTo: '7' });
	});

	it('returns the countries Kiva lends in, less the excluded ones', async () => {
		const stats = await renderStats(respondWith(lender()));

		expect(stats.countriesAvailable).toBe('2');
	});

	it('returns donations and total impact', async () => {
		const stats = await renderStats(respondWith(lender({ donated: '120.00', lifetimeLent: '4240.00' })));

		expect(Number(stats.donations)).toBe(120);
		expect(Number(stats.totalImpact)).toBe(4240);
	});

	it('returns zeros for a lender with no loans', async () => {
		expect(await renderStats(respondWith(lender()))).toMatchObject({
			livesTouched: '0',
			countriesLentTo: '0',
			donations: '0',
			totalImpact: '0',
			countriesAvailable: '2',
		});
	});

	it('returns null lending stats and keeps the rest when lending stats are null', async () => {
		const my = lender({ donated: '120.00', balance: '847.23' });
		my.lendingStats = null;
		const stats = await renderStats(respondWith(my));

		expect(stats).toMatchObject({ livesTouched: 'null', countriesLentTo: 'null' });
		expect(Number(stats.donations)).toBe(120);
		expect(Number(stats.availableToLend)).toBeCloseTo(847.23);
	});

	it('returns a null countries total when the facets fail', async () => {
		const stats = await renderStats(respondWith(lender(), publicData({ codes: null })));

		expect(stats.countriesAvailable).toBe('null');
	});

	it('keeps the countries total when my is null', async () => {
		expect(await renderStats(respondWith(null))).toMatchObject({
			livesTouched: 'null',
			countriesLentTo: 'null',
			donations: 'null',
			totalImpact: 'null',
			countriesAvailable: '2',
		});
	});

	it('registers the main and giving fund operations', () => {
		expect(preFetchOperations.map(op => op.query.definitions[0].name.value))
			.toEqual(['impactStats', 'impactStatsGivingFunds']);
	});
});
