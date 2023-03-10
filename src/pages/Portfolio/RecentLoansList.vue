<template>
	<async-portfolio-section v-show="totalLoans > 0 || loading" @visible="fetchAsyncData">
		<div v-if="loading" class="tw-h-3.5 tw-mb-1 md:tw-h-4 lg:tw-h-5 lg:tw-mb-2" style="width: 40%;">
			<kv-loading-placeholder />
		</div>
		<h2 v-else class="tw-mb-0.5">
			Thank you, {{ lenderName }}
		</h2>
		<div v-if="loading" class="tw-h-2.5 lg:tw-h-3 tw-mb-1 md:tw-mb-4" style="width: 65%;">
			<kv-loading-placeholder />
		</div>
		<div v-if="loading" class="tw-h-2.5 tw-mb-4 md:tw-hidden" style="width: 25%;">
			<kv-loading-placeholder />
		</div>
		<p v-else class="tw-mb-4">
			{{ totalLoansString }} and counting! You are changing lives!
		</p>
		<kv-grid as="ol" class="tw-grid-cols-12">
			<recent-loan-item
				v-for="(id, index) in loanIds"
				:key="index"
				:loan-id="id"
				class="tw-col-span-6 lg:tw-col-span-4"
			/>
		</kv-grid>
		<p v-if="totalLoans > 6" class="tw-text-center tw-mt-4">
			<router-link
				to="/portfolio/loans"
				class="tw-inline-block tw-p-1"
				v-kv-track-event="['portfolio', 'click', 'view-all-loans']"
			>
				View all loans
			</router-link>
		</p>
	</async-portfolio-section>
</template>

<script>
import { gql } from '@apollo/client';
import numeral from 'numeral';
import AsyncPortfolioSection from './AsyncPortfolioSection';
import RecentLoanItem from './RecentLoanItem';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

export default {
	name: 'RecentLoansList',
	inject: ['apollo'],
	components: {
		AsyncPortfolioSection,
		KvGrid,
		KvLoadingPlaceholder,
		RecentLoanItem,
	},
	data() {
		return {
			loading: true,
			lenderName: '',
			totalLoans: 0,
			loanIds: [0, 0, 0, 0, 0],
		};
	},
	computed: {
		totalLoansString() {
			return `${numeral(this.totalLoans).format('0,0')} loan${this.totalLoans === 1 ? '' : 's'}`;
		}
	},
	methods: {
		fetchAsyncData() {
			if (this.loading) {
				this.apollo.query({
					query: gql`query recentLoansOverview {
						my {
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
				}); // TODO catch?
			}
		}
	},
};
</script>
