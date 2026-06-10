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

const EVENT_CATEGORY = 'post-checkout';

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
 * @param {object}   [deps.isExpressCheckoutEnabled] Ref/computed boolean from the
 *   `enable_ty_page_express_checkout` UI config flag. When false, the handler
 *   skips the modal flow entirely and sends the user to /basket — preserving
 *   the original recommendation behaviour while the feature is rolled out.
 * @param {Function} [deps.kvTrackEvent]          Analytics helper (`$kvTrackEvent`).
 *   Optional — when omitted, tracking calls are silently skipped.
 */
export default function useExpressCheckoutModal({
	addToBasket,
	loadInitialBasketItems,
	basketItems,
	onResetAdding,
	isExpressCheckoutEnabled,
	kvTrackEvent,
}) {
	const apollo = inject('apollo');
	const cookieStore = inject('cookieStore');
	const { $showTipMsg } = useTipMessage(apollo);
	const router = useRouter();

	const expressCheckoutModalRef = ref(null);
	const expressCheckoutLoan = ref(null);
	const isRedirecting = ref(false);

	async function handleAddRecommendedLoanToBasket(payload) {
		// Feature flag off → skip the modal flow entirely. Add the recommended
		// loan to the basket and redirect to /basket, matching the pre-express
		// behaviour. No donation cleanup, no re-entry detection, no modal.
		if (!unref(isExpressCheckoutEnabled)) {
			isRedirecting.value = true;
			const previousOnError = payload.onError;
			addToBasket({
				...payload,
				onSuccess: () => router.push('/basket'),
				onError: () => {
					isRedirecting.value = false;
					previousOnError?.();
				},
			});
			return;
		}

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
				items = [];
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
			kvTrackEvent?.(EVENT_CATEGORY, 'open', 'open-express-checkout');
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
					kvTrackEvent?.(EVENT_CATEGORY, 'open', 'open-express-checkout');
					expressCheckoutLoan.value = payload.loan ?? null;
					expressCheckoutModalRef.value?.openLightbox();
				} else {
					router.push('/basket');
				}
			},
			onError: () => {
				isRedirecting.value = false;
				previousOnError?.();
			},
		});
	}

	function handleExpressCheckoutComplete({ transactionId }) {
		if (!transactionId) return;
		router.push(`/checkout/thanks?kiva_transaction_id=${transactionId}`);
	}

	function handleExpressCheckoutClose() {
		kvTrackEvent?.(EVENT_CATEGORY, 'close', 'close-express-checkout');
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
