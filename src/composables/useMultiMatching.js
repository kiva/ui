import { computed } from 'vue';
import multiMatchingQuery from '#src/graphql/query/multiMatchingEnabled.graphql';
import { readBoolSetting } from '#src/util/settingsUtils';
import useApolloQuery from '#src/composables/useApolloQuery';

const operation = { query: multiMatchingQuery };

// Registered for prefetching by every component that imports this composable
export const preFetchOperations = [operation];

export default function useMultiMatching() {
	const { result, error } = useApolloQuery(operation);
	const enableMultiMatching = computed(
		() => readBoolSetting(result.value, 'general.multiMatchingEnabled.value') ?? false
	);
	const multiMatchingResolved = computed(() => result.value !== null || error.value !== null);
	return { enableMultiMatching, multiMatchingResolved };
}
