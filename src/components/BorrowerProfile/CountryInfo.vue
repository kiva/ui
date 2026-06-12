<template>
	<section>
		<div v-if="loading">
			<div class="tw-h-4 lg:tw-h-4.5 tw-w-3/5 md:tw-w-1/4 lg:tw-w-1/5 tw-mb-4">
				<kv-loading-placeholder />
			</div>
			<!-- First-row labels are long enough to wrap to two lines below md; second-row labels stay on one line -->
			<div class="tw-flex tw-mb-4">
				<div v-for="i in 2" :key="i" class="tw-flex-1">
					<div class="tw-h-3.5 lg:tw-h-4 tw-w-1/2 md:tw-w-1/4 lg:tw-w-1/6 tw-mb-0.5">
						<kv-loading-placeholder />
					</div>
					<div class="tw-h-4 md:tw-h-2 tw-w-4/5 md:tw-w-1/2 lg:tw-w-1/3">
						<kv-loading-placeholder />
					</div>
				</div>
			</div>
			<div class="tw-flex tw-mb-4">
				<div v-for="i in 2" :key="i" class="tw-flex-1">
					<div class="tw-h-3.5 lg:tw-h-4 tw-w-1/2 md:tw-w-1/4 lg:tw-w-1/6 tw-mb-0.5">
						<kv-loading-placeholder />
					</div>
					<div class="tw-h-2 tw-w-4/5 md:tw-w-2/5 lg:tw-w-1/4">
						<kv-loading-placeholder />
					</div>
				</div>
			</div>
			<div class="tw-h-6 tw-w-3/4 md:tw-w-2/5 lg:tw-w-1/4">
				<kv-loading-placeholder />
			</div>
		</div>

		<div v-else>
			<h2 class="tw-text-headline tw-mb-4" data-testid="bp-country-header">
				{{ countryName }} at a glance
			</h2>
			<div class="tw-flex tw-mb-4">
				<p class="tw-flex-auto" data-testid="bp-country-aai">
					<span class="tw-block tw-text-headline" data-testid="bp-country-aai-value">
						{{ avgAnnualIncomeFormatted }}
					</span>
					<span class="tw-block tw-text-upper tw-text-secondary">
						Average annual income (USD)
					</span>
				</p>
				<p class="tw-flex-auto" data-testid="bp-country-loans-fundraising">
					<span class="tw-block tw-text-headline" data-testid="bp-country-loans-fundraising-value">
						{{ numLoansFundraising }}
					</span>
					<span class="tw-block tw-text-upper tw-text-secondary">
						Loans currently fundraising
					</span>
				</p>
			</div>
			<div v-if="fundsLentInCountry || loanCurrencyLabel" class="tw-flex tw-mb-4">
				<p v-if="fundsLentInCountry" class="tw-flex-auto" data-testid="bp-country-funds-lent">
					<span class="tw-block tw-text-headline" data-testid="bp-country-funds-lent-value">
						{{ fundsLentInCountryFormatted }}
					</span>
					<span class="tw-block tw-text-upper tw-text-secondary">
						Funds lent in country
					</span>
				</p>
				<p v-if="loanCurrencyLabel" class="tw-flex-auto" data-testid="bp-country-loan-currency">
					<span class="tw-block tw-text-headline" data-testid="bp-country-loan-currency-value">
						{{ loanCurrencyLabel }}
					</span>
					<span class="tw-block tw-text-upper tw-text-secondary">
						Loan transacted in
					</span>
				</p>
			</div>
			<kv-ui-button
				v-if="showFindMoreLoansInCountryButton"
				class="tw-inline-flex tw-flex-1"
				data-testid="bp-country-find-loans-country"
				:href="`/lend/filter?country=${countryIsoCode}`"
				target="_blank"
			>
				Find more borrowers in {{ countryName }}
			</kv-ui-button>
			<kv-ui-button
				v-if="showFindMoreLoansInRegionButton"
				class="tw-inline-flex tw-flex-1"
				data-testid="bp-country-find-loans-region"
				:href="loansInRegionLink"
				target="_blank"
			>
				Find more borrowers in {{ regionName }}
			</kv-ui-button>
		</div>
	</section>
</template>

<script>
import { gql } from 'graphql-tag';
import numeral from 'numeral';

import { KvLoadingPlaceholder, KvButton as KvUiButton } from '@kiva/kv-components';

export default {
	name: 'CountryInfo',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvLoadingPlaceholder,
		KvUiButton,
	},
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			avgAnnualIncome: '',
			countryIsoCode: '',
			countryName: '',
			fundsLentInCountry: 0,
			loanCurrency: '',
			loanCurrencyFullName: '',
			loading: true,
			loansInRegionLink: '',
			numLoansFundraising: 0,
			regionName: '',
		};
	},
	apollo: {
		lazy: true,
		query: gql`query borrowerCountryInfo($loanId: Int!) {
			lend {
				loan(id: $loanId) {
					id
					terms {
						currency
						currencyFullName
					}
					geocode {
						latitude
						longitude
						country {
							id
							numLoansFundraising
							ppp
							isoCode
							name
							region
							fundsLentInCountry
						}
					}
				}
				countryFacets {
					country {
						id
						isoCode
						region
					}
				}
			}
		}`,
		variables() {
			return { loanId: this.loanId };
		},
		result({ data }) {
			const loan = data?.lend?.loan;
			const geocode = loan?.geocode;
			this.numLoansFundraising = geocode?.country?.numLoansFundraising ?? 0;
			this.avgAnnualIncome = geocode?.country?.ppp ?? '';
			this.countryIsoCode = geocode?.country?.isoCode ?? '';
			this.countryName = geocode?.country?.name ?? '';
			this.regionName = geocode?.country?.region ?? '';
			this.fundsLentInCountry = geocode?.country?.fundsLentInCountry ?? 0;
			this.loanCurrency = loan?.terms?.currency ?? '';
			this.loanCurrencyFullName = loan?.terms?.currencyFullName ?? '';

			const countries = [];
			const countryFacets = data?.lend?.countryFacets ?? [];
			if (countryFacets.length) {
				for (let i = 0; i < countryFacets.length; i += 1) {
					if (countryFacets[i].country.region === this.regionName) {
						countries.push(countryFacets[i].country.isoCode);
					}
				}
				this.loansInRegionLink = `/lend/filter?country=${countries.join(',').toLowerCase()}&sortBy=newest`;
			}

			this.loading = false;
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
		fundsLentInCountryFormatted() {
			return numeral(this.fundsLentInCountry).format('$0,0');
		},
		loanCurrencyLabel() {
			return this.loanCurrencyFullName || this.loanCurrency || '';
		},
	},
};

</script>
