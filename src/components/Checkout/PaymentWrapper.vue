<template>
	<div>
		<div class="payment-holder small-12 medium-7 large-6">
			<div class="card-header text-center">
				<kv-pill-toggle
					:selected="selectedOption"
					:options="options"
					id="payment-options"
					@pill-toggled="pillToggled"
				/>
			</div>
			<div>
				<pay-pal-exp
					v-if="selectedOption === 'pp'"
					:amount="amount"
					@refreshtotals="$emit('refreshTotals', $event)"
					@updating-totals="$emit('updating-totals', $event)"
					@complete-transaction="$emit('complete-transaction', $event)"
					@updating-payment-wrapper="setUpdatingPaymentWrapper"
				/>
			</div>
			<div>
				<braintree-checkout
					v-if="selectedOption === 'bt'"
					:amount="amount"
					@refreshtotals="$emit('refreshTotals', $event)"
					@updating-totals="$emit('updating-totals', $event)"
					@complete-transaction="$emit('complete-transaction', $event)"
					@updating-payment-wrapper="setUpdatingPaymentWrapper"
				/>
			</div>
			<loading-overlay
				v-show="updatingPaymentWrapper"
				id="payment-updating-overlay"
				class="updating-totals-overlay"
			/>
		</div>
		<div class="attribution-text small-12 medium-7 large-6">
			Thanks to PayPal, Kiva receives free payment processing for all loans.
		</div>
	</div>
</template>

<script>
import braintreePayWithQuery from '@/graphql/query/checkout/braintreePayWithData.graphql';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import BraintreeCheckout from '@/components/Checkout/BraintreeCheckout';
import PayPalExp from '@/components/Checkout/PayPalExpress';
import KvPillToggle from '@/components/Kv/KvPillToggle';
import LoadingOverlay from '@/pages/Lend/LoadingOverlay';

export default {
	components: {
		BraintreeCheckout,
		PayPalExp,
		KvPillToggle,
		LoadingOverlay,
	},
	props: {
		amount: {
			type: String,
			default: ''
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
			updatingPaymentWrapper: false,
			braintreePayWithShown: false,
		};
	},
	inject: ['apollo'],
	apollo: {
		preFetch(config, client) {
			return new Promise((resolve, reject) => {
				// Get the experiment object from settings
				client.query({
					query: braintreePayWithQuery
				}).then(() => {
					// Get the assigned experiment version for braintree pay with experiment
					client.query({ query: experimentAssignmentQuery, variables: { id: 'braintree_pay_with' } })
						.then(resolve).catch(reject);
				}).catch(reject);
			});
		}
	},
	created() {
		this.setupExperimentState();
	},
	methods: {
		// layer in error conditions, is there ever a situation where we wouldn't want to
		// load the PayPal or Braintree forms?
		pillToggled(key) {
			this.selectedOption = key;
			this.$kvTrackEvent('basket', 'payment type toggled', key);
		},
		setUpdatingPaymentWrapper(state) {
			this.updatingPaymentWrapper = state;
		},
		setupExperimentState() {
			// get experiment data from apollo cache
			// GROW-64: Show 'pay with' or not.
			const braintreePayWithExp = this.apollo.readFragment({
				id: 'Experiment:braintree_pay_with',
				fragment: experimentVersionFragment,
			}) || {};
			if (braintreePayWithExp.version === 'control') {
				this.$kvTrackEvent('basket', 'EXP-GROW-64-PayWith', 'a');
			} else if (braintreePayWithExp.version === 'shown') {
				this.options[0].title = 'Credit/debit card';
				this.options[1].title = 'PayPal';
				this.$kvTrackEvent('basket', 'EXP-GROW-64-PayWith', 'b');
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import "settings";

.payment-holder {
	position: relative;
	display: inline-block;
	white-space: nowrap;
	text-align: center;
	border: 1px solid $subtle-gray; //#c3c3c3
	padding: 0 0.6rem 1.25rem;
	border-radius: $input-border-radius;
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
		border-radius: $input-border-radius;
	}

	::v-deep {
		.paypal-button {
			text-align: center;
			margin-top: rem-calc(25);
		}
	}

	#payment-updating-overlay {
		margin-top: 1rem;
		z-index: 1000;
		width: auto;
		height: auto;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		background-color: rgba($white, 0.7);

		.spinner-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			position: initial;
			height: 100%;
			top: auto;
			left: auto;
			transform: none;
		}
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
