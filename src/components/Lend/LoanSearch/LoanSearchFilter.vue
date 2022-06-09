<template>
	<div class="tw-bg-white tw-border-primary-inverse tw-rounded tw-p-3 filter-min-w tw-relative">
		<button class="tw-flex tw-items-center tw-mb-2 tw-h-[22px]" @click="resetFilters">
			<kv-material-icon :icon="mdiClose" class="tw-w-2.5 tw-h-2.5" />
			<p class="tw-text-h4 tw-inline-block tw-ml-3">
				Reset All
			</p>
		</button>
		<hr class="tw-border-tertiary tw-my-1">
		<loan-search-gender-filter :gender="loanSearchState.gender" @updated="handleUpdatedFilters" />
		<hr class="tw-border-tertiary tw-my-1">
		<kv-accordion-item id="acc-sort-by" :open="false">
			<template #header>
				<h2 class="tw-text-h4">
					Sort order
				</h2>
			</template>
			<loan-search-sort-by
				:all-sort-options="facets.sortOptions"
				:sort="loanSearchState.sortBy"
				:query-type="queryType"
				@updated="handleUpdatedFilters"
			/>
		</kv-accordion-item>
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
			<loan-search-sector-filter
				:sectors="facets.sectors"
				:sector-ids="loanSearchState.sectorId"
				@updated="handleUpdatedFilters"
			/>
		</kv-accordion-item>
		<kv-accordion-item id="acc-attributes" :open="false">
			<template #header>
				<h2 class="tw-text-h4">
					Attributes
				</h2>
			</template>
			<loan-search-theme-filter
				:themes="facets.themes"
				:theme-names="loanSearchState.theme"
				@updated="handleUpdatedFilters"
			/>
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
import LoanSearchSectorFilter from '@/components/Lend/LoanSearch/LoanSearchSectorFilter';
import LoanSearchThemeFilter from '@/components/Lend/LoanSearch/LoanSearchThemeFilter';
import LoanSearchSortBy from '@/components/Lend/LoanSearch/LoanSearchSortBy';
import { FLSS_QUERY_TYPE } from '@/util/loanSearchUtils';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'LoanSearchFilter',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvAccordionItem,
		KvMaterialIcon,
		LoanSearchGenderFilter,
		LoanSearchLocationFilter,
		LoanSearchSectorFilter,
		LoanSearchThemeFilter,
		LoanSearchSortBy,
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
		 *       numLoansFundraising: 1,
		 *     }
		 *   ],
		 *   themes: [
		 *     {
		 *       id: 1,
		 *       name: '',
		 *       numLoansFundraising: 1,
		 *     }
		 *   ],
		 * }
		 */
		facets: {
			type: Object,
			required: true
		},
		loanSearchState: {
			type: Object,
			default: () => {}
		},
		queryType: {
			type: String,
			default: FLSS_QUERY_TYPE
		}
	},
	data() {
		return {
			mdiClose,
			mdiArrowRight,
		};
	},
	methods: {
		resetFilters() {
			this.$emit('reset');

			this.$kvTrackEvent('Lending', 'click-reset-all-filters', 'Reset all');
		},
		handleUpdatedFilters(payload) {
			this.$emit('updated', payload);
		}
	},
};
</script>

<style lang="scss" scoped>
	.filter-min-w {
		min-width: 285px;
	}
</style>
