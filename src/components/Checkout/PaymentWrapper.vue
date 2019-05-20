<template>
	<div>
		<div class="payment-holder small-12 medium-7 large-6">
			<div class="card-header text-center">
				<kv-pill-toggle
					:selected="selectedOption"
					:options="options"
					@pill-toggled="pillToggled"
				/>
			</div>
			<div>
				<pay-pal-exp
					v-if="selectedOption === 'pp'"
					:amount="amount"
					:show-braintree="showBraintree"
					@refreshtotals="$emit('refreshTotals', $event)"
					@updating-totals="$emit('updating-totals', $event)"
				/>
			</div>
			<div>
				<braintree-checkout
					v-if="selectedOption === 'bt'"
					:amount="amount"
					@refreshtotals="$emit('refreshTotals', $event)"
					@updating-totals="$emit('updating-totals', $event)"
				/>
			</div>
		</div>
		<div class="attribution-text small-12 medium-7 large-6">
			Thanks to PayPal powered by Braintree,
			Kiva recieves free payment processing for all loans.
		</div>
	</div>
</template>

<script>
import BraintreeCheckout from '@/components/Checkout/BraintreeCheckout';
import PayPalExp from '@/components/Checkout/PayPalExpress';
import KvPillToggle from '@/components/Kv/KvPillToggle';

export default {
	components: {
		BraintreeCheckout,
		PayPalExp,
		KvPillToggle
	},
	props: {
		amount: {
			type: String,
			default: ''
		},
		showBraintree: {
			type: Boolean,
			default: true
		},
		lastPaymentType: {
			type: String,
			default: null
		}
	},
	data() {
		return {
			options: [
				{
					title: 'Pay with card',
					key: 'bt'
				},
				{
					title: 'Pay with PayPal',
					key: 'pp',
				},
			],
			selectedOption: 'bt',
		};
	},
	created() {
		this.selectedOption = this.lastPaymentType === 'paypal' ? 'pp' : 'bt';
	},
	methods: {
		// layer in error conditions, is there ever a situation where we wouldn't want to
		// load the PayPal or Braintree forms?
		pillToggled(key) {
			this.selectedOption = key;
			this.$kvTrackEvent('basket', 'payment type toggled', key);
		},
	},
};
</script>

<style lang="scss">
@import "settings";

$form-border-radius: rem-calc(3);

.payment-holder {
	display: inline-block;
	white-space: nowrap;
	text-align: center;
	border: 1px solid $subtle-gray; //#c3c3c3
	padding: 0 0.6rem 1.25rem;
	border-radius: $form-border-radius;
	margin: 3rem auto 0 auto;
	min-width: rem-calc(300);
	width: 100%;

	@include breakpoint(medium) {
		float: right;
		display: block;
	}

	@include breakpoint(large) {
		padding: 0 2rem 1.5rem;
	}

	.card-header {
		position: relative;
		top: -1.2rem;
		background: $ghost;
		display: inline-block;
		border-radius: $form-border-radius;
	}

	.card-title {
		padding: rem-calc(5) rem-calc(10);
	}

	.paypal-button {
		text-align: center;
		margin-top: rem-calc(25);
	}
}

.attribution-text {
	color: $gray;
	float: right;
	clear: both;
	text-align: center;
	margin-top: rem-calc(25);
}
</style>
