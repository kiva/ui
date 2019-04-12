<template>
	<filter-menu-section title="Sectors" class="filter-section-sectors">
		<ais-refinement-list :attribute="'sector.name'" :sort-by="['name:asc']" :transform-items="transformItems"/>
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
	methods: {
		transformItems(items) {
			return items.map(item => ({ ...item, count: `(${item.count})` }));
		}
	},
};
</script>
