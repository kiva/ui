<template>
	<filter-menu-section title="Sectors" class="filter-section-sectors">
		<ais-refinement-list
			:attribute="'sector.name'"
			:sort-by="['name:asc']"
			:limit="100"
			:transform-items="transformItems"
		>
			<template slot-scope="{ items, refine, }">
				<ul>
					<li v-for="item in items" :key="item.value">
						<kv-controlled-checkbox
							:checked="item.isRefined"
							:label="`${item.label} (${item.count})`"
							@checkbox-input="refine(item.value)"
							:disabled="item.count === 0"
						/>
					</li>
				</ul>
			</template>
		</ais-refinement-list>
	</filter-menu-section>
</template>

<script>
import _find from 'lodash/find';
import _sortBy from 'lodash/sortBy';
import FilterMenuSection from '@/pages/Lend/Filter/FilterComponents/FilterMenuSection';
import { AisRefinementList } from 'vue-instantsearch';
import KvControlledCheckbox from '@/components/Kv/KvControlledCheckbox';

export default {
	components: {
		FilterMenuSection,
		AisRefinementList,
		KvControlledCheckbox,
	},
	props: {
		allSectorNames: {
			type: Array,
			default: () => []
		},
	},
	methods: {
		transformItems(items) {
			// new container for location items
			let sourceItems = [];
			if (this.allSectorNames.length > 0) {
				// if we have source data, use for location item foundation
				sourceItems = this.mergeSectorData(items);
			} else {
				// otherwise just use filtered location data
				sourceItems = items;
			}
			return sourceItems.map(item => ({ ...item, count: item.count }));
		},
		mergeSectorData(filteredSectors) {
			// sort our full facet query to match what sort set in algolia component above
			const originalItems = _sortBy(this.allSectorNames, [item => { return item.value; }]);
			// new array to hold our merged items
			const patchedItems = [];
			originalItems.forEach(originalItem => {
				// check filtered result items for matches
				const matchedSector = _find(filteredSectors, item => {
					return item.value === originalItem.value;
				});
				if (matchedSector !== undefined) {
					// push matched/active item data
					patchedItems.push(matchedSector);
				} else {
					// push stub item data
					patchedItems.push(originalItem);
				}
			});
			return patchedItems;
		}
	},
};
</script>
