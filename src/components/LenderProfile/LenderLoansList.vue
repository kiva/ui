<template>
	<section v-if="lenderLoans.length > 0" class="tw-my-8" id="lender-loans">
		<div v-if="totalCount > 0">
			<h4 class="data-hj-suppress tw-mb-1">
				{{ lenderLoansTitle }}
			</h4>
			<p class="tw-mb-2">
				{{ showedLoans }}
			</p>
		</div>
		<kv-loading-placeholder
			v-else
			class="tw-mb-2"
			style="height: 55px; width: 250px;"
		/>

		<div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-3">
			<new-home-page-loan-card
				class="!tw-max-w-full lender-card"
				v-for="(loan, index) in lenderLoans"
				:item-index="index"
				:key="`loan-${loan.id}-${index}`"
				:loan-id="loan.id"
				:lender-public-id="publicId"
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
import logReadQueryError from '@/util/logReadQueryError';
import smoothScrollMixin from '@/plugins/smooth-scroll-mixin';
import lenderLoansQuery from '@/graphql/query/lenderLoans.graphql';
import NewHomePageLoanCard from '@/components/LoanCards/NewHomePageLoanCard';
import KvPagination from '~/@kiva/kv-components/vue/KvPagination';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

export default {
	name: 'LenderLoansList',
	mixins: [smoothScrollMixin],
	inject: ['apollo', 'cookieStore'],
	components: {
		NewHomePageLoanCard,
		KvPagination,
		KvLoadingPlaceholder,
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
			lenderLoans: new Array(4).fill({ id: 0 }),
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
				? `${numeral(this.totalCount).format('0,0')} loans`
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
				this.$emit('loans-loaded');
			} catch (e) {
				logReadQueryError(e, 'LenderLoansList lenderLoansQuery');
			}
		},
		pageChange({ pageOffset }) {
			this.loansOffset = pageOffset;
			this.pushChangesToUrl();
			this.fetchLenderLoans();
			this.scrollToSection('#lender-loans');
		},
		updateFromParams(query) {
			const pageNum = numeral(query.loans).value() - 1;

			this.loansOffset = pageNum > 0 ? this.loansLimit * pageNum : 0;
		},
		pushChangesToUrl() {
			const currentQuery = this.$route?.query;
			if (!_isEqual(currentQuery, this.urlParams)) {
				this.$router.push({ query: { ...currentQuery, ...this.urlParams } });
			}
		},
		scrollToSection(sectionId) {
			const elementToScrollTo = document.querySelector(sectionId);
			const topOfSectionToScrollTo = elementToScrollTo?.offsetTop - 50 ?? 0;
			this.smoothScrollTo({ yPosition: topOfSectionToScrollTo, millisecondsToAnimate: 750 });
		}
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

<style lang="postcss" scoped>
::v-deep .lender-card .loading-placeholder,
::v-deep .lender-card .loading-paragraph {
	@apply !tw-w-full !tw-max-w-full;
}
</style>
