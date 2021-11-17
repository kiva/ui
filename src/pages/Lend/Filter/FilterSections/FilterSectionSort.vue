<template>
	<filter-menu-section
		title="Sort order"
		class="filter-section-sort-order"
		:initial-accordian-state-open="initialAccordianStateOpen"
	>
		<ais-sort-by :items="defaultSortIndices">
			<ul slot-scope="{ items, currentRefinement, refine }">
				<li v-for="item in items" :key="item.value" :value="item.value" class="tw-mb-2">
					<button
						class="tw-text-small"
						:class="{ 'tw-text-action tw-font-medium': item.value === currentRefinement }"
						@click="refine(item.value)"
					>
						{{ item.label | changeCase('sentenceCase') }}
					</button>
				</li>
			</ul>
		</ais-sort-by>
	</filter-menu-section>
</template>

<script>
import { AisSortBy } from 'vue-instantsearch';
import FilterMenuSection from '@/pages/Lend/Filter/FilterComponents/FilterMenuSection';

export default {
	components: {
		AisSortBy,
		FilterMenuSection,
	},
	props: {
		defaultSortIndices: {
			type: Array,
			required: true,
		},
		initialAccordianStateOpen: {
			type: Boolean,
			default: false
		}
	},
};
</script>
