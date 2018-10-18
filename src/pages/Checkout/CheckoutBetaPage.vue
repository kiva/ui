<template>
	<www-page>
		<div id="checkout-slim" class="row page-content">
			<div class="columns">
				<div v-if="!emptyBasket" class="login-wrap">
					<div class="checkout-step">
						<hr>
						<span class="number-icon number-1">1</span>
					</div>

					<div v-if="!isLoggedIn" class="login-reg-holder row align-center">
						<div class="columns small-12 medium-8 large-11 xxlarge-9 login-reg-header">
							<h3 v-if="showLogin">Login to complete your loan</h3>
							<h3 v-else>Register to complete your loan</h3>
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

							<!-- <p class="social-callout">We won’t ever post without asking.</p> -->

							<facebook-login-register
								:process-type="showLogin ? 'login' : 'register'"
								@fb-loading="setLoginLoading" />

							<p class="social-callout">We won’t ever post without asking.</p>

							<div v-if="showReg" class="login-reg-switch">
								<!-- FECK 196 redirect existing users to legacy basket -->
								<!-- TODO: replace href with @click.prevent="switchToLogin" for existing users -->
								<!-- TODO: revert event to v-kv-track-event="['register', 'alreadyMemberLnk']" -->
								<p>Already have an account? <br><a
									href="/basket?kexpn=checkout_beta.minimal_checkout&kexpv=a"
									v-kv-track-event="['checkout', 'sign in click', 'exit to legacy']"
									id="loginLink">Sign in</a></p>
							</div>

							<div class="login-reg-switch">
								<p><a v-if="showLogin" class="register-link text-center"
									v-kv-track-event="['Login', 'click-Sign-up-register', 'SignupForKivaClick']"
									@click.prevent="switchToRegister">
									Sign up for Kiva
								</a></p>
							</div>
						</div>
						<loading-overlay v-if="loginLoading" id="loading-overlay" />
					</div>

					<div v-else class="login-reg-complete">
						<p class="featured-text">Thanks for registering!<br>
							Please continue below to complete your purchase.</p>
					</div>
				</div>

				<div v-if="!emptyBasket" class="basket-wrap">
					<div>
						<div v-if="!emptyBasket" class="checkout-step">
							<hr>
							<span class="number-icon number-2">2</span>
						</div>

						<basket-items-list
							:loans="loans"
							:donations="donations"
							@refreshtotals="refreshTotals($event)"
							@updating-totals="setUpdatingTotals"
						/>
						<hr>

						<kiva-card-redemption
							:credits="redemption_credits"
							:totals="totals"
							@refreshtotals="refreshTotals"
							@updating-totals="setUpdatingTotals" />

						<hr>

						<order-totals
							:totals="totals"
							@refreshtotals="refreshTotals"
							@updating-totals="setUpdatingTotals" />

						<div v-if="isLoggedIn" class="checkout-actions">
							<pay-pal-exp
								v-if="showPayPal"
								:amount="creditNeeded"
								@updating-totals="setUpdatingTotals" />

							<kv-button
								v-else
								type="submit"
								class="smaller checkout-button"
								v-kv-track-event="['payment.continueBtn']"
								title="Checkout using your Kiva credit"
								@click.prevent.native="validateCreditBasket">Complete order</kv-button>
						</div>

						<loading-overlay v-if="updatingTotals" id="updating-overlay" class="updating-totals-overlay" />
					</div>

					<div v-if="!isLoggedIn" class="container basket-overlay-bg"></div>
					<div v-if="!isLoggedIn" @click="overlayMouseover"
						class="basket-overlay-fg">
						<div class="basket-overlay row align-center align-middle"
							:class="{ unhovered: !isHovered }">
							<p class="columns small-11 medium-6 xlarge-5 text-center">
								Please register or sign in above to complete your purchase.</p>
						</div>
					</div>
				</div>

				<div v-if="emptyBasket" class="empty-basket">
					<p class="featured-text">Oops — Your basket is empty!</p>
					<p>Your basket is empty, but we'd love to help you find a borrower to support.<br><br>
						<a href="/lend-by-category">Browse by category</a> or
						<a href="/lend">see all loans.</a>
					</p>
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import _filter from 'lodash/filter';
import WwwPage from '@/components/WwwFrame/WwwPage';
import validateItemsAndCredits from '@/graphql/mutation/shopValidateItemsAndCredits.graphql';
import initializeCheckout from '@/graphql/query/checkout/initializeCheckout.graphql';
import shopBasketUpdate from '@/graphql/query/checkout/shopBasketUpdate.graphql';
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
			donations: [],
			redemption_credits: [],
			totals: {},
			updatingTotals: false,
			showReg: true,
			showLogin: false,
			loginLoading: false,
			isHovered: false,
			activeLoginDuration: 3600,
			lastActiveLogin: 0,
			preCheckoutStep: '',
			preValidationErrors: []
		};
	},
	apollo: {
		query: initializeCheckout,
		// using the prefetch function form allows us to act on data before the page loads
		preFetch(config, client) {
			return client.query({
				query: initializeCheckout
			}).then(({ data }) => {
				const hasFreeCredits = _get(data, 'shop.basket.hasFreeCredits');
				// check for free credit, bonus credit or lending rewards and redirect if present
				// IMPORTANT: THIS IS DEPENDENT ON THE CheckoutBeta Experiment
				// TODO: remove once bonus credit functionality is added
				if (hasFreeCredits) {
					// cancel the promise, returning a route for redirect
					return Promise.reject({
						path: '/basket',
						query: {
							kexpn: 'checkout_beta.minimal_checkout',
							kexpv: 'a'
						}
					});
				}
				return data;
			});
		},
		result({ data }) {
			this.myBalance = _get(data, 'my.userAccount.balance');
			this.myId = _get(data, 'my.userAccount.id');
			this.totals = _get(data, 'shop.basket.totals');
			this.loans = _filter(_get(data, 'shop.basket.items.values'), { __typename: 'LoanReservation' });
			this.donations = _filter(_get(data, 'shop.basket.items.values'), { __typename: 'Donation' });
			this.redemption_credits = _filter(
				_get(data, 'shop.basket.credits.values'),
				{ __typename: 'Credit', creditType: 'redemption_code' }
			);
			this.activeLoginDuration = parseInt(_get(data, 'general.activeLoginDuration.value'), 10) || 3600;
			this.lastActiveLogin = parseInt(_get(data, 'my.lastActiveLogin.data'), 10) || 0;
		}
	},
	created() {
		// if we have a user id but are not actively logged in
		if (this.myId !== null && this.myId !== undefined && !this.isActivelyLoggedIn) {
			this.switchToLogin();
		}
	},
	mounted() {
		// fire tracking event when the page loads
		// - this event will be duplicated when the page reloads with a newly registered/logged in user
		let userStatus = this.isLoggedIn ? 'Logged-In' : 'Un-Authenticated';
		if (this.isActivelyLoggedIn) {
			userStatus = 'Actively Logged-In';
		}
		this.$kvTrackEvent('Checkout', 'EXP-Checkout-Loaded', userStatus);

		// Run our validate items method once in the client
		this.validateItems();
	},
	computed: {
		isLoggedIn() {
			if (this.myId !== null && this.myId !== undefined && this.isActivelyLoggedIn) {
				return true;
			}
			return false;
		},
		isActivelyLoggedIn() {
			const lastLogin = (parseInt(this.lastActiveLogin, 10) * 1000) || 0;

			if (lastLogin + (this.activeLoginDuration * 1000) > Date.now()) {
				return true;
			}
			return false;
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
		},
	},
	methods: {
		validateItems() {
			this.apollo.mutate({
				mutation: validateItemsAndCredits,
			}).then(result => {
				// retrieve any errors from the cache
				const errorArray = _get(result, 'data.shop.validateItemsAndCredits');
				if (errorArray !== 'undefined' && errorArray.length > 0) {
					console.error(errorArray);
					// store these
					this.preValidationErrors = errorArray;
					// refresh the basket to remove items
					this.refreshTotals();

					let errorMessages = '';
					// When validation or checkout fails and errors object is returned along with the data
					errorArray.forEach(({ value }) => {
						const errorMessage = value;

						// Handle multiple errors
						if (errorMessages !== '') {
							errorMessages = `${errorMessages} | ${errorMessage}`;
						} else {
							errorMessages = errorMessage;
						}
					});
					this.$showTipMsg(errorMessages, 'warning');
				}
			});
		},
		validateCreditBasket() {
			this.$kvTrackEvent('basket', 'Kiva Checkout', 'Button Click');
			this.setUpdatingTotals(true);
			this.validateBasket()
				.then(validationStatus => {
					if (validationStatus === true) {
						// succesful validation
						this.checkoutCreditBasket();
					} else {
						// validation failed
						this.setUpdatingTotals(false);
						this.showCheckoutError(validationStatus);
					}
				}).catch(errorResponse => {
					this.setUpdatingTotals(false);
					console.error(errorResponse);
				});
		},
		checkoutCreditBasket() {
			this.checkoutBasket()
				.then(transactionResult => {
					if (typeof transactionResult !== 'object') {
						// succesful validation
						this.$kvTrackEvent('basket', 'Kiva Checkout', 'Success', transactionResult);
						this.redirectToThanks(transactionResult);
					} else {
						// checkout failed
						this.setUpdatingTotals(false);
						this.showCheckoutError(transactionResult);
					}
				}).catch(errorResponse => {
					this.setUpdatingTotals(false);
					console.error(errorResponse);
				});
		},
		refreshTotals(refreshEvent) {
			this.setUpdatingTotals(true);

			this.apollo.query({
				query: shopBasketUpdate,
				fetchPolicy: 'network-only'
			}).then(({ data }) => {
				// when updating basket state, check for free credits and redirect if present
				const hasFreeCredits = _get(data, 'shop.basket.hasFreeCredits');
				if (hasFreeCredits) {
					if (refreshEvent === 'kiva-card-applied') {
						this.$kvTrackEvent('checkout', 'free credits applied', 'exit to legacy');
					}
					this.$router.push({
						path: '/basket',
						query: {
							kexpn: 'checkout_beta.minimal_checkout',
							kexpv: 'a'
						}
					});
				} else {
					this.setUpdatingTotals(false);
				}
			}).catch(response => {
				console.error(`failed to update totals: ${response}`);
				this.setUpdatingTotals(false);
			});
		},
		setUpdatingTotals(state) {
			this.updatingTotals = state;
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
		},
		overlayMouseover() {
			this.isHovered = !this.isHovered;
		},
		// Called from beforeRouteEnter with query param object
		updatePreCheckoutStep(query) {
			// Force showing either Login or Reg Form
			if (query && query.login === 'true') {
				this.preCheckoutStep = 'login';
				this.switchToLogin();
			} else if (query && query.register === 'true') {
				this.preCheckoutStep = 'register';
				this.switchToRegister();
			}
			// TODO: FUTURE hide Reg or Login form if user is already logged in
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.updatePreCheckoutStep(to.query);
		});
	},
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;

	// loading overlay overrides
	#loading-overlay,
	#updating-overlay {
		background-color: rgba(255, 255, 255, 0.7);
		z-index: 500;
	}

	#updating-overlay {
		margin-top: 2rem;
		height: auto;
		bottom: 0;
	}

	.checkout-step {
		position: relative;
		text-align: center;
		height: 2rem;
		display: block;
		margin: 1rem 0 1.5rem;

		hr {
			border-bottom: 1px solid $light-gray;
			margin: 2.5rem 0;
		}

		span {
			display: block;
			margin: -4.2rem auto 0;
			width: 3.4rem;
			height: 3.4rem;

			&.number-icon {
				background: $white;
				color: $light-gray;
				border: 1px solid $light-gray;
				border-radius: 1.7rem;
				font-size: 1.7rem;
				text-align: center;
				line-height: 3.3rem;
			}
		}
	}

	.login-wrap {
		padding-bottom: 2.5rem;
	}

	.login-reg-holder {
		position: relative;

		.login-reg-header {
			h3 {
				font-size: $featured-text-font-size;
				font-weight: $global-weight-highlight;

				@include breakpoint(large only) {
					max-width: 47%;
				}
			}
		}

		.v-divider {
			width: 1px;
			height: 100%;
			background: $light-gray;
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
				font-weight: $global-weight-highlight;
			}
		}

		.social-callout {
			text-align: center;
			line-height: 1.3;
			margin-bottom: 2rem;
		}

		.login-reg-switch {
			text-align: center;
			font-size: 1.3rem;
			font-weight: $global-weight-highlight;

			/* turned off for now */
			// @include breakpoint(large) {
			// 	text-align: left;
			// 	position: absolute;
			// 	bottom: 0;
			// 	font-weight: $global-weight-highlight;
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
		position: relative;
		padding-bottom: 0.5rem;

		.totals-and-actions {
			display: block;
			position: relative;

			.updating-totals-overlay {
				z-index: 1000;
			}
		}

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

		.basket-overlay-bg {
			display: block;
			position: absolute;
			top: 3rem;
			right: 0;
			left: 0;
			bottom: 0;
			z-index: 100;
			opacity: 0.7;
			background-image: url('../../assets/images/backgrounds/lines.png');
			background-color: $white;
		}

		.basket-overlay-fg {
			display: block;
			position: absolute;
			top: 3rem;
			right: 0;
			left: 0;
			bottom: 0;
			z-index: 110;

			.basket-overlay {
				position: relative;
				top: 10%;

				@include breakpoint(medium) {
					top: 20%;
				}

				@include breakpoint(large) {
					top: 30%;
				}

				p {
					font-size: 1.25rem;
					line-height: 1.5;
					color: $kiva-text-medium;
					padding: 1.6rem;
					border: 1px solid $kiva-text-light;
					background: $white;
				}
			}

			.unhovered {
				display: none;
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
