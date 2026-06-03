import { inject, ref, unref } from 'vue';
import { useRouter } from 'vue-router';

import useTipMessage from '#src/composables/useTipMessage';
import logFormatter from '#src/util/logFormatter';
import {
	clearBasketDonation,
	hasOnlyOneDonation,
	isBasketEmpty,
	shouldReopenExpressCheckout,
} from '#src/util/thanksPage/thanksPageUtils';

/**
 * Owns the express checkout (Thanks page) modal flow: modal ref, modal-local
 * state and the three event handlers wired to the recommendation footer
 * (Support now / Checkout now) and the modal itself.
 *
 * Basket primitives stay in ThanksPage (`borrowerProfileExpMixin`) and are
 * passed in as parameters. The mixin remains the
 * single source of truth for `basketItems`, `isAdding`, `addToBasket`, and
 * `loadInitialBasketItems`.
 *
 * @param {object}   deps
 * @param {Function} deps.addToBasket             Mixin's add-to-basket method.
 * @param {Function} deps.loadInitialBasketItems  Mixin's refresh-basket method.
 * @param {object}   deps.basketItems             Computed/ref exposing the basket items.
 * @param {Function} [deps.onResetAdding]         Optional hook called from the
 *   modal close handler to reset the mixin's `isAdding` flag so the "Support
 *   now" CTA recovers if the user dismisses the modal before completing.
 */
export default function useExpressCheckoutModal({
	addToBasket,
	loadInitialBasketItems,
	basketItems,
	onResetAdding,
}) {
	const apollo = inject('apollo');
	const cookieStore = inject('cookieStore');
	const { $showTipMsg } = useTipMessage(apollo);
	const router = useRouter();

	const expressCheckoutModalRef = ref(null);
	const expressCheckoutLoan = ref(null);
	const isRedirecting = ref(false);

	async function handleAddRecommendedLoanToBasket(payload) {
		// Decide between the three express-checkout sub-flows based on the
		// current basket state: open the modal, re-open it (Checkout now
		// re-entry), or redirect to /basket for the full checkout.
		await loadInitialBasketItems();
		let items = unref(basketItems) ?? [];

		// Clear an auto-added tip donation when it's the only thing in the
		// basket so the express checkout total reflects only the recommended
		// loan. Abort on failure to avoid charging an unexpected total.
		if (hasOnlyOneDonation(items)) {
			try {
				await clearBasketDonation({
					apollo,
					basketId: cookieStore.get('kvbskt'),
					donation: items[0],
				});
				await loadInitialBasketItems();
				items = unref(basketItems) ?? [];
			} catch (error) {
				$showTipMsg(
					'Something went wrong. Please, refresh the page and try again.',
					'error',
				);
				logFormatter(error, 'error');
				return;
			}
		}

		// Re-entry via "Checkout now": the recommended loan is already in
		// the basket — reopen the modal without re-adding it.
		if (shouldReopenExpressCheckout(items, payload)) {
			// TODO(MP-2747): track 'reopen-from-checkout-now' event
			expressCheckoutLoan.value = payload.loan ?? null;
			expressCheckoutModalRef.value?.openLightbox();
			return;
		}

		const empty = isBasketEmpty(items);
		if (!empty) {
			isRedirecting.value = true;
		}

		const previousOnError = payload.onError;
		addToBasket({
			...payload,
			onSuccess: () => {
				if (empty) {
					// TODO(MP-2747): track 'open-modal' event (empty-basket path)
					expressCheckoutLoan.value = payload.loan ?? null;
					expressCheckoutModalRef.value?.openLightbox();
				} else {
					// TODO(MP-2747): track 'redirect-to-basket' event (non-empty-basket path)
					router.push('/basket');
				}
			},
			onError: () => {
				// TODO(MP-2747): track 'add-to-basket-failed' event
				isRedirecting.value = false;
				previousOnError?.();
			},
		});
	}

	function handleExpressCheckoutComplete({ transactionId }) {
		if (!transactionId) return;
		router.push(`/thanks?kiva_transaction_id=${transactionId}`);
	}

	function handleExpressCheckoutClose() {
		onResetAdding?.();
	}

	return {
		expressCheckoutModalRef,
		expressCheckoutLoan,
		isRedirecting,
		handleAddRecommendedLoanToBasket,
		handleExpressCheckoutComplete,
		handleExpressCheckoutClose,
	};
}
