import { filterUiType } from '@/util/loanSearch/filterUtils';

export default {
	uiConfig: {
		type: filterUiType.keyword,
		hasAccordion: false,
		topLine: true,
		bottomLine: true,
		title: 'Keywords',
		itemHeaderKey: undefined,
		placeholder: 'Search borrower story',
		facetsKey: undefined,
		stateKey: 'keywordSearch',
		eventAction: undefined,
		allOptionsTitle: undefined,
		valueMap: undefined,
	},
	getOptions: () => [],
	showSavedSearch: loanSearchState => !!loanSearchState.keywordSearch,
	getFilterChips: loanSearchState => {
		if (loanSearchState.keywordSearch) {
			return [{ name: loanSearchState.keywordSearch, __typename: 'KeywordSearch' }];
		}
		return [];
	},
	getRemovedFacet: () => ({ keywordSearch: null }),
	getSavedSearch: () => {},
	getFlssFilter: loanSearchState => ({
		...(loanSearchState?.keywordSearch && { description: { eq: loanSearchState.keywordSearch } })
	}),
	getValidatedSearchState: loanSearchState => ({ keywordSearch: loanSearchState?.keywordSearch?.trim() || null }),
	getFilterFromQuery: query => ({ keywordSearch: query.queryString ?? null }),
	getQueryFromFilter: loanSearchState => ({
		...(loanSearchState.keywordSearch && { queryString: loanSearchState.keywordSearch })
	}),
};
