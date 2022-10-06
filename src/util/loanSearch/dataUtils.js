import loanFacetsQuery from '@/graphql/query/loanFacetsQuery.graphql';
import { fetchFacets, fetchLoans, getFlssFilters } from '@/util/flssUtils';
import logReadQueryError from '@/util/logReadQueryError';

/**
 * Runs the query to get the filter facets
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Object} loanSearchState The current loan search state from Apollo
 * @param {String} origin Origin of query formatted as web:##page-context##
 * @returns {Object} The filter facets
 */
export async function runFacetsQueries(apollo, loanSearchState = {}, origin) {
	const isoCodeFilters = { ...getFlssFilters(loanSearchState), countryIsoCode: undefined };
	const themeFilters = { ...getFlssFilters(loanSearchState), themeId: undefined };
	const sectorFilters = { ...getFlssFilters(loanSearchState), sectorId: undefined };

	const facets = await fetchFacets(apollo, isoCodeFilters, themeFilters, sectorFilters, origin);

	return {
		isoCodes: facets?.isoCodes?.facets?.isoCode ?? [],
		themes: facets?.themes?.facets?.themes ?? [],
		sectors: facets?.sectors?.facets?.sectorId ?? [],
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

	return { loans: flssData?.values ?? [], totalCount: flssData?.totalCount ?? 0 };
}

/**
 * Fetches the facets data for the lend and FLSS APIs
 *
 * @param {Object} apollo The apollo client instance
 * @returns {Promise<Array<Object>>} Promise for facets data
 */
export async function fetchLoanFacets(apollo) {
	try {
		const result = await apollo.query({ query: loanFacetsQuery, fetchPolicy: 'network-only' });

		const countryFacets = result.data?.lend?.countryFacets ?? [];
		const sectorFacets = result.data?.lend?.sector ?? [];
		const themeFacets = result.data?.lend?.loanThemeFilter ?? [];
		const genderFacets = result.data?.genderOptions?.enumValues ?? [];

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
			genderFacets,
			genders: genderFacets.map(g => g.name.toUpperCase()),
			flssSorts: result.data?.flssSorts?.enumValues ?? [],
			standardSorts: result.data?.standardSorts?.enumValues ?? [],
		};
	} catch (e) {
		logReadQueryError(e, 'dataUtils loanFacetsQuery');
	}
}
