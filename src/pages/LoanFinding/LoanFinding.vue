<template>
	<www-page main-class="tw-bg-white" style="height: auto;">
		<kv-lightbox
			:visible="showLightbox"
			title="Welcome to Lending Home"
			@lightbox-closed="closeLightbox"
		>
			<welcome-lightbox @close-lightbox="closeLightbox" />
		</kv-lightbox>

		<div class="tw-w-full">
			<!-- eslint-disable-next-line max-len -->
			<div class="tw-mx-auto tw-p-2 tw-py-1 lg:tw-pt-3 tw-px-2.5 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
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
				@add-to-basket="trackCategory($event, 'recommended')"
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
				v-if="secondCategoryActive"
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

		<kv-toast
			ref="welcomeToastMessage"
			@close="closeToast()"
			class="tw-fixed tw-top-9 md:tw-top-11 tw-left-0 tw-right-0 tw-z-banner"
		>
			<template #toastContent>
				<div>
					Welcome to Lending home! We’re doing something new based on your feedback this year.
					<button @click="openLightbox()" class="tw-text-action">
						Read more here
					</button>
				</div>
			</template>
		</kv-toast>
	</www-page>
</template>

<script>
import userInfoQuery from '@/graphql/query/userInfo.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import LendingCategorySection from '@/components/LoanFinding/LendingCategorySection';
import QuickFiltersSection from '@/components/LoanFinding/QuickFiltersSection';
import PartnerSpotlightSection from '@/components/LoanFinding/PartnerSpotlightSection';
import { runLoansQuery } from '@/util/loanSearch/dataUtils';
import { FLSS_ORIGIN_LENDING_HOME } from '@/util/flssUtils';
import { createIntersectionObserver } from '@/util/observerUtils';
import WelcomeLightbox from '@/components/LoanFinding/WelcomeLightbox';
import { getExperimentSettingCached, trackExperimentVersion } from '@/util/experiment/experimentUtils';
import { spotlightData } from '@/assets/data/components/LoanFinding/spotlightData.json';
import flssLoansQuery from '@/graphql/query/flssLoansQuery.graphql';
import retryAfterExpiredBasket from '@/plugins/retry-after-expired-basket-mixin';
import fiveDollarsTest, { FIVE_DOLLARS_NOTES_EXP } from '@/plugins/five-dollars-test-mixin';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import KvToast from '~/@kiva/kv-components/vue/KvToast';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

const EXP_KEY = 'loan_finding_page';
const LOAN_CARD_EXP_KEY = 'lh_new_loan_card';
const CATEGORIES_REDIRECT_EXP_KEY = 'categories_redirect';
const prefetchedRecommendedLoansVariables = { pageLimit: 2, origin: FLSS_ORIGIN_LENDING_HOME };

export default {
	name: 'LoanFinding',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		LendingCategorySection,
		QuickFiltersSection,
		PartnerSpotlightSection,
		KvToast,
		WelcomeLightbox,
		KvLightbox
	},
	mixins: [retryAfterExpiredBasket, fiveDollarsTest],
	data() {
		return {
			userInfo: {},
			recommendedLoans: [],
			secondCategoryLoans: [],
			matchedLoansTotal: 0,
			spotlightLoans: [],
			showLightbox: false,
			enableLoanCardExp: false,
			spotlightIndex: 0,
			spotlightViewportObserver: null,
			secondCategoryActive: false,
		};
	},
	apollo: {
		query: userInfoQuery,
		preFetch(config, client) {
			const userInfoPromise = client.query({
				query: userInfoQuery,
			});

			const recommendedLoansPromise = client.query({
				query: flssLoansQuery,
				variables: prefetchedRecommendedLoansVariables
			});

			return Promise.all([
				userInfoPromise,
				recommendedLoansPromise,
				client.query({ query: experimentAssignmentQuery, variables: { id: EXP_KEY } }),
				client.query({ query: experimentAssignmentQuery, variables: { id: LOAN_CARD_EXP_KEY } }),
				client.query({ query: experimentAssignmentQuery, variables: { id: CATEGORIES_REDIRECT_EXP_KEY } }),
				client.query({ query: experimentAssignmentQuery, variables: { id: FIVE_DOLLARS_NOTES_EXP } }),
			]);
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
		secondCategoryTitle() {
			if (this.matchedLoansTotal > 0) return 'Matched lending'; return 'Borrowers at the finish line';
		},
		secondCategorySubtitle() {
			if (this.matchedLoansTotal > 0) return 'Stretch your funds further with the help of our partners and Kivans just like you'; // eslint-disable-line max-len
			return 'Loans that are ending soon or almost funded';
		},
		activeSpotlightData() {
			return spotlightData[this.spotlightIndex] ?? {};
		},
		recommendedTitle() {
			return this.isLoggedIn ? 'Recommended for you' : 'Recommended by others';
		},
		recommendedSubtitle() {
			return this.isLoggedIn
				? 'Loans handpicked for you based on your lending history'
				: 'These borrowers need your support. Log in for personalized recommendations.';
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
			this.secondCategoryLoans = await this.getMatchedLoans();
			this.matchedLoansTotal = this.secondCategoryLoans.length;
			if (this.matchedLoansTotal < 3) {
				const fallbackLoans = await this.getExpiringSoonAlmostFundedCombo();
				this.secondCategoryLoans = [...this.secondCategoryLoans, ...fallbackLoans].slice(0, 9);
			}
			this.secondCategoryActive = true;
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
		closeToast() {
			this.$kvTrackEvent('event-tracking', 'dismiss', 'lending-home-toast-dismissed');
		},
		showToast() {
			if (!this.cookieStore.get('lending-home-toast')) {
				this.$refs.welcomeToastMessage.show('', 'kiva-logo', false, 10000);
				this.cookieStore.set('lending-home-toast', true);
				this.$kvTrackEvent('event-tracking', 'show', 'lending-home-toast-showed');
			}
		},
		openLightbox() {
			this.showLightbox = true;
			this.$refs.welcomeToastMessage.close();
			this.$kvTrackEvent('event-tracking', 'click', 'lending-home-toast-read-more-clicked');
		},
		closeLightbox() {
			this.showLightbox = false;
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
			query: flssLoansQuery,
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
	},
	mounted() {
		this.getRecommendedLoans();
		this.getSecondCategoryData();
		this.verifySpotlightIndex();
		this.showToast();

		// create observer for spotlight loans
		this.createSpotlightViewportObserver();

		const { enabled } = getExperimentSettingCached(this.apollo, EXP_KEY);
		if (enabled) {
			trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				EXP_KEY,
				'EXP-CORE-854-Dec2022'
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
