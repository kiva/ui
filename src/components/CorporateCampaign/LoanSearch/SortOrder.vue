<template>
	<div class="sort-by-controls">
		<ul>
			<li v-for="sortOption in sortOptions" :key="sortOption.value">
				<a
					:class="{ 'selected': activeSort === sortOption.value }"
					@click.prevent="handleSortSelection(sortOption)"
				>
					{{ sortOption.label }}
				</a>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	props: {
		selectedSort: {
			type: String,
			default: null
		},
		initialSort: {
			type: String,
			default: 'popularity'
		}
	},
	data() {
		return {
			activeSort: null,
			sortOptions: [
				{ value: 'loanAmount', label: 'Amount low to high' },
				{ value: 'loanAmountDesc', label: 'Amount high to low' },
				{ value: 'amountLeft', label: 'Amount left' },
				{ value: 'expiringSoon', label: 'Ending soon' },
				{ value: 'repaymentTerm', label: 'Loan length' },
				{ value: 'newest', label: 'Most recent' },
				{ value: 'popularity', label: 'Trending now' },
			]
		};
	},
	created() {
		this.setSortOrder();
	},
	watch: {
		initialSort(next, prev) {
			if (!this.selectedSort && next !== prev) {
				this.setSortOrder();
			}
		},
		selectedSort(next, prev) {
			if (next !== prev) {
				this.setSortOrder();
			}
		}
	},
	methods: {
		handleSortSelection(sortOption) {
			this.$emit('sort-order-updated', sortOption.value);
			this.activeSort = sortOption;
		},
		setSortOrder() {
			// set selected if present
			if (this.selectedSort) {
				this.activeSort = this.selectedSort;
				return true;
			}
			// fallback to initial sort
			this.activeSort = this.initialSort;
		}
	}
};
</script>

<style lang="scss" scoped>
.sort-by-controls {
	a.selected {
		font-weight: 500;
	}
}
</style>
