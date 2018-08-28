<template>
	<www-page>
		<div id="checkout-slim" class="row page-content">
			<div class="columns">
				<div v-if="!isLoggedIn" class="login-reg-holder row">
					<div class="columns medium-6">
						<login-form v-if="showLogin" :refresh="true" />
						<register-form v-if="showReg" :refresh="true" />
					</div>
					<div class="columns medium-6">
						<facebook-login-register />
						<div v-if="showReg" class="switch-to-login text-center">
							Already have an account? <a
								@click.prevent.stop="switchToLogin"
								v-kv-track-event="['register', 'alreadyMemberLnk']"
								id="loginLink">Sign in</a>
							<hr>
						</div>
						<p class="text-center">
							<a v-if="showLogin" class="register-link text-center"
								v-kv-track-event="'Login|click-Sign-up-register|SignupForKivaClick'"
								@click.prevent.stop="switchToRegister">
								Sign up for Kiva
							</a>
						</p>
					</div>
				</div>
				<br>
				<hr>
				<br>
				<basket-items-list
					:loans="loans"
					:donations="donations" />
				<br>
				<hr>
				<order-totals :totals="totals" />
				<hr>
				<br>
				<pay-pal-exp v-if="isLoggedIn" :amount="totals.creditAmountNeeded" />
				<br>

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
import OrderTotals from '@/components/Checkout/OrderTotals';
import LoginForm from '@/components/Forms/LoginForm';
import RegisterForm from '@/components/Forms/RegisterForm';
import FacebookLoginRegister from '@/components/Forms/FacebookLoginRegister';
import BasketItemsList from '@/components/Checkout/BasketItemsList';

export default {
	components: {
		WwwPage,
		PayPalExp,
		OrderTotals,
		LoginForm,
		RegisterForm,
		FacebookLoginRegister,
		BasketItemsList
	},
	inject: ['apollo'],
	metaInfo: {
		title: 'Checkout'
	},
	data() {
		return {
			myBalance: undefined,
			myId: undefined,
			currentStep: 'basket',
			loans: [],
			totals: () => {},
			donations: [],
			loading: false,
			showReg: false,
			showLogin: true,
		};
	},
	apollo: {
		query: initializeCheckout,
		preFetch: true,
		result({ data, loading }) {
			if (loading) {
				this.loading = true;
			}
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
	},
	methods: {
		switchToRegister() {
			this.showReg = true;
			this.showLogin = false;
		},
		switchToLogin() {
			this.showReg = false;
			this.showLogin = true;
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}

// Hide Basket Bar
.basket-bar {
	display: none;
}
</style>
