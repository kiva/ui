<template>
	<section class="loan-categories section" id="campaignLoanSection" ref="campaignLoanSection">
		<div class="row">
			<div class="columns">
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

				<campaign-progress-bar
					:is-matching-campaign="componentProps.isMatchingCampaign"
					:promo-amount="componentProps.promoAmount"
					:remaining-credit="componentProps.remainingCredit"
					:basket-loans="componentProps.basketLoans"
					:promo-name="componentProps.promoName"
					@show-basket="componentProps.showBasket"
				/>

				<campaign-loan-row
					name="Loan Row"
					v-show="componentProps.showLoanRows"
					id="campaignLoanRowDisplay"
					:filters="componentProps.filters"
					:is-visitor="componentProps.isVisitor"
					:items-in-basket="componentProps.itemsInBasket"
					:basket-loans="componentProps.basketLoans"
					:is-logged-in="!componentProps.isVisitor"
					:is-visible="componentProps.showLoanRows"
					:key="'one-category'"
					:promo-only="componentProps.promoOnlyQuery"
					:row-number="1"
					:show-loans="componentProps.showLoans"
					:sort-by="componentProps.sortBy"
					@add-to-basket="componentProps.handleAddToBasket"
					@update-available-loans="componentProps.handleUpdateAvailableLoans"
					@update-total-count="componentProps.setTotalCount"
					@show-loan-details="componentProps.showLoanDetails"
					@reset-loan-filters="componentProps.handleResetLoanFilters"
					@remove-loan-from-basket="componentProps.removeLoanFromBasket"
					@show-basket="componentProps.showBasket"
				/>

				<campaign-loan-grid-display
					v-show="!componentProps.showLoanRows"
					id="campaignLoanDisplay"
					:checkout-visible="componentProps.checkoutVisible || componentProps.showThanks"
					:filters="componentProps.filters"
					:is-visible="!componentProps.showLoanRows"
					:is-visitor="componentProps.isVisitor"
					:items-in-basket="componentProps.itemsInBasket"
					:basket-loans="componentProps.basketLoans"
					:promo-only="componentProps.promoOnlyQuery"
					:show-loans="componentProps.showLoans"
					:sort-by="componentProps.sortBy"
					@add-to-basket="componentProps.handleAddToBasket"
					@update-total-count="componentProps.setTotalCount"
					@show-loan-details="componentProps.showLoanDetails"
					@reset-loan-filters="componentProps.handleResetLoanFilters"
					@remove-loan-from-basket="componentProps.removeLoanFromBasket"
					@show-basket="componentProps.showBasket"
				/>
			</div>
		</div>
	</section>
</template>

<script>
import CampaignProgressBar from '#src/components/CorporateCampaign/CampaignProgressBar';
import CampaignLoanFilters from '#src/components/CorporateCampaign/LoanSearch/LoanSearchFilters';
import CampaignLoanRow from '#src/components/CorporateCampaign/CampaignLoanRow';
import CampaignLoanGridDisplay from '#src/components/CorporateCampaign/CampaignLoanGridDisplay';

export default {
	name: 'CampaignLoanWrapper',
	components: {
		CampaignLoanFilters,
		CampaignLoanRow,
		CampaignLoanGridDisplay,
		CampaignProgressBar
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
