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
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import getPaymentToken from '@/graphql/query/checkout/getPaymentToken.graphql';
import depositAndCheckout from '@/graphql/mutation/depositAndCheckout.graphql';


export default {
	inject: ['apollo'],
	mixins: [
		checkoutUtils
	],
	props: {
		amount: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			ensurePaypalScript: null,
			paypalRendered: false,
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
							this.setUpdating(true);
							this.validateBasket()
								.then(validationStatus => {
									if (validationStatus === true) {
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
													this.setUpdating(false);
													reject(data);
												}
												resolve(data.shop.getPaymentToken);
											}
										});
									} else {
										this.setUpdating(false);
										this.showCheckoutError(validationStatus);
										reject(validationStatus);
									}
								})
								.catch(error => {
									this.setUpdating(false);
									console.error(error);
								});
						});
					},
					onAuthorize: (data, actions) => {
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
										this.setUpdating(false);
										const errorCode = _get(ppResponse, 'errors[0].code');
										const serverErrorMessage = _get(ppResponse, 'errors[0].message');
										const standardErrorCode = `(PayPal error: ${errorCode})`;
										const standardError = `There was an error processing your payment.
											Please try again. ${standardErrorCode}`;

										console.log(errorCode, serverErrorMessage);
										// check for ERROR CODE=INSTRUMENT_DECLINED and restart
										// 10539 'INSTRUMENT_DECLINED' error
										if (errorCode === '10539') {
											return actions.restart();
										}
										// TODO: How should we handle 10486
										// TODO: Are there other specific errors we should handle?

										this.$showTipMsg(standardError, 'error');
										console.error(`Transaction Error: ${ppResponse.errors}`);
									}

									// Transaction is complete
									const transactionId = _get(ppResponse, 'data.shop.doPaymentDepositAndCheckout');
									// redirect to thanks with KIVA transaction id
									if (transactionId) {
										this.redirectToThanks(transactionId);
									}
									resolve(ppResponse);
								})
								.catch(catchError => {
									this.setUpdating(false);
									console.error(catchError);
									reject(catchError);
								})
								.finally(() => {
									this.loading = false;
								});
						});
					},
					onError: data => {
						this.setUpdating(false);
						console.error(data);
					},
					onCancel: () => {
						this.setUpdating(false);
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
		},
		setUpdating(state) {
			this.loading = state;
			this.$emit('updating-totals', state);
		},
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
