<template>
	<div class="tw-bg-white tw-border-primary-inverse tw-rounded tw-p-3 tw-relative">
		<kv-section-modal-loader :loading="loading" :rounded="true" />
		<button class="tw-flex tw-items-center tw-mb-2 tw-h-[22px]" @click="resetFilters">
			<kv-material-icon :icon="mdiClose" class="tw-w-2.5 tw-h-2.5" />
			<p class="tw-text-h4 tw-inline-block tw-ml-3">
				Reset All
			</p>
		</button>
		<template v-for="key in filterConfig.keys" :key="key">
			<template v-if="shouldDisplayFilter(key)">
				<component
					:is="filterConfig.config[key].uiConfig.hasAccordion ? AsyncKvAccordionItem : 'div'"
					:id="`${key}-filter-container`"
					class="tw-mb-0.5"
				>
					<template #header v-if="filterConfig.config[key].uiConfig.hasAccordion">
						<h2 class="tw-text-h4">
							{{ filterConfig.config[key].uiConfig.title }}
						</h2>
					</template>
					<template v-if="!filterConfig.config[key].uiConfig.hasAccordion">
						<hr v-if="filterConfig.config[key].uiConfig.topLine" class="tw-border-tertiary tw-my-1">
						<h2 v-if="filterConfig.config[key].uiConfig.title" class="tw-text-h4 tw-pt-1">
							{{ filterConfig.config[key].uiConfig.title }}
						</h2>
					</template>
					<loan-search-radio-group-filter
						v-if="filterConfig.config[key].uiConfig.type === filterUiType.radioGroup"
						:options="facets[filterConfig.config[key].uiConfig.facetsKey]"
						:selected="loanSearchState[filterConfig.config[key].uiConfig.stateKey]"
						:filter-key="filterConfig.config[key].uiConfig.stateKey"
						:event-action="filterConfig.config[key].uiConfig.eventAction"
						:all-option-title="filterConfig.config[key].uiConfig.allOptionsTitle"
						:value-map="filterConfig.config[key].uiConfig.valueMap"
						@updated="handleUpdatedFilters"
					/>
					<kv-text-input
						v-if="filterConfig.config[key].uiConfig.type === filterUiType.keyword"
						:id="`${key}-text-input`"
						:placeholder="filterConfig.config[key].uiConfig.placeholder"
						:can-clear="true"
						v-model="keywordSearch"
						class="tw-w-full tw-py-1.5"
						@input="value => debouncedHandleUpdateKeywordSearch({ keywordSearch: value.trim() })"
					/>
					<loan-search-sort-by
						v-if="filterConfig.config[key].uiConfig.type === filterUiType.sortBy"
						:all-sort-options="facets[filterConfig.config[key].uiConfig.facetsKey]"
						:extend-flss-filters="extendFlssFilters"
						:is-logged-in="isLoggedIn"
						:sort="loanSearchState[filterConfig.config[key].uiConfig.stateKey]"
						:query-type="queryType"
						@updated="handleUpdatedFilters"
					/>
					<loan-search-location-filter
						v-if="filterConfig.config[key].uiConfig.type === filterUiType.location"
						:active-iso-codes="loanSearchState[filterConfig.config[key].uiConfig.stateKey]"
						:regions="facets[filterConfig.config[key].uiConfig.facetsKey]"
						@updated="handleUpdatedFilters"
					/>
					<loan-search-checkbox-list-filter
						v-if="filterConfig.config[key].uiConfig.type === filterUiType.checkboxList"
						:options="facets[filterConfig.config[key].uiConfig.facetsKey]"
						:ids="loanSearchState[filterConfig.config[key].uiConfig.stateKey]"
						:filter-key="filterConfig.config[key].uiConfig.stateKey"
						:event-action="filterConfig.config[key].uiConfig.eventAction"
						@updated="handleUpdatedFilters"
					/>
					<kv-select-box
						v-if="filterConfig.config[key].uiConfig.type === filterUiType.partner"
						:id="`${filterConfig.config[key].uiConfig.stateKey}-info-select-box`"
						:items="facets[filterConfig.config[key].uiConfig.facetsKey]"
						:header-key="filterConfig.config[key].uiConfig.itemHeaderKey"
						:should-sort="false"
						:placeholder="filterConfig.config[key].uiConfig.placeholder"
						:is-full-width="true"
						:selected-ids="loanSearchState[filterConfig.config[key].uiConfig.stateKey]"
						class="tw-w-full tw-py-1.5"
						@selected="handleUpdatePartnerIdFilter"
					/>
					<kv-range-min-max-slider
						v-if="filterConfig.config[key].uiConfig.type === filterUiType.rangeSlider"
						:range-min="filterConfig.config[key].getOptions().min"
						:range-max="filterConfig.config[key].getOptions().max"
						:step="filterConfig.config[key].getOptions().step"
						:min="loanSearchState[filterConfig.config[key].uiConfig.stateKey]
							? loanSearchState[filterConfig.config[key].uiConfig.stateKey].min
							: filterConfig.config[key].getOptions().min"
						:max="loanSearchState[filterConfig.config[key].uiConfig.stateKey]
							? loanSearchState[filterConfig.config[key].uiConfig.stateKey].max
							: filterConfig.config[key].getOptions().max"
						:is-percentage="filterConfig.config[key].uiConfig.isPercentage"
						:displayed-unit="filterConfig.config[key].uiConfig.displayedUnit"
						class="tw-mt-0.5"
						@updated="(payload) => debouncedHandleRangeSlider(
							filterConfig.config[key].uiConfig.stateKey,
							payload,
							filterConfig.config[key].uiConfig.eventAction
						)"
					/>
					<hr v-if="filterConfig.config[key].uiConfig.bottomLine" class="tw-border-tertiary tw-mt-1">
				</component>
			</template>
		</template>
		<template v-if="extendFlssFilters">
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
		</template>
		<template v-else>
			<button class="tw-mt-2" @click="advancedFilters">
				<h2 class="tw-text-h4 tw-flex tw-items-center">
					Advanced filters
					<kv-material-icon :icon="mdiArrowRight" class="tw-w-2.5 tw-h-2.5 tw-ml-1" />
				</h2>
			</button>
		</template>
	</div>
</template>

<script>
import { defineAsyncComponent, shallowRef } from 'vue';
import KvAccordionItem from '#src/components/Kv/KvAccordionItem';
import { mdiClose, mdiArrowRight } from '@mdi/js';
import LoanSearchLocationFilter from '#src/components/Lend/LoanSearch/LoanSearchLocationFilter';
import LoanSearchCheckboxListFilter from '#src/components/Lend/LoanSearch/LoanSearchCheckboxListFilter';
import LoanSearchSortBy from '#src/components/Lend/LoanSearch/LoanSearchSortBy';
import { filterUiType, FLSS_QUERY_TYPE } from '#src/util/loanSearch/filterUtils';
import KvSectionModalLoader from '#src/components/Kv/KvSectionModalLoader';
import KvSelectBox from '#src/components/Kv/KvSelectBox';
import LoanSearchRadioGroupFilter from '#src/components/Lend/LoanSearch/LoanSearchRadioGroupFilter';
import _debounce from 'lodash/debounce';
import filterConfig from '#src/util/loanSearch/filterConfig';
import KvRangeMinMaxSlider from '#src/components/Kv/KvRangeMinMaxSlider';
import { createMinMaxRange, getMinMaxRangeQueryParam } from '#src/util/loanSearch/minMaxRange';
import { KvMaterialIcon, KvTextInput } from '@kiva/kv-components';

const AsyncKvAccordionItem = shallowRef(defineAsyncComponent(() => import('#src/components/Kv/KvAccordionItem')));

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
	emits: ['reset', 'updated'],
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
			keywordSearch: '',
			debouncedHandleUpdateKeywordSearch: _debounce(this.handleUpdateKeywordSearch, 750),
			filterConfig,
			filterUiType,
			AsyncKvAccordionItem,
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
			const newValue = createMinMaxRange(payload.min, payload.max);

			this.handleUpdatedFilters({ [stateKey]: newValue });

			this.$kvTrackEvent('Lending', eventAction, getMinMaxRangeQueryParam(newValue));
		},
		shouldDisplayFilter(key) {
			// TODO: remove once the "extendFlssFilters" experiment is complete
			const isExperimentFilter = [
				filterConfig.config.isIndividual.uiConfig.stateKey,
				filterConfig.config.keywordSearch.uiConfig.stateKey,
				filterConfig.config.tags.uiConfig.stateKey,
				filterConfig.config.lenderRepaymentTerms.uiConfig.stateKey,
				filterConfig.config.distributionModels.uiConfig.stateKey,
				filterConfig.config.partners.uiConfig.stateKey,
				filterConfig.config.partnerRiskRating.uiConfig.stateKey,
				filterConfig.config.partnerDefaultRate.uiConfig.stateKey,
				filterConfig.config.partnerAvgProfitability.uiConfig.stateKey,
			].includes(filterConfig.config[key].uiConfig.stateKey);

			// These filters are not currently part of the filter panel
			const hiddenFilters = [
				filterConfig.config.pageOffset.uiConfig.stateKey,
				filterConfig.config.pageLimit.uiConfig.stateKey,
				filterConfig.config.activities.uiConfig.stateKey,
			].includes(filterConfig.config[key].uiConfig.stateKey);

			return !hiddenFilters && (this.extendFlssFilters || !isExperimentFilter);
		},
	},
	watch: {
		loanSearchState(state) {
			this.keywordSearch = state.keywordSearch ?? '';
		},
	},
};
</script>
