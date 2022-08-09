import { updateSearchState, getValidatedSearchState } from '@/util/loanSearch/searchStateUtils';
import { FLSS_QUERY_TYPE, STANDARD_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';
import { mockState, mockAllFacets } from './mockData';

describe('searchStateUtils.js', () => {
	describe('getValidatedSearchState', () => {
		it('should return valid state', () => {
			const result = getValidatedSearchState(mockState, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual(mockState);
		});

		it('should validate gender', () => {
			const state = { ...mockState, gender: 'asd' };

			const result = getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, gender: null });
		});

		it('should validate country ISO code', () => {
			const state = { ...mockState, countryIsoCode: ['asd'] };

			const result = getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, countryIsoCode: [] });
		});

		it('should validate sector ID', () => {
			const state = { ...mockState, sectorId: [-1] };

			const result = getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, sectorId: [] });
		});

		it('should validate FLSS sortBy', () => {
			const state = { ...mockState, sortBy: 'asd' };

			const result = getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, sortBy: null });
		});

		it('should validate standard sortBy', () => {
			const state = { ...mockState, sortBy: 'asd' };

			const result = getValidatedSearchState(state, mockAllFacets, STANDARD_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, sortBy: null });
		});

		it('should validate theme', () => {
			const state = { ...mockState, themeId: ['asd'] };

			const result = getValidatedSearchState(state, mockAllFacets, STANDARD_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, themeId: [] });
		});

		it('should validate pageOffset', () => {
			const state = { ...mockState, pageOffset: 'asd' };

			const result = getValidatedSearchState(state, mockAllFacets, STANDARD_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, pageOffset: 0 });
		});

		it('should validate pageLimit', () => {
			const state = { ...mockState, pageLimit: 'asd' };

			const result = getValidatedSearchState(state, mockAllFacets, STANDARD_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, pageLimit: 15 });
		});
	});

	describe('updateSearchState', () => {
		const mockResult = 1;
		const apollo = { mutate: jest.fn(() => Promise.resolve(mockResult)) };
		const params = {
			mutation: updateLoanSearchMutation,
			variables: { searchParams: mockState }
		};

		afterEach(jest.clearAllMocks);

		it('should call apollo with the provided filters and return results', async () => {
			const result = await updateSearchState(apollo, mockState, mockAllFacets, FLSS_QUERY_TYPE, {});

			expect(apollo.mutate).toHaveBeenCalledWith(params);
			expect(result).toBe(mockResult);
		});

		it('should check if state has changed', async () => {
			await updateSearchState(apollo, mockState, mockAllFacets, FLSS_QUERY_TYPE, mockState);

			expect(apollo.mutate).toHaveBeenCalledTimes(0);
		});
	});
});
