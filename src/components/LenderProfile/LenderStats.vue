<template>
	<async-lender-section @visible="$emit('get-lender-stats')">
		<section v-if="showStats" class="tw-my-8">
			<div v-if="isLoading">
				<kv-loading-placeholder
					class="tw-mb-2"
					style="height: 30px; width: 250px;"
				/>
				<kv-loading-placeholder
					class="tw-w-full tw-aspect-video"
				/>
			</div>
			<div v-else>
				<h2 class="tw-mb-2">
					Portfolio distribution
				</h2>
				<stats-table
					class="lender-stats"
					:location-stats="locationStats"
					:gender-stats="genderStats"
					:sector-stats="sectorStats"
					:partner-stats="partnerStats"
					track-category="lender-profile"
					chart="pie"
					@click="handleChartClick"
				/>
			</div>
		</section>
	</async-lender-section>
</template>

<script>
import StatsTable from '#src/components/Stats/StatsTable';
import KvLoadingPlaceholder from '#kv-components/KvLoadingPlaceholder';
import AsyncLenderSection from './AsyncLenderSection';

export default {
	name: 'LenderStats',
	emits: ['get-lender-stats'],
	props: {
		lenderStats: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			isLoading: true,
			showStats: true,
		};
	},
	components: {
		StatsTable,
		KvLoadingPlaceholder,
		AsyncLenderSection,
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
		handleChartClick(label) {
			this.$kvTrackEvent('lender-profile', 'click', 'lender-distribution-chart', label);
		},
	},
	computed: {
		locationStats() {
			return this.statsWithPercent((this.lenderStats?.statsPerCountry?.values ?? []).map(stat => ({
				label: stat.country.name,
				value: stat.loanCount,
			})));
		},
		genderStats() {
			return this.statsWithPercent((this.lenderStats?.statsPerGender?.values ?? []).map(stat => ({
				label: `${stat.gender.charAt(0).toUpperCase()}${stat.gender.slice(1)}`,
				value: stat.loanCount,
			})));
		},
		sectorStats() {
			return this.statsWithPercent((this.lenderStats?.statsPerSector?.values ?? []).map(stat => ({
				label: stat.sector.name,
				value: stat.loanCount,
			})));
		},
		partnerStats() {
			return this.statsWithPercent((this.lenderStats?.statsPerPartner?.values ?? []).map(stat => ({
				label: stat.partner?.name ?? 'No partner',
				value: stat.loanCount,
			})));
		},
	},
	watch: {
		lenderStats() {
			if (Object.keys(this.lenderStats).length !== 0) {
				this.isLoading = false;
			}
			const entries = Object.entries(this.lenderStats);
			let values = [];
			entries.forEach(element => {
				if (element?.[1]?.values) {
					values = [...element[1].values];
				}
			});
			if (values.length === 0) {
				this.showStats = false;
			}
		},
	},
};
</script>
