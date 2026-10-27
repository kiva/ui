import { render } from '@testing-library/vue';
import {
	ApolloClient, ApolloLink, InMemoryCache, Observable,
} from '@apollo/client/core';
import { globalOptions } from '#src/../test/unit/specUtils';
import { preFetchOperations } from '#src/composables/usePriorityMyKivaContent';
import logReadQueryError from '#src/util/logReadQueryError';
import UsesPriorityMyKivaContent from '#src/../test/unit/fixtures/composables/UsesPriorityMyKivaContent';

vi.mock('#src/util/logReadQueryError');

const flushPromises = () => new Promise(resolve => { setTimeout(resolve); });

const loggedIn = { ...globalOptions.provide.kvAuth0, getKivaId: () => 1234 };

const defaults = {
	bdayCardName: '',
	bdayCardLinkOverride: '',
	lendLinkOverride: '',
	impactLinkOverride: '',
	showNextStepsOverride: false,
	hideBdayCard: false,
};

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

async function renderContent(userPreference, kvAuth0 = loggedIn) {
	const { client, requests } = makeClient(respondWith(userPreference));
	const { getByTestId } = render(UsesPriorityMyKivaContent, {
		global: { ...globalOptions, provide: { ...globalOptions.provide, apollo: client, kvAuth0 } },
	});
	await flushPromises();
	const text = getByTestId('content').textContent;
	return { content: text === 'unset' ? text : JSON.parse(text), requests };
}

describe('usePriorityMyKivaContent', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('resolves the stored settings over the defaults', async () => {
		const stored = {
			bdayCardName: 'Tanya',
			bdayCardLinkOverride: '/lend/filter?gender=female',
			lendLinkOverride: '/lend-by-category/education',
			impactLinkOverride: '/portfolio/lending-stats',
			showNextStepsOverride: true,
			hideBdayCard: true,
		};
		const { content } = await renderContent(JSON.stringify(stored));
		expect(content).toEqual(stored);
	});

	it('fills the defaults when the preference is an empty object', async () => {
		const { content } = await renderContent('{}');
		expect(content).toEqual(defaults);
	});

	it('fills the defaults when an empty object comes back as an empty list', async () => {
		const { content } = await renderContent('[]');
		expect(content).toEqual(defaults);
	});

	it('fills the defaults when the preference is true', async () => {
		const { content } = await renderContent('true');
		expect(content).toEqual(defaults);
	});

	it('ignores fields of the wrong type', async () => {
		const { content } = await renderContent(JSON.stringify({
			bdayCardName: 5,
			lendLinkOverride: null,
			showNextStepsOverride: 'true',
			hideBdayCard: 'true',
		}));
		expect(content).toEqual(defaults);
	});

	it('stays unset when the lender has no preference', async () => {
		const { content } = await renderContent(null);
		expect(content).toBe('unset');
	});

	it.each(['false', '"yes"', '[1]', 'not json'])('stays unset when the preference is %s', async raw => {
		const { content } = await renderContent(raw);
		expect(content).toBe('unset');
	});

	it('resolves for a lender the browser has noted as logged in before their session loads', async () => {
		const notedLoggedIn = { ...globalOptions.provide.kvAuth0, isNotedLoggedIn: () => true };
		const { content } = await renderContent('[]', notedLoggedIn);
		expect(content).toEqual(defaults);
	});

	it('renders the server-prefetched value on the first browser render', () => {
		const notedLoggedIn = { ...globalOptions.provide.kvAuth0, isNotedLoggedIn: () => true };
		const { client } = makeClient(() => {});
		client.writeQuery({
			query: preFetchOperations[0].query,
			data: { my: { __typename: 'My', id: 1, userPreference: '[]' } },
		});
		const { getByTestId } = render(UsesPriorityMyKivaContent, {
			global: {
				...globalOptions,
				provide: { ...globalOptions.provide, apollo: client, kvAuth0: notedLoggedIn },
			},
		});
		expect(JSON.parse(getByTestId('content').textContent)).toEqual(defaults);
	});

	it('prefetches on the server only on a loaded session, not on the noted login alone', () => {
		const [operation] = preFetchOperations;
		const serverNotedLoggedIn = { ...globalOptions.provide.kvAuth0, isServer: true, isNotedLoggedIn: () => true };
		expect(operation.shouldPreFetch(operation, { kvAuth0: serverNotedLoggedIn })).toBe(false);
	});

	it('issues no request for a visitor', async () => {
		const { content, requests } = await renderContent('{}', globalOptions.provide.kvAuth0);
		expect(requests).toEqual([]);
		expect(content).toBe('unset');
	});

	it('logs a failed request and stays unset', async () => {
		const { client } = makeClient(observer => observer.error(new Error('Network error')));
		const { getByTestId } = render(UsesPriorityMyKivaContent, {
			global: { ...globalOptions, provide: { ...globalOptions.provide, apollo: client, kvAuth0: loggedIn } },
		});
		await flushPromises();
		expect(getByTestId('content').textContent).toBe('unset');
		expect(logReadQueryError).toHaveBeenCalled();
	});

	it('prefetches only for a logged-in lender', () => {
		const [operation] = preFetchOperations;
		expect(operation.shouldPreFetch(operation, { kvAuth0: loggedIn })).toBe(true);
		expect(operation.shouldPreFetch(operation, { kvAuth0: globalOptions.provide.kvAuth0 })).toBe(false);
		expect(operation.shouldPreFetch(operation, { kvAuth0: null })).toBe(false);
	});
});
