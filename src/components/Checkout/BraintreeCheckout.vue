<template>
	<div class="braintree-holder">
		<!-- <div class="card-header"> -->
		<h3 class="card-title columns">Enter Card Details</h3>
		<!-- </div> -->

		<form id="braintree-payment-form">
			<div class="grid-container small-12 columns">
				<div class="grid-x grid-padding-x">

					<!-- Card number input -->
					<div class="row">
						<div class="cell input-group">
							<div class="small-12 columns">
								<label>Card Number
									<div id="card-number"></div>
									<span class="helper-text"></span>
								</label>
							</div>
						</div>
					</div>

					<!-- Card expiration input -->
					<div class="row">
						<div class="cell input-group">
							<div class="small-12 columns">
								<label>Exp. Date
									<div class="small-6">
										<!--  Hosted Fields div container -->
										<div id="expiration-month"></div>
										<span class="helper-text"></span>
									</div>
									<div class="small-6">
										<!--  Hosted Fields div container -->
										<div id="expiration-year"></div>
										<span class="helper-text"></span>
									</div>
								</label>
							</div>
						</div>
					</div>

					<!-- Card security code input -->
					<div class="row">
						<div class="cell input-group">
							<div class="small-12 columns">
								<label class="control-label">Security Code</label>
								<!--  Hosted Fields div container -->
								<div id="cvv"></div>
							</div>
						</div>
					</div>

					<!-- Zip code input -->
					<div class="row">
						<div class="cell input-group">
							<div class="small-12 columns">
								<label class="control-label">Zipcode</label>
								<!--  Hosted Fields div container -->
								<div id="postal-code"></div>
							</div>
						</div>
					</div>

					<!-- Submit payment button -->
					<div class="row">
						<div class="small-12 columns">
							<button value="submit" id="braintree-submit" class="button center-block">
								Pay with <span id="card-type">Card</span>
							</button>
						</div>
					</div>

				</div>
			</div>
		</form>
	</div>
</template>

<script>
/* global braintree */
import _get from 'lodash/get';
import numeral from 'numeral';
// import Raven from 'raven-js';
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import getClientToken from '@/graphql/query/checkout/getClientToken.graphql';
import braintreeDepositAndCheckout from '@/graphql/mutation/braintreeDepositAndCheckout.graphql';

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
			ensureBraintreeScript: null,
			braintreeRendered: false,
			loading: false,
			clientToken: null
		};
	},
	metaInfo() {
		// ensure Braintree script is loaded
		const braintreeScript = {};
		const braintreeHostedFieldsScript = {};

		// check for braintree incase script is already loaded
		if (typeof braintree === 'undefined') {
			braintreeScript.type = 'text/javascript';
			// Loading in the Braintree SDK by hitting this URL
			braintreeScript.src = 'https://js.braintreegateway.com/web/3.42.0/js/client.min.js';

			// Trying to load in the hosted fields script
			braintreeHostedFieldsScript.type = 'text/javascript';
			braintreeHostedFieldsScript.src = 'https://js.braintreegateway.com/web/3.42.0/js/hosted-fields.min.js';
		}

		return {
			script: [
				braintreeScript,
				braintreeHostedFieldsScript
			]
		};
	},
	mounted() {
		this.getClientToken();
	},
	watch: {
		amount() {
			this.initializeBraintree();
		},
		clientToken() {
			this.initializeBraintree();
		}
	},
	methods: {
		// Getting the client token from our server, this will be used to verify
		// the transaction later on.
		getClientToken() {
			this.apollo.query({
				query: getClientToken,
				variables: {
					amount: numeral(this.amount).format('0.00'),
				}
			}).then(response => {
				// if (response.errors) {
				// 	this.setUpdating(false);
				// 	reject(response);
				// } else {
				// 	const paymentToken = _get(response, 'data.shop.getPaymentToken');
				// 	resolve(paymentToken || response);
				// }
				this.clientToken = _get(response, 'data.shop.getClientToken');
			});
		},
		initializeBraintree() {
			// ensure Braintree is loaded before calling
			this.ensureBraintreeScript = window.setInterval(() => {
				if (typeof braintree !== 'undefined' && !this.braintreeRendered) {
					this.renderBraintreeForm();
				}
			}, 200);
		},
		renderBraintreeForm() {
			// clear ensureBraintree interval
			window.clearInterval(this.ensureBraintreeScript);
			// signify we've already rendered
			this.braintreeRendered = true;

			const form = document.querySelector('#braintree-payment-form');

			// render braintree form
			braintree.client.create({
				authorization: this.clientToken
			}, (err, clientInstance) => {
				if (err) {
					console.error(err);
					return;
				}

				braintree.hostedFields.create({
					client: clientInstance,
					styles: {
						// Have to put input related styles right here.
						// braintree hosted fields changes the divs in the template
						// into input fields
						input: {
							'font-size': '16px',
							'font-family': 'helvetica, tahoma, calibri, sans-serif'
						},
						':focus': {
							color: 'black'
						}
					},
					fields: {
						number: {
							selector: '#card-number',
							placeholder: '4111 1111 1111 1111'
						},
						cvv: {
							selector: '#cvv',
							placeholder: '123'
						},
						expirationMonth: {
							selector: '#expiration-month',
							placeholder: 'MM'
						},
						expirationYear: {
							selector: '#expiration-year',
							placeholder: 'YYYY'
						},
						postalCode: {
							selector: '#postal-code',
							placeholder: '90210'
						}
					}
				}, (hostedFieldsErr, hostedFieldsInstance) => {
					if (hostedFieldsErr) {
						console.error(hostedFieldsErr);
						return;
					}

					form.addEventListener('submit', event => {
						event.preventDefault();
						this.$emit('updating-totals', true);

						hostedFieldsInstance.tokenize((tokenizeErr, payload) => {
							if (tokenizeErr) {
								console.error(tokenizeErr);
								return;
							}

							// Apollo call to the query mutation
							this.apollo.mutate({
								mutation: braintreeDepositAndCheckout,
								variables: {
									amount: numeral(this.amount).format('0.00'),
									nonce: payload.nonce
								}
							}).then(kivaBraintreeResponse => {
								// Check for errors
								if (kivaBraintreeResponse.errors) {
									this.$emit('updating-totals', false);
									const errorCode = _get(kivaBraintreeResponse, 'errors[0].code');
									const standardErrorCode = `(Braintree error: ${errorCode})`;
									const standardError = `There was an error processing your payment.
										Please try again. ${standardErrorCode}`;

									this.$showTipMsg(standardError, 'error');

									// Fire specific exception to Sentry/Raven
									// Raven.captureException(JSON.stringify(ppResponse.errors), {
									// 	tags: {
									// 		pp_stage: 'onAuthorize',
									// 		pp_token: data.paymentToken
									// 	}
									// });

									// exit
									// reject(kivaBraintreeResponse);
								}

								// Transaction is complete
								const transactionId = _get(
									kivaBraintreeResponse,
									'data.shop.doNoncePaymentDepositAndCheckout'
								);
								// redirect to thanks with KIVA transaction id
								if (transactionId) {
									this.$kvTrackEvent(
										'basket',
										'Braintree Payment',
										'Success',
										transactionId
									);
									this.redirectToThanks(transactionId);
								}
								return kivaBraintreeResponse;
							});
						});
					});
				});
			});
		}
	}
};
</script>

<style lang="scss">
@import "settings";

.braintree-holder {
	display: block;
	text-align: center;
	text-align: left;
	float: right;

	// forcing styles for now so form is digestable
	#braintree-payment-form {
		.input-group #card-number,
		.input-group #expiration-month,
		.input-group #expiration-year,
		.input-group #cvv,
		.input-group #postal-code {
			height: 44px;
			border: 1px solid #3a3a3a;
			padding: 8px;
		}
	}
}
</style>
