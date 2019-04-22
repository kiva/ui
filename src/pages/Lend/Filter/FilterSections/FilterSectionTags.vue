<template>
	<filter-menu-section title="Tags" class="filter-section-tags">
		<ais-refinement-list
			:attribute="'tags.name'"
			:sort-by="['name:asc']"
			:limit="1000"
			:transform-items="transformItems"
		/>
	</filter-menu-section>
</template>

<script>
import FilterMenuSection from '@/pages/Lend/Filter/FilterComponents/FilterMenuSection';
import { AisRefinementList } from 'vue-instantsearch';

export default {
	components: {
		FilterMenuSection,
		AisRefinementList,
	},
	methods: {
		transformItems(items) {
			return items
				.filter(item => this.noUnderscores(item.label))
				.map(item => ({ ...item, count: `(${item.count})`, label: this.removeHashtag(item.label) }));
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
