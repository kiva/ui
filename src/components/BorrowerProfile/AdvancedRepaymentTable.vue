<template>
	<div class="tw-relative">
		<div
			ref="scrollContainer"
			class="tw-overflow-x-auto tw-min-w-full"
			@scroll="updateScrollGradients"
		>
			<table class="tw-w-full tw-border-collapse tw-text-small">
				<thead class="tw-bg-secondary tw-text-left">
					<tr class="table-header">
						<th>
							<span class="tw-sr-only">Payment</span>
						</th>
						<th>
							Expected
						</th>
						<th>
							Amount
						</th>
						<th>
							Actual
						</th>
						<th>
							Received
						</th>
						<th>
							Comments
						</th>
					</tr>
				</thead>
				<tbody v-for="period in periods" :key="period.dueDate">
					<tr class="repayments-header">
						<th colspan="5">
							{{ period.periodLabel }}
						</th>
						<th>
							<repayment-comment :tone="period.comment.tone" :text="period.comment.text" />
						</th>
					</tr>
					<tr
						v-for="(row, index) in period.borrowerRows"
						:key="`${period.dueDate}-borrower-${index}`"
						class="repayments-row"
					>
						<td>
							<template v-if="index === 0">
								From borrower to partner
							</template>
						</td>
						<td>
							{{ row.expectedDate }}
						</td>
						<td>
							{{ row.expectedAmount }}
						</td>
						<td>
							{{ row.actualDate }}
						</td>
						<td>
							{{ row.actualAmount }}
						</td>
						<td></td>
					</tr>
					<tr class="repayments-row">
						<td>
							From partner to lenders
						</td>
						<td>
							{{ period.lenderRow.expectedDate }}
						</td>
						<td>
							{{ period.lenderRow.expectedAmount }}
						</td>
						<td>
							{{ period.lenderRow.actualDate }}
						</td>
						<td>
							{{ period.lenderRow.actualAmount }}
						</td>
						<td>
							<span v-if="period.lenderRow.attribution" class="tw-block">
								{{ period.lenderRow.attribution }}
							</span>
							<span v-if="period.currencyLoss" class="tw-block">
								{{ period.currencyLoss }}
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div v-show="canScrollLeft" class="scroll-gradient scroll-gradient--left"></div>
		<div v-show="canScrollRight" class="scroll-gradient scroll-gradient--right"></div>
	</div>
</template>

<script>
import RepaymentComment from '#src/components/BorrowerProfile/RepaymentComment';

export default {
	name: 'AdvancedRepaymentTable',
	components: {
		RepaymentComment,
	},
	props: {
		periods: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			canScrollLeft: false,
			canScrollRight: false,
		};
	},
	methods: {
		// Show each gradient only while the table can still scroll that way.
		updateScrollGradients() {
			const el = this.$refs.scrollContainer;
			if (!el) {
				this.canScrollLeft = false;
				this.canScrollRight = false;
				return;
			}
			// 1px tolerance so sub-pixel rounding at the extremes doesn't leave a gradient on.
			this.canScrollLeft = el.scrollLeft > 1;
			this.canScrollRight = el.scrollLeft < (el.scrollWidth - el.clientWidth - 1);
		},
	},
	watch: {
		periods() {
			this.$nextTick(this.updateScrollGradients);
		},
	},
	mounted() {
		this.$nextTick(this.updateScrollGradients);
		window.addEventListener('resize', this.updateScrollGradients);
	},
	beforeUnmount() {
		window.removeEventListener('resize', this.updateScrollGradients);
	},
};
</script>

<style lang="postcss" scoped>
.table-header th {
	@apply tw-py-1.5 tw-px-1.5;
}

.repayments-header {
	@apply tw-bg-secondary;
}

.repayments-header th {
	@apply tw-text-left tw-font-medium;
}

.repayments-row {
	@apply odd:tw-bg-gray-50;
}

.repayments-row td {
	@apply last:tw-whitespace-normal;
}

.repayments-header th, .repayments-row td {
	@apply tw-py-0.5 tw-px-1.5 tw-whitespace-nowrap;
}

.scroll-gradient {
	@apply tw-pointer-events-none tw-absolute tw-top-0 tw-bottom-0;

	width: 1.5rem;
}

.scroll-gradient--left {
	@apply tw-left-0;

	background: linear-gradient(to right, rgb(0 0 0 / 12%), rgb(0 0 0 / 0%));
}

.scroll-gradient--right {
	@apply tw-right-0;

	background: linear-gradient(to left, rgb(0 0 0 / 12%), rgb(0 0 0 / 0%));
}
</style>
