import { updateSearchState, getValidatedSearchState, createSavedSearch } from '@/util/loanSearch/searchStateUtils';
import { FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';
import createSavedSearchMutation from '@/graphql/mutation/createSavedSearch.graphql';
import filterConfig from '@/util/loanSearch/filterConfig';
import { mockAllFacets, savedSearchParams } from '../../../fixtures/mockLoanSearchData';

jest.mock('@/util/loanSearch/filterConfig', () => {
	return {
		config: {
			a: { getValidatedSearchState: jest.fn().mockReturnValue({ a: 'a' }) },
			b: { getValidatedSearchState: jest.fn().mockReturnValue({ b: 'b' }) },
		},
		keys: ['a', 'b'],
	};
});

describe('searchStateUtils.js', () => {
	beforeEach(jest.clearAllMocks);

	describe('getValidatedSearchState', () => {
		it('should call filterConfig', () => {
			const result = getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual({ a: 'a', b: 'b' });
			expect(filterConfig.config.a.getValidatedSearchState).toHaveBeenCalledTimes(1);
			expect(filterConfig.config.a.getValidatedSearchState)
				.toHaveBeenCalledWith({}, mockAllFacets, FLSS_QUERY_TYPE);
			expect(filterConfig.config.b.getValidatedSearchState).toHaveBeenCalledTimes(1);
			expect(filterConfig.config.b.getValidatedSearchState)
				.toHaveBeenCalledWith({}, mockAllFacets, FLSS_QUERY_TYPE);
		});
	});

	describe('updateSearchState', () => {
		const mockResult = 1;
		const apollo = { mutate: jest.fn(() => Promise.resolve(mockResult)) };
		const mockState = { a: 'a', b: 'b' };
		const params = {
			mutation: updateLoanSearchMutation,
			variables: { searchParams: mockState }
		};

		it('should call apollo with the provided filters and return results', async () => {
			filterConfig.config.a.getValidatedSearchState.mockReturnValueOnce({ a: 'aa' });
			filterConfig.config.b.getValidatedSearchState.mockReturnValueOnce({ b: 'bb' });

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

		beforeEach(jest.clearAllMocks);

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
