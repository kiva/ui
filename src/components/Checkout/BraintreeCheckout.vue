<template>
	<!-- Taken from: https://codepen.io/braintree/pen/MyzXqG -->
	<div class="panel panel-default bootstrap-basic">
		<div class="panel-heading">
			<h3 class="panel-title">Enter Card Details</h3>
		</div>
		<form class="panel-body">
			<div class="row">
				<div class="form-group small-8 columns">
					<label class="control-label">Card Number</label>
					<!--  Hosted Fields div container -->
					<div class="form-control" id="card-number"></div>
					<span class="helper-text"></span>
				</div>
				<div class="form-group small-4 columns">
					<div class="row">
						<label class="control-label small-12c">Expiration Date</label>
						<div class="small-6">
							<!--  Hosted Fields div container -->
							<div class="form-control" id="expiration-month"></div>
						</div>
						<div class="small-6">
							<!--  Hosted Fields div container -->
							<div class="form-control" id="expiration-year"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="form-group small-6 columns">
					<label class="control-label">Security Code</label>
					<!--  Hosted Fields div container -->
					<div class="form-control" id="cvv"></div>
				</div>
				<div class="form-group small-6 columns">
					<label class="control-label">Zipcode</label>
					<!--  Hosted Fields div container -->
					<div class="form-control" id="postal-code"></div>
				</div>
			</div>

			<button value="submit" id="submit" class="button center-block">
				Pay with
				<span id="card-type">Card</span>
			</button>
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
// import braintreeDepositAndCheckout from '@/graphql/mutation/braintreeDepositAndCheckout.graphql';

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
		// this.initializeBraintree();

		this.getClientToken();
	},
	watch: {
		// amount() {
		// 	this.initializeBraintree();
		// },
		clientToken() {
			this.initializeBraintree();
		}
	},
	methods: {
		getClientToken() {
			this.apollo.query({
				query: getClientToken,
				variables: {
					amount: numeral(this.amount).format('0.00'),
				}
			}).then(response => {
				console.log(response);
				// if (response.errors) {
				// 	this.setUpdating(false);
				// 	reject(response);
				// } else {
				// 	const paymentToken = _get(response, 'data.shop.getPaymentToken');
				// 	resolve(paymentToken || response);
				// }
				this.clientToken = _get(response, 'data.shop.getClientToken');
				// eslint-disable-next-line
				console.log('this is the client token' + this.clientToken);
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
			// clear ensurePaypal interval
			window.clearInterval(this.ensureBraintreeScript);
			// signify we've already rendered
			this.braintreeRendered = true;


			// render braintree form
			braintree.client.create({
				authorization: this.clientToken
			}, (err, clientInstance) => {
				if (err) {
					console.error(err);
					return;
				}
				// eslint-disable-next-line
				braintree.hostedFields.create({
					client: clientInstance,
					styles: {
						input: {
							'font-size': '14px',
							'font-family': 'helvetica, tahoma, calibri, sans-serif',
							color: '#3a3a3a'
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
							placeholder: 'YY'
						},
						postalCode: {
							selector: '#postal-code',
							placeholder: '90210'
						}
					}
				}, (hostedFieldsErr, hostedFieldsInstance) => {
					if (hostedFieldsErr) {
						console.error(err);
						return;
					}
					// eslint-disable-next-line
					// hostedFieldsInstance.on('validityChange', function (event) {
					// 	const field = event.fields[event.emittedBy];

					// 	if (field.isValid) {
					// 		if (event.emittedBy === 'expirationMonth' || event.emittedBy === 'expirationYear') {
					// 			eslint-disable-next-line
					// if (!event.fields.expirationMonth.isValid || !event.fields.expirationYear.isValid) {
					// 				return;
					// 			}
					// 		} else if (event.emittedBy === 'number') {
					// 			$('#card-number').next('span').text('');
					// 		}

					// 		// Remove any previously applied error or warning classes
					// 		$(field.container).parents('.form-group').removeClass('has-warning');
					// 		$(field.container).parents('.form-group').removeClass('has-success');
					// 		// Apply styling for a valid field
					// 		$(field.container).parents('.form-group').addClass('has-success');
					// 	} else if (field.isPotentiallyValid) {
					// 		// Remove styling  from potentially valid fields
					// 		$(field.container).parents('.form-group').removeClass('has-warning');
					// 		$(field.container).parents('.form-group').removeClass('has-success');
					// 		if (event.emittedBy === 'number') {
					// 			$('#card-number').next('span').text('');
					// 		}
					// 	} else {
					// 		// Add styling to invalid fields
					// 		$(field.container).parents('.form-group').addClass('has-warning');
					// 		// Add helper text for an invalid card number
					// 		if (event.emittedBy === 'number') {
					// 			$('#card-number').next('span').text('Looks like
					// this card number has an error.');
					// 		}
					// 	}
					// });
					// eslint-disable-next-line
					hostedFieldsInstance.on('cardTypeChange', function (event) {
						// Handle a field's change, such as a change in validity or credit card type
						// if (event.cards.length === 1) {
						// 	$('#card-type').text(event.cards[0].niceType);
						// } else {
						// 	$('#card-type').text('Card');
						// }
					});

					// eslint-disable-next-line
					// $('.panel-body').submit(function (event) {
					// 	event.preventDefault();
					// 	// eslint-disable-next-line
					// 	hostedFieldsInstance.tokenize(function (err, payload) {
					// 		if (err) {
					// 			console.error(err);
					// 			return;
					// 		}
					// 		// This is where you would submit payload.nonce to your server
					// 		alert('Submit your nonce to your server here!');
					// 	});
					// });
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

	@include breakpoint(medium) {
		text-align: right;
	}
}
</style>
