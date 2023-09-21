<template>
	<async-portfolio-section @visible="fetchAsyncData" data-testid="lending-insights" class="!tw-bg-eco-green-4">
		<h2 class="tw-text-h3 tw-mb-3 md:tw-mb-2 tw-text-white tw-text-center md:tw-text-left">
			Your lending insights
		</h2>
		<kv-grid as="dl" class="stats-container">
			<div class="tw-col-span-12 md:tw-col-span-6 xl:tw-col-span-3">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" style="width: 7rem;" />
				<dt v-show="!loading" class="stat-value">
					{{ amountLent }}
				</dt>
				<dd class="stat-def">
					Total amount lent
				</dd>
				<router-link
					class="stat-link"
					to="/portfolio/loans"
					v-kv-track-event="['portfolio', 'click', 'total-amount-lent-details']"
				>
					My loans
					<kv-material-icon
						class="tw-ml-0.5 tw-w-2 tw-h-2"
						:icon="mdiArrowRight"
					/>
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
			<div class="tw-col-span-12 md:tw-col-span-6 xl:tw-col-span-3">
				<kv-loading-placeholder
					v-if="loading"
					class="stat-placeholder"
					style="width: 4rem;"
				/>
				<dd v-else class="stat-value">
					{{ numberOfLoans | numeral('0,0') }}
				</dd>
				<dt class="stat-def">
					Loans made
				</dt>
			</div>
			<div class="tw-col-span-12 md:tw-col-span-6 xl:tw-col-span-3">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" style="width: 4rem;" />
				<dt v-show="!loading" class="stat-value">
					{{ countryCount }}
				</dt>
				<dd class="stat-def">
					Countries supported
				</dd>
				<router-link
					class="stat-link"
					to="/portfolio/lending-stats"
					v-kv-track-event="['portfolio', 'click', 'countries-supported-details']"
				>
					Lending stats
					<kv-material-icon
						class="tw-ml-0.5 tw-w-2 tw-h-2"
						:icon="mdiArrowRight"
					/>
				</router-link>
			</div>
			<div class="tw-col-span-12 md:tw-col-span-6 xl:tw-col-span-3">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" style="width: 7rem;" />
				<dt v-show="!loading" class="stat-value">
					{{ percentile }}
				</dt>
				<dd class="stat-def">
					Lending percentile
				</dd>
			</div>
		</kv-grid>
	</async-portfolio-section>
</template>

<script>
import { gql } from '@apollo/client';
import numeral from 'numeral';
import getCacheKey from '@/util/getCacheKey';
import { mdiArrowRight } from '@mdi/js';
import AsyncPortfolioSection from './AsyncPortfolioSection';
// import LoanCountOverTimeFigure from './LoanCountOverTimeFigure';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'LendingInsights',
	serverCacheKey: () => getCacheKey('LendingInsights'),
	inject: ['apollo'],
	components: {
		AsyncPortfolioSection,
		KvGrid,
		KvLoadingPlaceholder,
		KvMaterialIcon
		// LoanCountOverTimeFigure,
	},
	data() {
		return {
			loading: true,
			loadingPromise: null,
			donationLightboxVisible: false,
			// loanLightboxVisible: false,
			countryCount: 0,
			amountLent: 0,
			percentile: 0,
			numberOfLoans: 0,
			mdiArrowRight,
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
								number_of_loans
							}
						}
					}`
				}).then(({ data }) => {
					this.loading = false;
					this.countryCount = data?.my?.lendingStats?.lentTo?.countries?.totalCount ?? 0;
					this.percentile = numeral(data?.my?.lendingStats?.amountLentPercentile ?? 0).format('0o');
					this.numberOfLoans = data?.my?.userStats?.number_of_loans ?? 0;

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
.stats-container {
	background-color: rgba(255, 255, 255, 0.05);
	@apply tw-grid-cols-12 tw-gap-y-4 tw-p-1.5 tw-rounded tw-text-center;
}

.stat-placeholder {
	@apply tw-mt-1 tw-h-4.5 tw-mx-auto tw-mb-0.5;
}

.stat-value {
	@apply tw-text-h2 tw-text-eco-green-2;
}

.stat-def {
	@apply tw-text-base tw-mb-0.5 tw-text-white;
}

.stat-link {
	@apply tw-inline-flex tw-justify-center tw-items-center tw-text-eco-green-2 tw-font-medium;
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
