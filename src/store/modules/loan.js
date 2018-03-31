import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';
import _omit from 'lodash/omit';
import _take from 'lodash/take';

import loanSearchSuggestionsQuery from '@/graphql/query/loanSearchSuggestions.graphql';
import * as types from '@/store/mutation-types';
import SearchEngine from '@/util/searchEngine';

export default apollo => {
	const loanFilterSearchEngine = new SearchEngine();

	return {
		state: {
			searchSuggestions: [],
			filteredSuggestions: [],
			searchTerm: '',
		},
		getters: {},
		actions: {
			// Fetch all the filter suggestions via apollo
			getLoanSearchSuggestions({ commit }) {
				return apollo.query({ query: loanSearchSuggestionsQuery })
					.then(result => {
						const suggestions = result.data.loanSearchSuggestions;

						// Initialize the search engine with the fetched suggestions
						loanFilterSearchEngine.reset(suggestions);

						// Save list of all suggestions to the store
						commit(types.RECEIVE_LOAN_SEARCH_SUGGESTIONS, { suggestions });
					});
			},
			enterLoanSearchTerm({ commit }, term) {
				if (term.length > 0) { // Only search if a term has been entered
					loanFilterSearchEngine.search(term).then(results => {
						// Group the results by their group name
						const groups = _groupBy(results, 'group');

						// From the groups, build the sections of suggestions to display
						const sections = _map(groups, (groupResults, name) => {
							// Limit the displayed results to the first 5
							const limited = _take(groupResults, 5);

							// Remove the 'group' property from each result to save on some space
							const suggestions = _map(limited, result => _omit(result, 'group'));

							// Construct the section, using the group name and sorted results
							return { name, suggestions };
						});

						// Save the results to the store
						commit(types.UPDATE_LOAN_SEARCH_TERM, { term, suggestions: sections });
					});
				} else {
					// No search term, so no suggestions.
					commit(types.UPDATE_LOAN_SEARCH_TERM, { term: '', suggestions: [] });
				}
			}
		},
		mutations: {
			[types.RECEIVE_LOAN_SEARCH_SUGGESTIONS](state, { suggestions }) {
				state.searchSuggestions = suggestions;
			},
			[types.UPDATE_LOAN_SEARCH_TERM](state, { term, suggestions }) {
				state.searchTerm = term;
				state.filteredSuggestions = suggestions;
			},
		},
	};
};
