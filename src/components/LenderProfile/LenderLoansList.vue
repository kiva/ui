<template>
	<section v-if="lenderLoans.length > 0" class="tw-my-8">
		<h4 class="data-hj-suppress tw-mb-1">
			{{ lenderLoansTitle }}
		</h4>
		<p class="tw-mb-2">
			{{ showedLoans }}
		</p>

		<div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-3">
			<new-home-page-loan-card
				class="!tw-max-w-full"
				v-for="(loan, index) in lenderLoans"
				:item-index="index"
				:key="`loan-${loan.id}`"
				:loan-id="loan.id"
			/>
		</div>
		<kv-pagination
			class="tw-mt-4"
			v-if="totalCount > loansLimit"
			:limit="loansLimit"
			:total="totalCount"
			:offset="loansOffset"
			@page-changed="pageChange"
		/>
	</section>
</template>

<script>
import _isEqual from 'lodash/isEqual';
import _get from 'lodash/get';
import numeral from 'numeral';
import logReadQueryError from '#src/util/logReadQueryError';
import lenderLoansQuery from '#src/graphql/query/lenderLoans.graphql';
import NewHomePageLoanCard from '#src/components/LoanCards/NewHomePageLoanCard';
import KvPagination from '@kiva/kv-components/vue/KvPagination';

export default {
	name: 'LenderLoansList',
	inject: ['apollo', 'cookieStore'],
	components: {
		NewHomePageLoanCard,
		KvPagination,
	},
	props: {
		publicId: {
			type: String,
			required: true,
		},
		lenderInfo: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			lenderLoans: [],
			loansLimit: 12,
			loansOffset: 0,
			totalCount: 0,
			pageQuery: { loans: '1' },
		};
	},
	computed: {
		lenderLoansTitle() {
			return this.lenderInfo?.name
				? `${this.lenderInfo.name}'s loans`
				: 'Loans';
		},
		showedLoans() {
			return this.totalCount > 1
				? `${this.totalCount} loans`
				: `${this.totalCount} loan`;
		},
		urlParams() {
			const loansPage = Math.floor(this.loansOffset / this.loansLimit) + 1;

			return { loans: loansPage > 1 ? String(loansPage) : undefined };
		},
	},
	methods: {
		async fetchLenderLoans() {
			try {
				const { data } = await this.apollo.query({
					query: lenderLoansQuery,
					variables: {
						publicId: this.publicId,
						limit: this.loansLimit,
						offset: this.loansOffset
					},
				});

				this.lenderLoans = data.community?.lender?.loans?.values ?? [];
				this.totalCount = data.community?.lender?.loans?.totalCount ?? 0;
			} catch (e) {
				logReadQueryError(e, 'LenderLoansList lenderLoansQuery');
			}
		},
		pageChange({ pageOffset }) {
			this.loansOffset = pageOffset;
			this.pushChangesToUrl();
			this.fetchLenderLoans();
		},
		updateFromParams(query) {
			const pageNum = numeral(query.loans).value() - 1;

			this.loansOffset = pageNum > 0 ? this.loansLimit * pageNum : 0;
		},
		pushChangesToUrl() {
			if (!_isEqual(this.$route.query, this.urlParams)) {
				this.$router.push({ query: this.urlParams });
			}
		},
	},
	mounted() {
		this.fetchLenderLoans();
	},
	created() {
		this.pageQuery = _get(this.$route, 'query');
		this.updateFromParams(this.pageQuery);
	}
};
</script>
