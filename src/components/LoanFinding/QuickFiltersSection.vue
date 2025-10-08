<template>
	<div ref="sectionTop" class="tw-w-full tw-bg-secondary">
		<div class="tw-mx-auto tw-pt-2 tw-pb-1 tw-px-2.5 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
			<div
				v-show="showOverlay"
				style="opacity: 0.5;" class="tw-fixed tw-inset-0 tw-bg-black tw-z-3"
			></div>
			<h2 class="tw-text-h2 tw-mb-1 tw-text-primary">
				Find a loan by category and location
			</h2>
			<quick-filters
				class="tw-z-2"
				:total-loans="totalCount"
				:filter-options="quickFiltersOptions"
				:filters-loaded="filtersLoaded"
				:targeted-loan-channel-url="targetedLoanChannelURL"
				:with-categories="true"
				:enable-qf-mobile="enableQfMobile"
				:default-sort="defaultSort"
				tracking-category="lending-home"
				@update-filters="updateQuickFilters"
				@reset-filters="resetFilters"
				@handle-overlay="handleQuickFiltersOverlay"
			/>
			<!-- emtpy state for no loans result -->
			<empty-state v-show="emptyState" />

			<div :class="{ 'tw-hidden lg:tw-block' : enableQfMobile }">
				<div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4 tw-mt-2">
					<kv-classic-loan-card-container
						v-for="(loan, index) in loans"
						:key="`new-card-${loan.id}-${index}`"
						:add-to-basket-exp-enabled="enableAddToBasketExp"
						:custom-loan-details="true"
						:enable-five-dollars-notes="enableFiveDollarsNotes"
						:loan-id="loan.id"
						:show-tags="true"
						:use-full-width="true"
						:user-balance="userBalance"
						:custom-href="getCustomHref($router, loan.id)"
						:enable-ai-loan-pills="enableAiLoanPills"
						:ai-pills="loan.aiPills"
						@add-to-basket="addToBasket"
						@show-cart-modal="showCartModal"
						@show-loan-details="showLoanDetails"
						@mouseenter="$emit('mouse-enter-loan-card', loan?.id)"
					/>
				</div>
				<div class="tw-w-full tw-my-4">
					<kv-pagination
						v-show="!emptyState"
						:total="totalCount"
						:limit="loanSearchState.pageLimit"
						:offset="loanSearchState.pageOffset"
						@page-changed="pageChange"
						:scroll-to-top="false"
					/>
				</div>
			</div>

			<lending-category-section
				v-if="enableQfMobile"
				:key="loans.length"
				:loans="loans"
				class="lg:tw-hidden tw-pb-3"
				:enable-five-dollars-notes="enableFiveDollarsNotes"
				:enable-qf-mobile="enableQfMobile"
				:empty-state="emptyState"
				:user-balance="userBalance"
				:loan-search-state="flssLoanSearch"
				:page-limit="loanSearchState.pageLimit"
				:enable-ai-loan-pills="enableAiLoanPills"
				@add-to-basket="addToBasket"
				@mouseenter="$emit('mouse-enter-loan-card', $event)"
			/>
		</div>
	</div>
</template>

<script>
import QuickFilters from '#src/components/LoansByCategory/QuickFilters/QuickFilters';
import { runFacetsQueries, fetchLoanFacets, runLoansQuery } from '#src/util/loanSearch/dataUtils';
import { fetchCategories, FLSS_ORIGIN_LEND_BY_CATEGORY } from '#src/util/flssUtils';
import { getCustomHref } from '#src/util/loanUtils';
import { transformIsoCodes } from '#src/util/loanSearch/filters/regions';
import KvClassicLoanCardContainer from '#src/components/LoanCards/KvClassicLoanCardContainer';
import KvPagination from '#src/components/Kv/KvPagination';
import LendingCategorySection from '#src/components/LoanFinding/LendingCategorySection';
import addToBasketExpMixin from '#src/plugins/add-to-basket-exp-mixin';
import { getLoansIds, fetchAiLoanPills, addAiPillsToLoans } from '#src/util/aiLoanPIillsUtils';
import EmptyState from './EmptyState';

export default {
	name: 'QuickFiltersSection',
	components: {
		QuickFilters,
		KvClassicLoanCardContainer,
		KvPagination,
		EmptyState,
		LendingCategorySection
	},
	inject: ['apollo'],
	mixins: [addToBasketExpMixin],
	emits: ['add-to-basket', 'data-loaded', 'show-loan-details', 'mouse-enter-loan-card'],
	props: {
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		},
		userBalance: {
			type: String,
			default: undefined
		},
		enableQfMobile: {
			type: Boolean,
			default: false
		},
		enableAlmostFundedRow: {
			type: Boolean,
			default: false
		},
		enableAiLoanPills: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			totalCount: 0,
			targetedLoanChannelURL: '',
			filtersLoaded: false,
			flssLoanSearch: {},
			loanSearchState: {
				pageOffset: 0,
				pageLimit: 6,
				sortBy: this.enableAlmostFundedRow ? 'expiringSoon' : 'amountLeft'
			},
			// Default loans for loading animations
			loans: new Array(6).fill({ id: 0 }),
			backupLoans: [],
			quickFiltersOptions: {
				categories: [{
					title: 'All categories',
					key: 0
				}],
				gender: [{
					key: 'all',
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
			getCustomHref,
		};
	},
	computed: {
		defaultSort() {
			return this.enableAlmostFundedRow ? 'expiringSoon' : 'amountLeft';
		}
	},
	async mounted() {
		this.allFacets = await fetchLoanFacets(this.apollo);
		await this.fetchFilterData(this.flssLoanSearch);
		const { loans, totalCount } = await runLoansQuery(
			this.apollo,
			{ ...this.flssLoanSearch, ...this.loanSearchState },
			FLSS_ORIGIN_LEND_BY_CATEGORY
		);

		let processedLoans = loans;
		if (this.enableAiLoanPills) {
			processedLoans = await this.assignAiLoanPillsToLoans(loans);
		}
		this.loans = processedLoans;
		this.totalCount = totalCount;
		this.backupLoans = this.loans.slice(3);
	},
	methods: {
		async assignAiLoanPillsToLoans(loans) {
			const loanIds = getLoansIds(loans);
			const aiLoansPills = await fetchAiLoanPills(this.apollo, loanIds);
			return addAiPillsToLoans(loans, aiLoansPills);
		},
		addToBasket(payload) {
			this.$emit('add-to-basket', payload);
		},
		// TODO: Rearchitect this at some point.
		// This won't work for categories that have
		// multiple criteria applied to their FLSSLoanSearch criteria.
		// See CORE-944
		async updateQuickFilters(filter) {
			this.loanSearchState.pageOffset = 0;
			if (filter?.gender !== undefined) {
				this.flssLoanSearch.gender = filter.gender;
			} else if (filter?.sortBy) {
				this.flssLoanSearch.sortBy = filter.sortBy;
				this.loanSearchState.sortBy = filter.sortBy;
			} else if (filter?.country) {
				this.flssLoanSearch.countryIsoCode = filter.country;
			} else {
				// We want to reset the flss paramaters for categories
				delete this.flssLoanSearch.sectorId;
				delete this.flssLoanSearch.tagId;
				delete this.flssLoanSearch.activityId;
				delete this.flssLoanSearch.themeId;
				delete this.flssLoanSearch.partnerId;
				this.flssLoanSearch = {
					...this.flssLoanSearch,
					...filter
				};
			}
			this.fetchFilterData(this.flssLoanSearch);
			this.loans = new Array(6).fill({ id: 0 });
			const { loans, totalCount } = await runLoansQuery(
				this.apollo,
				{ ...this.flssLoanSearch, ...this.loanSearchState },
				FLSS_ORIGIN_LEND_BY_CATEGORY
			);
			this.totalCount = totalCount;
			if (loans.length > 0) {
				this.emptyState = false;
				let processedLoans = loans;
				if (this.enableAiLoanPills) {
					processedLoans = await this.assignAiLoanPillsToLoans(loans);
				}
				this.loans = processedLoans;
			} else {
				this.emptyState = true;
				this.loans = this.backupLoans;
				this.$kvTrackEvent(
					'lending-home',
					'show',
					'quick-filters-empty-state'
				);
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
			const { isoCodes } = await runFacetsQueries(this.apollo, loanSearchState, FLSS_ORIGIN_LEND_BY_CATEGORY);
			const fetchedCategories = await fetchCategories(this.apollo);

			// Merge all facet options with filtered options
			const facets = {
				regions: transformIsoCodes(isoCodes, this.allFacets?.countryFacets),
			};

			const categories = fetchedCategories?.lend?.loanChannels?.values ?? [];
			const sortedCategories = [...categories].sort(

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
				},
				{
					title: 'Most recent',
					key: 'mostRecent'
				}
			];
			this.quickFiltersOptions.gender = [
				{
					title: 'All genders',
					key: 'all',
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
			const label = this.loanSearchState.pageOffset === 0 ? 'next' : 'back';
			this.$kvTrackEvent(
				'lending-home',
				'click',
				label
			);
			this.loanSearchState.pageOffset = pageOffset;
			this.updateLoans();
			this.$refs.sectionTop.scrollIntoView({ behavior: 'smooth' });
		},
		async updateLoans() {
			const { loans } = await runLoansQuery(
				this.apollo,
				{ ...this.flssLoanSearch, ...this.loanSearchState },
				FLSS_ORIGIN_LEND_BY_CATEGORY
			);
			let processedLoans = loans;
			if (this.enableAiLoanPills) {
				processedLoans = await this.assignAiLoanPillsToLoans(loans);
			}
			this.loans = processedLoans;
		},
		showLoanDetails(payload) {
			this.$emit('show-loan-details', payload);
		}
	},
	watch: {
		loans(data) {
			this.$emit('data-loaded', {
				data,
				pageOffset: this.loanSearchState?.pageOffset ?? 0
			});
		},
	},
};
</script>
