<template>
	<www-page class="loan-channel-page category-page" :gray-background="true">
		<div class="row">
			<div class="small-12 columns heading-region">
				<view-toggle browse-url="/lend-by-category" :filter-url="filterUrl" />
				<p class="small-text">
					<router-link to="/lend-by-category">All Loans</router-link> >
					<span class="show-for-large">{{ loanChannelName }}</span>
				</p>
				<h1>{{ loanChannelName }}</h1>
				<p v-if="loanChannelDescription"
					class="page-subhead show-for-large">{{ loanChannelDescription }}</p>
				<p v-else>We couldn't find any loans for this search.
					<a href="/lend-by-category">Browse these loans</a>.
				</p>
			</div>

			<div class="columns small-12">
				<div class="loan-card-group row small-up-1 large-up-2 xxlarge-up-3">
					<loan-card-controller
						v-for="loan in loans"
						:items-in-basket="itemsInBasket"
						:is-visitor="isVisitor"
						:key="loan.id"
						:loan="loan"
						loan-card-type="GridLoanCard"
					/>
					<loading-overlay v-if="loading" />
				</div>
				<kv-pagination :total="totalCount" :limit="limit" @page-change="pageChange"/>
				<div v-if="totalCount > 0" class="loan-count">
					{{ totalCount }} loans
				</div>
			</div>
		</div>

		<add-to-basket-interstitial v-show="addToBasketExpActive" />
	</www-page>
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
import cookieStore from '@/util/cookieStore';
import loanChannelPageQuery from '@/graphql/query/loanChannelPage.graphql';
import loanChannelQuery from '@/graphql/query/loanChannelDataExpanded.graphql';
import experimentQuery from '@/graphql/query/lendByCategory/experimentAssignment.graphql';
import updateAddToBasketInterstitial from '@/graphql/mutation/updateAddToBasketInterstitial.graphql';
import lendFilterExpMixin from '@/plugins/lend-filter-page-exp-mixin';
import loanChannelQueryMapMixin from '@/plugins/loan-channel-query-map';
import WwwPage from '@/components/WwwFrame/WwwPage';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import KvPagination from '@/components/Kv/KvPagination';
import ViewToggle from '@/components/LoansByCategory/ViewToggle';
import AddToBasketInterstitial from '@/components/Lightboxes/AddToBasketInterstitial';
import LoadingOverlay from './LoadingOverlay';

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
			return loanChannel.url.indexOf(targetedRoute) !== -1;
		}
	);
	// isolate targeted loan channel id
	return _get(targetedLoanChannel[0], 'id') || null;
}

export default {
	components: {
		WwwPage,
		LoanCardController,
		KvPagination,
		LoadingOverlay,
		ViewToggle,
		AddToBasketInterstitial,
	},
	inject: ['apollo'],
	mixins: [
		lendFilterExpMixin,
		loanChannelQueryMapMixin,
	],
	metaInfo() {
		return {
			title: this.pageTitle
		};
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
			addToBasketExpActive: false,
			lendFilterExpVersion: '',
		};
	},
	computed: {
		urlParams() {
			return toUrlParams({
				offset: this.offset,
			});
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

				return Promise.all([
					// query our targeted loan channel
					client.query({
						query: loanChannelQuery,
						variables: _merge(
							{
								ids: [targetedLoanChannelID],
								limit: loansPerPage
							},
							fromUrlParams(pageQuery)
						)
					}),
					// experiment: add to basket interstitial
					client.query({ query: experimentQuery, variables: { id: 'add_to_basket_popup' } }),
				]);
			});
		}
	},
	created() {
		const allChannelsData = this.apollo.readQuery({
			query: loanChannelPageQuery
		});
		// set user status
		this.isVisitor = !_get(allChannelsData, 'my.userAccount.id');
		// filter routes on param.category to get current path
		const targetedLoanChannelURL = _get(this.$route, 'params.category');
		// isolate targeted loan channel id
		this.targetedLoanChannelID = getTargetedChannel(targetedLoanChannelURL, allChannelsData);
		// extract query
		this.pageQuery = _get(this.$route, 'query');
		// Read the page data from the cache
		const baseData = this.apollo.readQuery({
			query: loanChannelQuery,
			variables: _merge(
				this.loanQueryVars,
				fromUrlParams(this.pageQuery),
				{ basketId: cookieStore.get('kvbskt') }
			),
		});

		// Assign our initial view data
		this.itemsInBasket = _map(_get(baseData, 'shop.basket.items.values'), 'id');
		this.loanChannel = _get(baseData, 'lend.loanChannelsById[0]');

		// Setup Reactivity for Loan Data + Basket Status
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
					this.loading = false;
				}
			}
		});

		// get assignment for add to basket interstitial
		const addToBasketPopupEXP = this.apollo.readQuery({
			query: experimentQuery,
			variables: { id: 'add_to_basket_popup' },
		});
		this.addToBasketExpActive = _get(addToBasketPopupEXP, 'experiment.version') === 'shown';
		// Update @client state if interstitial exp is active
		if (this.addToBasketExpActive) {
			this.apollo.mutate({
				mutation: updateAddToBasketInterstitial,
				variables: {
					active: true,
				}
			});
		}
		// Fire Event for Exp CASH-612 Status
		this.$kvTrackEvent(
			'Lending',
			'EXP-CASH-612-Apr2019',
			this.addToBasketExpActive ? 'b' : 'a'
		);

		const lendFilterEXP = this.apollo.readQuery({
			query: experimentQuery,
			variables: { id: 'lend_filter' },
		});
		this.lendFilterExpVersion = _get(lendFilterEXP, 'experiment.version');

		// Update Lend Filter Exp CASH-545
		this.getLendFilterExpVersion();
	},
	mounted() {
		this.updateLendFilterExp();
		// check for newly assigned bounceback
		const redirectFromUiCookie = cookieStore.get('redirectFromUi') || '';
		if (redirectFromUiCookie === 'true') {
			cookieStore.remove('redirectFromUi');
			this.$router.push(this.getAlgoliaFilterUrl());
		}
	},
	methods: {
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
			cookieStore.set('redirectFromUi', true);
		}
		next();
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.loan-channel-page {
	.loan-card-group {
		position: relative;
	}

	.loan-count {
		text-align: center;
		margin: 0 0 2rem;
		color: $kiva-text-light;
	}
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
</style>
