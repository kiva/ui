<template>
	<www-page class="lend-page">
		<div class="row">
			<div class="small-12 columns heading-region">
				<h1>Make a loan, change a life</h1>
				<p>Each Kiva loan helps people build a better
				future for themselves and their families.</p>
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
import _map from 'lodash/map';
import _mapValues from 'lodash/mapValues';
import _merge from 'lodash/merge';
import numeral from 'numeral';
import loanCardQuery from '@/graphql/query/loanCardData.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import GridLoanCard from '@/components/LoanCards/GridLoanCard';
import KvPagination from '@/components/Kv/KvPagination';
import LoadingOverlay from './LoadingOverlay';

const loansPerPage = 12;

const urlParamTransform = {
	page: {
		to({ offset }) {
			const page = Math.floor(offset / loansPerPage) + 1;
			return page > 1 ? page : undefined;
		},
		from({ page }) {
			const pagenum = numeral(page).value() - 1;
			return { offset: pagenum > 0 ? loansPerPage * pagenum : 0 };
		}
	},
};

function toUrlParams(variables) {
	return _mapValues(urlParamTransform, ({ to }) => to(variables));
}

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
			};
		},
		result({ data, loading }) {
			if (!loading) {
				this.totalCount = data.lend.loans.totalCount;
				this.loans = data.lend.loans.values;
				this.itemsInBasket = _map(data.shop.basket.items.values, 'id');
				this.isVisitor = !_get(data, 'my.userAccount.id');
				this.loading = false;
			}
		}
	},
	methods: {
		pageChange(number) {
			const offset = loansPerPage * (number - 1);
			this.offset = offset;
		}
	},
	watch: {
		urlParams(params) {
			this.loading = true;
			this.$router.push({ query: params });
		},
	}
};
</script>

<style lang="scss">
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
