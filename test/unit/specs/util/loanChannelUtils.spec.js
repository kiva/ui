import {
	getFLSSQueryMap,
	transformFLSSData,
	preFetchChannel,
	getCachedChannel,
	getLoanChannel,
	watchChannelQuery,
} from '#src/util/loanChannelUtils';
import loanChannelQuery from '#src/graphql/query/loanChannelDataExpanded.graphql';
import * as experimentalUtils from '#src/util/experiment/experimentUtils';
import * as flssUtils from '#src/util/flssUtils';
import { getLoanChannelVariables } from '#src/util/flssUtils';

const mockWomenMap = {
	id: 5,
	url: 'women',
	queryParams: 'status=fundRaising&gender=female&riskRating=0,5',
	algoliaParams: 'gender=female',
	flssLoanSearch: { gender: 'female' },
};

const mockQueryMap = [
	mockWomenMap,
	{
		id: 8,
		url: 'agriculture',
		queryParams: 'status=fundRaising&riskRating=0,5&sector=1',
		algoliaParams: 'sector=Agriculture',
		flssLoanSearch: { sectorId: [1] },
	}
];

const mockLoanQueryVars = {
	ids: [3],
	offset: 10,
	limit: 5,
	basketId: 'asd'
};

const mockFLSSData = {
	shop: { id: 1 },
	lend: { loanChannelsById: [{ id: 2 }] },
	fundraisingLoans: { test: 3 },
};

describe('loanChannelUtils.js', () => {
	let spyConsoleInfo;

	beforeEach(() => {
		spyConsoleInfo = vi.spyOn(global.console, 'info').mockImplementation();
	});

	afterEach(vi.restoreAllMocks);

	describe('getFLSSQueryMap', () => {
		it('should handle no match', () => {
			const result = getFLSSQueryMap(mockQueryMap, 'asd');

			expect(result).toBeFalsy();
			expect(spyConsoleInfo).toHaveBeenCalledTimes(1);
			// eslint-disable-next-line max-len
			expect(spyConsoleInfo).toHaveBeenCalledWith('{"meta":{},"level":"info","message":"The following category was not found in the FLSS query map: asd"}');
		});

		it('should return map result', () => {
			const result = getFLSSQueryMap(mockQueryMap, 'women');

			expect(result).toEqual({ gender: 'female' });
			expect(spyConsoleInfo).toHaveBeenCalledTimes(0);
		});
	});

	describe('transformFLSSData', () => {
		it('should handle missing data', () => {
			const result = transformFLSSData({});

			expect(result.shop).toEqual({});
			expect(result.lend).toEqual({ loanChannelsById: [{ loans: {} }] });
		});

		it('should transform data', () => {
			const result = transformFLSSData(mockFLSSData);

			expect(result).toEqual({
				shop: mockFLSSData.shop,
				lend: {
					loanChannelsById: [{
						...mockFLSSData.lend.loanChannelsById[0],
						loans: mockFLSSData.fundraisingLoans
					}]
				},
			});
		});
	});

	describe('preFetchChannel', () => {
		let spyGetExperimentSettingAsync;
		let spyFetchLoanChannel;
		const apollo = { query: vi.fn(() => Promise.resolve()) };

		beforeEach(() => {
			spyGetExperimentSettingAsync = vi.spyOn(experimentalUtils, 'getExperimentSettingAsync')
				.mockImplementation(() => Promise.resolve());
			spyFetchLoanChannel = vi.spyOn(flssUtils, 'fetchLoanChannel')
				.mockImplementation(() => Promise.resolve());
		});

		afterEach(vi.clearAllMocks);

		it('should handle channel without FLSS mapping', async () => {
			await preFetchChannel(apollo, mockQueryMap, 'asd', mockLoanQueryVars);

			expect(apollo.query).toHaveBeenCalledTimes(1);
			expect(apollo.query).toHaveBeenCalledWith({ query: loanChannelQuery, variables: mockLoanQueryVars });
		});

		it('should handle active assigned experiment', async () => {
			apollo.query.mockReturnValueOnce({ data: { experiment: { version: 'b' } } });

			await preFetchChannel(apollo, mockQueryMap, 'women', mockLoanQueryVars);

			expect(spyGetExperimentSettingAsync).toHaveBeenCalledTimes(0);
			expect(spyFetchLoanChannel).toHaveBeenCalledTimes(1);
			expect(spyFetchLoanChannel).toHaveBeenCalledWith(apollo, mockWomenMap.flssLoanSearch, mockLoanQueryVars);
			expect(apollo.query).toHaveBeenCalledTimes(0);
		});

		it('should handle active unassigned experiment', async () => {
			apollo.query.mockReturnValueOnce({ data: { experiment: { version: 'a' } } });

			await preFetchChannel(apollo, mockQueryMap, 'women', mockLoanQueryVars);

			expect(spyGetExperimentSettingAsync).toHaveBeenCalledTimes(0);
			expect(spyFetchLoanChannel).toHaveBeenCalledTimes(1);
			expect(apollo.query).toHaveBeenCalledTimes(0);
		});

		it('should handle apollo query errors', async () => {
			apollo.query.mockResolvedValueOnce({
				data: null,
				errors: [new Error('Query failed')]
			});

			const result = await preFetchChannel(apollo, mockQueryMap, 'asd', mockLoanQueryVars);

			// Query was called and returned error response (line 63 coverage)
			expect(apollo.query).toHaveBeenCalledTimes(1);
			expect(result.errors).toBeDefined();
		});
	});

	describe('getCachedChannel', () => {
		let spyGetCachedLoanChannel;
		const apollo = { readQuery: vi.fn(() => Promise.resolve()) };

		beforeEach(() => {
			spyGetCachedLoanChannel = vi.spyOn(flssUtils, 'getCachedLoanChannel');
		});

		afterEach(vi.clearAllMocks);

		it('should handle channel without FLSS mapping', () => {
			getCachedChannel(apollo, mockQueryMap, 'asd', mockLoanQueryVars);

			expect(apollo.readQuery).toHaveBeenCalledTimes(1);
			expect(apollo.readQuery).toHaveBeenCalledWith({ query: loanChannelQuery, variables: mockLoanQueryVars });
		});

		it('should handle active assigned experiment', () => {
			const mockData = {
				shop: { id: 1 },
				lend: { loanChannelsById: [{ id: 2 }] },
				fundraisingLoans: { test: 3 },
			};

			apollo.readQuery.mockReturnValueOnce({ experiment: { version: 'b' } });

			spyGetCachedLoanChannel.mockReturnValueOnce(mockData);

			const result = getCachedChannel(apollo, mockQueryMap, 'women', mockLoanQueryVars);

			expect(apollo.readQuery).toHaveBeenCalledTimes(0);
			expect(result).toEqual({
				shop: mockData.shop,
				lend: {
					loanChannelsById: [{ ...mockData.lend.loanChannelsById[0], loans: mockData.fundraisingLoans }]
				},
			});
		});

		it('should handle active unassigned experiment', () => {
			const data = {};

			apollo.readQuery.mockReturnValueOnce({ experiment: { version: 'a' } }).mockReturnValueOnce(data);

			getCachedChannel(apollo, mockQueryMap, 'women', mockLoanQueryVars);

			expect(apollo.readQuery).toHaveBeenCalledTimes(1);
		});

		it('should handle apollo readQuery errors', () => {
			apollo.readQuery.mockImplementationOnce(() => {
				throw new Error('Read query failed');
			});

			const result = getCachedChannel(apollo, mockQueryMap, 'asd', mockLoanQueryVars);

			// Error should be caught and logged (line 86)
			expect(apollo.readQuery).toHaveBeenCalledTimes(1);
			expect(result).toBeUndefined();
		});
	});

	describe('getLoanChannel', () => {
		let spyGetLoanChannel;
		const apollo = {
			query: vi.fn(() => Promise.resolve()),
		};

		beforeEach(() => {
			spyGetLoanChannel = vi.spyOn(flssUtils, 'fetchLoanChannel').mockImplementation(() => Promise.resolve());
		});

		afterEach(vi.clearAllMocks);

		it('should handle channel without FLSS mapping', async () => {
			await getLoanChannel(apollo, mockQueryMap, 'asd', mockLoanQueryVars);

			expect(apollo.query).toHaveBeenCalledTimes(1);
			expect(apollo.query).toHaveBeenCalledWith({ query: loanChannelQuery, variables: mockLoanQueryVars });
		});

		it('should handle channel with FLSS mapping', async () => {
			const mockData = {
				shop: { id: 1 },
				lend: { loanChannelsById: [{ id: 2 }] },
				fundraisingLoans: { test: 3 },
			};

			spyGetLoanChannel.mockReturnValueOnce(mockData);

			const result = await getLoanChannel(apollo, mockQueryMap, 'women', mockLoanQueryVars);

			expect(apollo.query).toHaveBeenCalledTimes(0);
			expect(result).toEqual({
				shop: mockData.shop,
				lend: {
					loanChannelsById: [{ ...mockData.lend.loanChannelsById[0], loans: mockData.fundraisingLoans }]
				},
			});
		});

		it('should pass filter overrides to FLSS', async () => {
			await getLoanChannel(apollo, mockQueryMap, 'women', mockLoanQueryVars, { extra: 'asd' });

			const expectedFilters = { gender: 'female', extra: 'asd' };

			expect(spyGetLoanChannel).toHaveBeenCalledWith(apollo, expectedFilters, mockLoanQueryVars);
		});

		it('should handle apollo query errors', async () => {
			apollo.query.mockResolvedValueOnce({
				data: null,
				errors: [new Error('Query failed')]
			});

			const result = await getLoanChannel(apollo, mockQueryMap, 'asd', mockLoanQueryVars);

			// Query was called and returned error response (line 111 coverage)
			expect(apollo.query).toHaveBeenCalledTimes(1);
			expect(result.errors).toBeDefined();
		});
	});

	describe('watchChannelQuery', () => {
		let spyWatchLoanChannel;
		let watchCallback;
		let subscribeNextCallback;
		const observer = {
			subscribe: vi.fn(options => { subscribeNextCallback = options.next; }),
			setVariables: vi.fn()
		};
		const apollo = { watchQuery: vi.fn(() => observer) };
		const watch = vi.fn(callback => { watchCallback = callback; });

		beforeEach(() => {
			spyWatchLoanChannel = vi.spyOn(flssUtils, 'watchLoanChannel');
		});

		afterEach(vi.clearAllMocks);

		it('should handle channel without FLSS mapping', () => {
			const next = vi.fn();

			const result = watchChannelQuery(apollo, mockQueryMap, 'asd', mockLoanQueryVars, next, watch);

			expect(spyWatchLoanChannel).toHaveBeenCalledTimes(0);
			expect(apollo.watchQuery).toHaveBeenCalledTimes(1);
			expect(result.subscribe).toHaveBeenCalledTimes(1);
			expect(result.subscribe).toHaveBeenCalledWith({ next: expect.any(Function) });
			expect(watch).toHaveBeenCalledTimes(1);
			expect(watch).toHaveBeenCalledWith(expect.any(Function));

			subscribeNextCallback({ data: mockFLSSData, loading: true });

			expect(next).toHaveBeenCalledTimes(1);
			expect(next).toHaveBeenCalledWith(mockFLSSData, true);

			watchCallback(mockLoanQueryVars);

			expect(observer.setVariables).toHaveBeenCalledTimes(1);
			expect(observer.setVariables).toHaveBeenCalledWith(mockLoanQueryVars);
		});

		it('should handle channel with FLSS mapping', () => {
			spyWatchLoanChannel.mockReturnValueOnce(observer);

			const next = vi.fn();

			const result = watchChannelQuery(apollo, mockQueryMap, 'women', mockLoanQueryVars, next, watch);

			expect(spyWatchLoanChannel).toHaveBeenCalledTimes(1);
			expect(spyWatchLoanChannel).toHaveBeenCalledWith(apollo, mockWomenMap.flssLoanSearch, mockLoanQueryVars);
			expect(result.subscribe).toHaveBeenCalledTimes(1);
			expect(result.subscribe).toHaveBeenCalledWith({ next: expect.any(Function) });
			expect(watch).toHaveBeenCalledTimes(1);
			expect(watch).toHaveBeenCalledWith(expect.any(Function));

			subscribeNextCallback({ data: mockFLSSData, loading: true });

			expect(next).toHaveBeenCalledTimes(1);
			expect(next).toHaveBeenCalledWith(transformFLSSData(mockFLSSData), true);

			watchCallback(mockLoanQueryVars);

			expect(observer.setVariables).toHaveBeenCalledTimes(1);
			expect(observer.setVariables).toHaveBeenCalledWith(
				getLoanChannelVariables(mockWomenMap.flssLoanSearch, mockLoanQueryVars)
			);
		});

		it('should handle active unassigned experiment', () => {
			spyWatchLoanChannel.mockReturnValueOnce(observer);

			const next = vi.fn();

			const result = watchChannelQuery(apollo, mockQueryMap, 'women', mockLoanQueryVars, next, watch);

			expect(spyWatchLoanChannel).toHaveBeenCalledTimes(1);
			expect(apollo.watchQuery).toHaveBeenCalledTimes(0);
			expect(result.subscribe).toHaveBeenCalledTimes(1);
			expect(result.subscribe).toHaveBeenCalledWith({ next: expect.any(Function) });
			expect(watch).toHaveBeenCalledTimes(1);
			expect(watch).toHaveBeenCalledWith(expect.any(Function));

			subscribeNextCallback({ data: mockFLSSData, loading: true });

			expect(next).toHaveBeenCalledTimes(1);

			watchCallback(mockLoanQueryVars);

			expect(observer.setVariables).toHaveBeenCalledTimes(1);
		});

		it('should handle null observer', () => {
			const apolloNull = { watchQuery: vi.fn(() => null) };
			const next = vi.fn();

			const result = watchChannelQuery(apolloNull, mockQueryMap, 'asd', mockLoanQueryVars, next, watch);

			// If observer is null, function returns undefined (line 133)
			expect(result).toBeUndefined();
			expect(watch).not.toHaveBeenCalled();
		});
	});
});
