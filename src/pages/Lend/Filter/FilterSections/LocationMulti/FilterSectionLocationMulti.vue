<template>
	<filter-menu-section title="Location">
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
				<location-multi-refinements
					:items="items"
					:refine="refine"
				/>
			</div>
		</ais-refinement-list>
	</filter-menu-section>
</template>

<script>
import _forEach from 'lodash/forEach';
import FilterMenuSection from '@/pages/Lend/Filter/FilterComponents/FilterMenuSection';
import LocationMultiRefinements from '@/pages/Lend/Filter/FilterSections/LocationMulti/LocationMultiRefinements';
import { AisRefinementList } from 'vue-instantsearch';

export default {
	components: {
		FilterMenuSection,
		LocationMultiRefinements,
		AisRefinementList,
	},
	methods: {
		transformItems(items) {
			const newItems = [];
			const computedRegionList = {};
			items.forEach(item => {
				const region = item.label.substring(0, item.label.indexOf(' >'));
				const newItem = {
					...item,
					label: item.label.slice(item.label.indexOf('>') + 2),
					region,
				};

				if (!computedRegionList[region]) {
					computedRegionList[region] = {
						label: region,
						countries: [],
						region,
						isRegion: true,
					};
					newItems.push(computedRegionList[region]);
				}
				computedRegionList[region].countries.push(newItem);

				newItems.push(newItem);
			});

			/* eslint-disable no-param-reassign */
			_forEach(computedRegionList, (regionData, region) => {
				regionData.count = computedRegionList[region].countries
					.reduce((accumulator, { count }) => accumulator + count, 0);

				const refinedCountriesCount = regionData.countries
					.reduce((accumulator, { isRefined }) => accumulator + isRefined, 0);
				const allCountriesCount = computedRegionList[region].countries.length;
				regionData.allCountriesSelected = refinedCountriesCount === allCountriesCount;
			});
			/* eslint-enable no-param-reassign */

			return newItems;
		},
	},
};
</script>
