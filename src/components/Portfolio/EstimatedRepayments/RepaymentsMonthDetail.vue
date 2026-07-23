<template>
	<div data-testid="repayments-month-detail">
		<h2 class="tw-mb-0.5">
			Estimated repayments due by {{ heading }}
		</h2>
		<p class="tw-text-small tw-text-tertiary tw-italic tw-mb-2">
			{{ settlementNote }}
		</p>

		<KvLoadingPlaceholder v-if="loading" style="height: 160px;" data-testid="detail-loading" />

		<p v-else-if="!rows.length" data-testid="detail-empty" class="tw-text-secondary">
			No repayments are scheduled for this month.
		</p>

		<template v-else>
			<table class="tw-w-full tw-text-left tw-text-small">
				<thead>
					<tr class="tw-border-b tw-border-tertiary tw-text-tertiary tw-text-upper">
						<th scope="col" class="tw-max-w-16 tw-py-1 tw-font-medium">
							Borrower
						</th>
						<th scope="col" class="tw-py-1 tw-font-medium tw-text-right tw-whitespace-nowrap">
							Scheduled
						</th>
						<th scope="col" class="tw-py-1 tw-px-2 tw-font-medium tw-text-right tw-whitespace-nowrap">
							#
						</th>
						<th scope="col" class="tw-w-full tw-py-1 tw-font-medium">
							Notes
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(row, index) in rows"
						:key="row.loan ? row.loan.id : index"
						class="tw-border-b tw-border-tertiary tw-align-top"
					>
						<!-- The Borrower column is capped (tw-max-w-16) and ellipsizes longer
							names via CSS (tw-truncate); the full name stays in the DOM and is exposed
							on hover/AT via :title. The numeric columns keep their natural width
							(tw-whitespace-nowrap), and the Notes column absorbs the remaining width
							(tw-w-full on its cells) so its longer copy wraps rather than being squeezed. -->
						<td class="tw-max-w-16 tw-truncate tw-py-1">
							<a
								v-if="row.loan"
								:href="loanUrl(row.loan.id)"
								:title="row.loan.name"
								class="tw-text-action data-hj-suppress"
								target="_blank"
								rel="noopener"
								v-kv-track-event="[
									'portfolio',
									'click',
									'Estimated repayments borrower',
									row.loan.name,
									row.loan.id,
								]"
							>
								{{ row.loan.name }}
							</a>
						</td>
						<td class="tw-py-1 tw-text-right tw-whitespace-nowrap">
							{{ $filters.numeral(row.amount, '$0,0.00') }}
						</td>
						<td class="tw-py-1 tw-px-2 tw-text-right tw-whitespace-nowrap">
							{{ row.pastRepayments }}/{{ row.totalRepayments }}
						</td>
						<td class="tw-w-full tw-py-1">
							<span v-if="promoText(row)">{{ promoText(row) }}</span>
							<span v-if="row.isDelinquent" class="tw-text-danger tw-ml-0.5">Delinquent</span>
							<span v-if="isFinal(row)" class="tw-text-tertiary tw-ml-0.5">Final</span>
						</td>
					</tr>
				</tbody>
			</table>

			<p v-if="truncated" class="tw-text-small tw-text-tertiary tw-mt-2" data-testid="detail-truncated">
				{{ truncationNotice }}
			</p>
		</template>
	</div>
</template>

<script>
import { KvLoadingPlaceholder } from '@kiva/kv-components';
import {
	PROMO_CREDIT_FALLBACK_LABEL,
	PROMO_TYPE_LABELS,
	SETTLEMENT_NOTE,
	DETAIL_LIMIT,
} from '#src/util/estimatedRepayments/estimatedRepaymentsConstants';

export default {
	name: 'RepaymentsMonthDetail',
	components: {
		KvLoadingPlaceholder,
	},
	props: {
		/** Human-readable due date, e.g. "July 1, 2026". */
		heading: {
			type: String,
			default: '',
		},
		loading: {
			type: Boolean,
			default: false,
		},
		/** Raw detail rows from expectedRepaymentsDetail. */
		rows: {
			type: Array,
			default: () => [],
		},
		/** True when the detail list hit the server-side cap. */
		truncated: {
			type: Boolean,
			default: false,
		},
		/** Total repaying loans for the month (pre-cap); shown in the truncation notice. */
		totalCount: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			settlementNote: SETTLEMENT_NOTE,
			detailLimit: DETAIL_LIMIT,
		};
	},
	computed: {
		// When we know the true total (loansMakingRepayments), name it so lenders see
		// how many loans are hidden; otherwise fall back to just the cap.
		truncationNotice() {
			const of = this.totalCount > 0 ? ` of ${this.$filters.numeral(this.totalCount, '0,0')}` : '';
			return `Notice: List of repaying loans only displays the first ${this.detailLimit}${of} `
				+ 'in descending order of repayment amount.';
		},
	},
	methods: {
		loanUrl(loanId) {
			return `/lend/${loanId}`;
		},
		isFinal(row) {
			return row.totalRepayments != null && row.pastRepayments === row.totalRepayments;
		},
		promoText(row) {
			if (!row.promoAmount || Number(row.promoAmount) <= 0) {
				return '';
			}
			const type = PROMO_TYPE_LABELS[row.promoType] || PROMO_CREDIT_FALLBACK_LABEL;
			const amount = this.$filters.numeral(row.promoAmount, '$0,0.00');
			return `Includes ${amount} of ${type} (repaid to Kiva or sponsor)`;
		},
	},
};
</script>
