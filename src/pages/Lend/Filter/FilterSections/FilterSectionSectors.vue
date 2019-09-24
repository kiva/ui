<template>
	<filter-menu-section
		title="Sectors"
		class="filter-section-sectors"
		:initial-accordian-state-open="initialAccordianStateOpen"
	>
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
import _sortBy from 'lodash/sortBy';
import { AisRefinementList } from 'vue-instantsearch';
import mergeRefinmentListItems from '@/util/algoliaUtils';
import FilterMenuSection from '@/pages/Lend/Filter/FilterComponents/FilterMenuSection';
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
		initialAccordianStateOpen: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		transformItems(items) {
			// new container for merged items
			let sourceItems = [];
			if (this.allSectorNames.length > 0) {
				// sort our full facet query to match what sort set in algolia component above
				const sortedOriginalItems = _sortBy(this.allSectorNames, [item => { return item.value; }]);
				// if we have source data, use for location item foundation
				sourceItems = mergeRefinmentListItems(sortedOriginalItems, items);
			} else {
				// otherwise just use filtered location data
				sourceItems = items;
			}
			return sourceItems.map(item => ({ ...item, count: item.count }));
		},
	},
};
</script>
