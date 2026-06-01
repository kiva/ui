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
					<h1 class="tw-text-display tw-mb-2">
						My loans
					</h1>
					<div class="tw-mb-2">
						<p v-if="lastUpdated" class="tw-text-right tw-text-tertiary tw-text-small">
							*Updated as of {{ lastUpdated }}
						</p>
						<loan-stats-table @updated-as-of="handleUpdatedAsOf" />
					</div>
				</div>
				<div
					class="tw-col-span-12"
				>
					<loan-filter-bar
						:countries="filterOptions.countries"
						:filters="loanState.filters"
						:keyword-search="loanState.keywordSearch"
						:partners="filterOptions.partners"
						:total-loans="totalLoans"
						@filters-changed="handleFiltersChanged"
					/>
					<div ref="loanTableTop">
						<loan-list :loans="loans" :loading="loading" />
					</div>
					<kv-pagination
						v-if="showPagination"
						class="tw-mt-3"
						:class="{ 'tw-pointer-events-none tw-opacity-low': loading }"
						:limit="loanState.limit"
						:offset="loanState.offset"
						:aria-disabled="loading ? 'true' : undefined"
						:scroll-to-top="false"
						:total="totalLoans"
						@page-changed="handlePageChange"
					/>
				</div>
			</kv-grid>
		</kv-page-container>
	</www-page>
</template>

<script>
import WwwPage from '#src/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '#src/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import ThePortfolioTertiaryMenu from '#src/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';
import { KvPageContainer, KvGrid, KvPagination } from '@kiva/kv-components';

import logFormatter from '#src/util/logFormatter';
import LoanStatsTable from '#src/components/Portfolio/LoanStatsTable';
import LoanFilterBar from '#src/components/Portfolio/LoanFilterBar';
import LoanList from '#src/components/Portfolio/LoanList';
import myLoansQuery from '#src/graphql/query/portfolio/myLoans.graphql';

const PAGE_LIMIT = 20;

const sortByName = values => [...(values || [])].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

export default {
	name: 'LoansPage',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		TheMyKivaSecondaryMenu,
		ThePortfolioTertiaryMenu,
		KvGrid,
		KvPageContainer,
		KvPagination,
		LoanStatsTable,
		LoanFilterBar,
		LoanList
	},
	data() {
		return {
			lastUpdated: '',
			loans: [],
			totalLoans: 0,
			loading: true,
			loanState: {
				offset: 0,
				limit: PAGE_LIMIT,
				filters: {},
				keywordSearch: null,
			},
			filterOptions: {
				countries: [],
				partners: [],
			},
			filterOptionsLoaded: false,
			loanRequestSequence: 0,
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
	computed: {
		showPagination() {
			return this.totalLoans > this.loanState.limit;
		},
	},
	mounted() {
		this.fetchLoans();
	},
	methods: {
		buildLoanQueryVariables() {
			const variables = {
				offset: this.loanState.offset,
				limit: this.loanState.limit,
				includeFilterOptions: !this.filterOptionsLoaded,
			};

			if (Object.keys(this.loanState.filters).length) {
				variables.filters = this.loanState.filters;
			}

			if (this.loanState.keywordSearch) {
				variables.keywordSearch = this.loanState.keywordSearch;
			}

			return variables;
		},
		fetchLoans({ clearLoans = false } = {}) {
			const requestSequence = this.loanRequestSequence + 1;
			this.loanRequestSequence = requestSequence;
			this.loading = true;
			if (clearLoans) {
				this.loans = [];
			}
			return this.apollo.query({
				query: myLoansQuery,
				variables: this.buildLoanQueryVariables(),
				fetchPolicy: 'network-only'
			}).then(({ data }) => {
				if (requestSequence !== this.loanRequestSequence) {
					return;
				}
				if (data?.my?.lendingStats) {
					this.filterOptions = {
						countries: sortByName(data.my.lendingStats.countriesLentTo),
						partners: sortByName(data.my.lendingStats.partnersLentTo),
					};
					this.filterOptionsLoaded = true;
				}
				if (data?.my?.loans) {
					this.loans = data.my.loans.values || [];
					this.totalLoans = data.my.loans.totalCount;
				}
			}).catch(error => {
				if (requestSequence !== this.loanRequestSequence) {
					return;
				}
				logFormatter(`Error fetching loans: ${error}`, 'error');
			}).finally(() => {
				if (requestSequence === this.loanRequestSequence) {
					this.loading = false;
				}
			});
		},
		handlePageChange({ pageOffset }) {
			if (this.loading) {
				return undefined;
			}
			this.loanState = {
				...this.loanState,
				offset: pageOffset,
			};
			this.scrollToLoanTable();
			return this.fetchLoans({ clearLoans: true });
		},
		handleUpdatedAsOf(iso) {
			if (!iso) {
				this.lastUpdated = '';
				return;
			}
			const d = new Date(iso);
			if (Number.isNaN(d.getTime())) {
				this.lastUpdated = '';
				return;
			}
			const datePart = d.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			});
			const timePart = d.toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: true,
			}).toLowerCase();
			this.lastUpdated = `${datePart} ${timePart}`;
		},
		handleFiltersChanged({ filters = {}, keywordSearch = null }) {
			this.loanState = {
				...this.loanState,
				offset: 0,
				filters,
				keywordSearch,
			};
			return this.fetchLoans({ clearLoans: true });
		},
		scrollToLoanTable() {
			this.$refs.loanTableTop?.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		},
	}
};
</script>
