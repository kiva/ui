<template>
	<www-page>
		<div id="checkout-slim" class="row page-content">
			<div class="columns">
				<div v-if="!emptyBasket" class="basket-wrap" :class="{'pre-login': !preCheckoutStep}">
					<div>
						<div class="checkout-steps-wrapper hide-for-print">
							<kv-checkout-steps
								class="checkout-steps"
								:steps="checkoutSteps"
								:current-step-index="currentStep"
							/>
							<div class="text-center continue-browsing"
								v-if="addToBasketRedirectExperimentShown && !userPrefContinueBrowsing"
							>
								<span>Want to add more loans? </span>
								<router-link
									to="/lend-by-category"
									@click.native="handleChangeUserPref"
								>
									Continue browsing
								</router-link>
							</div>
							<hr>
						</div>
						<div class="basket-container">
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
							<hr>
							<div class="basket-container">
								<kiva-card-redemption
									:credits="redemption_credits"
									:totals="totals"
									@refreshtotals="refreshTotals"
									@updating-totals="setUpdatingTotals"
								/>
							</div>
						</div>
						<hr>

						<div class="basket-container">
							<div class="row">
								<div class="small-9 small-offset-3 large-10 large-offset-2 columns">
									<checkout-holiday-promo
										v-if="holidayModeEnabled"
										@updating-totals="setUpdatingTotals"
									/>
								</div>
							</div>

							<order-totals
								:totals="totals"
								@refreshtotals="refreshTotals"
								@updating-totals="setUpdatingTotals"
							/>

							<basket-verification />

							<div class="checkout-actions row">
								<div v-if="isLoggedIn" class="small-12 columns">
									<form v-if="showKivaCreditButton" action="/checkout" method="GET">
										<input type="hidden" name="js_loaded" value="false">
										<kiva-credit-payment
											@refreshtotals="refreshTotals"
											@updating-totals="setUpdatingTotals"
											@complete-transaction="completeTransaction"
											class=" checkout-button"
											id="kiva-credit-payment-button"
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
									class="small-12 columns"
								>
									<!-- Guest checkout button shown when the uiexp.guest_checkout and
										feature.guest_checkout are enabled to users in the test group
										without a 'kvu' cookie which indicates if a user has logged
										into Kiva on current browser -->
									<kv-button
										v-if="eligibleForGuestCheckout && !guestCheckoutCTAExpActive"
										class="guest-checkout-button checkout-button smallest secondary"
										id="guest-checkout-button"
										v-kv-track-event="['basket', 'click-guest-checkout-cta', 'Checkout as guest']"
										title="Checkout as guest"
										@click.native="guestCheckout"
									>
										Continue as guest
									</kv-button>

									<kv-button
										v-if="!guestCheckoutCTAExpActive"
										class="checkout-button smallest"
										id="login-to-continue-button"
										v-kv-track-event="['basket', 'click-register-cta', 'Continue']"
										title="Login to Continue Button"
										@click.native="loginToContinue"
										:href="'/ui-login?force=true&doneUrl=/checkout'"
									>
										Continue
									</kv-button>

									<kv-button
										v-if="eligibleForGuestCheckout && guestCheckoutCTAExpActive"
										class="checkout-button smallest secondary"
										id="create-account-continue-button"
										v-kv-track-event="['basket', 'click-register-cta', 'Create an account']"
										title="Create an account"
										@click.native="loginToContinue"
										:href="'/ui-login?force=true&doneUrl=/checkout'"
									>
										Create an account
									</kv-button>

									<kv-button
										v-if="eligibleForGuestCheckout && guestCheckoutCTAExpActive"
										class="checkout-button smallest"
										id="guest-checkout-exp-button"
										v-kv-track-event="['basket', 'click-guest-checkout-cta', 'Continue as guest']"
										title="Checkout as guest"
										@click.native="guestCheckout"
									>
										Continue as guest
									</kv-button>
								</div>
								<div
									v-if="!isActivelyLoggedIn
										&& showLoginContinueButton
										&& eligibleForGuestCheckout
										&& guestCheckoutCTAExpActive"
									class="small-12 columns text-right"
								>
									<span>Already have an account?</span>
									<a
										href="/login?force=true&amp;loginHint=login&amp;doneUrl=checkout"
										v-kv-track-event="['basket', 'click-sign—in-cta', 'Sign in here']"
										title="Sign in here"
									>Sign in here</a>
								</div>
							</div>
						</div>

						<kv-loading-overlay
							v-if="updatingTotals"
							id="updating-overlay"
							class="updating-totals-overlay"
						/>
					</div>
				</div>

				<kv-lightbox
					:visible="redirectLightboxVisible"
					title="This checkout is being tested right now, but doesn't support some functions yet."
					@lightbox-closed="redirectLightboxClosed"
				>
					<p>
						We'll redirect you so you can get back to changing lives, or click here if you aren't
						automatically redirected.
					</p>
					<p>Thank you for minding our dust.</p>
					<template #controls>
						<kv-button
							class="smaller checkout-button"
							id="Continue-to-legacy-button"
							v-kv-track-event="['basket', 'Redirect Continue Button', 'exit to legacy']"
							@click.prevent.native="redirectToLegacy"
						>
							Continue
						</kv-button>
					</template>
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
				<kv-loading-overlay v-if="updatingTotals" id="updating-overlay" class="updating-totals-overlay" />
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import _filter from 'lodash/filter';
import numeral from 'numeral';
import store2 from 'store2';
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
import KvCheckoutSteps from '@/components/Kv/KvCheckoutSteps';
import KivaCreditPayment from '@/components/Checkout/KivaCreditPayment';
import KvButton from '@/components/Kv/KvButton';
import OrderTotals from '@/components/Checkout/OrderTotals';
import BasketItemsList from '@/components/Checkout/BasketItemsList';
import BasketVerification from '@/components/Checkout/BasketVerification';
import KivaCardRedemption from '@/components/Checkout/KivaCardRedemption';
import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';
import KvLightbox from '@/components/Kv/KvLightbox';
import CheckoutHolidayPromo from '@/components/Checkout/CheckoutHolidayPromo';
import CheckoutDropInPaymentWrapper from '@/components/Checkout/CheckoutDropInPaymentWrapper';
import RandomLoanSelector from '@/components/RandomLoanSelector/randomLoanSelector';

export default {
	components: {
		WwwPage,
		KivaCreditPayment,
		KvButton,
		KvCheckoutSteps,
		KvLightbox,
		OrderTotals,
		BasketItemsList,
		BasketVerification,
		KivaCardRedemption,
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
			redirectLightboxVisible: false,
			teams: [],
			holidayModeEnabled: false,
			currentTime: Date.now(),
			currentTimeInterval: null,
			userPrefContinueBrowsing: false,
			addToBasketRedirectExperimentShown: false,
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
				const hasFreeCredits = _get(data, 'shop.basket.hasFreeCredits');
				const lendingRewardOffered = _get(data, 'shop.lendingRewardOffered');
				// check for free credit, bonus credit or lending rewards and redirect if present
				// IMPORTANT: THIS IS DEPENDENT ON THE CheckoutBeta Experiment
				// TODO: remove once bonus credit functionality is added
				if (hasFreeCredits || lendingRewardOffered) {
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

		// GROW-127 Add to basket redirect experiment
		const addToBasketRedirectExperiment = this.apollo.readFragment({
			id: 'Experiment:add_to_basket_redirect',
			fragment: experimentVersionFragment,
		}) || {};

		if (addToBasketRedirectExperiment.version === 'control') {
			this.addToBasketRedirectExperimentShown = false;
		} else if (addToBasketRedirectExperiment.version === 'shown') {
			this.addToBasketRedirectExperimentShown = true;
		}

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
		// Ensure browser clock is correct before using current time
		syncDate().then(() => {
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
		});

		// cover ssr or spa page load
		if (this.isLoggedIn) {
			this.logBasketState();
		}

		this.userPrefContinueBrowsing = store2('userPrefContinueBrowsing') === true; // read from localstorage
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
		checkoutSteps() {
			return ['Basket', 'Payment', 'Thank You!'];
		},
		currentStep() {
			return this.isLoggedIn ? 1 : 0;
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
			return this.checkingOutAsGuest === false;
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
				// when updating basket state, check for free credits and redirect if present
				const hasFreeCredits = _get(data, 'shop.basket.hasFreeCredits');
				if (hasFreeCredits) {
					if (refreshEvent === 'kiva-card-applied') {
						this.$kvTrackEvent('basket', 'free credits applied', 'exit to legacy');
						this.disableGuestCheckout();
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
		handleChangeUserPref() {
			this.$kvTrackEvent(
				'Lending',
				'EXP-GROW-127-Jul2020',
				'click-continue-browsing'
			);
			store2('userPrefContinueBrowsing', true); // store userpref in localstorage
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

.basket-container {
	max-width: rem-calc(800);
	margin: 0 auto;
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
			.checkout-button {
				width: 100%;
			}

			@include breakpoint(medium) {
				text-align: right;

				.checkout-button {
					width: auto;
				}
			}

			.guest-checkout-button {
				@include breakpoint(medium) {
					margin-right: 1rem;
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

.checkout-steps-wrapper {
	padding-bottom: 1.2rem;

	.continue-browsing {
		font-weight: $global-weight-highlight;
	}
}

.checkout-steps {
	margin: 0 auto 2rem;
	max-width: 40rem;
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
	display: none !important;
}

</style>
