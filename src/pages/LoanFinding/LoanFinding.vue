<template>
	<www-page main-class="tw-bg-white" style="height: auto;">
		<div class="tw-w-full">
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
				:per-step="2"
				:enable-five-dollars-notes="enableFiveDollarsNotes"
				:enable-relending-exp="enableRelendingExp"
				:user-balance="userBalance"
				@add-to-basket="trackCategory($event, 'recommended')"
				:class="{
					'tw-pt-3 tw-pb-4 tw-bg-secondary' : enableRelendingExp,
					'tw-pt-3' : !isLoggedIn,
				}"
			/>

			<div class="tw-flex tw-flex-col">
				<quick-filters-section
					class="tw-mt-3"
					:class="{ 'tw-order-last' : enableRelendingExp }"
					:enable-five-dollars-notes="enableFiveDollarsNotes"
					:user-balance="userBalance"
					@add-to-basket="trackCategory($event, 'quick-filters')"
					@data-loaded="trackQuickFiltersDisplayedLoans"
				/>

				<!-- Element to trigger spotlight observer -->
				<div ref="spotlightObserver"></div>

				<!-- Second category row: Matched loans section -->
				<lending-category-section
					:title="secondCategoryTitle"
					:subtitle="secondCategorySubtitle"
					:loans="secondCategoryLoans"
					class="tw-py-3"
					:class="{ 'tw-order-first' : enableRelendingExp }"
					:enable-five-dollars-notes="enableFiveDollarsNotes"
					:user-balance="userBalance"
					@add-to-basket="trackCategory($event, 'matched-lending')"
				/>
			</div>

			<partner-spotlight-section
				class="tw-pt-3"
				:spotlight-data="activeSpotlightData"
				:loans="spotlightLoans"
				:enable-five-dollars-notes="enableFiveDollarsNotes"
				:user-balance="userBalance"
				@add-to-basket="trackCategory($event, `spotlight-${activeSpotlightData.keyword}`)"
			/>
		</div>
	</www-page>
</template>

<script>
import userInfoQuery from '@/graphql/query/userInfo.graphql';
import hasEverLoggedInQuery from '@/graphql/query/shared/hasEverLoggedIn.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import LendingCategorySection from '@/components/LoanFinding/LendingCategorySection';
import QuickFiltersSection from '@/components/LoanFinding/QuickFiltersSection';
import PartnerSpotlightSection from '@/components/LoanFinding/PartnerSpotlightSection';
import { runLoansQuery } from '@/util/loanSearch/dataUtils';
import { FLSS_ORIGIN_LEND_BY_CATEGORY } from '@/util/flssUtils';
import { createIntersectionObserver } from '@/util/observerUtils';
import { getExperimentSettingCached, trackExperimentVersion } from '@/util/experiment/experimentUtils';
import { spotlightData } from '@/assets/data/components/LoanFinding/spotlightData.json';
import flssLoansQueryExtended from '@/graphql/query/flssLoansQueryExtended.graphql';
import retryAfterExpiredBasket from '@/plugins/retry-after-expired-basket-mixin';
import fiveDollarsTest, { FIVE_DOLLARS_NOTES_EXP } from '@/plugins/five-dollars-test-mixin';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';

const getHasEverLoggedIn = client => !!(client.readQuery({ query: hasEverLoggedInQuery })?.hasEverLoggedIn);

const EXP_KEY = 'loan_finding_page';
const CATEGORIES_REDIRECT_EXP_KEY = 'categories_redirect';
const prefetchedRecommendedLoansVariables = { pageLimit: 4, origin: FLSS_ORIGIN_LEND_BY_CATEGORY };
const FLSS_ONGOING_EXP_KEY = 'EXP-FLSS-Ongoing-Sitewide';
const RELENDING_EXP_KEY = 'lh_relending';

export default {
	name: 'LoanFinding',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		LendingCategorySection,
		QuickFiltersSection,
		PartnerSpotlightSection,
	},
	mixins: [retryAfterExpiredBasket, fiveDollarsTest],
	metaInfo() {
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
			userInfo: {},
			firstRowLoans: [],
			secondCategoryLoans: [
				{ id: 0 }, { id: 0 }, { id: 0 },
				{ id: 0 }, { id: 0 }, { id: 0 },
				{ id: 0 }, { id: 0 }, { id: 0 },
			],
			matchedLoansTotal: 0,
			spotlightLoans: [],
			spotlightIndex: 0,
			spotlightViewportObserver: null,
			enableRelendingExp: false,
			userBalance: undefined,
		};
	},
	apollo: {
		query: userInfoQuery,
		preFetch(config, client) {
			return Promise.all([
				client.query({ query: experimentAssignmentQuery, variables: { id: EXP_KEY } }),
				client.query({ query: experimentAssignmentQuery, variables: { id: CATEGORIES_REDIRECT_EXP_KEY } }),
				client.query({ query: experimentAssignmentQuery, variables: { id: FIVE_DOLLARS_NOTES_EXP } }),
				client.query({ query: experimentAssignmentQuery, variables: { id: FLSS_ONGOING_EXP_KEY } }),
				client.query({ query: experimentAssignmentQuery, variables: { id: RELENDING_EXP_KEY } }),
			]).then(() => {
				const userInfoPromise = client.query({
					query: userInfoQuery,
				});

				const recommendedLoansPromise = client.query({
					query: flssLoansQueryExtended,
					variables: prefetchedRecommendedLoansVariables
				});

				return Promise.all([
					userInfoPromise,
					recommendedLoansPromise,
				]);
			});
		},
		result({ data }) {
			this.userInfo = data?.my?.userAccount ?? {};
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
			if (this.enableRelendingExp) return '<span class="tw-text-action">Recycle your balance</span> and get these borrowers funded '; // eslint-disable-line max-len
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
			if (this.enableRelendingExp) return `${this.firstName}, let's put your <span class="tw-text-action">$${this.userBalanceString}</span> to good use`; // eslint-disable-line max-len
			return this.isLoggedIn
				? 'Recommended for you'
				: 'Make a difference <span class="tw-text-action">today</span>';
		},
		firstRowSubtitle() {
			if (this.enableRelendingExp) return 'Loans we think you\'ll love based on your lending history';
			return this.isLoggedIn
				? 'Loans handpicked for you based on your lending history'
				: 'Support a featured borrower with a microloan.';
		},
		showWelcomeMsg() {
			return this.isLoggedIn && !this.enableRelendingExp;
		}
	},
	methods: {
		async getRecommendedLoans() {
			const { loans } = await runLoansQuery(
				this.apollo,
				{ pageLimit: 12 },
				FLSS_ORIGIN_LEND_BY_CATEGORY
			);

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
			const almostFundedData = await runLoansQuery(
				this.apollo,
				{ sortBy: 'amountLeft', pageLimit: 4 },
				FLSS_ORIGIN_LEND_BY_CATEGORY
			);
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
			this.trackDisplayedLoans(this.enableRelendingExp ? 'relending' : 'recommended', 1, this.firstRowLoans);
		},
		trackQuickFiltersDisplayedLoans({ data, pageOffset }) {
			this.trackDisplayedLoans('quick-filters', this.enableRelendingExp ? 3 : 2, data, pageOffset);
		},
		trackSecondCarouselDisplayedLoans() {
			this.trackDisplayedLoans(
				// eslint-disable-next-line no-nested-ternary
				this.enableRelendingExp
					? 'recycle'
					: (this.matchedLoansTotal < 3 ? 'ending-soon-almost-funded' : 'matched'),
				this.enableRelendingExp ? 2 : 3,
				this.secondCategoryLoans,
			);
		},
		trackSpotlightDisplayedLoans() {
			this.trackDisplayedLoans('spotlight', 4, this.spotlightLoans);
		},
	},
	created() {
		// Ensure the first two recommended loan cards have server-cached images to reduce LCP
		const cachedRecommendedLoans = this.apollo.readQuery({
			query: flssLoansQueryExtended,
			variables: prefetchedRecommendedLoansVariables
		})?.fundraisingLoans?.values ?? [];

		this.initializeFiveDollarsNotes();

		this.userBalance = this.userInfo?.balance;

		// Relending test for users with balance
		if (Number(this.userBalance) > 0) {
			const { version } = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				RELENDING_EXP_KEY,
				'EXP-CORE-1276-April2023'
			);
			this.enableRelendingExp = version === 'b';
		}

		const recommendedArray = [
			...cachedRecommendedLoans,
			{ id: 0 }, { id: 0 },
			{ id: 0 }, { id: 0 },
			{ id: 0 }, { id: 0 },
			{ id: 0 }, { id: 0 },
		];

		let relendingArray = [
			...cachedRecommendedLoans,
		];

		/* eslint-disable max-len */
		if (this.enableFiveDollarsNotes) {
			if ((this.userBalance > 0 && this.userBalance < 10) || (this.userBalance > 20 && this.userBalance < 50)) relendingArray = relendingArray.slice(0, 2);
			if ((this.userBalance > 10 && this.userBalance < 15) || (this.userBalance > 50 && this.userBalance < 75)) relendingArray = relendingArray.slice(0, 3);
		} else {
			if (this.userBalance > 0 && this.userBalance < 50) relendingArray = relendingArray.slice(0, 2);
			if (this.userBalance > 50 && this.userBalance < 75) relendingArray = relendingArray.slice(0, 3);
		}
		/* eslint-enable max-len */

		this.firstRowLoans = this.enableRelendingExp ? relendingArray : recommendedArray;
	},
	mounted() {
		if (!this.enableRelendingExp) {
			this.getRecommendedLoans();
		} else {
			this.trackFirstRowDisplayedLoans();
		}

		this.getSecondCategoryData();
		this.verifySpotlightIndex();

		// create observer for spotlight loans
		this.createSpotlightViewportObserver();

		// The /lending-home experiment should only be tracked for users who have not logged in
		if (!getHasEverLoggedIn(this.apollo)) {
			trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				EXP_KEY,
				'EXP-CORE-1009-April2023'
			);
		}

		// Tracking for EXP-CORE-1057-Feb-2023
		const categoriesRedirectData = getExperimentSettingCached(this.apollo, CATEGORIES_REDIRECT_EXP_KEY);
		if (categoriesRedirectData.enabled) {
			trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				CATEGORIES_REDIRECT_EXP_KEY,
				'EXP-CORE-1057-Feb2023'
			);
		}

		trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'Lending',
			FLSS_ONGOING_EXP_KEY,
			'EXP-VUE-FLSS-Ongoing-Sitewide'
		);
	},
	beforeDestroy() {
		this.destroySpotlightViewportObserver();
	},
};
</script>

<style lang="postcss" scoped>
>>> [role=progressbar] {
	@apply tw-bg-tertiary;
}
</style>
