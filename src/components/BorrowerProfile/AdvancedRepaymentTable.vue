<template>
	<div class="tw-relative">
		<div
			ref="scrollContainer"
			class="tw-overflow-x-auto tw-min-w-full"
			@scroll="updateScrollGradients"
		>
			<table class="tw-w-full tw-border-collapse tw-text-small">
				<thead class="tw-bg-secondary tw-text-left">
					<tr>
						<th class="table-heading-spacing">
							<span class="tw-sr-only">Payment</span>
						</th>
						<th class="table-heading-spacing">
							Expected
						</th>
						<th class="table-heading-spacing">
							Amount
						</th>
						<th class="table-heading-spacing">
							Actual
						</th>
						<th class="table-heading-spacing">
							Received
						</th>
						<th class="table-heading-spacing">
							Comments
						</th>
					</tr>
				</thead>
				<tbody v-for="period in periods" :key="period.dueDate">
					<tr class="tw-bg-tertiary">
						<th colspan="5" class="table-data-spacing tw-text-left tw-font-medium">
							{{ period.periodLabel }}
						</th>
						<th class="table-data-spacing tw-text-left tw-font-medium tw-whitespace-nowrap">
							<repayment-comment :tone="period.comment.tone" :text="period.comment.text" />
						</th>
					</tr>
					<tr
						v-for="(row, index) in period.borrowerRows"
						:key="`${period.dueDate}-borrower-${index}`"
					>
						<td class="table-data-spacing tw-whitespace-nowrap">
							<template v-if="index === 0">
								From borrower to Lending partner
							</template>
						</td>
						<td class="table-data-spacing tw-whitespace-nowrap">
							{{ row.expectedDate }}
						</td>
						<td class="table-data-spacing tw-whitespace-nowrap">
							{{ row.expectedAmount }}
						</td>
						<td class="table-data-spacing tw-whitespace-nowrap">
							{{ row.actualDate }}
						</td>
						<td class="table-data-spacing tw-whitespace-nowrap">
							{{ row.actualAmount }}
						</td>
						<td class="table-data-spacing"></td>
					</tr>
					<tr class="tw-bg-secondary">
						<td class="table-data-spacing tw-whitespace-nowrap">
							From Lending partner to lenders
						</td>
						<td class="table-data-spacing tw-whitespace-nowrap">
							{{ period.lenderRow.expectedDate }}
						</td>
						<td class="table-data-spacing tw-whitespace-nowrap">
							{{ period.lenderRow.expectedAmount }}
						</td>
						<td class="table-data-spacing tw-whitespace-nowrap">
							{{ period.lenderRow.actualDate }}
						</td>
						<td class="table-data-spacing tw-whitespace-nowrap">
							{{ period.lenderRow.actualAmount }}
						</td>
						<td class="table-data-spacing">
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
.table-heading-spacing {
	@apply tw-py-1.5 tw-px-1.5;
}

.table-data-spacing {
	@apply tw-py-0.5 tw-px-1.5;
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
