<template>
	<async-portfolio-section
		v-if="!lifetimeAmountLentOver10K"
		@visible="fetchLifetimeStats"
		data-testid="lending-insights"
		class="!tw-bg-eco-green-4"
	>
		<h2 class="tw-text-h3 tw-mb-3 md:tw-mb-2 tw-text-white tw-text-center md:tw-text-left">
			Your lending insights
		</h2>
		<kv-grid as="dl" class="default-stats-container">
			<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
				<kv-loading-placeholder v-if="loading" class="default-stat-placeholder" style="width: 7rem;" />
				<dt v-show="!loading" class="default-stat-value">
					{{ lifetimeAmountLent }}
				</dt>
				<dd class="default-stat-def">
					Total amount lent
				</dd>
				<router-link
					class="default-stat-link"
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
			<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
				<kv-loading-placeholder
					v-if="loading"
					class="default-stat-placeholder"
					style="width: 4rem;"
				/>
				<dd v-else class="default-stat-value">
					{{ $filters.numeral(lifetimeNumberOfLoans, '0,0') }}
				</dd>
				<dt class="default-stat-def">
					Loans made
				</dt>
			</div>
			<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
				<kv-loading-placeholder v-if="loading" class="default-stat-placeholder" style="width: 4rem;" />
				<dt v-show="!loading" class="default-stat-value">
					{{ lifetimeCountryCount }}
				</dt>
				<dd class="default-stat-def">
					Countries supported
				</dd>
				<router-link
					class="default-stat-link"
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
				<kv-loading-placeholder v-if="loading" class="default-stat-placeholder" style="width: 7rem;" />
				<dt v-show="!loading" class="default-stat-value">
					{{ lifetimePercentile }}
				</dt>
				<dd class="default-stat-def">
					Lending percentile
				</dd>
			</div>
		</kv-grid>
	</async-portfolio-section>
	<async-portfolio-section
		v-else
		@visible="fetchStats"
		data-testid="lending-insights"
		class="!tw-bg-secondary !tw-py-5 !tw-mb-3"
	>
		<div
			v-if="showNewBanner"
			class="tw-flex tw-items-center tw-justify-end tw-gap-3 tw-mb-1 md:tw-mb-2 lg:tw-hidden"
		>
			<div
				class="tw-inline-flex tw-px-1 tw-py-0.5 tw-items-center
					tw-rounded-sm tw-bg-caution tw-border tw-border-caution"
			>
				<p
					class="tw-text-h5 tw-pl-0.5 tw-flex-shrink-0 tw-flex tw-items-center tw-m-0"
					style="line-height: normal;"
				>
					{{ bannerDescription }}
				</p>
			</div>
		</div>
		<div>
			<kv-tabs @tab-changed="setActiveTab">
				<template #tabNav>
					<div class="tw-flex tw-items-center tw-justify-between tw-w-full lg:tw-flex-col lg:tw-items-start">
						<h2 class="tw-text-h3 tw-mb-1 md:tw-mb-2 tw-text-eco-green-4 tw-text-center md:tw-text-left">
							Your lending insights
						</h2>
						<div class="tw-flex tw-gap-x-2 tw-items-center">
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
							<div
								v-if="showNewBanner"
								class="tw-hidden lg:tw-inline-flex tw-px-1 tw-py-0.5 tw-items-center tw--mt-1
									tw-rounded-sm tw-bg-caution tw-border tw-border-caution"
							>
								<p
									class="tw-text-h5 tw-pl-0.5 tw-flex-shrink-0 tw-flex tw-items-center tw-m-0"
									style="line-height: normal;"
								>
									{{ bannerDescription }}
								</p>
							</div>
						</div>
					</div>
				</template>
				<template #tabPanels>
					<kv-tab-panel id="ytd" class="tw--mt-2">
						<!-- Current year Panel -->
						<kv-loading-placeholder
							v-if="loading"
							class="tw-mt-1 tw-h-4.5 tw-mx-auto tw-mb-0.5 ytd-loader !tw-rounded"
						/>
						<kv-grid
							v-else
							as="dl" class="stats-overall-container md:!tw-pr-4"
						>
							<!-- Lending percentile -->
							<div
								class="tw-col-span-12 lg:tw-flex-shrink-0
									tw-bg-primary stats-percentile-container tw-rounded
									lg:!tw-py-1.5 lg:!tw-px-1.5 tw-px-2 tw-py-1 tw-shadow-lg"
								style="min-width: 190px"
							>
								<dd class="stat-def">
									Lending percentile this year
								</dd>
								<dt class="stat-value">
									{{ formattedCurrentYearPercentile }}
								</dt>
								<router-link
									v-if="nextPercentileMsg && currentYearPercentile < 99"
									class="stat-link"
									to="/lend-category-beta"
									v-kv-track-event="['portfolio', 'click', `${currentYearPercentile}-percentile`]"
								>
									{{ nextPercentileMsg }}
								</router-link>
								<span
									v-else-if="currentYearPercentile === 99"
									class="stat-link tw-text-eco-green-2 tw-font-medium
										tw-inline-flex tw-items-center tw-mt-auto"
								>
									Thank you!
								</span>
							</div>
							<!-- Total amount lent -->
							<div
								class="tw-col-span-6 tw-col-start-7 tw-row-start-2 tw-row-span-2 tw-order-3 tw-h-full
									tw-flex tw-flex-col lg:tw-col-span-6 lg:tw-col-start-auto lg:tw-row-start-auto
									lg:tw-order-none lg:tw-flex-shrink-0 tw-bg-primary tw-rounded tw-px-2 tw-py-1.5
									tw-shadow-lg stats-container"
								style="min-width: 155px"
							>
								<dd class="stat-def">
									Total amount lent
								</dd>
								<dt class="stat-value">
									{{ currentYearAmountLent }}
								</dt>
								<router-link
									class="stat-link tw-mt-auto"
									to="/portfolio/loans"
									v-kv-track-event="['portfolio', 'click', 'total-amount-lent-details']"
								>
									My loans
								</router-link>
							</div>
							<!-- Loans made -->
							<div
								class="tw-col-span-6 tw-col-start-1 tw-order-1 lg:tw-col-span-3 lg:tw-col-start-auto
								lg:tw-order-none lg:tw-flex-shrink-0 tw-bg-primary tw-rounded tw-px-2 tw-py-1.5
								!tw-min-h-13 tw-shadow-lg stats-container"
								style="min-width: 148px;"
							>
								<dt class="stat-def">
									Loans made
								</dt>
								<dd class="stat-value">
									{{ currentYearNumberOfLoans }}
								</dd>
							</div>
							<!-- Countries supported -->
							<div
								class="tw-col-span-6 tw-col-start-1 tw-order-2 lg:tw-col-span-3
									lg:tw-col-start-auto lg:tw-order-none lg:tw-flex-shrink-0
									tw-bg-primary tw-rounded tw-px-2 tw-py-1.5 tw-shadow-lg stats-container"
								style="min-width: 148px"
							>
								<dd class="stat-def">
									Countries supported
								</dd>
								<dt class="stat-value">
									{{ currentYearCountryCount }}
								</dt>
								<router-link
									class="stat-link tw-mt-auto"
									to="/portfolio/lending-stats"
									v-kv-track-event="['portfolio', 'click', 'countries-supported-details']"
								>
									Lending stats
								</router-link>
							</div>
						</kv-grid>
					</kv-tab-panel>
					<kv-tab-panel id="lifetime" class="tw--mt-2">
						<!-- Lifetime Panel -->
						<kv-grid as="dl" class="stats-overall-container">
							<!-- Lending percentile -->
							<div
								class="tw-col-span-12 lg:tw-flex-shrink-0 tw-h-full
									tw-bg-primary stats-percentile-container tw-rounded
									lg:!tw-py-1.5 lg:!tw-px-1 tw-px-2 tw-py-1 tw-shadow-lg"
								style="min-width: 190px"
							>
								<kv-loading-placeholder
									v-if="loading"
									class="stat-placeholder"
									style="width: 7rem;"
								/>
								<dd v-show="!loading" class="stat-def">
									Lending percentile
								</dd>
								<dt class="stat-value">
									{{ lifetimePercentile }}
								</dt>
							</div>
							<div
								class="tw-col-span-6 tw-col-start-7 tw-row-start-2 tw-row-span-2 tw-order-3
									tw-h-full tw-flex tw-flex-col lg:tw-col-span-3 lg:tw-col-start-auto
									lg:tw-row-start-auto lg:tw-order-none lg:tw-flex-shrink-0 tw-bg-primary
									tw-rounded tw-px-2 tw-py-1 tw-shadow-lg stats-container"
								style="min-width: 155px"
							>
								<kv-loading-placeholder
									v-if="loading"
									class="stat-placeholder"
									style="width: 7rem;"
								/>
								<dd class="stat-def">
									Total amount lent
								</dd>
								<dt v-show="!loading" class="stat-value">
									{{ lifetimeAmountLent }}
								</dt>
								<router-link
									class="stat-link tw-mt-auto"
									to="/portfolio/loans"
									v-kv-track-event="['portfolio', 'click', 'total-amount-lent-details']"
								>
									My loans
								</router-link>
							</div>
							<!-- Loans made -->
							<div
								class="tw-col-span-6 tw-col-start-1 tw-order-1 lg:tw-col-span-3
									lg:tw-col-start-auto lg:tw-order-none lg:tw-flex-shrink-0
									stats-container tw-bg-primary tw-rounded tw-px-2 tw-py-1.5 tw-shadow-lg"
								style="min-width: 148px"
							>
								<kv-loading-placeholder
									v-if="loading"
									class="stat-placeholder"
									style="width: 4rem;"
								/>
								<dt v-else class="stat-def">
									Loans made
								</dt>
								<dd class="stat-value">
									{{ lifetimeNumberOfLoans }}
								</dd>
							</div>
							<!-- Countries supported -->
							<div
								class="tw-col-span-6 tw-col-start-1 tw-order-2 lg:tw-col-span-3
									lg:tw-col-start-auto lg:tw-order-none lg:tw-flex-shrink-0
									stats-container tw-bg-primary tw-rounded tw-px-2 tw-py-1 tw-shadow-lg"
								style="min-width: 148px"
							>
								<kv-loading-placeholder
									v-if="loading"
									class="stat-placeholder"
									style="width: 4rem;"
								/>
								<dd v-show="!loading" class="stat-def">
									Countries supported
								</dd>
								<dt class="stat-value">
									{{ lifetimeCountryCount }}
								</dt>
								<router-link
									class="stat-link"
									to="/portfolio/lending-stats"
									v-kv-track-event="['portfolio', 'click', 'countries-supported-details']"
								>
									Lending stats
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
			<p class="tw-pl-0.5 md:tw-text-small tw-flex-shrink-0">
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
import {
	KvGrid, KvLoadingPlaceholder, KvMaterialIcon, KvTab, KvTabs, KvTabPanel,
} from '@kiva/kv-components';
import { differenceInCalendarDays } from 'date-fns';
import AsyncPortfolioSection from './AsyncPortfolioSection';

export default {
	name: 'LendingInsights',
	components: {
		AsyncPortfolioSection,
		KvGrid,
		KvLoadingPlaceholder,
		KvMaterialIcon,
		KvTab,
		KvTabs,
		KvTabPanel,
	},
	inject: ['apollo', 'cookieStore'],
	serverCacheKey: () => getCacheKey('LendingInsights'),
	data() {
		return {
			mdiArrowRight,
			mdiClockOutline,
			loading: true,
			loadingPromise: null,
			lifetimeLoadingPromise: null,
			currentYearAmountLent: 0,
			currentYearCountryCount: 0,
			currentYearNumberOfLoans: 0,
			formattedCurrentYearPercentile: '',
			currentYearPercentile: null,
			nextPercentileMsg: '',
			lifetimeAmountLent: 0,
			lifetimeCountryCount: 0,
			lifetimeNumberOfLoans: 0,
			lifetimePercentile: 0,
			showNewBanner: true,
			windowWidth: 1024,
		};
	},
	computed: {
		daysUntilDeadline() {
			const today = new Date();
			const deadline = new Date(today.getFullYear(), 11, 31);
			return differenceInCalendarDays(deadline, today);
		},
		yearToDate() {
			const currentYear = new Date().getFullYear();
			return currentYear;
		},
		mobileTabletLayout() {
			return this.windowWidth < 1024;
		},
		bannerDescription() {
			return this.mobileTabletLayout ? 'New!' : 'New! Filter by this year';
		},
		lifetimeAmountLentOver10K() {
			if (!this.lifetimeAmountLent || this.loading) {
				return null;
			}
			const amountStr = String(this.lifetimeAmountLent);
			const amount = parseFloat(amountStr.replace(/[$,]/g, '')) || 0;
			return amount >= 10000;
		},
	},
	methods: {
		handleResize() {
			this.windowWidth = window.innerWidth;
		},
		checkBannerVisibility() {
			if (typeof window !== 'undefined' && window.localStorage) {
				const visitCount = parseInt(localStorage.getItem('lendingInsightsVisits') || '0', 10);
				const newVisitCount = visitCount + 1;

				localStorage.setItem('lendingInsightsVisits', newVisitCount.toString());

				// Hide banner after third visit/page refresh
				this.showNewBanner = newVisitCount < 3;
			}
		},
		setActiveTab(tab) {
			if (tab === 'ytd' || tab === 0) {
				this.$kvTrackEvent(
					'portfolio',
					'show',
					`${this.currentYearPercentile}-percentile`,
				);
			}
		},
		fetchLifetimeStats() {
			if (!this.lifetimeLoadingPromise) {
				this.loading = true;
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
					const amountOfLoans = numeral(data?.my?.userStats?.amount_of_loans ?? 0);

					this.lifetimeAmountLent = amountOfLoans.format('$0,0[.]00');
					this.lifetimeCountryCount = data?.my?.lendingStats?.lentTo?.countries?.totalCount ?? 0;
					this.lifetimeNumberOfLoans = data?.my?.userStats?.number_of_loans ?? 0;
					this.lifetimePercentile = numeral(data?.my?.lendingStats?.amountLentPercentile ?? 0).format('0o');
				}).finally(() => {
					this.loading = false;
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

						const percentage = 100 - nextPercentile;
						return nextPercentile === 99
							? ''
							: `${nextThreshold} more to reach top ${percentage}%`;
					};

					this.nextPercentileMsg = updatedPercentile();

					const yearlyAmount = lendingStatsData?.my?.lendingStats?.loanStatsByYear?.amount ?? 0;
					const yearlyAmountOfLoans = numeral(yearlyAmount);
					this.currentYearAmountLent = yearlyAmountOfLoans.format('$0,0[.]00');

					this.currentYearCountryCount = lendingStatsData?.my?.lendingStats?.countriesLentToByYear ?? 0;
					this.currentYearNumberOfLoans = lendingStatsData?.my?.lendingStats?.loanStatsByYear?.count ?? 0;

					this.$kvTrackEvent(
						'portfolio',
						'show',
						`${this.currentYearPercentile}-percentile`,
					);
				}).finally(() => {
					this.loading = false;
					this.loadingPromise = null;
				});
			}
		},
		fetchStats() {
			if (this.loading && !this.loadingPromise) {
				this.loadingPromise = Promise.all([
					this.fetchCurrentYearStats(),
					this.fetchLifetimeStats(),
				]).finally(() => {
					this.loadingPromise = null;
				});
			}
		},
	},
	mounted() {
		if (typeof window !== 'undefined') {
			this.windowWidth = window.innerWidth;
			window.addEventListener('resize', this.handleResize);
			this.checkBannerVisibility();
		}
	},
	beforeUnmount() {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', this.handleResize);
		}
	},
};
</script>

<style lang="postcss" scoped>

.stats-overall-container {
	@apply tw-grid tw-grid-cols-12 tw-items-start tw-gap-1;
}

@screen lg {
	.stats-overall-container {
		@apply tw-flex tw-flex-row tw-flex-nowrap;
	}
}

/* Custom breakpoint for 1024-1096px to reduce container sizes and prevent overflow */
@media (width >= 1024px) and (width <= 1096px) {
	.stats-percentile-container {
		min-width: 165px !important;
	}

	.stats-overall-container > div:nth-child(2) {
		min-width: 140px !important;
	}

	.stats-overall-container > div:nth-child(3),
	.stats-overall-container > div:nth-child(4) {
		min-width: 106px !important;
	}
}

.stats-container {
	min-height: 96px;
}

.stats-percentile-container {
	background-image: url('/src/assets/images/my-kiva/peak-bg.png');
	background-repeat: no-repeat;
	background-position: right 0 bottom 2px;
	min-height: 96px;
}

.stat-placeholder {
	@apply tw-mt-1 tw-h-4.5 tw-mx-auto tw-mb-0.5;
}

.stat-value {
	@apply tw-text-h3 tw-text-action-highlight tw-pb-0.5;
}

.stat-def {
	@apply tw-mb-0.5 tw-text-secondary;
}

@screen md {
	.stat-def, .stat-link {
		@apply tw-text-small;
	}
}

.stat-link {
	@apply tw-block tw-text-right tw-text-action tw-font-medium tw-no-underline;
}

@screen md {
	.stat-placeholder {
		height: 44px;
		margin-bottom: 10.5px;
	}

	.ytd-loader {
		height: 20.4rem;
	}
}

@screen lg {
	.stat-placeholder {
		margin-bottom: 11.5px;
		@apply tw-h-4;
	}

	.ytd-loader {
		height: 9.5rem;
	}

	#kv-tab-panel-ytd {
		.stat-link span {
			@apply tw-w-3.5 tw-h-2;
		}
	}
}

.default-stats-container {
    background-color: rgb(255 255 255 / 5%);
    @apply tw-grid-cols-12 tw-gap-y-4 tw-p-1.5 tw-rounded tw-text-center;
}

.default-stats-container-exp {
    @apply tw-grid-cols-12 tw-gap-y-4 tw-p-2.5 tw-rounded tw-text-center tw-bg-eco-green-4 tw-items-center;
}

.default-stat-placeholder {
    @apply tw-mt-1 tw-h-4.5 tw-mx-auto tw-mb-0.5;
}

.default-stat-value {
    @apply tw-text-h2 tw-text-eco-green-2 tw-pb-0.5;
}

.default-stat-def {
    @apply tw-mb-0.5 tw-text-white;
}

@screen md {
    .default-stat-def, .default-stat-link {
        @apply tw-text-small;
    }
}

.default-stat-link {
    @apply tw-inline-flex tw-justify-center tw-items-center tw-text-eco-green-2 tw-font-medium;
}

.tab-header {
    @apply tw-text-eco-green-4 tw-cursor-pointer tw-text-center md:tw-text-left tw-text-base tw-font-medium tw-mb-1;

    font-weight: 621;
}

.ytd-loader {
    height: 31.5rem;
}

@screen md {
    .default-stat-placeholder {
        height: 44px;
        margin-bottom: 10.5px;
    }

    .ytd-loader {
        height: 20.4rem;
    }
}

@screen lg {
    .default-stat-placeholder {
        margin-bottom: 11.5px;
        @apply tw-h-4;
    }

    .ytd-loader {
        height: 9.5rem;
    }

    #kv-tab-panel-ytd {
        .default-stat-def,
        .default-stat-link {
            @apply tw-text-small
        }

        .default-stat-link span {
            @apply tw-w-3.5 tw-h-2;
        }
    }
}

</style>
