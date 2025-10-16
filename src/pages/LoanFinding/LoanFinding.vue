<template>
	<www-page main-class="tw-bg-white" style="height: auto;">
		<kv-atb-modal-container
			:added-loan="addedLoan"
		/>
		<five-dollars-banner v-if="showFiveDollarsBanner" class="tw-mb-2" />
		<!-- eslint-disable-next-line max-len -->
		<div v-if="showWelcomeMsg" class="tw-mx-auto tw-p-2 tw-py-1 lg:tw-pt-3 tw-px-2.5 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
			<h3 class="tw-text-h3 tw-text-primary">
				Welcome back{{ firstName ? ', ' : '' }}
				<span v-if="firstName" class="tw-text-action data-hj-suppress">{{ firstName }}</span>
			</h3>
		</div>
		<!-- First category row: Recommended loans section -->
		<lending-category-section
			:title="firstRowTitle"
			:subtitle="firstRowSubtitle"
			:loans="firstRowLoans"
			:enable-five-dollars-notes="enableFiveDollarsNotes"
			:user-balance="userBalance"
			:per-step="perStepRecommendedRow"
			:class="{ 'tw-pt-3' : !isLoggedIn }"
			:enable-ai-loan-pills="enableAILoanPills"
			@add-to-basket="trackCategory($event, 'recommended')"
			@show-cart-modal="handleCartModal"
			@show-loan-details="showLoanDetails"
			@mouse-enter-loan-card="loadBPData"
		/>
		<!-- Almost Funded loans row -->
		<lending-category-section
			id="almost-funded-section"
			v-if="enableAlmostFundedRow"
			:title="almostFundedRowTitle"
			:subtitle="almostFundedRowSubtitle"
			:loans="almostFundedLoans"
			:enable-five-dollars-notes="enableFiveDollarsNotes"
			:user-balance="userBalance"
			:enable-ai-loan-pills="enableAILoanPills"
			class="tw-pt-3 tw-mb-2"
			@add-to-basket="trackCategory($event, 'almost-funded')"
			@show-cart-modal="handleCartModal"
			@show-loan-details="showLoanDetails"
			@mouse-enter-loan-card="loadBPData"
		/>
		<!-- Five dollars row -->
		<lending-category-section
			id="five-dollars-section"
			v-if="enableFiveDollarsNotes"
			:title="fiveDollarsRowTitle"
			:subtitle="fiveDollarsRowSubtitle"
			:loans="fiveDollarsRowLoans"
			:enable-five-dollars-notes="enableFiveDollarsNotes"
			:user-balance="userBalance"
			:five-dollars-selected="true"
			:title-icon="HandOrangeIcon"
			:enable-ai-loan-pills="enableAILoanPills"
			class="tw-pt-3 tw-mb-2"
			@add-to-basket="trackCategory($event, 'five-dollars')"
			@show-cart-modal="handleCartModal"
			@show-loan-details="showLoanDetails"
			@mouse-enter-loan-card="loadBPData"
		/>
		<div class="tw-flex tw-flex-col">
			<quick-filters-section
				class="tw-mt-3"
				:enable-five-dollars-notes="enableFiveDollarsNotes"
				:enable-qf-mobile="enableQFMobileVersion"
				:enable-almost-funded-row="enableAlmostFundedRow"
				:user-balance="userBalance"
				:enable-ai-loan-pills="enableAILoanPills"
				@add-to-basket="trackCategory($event, 'quick-filters')"
				@data-loaded="trackQuickFiltersDisplayedLoans"
				@show-cart-modal="handleCartModal"
				@show-loan-details="showLoanDetails"
				@mouse-enter-loan-card="loadBPData"
			/>
			<!-- Element to trigger spotlight observer -->
			<div ref="spotlightObserver"></div>
			<!-- Second category row: Matched loans section -->
			<lending-category-section
				:title="secondCategoryTitle"
				:subtitle="secondCategorySubtitle"
				:loans="secondCategoryLoans"
				class="tw-py-3"
				:enable-five-dollars-notes="enableFiveDollarsNotes"
				:user-balance="userBalance"
				:enable-ai-loan-pills="enableAILoanPills"
				@add-to-basket="trackCategory($event, 'matched-lending')"
				@show-cart-modal="handleCartModal"
				@show-loan-details="showLoanDetails"
				@mouse-enter-loan-card="loadBPData"
			/>
		</div>
		<partner-spotlight-section
			class="tw-pt-3"
			:spotlight-data="activeSpotlightData"
			:loans="spotlightLoans"
			:enable-five-dollars-notes="enableFiveDollarsNotes"
			:user-balance="userBalance"
			:enable-ai-loan-pills="enableAILoanPills"
			@add-to-basket="trackCategory($event, `spotlight-${activeSpotlightData.keyword}`)"
			@show-cart-modal="handleCartModal"
			@show-loan-details="showLoanDetails"
			@mouse-enter-loan-card="loadBPData"
		/>
	</www-page>
	<BorrowerSideSheetWrapper
		v-if="showSideSheet"
		:basket-items="basketItems"
		:is-adding="isAdding"
		:kv-track-function="$kvTrackEvent"
		:selected-loan-id="selectedLoan?.id"
		:show-back-button="false"
		:show-go-to-link="true"
		:show-headline-border="true"
		:show-side-sheet="showSideSheet"
		:width-dimensions="{ default: '100%', xl:'600px', lg: '50%', md:'50%', sm: '100%' }"
		:enable-ai-loan-pills="enableAILoanPills"
		@add-to-basket="addToBasket"
		@go-to-link="goToLink"
		@close-side-sheet="handleCloseSideSheet"
	/>
</template>

<script>
import fiveDollarsTest, { FIVE_DOLLARS_NOTES_EXP } from '#src/plugins/five-dollars-test-mixin';
import { runLoansQuery, runRecommendationsQuery } from '#src/util/loanSearch/dataUtils';

import HandOrangeIcon from '#src/assets/images/hand_orange.svg';
import { spotlightData } from '#src/assets/data/components/LoanFinding/spotlightData.json';

import BorrowerSideSheetWrapper from '#src/components/BorrowerProfile/BorrowerSideSheetWrapper';
import FiveDollarsBanner from '#src/components/LoanFinding/FiveDollarsBanner';
import LendingCategorySection from '#src/components/LoanFinding/LendingCategorySection';
import PartnerSpotlightSection from '#src/components/LoanFinding/PartnerSpotlightSection';
import QuickFiltersSection from '#src/components/LoanFinding/QuickFiltersSection';
import KvAtbModalContainer from '#src/components/WwwFrame/Header/KvAtbModalContainer';
import WwwPage from '#src/components/WwwFrame/WwwPage';

import { createIntersectionObserver } from '#src/util/observerUtils';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import { FLSS_ORIGIN_LEND_BY_CATEGORY } from '#src/util/flssUtils';
import borrowerProfileExpMixin from '#src/plugins/borrower-profile-exp-mixin';
import retryAfterExpiredBasket from '#src/plugins/retry-after-expired-basket-mixin';

import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';
import flssLoansQueryExtended from '#src/graphql/query/flssLoansQueryExtended.graphql';
import loanRecommendationsQueryExtended from '#src/graphql/query/loanRecommendationsExtendedQuery.graphql';
import userInfoQuery from '#src/graphql/query/userInfo.graphql';

const prefetchedFlssVariables = {
	pageLimit: 4,
	origin: FLSS_ORIGIN_LEND_BY_CATEGORY
};

const prefetchedRecommendationsVariables = {
	origin: FLSS_ORIGIN_LEND_BY_CATEGORY,
	userId: null,
	limit: 4
};

const ALMOST_FUNDED_ROW_EXP_KEY = 'lh_almost_funded_row';
const FIVE_DOLLARS_BANNER_KEY = 'kvfivedollarsbanner';
const FLSS_ONGOING_EXP_KEY = 'EXP-FLSS-Ongoing-Sitewide-3';
const LOAN_RECOMMENDATIONS_EXP_KEY = 'lh_loan_recommendations';
const QUICK_FILTERS_MOBILE_EXP_KEY = 'lh_qf_mobile_version';
const THREE_LOANS_RECOMMENDED_ROW_EXP_KEY = 'lh_three_loans_recommended_row';
const COMBO_PAGE_REDIRECT_EXP_KEY = 'lbc_combo_redirect';

export default {
	name: 'LoanFinding',
	components: {
		BorrowerSideSheetWrapper,
		FiveDollarsBanner,
		KvAtbModalContainer,
		LendingCategorySection,
		PartnerSpotlightSection,
		QuickFiltersSection,
		WwwPage,
	},
	mixins: [retryAfterExpiredBasket, fiveDollarsTest, borrowerProfileExpMixin],
	head() {
		return {
			title: 'Make a loan, change a life | Loans by category',
			meta: [
				{
					vmid: 'description',
					name: 'description',
					content: 'Choose a category, lend to borrowers, and make an impact. '
						+ 'Each Kiva loan helps people build a better future for themselves and their families.'
				},
			],
		};
	},
	data() {
		return {
			almostFundedLoans: new Array(9).fill({ id: 0 }),
			enableAlmostFundedRow: false,
			enableLoanRecommendations: false,
			enableQFMobileVersion: false,
			enableThreeLoansRecommended: false,
			firstRowLoans: [],
			fiveDollarsRowLoans: new Array(30).fill({ id: 0 }),
			HandOrangeIcon,
			matchedLoansTotal: 0,
			secondCategoryLoans: new Array(9).fill({ id: 0 }),
			selectedOption: '25',
			showFiveDollarsBanner: false,
			showSideSheet: false,
			spotlightIndex: 0,
			spotlightLoans: [],
			spotlightViewportObserver: null,
			userBalance: undefined,
			userInfo: {},
		};
	},
	apollo: {
		preFetch(config, client, { route }) {
			return Promise.all([
				client.query({
					query: experimentAssignmentQuery,
					variables: { id: LOAN_RECOMMENDATIONS_EXP_KEY }
				}),
				client.query({ query: userInfoQuery }),
				client.query({
					query: experimentAssignmentQuery,
					variables: { id: COMBO_PAGE_REDIRECT_EXP_KEY }
				}),
			]).then(([recommendationsExp, userInfo, redirectExp]) => {
				const query = route?.query ?? {};
				const useRecommendations = recommendationsExp?.data?.experiment?.version === 'b';
				const userId = userInfo?.data?.my?.userAccount?.id || null;
				const isRedirectExp = redirectExp?.data?.experiment?.version === 'b';

				// Redirect to /lend-category-beta if redirect experiment is active
				if (isRedirectExp) {
					return Promise.reject({ path: '/lend-category-beta', query });
				}

				return Promise.all([
					client.query({
						query: experimentAssignmentQuery,
						variables: { id: THREE_LOANS_RECOMMENDED_ROW_EXP_KEY }
					}),
					client.query({
						query: experimentAssignmentQuery,
						variables: { id: FIVE_DOLLARS_NOTES_EXP }
					}),
					client.query({
						query: experimentAssignmentQuery,
						variables: { id: FLSS_ONGOING_EXP_KEY }
					}),
					client.query({
						query: useRecommendations ? loanRecommendationsQueryExtended : flssLoansQueryExtended,
						variables: useRecommendations ? {
							...prefetchedRecommendationsVariables,
							userId
						} : prefetchedFlssVariables
					}),
				]);
			});
		}
	},
	computed: {
		isLoggedIn() {
			return !!this.userInfo?.id;
		},
		firstName() {
			return this.userInfo?.firstName ?? '';
		},
		userBalanceString() {
			const balance = this.userInfo?.balance ?? '';
			if (balance % 1 === 0) return Number(balance).toFixed();
			return balance;
		},
		secondCategoryTitle() {
			if (this.matchedLoansTotal > 0) {
				if (this.matchedLoansTotal < 3) return 'Help these borrowers cross the finish line';
				return 'Matched lending';
			}
			return 'Borrowers at the finish line';
		},
		secondCategorySubtitle() {
			if (this.matchedLoansTotal > 0) {
				if (this.matchedLoansTotal < 3) return 'Loans that are ending soon, almost funded, and matched';
				return 'Stretch your funds further with the help of our partners and Kivans just like you';
			}
			return 'Loans that are ending soon or almost funded';
		},
		activeSpotlightData() {
			return spotlightData[this.spotlightIndex] ?? {};
		},
		firstRowTitle() {
			return this.isLoggedIn
				? 'Recommended for you'
				: 'Make a difference <span class="tw-text-action">today</span>';
		},
		firstRowSubtitle() {
			return this.isLoggedIn
				? 'Loans handpicked for you based on your lending history'
				: 'Support a featured borrower with a microloan.';
		},
		fiveDollarsRowTitle() {
			return 'It takes just <span class="tw-text-action">$5 to change a life</span>';
		},
		fiveDollarsRowSubtitle() {
			return 'Lend as little as $5 to fund a new dream.';
		},
		showWelcomeMsg() {
			return this.isLoggedIn && !this.showFiveDollarsBanner;
		},
		perStepRecommendedRow() {
			return !this.enableThreeLoansRecommended ? 2 : 3;
		},
		almostFundedRowTitle() {
			return 'Loans that are <span class="tw-text-action">almost funded</span>';
		},
		almostFundedRowSubtitle() {
			return 'Be the difference maker for these borrowers who only have a small amount remaining to be funded.';
		},
	},
	methods: {
		async getRecommendedLoans() {
			let loans = [];
			if (this.enableLoanRecommendations) {
				const response = await runRecommendationsQuery(this.apollo, {
					userId: this.userInfo?.id || null,
					origin: FLSS_ORIGIN_LEND_BY_CATEGORY,
					limit: 12
				});
				loans = response.loans;
			} else {
				const response = await runLoansQuery(
					this.apollo,
					{ pageLimit: 12 },
					FLSS_ORIGIN_LEND_BY_CATEGORY
				);
				loans = response.loans;
			}

			// Ensure unique loans are pushed since recommendations can change quickly
			const remainingRecommendedLoans = loans
				.filter(l => !this.firstRowLoans.filter(r => r.id === l.id).length)
				.slice(0, 8);
			this.firstRowLoans = [
				...this.firstRowLoans.slice(0, 4),
				...remainingRecommendedLoans
			];
			this.trackFirstRowDisplayedLoans();
		},
		async getSecondCategoryData() {
			let fallbackLoans = [];
			const matchedLoans = await this.getMatchedLoans();
			this.matchedLoansTotal = matchedLoans.length;
			if (this.matchedLoansTotal < 3) {
				fallbackLoans = await this.getExpiringSoonAlmostFundedCombo();
			}
			this.secondCategoryLoans = [...matchedLoans, ...fallbackLoans].slice(0, 9);

			this.trackSecondCarouselDisplayedLoans();
		},
		async getExpiringSoonAlmostFundedCombo() {
			const expiringSoonData = await runLoansQuery(
				this.apollo,
				{ sortBy: 'expiringSoon', pageLimit: 5 },
				FLSS_ORIGIN_LEND_BY_CATEGORY
			);
			const almostFundedData = await this.almostFundedQuery(4);

			return [...expiringSoonData.loans, ...almostFundedData.loans];
		},
		async getMatchedLoans() {
			const { loans } = await runLoansQuery(
				this.apollo,
				{ isMatchable: true, pageLimit: 9 },
				FLSS_ORIGIN_LEND_BY_CATEGORY
			);
			return loans ?? [];
		},
		async getFiveDollarsLoans() {
			const { loans } = await runLoansQuery(
				this.apollo,
				{ sortBy: 'amountLowToHigh', pageLimit: 30 },
				FLSS_ORIGIN_LEND_BY_CATEGORY
			);
			this.fiveDollarsRowLoans = loans ?? [];
		},
		async fetchSpotlightLoans() {
			// Only query the spotlight loans once
			if (this.spotlightLoans?.length) return;

			const flssFilterCriteria = this.activeSpotlightData?.flssLoanSearch ?? {};
			const { loans } = await runLoansQuery(
				this.apollo,
				{ ...flssFilterCriteria, pageLimit: 6 },
				FLSS_ORIGIN_LEND_BY_CATEGORY
			);

			this.spotlightLoans = loans ?? [];

			this.trackSpotlightDisplayedLoans();
		},
		async getAlmostFundedLoans() {
			const { loans } = await this.almostFundedQuery(9);
			this.almostFundedLoans = loans ?? [];
		},
		almostFundedQuery(pageLimit) {
			return runLoansQuery(
				this.apollo,
				{ sortBy: 'amountLeft', pageLimit },
				FLSS_ORIGIN_LEND_BY_CATEGORY
			);
		},
		trackCategory({ success }, category) {
			if (success) this.$kvTrackEvent('loan-card', 'add-to-basket', `${category}-lending-home`);
		},
		verifySpotlightIndex() {
			const spotlightCookie = this.cookieStore.get('lh_spotlight') || null;
			const cookieIndexNumber = Number(spotlightCookie);
			if (spotlightCookie) this.spotlightIndex = spotlightData.length - 1 <= cookieIndexNumber ? 0 : cookieIndexNumber + 1; // eslint-disable-line max-len
			this.cookieStore.set('lh_spotlight', this.spotlightIndex);
			this.$kvTrackEvent('event-tracking', 'show', `lending-home-spotlight-${this.activeSpotlightData.keyword}`);
		},
		createSpotlightViewportObserver() {
			this.spotlightViewportObserver = createIntersectionObserver({
				targets: [this.$refs.spotlightObserver],
				callback: entries => {
					entries.forEach(entry => {
						if (entry.isIntersecting) {
							this.fetchSpotlightLoans();
						}
					});
				}
			});
		},
		destroySpotlightViewportObserver() {
			if (this.spotlightViewportObserver) {
				this.spotlightViewportObserver.disconnect();
			}
		},
		trackDisplayedLoans(sectionIdentifier, sectionPosition, loans, pageOffset = 0) {
			const loansDisplayed = loans?.filter(l => !!l.id)?.map((l, i) => ({
				position: i + pageOffset + 1,
				loanId: l.id,
			})) ?? [];

			if (loansDisplayed.length) {
				const event = {
					// eslint-disable-next-line max-len
					schema: 'https://raw.githubusercontent.com/kiva/snowplow/master/conf/snowplow_lend_by_category_loan_display_event_v3_schema_1_0_0.json#',
					data: {
						sectionIdentifier,
						sectionPosition,
						loansDisplayed,
					},
				};

				this.$kvTrackSelfDescribingEvent(event);
			}
		},
		trackFirstRowDisplayedLoans() {
			this.trackDisplayedLoans('recommended', 1, this.firstRowLoans);
		},
		trackQuickFiltersDisplayedLoans({ data, pageOffset }) {
			this.trackDisplayedLoans('quick-filters', 2, data, pageOffset);
		},
		trackSecondCarouselDisplayedLoans() {
			this.trackDisplayedLoans(
				this.matchedLoansTotal < 3 ? 'ending-soon-almost-funded' : 'matched',
				3,
				this.secondCategoryLoans,
			);
		},
		trackSpotlightDisplayedLoans() {
			this.trackDisplayedLoans('spotlight', 4, this.spotlightLoans);
		},
		check5DollarsBannerCookie() {
			const currentDate = new Date();
			const dateCookie = this.cookieStore.get(FIVE_DOLLARS_BANNER_KEY);
			if (!dateCookie) {
				// Set cookie with 6 months expiration
				const expires = new Date();
				expires.setMonth(expires.getMonth() + 6);
				this.cookieStore.set(FIVE_DOLLARS_BANNER_KEY, currentDate, { path: '/', expires });
				this.showFiveDollarsBanner = true;
			} else {
				const cookieDate = new Date(dateCookie);
				const timeDifference = currentDate.getTime() - cookieDate.getTime();
				const daysDifference = timeDifference / (1000 * 3600 * 24);
				if (daysDifference < 3) this.showFiveDollarsBanner = true;
			}
		},
		handleCloseSideSheet() {
			this.showSideSheet = false;
			this.selectedLoan = null;

			const queryParams = { ...this.$router.currentRoute?.value?.query };
			delete queryParams.loanId;
			const routerData = this.$router.resolve({ ...this.$router.currentRoute.value, query: queryParams });
			window.history.pushState({}, '', routerData?.fullPath);
		},
		showLoanDetails(loan) {
			this.selectedLoan = loan ?? undefined;
			this.showSideSheet = true;

			const queryParams = { ...this.$router.currentRoute?.value?.query };
			const routerData = this.$router.resolve({ ...this.$router.currentRoute.value, query: { ...queryParams, loanId: loan.id } }); // eslint-disable-line max-len
			window.history.pushState({}, '', routerData?.fullPath);
		},
	},
	created() {
		const loanRecommendationsData = trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'Lending',
			LOAN_RECOMMENDATIONS_EXP_KEY,
			'EXP-DSCI-2167-Dec2024'
		);

		this.enableLoanRecommendations = loanRecommendationsData.version === 'b';

		const cachedUserInfo = this.apollo.readQuery({
			query: userInfoQuery,
		});

		this.userInfo = cachedUserInfo?.my?.userAccount ?? {};

		let cachedRecommendedLoans = [];
		if (this.enableLoanRecommendations) {
			const recommendedLoansData = this.apollo.readQuery({
				query: loanRecommendationsQueryExtended,
				variables: {
					...prefetchedRecommendationsVariables,
					userId: this.userInfo?.id || null
				}
			});
			cachedRecommendedLoans = recommendedLoansData
				?.loanRecommendations?.values?.filter(loan => loan !== null) ?? [];
		} else {
			const flssLoansData = this.apollo.readQuery({
				query: flssLoansQueryExtended,
				variables: prefetchedFlssVariables
			});
			cachedRecommendedLoans = flssLoansData?.fundraisingLoans?.values?.filter(loan => loan !== null) ?? [];
		}

		this.initializeFiveDollarsNotes();

		this.userBalance = this.userInfo?.balance;

		// Show 3 loans in recommended row test
		const { version } = trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'Lending',
			THREE_LOANS_RECOMMENDED_ROW_EXP_KEY,
			'EXP-CORE-1529-Aug2023'
		);
		this.enableThreeLoansRecommended = version === 'b';

		// Show QF mobile version test
		const qfTestData = trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'Lending',
			QUICK_FILTERS_MOBILE_EXP_KEY,
			'EXP-CORE-1563-Oct2023'
		);
		this.enableQFMobileVersion = qfTestData.version === 'b';

		// Enable Almost Funded Row Test
		const almostFundedRowTestData = trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'Lending',
			ALMOST_FUNDED_ROW_EXP_KEY,
			'EXP-CORE-1564-Oct2023'
		);
		this.enableAlmostFundedRow = almostFundedRowTestData.version === 'b';

		this.firstRowLoans = [
			...cachedRecommendedLoans,
			{ id: 0 }, { id: 0 },
			{ id: 0 }, { id: 0 },
			{ id: 0 }, { id: 0 },
			{ id: 0 }, { id: 0 },
		];

		// check for $5 notes banner cookie
		if (this.enableFiveDollarsNotes) this.check5DollarsBannerCookie();
	},
	mounted() {
		this.getRecommendedLoans();
		this.getSecondCategoryData();
		this.verifySpotlightIndex();
		if (this.enableFiveDollarsNotes) this.getFiveDollarsLoans();
		if (this.enableAlmostFundedRow) this.getAlmostFundedLoans();
		// create observer for spotlight loans
		this.createSpotlightViewportObserver();
		trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'Lending',
			FLSS_ONGOING_EXP_KEY,
			'EXP-VUE-FLSS-Ongoing-Sitewide'
		);
		this.loadInitialBasketItems();

		const queryLoanId = this.$router.currentRoute?.value?.query?.loanId ?? null;

		if (queryLoanId) {
			this.selectedLoan = { id: Number(queryLoanId) };
			this.showSideSheet = true;
		}

		// Track experiment version for combo page redirect
		trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'Lending',
			COMBO_PAGE_REDIRECT_EXP_KEY,
			'EXP-MP-1758-Jul2025',
		);
	},
	beforeUnmount() {
		this.destroySpotlightViewportObserver();
	},
};
</script>

<style lang="postcss" scoped>
:deep([role=progressbar]) {
	@apply tw-bg-tertiary;
}
</style>
