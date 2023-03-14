<template>
	<div
		class="in-context-checkout"
		id="inContextCheckout"
	>
		<basket-items-list
			class="in-context-checkout__basket-items"
			:class="{ 'in-context-checkout__basket-items--hide-donation' : !this.showDonation}"
			:disable-redirects="disableRedirects"
			:loans="loans"
			:donations="donations"
			:kiva-cards="kivaCards"
			:loan-reservation-total="parseInt(totals.loanReservationTotal)"
			:teams="teams"
			@refreshtotals="$emit('refreshtotals')"
			@updating-totals="setUpdatingTotals"
			@jump-to-loans="$emit('jump-to-loans')"
		/>

		<hr>

		<order-totals
			class="in-context-checkout__order-totals"
			:totals="totals"
			:promo-fund="derivedPromoFund"
			@credit-removed="$emit('credit-removed')"
			@refreshtotals="$emit('refreshtotals')"
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
				@refreshtotals="$emit('refreshtotals')"
				@updating-totals="setUpdatingTotals"
				@checkout-failure="handleCheckoutFailure"
			/>

			<checkout-drop-in-payment-wrapper
				v-else
				:amount="creditNeeded"
				@refreshtotals="$emit('refreshtotals')"
				@updating-totals="setUpdatingTotals"
				@complete-transaction="completeTransaction"
			/>
		</div>

		<kv-loading-overlay
			v-if="updatingTotals"
			id="updating-overlay"
			class="updating-totals-overlay"
		/>
	</div>
</template>

<script>
import numeral from 'numeral';
import { myFTDQuery, formatTransactionData } from '@/util/checkoutUtils';
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import CheckoutDropInPaymentWrapper from '@/components/Checkout/CheckoutDropInPaymentWrapper';
import KivaCreditPayment from '@/components/Checkout/KivaCreditPayment';
import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';
import BasketItemsList from '@/components/Checkout/BasketItemsList';
import OrderTotals from '@/components/Checkout/OrderTotals';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'InContextCheckout',
	inject: ['apollo', 'cookieStore'],
	components: {
		BasketItemsList,
		CheckoutDropInPaymentWrapper,
		KvButton,
		KivaCreditPayment,
		KvLoadingOverlay,
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
		disableRedirects: {
			type: Boolean,
			default: false
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
		}
	},
	data() {
		return {
			updatingTotals: false,
		};
	},
	computed: {
		creditNeeded() {
			return this.totals?.creditAmountNeeded ?? '0';
		},
		derivedPromoFund() {
			// return prop passed promoFund if present
			if (this.promoFund !== null && Object.keys(this.promoFund).length) {
				return this.promoFund;
			}
			// Filter Loans with applied Credits with an associated Promo Fund
			const appliedCreditsPromoFunds = this.loans?.filter(loan => {
				const hasCredits = loan.creditsUsed.length > 0;
				let hasPromoFund = false;
				if (hasCredits) {
					hasPromoFund = loan.creditsUsed.filter(credit => credit.promoFund !== null).length > 0;
				}
				return hasPromoFund;
			}).map(loan => {
				// return first credit's promoFund
				return loan.creditsUsed[0]?.promoFund;
			});
			// Using the first promoFund available
			return appliedCreditsPromoFunds[0] || null;
		},
		registerOrLoginHref() {
			return `/ui-login?autoPage=true&force=true&doneUrl=${encodeURIComponent(this.$route.fullPath)}`;
		},
		showKivaCreditButton() {
			return parseFloat(this.creditNeeded) === 0;
		},
	},
	methods: {
		completeTransaction(transactionId) {
			// compile transaction data
			const transactionData = formatTransactionData(
				numeral(transactionId).value(),
				this.loans,
				this.kivaCards,
				this.donations,
				this.totals
			);
			// check ftd status
			const myFtd = myFTDQuery(this.apollo);
			myFtd.then(({ data }) => {
				const isFTD = data?.my?.userAccount?.isFirstTimeDepositor;
				// update transaction data
				transactionData.isFTD = isFTD;
				// send analytics event
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
			});

			this.$emit('transaction-complete', transactionData);
		},
		handleCheckoutFailure(payload) {
			this.$emit('checkout-failure', payload);
		},
		setUpdatingTotals(payload) {
			this.updatingTotals = payload;
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.in-context-checkout {
	position: relative;

	#updating-overlay {
		z-index: 1000;
		width: auto;
		height: auto;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		background-color: rgba($kiva-bg-lightgray, 0.7);

		.spinner-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			height: 100%;
			top: auto;
			left: auto;
			transform: none;
		}
	}

	// DO NOT REMOVE
	&__basket-items {
		&--hide-donation {
			::v-deep .basket-donation-item {
				display: none;
			}
		}
	}

	&__order-totals {
		margin-bottom: 1.5rem;

		::v-deep .order-total,
		::v-deep .kiva-credit {
			font-size: 1.125rem;
			margin-bottom: 0.25rem;
		}

		::v-deep .order-total strong,
		::v-deep .kiva-credit strong {
			// margin-right: 1.725rem;
			margin-right: 2rem;
		}
	}
}

</style>
