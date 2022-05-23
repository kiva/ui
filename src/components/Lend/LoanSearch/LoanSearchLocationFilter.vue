<template>
	<form class="tw-flex tw-flex-col tw-gap-1.5 tw-mb-2" @submit.prevent>
		<fieldset v-for="option in regions" :key="option.region">
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
					{{ getLabel(option) }}
				</button>
			</legend>
			<kv-checkbox-list
				v-if="isOpenRegion(option.region)"
				:show-select-all="true"
				:items="getItems(option.countries)"
				:initial-selected="selectedCountries[option.region]"
				class="tw-pl-3"
				@updated="updateRegion(option.region, $event)"
			/>
		</fieldset>
	</form>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvCheckboxList from '@/components/Kv/KvCheckboxList';
import { getIsoCodes } from '@/util/loanSearchUtils';

/**
 * Returns the item label with fundraising amount in parens
 *
 * @param {Object} item The region/country item for generating the label
 * @returns {string} The item label
 */
export const getLabel = item => `${item.region || item.name} (${item.numLoansFundraising})`;

export default {
	components: {
		KvIcon,
		KvCheckboxList,
	},
	props: {
		/**
		 * The regions with countries used to build the checkbox lists. Pass FLSS country facets through
		 * loanSearchUtils.transformCountryFacets in parent component. Expected format:
		 *   {
		 *     region: 'region',
		 *     numLoansFundraising: 1,
		 *     countries: [{
		 *       name: 'name',
		 *       isoCode: 'US',
		 *       numLoansFundraising: 1
		 *     }]
		 *   }
		 */
		regions: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			selectedCountries: {},
			openRegions: [],
			getLabel
		};
	},
	methods: {
		getItems(countries) {
			return countries.map(c => ({ value: c.name, title: getLabel(c) }));
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
		updateRegion(region, countries) {
			this.$set(this.selectedCountries, region, countries);
		},
	},
	watch: {
		selectedCountries: {
			handler(nextCountries) {
				this.$emit('updated', { countryIsoCode: getIsoCodes(this.regions, nextCountries) });
			},
			deep: true,
		}
	},
};
</script>
