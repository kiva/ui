<template>
	<div>
		<div
			v-show="showOverlay"
			style="opacity: 0.5;" class="tw-fixed tw-inset-0 tw-bg-black tw-z-1"
		></div>
		<h2 class="tw-text-h2 tw-text-primary">
			Find a loan by category and location
		</h2>
		<quick-filters
			class="tw-z-2"
			:total-loans="totalCount"
			:filter-options="quickFiltersOptions"
			:filters-loaded="filtersLoaded"
			:targeted-loan-channel-url="targetedLoanChannelURL"
			:with-categories="true"
			@update-filters="updateQuickFilters"
			@reset-filters="resetFilters"
			@handle-overlay="handleQuickFiltersOverlay"
		/>
		<!-- eslint-disable max-len -->
		<div
			v-show="emptyState"
			class="tw-flex tw-flex-col lg:tw-flex-row tw-gap-2 tw-bg-white tw-px-2 tw-pb-2 lg:tw-py-4 lg:tw-px-8 tw-items-center"
		>
			<img class="tw-w-8 lg:tw-w-16" src="~@/assets/images/sad_cloud.svg">
			<h2 class="tw-text-h2">
				We couldn’t find any loans that match your current filters but here are other recommended loans for you.
			</h2>
		</div>
		<div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4 tw-mt-2">
			<kiva-classic-basic-loan-card
				v-for="(loan, index) in loans"
				:key="index"
				:item-index="index"
				:loan-id="loan.id"
				:show-action-button="true"
				:use-full-width="true"
			/>
		</div>
		<div class="tw-w-full tw-my-4">
			<kv-pagination
				v-show="!emptyState"
				:total="totalCount >= 12 ? 12 : totalCount"
				:limit="loanSearchState.pageLimit"
				:offset="loanSearchState.pageOffset"
				@page-changed="pageChange"
				:scroll-to-top="false"
			/>
		</div>
		<div v-show="showSeeMoreCta" class="tw-w-full tw-my-4 tw-text-center">
			<kv-button
				variant="secondary"
				:href="filterPageUrl()"
			>
				See more loans
			</kv-button>
		</div>
	</div>
</template>

<script>
import QuickFilters from '@/components/LoansByCategory/QuickFilters/QuickFilters';
import { runFacetsQueries, fetchLoanFacets, runLoansQuery } from '@/util/loanSearch/dataUtils';
import { fetchCategories, FLSS_ORIGIN_LENDING_HOME } from '@/util/flssUtils';
import { transformIsoCodes } from '@/util/loanSearch/filters/regions';
import KivaClassicBasicLoanCard from '@/components/LoanCards/KivaClassicBasicLoanCard';
import KvPagination from '@/components/Kv/KvPagination';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'QuickFiltersSection',
	components: {
		QuickFilters,
		KivaClassicBasicLoanCard,
		KvPagination,
		KvButton
	},
	inject: ['apollo'],
	data() {
		return {
			totalCount: 0,
			targetedLoanChannelURL: '',
			filtersLoaded: false,
			flssLoanSearch: {},
			loanSearchState: {
				pageOffset: 0,
				pageLimit: 6,
				sortBy: 'amountLeft'
			},
			// Default loans for loading animations
			loans: [
				{ id: 0 }, { id: 0 }, { id: 0 },
				{ id: 0 }, { id: 0 }, { id: 0 }
			],
			backupLoans: [],
			quickFiltersOptions: {
				categories: [{
					title: 'All categories',
					key: 0
				}],
				gender: [{
					key: '',
					title: 'All genders'
				}],
				sorting: [{
					title: 'Almost funded',
					key: 'amountLeft',
				}],
			},
			allFacets: [],
			emptyState: false,
			showOverlay: false,
		};
	},
	async mounted() {
		this.allFacets = await fetchLoanFacets(this.apollo);
		await this.fetchFilterData(this.flssLoanSearch);
		const { loans, totalCount } = await runLoansQuery(
			this.apollo,
			{ ...this.flssLoanSearch, ...this.loanSearchState },
			FLSS_ORIGIN_LENDING_HOME
		);
		this.loans = loans;
		this.totalCount = totalCount;
		this.backupLoans = this.loans.slice(3);
	},
	computed: {
		showSeeMoreCta() {
			return this.loanSearchState.pageOffset !== 0 && !this.flssLoanSearch.activityId;
		}
	},
	methods: {
		filterPageUrl() {
			const location = this.flssLoanSearch.countryIsoCode?.toString();
			// parse, stringify, and undefined are all needed to ensure
			// we don't have a gender=undefined or gender= in our string
			const paramStr = JSON.parse(JSON.stringify({
				gender: this.flssLoanSearch.gender || undefined,
				sortBy: this.flssLoanSearch.sortBy || undefined,
				sector: this.flssLoanSearch.sectorId || undefined,
				tag: this.flssLoanSearch.tagId || undefined,
				attribute: this.flssLoanSearch.themeId || undefined,
				location: location || undefined,
			}));
			const params = new URLSearchParams(paramStr);
			return `/lend/filter?${params.toString()}`;
		},
		async updateQuickFilters(filter) {
			this.loanSearchState.pageOffset = 0;
			if (filter.gender !== undefined) {
				this.flssLoanSearch.gender = filter.gender;
			} else if (filter.sortBy) {
				this.flssLoanSearch.sortBy = filter.sortBy;
				this.loanSearchState.sortBy = filter.sortBy;
			} else if (filter.country) {
				this.flssLoanSearch.countryIsoCode = filter.country;
			} else {
				// We want to reset the flss paramaters for categories
				delete this.flssLoanSearch.sectorId;
				delete this.flssLoanSearch.tagId;
				delete this.flssLoanSearch.activityId;
				delete this.flssLoanSearch.themeId;
				this.flssLoanSearch = {
					...this.flssLoanSearch,
					...filter
				};
			}
			const { loans, totalCount } = await runLoansQuery(
				this.apollo,
				{ ...this.flssLoanSearch, ...this.loanSearchState },
				FLSS_ORIGIN_LENDING_HOME
			);
			this.totalCount = totalCount;
			if (loans.length > 0) {
				this.emptyState = false;
				this.loans = loans;
			} else {
				this.emptyState = true;
				this.loans = this.backupLoans;
			}
		},
		async resetFilters() {
			this.loanSearchState.pageOffset = 0;
			this.flssLoanSearch = {};
			this.updateLoans();
		},
		handleQuickFiltersOverlay(showOverlay) {
			this.showOverlay = showOverlay;
		},
		async fetchFilterData(loanSearchState = {}) {
			// TODO: Prevent this from running on every query (not needed for sorting and paging)
			const { isoCodes } = await runFacetsQueries(this.apollo, loanSearchState, FLSS_ORIGIN_LENDING_HOME);
			const fetchedCategories = await fetchCategories(this.apollo);

			// Merge all facet options with filtered options
			const facets = {
				regions: transformIsoCodes(isoCodes, this.allFacets?.countryFacets),
			};

			const categories = fetchedCategories.lend?.loanChannels?.values;
			const sortedCategories = [...categories].sort(
				// eslint-disable-next-line no-nested-ternary
				(catA, catB) => {
					if (catA.title < catB.title) return -1;
					if (catA.title > catB.title) return 1;
					return 0;
				}
			);

			this.quickFiltersOptions.categories = [
				...[{ title: 'All categories', key: 0 }],
				...sortedCategories
			];

			this.quickFiltersOptions.location = facets.regions;
			// TODO: Pull sort by and gender filters from API
			this.quickFiltersOptions.sorting = [
				{
					title: 'Almost funded',
					key: 'amountLeft',
				},
				{
					title: 'Recommended',
					key: 'personalized',
				},
				{
					title: 'Amount high to low',
					key: 'amountHighToLow'
				},
				{
					title: 'Amount low to high',
					key: 'amountLowToHigh'
				},
				{
					title: 'Ending soon',
					key: 'expiringSoon'
				}
			];
			this.quickFiltersOptions.gender = [
				{
					title: 'All genders',
					key: '',
				},
				{
					title: 'Women',
					key: 'female',
				},
				{
					title: 'Men',
					key: 'male',
				},
				{
					title: 'Non-binary',
					key: 'nonbinary',
				}
			];

			this.filtersLoaded = true;
		},
		pageChange({ pageOffset }) {
			this.loanSearchState.pageOffset = pageOffset;
			this.updateLoans();
		},
		async updateLoans() {
			const { loans } = await runLoansQuery(
				this.apollo,
				{ ...this.flssLoanSearch, ...this.loanSearchState },
				FLSS_ORIGIN_LENDING_HOME
			);
			this.loans = loans;
		}
	},
};
</script>
