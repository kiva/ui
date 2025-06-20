<template>
	<article>
		<KvMap
			v-if="!loading"
			class="tw-roundedtw-overflow-hiddentw-mb-6"
			:auto-zoom-delay="mapAutoZoomDelay"
			:aspect-ratio="mapAspectRatio"
			:lat="mapLat"
			:long="mapLong"
			:zoom-level="mapZoomLevel" :initial-zoom="mapInitialZoom"
		/>
		<CountryInfo
			:country-name="countryName" :country-iso-code="countryIsoCode"
			:avg-annual-income="avgAnnualIncome" :num-loans-fundraising="numLoansFundraising" :region-name="regionName"
			:loans-in-region-link="loansInRegionLink" :loading="loading"
		/>
	</article>
</template>

<script lang="ts" setup>
import {
	computed,
	inject,
	onMounted,
	ref,
} from 'vue';
import { KvMap } from '@kiva/kv-components';
import loanFacetsQuery from '#src/graphql/query/loanFacetsQuery.graphql';
import CountryInfo from './CountryInfo';

const apollo = inject('apollo');
const borrowerProfile = inject('borrowerProfile');
const mapZoomLevel = 5;
const mapInitialZoom = 4;
const mapAutoZoomDelay = 500;
const mapAspectRatio = 1.3;

const loanCountryFacets = ref([]);

const loanGeocode = computed(() => borrowerProfile?.loanGeocode?.value);
const loading = computed(() => borrowerProfile?.loading?.value);

const mapLat = computed(() => {
	if (loanGeocode?.value?.latitude) {
		return loanGeocode.value.latitude;
	}

	return loanGeocode?.value?.country?.geocode?.latitude ?? null;
});

const mapLong = computed(() => {
	if (loanGeocode?.value?.longitude) {
		return loanGeocode.value.longitude;
	}

	return loanGeocode?.value?.country?.geocode?.longitude ?? null;
});

const countryName = computed(() => loanGeocode?.value?.country?.name ?? '');
const countryIsoCode = computed(() => loanGeocode?.value?.country?.isoCode ?? '');
const avgAnnualIncome = computed(() => loanGeocode?.value?.country?.ppp ?? '');
const numLoansFundraising = computed(() => loanGeocode?.value?.country?.numLoansFundraising ?? 0);
const regionName = computed(() => loanGeocode?.value?.country?.region ?? '');

const loansInRegionLink = computed(() => {
	const countries = [];
	if (loanCountryFacets.value.length) {
		for (let i = 0; i < loanCountryFacets.value.length; i += 1) {
			if (loanCountryFacets?.value?.[i]?.country?.region === regionName.value) {
				countries.push(loanCountryFacets?.value?.[i]?.country?.isoCode);
			}
		}
		return `/lend?country=${countries.join(',').toLowerCase()}&sortBy=newest`;
	}
	return '';
});

const fetchCountryFacets = async () => {
	try {
		const facetsResponse = await apollo.query({
			query: loanFacetsQuery,
			variables: {
				isoCodeFilters: loanGeocode?.value?.country?.isoCode,
			},
		});
		loanCountryFacets.value = facetsResponse?.data.lend?.countryFacets ?? [];
	} catch (error) {
		console.error('Error fetching country facets:', error);
		loanCountryFacets.value = [];
	}
};

onMounted(() => {
	fetchCountryFacets();
});
</script>
