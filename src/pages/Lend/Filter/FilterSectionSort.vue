<template>
	<filter-menu-section :title="title" :open="open" :result-count="resultCount">
		<ais-sort-by :items="defaultSortIndices">
			<ul slot-scope="{ items, currentRefinement, refine }">
				<li v-for="item in items" :key="item.value" :value="item.value" class="sort">
					<a href="#"
						:class="{ 'selected': item.value === currentRefinement }"
						@click.prevent="refine(item.value)">
						{{ item.label | changeCase('sentenceCase') }}
					</a>
				</li>
			</ul>
		</ais-sort-by>
	</filter-menu-section>
</template>

<script>
import { AisConfigure, AisSortBy } from 'vue-instantsearch';
import FilterMenuSection from '@/pages/Lend/Filter/FilterMenuSection';

export default {
	components: {
		AisConfigure,
		AisSortBy,
		FilterMenuSection,
	},
	props: {
		defaultSortIndices: {
			type: Array,
			required: true,
		},
		open: {
			type: Boolean,
			default: true,
		},
		title: {
			type: String,
			default: 'Sort order',
		},
		resultCount: {
			type: Number,
			required: true,
		},
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
