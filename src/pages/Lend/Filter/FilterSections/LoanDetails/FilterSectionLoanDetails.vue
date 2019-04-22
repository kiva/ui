<template>
	<filter-menu-section title="Loan details" >
		<range-slider-wrapper
			:minimum="4"
			:maximum="25"
			:value="25"
			query-attribute="lenderRepaymentTerm"
			title="Loan length"
			maximum-label="any"
			minimum-label=" months or less"
			inbetween-label=" months or less"
			:filter-menu-open="filterMenuOpen"
		/>

		<range-slider-wrapper
			:minimum="0"
			:maximum="58"
			:value="58"
			query-attribute="partner.delinquencyRate"
			title="Delinquency rate"
			maximum-label="any"
			minimum-label="Only 0%"
			:minimum-value-label="false"
			inbetween-label="% or less"
			:filter-menu-open="filterMenuOpen"
		/>

		<range-slider-wrapper
			:minimum="0"
			:maximum="24"
			:value="24"
			query-attribute="partner.defaultRate"
			title="Default rate"
			maximum-label="any"
			minimum-label="Only 0%"
			:minimum-value-label="false"
			inbetween-label="% or less"
			:filter-menu-open="filterMenuOpen"
		/>

		<range-slider-wrapper
			:minimum="0"
			:minimum-maximum-swap="true"
			:maximum="5"
			:value="0"
			query-attribute="partner.riskRating"
			title="Risk rating"
			maximum-label="Only 5 stars"
			minimum-label="any"
			:minimum-value-label="false"
			inbetween-label=" stars or more"
			:filter-menu-open="filterMenuOpen"
		/>
	</filter-menu-section>
</template>

<script>
import FilterMenuSection from '@/pages/Lend/Filter/FilterComponents/FilterMenuSection';
import RangeSliderWrapper from '@/pages/Lend/Filter/FilterSections/LoanDetails/RangeSliderWrapper';

export default {
	components: {
		FilterMenuSection,
		RangeSliderWrapper,
	},
	props: {
		filterMenuOpen: {
			type: Boolean,
			default: true,
		},
	}
};
</script>
