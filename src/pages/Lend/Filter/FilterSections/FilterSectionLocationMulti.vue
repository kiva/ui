<template>
	<filter-menu-section title="Location">
		<ais-refinement-list
			attribute="locationFacets.lvl0"
			:sort-by="['name:asc']"
			:limit="1000"
			:transform-items="transformItems"
		>
			<div
				slot-scope="{
					items,
					refine,
					createURL,
				}"
			>
				<kv-controlled-checkbox
					v-for="item in items"
					:key="item.value"
					:is-checked="item.isRefined"
					:label="`${item.label} (${item.count})`"
					:href="createURL(item)"
					@checkbox-input="refine(item.value)"
				/>
			</div>
		</ais-refinement-list>
		<ais-refinement-list
			attribute="locationFacets.lvl1"
			:sort-by="['name:asc']"
			:limit="1000"
			:transform-items="transformItemsChild"
		/>
	</filter-menu-section>
</template>

<script>
import FilterMenuSection from '@/pages/Lend/Filter/FilterComponents/FilterMenuSection';
import { AisRefinementList } from 'vue-instantsearch';
import KvControlledCheckbox from '@/components/Kv/KvControlledCheckbox';

export default {
	components: {
		KvControlledCheckbox,
		FilterMenuSection,
		AisRefinementList,
	},
	methods: {
		transformItems(items) {
			return items;
		},
		transformItemsChild(items) {
			return items;
		},
	},
};
</script>
