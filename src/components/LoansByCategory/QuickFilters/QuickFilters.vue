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
			<h3 class="tw-text-h3">
				Quick filters
			</h3>
			<span v-show="filtersLoaded" class="tw-ml-2 tw-text-small">Showing {{ totalLoans }} loans</span>
			<button v-show="filtersLoaded" class="tw-ml-2 tw-text-small tw-text-action" @click="resetFilters">
				Reset filters
			</button>
		</div>
		<div class="tw-flex tw-flex-col lg:tw-flex-row tw-gap-2 tw-w-full tw-pr-2 lg:tw-pr-0">
			<div class="tw-flex tw-flex-col tw-order-2 lg:tw-order-1">
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

			<location-selector
				@click.native="trackDropdownClick('location')"
				class="tw-order-1 lg:tw-order-2"
				:regions="filterOptions.location"
				:total-loans="totalLoans"
				:filters-loaded="filtersLoaded"
				:update-location="updateLocation"
			/>

			<div class="tw-flex tw-flex-col tw-order-3">
				<label
					class="tw-text-h4"
					for="gender"
				>
					Sort By
				</label>
				<kv-select
					:disabled="!filtersLoaded"
					v-model="sortBy" id="sortBy"
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
	</div>
</template>

<script>
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
		updateFilters: {
			type: Function,
			required: true
		}
	},
	components: {
		KvSelect,
		LocationSelector
	},
	data() {
		return {
			selectedGender: '',
			sortBy: 'personalized',
			showBadge: false
		};
	},
	mounted() {
		const badgeCookie = this.cookieStore.get('quick_filter_new_badge') === 'true' || false;
		if (!badgeCookie) {
			this.showBadge = true;
			this.cookieStore.set('quick_filter_new_badge', true);
		}
	},
	watch: {
		selectedGender(gender) {
			this.updateFilters({ gender });
			this.$kvTrackEvent(
				'search',
				'filter',
				'quick-filters-option',
				gender === '' ? 'all genders' : gender
			);
		},
		sortBy(sortBy) {
			this.updateFilters({ sortBy });
			this.$kvTrackEvent(
				'search',
				'click',
				'quick-filters-option',
				sortBy
			);
		}
	},
	methods: {
		updateLocation(location) {
			this.updateFilters({ country: location });
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
			this.sortBy = 'personalized';
			this.updateLocation([]);
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
		}
	}
};
</script>
