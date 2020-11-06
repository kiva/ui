<template>
	<div class="in-context-checkout">
		<basket-items-list
			:class="hideDonationClass"
			:loans="loans"
			:donations="donations"
			:kiva-cards="kivaCards"
			:loan-reservation-total="parseInt(totals.loanReservationTotal)"
		/>
		<hr>
		<kv-button
			v-if="!isActivelyLoggedIn"
			class="smaller checkout-button"
			id="Continue-to-legacy-button"
			v-kv-track-event="['basket', 'Redirect Continue Button', 'exit to legacy']"
			:href="registerOrLoginHref"
		>
			Continue
		</kv-button>

		<kiva-credit-payment
			v-else
			@complete-transaction="completeTransaction"
			class=" checkout-button"
			id="kiva-credit-payment-button"
		/>
	</div>
</template>

<script>
import numeral from 'numeral';
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import KivaCreditPayment from '@/components/Checkout/KivaCreditPayment';
import BasketItemsList from '@/components/Checkout/BasketItemsList';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		BasketItemsList,
		KvButton,
		KivaCreditPayment,
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
		autoRedirectToThanks: {
			type: Boolean,
			default: true,
		}
	},
	data() {
		return {

		};
	},
	computed: {
		registerOrLoginHref() {
			if (typeof window !== 'undefined') {
				return `/ui-login?force=true&doneUrl=${window.location.href}`;
			}
			// TODO: map using route for ssr
			return '/ui-login?force=true';
		},
		hideDonationClass() {
			if (!this.showDonation) {
				return 'hide-donation';
			}
			return '';
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

			this.$emit('transaciton-complete', transactionData);
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

::v-deep .basket-items-list > ul {
	margin: 0 2.625 0 1rem;
}

@include breakpoint(large) {
	::v-deep .basket-items-list {
		.borrower-info-wrapper {
			padding: 0 1.25rem;
		}
	}
}

.hide-donation {
	::v-deep .basket-donation-item {
		display: none;
	}
}
</style>
