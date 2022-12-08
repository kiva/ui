<template>
	<www-page>
		<div class="tw-max-w-5xl tw-mx-auto tw-p-2 lg:tw-pt-4">
			<h3 class="tw-text-h3 tw-text-primary">
				Welcome back, <span class="tw-text-action fs-mask">{{ firstName }}</span>
			</h3>

			<lending-category-section
				:loans="recommendedLoans"
				class="tw-mt-2"
			/>

			<quick-filters-section class="tw-mt-2" />
		</div>
	</www-page>
</template>

<script>
import userInfoQuery from '@/graphql/query/userInfo.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import LendingCategorySection from '@/components/LoanFinding/LendingCategorySection';
import QuickFiltersSection from '@/components/LoanFinding/QuickFiltersSection';
import { runLoansQuery } from '@/util/loanSearch/dataUtils';
import { FLSS_ORIGIN_NOT_SPECIFIED } from '@/util/flssUtils';

export default {
	name: 'LoanFinding',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		LendingCategorySection,
		QuickFiltersSection,
	},
	data() {
		return {
			userInfo: {},
			recommendedLoans: []
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
				FLSS_ORIGIN_NOT_SPECIFIED
			);
			this.recommendedLoans = loans;
		}
	},
	mounted() {
		this.getRecommendedLoans();
	},
};
</script>
