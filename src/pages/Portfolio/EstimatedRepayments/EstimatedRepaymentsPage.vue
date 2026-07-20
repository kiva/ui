<template>
	<PortfolioShell>
		<div class="tw-rounded md:tw-bg-primary tw-p-2 tw-py-3 md:tw-p-3">
			<h1 class="tw-mb-1">
				Estimated repayments
			</h1>

			<!-- Loading -->
			<KvLoadingPlaceholder v-if="loading" style="height: 320px;" data-testid="repayments-loading" />

			<!-- Error / unable to compute (covers the legacy large-portfolio bail) -->
			<div v-else-if="loadError" data-testid="repayments-load-error">
				<p>
					We couldn't calculate your estimated repayments right now. Accounts with very large
					portfolios may not be able to display an estimate.
				</p>
				<KvButton
					class="tw-mt-2"
					@click="fetchRepayments"
					v-kv-track-event="['portfolio', 'click', 'Estimated repayments retry load']"
				>
					Try again
				</KvButton>
			</div>

			<!-- Empty state -->
			<div v-else-if="!months.length" data-testid="repayments-empty">
				<p>You don't have any upcoming repayments scheduled.</p>
				<KvButton
					to="/lend/filter"
					class="tw-mt-2"
					v-kv-track-event="['portfolio', 'click', 'Estimated repayments empty find a loan']"
				>
					Find a loan
				</KvButton>
			</div>

			<template v-else>
				<KvStackedBarGraph
					class="tw-mb-3"
					:points="chartPoints"
					:series="series"
					:format-value="value => $filters.numeral(value, '$0,0.00')"
					title="Estimated repayments by month, split by where each repayment is returned"
					axis-label="Estimated repayments by month"
					bar-action-label="Select to view repayments for this month."
					@bar-click="onChartBarClick"
				/>

				<!-- On mobile the tables (and the disclaimer below) sit on a white surface
					that spans the rest of the page, while the graph above stays on the page
					background. On md+ the whole section is already a white card, so the
					mobile-only background/bleed resets to transparent. -->
				<div
					class="
						tw-grid tw-grid-cols-12 tw-gap-3
						tw-bg-primary tw--mx-2 tw-px-2 tw-pt-3
						md:tw-bg-transparent md:tw-mx-0 md:tw-px-0 md:tw-pt-0
					"
				>
					<div class="tw-col-span-12 lg:tw-col-span-4 tw-min-w-0">
						<RepaymentsSummaryTable
							:months="months"
							:selected="selectedMonth"
							@select="onSelectMonth"
						/>
					</div>
					<div class="tw-col-span-12 lg:tw-col-span-8 tw-min-w-0">
						<RepaymentsMonthDetail
							:heading="selectedMonth ? selectedMonth.dueLabel : ''"
							:loading="detailLoading"
							:rows="detailRows"
							:truncated="detailTruncated"
							:total-count="selectedMonth ? selectedMonth.loansMakingRepayments : 0"
						/>
					</div>
				</div>
			</template>

			<!-- tw-overflow-hidden establishes a block formatting context so the
				disclaimer's own top margin stays inside this white surface (rather than
				collapsing through the top and showing the page background between the
				tables and the disclaimer on mobile). -->
			<div
				v-if="!loading && !loadError"
				class="
					tw-overflow-hidden tw-bg-primary tw--mx-2 tw-px-2 tw-pb-3 tw--mb-3
					md:tw-overflow-visible md:tw-bg-transparent md:tw-mx-0 md:tw-px-0 md:tw-pb-0 md:tw-mb-0
				"
			>
				<RepaymentsDisclaimer />
			</div>
		</div>
	</PortfolioShell>
</template>

<script>
import { format } from 'date-fns';
import { KvButton, KvLoadingPlaceholder, KvStackedBarGraph } from '@kiva/kv-components';
import PortfolioShell from '#src/components/WwwFrame/PortfolioShell';
import RepaymentsSummaryTable from '#src/components/Portfolio/EstimatedRepayments/RepaymentsSummaryTable';
import RepaymentsMonthDetail from '#src/components/Portfolio/EstimatedRepayments/RepaymentsMonthDetail';
import RepaymentsDisclaimer from '#src/components/Portfolio/EstimatedRepayments/RepaymentsDisclaimer';
import logFormatter from '#src/util/logFormatter';
import expectedRepaymentsQuery from '#src/graphql/query/portfolio/estimatedRepayments.graphql';
import expectedRepaymentsDetailQuery from '#src/graphql/query/portfolio/estimatedRepaymentsDetail.graphql';
import {
	REPAYMENT_SERIES,
	DETAIL_LIMIT,
} from '#src/util/estimatedRepayments/estimatedRepaymentsConstants';

// Parse the Date scalar (may arrive as 'YYYY-MM-DD', ISO string, or unix seconds)
// into calendar parts without letting timezone shift the month.
function parseRepaymentDate(raw) {
	if (raw == null) {
		return null;
	}
	const isoMatch = typeof raw === 'string' && raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
	if (isoMatch) {
		return { year: Number(isoMatch[1]), month: Number(isoMatch[2]) };
	}
	const numeric = Number(raw);
	const date = Number.isNaN(numeric) ? new Date(raw) : new Date(numeric * 1000);
	if (Number.isNaN(date.getTime())) {
		return null;
	}
	return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
}

export default {
	name: 'EstimatedRepaymentsPage',
	head() {
		return {
			title: 'Estimated Repayments',
		};
	},
	components: {
		PortfolioShell,
		KvButton,
		KvLoadingPlaceholder,
		KvStackedBarGraph,
		RepaymentsSummaryTable,
		RepaymentsMonthDetail,
		RepaymentsDisclaimer,
	},
	inject: ['apollo'],
	data() {
		return {
			series: REPAYMENT_SERIES,
			loading: true,
			loadError: false,
			months: [],
			selectedMonth: null,
			detailLoading: false,
			detailRows: [],
			detailTruncated: false,
		};
	},
	computed: {
		// The graph shows a 12-month window anchored to the FIRST repayment month
		// (inclusive of both endpoints → up to 13 bars), matching legacy behavior.
		// Anchoring to the first repayment month rather than "now" keeps the final
		// month visible when repayments start next month (e.g. today is the 17th and
		// the 1st has already passed). It stays readable no matter how long the full schedule
		// is; the summary table below still lists every month. Because repayment
		// months are chronological, this is always a leading prefix of `months`.
		chartMonths() {
			if (!this.months.length) {
				return [];
			}
			const first = this.months[0];
			// first.month is 1-12; +12 months lands on the same month next year.
			const cutoffYear = first.year + 1;
			const cutoffMonth = first.month;
			return this.months.filter(
				m => m.year < cutoffYear || (m.year === cutoffYear && m.month <= cutoffMonth),
			);
		},
		chartPoints() {
			return this.chartMonths.map(m => ({
				label: m.chartLabel,
				segments: [
					{ seriesKey: 'user', value: m.userRepayments },
					{ seriesKey: 'promo', value: m.promoRepayments },
				],
			}));
		},
	},
	methods: {
		// Clicking a bar selects that month and records the interaction.
		onChartBarClick(index) {
			// Index into chartMonths (the one-year window the graph renders), not
			// the full months list, so the clicked bar maps to the right month.
			const month = this.chartMonths[index];
			if (!month) {
				return;
			}
			this.$kvTrackEvent('portfolio', 'click', 'Estimated repayments chart bar', month.monthLabel);
			this.onSelectMonth(month);
		},
		async fetchRepayments() {
			this.loading = true;
			this.loadError = false;
			try {
				const response = await this.apollo.query({
					query: expectedRepaymentsQuery,
					fetchPolicy: 'network-only',
				});
				const list = response?.data?.my?.userAccount?.expectedRepayments;
				if (!Array.isArray(list)) {
					this.loadError = true;
					return;
				}
				this.months = this.buildMonths(list);
				if (this.months.length) {
					this.onSelectMonth(this.months[0]);
				}
			} catch (error) {
				this.loadError = true;
				logFormatter(`Error fetching estimated repayments: ${error}`, 'error');
			} finally {
				this.loading = false;
			}
		},
		buildMonths(list) {
			let lastYear = null;
			return list
				.map(item => {
					const parts = parseRepaymentDate(item.repaymentDate);
					if (!parts) {
						return null;
					}
					const userRepayments = Number(item.userRepayments) || 0;
					const promoRepayments = Number(item.promoRepayments) || 0;
					// Build the Date from the already-parsed integer parts (local constructor,
					// day 1) so formatting can't reintroduce the UTC-parse timezone shift that
					// parseRepaymentDate avoids.
					const date = new Date(parts.year, parts.month - 1, 1);
					return {
						year: parts.year,
						month: parts.month,
						userRepayments,
						promoRepayments,
						total: userRepayments + promoRepayments,
						loansMakingRepayments: item.loansMakingRepayments ?? 0,
						monthLabel: format(date, 'MMM'),
						chartLabel: format(date, "MMM ''yy"),
						dueLabel: format(date, 'MMM d, yyyy'),
					};
				})
				.filter(Boolean)
				.map(month => {
					const showYearHeader = month.year !== lastYear;
					lastYear = month.year;
					return { ...month, showYearHeader };
				});
		},
		async onSelectMonth(month) {
			this.selectedMonth = month;
			this.detailLoading = true;
			this.detailRows = [];
			this.detailTruncated = false;
			try {
				const response = await this.apollo.query({
					query: expectedRepaymentsDetailQuery,
					// Pass the cap explicitly so the truncation check below stays correct
					// even if the resolver's default limit changes.
					variables: { year: month.year, month: month.month, limit: DETAIL_LIMIT },
					fetchPolicy: 'network-only',
				});
				// The queries are network-only and unguarded, so responses can resolve
				// out of order (e.g. click Aug while Jul is still in flight). Discard any
				// response whose month is no longer selected so it can't overwrite the
				// current month's rows.
				if (this.selectedMonth !== month) {
					return;
				}
				const rows = response?.data?.my?.userAccount?.expectedRepaymentsDetail ?? [];
				this.detailRows = rows;
				// The list length maxes out at the server cap, so it can't reveal truncation
				// on its own. loansMakingRepayments (from the summary query, same filters) is
				// the true pre-cap total: flag truncation only when we filled the cap and the
				// total exceeds it.
				this.detailTruncated = rows.length >= DETAIL_LIMIT
					&& (month.loansMakingRepayments ?? 0) > DETAIL_LIMIT;
			} catch (error) {
				// A stale request that errored must not wipe the current month's rows.
				if (this.selectedMonth !== month) {
					return;
				}
				this.detailRows = [];
				logFormatter(`Error fetching estimated repayment detail: ${error}`, 'error');
			} finally {
				// Only the request for the still-selected month owns the spinner; a stale
				// request returning early must not clear it for the newer in-flight one.
				if (this.selectedMonth === month) {
					this.detailLoading = false;
				}
			}
		},
	},
	mounted() {
		this.fetchRepayments();
	},
};
</script>
