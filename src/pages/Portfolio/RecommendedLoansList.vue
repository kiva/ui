<template>
	<async-portfolio-section class="md:tw-bg-brand-100" @visible="fetchAsyncData">
		<h2 class="tw-mb-3">
			Recommended borrowers
		</h2>
		<kv-carousel :multiple-slides-visible="true" :embla-options="{ loop: false }">
			<template slot="slide1">
				<recommended-loan-slide :loan-id="loanIds[0]" />
			</template>
			<template slot="slide2">
				<recommended-loan-slide :loan-id="loanIds[1]" />
			</template>
			<template slot="slide3">
				<recommended-loan-slide :loan-id="loanIds[2]" />
			</template>
		</kv-carousel>
	</async-portfolio-section>
</template>

<script>
import personalizedLoansQuery from '@/graphql/query/lendByCategory/personalizedLoans.graphql';
import { FLSS_ORIGIN_PORTFOLIO_OVERVIEW } from '@/util/flssUtils';
import AsyncPortfolioSection from './AsyncPortfolioSection';
import RecommendedLoanSlide from './RecommendedLoanSlide';
import KvCarousel from '~/@kiva/kv-components/vue/KvCarousel';

export default {
	name: 'RecommendedLoansList',
	inject: ['apollo'],
	components: {
		AsyncPortfolioSection,
		KvCarousel,
		RecommendedLoanSlide,
	},
	data() {
		return {
			loading: true,
			loans: [],
		};
	},
	computed: {
		loanIds() {
			return this.loans.filter(loan => loan)
				.map(loan => loan.id)
				.slice(0, 3);
		}
	},
	methods: {
		fetchAsyncData() {
			if (this.loading) {
				this.apollo.query({
					query: personalizedLoansQuery,
					variables: {
						limit: 3,
						origin: FLSS_ORIGIN_PORTFOLIO_OVERVIEW,
					},
				}).then(({ data }) => {
					this.loading = false;
					this.loans = data?.fundraisingLoans?.values ?? [];
				});
			}
		},
	},
};
</script>
