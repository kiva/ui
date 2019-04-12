<template>
	<filter-menu-section title="Attributes" class="filter-section-attributes">
		<ais-refinement-list
			:attribute="'themeData.loanThemeTypeName'"
			:sort-by="['name:asc']"
			:transform-items="transformItems"
		/>
	</filter-menu-section>
</template>

<script>
import FilterMenuSection from '@/pages/Lend/Filter/FilterMenuSection';
import { AisRefinementList } from 'vue-instantsearch';

export default {
	components: {
		FilterMenuSection,
		AisRefinementList,
	},
	data() {
		return {
			visibleThemes: {
				'Conflict Zone': true,
				'Clean Energy': true,
				'Displaced Populations': true,
				/* Below are untested, taken directly from ticket */
				'Rural Exclusion': true,
				'Social Enterprise': true,
				'Water and Sanitation': true,
				Youth: true,
			},
		};
	},
	methods: {
		transformItems(items) {
			return items
				.filter(item => !!this.visibleThemes[item.label])
				.map(item => ({ ...item, count: `(${item.count})` }));
		}
	},
};
</script>
