import { isNumber } from '#src/util/numberUtils';

// Default page limit value (was previously in src/api/localResolvers/loanSearch)
const DEFAULT_PAGE_LIMIT = 15;

export default {
	uiConfig: {
		type: undefined,
		hasAccordion: undefined,
		topLine: false,
		bottomLine: false,
		title: undefined,
		itemHeaderKey: undefined,
		placeholder: undefined,
		facetsKey: undefined,
		stateKey: 'pageLimit',
		eventAction: undefined,
		allOptionsTitle: undefined,
		valueMap: undefined,
		isPercentage: false,
		displayedUnit: undefined,
	},
	getOptions: () => ([]),
	showSavedSearch: () => (false),
	getFilterChips: () => ([]),
	getRemovedFacet: () => ({}),
	getSavedSearch: () => ({}),
	getFlssFilter: () => ({}),
	getValidatedSearchState: loanSearchState => ({
		pageLimit: isNumber(loanSearchState?.pageLimit)
			? loanSearchState.pageLimit
			: DEFAULT_PAGE_LIMIT
	}),
	getFilterFromQuery: (_query, _allFacets, pageLimit) => ({ pageLimit }),
	getQueryFromFilter: () => ({}),
};
