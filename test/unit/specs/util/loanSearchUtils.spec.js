import { updateSearchState } from '@/util/loanSearchUtils';
import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';

describe('loanSearchUtils.js', () => {
	describe('updateSearchState', () => {
		it('should call apollo with the provided filters and return results', async () => {
			const mockResult = 1;
			const apollo = { mutate: jest.fn(() => Promise.resolve(mockResult)) };
			const filters = { countryIsoCode: ['US'], sectorId: [9] };
			const params = {
				mutation: updateLoanSearchMutation,
				variables: { searchParams: filters }
			};

			const result = await updateSearchState(apollo, filters);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
			expect(result).toBe(mockResult);
		});
	});
});
