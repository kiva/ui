import {
	getFLSSQueryMap,
	transformFLSSData,
	preFetchChannel,
	getCachedChannel,
	getLoanChannel,
	watchChannelQuery,
} from '@/util/loanChannelUtils';
import loanChannelQuery from '@/graphql/query/loanChannelDataExpanded.graphql';
import * as experimentalUtils from '@/util/experimentUtils';
import * as flssUtils from '@/util/flssUtils';
import { getLoanChannelVariables } from '@/util/flssUtils';

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
	describe('getFLSSQueryMap', () => {
		it('should handle no match', () => {
			const result = getFLSSQueryMap(mockQueryMap, 'asd');

			expect(result).toBeFalsy();
		});

		it('should return map result', () => {
			const result = getFLSSQueryMap(mockQueryMap, 'women');

			expect(result).toEqual({ gender: 'female' });
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
		const apollo = { query: jest.fn(() => Promise.resolve()) };

		beforeEach(() => {
			spyGetExperimentSettingAsync = jest.spyOn(experimentalUtils, 'getExperimentSettingAsync')
				.mockImplementation(() => Promise.resolve());
			spyFetchLoanChannel = jest.spyOn(flssUtils, 'fetchLoanChannel')
				.mockImplementation(() => Promise.resolve());
		});

		afterEach(jest.clearAllMocks);

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
	});

	describe('getCachedChannel', () => {
		let spyGetCachedLoanChannel;
		const apollo = { readQuery: jest.fn(() => Promise.resolve()) };

		beforeEach(() => {
			spyGetCachedLoanChannel = jest.spyOn(flssUtils, 'getCachedLoanChannel');
		});

		afterEach(jest.clearAllMocks);

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
	});

	describe('getLoanChannel', () => {
		let spyGetLoanChannel;
		const apollo = {
			query: jest.fn(() => Promise.resolve()),
			readQuery: jest.fn(() => Promise.resolve())
		};
		beforeEach(() => {
			spyGetLoanChannel = jest.spyOn(flssUtils, 'fetchLoanChannel').mockImplementation(() => Promise.resolve());
		});

		afterEach(jest.clearAllMocks);

		it('should handle channel without FLSS mapping', () => {
			getLoanChannel(apollo, mockQueryMap, 'asd', mockLoanQueryVars);

			expect(apollo.query).toHaveBeenCalledTimes(1);
			expect(apollo.query).toHaveBeenCalledWith({ query: loanChannelQuery, variables: mockLoanQueryVars });
		});

		it('should handle active assigned experiment', async () => {
			const mockData = {
				shop: { id: 1 },
				lend: { loanChannelsById: [{ id: 2 }] },
				fundraisingLoans: { test: 3 },
			};

			apollo.readQuery.mockReturnValueOnce({ experiment: { version: 'b' } });

			spyGetLoanChannel.mockReturnValueOnce(mockData);

			const result = await getLoanChannel(apollo, mockQueryMap, 'women', mockLoanQueryVars);

			expect(apollo.readQuery).toHaveBeenCalledTimes(0);
			expect(result).toEqual({
				shop: mockData.shop,
				lend: {
					loanChannelsById: [{ ...mockData.lend.loanChannelsById[0], loans: mockData.fundraisingLoans }]
				},
			});
		});

		it('should handle active unassigned experiment', async () => {
			const data = {};

			apollo.readQuery.mockReturnValueOnce({ experiment: { version: 'a' } }).mockReturnValueOnce(data);

			await getLoanChannel(apollo, mockQueryMap, 'women', mockLoanQueryVars);

			expect(apollo.readQuery).toHaveBeenCalledTimes(0);
			expect(apollo.query).toHaveBeenCalledTimes(0);
		});
	});

	describe('watchChannelQuery', () => {
		let spyWatchLoanChannel;
		let watchCallback;
		let subscribeNextCallback;
		const observer = {
			subscribe: jest.fn(options => { subscribeNextCallback = options.next; }),
			setVariables: jest.fn()
		};
		const apollo = { readQuery: jest.fn(), watchQuery: jest.fn(() => observer) };
		const watch = jest.fn(callback => { watchCallback = callback; });

		beforeEach(() => {
			spyWatchLoanChannel = jest.spyOn(flssUtils, 'watchLoanChannel');
		});

		afterEach(jest.clearAllMocks);

		it('should handle channel without FLSS mapping', () => {
			const next = jest.fn();

			const result = watchChannelQuery(apollo, mockQueryMap, {}, 'asd', mockLoanQueryVars, next, watch);

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

		it('should handle active assigned experiment', () => {
			apollo.readQuery.mockReturnValueOnce({ experiment: { version: 'b' } });

			spyWatchLoanChannel.mockReturnValueOnce(observer);

			const next = jest.fn();

			const result = watchChannelQuery(apollo, mockQueryMap, {}, 'women', mockLoanQueryVars, next, watch);

			expect(apollo.readQuery).toHaveBeenCalledTimes(0);
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
			apollo.readQuery.mockReturnValueOnce({ experiment: { version: 'unassigned' } });

			spyWatchLoanChannel.mockReturnValueOnce(observer);

			const next = jest.fn();

			const result = watchChannelQuery(apollo, mockQueryMap, {}, 'women', mockLoanQueryVars, next, watch);

			expect(apollo.readQuery).toHaveBeenCalledTimes(0);
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
	});
});
