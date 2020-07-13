<template>
	<div class="paypal-holder">
		<div class="text-center" id="paypal-button" ref="paypalbutton"></div>
		<p class="small-text">
			Thanks to PayPal, Kiva receives free payment processing.
		</p>
	</div>
</template>

<script>
/* global paypal */
import _get from 'lodash/get';
import * as Sentry from '@sentry/browser';
import gql from 'graphql-tag';

const getExpressCheckoutToken = gql`query expressCheckoutToken {
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
					env: this.$appConfig.paypal.environment,
					payment: () => {
						return new paypal.Promise((resolve, reject) => {
							// Get Express checkout token
							return this.apollo.query({
								query: getExpressCheckoutToken,
							}).then(response => {
								if (response.errors) {
									reject(response);
								} else {
									const expressCheckoutToken = _get(response, 'data.my.payPalBillingAgreement.getExpressCheckoutToken');// eslint-disable-line max-len
									resolve(expressCheckoutToken || response);
								}
							}).catch(error => {
								console.error(error);
								// Fire specific exception to Sentry/Raven
								Sentry.withScope(scope => {
									scope.setTag('pp_stage', 'onPaymentGetPaymentTokenCatch');
									Sentry.captureException(JSON.stringify(error.errors ? error.errors : error));
								});

								reject(error);
							});
						});
					},
					onAuthorize: data => {
						return new paypal.Promise((resolve, reject) => {
							return this.apollo.mutate({
								mutation: gql`
									mutation createBillingAgreement(
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
								// Check for errors
								if (ppResponse.errors) {
									const errorCode = _get(ppResponse, 'errors[0].code');
									// -> server supplied language is not geared for lenders
									const standardErrorCode = `(PayPal error: ${errorCode})`;
									const standardError = `There was an error processing your subscription.
														Please try again. ${standardErrorCode}`;

									this.$showTipMsg(standardError, 'error');

									// Fire specific exception to Sentry/Raven
									Sentry.withScope(scope => {
										scope.setTag('pp_stage', 'onAuthorize');
										scope.setTag('pp_token', 'data.paymentToken');
										Sentry.captureException(JSON.stringify(ppResponse.errors));
									});

									// exit
									reject(data);
								}

								// Transaction is complete
								const billingAgreementId = _get(
									ppResponse,
									'data.my.payPalBillingAgreement.createBillingAgreement'
								);

								// redirect to thanks with KIVA billingAgreementId
								if (billingAgreementId) {
									// Complete transaction handles additional analytics + redirect
									this.$emit('complete-transaction', billingAgreementId);
								}
								resolve(ppResponse);
							}).catch(catchError => {
								// Fire specific exception to Sentry/Raven
								Sentry.withScope(scope => {
									scope.setTag('pp_stage', 'onAuthorizeCatch');
									Sentry.captureException(JSON.stringify(catchError));
								});

								reject(catchError);
							});
						}).catch(error => {
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
