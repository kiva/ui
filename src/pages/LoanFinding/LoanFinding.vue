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
			<div class="tw-mx-auto tw-p-2 lg:tw-pt-4 tw-px-2.5 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
				<h3 class="tw-text-h3 tw-text-primary">
					Welcome back, <span class="tw-text-action data-hj-suppress">{{ firstName }}</span>
				</h3>
			</div>
			<!-- First category row: Recommended loans section -->
			<lending-category-section
				title="Recommended for you"
				subtitle="Loans handpicked for you based on your lending history"
				:loans="recommendedLoans"
				:per-step="2"
				:enable-loan-card-exp="enableLoanCardExp"
				class="tw-pt-2"
				@add-to-basket="trackCategory($event, 'recommended')"
			/>

			<quick-filters-section
				class="tw-mt-6"
				:enable-loan-card-exp="enableLoanCardExp"
				@add-to-basket="trackCategory($event, 'quick-filters')"
			/>

			<!-- Second category row: Matched loans section -->
			<lending-category-section
				v-if="secondCategoryLoans.length > 0"
				:title="secondCategoryTitle"
				:subtitle="secondCategorySubtitle"
				:loans="secondCategoryLoans"
				class="tw-pt-6 tw-pb-2"
				:enable-loan-card-exp="enableLoanCardExp"
				@add-to-basket="trackCategory($event, 'matched-lending')"
			/>

			<partner-spotlight-section
				class="tw-pt-6"
				:enable-loan-card-exp="enableLoanCardExp"
				:spotlight-data="activeSpotlightData"
				:loans="spotlightLoans"
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
import WelcomeLightbox from '@/components/LoanFinding/WelcomeLightbox';
import { getExperimentSettingCached, trackExperimentVersion } from '@/util/experimentUtils';
import { gql } from '@apollo/client';
import { spotlightData } from '@/assets/data/components/LoanFinding/spotlightData.json';
import KvToast from '~/@kiva/kv-components/vue/KvToast';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

const EXP_KEY = 'loan_finding_page';
const LOAN_CARD_EXP_KEY = 'lh_new_loan_card';

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
	data() {
		return {
			userInfo: {},
			recommendedLoans: [
				{ id: 0 }, { id: 0 }, { id: 0 },
				{ id: 0 }, { id: 0 }, { id: 0 }
			],
			secondCategoryLoans: [],
			matchedLoansTotal: 0,
			spotlightLoans: [],
			showLightbox: false,
			enableLoanCardExp: false,
			spotlightIndex: 0
		};
	},
	apollo: {
		query: userInfoQuery,
		preFetch(config, client) {
			return client.query({
				query: userInfoQuery,
			});
		},
		result({ data }) {
			this.userInfo = data?.my?.userAccount ?? {};
		}
	},
	computed: {
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
			return spotlightData[this.spotlightIndex] ?? [];
		}
	},
	methods: {
		async getRecommendedLoans() {
			const { loans } = await runLoansQuery(
				this.apollo,
				{ sortBy: 'personalized', pageLimit: 6 },
				FLSS_ORIGIN_LENDING_HOME
			);
			this.recommendedLoans = loans;
		},
		async getSecondCategoryData() {
			this.secondCategoryLoans = await this.getMatchedLoans();
			this.matchedLoansTotal = this.secondCategoryLoans.length;
			if (this.matchedLoansTotal === 0) this.secondCategoryLoans = await this.getExpiringSoonAlmostFundedCombo(); // eslint-disable-line max-len
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
			const { data } = await this.apollo.query({
				query: gql`
					query lendMatchingData {
						lend {
							loans(filters: { isMatched: true }, limit: 9) {
								values {
									id
								}
							}
						}
					}
				`,
			});
			return data?.lend?.loans?.values ?? [];

			// TODO: enable after initial experiment is complete/successful
			// https://kiva.atlassian.net/browse/CORE-1088
			// const { loans } = await runLoansQuery(
			// 	this.apollo,
			// 	{ isMatchable: true, sortBy: 'personalized', pageLimit: 9 },
			// 	FLSS_ORIGIN_LENDING_HOME
			// );
			// this.matchedLoans = loans;
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
			if (spotlightCookie) this.spotlightIndex = spotlightData.length - 1 <= Number(spotlightCookie) ? 0 : Number(spotlightCookie) + 1; // eslint-disable-line max-len
			this.cookieStore.set('lh_spotlight', this.spotlightIndex);
		}
	},
	created() {
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
	},
	mounted() {
		this.getRecommendedLoans();
		this.getSecondCategoryData();
		this.verifySpotlightIndex();
		this.fetchSpotlightLoans();
		this.showToast();

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
		const categoriesRedirectData = getExperimentSettingCached(this.apollo, 'categories_redirect');
		if (categoriesRedirectData.enabled) {
			trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				'categories_page',
				'EXP-CORE-1057-Feb2023'
			);
		}
	},
};
</script>

<style lang="postcss" scoped>
>>> [role=progressbar] {
	@apply tw-bg-tertiary;
}
</style>
