import { basketTotalsQuery } from '@kiva/kv-shop';
import updateDonation from '#src/graphql/mutation/updateDonation.graphql';
import removeCreditByType from '#src/graphql/mutation/shopRemoveCreditByType.graphql';

const DONATION_TYPENAME = 'Donation';

// eslint-disable-next-line no-underscore-dangle
const isDonation = item => item?.__typename === DONATION_TYPENAME;

/**
 * True when the basket has no items.
 */
export const isBasketEmpty = (items = []) => (items?.length ?? 0) === 0;

/**
 * True when the basket contains exactly one item and that item is a donation
 * (e.g. an auto-added tip). Used to gate the updateDonation cleanup so the
 * express checkout total only reflects the recommended loan.
 */
export const hasOnlyOneDonation = (items = []) => (
	items.length === 1 && isDonation(items[0])
);

/**
 * Returns a copy of the items list without donations. Used as a local filter
 * to evaluate basket state without mutating the server-side basket.
 */
export const filterOutDonations = (items = []) => (
	(items ?? []).filter(item => !isDonation(item))
);

/**
 * Clears a donation from the basket by setting its price to 0. Throws if the
 * mutation returns GraphQL errors so the caller can abort the flow and show
 * a tip message instead of charging the user an unexpected total.
 */
export async function clearBasketDonation({ apollo, basketId, donation }) {
	const { errors } = await apollo.mutate({
		mutation: updateDonation,
		variables: {
			price: '0.00',
			isTip: donation?.isTip ?? true,
			basketId,
		},
	});
	if (errors?.length) {
		throw new Error(errors[0]?.message ?? 'Failed to clear donation');
	}
}

/**
 * True when the user is re-entering the express checkout flow via "Checkout
 * now" (the recommended loan is already in the basket) and after filtering
 * donations only that single loan remains. In that case we should re-open
 * the modal directly without re-adding the loan to the basket.
 */
export const shouldReopenExpressCheckout = (items = [], payload = {}) => (
	!!payload?.recommendLoanIsInBasket && filterOutDonations(items).length === 1
);

/**
 * Removes an applied credit from the basket (e.g. a redemption code promotion
 * or a bonus credit) and then forces a fresh fetch of the basket totals so
 * any active `watchBasketTotals` subscription emits the updated values.
 *
 * Mirrors the `OrderTotals` → `CheckoutPage.refreshTotals` pattern: the
 * mutation alone does not return totals, so the cache must be invalidated by
 * a `network-only` re-fetch of the watched query.
 *
 * Throws if either the mutation or the refetch returns GraphQL errors so the
 * caller can surface a tip message.
 */
export async function removeBasketCredit({ apollo, basketId, creditType }) {
	const { errors } = await apollo.mutate({
		mutation: removeCreditByType,
		variables: { creditType, basketId },
	});
	if (errors?.length) {
		throw new Error(errors[0]?.message ?? `Failed to remove ${creditType}`);
	}
	await apollo.query({
		query: basketTotalsQuery,
		variables: { basketId },
		fetchPolicy: 'network-only',
	});
}
