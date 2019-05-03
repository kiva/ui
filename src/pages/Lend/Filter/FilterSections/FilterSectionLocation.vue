<template>
	<filter-menu-section title="Location" >
		<ais-hierarchical-menu
			:attributes="['locationFacets.lvl0', 'locationFacets.lvl1']"
			:sort-by="['name:asc']"
			:limit="1000"
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
					v-show="canToggleShowMore"
				>
					{{ isShowingMore ? 'Show less' : 'Show more' }}
				</button>
			</div>
		</ais-hierarchical-menu>
	</filter-menu-section>
</template>

<script>
import FilterMenuSection from '@/pages/Lend/Filter/FilterComponents/FilterMenuSection';
import HierarchicalMenuList from '@/pages/Lend/Filter/FilterComponents/HierarchicalMenuList';
import { AisHierarchicalMenu } from 'vue-instantsearch';

export default {
	components: {
		FilterMenuSection,
		AisHierarchicalMenu,
		HierarchicalMenuList,
	},
	methods: {
		transformItems(items, searchParameters, isChild) {
			return items.map(item => ({
				...item,
				isChild,
				data: item.data ? this.transformItems(item.data, searchParameters, true) : item.data,
			}));
		},
	},
};
</script>
