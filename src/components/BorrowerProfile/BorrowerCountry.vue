<template>
	<article v-if="loading">
		<KvLoadingPlaceholder
			class="tw-w-full tw-h-full tw-mt-2"
			style="aspect-ratio: 8 / 5"
		/>
	</article>
	<article v-else>
		<kv-map
			data-testid="bp-country-map" class="
				tw-rounded
				tw-overflow-hidden
				tw-mb-6
			"
			:auto-zoom-delay="mapAutoZoomDelay"
			:aspect-ratio="mapAspectRatio"
			:lat="mapLat"
			:long="mapLong"
			:zoom-level="mapZoomLevel"
			:initial-zoom="mapInitialZoom"
		/>
		<country-info :loan-id="loanId" />
	</article>
</template>

<script>
import { gql } from 'graphql-tag';
import { KvLoadingPlaceholder } from '@kiva/kv-components';

import KvMap from '#src/components/Kv/KvMap';
import logReadQueryError from '#src/util/logReadQueryError';

import CountryInfo from './CountryInfo';

export default {
	name: 'BorrowerCountry',
	inject: ['apollo', 'cookieStore'],
	components: {
		CountryInfo,
		KvLoadingPlaceholder,
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
			mapZoomLevel: 5,
			mapInitialZoom: 4,
			mapAutoZoomDelay: 500,
			mapAspectRatio: 1.3,
			mapLat: null,
			mapLong: null,
			loading: true,
		};
	},
	watch: {
		loanId(newId, oldId) {
			if (newId !== oldId && newId) this.loadCoordinates();
		}
	},
	mounted() {
		this.loadCoordinates();
	},
	methods: {
		loadCoordinates() {
			if (!this.loanId) return;
			return this.apollo.query({
				query: gql`query borrowerCountryCoords($loanId: Int!) {
					lend {
						loan(id: $loanId) {
							id
							geocode {
								latitude
								longitude
								country {
									id
									geocode {
										latitude
										longitude
									}
								}
							}
						}
					}
				}`,
				variables: { loanId: this.loanId }
			}).then(({ data }) => {
				const geocode = data?.lend?.loan?.geocode;
				this.mapLat = geocode?.latitude ?? null;
				this.mapLong = geocode?.longitude ?? null;
				// fallback to country level lat/long if loan level is missing
				if (!this.mapLat || !this.mapLong) {
					this.mapLat = geocode?.country?.geocode?.latitude ?? null;
					this.mapLong = geocode?.country?.geocode?.longitude ?? null;
				}
				this.loading = false;
			}).catch(e => {
				logReadQueryError(e, 'borrowerProfileSideSheetQuery');
			});
		}
	},
};
</script>
