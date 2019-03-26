<template>
	<www-page>
		<div id="checkout-slim" class="row page-content">
			<div class="columns">
				<div v-if="!emptyBasket" class="login-wrap">
					<div v-if="!isLoggedIn || preCheckoutStep" class="checkout-step">
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
								<p>Already have an account? <br><a
									@click.prevent="switchToLogin"
									v-kv-track-event="['Register', 'alreadyMemberLnk']"
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

					<div v-else class="login-reg-complete" :class="{'pre-login': !preCheckoutStep}">
						<p class="featured-text">
							<span v-if="preCheckoutStep === 'register'">Thanks for registering!</span>
							<span v-else>Welcome back!</span><br>
							Please continue below to complete your purchase.</p>
					</div>
					<div v-if="isLoggedIn && !preCheckoutStep" class="pre-login-rule"><hr></div>
				</div>

				<div v-if="!emptyBasket" class="basket-wrap" :class="{'pre-login': !preCheckoutStep}">
					<div>
						<div v-if="!emptyBasket && !isLoggedIn || preCheckoutStep" class="checkout-step">
							<hr>
							<span class="number-icon number-2">2</span>
						</div>

						<basket-items-list
							:loans="loans"
							:donations="donations"
							:kiva-cards="kivaCards"
							:teams="teams"
							:loan-reservation-total="parseInt(totals.loanReservationTotal)"
							@validateprecheckout="validatePreCheckout"
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

						<checkout-holiday-promo
							v-if="holidayModeEnabled"
							@updating-totals="setUpdatingTotals" />

						<order-totals
							:totals="totals"
							@refreshtotals="refreshTotals"
							@updating-totals="setUpdatingTotals" />

						<div v-if="isLoggedIn" class="checkout-actions row">
							<div class="small-12">
								<pay-pal-exp
									v-if="showPayPal && !showBraintree"
									:show-braintree="showBraintree"
									:amount="creditNeeded"
									@refreshtotals="refreshTotals"
									@updating-totals="setUpdatingTotals" />

								<payment-wrapper
									v-if="showBraintree"
									:amount="creditNeeded"
									@refreshtotals="refreshTotals"
									@updating-totals="setUpdatingTotals"
								/>

								<kiva-credit-payment
									v-if="showKivaCreditButton"
									@refreshtotals="refreshTotals"
									@updating-totals="setUpdatingTotals"
									class=" checkout-button" />
							</div>
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
					<h2 class="empty-basket-heading">Your basket is empty!</h2>
					<p>But we'd love to help you change that! Please consider
					supporting one of the borrowers below, or
						<a href="/lend-by-category">browse all loans</a>.
					</p>
				</div>

				<random-loan-selector
					:loans="loans"
					@refreshtotals="refreshTotals($event)"
					@updating-totals="setUpdatingTotals"
					v-if="emptyBasket" />

				<kv-lightbox
					:visible="redirectLightboxVisible"
					@lightbox-closed="redirectLightboxClosed">
					<section>
						<h1>
							This checkout is being tested right now, but doesn't support some functions yet.
						</h1>

						<p>We'll redirect you so you can get back to changing lives, or click here if you aren't
						automatically redirected.</p>

						<p>Thank you for minding our dust.</p>
					</section>

					<kv-button slot="controls"
						class="smaller checkout-button"
						v-kv-track-event="['basket', 'Redirect Continue Button', 'exit to legacy']"
						title="Continue"
						@click.prevent.native="redirectToLegacy">Continue</kv-button>
				</kv-lightbox>
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import _filter from 'lodash/filter';
import cookieStore from '@/util/cookieStore';
import WwwPage from '@/components/WwwFrame/WwwPage';
import initializeCheckout from '@/graphql/query/checkout/initializeCheckout.graphql';
import shopBasketUpdate from '@/graphql/query/checkout/shopBasketUpdate.graphql';
import experimentQuery from '@/graphql/query/lendByCategory/experimentAssignment.graphql';
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import PayPalExp from '@/components/Checkout/PayPalExpress';
import KivaCreditPayment from '@/components/Checkout/KivaCreditPayment';
import KvButton from '@/components/Kv/KvButton';
import OrderTotals from '@/components/Checkout/OrderTotals';
import LoginForm from '@/components/Forms/LoginForm';
import RegisterForm from '@/components/Forms/RegisterForm';
import FacebookLoginRegister from '@/components/Forms/FacebookLoginRegister';
import BasketItemsList from '@/components/Checkout/BasketItemsList';
import KivaCardRedemption from '@/components/Checkout/KivaCardRedemption';
import LoadingOverlay from '@/pages/Lend/LoadingOverlay';
import KvLightbox from '@/components/Kv/KvLightbox';
import { settingEnabled } from '@/util/settingsUtils';
import promoQuery from '@/graphql/query/promotionalBanner.graphql';
import KvIcon from '@/components/Kv/KvIcon';
import CheckoutHolidayPromo from '@/components/Checkout/CheckoutHolidayPromo';
import BraintreeCheckout from '@/components/Checkout/BraintreeCheckout';
import PaymentWrapper from '@/components/Checkout/PaymentWrapper';
import RandomLoanSelector from '@/components/RandomLoanSelector/randomLoanSelector';

export default {
	components: {
		WwwPage,
		PayPalExp,
		KivaCreditPayment,
		KvButton,
		KvLightbox,
		OrderTotals,
		LoginForm,
		RegisterForm,
		FacebookLoginRegister,
		BasketItemsList,
		KivaCardRedemption,
		LoadingOverlay,
		KvIcon,
		CheckoutHolidayPromo,
		BraintreeCheckout,
		PaymentWrapper,
		RandomLoanSelector,
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
			kivaCards: [],
			redemption_credits: [],
			hasFreeCredits: false,
			totals: {},
			updatingTotals: false,
			showReg: true,
			showLogin: false,
			loginLoading: false,
			isHovered: false,
			activeLoginDuration: 3600,
			lastActiveLogin: 0,
			preCheckoutStep: '',
			preValidationErrors: [],
			redirectLightboxVisible: false,
			teams: [],
			holidayModeEnabled: false,
			braintree: false,
			braintreeExpVersion: null
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
				if (hasFreeCredits && typeof window === 'undefined') {
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
			}).then(() => {
				// initialize braintree exp assignment
				return client.query({ query: experimentQuery, variables: { id: 'bt_test' } });
			});
		},
		result({ data }) {
			this.myBalance = _get(data, 'my.userAccount.balance');
			this.myId = _get(data, 'my.userAccount.id');
			this.totals = _get(data, 'shop.basket.totals');
			this.loans = _filter(_get(data, 'shop.basket.items.values'), { __typename: 'LoanReservation' });
			this.donations = _filter(_get(data, 'shop.basket.items.values'), { __typename: 'Donation' });
			this.kivaCards = _filter(_get(data, 'shop.basket.items.values'), { __typename: 'KivaCard' });
			this.redemption_credits = _filter(
				_get(data, 'shop.basket.credits.values'),
				{ __typename: 'Credit', creditType: 'redemption_code' }
			);
			this.hasFreeCredits = _get(data, 'shop.basket.hasFreeCredits');
			this.activeLoginDuration = parseInt(_get(data, 'general.activeLoginDuration.value'), 10) || 3600;
			this.lastActiveLogin = parseInt(_get(data, 'general.lastActiveLogin.data'), 10) || 0;
			this.teams = _get(data, 'my.lender.teams.values');
			this.braintree = _get(data, 'general.braintree_checkout.value') === 'true';
		}
	},
	created() {
		// if we have a user id but are not actively logged in
		if (this.myId !== null && this.myId !== undefined && !this.isActivelyLoggedIn) {
			this.switchToLogin();
		}

		// Check for some page content customizations based on query
		if (this.$route.query
			// use when arriving directly to force showing the login form for with ?login=true
			&& (this.$route.query.login === 'true'
			// The login form refreshes the page with ?login=success, used to show login welcome message
			|| this.$route.query.login === 'success')) {
			this.preCheckoutStep = 'login';
			this.switchToLogin();
		} else if (this.$route.query
			// use when arriving directly to force register form with ?register=true
			&& (this.$route.query.register === 'true'
			// The register form refreshes the page with ?register=success, used to show register welcome message
			|| this.$route.query.register === 'success')) {
			this.preCheckoutStep = 'register';
			this.switchToRegister();
		}

		this.holidayModeEnabled = settingEnabled(
			this.apollo.readQuery({
				query: promoQuery,
				variables: {
					basketId: cookieStore.get('kvbskt'),
				},
			}),
			'general.holiday_enabled.value',
			'general.holiday_start_time.value',
			'general.holiday_end_time.value'
		);

		// Read assigned version of braintree experiment
		const braintreeExpAssignment = this.apollo.readQuery({
			query: experimentQuery,
			variables: { id: 'bt_test' },
		});
		this.braintreeExpVersion = _get(braintreeExpAssignment, 'experiment.version') || null;
		// TODO: Update for actual launch
		if (this.braintreeExpVersion !== null) {
			this.$kvTrackEvent('basket', 'EXP-CASH-647-Pre-Launch', this.braintreeExpVersion === 'shown' ? 'b' : 'a');
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

		// Run our validate items method once in the client on page load
		if (this.isLoggedIn) {
			this.validatePreCheckout();
		}

		// check for free credits
		if (this.hasFreeCredits) {
			this.refreshTotals('kiva-card-applied');
		}
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
			return parseFloat(this.creditNeeded) > 0
			&& (this.braintreeExpVersion === 'control' || this.braintree === false);
		},
		showBraintree() {
			return parseFloat(this.creditNeeded) > 0
				&& this.braintree === true
				&& this.braintreeExpVersion === 'shown';
		},
		showKivaCreditButton() {
			return parseFloat(this.creditNeeded) === 0;
		},
		emptyBasket() {
			if (this.loans.length === 0 && this.kivaCards.length === 0
				&& parseFloat(_get(this.donations, '[0].price')) === 0) {
				return true;
			}
			return false;
		},
	},
	methods: {
		/* Validate the Entire Basket on mounted */
		validatePreCheckout() {
			this.setUpdatingTotals(true);
			this.validateBasket()
				.then(validationStatus => {
					if (validationStatus !== true) {
						// validation failed
						this.showCheckoutError(validationStatus);
						this.refreshTotals();
					}
					this.setUpdatingTotals(false);
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
						this.$kvTrackEvent('basket', 'free credits applied', 'exit to legacy');
					}
					this.redirectLightboxVisible = true;
					// automatically redirect to legacy after 7 seconds
					window.setTimeout(this.redirectToLegacy, 7000);
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
		redirectToLegacy() {
			this.$router.push({
				path: '/basket',
				query: {
					kexpn: 'checkout_beta.minimal_checkout',
					kexpv: 'a'
				}
			});
		},
		redirectLightboxClosed() {
			this.redirectLightboxVisible = false;
		},
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

	.pre-login #updating-overlay {
		margin-top: 0;
	}

	.checkout-step {
		position: relative;
		text-align: center;
		height: 2rem;
		display: block;
		margin: 1rem 0 2rem;

		hr {
			border-bottom: 1px solid $subtle-gray;
			margin: 2.5rem 0;
		}

		span {
			display: block;
			margin: -4.2rem auto 0;
			width: 3.4rem;
			height: 3.4rem;

			&.number-icon {
				background: $white;
				color: $subtle-gray;
				border: 1px solid $subtle-gray;
				border-radius: 1.7rem;
				font-size: 1.7rem;
				text-align: center;
				line-height: 3.3rem;
			}
		}
	}

	.login-wrap {
		padding-bottom: 2.5rem;

		.pre-login-rule hr {
			margin-bottom: 0;
		}
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
			margin: 0;
		}

		&.pre-login {
			padding: 2rem 0;
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
			max-width: rem-calc(800);
			margin: 0 auto;

			.checkout-button {
				width: 100%;
			}

			@include breakpoint(medium) {
				text-align: right;

				.checkout-button {
					width: auto;
					margin-right: rem-calc(10);
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

	.empty-basket-heading {
		font-weight: 500;
	}
}

// Hide Basket Bar (this won't work with scoped)
.basket-bar {
	display: none;
}

.global-promo-bar {
	display: none;
}
</style>
