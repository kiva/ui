<template>
	<div class="country-refinements">
		<ais-refinement-list
			:attribute="'locationFacets.lvl1'"
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
				<country-refinements-checkboxes
					ref="countryRefinementsCheckboxes"
					:items="items"
					:refine="refine"
				/>
			</div>
		</ais-refinement-list>
	</div>
</template>

<script>
// eslint-disable-next-line max-len
import CountryRefinementsCheckboxes from '@/pages/Lend/Filter/FilterSections/LocationMulti/CountryRefinementsCheckboxes';
import { AisRefinementList } from 'vue-instantsearch';

export default {
	props: {
		region: {
			type: String,
			required: true,
		},
	},
	components: {
		CountryRefinementsCheckboxes,
		AisRefinementList,
	},
	methods: {
		removeRefinements() {
			this.$refs.countryRefinementsCheckboxes.removeRefinements();
		},
		transformItems(items) {
			const newItems = [];
			let countryFromRegionSelected = false;
			items.forEach(item => {
				if (item.label.includes(this.region)) {
					if (item.isRefined) {
						countryFromRegionSelected = true;
					}
					newItems.push({
						...item,
						label: item.label.slice(item.label.indexOf('>') + 2),
					});
				}
			});
			this.$emit('country-from-region-selected', countryFromRegionSelected);
			return newItems;
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

.country-refinements {
	margin-left: 1.5rem;
}
</style>
