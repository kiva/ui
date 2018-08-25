<template>
	<div class="paypal-holder">
		<div id="paypal-button" ref="paypalbutton"></div>
	</div>
</template>

<script>
/* global paypal */
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
			ensurePaypal: null
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
			this.ensurePaypal = window.setInterval(() => {
				if (typeof paypal !== 'undefined') {
					this.renderPaypalButton();
				}
			}, 200);
		},
		renderPaypalButton() {
			// clear ensurePaypal interval
			window.clearInterval(this.ensurePaypal);
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
									if (ppResponse.errors) {
										// Transaction is complete
										// Currently returns error from findAccountForIpn
										// "Can not process without account id"
										console.log(ppResponse);

										// redirect to thanks with KIVA transaction id
										// if () {
										// window.location = `/thanks?kiva_transaction_id=${}`;
										// }
									}
									resolve(ppResponse);
								})
								.catch(catchError => {
									console.log(catchError);
									reject(catchError);
								})
								.finally(() => {
									this.loading = false;
								});
						});
					},
					onError: data => {
						console.log(data);
					},
					style: {
						color: 'blue',
						shape: 'rect',
						size: 'large'
					}
				},
				'#paypal-button'
			);
		}
	}
};
</script>

<style lang="scss">
	.paypal-holder {
		display: block;
	}
</style>
