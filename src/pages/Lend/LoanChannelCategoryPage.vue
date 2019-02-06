<template>
	<www-page class="loan-channel-page category-page">
		<div class="row">
			<div class="small-12 columns heading-region">
				<view-toggle />
				<p class="small-text">
					<router-link to="/lend-by-category">All Loans</router-link> >
					<span class="show-for-large">{{ loanChannel.name }}</span>
				</p>
				<h1>{{ loanChannel.name }}</h1>
				<p class="page-subhead show-for-large">{{ loanChannel.description }}</p>
			</div>

			<div class="columns small-12">
				<div class="loan-card-group row small-up-1 large-up-2 xxlarge-up-3">
					<GridLoanCard
						v-for="loan in loans"
						:key="loan.id"
						:loan="loan"
						:is-visitor="isVisitor"
						:items-in-basket="itemsInBasket"
					/>
					<loading-overlay v-if="loading" />
				</div>
				<kv-pagination :total="totalCount" :limit="limit" @page-change="pageChange"/>
				<div v-if="totalCount > 0" class="loan-count">
					{{ totalCount }} loans
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import _invokeMap from 'lodash/invokeMap';
import _isEqual from 'lodash/isEqual';
// import _map from 'lodash/map';
import _filter from 'lodash/filter';
import _mapValues from 'lodash/mapValues';
import _merge from 'lodash/merge';
import numeral from 'numeral';
import loanChannelPageQuery from '@/graphql/query/loanChannelPage.graphql';
import loanChannelQuery from '@/graphql/query/loanChannelDataExpanded.graphql';
// import loanCardQuery from '@/graphql/query/loanCardData.graphql';
import experimentSetting from '@/graphql/query/experimentSetting.graphql';
import experimentQuery from '@/graphql/query/lendByCategory/experimentAssignment.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import GridLoanCard from '@/components/LoanCards/GridLoanCard';
import KvPagination from '@/components/Kv/KvPagination';
import ViewToggle from '@/components/LoansByCategory/ViewToggle';
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
		GridLoanCard,
		KvPagination,
		LoadingOverlay,
		ViewToggle
	},
	inject: ['apollo'],
	metaInfo: {
		title: 'Fundraising loans'
	},
	data() {
		return {
			offset: 0,
			limit: loansPerPage,
			filters: { },
			targedLoanChannelID: null,
			loanChannel: () => {},
			// loanChannel: () => [{
			// 	name: '',
			// 	description: '',
			// 	loans: []
			// }],
			isVisitor: true,
			itemsInBasket: [],
			pageQuery: { page: '1' },
			loading: false,
		};
	},
	computed: {
		urlParams() {
			return toUrlParams({
				offset: this.offset,
			});
		},
		loans() {
			return _get(this.loanChannel, 'loans.values') || [];
		},
		totalCount() {
			return _get(this.loanChannel, 'loans.totalCount') || 0;
		},
		loanQueryVars() {
			return {
				ids: [this.targedLoanChannelID],
				limit: this.limit,
				offset: this.offset
			};
		}
	},
	apollo: {
		preFetch(config, client, args) {
			return client.query({
				query: loanChannelPageQuery
			}).then(({ data }) => {
				// filter routes on route.param.category to get current path
				const targedLoanChannelURL = _get(args, 'route.params.category');
				// isolate targeted loan channel id
				const targedLoanChannelID = getTargetedChannel(targedLoanChannelURL, data);
				// extract query
				const pageQuery = _get(args, 'route.query');
				// query our targeted loan channel
				return client.query({
					query: loanChannelQuery,
					variables: _merge(
						{
							ids: [targedLoanChannelID],
							limit: loansPerPage
						},
						fromUrlParams(pageQuery)
					)
				});
				// return client.query({
				// 	query: loanCardQuery,
				// 	variables: {
				// 		offset: this.offset,
				// 		limit: this.loansPerPage,
				// 		filters: this.filters
				// 	},
				// 	preFetchVariables({ route }) {
				// 		return _merge({ limit: loansPerPage }, fromUrlParams(route.query));
				// 	}
				// });
			}).then(channelData => {
				console.log(channelData);
				// TODO: REMOVE Once Lend Increment Button EXP ENDS
				// Pre-fetch the setting for lend increment button
				return client.query({ query: experimentSetting, variables: { key: 'uiexp.lend_increment_button' } });
			}).then(() => {
				// TODO: REMOVE Once Lend Increment Button EXP ENDS
				// Pre-fetch the assigned version for lend increment button
				return client.query({ query: experimentQuery, variables: { id: 'lend_increment_button' } });
			});
		}
	},
	created() {
		const allChannelsData = this.apollo.readQuery({
			query: loanChannelPageQuery
		});
		// filter routes on param.category to get current path
		const targedLoanChannelURL = _get(this.$route, 'params.category');
		// isolate targeted loan channel id
		this.targedLoanChannelID = getTargetedChannel(targedLoanChannelURL, allChannelsData);
		// extract query
		this.pageQuery = _get(this.$route, 'query');
		// Read the page data from the cache
		const baseData = this.apollo.readQuery({
			query: loanChannelQuery,
			variables: _merge(
				this.loanQueryVars,
				fromUrlParams(this.pageQuery)
			)
		});
		// const baseData = this.apollo.readQuery({
		// 	query: loanChannelQuery,
		// 	variables: this.loanQueryVars
		// });

		console.log(baseData);

		// this.isLoggedIn = !!_get(baseData, 'my');
		// this.isVisitor = !_get(baseData, 'my.userAccount.id');
		// this.itemsInBasket = _map(_get(baseData, 'shop.basket.items.values'), 'id');

		// if (loading) {
		// 	this.loading = true;
		// } else {
		// this.totalCount = _get(baseData, 'lend.loans.totalCount');
		// this.loans = _get(baseData, 'lend.loans.values');
		this.loanChannel = _get(baseData, 'lend.loanChannelsById[0]');
		// this.loans = _get(baseData, 'lend.loanChannelsById[0].loans.values');
		// this.totalCount = this.loans.length;

		this.loading = false;
		// }

		// Create an observer for changes to the categories (and their loans)
		// this.apollo.watchQuery({
		// 	query: loanCardQuery,
		// 	variables: {
		// 		offset: this.offset,
		// 		limit: this.limit,
		// 		filters: this.filters
		// 	},
		// });

		// this.apollo.watchQuery({
		// 	query: loanChannelQuery,
		// 	variables: _merge(
		// 		this.loanQueryVars,
		// 		fromUrlParams(this.pageQuery)
		// 	),
		// 	fetchPolicy: 'network-only',
		// }).subscribe({
		// 	next: ({ data }) => {
		// 		this.loanChannel = _get(data, 'lend.loanChannelsById[0]');
		// 	},
		// });
	},
	watch: {
		loanQueryVars: {
			handler() {
				this.loading = true;
				this.apollo.query({
					query: loanChannelQuery,
					variables: this.loanQueryVars,
					fetchPolicy: 'network-only',
				}).then(({ data }) => {
					this.loading = false;
					this.loanChannel = _get(data, 'lend.loanChannelsById[0]');
				});
			},
			deep: true
		}
	},
	methods: {
		pageChange(number) {
			this.loading = true;
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
};
</script>

<style lang="scss" scoped>
@import 'settings';

.loan-channel-page {
	// main {
	// 	padding-top: 2rem;
	// 	padding-bottom: 2rem;
	// 	background-color: $kiva-bg-lightgray;
	// }

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

	// h1 {
	// 	margin: 0;
	// }

	// p {
	// 	margin-top: 0.75rem;
	// }

	@include breakpoint(large) {
		p {
			max-width: 75%;
		}
	}

	// // Customize styles for touch screens ie. No Arrows
	// @media (hover: none) {
	// 	margin: 1rem 0;
	// 	padding: 0 1rem;
	// }
}
</style>
