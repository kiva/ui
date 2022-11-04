import { getDefaultLoanSearchState } from '@/api/localResolvers/loanSearch';
import { isNumber } from '@/util/numberUtils';

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
		stateKey: 'pageOffset',
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
		pageOffset: isNumber(loanSearchState?.pageOffset)
			? loanSearchState.pageOffset
			: getDefaultLoanSearchState().pageOffset
	}),
	getFilterFromQuery: (query, _allFacets, pageLimit) => {
		// Convert query param 1-based page to pager 0-based page and ensure page is an integer
		const page = isNumber(query.page) && query.page >= 1 ? Math.floor(query.page) - 1 : 0;

		return { pageOffset: page * pageLimit };
	},
	getQueryFromFilter: loanSearchState => {
		// Page query param is 1-based
		const page = (loanSearchState.pageOffset / loanSearchState.pageLimit) + 1;

		return { ...(page > 1 && { page: page.toString() }) };
	},
};
