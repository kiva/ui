<template>
	<div class="tw-bg-white tw-border-primary-inverse tw-rounded tw-p-3 tw-relative">
		<kv-section-modal-loader :loading="loading" :rounded="true" />
		<button class="tw-flex tw-items-center tw-mb-2 tw-h-[22px]" @click="resetFilters">
			<kv-material-icon :icon="mdiClose" class="tw-w-2.5 tw-h-2.5" />
			<p class="tw-text-h4 tw-inline-block tw-ml-3">
				Reset All
			</p>
		</button>
		<hr class="tw-border-tertiary tw-my-1">
		<loan-search-radio-group-filter
			:options="facets.genders"
			:selected="loanSearchState.gender"
			filter-key="gender"
			event-action="click-gender-filter"
			all-option-title="All genders"
			@updated="handleUpdatedFilters"
		/>
		<template v-if="extendFlssFilters">
			<hr class="tw-border-tertiary tw-my-1">
			<loan-search-radio-group-filter
				:options="facets.isIndividualOptions"
				:selected="loanSearchState.isIndividual"
				filter-key="isIndividual"
				event-action="click-isIndividual-filter"
				:value-map="isIndividualValueMap"
				@updated="handleUpdatedFilters"
			/>
		</template>
		<hr class="tw-border-tertiary tw-my-1">
		<kv-accordion-item id="acc-sort-by" :open="false">
			<template #header>
				<h2 class="tw-text-h4">
					Sort order
				</h2>
			</template>
			<loan-search-sort-by
				:all-sort-options="facets.sortOptions"
				:extend-flss-filters="extendFlssFilters"
				:is-logged-in="isLoggedIn"
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
			<loan-search-location-filter
				:active-iso-codes="loanSearchState.countryIsoCode"
				:regions="facets.regions"
				@updated="handleUpdatedFilters"
			/>
		</kv-accordion-item>
		<kv-accordion-item id="acc-sectors" :open="false">
			<template #header>
				<h2 class="tw-text-h4">
					Sectors
				</h2>
			</template>
			<loan-search-checkbox-list-filter
				:options="facets.sectors"
				:ids="loanSearchState.sectorId"
				@updated="handleUpdatedFilters"
				filter-key="sectorId"
				event-action="click-sector-filter"
			/>
		</kv-accordion-item>
		<kv-accordion-item id="acc-attributes" :open="false">
			<template #header>
				<h2 class="tw-text-h4">
					Attributes
				</h2>
			</template>
			<loan-search-checkbox-list-filter
				:options="facets.themes"
				:ids="loanSearchState.themeId"
				@updated="handleUpdatedFilters"
				filter-key="themeId"
				event-action="click-theme-filter"
			/>
		</kv-accordion-item>
		<template v-if="extendFlssFilters">
			<kv-accordion-item id="acc-tags" :open="false">
				<template #header>
					<h2 class="tw-text-h4">
						Tags
					</h2>
				</template>
				<loan-search-checkbox-list-filter
					:options="facets.tags"
					:ids="loanSearchState.tagId"
					@updated="handleUpdatedFilters"
					filter-key="tagId"
					event-action="click-tag-filter"
				/>
			</kv-accordion-item>
			<h2 class="tw-text-h4 tw-pt-2">
				Loan length
			</h2>
			<loan-search-radio-group-filter
				:options="facets.lenderRepaymentTerms"
				:selected="loanSearchState.lenderRepaymentTerm"
				filter-key="lenderRepaymentTerm"
				event-action="click-lenderRepaymentTerm-filter"
				:value-map="lenderRepaymentTermValueMap"
				@updated="handleUpdatedFilters"
			/>
			<h2 class="tw-text-h4 tw-pt-2">
				Loan distribution
			</h2>
			<loan-search-radio-group-filter
				:options="facets.distributionModels"
				:selected="loanSearchState.distributionModel"
				filter-key="distributionModel"
				event-action="click-distributionModel-filter"
				@updated="handleUpdatedFilters"
			/>
			<hr class="tw-border-tertiary tw-my-1">
			<kv-accordion-item id="acc-advanced" :open="false">
				<template #header>
					<h2 class="tw-text-h4">
						Advanced filters
					</h2>
				</template>
				<button class="tw-mt-2 tw-h-[22px]" @click="advancedFilters">
					<h2 class="tw-text-h4 tw-flex tw-items-center">
						Legacy filters
						<kv-material-icon :icon="mdiArrowRight" class="tw-w-2.5 tw-h-2.5 tw-ml-1" />
					</h2>
				</button>
			</kv-accordion-item>
		</template>
		<template v-else>
			<button class="tw-mt-2 tw-h-[22px]" @click="advancedFilters">
				<h2 class="tw-text-h4 tw-flex tw-items-center">
					Advanced filters
					<kv-material-icon :icon="mdiArrowRight" class="tw-w-2.5 tw-h-2.5 tw-ml-1" />
				</h2>
			</button>
		</template>
	</div>
</template>

<script>
import KvAccordionItem from '@/components/Kv/KvAccordionItem';
import { mdiClose, mdiArrowRight } from '@mdi/js';
import LoanSearchLocationFilter from '@/components/Lend/LoanSearch/LoanSearchLocationFilter';
import LoanSearchCheckboxListFilter from '@/components/Lend/LoanSearch/LoanSearchCheckboxListFilter';
import LoanSearchSortBy from '@/components/Lend/LoanSearch/LoanSearchSortBy';
import { FLSS_QUERY_TYPE, isIndividualValueMap, lenderRepaymentTermValueMap } from '@/util/loanSearch/filterUtils';
import KvSectionModalLoader from '@/components/Kv/KvSectionModalLoader';
import LoanSearchRadioGroupFilter from '@/components/Lend/LoanSearch/LoanSearchRadioGroupFilter';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'LoanSearchFilter',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvAccordionItem,
		KvMaterialIcon,
		LoanSearchRadioGroupFilter,
		LoanSearchLocationFilter,
		LoanSearchCheckboxListFilter,
		LoanSearchSortBy,
		KvSectionModalLoader,
	},
	props: {
		extendFlssFilters: {
			type: Boolean,
			default: false,
		},
		loading: {
			type: Boolean,
			default: false
		},
		facets: {
			type: Object,
			required: true
		},
		isLoggedIn: {
			type: Boolean,
			default: false
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
			isIndividualValueMap,
			lenderRepaymentTermValueMap,
		};
	},
	methods: {
		resetFilters() {
			this.$emit('reset');

			this.$kvTrackEvent('Lending', 'click-reset-all-filters', 'Reset all');
		},
		advancedFilters() {
			this.$kvTrackEvent('Lending', 'click-advanced-filters', 'Advanced filters');

			window.location.href = '/lend?kexpn=lend_filter.lend_filter_versions&kexpv=c';
		},
		handleUpdatedFilters(payload) {
			this.$emit('updated', payload);
		}
	},
};
</script>
