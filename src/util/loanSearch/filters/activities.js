import { getIdsFromQueryParam } from '#src/util/loanSearch/queryParseUtils';

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
	getFilterChips: (loanSearchState, allFacets) => {
		if (loanSearchState.activityId?.length) {
			return loanSearchState.activityId
				.map(activityId => {
					return allFacets.activityFacets?.find(facet => {
						return facet.id === activityId;
					});
				})
				.filter(x => x); // Remove undefined/null values
		}
		return [];
	},
	getRemovedFacet: (loanSearchState, facet) => ({
		activityId: [...(loanSearchState?.activityId ?? []).filter(id => facet?.id !== id)]
	}),
	getSavedSearch: () => ({}),
	getFlssFilter: loanSearchState => ({
		...(loanSearchState?.activityId?.length && { activityId: { any: loanSearchState.activityId } })
	}),
	getValidatedSearchState: (loanSearchState, allFacets) => ({
		activityId: loanSearchState?.activityId?.filter(a => allFacets?.activityIds?.includes(a)) ?? []
	}),
	getFilterFromQuery: (query, allFacets) => ({
		activityId: getIdsFromQueryParam(query.activity, allFacets?.activityNames, allFacets?.activityFacets) ?? []
	}),
	getQueryFromFilter: loanSearchState => ({
		...(loanSearchState.activityId?.length && { activity: loanSearchState.activityId.join() })
	}),
};
