<template>
	<div class="braintree-holder">
		<form action="/" id="braintree-form" method="post">
			<label for="card-number">Card Number</label>
			<div id="card-number"></div>

			<label for="cvv">CVV</label>
			<div id="cvv"></div>

			<label for="expiration-date">Expiration Date</label>
			<div id="expiration-date"></div>

			<input type="submit" id="braintree-form-submit" value="Pay" disabled>
		</form>
	</div>
</template>

<script>
/* global braintree */
import _get from 'lodash/get';
import numeral from 'numeral';
import Raven from 'raven-js';
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import getClientToken from '@/graphql/query/checkout/getClientToken.graphql';
// import braintreeDepositAndCheckout from '@/graphql/mutation/braintreeDepositAndCheckout.graphql';

export default {
	inject: ['apollo'],
	mixins: [
		checkoutUtils
		// braintreeDepositAndCheckout
	],
	props: {
		amount: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			ensureBraintreeScript: null,
			braintreeRendered: false,
			loading: false
		};
	},
	metaInfo() {
		// ensure Braintree script is loaded
		const braintreeScript = {};
		// check for braintree incase script is already loaded
		if (typeof braintree === 'undefined') {
			braintreeScript.type = 'text/javascript';
			// Loading in the Braintree SDK by hitting this URL
			braintreeScript.src = 'https://js.braintreegateway.com/web/3.42.0/js/client.min.js';
		}
		return {
			script: [
				braintreeScript
			]
		};
	},
	mounted() {
		this.initializeBraintree();
	},
	watch: {
		amount() {
			this.initializeBraintree();
		}
	},
	methods: {
		initializeBraintree() {
			// ensure Braintree is loaded before calling
			this.ensureBraintreeScript = window.setInterval(() => {
				if (typeof braintree !== 'undefined' && !this.braintreeRendered) {
					this.renderBraintreeForm();
				}
			}, 200);
		},
		renderBraintreeForm() {
			// clear ensurePaypal interval
			window.clearInterval(this.ensureBraintreeScript);
			// signify we've already rendered
			this.braintreeRendered = true;
			// render braintree form
			braintree.client.create(
				{
					env: (window.location.host.indexOf('www.kiva.org') !== -1) ? 'production' : 'sandbox',
					commit: true,
					payment: () => {
						this.$kvTrackEvent('basket', 'Braintree Payment', 'Button Click');

						return new braintree.Promise((resolve, reject) => {
							this.setUpdating(true);
							// validate the basket before getting the clientToken
							return this.validateBasket()
								.then(validationStatus => {
									if (validationStatus === true) {
									// user updated varables once rendered
										this.apollo.query({
											query: getClientToken,
											variables: {
												amount: numeral(this.amount).format('0.00'),
											}
										}).then(response => {
											if (response.errors) {
												this.setUpdating(false);
												reject(response);
											} else {
												const clientToken = _get(response, 'data.shop.getClientToken');
												resolve(clentToken || response);
											}
										})
											.catch(error => {
												console.error(error);
												// Fire specific exception to Sentry/Raven
												// eslint-disable-next-line
												Raven.captureException(JSON.stringify(error.errors ? error.errors : error), {
													tags: {
														braintree_stage: 'onPaymentGetClientTokenCatch'
													}
												});

												reject(error);
											});
									} else {
									// validation failed
										this.setUpdating(false);
										this.showCheckoutError(validationStatus);
										this.$emit('refreshtotals');
										reject(validationStatus);
									}
								})
								.catch(error => {
									this.setUpdating(false);
									console.error(error);

									// Fire specific exception to Sentry/Raven
									Raven.captureException(JSON.stringify(error), {
										tags: {
											braintree_stage: 'onPaymentGetClientTokenCatch'
										}
									});
								});
						});
					},
					onAuthorize: (data, actions) => {
						this.$kvTrackEvent('basket', 'Braintree Payment', 'braintree Pay Now Click');

						return new braintree.Promise((resolve, reject) => {
							// validate the basket before deposit and checkout
							return this.validateBasket()
								.then(validationStatus => {
									if (validationStatus === true) {
										this.apollo.mutate({
											variables: {
												mutation: braintreeDepositAndCheckout,
												token: data.clientToken,
											},
										})
											.then(braintreeResponse => {
											// Check for errors
												if (braintreeResponse.errors) {
													this.setupdating(false);
													const errorCode = _get(braintreeResponse, 'errors[0].code');

													const standardErrorCode = _get(`(Paypal error: ${errorCode})`);
													const standardError = `There was an error processing your payment. Please try again. ${standardErrorCode}`;

													this.$showTipMsg(standardError, 'error');

													// Fire specific exception for Sentry/Raven
													Raven.captureException(JSON.stringify(braintreeResponse.errors), {
														tags: {
															braintree_stage: 'onAuthorize',
															braintree_token: data.clientToken
														}
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
													braintreeResponse,
													'data.shop.doPaymentDepositAndCheckout'
												);
												// redirect user to thanks with the Kiva transactionID
												if (transactionId) {
													this.$kvTrackEvent('basket', 'Braintree Payment', 'Success', transactionId);
													this.redirectToThanks(transactionId);
												}
												resolve(braintreeResponse);
											})
											.catch(catchError => {
												this.setUpdating(false);

												// Fire specific exception to Sentry/Raven
												Raven.captureException(JSON.stringify(catchError), {
													tags: {
														braintree_stage: 'onAuthorizeCatch'
													}
												});
												reject(catchError);
											});
									} else {
										// validation failed
										this.setUpdating(false);
										this.showCheckoutError(validationStatus);
										this.$emit('refreshtotals');
										reject(validationStatus);
									}
								})
								.catch(error => {
									this.setUpdating(false);
									console.error(error);

									// Fire specific exceptions to Sentry/Raven
									Raven.captureException(JSON.stringify(error), {
										tags: {
											braintree_stage: 'onAuthorizeValidationCatch'
										}
									});
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
				// TODO SET THIS IN THE HTML
				'#braintree-button'
			);
		},
		setUpdating(state) {
			this.loading = state;
			this.$emit('updating-totals', state);
		},
	}
};

// 				{ authorization: 'CLIENT_AUTHORIZATION' },
// 				(clientErr, clientInstance) => {
// 					if (clientErr) {
// 						// Handle error in client creation
// 						return;
// 					}

// 					const options = {
// 						client: clientInstance,
// 						styles: {
// 							input: { "font-size": "14px" }, // eslint-disable-line
// 							"input.invalid": { color: "red" }, // eslint-disable-line
// 							"input.valid": { color: "green" } // eslint-disable-line
// 						},
// 						fields: {
// 							number: {
// 								selector: '#card-number',
// 								placeholder: '4111 1111 1111 1111'
// 							},
// 							cvv: {
// 								selector: '#cvv',
// 								placeholder: '123'
// 							},
// 							expirationDate: {
// 								selector: '#expiration-date',
// 								placeholder: '10/2019'
// 							}
// 						}
// 					};

// 					braintree.hostedFields.create(options, (hostedFieldsErr, hostedFieldsInstance) => {
// 						if (hostedFieldsErr) {
// 							console.error(hostedFieldsErr);
// 							console.error(hostedFieldsInstance);
// 							return false;
// 						}
// 					});
// 				}
// 			);
// 		}
// 	}
// };
</script>

<style lang="scss">
@import "settings";

.braintree-holder {
  display: block;
  text-align: center;

  @include breakpoint(medium) {
    text-align: right;
  }
}
</style>
