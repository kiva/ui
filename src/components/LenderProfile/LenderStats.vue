<template>
	<stats-table
		class="tw-my-4"
		:location-stats="locationStats"
		:gender-stats="genderStats"
		:sector-stats="sectorStats"
		:partner-stats="partnerStats"
		track-category="lender"
		chart="pie"
	/>
</template>

<script>
import StatsTable from '@/components/Stats/StatsTable';

export default {
	name: 'LenderStats',
	inject: ['apollo', 'cookieStore'],
	props: {
		lenderInfo: {
			type: Object,
			default: () => ({}),
			required: true,
		}
	},
	components: {
		StatsTable,
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
	},
	computed: {
		locationStats() {
			return this.statsWithPercent((this.lenderInfo?.statsPerCountry?.values ?? []).map(stat => ({
				label: stat.country.name,
				value: stat.loanCount,
			})));
		},
		genderStats() {
			return this.statsWithPercent((this.lenderInfo?.statsPerGender?.values ?? []).map(stat => ({
				label: `${stat.gender.charAt(0).toUpperCase()}${stat.gender.slice(1)}`,
				value: stat.loanCount,
			})));
		},
		sectorStats() {
			return this.statsWithPercent((this.lenderInfo?.statsPerSector?.values ?? []).map(stat => ({
				label: stat.sector.name,
				value: stat.loanCount,
			})));
		},
		partnerStats() {
			return this.statsWithPercent((this.lenderInfo?.statsPerPartner?.values ?? []).map(stat => ({
				label: stat.partner?.name ?? 'No partner',
				value: stat.loanCount,
			})));
		},
	}
};
</script>
