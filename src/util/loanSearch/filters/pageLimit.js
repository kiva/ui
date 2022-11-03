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
		stateKey: 'pageLimit',
		eventAction: undefined,
		allOptionsTitle: undefined,
		valueMap: undefined,
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
			: getDefaultLoanSearchState().pageLimit
	}),
	getFilterFromQuery: (_query, _allFacets, pageLimit) => ({ pageLimit }),
	getQueryFromFilter: () => ({}),
};
