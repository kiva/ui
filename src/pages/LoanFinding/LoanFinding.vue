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
				:spotlight-data="spotlightData"
				:loans="mfiRecommendationsLoans"
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
import mfiRecommendationsLoans from '@/graphql/query/lendByCategory/mfiRecommendationsLoans.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import LendingCategorySection from '@/components/LoanFinding/LendingCategorySection';
import QuickFiltersSection from '@/components/LoanFinding/QuickFiltersSection';
import PartnerSpotlightSection from '@/components/LoanFinding/PartnerSpotlightSection';
import { runLoansQuery } from '@/util/loanSearch/dataUtils';
import { FLSS_ORIGIN_LENDING_HOME } from '@/util/flssUtils';
import WelcomeLightbox from '@/components/LoanFinding/WelcomeLightbox';
import { getExperimentSettingCached, trackExperimentVersion } from '@/util/experimentUtils';
import { gql } from '@apollo/client';
import KvToast from '~/@kiva/kv-components/vue/KvToast';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

const EXP_KEY = 'loan_finding_page';
const LOAN_CARD_EXP_KEY = 'lh_new_loan_card';

const spotlightData = {
	headline: 'Fundación Pro Mujer',
	subheadline: '15 years with Kiva, 52,908 borrowers supported',
	image: 'fundacionpromujer.jpg',
	imageFooter: 'Alcina, a farm owner since 2016, grows and sells vegetables to support her three children.',
	subheadsTitle: 'Fundación Pro Mujer provides so much more than loans to their borrowers.',
	subheads: ['ANTI-POVERTY FOCUS', 'FACILITATION OF SAVINGS', 'FAMILY & COMMUNITY EMPOWERMENT'],
	carouselTitle: 'SUPPORT BORROWERS FROM FUNDACIÓN PRO MUJER',
	viewAllLink: 'https://www.kiva.org/lend/filter?partner=59',
	partnerText: 'Fundación Pro Mujer offers Bolivia’s most in-need women the holistic services they need to build livelihoods for themselves and futures for their families. They help borrowers with business training and personal development services and are one of the few partners to offer low-cost, high-quality healthcare.', // eslint-disable-line max-len
};

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
			spotlightData,
			userInfo: {},
			recommendedLoans: [
				{ id: 0 }, { id: 0 }, { id: 0 },
				{ id: 0 }, { id: 0 }, { id: 0 }
			],
			secondCategoryLoans: [],
			matchedLoansTotal: 0,
			mfiRecommendationsLoans: [],
			showLightbox: false,
			enableLoanCardExp: false,
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
		fetchMFILoans() {
			// Load mfi recommendations loans data
			return this.apollo.query({
				query: mfiRecommendationsLoans,
			}).then(({ data }) => {
				this.mfiRecommendationsLoans = data?.fundraisingLoans?.values ?? [];
				const numberLoans = this.mfiRecommendationsLoans.length;
				if (!numberLoans) this.$kvTrackEvent('event-tracking', 'update', 'mfi-no-featured-loan-available');
			});
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
		this.fetchMFILoans();
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
