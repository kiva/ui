<template>
	<div class="sort-by-controls">
		<ul>
			<li v-for="sortOption in sortOptions" :key="sortOption.value">
				<kv-radio
					:id="`sort-by-${sortOption.value}`"
					:radio-value="sortOption.value"
					v-model="activeSort"
				>
					{{ sortOption.label }}
				</kv-radio>
			</li>
		</ul>
	</div>
</template>

<script>
import KvRadio from '@/components/Kv/KvRadio';

export default {
	components: {
		KvRadio
	},
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
		},
		activeSort(next, prev) {
			if (next !== prev) {
				this.$emit('sort-order-updated', next);
			}
		}
	},
	methods: {
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
