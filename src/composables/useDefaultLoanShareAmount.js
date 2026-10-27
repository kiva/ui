import { computed, inject, watch } from 'vue';
import userPreferenceQuery from '#src/graphql/query/userPreference.graphql';
import { DEFAULT_LOAN_SHARE_AMOUNT_KEY, decodeDefaultLoanShareAmount } from '#src/util/defaultLoanShareAmount';
import logReadQueryError from '#src/util/logReadQueryError';
import useApolloQuery from '#src/composables/useApolloQuery';

const isLoggedIn = kvAuth0 => !!kvAuth0?.getKivaId();

const variables = { key: DEFAULT_LOAN_SHARE_AMOUNT_KEY };

const operation = {
	query: userPreferenceQuery,
	preFetchVariables: () => variables,
	shouldPreFetch: (_operation, { kvAuth0 }) => isLoggedIn(kvAuth0),
};

// Registered for prefetching by every component that imports this composable
export const preFetchOperations = [operation];

/**
 * The lender's staff-set default loan share amount. Every caller on a page shares
 * one cached request; visitors issue none.
 *
 * @returns {{ defaultLoanShareAmount: import('vue').ComputedRef<number|undefined> }}
 */
export default function useDefaultLoanShareAmount() {
	if (!isLoggedIn(inject('kvAuth0', null))) {
		return { defaultLoanShareAmount: computed(() => undefined) };
	}

	const { result, error } = useApolloQuery(operation, variables);
	watch(error, e => {
		if (e) {
			logReadQueryError(e, 'useDefaultLoanShareAmount UserPreference');
		}
	});

	const defaultLoanShareAmount = computed(() => decodeDefaultLoanShareAmount(result.value?.my?.userPreference));
	return { defaultLoanShareAmount };
}
