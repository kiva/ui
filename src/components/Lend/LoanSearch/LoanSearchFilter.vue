<template>
	<div class="tw-bg-white tw-border-primary-inverse tw-rounded tw-p-3 filter-min-w tw-relative">
		<kv-material-icon :icon="mdiClose" class="tw-w-2.5 tw-h-2.5" />
		<p class="tw-text-h4 tw-inline-block tw-ml-3 tw-absolute">
			Reset All
		</p>
		<hr class="tw-border-tertiary tw-my-1">
		<loan-search-gender-filter @updated="handleUpdatedFilters" />
		<hr class="tw-border-tertiary tw-my-1">
		<kv-accordion-item id="acc-location" :open="false">
			<template #header>
				<h2 class="tw-text-h4">
					Location
				</h2>
			</template>
			<fieldset>
				<legend>Sector</legend>
				<kv-checkbox
					class="tw-text-left"
					v-for="sectorBox in allSectors"
					name="sectorBox.name"
					v-model="sector"
					:key="sectorBox.id"
					:value="sectorBox.name"
				>
					{{ sectorBox.name }}
				</kv-checkbox>
			</fieldset>
		</kv-accordion-item>
		<kv-accordion-item id="acc-sectors" :open="false">
			<template #header>
				<h2 class="tw-text-h4">
					Sectors
				</h2>
			</template>
			<fieldset>
				<legend>Sector</legend>
				<kv-checkbox
					class="tw-text-left"
					v-for="sectorBox in allSectors"
					name="sectorBox.name"
					v-model="sector"
					:key="sectorBox.id"
					:value="sectorBox.name"
				>
					{{ sectorBox.name }}
				</kv-checkbox>
			</fieldset>
		</kv-accordion-item>
		<kv-accordion-item id="acc-attributes" :open="false">
			<template #header>
				<h2 class="tw-text-h4">
					Attributes
				</h2>
			</template>
			<fieldset>
				<legend>Sector</legend>
				<kv-checkbox
					class="tw-text-left"
					v-for="sectorBox in allSectors"
					name="sectorBox.name"
					v-model="sector"
					:key="sectorBox.id"
					:value="sectorBox.name"
				>
					{{ sectorBox.name }}
				</kv-checkbox>
			</fieldset>
		</kv-accordion-item>
		<h2 class="tw-text-h4 tw-mt-2">
			Advanced filters
			<kv-material-icon :icon="mdiArrowRight" class="tw-w-2.5 tw-h-2.5 tw-ml-1 tw-absolute" />
		</h2>
	</div>
</template>

<script>
import {
	// fetchData,
	// filterGender,
	// filterSector,
	fetchSectors,
	fetchCountryFacets,
	// filterCountry,
	// filterLoanTerm,
} from '@/util/flssUtils';
import KvAccordionItem from '@/components/Kv/KvAccordionItem';
import { mdiClose, mdiArrowRight } from '@mdi/js';
import LoanSearchGenderFilter from '@/components/Lend/LoanSearch/LoanSearchGenderFilter';
import { updateSearchState } from '@/util/loanSearchUtils';
import KvCheckbox from '~/@kiva/kv-components/vue/KvCheckbox';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		KvCheckbox,
		KvAccordionItem,
		KvMaterialIcon,
		LoanSearchGenderFilter,
	},
	data() {
		return {
			mdiClose,
			mdiArrowRight,
			loanId: Number(this.$route.params.id || 0),
			queryFilters: {},
			totalCount: 0,
			loans: [],
			zeroLoans: false,
			sector: ['Food', 'Education'],
			country: ['TZ', 'KE'],
			lenderTermLimit: 0,
			allSectors: [],
			allCountries: [],
			allIsoCodes: [],
		};
	},
	methods: {
		async getSectors() {
			const sectorInfo = await fetchSectors(this.apollo);
			this.allSectors = sectorInfo;
		},
		async getAllCountries() {
			// data pull only from production endpoint,
			// not implemented with a component until design path
			// with product is completed.
			const countryFacets = await fetchCountryFacets(this.apollo);
			this.allCountries = countryFacets.map(cf => cf.country.name);
			// pulled in IsoCodes b/c the loan query filters are currently coded
			// to use ISO Codes instead of country names in queryFilters() right now
			this.allIsoCodes = countryFacets.map(cf => cf.country.isoCode);
		},
		resetFilter() {
			// this.gender = 'both';
			// this.sector = [];
			// this.country = [];
			// this.lenderTermLimit = 0;
			// this.queryFilters = {};
		},
		handleUpdatedFilters(payload) {
			this.queryFilters = { ...this.queryFilters, ...payload };
		}
		// updateQuery() {
		// 	const updatedQueryFilters = this.queryFilters;
		// 	console.log('from updateQuery', updatedQueryFilters);
		// 	console.log('new query ran, yes!');
		// },
	},
	async mounted() {
		// Initialize filter options
		this.getSectors();
		this.getAllCountries();
	},
	computed: {
		// queryFilters() {
		// 	// // TODO: enable genderFilter when its working
		// 	const genderFilter = filterGender(this.gender);
		// 	console.log('this is filtergender', genderFilter);

		// 	const sectorFilter = filterSector(this.sector, this.allSectors);
		// 	console.log('this is filterSector', sectorFilter);

		// 	const countryFilter = filterCountry(this.country, this.allIsoCodes);
		// 	console.log('this is countryFilter', countryFilter);

		// 	const loanTermFilter = filterLoanTerm(this.lenderTermLimit);
		// 	console.log('this is filterLoanTerm', loanTermFilter);

		// 	const loanQueryFilters = {
		// 		countryIsoCode: countryFilter,
		// 		// lenderRepaymentTerm: loanTermFilter,
		// 		// TODO: enable genderFilter when its working
		// 		// gender: genderFilter,
		// 		sector: sectorFilter,
		// 	};
		// 	console.log('yo! from queryFilters', loanQueryFilters);
		// 	return loanQueryFilters;
		// },
	},
	watch: {
		async queryFilters(newFilters) {
			await updateSearchState(this.apollo, newFilters);
		}
	},
};
</script>

<style lang="scss" scoped>
	.filter-min-w {
		min-width: 285px;
	}
</style>
