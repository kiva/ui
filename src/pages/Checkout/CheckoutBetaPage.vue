<template>
	<www-page>
		<div id="checkout-slim" class="row page-content">
			<div class="columns">
				<div v-if="!emptyBasket" class="login-wrap">
					<br>
					<hr>
					<br>
					<div v-if="!isLoggedIn" class="login-reg-holder row align-center">
						<div class="columns small-12 medium-8 large-11 xxlarge-9 login-reg-header">
							<h2 v-if="showLogin">Login to Checkout</h2>
							<h2 v-else>Register to Checkout</h2>
						</div>

						<div class="columns small-12 medium-8 large-5 xxlarge-4">
							<login-form v-if="showLogin" :refresh="true" @login-loading="setLoginLoading" />
							<register-form v-if="showReg" :refresh="true" @reg-loading="setLoginLoading" />
						</div>

						<div class="columns show-for-large large-1">
							<div class="v-divider"></div>
						</div>

						<div class="columns small-12 medium-8 large-5 xxlarge-4">
							<div class="or-callout">
								<hr>
								<span>Or</span>
							</div>

							<p class="social-callout">Connect using a social network.<br>
								We won’t ever post without asking.</p>

							<facebook-login-register
								:process-type="showLogin ? 'login' : 'register'"
								@fb-loading="setLoginLoading" />

							<div v-if="showReg" class="login-reg-switch">
								<p class="featured-text">Already have an account? <br><a
									@click.prevent="switchToLogin"
									v-kv-track-event="['register', 'alreadyMemberLnk']"
									id="loginLink">Sign in</a></p>
							</div>

							<div class="login-reg-switch">
								<p class="featured-text"><a v-if="showLogin" class="register-link text-center"
									v-kv-track-event="['Login', 'click-Sign-up-register', 'SignupForKivaClick']"
									@click.prevent="switchToRegister">
									Sign up for Kiva
								</a></p>
							</div>
						</div>
						<loading-overlay v-if="loginLoading" />
					</div>

					<div v-else class="login-reg-complete">
						<p class="featured-text">Thanks for registering!<br>
							Please continue below to complete your purchase.</p>
					</div>
				</div>

				<div class="basket-wrap">
					<div v-if="!emptyBasket">
						<br>
						<hr>
						<br>

						<basket-items-list
							:loans="loans"
							:donations="donations"
							@refreshtotals="refreshTotals($event)"
						/>

						<kiva-card-redemption />
						<hr>

						<order-totals :totals="totals" @refreshtotals="refreshTotals" />

						<div v-if="isLoggedIn" class="checkout-actions">
							<pay-pal-exp
								v-if="showPayPal"
								:amount="creditNeeded" />

							<kv-button
								v-else
								type="submit"
								class="smaller checkout-button"
								v-kv-track-event="['payment.continueBtn']"
								title="Checkout using your Kiva credit"
								@click.prevent.native="validateCreditBasket">Complete order</kv-button>
						</div>
					</div>

					<div v-else class="empty-basket">
						<p class="featured-text">Oops — Your basket is empty!</p>
						<p>Your basket is empty, but we'd love to help you find a borrower to support.<br><br>
							<a href="/lend-by-category">Browse by category</a> or
							<a href="/lend">see all loans.</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import _filter from 'lodash/filter';
import WwwPage from '@/components/WwwFrame/WwwPage';
import initializeCheckout from '@/graphql/query/initializeCheckout.graphql';
import shopTotals from '@/graphql/query/checkout/shopTotals.graphql';
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import PayPalExp from '@/components/Checkout/PayPalExpress';
import KvButton from '@/components/Kv/KvButton';
import OrderTotals from '@/components/Checkout/OrderTotals';
import LoginForm from '@/components/Forms/LoginForm';
import RegisterForm from '@/components/Forms/RegisterForm';
import FacebookLoginRegister from '@/components/Forms/FacebookLoginRegister';
import BasketItemsList from '@/components/Checkout/BasketItemsList';
import KivaCardRedemption from '@/components/Checkout/KivaCardRedemption';
import LoadingOverlay from '@/pages/Lend/LoadingOverlay';

export default {
	components: {
		WwwPage,
		PayPalExp,
		KvButton,
		OrderTotals,
		LoginForm,
		RegisterForm,
		FacebookLoginRegister,
		BasketItemsList,
		KivaCardRedemption,
		LoadingOverlay
	},
	inject: ['apollo'],
	mixins: [
		checkoutUtils
	],
	metaInfo: {
		title: 'Checkout'
	},
	data() {
		return {
			myBalance: null,
			myId: null,
			currentStep: 'basket',
			loans: [],
			totals: () => {},
			donations: [],
			loading: false,
			showReg: true,
			showLogin: false,
			loginLoading: false,
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
			return (this.myId !== null && this.myId !== undefined);
		},
		creditNeeded() {
			return this.totals.creditAmountNeeded || '0.00';
		},
		showPayPal() {
			return parseFloat(this.creditNeeded) > 0;
		},
		emptyBasket() {
			if (this.loans.length === 0 && parseFloat(_get(this.donations, '[0].price')) === 0) {
				return true;
			}
			return false;
		}
	},
	methods: {
		validateCreditBasket() {
			this.validateBasket()
				.then(validationStatus => {
					if (validationStatus === true) {
						// succesful validation
						this.checkoutCreditBasket();
					} else {
						// validation failed
						this.showCheckoutError(validationStatus);
					}
				}).catch(errorResponse => {
					console.error(errorResponse);
				});
		},
		checkoutCreditBasket() {
			this.checkoutBasket()
				.then(transactionResult => {
					if (typeof transactionResult !== 'object') {
						// succesful validation
						this.redirectToThanks(transactionResult);
					} else {
						// checkout failed
						this.showCheckoutError(transactionResult);
					}
				}).catch(errorResponse => {
					console.error(errorResponse);
				});
		},
		refreshTotals(payload) {
			// We may use payload in managing/refreshing basket state
			console.log(payload);
			this.apollo.query({
				query: shopTotals,
				fetchPolicy: 'network-only'
			}).then(data => {
				this.totals = _get(data, 'data.shop.basket.totals');
			}).catch(response => {
				console.error(`failed to update totals: ${response}`);
			});
		},
		switchToRegister() {
			this.showReg = true;
			this.showLogin = false;
		},
		switchToLogin() {
			this.showReg = false;
			this.showLogin = true;
		},
		setLoginLoading(state) {
			this.loginLoading = state;
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;

	// loading overlay overrides
	.loading-overlay {
		background-color: rgba(255, 255, 255, 0.7);
	}

	.login-reg-holder {
		position: relative;

		.login-reg-header {
			font-weight: 400;
		}

		.v-divider {
			width: 1px;
			height: 100%;
			background: $subtle-gray;
			margin: 0 auto;
		}

		.or-callout {
			position: relative;
			text-align: center;

			hr {
				border-bottom: 2px solid $kiva-text-dark;
				margin-right: 2rem;
				margin-left: 2rem;
			}

			span {
				margin: -3.125rem auto 0;
				background: $white;
				padding: 1rem;
				display: block;
				width: fit-content;
				text-transform: uppercase;
				font-style: italic;
				font-weight: 400;
			}
		}

		.social-callout {
			text-align: center;
			line-height: 1.3;
			margin-bottom: 2rem;
		}

		#facebook-register {
			margin-bottom: 2rem;
		}

		.login-reg-switch {
			text-align: center;

			/* turned off for now */
			// @include breakpoint(large) {
			// 	text-align: left;
			// 	position: absolute;
			// 	bottom: 0;
			// 	font-weight: 400;
			// }
		}
	}

	.login-reg-complete {
		p {
			text-align: center;
			color: $kiva-text-light;
		}
	}

	.basket-wrap {
		.checkout-actions {
			margin: $list-side-margin;

			.checkout-button {
				width: 100%;
			}

			@include breakpoint(medium) {
				text-align: right;

				.checkout-button {
					width: auto;
				}
			}
		}
	}

	.empty-basket {
		text-align: center;
	}
}

// Hide Basket Bar (this won't work with scoped)
.basket-bar {
	display: none;
}
</style>
