<template>
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
						:extend-flss-filters="extendFlssFilters"
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
				<p>{{ totalCount }} Loans</p>
			</div>
		</div>
		<div class="tw-flex tw-mr-4">
			<div class="tw-hidden lg:tw-block" style="width: 285px;">
				<loan-search-filter
					:extend-flss-filters="extendFlssFilters"
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
				<loan-search-saved-search
					v-if="enableSavedSearch && showSavedSearch && !savedSearchSuccess"
					:loan-search-state="loanSearchState"
					:theme-names="themeNames"
					:show-success-message="showSavedSearchSuccessMessage"
					:user-id="userId"
				/>
				<loan-search-filter-chips
					:loan-search-state="loanSearchState"
					:all-facets="allFacets"
					@updated="handleUpdatedFilters"
					@reset="handleResetFilters"
				/>
				<p class="tw-hidden lg:tw-block tw-mt-1">
					{{ totalCount }} Loans
				</p>
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
			<kv-grid class="tw-grid-rows-4">
				<loan-card-controller
					v-for="loan in loans"
					:items-in-basket="itemsInBasket"
					:is-visitor="userId === null"
					:is-logged-in="userId !== null"
					:user-id="userId !== null ? userId.toString() : null"
					:key="loan.id"
					:loan="loan"
					loan-card-type="ListLoanCard"
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
					:selected="loanSearchState.pageLimit"
					@updated="handleResultsPerPage"
				/>
			</template>
		</div>
	</div>
</template>

<script>
import itemsInBasketQuery from '@/graphql/query/basketItems.graphql';
import loanSearchStateQuery from '@/graphql/query/loanSearchState.graphql';
import userIdQuery from '@/graphql/query/userId.graphql';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import LoanSearchFilter from '@/components/Lend/LoanSearch/LoanSearchFilter';
import {
	FLSS_QUERY_TYPE,
	formatSortOptions,
	transformIsoCodes,
	transformThemes,
	transformSectors,
	transformTags,
	transformGenderOptions,
	transformDistributionModelOptions,
} from '@/util/loanSearch/filterUtils';
import { FLSS_ORIGIN_LEND_FILTER } from '@/util/flssUtils';
import { runFacetsQueries, runLoansQuery, fetchLoanFacets } from '@/util/loanSearch/dataUtils';
import { applyQueryParams, hasExcludedQueryParams, updateQueryParams } from '@/util/loanSearch/queryParamUtils';
import { updateSearchState } from '@/util/loanSearch/searchStateUtils';
import logReadQueryError from '@/util/logReadQueryError';
import KvSectionModalLoader from '@/components/Kv/KvSectionModalLoader';
import KvPagination from '@/components/Kv/KvPagination';
import KvResultsPerPage from '@/components/Kv/KvResultsPerPage';
import { getDefaultLoanSearchState } from '@/api/localResolvers/loanSearch';
import { isNumber } from '@/util//numberUtils';
import LoanSearchFilterChips from '@/components/Lend/LoanSearch/LoanSearchFilterChips';
import LoanSearchSavedSearch from '@/components/Lend/LoanSearch/LoanSearchSavedSearch';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

const COOKIE_KEY = 'kv-search-result-count';

export default {
	name: 'LoanSearchInterface',
	inject: ['apollo', 'cookieStore'],
	components: {
		LoanCardController,
		LoanSearchFilterChips,
		KvGrid,
		KvButton,
		LoanSearchFilter,
		KvLightbox,
		KvSectionModalLoader,
		KvPagination,
		KvResultsPerPage,
		LoanSearchSavedSearch
	},
	props: {
		extendFlssFilters: {
			type: Boolean,
			default: false,
		},
		enableSavedSearch: {
			type: Boolean,
			default: false,
		},
		savedSearchSuccess: {
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
			loanSearchState: getDefaultLoanSearchState(),
			queryType: FLSS_QUERY_TYPE,
			// Holds comma-separated list of loan IDs from the query results
			trackedHits: undefined,
			userId: null,
		};
	},
	apollo: {
		preFetch(config, client, { route }) {
			// Handle temporary query param exclusions
			if (Object.keys(route?.query).length && hasExcludedQueryParams(route?.query)) {
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
		await applyQueryParams(this.apollo, this.$route.query, this.allFacets, this.queryType, this.defaultPageLimit);

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
				updateQueryParams(state, this.$router, this.queryType);

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

			return isNumber(storedPageLimit) ? +storedPageLimit : this.loanSearchState.pageLimit;
		},
		showSavedSearch() {
			// implement more global solution when out of exp phase
			const countryFilterApplied = this.loanSearchState.countryIsoCode.length > 0;
			const genderFilterApplied = !!this.loanSearchState.gender;
			const sectorFilterApplied = this.loanSearchState.sectorId.length > 0;
			const themeFilterApplied = this.loanSearchState.themeId.length > 0;
			const tagFilterApplied = this.loanSearchState.tagId.length > 0;
			const distributionModelFilterApplied = !!this.loanSearchState.distributionModel;
			return countryFilterApplied
				|| genderFilterApplied
				|| sectorFilterApplied
				|| themeFilterApplied
				|| tagFilterApplied
				|| distributionModelFilterApplied;
		},
		themeNames() {
			return this.allFacets?.themeNames ?? [];
		}
	},
	methods: {
		async fetchFacets(loanSearchState = {}) {
			// TODO: Prevent this from running on every query (not needed for sorting and paging)
			const { isoCodes, themes, sectors } = await runFacetsQueries(
				this.apollo,
				loanSearchState,
				FLSS_ORIGIN_LEND_FILTER
			);

			// Merge all facet options with filtered options
			this.facets = {
				genders: transformGenderOptions(this.allFacets?.genderFacets),
				regions: transformIsoCodes(isoCodes, this.allFacets?.countryFacets),
				sectors: transformSectors(sectors, this.allFacets?.sectorFacets),
				themes: transformThemes(themes, this.allFacets?.themeFacets),
				tags: transformTags(this.allFacets?.tagFacets ?? []),
				sortOptions: formatSortOptions(this.allFacets?.standardSorts ?? [], this.allFacets?.flssSorts ?? []),
				distributionModels: transformDistributionModelOptions(this.allFacets?.distributionModelFacets),
			};
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
			if (this.savedSearchSuccess) {
				this.disableSavedSearchSuccessMessage();
			}
			updateSearchState(this.apollo, filters, this.allFacets, this.queryType, this.loanSearchState);
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
		showSavedSearchSuccessMessage(searchName) {
			this.$emit('enable-success-saved-search', searchName);
		},
		disableSavedSearchSuccessMessage() {
			this.$emit('disable-success-saved-search', false);
		}
	},
	watch: {
		$route(to) {
			// Update the loan search state when the user clicks back/forward in the browser
			applyQueryParams(
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
