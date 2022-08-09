<template>
	<form class="tw-flex tw-flex-col tw-gap-1.5 tw-mb-2" @submit.prevent>
		<fieldset v-for="option in displayedRegions" :key="option.region">
			<legend>
				<button
					class="tw-transition-all"
					:class="{ 'tw-mb-1': isOpenRegion(option.region) }"
					@click="toggleRegion(option.region)"
				>
					<kv-icon
						name="fat-chevron"
						:from-sprite="true"
						class="tw-h-1.5 tw-w-1.5 tw-mr-1 tw-transition-all"
						:class="{ 'tw--rotate-90': !isOpenRegion(option.region) }"
					/>
					{{ getCheckboxLabel(option) }}
				</button>
			</legend>
			<kv-checkbox-list
				v-if="isOpenRegion(option.region)"
				:show-select-all="true"
				:items="getItems(option.countries)"
				:selected-values="selectedCountries[option.region]"
				class="tw-pl-3"
				@updated="updateRegion(option.region, $event)"
			/>
		</fieldset>
	</form>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvCheckboxList from '@/components/Kv/KvCheckboxList';
import { getUpdatedRegions, getCheckboxLabel } from '@/util/loanSearch/filterUtils';
import { getIsoCodes, mapIsoCodesToCountryNames } from '@/util/loanSearch/countryUtils';

export default {
	name: 'LoanSearchLocationFilter',
	components: {
		KvIcon,
		KvCheckboxList,
	},
	props: {
		/**
		 * The regions with countries used to build the checkbox lists. Expected format:
		 * [{
		 *   region: 'region',
		 *   numLoansFundraising: 1,
		 *   countries: [{
		 *     name: 'name',
		 *     isoCode: 'US',
		 *     numLoansFundraising: 1,
		 *   }]
		 * }]
		 */
		regions: {
			type: Array,
			default: undefined
		},
		activeIsoCodes: {
			type: Array,
			default: undefined
		},
	},
	data() {
		return {
			displayedRegions: this.regions,
			selectedCountries: mapIsoCodesToCountryNames(this.activeIsoCodes, this.regions),
			openRegions: [],
			getCheckboxLabel
		};
	},
	methods: {
		getItems(countries) {
			// Disable checkboxes based on whether the current applied filters have loans fundraising for that country
			return countries.map(c => ({
				value: c.name,
				title: getCheckboxLabel(c),
				disabled: c.numLoansFundraising === 0
			}));
		},
		isOpenRegion(region) {
			return this.openRegions.includes(region);
		},
		toggleRegion(region) {
			const existingIndex = this.openRegions.indexOf(region);
			if (existingIndex === -1) {
				this.openRegions.push(region);
			} else {
				this.openRegions.splice(existingIndex, 1);
			}
		},
		updateRegion(region, { values, changed, wasSelectAll }) {
			this.$set(this.selectedCountries, region, values);

			this.$emit('updated', { countryIsoCode: getIsoCodes(this.displayedRegions, this.selectedCountries) });

			let appliedState = '';

			if (wasSelectAll) {
				appliedState = values.length ? 'select-all' : 'deselect-all';
			} else {
				appliedState = values.includes(changed) ? 'selected' : 'deselected';
			}

			this.$kvTrackEvent?.(
				'Lending',
				'click-location-filter',
				wasSelectAll ? `Region: ${region}` : `Country: ${changed}`,
				appliedState
			);
		},
		updateSelectedCountries(next) {
			if (!this.activeIsoCodes || !this.regions) return;

			const nextISO = [...(next || this.activeIsoCodes)];
			const prevISO = getIsoCodes(this.displayedRegions, this.selectedCountries);

			if (nextISO.sort().toString() !== prevISO.sort().toString()) {
				this.selectedCountries = mapIsoCodesToCountryNames(this.activeIsoCodes, this.regions);
			}
		},
	},
	watch: {
		regions(next) {
			this.displayedRegions = getUpdatedRegions(this.displayedRegions, next);

			this.updateSelectedCountries();
		},
		activeIsoCodes(next) {
			this.updateSelectedCountries(next);
		},
	},
};
</script>
