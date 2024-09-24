import pageOffset from '#src/util/loanSearch/filters/pageOffset';
import pageLimit from '#src/util/loanSearch/filters/pageLimit';
import genders from '#src/util/loanSearch/filters/genders';
import isIndividual from '#src/util/loanSearch/filters/isIndividual';
import keywordSearch from '#src/util/loanSearch/filters/keywordSearch';
import sortOptions from '#src/util/loanSearch/filters/sortOptions';
import regions from '#src/util/loanSearch/filters/regions';
import sectors from '#src/util/loanSearch/filters/sectors';
import themes from '#src/util/loanSearch/filters/themes';
import tags from '#src/util/loanSearch/filters/tags';
import lenderRepaymentTerms from '#src/util/loanSearch/filters/lenderRepaymentTerms';
import distributionModels from '#src/util/loanSearch/filters/distributionModels';
import partners from '#src/util/loanSearch/filters/partners';
import partnerRiskRating from '#src/util/loanSearch/filters/partnerRiskRating';
import partnerDefaultRate from '#src/util/loanSearch/filters/partnerDefaultRate';
import partnerAvgProfitability from '#src/util/loanSearch/filters/partnerAvgProfitability';
import activities from '#src/util/loanSearch/filters/activities';
import isMatchable from '#src/util/loanSearch/filters/isMatchable';
import flexibleFundraisingEnabled from '#src/util/loanSearch/filters/flexibleFundraisingEnabled';

/**
 * Configuration for the lend/filter FLSS-driven page
 *
 * The order of the filters in the UI will match the order of these properties
 *
 * Here is the general structure of a filter definition:
 *
 * 	uiConfig: {
 * 		type: undefined,
 * 		hasAccordion: undefined,
 * 		topLine: false,
 * 		bottomLine: false,
 * 		title: undefined,
 * 		itemHeaderKey: undefined,
 * 		placeholder: undefined,
 * 		facetsKey: undefined,
 * 		stateKey: undefined,
 * 		eventAction: undefined,
 * 		allOptionsTitle: undefined,
 * 		valueMap: undefined,
 * 		isPercentage: false,
 * 		displayedUnit: undefined,
 * 	},
 * 	getOptions: (allFacets, filteredFacets, extend) => ([]),
 * 	showSavedSearch: loanSearchState => (false),
 * 	getFilterChips: (loanSearchState, allFacets) => ([]),
 * 	getRemovedFacet: (loanSearchState, facet) => ({}),
 * 	getSavedSearch: (loanSearchState, allFacets) => ({}),
 * 	getFlssFilter: loanSearchState => ({}),
 * 	getValidatedSearchState: (loanSearchState, allFacets, queryType) => ({}),
 * 	getFilterFromQuery: (query, allFacets, pageLimit, queryType) => ({}),
 * 	getQueryFromFilter: (loanSearchState, queryType) => ({}),
 */
const config = {
	pageOffset,
	pageLimit,
	genders,
	isIndividual,
	keywordSearch,
	sortOptions,
	regions,
	sectors,
	themes,
	tags,
	lenderRepaymentTerms,
	distributionModels,
	partners,
	partnerRiskRating,
	partnerDefaultRate,
	partnerAvgProfitability,
	activities,
	isMatchable,
	flexibleFundraisingEnabled,
};

/**
 * The keys of the lend filter configuration object
 */
const keys = Object.keys(config);

export default {
	config,
	keys,
};
