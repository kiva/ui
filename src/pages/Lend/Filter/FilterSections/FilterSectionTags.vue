<template>
	<filter-menu-section title="Tags" class="filter-section-tags">
		<ais-refinement-list
			:attribute="'tags.name'"
			:sort-by="['name:asc']"
			:limit="100"
			:transform-items="transformItems"
		>
			<template slot-scope="{ items, refine, }">
				<ul>
					<li v-for="item in items" :key="item.value">
						<kv-checkbox
							:id="item.label|changeCase('paramCase')"
							:disabled="item.count === 0"
							:checked="item.isRefined"
							@change="refine(item.value)"
							class="tw-mb-1"
						>
							{{ item.label }} ({{ item.count }})
						</kv-checkbox>
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
import KvCheckbox from '@/components/Kv/KvCheckbox';

export default {
	name: 'FilterSectionTags',
	components: {
		FilterMenuSection,
		AisRefinementList,
		KvCheckbox,
	},
	props: {
		allTagNames: {
			type: Array,
			default: () => []
		},
	},
	methods: {
		transformItems(items) {
			// new container for merged items
			let sourceItems = [];
			if (this.allTagNames.length > 0) {
				// sort our full facet query to match what sort set in algolia component above
				const sortedOriginalItems = _sortBy(this.allTagNames, [item => { return item.value; }]);
				// if we have source data, use for location item foundation
				sourceItems = mergeRefinmentListItems(sortedOriginalItems, items);
			} else {
				// otherwise just use filtered location data
				sourceItems = items;
			}
			return sourceItems
				.filter(item => this.noUnderscores(item.label))
				.map(item => ({ ...item, count: item.count, label: this.removeHashtag(item.label) }));
		},
		noUnderscores(label) {
			return !label.includes('_');
		},
		removeHashtag(label) {
			return label.replace(/#/g, '');
		},
	},
};
</script>
