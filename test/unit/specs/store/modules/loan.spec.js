import loanSearchSuggestionsQuery from '@/graphql/query/loanSearchSuggestions.graphql';
import createLoanModule from '@/store/modules/loan';
import * as types from '@/store/mutation-types';

const suggestions = ['a', 'b', 'c'];

describe('loan.js', () => {
	describe('actions', () => {
		describe('getLoanSearchSuggestions', () => {
			let loanModule;

			beforeEach(() => {
				const mockApollo = {
					query: options => {
						return new Promise((resolve, reject) => {
							if (options.query === loanSearchSuggestionsQuery) {
								resolve({ data: { loanSearchSuggestions: suggestions } });
							} else {
								reject();
							}
						});
					}
				};
				loanModule = createLoanModule(mockApollo);
			});

			it('should query apollo for the loan search suggestions', () => {
				return loanModule.actions.getLoanSearchSuggestions({ commit: () => {} });
			});

			it('should commit the suggestions to the store', () => {
				const store = { commit: jest.fn() };
				expect.assertions(2);
				return loanModule.actions.getLoanSearchSuggestions(store).then(() => {
					expect(store.commit.mock.calls[0][0]).toBe(types.RECEIVE_LOAN_SEARCH_SUGGESTIONS);
					expect(store.commit.mock.calls[0][1]).toEqual({ suggestions });
				});
			});

			it('should return a promise that resolves to the suggestions', () => {
				expect.assertions(1);
				return loanModule.actions.getLoanSearchSuggestions({ commit: () => {} }).then(data => {
					expect(data).toBe(suggestions);
				});
			});
		});
	});

	describe('mutations', () => {
		let loanModule;

		beforeEach(() => {
			loanModule = createLoanModule();
		});

		it('RECEIVE_LOAN_SEARCH_SUGGESTIONS should update searchSuggestions', () => {
			const state = { searchSuggestions: [] };
			const updates = { suggestions };
			loanModule.mutations[types.RECEIVE_LOAN_SEARCH_SUGGESTIONS](state, updates);
			expect(state.searchSuggestions).toEqual(updates.suggestions);
		});
	});
});
