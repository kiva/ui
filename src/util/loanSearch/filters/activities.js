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
		stateKey: 'activityId',
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
		...(loanSearchState?.activityId && { activityId: { any: loanSearchState.activityId } })
	}),
	getValidatedSearchState: () => ({}),
	getFilterFromQuery: () => ({}),
	getQueryFromFilter: () => ({}),
};
