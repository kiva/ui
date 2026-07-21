<template>
	<table class="tw-w-full tw-text-small">
		<thead>
			<tr class="tw-bg-gray-200">
				<th class="tw-px-1 lg:tw-px-2 tw-py-1"></th>
				<th class="tw-text-right tw-font-bold tw-px-1 lg:tw-px-2 tw-py-1">
					My stats
				</th>
				<th class="tw-text-right tw-font-bold tw-px-1 lg:tw-px-2 tw-py-1">
					Avg Kiva lender
				</th>
			</tr>
		</thead>

		<tbody v-if="loading">
			<tr v-for="i in statsRows.length" :key="i">
				<td>
					<kv-loading-placeholder
						class="tw-my-1 !tw-w-15 !tw-h-2.5"
					/>
				</td>
				<td class="tw-text-right tw-my-1">
					<kv-loading-placeholder
						class="tw-ml-auto !tw-w-10 !tw-h-2.5"
					/>
				</td>
				<td class="tw-text-right tw-my-1">
					<kv-loading-placeholder
						class="tw-ml-auto !tw-w-10 !tw-h-2.5"
					/>
				</td>
			</tr>
		</tbody>

		<tbody v-else>
			<tr
				v-for="row in statsRows"
				:key="row.key"
				class="tw-bg-primary"
				:class="{ '!tw-bg-gray-50': row.showInGray }"
			>
				<td class="tw-px-1 lg:tw-px-2 tw-py-1" :class="{ 'tw-pl-3 lg:tw-pl-6': row.isTabbed }">
					<span class="tw-inline-flex tw-items-center tw-gap-0.5">
						<template v-if="row.salesforceId">
							<button
								:id="tooltipTriggerId(row.key)"
								type="button"
								class="tw-inline-flex tw-text-secondary"
								:aria-label="`More information about ${row.label}`"
								:data-testid="`stat-tooltip-trigger-${row.key}`"
							>
								<kv-material-icon
									class="tw-w-2 tw-h-2"
									:icon="mdiInformationOutline"
								/>
							</button>
							<!-- Hover/focus help-text tooltip. Lazy-fetches the solution the first
								time it opens (tool-tip-visible) so initial page load issues none of
								these requests. -->
							<kv-tooltip
								:controller="tooltipTriggerId(row.key)"
								:data-testid="`stat-tooltip-${row.key}`"
								@tool-tip-visible="isVisible => onTooltipVisible(row, isVisible)"
							>
								<template v-if="solutions[row.key]" #title>
									{{ solutions[row.key].name }}
								</template>
								<!-- eslint-disable-next-line vue/no-v-html -->
								<div v-if="solutions[row.key]" v-html="solutions[row.key].note"></div>
								<kv-loading-placeholder
									v-else
									style="width: 10rem; height: 0.875rem;"
								/>
							</kv-tooltip>
						</template>
						<!-- Spacer matching the info-icon button width so labels without a
							tooltip trigger stay left-aligned with those that have one. -->
						<span
							v-else
							class="tw-inline-block tw-w-2.5"
							aria-hidden="true"
						></span>
						{{ row.label }}
					</span>
				</td>
				<td class="tw-text-right tw-px-1 lg:tw-px-2 tw-py-1">
					{{ formatValue(stats[row.key], row.type) }}
				</td>
				<td class="tw-text-right tw-px-1 lg:tw-px-2 tw-py-1">
					{{ formatValue(avgStats[row.key], row.type) }}
				</td>
			</tr>
		</tbody>
	</table>

	<hr class="tw-border-tertiary tw-my-4">

	<div
		class="tw-grid loan-count-grid tw-text-small tw-gap-x-6 tw-gap-y-2"
		role="table"
		aria-label="Loan count statistics"
	>
		<div
			v-for="row in loanCountRows"
			:key="row.key"
			class="tw-flex tw-justify-between tw-gap-x-2 tw-font-medium"
			role="row"
		>
			<div role="cell">
				{{ row.label }}
			</div>
			<div class="tw-text-right" role="cell">
				{{ loanCounts[row.key] }}
			</div>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';
import { mdiInformationOutline } from '@mdi/js';
import lendingStatsQuery from '#src/graphql/query/myPortfolioLoansLendingStats.graphql';
import salesforceQuery from '#src/graphql/query/salesforceQuery.graphql';
import logFormatter from '#src/util/logFormatter';
import { KvLoadingPlaceholder, KvMaterialIcon, KvTooltip } from '@kiva/kv-components';

export default {
	name: 'LoanStatsTable',
	components: {
		KvLoadingPlaceholder,
		KvMaterialIcon,
		KvTooltip
	},
	inject: ['apollo', 'cookieStore'],
	emits: ['updated-as-of'],
	data() {
		return {
			mdiInformationOutline,
			stats: {},
			avgStats: {},
			loading: true,
			// Per-row Salesforce-solution cache. Keyed by row.key; populated the
			// first time a row's tooltip opens so we never issue the 13 requests on page load
			// and never refetch a row already resolved within this component's lifecycle.
			solutions: {},
			// Guards against duplicate in-flight requests if a tooltip re-fires `show` before
			// its fetch resolves. Plain (non-reactive) guard — nothing in the template reads it.
			pendingSolutions: {},
			// isTabbed / showInWhite / showInGray control row grouping: tabbed rows indent
			// under their parent metric, and the explicit white/gray banding groups related
			// rows (replacing the flat migrated grid). salesforceId wires each row's help-text
			// tooltip to lazy-fetch general.salesforceSolution for this id.
			statsRows: [
				{
					label: 'Amount lent',
					key: 'amount_lent',
					type: 'currency',
					salesforceId: '50150000000S8sy',
				},
				{
					label: 'Amount repaid',
					key: 'amount_repaid',
					type: 'currency',
					showInGray: true,
					salesforceId: '50150000000S8tD',
				},
				{
					label: 'Amount lost',
					key: 'amount_lost',
					type: 'currency',
					salesforceId: '50150000000S8tN',
				},
				{
					label: 'Amount refunded',
					key: 'amount_refunded',
					type: 'currency',
					showInGray: true,
					salesforceId: '50150000000cdpF',
				},
				{
					label: 'Delinquency rate',
					key: 'arrears_rate',
					type: 'percentage',
					showInWhite: true,
					salesforceId: '50150000000StY3',
				},
				{
					label: 'Amount in arrears',
					key: 'amount_in_arrears',
					type: 'currency',
					isTabbed: true,
					showInWhite: true,
					salesforceId: '50150000000SQIK',
				},
				{
					label: 'Outstanding loans',
					key: 'amount_outstanding',
					type: 'currency',
					isTabbed: true,
					showInWhite: true,
					salesforceId: '50150000000SQIP',
				},
				{
					label: 'Default rate',
					key: 'default_rate',
					type: 'percentage',
					showInGray: true,
					salesforceId: '50150000000T58V',
				},
				{
					label: 'Amount defaulted',
					key: 'amount_defaulted',
					type: 'currency',
					isTabbed: true,
					showInGray: true,
					salesforceId: '50150000000S8pa',
				},
				{
					label: 'Amount ended',
					key: 'amount_ended',
					type: 'currency',
					isTabbed: true,
					showInGray: true,
					salesforceId: '50150000000S8p1',
				},
				{
					// No salesforceId: the mapped Currency-loss-rate solution (50150000000S8gY)
					// has no help-text content, so we suppress its tooltip trigger entirely
					// rather than show an info icon that opens an empty tooltip.
					label: 'Currency loss rate',
					key: 'currency_loss_rate',
					type: 'currencyLossRate',
					showInWhite: true,
				},
				{
					label: 'Amount of currency loss',
					key: 'currency_loss',
					type: 'currencyLossAmount',
					isTabbed: true,
					showInWhite: true,
					salesforceId: '50150000000S8q9',
				},
				{
					label: 'Currency loss reimbursement',
					key: 'currency_loss_reimbursement',
					type: 'currency',
					isTabbed: true,
					showInWhite: true,
					salesforceId: '5011T000001GRUP',
				}
			],
			loanCounts: {
				fundraising: 0,
				funded: 0,
				payingBack: 0,
				payingBackDelinquent: 0,
				repaid: 0,
				repaidWithCurrencyLoss: 0,
				defaulted: 0,
				refunded: 0,
				expired: 0
			},
			loanCountRows: [
				{ label: 'Fundraising', key: 'fundraising' },
				{ label: 'Funded', key: 'funded' },
				{ label: 'Paying back', key: 'payingBack' },
				{ label: 'Paying back delinquent', key: 'payingBackDelinquent' },
				{ label: 'Repaid', key: 'repaid' },
				{ label: 'Repaid with currency loss', key: 'repaidWithCurrencyLoss' },
				{ label: 'Ended in default', key: 'defaulted' },
				{ label: 'Refunded', key: 'refunded' },
				{ label: 'Expired', key: 'expired' }
			]
		};
	},
	methods: {
		// Stable DOM id for a row's tooltip trigger; KvTooltip anchors to it via `controller`.
		tooltipTriggerId(key) {
			return `loan-stat-tooltip-${key}`;
		},
		// KvTooltip opened or closed (hover/focus). Lazy-fetch the solution the first time it
		// becomes visible so initial page load issues none of these requests.
		onTooltipVisible(row, isVisible) {
			if (isVisible) {
				this.fetchSolution(row);
			}
		},
		// Strip exactly the tags/attrs the legacy SalesforceRelatedHelpTextTrait removed
		// before the note is rendered with v-html: the span/font/blockquote/img/iframe/script
		// element tags (inner text is kept, matching legacy) and any inline style="" attribute.
		// A deterministic mirror of the legacy preg_replace — works identically under SSR, in
		// tests, and in the browser (unlike a DOM-dependent sanitizer), so script/iframe markup
		// can never reach the DOM as live elements.
		sanitizeNote(html) {
			if (!html) {
				return '';
			}
			return String(html)
				.replace(/<\/?(?:span|font|blockquote|img|iframe|script)\b[^>]*>/gi, '')
				.replace(/\s*style=("[^"]*"|'[^']*')/gi, '');
		},
		// Lazy-fetch a row's Salesforce solution the first time its popover opens. Skips the
		// request when the row has no mapped id, when it is already cached, or when a fetch is
		// already in flight — so initial page load issues zero of these requests and each row
		// resolves at most once.
		fetchSolution(row) {
			if (!row.salesforceId) {
				return;
			}
			if (this.solutions[row.key] || this.pendingSolutions[row.key]) {
				return;
			}
			this.pendingSolutions[row.key] = true;
			this.apollo.query({
				query: salesforceQuery,
				variables: { id: row.salesforceId },
			}).then(({ data }) => {
				const solution = data?.general?.salesforceSolution;
				if (solution) {
					this.solutions = {
						...this.solutions,
						[row.key]: {
							name: solution.name ?? '',
							note: this.sanitizeNote(solution.note),
						},
					};
				}
			}).catch(error => {
				logFormatter(`Error fetching salesforce solution for ${row.key}: ${error}`, 'error');
			}).finally(() => {
				delete this.pendingSolutions[row.key];
			});
		},
		formatValue(value, type) {
			// Currency-loss rate/amount mirror the legacy page: they read "Not available"
			// when the backend has no value, instead of falling back to zero.
			const showsNotAvailable = type === 'currencyLossRate' || type === 'currencyLossAmount';

			if (value === undefined || value === null) {
				if (showsNotAvailable) {
					return 'Not available';
				}
				return type === 'percentage' ? '0.00%' : '$0.00';
			}

			const num = Number(value);
			switch (type) {
				case 'currencyLossRate':
					return `${num.toFixed(2)}%`;
				case 'percentage':
					return `${(num * 100).toFixed(2)}%`;
				case 'currencyLossAmount':
					return numeral(Math.abs(num)).format('$0,0.00');
				case 'currency':
				default:
					return numeral(num).format('$0,0.00');
			}
		}
	},
	apollo: {
		query: lendingStatsQuery,
		result({ data }) {
			const userStats = data?.my?.userStats ?? {};
			const kivaStats = data?.general?.kivaStats ?? {};
			// Money scalar values arrive as legacy number_format strings, so amounts of
			// $1,000+ carry thousands separators (e.g. "12,500.00"). Strip any grouping or
			// symbol characters before coercing — otherwise Number() yields NaN and the cell
			// renders "$NaN". Returns null for missing/unparseable values so the row falls
			// back to its "$0.00" / "Not available" display.
			const money = value => {
				if (value === null || value === undefined || value === '') {
					return null;
				}
				const parsed = Number(String(value).replace(/[^0-9.-]/g, ''));
				return Number.isNaN(parsed) ? null : parsed;
			};
			const num = value => money(value) ?? 0;

			this.$emit('updated-as-of', kivaStats.avgLenderStatsUpdatedAt ?? null);

			// The legacy page hides the currency-loss rate/amount together unless both the
			// rate is present and the loss amount is non-null.
			const currencyLossAvailable = userStats.currency_loss_rate !== null
				&& userStats.currency_loss_rate !== undefined
				&& userStats.currency_loss !== null
				&& userStats.currency_loss !== undefined;

			// My stats, applying the legacy row formulas.
			this.stats = {
				amount_lent: money(userStats.amount_of_loans),
				amount_repaid: money(userStats.amount_repaid),
				amount_lost: Math.abs(-num(userStats.amount_defaulted) + num(userStats.currency_loss)),
				amount_refunded: money(userStats.amount_refunded),
				arrears_rate: userStats.arrears_rate,
				amount_in_arrears: money(userStats.amount_in_arrears),
				amount_outstanding: money(userStats.amount_outstanding),
				default_rate: userStats.default_rate,
				amount_defaulted: Math.abs(num(userStats.amount_defaulted)),
				amount_ended: num(userStats.total_ended) + num(userStats.total_defaulted),
				currency_loss_rate: currencyLossAvailable ? userStats.currency_loss_rate : null,
				currency_loss: currencyLossAvailable ? money(userStats.currency_loss) : null,
				currency_loss_reimbursement: money(userStats.currency_loss_reimbursement)
			};

			// Avg Kiva lender stats come from precomputed kivaStats avg* fields.
			const avgDefaulted = money(kivaStats.avgAmountDefaulted);
			this.avgStats = {
				amount_lent: money(kivaStats.avgAmountLent),
				amount_repaid: money(kivaStats.avgAmountRepaid),
				amount_lost: money(kivaStats.avgTotalAmountLost),
				amount_refunded: money(kivaStats.avgAmountRefunded),
				arrears_rate: kivaStats.avgDelinquencyRate ?? null,
				amount_in_arrears: money(kivaStats.avgAmountArrears),
				amount_outstanding: money(kivaStats.avgAmountOutstanding),
				default_rate: kivaStats.avgDefaultRate ?? null,
				amount_defaulted: avgDefaulted === null ? null : Math.abs(avgDefaulted),
				amount_ended: money(kivaStats.avgTotalEnded),
				currency_loss_rate: kivaStats.avgCurrencyLossRate ?? null,
				currency_loss: money(kivaStats.avgCurrencyLoss),
				currency_loss_reimbursement: money(kivaStats.avgCurrencyLossReimbursement)
			};
			this.loading = false;

			// Every status count comes from the my.loans search (Sphinx). On the live path the
			// status buckets are mutually exclusive — `ended` excludes currency-loss ends,
			// `ended_with_loss` is ended-with-currency-loss only, and `defaulted` is separate —
			// so each totalCount maps straight to its row with no subtraction. This matches the
			// legacy getStatusCounts() split (Repaid = ended_without_loss, Repaid with currency
			// loss = ended_with_loss, Ended in default = defaulted) and keeps large lenders off
			// the slow user-stats count path. See MP-2817.
			const count = bucket => bucket?.totalCount ?? 0;
			const my = data?.my ?? {};
			this.loanCounts = {
				fundraising: count(my.fundRaisingLoans),
				funded: count(my.raisedLoans),
				payingBack: count(my.payingBackLoans),
				payingBackDelinquent: count(my.delinquentLoans),
				repaid: count(my.endedLoans),
				repaidWithCurrencyLoss: count(my.endedWithLossLoans),
				defaulted: count(my.defaultedLoans),
				refunded: count(my.refundedLoans),
				expired: count(my.expiredLoans)
			};
		}
	}
};
</script>

<style lang="postcss" scoped>
/* Loan-count summary: a single column on mobile, then three equal-width columns from the md
   breakpoint up. Equal columns (plus the shared tw-gap-x-6 / tw-justify-between on each cell)
   keep the label-to-count spacing and count alignment consistent across every row and column. */
.loan-count-grid {
	grid-template-columns: minmax(0, 1fr);
}

@screen md {
	.loan-count-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}
</style>
