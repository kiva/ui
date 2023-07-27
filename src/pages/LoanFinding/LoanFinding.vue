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

			<!-- Featured Loan: Recommended row replacement experiment -->
			<loan-finding-featured-loan
				v-if="enableRecommendedReplacementExp"
				class="tw-mb-2 tw-mt-6"
				:title="featuredLoanTitle"
				:subtitle="featuredLoanSubtitle"
				:loan="featuredLoan"
				:enable-five-dollars-notes="enableFiveDollarsNotes"
				:user-balance="userBalance"
				:first-name="firstName"
				@add-to-basket="trackCategory($event, 'recommended')"
			/>

			<!-- First category row: Recommended loans section -->
			<lending-category-section
				v-else
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

			<!-- Five dollars row -->
			<lending-category-section
				id="five-dollars-section"
				v-if="enableFiveDollarsNotes"
				:title="fiveDollarsRowTitle"
				:subtitle="fiveDollarsRowSubtitle"
				:loans="fiveDollarsRowLoans"
				:enable-five-dollars-notes="enableFiveDollarsNotes"
				:enable-relending-exp="enableRelendingExp"
				:user-balance="userBalance"
				:five-dollars-selected="true"
				:title-icon="HandOrangeIcon"
				@add-to-basket="trackCategory($event, 'five-dollars')"
				class="tw-pt-3 tw-mb-2"
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
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import LoanFindingFeaturedLoan from '@/components/LoanFinding/LoanFindingFeaturedLoan';
import LendingCategorySection from '@/components/LoanFinding/LendingCategorySection';
import QuickFiltersSection from '@/components/LoanFinding/QuickFiltersSection';
import PartnerSpotlightSection from '@/components/LoanFinding/PartnerSpotlightSection';
import { runLoansQuery } from '@/util/loanSearch/dataUtils';
import { FLSS_ORIGIN_LEND_BY_CATEGORY } from '@/util/flssUtils';
import { createIntersectionObserver } from '@/util/observerUtils';
import { trackExperimentVersion } from '@/util/experiment/experimentUtils';
import { spotlightData } from '@/assets/data/components/LoanFinding/spotlightData.json';
import flssLoansQueryExtended from '@/graphql/query/flssLoansQueryExtended.graphql';
import retryAfterExpiredBasket from '@/plugins/retry-after-expired-basket-mixin';
import fiveDollarsTest, { FIVE_DOLLARS_NOTES_EXP } from '@/plugins/five-dollars-test-mixin';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import HandOrangeIcon from '@/assets/images/hand_orange.svg';

const prefetchedRecommendedLoansVariables = { pageLimit: 4, origin: FLSS_ORIGIN_LEND_BY_CATEGORY };
const prefetchedEndingSoonLoanVariables = { pageLimit: 1, sortBy: 'expiringSoon', origin: FLSS_ORIGIN_LEND_BY_CATEGORY }; // eslint-disable-line max-len
const FLSS_ONGOING_EXP_KEY = 'EXP-FLSS-Ongoing-Sitewide';
const RECOMMENDED_REPLACEMENT_EXP_KEY = 'lh_recommended_row_replacement';

export default {
	name: 'LoanFinding',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		LendingCategorySection,
		QuickFiltersSection,
		PartnerSpotlightSection,
		LoanFindingFeaturedLoan,
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
			fiveDollarsRowLoans: [
				{ id: 0 }, { id: 0 }, { id: 0 },
				{ id: 0 }, { id: 0 }, { id: 0 },
				{ id: 0 }, { id: 0 }, { id: 0 },
				{ id: 0 }, { id: 0 }, { id: 0 },
				{ id: 0 }, { id: 0 }, { id: 0 },
				{ id: 0 }, { id: 0 }, { id: 0 },
				{ id: 0 }, { id: 0 }, { id: 0 },
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
			enableRecommendedReplacementExp: false,
			featuredLoan: {},
			HandOrangeIcon,
		};
	},
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: experimentAssignmentQuery, variables: { id: RECOMMENDED_REPLACEMENT_EXP_KEY }
			}).then(() => {
				// Recommended row replacement test
				const { version } = client.readFragment({
					id: `Experiment:${RECOMMENDED_REPLACEMENT_EXP_KEY}`,
					fragment: experimentVersionFragment,
				}) ?? {};

				let endingSoonLoanPromise = Promise.resolve();

				if (version === 'b') {
					endingSoonLoanPromise = client.query({
						query: flssLoansQueryExtended,
						variables: prefetchedEndingSoonLoanVariables
					});
				}

				const recommendedLoansPromise = client.query({
					query: flssLoansQueryExtended,
					variables: prefetchedRecommendedLoansVariables
				});

				return Promise.all([
					client.query({ query: userInfoQuery }),
					client.query({ query: experimentAssignmentQuery, variables: { id: FIVE_DOLLARS_NOTES_EXP } }),
					client.query({ query: experimentAssignmentQuery, variables: { id: FLSS_ONGOING_EXP_KEY } }),
					endingSoonLoanPromise,
					recommendedLoansPromise
				]);
			});
		},
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
		featuredLoanTitle() {
			return this.isLoggedIn
				? 'Recommended for you,'
				: 'A loan ending soon';
		},
		featuredLoanSubtitle() {
			return this.isLoggedIn
				? 'Make a difference for this borrower today.'
				: 'Make a difference for these borrowers who only have a short time remaining.';
		},
		fiveDollarsRowTitle() {
			return 'It takes just <span class="tw-text-action">$5 to change a life</span>';
		},
		fiveDollarsRowSubtitle() {
			return 'Lend as little as $5 to fund a new dream.';
		},
		showWelcomeMsg() {
			return this.isLoggedIn && !this.enableRelendingExp && !this.enableRecommendedReplacementExp;
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
			this.trackDisplayedLoans('recommended', 1, this.enableRecommendedReplacementExp ? [this.featuredLoan] : this.firstRowLoans); // eslint-disable-line max-len
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
		const cachedUserInfo = this.apollo.readQuery({
			query: userInfoQuery,
		});

		this.userInfo = cachedUserInfo.my?.userAccount ?? {};

		const cachedRecommendedLoans = this.apollo.readQuery({
			query: flssLoansQueryExtended,
			variables: prefetchedRecommendedLoansVariables
		})?.fundraisingLoans?.values ?? [];

		this.initializeFiveDollarsNotes();

		this.userBalance = this.userInfo?.balance;

		// Recommended row replacement test
		const { version } = trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'Lending',
			RECOMMENDED_REPLACEMENT_EXP_KEY,
			'EXP-CORE-1341-May2023'
		);
		this.enableRecommendedReplacementExp = version === 'b';

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

		if (this.enableRecommendedReplacementExp) {
			const cachedEndingSoonLoan = this.apollo.readQuery({
				query: flssLoansQueryExtended,
				variables: prefetchedEndingSoonLoanVariables
			})?.fundraisingLoans?.values[0] ?? { id: 0 };

			this.featuredLoan = this.isLoggedIn && this.firstRowLoans.length > 0
				? this.firstRowLoans[0]
				: cachedEndingSoonLoan;
		}
	},
	mounted() {
		if (!this.enableRelendingExp) {
			this.getRecommendedLoans();
		} else {
			this.trackFirstRowDisplayedLoans();
		}

		this.getSecondCategoryData();
		this.verifySpotlightIndex();

		if (this.enableFiveDollarsNotes) this.getFiveDollarsLoans();

		// create observer for spotlight loans
		this.createSpotlightViewportObserver();

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
