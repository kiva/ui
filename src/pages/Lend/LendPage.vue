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
					<div v-if="loading" class="loading-overlay">
						<kv-loading-spinner />
					</div>
				</div>
				<kv-pagination :total="totalCount" :limit="limit" />
				<div v-if="totalCount > 0" class="loan-count">
					{{ totalCount }} loans
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import GridLoanCard from '@/components/LoanCards/GridLoanCard';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvPagination from '@/components/Kv/KvPagination';
import loanCardQuery from '@/graphql/query/loanCardData.graphql';
import _get from 'lodash/get';
import _invokeMap from 'lodash/invokeMap';
import _map from 'lodash/map';
// import _mapValues from 'lodash/mapValues';
import _merge from 'lodash/merge';
import numeral from 'numeral';

const loansPerPage = 12;

const urlParamTransform = {
	page: {
		to({ offset }) {
			const page = Math.floor(offset / loansPerPage) + 1;
			return page > 1 ? page : null;
		},
		from({ page }) {
			const pagenum = numeral(page).value() - 1;
			return { offset: pagenum > 0 ? loansPerPage * pagenum : 0 };
		}
	},
};

// function toUrlParams(variables) {
// 	return _mapValues(urlParamTransform, ({ to }) => to(variables));
// }

function fromUrlParams(params) {
	return _merge({}, ..._invokeMap(urlParamTransform, 'from', params));
}

export default {
	components: {
		WwwPage,
		GridLoanCard,
		KvLoadingSpinner,
		KvPagination,
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
		result({ data }) {
			this.totalCount = data.lend.loans.totalCount;
			this.loans = data.lend.loans.values;
			this.itemsInBasket = _map(data.shop.basket.items.values, 'id');
			this.isVisitor = !_get(data, 'my.userAccount.id');
			this.loading = false;
		}
	},
	watch: {
		$route(to) {
			const { offset } = fromUrlParams(to.query);
			if (this.offset !== offset) {
				this.loading = true;
			}
			this.offset = offset;
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

.lend-page {
	background-color: $kiva-bg-lightgray;

	.loan-card-group {
		position: relative;
	}

	.loading-overlay {
		position: absolute;
		background-color: rgba($kiva-bg-lightgray, 0.7);
		width: 100%;
		height: 100%;
		text-align: center;
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
