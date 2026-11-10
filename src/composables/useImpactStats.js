import { computed, watch } from 'vue';
import impactStatsQuery from '#src/graphql/query/portfolio/impactStats.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import useApolloQuery from '#src/composables/useApolloQuery';

const operation = { query: impactStatsQuery };

export const preFetchOperations = [operation];

/**
 * The logged-in lender's data for the impact stats page.
 *
 * @returns {{
 *   firstName: import('vue').ComputedRef<string>,
 *   loading: import('vue').Ref<boolean>,
 *   error: import('vue').Ref<Error|object[]|null>,
 * }}
 */
export default function useImpactStats() {
	const { result, loading, error } = useApolloQuery(operation);

	watch(error, e => {
		if (e) {
			logReadQueryError(e, 'useImpactStats impactStats');
		}
	});

	const firstName = computed(() => result.value?.my?.userAccount?.firstName?.trim() ?? '');

	return { firstName, loading, error };
}
