<template>
	<div
		id="locationWrapper"
		class="tw-relative tw-flex tw-flex-col tw-w-full"
		v-click-outside="closeRegions"
	>
		<div v-if="withCategories">
			<label
				class="tw-text-h4"
				for="location"
			>
				Location
			</label>
			<kv-text-input
				type="text"
				id="location"
				ref="input"
				:model-value="term"
				class="tw-w-full"
				@click="toggleRegions()"
				placeholder="All countries"
				:disabled="!filtersLoaded"
				autocomplete="off"
				readonly
				:icon="mdiChevronDown"
			/>
		</div>
		<div v-else>
			<label
				class="tw-hidden"
				for="location"
			>
				Location
			</label>
			<div
				class="
			tw-flex
			tw-bg-primary
			filter-pill
			tw-justify-center
			tw-w-full
			md:tw-w-auto"
				@click="toggleRegions()"
			>
				<kv-material-icon :icon="mdiMapMarker" class="tw-w-3 tw-h-3" />
				<input
					type="text"
					class="tw-w-full"
					id="location"
					ref="input"
					:value="term"
					placeholder="All countries"
					:disabled="!filtersLoaded"
					readonly
				>
				<kv-material-icon
					class="tw-w-2.5 tw-h-2.5"
					:icon="mdiChevronDown"
				/>
			</div>
		</div>
		<div
			v-show="showRegions"
			class="
				tw-bg-primary
				tw-p-1.5
				tw-border
				tw-border-tertiary
				tw-mt-1
				tw-flex
				tw-transition
				tw-w-full
				tw-rounded-t
				tw-max-h-[85%]

				tw-fixed
				tw-z-popover
				tw-bottom-0
				tw-left-0
				tw-overflow-auto

				md:tw-absolute
				md:tw-mt-9
				md:tw-bottom-auto
				md:tw-top-auto
				md:tw-rounded
				md:tw-max-h-screen
			"
			:class="[ selectedRegion !== null ? 'md:tw-w-full' : 'md:tw-w-auto' ]"
		>
			<div class="tw-w-full md:tw-w-auto">
				<div class="md:tw-hidden tw-flex tw-justify-between tw-items-center tw-mt-1 tw-mb-2">
					<div>
						<h3>Location selector</h3>
					</div>
					<button @click="toggleRegions()">
						<kv-material-icon
							class="tw-w-3 tw-h-3 tw-cursor-pointer"
							:icon="mdiClose"
						/>
					</button>
				</div>
				<ol
					class="tw-whitespace-nowrap md:tw-bg-secondary md:tw-py-2"
					style="margin: -12px;"
				>
					<li
						class="tw-hidden md:tw-block tw-px-4 tw-py-2"
					>
						Regions
					</li>
					<li
						v-for="(region, index) in regions" :key="index"
						class="tw-border-b tw-border-tertiary md:tw-border-b-0 md:tw-pr-2 tw-py-0.5"
						:class="{ 'tw-bg-primary': selectedRegion === index }"
					>
						<button
							@click="selectRegion(index)"
							class="tw-py-0.5 tw-font-medium
								tw-flex tw-items-center tw-justify-between md:tw-justify-start tw-w-full
								tw-text-left tw-uppercase md:tw-capitalize"
						>
							<div class="tw-flex tw-items-center">
								<div class="tw-w-4 tw-text-action tw-text-small tw-text-right tw-mr-.5">
									{{ numberByRegion(region.region) !== 0 ? `(${numberByRegion(region.region)})` :'' }}
								</div>
								{{ region.region }}
							</div>

							<kv-material-icon
								class="tw-w-4 tw-h-4 md:tw-hidden"
								:icon="mdiChevronDown"
							/>
						</button>

						<kv-expandable easing="ease-in-out" class="md:tw-hidden">
							<div v-show="index == selectedRegion">
								<div class="tw-pb-4 tw-pt-2">
									<checkbox-list
										class="tw-pl-3"
										:items="getItems(region.countries)"
										:selected-values="selectedCountries"
										@updated="updateCountries($event)"
										@closeRegions="toggleRegions()"
									/>
								</div>
							</div>
						</kv-expandable>
					</li>
				</ol>
				<div class="tw-flex tw-gap-2 tw-justify-between md:tw-hidden tw-py-4">
					<button @click="selectedCountries = []" class="tw-text-link">
						Reset country selection
					</button>

					<kv-button
						@click="toggleRegions()"
					>
						See {{ totalLoans }} loans
					</kv-button>
				</div>
			</div>
			<div
				v-if="selectedRegion !== null"
				class="tw-w-full tw-hidden md:tw-flex tw-flex-col tw-justify-between tw-ml-1 md:tw-ml-3"
			>
				<checkbox-list
					:items="getItems(activeCountries)"
					:selected-values="selectedCountries"
					@updated="updateCountries($event)"
					@closeRegions="toggleRegions()"
				/>
				<div class="tw-flex tw-gap-2 tw-justify-end">
					<button @click="selectedCountries = []" class="tw-text-link">
						Reset country selection
					</button>

					<kv-button
						@click="handleClickCta"
					>
						See {{ totalLoans }} loans
					</kv-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {
	mdiMagnify, mdiChevronDown, mdiClose, mdiMapMarker
} from '@mdi/js';
import clickOutside from '@/plugins/click-outside';
import { getCheckboxLabel } from '@/util/loanSearch/filterUtils';
import KvExpandable from '@/components/Kv/KvExpandable';
import kvTokensPrimitives from '~/@kiva/kv-tokens/primitives.json';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import CheckboxList from './CheckboxList';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';
import DropdownPill from './DropdownPill';

export default {
	name: 'LocationSelector',
	components: {
		KvTextInput,
		CheckboxList,
		KvButton,
		KvExpandable,
		KvMaterialIcon,
		DropdownPill
	},
	mixins: [
		clickOutside,
	],
	props: {
		regions: {
			type: Array,
			default: () => []
		},
		totalLoans: {
			type: Number,
			default: 0
		},
		filtersLoaded: {
			type: Boolean,
			default: false
		},
		trackingCategory: {
			type: String,
			required: true,
		},
		withCategories: {
			type: Boolean,
			required: true,
		}
	},
	data() {
		return {
			mdiMagnify,
			mdiChevronDown,
			mdiClose,
			mdiMapMarker,
			hasFocus: false,
			selectedRegion: null,
			selectedCountries: [],
			showRegions: false
		};
	},
	methods: {
		handleClickCta() {
			this.toggleRegions();
			this.$kvTrackEvent(
				this.trackingCategory,
				'click',
				'apply-quick-filters',
				'see-loans',
			);
		},
		emptyCountries() {
			this.selectedCountries = [];
		},
		resetCountries() {
			this.emptyCountries();
			this.$kvTrackEvent(
				this.trackingCategory,
				'filter',
				'quick-filters-reset',
				'countries',
			);
		},
		toggleRegions() {
			this.showRegions = !this.showRegions;
			this.selectedRegion = null;
			if (this.showRegions) {
				// Smaller browsers have a static location selector on the bottom of the viewport
				if (document.documentElement.clientWidth < kvTokensPrimitives.breakpoints.md) {
					document.documentElement.style.overflow = 'hidden';
				}
				this.$emit('handle-overlay', true);
			} else {
				document.documentElement.style.overflow = 'auto';
				this.$emit('handle-overlay', false);
			}
		},
		closeRegions() {
			if (this.showRegions) {
				this.showRegions = false;
				this.selectedRegion = null;
				document.documentElement.style.overflow = 'auto';
				this.$emit('handle-overlay', false);
			}
		},
		selectRegion(index) {
			this.selectedRegion = this.selectedRegion === index ? null : index;
		},
		getItems(countries) {
			// Disable checkboxes based on whether the current applied filters have loans fundraising for that country
			return countries.map(c => ({
				value: c.isoCode,
				title: getCheckboxLabel(c),
				disabled: c.numLoansFundraising === 0
			}));
		},
		updateCountries(evt) {
			for (let i = 0; i < evt.changed.length; i += 1) {
				const isoCode = evt.changed[i];
				if (this.selectedCountries.includes(isoCode)) {
					const index = this.selectedCountries.indexOf(isoCode);
					if (index > -1) {
						this.selectedCountries.splice(index, 1);
					}
				} else {
					this.selectedCountries.push(isoCode);
				}
			}
		},
		setCountry(countryIsoCode) {
			this.emptyCountries();
			this.selectedCountries.push(countryIsoCode);
		},
		numberByRegion(region) {
			let total = 0;
			const regionData = this.regions.filter(regionItem => {
				return regionItem.region === region;
			});
			const { countries } = regionData[0];

			for (let i = 0; i < countries.length; i += 1) {
				const country = countries[i];
				if (this.selectedCountries.includes(country.isoCode)) {
					total += 1;
				}
			}

			return total;
		}
	},
	computed: {
		activeCountries() {
			return this.regions[this.selectedRegion]?.countries ?? '';
		},
		term() {
			if (this.selectedCountries.length > 0) {
				return this.selectedCountries.length === 1 ? '1 country' : `${this.selectedCountries.length} countries`; // eslint-disable-line max-len
			}
			return 'All countries';
		}
	},
	watch: {
		selectedCountries() {
			this.$emit('update-location', [...this.selectedCountries]);
		}
	}

};
</script>

<style scoped>

#locationWrapper >>> input {
	padding-left: 16px;
}

#locationWrapper >>> input::placeholder {
	color: black;
}

#locationWrapper >>> span {
	left: auto;
	right: 8px;
}

.filter-pill {
	border-radius: 16px;
	padding: 10px 20px;
	font-weight: bold;
	box-shadow: 0px 4px 15px 0px #0000000D;
	transition: all .2s ease-in;
}

.filter-pill input {
	transition: all .2s ease-in;
	background-color: #FFF;
	color: #000;
	min-width: 135px;
}

.filter-pill:hover input,
.filter-pill.hover input,
.filter-pill:hover {
	cursor: pointer;
	background-color: #000;
	color: #FFF;
}

</style>
