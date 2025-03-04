<template>
	<async-portfolio-section
		v-show="totalLoans > 0 || loading"
		@visible="fetchAsyncData"
		variant="minimal"
		data-testid="recent-loans"
	>
		<!-- headline -->
		<kv-loading-placeholder v-if="loading" class="header-placeholder tw-mb-1 lg:tw-mb-1.5" style="width: 40%;" />
		<h2 v-else class="data-hj-suppress tw-mb-0.5">
			Thank you, {{ lenderName }}
		</h2>
		<!-- sub headline -->
		<kv-loading-placeholder v-if="loading" class="sub-placeholder tw-mb-1 md:tw-mb-4" style="width: 65%;" />
		<kv-loading-placeholder v-if="loading" class="sub-placeholder tw-mb-4 md:tw-hidden" style="width: 25%;" />
		<p v-else class="tw-mb-4">
			{{ totalLoansString }} and counting. You are changing lives!
		</p>
		<!-- loan grid -->
		<kv-grid as="ol" class="tw-grid-cols-12 tw-gap-y-6 md:tw-gap-y-7 lg:tw-gap-y-7">
			<recent-loan-item
				v-for="(id, index) in loanIds"
				:key="index"
				:loan-id="id"
				@open-comment-modal="openCommentModal"
				class="tw-col-span-6 lg:tw-col-span-4"
			/>
		</kv-grid>
		<!-- all loans link -->
		<p v-if="totalLoans > 6" class="tw-text-center tw-mt-4">
			<router-link
				to="/portfolio/loans"
				class="tw-inline-block tw-p-1"
				v-kv-track-event="['portfolio', 'click', 'view-all-loans']"
			>
				View all loans
			</router-link>
		</p>
		<!-- Loan Comment Component -->
		<loan-comment-modal
			:loan="commentLoanData"
			@comment-modal-closed="commentLoanData.visible = false"
		/>
	</async-portfolio-section>
</template>

<script>
import { gql } from 'graphql-tag';
import numeral from 'numeral';
import getCacheKey from '#src/util/getCacheKey';
import { KvGrid, KvLoadingPlaceholder } from '@kiva/kv-components';
import AsyncPortfolioSection from './AsyncPortfolioSection';
import RecentLoanItem from './RecentLoanItem';
import LoanCommentModal from './LoanCommentModal';

export default {
	name: 'RecentLoansList',
	serverCacheKey: () => getCacheKey('RecentLoansList'),
	inject: ['apollo'],
	components: {
		AsyncPortfolioSection,
		KvGrid,
		KvLoadingPlaceholder,
		RecentLoanItem,
		LoanCommentModal,
	},
	data() {
		return {
			loading: true,
			loadingPromise: null,
			lenderName: '',
			totalLoans: 0,
			loanIds: [0, 0, 0, 0, 0],
			commentLoanData: {
				loanId: 0,
				borrowerName: '',
				visible: false,
			},
		};
	},
	computed: {
		totalLoansString() {
			return `${numeral(this.totalLoans).format('0,0')} loan${this.totalLoans === 1 ? '' : 's'}`;
		}
	},
	methods: {
		fetchAsyncData() {
			if (this.loading && !this.loadingPromise) {
				this.loadingPromise = this.apollo.query({
					query: gql`query recentLoansOverview {
						my {
							id
							loans(limit: 6) {
								values {
									id
								}
							}
							userAccount {
								id
								firstName
							}
							userStats {
								number_of_loans
							}
						}
					}`
				}).then(({ data }) => {
					this.loading = false;
					this.lenderName = data?.my?.userAccount?.firstName ?? '';
					this.totalLoans = data?.my?.userStats?.number_of_loans ?? 0;
					const loanIds = (data?.my?.loans?.values ?? []).map(({ id }) => id);
					this.loanIds = loanIds.length ? loanIds : [0, 0, 0, 0, 0];
				}).finally(() => {
					this.loadingPromise = null;
				});
			}
		},
		openCommentModal(payload) {
			this.commentLoanData = {
				...payload,
				visible: true
			};
		}
	},
};
</script>

<style lang="postcss" scoped>
.header-placeholder {
	height: 28px;
}

.sub-placeholder {
	height: 19px;
}

@screen md {
	.header-placeholder {
		height: 36px;
	}
}

@screen lg {
	.header-placeholder {
		height: 40px;
		margin-top: 2px;
	}

	.sub-placeholder {
		height: 24px;
	}
}
</style>
