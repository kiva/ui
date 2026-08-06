import getGqlPossibleTypes, { isValidPossibleTypes } from '#server/util/getGqlPossibleTypes';
import fetch from '#server/util/fetch';
import { getFromCache, setToCache } from '#server/util/memJsUtils';
import { error } from '#server/util/log';

vi.mock('#server/util/fetch', () => ({ default: vi.fn() }));

vi.mock('#server/util/memJsUtils', () => ({
	getFromCache: vi.fn(() => Promise.resolve(null)),
	setToCache: vi.fn(() => Promise.resolve()),
}));

vi.mock('#server/util/log', () => ({
	error: vi.fn(),
	log: vi.fn(),
	info: vi.fn(),
	warn: vi.fn(),
}));

const URL = 'https://api.test/graphql';
const CACHE = {};

// A schema shaped like the real one: some types with an id, some without, and a union
const healthySchema = {
	queryType: { name: 'Query' },
	mutationType: { name: 'Mutation' },
	subscriptionType: null,
	types: [
		{ name: 'Lend', fields: [{ name: 'loan' }], possibleTypes: null },
		{ name: 'Geocode', fields: [{ name: 'city' }], possibleTypes: null },
		{ name: 'LoanPartner', fields: [{ name: 'id' }, { name: 'name' }], possibleTypes: null },
		{
			name: 'LoanBasic',
			fields: [{ name: 'id' }],
			possibleTypes: [{ name: 'LoanPartner' }, { name: 'LoanDirect' }],
		},
	],
};

const mockResponse = body => fetch.mockResolvedValue({ json: () => Promise.resolve(body) });

describe('getGqlPossibleTypes', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		delete process.env.FETCHED_GQL_TYPES;
		getFromCache.mockResolvedValue(null);
		setToCache.mockResolvedValue();
	});

	afterAll(() => {
		delete process.env.FETCHED_GQL_TYPES;
	});

	describe('isValidPossibleTypes', () => {
		it('accepts a payload with a populated Mergable list', () => {
			expect(isValidPossibleTypes({ Mergable: ['Lend'] })).toBe(true);
		});

		it.each([
			['an empty Mergable list', { Mergable: [] }],
			['a missing Mergable key', { LoanBasic: ['LoanPartner'] }],
			['a non-array Mergable value', { Mergable: 'Lend' }],
			['an empty object', {}],
			['null', null],
			['undefined', undefined],
		])('rejects %s', (_label, value) => {
			expect(isValidPossibleTypes(value)).toBe(false);
		});
	});

	describe('a healthy introspection response', () => {
		it('builds the Mergable list from types with no id field', async () => {
			mockResponse({ data: { __schema: healthySchema } });

			const result = await getGqlPossibleTypes(URL, CACHE);

			expect(result.Mergable).toEqual(['Lend', 'Geocode']);
		});

		it('maps interfaces and unions to their possible types', async () => {
			mockResponse({ data: { __schema: healthySchema } });

			const result = await getGqlPossibleTypes(URL, CACHE);

			expect(result.LoanBasic).toEqual(['LoanPartner', 'LoanDirect']);
		});

		it('caches the payload for other processes and for this one', async () => {
			mockResponse({ data: { __schema: healthySchema } });

			await getGqlPossibleTypes(URL, CACHE);

			expect(setToCache).toHaveBeenCalledWith(
				'ui-gql-possible-types',
				expect.stringContaining('"Mergable":["Lend","Geocode"]'),
				24 * 60 * 60,
				CACHE,
			);
			expect(JSON.parse(process.env.FETCHED_GQL_TYPES).Mergable).toEqual(['Lend', 'Geocode']);
		});
	});

	// The production failure: introspection returned nothing, the empty result was cached for 24
	// hours, and every browser served by those pods ran with an Apollo cache that could not merge
	// id-less types or match interface fragments.
	describe.each([
		['the schema is missing entirely', { data: {} }],
		['the response is a GraphQL error', { errors: [{ message: 'Introspection is disabled' }] }],
		['the response body is empty', {}],
		['the schema has no types', { data: { __schema: { types: [] } } }],
		['every type has an id field', {
			data: { __schema: { types: [{ name: 'Shop', fields: [{ name: 'id' }], possibleTypes: null }] } },
		}],
	])('when %s', (_label, body) => {
		beforeEach(() => {
			mockResponse(body);
		});

		it('does not write the invalid payload to the shared cache', async () => {
			await getGqlPossibleTypes(URL, CACHE);

			expect(setToCache).not.toHaveBeenCalled();
		});

		it('does not pin the invalid payload to this process', async () => {
			await getGqlPossibleTypes(URL, CACHE);

			expect(process.env.FETCHED_GQL_TYPES).toBeUndefined();
		});

		it('logs an error', async () => {
			await getGqlPossibleTypes(URL, CACHE);

			expect(error).toHaveBeenCalled();
		});

		it('retries the introspection call on the next request rather than serving a cached failure', async () => {
			await getGqlPossibleTypes(URL, CACHE);
			await getGqlPossibleTypes(URL, CACHE);

			expect(fetch).toHaveBeenCalledTimes(2);
		});
	});

	describe('cached values', () => {
		it('uses a valid cached payload without introspecting again', async () => {
			getFromCache.mockResolvedValue(JSON.stringify({ Mergable: ['Lend'] }));

			const result = await getGqlPossibleTypes(URL, CACHE);

			expect(result).toEqual({ Mergable: ['Lend'] });
			expect(fetch).not.toHaveBeenCalled();
		});

		// Heals cache entries poisoned before these guards existed, without a manual flush
		it('discards an invalid cached payload and re-fetches', async () => {
			getFromCache.mockResolvedValue(JSON.stringify({ Mergable: [] }));
			mockResponse({ data: { __schema: healthySchema } });

			const result = await getGqlPossibleTypes(URL, CACHE);

			expect(fetch).toHaveBeenCalledTimes(1);
			expect(result.Mergable).toEqual(['Lend', 'Geocode']);
			expect(error).toHaveBeenCalled();
		});

		it('discards an unparseable cached payload and re-fetches', async () => {
			getFromCache.mockResolvedValue('not json');
			mockResponse({ data: { __schema: healthySchema } });

			const result = await getGqlPossibleTypes(URL, CACHE);

			expect(fetch).toHaveBeenCalledTimes(1);
			expect(result.Mergable).toEqual(['Lend', 'Geocode']);
		});

		it('uses a valid process-level payload without hitting the shared cache', async () => {
			process.env.FETCHED_GQL_TYPES = JSON.stringify({ Mergable: ['Lend'] });

			const result = await getGqlPossibleTypes(URL, CACHE);

			expect(result).toEqual({ Mergable: ['Lend'] });
			expect(getFromCache).not.toHaveBeenCalled();
			expect(fetch).not.toHaveBeenCalled();
		});

		it('clears an invalid process-level payload so it is not re-read', async () => {
			process.env.FETCHED_GQL_TYPES = JSON.stringify({ Mergable: [] });
			mockResponse({ data: { __schema: healthySchema } });

			await getGqlPossibleTypes(URL, CACHE);

			expect(JSON.parse(process.env.FETCHED_GQL_TYPES).Mergable).toEqual(['Lend', 'Geocode']);
		});
	});
});
