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
// import _get from 'lodash/get';
// import numeral from 'numeral';
// import Raven from 'raven-js';
// import checkoutUtils from "@/plugins/checkout-utils-mixin";

// import getClientToken from '@/graphql/query/checkout/getClientToken.graphql';
// import braintreeDepositAndCheckout from '@/graphql/mutation/braintreeDepositAndCheckout.graphql';

export default {
	inject: ["apollo"],
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
			braintreeScript.src = 'https://js.braintreegateway.com/web/3.42.0/js/client.min.js';
		}
		return {
			script: [braintreeScript]
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

			// const form = document.querySelector('#braintree-form');
			// const submit = document.querySelector('#braintree-form-submit');

			braintree.client.create(
				{ authorization: 'CLIENT_AUTHORIZATION' },
				(clientErr, clientInstance) => {
					if (clientErr) {
						// Handle error in client creation
						return;
					}

					const options = {
						client: clientInstance,
						styles: {
							input: { "font-size": "14px" }, // eslint-disable-line
							"input.invalid": { color: "red" }, // eslint-disable-line
							"input.valid": { color: "green" } // eslint-disable-line
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
							expirationDate: {
								selector: '#expiration-date',
								placeholder: '10/2019'
							}
						}
					};

					braintree.hostedFields.create(options, (hostedFieldsErr, hostedFieldsInstance) => {
						if (hostedFieldsErr) {
							console.error(hostedFieldsErr);
							console.error(hostedFieldsInstance);
							return false;
						}
					});
				}
			);
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
