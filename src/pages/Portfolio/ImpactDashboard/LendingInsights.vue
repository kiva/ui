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
			</div>
			<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
				<kv-loading-placeholder
					v-if="loading"
					class="stat-placeholder" style="width: 4rem;"
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
	<async-portfolio-section
		v-else
		@visible="fetchStats"
		data-testid="lending-insights"
		class="!tw-bg-secondary !tw-py-0 md:!tw-px-0"
	>
		<kv-tabs @tab-changed="setActiveTab">
			<template #tabNav>
				<div class="percentiles-header">
					<h3 class="tw-text-eco-green-4 tw-text-left tw-self-end lg:tw-self-auto tw-pb-0.5 lg:tw-pb-0">
						Your lending insights
					</h3>
					<div class="percentiles-controls">
						<div
							class="percentiles-banner"
						>
							<p
								class="tw-text-h5 tw-pl-0.5 tw-flex-shrink-0 tw-flex tw-items-center tw-m-0
										tw-leading-normal"
							>
								<span class="lg:tw-hidden">New!</span>
								<span class="tw-hidden lg:tw-inline">New! Filter by year</span>
							</p>
						</div>
						<div class="percentiles-tabs-row">
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
						</div>
					</div>
				</div>
			</template>
			<template #tabPanels>
				<div
					v-if="activeTab === TAB_YTD"
					id="kv-tab-panel-ytd"
					class="tw--mt-1"
					role="tabpanel"
					aria-labelledby="kv-tab-ytd"
					tabindex="0"
				>
					<!-- Current year Panel -->
					<kv-loading-placeholder
						v-if="loading"
						class="tw-mt-1 tw-mx-auto tw-mb-0.5 ytd-loader !tw-rounded"
					/>
					<kv-grid
						v-else
						as="dl" class="stats-overall-container"
					>
						<!-- Lending percentile -->
						<div
							class="tw-col-span-12 stats-percentile-container percentiles-card"
						>
							<dd class="percentiles-stat-def">
								Lending percentile this year
							</dd>
							<dt class="percentiles-stat-value">
								{{ formattedCurrentYearPercentile }}
							</dt>
							<router-link
								v-if="nextPercentileMsg && currentYearPercentile < MAX_PERCENTILE"
								class="percentiles-stat-link tw-mt-auto"
								to="/lend-category-beta"
								v-kv-track-event="[
									'portfolio',
									'click',
									`${currentYearPercentile}-percentile`
								]"
							>
								{{ nextPercentileMsg }}
								<kv-material-icon
									class="tw-ml-0.5 tw-w-2 tw-h-2 lg:tw-hidden"
									:icon="mdiArrowRight"
								/>
							</router-link>
							<span
								v-else-if="currentYearPercentile === MAX_PERCENTILE"
								class="percentiles-stat-link tw-mt-auto"
							>
								Thank you!
							</span>
						</div>
						<!-- Total amount lent -->
						<div
							class="tw-col-span-6 tw-col-start-7 tw-row-start-2 tw-row-span-2
									tw-order-3 lg:tw-col-span-6 lg:tw-col-start-auto
									lg:tw-row-start-auto lg:tw-order-none percentiles-card"
						>
							<dd class="percentiles-stat-def">
								Total amount lent
							</dd>
							<dt class="percentiles-stat-value">
								{{ currentYearAmountLent }}
							</dt>
							<router-link
								class="percentiles-stat-link tw-mt-auto"
								to="/portfolio/loans"
								v-kv-track-event="['portfolio', 'click', 'total-amount-lent-details']"
							>
								My loans
							</router-link>
						</div>
						<!-- Loans made -->
						<div
							class="tw-col-span-6 tw-col-start-1 tw-order-1 lg:tw-col-span-3
									lg:tw-col-start-auto lg:tw-order-none
									!tw-min-h-13 percentiles-card"
						>
							<dt class="percentiles-stat-def">
								Loans made
							</dt>
							<dd class="percentiles-stat-value">
								{{ currentYearNumberOfLoans }}
							</dd>
						</div>
						<!-- Countries supported -->
						<div
							class="tw-col-span-6 tw-col-start-1 tw-order-2 lg:tw-col-span-3
									lg:tw-col-start-auto lg:tw-order-none percentiles-card"
						>
							<dd class="percentiles-stat-def">
								Countries supported
							</dd>
							<dt class="percentiles-stat-value">
								{{ currentYearCountryCount }}
							</dt>
							<router-link
								class="percentiles-stat-link tw-mt-auto"
								to="/portfolio/lending-stats"
								v-kv-track-event="['portfolio', 'click', 'countries-supported-details']"
							>
								Lending stats
							</router-link>
						</div>
					</kv-grid>
				</div>
				<div
					v-else
					id="kv-tab-panel-lifetime"
					class="tw--mt-1"
					role="tabpanel"
					aria-labelledby="kv-tab-lifetime"
					tabindex="0"
				>
					<!-- Lifetime Panel -->
					<kv-grid as="dl" class="stats-overall-container">
						<!-- Lending percentile -->
						<div
							class="tw-col-span-12 stats-percentile-container percentiles-card"
						>
							<kv-loading-placeholder
								v-if="loading"
								class="percentiles-stat-placeholder" style="width: 7rem;"
							/>
							<dd v-show="!loading" class="percentiles-stat-def">
								Lending percentile
							</dd>
							<dt class="percentiles-stat-value">
								{{ lifetimePercentile }}
							</dt>
						</div>
						<!-- Total amount lent -->
						<div
							class="tw-col-span-6 tw-col-start-7 tw-row-start-2 tw-row-span-2
									tw-order-3 lg:tw-col-span-6 lg:tw-col-start-auto
									lg:tw-row-start-auto lg:tw-order-none percentiles-card"
						>
							<kv-loading-placeholder
								v-if="loading"
								class="percentiles-stat-placeholder" style="width: 7rem;"
							/>
							<dd class="percentiles-stat-def">
								Total amount lent
							</dd>
							<dt v-show="!loading" class="percentiles-stat-value">
								{{ lifetimeAmountLent }}
							</dt>
							<router-link
								class="percentiles-stat-link tw-mt-auto"
								to="/portfolio/loans"
								v-kv-track-event="['portfolio', 'click', 'total-amount-lent-details']"
							>
								My loans
							</router-link>
						</div>
						<!-- Loans made -->
						<div
							class="tw-col-span-6 tw-col-start-1 tw-order-1 lg:tw-col-span-3
									lg:tw-col-start-auto lg:tw-order-none
									!tw-min-h-13 percentiles-card"
						>
							<kv-loading-placeholder
								v-if="loading"
								class="percentiles-stat-placeholder" style="width: 4rem;"
							/>
							<dt
								v-else
								class="percentiles-stat-def"
							>
								Loans made
							</dt>
							<dd class="percentiles-stat-value">
								{{ lifetimeNumberOfLoans }}
							</dd>
						</div>
						<!-- Countries supported -->
						<div
							class="tw-col-span-6 tw-col-start-1 tw-order-2 lg:tw-col-span-3
									lg:tw-col-start-auto lg:tw-order-none percentiles-card"
						>
							<kv-loading-placeholder
								v-if="loading"
								class="percentiles-stat-placeholder" style="width: 4rem;"
							/>
							<dd v-show="!loading" class="percentiles-stat-def">
								Countries supported
							</dd>
							<dt class="percentiles-stat-value">
								{{ lifetimeCountryCount }}
							</dt>
							<router-link
								class="percentiles-stat-link tw-mt-auto"
								to="/portfolio/lending-stats"
								v-kv-track-event="['portfolio', 'click', 'countries-supported-details']"
							>
								Lending stats
							</router-link>
						</div>
					</kv-grid>
				</div>
			</template>
		</kv-tabs>
		<div class="tw-flex tw-items-center tw-justify-center tw-whitespace-nowrap tw-gap-0.5 tw-pt-1">
			<kv-material-icon
				class="tw-w-2 tw-h-2 tw-flex-shrink-0"
				:icon="mdiClockOutline"
			/>
			<p class="tw-pl-0.5 tw-text-small tw-flex-shrink-0">
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
	KvGrid, KvLoadingPlaceholder, KvMaterialIcon, KvTab, KvTabs,
} from '@kiva/kv-components';
import { differenceInCalendarDays } from 'date-fns';
import AsyncPortfolioSection from './AsyncPortfolioSection';

const LENDING_INSIGHTS_LIFETIME_QUERY = gql`query lendingInsights {
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
}`;

const TAB_YTD = 'ytd';
const TAB_LIFETIME = 'lifetime';
const MAX_PERCENTILE = 99;
const SUPER_LENDER_THRESHOLD = 10000;
const DEFAULT_NEXT_THRESHOLD = '$25';

const toNumber = value => {
	const parsedValue = numeral(value ?? 0).value();
	return Number.isFinite(parsedValue) ? parsedValue : 0;
};

export default {
	name: 'LendingInsights',
	components: {
		AsyncPortfolioSection,
		KvGrid,
		KvLoadingPlaceholder,
		KvMaterialIcon,
		KvTab,
		KvTabs,
	},
	inject: ['apollo', 'cookieStore'],
	serverCacheKey: () => getCacheKey('LendingInsights'),
	data() {
		return {
			TAB_YTD,
			MAX_PERCENTILE,
			mdiArrowRight,
			mdiClockOutline,
			loading: true,
			currentYearLoadingPromise: null,
			lifetimeLoadingPromise: null,
			hasCurrentYearStats: false,
			hasLifetimeStats: false,
			activeTab: TAB_YTD,
			currentYearAmountLent: 0,
			currentYearCountryCount: 0,
			currentYearNumberOfLoans: 0,
			formattedCurrentYearPercentile: '',
			currentYearPercentile: null,
			nextPercentileMsg: '',
			lifetimeAmountLent: 0,
			lifetimeAmountLentValue: null,
			lifetimeCountryCount: 0,
			lifetimeNumberOfLoans: 0,
			lifetimePercentile: 0,
		};
	},
	computed: {
		daysUntilDeadline() {
			const today = new Date();
			const deadline = new Date(today.getFullYear(), 11, 31);
			return differenceInCalendarDays(deadline, today);
		},
		yearToDate() {
			return new Date().getFullYear();
		},
		lifetimeAmountLentOver10K() {
			return (this.lifetimeAmountLentValue ?? 0) >= SUPER_LENDER_THRESHOLD;
		},
	},
	apollo: {
		preFetch(_config, client) {
			return client.query({ query: LENDING_INSIGHTS_LIFETIME_QUERY });
		},
	},
	created() {
		this.hydrateLifetimeStatsFromCache();
	},
	methods: {
		syncLoadingState() {
			this.loading = this.lifetimeAmountLentOver10K
				? !(this.hasLifetimeStats && this.hasCurrentYearStats)
				: !this.hasLifetimeStats;
		},
		applyLifetimeStats(data) {
			const amount = toNumber(data?.my?.userStats?.amount_of_loans);
			const amountOfLoans = numeral(amount);

			this.lifetimeAmountLentValue = amount;
			this.lifetimeAmountLent = amountOfLoans.format('$0,0[.]00');
			this.lifetimeCountryCount = toNumber(data?.my?.lendingStats?.lentTo?.countries?.totalCount);
			this.lifetimeNumberOfLoans = toNumber(data?.my?.userStats?.number_of_loans);
			this.lifetimePercentile = numeral(toNumber(data?.my?.lendingStats?.amountLentPercentile)).format('0o');
			this.hasLifetimeStats = true;
			this.syncLoadingState();
		},
		hydrateLifetimeStatsFromCache() {
			try {
				const data = this.apollo.readQuery({ query: LENDING_INSIGHTS_LIFETIME_QUERY });
				if (data?.my) {
					this.applyLifetimeStats(data);
				}
			} catch {
				// Cache miss is expected outside SSR-prefetched renders.
			}
		},
		setActiveTab(tab) {
			this.activeTab = tab === TAB_LIFETIME || tab === 1 ? TAB_LIFETIME : TAB_YTD;
			if (this.activeTab === TAB_YTD) {
				this.$kvTrackEvent(
					'portfolio',
					'show',
					`${this.currentYearPercentile}-percentile`,
				);
			}
		},
		fetchLifetimeStats() {
			if (!this.lifetimeLoadingPromise && !this.hasLifetimeStats) {
				this.syncLoadingState();
				this.lifetimeLoadingPromise = this.apollo.query({
					query: LENDING_INSIGHTS_LIFETIME_QUERY,
				}).then(({ data }) => {
					this.applyLifetimeStats(data);
				}).finally(() => {
					this.lifetimeLoadingPromise = null;
					this.syncLoadingState();
				});
			}
			return this.lifetimeLoadingPromise ?? Promise.resolve();
		},
		fetchCurrentYearStats() {
			if (!this.currentYearLoadingPromise && !this.hasCurrentYearStats) {
				this.syncLoadingState();
				this.currentYearLoadingPromise = this.apollo.query({
					query: gql`query lendingInsightsCurrentYear {
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
					) || 0;
					if (ytdAmount <= 0) {
						return {
							lendingStatsData: data,
							percentileStatsData: {
								lend: {
									percentilePerYear: {
										percentile: 0,
									},
								},
							},
						};
					}
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
					this.currentYearPercentile = toNumber(percentileData.percentile);
					this.formattedCurrentYearPercentile = this.currentYearPercentile > 0
						? numeral(this.currentYearPercentile).format('0o')
						: '0%';

					const updatedPercentile = () => {
						const current = toNumber(percentileData.percentile);
						if (current <= 0) {
							return '';
						}
						const next25 = toNumber(percentileData.percentileNext25);
						let nextPercentile = current < MAX_PERCENTILE ? current + 1 : MAX_PERCENTILE;
						let nextThreshold = DEFAULT_NEXT_THRESHOLD;

						if (current === next25 && percentileData.threshold && percentileData.nextPercentileThreshold) {
							nextThreshold = numeral(
								toNumber(percentileData.nextPercentileThreshold) - toNumber(percentileData.threshold)
							)
								.format('$0,0[.]00');
						} else if (nextPercentile < next25) {
							nextPercentile = next25;
						}

						const percentage = 100 - nextPercentile;
						return nextPercentile === MAX_PERCENTILE
							? ''
							: `${nextThreshold} more to reach top ${percentage}%`;
					};

					this.nextPercentileMsg = updatedPercentile();

					const yearlyAmount = toNumber(lendingStatsData?.my?.lendingStats?.loanStatsByYear?.amount);
					const yearlyAmountOfLoans = numeral(yearlyAmount);
					this.currentYearAmountLent = yearlyAmountOfLoans.format('$0,0[.]00');

					this.currentYearCountryCount = toNumber(
						lendingStatsData?.my?.lendingStats?.countriesLentToByYear
					);
					this.currentYearNumberOfLoans = toNumber(
						lendingStatsData?.my?.lendingStats?.loanStatsByYear?.count
					);
					this.hasCurrentYearStats = true;
					this.syncLoadingState();

					this.$kvTrackEvent(
						'portfolio',
						'show',
						`${this.currentYearPercentile}-percentile`,
					);
				}).finally(() => {
					this.currentYearLoadingPromise = null;
					this.syncLoadingState();
				});
			}
			return this.currentYearLoadingPromise ?? Promise.resolve();
		},
		fetchStats() {
			this.syncLoadingState();
			return Promise.all([
				this.fetchCurrentYearStats(),
				this.fetchLifetimeStats(),
			]);
		},
	},
};
</script>

<style lang="postcss" scoped>
.stats-container {
	background-color: rgb(255 255 255 / 5%);
	@apply tw-grid-cols-12 tw-gap-y-4 tw-p-1.5 tw-rounded tw-text-center;
}

.stat-placeholder {
	@apply tw-mt-1 tw-h-4.5 tw-mx-auto tw-mb-0.5;
}

.stat-value {
	@apply tw-text-h2 tw-text-eco-green-2 tw-pb-0.5;
}

.stat-def {
	@apply tw-mb-0.5 tw-text-white;
}

@screen md {
	.stat-def, .stat-link {
		@apply tw-text-small;
	}
}

.stat-link {
	@apply tw-inline-flex tw-justify-center tw-items-center tw-text-eco-green-2 tw-font-medium;
}

.percentiles-header {
	@apply tw-flex tw-items-center tw-justify-between tw-w-full tw-gap-x-1.5 tw-gap-y-1;
}

.percentiles-controls {
	@apply tw-flex tw-flex-col tw-items-start tw-gap-y-0.5 tw-flex-shrink-0 tw-py-0.5;
}

.percentiles-banner {
	@apply tw-inline-flex tw-px-0.5 tw-py-0.5 lg:tw-px-1 tw-items-center tw-rounded-sm
		tw-bg-caution tw-border tw-border-caution tw-order-1;
}

.percentiles-tabs-row {
	@apply tw-flex tw-gap-x-2 tw-items-center tw-min-h-3 tw-order-2;
}

.stats-overall-container {
	@apply tw-grid tw-grid-cols-12 tw-grid-rows-3 tw-items-stretch tw-gap-1;
}

@screen lg {
	.stats-overall-container {
		@apply tw-flex tw-gap-1;
	}

	.stats-overall-container > div {
		@apply tw-min-w-0 tw-h-auto tw-flex-1;
	}

	.stats-percentile-container {
		@apply tw-bg-auto;

		background-position: right 0 bottom 0;
	}

	.stats-overall-container > .stats-percentile-container {
		flex-grow: 1.35;
	}
}

.percentiles-card {
	@apply tw-bg-white tw-rounded tw-py-1 tw-px-2 lg:tw-py-0.5 lg:tw-px-1.5 tw-h-full tw-flex tw-flex-col;
}

.stats-percentile-container {
	@apply tw-bg-no-repeat tw-bg-bottom;

	background-image: url('/src/assets/images/my-kiva/peak-bg.png');
	background-size: 100% 76px;
}

:deep([role=tablist]) {
	@apply tw-overflow-hidden;
}

.percentiles-stat-placeholder {
	@apply tw-mt-1 tw-h-4.5 tw-mx-auto tw-mb-0.5;
}

.percentiles-stat-value {
	@apply tw-text-h2 tw-text-eco-green-4 tw-pb-0.5;

	line-height: 1.1;
}

.percentiles-stat-def {
	@apply tw-text-small tw-text-secondary tw-font-normal;

	line-height: 1.3;
}

.percentiles-stat-link {
	@apply tw-block tw-text-small tw-text-right tw-text-action tw-font-medium tw-no-underline;

	line-height: 1.25;
}

.stats-percentile-container .percentiles-stat-link {
	@apply tw-text-base lg:tw-text-small tw-text-left lg:tw-text-right
		tw-flex tw-items-center lg:tw-block;

	/* Raw CSS needed to override tw-font-medium from @apply, which loses specificity to other utilities */
	font-weight: 500;
}

.tab-header {
	@apply tw-text-eco-green-4 tw-cursor-pointer tw-text-left tw-text-base tw-mb-0;

	font-weight: 621;
}

.ytd-loader {
	height: 31.5rem;
}

@screen md {
	.stat-placeholder,
	.percentiles-stat-placeholder {
		height: 44px;
		margin-bottom: 10.5px;
	}

	.ytd-loader {
		height: 20.4rem;
	}
}

@screen lg {
	.percentiles-header {
		@apply tw-flex-col tw-items-start tw-justify-start tw-gap-y-1;
	}

	.percentiles-controls {
		@apply tw-flex-row tw-items-center tw-gap-x-2 tw-gap-y-0;
	}

	.percentiles-banner {
		@apply tw-order-2;
	}

	.percentiles-tabs-row {
		@apply tw-order-1;
	}

	.stat-placeholder,
	.percentiles-stat-placeholder {
		margin-bottom: 11.5px;
		@apply tw-h-4;
	}

	.ytd-loader {
		height: 9.5rem;
	}
}
</style>
