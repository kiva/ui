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
				<p v-if="loanChannelDescription"
					class="page-subhead show-for-large tw-mb-4"
				>
					{{ loanChannelDescription }}
				</p>
				<p v-else>
					We couldn't find any loans for this search.
					<router-link to="/lend-by-category">
						Browse these loans
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
							<kv-button type="button"
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
							:loans="loans"
							:selected-channel="selectedChannel"
							:show-view-more-card="showViewMoreCard"
							:is-bundle="true"
							id="carousel_exp"
						/>

						<div class="lg:tw-hidden tw-flex tw-flex-col tw-items-center tw-mt-3">
							<kv-button type="button"
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
				<kv-pagination v-if="totalCount > 0" :total="totalCount" :limit="limit" @page-change="pageChange" />
				<div v-if="totalCount > 0" class="loan-count tw-text-tertiary">
					{{ totalCount }} loans
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import _invokeMap from 'lodash/invokeMap';
import _isEqual from 'lodash/isEqual';
import _map from 'lodash/map';
import _filter from 'lodash/filter';
import _mapValues from 'lodash/mapValues';
import _merge from 'lodash/merge';
import numeral from 'numeral';
import logReadQueryError from '@/util/logReadQueryError';
import loanChannelPageQuery from '@/graphql/query/loanChannelPage.graphql';
import loanChannelQuery from '@/graphql/query/loanChannelDataExpanded.graphql';
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
import KvButton from '~/@kiva/kv-components/vue/KvButton';

const loansPerPage = 12;

// A map of functions to transform url query parameters to/from graphql variables.
// Each key in urlParamTransform is a url query parameter (e.g. the 'page' in ?page=2).
// Each value is then an object with the to/from functions to write/read the url parameter.
const urlParamTransform = {
	page: {
		to({ offset }) {
			const page = Math.floor(offset / loansPerPage) + 1;
			return page > 1 ? String(page) : undefined;
		},
		from({ page }) {
			const pagenum = numeral(page).value() - 1;
			return { offset: pagenum > 0 ? loansPerPage * pagenum : 0 };
		}
	},
};

// Turn an object of graphql variables into an object of url query parameters
function toUrlParams(variables) {
	return _mapValues(urlParamTransform, ({ to }) => to(variables));
}

// Turn an object of url query parameters into an object of graphql variables
function fromUrlParams(params) {
	return _merge({}, ..._invokeMap(urlParamTransform, 'from', params));
}

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

export default {
	components: {
		LoanCardController,
		KvPagination,
		KvLoadingOverlay,
		ViewToggle,
		PromoGridLoanCard,
		KvButton,
		KivaClassicLoanCarouselExp,
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
					href: `https://${this.$appConfig.host}${this.$route.path}?`
					+ `page=${this.urlParams?.page ? this.urlParams.page : '1'}`
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
			limit: loansPerPage,
			filters: { },
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
			showViewMoreCard: false
		};
	},
	computed: {
		urlParams() {
			return toUrlParams({
				offset: this.offset,
			});
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
			return [this.loans[0]];
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
				offset: this.offset
			};
		},
		filterUrl() {
			// initial release sends us back to /lend
			// return `/lend/${this.$route.params.category || ''}`;
			return this.lendFilterExpVersion === 'b'
				? this.getAlgoliaFilterUrl()
				: `/lend/${this.$route.params.category || ''}`;
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
	},
	apollo: {
		preFetch(config, client, args) {
			return client.query({
				query: loanChannelPageQuery
			}).then(({ data }) => {
				// filter routes on route.param.category to get current path
				const targetedLoanChannelURL = _get(args, 'route.params.category');
				// isolate targeted loan channel id
				const targetedLoanChannelID = getTargetedChannel(targetedLoanChannelURL, data);
				// extract query
				const pageQuery = _get(args, 'route.query');

				return client.query({
					query: loanChannelQuery,
					variables: _merge(
						{
							ids: [targetedLoanChannelID],
							limit: loansPerPage
						},
						fromUrlParams(pageQuery)
					)
				});
			});
		}
	},
	created() {
		let allChannelsData = {};
		try {
			allChannelsData = this.apollo.readQuery({
				query: loanChannelPageQuery,
				variables: {
					basketId: this.cookieStore.get('kvbskt'),
				}
			});
		} catch (e) {
			logReadQueryError(e, 'LoanChannelCategoryPage loanChannelPageQuery');
		}

		// set user status
		this.isVisitor = !_get(allChannelsData, 'my.userAccount.id');
		// filter routes on param.category to get current path
		const targetedLoanChannelURL = _get(this.$route, 'params.category');
		// isolate targeted loan channel id
		this.targetedLoanChannelID = getTargetedChannel(targetedLoanChannelURL, allChannelsData);
		// extract query
		this.pageQuery = _get(this.$route, 'query');
		// Read the page data from the cache
		let baseData = {};
		try {
			baseData = this.apollo.readQuery({
				query: loanChannelQuery,
				variables: _merge(
					this.loanQueryVars,
					fromUrlParams(this.pageQuery),
					{ basketId: this.cookieStore.get('kvbskt') }
				),
			});
		} catch (e) {
			logReadQueryError(e, 'LoanChannelCategoryPage loanChannelQuery');
		}

		// Assign our initial view data
		this.itemsInBasket = _map(_get(baseData, 'shop.basket.items.values'), 'id');
		this.loanChannel = _get(baseData, 'lend.loanChannelsById[0]');

		/*
		 * Experiment Initializations
		*/

		// Monthly Good Category Promo
		this.initializeMonthlyGoodPromo();

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
			this.$router.push(this.getAlgoliaFilterUrl());
		}

		if (this.addBundlesExp) {
			this.getRelatedLoansExp();
		}
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
				this.$showTipMsg(`There are currently ${this.lastLoanPage} pages of results. We’ve loaded the last page for you.`); // eslint-disable-line max-len
				this.pageChange(this.lastLoanPage);
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
		pageChange(number) {
			const offset = loansPerPage * (number - 1);
			this.offset = offset;
			this.pushChangesToUrl();
		},
		updateFromParams(query) {
			const { offset } = fromUrlParams(query);
			this.offset = offset;
		},
		pushChangesToUrl() {
			if (!_isEqual(this.$route.query, this.urlParams)) {
				this.$router.push({ query: this.urlParams });
			}
		},
		activateLoanChannelWatchQuery() {
			const observer = this.apollo.watchQuery({
				query: loanChannelQuery,
				variables: this.loanQueryVars,
			});
			this.$watch(() => this.loanQueryVars, vars => {
				observer.setVariables(vars);
			}, { deep: true });
			// Subscribe to the observer to see each result
			observer.subscribe({
				next: ({ data, loading }) => {
					if (loading) {
						this.loading = true;
					} else {
						this.loanChannel = _get(data, 'lend.loanChannelsById[0]');
						this.itemsInBasket = _map(_get(data, 'shop.basket.items.values'), 'id');
						this.checkIfPageIsOutOfRange(this.loanChannel.loans.values.length, this.pageQuery.page);
						this.loading = false;
					}
				}
			});
		},
		getAlgoliaFilterUrl() {
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
			// use algolia params if available
			const algoliaParams = _get(matchedUrls, '[0]algoliaParams') || '';
			if (algoliaParams !== '') {
				return `/lend/filter?${algoliaParams}`;
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
			const matchedRoutes = _filter(targetRoutes, route => route.route === currentRoute);

			if (matchedRoutes.length) {
				this.displayLoanPromoCard = true;
				[this.mgTargetCategory] = matchedRoutes;
			}
		},
		async getRelatedLoansExp() {
			const loan = this.loans[0];
			let baseData = {};
			try {
				baseData = await this.apollo.query({
					query: getRelatedLoans,
					variables: {
						limit: 12,
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
				console.log(e);
			}
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
		}
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
