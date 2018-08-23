<template>
	<www-page>
		<div id="checkout-slim" class="row page-content">
			<div class="columns">
				<facebook-login-register />
				<register-form v-if="!isLoggedIn" :refresh="true" />
				<br>
				<hr>
				<br>
				<basket-items-list
					:loans="loans"
					:donations="donations" />
				<br>
				<hr>
				<br>
				<pay-pal-exp v-if="isLoggedIn" :amount="totals.creditAmountNeeded" />
				<br>
				<hr>
				<br>
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
<<<<<<< HEAD
import FacebookLoginRegister from '@/components/Forms/FacebookLoginRegister';
=======
import BasketItemsList from '@/components/Checkout/BasketItemsList';
>>>>>>> master

export default {
	components: {
		WwwPage,
		PayPalExp,
		RegisterForm,
<<<<<<< HEAD
		FacebookLoginRegister
=======
		BasketItemsList
>>>>>>> master
	},
	inject: ['apollo'],
	metaInfo: {
		title: 'Checkout',
	},
	data() {
		return {
			myBalance: undefined,
			myId: undefined,
			currentStep: 'basket',
			loans: [],
			totals: () => {},
			donations: []
		};
	},
	apollo: {
		query: initializeCheckout,
		prefetch: true,
		result({ data }) {
			console.log(data);
			this.myBalance = _get(data, 'my.userAccount.balance');
			this.myId = _get(data, 'my.userAccount.id');
			this.totals = _get(data, 'shop.basket.totals');
			this.loans = _filter(_get(data, 'shop.basket.items.values'), { __typename: 'LoanReservation' });
			this.donations = _filter(_get(data, 'shop.basket.items.values'), { __typename: 'Donation' });
		}
	},
	computed: {
		isLoggedIn() {
			return this.myId !== undefined;
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
