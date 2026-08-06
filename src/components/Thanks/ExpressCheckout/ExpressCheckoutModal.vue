<template>
	<KvLightbox
		title="Confirm Payment"
		:visible="lightboxOpen"
		:prevent-close="!ready || paying"
		@lightbox-closed="closeLightbox"
	>
		<div
			v-if="lightboxOpen && !ready"
			class="express-checkout-skeleton tw-w-full tw-mx-auto"
			data-testid="express-checkout-loading"
			role="status"
			aria-busy="true"
		>
			<KvLoadingPlaceholder class="!tw-h-4 !tw-w-3/4 tw-mb-2" />
			<KvLoadingPlaceholder class="!tw-h-4 tw-mb-4" />
			<KvLoadingPlaceholder class="!tw-h-16 tw-mb-4" />
			<KvLoadingPlaceholder class="!tw-h-3 tw-mb-1" />
			<KvLoadingPlaceholder class="!tw-h-3 !tw-w-5/6 tw-mb-7 md:!tw-mb-2" />
			<KvLoadingPlaceholder class="!tw-h-6 tw-my-1" />
		</div>
		<form
			v-if="ready"
			style="max-width: 25rem;"
			class="tw-mx-auto"
			@submit.prevent="onSubmit"
		>
			<ExpressCheckoutTotals
				:loan="loan"
			/>

			<KvPaymentSelect
				v-if="depositRequired"
				:amount="totalDue"
				:auth-token="dropInAuthToken"
				:drop-in-name="dropInName"
				flow="checkout"
				:google-pay-merchant-id="googlePayMerchantId"
				:preselect-vaulted-payment-method="true"
				@transactions-enabled="transactionsEnabled = $event"
				@error="$showTipMsg($event, 'error')"
			/>

			<p
				class="tw-text-caption tw-mt-1 tw-mb-7 md:!tw-mb-2"
				style="font-weight: 611;"
			>
				By clicking &ldquo;Confirm payment&rdquo; you will be funding this loan
				and we&rsquo;ll charge your payment method for the selected amount.
			</p>

			<KvButton
				:state="paymentButtonState"
				type="submit"
				class="tw-w-full tw-my-1"
			>
				Complete order
			</KvButton>

			<p
				v-if="depositRequired"
				class="tw-text-small tw-text-secondary tw-text-center"
			>
				Thanks to PayPal, Kiva receives free payment processing for all transactions.
			</p>
		</form>
	</KvLightbox>
</template>

<script setup>
import {
	computed,
	inject,
	onBeforeUnmount,
	ref,
} from 'vue';
import { useRouter } from 'vue-router';
import numeral from 'numeral';
import {
	basketTotalsQuery,
	createBasket,
	executeOneTimeCheckout,
	getBasketID,
	getClientToken,
	KvPaymentSelect,
	trackTransactionEvent,
	useBraintreeDropIn,
	watchBasketTotals,
} from '@kiva/kv-shop';
import { KvButton, KvLightbox, KvLoadingPlaceholder } from '@kiva/kv-components';
import ExpressCheckoutTotals from '#src/components/Thanks/ExpressCheckout/ExpressCheckoutTotals';
import useTipMessage from '#src/composables/useTipMessage';
import {
	formatPreCheckoutValidationErrors,
	validatePreCheckoutBasket,
} from '#src/util/checkout/checkoutValidationUtils';
import logFormatter from '#src/util/logFormatter';

defineProps({
	loan: {
		type: Object,
		default: () => ({}),
	},
	analyticsCategory: {
		type: String,
		default: 'post-checkout',
	},
});

const emit = defineEmits(['close', 'checkout-complete']);

const apollo = inject('apollo');
const $appConfig = inject('$appConfig', {});
const { $showTipMsg } = useTipMessage(apollo);
const router = useRouter();

const googlePayMerchantId = $appConfig?.googlePay?.merchantId ?? '';
const dropInName = 'express-checkout';

const lightboxOpen = ref(false);
const ready = ref(false);
const paying = ref(false);
const totalDue = ref('0.00');
const transactionsEnabled = ref(false);
const dropInAuthToken = ref('');
let totalsSubscription = null;
// Holds the in-flight client-token fetch started in openLoading() so
// loadPaymentDetails() can await it instead of firing a fresh serial request.
let clientTokenPromise = null;

const depositRequired = computed(() => (numeral(totalDue.value).value() ?? 0) > 0);

const paymentButtonState = computed(() => {
	if (depositRequired.value && !transactionsEnabled.value) {
		return 'disabled';
	}
	if (paying.value) {
		return 'loading';
	}
	return '';
});

const subscribeTotals = () => {
	totalsSubscription?.unsubscribe();
	totalsSubscription = watchBasketTotals(apollo).subscribe({
		next: ({ data }) => {
			totalDue.value = data?.shop?.basket?.totals?.creditAmountNeeded || '0.00';
		},
		error: e => {
			logFormatter(`ExpressCheckoutModal: ${e}`, 'error');
		},
	});
};

// Programmatic close for error/redirect aborts: same state reset as
// closeLightbox but without emitting 'close', so the user-initiated
// close analytics ('close-express-checkout') don't fire for aborts.
const abortLightbox = () => {
	lightboxOpen.value = false;
	ready.value = false;
	totalsSubscription?.unsubscribe();
	totalsSubscription = null;
	clientTokenPromise = null;
};

const closeLightbox = () => {
	abortLightbox();
	emit('close');
};

// Show the modal shell in its skeleton state. Synchronous on purpose:
// this is what makes the modal appear the instant "Support now" is
// clicked, before any network round-trip.
const openLoading = () => {
	lightboxOpen.value = true;
	ready.value = false;
	// Prefetch the Braintree client token now so its (cache-first) round trip
	// overlaps the basket work that runs before loadPaymentDetails(), instead
	// of adding a serial fetch at reveal time. loadPaymentDetails() awaits this
	// promise; the no-op catch keeps a pre-reveal abort (which never awaits it)
	// from surfacing as an unhandled rejection.
	clientTokenPromise = getClientToken(apollo);
	clientTokenPromise.catch(() => {});
};

const loadPaymentDetails = async () => {
	try {
		// Prime the basket totals cache so the watch subscription (and the
		// totals component) bind to the freshly-mutated basket. The
		// updateLoanReservation mutation that runs before this modal opens
		// does not include totals in its response, so Apollo has no way to
		// invalidate the cached totals on its own.
		//
		// Run it in parallel with the client-token fetch kicked off in
		// openLoading() (customer-scoped; this modal only renders for
		// logged-in users, gated by GoalEntrypoint's `v-if="!isGuest"`). The
		// two are independent, so the reveal waits on max(totals, token), not
		// their sum. Fall back to a direct fetch if loadPaymentDetails() is
		// somehow reached without openLoading() having primed the promise.
		const [, token] = await Promise.all([
			apollo.query({
				query: basketTotalsQuery,
				variables: { basketId: getBasketID() },
				fetchPolicy: 'network-only',
			}),
			clientTokenPromise ?? getClientToken(apollo),
		]);
		dropInAuthToken.value = token ?? '';
	} catch (e) {
		const message = e?.message || 'Something went wrong. Please, refresh the page and try again.';
		$showTipMsg(message, 'error');
		return false;
	}

	// Reveal guard: the user may have dismissed the skeleton while the
	// queries above were in flight — don't reveal the form after close.
	if (!lightboxOpen.value) {
		return false;
	}

	subscribeTotals();
	ready.value = true;
	return true;
};

const onSubmit = async () => {
	if (paying.value) return;
	paying.value = true;

	try {
		const validationStatus = await validatePreCheckoutBasket({ apollo });
		if (validationStatus !== true) {
			const validationMessage = formatPreCheckoutValidationErrors(validationStatus);
			logFormatter(`ExpressCheckoutModal validation failed: ${validationMessage}`, 'error');
			paying.value = false;
			closeLightbox();
			router.push('/basket');
			return;
		}

		const options = { apollo, deactivateRedirect: true };
		if (depositRequired.value) {
			options.braintree = useBraintreeDropIn(dropInName);
		}

		// executeOneTimeCheckout runs trackSuccess, which fires Meta Purchase + GA + Optimizely for this checkoutId
		const transactionResult = await executeOneTimeCheckout(options);

		// Validate the result BEFORE side effects. `executeOneTimeCheckout`
		// only throws when GraphQL errors are present — a declined card may
		// return cleanly with `status !== 'COMPLETED'`. Without this guard
		// we'd track a phantom transaction and wipe the basket via
		// `createBasket` before the user can retry.
		if (transactionResult?.data?.checkoutStatus?.status !== 'COMPLETED') {
			throw new Error('Checkout failed');
		}

		const checkoutId = transactionResult?.data?.checkoutStatus?.receipt?.checkoutId;
		if (!checkoutId) {
			// Defensive: status is COMPLETED but the receipt id is missing.
			// Throw so the user gets a tip message instead of silently
			// paying without ever reaching the new Thanks page.
			throw new Error('Checkout completed but receipt is missing');
		}

		await trackTransactionEvent({
			apollo,
			transactionId: Number(checkoutId),
		});

		await createBasket(apollo);

		emit('checkout-complete', {
			transactionId: checkoutId,
			amount: numeral(totalDue.value).format('0.00'),
			transactionInfo: transactionResult?.data?.checkoutStatus,
		});
	} catch (e) {
		if (e?.code === 'shop.failedCheckoutValidation') {
			closeLightbox();
			router.push('/basket');
			return;
		}

		let errorMsg = 'Something went wrong. Please, refresh the page and try again.';

		if (e?.code === 'shop.dropinNoPaymentMethod') {
			// eslint-disable-next-line max-len
			errorMsg = 'There was a problem validating your payment information. Please double-check the details and try again.';
		} else if (e?.message && e?.code !== 'shop.dropinRequired') {
			errorMsg = e.message;
		}
		paying.value = false;
		$showTipMsg(errorMsg, 'error');
		closeLightbox();
	}
};

onBeforeUnmount(() => {
	totalsSubscription?.unsubscribe();
	totalsSubscription = null;
});

defineExpose({
	openLoading,
	loadPaymentDetails,
	abortLightbox,
	closeLightbox,
	isOpen: () => lightboxOpen.value,
});
</script>

<style scoped>
@screen md {
	.express-checkout-skeleton {
		width: 30rem;
	}
}
</style>
