<template>
	<article>
		<kv-map
			class="
				tw-rounded
				tw-overflow-hidden
				tw-m-4
			"
			:auto-zoom-delay="mapAutoZoomDelay"
			:aspect-ratio="mapAspectRatio"
			:lat="mapLat"
			:long="mapLong"
			:zoom-level="mapZoomLevel"
			:initial-zoom="mapInitialZoom"
		/>
		<country-info
			:num-loans-fundraising="countryNumLoansFundraising"
			:avg-annual-income="countryAvgAnnualIncome"
			:country-iso-code="countryIsoCode"
			:country-name="countryName"
			:region-name="countryRegionName"
		/>
	</article>
</template>

<script>
import gql from 'graphql-tag';
import KvMap from '@/components/Kv/KvMap';
import CountryInfo from './CountryInfo';

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		CountryInfo,
		KvMap,
	},
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			mapZoomLevel: 6,
			mapInitialZoom: 2,
			mapAutoZoomDelay: 500,
			mapAspectRatio: 1.3,
			mapLat: null,
			mapLong: null,
			countryNumLoansFundraising: 0,
			countryAvgAnnualIncome: '',
			countryIsoCode: '',
			countryName: '',
			countryRegionName: '',
		};
	},
	apollo: {
		query: gql`query borrowerCountry($loanId: Int!) {
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
			}
		}`,
		variables() {
			return {
				loanId: this.loanId,
			};
		},
		result(result) {
			const geocode = result?.data?.lend?.loan?.geocode;
			this.mapLat = geocode?.latitude ?? null;
			this.mapLong = geocode?.longitude ?? null;
			this.countryNumLoansFundraising = geocode?.country?.numLoansFundraising ?? 0;
			this.countryAvgAnnualIncome = geocode?.country?.ppp ?? '';
			this.countryIsoCode = geocode?.country?.isoCode ?? '';
			this.countryName = geocode?.country?.name ?? '';
			this.countryRegionName = geocode?.country?.region ?? '';
		},
	},
};
</script>
