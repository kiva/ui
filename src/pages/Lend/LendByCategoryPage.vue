<template>
	<www-page class="lend-by-category-page">
		<div class="row">
			<div class="small-12 columns heading-region">
				<h1>Make a loan, change a life</h1>
				<p>Each Kiva loan helps people build a better
				future for themselves and their families.</p>
			</div>
		</div>

		<div>
			<category-row
				class="loan-category-row"
				v-for="loanChannel in loanChannels"
				:key="loanChannel"
				:loan-channel="loanChannel"
			/>

			<loading-overlay v-if="loading" />

			<!-- @todo - do we need this here? -->
			<div v-if="totalCount > 0" class="loan-count">
				{{ totalCount }} loans
			</div>
		</div>
	</www-page>
</template>

<script>
// import _get from 'lodash/get';
// import _invokeMap from 'lodash/invokeMap';
// import _isEqual from 'lodash/isEqual';
// import _map from 'lodash/map';
// import _mapValues from 'lodash/mapValues';
// import _merge from 'lodash/merge';
// import numeral from 'numeral';
import WwwPage from '@/components/WwwFrame/WwwPage';
import CategoryRow from '@/components/LoansByCategory/CategoryRow';
import LoadingOverlay from './LoadingOverlay';


// // A map of functions to transform url query parameters to/from graphql variables.
// // Each key in urlParamTransform is a url query parameter (e.g. the 'page' in ?page=2).
// // Each value is then an object with the to/from functions to write/read the url parameter.
// const urlParamTransform = {
// 	page: {
// 		to({ offset }) {
// 			const page = Math.floor(offset / loansPerPage) + 1;
// 			return page > 1 ? String(page) : undefined;
// 		},
// 		from({ page }) {
// 			const pagenum = numeral(page).value() - 1;
// 			return { offset: pagenum > 0 ? loansPerPage * pagenum : 0 };
// 		}
// 	},
// };

// // Turn an object of graphql variables into an object of url query parameters
// function toUrlParams(variables) {
// 	return _mapValues(urlParamTransform, ({ to }) => to(variables));
// }
//
// // Turn an object of url query parameters into an object of graphql variables
// function fromUrlParams(params) {
// 	return _merge({}, ..._invokeMap(urlParamTransform, 'from', params));
// }

export default {
	components: {
		WwwPage,
		CategoryRow,
		LoadingOverlay,
	},
	inject: ['apollo'],
	metaInfo: {
		title: 'Loans by category'
	},
	data() {
		return {
			totalCount: 0,
			isVisitor: true,
			itemsInBasket: [],
			loanChannels: [5, 8, 1, 24],
			loading: false,
		};
	},
	computed: {

	},
	apollo: {
		// query: loanCardQuery,
		// preFetch: true,
		// preFetchVariables({ route }) {
		// 	return _merge({ limit: loansPerPage }, fromUrlParams(route.query));
		// },
		// variables() {
		// 	return {
		// 		offset: this.offset,
		// 		limit: this.limit,
		// 	};
		// },
		// result({ data, loading }) {
		// 	if (loading) {
		// 		this.loading = true;
		// 	} else {
		// 		this.totalCount = data.lend.loans.totalCount;
		// 		this.loans = data.lend.loans.values;
		// 		this.itemsInBasket = _map(data.shop.basket.items.values, 'id');
		// 		this.isVisitor = !_get(data, 'my.userAccount.id');
		// 		this.loading = false;
		// 	}
		// }
	},
	methods: {
		// pageChange(number) {
		// 	const offset = loansPerPage * (number - 1);
		// 	this.offset = offset;
		// 	this.pushChangesToUrl();
		// },
		// updateFromParams(query) {
		// 	const { offset } = fromUrlParams(query);
		// 	this.offset = offset;
		// },
		// pushChangesToUrl() {
		// 	if (!_isEqual(this.$route.query, this.urlParams)) {
		// 		this.$router.push({ query: this.urlParams });
		// 	}
		// }
	},
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

<style lang="scss" >
@import 'settings';

.lend-by-category-page {
	main {
		background-color: $kiva-bg-lightgray;
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

	.loan-category-row {
		margin: 0 2rem rem-calc(20);
	}
}
</style>
