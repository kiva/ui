<template>
	<async-portfolio-section @visible="fetchAsyncData" data-testid="lending-insights">
		<h2 class="tw-mb-3 md:tw-mb-2">
			Your lending insights
		</h2>
		<kv-grid as="dl" class="tw-grid-cols-12">
			<div class="tw-col-span-12 md:tw-col-span-6">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" style="width: 4rem;" />
				<dt v-show="!loading" class="stat-value">
					{{ countryCount }}
				</dt>
				<dd class="stat-def">
					Countries supported
				</dd>
				<router-link
					to="/portfolio/lending-stats"
					v-kv-track-event="['portfolio', 'click', 'countries-supported-details']"
				>
					Details
				</router-link>
			</div>
			<div class="tw-col-span-12 md:tw-col-span-6">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" style="width: 4rem;" />
				<dt v-show="!loading" class="stat-value">
					{{ inviteeLoanCount }}
				</dt>
				<dd class="stat-def">
					Loans by your invitees
				</dd>
				<router-link
					to="/portfolio/invites#myInviteActivity"
					v-kv-track-event="['portfolio', 'click', 'invitee-loans-details']"
				>
					Details
				</router-link>
			</div>
			<div class="tw-col-span-12 md:tw-col-span-6">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" style="width: 10rem;" />
				<dt v-show="!loading" class="stat-value">
					{{ amountLent }}
				</dt>
				<dd class="stat-def">
					Total amount lent
				</dd>
				<router-link
					to="/portfolio/loans"
					v-kv-track-event="['portfolio', 'click', 'total-amount-lent-details']"
				>
					Details
				</router-link>
				<!-- <button
					class="tw-text-link"
					@click="loanLightboxVisible = true"
					v-kv-track-event="['portfolio', 'click', 'total-amount-lent-details']"
				>
					Details
				</button>
				<kv-lightbox
					:visible="loanLightboxVisible"
					title="Loan count"
					@lightbox-closed="loanLightboxVisible = false"
				>
					<loan-count-over-time-figure />
				</kv-lightbox> -->
			</div>
			<div class="tw-col-span-12 md:tw-col-span-6">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" style="width: 7rem;" />
				<dt v-show="!loading" class="stat-value">
					{{ percentile }}
				</dt>
				<dd class="stat-def">
					Lending percentile on Kiva
				</dd>
			</div>
		</kv-grid>
	</async-portfolio-section>
</template>

<script>
import { gql } from '@apollo/client';
import numeral from 'numeral';
import getCacheKey from '@/util/getCacheKey';
import AsyncPortfolioSection from './AsyncPortfolioSection';
// import LoanCountOverTimeFigure from './LoanCountOverTimeFigure';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

export default {
	name: 'LendingInsights',
	serverCacheKey: () => getCacheKey('LendingInsights'),
	inject: ['apollo'],
	components: {
		AsyncPortfolioSection,
		KvGrid,
		KvLoadingPlaceholder,
		// LoanCountOverTimeFigure,
	},
	data() {
		return {
			loading: true,
			loadingPromise: null,
			donationLightboxVisible: false,
			// loanLightboxVisible: false,
			countryCount: 0,
			inviteeLoanCount: 0,
			amountLent: 0,
			percentile: 0,
		};
	},
	methods: {
		fetchAsyncData() {
			if (this.loading && !this.loadingPromise) {
				this.loadingPromise = this.apollo.query({
					query: gql`query lendingInsights {
						my {
							id
							lendingStats {
								id
								amountLentPercentile
								lentTo {
									countries {
										totalCount
									}
								}
							}
							userStats {
								amount_of_loans
								number_of_loans_by_invitees
							}
						}
					}`
				}).then(({ data }) => {
					this.loading = false;
					this.countryCount = data?.my?.lendingStats?.lentTo?.countries?.totalCount ?? 0;
					this.percentile = numeral(data?.my?.lendingStats?.amountLentPercentile ?? 0).format('0o');
					this.inviteeLoanCount = data?.my?.userStats?.number_of_loans_by_invitees ?? 0;

					const amountOfLoans = numeral(data?.my?.userStats?.amount_of_loans ?? 0);
					this.amountLent = amountOfLoans.format('$0,0[.]00');
				}).finally(() => {
					this.loadingPromise = null;
				});
			}
		},
	},
};
</script>

<style lang="postcss" scoped>
.stat-placeholder {
	margin-bottom: 6px;
	@apply tw-mt-1 tw-h-4.5;
}

.stat-value {
	@apply tw-text-h1 tw-text-brand;
}

.stat-def {
	@apply tw-text-h3 tw-mb-0.5;
}

@screen md {
	.stat-placeholder {
		height: 44px;
		margin-bottom: 10.5px;
	}
}

@screen lg {
	.stat-placeholder {
		margin-bottom: 11.5px;
		@apply tw-h-6;
	}
}
</style>
