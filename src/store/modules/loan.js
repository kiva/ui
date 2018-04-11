import _sortBy from 'lodash/sortBy';
import lendMenuDataQuery from '@/graphql/query/lendMenuData.graphql';
import loanSearchSuggestionsQuery from '@/graphql/query/loanSearchSuggestions.graphql';
import * as types from '@/store/mutation-types';

export default apollo => {
	return {
		state: {
			searchSuggestions: [],
			headerCategories: [],
			countryFacets: [],
			regionDisplayOrder: [
				'North America',
				'Central America',
				'South America',
				'Africa',
				'Eastern Europe',
				'Middle East',
				'Asia',
				'Oceania'
			],
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

			getLendMenuInfo({ commit }) {
				return apollo.query({ query: lendMenuDataQuery })
					.then(result => result.data)
					.then(data => {
						commit(types.SET_PUBLIC_LEND_MENU_DATA, {
							categories: data.loanChannels.values,
							countryFacets: data.countryFacets
						});
					});
			},
		},
		mutations: {
			[types.RECEIVE_LOAN_SEARCH_SUGGESTIONS](state, { suggestions }) {
				state.searchSuggestions = suggestions;
			},
			[types.SET_PUBLIC_LEND_MENU_DATA](state, { categories, countryFacets }) {
				state.countryFacets = countryFacets;
				state.headerCategories = _sortBy(categories, 'index');
			},
		},
	};
};
