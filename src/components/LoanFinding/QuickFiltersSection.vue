<template>
	<div ref="sectionTop" class="tw-w-full tw-bg-secondary">
		<div class="tw-mx-auto tw-pt-2 tw-pb-1 tw-px-2.5 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
			<div
				v-show="showOverlay"
				style="opacity: 0.5;" class="tw-fixed tw-inset-0 tw-bg-black tw-z-1"
			></div>

			<h2 class="tw-text-h2 tw-mb-1 tw-text-primary">
				Find a loan by category and location
			</h2>

			<quick-filters
				ref="quickFilters"
				:loan-search-state="loanSearchState"
				:total-loans="totalCount"
				:facets="facets"
				:loading="loading"
				:targeted-loan-channel-id="targetedLoanChannelId"
				:with-categories="true"
				tracking-category="lending-home"
				@update-filters="handleUpdatedFilters"
				@handle-overlay="handleQuickFiltersOverlay"
			/>

			<!-- empty state for no loans result -->
			<empty-state v-show="emptyState" />

			<div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4 tw-mt-2">
				<kiva-classic-basic-loan-card-exp
					v-for="(loan, index) in loans"
					:key="`new-card-${loan.id}-${index}`"
					:loan-id="loan.id"
					:show-action-button="true"
					:use-full-width="true"
					:show-tags="true"
					:enable-five-dollars-notes="enableFiveDollarsNotes"
					@add-to-basket="addToBasket"
				/>
			</div>

			<div v-if="!emptyState" class="tw-w-full tw-my-4">
				<kv-pagination
					:total="totalCount"
					:limit="loanSearchState.pageLimit"
					:offset="loanSearchState.pageOffset"
					:scroll-to-top="!!targetedLoanChannelId"
					@page-changed="handlePageChange"
				/>
				<div class="tw-text-tertiary tw-text-center tw-mx-2">
					{{ totalCount }} loans
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import QuickFilters from '@/components/LoansByCategory/QuickFilters/QuickFilters';
import { runFacetsQueries, fetchLoanFacets, runLoansQuery } from '@/util/loanSearch/dataUtils';
import { FLSS_ORIGIN_LENDING_HOME } from '@/util/flssUtils';
import {
	filterUiConfigs,
	filterUtils,
	filterOptionUtils,
	searchStateUtils,
} from '@kiva/kv-loan-filters';
import KivaClassicBasicLoanCardExp from '@/components/LoanCards/KivaClassicBasicLoanCardExp';
import KvPagination from '@/components/Kv/KvPagination';
import loanSearchStateQuery from '@/graphql/query/loanSearchState.graphql';
import { getDefaultLoanSearchState } from '@/api/localResolvers/loanSearch';
import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';
import EmptyState from './EmptyState';

const defaultLoanSearchState = () => ({
	...getDefaultLoanSearchState(),
	category: '',
	gender: '',
	sortBy: 'amountLeft',
	pageLimit: 6,
});

export default {
	name: 'QuickFiltersSection',
	components: {
		QuickFilters,
		KivaClassicBasicLoanCardExp,
		KvPagination,
		EmptyState
	},
	inject: ['apollo'],
	props: {
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		},
		queryType: {
			type: String,
			default: filterOptionUtils.FLSS_QUERY_TYPE
		},
		targetedLoanChannelId: {
			type: String,
			default: null,
		},
		displayLoanPromoCard: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			loading: true,
			emptyState: false,
			loanSearchState: defaultLoanSearchState(),
			// Default loans for loading animations
			loans: [
				{ id: 0 }, { id: 0 }, { id: 0 },
				{ id: 0 }, { id: 0 }, { id: 0 }
			],
			totalCount: 0,
			backupLoans: undefined,
			facets: {},
			allFacets: [],
			showOverlay: false,
		};
	},
	async mounted() {
		// Get all available facets
		this.allFacets = await fetchLoanFacets(this.apollo);

		// Get filtered facets and update search state with defaults
		await Promise.all([
			this.fetchFacets(),
			searchStateUtils.updateSearchState(
				this.apollo,
				updateLoanSearchMutation,
				defaultLoanSearchState(),
				this.allFacets,
				filterOptionUtils.FLSS_QUERY_TYPE,
				{},
			)
		]);

		this.apollo.watchQuery({ query: loanSearchStateQuery }).subscribe({
			next: async ({ data }) => {
				this.loading = true;

				this.loanSearchState = data?.loanSearchState;

				const [{ loans, totalCount }] = await Promise.all([
					// Get filtered loans from FLSS
					await runLoansQuery(this.apollo, this.loanSearchState, FLSS_ORIGIN_LENDING_HOME),
					// Get filtered facet options from FLSS
					await this.fetchFacets()
				]);

				// Store backup loans on first loan fetch
				if (!this.backupLoans?.length && loans.length) {
					this.backupLoans = loans.slice(3);
				}

				this.emptyState = loans.length === 0;

				// Set loans or use backup
				if (this.emptyState) {
					this.loans = this.backupLoans;
					this.totalCount = this.loans.length;
					this.$kvTrackEvent(
						'lending-home',
						'show',
						'quick-filters-empty-state'
					);
				} else {
					this.loans = loans;
					this.totalCount = totalCount;
				}

				this.loading = false;
			}
		});
	},
	methods: {
		async fetchFacets() {
			const filteredFacets = await runFacetsQueries(this.apollo, this.loanSearchState, FLSS_ORIGIN_LENDING_HOME);

			// Merge all facet options with filtered options
			this.facets = filterUtils.keys.reduce((prev, next) => {
				// eslint-disable-next-line no-param-reassign
				prev[next] = filterUtils.filters[next].getOptions(this.allFacets, filteredFacets);
				return prev;
			}, {});
		},
		handleUpdatedFilters({ key, value }) {
			let filters = {
				// Use previous state as base
				...this.loanSearchState,
				// Set page offset first in case this method was triggered by the pager
				pageOffset: 0,
				// Add new changed state value
				[key]: value
			};

			// Handle special cases when the filters contain a category
			const categoriesStateKey = filterUiConfigs.categories().stateKey;
			if (key === categoriesStateKey || filters[categoriesStateKey]) {
				const defaults = defaultLoanSearchState();

				// Get category filters
				const categoriesState = filterUtils.filters.categories.getValidatedSearchState(filters, this.allFacets);

				if (key === categoriesStateKey) {
					// Clear previous category filters before applying new category
					const previousCategoriesState = filterUtils.filters.categories.getValidatedSearchState(
						this.loanSearchState,
						this.allFacets
					);
					Object.keys(previousCategoriesState).forEach(f => {
						filters[f] = defaults[f];
					});

					// Category filters take precedence when the category filter is changed
					filters = { ...filters, ...categoriesState };
				} else if (categoriesState[key]) {
					// Reset category filters when the new filter is included in the current category filters
					filters[categoriesStateKey] = null;
					Object.keys(categoriesState).forEach(f => {
						// Don't reset the filter currently being applied
						if (f !== key) {
							filters[f] = defaults[f];
						}
					});
				}
			}

			searchStateUtils.updateSearchState(
				this.apollo,
				updateLoanSearchMutation,
				filters,
				this.allFacets,
				filterOptionUtils.FLSS_QUERY_TYPE,
				this.loanSearchState,
			);
		},
		handleQuickFiltersOverlay(showOverlay) {
			this.showOverlay = showOverlay;
		},
		handlePageChange({ pageOffset }) {
			const pageOffsetStateKey = filterUiConfigs.pageOffset().stateKey;
			this.handleUpdatedFilters({ key: pageOffsetStateKey, value: pageOffset });
			this.$refs.sectionTop.scrollIntoView({ behavior: 'smooth' });
		},
		addToBasket(payload) {
			this.$emit('add-to-basket', payload);
		},
	},
};
</script>
