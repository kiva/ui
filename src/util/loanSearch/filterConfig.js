import pageOffset from '@/util/loanSearch/filters/pageOffset';
import pageLimit from '@/util/loanSearch/filters/pageLimit';
import genders from '@/util/loanSearch/filters/genders';
import isIndividual from '@/util/loanSearch/filters/isIndividual';
import keywordSearch from '@/util/loanSearch/filters/keywordSearch';
import sortOptions from '@/util/loanSearch/filters/sortOptions';
import regions from '@/util/loanSearch/filters/regions';
import sectors from '@/util/loanSearch/filters/sectors';
import themes from '@/util/loanSearch/filters/themes';
import tags from '@/util/loanSearch/filters/tags';
import lenderRepaymentTerms from '@/util/loanSearch/filters/lenderRepaymentTerms';
import distributionModels from '@/util/loanSearch/filters/distributionModels';
import partners from '@/util/loanSearch/filters/partners';
import partnerRiskRating from '@/util/loanSearch/filters/partnerRiskRating';
import partnerDefaultRate from '@/util/loanSearch/filters/partnerDefaultRate';
import partnerAvgProfitability from '@/util/loanSearch/filters/partnerAvgProfitability';
import activities from '@/util/loanSearch/filters/activities';
import isMatchable from '@/util/loanSearch/filters/isMatchable';

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
};

/**
 * The keys of the lend filter configuration object
 */
const keys = Object.keys(config);

export default {
	config,
	keys,
};
