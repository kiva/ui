<template>
	<www-page>
		<div id="checkout-slim" class="row page-content">
			<div class="columns">
				<div v-if="!emptyBasket" class="basket-wrap" :class="{'pre-login': !preCheckoutStep}">
					<div>
						<div class="checkout-steps-wrapper">
							<checkout-steps :current-step="currentStep" />
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
							@updating-totals="setUpdatingTotals"
						/>

						<hr>

						<checkout-holiday-promo
							v-if="holidayModeEnabled"
							@updating-totals="setUpdatingTotals"
						/>

						<order-totals
							:totals="totals"
							@refreshtotals="refreshTotals"
							@updating-totals="setUpdatingTotals"
						/>

						<div class="checkout-actions row" :class="{'small-collapse' : showLoginContinueButton}">
							<div v-if="isLoggedIn" class="small-12">
								<pay-pal-exp
									v-if="showPayPal && !showBraintree"
									:show-braintree="showBraintree"
									:amount="creditNeeded"
									@refreshtotals="refreshTotals"
									@updating-totals="setUpdatingTotals"
								/>

								<payment-wrapper
									v-if="showBraintree"
									:amount="creditNeeded"
									:show-braintree="showBraintree"
									:last-payment-type="lastPaymentType"
									@refreshtotals="refreshTotals"
									@updating-totals="setUpdatingTotals"
								/>

								<kiva-credit-payment
									v-if="showKivaCreditButton"
									@refreshtotals="refreshTotals"
									@updating-totals="setUpdatingTotals"
									class=" checkout-button"
									id="kiva-credit-payment-button"
								/>
							</div>

							<div v-else class="small-12">
								<kv-button
									v-if="!isActivelyLoggedIn && showLoginContinueButton"
									class="checkout-button smallest"
									id="login-to-continue-button"
									v-kv-track-event="['basket', 'Login to Continue Button']"
									title="Login to Continue Button"
									@click.native="loginToContinue"
								>
									Login to Continue
								</kv-button>
							</div>
						</div>

						<loading-overlay v-if="updatingTotals" id="updating-overlay" class="updating-totals-overlay" />
					</div>
				</div>

				<kv-lightbox
					:visible="redirectLightboxVisible"
					@lightbox-closed="redirectLightboxClosed"
				>
					<section>
						<h1>
							This checkout is being tested right now, but doesn't support some functions yet.
						</h1>

						<p>
							We'll redirect you so you can get back to changing lives, or click here if you aren't
							automatically redirected.
						</p>

						<p>Thank you for minding our dust.</p>
					</section>

					<kv-button slot="controls"
						class="smaller checkout-button"
						id="Continue-to-legacy-button"
						v-kv-track-event="['basket', 'Redirect Continue Button', 'exit to legacy']"
						title="Continue"
						@click.prevent.native="redirectToLegacy"
					>
						Continue
					</kv-button>
				</kv-lightbox>
			</div>
		</div>
		<div v-if="emptyBasket" class="empty-basket">
			<div class="row display-align text-center">
				<div class="columns small-12">
					<h2 class="empty-basket-heading">
						Your basket is empty!
					</h2>
					<p>
						But we'd love to help you change that! Please consider
						supporting one of the borrowers below, or
						<a href="/lend-by-category">browse all loans</a>.
					</p>
				</div>
			</div>

			<div class="empty-basket-loans">
				<random-loan-selector
					@updating-totals="setUpdatingTotals"
					@refreshtotals="refreshTotals"
				/>
				<loading-overlay v-show="updatingTotals" id="updating-overlay" class="updating-totals-overlay" />
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import _filter from 'lodash/filter';
import cookieStore from '@/util/cookieStore';
import { preFetchAll } from '@/util/apolloPreFetch';
import logReadQueryError from '@/util/logReadQueryError';
import WwwPage from '@/components/WwwFrame/WwwPage';
import checkoutSettings from '@/graphql/query/checkout/checkoutSettings.graphql';
import initializeCheckout from '@/graphql/query/checkout/initializeCheckout.graphql';
import shopBasketUpdate from '@/graphql/query/checkout/shopBasketUpdate.graphql';
import experimentQuery from '@/graphql/query/lendByCategory/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import validatePreCheckoutMutation from '@/graphql/mutation/shopValidatePreCheckout.graphql';
import validationErrorsFragment from '@/graphql/fragments/checkoutValidationErrors.graphql';
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import CheckoutSteps from '@/components/Checkout/CheckoutSteps';
import PayPalExp from '@/components/Checkout/PayPalExpress';
import KivaCreditPayment from '@/components/Checkout/KivaCreditPayment';
import KvButton from '@/components/Kv/KvButton';
import OrderTotals from '@/components/Checkout/OrderTotals';
import BasketItemsList from '@/components/Checkout/BasketItemsList';
import KivaCardRedemption from '@/components/Checkout/KivaCardRedemption';
import LoadingOverlay from '@/pages/Lend/LoadingOverlay';
import KvLightbox from '@/components/Kv/KvLightbox';
import { settingEnabled } from '@/util/settingsUtils';
import promoQuery from '@/graphql/query/promotionalBanner.graphql';
import CheckoutHolidayPromo from '@/components/Checkout/CheckoutHolidayPromo';
import PaymentWrapper from '@/components/Checkout/PaymentWrapper';
import RandomLoanSelector from '@/components/RandomLoanSelector/randomLoanSelector';

export default {
	components: {
		WwwPage,
		CheckoutSteps,
		PayPalExp,
		KivaCreditPayment,
		KvButton,
		KvLightbox,
		OrderTotals,
		BasketItemsList,
		KivaCardRedemption,
		LoadingOverlay,
		CheckoutHolidayPromo,
		PaymentWrapper,
		RandomLoanSelector,
	},
	inject: ['apollo', 'kvAuth0'],
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
			braintreeExpVersion: null,
			lastPaymentType: null,
			currentTime: Date.now(),
			currentTimeInterval: null,
		};
	},
	apollo: {
		query: initializeCheckout,
		// using the prefetch function form allows us to act on data before the page loads
		preFetch(config, client) {
			return client.query({
				query: checkoutSettings,
				fetchPolicy: 'network-only',
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
			}).then(() => {
				return client.mutate({ mutation: validatePreCheckoutMutation });
			}).then(() => {
				return Promise.all([
					client.query({ query: initializeCheckout, fetchPolicy: 'network-only' }),
					client.query({ query: experimentQuery, variables: { id: 'bt_v1' } }),
				]);
			});
		},
		result({ data }) {
			// user data
			this.myBalance = _get(data, 'my.userAccount.balance');
			this.myId = _get(data, 'my.userAccount.id');
			this.teams = _get(data, 'my.lender.teams.values');
			this.lastPaymentType = _get(data, 'my.mostRecentPaymentType');
			this.lastActiveLogin = _get(data, 'my.lastLoginTimestamp', 0);
			// basket data
			this.totals = _get(data, 'shop.basket.totals') || {};
			this.loans = _filter(_get(data, 'shop.basket.items.values'), { __typename: 'LoanReservation' });
			this.donations = _filter(_get(data, 'shop.basket.items.values'), { __typename: 'Donation' });
			this.kivaCards = _filter(_get(data, 'shop.basket.items.values'), { __typename: 'KivaCard' });
			this.redemption_credits = _filter(
				_get(data, 'shop.basket.credits.values'),
				{ __typename: 'Credit', creditType: 'redemption_code' }
			);
			this.hasFreeCredits = _get(data, 'shop.basket.hasFreeCredits');
			// general data
			this.activeLoginDuration = parseInt(_get(data, 'general.activeLoginDuration.value'), 10) || 3600;
			this.braintree = _get(data, 'general.braintree_checkout.value') === 'true';
		}
	},
	created() {
		// show any validation errors that occured during preFetch
		const shopMutationData = this.apollo.readFragment({
			id: 'ShopMutation',
			fragment: validationErrorsFragment,
		});
		const validationErrors = _get(shopMutationData, 'validatePreCheckout', []);
		this.showCheckoutError(validationErrors, true);

		// check if holiday mode is enabled
		try {
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
		} catch (e) {
			logReadQueryError(e);
		}

		// Read assigned version of braintree experiment
		const braintreeExpAssignment = this.apollo.readFragment({
			id: 'Experiment:bt_v1',
			fragment: experimentVersionFragment,
		}) || {};
		this.braintreeExpVersion = braintreeExpAssignment.version;
		if (this.braintreeExpVersion) {
			this.$kvTrackEvent('basket', 'EXP-CASH-673-Launch', this.braintreeExpVersion === 'shown' ? 'b' : 'a');
		}

		// Read assigned version of loan res 20 exp
		const loanRes20ExpAssignment = this.apollo.readFragment({
			id: 'Experiment:loan_res_20',
			fragment: experimentVersionFragment,
		}) || {};
		try {
			this.$kvTrackEvent(
				'basket',
				'EXP-CASH-1023-Aug2019',
				loanRes20ExpAssignment.version === 'shown' ? 'b' : 'a'
			);
		} catch (e) {
			// noop
		}
	},
	mounted() {
		// update current time every second for reactivity
		this.currentTimeInterval = setInterval(() => {
			this.currentTime = Date.now();
		}, 1000);

		this.$nextTick(() => {
			// fire tracking event when the page loads
			// - this event will be duplicated when the page reloads with a newly registered/logged in user
			let userStatus = this.isLoggedIn ? 'Logged-In' : 'Un-Authenticated';
			if (this.isActivelyLoggedIn) {
				userStatus = 'Actively Logged-In';
			}
			this.$kvTrackEvent('Checkout', 'EXP-Checkout-Loaded', userStatus);
		});
	},
	computed: {
		isLoggedIn() {
			if (this.myId !== null && this.myId !== undefined && this.isActivelyLoggedIn) {
				return true;
			}
			return false;
		},
		isActivelyLoggedIn() {
			const lastLogin = (parseInt(this.lastActiveLogin, 10)) || 0;
			if (lastLogin + (this.activeLoginDuration * 1000) > this.currentTime) {
				return true;
			}
			return false;
		},
		currentStep() {
			return this.isLoggedIn ? 'payment' : 'basket';
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
		showLoginContinueButton() {
			if (!this.myId || !this.isActivelyLoggedIn) {
				return true;
			}
			return false;
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
		loginToContinue() {
			if (this.kvAuth0.enabled) {
				this.updatingTotals = true;
				// we need to force show the login popup if not actively logged in
				const authorizeOptions = {};
				if (!this.isActivelyLoggedIn) {
					authorizeOptions.prompt = 'login';
				}
				this.kvAuth0.popupLogin(authorizeOptions).then(result => {
					// Only refetch data if login was successful
					if (result) {
						// we should operate here but it get's overwritten by the prefetch
						// this.setAuthStatus(_get(result, 'idTokenPayload'));

						// Refetch the queries for all the components in this route. All the components that use
						// the default options for the apollo plugin or that setup their own query observer will update
						const matched = this.$router.getMatchedComponents(this.$route);
						// When this is initially called the graphql doesn't have the auth token
						// This has the unfortunate side affect of resetting the recently set userId from the login
						return preFetchAll(matched, this.apollo, {
							route: this.$route,
							kvAuth0: this.kvAuth0,
						});
					}
					return false;
				})
					.then(() => {
						// update after the re-prefetch process
						this.setAuthStatus(_get(this.kvAuth0, 'user'));
						return true;
					})
					.catch(err => {
						// handle closed popup dialog with the following error signature
						// {original: "User closed the popup window", code: null, description: null}
						if (err && err.original === 'User closed the popup window') {
							this.updatingTotals = false;
						} else if (err && err.name === 'SyntaxError') {
							// handle temporary error situation with popup by refreshing page
							console.error(this.extractAuth0Error(err));
							window.location = window.location; // eslint-disable-line
						} else {
							console.error(this.extractAuth0Error(err));
						}
					})
					.finally(() => {
						this.updatingTotals = false;
					});
			}
		},
		setAuthStatus(userState) {
			if (typeof userState !== 'undefined' && userState !== null) {
				this.lastActiveLogin = userState['https://www.kiva.org/last_login'];
				this.myId = userState['https://www.kiva.org/kiva_id'];
			}
		},
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
				fetchPolicy: 'network-only',
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
			// popup to register
		},
		switchToLogin() {
			// popup to login
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
		extractAuth0Error(errorObject) {
			if (typeof errorObject.original === 'object') {
				return `${errorObject.error}: ${errorObject.errorDescription}`;
			}
			return JSON.stringify(errorObject.original);
		},
	},
	destroyed() {
		clearInterval(this.currentTimeInterval);
	},
};
</script>

<style lang="scss">
@import 'settings';

.page-content,
.empty-basket {
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
}

.page-content {
	padding: 1.625rem 0;

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
}

.display-align {
	display: inline;
}

.empty-basket {
	position: relative;
	margin: 0 auto;

	.empty-basket-heading {
		font-weight: 500;
	}

	.empty-basket-loans {
		position: relative;
		min-height: 23rem;

		#updating-overlay {
			z-index: 1000;
			width: auto;
			height: auto;
			left: 0;
			right: 0;
			bottom: 0;
			top: 0;
			background-color: rgba($kiva-bg-lightgray, 0.7);

			.spinner-wrapper {
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				height: 100%;
				top: auto;
				left: auto;
				transform: none;
			}
		}
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
