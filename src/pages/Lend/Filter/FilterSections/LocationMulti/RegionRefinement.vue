<template>
	<div class="region-refinement">
		<ais-refinement-list
			:attribute="'locationFacets.lvl0'"
			:sort-by="['name:asc']"
			:limit="1000"
			:transform-items="transformItems"
		>
			<div
				slot-scope="{
					items,
					refine,
				}"
			>
				<region-refinement-checkbox
					ref="regionRefinementCheckbox"
					:region="region"
					:items="items"
					:refine="refine"

					:is-checked="isChecked"
					@checkbox-input="handleRegionCheckboxInput"
				/>
			</div>
		</ais-refinement-list>
	</div>
</template>

<script>
import RegionRefinementCheckbox from '@/pages/Lend/Filter/FilterSections/LocationMulti/RegionRefinementCheckbox';
import { AisRefinementList } from 'vue-instantsearch';

export default {
	props: {
		region: {
			type: String,
			required: true,
		},
		isChecked: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		RegionRefinementCheckbox,
		AisRefinementList,
	},
	methods: {
		handleRegionCheckboxInput() {
			this.$emit('checkbox-input');
		},
		toggleRefinement() {
			this.$refs.regionRefinementCheckbox.toggleRefinement();
		},
		transformItems(items) {
			const newItems = [];
			let regionSelected = false;
			items.forEach(item => {
				if (item.label === this.region) {
					if (item.isRefined) {
						regionSelected = true;
					}
					newItems.push(item);
				}
			});
			this.$emit('region-selected', regionSelected);
			return newItems;
		},
	},
};
</script>
