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
			<span v-show="filtersLoaded" class="tw-ml-2 tw-text-small">Reset filters</span>
		</div>
		<div class="tw-flex tw-flex-col lg:tw-flex-row tw-gap-2 tw-w-full tw-pr-2 lg:tw-pr-0">
			<div class="tw-flex tw-flex-col tw-order-2 lg:tw-order-1">
				<label
					class="tw-text-h4"
					for="gender"
				>
					Gender
				</label>
				<kv-select :disabled="!filtersLoaded" v-model="selectedGender" id="gender" style="min-width: 140px;">
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
				class="tw-order-1 lg:tw-order-2"
				:regions="filterOptions.location"
				:total-loans="totalLoans"
				:filters-loaded="filtersLoaded"
			/>
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
		}
	},
	components: {
		KvSelect,
		LocationSelector
	},
	data() {
		return {
			selectedGender: '',
			showBadge: false
		};
	},
	mounted() {
		const badgeCookie = this.cookieStore.get('quick_filter_new_badge') === 'true' || false;
		if (!badgeCookie) {
			this.showBadge = true;
			this.cookieStore.set('quick_filter_new_badge', true);
		}
	}
};
</script>
