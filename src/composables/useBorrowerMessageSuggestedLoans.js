import { inject, onMounted, ref } from 'vue';
import { gql } from 'graphql-tag';
import { KV_COMPACT_LOAN_CARD_FRAGMENT, KV_COMPACT_LOAN_CARD_USER_FRAGMENT } from '@kiva/kv-components';
import { FLSS_ORIGIN_BORROWER_MESSAGE } from '#src/util/flssUtils';
import logReadQueryError from '#src/util/logReadQueryError';

export const BORROWER_MESSAGE_JOURNALING_PARTNER_IDS = [80, 319];

export const partnerLoansQuery = gql`
	${KV_COMPACT_LOAN_CARD_FRAGMENT}
	${KV_COMPACT_LOAN_CARD_USER_FRAGMENT}
	query borrowerMessagePartnerLoans($partnerIds: [Int!]!, $origin: String) {
		fundraisingLoans(
			limit: 3,
			sortBy: personalized,
			origin: $origin,
			filters: [{ partnerId: { any: $partnerIds } }]
		) {
			values {
				id
				...KvCompactLoanCard
				...KvCompactLoanCardUser
			}
		}
	}
`;

export const fallbackLoansQuery = gql`
	${KV_COMPACT_LOAN_CARD_FRAGMENT}
	${KV_COMPACT_LOAN_CARD_USER_FRAGMENT}
	query borrowerMessageFallbackLoans($origin: String) {
		fundraisingLoans(limit: 3, sortBy: personalized, origin: $origin) {
			values {
				id
				...KvCompactLoanCard
				...KvCompactLoanCardUser
			}
		}
	}
`;

/**
 * Fundraising loans to suggest for borrower messages: loans from the given partners, or personalized loans when the
 * partners have none. Loaded in the browser on mount, so the server render never waits on the loan search.
 *
 * @param {number[]} partnerIds - Lending partner ids to suggest loans from
 * @returns {{
 *   loans: import('vue').Ref<object[]|null>,
 *   isFallback: import('vue').Ref<boolean>,
 * }}
 */
export default function useBorrowerMessageSuggestedLoans(partnerIds) {
	const apollo = inject('apollo');
	const loans = ref(null);
	const isFallback = ref(false);

	const fetchLoans = (query, operationName, variables) => apollo.query({
		query,
		variables: { ...variables, origin: FLSS_ORIGIN_BORROWER_MESSAGE },
	})
		.then(({ data }) => (data?.fundraisingLoans?.values ?? []).filter(Boolean))
		.catch(e => {
			logReadQueryError(e, `useBorrowerMessageSuggestedLoans ${operationName}`);
			return [];
		});

	onMounted(async () => {
		const partnerLoans = partnerIds.length
			? await fetchLoans(partnerLoansQuery, 'borrowerMessagePartnerLoans', { partnerIds })
			: [];
		if (partnerLoans.length) {
			loans.value = partnerLoans;
			return;
		}
		const fallbackLoans = await fetchLoans(fallbackLoansQuery, 'borrowerMessageFallbackLoans', {});
		isFallback.value = true;
		loans.value = fallbackLoans;
	});

	return { loans, isFallback };
}
