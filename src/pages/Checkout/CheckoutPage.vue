<template>
	<www-page>
		<kv-page-container
			id="checkout-slim"
			data-testid="checkout"
			class="tw-py-3.5"
			:class="{
				'not-logged-in': !isLoggedIn,
				'login-active': isLoggedIn,
				'login-guest': checkingOutAsGuest
			}"
		>
			<div
				v-if="!emptyBasket"
				class="basket-wrap tw-relative tw-mb-1"
				:class="{'pre-login': !preCheckoutStep}"
			>
				<div class="checkout-header tw-pb-3 hide-for-print">
					<h1 class="tw-text-h2 tw-mb-3">
						Your basket
					</h1>
					<hr class="tw-border-tertiary tw-my-3">
				</div>
				<div class="tw-relative">
					<div class="basket-container tw-mx-auto tw-my-0">
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
					</div>
					<div v-if="showKivaCardForm">
						<hr class="tw-border-tertiary tw-my-3">
						<div class="basket-container tw-mx-auto tw-my-0">
							<kiva-card-redemption
								:credits="redemption_credits"
								:totals="totals"
								@refreshtotals="refreshTotals"
								@updating-totals="setUpdatingTotals"
							/>
						</div>
					</div>
					<hr class="tw-border-tertiary tw-my-3">

					<div class="basket-container tw-mx-auto tw-my-0">
						<checkout-holiday-promo
							v-if="holidayModeEnabled"
							@updating-totals="setUpdatingTotals"
						/>

						<order-totals
							data-testid="order-totals-section"
							:totals="totals"
							:promo-fund="derivedPromoFund"
							@refreshtotals="refreshTotals"
							@updating-totals="setUpdatingTotals"
						/>

						<basket-verification />

						<div class="checkout-actions md:tw-text-right tw-my-6">
							<div v-if="isLoggedIn" class="">
								<form v-if="showKivaCreditButton" action="/checkout" method="GET">
									<input type="hidden" name="js_loaded" value="false">
									<kiva-credit-payment
										@refreshtotals="refreshTotals"
										@updating-totals="setUpdatingTotals"
										@complete-transaction="completeTransaction"
										class="checkout-button tw-w-full md:tw-w-auto"
										id="kiva-credit-payment-button"
										data-testid="kiva-credit-payment-button"
									/>
								</form>

								<checkout-drop-in-payment-wrapper
									v-if="!showKivaCreditButton"
									:amount="creditNeeded"
									:is-guest-checkout="checkingOutAsGuest"
									@refreshtotals="refreshTotals"
									@updating-totals="setUpdatingTotals"
									@complete-transaction="completeTransaction"
								/>
							</div>

							<div
								v-else-if="!isActivelyLoggedIn && showLoginContinueButton"
								class=""
							>
								<!-- Guest checkout button shown when the uiexp.guest_checkout and
									feature.guest_checkout are enabled to users in the test group
									without a 'kvu' cookie which indicates if a user has logged
									into Kiva on current browser -->
								<kv-button
									v-if="eligibleForGuestCheckout && !guestCheckoutCTAExpActive"
									class="guest-checkout-button checkout-button
										tw-w-full md:tw-w-auto md:tw-mr-2 tw-mb-2 md:tw-mb-0"
									variant="secondary"
									id="guest-checkout-button"
									data-testid="guest-checkout-button"
									v-kv-track-event="[
										'basket',
										'click-guest-checkout-cta',
										'Checkout as guest'
									]"
									@click="guestCheckout"
								>
									Continue as guest
								</kv-button>

								<kv-button
									v-if="!guestCheckoutCTAExpActive"
									class="checkout-button tw-w-full md:tw-w-auto"
									id="login-to-continue-button"
									data-testid="login-to-continue-button"
									v-kv-track-event="['basket', 'click-register-cta', 'Continue']"
									@click="loginToContinue"
									:href="'/ui-login?force=true&doneUrl=/checkout'"
								>
									Continue
								</kv-button>

								<kv-button
									v-if="eligibleForGuestCheckout && guestCheckoutCTAExpActive"
									class="checkout-button tw-w-full md:tw-w-auto"
									variant="secondary"
									id="create-account-continue-button"
									data-testid="create-account-continue-button"
									v-kv-track-event="['basket', 'click-register-cta', 'Create an account']"
									@click="loginToContinue"
									:href="'/ui-login?force=true&doneUrl=/checkout'"
								>
									Create an account
								</kv-button>

								<kv-button
									v-if="eligibleForGuestCheckout && guestCheckoutCTAExpActive"
									class="checkout-button tw-w-full md:tw-w-auto"
									id="guest-checkout-exp-button"
									data-testid="guest-checkout-exp-button"
									v-kv-track-event="[
										'basket',
										'click-guest-checkout-cta',
										'Continue as guest'
									]"
									@click="guestCheckout"
								>
									Continue as guest
								</kv-button>
							</div>
							<div
								v-if="!isActivelyLoggedIn
									&& showLoginContinueButton
									&& eligibleForGuestCheckout
									&& guestCheckoutCTAExpActive"
								class="tw-text-right"
							>
								<span>Already have an account?</span>
								<a
									href="/login?force=true&amp;loginHint=login&amp;doneUrl=checkout"
									v-kv-track-event="['basket', 'click-sign—in-cta', 'Sign in here']"
									title="Sign in here"
									data-testid="sign-in-button"
								>Sign in here</a>
							</div>
						</div>
					</div>

					<kv-loading-overlay
						v-if="updatingTotals"
						data-testid="updating-overlay"
						id="updating-overlay"
						class="updating-totals-overlay tw-z-overlay tw-bg-white"
					/>
				</div>
			</div>

			<div v-if="emptyBasket" class="empty-basket tw-relative tw-mx-auto" data-testid="empty-basket">
				<div class="checkout-header-empty tw-mb-4">
					<h1 class="tw-text-h2 tw-mb-2">
						Your basket is empty!
					</h1>
					<p class="tw-mb-2">
						But we'd love to help you change that! Please consider
						supporting one of the borrowers below, or
						<router-link
							to="/lend-by-category"
							data-testid="empty-basket-loans-link"
							v-kv-track-event.native="
								['basket', 'click-empty-basket-browse-all-loans', 'browse all loans']
							"
						>
							browse all loans
						</router-link>.
					</p>
				</div>

				<div
					class="empty-basket-loans tw-relative"
					data-testid="empty-basket-loans"
					style="min-height: 23rem;"
				>
					<random-loan-selector
						@updating-totals="setUpdatingTotals"
						@refreshtotals="refreshTotals"
					/>
					<kv-loading-overlay
						v-if="updatingTotals"
						data-testid="updating-overlay"
						id="updating-overlay"
						class="updating-totals-overlay tw-z-overlay"
						style="width: 100vw;"
					/>
				</div>
			</div>
		</kv-page-container>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import _filter from 'lodash/filter';
import numeral from 'numeral';
import { preFetchAll } from '@/util/apolloPreFetch';
import syncDate from '@/util/syncDate';
import { myFTDQuery, formatTransactionData } from '@/util/checkoutUtils';
import WwwPage from '@/components/WwwFrame/WwwPage';
import checkoutSettings from '@/graphql/query/checkout/checkoutSettings.graphql';
import initializeCheckout from '@/graphql/query/checkout/initializeCheckout.graphql';
import shopBasketUpdate from '@/graphql/query/checkout/shopBasketUpdate.graphql';
import setupBasketForUserMutation from '@/graphql/mutation/shopSetupBasketForUser.graphql';
import validatePreCheckoutMutation from '@/graphql/mutation/shopValidatePreCheckout.graphql';
import validationErrorsFragment from '@/graphql/fragments/checkoutValidationErrors.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import KivaCreditPayment from '@/components/Checkout/KivaCreditPayment';
import OrderTotals from '@/components/Checkout/OrderTotals';
import BasketItemsList from '@/components/Checkout/BasketItemsList';
import BasketVerification from '@/components/Checkout/BasketVerification';
import KivaCardRedemption from '@/components/Checkout/KivaCardRedemption';
import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';
import CheckoutHolidayPromo from '@/components/Checkout/CheckoutHolidayPromo';
import CheckoutDropInPaymentWrapper from '@/components/Checkout/CheckoutDropInPaymentWrapper';
import RandomLoanSelector from '@/components/RandomLoanSelector/randomLoanSelector';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	components: {
		WwwPage,
		KivaCreditPayment,
		KvButton,
		OrderTotals,
		BasketItemsList,
		BasketVerification,
		KivaCardRedemption,
		KvPageContainer,
		KvLoadingOverlay,
		CheckoutHolidayPromo,
		CheckoutDropInPaymentWrapper,
		RandomLoanSelector,
	},
	inject: ['apollo', 'cookieStore', 'kvAuth0'],
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
			teams: [],
			holidayModeEnabled: false,
			currentTime: Date.now(),
			currentTimeInterval: null,
			loginButtonExperimentVersion: null,
			redirectToLoginExperimentVersion: null,
			isGuestCheckoutEnabled: false,
			guestCheckoutCTAExpActive: false,
			checkingOutAsGuest: false,
			hasEverLoggedIn: false,
		};
	},
	apollo: {
		query: initializeCheckout,
		// using the prefetch function form allows us to act on data before the page loads
		preFetch(config, client) {
			return client.mutate({
				mutation: setupBasketForUserMutation
			}).then(() => {
				return client.query({ query: checkoutSettings, fetchPolicy: 'network-only' });
			}).then(({ data }) => {
				const lendingRewardOffered = _get(data, 'shop.lendingRewardOffered');
				// check for free credit, bonus credit or lending rewards and redirect if present
				// IMPORTANT: THIS IS DEPENDENT ON THE CheckoutBeta Experiment
				// TODO: remove once bonus credit functionality is added
				if (lendingRewardOffered) {
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
			})
				.then(() => {
					return Promise.all([
						client.query({ query: initializeCheckout, fetchPolicy: 'network-only' })
					]);
				});
		},
		result({ data }) {
			// Checking if guest checkout feature is enabled in Admin settingsManager
			this.isGuestCheckoutEnabled = data?.general?.guestCheckoutEnabled?.value === 'true';
			// user data
			this.myBalance = _get(data, 'my.userAccount.balance');
			this.myId = _get(data, 'my.userAccount.id');
			this.teams = _get(data, 'my.lender.teams.values');
			this.lastActiveLogin = _get(data, 'my.lastLoginTimestamp', 0);
			this.hasEverLoggedIn = _get(data, 'hasEverLoggedIn', false);
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
			if (this.redemption_credits.length || this.hasFreeCredits !== false) {
				this.disableGuestCheckout();
			}

			// general data
			this.activeLoginDuration = parseInt(_get(data, 'general.activeLoginDuration.value'), 10) || 3600;
		}
	},
	beforeRouteEnter(to, from, next) {
		// Ensure browser clock is correct before loading the page
		if (typeof window !== 'undefined') {
			syncDate().then(next).catch(next);
		} else {
			next();
		}
	},
	created() {
		// show guest account claim confirmation message
		if (this.myId && this.$route.query?.claimed === '1') {
			this.$showTipMsg('Account created');
		}

		// show any validation errors that occured during preFetch
		const shopMutationData = this.apollo.readFragment({
			id: 'ShopMutation',
			fragment: validationErrorsFragment,
		});
		const validationErrors = _get(shopMutationData, 'validatePreCheckout', []);
		this.showCheckoutError(validationErrors, true);

		// TODO: Implement check against contentful setting
		// to signify if holiday mode is enabled

		// GROW-203 login/registration CTA experiment
		const loginButtonExperiment = this.apollo.readFragment({
			id: 'Experiment:checkout_login_cta',
			fragment: experimentVersionFragment,
		}) || {};

		this.loginButtonExperimentVersion = loginButtonExperiment.version;
		if (this.loginButtonExperimentVersion && !this.emptyBasket) {
			this.$kvTrackEvent(
				'Basket',
				'EXP-GROW-203-Aug2020',
				this.loginButtonExperimentVersion,
			);
		}

		// GROW-280 redirect to login instead of popup login experiment
		const redirectToLoginExperiment = this.apollo.readFragment({
			id: 'Experiment:redirect_to_login',
			fragment: experimentVersionFragment,
		}) || {};
		this.redirectToLoginExperimentVersion = redirectToLoginExperiment.version;

		if (this.eligibleForGuestCheckout) {
			const guestCheckoutCTAExperiment = this.apollo.readFragment({
				id: 'Experiment:guest_checkout_cta',
				fragment: experimentVersionFragment,
			}) || {};

			if (guestCheckoutCTAExperiment.version && guestCheckoutCTAExperiment.version !== 'unassigned') {
				this.guestCheckoutCTAExpActive = guestCheckoutCTAExperiment.version === 'shown';
				this.$kvTrackEvent(
					'Checkout',
					'EXP-GROW-614-May2021',
					guestCheckoutCTAExperiment.version === 'shown' ? 'b' : 'a'
				);
			}
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

		// cover ssr or spa page load
		if (this.isLoggedIn) {
			this.logBasketState();
		}

		// show toast for specified scenario
		this.handleToast();
	},
	computed: {
		isLoggedIn() {
			if (this.checkingOutAsGuest) {
				return true;
			}
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
		instantLendingLoanAdded() {
			return this.$route?.query?.instantLending === 'loan-added';
		},
		creditNeeded() {
			return this.totals.creditAmountNeeded || '0.00';
		},
		showKivaCreditButton() {
			if (this.checkingOutAsGuest) {
				return false;
			}
			return parseFloat(this.creditNeeded) === 0;
		},
		showKivaCardForm() {
			return this.checkingOutAsGuest === false && !this.instantLendingLoanAdded;
		},
		eligibleForGuestCheckout() {
			// Checking if guest checkout is enabled
			// and if Kiva has been logged into on user's current browser
			if (this.isGuestCheckoutEnabled
				&& !this.isActivelyLoggedIn
				&& !this.hasEverLoggedIn
			) {
				return true;
			}
			return false;
		},
		showLoginContinueButton() {
			if (!this.myId || !this.isActivelyLoggedIn) {
				return true;
			}
			return false;
		},
		emptyBasket() {
			if (this.loans.length === 0 && this.kivaCards.length === 0
				&& (!this.donations.length
				|| parseFloat(_get(this.donations, '[0].price')) === 0)) {
				return true;
			}
			return false;
		},
		derivedPromoFund() {
			const appliedCreditsPromoFunds = this.loans?.filter(loan => {
				const hasCredits = loan.creditsUsed.length > 0;
				let hasPromoFund = false;
				if (hasCredits) {
					hasPromoFund = loan.creditsUsed.filter(credit => credit.promoFund !== null).length > 0;
				}
				return hasPromoFund;
			}).map(loan => {
				// return first credit's promoFund
				return loan.creditsUsed[0]?.promoFund;
			});
			// Using the first promoFund available
			return appliedCreditsPromoFunds[0] || null;
		}
	},
	methods: {
		loginToContinue(event) {
			if (this.redirectToLoginExperimentVersion) {
				this.$kvTrackEvent(
					'Basket',
					'EXP-GROW-282-Oct2020',
					this.redirectToLoginExperimentVersion,
				);
			}

			if (this.redirectToLoginExperimentVersion !== 'b' && this.kvAuth0.enabled) {
				event.preventDefault();
				this.doPopupLogin();
			}

			// Doing nothing here allows the normal link handling to happen, which will send the user to /ui-login
		},
		guestCheckout() {
			this.checkingOutAsGuest = true;
		},
		disableGuestCheckout() {
			this.checkingOutAsGuest = false;
			this.isGuestCheckoutEnabled = false;
		},
		doPopupLogin() {
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
						}).catch(error => {
							if (error.path) {
								this.$router.push(error);
							}
						});
					}
					return false;
				})
					.then(() => {
						// update after the re-prefetch process
						this.setAuthStatus(_get(this.kvAuth0, 'user'));
						return true;
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
			// covers popup login
			this.logBasketState();
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
				// when updating basket state, check for free credits and remove guest checkout option
				const hasFreeCredits = _get(data, 'shop.basket.hasFreeCredits');
				if (hasFreeCredits && refreshEvent === 'kiva-card-applied') {
					this.disableGuestCheckout();
				}
				this.setUpdatingTotals(false);
			}).catch(response => {
				console.error(`failed to update totals: ${response}`);
				this.setUpdatingTotals(false);
			});
		},
		completeTransaction(transactionId) {
			// compile transaction data
			const transactionData = formatTransactionData(
				numeral(transactionId).value(),
				this.loans,
				this.kivaCards,
				this.donations,
				this.totals
			);

			// Fetch FTD Status
			const myFTDQueryUtil = myFTDQuery(this.apollo);

			myFTDQueryUtil.then(({ data }) => {
				// determine ftd status
				const isFTD = data?.my?.userAccount?.isFirstTimeDepositor;
				transactionData.isFTD = isFTD;

				// fire transaction events
				this.$kvTrackTransaction(transactionData);

				// redirect to thanks
				window.setTimeout(
					() => {
						this.redirectToThanks(transactionId);
					},
					800
				);
			});
		},
		setUpdatingTotals(state) {
			this.updatingTotals = state;
		},
		logBasketState() {
			const creditNeededInt = numeral(this.creditNeeded).value();
			this.$kvTrackEvent(
				'Checkout',
				'Payment Required',
				creditNeededInt > 0 || false,
				creditNeededInt * 100,
				creditNeededInt * 100
			);
		},
		handleToast() {
			// Handle incoming Instant Donation status
			const instantDonationStatus = this.$route?.query?.instantDonation ?? null;
			if (instantDonationStatus === 'insufficient-funds' || instantDonationStatus === 'donation-failed') {
				const instantDonationFailed = `Heads up! You don't have enough Kiva credit in your account.
					Hit "Continue" to login to check your Kiva credit balance and adjust your donation
					amount accordingly.`;
				const toastTimeout = setTimeout(() => {
					this.$showTipMsg(instantDonationFailed, 'warning', true);
					clearTimeout(toastTimeout);
				}, 1000);
			}
		}
	},
	destroyed() {
		clearInterval(this.currentTimeInterval);
	},
};
</script>

<style lang="scss">
@import 'settings';

#checkout-slim {
	// loading overlay overrides
	#loading-overlay,
	#updating-overlay {
		background-color: rgba(255, 255, 255, 0.7);
	}
}
</style>
