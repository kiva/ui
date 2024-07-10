import loanSearchFactory from '@/api/localResolvers/loanSearch';

describe('loanSearch.js', () => {
	describe('Mutation.updateLoanSearch', () => {
		it('Returns a default loan search object with gender set', () => {
			const { resolvers } = loanSearchFactory();

			const context = {
				cache: {
					readQuery: jest.fn().mockReturnValue({}),
					writeQuery: jest.fn(),
				},
			};

			resolvers.Mutation.updateLoanSearch(null, { searchParams: { gender: 'male' } }, context);

			expect(context.cache.readQuery.mock.calls.length).toBe(1);
			expect(context.cache.writeQuery.mock.calls.length).toBe(1);
		});
	});
});
