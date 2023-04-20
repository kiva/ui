<template>
	<div class="tw-flex tw-flex-col tw-mb-2 tw-w-full">
		<div v-if="!withCategories && !enableFilterPills" class="tw-flex tw-items-center tw-mb-2">
			<div class="tw-flex tw-items-center">
				<h3 class="tw-text-h3">
					Quick filters
				</h3>
				<span v-show="filtersLoaded" class="tw-ml-2 tw-text-small">Showing {{ totalLoans }} loans</span>
				<button
					v-show="filtersLoaded && !hideReset"
					class="tw-ml-2 tw-text-small tw-text-action" @click="resetFilters"
				>
					Reset filters
				</button>
			</div>
		</div>
		<div
			class="tw-flex"
			:class="{
				'tw-px-1 lg:tw-pr-0 tw-justify-start md:tw-gap-1 tw-flex-wrap lg:tw-flex-nowrap': enableFilterPills,
				'tw-gap-2 tw-flex-col lg:tw-flex-row tw-w-full': !enableFilterPills
			}"
		>
			<div v-if="withCategories" class="tw-flex tw-flex-col tw-grow">
				<label
					class="tw-text-h4"
					for="category"
				>
					Category
				</label>
				<kv-select
					:disabled="!filtersLoaded"
					v-model="selectedCategory"
					id="category"
					style="min-width: 160px;"
				>
					<option
						v-for="category in filterOptions.categories"
						:key="category.key"
						:value="category.key"
					>
						{{ category.title }}
					</option>
				</kv-select>
			</div>
			<div v-if="!removeGenderDropdown && enableFilterPills" class="tw-flex tw-gap-1 tw-overflow-x-auto tw-pb-1">
				<filter-pills
					:filters-loaded="filtersLoaded"
					:options="filterOptions.gender"
					:selected-values="selectedGenders"
					@update-values="updateGenders($event)"
				/>
				<div v-if="!filtersLoaded" class="tw-flex tw-gap-1 placeholder">
					<kv-loading-placeholder
						style="width: 100px;"
						v-for="(index) in 3"
						:key="index"
					/>
				</div>
			</div>

			<div v-if="!removeGenderDropdown && !enableFilterPills" class="tw-flex tw-flex-col tw-grow">
				<label
					class="tw-text-h4"
					for="gender"
				>
					Gender
				</label>
				<kv-select
					:disabled="!filtersLoaded"
					v-model="selectedGender"
					id="gender"
					style="min-width: 140px;"
					@click.native="trackDropdownClick('gender')"
				>
					<option
						v-for="gender in filterOptions.gender"
						:key="gender.key"
						:value="gender.key"
					>
						{{ gender.title }}
					</option>
				</kv-select>
			</div>

			<div
				:class="{
					'tw-flex tw-gap-1 overflow-container': enableFilterPills,
					'tw-w-full': !enableFilterPills}"
			>
				<location-selector
					v-if="!removeLocationDropdown"
					@click.native="trackDropdownClick('location')"
					@handle-overlay="handleQuickFiltersOverlay"
					:regions="filterOptions.location"
					:total-loans="totalLoans"
					:filters-loaded="filtersLoaded"
					@update-location="updateLocation"
					ref="locationSelector"
					:tracking-category="trackingCategory"
					:with-categories="withCategories"
					:enable-filter-pills="enableFilterPills"
				/>

				<div
					v-if="!removeSortByDropdown && enableFilterPills"
					class="tw-pb-1 tw-shrink-0"
					:class="{ 'tw-opacity-low': !filtersLoaded }"
					@click="trackDropdownClick('sort')"
				>
					<label
						class="tw-hidden"
						for="sortBy"
					>
						Sort By
					</label>
					<div
						class="
							pill-container
							tw-rounded
							tw-transition
							tw-bg-white
							tw-h-full
							md:tw-w-auto
							tw-relative
							tw-pointer-events-none
						"
					>
						<kv-material-icon
							:icon="mdiSort"
							class="tw-w-3 tw-h-3 tw-mr-1 tw-absolute tw-pointer-events-auto"
							style="left: 20px; top: 50%; transform: translateY(-50%);"
						/>
						<select
							id="sortBy"
							class="
								tw-bg-transparent
								tw-font-medium
								tw-transition
								tw-rounded
								filter-pill
								tw-w-full
								tw-h-full
								tw-pointer-events-auto
								tw-cursor-pointer
							"
							:disabled="!filtersLoaded"
							v-model="sortBy"
						>
							<option
								v-for="sortType in filterOptions.sorting"
								:key="sortType.key"
								:value="sortType.key"
							>
								{{ sortType.title }}
							</option>
						</select>
					</div>
				</div>
			</div>
			<div
				v-if="!removeSortByDropdown && !enableFilterPills && !withCategories"
				class="tw-flex tw-flex-col tw-grow"
			>
				<label
					class="tw-text-h4"
					for="sortBy"
				>
					Sort By
				</label>
				<kv-select
					id="sortBy"
					:disabled="!filtersLoaded"
					v-model="sortBy"
					style="min-width: 180px;"
					@click.native="trackDropdownClick('sort')"
				>
					<option
						v-for="sortType in filterOptions.sorting"
						:key="sortType.key"
						:value="sortType.key"
					>
						{{ sortType.title }}
					</option>
				</kv-select>
			</div>
		</div>
		<div class="tw-flex tw-justify-between tw-items-start tw-mt-2" v-if="withCategories">
			<div id="customizedSortBySelector" class="tw-text-action tw-flex tw-items-center tw-gap-1">
				<kv-material-icon :icon="mdiFilterVariant" class="tw-w-2 tw-h-2 tw-hidden md:tw-inline" />
				<div class="md:tw-inline tw-hidden">
					Loan sort:
				</div>
				<div class="md:tw-hidden tw-inline">
					Sort:
				</div>
				<kv-select
					id="sortBy"
					:disabled="!filtersLoaded"
					v-model="sortBy"
					@click.native="trackDropdownClick('sort')"
				>
					<option
						v-for="sortType in filterOptions.sorting"
						:key="sortType.key"
						:value="sortType.key"
					>
						{{ sortType.title }}
					</option>
				</kv-select>
			</div>
			<div class="tw-flex md:tw-flex-row tw-items-start">
				<span v-show="filtersLoaded" class="tw-text-base">
					<span class="md:tw-inline tw-hidden">Showing</span> {{ totalLoans }} loans
				</span>
				<!-- eslint-disable-next-line max-len -->
				<button v-show="filtersLoaded && !hideReset" class="tw-ml-2 tw-text-base tw-text-action" @click="resetFilters">
					<span>Reset</span><span class="md:tw-inline tw-hidden"> filters</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { mdiFilterVariant, mdiSort, mdiChevronDown } from '@mdi/js';
import loanChannelQueryMapMixin from '@/plugins/loan-channel-query-map';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import LocationSelector from './LocationSelector';
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';
import FilterPills from './FilterPills';

export default {
	name: 'QuickFilters',
	inject: ['cookieStore'],
	props: {
		totalLoans: {
			type: Number,
			default: 0
		},
		filterOptions: {
			type: Object,
			default: () => ({})
		},
		filtersLoaded: {
			type: Boolean,
			default: false
		},
		targetedLoanChannelUrl: {
			type: String,
			required: true
		},
		withCategories: {
			type: Boolean,
			default: false
		},
		trackingCategory: {
			type: String,
			required: true,
		},
		defaultSort: {
			type: String,
			default: 'personalized',
		},
		enableFilterPills: {
			type: Boolean,
			default: false
		},
	},
	components: {
		KvSelect,
		LocationSelector,
		KvMaterialIcon,
		FilterPills,
		KvLoadingPlaceholder,
	},
	data() {
		return {
			mdiFilterVariant,
			mdiSort,
			mdiChevronDown,
			selectedCategory: 0,
			selectedGender: 'all',
			selectedGenders: ['all'],
			sortBy: this.defaultSort,
			presetFilterActive: {
				women: false,
				kivaUs: false,
				endingSoon: false,
			},
		};
	},
	mixins: [
		loanChannelQueryMapMixin
	],
	watch: {
		selectedCategory(categoryId) {
			const catId = Number(categoryId);
			const queryMap = loanChannelQueryMapMixin.data().loanChannelQueryMap;
			const categoryFilter = catId === 0 ? {} : queryMap
				.find(channel => channel.id === catId)?.flssLoanSearch;
			if (this.presetFilterActive.women) {
				this.resetGender();
				this.presetFilterActive.women = false;
			} else if (this.presetFilterActive.kivaUs) {
				this.resetLocation();
				this.presetFilterActive.kivaUs = false;
			} else if (this.presetFilterActive.endingSoon) {
				this.resetSortBy();
				this.presetFilterActive.endingSoon = false;
			}

			// These categories use location/gender/sort by for FLSS and need
			// to have dropdowns preset
			if (catId === 5) { // women
				this.selectedGender = 'female';
				this.presetFilterActive.women = true;
			} else if (catId === 28) { // kiva-u-s
				this.setCountry('US');
				this.presetFilterActive.kivaUs = true;
			} else if (catId === 3) { // ending-soon
				this.sortBy = 'expiringSoon';
				this.presetFilterActive.endingSoon = true;
			} else {
				if (catId === 33 || catId === 96) { // mission-driven-orgs, covid-19
					// we don't currently have this option for these categories, also irrelevant since
					// the user has a sort by dropdown available to them
					delete categoryFilter.sortBy;
				}
				this.$emit('update-filters', categoryFilter);
			}

			this.$kvTrackEvent(
				this.trackingCategory,
				'filter',
				'quick-filters-option',
				categoryId === 0 ? 'All categories' : categoryId
			);
		},
		selectedGender(gender) {
			if (this.presetFilterActive.women && gender !== 'female') {
				this.resetCategory();
				this.presetFilterActive.women = false;
			}
			this.$emit('update-filters', { gender: gender === 'all' ? '' : gender });
			this.$kvTrackEvent(
				this.trackingCategory,
				'filter',
				'quick-filters-option',
				gender === 'all' ? 'all genders' : gender
			);
		},
		selectedGenders(genders) {
			this.$emit('update-filters', { gender: genders.includes('all') ? '' : genders });
		},
		sortBy(sortBy) {
			if (this.presetFilterActive.endingSoon && sortBy !== 'expiringSoon') {
				this.resetCategory();
				this.presetFilterActive.endingSoon = false;
			}
			this.$emit('update-filters', { sortBy });
			this.$kvTrackEvent(
				this.trackingCategory,
				'click',
				'quick-filters-option',
				sortBy
			);
		}
	},
	methods: {
		resetCategory() {
			this.selectedCategory = 0;
		},
		resetGender() {
			this.selectedGender = 'all';
			this.selectedGenders = ['all'];
		},
		resetLocation() {
			this.updateLocation([]);
			this.$refs.locationSelector.emptyCountries();
		},
		resetSortBy() {
			this.sortBy = this.defaultSort;
		},
		setCountry(country) {
			this.$refs.locationSelector.setCountry(country);
		},
		updateLocation(location) {
			if (this.presetFilterActive.kivaUs && JSON.stringify(location) !== '["US"]') {
				this.resetCategory();
				this.presetFilterActive.kivaUs = false;
			}
			this.$emit('update-filters', { country: location });
			this.$kvTrackEvent(
				this.trackingCategory,
				'filter',
				'quick-filters-option',
				location
			);
		},
		updateGenders({ values }) { // values: ['all'] | ['female'] | ['male', 'nonbinary']...
			this.selectedGenders = values;
			this.$kvTrackEvent(
				this.trackingCategory,
				'filter',
				'quick-filters-option',
				this.selectedGenders
			);
		},
		resetFilters() {
			this.$emit('reset-filters');
			this.selectedCategory = 0;
			this.selectedGender = '';
			this.selectedGenders = ['all'];
			this.sortBy = this.defaultSort;
			this.updateLocation([]);
			this.$refs.locationSelector?.emptyCountries();
			this.$kvTrackEvent(
				this.trackingCategory,
				'click',
				'quick-filters-reset',
				'all'
			);
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
		hideReset() {
			return this.selectedCategory === 0
			&& this.selectedGender === 'all'
			&& this.selectedGenders === ['all']
			&& this.sortBy === this.defaultSort
			&& !(this.$refs.locationSelector?.selectedCountries?.length ?? 0);
		},
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

<style lang="postcss" scoped>
	.placeholder > div {
		@apply tw-rounded !important;
	}

	.placeholder {
		display: none;
	}

	@media screen and (min-width: 600px) {
		.placeholder {
			display: flex;
		}
	}

	.overflow-container {
		overflow-x: auto;
	}

	@media screen and (min-width: 734px) {
		.overflow-container {
			overflow-x: visible;
		}
	}

	.pill-container:hover {
		@apply tw-text-white tw-bg-black;
	}

	.filter-pill {
		padding: 10px 0 10px 50px;
		box-shadow: 0 calc(4px) calc(15px) 0 rgba(0, 0, 0, 0.05);
		min-width: 160px;
		border-right: 20px transparent solid;
		@apply focus:tw-outline-none focus:tw-border-transparent;
	}

	#customizedSortBySelector >>> select {
		border-style: none;
		padding: 0 0 0 4px;
		width: auto;
		font-size: 1rem;
		text-decoration: underline;
		cursor: pointer;
		height: auto;
		background: transparent;
		@apply focus:tw-ring-0 focus:tw-ring-offset-0;
	}

	#customizedSortBySelector >>> span:nth-child(2) {
		display: none;
	}
</style>
