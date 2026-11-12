import { computed, watch } from 'vue';
import impactStatsQuery from '#src/graphql/query/portfolio/impactStats.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import { parseMoney } from '#src/util/numberUtils';
import { hasGivingFundActivity, sumCurrentAmountDonated } from '#src/util/givingFundUtils';
import useApolloQuery from '#src/composables/useApolloQuery';

const operation = { query: impactStatsQuery };

export const preFetchOperations = [operation];

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

	const availableToLend = computed(() => {
		const account = result.value?.my?.userAccount;
		return account ? parseMoney(account.balance) + parseMoney(account.promoBalance) : null;
	});

	const lentOut = computed(() => {
		const stats = result.value?.my?.userStats;
		return stats ? parseMoney(stats.amount_outstanding) : null;
	});

	const givingFundDeposits = computed(() => {
		const participation = result.value?.my?.givingFundParticipation;
		return participation ? parseMoney(participation.totalAmount) : null;
	});

	const fundraisersRaised = computed(() => {
		const funds = result.value?.my?.givingFunds;
		return funds ? sumCurrentAmountDonated(funds.values) : null;
	});

	const ownsGivingFunds = computed(() => (result.value?.my?.givingFunds?.totalCount ?? 0) > 0);

	const showGivingFund = computed(() => hasGivingFundActivity(result.value?.my));

	return {
		firstName,
		availableToLend,
		lentOut,
		givingFundDeposits,
		fundraisersRaised,
		ownsGivingFunds,
		showGivingFund,
		loading,
		error,
	};
}
