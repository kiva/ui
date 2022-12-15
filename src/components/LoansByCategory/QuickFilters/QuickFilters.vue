<template>
	<div class="tw-flex tw-flex-col tw-mb-2 tw-w-full">
		<div class="tw-flex tw-items-center tw-mb-2 tw-relative">
			<div
				v-show="showBadge"
				class="tw-hidden lg:tw-flex tw-gap-1 tw-text-base tw-text-primary-inverse
					tw-rounded tw-bg-brand tw-px-1.5 tw-py-0.5
					tw-absolute"
				style="left: -102px;"
			>
				<img src="@/assets/images/green_sparkles.svg" alt=""> New!
			</div>
			<div v-if="!withCategories" class="tw-flex tw-items-center">
				<h3 class="tw-text-h3">
					Quick filters
				</h3>
				<span v-show="filtersLoaded" class="tw-ml-2 tw-text-small">Showing {{ totalLoans }} loans</span>
				<button v-show="filtersLoaded" class="tw-ml-2 tw-text-small tw-text-action" @click="resetFilters">
					Reset filters
				</button>
			</div>
		</div>
		<div
			class="tw-flex tw-flex-col lg:tw-flex-row tw-gap-2 tw-w-full"
			:class="{'tw-pr-2 lg:tw-pr-0' : !withCategories}"
		>
			<div class="tw-flex tw-gap-2 tw-w-full lg:tw-w-auto">
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
				<div v-if="!removeGenderDropdown" class="tw-flex tw-flex-col tw-grow">
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
			</div>

			<location-selector
				v-if="!removeLocationDropdown"
				@click.native="trackDropdownClick('location')"
				@handle-overlay="handleQuickFiltersOverlay"
				:regions="filterOptions.location"
				:total-loans="totalLoans"
				:filters-loaded="filtersLoaded"
				@update-location="updateLocation"
				ref="locationSelector"
			/>

			<div v-if="!removeSortByDropdown && !withCategories" class="tw-flex tw-flex-col tw-grow">
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
			<div class="tw-flex tw-flex-col md:tw-flex-row tw-items-start">
				<span v-show="filtersLoaded" class="tw-text-small">Showing {{ totalLoans }} loans</span>
				<!-- eslint-disable-next-line max-len -->
				<button v-show="filtersLoaded" class="md:tw-ml-2 tw-mt-1 md:tw-mt-0 tw-text-small tw-text-action" @click="resetFilters">
					Reset filters
				</button>
			</div>
			<div id="customizedSortBySelector" class="tw-text-action tw-flex tw-items-center tw-gap-1 tw-text-small">
				<kv-material-icon :icon="mdiFilterVariant" class="tw-w-2 tw-h-2" />
				Loan sort:
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
		</div>
	</div>
</template>

<script>
import { mdiFilterVariant } from '@mdi/js';
import loanChannelQueryMapMixin from '@/plugins/loan-channel-query-map';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import LocationSelector from './LocationSelector';
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';

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
			default: () => {}
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
	},
	components: {
		KvSelect,
		LocationSelector,
		KvMaterialIcon
	},
	data() {
		return {
			mdiFilterVariant,
			selectedCategory: 0,
			selectedGender: '',
			sortBy: 'amountLeft',
			showBadge: false,
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
				this.$emit('update-filters', categoryFilter);
			}
		},
		selectedGender(gender) {
			this.$emit('update-filters', { gender });
			this.$kvTrackEvent(
				'search',
				'filter',
				'quick-filters-option',
				gender === '' ? 'all genders' : gender
			);
		},
		sortBy(sortBy) {
			this.$emit('update-filters', { sortBy });
			this.$kvTrackEvent(
				'search',
				'click',
				'quick-filters-option',
				sortBy
			);
		}
	},
	methods: {
		resetGender() {
			this.selectedGender = '';
		},
		resetLocation() {
			this.updateLocation([]);
			this.$refs.locationSelector.emptyCountries();
		},
		resetSortBy() {
			this.sortBy = 'amountLeft';
		},
		setCountry(country) {
			this.$refs.locationSelector.setCountry(country);
		},
		updateLocation(location) {
			this.$emit('update-filters', { country: location });
			this.$kvTrackEvent(
				'search',
				'filter',
				'quick-filters-option',
				location
			);
		},
		resetFilters() {
			this.$emit('reset-filters');
			this.selectedGender = '';
			this.sortBy = 'almostFunded';
			this.updateLocation([]);
			this.$refs.locationSelector.emptyCountries();
			this.$kvTrackEvent(
				'search',
				'click',
				'quick-filters-reset',
				'all'
			);
		},
		trackDropdownClick(label) {
			this.$kvTrackEvent(
				'search',
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
	mounted() {
		const badgeCookie = this.cookieStore.get('quick_filter_new_badge') === 'true' || false;
		if (!badgeCookie && this.withCategories) {
			this.showBadge = true;
			this.cookieStore.set('quick_filter_new_badge', true);
		}
	}
};
</script>

<style lang="postcss" scoped>

	#customizedSortBySelector >>> select {
		border-style: none;
		padding: 0 0 0 4px;
		width: auto;
		font-size: 0.875rem;
		cursor: pointer;
		height: auto;
		background: transparent;
		@apply focus:tw-ring-0 focus:tw-ring-offset-0;
	}

	#customizedSortBySelector >>> span:nth-child(2) {
		display: none;
	}

</style>
