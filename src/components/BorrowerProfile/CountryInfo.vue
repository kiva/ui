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
			<h2 class="tw-text-h2 tw-mb-4" data-testid="bp-country-header">
				{{ countryName }} at a glance
			</h2>
			<div class="tw-flex tw-mb-4">
				<p class="tw-flex-auto" data-testid="bp-country-aai">
					<span class="tw-block tw-text-h2" data-testid="bp-country-aai-value">
						{{ avgAnnualIncomeFormatted }}
					</span>
					<span class="tw-block tw-text-h4 tw-text-secondary">
						Average annual income (USD)
					</span>
				</p>
				<p class="tw-flex-auto" data-testid="bp-country-loans-fundraising">
					<span class="tw-block tw-text-h2" data-testid="bp-country-loans-fundraising-value">
						{{ numLoansFundraising }}
					</span>
					<span class="tw-block tw-text-h4 tw-text-secondary">
						Loans currently fundraising
					</span>
				</p>
			</div>
			<kv-ui-button
				v-if="showFindMoreLoansInCountryButton"
				class="tw-inline-flex tw-flex-1"
				data-testid="bp-country-find-loans-country"
				:href="`/lend?country=${countryIsoCode}`"
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
import { gql } from '@apollo/client';
import numeral from 'numeral';
import { createIntersectionObserver } from '@/util/observerUtils';

import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';
import KvUiButton from '~/@kiva/kv-components/vue/KvButton';

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
	methods: {
		createObserver() {
			// Watch for this element being close to entering the viewport
			this.observer = createIntersectionObserver({
				targets: [this.$el],
				rootMargin: '500px',
				callback: entries => {
					entries.forEach(entry => {
						if (entry.target === this.$el && entry.intersectionRatio > 0) {
							// This element is close to being in the viewport, so load the data.
							// Because of the apollo cache it's safe to call this repeatedly.
							this.loadData();
						}
					});
				}
			});
			if (!this.observer) {
				// Observer was not created, so call loadData right away as a fallback.
				this.loadData();
			}
		},
		destroyObserver() {
			if (this.observer) {
				this.observer.disconnect();
			}
		},
		loadData() {
			this.apollo.query({
				query: gql`query borrowerCountryInfo($loanId: Int!) {
					lend {
						loan(id: $loanId) {
							id
							geocode {
								latitude
								longitude
								country {
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
								isoCode
								region
							}
						}
					}
				}`,
				variables: {
					loanId: this.loanId
				},
			}).then(result => {
				const geocode = result?.data?.lend?.loan?.geocode;
				this.numLoansFundraising = geocode?.country?.numLoansFundraising ?? 0;
				this.avgAnnualIncome = geocode?.country?.ppp ?? '';
				this.countryIsoCode = geocode?.country?.isoCode ?? '';
				this.countryName = geocode?.country?.name ?? '';
				this.regionName = geocode?.country?.region ?? '';

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

				this.loading = false;
			});
		},
	},
	mounted() {
		this.createObserver();
	},
	beforeDestroy() {
		this.destroyObserver();
	},
};

</script>
