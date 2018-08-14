<template>
	<div class="paypal-holder">
		<div id="paypal-button" ref="paypalbutton"></div>
	</div>
</template>

<script>
/* global paypal */
import getPaymentToken from '@/graphql/query/checkout/getPaymentToken.graphql';

export default {
	inject: ['apollo'],
	props: {
		amount: {
			type: String,
			default: ''
		}
	},
	metaInfo: {
		title: 'Checkout',
		script: [
			{ type: 'text/javascript', src: 'https://www.paypalobjects.com/api/checkout.js', async: true }
		]
	},
	mounted() {
		console.log('paypal express component mounted');
		// this.initializePaypal();
	},
	methods: {
		initializePaypal() {
			// ensure paypal is loaded before calling
			// Server render is fine
			// Init from Mounted Hook when navigating from Ui Page fails as paypal checkout.js is still loading...
			const vm = this;
			console.log('mounted');
			console.log(window.paypal);
			if (typeof paypal !== 'undefined') {
				paypal.Button.render(
					{
						env: 'sandbox',
						commit: true,
						payment: () => {
							console.log('payment stage');
							return new paypal.Promise((resolve, reject) => {
								vm.apollo.query({
									query: getPaymentToken
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
	}
};
</script>

<style lang="scss">
	.paypal-holder {
		display: block;
	}
</style>
