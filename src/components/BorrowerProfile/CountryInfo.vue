<template>
	<section>
		<div v-if="loading" class="">
			<kv-loading-placeholder
				class="tw-mb-2" :style="{width: 30 + (Math.random() * 15) + '%', height: '1.6rem'}"
			/>
			<div class="tw-flex lg:tw-mb-3">
				<div v-for="i in 2" :key="i" class="tw-flex-auto">
					<kv-loading-placeholder
						class="tw-block tw-mb-2" :style="{width: 10 + (Math.random() * 15) + '%', height: '1.6rem'}"
					/>
					<kv-loading-placeholder
						class="tw-block tw-mb-2" :style="{width: 40 + (Math.random() * 15) + '%', height: '1.0rem'}"
					/>
				</div>
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
			const geocode = data?.lend?.loan?.geocode;
			this.numLoansFundraising = geocode?.country?.numLoansFundraising ?? 0;
			this.avgAnnualIncome = geocode?.country?.ppp ?? '';
			this.countryIsoCode = geocode?.country?.isoCode ?? '';
			this.countryName = geocode?.country?.name ?? '';
			this.regionName = geocode?.country?.region ?? '';

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
	},
};

</script>
