import loanSearchFactory, { getDefaultLoanSearchState } from '@/api/localResolvers/loanSearch';

const defaultLoanSearchState = getDefaultLoanSearchState();

describe('loanSearch.js', () => {
	describe('Mutation.updateLoanSearch', () => {
		it('Returns a default loan search object with gender set', () => {
			const { resolvers } = loanSearchFactory();

			// The updateLoanSearch mutation checks the cache
			// then blends new variables into the previous state
			const loanSearchPlusGender = {
				loanSearchState: {
					...defaultLoanSearchState.loanSearchState,
					...{ gender: 'male' }
				}
			};

			const context = {
				cache: {
					updateQuery: jest.fn().mockReturnValue(loanSearchPlusGender),
				},
			};

			const result = resolvers.Mutation.updateLoanSearch(null, { searchParams: { gender: 'male' } }, context);

			expect(context.cache.updateQuery.mock.calls.length).toBe(1);

			expect(result).toEqual(loanSearchPlusGender.loanSearchState);
		});
	});
});
