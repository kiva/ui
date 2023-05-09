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
					class="page-subhead tw-mb-4"
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

		<div class="row">
			<div class="columns small-12" v-if="loans.length > 0">
				<div class="loan-card-group row small-up-1 large-up-2 xxlarge-up-3">
					<loan-card-controller
						v-for="loan in loans"
						:items-in-basket="itemsInBasket"
						:is-visitor="isVisitor"
						:key="loan.id"
						:loan="loan"
						loan-card-type="GridLoanCard"
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
	</div>
</template>

<script>
/* This component is for the recommended loans by lenders category page.
* It is very similar to src/pages/Lend/LoanChannelCategoryControl.vue with
* extraneous functionality removed. The other differences being in the query
* this component uses and this component also filters out loans that do not
* have monthly repayment interval.
* TODO
* Fix client side pagination, it is not currently accurate because of the
* client side filtering of loans that are not monthly.
*/

import { gql } from '@apollo/client';
import loanCardFields from '@/graphql/fragments/loanCardFields.graphql';

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
import { loanChannelQueryMap } from '@kiva/kv-loan-filters';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import KvPagination from '@/components/Kv/KvPagination';
import ViewToggle from '@/components/LoansByCategory/ViewToggle';
import updateLoanReservation from '@/graphql/mutation/updateLoanReservation.graphql';

const loansPerPage = 20;
const routePath = 'recommended-by-lenders';

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

const loanChannelCategoryRecommendedByLendersQuery = gql`
	${loanCardFields}
	query loanChannelCategoryRecommendedByLendersQuery (
		$ids: [Int],
		$limit: Int = 12,
		$offset: Int = 0,
		$unique: Boolean = false,
		$excludeIds: [Int],
		$imgDefaultSize: String = "w480h360",
		$imgRetinaSize: String = "w960h720",
		$basketId: String
	) {
		lend {
			loanChannelsById(ids: $ids) {
				id
				name
				description
				url
				loans(
					limit: $limit,
					offset: $offset,
					unique: $unique,
					exclude_ids: $excludeIds
				) {
					totalCount
					values {
						id
						...loanCardFields
						image {
							id
							default: url(customSize: $imgDefaultSize)
							retina: url(customSize: $imgRetinaSize)
						}
						... on LoanPartner {
							repaymentInterval
						}
					}
				}
			}
		}
		shop (basketId: $basketId) {
			id
			basket {
				id
				items {
					values {
						id
					}
				}
			}
		}
	}
`;

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
	name: 'LoanChannelCategoryRecommendedByLenders',
	components: {
		LoanCardController,
		KvPagination,
		ViewToggle,
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [loanChannelQueryMap],
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
	data() {
		return {
			offset: 0,
			limit: loansPerPage,
			targetedLoanChannelID: null,
			loanChannel: () => {},
			isVisitor: true,
			itemsInBasket: [],
			pageQuery: { page: '1' },
			loading: false,
			selectedChannelLoanIds: [],
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
			const loans = this.loanChannel?.loans?.values || [];
			const loansFiltered = loans.filter(loan => loan.repaymentInterval === 'monthly');
			return loansFiltered;
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
			// process eligible filter url
			return this.getFilterUrl();
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
				// combine both 'pages' of loan channels
				const pageQueryData = {
					...data,
					lend: {
						loanChannels: {
							values: [
								...(data?.lend?.firstLoanChannels?.values ?? []),
								...(data?.lend?.secondLoanChannels?.values ?? [])
							]
						}
					}
				};

				// filter routes on route.param.category to get current path
				const targetedLoanChannelURL = routePath;
				// isolate targeted loan channel id
				const targetedLoanChannelID = getTargetedChannel(targetedLoanChannelURL, pageQueryData);
				// extract query
				const pageQuery = _get(args, 'route.query');

				return client.query({
					query: loanChannelCategoryRecommendedByLendersQuery,
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
		// combine both 'pages' of loan channels
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

		// set user status
		this.isVisitor = !_get(pageQueryData, 'my.userAccount.id');
		// filter routes on param.category to get current path
		const targetedLoanChannelURL = routePath;
		// isolate targeted loan channel id
		this.targetedLoanChannelID = getTargetedChannel(targetedLoanChannelURL, pageQueryData);
		// extract query
		this.pageQuery = _get(this.$route, 'query');

		// Ensure page offset gets set before loading cached data
		this.updateFromParams(this.pageQuery);

		// Read the page data from the cache
		let baseData = {};
		try {
			baseData = this.apollo.readQuery({
				query: loanChannelCategoryRecommendedByLendersQuery,
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
	},
	mounted() {
		// Setup Reactivity for Loan Data + Basket Status
		this.activateLoanChannelWatchQuery();

		// check for newly assigned bounceback
		const redirectFromUiCookie = this.cookieStore.get('redirectFromUi') || '';
		if (redirectFromUiCookie === 'true') {
			this.cookieStore.remove('redirectFromUi');
			this.$router.push(this.getFilterUrl());
		}
	},
	methods: {
		checkIfPageIsOutOfRange(loansArrayLength, pageQueryParam) {
			// determines if the page query param is for a page that is out of bounds.
			// if it is, changes page to the last page and displays a tip message
			const loansOutOfRange = loansArrayLength === 0 && pageQueryParam;
			if (loansOutOfRange) {
				const message = `There are currently ${this.lastLoanPage} pages of results.
					We’ve loaded the ${this.lastLoanPage === 0 ? 'first' : 'last'} page for you.`;
				this.$showTipMsg(message);
				this.pageChange({ pageOffset: loansPerPage * (this.lastLoanPage > 0 ? this.lastLoanPage - 1 : 0) });
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
				query: loanChannelCategoryRecommendedByLendersQuery,
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
		getFilterUrl() {
			// get match channel data
			const matchedUrls = _filter(
				this.loanChannelQueryMap,
				channel => {
					return channel.url === 'recommended-by-lenders';
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
