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
			<loan-search-location-filter :regions="facets.regions" @updated="handleUpdatedFilters" />
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
					v-for="sectorBox in facets.sectors"
					name="sectorBox.name"
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
					v-for="sectorBox in facets.sectors"
					name="sectorBox.name"
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
import KvAccordionItem from '@/components/Kv/KvAccordionItem';
import { mdiClose, mdiArrowRight } from '@mdi/js';
import LoanSearchGenderFilter from '@/components/Lend/LoanSearch/LoanSearchGenderFilter';
import LoanSearchLocationFilter from '@/components/Lend/LoanSearch/LoanSearchLocationFilter';
import { updateSearchState } from '@/util/loanSearchUtils';
import KvCheckbox from '~/@kiva/kv-components/vue/KvCheckbox';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'LoanSearchFilter',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvCheckbox,
		KvAccordionItem,
		KvMaterialIcon,
		LoanSearchGenderFilter,
		LoanSearchLocationFilter,
	},
	props: {
		/**
		 * Facet options based on the loans available. Format:
		 * {
		 *   regions: [
		 *     {
		 *       region: '',
		 *       numLoansFundraising: 1,
		 *       countries: [
		 *         {
		 *           name: '',
		 *           region: '',
		 *           isoCode: '',
		 *           numLoansFundraising: 1,
		 *         }
		 *       ]
		 *     }
		 *   ],
		 *   sectors: [
		 *     {
		 *       id: 1,
		 *       name: '',
		 *     }
		 *   ]
		 * }
		 */
		facets: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			mdiClose,
			mdiArrowRight,
			queryFilters: {},
		};
	},
	methods: {
		resetFilter() {
			// this.queryFilters = {};
		},
		handleUpdatedFilters(payload) {
			this.queryFilters = { ...this.queryFilters, ...payload };
		}
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
