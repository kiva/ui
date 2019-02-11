<template>
	<ais-pagination :padding="padding" />
</template>

<script>
import { AisPagination } from 'vue-instantsearch';

export default {
	components: {
		AisPagination,
	},
	props: {
		padding: {
			type: Number,
			default: 0,
		}
	},
};
</script>

<style lang="scss">
@import 'settings';

.ais-Pagination-list {
	list-style: none;
	text-align: center;
	display: flex;
	margin: 0.75rem auto;
	justify-content: space-between;
	align-items: center;
	max-width: 17rem;

	.ais-Pagination-item {
		color: $kiva-text-light;
	}

	.ais-Pagination-item--active,
	.ais-Pagination-item--disabled {
		a {
			color: $kiva-text-light;
		}
	}

	.ais-Pagination-item--first,
	.ais-Pagination-item--previous,
	.ais-Pagination-item--next,
	.ais-Pagination-item--last {
		font-weight: bold;

		a:hover,
		a:visited {
			text-decoration: none;
		}
	}
}
</style>
