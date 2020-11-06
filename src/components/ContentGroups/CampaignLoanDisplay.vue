<template>
	<section
		v-if="!checkoutVisible"
		id="#campaign-loans"
		class="campaign-loans row align-center"
	>
		<div class="columns small-12 large-8 align-self-middle" v-if="loans.length > 0">
			<div class="loan-card-group row small-up-1 large-up-2 xxlarge-up-3">
				<loan-card-controller
					v-for="loan in loans"
					class="cards-loan-card"
					:items-in-basket="itemsInBasket"
					:is-visitor="isVisitor"
					:key="loan.id"
					:loan="loan"
					loan-card-type="LendHomepageLoanCard"
					@add-to-basket="addToBasket"
				/>
			</div>
			<kv-pagination v-if="totalCount > 0" :total="totalCount" :limit="limit" @page-change="pageChange" />
			<div v-if="totalCount > 0" class="loan-count">
				{{ totalCount }} loans
			</div>
		</div>
		<div v-if="loadingLoans" class="campaign-loans__loading-loans">
			<kv-loading-overlay />
			<p>Loading loans...</p>
		</div>
	</section>
</template>

<script>
import _invokeMap from 'lodash/invokeMap';
import _mapValues from 'lodash/mapValues';
import _merge from 'lodash/merge';
import basicLoanQuery from '@/graphql/query/basicLoanData.graphql';
import cookieStore from '@/util/cookieStore';
import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';
import KvPagination from '@/components/Kv/KvPagination';
import LoanCardController from '@/components/LoanCards/LoanCardController';

const loansPerPage = 9;

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
			const pagenum = Number(page) - 1;
			return { offset: pagenum > 0 ? loansPerPage * pagenum : 0 };
		}
	},
};

// Turn an object of graphql variables into an object of url query parameters
function toUrlParams(variables) {
	const loMap = _mapValues(urlParamTransform, ({ to }) => to(variables));
	return loMap;
}

// Turn an object of url query parameters into an object of graphql variables
function fromUrlParams(params) {
	return _merge({}, ..._invokeMap(urlParamTransform, 'from', params));
}

export default {
	inject: ['apollo'],
	components: {
		// KvIcon,
		KvLoadingOverlay,
		KvPagination,
		LoanCardController,
	},
	props: {
		checkoutVisible: {
			type: Boolean,
			default: false,
		},
		filters: {
			type: Object,
			default: () => {},
		},
		isVisitor: {
			type: Boolean,
			default: true,
		},
		itemsInBasket: {
			type: Array,
			default: () => [],
		}
	},
	data() {
		return {
			limit: loansPerPage,
			loadingLoans: false,
			loans: [],
			loansPerPage,
			offset: 0,
			pageQuery: { page: '1' },
			totalCount: 0,
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
		loanQueryVars() {
			return {
				limit: this.limit,
				loans: () => [],
				offset: this.offset,
				filters: this.filters,
				promoOnly: { basketId: cookieStore.get('kvbskt') }
			};
		},
	},
	created() {
		// extract query
		this.pageQuery = this.$route.query;
	},
	methods: {
		addToBasket(payload) {
			this.$emit('add-to-basket', payload);
		},

		activateLoanWatchQuery() {
			const observer = this.apollo.watchQuery({
				query: basicLoanQuery,
				variables: this.loanQueryVars
			});
			this.$watch(() => this.loanQueryVars, vars => {
				observer.setVariables(vars);
			}, { deep: true });
			// Subscribe to the observer to see each result
			observer.subscribe({
				next: ({ data, loading }) => {
					if (loading) {
						this.loadingLoans = true;
					} else {
						this.loans = data.lend?.loans?.values ?? [];
						this.totalCount = data.lend?.loans?.totalCount ?? 0;
						this.checkIfPageIsOutOfRange(this.loans.length, this.pageQuery.page);
						this.loadingLoans = false;
					}
				}
			});
		},

		// Pagination Related methods
		checkIfPageIsOutOfRange(loansArrayLength, pageQueryParam) {
			// determines if the page query param is for a page that is out of bounds.
			// if it is, changes page to the last page and displays a tip message
			const loansOutOfRange = loansArrayLength === 0 && pageQueryParam;
			if (loansOutOfRange) {
				// eslint-disable-next-line max-len
				this.$showTipMsg(`There are currently ${this.lastLoanPage} pages of results. We’ve loaded the last page for you.`);
				this.pageChange(this.lastLoanPage);
			}
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
			const { page } = this.$route?.query ?? { page: '0' };
			if (page !== this.urlParams.page) {
				this.$router.push({
					query: {
						...this.$route.query,
						...this.urlParams
					}
				});
			}
		},
	},
	// TODO: determine if this logic will work at this level
	// beforeRouteEnter(to, from, next) {
	// 	next(vm => {
	// 		vm.updateFromParams(to.query);
	// 	});
	// },
	// beforeRouteUpdate(to, from, next) {
	// 	this.updateFromParams(to.query);
	// 	next();
	// },
};
</script>

<style lang="scss" scoped>
@import 'settings';

$card-width: rem-calc(290);
$max-card-width: rem-calc(330);
$card-margin: rem-calc(14);
$card-half-space: rem-calc(14/2);

.campaign-loans {
	position: relative;
	background-color: rgba(0, 0, 0, 0.0125);
	padding: 3rem 0;
	max-width: inherit;

	.loan-card-group {
		display: flex;
		justify-content: center;
	}

	.cards-loan-card {
		border-radius: 0.65rem;
		box-shadow: 0 0.65rem $card-margin $card-half-space rgb(153, 153, 153, 0.1);
		width: $card-width;
		max-width: $max-card-width;
		flex: 1 0 auto;
		margin: $card-margin;
	}

	.loan-count {
		text-align: center;
	}
}
</style>
