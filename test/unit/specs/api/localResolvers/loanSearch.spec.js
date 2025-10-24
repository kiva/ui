import loanSearchFactory from '#src/api/localResolvers/loanSearch';

describe('loanSearch.js', () => {
	describe('defaults', () => {
		it('Writes default loan search state to cache', () => {
			const { defaults } = loanSearchFactory();

			const cache = {
				writeQuery: vi.fn(),
			};

			defaults(cache);

			expect(cache.writeQuery).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						loanSearchState: expect.objectContaining({
							id: 'SearchData',
							__typename: 'LoanSearchState',
							gender: null,
							pageOffset: 0,
							pageLimit: 15,
						}),
					}),
				})
			);
		});
	});

	describe('Mutation.updateLoanSearch', () => {
		it('Returns a default loan search object with gender set', () => {
			const { resolvers } = loanSearchFactory();

			const context = {
				cache: {
					readQuery: vi.fn().mockReturnValue({}),
					writeQuery: vi.fn(),
				},
			};

			resolvers.Mutation.updateLoanSearch(null, { searchParams: { gender: 'male' } }, context);

			expect(context.cache.readQuery.mock.calls.length).toBe(1);
			expect(context.cache.writeQuery.mock.calls.length).toBe(1);
		});
	});
});
