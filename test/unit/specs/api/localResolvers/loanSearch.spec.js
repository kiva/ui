import loanSearchFactory from '@/api/localResolvers/loanSearch';

const defaultLoanSearchState = {
	loanSearchState: {
		id: 'SearchData',
		gender: '',
		countryIsoCode: [],
		sectorId: [],
		sortBy: '',
		theme: [],
		__typename: 'LoanSearchState',
	}
};

describe('loanSearch.js', () => {
	describe('Query.loanSearchState', () => {
		it('Returns a default loan search object', () => {
			const { resolvers } = loanSearchFactory();
			const context = {
				cache: {
					readQuery: jest.fn().mockReturnValue(defaultLoanSearchState),
				},
			};

			const result = resolvers.Query.loanSearchState(null, null, context);

			expect(context.cache.readQuery.mock.calls.length).toBe(1);
			expect(result).toEqual(defaultLoanSearchState);
		});
	});

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
					readQuery: jest.fn().mockReturnValue(defaultLoanSearchState),
					writeData: jest.fn().mockReturnValue(loanSearchPlusGender),
				},
			};

			const result = resolvers.Mutation.updateLoanSearch(null, { searchParams: { gender: 'male' } }, context);

			expect(context.cache.readQuery.mock.calls.length).toBe(1);
			expect(context.cache.writeData.mock.calls.length).toBe(1);

			expect(result).toEqual(loanSearchPlusGender.loanSearchState);
		});
	});
});
