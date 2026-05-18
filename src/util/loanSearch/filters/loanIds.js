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
		stateKey: 'loanIds',
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
	getFlssFilter: loanSearchState => ({
		...(loanSearchState?.loanIds && { loanIds: loanSearchState.loanIds })
	}),
	getValidatedSearchState: loanSearchState => ({
		loanIds: loanSearchState?.loanIds ?? null
	}),
	getFilterFromQuery: () => ({}),
	getQueryFromFilter: () => ({}),
};
