<template>
	<filter-menu-section title="Attributes" class="filter-section-attributes">
		<ais-refinement-list
			:attribute="'loanThemeFilters.name'"
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
import mergeRefinmentListItems from '@/util/algoliaUtils';
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
		allLoanThemeNames: {
			type: Array,
			default: () => []
		},
	},
	data() {
		return {
			visibleThemes: {
				'conflict zones': true,
				'clean energy': true,
				'refugees/displaced': true,
				'rural exclusion': true,
				'social enterprise': true,
				'water and sanitation': true,
				'higher education': true,
				youth: true,
			},
		};
	},
	methods: {
		transformItems(items) {
			// new container for merged items
			let sourceItems = [];
			if (this.allLoanThemeNames.length > 0) {
				// sort our full facet query to match what sort set in algolia component above
				const sortedOriginalItems = _sortBy(this.allLoanThemeNames, [item => { return item.value; }]);
				// if we have source data, use for location item foundation
				sourceItems = mergeRefinmentListItems(sortedOriginalItems, items);
			} else {
				// otherwise just use filtered location data
				sourceItems = items;
			}
			return sourceItems
				.filter(item => !!this.visibleThemes[item.label.toLowerCase()])
				.map(item => ({ ...item, count: item.count }));
		}
	},
};
</script>
