<template>
	<async-lender-section @visible="() => isLoading = false">
		<section class="tw-my-8">
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
				<h4 class="tw-mb-2">
					Portfolio distribution
				</h4>
				<stats-table
					class="lender-stats"
					:location-stats="locationStats"
					:gender-stats="genderStats"
					:sector-stats="sectorStats"
					:partner-stats="partnerStats"
					track-category="lender"
					chart="pie"
				/>
			</div>
		</section>
	</async-lender-section>
</template>

<script>
import StatsTable from '@/components/Stats/StatsTable';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';
import AsyncLenderSection from './AsyncLenderSection';

export default {
	name: 'LenderStats',
	inject: ['apollo', 'cookieStore'],
	props: {
		lenderInfo: {
			type: Object,
			default: () => ({}),
			required: true,
		},
	},
	data() {
		return {
			isLoading: true,
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

<style lang="postcss" scoped>
::v-deep .lender-stats > div button {
	@apply tw-text-h5;
}
</style>
