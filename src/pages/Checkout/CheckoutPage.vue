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
			<matched-loans-lightbox
				:show-lightbox="showMatchedLoansLightbox"
				:close-lightbox="closeMatchedLoansLightbox"
			/>
			<div
				v-if="!emptyBasket"
				class="basket-wrap tw-relative tw-mb-1"
				:class="{'pre-login': !preCheckoutStep}"
			>
				<div class="checkout-header hide-for-print tw-pb-3">
					<h1 class="tw-text-h2 tw-mb-3">
						Your basket
					</h1>
					<hr class="tw-border-tertiary tw-my-3">

					<ftds-message
						class="tw-mb-2"
						v-if="showFtdMessage"
						:ftd-credit-amount="ftdCreditAmount"
					/>
				</div>
				<div class="tw-relative">
					<div class="basket-container tw-mx-auto tw-my-0">
						<basket-items-list
							:loans="loans"
							:donations="donations"
							:kiva-cards="kivaCards"
							:teams="teams"
							:loan-reservation-total="parseInt(totals.loanReservationTotal)"
							:enable-five-dollars-notes="enableFiveDollarsNotes"
							:is-logged-in="isLoggedIn"
							:show-incentive-upsell="showIncentiveUpsell"
							:incentive-goal="depositIncentiveAmountToLend"
							:possible-achievement-progress="possibleAchievementProgress"
							:lender-total-loans="lenderTotalLoans"
							:is-my-kiva-enabled="isMyKivaEnabled"
							:has-ever-logged-in="hasEverLoggedIn"
							@validateprecheckout="validatePreCheckout"
							@refreshtotals="refreshTotals($event)"
							@removed-loan="calculateProgressAchievement($event)"
							@updating-totals="setUpdatingTotals"
						/>
						<div v-if="showUpsell && showUpsellModule" class="upsellContainer">
							<kv-loading-placeholder v-if="!upsellLoan.name" class="tw-rounded" />
							<upsell-module
								v-if="upsellLoan.name"
								:loan="upsellLoan"
								:close-upsell-module="closeUpsellModule"
								:add-to-basket="addToBasket"
							/>
						</div>
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
							:open-lightbox="openMatchedLoansLightbox"
						/>

						<basket-verification />

						<div ref="checkoutActionsThreshold"></div>

						<div class="checkout-actions md:tw-text-right tw-my-6">
							<div v-if="isLoggedIn">
								<form v-if="showKivaCreditButton" action="/checkout" method="GET">
									<input type="hidden" name="js_loaded" value="false">
									<kiva-credit-payment
										@refreshtotals="refreshTotals"
										@updating-totals="setUpdatingTotals"
										@complete-transaction="completeTransaction"
										class="checkout-button tw-w-full md:tw-w-auto"
										id="kiva-credit-payment-button"
										data-testid="kiva-credit-payment-button"
										:use-async-checkout="asyncCheckoutActive"
									/>
								</form>

								<checkout-drop-in-payment-wrapper
									v-if="!showKivaCreditButton"
									:amount="creditNeeded"
									:loans-in-basket="loanIdsInBasket.length"
									:is-guest-checkout="checkingOutAsGuest"
									@refreshtotals="refreshTotals"
									@updating-totals="setUpdatingTotals"
									@complete-transaction="completeTransaction"
									:use-async-checkout="asyncCheckoutActive"
									@opt-in="($event) => userOptedIn = $event"
								/>
							</div>

							<div v-else-if="!isLoggedIn && showLoginContinueButton">
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
									:state="continueButtonState"
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
									:href="'/ui-login?autoPage=true&force=true&doneUrl=/checkout'"
									:state="continueButtonState"
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
									:href="'/ui-login?loginHint=signUp&force=true&doneUrl=/checkout'"
									:state="continueButtonState"
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
									:state="continueButtonState"
								>
									Continue as guest
								</kv-button>
							</div>
							<div
								v-if="!isLoggedIn
									&& showLoginContinueButton
									&& eligibleForGuestCheckout
									&& guestCheckoutCTAExpActive"
								class="tw-text-right"
							>
								<span>Already have an account?</span>
								<a
									href="/ui-login?force=true&amp;doneUrl=%2Fcheckout"
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

					<ftds-disclaimer
						v-if="showFtdMessage"
						:ftd-credit-amount="ftdCreditAmount"
						:ftd-valid-date="ftdValidDate"
					/>
				</div>
			</div>
			<campaign-verification-form
				v-if="showVerification"
				:form-id="externalFormId"
				:ma-id="String(managedAccountId)"
				:pf-id="String(promoFundId)"
				:user-id="String(myId)"
				@verification-complete="verificationComplete"
				@campaign-verification-opt-out="handleVerificationOptOut"
			/>
			<verify-remove-promo-credit
				:visible="showVerifyRemovePromoCredit"
				:applied-promo-total="promoAmount"
				:promo-fund-display-name="campaignPartnerName"
				:active-credit-type="activeCreditType"
				@credit-removed="handleCreditRemoved"
				@promo-opt-out-lightbox-closed="handleCancelPromoOptOut"
			/>
			<campaign-join-team-form
				v-if="showTeamForm"
				:campaign-name="campaignPartnerName"
				:team-id="teamId"
				:promo-id="promoFundId"
				@team-process-complete="handleTeamJoinProcess"
			/>

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
							v-kv-track-event="
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
					<empty-basket-carousel
						:enable-five-dollars-notes="enableFiveDollarsNotes"
						:enable-ai-loan-pills="enableAILoanPills"
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
import { gql } from 'graphql-tag';
import _get from 'lodash/get';
import _filter from 'lodash/filter';
import numeral from 'numeral';
import { readBoolSetting } from '#src/util/settingsUtils';
import { preFetchAll } from '#src/util/apolloPreFetch';
import syncDate from '#src/util/syncDate';
import { myFTDQuery, formatTransactionData } from '#src/util/checkoutUtils';
import { getPromoFromBasket } from '#src/util/campaignUtils';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import checkoutSettings from '#src/graphql/query/checkout/checkoutSettings.graphql';
import initializeCheckout from '#src/graphql/query/checkout/initializeCheckout.graphql';
import shopBasketUpdate from '#src/graphql/query/checkout/shopBasketUpdate.graphql';
import setupBasketForUserMutation from '#src/graphql/mutation/shopSetupBasketForUser.graphql';
import validatePreCheckoutMutation from '#src/graphql/mutation/shopValidatePreCheckout.graphql';
import validationErrorsFragment from '#src/graphql/fragments/checkoutValidationErrors.graphql';
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import updateLoanReservationTeam from '#src/graphql/mutation/updateLoanReservationTeam.graphql';
import checkoutUtils from '#src/plugins/checkout-utils-mixin';
import KivaCreditPayment from '#src/components/Checkout/KivaCreditPayment';
import OrderTotals from '#src/components/Checkout/OrderTotals';
import BasketItemsList from '#src/components/Checkout/BasketItemsList';
import BasketVerification from '#src/components/Checkout/BasketVerification';
import KivaCardRedemption from '#src/components/Checkout/KivaCardRedemption';
import KvLoadingOverlay from '#src/components/Kv/KvLoadingOverlay';
import CampaignVerificationForm from '#src/components/CorporateCampaign/CampaignVerificationForm';
import CampaignJoinTeamForm from '#src/components/CorporateCampaign/CampaignJoinTeamForm';
import CheckoutHolidayPromo from '#src/components/Checkout/CheckoutHolidayPromo';
import CheckoutDropInPaymentWrapper from '#src/components/Checkout/CheckoutDropInPaymentWrapper';
import EmptyBasketCarousel from '#src/components/Checkout/EmptyBasketCarousel';
import VerifyRemovePromoCredit from '#src/components/Checkout/VerifyRemovePromoCredit';
import upsellQuery from '#src/graphql/query/checkout/upsellLoans.graphql';
import UpsellModule from '#src/components/Checkout/UpsellModule';
import updateLoanReservation from '#src/graphql/mutation/updateLoanReservation.graphql';
import * as Sentry from '@sentry/vue';
import _forEach from 'lodash/forEach';
import { isLoanFundraising } from '#src/util/loanUtils';
import MatchedLoansLightbox from '#src/components/Checkout/MatchedLoansLightbox';
import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';
import fiveDollarsTest, { FIVE_DOLLARS_NOTES_EXP } from '#src/plugins/five-dollars-test-mixin';
import FtdsMessage from '#src/components/Checkout/FtdsMessage';
import FtdsDisclaimer from '#src/components/Checkout/FtdsDisclaimer';
import { removeLoansFromChallengeCookie } from '#src/util/teamChallengeUtils';
import { KvLoadingPlaceholder, KvPageContainer, KvButton } from '@kiva/kv-components';
import { fetchPostCheckoutAchievements, getIsMyKivaEnabled, MY_KIVA_FOR_ALL_USERS_KEY } from '#src/util/myKivaUtils';
import postCheckoutAchievementsQuery from '#src/graphql/query/postCheckoutAchievements.graphql';
import aiLoanPillsTest from '#src/plugins/ai-loan-pills-mixin';

const ASYNC_CHECKOUT_EXP = 'async_checkout_rollout';
const CHECKOUT_LOGIN_CTA_EXP = 'checkout_login_cta';
const GUEST_CHECKOUT_CTA_EXP = 'guest_checkout_cta';
const DEPOSIT_REWARD_EXP_KEY = 'deposit_incentive_banner';

// Query to gather user Teams
const myTeamsQuery = gql`query myTeamsQuery {
	my {
		id
		lender {
			id
			teams(limit: 100) {
				values {
					id
					name
				}
			}
		}
	}
}`;

const getLoans = basket => {
	const loansResponse = basket?.items?.values ?? [];
	const loans = loansResponse
		.filter(item => item.basketItemType === 'loan_reservation')
		.map(item => {
			return {
				...item.loan,
			};
		});

	return loans;
};

const getLoanIds = loans => (loans ?? []).map(l => l.id).filter(id => !!id);

export default {
	name: 'CheckoutPage',
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
		CampaignVerificationForm,
		CheckoutHolidayPromo,
		CheckoutDropInPaymentWrapper,
		EmptyBasketCarousel,
		VerifyRemovePromoCredit,
		UpsellModule,
		MatchedLoansLightbox,
		CampaignJoinTeamForm,
		KvLoadingPlaceholder,
		FtdsMessage,
		FtdsDisclaimer,
	},
	inject: ['apollo', 'cookieStore', 'kvAuth0'],
	mixins: [checkoutUtils, fiveDollarsTest, aiLoanPillsTest],
	head: {
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
			preCheckoutStep: '',
			preValidationErrors: [],
			teams: [],
			holidayModeEnabled: false,
			currentTime: Date.now(),
			currentTimeInterval: null,
			loginButtonExperimentVersion: null,
			isGuestCheckoutEnabled: false,
			guestCheckoutCTAExpActive: false,
			checkingOutAsGuest: false,
			hasEverLoggedIn: false,
			promoData: {},
			verificationSubmitted: false,
			showVerification: false,
			showVerifyRemovePromoCredit: false,
			upsellLoan: {},
			showUpsellModule: true,
			showMatchedLoansLightbox: false,
			showTeamForm: false,
			teamJoinStatus: null,
			myTeams: [],
			continueButtonState: 'loading',
			challengeRedirectQueryParam: '',
			asyncCheckoutActive: false,
			lenderTotalLoans: 0,
			isFtdMessageEnable: false,
			ftdCreditAmount: '',
			ftdValidDate: '',
			// Deposit incentive experiment MP-72
			depositIncentiveAmountToLend: 0,
			depositIncentiveExperimentEnabled: false,
			userOptedIn: false,
			addedUpsellLoans: [],
			possibleAchievementProgress: [],
			newAtbExpEnabled: false,
			myKivaFlagEnabled: false,
			isMyKivaEnabled: false,
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
						client.query({ query: initializeCheckout, fetchPolicy: 'network-only' }),
						client.query({ query: experimentAssignmentQuery, variables: { id: DEPOSIT_REWARD_EXP_KEY } }),
						client.query({ query: experimentAssignmentQuery, variables: { id: ASYNC_CHECKOUT_EXP } }),
						client.query({ query: experimentAssignmentQuery, variables: { id: CHECKOUT_LOGIN_CTA_EXP } }),
						client.query({ query: experimentAssignmentQuery, variables: { id: GUEST_CHECKOUT_CTA_EXP } }),
						client.query({ query: experimentAssignmentQuery, variables: { id: FIVE_DOLLARS_NOTES_EXP } }),
					]);
				})
				.then(response => {
					// eslint-disable-next-line max-len
					const newAtbExpEnabled = readBoolSetting(response[0]?.data, 'general.new_atb_experience_enable.value');
					if (newAtbExpEnabled) {
						const basket = response[0]?.data?.shop?.basket ?? null;
						const loans = getLoans(basket);

						return fetchPostCheckoutAchievements(client, getLoanIds(loans));
					}
				});
		},
		result({ data }) {
			// Checking if guest checkout feature is enabled in Admin settingsManager
			this.isGuestCheckoutEnabled = data?.general?.guestCheckoutEnabled?.value === 'true';
			// user data
			this.myBalance = _get(data, 'my.userAccount.balance');
			this.myId = _get(data, 'my.userAccount.id');
			this.teams = _get(data, 'my.lender.teams.values');
			this.hasEverLoggedIn = _get(data, 'hasEverLoggedIn', false);
			this.lenderTotalLoans = data?.my?.loans?.totalCount ?? 0;
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

			// Enable FTDs message from settings
			this.isFtdMessageEnable = readBoolSetting(data, 'general.ftd_message_enable.value');
			this.ftdCreditAmount = data?.general?.ftd_message_amount?.value ?? '';
			this.ftdValidDate = data?.general?.ftd_message_valid_date?.value ?? '';

			// Deposit incentive experiment MP-72
			this.depositIncentiveAmountToLend = numeral(data?.my?.depositIncentiveAmountToLend ?? 0).value();

			this.newAtbExpEnabled = readBoolSetting(data, 'general.new_atb_experience_enable.value');

			this.myKivaFlagEnabled = readBoolSetting(data, MY_KIVA_FOR_ALL_USERS_KEY);
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

		// Fire error for empty shop state
		if (typeof window !== 'undefined' && !this.totals) {
			Sentry.withScope(scope => {
				scope.setTag('init_checkout', 'Missing baseline basket information');
				Sentry.captureMessage(`Missing baseline basket information; totals value is ${this.totals}.`);
			});
		}

		// TODO: Implement check against contentful setting
		// to signify if holiday mode is enabled

		// VUE-1725 Async Checkout Mutation Rollout
		const asyncCheckoutExp = this.apollo.readFragment({
			id: `Experiment:${ASYNC_CHECKOUT_EXP}`,
			fragment: experimentVersionFragment,
		}) || {};

		this.asyncCheckoutActive = asyncCheckoutExp?.version === 'b';
		if (asyncCheckoutExp?.version) {
			this.$kvTrackEvent(
				'Basket',
				'EXP-VUE-1725-Aug2023',
				this.asyncCheckoutExpVersion,
			);
		}

		// GROW-203 login/registration CTA experiment
		const loginButtonExperiment = this.apollo.readFragment({
			id: `Experiment:${CHECKOUT_LOGIN_CTA_EXP}`,
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

		if (this.eligibleForGuestCheckout) {
			const guestCheckoutCTAExperiment = this.apollo.readFragment({
				id: `Experiment:${GUEST_CHECKOUT_CTA_EXP}`,
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
		const matchedLoansWithCredit = this.loans?.filter(loan => {
			const hasCredits = loan.creditsUsed?.length > 0;
			const isMatchedLoan = loan.loan?.matchingText;
			return hasCredits && isMatchedLoan;
		});
		this.matchedText = matchedLoansWithCredit[0]?.loan?.matchingText ?? '';

		this.initializeFiveDollarsNotes();

		// Deposit incentive experiment MP-72
		this.initializeDepositIncentiveExperiment();

		if (this.newAtbExpEnabled) {
			const response = this.apollo.readQuery({
				query: postCheckoutAchievementsQuery,
				variables: { loanIds: getLoanIds(this.loans) },
			});

			this.possibleAchievementProgress = response?.postCheckoutAchievements?.recentCompletedProgress ?? [];
		}

		// Checkout page MyKiva pills only visible with new feature
		if (this.myKivaFlagEnabled) {
			this.isMyKivaEnabled = getIsMyKivaEnabled(
				this.apollo,
				this.$kvTrackEvent,
				this.myKivaFlagEnabled,
				this.cookieStore,
			);
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
			const userStatus = this.isLoggedIn ? 'Logged-In' : 'Un-Authenticated';
			this.$kvTrackEvent('Checkout', 'EXP-Checkout-Loaded', userStatus);
		});

		// cover ssr or spa page load
		if (this.isLoggedIn) {
			this.logBasketState();
		}

		// show toast for specified scenario
		this.handleToast();
		this.getPromoInformationFromBasket();
		this.getUpsellModuleData();
	},
	computed: {
		isUpsellUnder100() {
			const loanAmount = this.upsellLoan?.loanAmount ?? 0;
			const fundedAmount = this.upsellLoan?.loanFundraisingInfo?.fundedAmount ?? 0;
			const reservedAmount = this.upsellLoan?.loanFundraisingInfo?.reservedAmount ?? 0;
			const amountLeft = loanAmount - fundedAmount - reservedAmount;
			return amountLeft < 100;
		},
		showIncentiveUpsell() {
			// only show the incentive upsell if the user has not reached the goal MP-72
			return this.depositIncentiveExperimentEnabled
				&& this.depositIncentiveAmountToLend > parseFloat(this.totals.loanReservationTotal);
		},
		showUpsell() {
			// hide regular upsell if the incentive upsell is shown MP-72
			if (this.showIncentiveUpsell) {
				return false;
			}
			// show upsell module only once per session
			const upsellLoanAdded = this.cookieStore.get('upsell-loan-added') === 'true';
			// hide upsell for donation-only baskets
			const onlyDonations = this.loans.length === 0 && this.kivaCards.length === 0 && !this.emptyBasket;

			return !upsellLoanAdded && !onlyDonations;
		},
		isLoggedIn() {
			if (this.checkingOutAsGuest) {
				return true;
			}
			if (this.myId !== null && this.myId !== undefined) {
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
				&& !this.isLoggedIn
				&& !this.hasEverLoggedIn
			) {
				return true;
			}
			return false;
		},
		showLoginContinueButton() {
			if (!this.myId || !this.isLoggedIn) {
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
		},
		campaignPartnerName() {
			return this.promoData?.promoFund?.displayName ?? null;
		},
		teamId() {
			return this.promoData?.promoGroup?.teamId ?? null;
		},
		externalFormId() {
			return this.promoData?.managedAccount?.formId ?? null;
		},
		managedAccountId() {
			return this.promoData?.managedAccount?.id ?? null;
		},
		promoFundId() {
			return this.promoData?.promoFund?.id ?? null;
		},
		verificationRequired() {
			if (this.promoData?.managedAccount?.isEmployee && this.promoData?.managedAccount?.formId) {
				return true;
			}
			return false;
		},
		activeCreditType() {
			return this.promoData?.promoGroup?.type ?? null;
		},
		promoAmount() {
			return this.promoData?.promoFund?.promoPrice ?? null;
		},
		loanIdsInBasket() {
			return this.loans.map(loan => loan.id);
		},
		showFtdMessage() {
			return !this.lenderTotalLoans && this.enableFtdMessage && this.ftdCreditAmount && this.ftdValidDate;
		},
	},
	methods: {
		openMatchedLoansLightbox() {
			this.$kvTrackEvent('Basket', 'click-must-deposit-message-cta', 'Learn more');
			this.showMatchedLoansLightbox = true;
		},
		closeMatchedLoansLightbox() {
			this.$kvTrackEvent('Basket', 'close-must-deposit-message', 'Dismiss');
			this.showMatchedLoansLightbox = false;
		},
		closeUpsellModule(amountLeft) {
			this.$kvTrackEvent(
				'Basket',
				'click-checkout-close-upsell',
				'Close',
				this.upsellLoan?.id,
				amountLeft
			);
			this.showUpsellModule = false;
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
				if (!this.isLoggedIn) {
					authorizeOptions.prompt = 'login';
				}

				this.kvAuth0.popupLogin(authorizeOptions).then(result => {
					// Only refetch data if login was successful
					if (result) {
						// we should operate here but it get's overwritten by the prefetch
						// this.setAuthStatus(_get(result, 'idTokenPayload'));

						// Refetch the queries for all the components in this route. All the components that use
						// the default options for the apollo plugin or that setup their own query observer will update
						const { matched } = this.$route;
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
				setTimeout(() => {
					this.setUpdatingTotals(false);
				}, 2500);
			}).catch(response => {
				console.error(`failed to update totals: ${response}`);
				this.setUpdatingTotals(false);
			});
		},
		completeTransaction(payload) {
			const transactionId = typeof payload === 'object' ? payload.transactionId : payload;
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

				let checkoutAdditionalQueryParams = this.challengeRedirectQueryParam;
				if (this.checkingOutAsGuest) {
					checkoutAdditionalQueryParams += `&optedIn=${this.userOptedIn}`;
				}
				if (payload?.username) {
					checkoutAdditionalQueryParams += `&username=${encodeURIComponent(payload.username)}`;
				}

				// redirect to thanks
				window.setTimeout(
					() => {
						this.redirectToThanks(transactionId, checkoutAdditionalQueryParams);
					},
					800
				);
			});

			removeLoansFromChallengeCookie(this.cookieStore, this.loanIdsInBasket);
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
		},
		getPromoInformationFromBasket() {
			getPromoFromBasket(this.derivedPromoFund?.id, this.apollo).then(({ data }) => {
				this.promoData = data?.shop?.promoCampaign;

				this.$nextTick(() => {
					if (
						this.isLoggedIn
						&& this.verificationRequired
						&& this.externalFormId
						&& !this.verificationSubmitted
						&& this.loans.length
					) {
						this.showVerification = true;
					} else {
						this.handleTeamForm();
					}
				});
			});
		},
		getUpsellModuleData(loanId = 0) {
			this.addedUpsellLoans.push(loanId);
			this.apollo.query({
				query: upsellQuery,
				fetchPolicy: 'network-only',
			}).then(({ data }) => {
				this.continueButtonState = 'active';
				const loans = data?.lend?.loans?.values || [];
				// Temp solution so we don't show reserved loans on upsell
				this.upsellLoan = loans.filter(loan => isLoanFundraising(loan) && !this.addedUpsellLoans.includes(loan.id))[0] || {}; // eslint-disable-line max-len
			});
		},
		verificationComplete() {
			this.verificationSubmitted = true;
			this.handleTeamForm();
		},
		handleVerificationOptOut() {
			this.showVerification = false;
			this.showVerifyRemovePromoCredit = true;
		},
		handleCancelPromoOptOut() {
			this.showVerifyRemovePromoCredit = false;
			if (
				this.isLoggedIn
				&& this.verificationRequired
				&& this.externalFormId
				&& !this.verificationSumbitted
				&& this.loans.length
			) {
				this.showVerification = true;
			}
		},
		handleCreditRemoved() {
			this.showVerification = false;
			this.$router.push(this.$route.path); // remove promo query param from url
			this.refreshTotals();
			this.verificationComplete();
		},
		addToBasket(loanId, amountLeft) { // add to basket for upsell module
			this.setUpdatingTotals(true);
			this.apollo.mutate({
				mutation: updateLoanReservation,
				variables: {
					loanId,
					price: numeral(amountLeft).format('0.00'),
				},
			}).then(({ errors }) => {
				if (errors) {
					// Handle errors from adding to basket
					_forEach(errors, error => {
						// Case if upsell loan gets reserved while user is in basket
						if (error.extensions?.code === 'no_shares_added_regular_xb') {
							this.$kvTrackEvent(
								'Basket',
								'click-checkout-upsell-reserved',
								'ATC reserved loan attempted',
								loanId
							);
							// eslint-disable-next-line max-len
							this.$showTipMsg('Looks like that loan was reserved by someone else! Try this one instead.', 'info');
							this.getUpsellModuleData(loanId);
							this.refreshTotals();
						} else {
							this.$showTipMsg(error.message, 'error');
							try {
								this.$kvTrackEvent(
									'Lending',
									'Add-to-Basket',
									`Failed: ${error.message.substring(0, 40)}...`
								);
								Sentry.captureMessage(`Add to Basket: ${error.message}`);
								if (error?.extensions?.code === 'not_all_shared_added') {
									this.getUpsellModuleData(loanId);
								}
								this.refreshTotals();
							} catch (e) {
							// no-op
							}
						}
					});
				} else {
					// If no errors, update the basket + loan info
					this.cookieStore.set('upsell-loan-added', true);
					this.$kvTrackEvent(
						'Basket',
						'click-checkout-upsell',
						'Add loan to basket',
						loanId,
						amountLeft
					);
					this.showUpsellModule = false;
					this.refreshTotals();
				}
			}).catch(error => {
				this.$showTipMsg('Failed to add loan. Please try again.', 'error');
				this.$kvTrackEvent('Lending', 'Add-to-Basket', 'Failed to add loan. Please try again.');
				Sentry.captureException(error);
			});
		},
		handleTeamJoinProcess(payload) {
			this.teamJoinStatus = payload.join;
			this.$kvTrackEvent(
				'ManagedLendingCampaign',
				'modal-join-team-process',
				`${this.teamJoinStatus} team`
			);
			this.fetchMyTeams();
		},
		fetchMyTeams() {
			this.apollo.query({
				fetchPolicy: 'network-only',
				query: myTeamsQuery
			}).then(({ data }) => {
				this.myTeams = data.my?.lender?.teams?.values ?? [];
				if (this.teamJoinStatus !== 'declined') {
					this.addTeamToLoans();
				}
			});
		},
		addTeamToLoans() {
			if (this.loans.length && this.teamId) {
				const loans = [];
				// TODO Collect these promises and refresh basket once complete
				this.loans.forEach((loan, index) => {
					loans[index] = this.apollo.mutate({
						mutation: updateLoanReservationTeam,
						variables: {
							teamId: this.teamId,
							loanId: loan.id
						}
					});
				});
			}
		},
		handleTeamForm() {
			if (
				this.loans.length
				&& this.isLoggedIn
				&& this.teamId
				&& !this.teamJoinStatus
			) {
				// check for team join optionality
				this.showTeamForm = true;
			}
		},
		initializeDepositIncentiveExperiment() {
			// Deposit incentive experiment MP-72
			const depositIncentiveExp = this.apollo.readFragment({
				id: `Experiment:${DEPOSIT_REWARD_EXP_KEY}`,
				fragment: experimentVersionFragment,
			}) || {};

			if (depositIncentiveExp.version) {
				this.$kvTrackEvent(
					'basket',
					'EXP-MP-500-Jul2024',
					depositIncentiveExp.version
				);
			}

			this.depositIncentiveExperimentEnabled = depositIncentiveExp.version === 'b';
		},
		calculateProgressAchievement(removedLoanId) {
			if (this.newAtbExpEnabled) {
				const loanIds = this.loanIdsInBasket.filter(loanId => loanId !== removedLoanId);
				if (loanIds.length) {
					this.apollo.query({
						query: postCheckoutAchievementsQuery,
						variables: { loanIds },
					}).then(({ data }) => {
						this.possibleAchievementProgress = data?.postCheckoutAchievements?.recentCompletedProgress ?? [];
					});
				}
			}
		}
	},
	unmounted() {
		clearInterval(this.currentTimeInterval);
	},
};
</script>

<style lang="scss">
@use '#src/assets/scss/settings' as *;

.upsellContainer,
.upsellContainer > .loading-placeholder {
	min-height: 250px;
}
@media screen and (width <= 733px) {
	.upsellContainer,
	.upsellContainer > .loading-placeholder {
		min-height: 300px;
	}
}

#checkout-slim {
	// loading overlay overrides
	#loading-overlay,
	#updating-overlay {
		background-color: rgb(255 255 255 / 70%);
	}
}
</style>
