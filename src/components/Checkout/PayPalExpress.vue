<template>
	<div class="paypal-holder">
		<div id="paypal-button" ref="paypalbutton"></div>
		<p class="pp-tagline small-text">Thanks to PayPal, Kiva receives
		<br class="hide-for-large"> free payment processing.</p>
	</div>
</template>

<script>
/* global paypal */
import _get from 'lodash/get';
import numeral from 'numeral';
import getPaymentToken from '@/graphql/query/checkout/getPaymentToken.graphql';
import depositAndCheckout from '@/graphql/mutation/depositAndCheckout.graphql';

export default {
	inject: ['apollo'],
	props: {
		amount: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			ensurePaypalScript: null,
			paypalRendered: false
		};
	},
	metaInfo() {
		// ensure paypal script is loaded
		const paypalScript = {};
		// check for paypal incase script is already loaded
		if (typeof paypal === 'undefined') {
			paypalScript.type = 'text/javascript';
			paypalScript.src = 'https://www.paypalobjects.com/api/checkout.js';
		}
		return {
			script: [
				paypalScript
			]
		};
	},
	mounted() {
		this.initializePaypal();
	},
	watch: {
		amount() {
			this.initializePaypal();
		}
	},
	methods: {
		initializePaypal() {
			// ensure paypal is loaded before calling
			this.ensurePaypalScript = window.setInterval(() => {
				if (typeof paypal !== 'undefined' && !this.paypalRendered) {
					this.renderPaypalButton();
				}
			}, 200);
		},
		renderPaypalButton() {
			// clear ensurePaypal interval
			window.clearInterval(this.ensurePaypalScript);
			// signify we've already rendered
			this.paypalRendered = true;
			// render paypal button
			paypal.Button.render(
				{
					// TODO: Wire up switch for Prod
					env: 'sandbox',
					commit: true,
					payment: () => {
						console.log('payment stage');
						return new paypal.Promise((resolve, reject) => {
							// Use updated vars on render
							this.apollo.query({
								query: getPaymentToken,
								variables: {
									amount: numeral(this.amount).format('0.00'),
								}
							}).then(({ data }) => {
								if (data) {
									console.log(data);
									if (data.errors) {
										reject(data);
									}
									resolve(data.shop.getPaymentToken);
								}
							});
						});
					},
					onAuthorize: data => {
						console.log('authorized stage');
						console.log(data);

						return new paypal.Promise((resolve, reject) => {
							this.apollo.mutate({
								mutation: depositAndCheckout,
								variables: {
									amount: numeral(this.amount).format('0.00'),
									token: data.paymentToken,
									payerId: data.payerID
								},
							})
								.then(ppResponse => {
									console.log(ppResponse);
									// Check for errors
									if (ppResponse.errors) {
										console.error(`Error completing transactions: ${ppResponse.errors}`);
									}

									// Transaction is complete
									const transactionId = _get(ppResponse, 'data.shop.doPaymentDepositAndCheckout');
									// redirect to thanks with KIVA transaction id
									if (transactionId) {
										this.$emit('successful-transaction', transactionId);
									}
									resolve(ppResponse);
								})
								.catch(catchError => {
									console.error(catchError);
									reject(catchError);
								})
								.finally(() => {
									this.loading = false;
								});
						});
					},
					onError: data => {
						console.error(data);
					},
					style: {
						color: 'blue',
						shape: 'rect',
						size: (typeof window === 'object' && window.innerWidth > 480) ? 'medium' : 'responsive',
						fundingicons: true
					}
				},
				'#paypal-button'
			);
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

.paypal-holder {
	display: block;
	text-align: center;

	@include breakpoint(medium) {
		text-align: right;
	}

	#paypal-button {
		margin-bottom: $list-side-margin;
	}

	.pp-tagline {
		font-weight: 400;
		color: $kiva-text-light;
		text-align: center;

		@include breakpoint(medium) {
			text-align: right;
		}
	}
}
</style>
