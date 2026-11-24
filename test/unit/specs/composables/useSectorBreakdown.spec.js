import { render } from '@testing-library/vue';
import {
	ApolloClient, ApolloLink, InMemoryCache, Observable,
} from '@apollo/client/core';
import { globalOptions } from '#src/../test/unit/specUtils';
import * as sectorBreakdownModule from '#src/composables/useSectorBreakdown';
import logReadQueryError from '#src/util/logReadQueryError';
import mockIntersectionObserver from '#src/../test/unit/helpers/mockIntersectionObserver';
import UsesSectorBreakdown from '#src/../test/unit/fixtures/composables/UsesSectorBreakdown';

vi.mock('#src/util/logReadQueryError');

const flushPromises = () => new Promise(resolve => { setTimeout(resolve); });

const SECTOR_NAMES = {
	1: 'Food',
	4: 'Services',
	9: 'Arts',
	13: 'Personal Use',
};

const sector = id => ({ __typename: 'Sector', id, name: SECTOR_NAMES[id] });

const response = ({ stats = { 1: 3, 9: 1 }, sectors = [1, 9, 13, 4], excluded = '"4"' } = {}) => ({
	my: stats && {
		__typename: 'My',
		id: 1,
		statsPerSector: {
			__typename: 'LenderSectorStatisticCollection',
			values: Object.entries(stats).map(([id, loanCount]) => ({
				__typename: 'LenderSectorStatistic',
				id: `sector-${id}`,
				loanCount,
				sector: sector(Number(id)),
			})),
		},
	},
	general: {
		__typename: 'General',
		kivaStats: { __typename: 'KivaStats', sectors: sectors.map(sector) },
		excluded_sectors: { __typename: 'Setting', key: 'ui.excluded_sectors', value: excluded },
	},
});

const respondWith = data => observer => {
	observer.next({ data });
	observer.complete();
};

describe('useSectorBreakdown', () => {
	let intersectionObserver;
	let requests;

	const renderFixture = respond => {
		requests = 0;
		const link = new ApolloLink(() => new Observable(observer => {
			requests += 1;
			respond(observer);
		}));
		const apollo = new ApolloClient({ link, cache: new InMemoryCache() });
		const { getByTestId } = render(UsesSectorBreakdown, {
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
				{ id: 1, name: 'Food', loanCount: 3 },
				{ id: 9, name: 'Arts', loanCount: 1 },
			],
			notLentTo: [{ id: 13, name: 'Personal Use' }],
			chartValues: [{ label: 'Food', value: 3 }, { label: 'Arts', value: 1 }],
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

	it('counts an excluded sector the lender has lent to', async () => {
		const fixture = renderFixture(respondWith(response({ stats: { 1: 3, 4: 2 } })));
		await nearViewport();

		const { lentCount, totalCount, notLentTo } = fixture.breakdown();
		expect(lentCount).toBe(2);
		expect(totalCount).toBe(4);
		expect(notLentTo.map(item => item.name)).toEqual(['Arts', 'Personal Use']);
	});

	it('reports an error when the request fails', async () => {
		const fixture = renderFixture(observer => observer.error(new Error('Network error')));
		await nearViewport();

		expect(fixture.error()).toBe('true');
		expect(logReadQueryError).toHaveBeenCalledWith(expect.anything(), 'useSectorBreakdown impactSectorBreakdown');
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
		expect(sectorBreakdownModule.preFetchOperations).toEqual([]);
	});
});
