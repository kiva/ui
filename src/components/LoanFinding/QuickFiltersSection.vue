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

export default {
	name: 'QuickFiltersSection',
	components: {
		QuickFilters
	},
	data() {
		return {
			quickFiltersOptions: {
				sorting: [
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
				]
			},
			filtersLoaded: true,
			targetedLoanChannelURL: '',
		};
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
	},
};
</script>
