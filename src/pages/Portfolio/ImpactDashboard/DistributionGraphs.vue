<template>
	<async-portfolio-section data-testid="distribution-graphs">
		<h2 class="tw-mb-2">
			Portfolio distribution
		</h2>
		<!-- tabs -->
		<kv-tabs>
			<template #tabNav>
				<kv-tab
					for-panel="location-stat-panel"
					data-testid="location-stat-panel-tab"
					v-kv-track-event="['portfolio', 'click', 'distribution-graph-tab-location']"
				>
					Location
				</kv-tab>
				<kv-tab
					for-panel="gender-stat-panel"
					data-testid="gender-stat-panel-tab"
					v-kv-track-event="['portfolio', 'click', 'distribution-graph-tab-gender']"
				>
					Gender
				</kv-tab>
				<kv-tab
					for-panel="sector-stat-panel"
					data-testid="sector-stat-panel-tab"
					v-kv-track-event="['portfolio', 'click', 'distribution-graph-tab-sector']"
				>
					Sector
				</kv-tab>
				<kv-tab
					for-panel="partner-stat-panel"
					data-testid="partner-stat-panel-tab"
					v-kv-track-event="['portfolio', 'click', 'distribution-graph-tab-lending-partner']"
				>
					Lending partner
				</kv-tab>
			</template>
			<template #tabPanels>
				<kv-tab-panel id="location-stat-panel" ref="locationPanel">
					<distribution-graph-figure class="tw-mb-4" :loading="locationLoading" :values="locationStats" />
					<distribution-table :values="locationStats" measure-name="Location" />
					<kv-button
						v-if="!locationLoading"
						to="/portfolio/lending-stats"
						variant="secondary"
						v-kv-track-event="['portfolio', 'click', 'location-distribution-graph-more-details']"
					>
						More details
					</kv-button>
				</kv-tab-panel>
				<kv-tab-panel id="gender-stat-panel" ref="genderPanel">
					<distribution-graph-figure class="tw-mb-4" :loading="genderLoading" :values="genderStats" />
					<distribution-table :values="genderStats" measure-name="Gender" />
				</kv-tab-panel>
				<kv-tab-panel id="sector-stat-panel" ref="sectorPanel">
					<distribution-graph-figure class="tw-mb-4" :loading="sectorLoading" :values="sectorStats" />
					<distribution-table :values="sectorStats" measure-name="Sector" />
				</kv-tab-panel>
				<kv-tab-panel id="partner-stat-panel" ref="partnerPanel">
					<distribution-graph-figure class="tw-mb-4" :loading="partnerLoading" :values="partnerStats" />
					<distribution-table :values="partnerStats" measure-name="Lending partner" />
				</kv-tab-panel>
			</template>
		</kv-tabs>
	</async-portfolio-section>
</template>

<script>
import { gql } from '@apollo/client';
import delayUntilVisibleMixin from '@/plugins/delay-until-visible-mixin';
import getCacheKey from '@/util/getCacheKey';
import AsyncPortfolioSection from './AsyncPortfolioSection';
import DistributionGraphFigure from './DistributionGraphFigure';
import DistributionTable from './DistributionTable';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvTab from '~/@kiva/kv-components/vue/KvTab';
import KvTabs from '~/@kiva/kv-components/vue/KvTabs';
import KvTabPanel from '~/@kiva/kv-components/vue/KvTabPanel';

export default {
	name: 'DistributionGraphs',
	serverCacheKey: () => getCacheKey('DistributionGraphs'),
	inject: ['apollo'],
	mixins: [delayUntilVisibleMixin],
	components: {
		AsyncPortfolioSection,
		DistributionGraphFigure,
		DistributionTable,
		KvButton,
		KvTab,
		KvTabs,
		KvTabPanel,
	},
	data() {
		return {
			locationLoading: true,
			locationLoadingPromise: null,
			locationStats: [],

			genderLoading: true,
			genderLoadingPromise: null,
			genderStats: [],

			sectorLoading: true,
			sectorLoadingPromise: null,
			sectorStats: [],

			partnerLoading: true,
			partnerLoadingPromise: null,
			partnerStats: [],
		};
	},
	mounted() {
		// Fetch data for each panel as it becomes visible.
		this.$nextTick(() => {
			const targets = Object.values(this.$refs).map(ref => ref.$el);
			this.delayUntilVisible(entry => {
				switch (entry.target) {
					case this.$refs.locationPanel.$el:
						return this.fetchLocationStats();
					case this.$refs.genderPanel.$el:
						return this.fetchGenderStats();
					case this.$refs.sectorPanel.$el:
						return this.fetchSectorStats();
					case this.$refs.partnerPanel.$el:
						return this.fetchPartnerStats();
					default:
						break;
				}
			}, targets);
		});
	},
	methods: {
		statsWithPercent(stats) {
			// sum all the stat values to find the total
			const total = stats.reduce((sum, { value }) => sum + value, 0);
			// add percent of total to each stat
			return stats.map(stat => ({
				...stat,
				percent: stat.value / total,
			}));
		},
		fetchLocationStats() {
			if (this.locationLoading && !this.locationLoadingPromise) {
				this.locationLoadingPromise = this.apollo.query({
					query: gql`query myStatsByCountry {
						my {
							id
							statsPerCountry {
								values {
									id
									loanCount
									country {
										name
									}
								}
							}
						}
					}`
				}).then(({ data }) => {
					this.locationLoading = false;
					this.locationStats = this.statsWithPercent(
						(data?.my?.statsPerCountry?.values ?? []).map(stat => ({
							label: stat.country.name,
							value: stat.loanCount,
						}))
					);
				}).finally(() => {
					// This allows the fetch to be retried when this section becomes visible again if it failed
					this.locationLoadingPromise = null;
				});
			}
		},
		fetchGenderStats() {
			if (this.genderLoading && !this.genderLoadingPromise) {
				this.genderLoadingPromise = this.apollo.query({
					query: gql`query myStatsByGender {
						my {
							id
							statsPerGender {
								values {
									id
									loanCount
									gender
								}
							}
						}
					}`
				}).then(({ data }) => {
					this.genderLoading = false;
					this.genderStats = this.statsWithPercent(
						(data?.my?.statsPerGender?.values ?? []).map(stat => ({
							label: `${stat.gender.charAt(0).toUpperCase()}${stat.gender.slice(1)}`,
							value: stat.loanCount,
						}))
					);
				}).finally(() => {
					// This allows the fetch to be retried when this section becomes visible again if it failed
					this.genderLoadingPromise = null;
				});
			}
		},
		fetchSectorStats() {
			if (this.sectorLoading && !this.sectorLoadingPromise) {
				this.sectorLoadingPromise = this.apollo.query({
					query: gql`query myStatsBySector {
						my {
							id
							statsPerSector {
								values {
									id
									loanCount
									sector {
										id
										name
									}
								}
							}
						}
					}`
				}).then(({ data }) => {
					this.sectorLoading = false;
					this.sectorStats = this.statsWithPercent(
						(data?.my?.statsPerSector?.values ?? []).map(stat => ({
							label: stat.sector.name,
							value: stat.loanCount,
						}))
					);
				}).finally(() => {
					// This allows the fetch to be retried when this section becomes visible again if it failed
					this.sectorLoadingPromise = null;
				});
			}
		},
		fetchPartnerStats() {
			if (this.partnerLoading && !this.partnerLoadingPromise) {
				this.partnerLoadingPromise = this.apollo.query({
					query: gql`query myStatsByPartner {
						my {
							id
							statsPerPartner {
								values {
									id
									loanCount
									partner {
										id
										name
									}
								}
							}
						}
					}`
				}).then(({ data }) => {
					this.partnerLoading = false;
					this.partnerStats = this.statsWithPercent(
						(data?.my?.statsPerPartner?.values ?? []).map(stat => ({
							label: stat.partner?.name ?? 'No partner',
							value: stat.loanCount,
						}))
					);
				}).finally(() => {
					// This allows the fetch to be retried when this section becomes visible again if it failed
					this.partnerLoadingPromise = null;
				});
			}
		},
	},
};
</script>
