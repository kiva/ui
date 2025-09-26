<template>
	<async-portfolio-section
		v-if="!isPercentileByYearExp"
		@visible="fetchAsyncData"
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
			<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
				<kv-loading-placeholder
					v-if="loading"
					class="stat-placeholder"
					style="width: 4rem;"
				/>
				<dd v-else class="stat-value">
					{{ $filters.numeral(numberOfLoans, '0,0') }}
				</dd>
				<dt class="stat-def">
					Loans made
				</dt>
			</div>
			<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
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
			<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
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
	<!-- To-Do: Remove aspects of v-else version when experiment is over -->
	<async-portfolio-section
		v-else
		@visible="fetchAsyncData"
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
		<div class="tw-flex tw-items-center tw-justify-between">
			<h2 class="tw-text-h3 tw-mb-3 md:tw-mb-2 tw-text-eco-green-4 tw-text-center md:tw-text-left">
				Lending insights
			</h2>
			<div class="tw-flex tw-items-center tw-gap-2">
				<kv-tabs>
					<kv-tab
						class="tab-header" :for-panel="isYTDActive" @click="setActiveTab('ytd')"
						v-kv-track-event="['portfolio', 'click', 'stats-YTD']"
					>
						{{ yearToDate }}
					</kv-tab>
					<kv-tab
						class="tab-header" :for-panel="isLifetimeActive" @click="setActiveTab('lifetime')"
						v-kv-track-event="['portfolio', 'click', 'stats-Lifetime']"
					>
						Lifetime
					</kv-tab>
				</kv-tabs>
			</div>
		</div>
		<!-- Total amount lent -->
		<kv-grid as="dl" class="stats-container-exp">
			<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" style="width: 7rem;" />
				<dt v-show="!loading" class="stat-value">
					{{ currentTab === 'ytd' ? currentYearAmountLent : lifetimeAmountLent }}
				</dt>
				<dd class="stat-def">
					{{ currentTab === 'ytd' ? `Total amount lent in ${yearToDate}` : 'Total amount lent' }}
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
			<!-- Lending percentile -->
			<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3 tw-bg-eco-green-3 tw-rounded">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" style="width: 7rem;" />
				<dt v-show="!loading" class="stat-value">
					{{ currentTab === 'ytd' ? currentYearPercentile : lifetimePercentile }}
				</dt>
				<dd class="stat-def">
					{{ currentTab === 'ytd' ? 'Lending percentile this year' : 'Lending percentile' }}
				</dd>
				<!-- To-Do: Connect amount of money needed to reach next percentile group
				<router-link
					class="stat-link"
					to="/lend-category-beta"
					v-kv-track-event="['lending', 'click', '']"
				>
					{{ currentTab === 'ytd' ? currentYearLendMoreAmount : lifetimeLendMoreAmount }}
					more to reach top
					{{ currentTab === 'ytd' ? currentYearNextPercentileGroup : lifetimeNextPercentileGroup }}
					<kv-material-icon
						class="tw-ml-0.5 tw-w-2 tw-h-2"
						:icon="mdiArrowRight"
					/>
				</router-link>
				-->
			</div>
			<!-- Loans made -->
			<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
				<kv-loading-placeholder
					v-if="loading"
					class="stat-placeholder"
					style="width: 4rem;"
				/>
				<dd v-else class="stat-value">
					{{ currentTab === 'ytd' ? currentYearNumberOfLoans : lifetimeNumberOfLoans }}
				</dd>
				<dt class="stat-def">
					Loans made
				</dt>
			</div>
			<!-- Countries supported -->
			<div class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" style="width: 4rem;" />
				<dt v-show="!loading" class="stat-value">
					{{ currentTab === 'ytd' ? currentYearCountryCount : lifetimeCountryCount }}
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
	KvGrid, KvLoadingPlaceholder, KvMaterialIcon, KvTab, KvTabs,
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
		StarShine,
		// LoanCountOverTimeFigure,
	},
	props: {
		isPercentileByYearExp: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			loading: true,
			loadingPromise: null,
			donationLightboxVisible: false,
			// loanLightboxVisible: false,
			currentTab: 'ytd',
			stats: {
				ytd: {
					percentileThreshold: 0,
					yearlyPercentile: 0,
					nextPercentileThreshold: 0, // amount needed to reach next percentile group
					percentileNext25: 0, // moving to next percentile group
					numberOfLoans: 0, // TO-DO: define
					countryCount: 0, // TO-DO: define
					amountLent: 0, // TO-DO: define
				},
				lifetime: {
					amountLent: 0,
					percentile: 0,
					nextPercentileThreshold: 0, // amount needed to reach next percentile group
					percentileNext25: 0, // moving to next percentile group
					numberOfLoans: 0,
					countryCount: 0,
				},
			},
			mdiArrowRight,
			mdiClockOutline,
		};
	},
	computed: {
		// For days until a specific future date
		daysUntilDeadline() {
			const today = new Date();
			const deadline = new Date(today.getFullYear(), 11, 31); // December 31st of current year
			return differenceInCalendarDays(deadline, today);
		},
		yearToDate() {
			const currentYear = new Date().getFullYear();
			return currentYear;
		},
		isYTDActive() {
			return this.currentTab === 'ytd';
		},
		isLifetimeActive() {
			return this.currentTab === 'lifetime';
		},
		// YTD stats
		currentYearAmountLent() {
			return numeral(this.stats.ytd.amountLent).format('$0,0[.]00');
		},
		currentYearPercentile() {
			return numeral(this.stats.ytd.yearlyPercentile).format('0o');
		},
		currentYearNumberOfLoans() {
			return numeral(this.stats.ytd.numberOfLoans).format('0,0');
		},
		currentYearCountryCount() {
			return numeral(this.stats.ytd.countryCount).format('0,0');
		},
		currentYearLendMoreAmount() {
			return numeral(this.stats.ytd.nextPercentileThreshold).format('$0,0[.]00');
		},
		currentYearNextPercentileGroup() {
			return numeral(this.stats.ytd.percentileNext25).format('0o');
		},
		// Lifetime stats
		lifetimeAmountLent() {
			return numeral(this.stats.lifetime.amountLent).format('$0,0[.]00');
		},
		lifetimePercentile() {
			return numeral(this.stats.lifetime.percentile).format('0o');
		},
		lifetimeNumberOfLoans() {
			return numeral(this.stats.lifetime.numberOfLoans).format('0,0');
		},
		lifetimeCountryCount() {
			return numeral(this.stats.lifetime.countryCount).format('0,0');
		},
		lifetimeLendMoreAmount() {
			return numeral(this.stats.lifetime.nextPercentileThreshold).format('$0,0[.]00');
		},
		lifetimeNextPercentileGroup() {
			return numeral(this.stats.lifetime.percentileNext25).format('0o');
		},
	},
	methods: {
		setActiveTab(tab) {
			this.currentTab = tab;
		},
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
							lend {
            					percentilePerYear {
                				nextPercentileThreshold
               	 				percentile
                				percentileNext25
                				threshold
            				}
						}
					}`
				}).then(({ data }) => {
					this.loading = false;

					// Lifetime stats
					this.countryCount = data?.my?.lendingStats?.lentTo?.countries?.totalCount ?? 0;
					this.percentile = numeral(data?.my?.lendingStats?.amountLentPercentile ?? 0).format('0o');
					this.numberOfLoans = data?.my?.userStats?.number_of_loans ?? 0;

					const amountOfLoans = numeral(data?.my?.userStats?.amount_of_loans ?? 0);
					this.amountLent = amountOfLoans.format('$0,0[.]00');

					// YTD stats
					const percentilePerYear = data?.my?.lend?.percentilePerYear;
					if (percentilePerYear) {
						this.stats.ytd.nextPercentileThreshold = percentilePerYear.nextPercentileThreshold ?? 0;
						this.stats.ytd.yearlyPercentile = percentilePerYear.percentile ?? 0;
						this.stats.ytd.percentileNext25 = percentilePerYear.percentileNext25 ?? 0;
						this.stats.ytd.percentileThreshold = percentilePerYear.threshold ?? 0;
					}
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
	background-color: rgb(255 255 255 / 5%);
	@apply tw-grid-cols-12 tw-gap-y-4 tw-p-1.5 tw-rounded tw-text-center;
}

.stats-container-exp {
	@apply tw-grid-cols-12 tw-gap-y-4 tw-p-1.5 tw-rounded tw-text-center tw-bg-eco-green-4;
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
