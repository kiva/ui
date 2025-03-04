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
	data() {
		return {
			stats: {},
			avgStats: {},
			loading: true,
			statsRows: [
				{ label: 'Amount lent', key: 'amount_of_loans', type: 'currency' },
				{ label: 'Amount repaid', key: 'amount_repaid', type: 'currency' },
				{ label: 'Amount lost', key: 'amount_defaulted', type: 'currency' },
				{ label: 'Amount refunded', key: 'amount_refunded', type: 'currency' },
				{ label: 'Delinquency rate', key: 'arrears_rate', type: 'percentage' },
				{ label: 'Amount in arrears', key: 'amount_in_arrears', type: 'currency' },
				{ label: 'Outstanding loans', key: 'amount_outstanding', type: 'currency' },
				{ label: 'Default rate', key: 'default_rate', type: 'percentage' },
				{ label: 'Amount defaulted', key: 'amount_defaulted', type: 'currency' },
				{ label: 'Amount ended', key: 'total_ended', type: 'currency' },
				{ label: 'Currency loss rate', key: 'currency_loss_rate', type: 'currencyLossRate' },
				{ label: 'Amount of currency loss', key: 'currency_loss', type: 'currencyNegative' },
				{ label: 'Currency loss reimbursement', key: 'currency_reimbursement', type: 'currency' }
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
			if (value === undefined || value === null) {
				return 'Endpoint TBD';
			}

			if (!value) {
				return type === 'percentage' || type === 'currencyLossRate' ? '0.00%' : '$0.00';
			}

			const num = Number(value);
			switch (type) {
				case 'currencyLossRate':
					return `${num.toFixed(2)}%`;
				case 'percentage':
					return `${(num * 100).toFixed(2)}%`;
				case 'currencyNegative':
					return `$${(num * -1).toFixed(2)}`;
				case 'currency':
				default:
					return `$${num.toFixed(2)}`;
			}
		}
	},
	apollo: {
		query: lendingStatsQuery,
		result({ data }) {
			this.stats = data?.my?.userStats ?? {};
			this.avgStats = {};
			this.loading = false;

			// Update loan counts from stats
			this.loanCounts = {
				fundraising: this.stats.num_fund_raising || 0,
				funded: this.stats.num_raised || 0,
				payingBack: this.stats.num_paying_back || 0,
				payingBackDelinquent: this.stats.number_delinquent || 0,
				repaid: this.stats.num_ended - (this.stats.currency_loss ? 1 : 0) || 0,
				repaidWithCurrencyLoss: this.stats.currency_loss ? 1 : 0,
				defaulted: this.stats.num_defaulted || 0,
				refunded: this.stats.num_refunded || 0,
				expired: this.stats.num_expired || 0
			};
		}
	}
};
</script>
