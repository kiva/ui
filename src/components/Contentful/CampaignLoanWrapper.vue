<template>
	<section class="loan-categories section" id="campaignLoanSection" ref="campaignLoanSection">
		<div class="row">
			<div class="columns">
				<h2 class="tw-mb-4 tw-text-center">
					Support causes you care about.
				</h2>

				<campaign-loan-filters
					:applied-filters="componentProps.filters"
					:initial-filters="componentProps.initialFilters"
					:excluded-tags="componentProps.excludedTags"
					:initial-sort-by="componentProps.initialSortBy"
					:active-loan-display="componentProps.activeLoanDisplay"
					:show-loan-display-toggle="componentProps.showLoanDisplayToggle"
					:total-count="componentProps.totalCount"
					@updated-filters="componentProps.handleUpdatedFilters"
					@updated-sort-by="componentProps.handleUpdatedSortBy"
					@set-loan-display="componentProps.handleLoanDisplayType"
					@reset-loan-filters="componentProps.handleResetLoanFilters"
				/>

				<campaign-loan-row
					name="Loan Row"
					v-if="componentProps.showLoanRows"
					id="campaignLoanRowDisplay"
					:filters="componentProps.filters"
					:is-visitor="componentProps.isVisitor"
					:items-in-basket="componentProps.itemsInBasket"
					:is-logged-in="!componentProps.isVisitor"
					:is-visible="componentProps.showLoanRows"
					:key="'one-category'"
					:promo-only="componentProps.promoOnlyQuery"
					:row-number="1"
					:show-loans="componentProps.showLoans"
					:sort-by="componentProps.sortBy"
					@add-to-basket="componentProps.handleAddToBasket"
					@update-total-count="componentProps.setTotalCount"
					@show-loan-details="componentProps.showLoanDetails"
					@reset-loan-filters="componentProps.handleResetLoanFilters"
				/>

				<campaign-loan-grid-display
					v-if="!componentProps.showLoanRows"
					id="campaignLoanDisplay"
					:checkout-visible="componentProps.checkoutVisible || componentProps.showThanks"
					:filters="componentProps.filters"
					:is-visible="!componentProps.showLoanRows"
					:is-visitor="componentProps.isVisitor"
					:items-in-basket="componentProps.itemsInBasket"
					:promo-only="componentProps.promoOnlyQuery"
					:show-loans="componentProps.showLoans"
					:sort-by="componentProps.sortBy"
					@add-to-basket="componentProps.handleAddToBasket"
					@update-total-count="componentProps.setTotalCount"
					@show-loan-details="componentProps.showLoanDetails"
					@reset-loan-filters="componentProps.handleResetLoanFilters"
				/>
			</div>
		</div>
	</section>
</template>

<script>
import CampaignLoanFilters from '@/components/CorporateCampaign/LoanSearch/LoanSearchFilters';
import CampaignLoanRow from '@/components/CorporateCampaign/CampaignLoanRow';
import CampaignLoanGridDisplay from '@/components/CorporateCampaign/CampaignLoanGridDisplay';

export default {
	name: 'CampaignLoanWrapper',
	components: {
		CampaignLoanFilters,
		CampaignLoanRow,
		CampaignLoanGridDisplay
	},
	props: {
		content: {
			type: Object,
			default: () => {}
		},
		componentProps: {
			type: Object,
			default: () => {}
		}
	}
};
</script>
