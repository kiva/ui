<template>
	<portfolio-shell>
		<div class="tw-rounded-none md:tw-rounded-t tw-py-3 md:tw-pb-0 tw-px-2 md:tw-px-3 md:tw-bg-primary">
			<h1>
				Transactions
			</h1>
		</div>
		<div
			class="tw-rounded-none md:tw-rounded-b tw-py-3 tw-px-2 md:tw-px-3 md:tw-bg-primary"
		>
			<transaction-filter-bar
				:filters="transactionState.filters"
				:keyword-search="transactionState.keywordSearch"
				:total-transactions="totalTransactions"
				@filters-changed="handleFiltersChanged"
			/>
			<div ref="transactionTableTop">
				<transaction-list
					:transactions="transactions"
					:loading="loading"
					:has-error="loadError"
					:has-any-transactions="hasAnyTransactions"
				/>
			</div>
			<kv-pagination
				v-if="showPagination"
				class="tw-mt-3"
				:class="{ 'tw-pointer-events-none tw-opacity-low': loading }"
				:limit="transactionState.limit"
				:offset="transactionState.offset"
				:aria-disabled="loading ? 'true' : undefined"
				:scroll-to-top="false"
				:total="totalTransactions"
				@page-changed="handlePageChange"
			/>
		</div>
	</portfolio-shell>
</template>

<script>
import { KvPagination } from '@kiva/kv-components';
import PortfolioShell from '#src/components/WwwFrame/PortfolioShell';
import TransactionFilterBar from '#src/components/Portfolio/TransactionFilterBar';
import TransactionList from '#src/components/Portfolio/TransactionList';
import myTransactionsQuery from '#src/graphql/query/portfolio/myTransactions.graphql';
import logFormatter from '#src/util/logFormatter';

const PAGE_LIMIT = 50;

export default {
	name: 'TransactionsPage',
	inject: ['apollo'],
	head() {
		return {
			title: 'Transactions',
		};
	},
	components: {
		KvPagination,
		PortfolioShell,
		TransactionFilterBar,
		TransactionList,
	},
	data() {
		return {
			transactions: [],
			totalTransactions: 0,
			// Whether the account has any transactions at all, captured from the first unfiltered
			// fetch so the empty list can tell "no matches" apart from "no transactions yet".
			hasAnyTransactions: false,
			loading: true,
			// Set when a fetch rejects so the list shows a distinct error state instead of the
			// "no transactions match this search" empty copy.
			loadError: false,
			transactionState: {
				offset: 0,
				limit: PAGE_LIMIT,
				filters: {},
				keywordSearch: null,
			},
			// Monotonic guard so an out-of-order response from a superseded request can't
			// overwrite the results of the latest one.
			transactionRequestSequence: 0,
		};
	},
	computed: {
		showPagination() {
			return this.totalTransactions > this.transactionState.limit;
		},
	},
	mounted() {
		this.fetchTransactions();
	},
	methods: {
		buildTransactionQueryVariables() {
			const filter = { ...this.transactionState.filters };
			if (this.transactionState.keywordSearch) {
				filter.queryString = this.transactionState.keywordSearch;
			}

			const variables = {
				offset: this.transactionState.offset,
				limit: this.transactionState.limit,
			};
			if (Object.keys(filter).length) {
				variables.filter = filter;
			}
			return variables;
		},
		fetchTransactions() {
			const requestSequence = this.transactionRequestSequence + 1;
			this.transactionRequestSequence = requestSequence;
			this.loading = true;
			this.loadError = false;

			// A request with no category/date/keyword filter returns the account's true total, so
			// only those responses can tell us whether the account has any transactions at all.
			// (Sort order doesn't change the set, so it doesn't count as a filter here.)
			const { filters, keywordSearch } = this.transactionState;
			const isUnfilteredRequest = !(
				filters.category || filters.startDate || filters.endDate || keywordSearch
			);

			return this.apollo.query({
				query: myTransactionsQuery,
				variables: this.buildTransactionQueryVariables(),
				fetchPolicy: 'network-only',
			}).then(({ data }) => {
				if (requestSequence !== this.transactionRequestSequence) {
					return;
				}
				if (data?.my?.transactions) {
					this.transactions = data.my.transactions.values || [];
					this.totalTransactions = data.my.transactions.totalCount || 0;
					if (isUnfilteredRequest) {
						this.hasAnyTransactions = this.totalTransactions > 0;
					}
				}
			}).catch(error => {
				if (requestSequence !== this.transactionRequestSequence) {
					return;
				}
				this.loadError = true;
				logFormatter(`Error fetching transactions: ${error}`, 'error');
			}).finally(() => {
				if (requestSequence === this.transactionRequestSequence) {
					this.loading = false;
				}
			});
		},
		handlePageChange({ pageOffset }) {
			if (this.loading) {
				return undefined;
			}
			this.$kvTrackEvent('portfolio', 'click', 'transactions-pagination', pageOffset);
			this.transactionState = {
				...this.transactionState,
				offset: pageOffset,
			};
			this.scrollToTransactionTable();
			return this.fetchTransactions();
		},
		handleFiltersChanged({ filters = {}, keywordSearch = null }) {
			this.transactionState = {
				...this.transactionState,
				offset: 0,
				filters,
				keywordSearch,
			};
			return this.fetchTransactions();
		},
		scrollToTransactionTable() {
			this.$refs.transactionTableTop?.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		},
	},
};
</script>
