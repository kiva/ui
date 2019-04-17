<template>
	<filter-menu-section title="Attributes" class="filter-section-attributes">
		<ais-refinement-list
			:attribute="'themeData.loanThemeTypeName'"
			:sort-by="['name:asc']"
			:limit="1000"
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
				'conflict zone': true,
				'clean energy': true,
				'displaced populations': true,
				'rural exclusion': true,
				'social enterprise': true,
				'water and sanitation': true,
				youth: true,
			},
		};
	},
	methods: {
		transformItems(items) {
			return items
				.filter(item => !!this.visibleThemes[item.label.toLowerCase()])
				.map(item => ({ ...item, count: `(${item.count})` }));
		}
	},
};
</script>
