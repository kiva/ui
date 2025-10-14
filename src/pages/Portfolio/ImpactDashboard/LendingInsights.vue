<template>
	<async-portfolio-section
		v-if="!isPercentileByYearExpEnabled"
		@visible="fetchLifetimeStats"
		data-testid="lending-insights"
		class="!tw-bg-eco-green-4"
	>
		<h2 class="tw-text-h3 tw-mb-3 md:tw-mb-2 tw-text-white tw-text-center md:tw-text-left">
			Your lending insights
		</h2>
		<kv-grid as="dl" class="stats-container">
			<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" style="width: 7rem;" />
				<dt v-show="!loading" class="stat-value">
					{{ lifetimeAmountLent }}
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
			<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
				<kv-loading-placeholder
					v-if="loading"
					class="stat-placeholder"
					style="width: 4rem;"
				/>
				<dd v-else class="stat-value">
					{{ $filters.numeral(lifetimeNumberOfLoans, '0,0') }}
				</dd>
				<dt class="stat-def">
					Loans made
				</dt>
			</div>
			<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" style="width: 4rem;" />
				<dt v-show="!loading" class="stat-value">
					{{ lifetimeCountryCount }}
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
			<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" style="width: 7rem;" />
				<dt v-show="!loading" class="stat-value">
					{{ lifetimePercentile }}
				</dt>
				<dd class="stat-def">
					Lending percentile
				</dd>
			</div>
		</kv-grid>
	</async-portfolio-section>
	<!-- To-Do: Remove aspects of v-else version when experiment is over -->
	<async-portfolio-section
		v-else
		@visible="fetchStats"
		data-testid="lending-insights"
		class="!tw-bg-white"
	>
		<div class="tw-flex tw-items-center tw-justify-end tw-gap-3 tw-mb-3 md:tw-mb-2">
			<div
				class="tw-inline-flex tw-px-1 tw-py-0.5 tw-items-center
					tw-rounded-sm tw-bg-brand-100 tw-border tw-border-brand-200"
			>
				<star-shine class="tw-flex-shrink-0" />
				<p class="tw-text-h5 tw-pl-0.5 tw-flex-shrink-0">
					Filter by year now live
				</p>
			</div>
		</div>
		<div>
			<kv-tabs @tab-changed="setActiveTab" :active-tab="currentTab">
				<template #tabNav>
					<h2 class="tw-text-h3 tw-mb-3 md:tw-mb-2 tw-text-eco-green-4 tw-text-center md:tw-text-left">
						Lending insights
					</h2>
					<kv-tab
						for-panel="ytd"
						class="tab-header"
						v-kv-track-event="['portfolio', 'click', 'stats-YTD']"
					>
						{{ yearToDate }}
					</kv-tab>
					<kv-tab
						for-panel="lifetime"
						class="tab-header"
						v-kv-track-event="['portfolio', 'click', 'stats-Lifetime']"
					>
						Lifetime
					</kv-tab>
				</template>
				<template #tabPanels>
					<kv-tab-panel id="ytd">
						<!-- Current year Panel -->
						<kv-grid as="dl" class="stats-container-exp lg:!tw-px-4 lg:!tw-py-1.4 md:!tw-pr-4">
							<!-- Total amount lent -->
							<div class="secondary-card tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
								<kv-loading-placeholder
									v-if="loading"
									class="stat-placeholder"
									style="width: 7rem;"
								/>
								<dt v-show="!loading" class="stat-value">
									{{ currentYearAmountLent }}
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
							</div>
							<!-- Lending percentile -->
							<div
								class="main-ytd-card tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-5
										tw-bg-eco-green-3 tw-rounded tw-px-4 tw-py-2 md:!tw-py-1.5 md:!tw-px-3"
							>
								<kv-loading-placeholder
									v-if="loading"
									class="stat-placeholder"
									style="width: 7rem;"
								/>
								<dt v-show="!loading" class="stat-value !tw-text-white">
									{{ formattedCurrentYearPercentile }}
								</dt>
								<dd class="stat-def">
									Lending percentile this year
								</dd>
								<router-link
									v-if="nextPercentileMsg && currentYearPercentile < 99"
									class="stat-link"
									to="/lend-category-beta"
									v-kv-track-event="['portfolio', 'click', `${currentYearPercentile}-percentile`]"
								>
									{{ nextPercentileMsg }}
									<kv-material-icon
										class="tw-ml-0.5 tw-w-3.5 tw-h-2"
										:icon="mdiArrowRight"
									/>
								</router-link>
								<span
									v-else-if="currentYearPercentile === 99"
									class="stat-link tw-text-eco-green-2 tw-font-medium tw-inline-flex tw-items-center"
								>
									Thank you!
								</span>
							</div>
							<!-- Loans made -->
							<div class="secondary-card tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-2">
								<kv-loading-placeholder
									v-if="loading"
									class="stat-placeholder"
									style="width: 4rem;"
								/>
								<dd v-else class="stat-value">
									{{ currentYearNumberOfLoans }}
								</dd>
								<dt class="stat-def">
									Loans made
								</dt>
							</div>
							<!-- Countries supported -->
							<div class="secondary-card tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-2">
								<kv-loading-placeholder
									v-if="loading"
									class="stat-placeholder"
									style="width: 4rem;"
								/>
								<dt v-show="!loading" class="stat-value">
									{{ currentYearCountryCount }}
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
						</kv-grid>
					</kv-tab-panel>
					<kv-tab-panel id="lifetime">
						<!-- Lifetime Panel -->
						<kv-grid as="dl" class="stats-container-exp">
							<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
								<kv-loading-placeholder
									v-if="loading"
									class="stat-placeholder"
									style="width: 7rem;"
								/>
								<dt v-show="!loading" class="stat-value">
									{{ lifetimeAmountLent }}
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
							</div>
							<!-- Lending percentile -->
							<div
								class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3
									tw-bg-eco-green-3 tw-rounded"
							>
								<kv-loading-placeholder
									v-if="loading"
									class="stat-placeholder"
									style="width: 7rem;"
								/>
								<dt v-show="!loading" class="stat-value">
									{{ lifetimePercentile }}
								</dt>
								<dd class="stat-def">
									Lending percentile
								</dd>
							</div>
							<!-- Loans made -->
							<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
								<kv-loading-placeholder
									v-if="loading"
									class="stat-placeholder"
									style="width: 4rem;"
								/>
								<dd v-else class="stat-value">
									{{ lifetimeNumberOfLoans }}
								</dd>
								<dt class="stat-def">
									Loans made
								</dt>
							</div>
							<!-- Countries supported -->
							<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
								<kv-loading-placeholder
									v-if="loading"
									class="stat-placeholder"
									style="width: 4rem;"
								/>
								<dt v-show="!loading" class="stat-value">
									{{ lifetimeCountryCount }}
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
						</kv-grid>
					</kv-tab-panel>
				</template>
			</kv-tabs>
		</div>
		<div
			class="tw-flex tw-items-center tw-justify-center tw-pt-1 tw-whitespace-nowrap"
		>
			<kv-material-icon
				class="tw-w-2 tw-h-2 tw-flex-shrink-0"
				:icon="mdiClockOutline"
			/>
			<p class="tw-pl-0.5 tw-font-normal tw-text-small tw-flex-shrink-0">
				{{ daysUntilDeadline }} days to make contribution this year
			</p>
		</div>
	</async-portfolio-section>
</template>

<script>
import { gql } from 'graphql-tag';
import numeral from 'numeral';
import getCacheKey from '#src/util/getCacheKey';
import { mdiArrowRight, mdiClockOutline } from '@mdi/js';
// import LoanCountOverTimeFigure from './LoanCountOverTimeFigure';
import {
	KvGrid, KvLoadingPlaceholder, KvMaterialIcon, KvTab, KvTabs, KvTabPanel,
} from '@kiva/kv-components';
import { differenceInCalendarDays } from 'date-fns';
import StarShine from '#src/assets/icons/inline/star_shine.svg';
import AsyncPortfolioSection from './AsyncPortfolioSection';

export default {
	name: 'LendingInsights',
	serverCacheKey: () => getCacheKey('LendingInsights'),
	inject: ['apollo'],
	components: {
		AsyncPortfolioSection,
		KvGrid,
		KvLoadingPlaceholder,
		KvMaterialIcon,
		KvTab,
		KvTabs,
		KvTabPanel,
		StarShine,
		// LoanCountOverTimeFigure,
	},
	props: {
		isPercentileByYearExpEnabled: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			loading: true,
			loadingPromise: null,
			lifetimeLoadingPromise: null,
			donationLightboxVisible: false,
			// loanLightboxVisible: false,
			currentTab: 'ytd',
			currentYearAmountLent: 0,
			currentYearCountryCount: 0,
			currentYearNumberOfLoans: 0,
			formattedCurrentYearPercentile: '',
			currentYearPercentile: null,
			nextPercentileMsg: '',
			threshold: 0, // amount needed to be within percentile group
			lifetimeAmountLent: 0,
			lifetimeCountryCount: 0,
			lifetimeNumberOfLoans: 0,
			lifetimePercentile: 0,
			mdiArrowRight,
			mdiClockOutline,
		};
	},
	computed: {
		daysUntilDeadline() {
			const today = new Date();
			const deadline = new Date(today.getFullYear(), 11, 31); // December 31st of current year
			return differenceInCalendarDays(deadline, today);
		},
		yearToDate() {
			const currentYear = new Date().getFullYear();
			return currentYear;
		},
	},
	methods: {
		setActiveTab(tab) {
			this.currentTab = tab;
			if (tab === 'ytd' || tab === 0) {
				this.$kvTrackEvent(
					'portfolio',
					'show',
					`${this.currentYearPercentile}-percentile`,
				);
			}
		},
		fetchLifetimeStats() {
			if (this.loading && !this.lifetimeLoadingPromise) {
				this.lifetimeLoadingPromise = this.apollo.query({
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
					const amountOfLoans = numeral(data?.my?.userStats?.amount_of_loans ?? 0);

					this.lifetimeAmountLent = amountOfLoans.format('$0,0[.]00');
					this.lifetimeCountryCount = data?.my?.lendingStats?.lentTo?.countries?.totalCount ?? 0;
					this.lifetimeNumberOfLoans = data?.my?.userStats?.number_of_loans ?? 0;
					this.lifetimePercentile = numeral(data?.my?.lendingStats?.amountLentPercentile ?? 0).format('0o');
				}).finally(() => {
					this.lifetimeLoadingPromise = null;
				});
			}
		},
		fetchCurrentYearStats() {
			if (this.loading && !this.loadingPromise) {
				this.loadingPromise = this.apollo.query({
					query: gql`query lendingInsights {
						my {
							id
							lendingStats {
								id
								loanStatsByYear {
									amount
									count
								}
								countriesLentToByYear
							}
						}
					}`
				}).then(({ data }) => {
					const ytdAmount = parseInt(
						numeral(data?.my?.lendingStats?.loanStatsByYear?.amount ?? 0).value(),
						10
					);
					return this.apollo.query({
						query: gql`query percentileData($amount: Int!) {
    						lend {
       							 percentilePerYear(amount: $amount) {
            						nextPercentileThreshold
            						percentile
           		 					percentileNext25
            						threshold
       							 }
   							 }
						}`,
						variables: { amount: ytdAmount }
					}).then(({ data: percentileStatsData }) => {
						return { lendingStatsData: data, percentileStatsData };
					});
				}).then(({ lendingStatsData, percentileStatsData }) => {
					this.loading = false;
					const percentileData = percentileStatsData?.lend?.percentilePerYear || {};
					this.currentYearPercentile = percentileData.percentile ?? 0;
					this.formattedCurrentYearPercentile = numeral(this.currentYearPercentile).format('0o');

					const updatedPercentile = () => {
						const current = percentileData.percentile ?? 0;
						const next25 = percentileData.percentileNext25 ?? 0;
						let nextPercentile = current < 99 ? current + 1 : 99;
						let nextThreshold = '$25';

						if (current === next25 && percentileData.threshold && percentileData.nextPercentileThreshold) {
							nextThreshold = numeral(percentileData.nextPercentileThreshold - percentileData.threshold)
								.format('$0,0[.]00');
						} else if (nextPercentile < next25) {
							nextPercentile = parseInt(next25, 10);
						}

						return nextPercentile === 99
							? ''
							: `${nextThreshold} more to reach ${numeral(nextPercentile).format('0o')} percentile`;
					};

					this.nextPercentileMsg = updatedPercentile();

					// eslint-disable-next-line max-len
					const yearlyAmountOfLoans = numeral(lendingStatsData?.my?.lendingStats?.loanStatsByYear?.amount ?? 0);
					this.currentYearAmountLent = yearlyAmountOfLoans.format('$0,0[.]00');

					this.currentYearCountryCount = lendingStatsData?.my?.lendingStats?.countriesLentToByYear ?? 0;
					this.currentYearNumberOfLoans = lendingStatsData?.my?.lendingStats?.loanStatsByYear?.count ?? 0;

					this.$kvTrackEvent(
						'portfolio',
						'show',
						`${this.currentYearPercentile}-percentile`,
					);
				}).finally(() => {
					this.loadingPromise = null;
				});
			}
		},
		fetchStats() {
			if (this.loading && !this.loadingPromise) {
				this.loadingPromise = Promise.all([
					this.fetchLifetimeStats(),
					this.fetchCurrentYearStats()
				]).finally(() => {
					this.loading = false;
					this.loadingPromise = null;
				});
			}
		},
	},
};
</script>

<style lang="postcss" scoped>
.stats-container {
	background-color: rgb(255 255 255 / 5%);
	@apply tw-grid-cols-12 tw-gap-y-4 tw-p-1.5 tw-rounded tw-text-center;
}

.stats-container-exp {
	@apply tw-grid-cols-12 tw-gap-y-4 tw-p-1.5 tw-rounded tw-text-center tw-bg-eco-green-4 tw-items-center;
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

.tab-header {
	@apply tw-mb-3 md:tw-mb-2 tw-text-eco-green-4 tw-cursor-pointer tw-text-center md:tw-text-left;
}

:deep(.kv-tabs) {
	@apply tw-gap-x-2 md:tw-gap-x-3 lg:tw-gap-x-4;
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

	.stat-def,
	.stat-link {
		font-size: 0.875rem;
	}

	.stat-link span {
		@apply tw-w-3.5 tw-h-2;
	}
}
</style>
