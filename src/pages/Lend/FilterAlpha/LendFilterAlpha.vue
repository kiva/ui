<template>
	<www-page
		id="lend-filter-alpha"
		:header-theme="headerTheme"
		:main-class="'kv-tailwind'"
	>
		<article class="tw-bg-gray-50 tw-relative">
			<div class="tw-relative" style="max-height: 460px;">
				<div class="tw-absolute tw-top-0 tw-h-full tw-w-full tw-overflow-hidden">
				</div>
			</div>
			<div class="lg:tw-absolute lg:tw-w-full lg:tw-h-full lg:tw-top-0 lg:tw-pt-8">
			</div>
			<div>
				<kv-page-container>
					<h2 class="tw-mb-2">
						Make a loan, change a life
					</h2>
					<h3 class="tw-mb-3">
						Each Kiva loan helps people build a better future for themselves and their families.
					</h3>
					<kv-grid class="tw-grid-cols-2 md:tw-grid-cols-3">
						<div class="tw-bg-gray-300 tw-text-left md:tw-text-center">
							<p>Filters</p>
						</div>
						<div class="md:tw-hidden">
							<p> {{ totalCount }} Loans </p>
						</div>
						<div class="tw-col-span-2">
							<div class="tw-bg-gray-300 tw-h-4 tw-mb-2 md:tw-mb-3 lg:tw-mb-3.5">
								Search Loans
							</div>
							<div class="tw-hidden md:tw-block tw-h-4 tw-mb-2 md:tw-mb-3 lg:tw-mb-3.5">
								<p> {{ totalCount }} Loans </p>
							</div>
							<kv-grid class="tw-grid-rows-4">
								<div class="tw-bg-gray-300 tw-h-4">
									Loan Card 1
								</div>
								<div class="tw-bg-gray-300 tw-h-4">
									Loan Card 2
								</div>
								<div class="tw-bg-gray-300 tw-h-4">
									Loan Card 3
								</div>
								<div class="tw-bg-gray-300 tw-h-4">
									Loan Card 4
								</div>
								<div class="tw-bg-gray-300 tw-h-4">
									Loan Card 5
								</div>
								<div class="tw-bg-gray-300 tw-h-4">
									Loan Card 6
								</div>
								<div class="tw-bg-gray-300 tw-h-4">
									Loan Card 7
								</div>
								<div class="tw-bg-gray-300 tw-h-4">
									Loan Card 8
								</div>
								<div class="tw-bg-gray-300 tw-h-4">
									Loan Card 9
								</div>
								<div class="tw-bg-gray-300 tw-h-4">
									Loan Card 10
								</div>
								<div class="tw-bg-gray-300 tw-h-4">
									Loan Card 11
								</div>
								<div class="tw-bg-gray-300 tw-h-4">
									Loan Card 12
								</div>
								<div class="tw-bg-gray-300 tw-h-4">
									Loan Card 13
								</div>
								<div class="tw-bg-gray-300 tw-h-4">
									Loan Card 14
								</div>
								<div class="tw-bg-gray-300 tw-h-4">
									Loan Card 15
								</div>
							</kv-grid>
						</div>
					</kv-grid>
				</kv-page-container>
			</div>
		</article>
		<!-- <aside>Similar loans</aside> -->
	</www-page>
</template>

<script>
import { lightHeader } from '@/util/siteThemes';
import WwwPage from '@/components/WwwFrame/WwwPage';
import flssLoanQuery from '@/graphql/query/flssLoansQuery.graphql';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	inject: ['apollo'],
	components: {
		WwwPage,
		KvGrid,
		KvPageContainer,
	},
	mounted() {
		this.fetchLoans();
	},
	data() {
		return {
			headerTheme: lightHeader,
			loanId: Number(this.$route.params.id || 0),
			// flss query is defaulted to US loans currently to keep loans count
			// manageable for now
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
						limit: 20
					},
					fetchPolicy: 'network-only',
				})
				.then(({ data }) => {
					const newLoans = data.fundraisingLoans?.values ?? [];
					this.loans = newLoans;
					// leaving console.log for sanity check
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
