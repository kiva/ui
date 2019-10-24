<template>
	<filter-menu-section
		title="Sort order"
		class="filter-section-sort-order"
		:initial-accordian-state-open="initialAccordianStateOpen"
	>
		<ais-sort-by :items="defaultSortIndices">
			<ul slot-scope="{ items, currentRefinement, refine }">
				<li v-for="item in items" :key="item.value" :value="item.value" class="sort">
					<a href="#"
						:class="{ 'selected': item.value === currentRefinement }"
						@click.prevent="refine(item.value)"
					>
						{{ item.label | changeCase('sentenceCase') }}
					</a>
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

<style lang="scss" scoped>
@import 'settings';

li.sort {
	margin-bottom: rem-calc(12);

	a {
		color: $charcoal;
		font-size: rem-calc(14);
		font-weight: 300;
		text-decoration: none;

		&.selected {
			color: $kiva-green;
			font-weight: bold;
		}
	}
}
</style>
