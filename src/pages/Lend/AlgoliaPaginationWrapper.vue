<template>
	<ais-pagination :padding="padding">
		<div
			slot-scope="{
				currentRefinement,
				nbPages,
				pages,
				isFirstPage,
				isLastPage,
				refine,
				createURL
			}"
		>
			<algolia-pagination
				:current-refinement="currentRefinement"
				:nb-pages="nbPages"
				:pages="pages"
				:is-first-page="isFirstPage"
				:is-last-page="isLastPage"
				:refine="refine"
				:create-url="createURL"
			/>
		</div>
	</ais-pagination>
</template>

<script>
import { AisPagination } from 'vue-instantsearch';
import AlgoliaPagination from '@/pages/Lend/AlgoliaPagination';

export default {
	name: 'AlgoliaPaginationWrapper',
	components: {
		AisPagination,
		AlgoliaPagination,
	},
	props: {
		padding: {
			type: Number,
			default: 0,
		},
	},
};
</script>
