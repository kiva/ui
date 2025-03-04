import loanFacetsQuery from '#src/graphql/query/loanFacetsQuery.graphql';
import loanEnumsQuery from '#src/graphql/query/loanEnumsQuery.graphql';
import {
	fetchFacets,
	fetchLoans,
	fetchRecommendedLoans,
	getFlssFilters,
	FLSS_ORIGIN_NOT_SPECIFIED,
} from '#src/util/flssUtils';
import logReadQueryError from '#src/util/logReadQueryError';

/**
 * Runs the query to get the filter facets
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Object} loanSearchState The current loan search state from Apollo
 * @param {String} origin Origin of query formatted as web:##page-context##
 * @returns {Object} The filter facets
 */
export async function runFacetsQueries(apollo, loanSearchState = {}, origin = FLSS_ORIGIN_NOT_SPECIFIED) {
	const isoCodeFilters = { ...getFlssFilters(loanSearchState), countryIsoCode: undefined };
	const themeFilters = { ...getFlssFilters(loanSearchState), themeId: undefined };
	const sectorFilters = { ...getFlssFilters(loanSearchState), sectorId: undefined };
	const tagFilters = { ...getFlssFilters(loanSearchState), tagId: undefined };

	const facets = await fetchFacets(apollo, origin, isoCodeFilters, themeFilters, sectorFilters, tagFilters);

	return {
		isoCodes: facets?.isoCodes?.facets?.isoCode ?? [],
		themes: facets?.themes?.facets?.themes ?? [],
		sectors: facets?.sectors?.facets?.sectorId ?? [],
		tags: facets?.tags?.facets?.tagsIds ?? [],
	};
}

/**
 *	Runs the FLSS loan query
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Object} loanSearchState The current loan search state from Apollo
 * @param {String} origin Origin of query formatted as web:##page-context##
 * @returns {Object} The results of the loan query
 */
export async function runLoansQuery(apollo, loanSearchState, origin) {
	const flssData = await fetchLoans(
		apollo,
		getFlssFilters(loanSearchState),
		loanSearchState?.sortBy,
		loanSearchState?.pageOffset,
		loanSearchState?.pageLimit,
		origin,
	);

	return { loans: flssData?.values?.filter(loan => loan !== null) ?? [], totalCount: flssData?.totalCount ?? 0 };
}

/**
 * Runs the query to get recommended loans
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Object} options Query options including userId and origin
 * @param {Number} options.userId The user ID to get recommendations for (optional)
 * @param {String} options.origin Origin of query formatted as web:##page-context##
 * @param {Object} options.filterObject Optional filters to apply to recommendations
 * @param {String} options.sortBy Sort option for recommendations (defaults to 'personalized')
 * @param {Number} options.limit Limit the number of recommendations (optional)
 * @returns {Object} The results of the recommendations query
 */
export async function runRecommendationsQuery(apollo, {
	userId = null,
	origin = FLSS_ORIGIN_NOT_SPECIFIED,
	filterObject = null,
	sortBy = 'personalized',
	limit = null
} = {}) {
	const flssData = await fetchRecommendedLoans(
		apollo,
		origin,
		filterObject,
		sortBy,
		userId,
		limit
	);

	return { loans: flssData?.values?.filter(loan => loan !== null) ?? [], totalCount: flssData?.totalCount ?? 0 };
}

/**
 * Fetches the facets data for the lend and FLSS APIs
 *
 * @param {Object} apollo The apollo client instance
 * @returns {Promise<Array<Object>>} Promise for facets data
 */
export async function fetchLoanFacets(apollo) {
	try {
		const [resultFacets, resultEnums] = await Promise.all([
			apollo.query({ query: loanFacetsQuery, fetchPolicy: 'network-only' }),
			apollo.query({ query: loanEnumsQuery, fetchPolicy: 'network-only' })
		]);

		const countryFacets = resultFacets.data?.lend?.countryFacets ?? [];
		const sectorFacets = resultFacets.data?.lend?.sector ?? [];
		const themeFacets = resultFacets.data?.lend?.loanThemeFilter ?? [];
		const tagFacets = resultFacets.data?.lend?.tag ?? [];
		const genderFacets = resultEnums.data?.genderOptions?.enumValues ?? [];
		const distributionModelFacets = resultEnums.data?.distributionModelOptions?.enumValues ?? [];
		const partnerFacets = resultFacets.data?.general?.partners?.values ?? [];
		const activityFacets = resultFacets.data?.lend?.activity ?? [];

		return {
			countryFacets,
			countryIsoCodes: countryFacets.map(c => c.country.isoCode.toUpperCase()),
			countryNames: countryFacets.map(c => c.country.name.toUpperCase()),
			sectorFacets,
			sectorIds: sectorFacets.map(s => s.id),
			sectorNames: sectorFacets.map(s => s.name.toUpperCase()),
			themeFacets,
			themeIds: themeFacets.map(t => t.id),
			themeNames: themeFacets.map(t => t.name.toUpperCase()),
			tagFacets,
			tagIds: tagFacets.map(t => t.id),
			tagNames: tagFacets.map(t => t.name.toUpperCase()),
			genderFacets,
			genders: genderFacets.map(g => g.name.toUpperCase()),
			flssSorts: resultEnums.data?.flssSorts?.enumValues ?? [],
			standardSorts: resultEnums.data?.standardSorts?.enumValues ?? [],
			distributionModelFacets,
			distributionModels: distributionModelFacets.map(d => d.name.toUpperCase()),
			partnerFacets,
			partnerIds: partnerFacets.map(p => p.id),
			partnerNames: partnerFacets.map(p => p.name.toUpperCase()),
			activityFacets,
			activityIds: activityFacets.map(a => a.id),
			activityNames: activityFacets.map(a => a.name.toUpperCase()),
		};
	} catch (e) {
		logReadQueryError(e, 'dataUtils loanFacetsQuery');
	}
}
