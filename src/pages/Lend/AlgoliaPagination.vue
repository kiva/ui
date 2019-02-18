<template>
	<ais-pagination :padding="padding">
		<ul class="ais-Pagination-list"
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
			<!-- previous page -->
			<li
				class="ais-Pagination-item ais-Pagination-item--previousPage"
				:class="isFirstPage ? 'ais-Pagination-item--disabled' : ''">
				<span
					v-if="isFirstPage"
					aria-label="Previous (Inactive)"
					class="ais-Pagination-link"
				>
					<kv-icon name="triangle" class="disabled" />
				</span>
				<a
					v-if="!isFirstPage"
					:href="createURL(currentRefinement - 1)"
					@click.prevent="refine(currentRefinement - 1)"
					aria-label="Previous"
					class="ais-Pagination-link"
				>
					<kv-icon name="triangle" />
				</a>
			</li>

			<!-- pages -->
			<li
				v-for="page in pages"
				:key="page"
				class="ais-Pagination-item"
				:class="page === currentRefinement ? 'ais-Pagination-item--selected' : ''"
			>
				<span
					v-if="page === currentRefinement"
					class="ais-Pagination-link"
				>
					{{ page + 1 }}
				</span>

				<a
					v-if="page !== currentRefinement"
					:href="createURL(page)"
					@click.prevent="refine(page)"
					class="ais-Pagination-link"
				>
					{{ page + 1 }}
				</a>
			</li>

			<!-- next page -->
			<li
				class="ais-Pagination-item ais-Pagination-item--nextPage"
				:class="isLastPage ? 'ais-Pagination-item--disabled' : ''"
			>
				<span
					v-if="isLastPage"
					aria-label="Next (Inactive)"
					class="ais-Pagination-link"
				>
					<kv-icon name="triangle" class="disabled" />
				</span>

				<a
					v-if="!isLastPage"
					:href="createURL(currentRefinement + 1)"
					@click.prevent="refine(currentRefinement + 1)"
					aria-label="Next"
					class="ais-Pagination-link"
				>
					<kv-icon name="triangle" />
				</a>
			</li>
		</ul>
	</ais-pagination>
</template>

<script>
import { AisPagination } from 'vue-instantsearch';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		AisPagination,
		KvIcon,
	},
	props: {
		padding: {
			type: Number,
			default: 0,
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.ais-Pagination-list {
	align-items: center;
	display: flex;
	justify-content: space-between;
	list-style: none;
	margin: 0.75rem auto;
	max-width: 17rem;
	text-align: center;

	.ais-Pagination-item {
		color: $kiva-text-light;
	}

	.ais-Pagination-item--previousPage .icon {
		transform: rotate(-90deg);
	}

	.ais-Pagination-item--nextPage .icon {
		transform: rotate(90deg);
	}

	.ais-Pagination-item--previousPage,
	.ais-Pagination-item--nextPage {
		.icon {
			fill: $kiva-textlink;
			height: 1rem;
			margin-top: rem-calc(9);
			width: 1rem;

			&.disabled {
				color: $kiva-text-light;
				fill: $kiva-text-light;
			}
		}

		a:hover,
		a:visited {
			text-decoration: none;
		}

		a:hover .icon {
			fill: $kiva-textlink-hover;
		}
	}

	.ais-Pagination-item--selected {
		font-weight: 400;
	}
}
</style>
