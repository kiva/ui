<template>
	<div class="in-context-checkout">
		<basket-items-list
			class="in-context-checkout__basket-items"
			:class="{ 'in-context-checkout__basket-items--hide-donation' : !this.showDonation}"
			:loans="loans"
			:donations="donations"
			:kiva-cards="kivaCards"
			:loan-reservation-total="parseInt(totals.loanReservationTotal)"
			:teams="teams"
			@refreshtotals="$emit('refresh-totals')"
		/>

		<order-totals
			:totals="totals"
			:promo-fund="promoFund"
			@refreshtotals="refreshTotals"
			@updating-totals="setUpdatingTotals"
		/>

		<div class="in-context-login" v-if="!isActivelyLoggedIn">
			<kv-button
				v-if="!isActivelyLoggedIn"
				class="smaller checkout-button"
				id="Continue-to-legacy-button"
				v-kv-track-event="['basket', 'Redirect Continue Button', 'exit to legacy']"
				:href="registerOrLoginHref"
			>
				Continue
			</kv-button>
		</div>
		<div class="in-context-payment-conttrols" v-else>
			<kiva-credit-payment
				v-if="showKivaCreditButton"
				@complete-transaction="completeTransaction"
				class="checkout-button"
				id="kiva-credit-payment-button"
			/>

			<checkout-drop-in-payment-wrapper
				v-else
				:amount="creditNeeded"
				@refreshtotals="refreshTotals"
				@updating-totals="setUpdatingTotals"
				@complete-transaction="completeTransaction"
			/>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import CheckoutDropInPaymentWrapper from '@/components/Checkout/CheckoutDropInPaymentWrapper';
import KivaCreditPayment from '@/components/Checkout/KivaCreditPayment';
import KvButton from '@/components/Kv/KvButton';
import BasketItemsList from '@/components/Checkout/BasketItemsList';
import OrderTotals from '@/components/Checkout/OrderTotals';

export default {
	components: {
		BasketItemsList,
		CheckoutDropInPaymentWrapper,
		KvButton,
		KivaCreditPayment,
		OrderTotals
	},
	mixins: [
		checkoutUtils
	],
	props: {
		isActivelyLoggedIn: {
			type: Boolean,
			default: false
		},
		totals: {
			type: Object,
			default: () => {},
		},
		loans: {
			type: Array,
			default: () => [],
		},
		donations: {
			type: Array,
			default: () => [],
		},
		kivaCards: {
			type: Array,
			default: () => [],
		},
		showDonation: {
			type: Boolean,
			default: true,
		},
		teams: {
			type: Array,
			default: () => []
		},
		autoRedirectToThanks: {
			type: Boolean,
			default: true,
		},
		promoFund: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {

		};
	},
	computed: {
		creditNeeded() {
			return this.totals?.creditAmountNeeded ?? '0';
		},
		registerOrLoginHref() {
			return `/ui-login?force=true&doneUrl=${encodeURIComponent(this.$route.fullPath)}`;
		},
		showKivaCreditButton() {
			return parseFloat(this.creditNeeded) === 0;
		},
	},
	methods: {
		completeTransaction(transactionId) {
			// compile transaction information
			const transactionData = {
				transactionId: numeral(transactionId).value(),
				itemTotal: this.totals.itemTotal,
				loans: this.loans.map(loan => {
					const { __typename, id, price } = loan;
					return { __typename, id, price };
				}),
				donations: this.donations.map(donation => {
					const { __typename, id, price } = donation;
					return { __typename, id, price };
				}),
			};
			// fire transaction events
			this.$kvTrackTransaction(transactionData);
			// redirect to thanks
			if (this.autoRedirectToThanks) {
				window.setTimeout(
					() => {
						this.redirectToThanks(transactionId);
					},
					800
				);
			}

			this.$emit('transaction-complete', transactionData);
		},
		refreshTotals(payload) {
			console.log(payload);
		},
		setUpdatingTotals(payload) {
			console.log(payload);
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.in-context-checkout {
	&__basket-items {
		&--hide-donation {
			::v-deep .basket-donation-item {
				display: none;
			}
		}
	}
}

</style>
