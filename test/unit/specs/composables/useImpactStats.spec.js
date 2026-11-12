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
	const link = new ApolloLink(() => new Observable(observer => { respond(observer); }));
	return new ApolloClient({ link, cache: new InMemoryCache() });
}

const respondWith = my => observer => {
	observer.next({ data: { my } });
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
} = {}) => ({
	__typename: 'My',
	id: 1,
	userAccount: {
		__typename: 'UserAccount', id: 1, firstName, balance, promoBalance,
	},
	userStats: { __typename: 'UserStatistics', amount_outstanding: amountOutstanding },
	givingFundParticipation: {
		__typename: 'GivingFundParticipationCollection', totalAmount: deposits, totalCount: depositCount,
	},
	givingFunds: { __typename: 'GivingFundCollection', totalCount: funds.length, values: funds },
});

async function renderFixture(respond) {
	const { getByTestId } = render(UsesImpactStats, {
		global: { ...globalOptions, provide: { ...globalOptions.provide, apollo: makeClient(respond) } },
	});
	await flushPromises();
	return getByTestId;
}

async function renderFirstName(respond) {
	const getByTestId = await renderFixture(respond);
	return getByTestId('first-name').textContent;
}

async function renderStats(respond) {
	const getByTestId = await renderFixture(respond);
	return {
		availableToLend: getByTestId('available-to-lend').textContent,
		lentOut: getByTestId('lent-out').textContent,
		givingFundDeposits: getByTestId('giving-fund-deposits').textContent,
		fundraisersRaised: getByTestId('fundraisers-raised').textContent,
		ownsGivingFunds: getByTestId('owns-giving-funds').textContent,
		showGivingFund: getByTestId('show-giving-fund').textContent,
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
		expect(logReadQueryError).toHaveBeenCalled();
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

	it('registers the impactStats operation', () => {
		expect(preFetchOperations[0].query.definitions[0].name.value).toBe('impactStats');
	});
});
