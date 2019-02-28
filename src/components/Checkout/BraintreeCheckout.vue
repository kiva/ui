<template>
	<div class="braintree-holder">
		<form id="braintree-payment-form">
			<!-- Card number input -->
			<div class="row small-collapse">
				<div class="small-12 columns">
					<label for="kv-card-number">Card Number</label>
					<div id="kv-card-number" class="kv-braintree-wrapper"></div>
				</div>
			</div>

			<!-- Inline Inputs -->
			<div class="row small-collapse">
				<div class="small-4 columns">
					<label for="kv-expiration-date">Expiration</label>
					<div id="kv-expiration-date" class="kv-braintree-wrapper"></div>
				</div>
				<div class="small-4 columns">
					<label class="cvv-label">CVV</label>
					<div id="kv-cvv" class="kv-braintree-wrapper"></div>
				</div>
				<div class="small-4 columns">
					<label>Postal code</label>
					<div id="kv-postal-code" class="kv-braintree-wrapper"></div>
				</div>
			</div>

			<!-- Submit payment button -->
			<div class="row small-collapse">
				<div class="small-12 columns">
					<kv-button value="submit" id="braintree-submit" class="button smallest">
						<kv-icon name="lock" />
						Pay with <span id="card-type">card</span>
					</kv-button>
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
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvButton,
		KvIcon
	},
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
						// > Our devs become wrappers which can be styled by our css
						// Import our base class for inputs
						// > These are applied directly to the input elements
						input: 'braintree-form-inputs'
					},
					fields: {
						number: {
							selector: '#kv-card-number',
							placeholder: '4111 1111 1111 1111'
						},
						cvv: {
							selector: '#kv-cvv',
							placeholder: '123'
						},
						expirationDate: {
							selector: '#kv-expiration-date',
							placeholder: 'MM/YY'
						},
						postalCode: {
							selector: '#kv-postal-code',
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

$form-border-radius: rem-calc(3);
$error-red: #fdeceb;

// Utility class passed to Braintree Config
// > These styles are applied directly to the inputs
.braintree-form-inputs {
	margin: 0;
	padding: 0;
	line-height: rem-calc(40);
	font-size: 1rem;
}

.braintree-holder {
	margin-top: rem-calc(25);

	// We control wrapping form and input container styles
	#braintree-payment-form {
		padding: 0 1rem;

		label {
			font-size: 1rem;
			color: $charcoal;
			text-align: left;
		}

		// could not get this style to apply on focused state without the !important
		.braintree-hosted-fields-focused {
			border: 1px solid $charcoal !important;
		}

		.braintree-hosted-fields-invalid {
			background-color: $error-red !important;
		}

		// Hosted Field input wrappers + input customization declarations
		// > Our divs become wrappers around injected iframes containing input fields
		.kv-braintree-wrapper {
			height: rem-calc(40);
			background: $ghost; //#fafafa
			border: 1px solid $subtle-gray;
			color: $kiva-text-dark;
			margin: 0 0 1.25rem;
			padding: 0 rem-calc(8);
			border-radius: $form-border-radius;

			[type=number],
			[type=text] {
				background: transparent;
				box-shadow: none;
				padding: 0;
				margin: 0;
			}
		}

		.cvv-label {
			margin: 0 0.9375rem;
		}

		// specific field wrapper overrides
		// #kv-card-number,
		// #kv-expiration-date,
		// #kv-cvv,
		// #kv-postal-code
		#kv-cvv {
			margin: 0 rem-calc(15);
		}

		#braintree-submit {
			width: 100%;
			margin-top: 0.8rem;

			.icon-lock {
				height: rem-calc(20);
				width: rem-calc(20);
				fill: white;
				top: rem-calc(3);
				position: relative;
				margin-right: rem-calc(8);
			}
		}
	}
}
</style>
