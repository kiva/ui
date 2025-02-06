<template>
	<div class="tw-mb-4">
		<div class="tw-flex tw-justify-between tw-mb-2 tw-bg-[#efefef] tw-p-2">
			<div class="tw-flex-1"></div>
			<div class="tw-flex-1 tw-text-right tw-font-medium">
				My stats
			</div>
			<div class="tw-flex-1 tw-text-right tw-font-medium">
				Avg Kiva lender
			</div>
		</div>

		<div class="tw-space-y-2">
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Amount lent
				</div>
				<div class="tw-col-span-4 tw-text-right">
					{{ stats.amount_of_loans ? `$${Number(stats.amount_of_loans).toFixed(2)}` : '$0.00' }}
				</div>
				<div class="tw-col-span-4 tw-text-right">
					Endpoint TBD
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Amount repaid
				</div>
				<div class="tw-col-span-4 tw-text-right">
					{{ stats.amount_repaid ? `$${Number(stats.amount_repaid).toFixed(2)}` : '$0.00' }}
				</div>
				<div class="tw-col-span-4 tw-text-right">
					Endpoint TBD
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Amount lost
				</div>
				<div class="tw-col-span-4 tw-text-right">
					{{ stats.amount_defaulted ? `$${Number(stats.amount_defaulted).toFixed(2)}` : '$0.00' }}
				</div>
				<div class="tw-col-span-4 tw-text-right">
					Endpoint TBD
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Amount refunded
				</div>
				<div class="tw-col-span-4 tw-text-right">
					{{ stats.amount_refunded ? `$${Number(stats.amount_refunded).toFixed(2)}` : '$0.00' }}
				</div>
				<div class="tw-col-span-4 tw-text-right">
					Endpoint TBD
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Delinquency rate
				</div>
				<div class="tw-col-span-4 tw-text-right">
					{{ stats.arrears_rate ? `${(Number(stats.arrears_rate) * 100).toFixed(2)}%` : '0.00%' }}
				</div>
				<div class="tw-col-span-4 tw-text-right">
					Endpoint TBD
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Amount in arrears
				</div>
				<div class="tw-col-span-4 tw-text-right">
					{{ stats.amount_in_arrears ? `$${Number(stats.amount_in_arrears).toFixed(2)}` : '$0.00' }}
				</div>
				<div class="tw-col-span-4 tw-text-right">
					Endpoint TBD
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Outstanding loans
				</div>
				<div class="tw-col-span-4 tw-text-right">
					{{ stats.amount_outstanding ? `$${Number(stats.amount_outstanding).toFixed(2)}` : '$0.00' }}
				</div>
				<div class="tw-col-span-4 tw-text-right">
					Endpoint TBD
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Default rate
				</div>
				<div class="tw-col-span-4 tw-text-right">
					{{ stats.default_rate ? `${(Number(stats.default_rate) * 100).toFixed(2)}%` : '0.00%' }}
				</div>
				<div class="tw-col-span-4 tw-text-right">
					Endpoint TBD
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Amount defaulted
				</div>
				<div class="tw-col-span-4 tw-text-right">
					{{ stats.amount_defaulted ? `$${Number(stats.amount_defaulted).toFixed(2)}` : '$0.00' }}
				</div>
				<div class="tw-col-span-4 tw-text-right">
					Endpoint TBD
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Amount ended
				</div>
				<div class="tw-col-span-4 tw-text-right">
					{{ stats.total_ended ? `$${Number(stats.total_ended).toFixed(2)}` : '$0.00' }}
				</div>
				<div class="tw-col-span-4 tw-text-right">
					Endpoint TBD
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Currency loss rate
				</div>
				<div class="tw-col-span-4 tw-text-right">
					{{ stats.currency_loss_rate ? `${Number(stats.currency_loss_rate).toFixed(2)}%` : '0.00%' }}
				</div>
				<div class="tw-col-span-4 tw-text-right">
					Endpoint TBD
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Amount of currency loss
				</div>
				<div class="tw-col-span-4 tw-text-right">
					{{ stats.currency_loss ? `$${(Number(stats.currency_loss) * -1).toFixed(2)}` : '$0.00' }}
				</div>
				<div class="tw-col-span-4 tw-text-right">
					Endpoint TBD
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Currency loss reimbursement
				</div>
				<div class="tw-col-span-4 tw-text-right">
					Endpoint TBD
				</div>
				<div class="tw-col-span-4 tw-text-right">
					Endpoint TBD
				</div>
			</div>
		</div>

		<hr class="tw-border-tertiary tw-my-4">

		<div class="tw-grid tw-grid-cols-6 md:tw-grid-cols-12 tw-gap-0 md:tw-gap-4 tw-font-medium">
			<div class="tw-col-span-4">
				Fundraising
			</div>
			<div class="tw-col-span-2 tw-text-right">
				{{ loanCounts.fundraising }}
			</div>
			<div class="md:tw-col-span-4 tw-col-span-4">
				Funded
			</div>
			<div class="md:tw-col-span-2 tw-col-span-2 tw-text-right">
				{{ loanCounts.funded }}
			</div>
		</div>
		<div class="tw-grid tw-grid-cols-6 md:tw-grid-cols-12 tw-gap-0 md:tw-gap-4 tw-font-medium">
			<div class="tw-col-span-4">
				Paying back
			</div>
			<div class="tw-col-span-2 tw-text-right">
				{{ loanCounts.payingBack }}
			</div>
			<div class="md:tw-col-span-4 tw-col-span-4">
				Paying back delinquent
			</div>
			<div class="md:tw-col-span-2 tw-col-span-2 tw-text-right">
				{{ loanCounts.payingBackDelinquent }}
			</div>
		</div>
		<div class="tw-grid tw-grid-cols-6 md:tw-grid-cols-12 tw-gap-0 md:tw-gap-4 tw-font-medium">
			<div class="tw-col-span-4">
				Repaid
			</div>
			<div class="tw-col-span-2 tw-text-right">
				{{ loanCounts.repaid }}
			</div>
			<div class="md:tw-col-span-4 tw-col-span-4">
				Repaid with currency loss
			</div>
			<div class="md:tw-col-span-2 tw-col-span-2 tw-text-right">
				{{ loanCounts.repaidWithCurrencyLoss }}
			</div>
		</div>
		<div class="tw-grid tw-grid-cols-6 md:tw-grid-cols-12 tw-gap-0 md:tw-gap-4 tw-font-medium">
			<div class="tw-col-span-4">
				Ended in default
			</div>
			<div class="tw-col-span-2 tw-text-right">
				{{ loanCounts.defaulted }}
			</div>
			<div class="md:tw-col-span-4 tw-col-span-4">
				Refunded
			</div>
			<div class="md:tw-col-span-2 tw-col-span-2 tw-text-right">
				{{ loanCounts.refunded }}
			</div>
		</div>
		<div class="tw-grid tw-grid-cols-6 md:tw-grid-cols-12 tw-gap-0 md:tw-gap-4 tw-font-medium">
			<div class="tw-col-span-4">
				Expired
			</div>
			<div class="tw-col-span-2 tw-text-right">
				{{ loanCounts.expired }}
			</div>
			<div class="md:tw-col-span-4 tw-col-span-4"></div>
			<div class="md:tw-col-span-2 tw-col-span-2"></div>
		</div>
		<hr class="tw-border-tertiary tw-my-4">
	</div>
</template>

<script>
import lendingStatsQuery from '#src/graphql/query/myLendingStats.graphql';

export default {
	name: 'LoanStatsTable',
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			stats: {},
			loading: true,
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
			}
		};
	},
	apollo: {
		query: lendingStatsQuery,
		result({ data }) {
			this.stats = data?.my?.userStats ?? {};

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

			this.loading = false;
		}
	}
};
</script>
