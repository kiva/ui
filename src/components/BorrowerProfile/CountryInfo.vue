<template>
	<section>
		<h2 class="tw-text-h2">
			{{ countryName }} at a glance
		</h2>
		<div class="tw-flex lg:tw-mb-3">
			<div class="tw-flex-auto">
				<h2 class="tw-text-h2 tw-block tw-m-0">
					{{ avgAnnualIncomeFormatted }}
				</h2>
				<h4 class="tw-text-gray-500 tw-block">
					Average annual income (USD)
				</h4>
			</div>
			<div class="tw-flex-auto">
				<h2 class="tw-text-h2 tw-block tw-m-0">
					{{ numLoansFundraising }}
				</h2>
				<h4 class="tw-text-gray-500 tw-block">
					Loans currently fundraising
				</h4>
			</div>
		</div>
		<kv-ui-button
			v-if="showFindMoreLoansInCountryButton"
			class="tw-inline-flex tw-flex-1 tw-pb-1 lg:tw-pb-3"
			to="`/lend?country=${countryIsoCode}`"
		>
			Find more borrowers in {{ countryName }}
		</kv-ui-button>
		<kv-ui-button
			v-if="showFindMoreLoansInRegionButton"
			class="tw-inline-flex tw-flex-1 tw-pb-1 lg:tw-pb-3"
			to="/lend/filter"
		>
			Find more borrowers in {{ regionName }}
		</kv-ui-button>
	</section>
</template>

<script>
import numeral from 'numeral';
import KvUiButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	components: {
		KvUiButton,
	},
	props: {
		numLoansFundraising: { // Country.numLoansFundraising
			type: Number,
			default: 0,
		},
		avgAnnualIncome: { // Country.ppp
			type: String,
			default: '',
		},
		countryIsoCode: { // Country.isoCode
			type: String,
			default: '',
		},
		countryName: { // Country.name
			type: String,
			default: '',
		},
		regionName: { // Country.region
			type: String,
			default: '',
		},
	},
	computed: {
		showFindMoreLoansInCountryButton() {
			return this.numLoansFundraising >= 1;
		},
		showFindMoreLoansInRegionButton() {
			return this.numLoansFundraising === 0;
		},
		avgAnnualIncomeFormatted() {
			return numeral(this.avgAnnualIncome).format('$0,0[.]00');
		},
	},
};

</script>
