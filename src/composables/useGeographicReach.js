import { computed, watch } from 'vue';
import geographicReachQuery from '#src/graphql/query/portfolio/impactGeographicReach.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import { buildRegions, toMapCountries } from '#src/util/geographicReach';
import useApolloQuery from '#src/composables/useApolloQuery';
import useCountryReach from '#src/composables/useCountryReach';

const operation = { query: geographicReachQuery, lazy: true };

/**
 * The logged-in lender's countries, grouped by region, loaded when the calling component nears the viewport.
 *
 * @returns {{
 *   regions: import('vue').ComputedRef<import('#src/util/geographicReach').GeographicRegion[]|null>,
 *   mapCountries: import('vue').ComputedRef<Array<{ id: string, name: string, loanCount?: number }>|null>,
 *   loading: import('vue').Ref<boolean>,
 *   error: import('vue').ComputedRef<boolean>,
 * }}
 */
export default function useGeographicReach() {
	const { result, loading, error: queryError } = useApolloQuery(operation);

	watch(queryError, e => {
		if (e) {
			logReadQueryError(e, 'useGeographicReach impactGeographicReach');
		}
	});

	const { availableCountries } = useCountryReach(() => result.value);

	const regions = computed(() => {
		const stats = result.value?.my?.statsPerCountry?.values;
		if (!stats || !availableCountries.value) return null;
		return buildRegions(stats, availableCountries.value);
	});

	const mapCountries = computed(() => (regions.value ? toMapCountries(regions.value) : null));

	const error = computed(() => !!queryError.value || (!loading.value && regions.value === null));

	return {
		regions,
		mapCountries,
		loading,
		error,
	};
}
