import { updateSearchState, getValidatedSearchState, createSavedSearch } from '@/util/loanSearch/searchStateUtils';
import { FLSS_QUERY_TYPE, STANDARD_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';
import createSavedSearchMutation from '@/graphql/mutation/createSavedSearch.graphql';
import { mockState, mockAllFacets, savedSearchParams } from '../../../fixtures/mockLoanSearchData';

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

		it('should validate tag', () => {
			const state = { ...mockState, tagId: ['asd'] };

			const result = getValidatedSearchState(state, mockAllFacets, STANDARD_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, tagId: [] });
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

		it('should validate distribution model', () => {
			const state = { ...mockState, distributionModel: 'asd' };

			const result = getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, distributionModel: null });
		});

		it('should validate is individual', () => {
			const state = { ...mockState, isIndividual: 'asd' };

			const result = getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, isIndividual: null });
		});

		it('should validate lender repayment term', () => {
			const state = { ...mockState, lenderRepaymentTerm: 'asd' };

			const result = getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, lenderRepaymentTerm: null });
		});

		it('should add lender repayment term typename', () => {
			const result = getValidatedSearchState(mockState, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual({
				...mockState,
				lenderRepaymentTerm: { ...mockState.lenderRepaymentTerm, __typename: 'MinMaxRange' }
			});
		});

		it('should validate keyword search and trim', () => {
			const state = { ...mockState, keywordSearch: 'test ' };

			const result = getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual({
				...mockState,
				keywordSearch: 'test',
			});
		});

		it('should validate keyword search empty string', () => {
			const state = { ...mockState, keywordSearch: ' ' };

			const result = getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual({
				...mockState,
				keywordSearch: null,
			});
		});

		it('should validate keyword search undefined', () => {
			const state = { ...mockState, keywordSearch: undefined };

			const result = getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, keywordSearch: null });
		});

		it('should validate partner IDs', () => {
			let result = getValidatedSearchState({ ...mockState, partnerId: [-1] }, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, partnerId: [] });

			result = getValidatedSearchState({ ...mockState, partnerId: undefined }, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, partnerId: [] });
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

	describe('createSavedSearch', () => {
		const mockResult = { name: 'test saved search' };
		const apollo = { mutate: jest.fn(() => Promise.resolve(mockResult)) };
		const params = {
			mutation: createSavedSearchMutation,
			variables: savedSearchParams
		};

		afterEach(jest.clearAllMocks);

		it('should call apollo with provided search params and return an id and name', async () => {
			const result = await createSavedSearch(
				apollo,
				savedSearchParams.filters,
				savedSearchParams.queryString,
				savedSearchParams.name
			);
			expect(apollo.mutate).toHaveBeenCalledWith(params);
			expect(result).toHaveProperty('name', 'test saved search');
		});
	});
});
