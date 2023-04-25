<template>
	<www-page main-class="tw-bg-white" style="height: auto;">
		<div class="tw-w-full">
			<!-- eslint-disable-next-line max-len -->
			<div v-if="!enableRelendingExp" class="tw-mx-auto tw-p-2 tw-py-1 lg:tw-pt-3 tw-px-2.5 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
				<h3 class="tw-text-h3 tw-text-primary">
					Welcome back{{ firstName ? ', ' : '' }}
					<span v-if="firstName" class="tw-text-action data-hj-suppress">{{ firstName }}</span>
				</h3>
			</div>
			<!-- First category row: Recommended loans section -->
			<lending-category-section
				:title="recommendedTitle"
				:subtitle="recommendedSubtitle"
				:loans="recommendedLoans"
				:per-step="2"
				:enable-loan-card-exp="enableLoanCardExp"
				:enable-five-dollars-notes="enableFiveDollarsNotes"
				:enable-relending-exp="enableRelendingExp"
				@add-to-basket="trackCategory($event, 'recommended')"
				:class="{ 'tw-mt-3' : enableRelendingExp }"
			/>

			<quick-filters-section
				class="tw-mt-3"
				:enable-loan-card-exp="enableLoanCardExp"
				:enable-five-dollars-notes="enableFiveDollarsNotes"
				@add-to-basket="trackCategory($event, 'quick-filters')"
			/>

			<!-- Element to trigger spotlight observer -->
			<div ref="spotlightObserver"></div>

			<!-- Second category row: Matched loans section -->
			<lending-category-section
				v-if="secondCategoryLoans.length > 0"
				:title="secondCategoryTitle"
				:subtitle="secondCategorySubtitle"
				:loans="secondCategoryLoans"
				class="tw-py-3"
				:enable-loan-card-exp="enableLoanCardExp"
				:enable-five-dollars-notes="enableFiveDollarsNotes"
				@add-to-basket="trackCategory($event, 'matched-lending')"
			/>

			<partner-spotlight-section
				class="tw-pt-3"
				:enable-loan-card-exp="enableLoanCardExp"
				:spotlight-data="activeSpotlightData"
				:loans="spotlightLoans"
				:enable-five-dollars-notes="enableFiveDollarsNotes"
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
import { FLSS_ORIGIN_LENDING_HOME } from '@/util/flssUtils';
import { createIntersectionObserver } from '@/util/observerUtils';
import { getExperimentSettingCached, trackExperimentVersion } from '@/util/experiment/experimentUtils';
import { spotlightData } from '@/assets/data/components/LoanFinding/spotlightData.json';
import flssLoansQueryExtended from '@/graphql/query/flssLoansQueryExtended.graphql';
import retryAfterExpiredBasket from '@/plugins/retry-after-expired-basket-mixin';
import fiveDollarsTest, { FIVE_DOLLARS_NOTES_EXP } from '@/plugins/five-dollars-test-mixin';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';

const getHasEverLoggedIn = client => !!(client.readQuery({ query: hasEverLoggedInQuery })?.hasEverLoggedIn);

const EXP_KEY = 'loan_finding_page';
const LOAN_CARD_EXP_KEY = 'lh_new_loan_card';
const CATEGORIES_REDIRECT_EXP_KEY = 'categories_redirect';
const prefetchedRecommendedLoansVariables = { pageLimit: 2, origin: FLSS_ORIGIN_LENDING_HOME };
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
			link: [
				// TODO: CORE-1281 - remove if experiment is successful
				{
					vmid: 'canonical',
					rel: 'canonical',
					href: `${this.$appConfig.transport}://${this.$appConfig.host}/lend-by-category`
				},
			]
		};
	},
	data() {
		return {
			userInfo: {},
			recommendedLoans: [],
			secondCategoryLoans: [],
			matchedLoansTotal: 0,
			spotlightLoans: [],
			enableLoanCardExp: false,
			spotlightIndex: 0,
			spotlightViewportObserver: null,
			enableRelendingExp: false
		};
	},
	apollo: {
		query: userInfoQuery,
		preFetch(config, client) {
			return Promise.all([
				client.query({ query: experimentAssignmentQuery, variables: { id: EXP_KEY } }),
				client.query({ query: experimentAssignmentQuery, variables: { id: LOAN_CARD_EXP_KEY } }),
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
		userBalance() {
			const balance = this.userInfo?.balance ?? '';
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
		recommendedTitle() {
			if (this.enableRelendingExp) return `${this.firstName}, let's put your <span class="tw-text-action">$${this.userBalance}</span> to good use`; // eslint-disable-line max-len
			return this.isLoggedIn
				? 'Recommended for you'
				: 'Make a difference <span class="tw-text-action">today</span>';
		},
		recommendedSubtitle() {
			if (this.enableRelendingExp) return 'Loans we think you\'ll love based on your lending history';
			return this.isLoggedIn
				? 'Loans handpicked for you based on your lending history'
				: 'Support a featured borrower with a microloan. Log in for personalized recommendations.';
		},
	},
	methods: {
		async getRecommendedLoans() {
			const { loans } = await runLoansQuery(
				this.apollo,
				{ pageLimit: 12 },
				FLSS_ORIGIN_LENDING_HOME
			);

			// Ensure unique loans are pushed since recommendations can change quickly
			const remainingRecommendedLoans = loans
				.filter(l => !this.recommendedLoans.filter(r => r.id === l.id).length)
				.slice(0, 10);

			this.recommendedLoans = [
				...this.recommendedLoans.slice(0, 2),
				...remainingRecommendedLoans
			];
		},
		async getSecondCategoryData() {
			let fallbackLoans = [];
			const matchedLoans = await this.getMatchedLoans();
			this.matchedLoansTotal = matchedLoans.length;
			if (this.matchedLoansTotal < 3) {
				fallbackLoans = await this.getExpiringSoonAlmostFundedCombo();
			}
			this.secondCategoryLoans = [...matchedLoans, ...fallbackLoans].slice(0, 9);
		},
		async getExpiringSoonAlmostFundedCombo() {
			const expiringSoonData = await runLoansQuery(
				this.apollo,
				{ sortBy: 'expiringSoon', pageLimit: 5 },
				FLSS_ORIGIN_LENDING_HOME
			);
			const almostFundedData = await runLoansQuery(
				this.apollo,
				{ sortBy: 'amountLeft', pageLimit: 4 },
				FLSS_ORIGIN_LENDING_HOME
			);
			return [...expiringSoonData.loans, ...almostFundedData.loans];
		},
		async getMatchedLoans() {
			const { loans } = await runLoansQuery(
				this.apollo,
				{ isMatchable: true, pageLimit: 9 },
				FLSS_ORIGIN_LENDING_HOME
			);
			return loans ?? [];
		},
		async fetchSpotlightLoans() {
			const flssFilterCriteria = this.activeSpotlightData?.flssLoanSearch ?? {};
			const { loans } = await runLoansQuery(
				this.apollo,
				{ ...flssFilterCriteria, pageLimit: 6 },
				FLSS_ORIGIN_LENDING_HOME
			);

			this.spotlightLoans = loans ?? [];
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
	},
	created() {
		// Ensure the first two recommended loan cards have server-cached images to reduce LCP
		const cachedRecommendedLoans = this.apollo.readQuery({
			query: flssLoansQueryExtended,
			variables: prefetchedRecommendedLoansVariables
		})?.fundraisingLoans?.values ?? [];
		this.recommendedLoans = [
			...cachedRecommendedLoans,
			{ id: 0 }, { id: 0 },
			{ id: 0 }, { id: 0 },
			{ id: 0 }, { id: 0 },
			{ id: 0 }, { id: 0 },
			{ id: 0 }, { id: 0 }
		];

		const loanCardExpData = getExperimentSettingCached(this.apollo, LOAN_CARD_EXP_KEY);
		if (loanCardExpData.enabled) {
			const { version } = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				LOAN_CARD_EXP_KEY,
				'EXP-CORE-1073-Feb2023'
			);
			this.enableLoanCardExp = version === 'b' ?? false;
		}

		this.initializeFiveDollarsNotes();

		const userBalance = Number(this.userInfo?.balance ?? 0);
		// Relending test for users with balance
		if (userBalance) {
			const { version } = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				RELENDING_EXP_KEY,
				'EXP-CORE-1276-April2023'
			);
			this.enableRelendingExp = version === 'b';
		}
	},
	mounted() {
		this.getRecommendedLoans();
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
