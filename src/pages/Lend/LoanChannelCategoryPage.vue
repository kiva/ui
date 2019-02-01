<template>
	<www-page class="lend-page">
		<div class="row">
			<div class="small-12 columns heading-region">
				<h1>Loan Channel Title</h1>
				<p>Loan Channel Description</p>
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
import _map from 'lodash/map';
import _mapValues from 'lodash/mapValues';
import _merge from 'lodash/merge';
import numeral from 'numeral';
import loanCardQuery from '@/graphql/query/loanCardData.graphql';
import experimentSetting from '@/graphql/query/experimentSetting.graphql';
import experimentQuery from '@/graphql/query/lendByCategory/experimentAssignment.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import GridLoanCard from '@/components/LoanCards/GridLoanCard';
import KvPagination from '@/components/Kv/KvPagination';
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

export default {
	components: {
		WwwPage,
		GridLoanCard,
		KvPagination,
		LoadingOverlay,
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
			totalCount: 0,
			loans: [],
			isVisitor: true,
			itemsInBasket: [],
			loading: false,
		};
	},
	computed: {
		urlParams() {
			return toUrlParams({
				offset: this.offset,
			});
		}
	},
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: loanCardQuery,
				variables: {
					offset: this.offset,
					limit: this.limit,
					filters: this.filters
				},
				preFetchVariables({ route }) {
					return _merge({ limit: loansPerPage }, fromUrlParams(route.query));
				},
			}).then(() => {
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
		// Read the page data from the cache
		const baseData = this.apollo.readQuery({ query: loanCardQuery });
		this.isLoggedIn = !!_get(baseData, 'my');
		this.isVisitor = !_get(baseData, 'my.userAccount.id');
		this.itemsInBasket = _map(_get(baseData, 'shop.basket.items.values'), 'id');

		// if (loading) {
		// 	this.loading = true;
		// } else {
		this.totalCount = _get(baseData, 'lend.loans.totalCount');
		this.loans = _get(baseData, 'lend.loans.values');

		this.loading = false;
		// }
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

.lend-page {
	main {
		background-color: $kiva-bg-lightgray;
	}

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
	margin-top: rem-calc(20);
	padding: rem-calc(10);

	@include breakpoint(large) {
		p {
			max-width: 75%;
		}
	}
}
</style>
