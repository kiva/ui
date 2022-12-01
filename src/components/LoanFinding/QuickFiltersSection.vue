<template>
	<div>
		<h2 class="tw-text-h2 tw-text-primary">
			Find a loan by category and location
		</h2>
		<quick-filters
			class="tw-z-2"
			:total-loans="totalCount"
			:filter-options="quickFiltersOptions"
			:filters-loaded="filtersLoaded"
			:targeted-loan-channel-url="targetedLoanChannelURL"
			:with-categories="true"
			@update-filters="updateQuickFilters"
			@reset-filters="resetFilters"
			@handle-overlay="handleQuickFiltersOverlay"
		/>
	</div>
</template>

<script>
import QuickFilters from '@/components/LoansByCategory/QuickFilters/QuickFilters';
import { runFacetsQueries, fetchLoanFacets } from '@/util/loanSearch/dataUtils';
import { fetchCategories, FLSS_ORIGIN_CATEGORY } from '@/util/flssUtils';
import { transformIsoCodes } from '@/util/loanSearch/filters/regions';

export default {
	name: 'QuickFiltersSection',
	components: {
		QuickFilters
	},
	inject: ['apollo'],
	data() {
		return {
			filtersLoaded: false,
			targetedLoanChannelURL: '',
			flssLoanSearch: {},
			loanSearchState: {},
			loans: [],
			quickFiltersOptions: {
				gender: [{
					key: '',
					title: 'All genders'
				}]
			},
			allFacets: []
		};
	},
	async mounted() {
		this.allFacets = await fetchLoanFacets(this.apollo);
		await this.fetchFilterData(this.flssLoanSearch);
	},
	computed: {
		totalCount() {
			return 0;
		},
	},
	methods: {
		updateQuickFilters() {
		},
		resetFilters() {
		},
		handleQuickFiltersOverlay() {
		},
		async fetchFilterData(loanSearchState = {}) {
			// TODO: Prevent this from running on every query (not needed for sorting and paging)
			const { isoCodes } = await runFacetsQueries(this.apollo, loanSearchState, FLSS_ORIGIN_CATEGORY);
			const fetchedCategories = await fetchCategories(this.apollo);

			// Merge all facet options with filtered options
			const facets = {
				regions: transformIsoCodes(isoCodes, this.allFacets?.countryFacets),
			};

			const categories = fetchedCategories.lend?.loanChannels?.values;
			const sortedCategories = [...categories].sort(
				// eslint-disable-next-line no-nested-ternary
				(catA, catB) => {
					if (catA.title < catB.title) return -1;
					if (catA.title > catB.title) return 1;
					return 0;
				}
			);

			this.quickFiltersOptions.categories = [
				...[{ title: 'All categories', key: 0 }],
				...sortedCategories
			];

			this.quickFiltersOptions.location = facets.regions;
			// TODO: Pull sort by and gender filters from API
			this.quickFiltersOptions.sorting = [
				{
					title: 'Recommended',
					key: 'personalized',
				},
				{
					title: 'Almost funded',
					key: 'amountLeft',
				},
				{
					title: 'Amount high to low',
					key: 'amountHighToLow'
				},
				{
					title: 'Amount low to high',
					key: 'amountLowToHigh'
				},
				{
					title: 'Ending soon',
					key: 'expiringSoon'
				}
			];
			this.quickFiltersOptions.gender = [
				{
					title: 'All genders',
					key: '',
				},
				{
					title: 'Women',
					key: 'female',
				},
				{
					title: 'Men',
					key: 'male',
				},
				{
					title: 'Non-binary',
					key: 'nonbinary',
				}
			];

			this.filtersLoaded = true;
		},
	},
};
</script>
