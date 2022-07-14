<template>
	<nav aria-label="Pagination">
		<ul
			class="tw-text-center tw-mx-auto tw-my-1.5 tw-flex tw-justify-between tw-items-center"
			style="max-width: 17rem;"
		>
			<li class="pagination-previous">
				<a
					class="tw-cursor-pointer tw-flex"
					:class="linkClass(0)"
					aria-label="Previous page"
					@click="!isCurrent(0) && clickPrevious()"
				>
					<kv-material-icon :icon="mdiChevronLeft" class="tw-h-4 tw-w-4" />
					<span class="tw-sr-only">Previous page</span>
				</a>
			</li>
			<li
				v-for="(n, i) in numbers"
				:key="i"
				:aria-hidden="isEllipsis(n)"
			>
				<template v-if="isEllipsis(n)">
					...
				</template>
				<a
					v-else
					class="tw-cursor-pointer"
					:class="linkClass(n)"
					:aria-label="`Page ${n + 1}`"
					@click="!isCurrent(n) && clickPage(n)"
				>
					<span v-if="isCurrent(n)" class="tw-sr-only">You're on page</span>
					{{ n + 1 }}
				</a>
			</li>
			<li class="pagination-next">
				<a
					class="tw-cursor-pointer tw-flex"
					:class="linkClass(totalPages ? totalPages - 1 : 0)"
					aria-label="Next page"
					@click="totalPages && !isCurrent(totalPages - 1) && clickNext()"
				>
					<kv-material-icon :icon="mdiChevronRight" class="tw-h-4 tw-w-4" />
					<span class="tw-sr-only">Next page</span>
				</a>
			</li>
		</ul>
	</nav>
</template>

<script>
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'KvPagination',
	components: {
		KvMaterialIcon,
	},
	props: {
		limit: {
			type: Number,
			required: true,
			validator: value => value > 0,
		},
		total: {
			type: Number,
			required: true,
			validator: value => value >= 0,
		},
		offset: {
			type: Number,
			default: 0,
			validator: value => value >= 0,
		},
		extraPages: {
			type: Number,
			default: 3,
			validator: value => value > 0
		},
		scrollToTop: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			mdiChevronLeft,
			mdiChevronRight,
		};
	},
	computed: {
		current() {
			const page = this.offset / this.limit;

			// This component uses a 0-based page index
			return page < this.totalPages ? page : 0;
		},
		totalPages() {
			return Math.ceil(this.total / this.limit);
		},
		numbers() {
			// If less than the max, there will be no ellipsis, so just return the numbers
			if (this.totalPages < (this.extraPages + 2)) {
				return this.range(0, this.totalPages - 1);
			}

			const numbers = [];

			// Add the 'middle' block of numbers based upon the current page
			if ([0, 1, 2].includes(this.current)) {
				numbers.push(...this.range(1, this.extraPages));
			} else if ([this.totalPages - 3, this.totalPages - 2, this.totalPages - 1].includes(this.current)) {
				numbers.push(...this.range(this.totalPages - this.extraPages - 1, this.totalPages - 2));
			} else {
				const delta = Math.floor(this.extraPages / 2);
				numbers.push(...this.range(this.current - delta, this.current + delta));
			}

			// Add a placeholder for first ellipsis
			if (numbers[1] !== 2) {
				numbers.splice(0, 0, -1);
			}

			// Add a placeholder for second ellipsis
			const totalNumbers = numbers.length;
			if (numbers[totalNumbers - 1] !== this.totalPages - 2) {
				numbers.splice(totalNumbers, 0, -1);
			}

			// Add first and last pages
			numbers.unshift(0);
			numbers.push(this.totalPages - 1);

			return numbers;
		},
	},
	methods: {
		range(start, end) {
			return [...Array(end - start + 1)].map((_, n) => n + start);
		},
		isCurrent(number) {
			return number === this.current;
		},
		isEllipsis(number) {
			return number === -1;
		},
		linkClass(number) {
			return { 'tw-text-tertiary': this.isCurrent(number), 'tw-pointer-events-none': this.isCurrent(number) };
		},
		pageChange(number) {
			if (this.scrollToTop && window.scrollTo) {
				window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
			}

			this.$emit('page-changed', { pageOffset: number * this.limit });
		},
		clickPage(number) {
			this.pageChange(number);

			this.$kvTrackEvent?.('Lending', 'click-page-pager', number + 1);
		},
		clickPrevious() {
			const previous = this.current - 1;

			this.pageChange(previous);

			this.$kvTrackEvent?.('Lending', 'click-previous-pager', previous + 1);
		},
		clickNext() {
			const next = this.current + 1;

			this.pageChange(next);

			this.$kvTrackEvent?.('Lending', 'click-next-pager', next + 1);
		},
	},
};
</script>
