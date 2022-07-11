<template>
	<nav aria-label="Pagination">
		<ul class="pagination">
			<li v-if="current !== 1" class="pagination-previous">
				<router-link
					:to="routeForPage(current - 1)"
					:event="linkEventName"
					@click.native="pageChange(current - 1, $event)"
					aria-label="Previous page"
				>
					<kv-icon class="icon tw-fill-current" name="triangle" :from-sprite="true" />
					<span class="tw-sr-only">Previous page</span>
				</router-link>
			</li>
			<li v-else class="pagination-previous tw-text-tertiary">
				<kv-icon class="icon tw-fill-current tw-text-tertiary" name="triangle" :from-sprite="true" />
				<span class="tw-sr-only">Previous page</span>
			</li>
			<li
				v-for="(number, index) in numbers"
				:key="number || -index"
				:class="{
					ellipsis: number === 0,
					'tw-text-tertiary': number === current
				}"
				:aria-hidden="number === 0"
			>
				<router-link
					v-if="number > 0 && number !== current"
					:to="routeForPage(number)"
					:event="linkEventName"
					@click.native="pageChange(number, $event)"
					:aria-label="`Page ${number}`"
				>
					{{ number }}
				</router-link>
				<span v-if="number === current">
					<span class="tw-sr-only">You're on page </span>
					{{ number }}
				</span>
			</li>
			<li v-if="current !== totalPages" class="pagination-next">
				<router-link
					:to="routeForPage(current + 1)"
					:event="linkEventName"
					@click.native="pageChange(current + 1, $event)"
					aria-label="Next page"
				>
					<span class="tw-sr-only">Next page</span>
					<kv-icon class="icon tw-fill-current" name="triangle" :from-sprite="true" />
				</router-link>
			</li>
			<li v-else class="pagination-next disabled">
				<span class="tw-sr-only">Next page</span>
				<kv-icon class="icon tw-fill-current tw-text-tertiary" name="triangle" :from-sprite="true" />
			</li>
		</ul>
	</nav>
</template>

<script>
import _cloneDeep from 'lodash/cloneDeep';
import _range from 'lodash/range';
import KvIcon from './KvIcon';

export default {
	name: 'KvPagination',
	components: {
		KvIcon,
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
	},
	data() {
		return {
			maxExtraPages: 3,
		};
	},
	computed: {
		current() {
			return Number(this.$route.query.page) || 1;
		},
		totalPages() {
			return Math.ceil(this.total / this.limit);
		},
		// The event that router-link will listen for on the <a> element (normally 'click')
		linkEventName() {
			if (this.$listeners && this.$listeners['page-change']) {
				// There is a listener for the 'page-change' event on this component, so navigation
				// needs to be prevented.
				// Making router-link listen for the non-existent 'not-an-event' event on
				// the <a> element, instead of the 'click' event, will prevent the navigation handler
				// from ever being called.
				return 'not-an-event';
			}
			// By default, allow normal navigation to happen.
			return 'click';
		},
		numbers() {
			// if less than the max, there will be no ellipsis, so just return the numbers
			if (this.totalPages < (this.maxExtraPages + 2)) {
				return _range(1, this.totalPages + 1);
			}

			let numbers = [];

			// add the 'middle' block of numbers based upon the current page
			if (this.current === 1 || this.current === 2) {
				numbers = _range(1, this.maxExtraPages + 1);
			} else if (this.current === this.totalPages - 1 || this.current === this.totalPages) {
				numbers = _range(this.totalPages - (this.maxExtraPages - 1), this.totalPages + 1);
			} else {
				const delta = Math.floor(this.maxExtraPages / 2);
				numbers = _range(this.current - delta, this.current + delta + 1);
			}

			// add the first and last page numbers
			numbers = numbers.concat([1, this.totalPages]);

			// sort by number & remove duplicates
			numbers.sort((a, b) => a - b);
			numbers = [...new Set(numbers)];

			// add a placeholder for first ellipsis, if needed
			if (numbers[1] !== 2) {
				numbers.splice(1, 0, 0);
			}

			// add a placeholder for last ellipsis, if needed
			if (numbers[numbers.length - 2] !== this.totalPages - 1) {
				numbers.splice(numbers.length - 1, 0, 0);
			}

			return numbers;
		},
	},
	methods: {
		routeForPage(number) {
			const query = _cloneDeep(this.$route.query);
			if (number > 1) {
				query.page = number;
			} else {
				delete query.page;
			}
			return { query };
		},
		// This handler gets called when a page number is clicked.
		// By default it will do nothing, which will let router-link handle the navigation.
		// However, if there is a listener to the page-change event on this component
		// (i.e. @page-change="listener"), it will instead prevent any navigation from happening
		// and emit a 'page-change' event with the page number.
		pageChange(number, event) {
			if (this.$listeners && this.$listeners['page-change']) {
				event.preventDefault();
				event.stopImmediatePropagation();
				this.$emit('page-change', number);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import "settings";

.pagination {
	text-align: center;
	margin: 0.75rem auto;
	display: flex;
	justify-content: space-between;
	align-items: center;
	max-width: 17rem;

	li {
		text-decoration: none;
		list-style: none;
	}
}

.icon {
	width: 1rem;
	height: 1rem;
	vertical-align: text-top;
}

.pagination-previous .icon {
	transform: rotate(-90deg);
}

.pagination-next .icon {
	transform: rotate(90deg);
}

.ellipsis::after {
	content: '\2026';
}
</style>
