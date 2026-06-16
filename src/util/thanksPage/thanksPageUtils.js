import updateDonation from '#src/graphql/mutation/updateDonation.graphql';

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
