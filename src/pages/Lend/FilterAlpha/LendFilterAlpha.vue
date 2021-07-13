<template>
	<www-page
		id="lend-filter-alpha"
		:header-theme="headerTheme"
		:main-class="'tw-bg-gray-50'"
	>
		<article class="tw-relative">
			<div class="tw-relative" style="max-height: 460px;">
				<div class="tw-absolute tw-top-0 tw-h-full tw-w-full tw-overflow-hidden">
				</div>
			</div>
			<div class="lg:tw-absolute lg:tw-w-full lg:tw-h-full lg:tw-top-0 lg:tw-pt-8">
			</div>
		</article>
		<!-- <aside>Similar loans</aside> -->
	</www-page>
</template>

<script>
import { lightHeader } from '@/util/siteThemes';
import WwwPage from '@/components/WwwFrame/WwwPage';
import flssLoanQuery from '@/graphql/query/flssLoansQuery.graphql';

export default {
	inject: ['apollo'],
	components: {
		WwwPage,
	},
	mounted() {
		this.fetchLoans();
	},
	data() {
		return {
			headerTheme: lightHeader,
			loanId: Number(this.$route.params.id || 0),
			loanQueryFilters: { countryIsoCode: { any: ['US'] } },
			totalCount: 0,
			loans: [],
			zeroLoans: false,
		};
	},
	methods: {
		fetchLoans() {
			this.apollo
				.query({
					query: flssLoanQuery,
					variables: {
						filterObject: this.loanQueryFilters,
					},
					fetchPolicy: 'network-only',
				})
				.then(({ data }) => {
					const newLoans = data.fundraisingLoans?.values ?? [];
					this.loans = newLoans;
					// leaving console.log for sanity check
					// flss query is defaulted to US loans currently to keep loans count
					// manageable
					console.log(newLoans);

					const totalCount = data.fundraisingLoans.totalCount ?? 0;
					this.totalCount = totalCount;
					// leaving console.log for sanity check
					console.log(totalCount);

					if (this.totalCount === 0) {
						this.zeroLoans = true;
					}
				});
		},
	},
};
</script>
