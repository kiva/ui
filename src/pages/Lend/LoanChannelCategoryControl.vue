<template>
	<div class="tw-relative">
		<div
			class="tw-mx-auto tw-px-2.5 md:tw-px-4 lg:tw-px-8"
			style="max-width: 1200px;"
		>
			<div
				class="tw-px-1 heading-region"
			>
				<router-link
					:to="filterUrl"
					class="tw-text-action tw-flex tw-items-center tw-float-right"
					@click="trackAdvancedFilters"
				>
					<img class="tw-w-2 tw-mr-1" :src="tuneUrl">
					Advanced filters
				</router-link>
				<p class="tw-text-small">
					<router-link to="/lend-by-category">
						All Loans
					</router-link> >
					<span class="show-for-large">{{ loanChannelName }}</span>
				</p>
				<h1 class="tw-mb-2">
					{{ pageHeadline }}
				</h1>
				<p
					v-if="loanChannelDescription"
					class="page-subhead tw-mb-4"
				>
					{{ loanChannelDescription }}
				</p>
				<p v-else>
					We couldn't find any loans for this search.
					<router-link to="/lend-by-category">
						<span>Browse these loans</span>
					</router-link>.
				</p>
			</div>
		</div>

		<div
			class="tw-mx-auto tw-px-2.5 md:tw-px-4 lg:tw-px-8"
			style="max-width: 1200px;"
		>
			<quick-filters
				class="tw-z-2 tw-px-1"
				:total-loans="totalCount"
				:filter-options="quickFiltersOptions"
				:filters-loaded="filtersLoaded"
				:targeted-loan-channel-url="targetedLoanChannelURL"
				tracking-category="search"
				@update-filters="updateQuickFilters"
				@reset-filters="resetFilters"
				@handle-overlay="handleQuickFiltersOverlay"
			/>
		</div>

		<div
			class="tw-relative tw-mx-auto tw-px-2.5 md:tw-px-4 lg:tw-px-8"
			style="max-width: 1200px;"
		>
			<!-- empty state for no loans result -->
			<empty-state
				v-show="emptyState"
				class="tw-mb-2 tw-mx-1"
			/>

			<!-- eslint-disable max-len -->
			<div v-show="showQuickFiltersOverlay" style="opacity: 0.5;" class="tw-absolute tw-inset-0 tw-bg-white tw-z-3 lg:tw-mx-8"></div>
			<div v-if="loans && loans.length > 0" class="tw-w-full">
				<div v-if="!displayLoanPromoCard || emptyState">
					<div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4 tw-px-1">
						<kv-classic-loan-card-container
							v-for="(loan, index) in loans"
							:key="`new-card-${loan.id}-${index}`"
							:loan-id="loan.id"
							:use-full-width="true"
							:show-tags="true"
							:enable-five-dollars-notes="enableFiveDollarsNotes"
							:user-balance="userBalance"
							:add-to-basket-exp-enabled="enableAddToBasketExp"
							@show-cart-modal="showCartModal"
						/>
					</div>

					<helpme-choose-wrapper
						v-if="showHelpMeChooseFeat"
						:remaining-loans="helpMeChooseRemainingLoans"
						:items-in-basket="itemsInBasket"
						:is-visitor="isVisitor"
						:user-data="userData"
						:loan-channel-name="loanChannelName"
						:loans="helpMeChooseLoans"
						@update="getHelpMeChooseLoans($event)"
						:is-loading="isLoadingHC"
						:enable-five-dollars-notes="enableFiveDollarsNotes"
						@show-cart-modal="showCartModal"
					/>
				</div>
				<div v-else>
					<div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4 tw-px-1">
						<kv-classic-loan-card-container
							v-for="(loan, index) in firstLoan"
							:key="`new-card-${loan.id}-${index}`"
							:loan-id="loan.id"
							:use-full-width="true"
							:show-tags="true"
							:enable-five-dollars-notes="enableFiveDollarsNotes"
							:user-balance="userBalance"
							:add-to-basket-exp-enabled="enableAddToBasketExp"
							@show-cart-modal="showCartModal"
						/>

						<promo-grid-loan-card-exp
							:category-url="mgTargetCategory.url"
							:category-label="mgTargetCategory.label"
						/>

						<kv-classic-loan-card-container
							v-for="(loan, index) in remainingLoans"
							:key="`new-card-${loan.id}-${index}`"
							:loan-id="loan.id"
							:use-full-width="true"
							:show-tags="true"
							:enable-five-dollars-notes="enableFiveDollarsNotes"
							:user-balance="userBalance"
							:add-to-basket-exp-enabled="enableAddToBasketExp"
							@show-cart-modal="showCartModal"
						/>
					</div>

					<helpme-choose-wrapper
						v-if="showHelpMeChooseFeat"
						:remaining-loans="helpMeChooseRemainingLoans"
						:items-in-basket="itemsInBasket"
						:is-visitor="isVisitor"
						:user-data="userData"
						:loan-channel-name="loanChannelName"
						:loans="helpMeChooseLoans"
						@update="getHelpMeChooseLoans($event)"
						:is-loading="isLoadingHC"
						:enable-five-dollars-notes="enableFiveDollarsNotes"
						@show-cart-modal="showCartModal"
					/>
				</div>
				<kv-pagination
					v-if="totalCount > 0"
					:total="totalCount"
					:limit="limit"
					:offset="offset"
					@page-changed="pageChange"
				/>
				<div v-if="totalCount > 0" class="loan-count tw-text-tertiary">
					{{ totalCount }} loans
				</div>
			</div>
		</div>

		<kv-loading-overlay v-if="loading" class="tw-z-2" />
	</div>
</template>

<script>
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import _map from 'lodash/map';
import _filter from 'lodash/filter';
import numeral from 'numeral';
import logReadQueryError from '#src/util/logReadQueryError';
import loanChannelPageQuery from '#src/graphql/query/loanChannelPage.graphql';
import loanChannelQueryMapMixin from '#src/plugins/loan-channel-query-map';
import KvPagination from '#src/components/Kv/KvPagination';
import PromoGridLoanCardExp from '#src/components/LoanCards/PromoGridLoanCardExp';
import KvLoadingOverlay from '#src/components/Kv/KvLoadingOverlay';
import updateLoanReservation from '#src/graphql/mutation/updateLoanReservation.graphql';
import {
	preFetchChannel,
	getCachedChannel,
	watchChannelQuery,
	getLoanChannel,
	getFLSSQueryMap,
} from '#src/util/loanChannelUtils';
import { runFacetsQueries, fetchLoanFacets } from '#src/util/loanSearch/dataUtils';
import { transformIsoCodes } from '#src/util/loanSearch/filters/regions';
import { FLSS_ORIGIN_CATEGORY } from '#src/util/flssUtils';
import QuickFilters from '#src/components/LoansByCategory/QuickFilters/QuickFilters';
import HelpmeChooseWrapper from '#src/components/LoansByCategory/HelpmeChoose/HelpmeChooseWrapper';
import KvClassicLoanCardContainer from '#src/components/LoanCards/KvClassicLoanCardContainer';
import EmptyState from '#src/components/LoanFinding/EmptyState';
import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import addToBasketExpMixin from '#src/plugins/add-to-basket-exp-mixin';
import tuneUrl from '#src/assets/images/tune.svg?url';

const defaultLoansPerPage = 12;

const FLSS_ONGOING_EXP_KEY = 'EXP-FLSS-Ongoing-Sitewide-3';

// Routes to show monthly good promo
const targetRoutes = [
	{ route: 'women', url: '/monthlygood?category=women', label: 'women' },
	{ route: 'loans-to-women', url: '/monthlygood?category=women', label: 'women' },
	{ route: 'education', url: '/monthlygood?category=education', label: 'students' },
	{ route: 'loans-for-education', url: '/monthlygood?category=education', label: 'students' },
	{ route: 'refugees-and-i-d-ps', url: '/monthlygood?category=refugees', label: 'refugees' },
	{ route: 'loans-to-refugees-and-i-d-ps', url: '/monthlygood?category=refugees', label: 'refugees' },
	{ route: 'eco-friendly', url: '/monthlygood?category=eco_friendly', label: 'eco-friendly loans' },
	{ route: 'eco-friendly-loans', url: '/monthlygood?category=eco_friendly', label: 'eco-friendly loans' },
	{ route: 'agriculture', url: '/monthlygood?category=agriculture', label: 'farmers' },
	{ route: 'loans-to-farmers', url: '/monthlygood?category=agriculture', label: 'farmers' },
	{ route: 'kiva-u-s', url: '/monthlygood?category=us_borrowers', label: 'U.S. borrowers' },
	{ route: 'loans-to-u-s-small-businesses', url: '/monthlygood?category=us_borrowers', label: 'U.S. borrowers' }, // eslint-disable-line max-len
	{ route: 'united-states-loans', url: '/monthlygood?category=us_borrowers', label: 'U.S. borrowers' },
];

function getTargetedChannel(targetedRoute, allChannels) {
	const loanChannels = _get(allChannels, 'lend.loanChannels.values');
	// map id from loan channels
	const targetedLoanChannel = _filter(
		loanChannels,
		loanChannel => {
			return loanChannel.url.split('/').pop() === targetedRoute;
		}
	);
	// isolate targeted loan channel id
	return _get(targetedLoanChannel[0], 'id') || null;
}

function getPageOffset(query, limit) {
	const pageNum = numeral(query.page).value() - 1;

	return pageNum > 0 ? limit * pageNum : 0;
}

export default {
	name: 'LoanChannelCategoryControl',
	head() {
		return {
			title: this.metaTitle,
			link: [
				{
					vmid: 'canonical',
					rel: 'canonical',
					href: this.canonicalUrl
				}
			],
			meta: [
				{
					vmid: 'description',
					name: 'description',
					content: this.metaDescription
				}
			].concat([
				{
					vmid: 'og:title',
					property: 'og:title',
					content: this.metaTitle
				},
				{
					vmid: 'og:description',
					property: 'og:description',
					content: this.metaDescription
				},
			]).concat([
				{
					vmid: 'twitter:title',
					name: 'twitter:title',
					content: this.metaTitle
				},
				{
					name: 'twitter:description',
					vmid: 'twitter:description',
					content: this.metaDescription
				}
			])
		};
	},
	props: {
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		},
	},
	components: {
		KvPagination,
		KvLoadingOverlay,
		QuickFilters,
		HelpmeChooseWrapper,
		PromoGridLoanCardExp,
		KvClassicLoanCardContainer,
		EmptyState,
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [loanChannelQueryMapMixin, addToBasketExpMixin],
	data() {
		return {
			offset: 0,
			limit: defaultLoansPerPage,
			filters: { },
			targetedLoanChannelURL: null,
			targetedLoanChannelID: null,
			loanChannel: {},
			isVisitor: true,
			itemsInBasket: [],
			pageQuery: { page: '1' },
			loading: false,
			displayLoanPromoCard: false,
			mgTargetCategory: null,
			selectedChannelLoanIds: [],
			selectedChannel: {},
			showCarousel: true,
			showViewMoreCard: false,
			detailedLoan: null,
			allFacets: [],
			flssLoanSearch: {},
			quickFiltersOptions: {
				gender: [{
					key: 'all',
					title: 'All genders'
				}],
				sorting: [{
					key: 'personalized',
					title: 'Recommended'
				}]
			},
			filtersLoaded: false,
			selectedQuickFilters: {},
			userData: {},
			showQuickFiltersOverlay: false,
			helpMeChooseSort: null,
			helpMeChooseLoans: [],
			isLoadingHC: true,
			tuneUrl,
		};
	},
	computed: {
		urlParams() {
			const page = Math.floor(this.offset / this.limit) + 1;

			return { ...(page > 1 && { page: String(page) }) };
		},
		lastLoanPage() {
			return Math.ceil(this.totalCount / this.limit);
		},
		loanChannelName() {
			return this.loanChannel?.name ?? 'No loans found';
		},
		loanChannelDescription() {
			return this.loanChannel?.description;
		},
		pageHeadline() {
			return this.loanChannel?.headline ?? this.loanChannelName;
		},
		metaTitle() {
			const name = this.loanChannel?.metaTitle ?? this.loanChannelName;
			return `${name} | Invest & Support`;
		},
		metaDescription() {
			return this.loanChannel?.metaDescription ?? this.loanChannelDescription ?? '';
		},
		allLoans() {
			return (this.loanChannel?.loans?.values ?? []).filter(loan => loan !== null);
		},
		loans() {
			if (this.showHelpMeChooseFeat) {
				return _filter(this.allLoans, (loan, index) => index < 6);
			}
			if (this.emptyState) return this.backupLoans;
			return this.allLoans;
		},
		firstLoan() {
			// Handle an edge case where a backend error could lead to a null loan
			return this.allLoans?.[0] ? [this.allLoans[0]] : [];
		},
		remainingLoans() {
			if (this.showHelpMeChooseFeat) {
				return _filter(this.allLoans, (loan, index) => index > 0 && index < 5);
			}
			return _filter(this.allLoans, (loan, index) => index > 0);
		},
		helpMeChooseRemainingLoans() {
			if (this.displayLoanPromoCard) {
				return _filter(this.allLoans, (loan, index) => index > 4);
			}
			return _filter(this.allLoans, (loan, index) => index > 5);
		},
		loanIds() {
			return _map(this.allLoans, 'id');
		},
		totalCount() {
			return _get(this.loanChannel, 'loans.totalCount') || 0;
		},
		loanQueryVars() {
			return {
				ids: [this.targetedLoanChannelID],
				limit: this.limit,
				offset: this.offset,
				basketId: this.cookieStore.get('kvbskt'),
				origin: FLSS_ORIGIN_CATEGORY,
				// Only add quick filters if they are defined so that channel filters aren't incorrectly overridden
				...(this.selectedQuickFilters.gender && { gender: this.selectedQuickFilters.gender }),
				...(this.selectedQuickFilters.sortBy && { sortBy: this.selectedQuickFilters.sortBy }),
				...(!!this.selectedQuickFilters.countryIsoCode?.length && {
					countryIsoCode: this.selectedQuickFilters.countryIsoCode
				}),
			};
		},
		filterUrl() {
			// process eligible filter url
			return this.getFilterUrl();
		},
		canonicalUrl() {
			let url = `https://${this.$appConfig.host}${this.$route.path}`;
			if (this.$route.query.page && Number(this.$route.query.page) > 1) {
				url = `${url}?page=${this.$route.query.page}`;
			}
			return url;
		},
		showHelpMeChooseFeat() {
			const queryMapFLSS = getFLSSQueryMap(this.loanChannelQueryMap, this.targetedLoanChannelURL);
			const hasSortBy = !!queryMapFLSS?.sortBy;

			// Don't show help me choose if the category has sortBy
			// Help me choose categories are just different sortBy options
			return !hasSortBy && this.allLoans?.length > 8;
		},
		emptyState() {
			return this.allLoans?.length <= 0;
		},
		userBalance() {
			return this.userData?.balance;
		},
		hasBasket() {
			return this.itemsInBasket.length > 0;
		},
	},
	apollo: {
		preFetch(config, client, args) {
			const loanChannelPageQueryPromise = client.query({ query: loanChannelPageQuery });

			return Promise.all([
				loanChannelPageQueryPromise,
				client.query({ query: experimentAssignmentQuery, variables: { id: FLSS_ONGOING_EXP_KEY } }),
			]).then(data => {
				const loanChannelPageQueryData = data?.[0]?.data ?? {};

				// combine both 'pages' of loan channels
				const pageQueryData = {
					...loanChannelPageQueryData,
					lend: {
						loanChannels: {
							values: [
								...(loanChannelPageQueryData?.lend?.firstLoanChannels?.values ?? []),
								...(loanChannelPageQueryData?.lend?.secondLoanChannels?.values ?? [])
							]
						}
					}
				};
				const { route } = args;
				const { query, params, path } = (route ?? {});

				// Filter routes on route.param.category to get current path
				const targetedLoanChannelURL = params.category;

				// Isolate targeted loan channel id
				const targetedLoanChannelID = getTargetedChannel(targetedLoanChannelURL, pageQueryData);

				// Get page limit and offset
				const currentRoute = path.replace('/lend-by-category/', '');
				const matchedRoutes = targetRoutes.filter(r => r.route === currentRoute);
				const limit = matchedRoutes.length > 0 ? defaultLoansPerPage - 1 : defaultLoansPerPage;
				const offset = getPageOffset(query, limit);

				return preFetchChannel(
					client,
					// Access map directly since SSR doesn't have mixins available
					loanChannelQueryMapMixin.data().loanChannelQueryMap,
					targetedLoanChannelURL,
					// Build loanQueryVars since SSR doesn't have same context
					{
						ids: [targetedLoanChannelID],
						limit,
						offset,
						origin: FLSS_ORIGIN_CATEGORY
					}
				);
			});
		}
	},
	created() {
		this.loading = true;
		let allChannelsData = {};

		this.initializeMonthlyGoodPromo();

		try {
			allChannelsData = this.apollo.readQuery({
				query: loanChannelPageQuery,
				variables: { basketId: this.loanQueryVars.basketId }
			});
		} catch (e) {
			logReadQueryError(e, 'LoanChannelCategoryControl created loanChannelPageQuery');
		}

		// Combine both 'pages' of loan channels
		const pageQueryData = {
			...allChannelsData,
			lend: {
				loanChannels: {
					values: [
						...(allChannelsData?.lend?.firstLoanChannels?.values ?? []),
						...(allChannelsData?.lend?.secondLoanChannels?.values ?? [])
					]
				}
			}
		};

		// Set user status
		this.isVisitor = !_get(pageQueryData, 'my.userAccount.id');
		this.userData = _get(pageQueryData, 'my.userAccount');

		// Filter routes on param.category to get current path
		this.targetedLoanChannelURL = _get(this.$route, 'params.category');

		// Isolate targeted loan channel id
		this.targetedLoanChannelID = getTargetedChannel(this.targetedLoanChannelURL, pageQueryData);

		// Extract query
		this.pageQuery = _get(this.$route, 'query');

		// Ensure page offset gets set before loading cached data
		this.updateFromParams(this.pageQuery);

		// Prevent pop-in by loading data from the Apollo cache manually here instead of just using the subscription
		const baseData = getCachedChannel(
			this.apollo,
			this.loanChannelQueryMap,
			this.targetedLoanChannelURL,
			this.loanQueryVars,
		);
		if (baseData) this.loading = false;

		// Assign our initial view data
		this.itemsInBasket = _map(_get(baseData, 'shop.basket.items.values'), 'id');
		this.loanChannel = _get(baseData, 'lend.loanChannelsById[0]');

		trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'Lending',
			FLSS_ONGOING_EXP_KEY,
			'EXP-VUE-FLSS-Ongoing-Sitewide'
		);
	},
	async mounted() {
		// Setup Reactivity for Loan Data + Basket Status
		this.activateLoanChannelWatchQuery();

		// check for newly assigned bounceback
		const redirectFromUiCookie = this.cookieStore.get('redirectFromUi') || '';
		if (redirectFromUiCookie === 'true') {
			this.cookieStore.remove('redirectFromUi');
			this.$router.push(this.getFilterUrl());
		}

		// Fetch the facet options from the lend and FLSS APIs
		this.allFacets = await fetchLoanFacets(this.apollo);

		// Load all available facets for specified sector
		await this.fetchFacets();

		this.backupLoans = this.loans?.slice(3) ?? [];
	},
	methods: {
		handleQuickFiltersOverlay(showOverlay) {
			this.showQuickFiltersOverlay = showOverlay;
		},
		trackAdvancedFilters() {
			this.$kvTrackEvent(
				'search',
				'click',
				'category-advanced-filters'
			);
		},
		resetFilters() {
			this.selectedQuickFilters = {};
		},
		updateQuickFilters(filter) {
			// Create new filter object so the watch query is triggered by reference change
			const newFilters = JSON.parse(JSON.stringify(this.selectedQuickFilters));

			if (filter.gender !== undefined) {
				newFilters.gender = filter.gender;
				this.flssLoanSearch.gender = filter.gender;
				this.fetchFacets();
			} else if (filter.sortBy) {
				newFilters.sortBy = filter.sortBy;
			} else {
				newFilters.countryIsoCode = [...filter.country];
			}

			this.selectedQuickFilters = newFilters;

			this.resetPagination();
			this.getHelpMeChooseLoans();
		},
		checkIfPageIsOutOfRange(loansArrayLength, pageQueryParam) {
			// determines if the page query param is for a page that is out of bounds.
			// if it is, changes page to the last page and displays a tip message
			const loansOutOfRange = loansArrayLength === 0 && pageQueryParam;
			if (loansOutOfRange) {
				const message = `There are currently ${this.lastLoanPage} pages of results.
					We’ve loaded the ${this.lastLoanPage === 0 ? 'first' : 'last'} page for you.`;
				this.$showTipMsg(message);
				this.pageChange({ pageOffset: this.limit * (this.lastLoanPage > 0 ? this.lastLoanPage - 1 : 0) });
			}
		},
		updateLoanReservation(id) {
			return Promise.resolve(
				this.apollo.mutate({
					mutation: updateLoanReservation,
					variables: {
						loanId: this.selectedChannelLoanIds[id],
						price: numeral(25).format('0.00'),
					},
				})
			);
		},
		pageChange({ pageOffset }) {
			this.offset = pageOffset;
			this.pushChangesToUrl();
		},
		updateFromParams(query) {
			this.offset = getPageOffset(query, this.limit);
		},
		pushChangesToUrl() {
			if (!_isEqual(this.$route.query, this.urlParams)) {
				this.$router.push({ query: this.urlParams });
			}
		},
		activateLoanChannelWatchQuery() {
			const next = (data, loading) => {
				if (loading) {
					this.loading = true;
				} else {
					const channel = _get(data, 'lend.loanChannelsById[0]');

					const basket = _map(_get(data, 'shop.basket.items.values'), 'id');

					// Initial data is loaded in created method, so compare before setting to prevent an extra render
					if (JSON.stringify(channel) !== JSON.stringify(this.loanChannel)) {
						this.loanChannel = channel;
					}
					if (JSON.stringify(basket) !== JSON.stringify(this.itemsInBasket)) {
						this.itemsInBasket = basket;
					}

					this.checkIfPageIsOutOfRange(this.loanChannel?.loans?.values?.length ?? 0, this.pageQuery.page);

					this.loading = false;
				}
			};

			watchChannelQuery(
				this.apollo,
				this.loanChannelQueryMap,
				this.targetedLoanChannelURL,
				this.loanQueryVars,
				next,
				callback => this.$watch(() => this.loanQueryVars, callback, { deep: true }),
			);
		},
		getFilterUrl() {
			// get match channel data
			const matchedUrls = _filter(
				this.loanChannelQueryMap,
				channel => {
					return channel.url === this.$route.params.category;
				}
			);

			// FLSS Parameters for Quick Filters Experiment
			this.quickFiltersFlssParameters(matchedUrls);

			// check for fallback url
			const fallback = _get(matchedUrls, '[0]fallbackUrl');
			if (typeof fallback !== 'undefined') {
				return fallback;
			}
			// use query params if available
			const queryParams = _get(matchedUrls, '[0]queryParams') || '';
			if (queryParams !== '') {
				return `/lend/filter?${queryParams}`;
			}
			// use default
			return '/lend/filter';
		},
		initializeMonthlyGoodPromo() {
			const currentRoute = this.$route.path.replace('/lend-by-category/', '');
			const matchedRoutes = _filter(targetRoutes, route => route.route === currentRoute);
			if (matchedRoutes.length) {
				this.displayLoanPromoCard = true;
				[this.mgTargetCategory] = matchedRoutes;
				this.limit = defaultLoansPerPage - 1;
			} else {
				this.limit = defaultLoansPerPage;
			}
		},
		getDetailedLoan(loanDetails) {
			this.detailedLoan = loanDetails;
		},
		handleCloseLoanCard() {
			this.detailedLoan = null;
		},
		async fetchFacets() {
			// TODO: Prevent this from running on every query (not needed for sorting and paging)
			const { isoCodes } = await runFacetsQueries(this.apollo, this.flssLoanSearch, FLSS_ORIGIN_CATEGORY);

			// Merge all facet options with filtered options
			const facets = {
				regions: transformIsoCodes(isoCodes, this.allFacets?.countryFacets),
			};

			this.quickFiltersOptions.location = facets.regions;

			this.quickFiltersOptions.sorting = [
				{
					title: 'Recommended',
					key: 'personalized',
				},
				{
					title: 'Almost funded',
					key: 'amountLeft',
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
				},
			];

			this.filtersLoaded = true;
		},
		quickFiltersFlssParameters(matchedUrls = []) {
			if (this.targetedLoanChannelURL === 'single-parents') {
				this.flssLoanSearch = { tagId: [17] };
			} else if (this.targetedLoanChannelURL === 'livestock') {
				this.flssLoanSearch = { activityId: [73] };
			} else {
				this.flssLoanSearch = matchedUrls[0]?.flssLoanSearch ?? {};
			}
		},
		async getHelpMeChooseLoans(sortBy) {
			this.isLoadingHC = true;

			if (sortBy) {
				this.helpMeChooseSort = sortBy;
			}

			const loansData = await getLoanChannel(
				this.apollo,
				this.loanChannelQueryMap,
				this.targetedLoanChannelURL,
				{
					ids: [this.targetedLoanChannelID],
					limit: 3,
					basketId: this.cookieStore.get('kvbskt'),
					origin: FLSS_ORIGIN_CATEGORY
				},
				// Apply quick filters to help me choose
				{ ...this.selectedQuickFilters, sortBy: this.helpMeChooseSort }
			);

			const loans = loansData?.lend?.loanChannelsById[0]?.loans?.values ?? [];
			this.helpMeChooseLoans = loans;
			this.isLoadingHC = false;
		},
		resetPagination() {
			this.pageChange({ pageOffset: 0 });
		},
	},
	watch: {
		loanIds(newVal, oldVal) {
			if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
				// check for and use snowplow directly where the 4th param is a property
				if (typeof window !== 'undefined' && typeof snowplow === 'function') {
					window.snowplow('setCustomUrl', window.location.href);
					window.snowplow(
						'trackStructEvent',
						'Lending',
						newVal.length ? 'loans-shown' : 'zero-loans-shown',
						newVal.length ? 'loan-ids' : undefined,
						newVal.length ? newVal.join() : undefined
					);
				}
			}
		},
		$route(to) {
			this.updateFromParams(to.query);
		},
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.updateFromParams(to.query);
		});
	},
	beforeRouteUpdate(to, from, next) {
		this.updateFromParams(to.query);
		next();
	},
	beforeRouteLeave(to, from, next) {
		if (typeof window !== 'undefined'
			&& to.path.indexOf('/lend/') !== -1
			&& to.path.indexOf('/lend/filter') === -1) {
			// set cookie to signify redirect
			this.cookieStore.set('redirectFromUi', true);
		}
		next();
	}
};
</script>

<style lang="scss" scoped>
@use '#src/assets/scss/settings' as *;

.loan-count {
	text-align: center;
	margin: 0 0 2rem;
}

.heading-region {
	margin: 1.25rem 0;

	@include breakpoint(large) {
		p {
			max-width: 75%;
		}
	}
}

</style>
