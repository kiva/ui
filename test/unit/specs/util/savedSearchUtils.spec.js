import { createSavedSearch } from '@/util/savedSearchUtils';
import createSavedSearchMutation from '@/graphql/mutation/createSavedSearch.graphql';
import { savedSearchParams } from '../../fixtures/mockLoanSearchData';

describe('savedSearchUtils.js', () => {
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
