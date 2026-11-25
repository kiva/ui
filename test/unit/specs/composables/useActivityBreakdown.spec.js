import { render } from '@testing-library/vue';
import {
	ApolloClient, ApolloLink, InMemoryCache, Observable,
} from '@apollo/client/core';
import { globalOptions } from '#src/../test/unit/specUtils';
import * as activityBreakdownModule from '#src/composables/useActivityBreakdown';
import logReadQueryError from '#src/util/logReadQueryError';
import mockIntersectionObserver from '#src/../test/unit/helpers/mockIntersectionObserver';
import UsesActivityBreakdown from '#src/../test/unit/fixtures/composables/UsesActivityBreakdown';

vi.mock('#src/util/logReadQueryError');

const flushPromises = () => new Promise(resolve => { setTimeout(resolve); });

const ACTIVITY_NAMES = {
	41: 'Farming',
	49: 'Livestock',
	61: 'Fishing',
	120: 'Retail',
	300: 'Rickshaw',
};

const activity = id => ({ __typename: 'Activity', id, name: ACTIVITY_NAMES[id] });

const response = ({ stats = { 41: 3, 61: 1 }, activities = [41, 61, 49, 120], excluded = '"120"' } = {}) => ({
	my: stats && {
		__typename: 'My',
		id: 1,
		statsPerActivity: {
			__typename: 'LenderActivityStatisticCollection',
			values: Object.entries(stats).map(([id, loanCount]) => ({
				__typename: 'LenderActivityStatistic',
				id: `activity-${id}`,
				loanCount,
				activity: activity(Number(id)),
			})),
		},
	},
	general: {
		__typename: 'General',
		kivaStats: { __typename: 'KivaStats', activities: activities.map(activity) },
		excluded_activities: { __typename: 'Setting', key: 'ui.excluded_activities', value: excluded },
	},
});

const respondWith = data => observer => {
	observer.next({ data });
	observer.complete();
};

describe('useActivityBreakdown', () => {
	let intersectionObserver;
	let requests;

	const renderFixture = respond => {
		requests = 0;
		const link = new ApolloLink(() => new Observable(observer => {
			requests += 1;
			respond(observer);
		}));
		const apollo = new ApolloClient({ link, cache: new InMemoryCache() });
		const { getByTestId } = render(UsesActivityBreakdown, {
			global: { ...globalOptions, provide: { ...globalOptions.provide, apollo } },
		});
		return {
			loading: () => getByTestId('loading').textContent,
			error: () => getByTestId('error').textContent,
			breakdown: () => JSON.parse(getByTestId('breakdown').textContent),
		};
	};

	const nearViewport = async () => {
		intersectionObserver.trigger();
		await flushPromises();
		await flushPromises();
	};

	beforeEach(() => {
		intersectionObserver = mockIntersectionObserver();
	});

	afterEach(() => {
		intersectionObserver.restore();
		vi.clearAllMocks();
	});

	it('requests nothing until the section nears the viewport', async () => {
		const fixture = renderFixture(respondWith(response()));
		await flushPromises();

		expect(requests).toBe(0);
		expect(fixture.loading()).toBe('true');
	});

	it('loads the breakdown once it nears the viewport', async () => {
		const fixture = renderFixture(respondWith(response()));
		await nearViewport();

		expect(requests).toBe(1);
		expect(fixture.breakdown()).toEqual({
			lentTo: [
				{ id: 41, name: 'Farming', loanCount: 3 },
				{ id: 61, name: 'Fishing', loanCount: 1 },
			],
			notLentTo: [{ id: 49, name: 'Livestock' }],
			chartValues: [{ label: 'Farming', value: 3 }, { label: 'Fishing', value: 1 }],
			lentCount: 2,
			totalCount: 3,
		});
		expect(fixture.error()).toBe('false');
	});

	it('requests once however often it nears the viewport', async () => {
		renderFixture(respondWith(response()));
		await nearViewport();
		await nearViewport();

		expect(requests).toBe(1);
	});

	it('counts an excluded activity the lender has lent to', async () => {
		const fixture = renderFixture(respondWith(response({ stats: { 41: 3, 120: 2 } })));
		await nearViewport();

		const { lentCount, totalCount, notLentTo } = fixture.breakdown();
		expect(lentCount).toBe(2);
		expect(totalCount).toBe(4);
		expect(notLentTo.map(item => item.name)).toEqual(['Fishing', 'Livestock']);
	});

	it('counts an activity Kiva no longer lists', async () => {
		const fixture = renderFixture(respondWith(response({ stats: { 41: 3, 300: 1 } })));
		await nearViewport();

		const { lentCount, totalCount, notLentTo } = fixture.breakdown();
		expect(lentCount).toBe(2);
		expect(totalCount).toBe(4);
		expect(notLentTo.map(item => item.name)).toEqual(['Fishing', 'Livestock']);
	});

	it('leaves out activities without a name', async () => {
		const fixture = renderFixture(respondWith(response({ activities: [41, 61, 49, 120, 99] })));
		await nearViewport();

		expect(fixture.breakdown().notLentTo).toEqual([{ id: 49, name: 'Livestock' }]);
	});

	it('reports an error when the request fails', async () => {
		const fixture = renderFixture(observer => observer.error(new Error('Network error')));
		await nearViewport();

		expect(fixture.error()).toBe('true');
		expect(logReadQueryError).toHaveBeenCalledWith(
			expect.anything(),
			'useActivityBreakdown impactActivityBreakdown',
		);
	});

	it('reports an error when the lender\'s stats are missing', async () => {
		const fixture = renderFixture(respondWith(response({ stats: null })));
		await nearViewport();

		expect(fixture.error()).toBe('true');
		expect(fixture.breakdown()).toEqual({
			lentTo: null, notLentTo: null, chartValues: null, lentCount: null, totalCount: null,
		});
	});

	it('does not prefetch', () => {
		expect(activityBreakdownModule.preFetchOperations).toEqual([]);
	});
});
