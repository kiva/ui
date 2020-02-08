<template>
	<div class="paypal-holder">
		<div class="text-center" id="paypal-button" ref="paypalbutton"></div>
	</div>
</template>

<script>
/* global paypal */
import _get from 'lodash/get';
import * as Sentry from '@sentry/browser';
import gql from 'graphql-tag';

const getExpressCheckoutToken = gql`{
	my {
		payPalBillingAgreement {
			getExpressCheckoutToken
		}
	}
}`;

export default {
	inject: ['apollo'],
	props: {
		amount: {
			type: Number,
			default: 25
		},
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
					// TODO: Should we have a global key/switch for Prod
					env: (window.location.host.indexOf('www.kiva.org') !== -1) ? 'production' : 'sandbox',
					commit: true,
					payment: () => {
						return new paypal.Promise((resolve, reject) => {
							// Get Express checkout token
							return this.apollo.query({
								query: getExpressCheckoutToken,
							}).then(response => {
								console.log('response', response);
								if (response.errors) {
									reject(response);
								} else {
									const expressCheckoutToken = _get(
										response,
										'data.my.payPalBillingAgreement.getExpressCheckoutToken'
									);
									resolve(expressCheckoutToken || response);
								}
							}).catch(error => {
								console.error(error);
								// Fire specific exception to Sentry/Raven
								Sentry.withScope(scope => {
									scope.setTag('pp_stage', 'onPaymentGetPaymentTokenCatch');
									Sentry.captureException(JSON.stringify(error.errors ? error.errors : error)); // eslint-disable-line max-len
								});

								reject(error);
							});
						});
					},
					onAuthorize: (data, actions) => {
						console.log('data,actions', data, actions);
						return new paypal.Promise((resolve, reject) => {
							return this.apollo.mutate({
								mutation: gql`
									mutation (
										$token: String!,
									) {
										my {
											payPalBillingAgreement {
												createBillingAgreement(token: $token)
											}
										}
									}`,
								variables: {
									token: data.paymentToken
								},
							}).then(ppResponse => {
								console.log('ppResponse', ppResponse);
								// Check for errors
								if (ppResponse.errors) {
									const errorCode = _get(ppResponse, 'errors[0].code');
									// -> server supplied language is not geared for lenders
									const standardErrorCode = `(PayPal error: ${errorCode})`;
									const standardError = `There was an error processing your payment.
														Please try again. ${standardErrorCode}`;

									this.$showTipMsg(standardError, 'error');

									// Fire specific exception to Sentry/Raven
									Sentry.withScope(scope => {
										scope.setTag('pp_stage', 'onAuthorize');
										scope.setTag('pp_token', 'data.paymentToken');
										Sentry.captureException(JSON.stringify(ppResponse.errors));
									});

									// Restart the Exp Checkout interface to allow payment changes
									// 10539 'payment declined' error
									// 10486 transaction could not be completed
									if (errorCode === '10539' || errorCode === '10486') {
										return actions.restart();
									}
									// TODO: Are there other specific errors we should handle?

									// exit
									reject(data);
								}

								// Transaction is complete
								const transactionId = _get(
									ppResponse,
									'data.shop.doPaymentDepositAndCheckout'
								);
								console.log(transactionId);

								// redirect to thanks with KIVA transaction id
								if (transactionId) {
									// Complete transaction handles additional analytics + redirect
									this.$emit('complete-transaction', transactionId);
								}
								resolve(ppResponse);
							})
								.catch(catchError => {
									// Fire specific exception to Sentry/Raven
									Sentry.withScope(scope => {
										scope.setTag('pp_stage', 'onAuthorizeCatch');
										Sentry.captureException(JSON.stringify(catchError));
									});

									reject(catchError);
								});
						})
							.catch(error => {
								console.error(error);
								// Fire specific exception to Sentry/Raven
								Sentry.withScope(scope => {
									scope.setTag('pp_stage', 'onAuthorizeValidationCatch');
									Sentry.captureException(JSON.stringify(error));
								});
							});
					},
					onError: data => {
						console.error(data);
					},
					onCancel: () => {
					},
					style: {
						color: 'blue',
						shape: 'rect',
						size: (typeof window === 'object' && window.innerWidth > 480) ? 'large' : 'responsive',
						fundingicons: false,
					},
					funding: {
						disallowed: [paypal.FUNDING.CREDIT, paypal.FUNDING.VENMO]
					}
				},
				'#paypal-button'
			);
		},
	}
};
</script>

<style lang="scss">
@import 'settings';

.paypal-holder {
	display: block;
	text-align: center;
	min-height: rem-calc(55);

	@include breakpoint(medium) {
		text-align: right;
	}

	.pp-tagline {
		color: $kiva-text-light;
		text-align: center;

		@include breakpoint(medium) {
			text-align: right;
		}
	}
}
</style>
