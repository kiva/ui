import loanSearchSuggestionsQuery from '@/graphql/query/loanSearchSuggestions.graphql';
import lendMenuDataQuery from '@/graphql/query/lendMenuData.graphql';
import createLoanModule from '@/store/modules/loan';
import * as types from '@/store/mutation-types';

const suggestions = ['a', 'b', 'c'];
const countryFacets = [1, 2, 3];
const categories = [{ index: 1 }, { index: 2 }, { index: 3 }];

describe('loan.js', () => {
	describe('actions', () => {
		let loanModule;

		beforeEach(() => {
			const mockApollo = {
				query: options => {
					return new Promise((resolve, reject) => {
						if (options.query === loanSearchSuggestionsQuery) {
							resolve({ data: { loanSearchSuggestions: suggestions } });
						} else if (options.query === lendMenuDataQuery) {
							resolve({
								data: {
									countryFacets,
									loanChannels: {
										values: categories
									},
								}
							});
						} else {
							reject();
						}
					});
				}
			};
			loanModule = createLoanModule(mockApollo);
		});

		describe('getLoanSearchSuggestions', () => {
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

		describe('getLendMenuInfo', () => {
			it('should query apollo for the lend menu data', () => {
				return loanModule.actions.getLendMenuInfo({ commit: () => {} });
			});

			it('should commit the suggestions to the store', () => {
				const store = { commit: jest.fn() };
				expect.assertions(2);
				return loanModule.actions.getLendMenuInfo(store).then(() => {
					expect(store.commit.mock.calls[0][0]).toBe(types.SET_PUBLIC_LEND_MENU_DATA);
					expect(store.commit.mock.calls[0][1]).toEqual({ categories, countryFacets });
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

		it('SET_PUBLIC_LEND_MENU_DATA should update facets and categories', () => {
			const state = { countryFacets: [], headerCategories: [] };
			const updates = { countryFacets, categories };
			loanModule.mutations[types.SET_PUBLIC_LEND_MENU_DATA](state, updates);
			expect(state.countryFacets).toEqual(updates.countryFacets);
			expect(state.headerCategories).toEqual(updates.categories);
		});
	});
});
