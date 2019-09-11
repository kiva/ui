<template>
	<filter-menu-section title="Location" :initial-accordian-state-open="initialAccordianStateOpen">
		<find-new-country :attribute="'locationFacets.lvl1'" />
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
import _find from 'lodash/find';
import _sortBy from 'lodash/sortBy';
import { AisRefinementList } from 'vue-instantsearch';
import FilterMenuSection from '@/pages/Lend/Filter/FilterComponents/FilterMenuSection';
import LocationMultiRefinements from './LocationMultiRefinements';
import FindNewCountry from './FindNewCountry';

export default {
	components: {
		FilterMenuSection,
		FindNewCountry,
		LocationMultiRefinements,
		AisRefinementList,
	},
	props: {
		allLocationsLvl1: {
			type: Array,
			default: () => []
		},
		initialAccordianStateOpen: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		transformItems(items) {
			// new container for location items
			let sourceItems = [];
			if (this.allLocationsLvl1.length > 0) {
				// if we have source data, use for location item foundation
				sourceItems = this.mergeLocationData(items);
			} else {
				// otherwise just use filtered location data
				sourceItems = items;
			}
			const newItems = [];
			const computedRegionList = {};
			sourceItems.forEach(item => {
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
		mergeLocationData(filteredLocations) {
			// sort our full facet query to match what sort set in algolia component above
			const originalItems = _sortBy(this.allLocationsLvl1, [loc => { return loc.value; }]);
			// new array to hold our merged items
			const patchedItems = [];
			originalItems.forEach(ol => {
				// check filtered result items for matches
				const matchedLocation = _find(filteredLocations, item => {
					return item.value === ol.value;
				});
				if (matchedLocation !== undefined) {
					// push matched/active item data
					patchedItems.push(matchedLocation);
				} else {
					// push stub item data
					patchedItems.push(ol);
				}
			});
			return patchedItems;
		}
	},
};
</script>
