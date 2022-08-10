<template>
	<div>
		<div class="row">
			<div class="small-12 columns heading-region">
				<view-toggle browse-url="/lend-by-category" :filter-url="filterUrl" />
				<p class="tw-text-small">
					<router-link to="/lend-by-category">
						All Loans
					</router-link> >
					<span class="show-for-large">{{ loanChannelName }}</span>
				</p>
				<h1 class="tw-mb-2">
					{{ loanChannelName }}
				</h1>
				<p
					v-if="loanChannelDescription"
					class="page-subhead show-for-large tw-mb-4"
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
		<div class="tw-bg-brand-100 tw-w-full tw-mb-8 lg:tw-mb-12 lg:tw-mt-2 tw-px-2 tw-py-2" v-if="addBundlesExp">
			<div class="row">
				<div class="tw-flex tw-flex-col lg:tw-flex-row lg:tw-items-center tw-w-full">
					<div class="tw-w-full lg:tw-w-2/5">
						<h1 class="tw-text-h1">
							Bundle your support
						</h1>

						<p class="tw-text-subhead tw-my-2 tw-pr-2">
							{{ bundleText }}
						</p>

						<div class="tw-hidden lg:tw-block tw-mt-1">
							<kv-button
								type="button"
								@click="addBundleToBasket"
								v-kv-track-event="['Lending', 'click-loan-bundle-cta',
									'Lend to all three now - ' + pageTitle]"
							>
								Lend to all three now
							</kv-button>

							<p class="tw-text-small tw-mt-1">
								As little as $75
							</p>
						</div>
					</div>
					<div class="tw-w-full lg:tw-w-3/5">
						<kiva-classic-loan-carousel-exp
							:is-visible="showCarousel"
							:loan-ids="selectedChannelLoanIds"
							:selected-channel="selectedChannel"
							:show-view-more-card="showViewMoreCard"
							:is-bundle="true"
							id="carousel_exp"
							@get-detailed-loan="getDetailedLoan"
						/>

						<div class="lg:tw-hidden tw-flex tw-flex-col tw-items-center tw-mt-3">
							<kv-button
								type="button"
								@click="addBundleToBasket"
								v-kv-track-event="['Lending', 'click-loan-bundle-cta',
									'Lend to all three now - ' + pageTitle]"
								class="tw-w-full"
							>
								Lend to all three now
							</kv-button>

							<p class="tw-text-small tw-mt-1">
								As little as $75
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<kv-expandable :delay="150" easing="linear">
					<div ref="detailedLoanCardContainer" class="tw-w-full tw-mt-2">
						<loan-card-controller
							v-if="detailedLoan"
							loan-card-type="DetailedLoanCard"
							:loan="detailedLoan"
							:items-in-basket="itemsInBasket"
							:enable-tracking="true"
							:disable-redirects="true"
							:is-visitor="isVisitor"
							:hide-lend-cta="true"
							@close-detailed-loan-card="handleCloseLoanCard"
						/>
					</div>
				</kv-expandable>
			</div>
		</div>

		<div class="row">
			<div class="columns small-12" v-if="loans.length > 0">
				<div v-if="!displayLoanPromoCard" class="loan-card-group row small-up-1 large-up-2 xxlarge-up-3">
					<loan-card-controller
						v-for="loan in loans"
						:items-in-basket="itemsInBasket"
						:is-visitor="isVisitor"
						:key="loan.id"
						:loan="loan"
						loan-card-type="GridLoanCard"
					/>
				</div>
				<div v-else class="loan-card-group row small-up-1 large-up-2 xxlarge-up-3">
					<loan-card-controller
						v-for="loan in firstLoan"
						:items-in-basket="itemsInBasket"
						:is-visitor="isVisitor"
						:key="loan.id"
						:loan="loan"
						loan-card-type="GridLoanCard"
					/>
					<div class="column column-block">
						<promo-grid-loan-card
							:category-url="mgTargetCategory.url"
							:category-label="mgTargetCategory.label"
						/>
					</div>
					<loan-card-controller
						v-for="loan in remainingLoans"
						:items-in-basket="itemsInBasket"
						:is-visitor="isVisitor"
						:key="loan.id"
						:loan="loan"
						loan-card-type="GridLoanCard"
					/>
					<kv-loading-overlay v-if="loading" />
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
	</div>
</template>

<script>
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import _map from 'lodash/map';
import _filter from 'lodash/filter';
import numeral from 'numeral';
import logReadQueryError from '@/util/logReadQueryError';
import loanChannelPageQuery from '@/graphql/query/loanChannelPage.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import getRelatedLoans from '@/graphql/query/getRelatedLoans.graphql';
import lendFilterExpMixin from '@/plugins/lend-filter-page-exp-mixin';
import loanChannelQueryMapMixin from '@/plugins/loan-channel-query-map';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import KvPagination from '@/components/Kv/KvPagination';
import ViewToggle from '@/components/LoansByCategory/ViewToggle';
import PromoGridLoanCard from '@/components/LoanCards/PromoGridLoanCard';
import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';
import KivaClassicLoanCarouselExp from '@/components/LoanCollections/KivaClassicLoanCarouselExp';
import updateLoanReservation from '@/graphql/mutation/updateLoanReservation.graphql';
import { isLoanFundraising } from '@/util/loanUtils';
import KvExpandable from '@/components/Kv/KvExpandable';
import {
	preFetchChannel,
	getCachedChannel,
	trackChannelExperiment,
	watchChannelQuery,
} from '@/util/loanChannelUtils';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

const defaultLoansPerPage = 12;

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
	components: {
		LoanCardController,
		KvPagination,
		KvLoadingOverlay,
		ViewToggle,
		PromoGridLoanCard,
		KvButton,
		KivaClassicLoanCarouselExp,
		KvExpandable
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [
		lendFilterExpMixin,
		loanChannelQueryMapMixin,
	],
	metaInfo() {
		return {
			link: [
				{
					vmid: 'canonical',
					rel: 'canonical',
					href: `${this.handleCanonicalUrl}`
				}
			]
		};
	},
	props: {
		addBundlesExp: {
			type: Boolean,
			required: false
		},
	},
	data() {
		return {
			offset: 0,
			limit: defaultLoansPerPage,
			filters: { },
			targetedLoanChannelURL: null,
			targetedLoanChannelID: null,
			loanChannel: () => {},
			isVisitor: true,
			itemsInBasket: [],
			pageQuery: { page: '1' },
			loading: false,
			lendFilterExpVersion: '',
			displayLoanPromoCard: false,
			mgTargetCategory: null,
			bundleLoans: [],
			selectedChannelLoanIds: [],
			selectedChannel: {},
			showCarousel: true,
			showViewMoreCard: false,
			detailedLoan: null,
		};
	},
	computed: {
		urlParams() {
			const page = Math.floor(this.offset / this.limit) + 1;

			return { page: page > 1 ? String(page) : undefined };
		},
		lastLoanPage() {
			return Math.ceil(this.totalCount / this.limit);
		},
		loanChannelName() {
			return _get(this.loanChannel, 'name') || 'No loans found';
		},
		loanChannelDescription() {
			return _get(this.loanChannel, 'description') || null;
		},
		loans() {
			return _get(this.loanChannel, 'loans.values') || [];
		},
		firstLoan() {
			// Handle an edge case where a backend error could lead to a null loan
			return this.loans[0] ? [this.loans[0]] : [];
		},
		remainingLoans() {
			return _filter(this.loans, (loan, index) => index > 0);
		},
		loanIds() {
			return _map(this.loans, 'id');
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
			};
		},
		filterUrl() {
			// process eligible filter url
			return this.getFilterUrl();
		},
		pageTitle() {
			let title = 'Fundraising loans';
			if (this.loanChannel && this.loanChannel.name) {
				title = `${this.loanChannel.name}`;
			}
			return title;
		},
		bundleText() {
			let text = 'Support these three loans with just one click.';
			if (this.bundleLoans[0] && this.bundleLoans[1] && this.bundleLoans[2]) {
				text = `Support ${this.bundleLoans[0].name}, ${this.bundleLoans[1].name}
							and ${this.bundleLoans[2].name} with just one click.`;
			}
			return text;
		},
		handleCanonicalUrl() {
			let url = `https://${this.$appConfig.host}${this.$route.path}`;
			if (this.$route.query.page && Number(this.$route.query.page) > 1) {
				url = `${url}?page=${this.$route.query.page}`;
			}
			return url;
		}
	},
	apollo: {
		preFetch(config, client, args) {
			return client.query({
				query: loanChannelPageQuery
			}).then(({ data }) => {
				const { route } = args;
				const { query, params, path } = route;

				// Filter routes on route.param.category to get current path
				const targetedLoanChannelURL = params.category;

				// Isolate targeted loan channel id
				const targetedLoanChannelID = getTargetedChannel(targetedLoanChannelURL, data);

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
					{ ids: [targetedLoanChannelID], limit, offset }
				);
			});
		}
	},
	created() {
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

		// Set user status
		this.isVisitor = !_get(allChannelsData, 'my.userAccount.id');

		// Filter routes on param.category to get current path
		this.targetedLoanChannelURL = _get(this.$route, 'params.category');

		// Isolate targeted loan channel id
		this.targetedLoanChannelID = getTargetedChannel(this.targetedLoanChannelURL, allChannelsData);

		// Extract query
		this.pageQuery = _get(this.$route, 'query');

		// Ensure page offset gets set before loading cached data
		this.updateFromParams(this.pageQuery);

		// Prevent pop-in by loading data from the Apollo cache manually here instead of just using the subscription
		const baseData = getCachedChannel(
			this.apollo,
			this.loanChannelQueryMap,
			this.targetedLoanChannelURL,
			this.loanQueryVars
		);

		// Assign our initial view data
		this.itemsInBasket = _map(_get(baseData, 'shop.basket.items.values'), 'id');
		this.loanChannel = _get(baseData, 'lend.loanChannelsById[0]');

		/*
		 * Experiment Initializations
		*/

		// Lend Filter Redirects
		this.initializeLendFilterRedirects();
	},
	mounted() {
		// Setup Reactivity for Loan Data + Basket Status
		this.activateLoanChannelWatchQuery();

		this.updateLendFilterExp();
		// check for newly assigned bounceback
		const redirectFromUiCookie = this.cookieStore.get('redirectFromUi') || '';
		if (redirectFromUiCookie === 'true') {
			this.cookieStore.remove('redirectFromUi');
			this.$router.push(this.getFilterUrl());
		}

		if (this.addBundlesExp) {
			this.getRelatedLoansExp();
		}

		trackChannelExperiment(this.apollo, this.loanChannelQueryMap, this.targetedLoanChannelURL, this.$kvTrackEvent);
	},
	methods: {
		async addBundleToBasket() {
			try {
				await this.updateLoanReservation(0).then(async () => {
					await this.updateLoanReservation(1).then(async () => {
						await this.updateLoanReservation(2);
					});
				});

				this.$kvTrackEvent(
					'basket',
					'bundle-add-to-basket-funded-loan',
				);

				this.$kvTrackEvent(
					'Lending',
					'click-loan-bundle-cta',
					`Lend to all three now - ${this.loanChannelName}`,
					null,
					this.selectedChannelLoanIds.join(', ')
				);

				this.$router.push({ path: '/checkout' });
			} catch (e) {
				this.$showTipMsg('Failed to add loan. Please try again.', 'error');
			}
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
						loanid: this.selectedChannelLoanIds[id],
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
			// check for fallback url
			const fallback = _get(matchedUrls, '[0]fallbackUrl');
			if (typeof fallback !== 'undefined') {
				return fallback;
			}
			// use query params if available
			const queryParams = _get(matchedUrls, '[0]queryParams') || '';
			if (queryParams !== '') {
				return `/lend?${queryParams}`;
			}
			// use default
			return '/lend/filter';
		},
		initializeLendFilterRedirects() {
			const lendFilterEXP = this.apollo.readFragment({
				id: 'Experiment:lend_filter_v2',
				fragment: experimentVersionFragment,
			}) || {};
			this.lendFilterExpVersion = lendFilterEXP.version;

			// Update Lend Filter Exp CASH-545
			this.getLendFilterExpVersion();
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
		async getRelatedLoansExp() {
			const loan = this.loans[0];
			try {
				const baseData = await this.apollo.query({
					query: getRelatedLoans,
					variables: {
						limit: this.limit,
						loanId: loan.id,
						offset: 0,
						topics: ['story']
					},
				});
				const relatedArray = baseData?.data?.ml?.relatedLoansByTopics?.[0]?.values ?? [];
				let loans = _filter(relatedArray, loanIn => {
					return isLoanFundraising(loanIn);
				});
				loans = loans.slice(0, 3);
				this.bundleLoans = loans;
				this.selectedChannelLoanIds = loans.map(element => element.id);

				this.$kvTrackEvent(
					'Lending',
					'view-loan-bundle',
					this.loanChannelName,
					null,
					this.selectedChannelLoanIds.join(', ')
				);
			} catch (e) {
				logReadQueryError(e, 'LoanChannelCategoryControl getRelatedLoansExp getRelatedLoans');
			}
		},
		getDetailedLoan(loanDetails) {
			this.detailedLoan = loanDetails;
		},
		handleCloseLoanCard() {
			this.detailedLoan = null;
		}
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
@import 'settings';

.loan-card-group {
	position: relative;
}

.loan-count {
	text-align: center;
	margin: 0 0 2rem;
}

.heading-region {
	margin: 1.25rem 0;

	.view-toggle {
		margin: 0.125rem 0 0 0.375rem;
		float: right;
		display: flex;

		@include breakpoint(large) {
			margin: 0.375rem 0 0.375rem 0.375rem;
		}
	}

	@include breakpoint(large) {
		p {
			max-width: 75%;
		}
	}
}

@include breakpoint(xxlarge) {
	#carousel_exp >>> section > div:nth-child(2) {
		display: none;
	}
}

#carousel_exp >>> section > div:nth-child(1) {
	column-gap: 1rem !important;
}

#carousel_exp >>> section > div:nth-child(1) > div {
	max-width: 185px !important;
}
</style>
