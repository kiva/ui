<template>
	<div class="location-multi-wrapper">
		<region-refinement
			ref="regionRefinement"
			:region="region"

			:is-checked="regionAppearsChecked"
			@region-selected="handleRegionSelected"
			@checkbox-input="handleRegionCheckboxInput"
		/>
		<country-refinements
			v-show="regionAppearsChecked"
			ref="countryRefinements"
			:region="region"
			@country-from-region-selected="handleCountryFromRegionSelected"
		/>
	</div>
</template>

<script>
import RegionRefinement from '@/pages/Lend/Filter/FilterSections/LocationMulti/RegionRefinement';
import CountryRefinements from '@/pages/Lend/Filter/FilterSections/LocationMulti/CountryRefinements';

export default {
	components: {
		RegionRefinement,
		CountryRefinements,
	},
	data() {
		return {
			regionCount: 0,
			regionSelected: false,
			countryFromRegionSelected: false,
		};
	},
	props: {
		region: {
			type: String,
			required: true,
		},
	},
	computed: {
		regionAppearsChecked() {
			return this.regionSelected || this.countryFromRegionSelected;
		},
	},
	methods: {
		handleRegionCheckboxInput() {
			if (this.countryFromRegionSelected && this.regionSelected) {
				this.$refs.countryRefinements.removeRefinements();
				this.$refs.regionRefinement.toggleRefinement();
			} else if (this.countryFromRegionSelected && !this.regionSelected) {
				this.$refs.countryRefinements.removeRefinements();
			} else {
				/*
				Covers:
				- !this.countryFromRegionSelected && this.regionSelected
				- !this.countryFromRegionSelected && !this.regionSelected or !this.regionAppearsChecked
				*/
				this.$refs.regionRefinement.toggleRefinement();
			}
		},
		handleCountryFromRegionSelected(countryFromRegionSelected) {
			this.countryFromRegionSelected = countryFromRegionSelected;
		},
		handleRegionSelected(regionSelected) {
			this.regionSelected = regionSelected;
		},
	},
};
</script>
