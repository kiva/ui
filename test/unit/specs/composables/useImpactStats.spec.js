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

const lender = firstName => ({
	__typename: 'My',
	id: 1,
	userAccount: { __typename: 'UserAccount', id: 1, firstName },
});

async function renderFirstName(respond) {
	const { getByTestId } = render(UsesImpactStats, {
		global: { ...globalOptions, provide: { ...globalOptions.provide, apollo: makeClient(respond) } },
	});
	await flushPromises();
	return getByTestId('first-name').textContent;
}

describe('useImpactStats', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('returns the lender\'s first name', async () => {
		expect(await renderFirstName(respondWith(lender('James')))).toBe('James');
	});

	it('trims the first name', async () => {
		expect(await renderFirstName(respondWith(lender('  James ')))).toBe('James');
	});

	it.each([null, '', '   '])('returns an empty name for %j', async firstName => {
		expect(await renderFirstName(respondWith(lender(firstName)))).toBe('');
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

	it('registers the impactStats operation', () => {
		expect(preFetchOperations[0].query.definitions[0].name.value).toBe('impactStats');
	});
});
