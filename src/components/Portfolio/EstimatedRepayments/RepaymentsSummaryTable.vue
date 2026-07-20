<template>
	<table class="tw-w-full tw-text-small tw-border-collapse" data-testid="repayments-summary-table">
		<thead>
			<tr class="tw-bg-gray-200">
				<th
					scope="col"
					class="tw-w-full tw-max-w-0 tw-truncate tw-px-1 lg:tw-px-2 tw-py-1 tw-font-bold tw-text-left"
				>
					Due
				</th>
				<th scope="col" class="tw-px-1 lg:tw-px-2 tw-py-1 tw-font-bold tw-text-left tw-whitespace-nowrap">
					Scheduled
				</th>
				<th scope="col" class="tw-px-1 lg:tw-px-2 tw-py-1 tw-font-bold tw-text-left tw-whitespace-nowrap">
					Loans
				</th>
			</tr>
		</thead>
		<tbody>
			<template v-for="month in months" :key="`${month.year}-${month.month}`">
				<!-- Year sub-header row, emitted when the year changes -->
				<tr v-if="month.showYearHeader" class="tw-bg-gray-200">
					<th
						scope="colgroup"
						colspan="3"
						class="tw-px-1 lg:tw-px-2 tw-py-0.5 tw-font-bold tw-text-tertiary tw-text-left"
					>
						{{ month.year }}
					</th>
				</tr>
				<!-- The whole row is clickable; the inner button keeps the interaction keyboard-accessible.
					@click.stop on the button prevents the row handler from double-firing when the button itself
					is clicked. -->
				<tr
					class="tw-bg-primary hover:tw-bg-secondary tw-cursor-pointer"
					:class="{ '!tw-bg-brand-100': isSelected(month) }"
					:data-testid="`repayments-month-row-${month.year}-${month.month}`"
					@click="selectMonth(month)"
				>
					<!-- The Due column absorbs the flexible width (tw-w-full + tw-max-w-0) and
						ellipsizes (tw-truncate) so the table fits its parent without a horizontal
						scrollbar; the numeric columns are tw-whitespace-nowrap and keep their natural width. -->
					<td class="tw-w-full tw-max-w-0 tw-truncate tw-px-1 lg:tw-px-2 tw-py-1">
						<button
							type="button"
							class="tw-text-action tw-underline"
							:title="month.monthLabel"
							:aria-current="isSelected(month) ? 'true' : undefined"
							@click.stop="selectMonth(month)"
						>
							{{ month.monthLabel }}
						</button>
					</td>
					<td class="tw-px-1 lg:tw-px-2 tw-py-1 tw-text-right tw-whitespace-nowrap">
						{{ $filters.numeral(month.total, '$0,0.00') }}
					</td>
					<td class="tw-px-1 lg:tw-px-2 tw-py-1 tw-text-right tw-whitespace-nowrap">
						{{ month.loansMakingRepayments }}
					</td>
				</tr>
			</template>
		</tbody>
	</table>
</template>

<script>
export default {
	name: 'RepaymentsSummaryTable',
	props: {
		/** Bucketed months: { year, month, monthLabel, total, loansMakingRepayments, showYearHeader }. */
		months: {
			type: Array,
			required: true,
		},
		/** Currently selected month object (or null). */
		selected: {
			type: Object,
			default: null,
		},
	},
	emits: ['select'],
	methods: {
		isSelected(month) {
			return !!this.selected
				&& this.selected.year === month.year
				&& this.selected.month === month.month;
		},
		selectMonth(month) {
			// Track from here (not a directive) so row-clicks and button-clicks are
			// recorded identically.
			this.$kvTrackEvent('portfolio', 'click', 'Estimated repayments month', month.monthLabel);
			this.$emit('select', month);
		},
	},
};
</script>
