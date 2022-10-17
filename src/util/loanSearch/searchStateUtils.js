import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';
import createSavedSearchMutation from '@/graphql/mutation/createSavedSearch.graphql';
import { getDefaultLoanSearchState } from '@/api/localResolvers/loanSearch';
import { isNumber } from '@/util/numberUtils';
import {
	FLSS_QUERY_TYPE,
	getFilterKeyFromValue,
	lenderRepaymentTermValueMap,
} from '@/util/loanSearch/filterUtils';

/**
 * Returns loan search state that has been validated against the available facets
 *
 * @param {Object} loanSearchState The current loan search state from Apollo cache
 * @param {Object} allFacets All available facets from the APIs
 * @param {string} queryType The current query type (lend vs FLSS)
 * @returns {Object} Validated search state, including default enum null values expected by GraphQL
 */
export function getValidatedSearchState(loanSearchState, allFacets, queryType) {
	const validSorts = queryType === FLSS_QUERY_TYPE ? allFacets.flssSorts : allFacets.standardSorts;

	const defaultLoanSearchState = getDefaultLoanSearchState();

	const validatedGender = allFacets.genders.includes(loanSearchState?.gender?.toUpperCase())
		? loanSearchState.gender : null;

	const validatedIsoCodes = loanSearchState?.countryIsoCode
		?.filter(c => allFacets.countryIsoCodes.includes(c.toUpperCase())) ?? [];

	const validatedSectorIds = loanSearchState?.sectorId?.filter(s => allFacets.sectorIds.includes(s)) ?? [];

	const validatedSortBy = validSorts.some(s => s.name === loanSearchState.sortBy) ? loanSearchState.sortBy : null;

	const validatedThemeIds = loanSearchState?.themeId?.filter(t => allFacets.themeIds.includes(t)) ?? [];

	const validatedTagIds = loanSearchState?.tagId?.filter(t => allFacets.tagIds.includes(t)) ?? [];

	const validatedPageOffset = isNumber(loanSearchState?.pageOffset)
		? loanSearchState.pageOffset
		: defaultLoanSearchState.pageOffset;

	const validatedPageLimit = isNumber(loanSearchState?.pageLimit)
		? loanSearchState.pageLimit
		: defaultLoanSearchState.pageLimit;

	const validatedDistributionModel = allFacets.distributionModels
		.includes(loanSearchState?.distributionModel?.toUpperCase())
		? loanSearchState.distributionModel
		: null;

	const validatedIsIndividual = typeof loanSearchState?.isIndividual === 'boolean'
		? loanSearchState?.isIndividual
		: null;

	const validatedLenderRepaymentTerm = getFilterKeyFromValue(
		loanSearchState?.lenderRepaymentTerm,
		lenderRepaymentTermValueMap
	)
		? { ...loanSearchState.lenderRepaymentTerm }
		: null;

	return {
		gender: validatedGender,
		countryIsoCode: validatedIsoCodes,
		sectorId: validatedSectorIds,
		sortBy: validatedSortBy,
		themeId: validatedThemeIds,
		tagId: validatedTagIds,
		pageOffset: validatedPageOffset,
		pageLimit: validatedPageLimit,
		distributionModel: validatedDistributionModel,
		isIndividual: validatedIsIndividual,
		lenderRepaymentTerm: validatedLenderRepaymentTerm,
	};
}

/**
 * Updates the search state using the provided apollo client and filters
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Object} loanQueryFilters The filters for the loan query
 * @param {Object} allFacets All available facets from the APIs
 * @param {string} queryType The current query type (lend vs FLSS)
 * @param {Object} previousState The previous search state
 * @returns {Promise<Array>} Promise for the results of the mutation
 */
export async function updateSearchState(apollo, loanQueryFilters, allFacets, queryType, previousState) {
	const validatedPreviousFilters = getValidatedSearchState(previousState, allFacets, queryType);
	const validatedFilters = getValidatedSearchState(loanQueryFilters, allFacets, queryType);

	// Quick JSON compare works because both states are results of getValidatedSearchState
	if (JSON.stringify(validatedPreviousFilters) === JSON.stringify(validatedFilters)) return;

	return apollo.mutate({
		mutation: updateLoanSearchMutation,
		variables: {
			searchParams: {
				...validatedFilters
			}
		}
	});
}

/**
 * Creates a saved search with a name and set of filters
 * TODO: Move to own file if we move forward with Saved Search exp
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Object} loanQueryFilters The filters for the saved search
 * @param {string} savedSearchName The name of the saved search
 * @returns {Promise<Array>} Promise for the results of the mutation
 */
export async function createSavedSearch(apollo, loanQueryFilters, queryString, savedSearchName) {
	return apollo.mutate({
		mutation: createSavedSearchMutation,
		variables: {
			name: savedSearchName,
			queryString,
			filters: loanQueryFilters
		}
	});
}
