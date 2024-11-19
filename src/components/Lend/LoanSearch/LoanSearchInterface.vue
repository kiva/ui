<template>
	<div>
		<div class="tw-flex tw-justify-between tw-items-end tw-mb-2.5" v-if="showChallengeHeader">
			<div>
				<h2 class="tw-text-h2">
					Find a loan, Support your team!
				</h2>
				<p class="tw-text-base">
					Supporting any borrower, not just Team picks, counts toward this team challenge
				</p>
			</div>
			<div class="tw-flex tw-mt-1 tw-items-center tw-flex-wrap lg:tw-pl-4">
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
		<div class="tw-flex tw-flex-col lg:tw-flex-row">
			<div class="tw-flex lg:tw-hidden">
				<div class="tw-mb-3 tw-mr-2">
					<kv-button
						variant="secondary"
						@click="toggleLightbox(true)"
					>
						Filter <span class="tw-hidden md:tw-inline">& Sort</span>
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
						<team-picks-switch
							v-if="showChallengeHeader"
							:show-picks="showTeamPicks"
							@handle-team-picks="handleTeamPicks"
						/>
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
					<team-picks-switch
						v-if="showChallengeHeader"
						class="tw-mb-2"
						:show-picks="showTeamPicks"
						@handle-team-picks="handleTeamPicks"
					/>
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
					<loan-search-filter-chips
						:class="{ 'tw-mb-2' : showChallengeHeader}"
						:loan-search-state="loanSearchState"
						:all-facets="allFacets"
						@updated="handleUpdatedFilters"
						@reset="handleResetFilters"
					/>
					<div v-if="!showChallengeHeader" class="tw-flex tw-mt-1 tw-items-center tw-flex-wrap lg:tw-pl-4">
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
					<div class="tw-mt-2" v-if="!showChallengeHeader">
						<h3 class="tw-text-center">
							All borrowers matching this search have been funded.
						</h3>
						<p class="tw-text-center tw-mt-2">
							Please adjust your criteria or
							<a class="tw-cursor-pointer" @click="clickZeroLoansReset">start a new search.</a>
						</p>
					</div>
					<h3 v-else class="tw-text-center tw-mt-2">
						There are no team picks matching your filters.
					</h3>
				</template>
				<!-- eslint-disable max-len -->
				<div
					class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-mb-4 lg:tw-ml-1.5 lg:tw-px-2.5 tw-gap-x-6 tw-gap-y-4"
					:class="{ 'tw-mt-2' : !showChallengeHeader}"
				>
					<kv-classic-loan-card-container
						v-for="(loan, index) in loans"
						:key="`new-card-${loan.id}-${index}`"
						:loan-id="loan.id"
						:use-full-width="true"
						:show-tags="true"
						:enable-five-dollars-notes="enableFiveDollarsNotes"
						:user-balance="userBalance"
						:is-team-pick="showTeamPicks"
						:show-loans-activity-feed="showLoansActivityFeed"
						:enable-huge-amount="enableHugeAmount"
						:add-to-basket-exp-enabled="enableAddToBasketExp"
						@show-cart-modal="showCartModal"
						@add-to-basket="addToBasket"
					/>
				</div>
				<template v-if="initialLoadComplete && totalCount > 0">
					<kv-pagination
						:limit="loanSearchState.pageLimit"
						:total="totalCount"
						:offset="loanSearchState.pageOffset"
						@page-changed="handlePageChange"
					/>
					<kv-results-per-page
						:options="[10, 20, 50]"
						:selected="loanSearchState.pageLimit"
						@updated="handleResultsPerPage"
					/>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import itemsInBasketQuery from '#src/graphql/query/basketItems.graphql';
import loanSearchStateQuery from '#src/graphql/query/loanSearchState.graphql';
import LoanSearchFilter from '#src/components/Lend/LoanSearch/LoanSearchFilter';
import TeamPicksSwitch from '#src/components/Lend/LoanSearch/TeamPicksSwitch';
import { FLSS_QUERY_TYPE } from '#src/util/loanSearch/filterUtils';
import { FLSS_ORIGIN_LEND_FILTER } from '#src/util/flssUtils';
import { runFacetsQueries, runLoansQuery, fetchLoanFacets } from '#src/util/loanSearch/dataUtils';
import { convertQueryToFilters, hasExcludedQueryParams, updateQueryParams } from '#src/util/loanSearch/queryParamUtils';
import { updateSearchState } from '#src/util/loanSearch/searchStateUtils';
import logReadQueryError from '#src/util/logReadQueryError';
import KvSectionModalLoader from '#src/components/Kv/KvSectionModalLoader';
import KvPagination from '#src/components/Kv/KvPagination';
import KvResultsPerPage from '#src/components/Kv/KvResultsPerPage';
import KvClassicLoanCardContainer from '#src/components/LoanCards/KvClassicLoanCardContainer';
import { getDefaultLoanSearchState } from '#src/api/localResolvers/loanSearch';
import { isNumber } from '#src/util//numberUtils';
import LoanSearchFilterChips from '#src/components/Lend/LoanSearch/LoanSearchFilterChips';
import LoanSearchSavedSearch from '#src/components/Lend/LoanSearch/LoanSearchSavedSearch';
import filterConfig from '#src/util/loanSearch/filterConfig';
import { gql } from 'graphql-tag';
import addToBasketExpMixin from '#src/plugins/add-to-basket-exp-mixin';
import KvButton from '@kiva/kv-components/dist/components/KvButton';
import KvLightbox from '@kiva/kv-components/dist/components/KvLightbox';

const COOKIE_KEY = 'kv-search-result-count';

const userInfoLendFilterQuery = gql`
	query userInfoLendFilter {
		my {
			id
			userAccount {
				id
				balance
			}
		}
	}
`;

export default {
	name: 'LoanSearchInterface',
	inject: ['apollo', 'cookieStore'],
	components: {
		LoanSearchFilterChips,
		KvButton,
		LoanSearchFilter,
		KvLightbox,
		KvSectionModalLoader,
		KvPagination,
		KvResultsPerPage,
		LoanSearchSavedSearch,
		KvClassicLoanCardContainer,
		TeamPicksSwitch,
	},
	mixins: [addToBasketExpMixin],
	emits: ['add-to-basket', 'show-cart-modal'],
	props: {
		extendFlssFilters: {
			type: Boolean,
			default: false,
		},
		enableSavedSearch: {
			type: Boolean,
			default: false,
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false,
		},
		challengeData: {
			type: Object,
			default: () => ({}),
		},
		showLoansActivityFeed: {
			type: Boolean,
			default: false,
		},
		enableHugeAmount: {
			type: Boolean,
			default: false,
		},
		teamName: {
			type: String,
			default: () => '',
		},
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
				...{ pageLimit: 10 },
			},
			queryType: FLSS_QUERY_TYPE,
			// Holds comma-separated list of loan IDs from the query results
			trackedHits: undefined,
			userId: null,
			userBalance: undefined,
			showTeamPicks: false,
			challengeFilters: {},
		};
	},
	apollo: {
		preFetch(_, client, { route }) {
			const currentRoute = route.value ?? route ?? {};
			// Handle temporary query param exclusions
			if (Object.keys(currentRoute.query ?? {}).length && hasExcludedQueryParams(currentRoute.query ?? {})) {
				// fallback to legacy lend with original query params
				return Promise.reject({ path: currentRoute.fullPath?.replace('/filter', '') });
			}

			return client.query({
				query: userInfoLendFilterQuery
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
				query: userInfoLendFilterQuery
			});
			this.userId = userIdData?.my?.userAccount?.id ?? null;
			this.userBalance = userIdData?.my?.userAccount?.balance;
		} catch (e) {
			logReadQueryError(e, 'LoanSearchInterface userInfoLendFilterQuery');
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
		activeFilters() {
			return filterConfig.keys.reduce((prev, key) => {
				if (filterConfig.config[key].showSavedSearch(this.loanSearchState)) {
					prev.push(key);
				}
				return prev;
			}, []);
		},
		// MPL-56 - Temporarily hiding save search for new filters
		unsupportedSaveFilters() {
			return (
				this.activeFilters.length === 1
				&& (
					this.activeFilters.includes('keywordSearch')
					|| this.activeFilters.includes('flexibleFundraisingEnabled')
				)
			)
			|| (
				this.activeFilters.length === 2
				&& this.activeFilters.includes('keywordSearch')
				&& this.activeFilters.includes('flexibleFundraisingEnabled'));
		},
		showSavedSearch() {
			return !this.unsupportedSaveFilters
				&& filterConfig.keys.reduce((prev, key) => {
					return prev || filterConfig.config[key].showSavedSearch(this.loanSearchState);
				}, false);
		},
		showChallengeHeader() {
			return Object.keys(this.challengeData).length !== 0;
		},
	},
	methods: {
		async fetchFacets(loanSearchState = {}) {
			// TODO: Prevent this from running on every query (not needed for sorting and paging)
			const filteredFacets = await runFacetsQueries(this.apollo, loanSearchState, FLSS_ORIGIN_LEND_FILTER);

			// Merge all facet options with filtered options
			this.facets = filterConfig.keys.reduce((prev, next) => {
				// eslint-disable-next-line no-param-reassign
				prev[next] = filterConfig.config[next].getOptions(
					this.allFacets,
					filteredFacets,
					this.extendFlssFilters
				);
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
		applyQuery: async (apollo, query, allFacets, queryType, pageLimit, loanSearchState = {}) => {
			const filters = convertQueryToFilters(query, allFacets, queryType, pageLimit);

			await updateSearchState(apollo, filters, allFacets, queryType, loanSearchState);
		},
		addToBasket(payload) {
			if (payload.success) {
				this.$kvTrackEvent('loan-card', 'add-to-basket', 'filter-page-new-card');
				this.$emit('add-to-basket', payload);
			}
		},
		handleTeamPicks(payload) {
			this.showTeamPicks = payload;
			if (this.showTeamPicks) {
				this.$kvTrackEvent('Lending', 'click-teams-filter', this.teamName);
				this.getChallengeFilters();
			} else {
				updateQueryParams({}, this.$router, this.queryType);
			}
		},
		getChallengeFilters() {
			const challengeFilters = this.challengeData?.targets?.values?.[0].savedSearch?.filters?.[0] ?? {};
			const challengeEntries = Object.entries(challengeFilters);
			const challengeFiltersObject = {};

			challengeEntries.forEach(([key, value]) => {
				const filterEntry = Object.entries(value);
				const valueEntry = filterEntry[0][1];
				challengeFiltersObject[key] = valueEntry;
			});

			updateQueryParams(challengeFiltersObject, this.$router, this.queryType);
			this.challengeFilters = challengeFiltersObject;
		},
		showCartModal(payload) {
			this.$emit('show-cart-modal', payload);
		},
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
		},
		loanSearchState() {
			const challengeFiltersKeys = Object.keys(this.challengeFilters);

			challengeFiltersKeys.forEach(key => {
				if (Array.isArray(this.challengeFilters[key])) {
					this.challengeFilters[key].forEach(value => {
						if (!this.loanSearchState[key].includes(value)) {
							this.showTeamPicks = false;
						}
					});
				} else if (this.loanSearchState[key] !== this.challengeFilters[key]) {
					this.showTeamPicks = false;
				}
			});
		},
	}
};
</script>
