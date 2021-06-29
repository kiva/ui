<template>
	<section>
		<h2 class="tw-text-h2">
			{{ countryName }} at a glance
		</h2>
		<div class="tw-flex lg:tw-mb-3">
			<p class="tw-flex-auto">
				<span class="tw-block tw-text-h2">
					{{ avgAnnualIncomeFormatted }}
				</span>
				<span class="tw-block tw-text-h4 tw-text-gray-500">
					Average annual income (USD)
				</span>
			</p>
			<p class="tw-flex-auto">
				<span class="tw-block tw-text-h2">
					{{ numLoansFundraising }}
				</span>
				<span class="tw-block tw-text-h4 tw-text-gray-500">
					Loans currently fundraising
				</span>
			</p>
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
			:to="loansInRegionLink"
		>
			Find more borrowers in {{ regionName }}
		</kv-ui-button>
	</section>
</template>

<script>
import gql from 'graphql-tag';
import numeral from 'numeral';
import KvUiButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	inject: ['apollo', 'cookieStore'],
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
	data() {
		return {
			loansInRegionLink: '',
		};
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
	apollo: {
		query: gql`
			query getCountryFacets {
			  lend {
				countryFacets {
				  country {
					isoCode
					region
				  }
				}
			  }
			}
		`,
		preFetch: true,
		result(result) {
			const countries = [];
			const countryFacets = result?.data?.lend?.countryFacets ?? [];
			if (countryFacets.length) {
				for (let i = 0; i < countryFacets.length; i += 1) {
					if (countryFacets[i].country.region === this.regionName) {
						countries.push(countryFacets[i].country.isoCode);
					}
				}
				this.loansInRegionLink = `/lend?country=${countries.join(',').toLowerCase()}&sortBy=newest`;
			}
		},
	},
};

</script>
