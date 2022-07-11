<template>
	<ul class="ais-Pagination-list">
		<!-- previous page -->
		<li
			class="ais-Pagination-item ais-Pagination-item--previousPage"
			:class="{ 'ais-Pagination-item--disabled' : isFirstPage }"
		>
			<span
				v-if="isFirstPage"
				aria-label="Previous (Inactive)"
				class="ais-Pagination-link"
			>
				<kv-icon name="triangle" class="icon disabled" :from-sprite="true" />
			</span>
			<a
				v-else
				:href="createUrl(currentRefinement - 1)"
				@click.prevent="previousPage"
				aria-label="Previous"
				class="ais-Pagination-link"
			>
				<kv-icon name="triangle" class="icon" :from-sprite="true" />
			</a>
		</li>

		<li
			v-for="(number, index) in numbers"
			:key="number || -index"
			class="ais-Pagination-item"
			:class="{ ellipsis: number === 0 }"
			:aria-hidden="number === 0"
		>
			<span
				v-if="number - 1 === currentRefinement"
				class="ais-Pagination-link"
			>
				{{ number }}
			</span>

			<a
				v-else-if="number > 0"
				:href="createUrl(number - 1)"
				@click.prevent="goToPage(number - 1)"
				class="ais-Pagination-link"
			>
				{{ number }}
			</a>
		</li>

		<!-- next page -->
		<li
			class="ais-Pagination-item ais-Pagination-item--nextPage"
			:class="{ 'ais-Pagination-item--disabled' : isLastPage }"
		>
			<span
				v-if="isLastPage"
				aria-label="Next (Inactive)"
				class="ais-Pagination-link"
			>
				<kv-icon name="triangle" class="icon disabled" :from-sprite="true" />
			</span>

			<a
				v-else
				:href="createUrl(currentRefinement + 1)"
				@click.prevent="nextPage"
				aria-label="Next"
				class="ais-Pagination-link"
			>
				<kv-icon name="triangle" class="icon" :from-sprite="true" />
			</a>
		</li>
	</ul>
</template>

<script>
import _range from 'lodash/range';
import smoothScrollMixin from '@/plugins/smooth-scroll-mixin';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	name: 'AlgoliaPagination',
	components: {
		KvIcon,
	},
	mixins: [
		smoothScrollMixin,
	],
	props: {
		currentRefinement: {
			type: Number,
			required: true,
		},
		createUrl: {
			type: Function,
			required: true,
		},
		isFirstPage: {
			type: Boolean,
			required: true,
		},
		isLastPage: {
			type: Boolean,
			required: true,
		},
		nbPages: {
			type: Number,
			required: true,
		},
		pages: {
			type: Array,
			required: true,
		},
		refine: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			maximumExtraPages: 3,
		};
	},
	computed: {
		numbers() {
			// if less than the max, there will be no ellipsis, so just return the numbers
			if (this.nbPages < (this.maximumExtraPages + 2)) {
				return _range(1, this.nbPages + 1);
			}

			let numbers = [];

			// add the 'middle' block of numbers based upon the current page
			if (this.currentRefinement === 0 || this.currentRefinement === 1) {
				numbers = _range(1, this.maximumExtraPages + 1);
			} else if (this.currentRefinement === this.nbPages - 1 || this.currentRefinement === this.nbPages) {
				numbers = _range(this.nbPages - (this.maximumExtraPages - 1), this.nbPages + 1);
			} else {
				const delta = Math.floor(this.maximumExtraPages / 2);
				numbers = _range((this.currentRefinement + 1) - delta, this.currentRefinement + delta + 2);
			}

			// add the first and last page numbers
			numbers = numbers.concat([1, this.nbPages]);

			// sort by number & remove duplicates
			numbers.sort((a, b) => a - b);
			numbers = [...new Set(numbers)];

			// add a placeholder for first ellipsis, if needed
			if (numbers[1] !== 2) {
				numbers.splice(1, 0, 0);
			}

			// add a placeholder for last ellipsis, if needed
			if (numbers[numbers.length - 2] !== this.nbPages - 1) {
				numbers.splice(numbers.length - 1, 0, 0);
			}

			return numbers;
		},
	},
	methods: {
		requestPage(page) {
			this.refine(page);
			setTimeout(() => {
				this.$fireServerPageView();
			}, 400);
		},
		goToPage(page) {
			this.runOnPagination();
			this.requestPage(page);
		},
		nextPage() {
			this.runOnPagination();
			this.requestPage(this.currentRefinement + 1);
		},
		previousPage() {
			this.runOnPagination();
			this.requestPage(this.currentRefinement - 1);
		},
		runOnPagination() {
			this.smoothScrollTo({ yPosition: 0, millisecondsToAnimate: 125 });
		},
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
		color: rgb(var(--text-secondary));
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
			fill: rgb(var(--text-action));
			height: 1rem;
			margin-top: rem-calc(9);
			width: 1rem;

			&.disabled {
				color: rgb(var(--text-secondary));
				fill: rgb(var(--text-secondary));
			}
		}

		a:hover,
		a:visited {
			text-decoration: none;
		}

		a:hover .icon {
			fill: rgb(var(--text-action-highlight));
		}
	}

	.ais-Pagination-item--selected {
		font-weight: 400;
	}

	.ellipsis::after {
		content: '\2026';
	}
}
</style>
