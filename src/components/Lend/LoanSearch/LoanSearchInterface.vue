<template>
	<div class="tw-flex">
		<div class="tw-flex tw-flex-col tw-mr-4">
			<div class="md:tw-hidden tw-mb-3">
				<kv-button variant="secondary" @click="toggleLightbox(true)">
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
						:loading="!initialLoadComplete"
						:facets="facets"
						:loan-search-state="loanSearchState"
						@updated="handleUpdatedFilters"
						@reset="handleResetFilters"
					/>
				</kv-lightbox>
			</div>
			<div class="tw-hidden md:tw-block tw-w-[285px]">
				<loan-search-filter
					:loading="!initialLoadComplete"
					:facets="facets"
					:loan-search-state="loanSearchState"
					@updated="handleUpdatedFilters"
					@reset="handleResetFilters"
				/>
			</div>
		</div>
		<div v-if="initialLoadComplete" class="md:tw-hidden tw-pt-1.5">
			<p>{{ totalCount }} Loans</p>
		</div>
		<div class="tw-col-span-2 tw-relative tw-grow">
			<kv-section-modal-loader :loading="loading" bg-color="secondary" size="large" />
			<div v-if="initialLoadComplete" class="tw-hidden md:tw-block tw-h-4 tw-mb-2 md:tw-mb-3 lg:tw-mb-3.5">
				<p>{{ totalCount }} Loans</p>
			</div>
			<kv-grid class="tw-grid-rows-4">
				<loan-card-controller
					v-for="loan in loans"
					:items-in-basket="null"
					:is-visitor="true"
					:key="loan.id"
					:loan="loan"
					loan-card-type="ListLoanCard"
					:rounded-corners="true"
				/>
			</kv-grid>
			<kv-pager
				v-if="totalCount > 0"
				:limit="loanSearchState.pageLimit"
				:total="totalCount"
				:offset="loanSearchState.pageOffset"
				@page-changed="handleUpdatedFilters"
			/>
		</div>
	</div>
</template>

<script>
import loanSearchStateQuery from '@/graphql/query/loanSearchState.graphql';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import LoanSearchFilter from '@/components/Lend/LoanSearch/LoanSearchFilter';
import {
	FLSS_QUERY_TYPE,
	formatSortOptions,
	runFacetsQueries,
	transformIsoCodes,
	transformThemes,
	runLoansQuery,
	fetchLoanFacets,
	applyQueryParams,
	updateQueryParams,
	updateSearchState,
	transformSectors,
} from '@/util/loanSearchUtils';
import KvSectionModalLoader from '@/components/Kv/KvSectionModalLoader';
import KvPager from '@/components/Kv/KvPager';
import { getDefaultLoanSearchState } from '@/api/localResolvers/loanSearch';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

export default {
	name: 'LoanSearchInterface',
	inject: ['apollo', 'cookieStore'],
	components: {
		LoanCardController,
		KvGrid,
		KvButton,
		LoanSearchFilter,
		KvLightbox,
		KvSectionModalLoader,
		KvPager,
	},
	data() {
		return {
			initialLoadComplete: false,
			loading: true,
			/**
			 * All available facet options from lend API. Format:
			 * {
			 *   countryFacets: [
			 *     {
			 *       name: '',
			 *       isoCode: '',
			 *       region: '',
			 *     }
			 *   ],
			 *   sectorFacets: [
			 *     {
			 *       id: 1,
			 *       name: '',
			 *     }
			 *   ],
			 *   themeFacets: [
			 *     {
			 *       id: 1,
			 *       name: '',
			 *     }
			 *   ],
			 * }
			 */
			allFacets: undefined,
			/**
			 * Facet options based on the loans available. Format:
			 * {
			 *   regions: [
			 *     {
			 *       region: '',
			 *       numLoansFundraising: 1,
			 *       countries: [
			 *         {
			 *           name: '',
			 *           region: '',
			 *           isoCode: '',
			 *           numLoansFundraising: 1,
			 *         }
			 *       ]
			 *     }
			 *   ],
			 *   sectors: [
			 *     {
			 *       id: 1,
			 *       name: '',
			 *       numLoansFundraising: 1,
			 *     }
			 *   ],
			 *   themes: [
			 *     {
			 *       id: 1,
			 *       name: '',
			 *       numLoansFundraising: 1,
			 *     }
			 *   ],
			 * }
			 */
			facets: {},
			loans: [],
			totalCount: 0,
			isLightboxVisible: false,
			loanSearchState: getDefaultLoanSearchState(),
			queryType: FLSS_QUERY_TYPE
		};
	},
	async mounted() {
		// Fetch the facet options from the lend and FLSS APIs
		this.allFacets = await fetchLoanFacets(this.apollo);

		// Initialize the search filters with the query string params
		await applyQueryParams(this.apollo, this.$route.query, this.allFacets, this.queryType);

		// Here we subscribe to the loanSearchState and run the loan query when it updates
		// TODO: work some guards to prevent duplicate queries and throttling to more carefully control # of queries
		this.apollo.watchQuery({ query: loanSearchStateQuery }).subscribe({
			next: async ({ data }) => {
				// Toggle loans modal loader
				this.loading = true;

				// Utilize the results of the existing query of the loan search state for updating the filters
				this.loanSearchState = data?.loanSearchState;

				// Update the query string with the latest loan search state
				updateQueryParams(this.loanSearchState, this.$router, this.allFacets, this.queryType);

				const [{ isoCodes, themes, sectors }, { loans, totalCount }] = await Promise.all([
					// Get filtered facet options from FLSS
					// TODO: Prevent this from running on every query (not needed for sorting and paging)
					await runFacetsQueries(this.apollo, this.loanSearchState),
					// Get filtered loans from FLSS
					await runLoansQuery(this.apollo, this.loanSearchState)
				]);

				// Merge all facet options with filtered options
				this.facets = {
					regions: transformIsoCodes(isoCodes, this.allFacets?.countryFacets),
					sectors: transformSectors(sectors, this.allFacets?.sectorFacets),
					themes: transformThemes(themes, this.allFacets?.themeFacets),
					sortOptions: formatSortOptions(this.allFacets?.standardSorts ?? [], this.allFacets?.flssSorts ?? [])
				};

				// Store loan data in component
				this.loans = loans;
				this.totalCount = totalCount;

				// Toggle loading flags
				if (!this.initialLoadComplete) {
					this.initialLoadComplete = true;
				}
				this.loading = false;
			}
		});
	},
	methods: {
		toggleLightbox(toggle) {
			this.isLightboxVisible = toggle;
		},
		updateState(filters = {}) {
			updateSearchState(this.apollo, filters, this.allFacets, this.queryType, this.loanSearchState);
		},
		handleUpdatedFilters(filters) {
			this.updateState({ ...this.loanSearchState, ...filters });
		},
		handleResetFilters() {
			this.updateState();
		},
	},
	watch: {
		$route(to) {
			// Update the loan search state when the user clicks back/forward in the browser
			applyQueryParams(this.apollo, to.query, this.allFacets, this.queryType, this.loanSearchState);
		}
	}
};
</script>
