import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import borrowerMessagesQuery from '#src/graphql/query/portfolio/borrowerMessages.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import useApolloQuery from '#src/composables/useApolloQuery';

export const BORROWER_MESSAGES_PAGE_LIMIT = 10;

/**
 * The 1-based page number from the route's page query, falling back to 1 when it is missing or invalid.
 *
 * @param {object} route - Vue Router route
 * @returns {number}
 */
export const getPageNumber = route => {
	const page = parseInt(route?.query?.page, 10);
	return Number.isInteger(page) && page > 0 ? page : 1;
};

const getVariables = route => ({
	limit: BORROWER_MESSAGES_PAGE_LIMIT,
	offset: (getPageNumber(route) - 1) * BORROWER_MESSAGES_PAGE_LIMIT,
});

const operation = {
	query: borrowerMessagesQuery,
	preFetchVariables: ({ route }) => getVariables(route),
};

export const preFetchOperations = [operation];

/**
 * One page of the lender's borrower messages, paged by the route's page query.
 *
 * @returns {{
 *   updates: import('vue').ComputedRef<object[]>,
 *   totalCount: import('vue').ComputedRef<number|undefined>,
 *   limit: number,
 *   offset: import('vue').ComputedRef<number>,
 *   loading: import('vue').ComputedRef<boolean>,
 *   error: import('vue').Ref<Error|object[]|null>,
 * }}
 */
export default function useBorrowerMessages() {
	const route = useRoute();
	const variables = computed(() => getVariables(route));
	const { result, loading, error } = useApolloQuery(operation, () => variables.value);

	watch(error, e => {
		if (e) {
			logReadQueryError(e, 'useBorrowerMessages borrowerMessages');
		}
	});

	// useApolloQuery keeps the previous page's result until the new page arrives
	const resultOffset = ref(null);
	watch(result, value => {
		if (value) {
			resultOffset.value = variables.value.offset;
		}
	}, { immediate: true });

	return {
		updates: computed(() => result.value?.my?.updates?.values ?? []),
		totalCount: computed(() => result.value?.my?.updates?.totalCount),
		limit: BORROWER_MESSAGES_PAGE_LIMIT,
		offset: computed(() => variables.value.offset),
		loading: computed(() => !error.value && (loading.value || resultOffset.value !== variables.value.offset)),
		error,
	};
}
