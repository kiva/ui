<template>
	<!--
		This category page was added as a temporary workaround to a bug preventing DOM manipulation in the same Vue
		file as Algolia filters.
		https://github.com/algolia/vue-instantsearch/issues/618#issuecomment-466543784
	-->
	<filter-menu-section :title="title" :open="open" :result-count="10">
		<ais-hierarchical-menu
			:attributes="['locationFacets.lvl0', 'locationFacets.lvl1']"
			:sort-by="['name:asc']"
			:limit="100"
		/>
	</filter-menu-section>
</template>

<script>
import FilterMenuSection from '@/pages/Lend/Filter/FilterMenuSection';
import { AisHierarchicalMenu } from 'vue-instantsearch';

export default {
	components: {
		FilterMenuSection,
		AisHierarchicalMenu,
	},
	props: {
		title: {
			type: String,
			default: 'Location',
		},
		open: {
			type: Boolean,
			default: true,
		},
		resultCount: {
			type: Number,
			required: true,
		},
	},
};
</script>
<style>
</style>
