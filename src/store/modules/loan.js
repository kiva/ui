import loanSearchSuggestionsQuery from '@/graphql/query/loanSearchSuggestions.graphql';
import * as types from '@/store/mutation-types';

export default apollo => {
	return {
		state: {
			searchSuggestions: [],
		},
		getters: {},
		actions: {
			// Fetch all the filter suggestions via apollo
			getLoanSearchSuggestions({ commit }) {
				return apollo.query({ query: loanSearchSuggestionsQuery })
					.then(result => result.data.loanSearchSuggestions)
					.then(suggestions => {
						commit(types.RECEIVE_LOAN_SEARCH_SUGGESTIONS, { suggestions });
						return suggestions;
					});
			},
		},
		mutations: {
			[types.RECEIVE_LOAN_SEARCH_SUGGESTIONS](state, { suggestions }) {
				state.searchSuggestions = suggestions;
			},
		},
	};
};
