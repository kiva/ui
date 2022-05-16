<template>
	<div class="tw-flex">
		<div class="tw-flex tw-flex-col tw-mr-4">
			<div class="md:tw-hidden tw-mb-3">
				<kv-button variant="secondary" @click="openLightbox">
					Filter & Sort
				</kv-button>

				<kv-lightbox
					:visible="isLightboxVisible"
					variant="lightbox"
					title=""
					@lightbox-closed="closeLightbox"
				>
					<loan-search-filter id="filter-menu" />
				</kv-lightbox>
			</div>
			<div class="tw-hidden md:tw-block">
				<loan-search-filter />
			</div>
		</div>
		<div class="md:tw-hidden tw-pt-1.5">
			<p>{{ totalCount }} Loans</p>
		</div>
		<div class="tw-col-span-2">
			<div class="tw-hidden md:tw-block tw-h-4 tw-mb-2 md:tw-mb-3 lg:tw-mb-3.5">
				<p>{{ totalCount }} Loans</p>
			</div>
			<kv-grid class="tw-grid-rows-4">
				<loan-card-controller
					v-for="loan in loans"
					:items-in-basket="null"
					:is-visitor="true"
					:key="loan.id"
					:loan="loan"
					loan-card-type="ListLoanCard"
					:rounded-corners="true"
				/>
			</kv-grid>
		</div>
	</div>
</template>

<script>
import loanSearchStateQuery from '@/graphql/query/loanSearchState.graphql';
import { fetchData } from '@/util/flssUtils';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import LoanSearchFilter from '@/components/Lend/LoanSearch/LoanSearchFilter';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		LoanCardController,
		KvGrid,
		KvButton,
		LoanSearchFilter,
		KvLightbox
	},
	data() {
		return {
			totalCount: 0,
			loans: [],
			zeroLoans: false,
			isLightboxVisible: false
		};
	},
	mounted() {
		// Here we subscribe to the loanSearchState and run the loan query when it updates
		// TODO: work some guards to prevent duplicate queries and throttling to more carefully control # of queries
		this.apollo.watchQuery({ query: loanSearchStateQuery }).subscribe({
			next: ({ data }) => {
				console.log('subscribed loanSearchState', data);
				this.runFLSSQuery(data?.loanSearchState);
			},
		});
	},
	methods: {
		// Temporary location for some of this logic
		// NOTICE!!! Add your new filter to flssCompatibleFilters below if it's missing
		runFLSSQuery(loanSearchState) {
			console.log('filters into runQuery:', loanSearchState);
			const flssCompatibleFilters = {
				countryIsoCode: { any: loanSearchState?.countryIsoCode ?? [] },
				sectorId: { any: loanSearchState?.sectorId ?? [] },
			};
			fetchData(flssCompatibleFilters, this.apollo).then(flssData => {
				this.loans = flssData.values ?? [];
				this.totalCount = flssData.totalCount;
				console.log('num loans:', this.totalCount);
				console.log('loans from runQuery()', this.loans);

				if (this.totalCount === 0) {
					this.zeroLoans = true;
				}
			});
		},
		openLightbox() {
			this.isLightboxVisible = true;
		},
		closeLightbox() {
			this.isLightboxVisible = false;
		},
	},
};
</script>

<style lang="scss" scoped>
	#filter-menu {
		width: 285px;
	}
</style>
