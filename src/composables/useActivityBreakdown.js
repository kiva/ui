import { computed, watch } from 'vue';
import activityBreakdownQuery from '#src/graphql/query/portfolio/impactActivityBreakdown.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import { getBreakdownChartValues } from '#src/util/goalInReview';
import {
	filterExcluded, lentToItems, notLentToItems, readExcludedList,
} from '#src/util/impactBreakdown';
import useApolloQuery from '#src/composables/useApolloQuery';

const operation = { query: activityBreakdownQuery, lazy: true };

/**
 * The logged-in lender's loans by activity against the activities Kiva lends in, loaded when the calling component
 * nears the viewport.
 *
 * @returns {{
 *   lentTo: import('vue').ComputedRef<import('#src/util/impactBreakdown').LentToItem[]|null>,
 *   notLentTo: import('vue').ComputedRef<import('#src/util/impactBreakdown').BreakdownItem[]|null>,
 *   chartValues: import('vue').ComputedRef<Array<{ label: string, value: number }>|null>,
 *   lentCount: import('vue').ComputedRef<number|null>,
 *   totalCount: import('vue').ComputedRef<number|null>,
 *   loading: import('vue').Ref<boolean>,
 *   error: import('vue').ComputedRef<boolean>,
 * }}
 */
export default function useActivityBreakdown() {
	const { result, loading, error: queryError } = useApolloQuery(operation);

	watch(queryError, e => {
		if (e) {
			logReadQueryError(e, 'useActivityBreakdown impactActivityBreakdown');
		}
	});

	const stats = computed(() => result.value?.my?.statsPerActivity?.values ?? null);
	const activities = computed(() => result.value?.general?.kivaStats?.activities ?? null);
	const hasData = computed(() => stats.value !== null && activities.value !== null);

	const lentTo = computed(() => (hasData.value ? lentToItems(stats.value, 'activity') : null));

	const notLentTo = computed(() => {
		if (!hasData.value) return null;
		const excluded = readExcludedList(result.value, 'general.excluded_activities.value');
		const available = activities.value
			.filter(activity => activity?.name)
			.map(({ id, name }) => ({ id, name }));
		return notLentToItems(filterExcluded(available, excluded), lentTo.value);
	});

	const chartValues = computed(() => (hasData.value ? getBreakdownChartValues(stats.value, 'activity') : null));
	const lentCount = computed(() => lentTo.value?.length ?? null);
	const totalCount = computed(() => (hasData.value ? lentTo.value.length + notLentTo.value.length : null));

	const error = computed(() => !!queryError.value || (!loading.value && !hasData.value));

	return {
		lentTo,
		notLentTo,
		chartValues,
		lentCount,
		totalCount,
		loading,
		error,
	};
}
