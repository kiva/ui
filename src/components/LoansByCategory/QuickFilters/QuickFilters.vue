<template>
	<div class="tw-flex tw-flex-col tw-gap-2 tw-mb-2 lg:tw-flex-row">
		<div
			v-for="filter in filters"
			:key="filter.facetsKey"
			class="quick-filter tw-flex tw-flex-col"
			:class="{ 'tw-grow': filter.type === filterUiType.location }"
		>
			<label class="tw-text-h4 tw-w-full">{{ filter.title }}</label>
			<kv-select
				v-if="filter.type === filterUiType.dropdown"
				:id="filter.facetsKey"
				:disabled="loading"
				:model-value="loanSearchState[filter.stateKey]"
				@change="handleUpdatedFilters(filter.stateKey, $event)"
			>
				<option v-if="!facets[filter.facetsKey]" :value="loanSearchState[filter.stateKey]">
					Loading...
				</option>
				<template v-else>
					<option v-if="!!filter.allOptionsTitle" value="">
						{{ filter.allOptionsTitle }}
					</option>
					<option
						v-for="(item, index) in facets[filter.facetsKey]"
						:key="index"
						:value="item.key || item.name"
					>
						{{ item.title || item.label }}
					</option>
				</template>
			</kv-select>
			<location-selector
				v-if="filter.type === filterUiType.location"
				ref="locationSelector"
				:regions="facets[filter.facetsKey]"
				:total-loans="totalLoans"
				:loading="loading"
				:tracking-category="trackingCategory"
				:countries="loanSearchState[filter.stateKey]"
				@click.native="trackDropdownClick('location')"
				@update-location="handleUpdatedFilters(filter.stateKey, $event)"
				@handle-overlay="handleQuickFiltersOverlay"
			/>
		</div>
	</div>
</template>

<script>
import { filterUiConfigs, filterOptionUtils } from '@kiva/kv-loan-filters';
import LocationSelector from './LocationSelector';
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';

export default {
	name: 'QuickFilters',
	props: {
		loanSearchState: {
			type: Object,
			required: true
		},
		totalLoans: {
			type: Number,
			default: 0
		},
		facets: {
			type: Object,
			default: () => ({})
		},
		loading: {
			type: Boolean,
			default: true
		},
		targetedLoanChannelId: {
			type: String,
			default: null,
		},
		withCategories: {
			type: Boolean,
			default: false
		},
		trackingCategory: {
			type: String,
			required: true,
		},
	},
	components: {
		KvSelect,
		LocationSelector,
	},
	data() {
		return {
			filters: [
				filterUiConfigs.categories({ type: filterOptionUtils.filterUiType.dropdown }),
				filterUiConfigs.genders({ type: filterOptionUtils.filterUiType.dropdown }),
				filterUiConfigs.regions({ type: filterOptionUtils.filterUiType.location }),
				filterUiConfigs.sortOptions({ type: filterOptionUtils.filterUiType.dropdown }),
			],
			filterUiType: filterOptionUtils.filterUiType,
		};
	},
	methods: {
		handleUpdatedFilters(key, value) {
			this.$kvTrackEvent(
				this.trackingCategory,
				'filter',
				'quick-filters-option',
				key,
				value
			);

			console.log('handle', key, value);

			this.$emit('update-filters', { key, value });
		},
		trackDropdownClick(label) {
			this.$kvTrackEvent(
				this.trackingCategory,
				'click',
				'quick-filters-dropdown',
				label
			);
		},
		handleQuickFiltersOverlay(showOverlay) {
			this.$emit('handle-overlay', showOverlay);
		}
	},
	computed: {
		removeGenderDropdown() {
			return this.targetedLoanChannelUrl === 'women';
		},
		removeLocationDropdown() {
			return this.targetedLoanChannelUrl === 'kiva-u-s';
		},
		removeSortByDropdown() {
			return this.targetedLoanChannelUrl === 'ending-soon';
		}
	},
};
</script>
