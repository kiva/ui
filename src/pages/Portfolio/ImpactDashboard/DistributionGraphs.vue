<template>
	<async-portfolio-section data-testid="distribution-graphs">
		<h2 class="tw-mb-2">
			Portfolio distribution
		</h2>
		<!-- tabs -->
		<stats-table
			ref="table"
			:location-stats="locationStats"
			:location-loading="locationLoading"
			:gender-stats="genderStats"
			:gender-loading="genderLoading"
			:sector-stats="sectorStats"
			:sector-loading="sectorLoading"
			:partner-stats="partnerStats"
			:partner-loading="partnerLoading"
		/>
	</async-portfolio-section>
</template>

<script>
import { gql } from '@apollo/client';
import delayUntilVisibleMixin from '@/plugins/delay-until-visible-mixin';
import getCacheKey from '@/util/getCacheKey';
import StatsTable from '@/components/Stats/StatsTable';
import AsyncPortfolioSection from './AsyncPortfolioSection';

export default {
	name: 'DistributionGraphs',
	serverCacheKey: () => getCacheKey('DistributionGraphs'),
	inject: ['apollo'],
	mixins: [delayUntilVisibleMixin],
	components: {
		AsyncPortfolioSection,
		StatsTable,
	},
	props: {
		chart: {
			type: String,
			default: 'treemap',
			validator: value => ['pie', 'treemap'].includes(value),
		}
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
			const tableRefs = this.$refs.table.$refs;
			const targets = Object.values(tableRefs).map(ref => ref.$el);
			this.delayUntilVisible(entry => {
				switch (entry.target) {
					case tableRefs.locationPanel.$el:
						return this.fetchLocationStats();
					case tableRefs.genderPanel.$el:
						return this.fetchGenderStats();
					case tableRefs.sectorPanel.$el:
						return this.fetchSectorStats();
					case tableRefs.partnerPanel.$el:
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
