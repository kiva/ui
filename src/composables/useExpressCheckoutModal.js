import { inject, ref, unref } from 'vue';
import { useRouter } from 'vue-router';

import useTipMessage from '#src/composables/useTipMessage';
import logFormatter from '#src/util/logFormatter';
import {
	clearBasketDonation,
	hasOnlyOneDonation,
	isBasketEmpty,
	shouldReopenExpressCheckout,
} from '#src/util/thanksPage/expressCheckoutUtils';
import initializeCheckout from '#src/graphql/query/checkout/initializeCheckout.graphql';

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

	async function initializeExpressCheckoutBasket() {
		try {
			await apollo.query({
				query: initializeCheckout,
				variables: { basketId: cookieStore.get('kvbskt') },
				fetchPolicy: 'network-only',
			});
			return true;
		} catch (error) {
			$showTipMsg(
				'Something went wrong. Please, refresh the page and try again.',
				'error',
			);
			logFormatter(error, 'error');
			return false;
		}
	}

	// Programmatic close of the express checkout modal (no 'close' emit →
	// no user-close analytics). Used on every path that leaves the modal
	// flow after openLoading() has already shown the skeleton: errors and
	// the redirect-to-/basket branch.
	function abortExpressCheckout() {
		expressCheckoutModalRef.value?.abortLightbox();
	}

	async function openExpressCheckout(payload) {
		// User dismissed the skeleton while the basket work was in flight —
		// don't initialize checkout, fetch a token, or log a modal-open.
		if (!expressCheckoutModalRef.value?.isOpen?.()) return false;

		const initialized = await initializeExpressCheckoutBasket();
		if (!initialized) {
			abortExpressCheckout();
			return false;
		}

		kvTrackEvent?.(EVENT_CATEGORY, 'open', 'open-express-checkout');
		expressCheckoutLoan.value = payload.loan ?? null;
		const loaded = await expressCheckoutModalRef.value?.loadPaymentDetails();
		if (!loaded) {
			// loadPaymentDetails already showed a toast on error (and stays
			// silent when the user closed the skeleton mid-load).
			abortExpressCheckout();
			return false;
		}
		return true;
	}

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

		// The mixin's addToBasket silently no-ops when loanId/lendAmount is
		// missing (no onSuccess, no onError), which would strand the loading
		// modal open forever. Bail out before opening anything.
		if (!payload?.loanId || !payload?.lendAmount) return;

		// Open the modal shell in its skeleton state immediately — before
		// any network round-trip — so the modal appears the instant the
		// user clicks. Every path below either fills it in
		// (loadPaymentDetails) or closes it (abortExpressCheckout).
		expressCheckoutModalRef.value?.openLoading();

		// Everything past openLoading() runs inside a try: an unexpected throw
		// would otherwise strand the skeleton open with no feedback.
		try {
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
					abortExpressCheckout();
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
				await openExpressCheckout(payload);
				return;
			}

			const empty = isBasketEmpty(items);
			if (!empty) {
				// Redirect path: the express modal isn't used, but keep the
				// skeleton open through the navigation so it reads as a
				// loading state rather than flashing closed before the
				// redirect. The error handler below still aborts it if the
				// add fails and no navigation happens.
				isRedirecting.value = true;
			}

			const previousOnError = payload.onError;
			addToBasket({
				...payload,
				onSuccess: async () => {
					if (empty) {
						return openExpressCheckout(payload);
					}
					return router.push('/basket');
				},
				onError: () => {
					isRedirecting.value = false;
					abortExpressCheckout();
					previousOnError?.();
				},
			});
		} catch (error) {
			abortExpressCheckout();
			$showTipMsg(
				'Something went wrong. Please, refresh the page and try again.',
				'error',
			);
			logFormatter(error, 'error');
		}
	}

	function handleExpressCheckoutComplete({ transactionId }) {
		if (!transactionId) return;
		kvTrackEvent?.(EVENT_CATEGORY, 'click', 'complete-order');
		window.location.assign(`/checkout/thanks?kiva_transaction_id=${transactionId}`);
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
