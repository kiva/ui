<template>
	<section
		id="campaign-loans"
		class="campaign-loans row align-center"
	>
		<div class="columns align-self-middle" v-if="isVisible && loans.length > 0">
			<div class="loan-card-group row tw-gap-x-4">
				<kiva-classic-basic-loan-card
					class="tw-mb-4"
					v-for="(loan, index) in loanIds"
					:item-index="index"
					:key="`loan-${loan}`"
					:loan-id="loan"
					:show-action-button="true"
					:custom-loan-details="true"
					:checkout-route="checkoutRoute"
					:use-emitted-add-to-basket="true"
					@show-loan-details="showLoanDetails(loans[index])"
					@add-to-basket="addToBasket"
					@custom-checkout-button-action="$emit('show-basket')"
				/>
			</div>
			<kv-pagination
				v-if="totalCount > 0"
				:total="totalCount"
				:limit="limit"
				:offset="offset"
				@page-changed="pageChange"
			/>
			<div v-if="totalCount > 0" class="loan-count">
				{{ totalCount }} loans
			</div>
		</div>

		<div v-if="zeroLoans" class="zero-loans-state">
			<h3 class="tw-mb-2">
				All borrowers matching this search have been funded.
			</h3>
			<p>
				Please adjust your criteria or <a @click.prevent="resetSearchFilters">start a new search.</a>
			</p>
		</div>

		<div v-if="loadingLoans" class="campaign-loans__loading-loans">
			<kv-loading-overlay
				id="loadingLoansOverlay"
				class="campaign-loans__loading-loans-overlay"
			/>
			<p class="campaign-loans__loading-loans-copy">
				Loading loans...
			</p>
		</div>
	</section>
</template>

<script>
import _invokeMap from 'lodash/invokeMap';
import _mapValues from 'lodash/mapValues';
import _map from 'lodash/map';
import _merge from 'lodash/merge';
import basicLoanQuery from '#src/graphql/query/basicLoanData.graphql';
import KvLoadingOverlay from '#src/components/Kv/KvLoadingOverlay';
import KvPagination from '#src/components/Kv/KvPagination';
import KivaClassicBasicLoanCard from '#src/components/LoanCards/KivaClassicBasicLoanCard';
import numeral from 'numeral';

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
	name: 'CampaignLoanGridDisplay',
	inject: ['apollo'],
	components: {
		// KvIcon,
		// KvButton,
		KvLoadingOverlay,
		KvPagination,
		KivaClassicBasicLoanCard,
	},
	emits: [
		'add-to-basket',
		'remove-loan-from-basket',
		'reset-loan-filters',
		'show-basket',
		'show-loan-details',
		'update-total-count',
	],
	props: {
		checkoutVisible: {
			type: Boolean,
			default: false,
		},
		showLoans: {
			type: Boolean,
			default: false,
		},
		filters: {
			type: Object,
			default: () => {},
		},
		isVisible: {
			type: Boolean,
			default: false,
		},
		isVisitor: {
			type: Boolean,
			default: true,
		},
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
		basketLoans: {
			type: Array,
			default: () => []
		},
		promoOnly: {
			type: Object,
			default: null
		},
		sortBy: {
			type: String,
			default: 'popularity'
		},
		checkoutRoute: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			limit: loansPerPage,
			loadingLoans: true,
			loans: [],
			loansPerPage,
			offset: 0,
			pageQuery: { page: '1' },
			totalCount: 0,
			loanQueryVarsStack: [this.filters],
			loanQueryFilters: () => {},
			zeroLoans: false,
		};
	},
	computed: {
		loanIds() {
			return _map(this.loans, 'id');
		},
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
				filters: this.loanQueryFilters,
				promoOnly: this.promoOnly,
				sortBy: this.sortBy,
			};
		},
	},
	watch: {
		filters(next, prev) {
			if (next !== prev) {
				this.loanQueryFilters = next;
			}
		},
		isVisible(next) {
			if (next && this.showLoans) {
				this.fetchLoans();
			}
		},
		showLoans(next) {
			if (next && this.isVisible) {
				this.fetchLoans();
			}
		},
		loanQueryVars: {
			handler(next, prev) {
				this.loanQueryVarsStack.push(prev);
				if (this.showLoans && this.isVisible) {
					this.fetchLoans();
				}
			},
			deep: true,
		}
	},
	created() {
		// extract query
		this.pageQuery = this.$route.query;
		this.loanQueryFilters = this.filters;
	},
	methods: {
		getCheckoutBtnText(loan) {
			const amount = this.getAmountLended(loan);
			if (amount > 0) {
				return `Supported for ${numeral(amount).format('$0')}`;
			}
			return 'Supported';
		},
		addToBasket(payload) {
			this.$emit('add-to-basket', payload);
		},
		removeLoanFromBasket(loanId) {
			this.$emit('remove-loan-from-basket', loanId);
		},
		showBasket() {
			this.$emit('show-basket');
		},
		showLoanDetails(loan) {
			this.$emit('show-loan-details', loan);
		},
		fetchLoans() {
			if (this.isVisible) {
				this.loadingLoans = true;
			}
			this.zeroLoans = false;
			this.apollo.query({
				query: basicLoanQuery,
				variables: this.loanQueryVars,
				fetchPolicy: 'network-only'
			}).then(({ data }) => {
				this.loans = data.lend?.loans?.values ?? [];
				this.totalCount = data.lend?.loans?.totalCount ?? 0;

				if (this.isVisible) {
					this.$emit('update-total-count', this.totalCount);
					this.checkIfPageIsOutOfRange(this.loans.length, this.pageQuery.page);
					this.loadingLoans = false;
				}

				if (!this.totalCount) {
					this.zeroLoans = true;
				}
			});
		},
		setLoanQueryFilters(userSelection) {
			if (!userSelection) {
				this.loanQueryFilters = this.filters;
			}
		},

		// Pagination Related methods
		checkIfPageIsOutOfRange(loansArrayLength, pageQueryParam) {
			// determines if the page query param is for a page that is out of bounds.
			// if it is, changes page to the last page and displays a tip message
			const loansOutOfRange = loansArrayLength === 0 && pageQueryParam;
			if (loansOutOfRange) {
				this.pageChange({ pageOffset: loansPerPage * (this.lastLoanPage - 1) });
			}
		},
		pageChange({ pageOffset }) {
			this.offset = pageOffset;
			this.pageQuery = { page: this.offset / loansPerPage };
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
					},
					hash: 'campaignLoanDisplay'
				});
			}
		},
		resetSearchFilters() {
			this.$emit('reset-loan-filters');
		},
		getAmountLended(loanId) {
			if (this.basketLoans.length > 0) {
				return this.basketLoans?.find(loan => String(loan.id) === String(loanId))?.price;
			}
		}
	},
};
</script>

<style lang="scss" scoped>
@use '#src/assets/scss/settings' as *;

$card-width: rem-calc(290);
$max-card-width: rem-calc(330);
$card-margin: rem-calc(14);
$card-half-space: rem-calc(7);

.campaign-loans {
	.loan-card-group {
		justify-content: center;
	}

	.loan-count {
		text-align: center;
	}

	&__loading-loans {
		min-height: 8rem;

		&__loading-loans-copy {
			z-index: 1001;
			position: relative;
		}

		#loadingLoansOverlay {
			margin-top: 1rem;
			z-index: 1000;
			width: auto;
			height: auto;
			inset: 0;
			background-color: rgba($white, 0.7);

			:deep(.spinner-wrapper) {
				display: flex;
				align-items: center;
				justify-content: center;
				position: initial;
				height: 100%;
				top: auto;
				left: auto;
				transform: none;
			}
		}
	}
}
</style>
