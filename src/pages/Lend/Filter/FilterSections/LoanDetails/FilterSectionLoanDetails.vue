<template>
	<filter-menu-section title="Loan details">
		<range-slider-wrapper
			:minimum="4"
			:maximum="25"
			query-attribute="lenderRepaymentTerm"
			title="Loan length"
			inbetween-label=" months or less"
		/>

		<range-slider-wrapper
			:minimum="0"
			:maximum="58"
			query-attribute="partner.delinquencyRate"
			title="Partner delinquency rate"
			minimum-label="Only 0%"
			inbetween-label="% or less"
		/>

		<range-slider-wrapper
			:minimum="0"
			:maximum="24"
			query-attribute="partner.defaultRate"
			title="Partner default rate"
			minimum-label="Only 0%"
			inbetween-label="% or less"
		/>

		<range-slider-wrapper
			:minimum="0"
			:is-slider-setting-minimum="true"
			:maximum="5"
			query-attribute="partner.riskRating"
			title="Partner risk rating"
			maximum-label="Only 5 stars"
			inbetween-label=" stars or more"
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
};
</script>
