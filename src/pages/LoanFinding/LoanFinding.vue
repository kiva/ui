<template>
	<www-page class="tw-bg-secondary" style="height: auto;">
		<div class="tw-max-w-5xl tw-mx-auto tw-p-2 lg:tw-pt-4">
			<h3 class="tw-text-h3 tw-text-primary">
				Welcome back, <span class="tw-text-action fs-mask data-hj-suppress">{{ firstName }}</span>
			</h3>
			<!-- First category row: Recommended loans section -->
			<lending-category-section
				title="Recommended for you"
				subtitle="Loans handpicked for you based on your lending history"
				:loans="recommendedLoans"
				:per-step="2"
				class="tw-mt-2"
				@add-to-basket="trackCategory($event, 'recommended')"
			/>

			<quick-filters-section
				class="tw-mt-6"
				@add-to-basket="trackCategory($event, 'quick-filters')"
			/>

			<!-- Second category row: Matched loans section -->
			<lending-category-section
				title="matched lending"
				subtitle="Stretch your funds further with the help of our partners and Kivans just like you"
				:loans="matchedLoans"
				class="tw-mt-6"
				@add-to-basket="trackCategory($event, 'matched-lending')"
			/>

			<partner-spotlight-section class="tw-mt-6" />
		</div>
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

export default {
	name: 'LoanFinding',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		LendingCategorySection,
		QuickFiltersSection,
		PartnerSpotlightSection,
	},
	data() {
		return {
			userInfo: {},
			recommendedLoans: [
				{ id: 0 }, { id: 0 }, { id: 0 },
				{ id: 0 }, { id: 0 }, { id: 0 }
			],
			matchedLoans: [
				{ id: 0 }, { id: 0 }, { id: 0 },
				{ id: 0 }, { id: 0 }, { id: 0 },
				{ id: 0 }, { id: 0 }, { id: 0 }
			]
		};
	},
	apollo: {
		query: userInfoQuery,
		preFetch(config, client) {
			return client
				.query({
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
		async getMatchedLoans() {
			const { loans } = await runLoansQuery(
				this.apollo,
				{ filterObject: { isMatchable: { eq: true } }, sortBy: 'personalized', pageLimit: 9 },
				FLSS_ORIGIN_LENDING_HOME
			);
			this.matchedLoans = loans;
		},
		trackCategory({ success }, category) {
			if (success) this.$kvTrackEvent('loan-card', 'add-to-basket', `${category}-lending-home`);
		}
	},
	mounted() {
		this.getRecommendedLoans();
		this.getMatchedLoans();
	},
};
</script>
