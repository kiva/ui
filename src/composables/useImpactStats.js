import { computed, watch } from 'vue';
import impactStatsQuery from '#src/graphql/query/portfolio/impactStats.graphql';
import impactStatsGivingFundsQuery from '#src/graphql/query/portfolio/impactStatsGivingFunds.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import { parseMoney } from '#src/util/numberUtils';
import { hasGivingFundActivity, sumCurrentAmountDonated } from '#src/util/givingFundUtils';
import useApolloQuery from '#src/composables/useApolloQuery';
import useCountryReach from '#src/composables/useCountryReach';

const operation = { query: impactStatsQuery };

// Both queries cache their data under `my`, and the giving fund fields are non-null, so a failure there
// nulls `my`. Refusing to cache an errored result keeps that null from overwriting the main query's data.
const givingFundOperation = {
	query: impactStatsGivingFundsQuery,
	fetchPolicy: 'cache-only',
	preFetch: (config, client) => client.query({
		query: config.query,
		fetchPolicy: 'network-only',
		errorPolicy: 'none',
	}).catch(e => logReadQueryError(e, 'useImpactStats impactStatsGivingFunds')),
};

export const preFetchOperations = [operation, givingFundOperation];

/**
 * The logged-in lender's data for the impact stats page.
 *
 * @returns {{
 *   firstName: import('vue').ComputedRef<string>,
 *   availableToLend: import('vue').ComputedRef<number|null>,
 *   lentOut: import('vue').ComputedRef<number|null>,
 *   givingFundDeposits: import('vue').ComputedRef<number|null>,
 *   fundraisersRaised: import('vue').ComputedRef<number|null>,
 *   ownsGivingFunds: import('vue').ComputedRef<boolean>,
 *   showGivingFund: import('vue').ComputedRef<boolean>,
 *   livesTouched: import('vue').ComputedRef<number|null>,
 *   countriesLentTo: import('vue').ComputedRef<number|null>,
 *   countriesAvailable: import('vue').ComputedRef<number|null>,
 *   donations: import('vue').ComputedRef<number|null>,
 *   totalImpact: import('vue').ComputedRef<number|null>,
 *   loading: import('vue').Ref<boolean>,
 *   givingFundLoading: import('vue').Ref<boolean>,
 *   error: import('vue').Ref<Error|object[]|null>,
 * }}
 */
export default function useImpactStats() {
	const { result, loading, error } = useApolloQuery(operation);
	const { result: givingFundResult, loading: givingFundLoading } = useApolloQuery(givingFundOperation);

	watch(error, e => {
		if (e) {
			logReadQueryError(e, 'useImpactStats impactStats');
		}
	});

	const firstName = computed(() => result.value?.my?.userAccount?.firstName?.trim() ?? '');

	const availableToLend = computed(() => {
		const account = result.value?.my?.userAccount;
		if (account?.balance === null || account?.balance === undefined) {
			return null;
		}
		return parseMoney(account.balance) + parseMoney(account.promoBalance);
	});

	const lentOut = computed(() => {
		const stats = result.value?.my?.userStats;
		return stats ? parseMoney(stats.amount_outstanding) : null;
	});

	const livesTouched = computed(() => result.value?.my?.lendingStats?.lentTo?.borrowers?.totalCount ?? null);

	const countriesLentTo = computed(() => result.value?.my?.lendingStats?.lentTo?.countries?.totalCount ?? null);

	const { availableCountryCount: countriesAvailable } = useCountryReach(() => result.value);

	const donations = computed(() => {
		const stats = result.value?.my?.userStats;
		return stats ? parseMoney(stats.amount_donated) : null;
	});

	const totalImpact = computed(() => {
		const stats = result.value?.my?.userStats;
		return stats ? parseMoney(stats.amount_of_loans) : null;
	});

	const givingFundDeposits = computed(() => {
		const participation = givingFundResult.value?.my?.givingFundParticipation;
		return participation ? parseMoney(participation.totalAmount) : null;
	});

	const fundraisersRaised = computed(() => {
		const values = givingFundResult.value?.my?.givingFunds?.values;
		return values ? sumCurrentAmountDonated(values) : null;
	});

	const ownsGivingFunds = computed(() => (givingFundResult.value?.my?.givingFunds?.totalCount ?? 0) > 0);

	const showGivingFund = computed(() => hasGivingFundActivity(givingFundResult.value?.my));

	return {
		firstName,
		availableToLend,
		lentOut,
		givingFundDeposits,
		fundraisersRaised,
		ownsGivingFunds,
		showGivingFund,
		livesTouched,
		countriesLentTo,
		countriesAvailable,
		donations,
		totalImpact,
		loading,
		givingFundLoading,
		error,
	};
}
