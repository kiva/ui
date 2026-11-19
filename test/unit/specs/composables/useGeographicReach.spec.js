import { render } from '@testing-library/vue';
import {
	ApolloClient, ApolloLink, InMemoryCache, Observable,
} from '@apollo/client/core';
import { globalOptions } from '#src/../test/unit/specUtils';
import * as geographicReachModule from '#src/composables/useGeographicReach';
import logReadQueryError from '#src/util/logReadQueryError';
import mockIntersectionObserver from '#src/../test/unit/helpers/mockIntersectionObserver';
import UsesGeographicReach from '#src/../test/unit/fixtures/composables/UsesGeographicReach';

vi.mock('#src/util/logReadQueryError');

const flushPromises = () => new Promise(resolve => { setTimeout(resolve); });

const COUNTRIES = {
	PH: { name: 'Philippines', region: 'Asia' },
	KE: { name: 'Kenya', region: 'Africa' },
	ZA: { name: 'South Africa', region: 'Africa' },
};

const country = isoCode => ({
	__typename: 'Country',
	id: isoCode.charCodeAt(0) * 100 + isoCode.charCodeAt(1),
	isoCode,
	...COUNTRIES[isoCode],
});

const response = ({ stats = { PH: 3 }, facets = ['PH', 'KE'], excluded = '""' } = {}) => ({
	my: stats && {
		__typename: 'My',
		id: 1,
		statsPerCountry: {
			__typename: 'LenderCountryStatisticCollection',
			values: Object.entries(stats).map(([isoCode, loanCount]) => ({
				__typename: 'LenderCountryStatistic',
				id: `country-${isoCode}`,
				loanCount,
				country: country(isoCode),
			})),
		},
	},
	lend: {
		__typename: 'Lend',
		countryFacets: facets.map(isoCode => ({ __typename: 'CountryFacet', country: country(isoCode) })),
	},
	general: {
		__typename: 'General',
		excluded_countries: { __typename: 'Setting', key: 'ui.excluded_countries', value: excluded },
	},
});

const respondWith = data => observer => {
	observer.next({ data });
	observer.complete();
};

describe('useGeographicReach', () => {
	let intersectionObserver;
	let requests;

	const renderFixture = respond => {
		requests = 0;
		const link = new ApolloLink(() => new Observable(observer => {
			requests += 1;
			respond(observer);
		}));
		const apollo = new ApolloClient({ link, cache: new InMemoryCache() });
		const { getByTestId } = render(UsesGeographicReach, {
			global: { ...globalOptions, provide: { ...globalOptions.provide, apollo } },
		});
		return {
			loading: () => getByTestId('loading').textContent,
			error: () => getByTestId('error').textContent,
			regions: () => JSON.parse(getByTestId('regions').textContent),
		};
	};

	const nearViewport = async () => {
		intersectionObserver.trigger();
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

	it('loads the regions once it nears the viewport', async () => {
		const fixture = renderFixture(respondWith(response()));
		await nearViewport();

		expect(requests).toBe(1);
		const regions = fixture.regions();
		expect(regions.map(region => region.name)).toEqual(['Africa', 'Asia']);
		expect(regions[1].countries[0]).toMatchObject({ isoCode: 'PH', loanCount: 3, share: 1 });
		expect(fixture.error()).toBe('false');
	});

	it('requests once however often it nears the viewport', async () => {
		renderFixture(respondWith(response()));
		await nearViewport();
		await nearViewport();

		expect(requests).toBe(1);
	});

	it('leaves out excluded countries', async () => {
		const fixture = renderFixture(respondWith(response({ facets: ['KE', 'ZA'], excluded: '"ZA"' })));
		await nearViewport();

		const isoCodes = fixture.regions().flatMap(region => region.countries.map(item => item.isoCode));
		expect(isoCodes).toEqual(['KE', 'PH']);
	});

	it('reports an error when the request fails', async () => {
		const fixture = renderFixture(observer => observer.error(new Error('Network error')));
		await nearViewport();

		expect(fixture.error()).toBe('true');
		expect(logReadQueryError).toHaveBeenCalledWith(expect.anything(), 'useGeographicReach impactGeographicReach');
	});

	it('reports an error when the lender\'s stats are missing', async () => {
		const fixture = renderFixture(respondWith(response({ stats: null })));
		await nearViewport();

		expect(fixture.error()).toBe('true');
		expect(fixture.regions()).toBeNull();
	});

	it('does not prefetch', () => {
		expect(geographicReachModule.preFetchOperations).toEqual([]);
	});
});
