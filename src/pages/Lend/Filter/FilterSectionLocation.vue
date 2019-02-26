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
			:transform-items="transformItems"
		>
			<div
				slot-scope="{
					items,
					canToggleShowMore,
					isShowingMore,
					refine,
					toggleShowMore,
					createURL,
				}"
			>
				<!-- eslint-disable vue/attribute-hyphenation -->
				<hierarchical-menu-list
					:items="items"
					:refine="refine"
					:createURL="createURL"
				/>
				<!-- eslint-enable vue/attribute-hyphenation -->
				<button
					@click="toggleShowMore()"
					:disabled="!canToggleShowMore"
				>
					{{ isShowingMore ? 'Show less' : 'Show more' }}
				</button>
			</div>
		</ais-hierarchical-menu>
	</filter-menu-section>
</template>

<script>
import FilterMenuSection from '@/pages/Lend/Filter/FilterMenuSection';
import HierarchicalMenuList from '@/pages/Lend/Filter/HierarchicalMenuList';
import { AisHierarchicalMenu } from 'vue-instantsearch';

export default {
	components: {
		FilterMenuSection,
		AisHierarchicalMenu,
		HierarchicalMenuList,
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
	methods: {
		transformItems(items, isChild) {
			return items.map(item => ({
				...item,
				isChild,
				data: item.data ? this.transformItems(item.data, true) : item.data,
			}));
		},
	},
};
</script>
<style>
</style>
