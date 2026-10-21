import { h } from 'vue';
import { render } from '@testing-library/vue';
import {
	ApolloClient, ApolloLink, InMemoryCache, Observable,
} from '@apollo/client/core';
import { globalOptions } from '#src/../test/unit/specUtils';
import { preFetchOperations } from '#src/composables/useDefaultLoanShareAmount';
import logReadQueryError from '#src/util/logReadQueryError';
import UsesDefaultLoanShareAmount from '#src/../test/unit/fixtures/composables/UsesDefaultLoanShareAmount';

vi.mock('#src/util/logReadQueryError');

const flushPromises = () => new Promise(resolve => { setTimeout(resolve); });

const loggedIn = { ...globalOptions.provide.kvAuth0, getKivaId: () => 1234 };

function makeClient(respond) {
	const requests = [];
	const link = new ApolloLink(operation => {
		requests.push(operation.operationName);
		return new Observable(observer => {
			respond(observer);
		});
	});
	const client = new ApolloClient({ link, cache: new InMemoryCache() });
	return { client, requests };
}

const respondWith = userPreference => observer => {
	observer.next({ data: { my: { __typename: 'My', id: 1, userPreference } } });
	observer.complete();
};

function renderCallers(client, kvAuth0, count = 1) {
	return render({
		render: () => h('div', Array.from({ length: count }, () => h(UsesDefaultLoanShareAmount))),
	}, {
		global: { ...globalOptions, provide: { ...globalOptions.provide, apollo: client, kvAuth0 } },
	});
}

describe('useDefaultLoanShareAmount', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('resolves the stored amount for a logged-in lender', async () => {
		const { client } = makeClient(respondWith('100'));
		const { getByTestId } = renderCallers(client, loggedIn);
		await flushPromises();
		expect(getByTestId('amount').textContent).toBe('100');
	});

	it('stays unset when the lender has no preference', async () => {
		const { client } = makeClient(respondWith(null));
		const { getByTestId } = renderCallers(client, loggedIn);
		await flushPromises();
		expect(getByTestId('amount').textContent).toBe('unset');
	});

	it('issues no request for a visitor', async () => {
		const { client, requests } = makeClient(respondWith('100'));
		const { getByTestId } = renderCallers(client, globalOptions.provide.kvAuth0);
		await flushPromises();
		expect(requests).toEqual([]);
		expect(getByTestId('amount').textContent).toBe('unset');
	});

	it('issues one request for several callers on a page', async () => {
		const { client, requests } = makeClient(respondWith('100'));
		const { getAllByTestId } = renderCallers(client, loggedIn, 3);
		await flushPromises();
		expect(requests).toEqual(['DefaultLoanShareAmount']);
		expect(getAllByTestId('amount').map(el => el.textContent)).toEqual(['100', '100', '100']);
	});

	it('logs a failed request and stays unset', async () => {
		const { client } = makeClient(observer => observer.error(new Error('Network error')));
		const { getByTestId } = renderCallers(client, loggedIn);
		await flushPromises();
		expect(getByTestId('amount').textContent).toBe('unset');
		expect(logReadQueryError).toHaveBeenCalled();
	});

	it('prefetches only for a logged-in lender', () => {
		const [operation] = preFetchOperations;
		expect(operation.shouldPreFetch(operation, { kvAuth0: loggedIn })).toBe(true);
		expect(operation.shouldPreFetch(operation, { kvAuth0: globalOptions.provide.kvAuth0 })).toBe(false);
		expect(operation.shouldPreFetch(operation, { kvAuth0: null })).toBe(false);
	});
});
