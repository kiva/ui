<template>
	<div class="payment-holder small-12 medium-7 large-6">
		<div class="card-header text-center">
			<kv-pill-toggle
				:selected="selectedOption"
				:options="options"
				@pillToggled="pillToggled(key)"/>
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
	data() {
		return {
			options: [
				{
					title: 'Pay with PayPal',
					key: 'pp',
				},
				{
					title: 'Pay with Card',
					key: 'bt'
				}
			],
			selectedOption: 'pp'
		};
	},
	methods: {
		// layer in error conditions, is there ever a situation where we wouldn't want to
		// load the PayPal or Braintree forms?
		pillToggled(key) {
			this.selectedOption = key;
		}
	}
};
</script>

<style lang="scss">
@import "settings";

$form-border-radius: rem-calc(3);

.payment-holder {
	display: block;
	text-align: left;
	float: right;
	border: 1px solid $subtle-gray; //#c3c3c3
	padding: 0 2rem 1.5rem;
	border-radius: $form-border-radius;
	margin-top: 3rem;

	.card-header {
		position: relative;
		top: -1.2rem;
		background: $ghost;
		border: 1px solid $subtle-gray;
		display: inline-block;
		border-radius: $form-border-radius;
	}

	.card-title {
		padding: 5px 10px;
	}
}
</style>
