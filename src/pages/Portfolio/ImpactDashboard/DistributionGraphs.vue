<template>
	<async-portfolio-section data-testid="distribution-graphs">
		<div
			class="tw-flex tw-flex-col tw-justify-between
				lg:tw-flex-row tw-items-start lg:tw-items-center tw-gap-1 tw-mb-2"
		>
			<h2>
				Portfolio distribution
			</h2>
			<kv-switch
				v-model="showOnlyActiveLoans"
			>
				<div class="tw-flex tw-items-center tw-gap-0.5">
					<p>Show only active loans</p>
				</div>
			</kv-switch>
		</div>
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
import { gql } from 'graphql-tag';
import delayUntilVisibleMixin from '#src/plugins/delay-until-visible-mixin';
import getCacheKey from '#src/util/getCacheKey';
import StatsTable from '#src/components/Stats/StatsTable';
import { KvSwitch } from '@kiva/kv-components';
import AsyncPortfolioSection from './AsyncPortfolioSection';

export default {
	name: 'DistributionGraphs',
	serverCacheKey: () => getCacheKey('DistributionGraphs'),
	inject: ['apollo'],
	mixins: [delayUntilVisibleMixin],
	components: {
		AsyncPortfolioSection,
		StatsTable,
		KvSwitch,
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

			showOnlyActiveLoans: false,
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
					query: gql`query myStatsByCountry ($onlyActiveLoans: Boolean) {
						my {
							id
							statsPerCountry (onlyActiveLoans: $onlyActiveLoans) {
								values {
									id
									loanCount
									country {
										id
										name
									}
								}
							}
						}
					}`,
					variables: {
						onlyActiveLoans: this.showOnlyActiveLoans,
					}
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
					query: gql`query myStatsByGender($onlyActiveLoans: Boolean) {
						my {
							id
							statsPerGender(onlyActiveLoans: $onlyActiveLoans) {
								values {
									id
									loanCount
									gender
								}
							}
						}
					}`,
					variables: {
						onlyActiveLoans: this.showOnlyActiveLoans,
					}
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
					query: gql`query myStatsBySector ($onlyActiveLoans: Boolean) {
						my {
							id
							statsPerSector (onlyActiveLoans: $onlyActiveLoans) {
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
					}`,
					variables: {
						onlyActiveLoans: this.showOnlyActiveLoans,
					}
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
					query: gql`query myStatsByPartner ($onlyActiveLoans: Boolean) {
						my {
							id
							statsPerPartner (onlyActiveLoans: $onlyActiveLoans) {
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
					}`,
					variables: {
						onlyActiveLoans: this.showOnlyActiveLoans,
					}
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
	watch: {
		showOnlyActiveLoans() {
			const tableRefs = this.$refs.table.$refs;
			if (tableRefs.locationPanel?.isActive) {
				this.fetchLocationStats();
			}
			if (tableRefs.genderPanel?.isActive) {
				this.fetchGenderStats();
			}
			if (tableRefs.sectorPanel?.isActive) {
				this.fetchSectorStats();
			}
			if (tableRefs.partnerPanel?.isActive) {
				this.fetchPartnerStats();
			}
		},
	},
};
</script>
