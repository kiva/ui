<template>
	<table class="tw-w-full">
		<thead>
			<tr class="tw-bg-gray-200">
				<th class="tw-flex-1 tw-p-2"></th>
				<th class="tw-flex-1 tw-text-right tw-font-medium tw-p-2">
					My stats
				</th>
				<th class="tw-flex-1 tw-text-right tw-font-medium tw-p-2">
					Avg Kiva lender
				</th>
			</tr>
		</thead>

		<tbody v-if="loading">
			<tr v-for="i in 5" :key="i">
				<td>
					<kv-loading-placeholder
						class="tw-my-1"
						style="width: 120px; height: 16px;"
					/>
				</td>
				<td class="tw-text-right tw-my-1">
					<kv-loading-placeholder
						class="tw-ml-auto"
						style="width: 80px; height: 16px;"
					/>
				</td>
				<td class="tw-text-right tw-my-1">
					<kv-loading-placeholder
						class="tw-ml-auto"
						style="width: 80px; height: 16px;"
					/>
				</td>
			</tr>
		</tbody>

		<tbody v-else>
			<tr v-for="row in statsRows" :key="row.key">
				<td class="tw-p-1">
					{{ row.label }}
				</td>
				<td class="tw-text-right tw-p-1">
					{{ formatValue(stats[row.key], row.type) }}
				</td>
				<td class="tw-text-right tw-p-1">
					{{ formatValue(avgStats[row.key], row.type) }}
				</td>
			</tr>
		</tbody>
	</table>

	<hr class="tw-border-tertiary tw-my-4">

	<div
		class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-2"
		role="table"
		aria-label="Loan count statistics"
	>
		<div
			v-for="row in loanCountRows"
			:key="row.key"
			class="tw-grid tw-grid-cols-6 tw-gap-0 tw-font-medium"
			role="row"
		>
			<div
				class="tw-col-span-4"
				role="cell"
			>
				{{ row.label }}
			</div>
			<div
				class="tw-col-span-2 tw-text-right"
				role="cell"
			>
				{{ loanCounts[row.key] }}
			</div>
		</div>
	</div>
</template>

<script>
import lendingStatsQuery from '#src/graphql/query/myPortfolioLoansLendingStats.graphql';
import { KvLoadingPlaceholder } from '@kiva/kv-components';

export default {
	name: 'LoanStatsTable',
	components: {
		KvLoadingPlaceholder
	},
	inject: ['apollo', 'cookieStore'],
	emits: ['updated-as-of'],
	data() {
		return {
			stats: {},
			avgStats: {},
			loading: true,
			statsRows: [
				{ label: 'Amount lent', key: 'amount_lent', type: 'currency' },
				{ label: 'Amount repaid', key: 'amount_repaid', type: 'currency' },
				{ label: 'Amount lost', key: 'amount_lost', type: 'currency' },
				{ label: 'Amount refunded', key: 'amount_refunded', type: 'currency' },
				{ label: 'Delinquency rate', key: 'arrears_rate', type: 'percentage' },
				{ label: 'Amount in arrears', key: 'amount_in_arrears', type: 'currency' },
				{ label: 'Outstanding loans', key: 'amount_outstanding', type: 'currency' },
				{ label: 'Default rate', key: 'default_rate', type: 'percentage' },
				{ label: 'Amount defaulted', key: 'amount_defaulted', type: 'currency' },
				{ label: 'Amount ended', key: 'amount_ended', type: 'currency' },
				{ label: 'Currency loss rate', key: 'currency_loss_rate', type: 'currencyLossRate' },
				{ label: 'Amount of currency loss', key: 'currency_loss', type: 'currencyLossAmount' },
				{ label: 'Currency loss reimbursement', key: 'currency_loss_reimbursement', type: 'currency' }
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
					return `$${Math.abs(num).toFixed(2)}`;
				case 'currency':
				default:
					return `$${num.toFixed(2)}`;
			}
		}
	},
	apollo: {
		query: lendingStatsQuery,
		result({ data }) {
			const userStats = data?.my?.userStats ?? {};
			const kivaStats = data?.general?.kivaStats ?? {};
			const num = value => (value === null || value === undefined ? 0 : Number(value));

			this.$emit('updated-as-of', kivaStats.avgLenderStatsUpdatedAt ?? null);

			// The legacy page hides the currency-loss rate/amount together unless both the
			// rate is present and the loss amount is non-null.
			const currencyLossAvailable = userStats.currency_loss_rate !== null
				&& userStats.currency_loss_rate !== undefined
				&& userStats.currency_loss !== null
				&& userStats.currency_loss !== undefined;

			// My stats, applying the legacy row formulas.
			this.stats = {
				amount_lent: userStats.amount_of_loans,
				amount_repaid: userStats.amount_repaid,
				amount_lost: Math.abs(-num(userStats.amount_defaulted) + num(userStats.currency_loss)),
				amount_refunded: userStats.amount_refunded,
				arrears_rate: userStats.arrears_rate,
				amount_in_arrears: userStats.amount_in_arrears,
				amount_outstanding: userStats.amount_outstanding,
				default_rate: userStats.default_rate,
				amount_defaulted: Math.abs(num(userStats.amount_defaulted)),
				amount_ended: num(userStats.total_ended) + num(userStats.total_defaulted),
				currency_loss_rate: currencyLossAvailable ? userStats.currency_loss_rate : null,
				currency_loss: currencyLossAvailable ? userStats.currency_loss : null,
				currency_loss_reimbursement: userStats.currency_loss_reimbursement
			};

			// Avg Kiva lender stats come from precomputed kivaStats avg* fields.
			this.avgStats = {
				amount_lent: kivaStats.avgAmountLent ?? null,
				amount_repaid: kivaStats.avgAmountRepaid ?? null,
				amount_lost: kivaStats.avgTotalAmountLost ?? null,
				amount_refunded: kivaStats.avgAmountRefunded ?? null,
				arrears_rate: kivaStats.avgDelinquencyRate ?? null,
				amount_in_arrears: kivaStats.avgAmountArrears ?? null,
				amount_outstanding: kivaStats.avgAmountOutstanding ?? null,
				default_rate: kivaStats.avgDefaultRate ?? null,
				amount_defaulted: kivaStats.avgAmountDefaulted == null
					? null
					: Math.abs(Number(kivaStats.avgAmountDefaulted)),
				amount_ended: kivaStats.avgTotalEnded ?? null,
				currency_loss_rate: kivaStats.avgCurrencyLossRate ?? null,
				currency_loss: kivaStats.avgCurrencyLoss ?? null,
				currency_loss_reimbursement: kivaStats.avgCurrencyLossReimbursement ?? null
			};
			this.loading = false;

			// The ended-with-currency-loss count is not exposed on userStats, so we derive it
			// from the loans search the way the legacy getStatusCounts() does. The search's
			// `ended_with_loss` status filter resolves to `defaulted OR (ended AND currency loss)`,
			// so it also matches every defaulted loan; subtract the defaulted bucket (same search
			// source) to recover just the ended-with-currency-loss loans. "Repaid" is then the
			// remaining ended loans: ended total - ended-with-loss.
			const endedTotal = data?.my?.endedLoans?.totalCount ?? 0;
			const endedWithLossOrDefaulted = data?.my?.endedWithLossLoans?.totalCount ?? 0;
			const searchedDefaulted = data?.my?.defaultedLoans?.totalCount ?? 0;
			const endedWithLoss = Math.max(endedWithLossOrDefaulted - searchedDefaulted, 0);

			// Update loan counts. Note this table mixes two sources: the ended-state rows
			// (repaid, repaidWithCurrencyLoss, defaulted) are derived together from the loans
			// search so they reconcile against one snapshot (ended total = repaid + with-loss,
			// and defaulted shares that source), while the unrelated rows come from userStats
			// num_* counts. A future backend loanStatusCounts field would let the whole table
			// come from a single source (see legacy API::user()->getStatusCounts()).
			this.loanCounts = {
				fundraising: userStats.num_fund_raising || 0,
				funded: userStats.num_raised || 0,
				payingBack: userStats.num_paying_back || 0,
				payingBackDelinquent: userStats.number_delinquent || 0,
				repaid: Math.max(endedTotal - endedWithLoss, 0),
				repaidWithCurrencyLoss: endedWithLoss,
				defaulted: searchedDefaulted,
				refunded: userStats.num_refunded || 0,
				expired: userStats.num_expired || 0
			};
		}
	}
};
</script>
