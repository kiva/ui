import { filterUiType, STANDARD_QUERY_TYPE, FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';

/**
 * Used to map the sort value to display value
 */
export const sortByNameToDisplay = {
	// Shared
	expiringSoon: 'Ending soon',
	amountLeft: 'Amount left',
	repaymentTerm: 'Loan length',
	// Standard (lend)
	loanAmount: 'Amount: Low to High',
	loanAmountDesc: 'Amount: High to Low',
	newest: 'Most recent',
	popularity: 'Trending now',
	random: 'Random',
	// FLSS specific
	amountHighToLow: 'Amount: High to Low',
	amountLowToHigh: 'Amount: Low to High',
	personalized: 'Recommended',
	popularityScore: 'Trending now'
};

/**
 * Map used to convert lend <> FLSS sort option values
 */
const lendToFlssSort = new Map([
	['expiringSoon', 'expiringSoon'],
	['popularity', 'popularityScore'],
	['personalized', 'personalized'],
	['loanAmountDesc', 'amountHighToLow'],
	['loanAmount', 'amountLowToHigh'],
	['amountLeft', 'amountLeft'],
	['repaymentTerm', 'repaymentTerm']
]);

export const visibleFLSSSortOptions = [
	'expiringSoon',
	'amountHighToLow',
	'amountLowToHigh',
	'personalized',
];

const experimentVisibleFLSSSortOptions = [
	'expiringSoon',
	'amountHighToLow',
	'amountLowToHigh',
	'personalized',
	'amountLeft',
	'popularityScore',
	'repaymentTerm',
];

/**
 * Categorizes Sort Options
 *
 * @param {Array<Object>} standardSorts Sort options from the lend API
 * @param {Array<Object>} flssSorts Sort options from the FLSS API
 * @param {boolean} extendFlssFilters Flag for FLSS experiment
 * @returns New formatted array
 */
export function formatSortOptions(standardSorts, flssSorts, extendFlssFilters) {
	const labeledStandardSorts = standardSorts?.map(sort => {
		return {
			name: sort.name,
			sortSrc: STANDARD_QUERY_TYPE,
		};
	}) ?? [];
	const labeledFlssSorts = flssSorts?.reduce((prev, current) => {
		const visibleOptions = extendFlssFilters ? experimentVisibleFLSSSortOptions : visibleFLSSSortOptions;
		if (visibleOptions.includes(current.name)) {
			prev.push({ name: current.name, sortSrc: FLSS_QUERY_TYPE });
		}

		return prev;
	}, []) ?? [];
	return [...labeledStandardSorts, ...labeledFlssSorts];
}

export default {
	uiConfig: {
		type: filterUiType.sortBy,
		hasAccordion: true,
		topLine: true,
		bottomLine: false,
		title: 'Sort order',
		itemHeaderKey: undefined,
		placeholder: undefined,
		facetsKey: 'sortOptions',
		stateKey: 'sortBy',
		eventAction: undefined,
		allOptionsTitle: undefined,
		valueMap: undefined,
		isPercentage: false,
		displayedUnit: undefined,
	},
	getOptions: (allFacets = {}, _filteredFacets, extend = false) => {
		return formatSortOptions(allFacets.standardSorts ?? [], allFacets.flssSorts ?? [], extend);
	},
	showSavedSearch: () => false,
	getFilterChips: () => ([]),
	getRemovedFacet: () => ({}),
	getSavedSearch: () => {},
	getFlssFilter: () => ({}),
	getValidatedSearchState: (loanSearchState, allFacets, queryType) => {
		const validSorts = queryType === FLSS_QUERY_TYPE ? allFacets.flssSorts : allFacets.standardSorts;
		return {
			sortBy: validSorts.some(s => s.name === loanSearchState.sortBy) ? loanSearchState.sortBy : null
		};
	},
	getFilterFromQuery: (query, _allFacets, _pageLimit, queryType) => ({
		sortBy: (queryType === FLSS_QUERY_TYPE ? lendToFlssSort.get(query.sortBy) : query.sortBy) ?? null
	}),
	getQueryFromFilter: (loanSearchState, queryType) => {
		// The query param uses the standard sort values, so map from FLSS as needed
		const queryParamSortBy = queryType === FLSS_QUERY_TYPE
			// eslint-disable-next-line no-unused-vars
			? [...lendToFlssSort].find(([_, value]) => value === loanSearchState.sortBy)?.[0]
			: loanSearchState.sortBy;

		return { ...(queryParamSortBy && { sortBy: queryParamSortBy }) };
	},
};
