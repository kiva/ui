<template>
	<www-page>
		<div id="checkout-slim" class="row page-content">
			<div class="columns">
				<ul>
					<li v-for="loan in loans" :key="loan.id">
						<img :src="loan.loan.image.url" :alt="loan.loan.name">
						{{ loan.loan.name }} {{ loan.price }}
					</li>
					<li v-for="donation in donations" :key="donation.id">
						{{ donation.price }}
					</li>
				</ul>
				<br>
				<hr>
				<pay-pal-exp :amount="totals.creditAmountNeeded" />
				<br>
				<hr>
				<register-form :refresh="true" />
				<br>
				<hr>
				<router-link to="/ui-site-map">Site Map</router-link>
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import _filter from 'lodash/filter';
// import _map from 'lodash/map';
import WwwPage from '@/components/WwwFrame/WwwPage';
import initializeCheckout from '@/graphql/query/initializeCheckout.graphql';
import PayPalExp from '@/components/Checkout/PayPalExpress';
import RegisterForm from '@/components/Forms/RegisterForm';

export default {
	components: {
		WwwPage,
		PayPalExp,
		RegisterForm
	},
	inject: ['apollo'],
	metaInfo: {
		title: 'Checkout',
		// script: [
		// 	{ type: 'text/javascript', src: 'https://www.paypalobjects.com/api/checkout.js' }
		// ]
	},
	data() {
		return {
			currentStep: 'basket',
			loans: () => {},
			totals: () => {},
			donations: () => {}
		};
	},
	apollo: {
		query: initializeCheckout,
		prefetch: true,
		result({ data }) {
			console.log(data);
			this.totals = _get(data, 'shop.basket.totals');
			this.loans = _filter(_get(data, 'shop.basket.items.values'), { __typename: 'LoanReservation' });
			this.donations = _filter(_get(data, 'shop.basket.items.values'), { __typename: 'Donation' });
		}
	},
	methods: {

	},
	computed: {
	}
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
