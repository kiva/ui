<template>
	<www-page
		class="lend-page"
		:gray-background="true"
	>
		<div class="row">
			<div class="small-12 columns tw-mt-3 tw-p-2">
				<h1 class="tw-mb-2">
					Make a loan, change a life
				</h1>
				<p class="tw-mb-4 tw-max-w-screen-lg">
					Each Kiva loan helps people build a better
					future for themselves and their families.
				</p>
			</div>

			<div class="columns small-12">
				<div class="tw-relative row small-up-1 large-up-2 xxlarge-up-3">
					<loan-card-controller
						v-for="loan in loans"
						:is-visitor="isVisitor"
						:items-in-basket="itemsInBasket"
						:key="loan.id"
						:loan="loan"
						loan-card-type="GridLoanCard"
					/>
					<kv-loading-overlay v-if="loading" />
				</div>
				<kv-pagination :total="totalCount" :limit="limit" :offset="offset" @page-changed="pageChange" />
				<div v-if="totalCount > 0" class="tw-text-center tw-mb-4 tw-text-tertiary">
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
import WwwPage from '@/components/WwwFrame/WwwPage';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import KvPagination from '@/components/Kv/KvPagination';
import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';

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
	name: 'LendPage',
	components: {
		WwwPage,
		LoanCardController,
		KvPagination,
		KvLoadingOverlay,
	},
	inject: ['apollo', 'cookieStore'],
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
		query: loanCardQuery,
		preFetch: true,
		preFetchVariables({ route }) {
			return _merge({ limit: loansPerPage }, fromUrlParams(route.query));
		},
		variables() {
			return {
				offset: this.offset,
				limit: this.limit,
				filters: this.filters
			};
		},
		result({ data, loading }) {
			if (loading) {
				this.loading = true;
			} else {
				this.totalCount = data.lend.loans.totalCount;
				this.loans = data.lend.loans.values;
				this.itemsInBasket = _map(data.shop.basket?.items?.values, 'id');
				this.isVisitor = !_get(data, 'my.userAccount.id');
				this.loading = false;
			}
		}
	},
	methods: {
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
