<template>
	<www-page>
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>
		<kv-page-container>
			<kv-grid class="tw-grid-cols-12">
				<the-portfolio-tertiary-menu class="tw-pt-2 tw-col-span-3 tw-hidden md:tw-block" />
				<div
					class="tw-col-span-12 md:tw-col-span-9 tw-pt-4
					md:tw-pt-6 lg:tw-pt-8"
				>
					<h1 class="tw-mb-2">
						My loans
					</h1>
					<div class="tw-mb-2">
						<p class="tw-text-right tw-text-tertiary tw-text-small">
							*Updated as of {{ lastUpdated }}
						</p>
						<loan-stats-table />
					</div>
				</div>
				<div
					class="tw-col-span-12"
				>
					<loan-filter-bar :total-loans="totalLoans" />
					<loan-list :loans="loans" :loading="loading" />
				</div>
			</kv-grid>
		</kv-page-container>
	</www-page>
</template>

<script>
import WwwPage from '#src/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '#src/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import ThePortfolioTertiaryMenu from '#src/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';
import { KvPageContainer, KvGrid } from '@kiva/kv-components';

import logFormatter from '#src/util/logFormatter';
import LoanStatsTable from '#src/components/Portfolio/LoanStatsTable';
import LoanFilterBar from '#src/components/Portfolio/LoanFilterBar';
import LoanList from '#src/components/Portfolio/LoanList';
import myLoansQuery from '#src/graphql/query/portfolio/myLoans.graphql';

export default {
	name: 'LoansPage',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		TheMyKivaSecondaryMenu,
		ThePortfolioTertiaryMenu,
		KvGrid,
		KvPageContainer,
		LoanStatsTable,
		LoanFilterBar,
		LoanList
	},
	data() {
		return {
			lastUpdated: '(Endpoint TBD)',
			loans: [],
			totalLoans: 0,
			loading: true,
			stats: {
				loanStatuses: {
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
			}
		};
	},
	mounted() {
		this.apollo.query({
			query: myLoansQuery,
			fetchPolicy: 'network-only'
		}).then(({ data }) => {
			if (data?.my?.loans) {
				this.loans = data.my.loans.values || [];
				this.totalLoans = data.my.loans.totalCount;
			}
		}).catch(error => {
			logFormatter(`Error fetching loans: ${error}`, 'error');
		}).finally(() => {
			this.loading = false;
		});
	}
};
</script>
