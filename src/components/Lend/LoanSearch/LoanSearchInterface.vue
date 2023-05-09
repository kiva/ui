<template>
	<div>
		<div class="tw-flex tw-flex-col lg:tw-flex-row">
			<div class="tw-flex lg:tw-hidden">
				<div class="tw-mb-3 tw-mr-2">
					<kv-button
						variant="secondary"
						@click="toggleLightbox(true)"
					>
						Filter & Sort
					</kv-button>
					<kv-lightbox
						:visible="isLightboxVisible"
						variant="lightbox"
						title="Loan filter controls"
						@lightbox-closed="toggleLightbox(false)"
					>
						<template #header>
							{{ null }} <!-- Hide title text -->
						</template>
						<loan-search-filter
							style="min-width: 285px;"
							:loading="!initialLoadComplete"
							:is-logged-in="userId !== null"
							:facets="facets"
							:loan-search-state="loanSearchState"
							@updated="handleUpdatedFilters"
							@reset="handleResetFilters"
						/>
						<template #controls>
							<kv-button
								v-if="totalCount > 0"
								class="tw-mt-2 tw-w-full lg:tw-hidden"
								@click="toggleLightbox(false)"
								ref="showLoansButton"
							>
								Show {{ totalCount }} Loans
							</kv-button>
						</template>
					</kv-lightbox>
				</div>
				<div v-if="initialLoadComplete" class="tw-pt-1.5">
					<div class="tw-flex tw-items-center tw-flex-wrap">
						<p class="tw-inline-block tw-mr-2">
							{{ totalCount }} Loans
						</p>
						<loan-search-saved-search
							class="tw-inline-block"
							v-if="enableSavedSearch && showSavedSearch"
							:loan-search-state="loanSearchState"
							:all-facets="allFacets"
							:user-id="userId"
						/>
					</div>
				</div>
			</div>
			<div class="tw-flex tw-mr-4">
				<div class="tw-hidden lg:tw-block" style="width: 285px;">
					<loan-search-filter
						:loading="!initialLoadComplete"
						:facets="facets"
						:is-logged-in="userId !== null"
						:loan-search-state="loanSearchState"
						@updated="handleUpdatedFilters"
						@reset="handleResetFilters"
					/>
				</div>
			</div>
			<div class="tw-col-span-2 tw-relative tw-grow">
				<kv-section-modal-loader :loading="loading" bg-color="secondary" size="large" />
				<div v-if="initialLoadComplete">
					<loan-search-filter-chips
						:loan-search-state="loanSearchState"
						:all-facets="allFacets"
						@updated="handleUpdatedFilters"
						@reset="handleResetFilters"
					/>
					<div
						class="tw-flex tw-mt-1 tw-items-center tw-flex-wrap"
						:class="{ 'lg:tw-pl-4' : enableNewLoanCard }"
					>
						<p class="tw-hidden lg:tw-inline-block tw-mr-2">
							{{ totalCount }} Loans
						</p>
						<loan-search-saved-search
							class="tw-hidden lg:tw-inline-block"
							v-if="enableSavedSearch && showSavedSearch"
							:loan-search-state="loanSearchState"
							:all-facets="allFacets"
							:user-id="userId"
						/>
					</div>
				</div>
				<template v-if="initialLoadComplete && totalCount === 0">
					<h3 class="tw-text-center">
						All borrowers matching this search have been funded.
					</h3>
					<p class="tw-text-center tw-mt-2">
						Please adjust your criteria or
						<a class="tw-cursor-pointer" @click="clickZeroLoansReset">start a new search.</a>
					</p>
				</template>
				<!-- eslint-disable max-len -->
				<div
					v-if="enableNewLoanCard"
					class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-mt-2 tw-mb-4 lg:tw-ml-1.5 lg:tw-px-2.5 tw-gap-x-6 tw-gap-y-4"
				>
					<kiva-classic-basic-loan-card-exp
						v-for="(loan, index) in loans"
						:key="`new-card-${index}`"
						:loan-id="loan.id"
						:show-action-button="true"
						:show-tags="true"
						:use-full-width="true"
						:enable-five-dollars-notes="enableFiveDollarsNotes"
						@add-to-basket="addToBasket"
						class="tw-h-full"
					/>
				</div>
				<kv-grid v-else class="tw-grid-rows-4">
					<loan-card-controller
						v-for="loan in loans"
						:items-in-basket="itemsInBasket"
						:is-visitor="userId === null"
						:is-logged-in="userId !== null"
						:user-id="userId !== null ? userId.toString() : null"
						:key="loan.id"
						:loan="loan"
						loan-card-type="ListLoanCard"
						:enable-five-dollars-notes="enableFiveDollarsNotes"
						:rounded-corners="true"
					/>
				</kv-grid>
				<template v-if="initialLoadComplete && totalCount > 0">
					<kv-pagination
						:limit="loanSearchState.pageLimit"
						:total="totalCount"
						:offset="loanSearchState.pageOffset"
						@page-changed="handlePageChange"
					/>
					<kv-results-per-page
						:options="enableNewLoanCard ? [10, 20, 50] : [15, 25, 50]"
						:selected="loanSearchState.pageLimit"
						@updated="handleResultsPerPage"
					/>
				</template>
			</div>
		</div>
		<template v-if="initialLoadComplete && totalCount > 0">
			<!-- Donation CTA Experiment -->
			<donation-c-t-a v-if="hasOnePageOfLoans" />
		</template>
	</div>
</template>

<script>
import itemsInBasketQuery from '@/graphql/query/basketItems.graphql';
import loanSearchStateQuery from '@/graphql/query/loanSearchState.graphql';
import userIdQuery from '@/graphql/query/userId.graphql';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import LoanSearchFilter from '@/components/Lend/LoanSearch/LoanSearchFilter';
import {
	filterUtils,
	filterOptionUtils,
	numberUtils,
	searchStateUtils,
	queryParamUtils,
} from '@kiva/kv-loan-filters';
import { FLSS_ORIGIN_LEND_FILTER } from '@/util/flssUtils';
import { runFacetsQueries, runLoansQuery, fetchLoanFacets } from '@/util/loanSearch/dataUtils';
import logReadQueryError from '@/util/logReadQueryError';
import KvSectionModalLoader from '@/components/Kv/KvSectionModalLoader';
import KvPagination from '@/components/Kv/KvPagination';
import KvResultsPerPage from '@/components/Kv/KvResultsPerPage';
import KivaClassicBasicLoanCardExp from '@/components/LoanCards/KivaClassicBasicLoanCardExp';
import { getDefaultLoanSearchState } from '@/api/localResolvers/loanSearch';
import LoanSearchFilterChips from '@/components/Lend/LoanSearch/LoanSearchFilterChips';
import LoanSearchSavedSearch from '@/components/Lend/LoanSearch/LoanSearchSavedSearch';
import DonationCTA from '@/components/Lend/DonationCTA';
import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';
import VueRouter from 'vue-router';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

const COOKIE_KEY = 'kv-search-result-count';

export default {
	name: 'LoanSearchInterface',
	inject: ['apollo', 'cookieStore'],
	components: {
		DonationCTA,
		LoanCardController,
		LoanSearchFilterChips,
		KvGrid,
		KvButton,
		LoanSearchFilter,
		KvLightbox,
		KvSectionModalLoader,
		KvPagination,
		KvResultsPerPage,
		LoanSearchSavedSearch,
		KivaClassicBasicLoanCardExp
	},
	props: {
		enableSavedSearch: {
			type: Boolean,
			default: false,
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false,
		},
		enableNewLoanCard: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			initialLoadComplete: false,
			loading: true,
			allFacets: undefined,
			facets: {},
			loans: [],
			totalCount: 0,
			isLightboxVisible: false,
			itemsInBasket: [],
			loanSearchState: {
				...getDefaultLoanSearchState(),
				...(this.enableNewLoanCard && { pageLimit: 10 }),
			},
			queryType: filterOptionUtils.FLSS_QUERY_TYPE,
			// Holds comma-separated list of loan IDs from the query results
			trackedHits: undefined,
			userId: null,
		};
	},
	apollo: {
		preFetch(config, client, { route }) {
			// Handle temporary query param exclusions
			if (Object.keys(route?.query).length && queryParamUtils.hasExcludedQueryParams(route?.query)) {
				// fallback to legacy lend with original query params
				return Promise.reject({ path: route.fullPath.replace('/filter', '') });
			}

			return client.query({
				query: userIdQuery
			}).then(() => {
				return client.query({
					query: itemsInBasketQuery
				});
			});
		},
	},
	created() {
		const basketId = this.cookieStore.get('kvbskt');

		try {
			const userIdData = this.apollo.readQuery({
				query: userIdQuery
			});
			this.userId = userIdData?.my?.userAccount?.id ?? null;
		} catch (e) {
			logReadQueryError(e, 'LoanSearchInterface userIdQuery');
		}

		try {
			this.apollo.watchQuery({
				query: itemsInBasketQuery,
				variables: { basketId },
			}).subscribe({
				next: ({ data }) => {
					this.itemsInBasket = data?.shop?.basket?.items?.values.map(item => item.id) ?? [];
				},
			});
		} catch (e) {
			logReadQueryError(e, 'LoanSearchInterface itemsInBasketQuery');
		}
	},
	async mounted() {
		// Fetch the facet options from the lend and FLSS APIs
		this.allFacets = await fetchLoanFacets(this.apollo);

		// Load all available facets without loan search state applied
		await this.fetchFacets();

		// Initialize the search filters with the query string params
		await this.applyQuery(this.apollo, this.$route.query, this.allFacets, this.queryType, this.defaultPageLimit);

		// Here we subscribe to the loanSearchState and run the loan query when it updates
		// TODO: work some guards to prevent duplicate queries and throttling to more carefully control # of queries
		this.apollo.watchQuery({ query: loanSearchStateQuery }).subscribe({
			next: async ({ data }) => {
				// Toggle loans modal loader
				this.loading = true;

				// Utilize the results of the existing query of the loan search state for updating the filters
				this.loanSearchState = data?.loanSearchState;

				const [{ loans, totalCount }] = await Promise.all([
					// Get filtered loans from FLSS
					await runLoansQuery(this.apollo, this.loanSearchState, FLSS_ORIGIN_LEND_FILTER),
					// Get filtered facet options from FLSS
					await this.fetchFacets(this.loanSearchState)
				]);

				// Store loan data in component, guarding against null loan objects
				this.loans = loans.filter(loan => loan !== null);
				this.totalCount = totalCount;

				// Copy state so that the readonly offset can be updated
				const state = { ...this.loanSearchState };

				// Change back to last page if offset goes beyond available loans
				if (this.loans.length === 0 && state.pageOffset > 0) {
					const lastPage = Math.ceil(this.totalCount / state.pageLimit);
					state.pageOffset = state.pageLimit * ((lastPage || 1) - 1);
				}

				// Update the query string with the latest loan search state
				queryParamUtils.updateQueryParams(state, this.$router, this.queryType)?.catch(e => {
					const { isNavigationFailure, NavigationFailureType } = VueRouter;

					// Ignore "navigation canceled" errors from clicking filter options quickly
					if (!isNavigationFailure(e, NavigationFailureType.cancelled)) {
						throw e;
					}
				});

				// Toggle loading flags
				if (!this.initialLoadComplete) {
					this.initialLoadComplete = true;
				}
				this.loading = false;

				// Add analytics event for loans query result
				this.trackLoans();
			}
		});
	},
	computed: {
		defaultPageLimit() {
			const storedPageLimit = this.cookieStore.get(COOKIE_KEY);

			return numberUtils.isNumber(storedPageLimit) ? +storedPageLimit : this.loanSearchState.pageLimit;
		},
		showSavedSearch() {
			return filterUtils.keys.reduce((prev, key) => {
				return prev || filterUtils.filters[key].showSavedSearch(this.loanSearchState);
			}, false);
		},
		hasOnePageOfLoans() {
			return this.totalCount <= this.loanSearchState.pageLimit;
		}
	},
	methods: {
		async fetchFacets(loanSearchState = {}) {
			// TODO: Prevent this from running on every query (not needed for sorting and paging)
			const filteredFacets = await runFacetsQueries(this.apollo, loanSearchState, FLSS_ORIGIN_LEND_FILTER);

			// Merge all facet options with filtered options
			this.facets = filterUtils.keys.reduce((prev, next) => {
				// eslint-disable-next-line no-param-reassign
				prev[next] = filterUtils.filters[next].getOptions(this.allFacets, filteredFacets);
				return prev;
			}, {});
		},
		trackLoans() {
			this.$kvSetCustomUrl();

			const hitIds = this.loans.map(l => l.id);
			const hits = hitIds.join();

			if (hits !== this.trackedHits) {
				this.$kvTrackEvent?.(
					'Lending',
					hits ? 'loans-shown' : 'zero-loans-shown',
					hits ? 'loan-ids' : undefined,
					hits || undefined,
					hitIds.length ? hitIds.length : 0,
				);

				this.trackedHits = hits;
			}
		},
		toggleLightbox(toggle) {
			this.isLightboxVisible = toggle;
		},
		updateState(filters = {}) {
			searchStateUtils.updateSearchState(
				this.apollo,
				updateLoanSearchMutation,
				filters,
				this.allFacets,
				this.queryType,
				this.loanSearchState
			);
		},
		handleUpdatedFilters(filters) {
			this.updateState({ ...this.loanSearchState, ...filters, pageOffset: 0 });
		},
		handleResetFilters() {
			this.updateState();
		},
		handlePageChange(payload) {
			// Handle pager separately so that filters can reset the page offset
			this.updateState({ ...this.loanSearchState, ...payload });
		},
		handleResultsPerPage(payload) {
			// Reset to first page when page limit changes
			this.updateState({ ...this.loanSearchState, ...payload, pageOffset: 0 });

			// Set cookie with 2 year expiration
			const expires = new Date();
			expires.setFullYear(expires.getFullYear() + 2);

			this.cookieStore.set(COOKIE_KEY, payload.pageLimit, { expires });
		},
		clickZeroLoansReset() {
			this.handleResetFilters();

			this.$kvTrackEvent?.('Lending', 'click-zero-loans-reset');
		},
		applyQuery: async (apollo, query, allFacets, queryType, pageLimit, loanSearchState = {}) => {
			const filters = queryParamUtils.convertQueryToFilters(query, allFacets, queryType, pageLimit);

			await searchStateUtils.updateSearchState(
				apollo,
				updateLoanSearchMutation,
				filters,
				allFacets,
				queryType,
				loanSearchState
			);
		},
		addToBasket(payload) {
			if (payload.success) this.$kvTrackEvent('loan-card', 'add-to-basket', 'filter-page-new-card');
		}
	},
	watch: {
		$route(to) {
			// Update the loan search state when the user clicks back/forward in the browser
			this.applyQuery(
				this.apollo,
				to.query,
				this.allFacets,
				this.queryType,
				this.loanSearchState.pageLimit,
				this.loanSearchState
			);
		}
	}
};
</script>
