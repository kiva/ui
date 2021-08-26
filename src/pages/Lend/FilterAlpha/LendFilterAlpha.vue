<template>
	<www-page
		id="lend-filter-alpha"
		:header-theme="headerTheme"
		:main-class="'kv-tailwind'"
	>
		<article class="tw-bg-gray-50 tw-relative tw-pt-6">
			<div class="tw-relative" style="max-height: 460px;">
				<div class="tw-absolute tw-top-0 tw-h-full tw-w-full tw-overflow-hidden">
				</div>
			</div>
			<div class="lg:tw-absolute lg:tw-w-full lg:tw-h-full lg:tw-top-0 lg:tw-pt-8">
			</div>
			<div>
				<kv-page-container>
					<div class="tw-flex tw-items-start">
						<div class="tw-flex-1">
							<h2 class="tw-mb-2">
								Make a loan, change a life
							</h2>
							<p class="tw-mb-3p tw-hidden md:tw-block">
								Each Kiva loan helps people build a better future for themselves and their families.
							</p>
						</div>
						<button class="tw-mb-2 tw-border-r tw-border-gray-300 tw-px-2">
							<kv-material-icon :icon="mdiCompassRose" class="tw-text-gray-500 tw-w-5 tw-h-5" />
							<p class="tw-hidden md:tw-block">
								Explore
							</p>
						</button>
						<button class="tw-mb-2 tw-px-2">
							<kv-material-icon :icon="mdiFilterVariant" class="tw-text-brand tw-w-5 tw-h-5" />
							<p class="tw-hidden md:tw-block">
								Filters
							</p>
						</button>
					</div>
					<kv-grid class="tw-grid-cols-2 md:tw-grid-cols-3">
						<div class="tw-bg-gray-300 tw-text-left md:tw-text-center">
							<p>Filters</p>
							<hr>
							<br> Gender
							<br> Loan Term
							<br> Country
							<br> Sector
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
								<loan-card-controller
									v-for="loan in loans"
									:items-in-basket="null"
									:is-visitor="true"
									:key="loan.id"
									:loan="loan"
									loan-card-type="ListLoanCard"
								/>
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
import { fetchData } from '@/util/flssUtils';
import { mdiFilterVariant, mdiCompassRose } from '@mdi/js';

import WwwPage from '@/components/WwwFrame/WwwPage';
// import ListLoanCard from '@/components/LoanCards/ListLoanCard';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	inject: ['apollo'],
	components: {
		WwwPage,
		KvGrid,
		KvPageContainer,
		KvMaterialIcon,
		// ListLoanCard,
		LoanCardController

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
			mdiFilterVariant,
			mdiCompassRose,
		};
	},
	methods: {
		runQuery() {
			fetchData(this.loanQueryFilters, this.apollo).then(flssData => {
				this.loans = flssData.values ?? [];
				this.totalCount = flssData.totalCount;

				if (this.totalCount === 0) {
					this.zeroLoans = true;
				}
			});
		},

	},
	mounted() {
		this.runQuery();
	}
};
</script>
