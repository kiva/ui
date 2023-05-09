<template>
	<div class="tw-bg-white tw-border-primary-inverse tw-rounded tw-p-3 tw-relative">
		<kv-section-modal-loader :loading="loading" :rounded="true" />
		<button class="tw-flex tw-items-center tw-mb-2 tw-h-[22px]" @click="resetFilters">
			<kv-material-icon :icon="mdiClose" class="tw-w-2.5 tw-h-2.5" />
			<p class="tw-text-h4 tw-inline-block tw-ml-3">
				Reset All
			</p>
		</button>
		<component
			v-for="filter in filters"
			:key="filter.facetsKey"
			:is="filter.hasAccordion ? KvAccordionItem : 'div'"
			:id="`${filter.facetsKey}-filter-container`"
			class="tw-mb-0.5"
		>
			<template #header v-if="filter.hasAccordion">
				<h2 class="tw-text-h4">
					{{ filter.title }}
				</h2>
			</template>
			<template v-if="!filter.hasAccordion">
				<hr v-if="filter.topLine" class="tw-border-tertiary tw-my-1">
				<h2 v-if="filter.shouldDisplayTitle && filter.title" class="tw-text-h4 tw-pt-1">
					{{ filter.title }}
				</h2>
			</template>
			<loan-search-radio-group-filter
				v-if="filter.type === filterUiType.radioGroup"
				:options="facets[filter.facetsKey]"
				:selected="loanSearchState[filter.stateKey]"
				:filter-key="filter.stateKey"
				:event-action="filter.eventAction"
				:all-option-title="filter.allOptionsTitle"
				:value-map="filter.valueMap"
				@updated="handleUpdatedFilters"
			/>
			<kv-text-input
				v-if="filter.type === filterUiType.keyword"
				:id="`${filter.facetsKey}-text-input`"
				:placeholder="filter.placeholder"
				:can-clear="true"
				v-model="keywordSearch"
				class="tw-w-full tw-py-1.5"
				@input="value => debouncedHandleUpdateKeywordSearch({ keywordSearch: value.trim() })"
			/>
			<loan-search-sort-by
				v-if="filter.type === filterUiType.sortBy"
				:all-sort-options="facets[filter.facetsKey]"
				:is-logged-in="isLoggedIn"
				:sort="loanSearchState[filter.stateKey]"
				@updated="handleUpdatedFilters"
			/>
			<loan-search-location-filter
				v-if="filter.type === filterUiType.location"
				:active-iso-codes="loanSearchState[filter.stateKey]"
				:regions="facets[filter.facetsKey]"
				@updated="handleUpdatedFilters"
			/>
			<loan-search-checkbox-list-filter
				v-if="filter.type === filterUiType.checkboxList"
				:options="facets[filter.facetsKey]"
				:ids="loanSearchState[filter.stateKey]"
				:filter-key="filter.stateKey"
				:event-action="filter.eventAction"
				@updated="handleUpdatedFilters"
			/>
			<kv-select-box
				v-if="filter.type === filterUiType.partner"
				:id="`${filter.stateKey}-info-select-box`"
				:items="facets[filter.facetsKey]"
				:header-key="filter.itemHeaderKey"
				:should-sort="false"
				:placeholder="filter.placeholder"
				:is-full-width="true"
				:selected-ids="loanSearchState[filter.stateKey]"
				class="tw-w-full tw-py-1.5"
				@selected="handleUpdatePartnerIdFilter"
			/>
			<kv-range-min-max-slider
				v-if="filter.type === filterUiType.rangeSlider"
				:range-min="filterUtils.filters[filter.facetsKey].getOptions().min"
				:range-max="filterUtils.filters[filter.facetsKey].getOptions().max"
				:step="filterUtils.filters[filter.facetsKey].getOptions().step"
				:min="loanSearchState[filter.stateKey]
					? loanSearchState[filter.stateKey].min
					: filterUtils.filters[filter.facetsKey].getOptions().min"
				:max="loanSearchState[filter.stateKey]
					? loanSearchState[filter.stateKey].max
					: filterUtils.filters[filter.facetsKey].getOptions().max"
				:is-percentage="filter.isPercentage"
				:displayed-unit="filter.displayedUnit"
				class="tw-mt-0.5"
				@change="payload => debouncedHandleRangeSlider(
					filter.stateKey,
					payload,
					filter.eventAction
				)"
			/>
			<hr v-if="filter.bottomLine" class="tw-border-tertiary tw-mt-1">
		</component>
		<hr class="tw-border-tertiary tw-my-1">
		<kv-accordion-item id="acc-advanced" :open="false">
			<template #header>
				<h2 class="tw-text-h4">
					Advanced filters
				</h2>
			</template>
			<button class="tw-mt-2" @click="advancedFilters">
				<h2 class="tw-text-h4 tw-flex tw-items-center">
					Legacy filters
					<kv-material-icon :icon="mdiArrowRight" class="tw-w-2.5 tw-h-2.5 tw-ml-1" />
				</h2>
			</button>
		</kv-accordion-item>
	</div>
</template>

<script>
import KvAccordionItem from '@/components/Kv/KvAccordionItem';
import { mdiClose, mdiArrowRight } from '@mdi/js';
import LoanSearchLocationFilter from '@/components/Lend/LoanSearch/LoanSearchLocationFilter';
import LoanSearchCheckboxListFilter from '@/components/Lend/LoanSearch/LoanSearchCheckboxListFilter';
import LoanSearchSortBy from '@/components/Lend/LoanSearch/LoanSearchSortBy';
import {
	filterUiConfigs, filterUtils, filterOptionUtils, minMaxRangeUtils
} from '@kiva/kv-loan-filters';
import KvSectionModalLoader from '@/components/Kv/KvSectionModalLoader';
import KvSelectBox from '@/components/Kv/KvSelectBox';
import LoanSearchRadioGroupFilter from '@/components/Lend/LoanSearch/LoanSearchRadioGroupFilter';
import _debounce from 'lodash/debounce';
import KvRangeMinMaxSlider from '@/components/Kv/KvRangeMinMaxSlider';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';

export default {
	name: 'LoanSearchFilter',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvAccordionItem,
		KvMaterialIcon,
		KvTextInput,
		LoanSearchRadioGroupFilter,
		LoanSearchLocationFilter,
		LoanSearchCheckboxListFilter,
		LoanSearchSortBy,
		KvSectionModalLoader,
		KvSelectBox,
		KvRangeMinMaxSlider,
	},
	props: {
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
	},
	data() {
		return {
			mdiClose,
			mdiArrowRight,
			keywordSearch: '',
			debouncedHandleUpdateKeywordSearch: _debounce(this.handleUpdateKeywordSearch, 750),
			filters: [
				filterUiConfigs.genders({
					type: filterOptionUtils.filterUiType.radioGroup,
					shouldDisplayTitle: false,
				}),
				filterUiConfigs.isIndividual({ type: filterOptionUtils.filterUiType.radioGroup }),
				filterUiConfigs.keywordSearch({ type: filterOptionUtils.filterUiType.keyword }),
				filterUiConfigs.sortOptions({ type: filterOptionUtils.filterUiType.sortBy }),
				filterUiConfigs.regions({ type: filterOptionUtils.filterUiType.location }),
				filterUiConfigs.sectors({ type: filterOptionUtils.filterUiType.checkboxList }),
				filterUiConfigs.themes({ type: filterOptionUtils.filterUiType.checkboxList }),
				filterUiConfigs.tags({ type: filterOptionUtils.filterUiType.checkboxList }),
				filterUiConfigs.lenderRepaymentTerms({ type: filterOptionUtils.filterUiType.radioGroup }),
				filterUiConfigs.distributionModels({ type: filterOptionUtils.filterUiType.radioGroup }),
				filterUiConfigs.partners({ type: filterOptionUtils.filterUiType.partner }),
				filterUiConfigs.partnerRiskRating({ type: filterOptionUtils.filterUiType.rangeSlider }),
				filterUiConfigs.partnerDefaultRate({ type: filterOptionUtils.filterUiType.rangeSlider }),
				filterUiConfigs.partnerAvgProfitability({ type: filterOptionUtils.filterUiType.rangeSlider }),
			],
			filterUiType: filterOptionUtils.filterUiType,
			filterUtils,
			KvAccordionItem,
			debouncedHandleRangeSlider: _debounce(this.handleRangeSlider, 500),
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
		},
		handleUpdateKeywordSearch(payload) {
			this.handleUpdatedFilters(payload);

			this.$kvTrackEvent('Lending', 'change-keyword-search', payload.keywordSearch);
		},
		handleUpdatePartnerIdFilter({ id }) {
			if (!this.loanSearchState.partnerId.includes(id)) {
				this.handleUpdatedFilters({ partnerId: [...this.loanSearchState.partnerId, id] });
			}

			this.$kvTrackEvent('Lending', 'click-partner-id', id);
		},
		handleRangeSlider(stateKey, payload, eventAction) {
			const newValue = minMaxRangeUtils.createMinMaxRange(payload.min, payload.max);

			this.handleUpdatedFilters({ [stateKey]: newValue });

			this.$kvTrackEvent('Lending', eventAction, minMaxRangeUtils.getMinMaxRangeQueryParam(newValue));
		},
	},
	watch: {
		loanSearchState(state) {
			this.keywordSearch = state.keywordSearch ?? '';
		},
	},
};
</script>
