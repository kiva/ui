<template>
	<KvLightbox
		title="Confirm Payment"
		:visible="lightboxOpen"
		@lightbox-closed="closeLightbox"
	>
		<form
			v-if="lightboxOpen"
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
import { KvButton, KvLightbox } from '@kiva/kv-components';
import ExpressCheckoutTotals from '#src/components/Thanks/ExpressCheckout/ExpressCheckoutTotals';
import useTipMessage from '#src/composables/useTipMessage';
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
const paying = ref(false);
const totalDue = ref('0.00');
const transactionsEnabled = ref(false);
const dropInAuthToken = ref('');
let totalsSubscription = null;

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

const closeLightbox = () => {
	lightboxOpen.value = false;
	totalsSubscription?.unsubscribe();
	totalsSubscription = null;
	emit('close');
};

const openLightbox = async () => {
	try {
		// Prime the basket totals cache so the watch subscription (and the
		// totals component) bind to the freshly-mutated basket. The
		// updateLoanReservation mutation that runs before this modal opens
		// does not include totals in its response, so Apollo has no way to
		// invalidate the cached totals on its own.
		await apollo.query({
			query: basketTotalsQuery,
			variables: { basketId: getBasketID() },
			fetchPolicy: 'network-only',
		});

		// Only renders this modal for logged-in users
		// (GoalEntrypoint is gated by `v-if="!isGuest"`), so we always fetch
		// the customer-scoped client token here.
		dropInAuthToken.value = await getClientToken(apollo) ?? '';
	} catch (e) {
		const message = e?.message || 'Something went wrong. Please, refresh the page and try again.';
		$showTipMsg(message, 'error');
		return false;
	}

	subscribeTotals();
	lightboxOpen.value = true;
	return true;
};

const onSubmit = async () => {
	if (paying.value) return;
	paying.value = true;

	try {
		const options = { apollo, deactivateRedirect: true };
		if (depositRequired.value) {
			options.braintree = useBraintreeDropIn(dropInName);
		}

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
		closeLightbox();
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
		$showTipMsg(errorMsg, 'error');
		closeLightbox();
	} finally {
		paying.value = false;
	}
};

onBeforeUnmount(() => {
	totalsSubscription?.unsubscribe();
	totalsSubscription = null;
});

defineExpose({
	openLightbox,
});
</script>
