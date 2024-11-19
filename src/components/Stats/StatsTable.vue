<template>
	<kv-tabs>
		<template #tabNav>
			<kv-tab
				for-panel="location-stat-panel"
				data-testid="location-stat-panel-tab"
				v-kv-track-event="[trackCategory, 'click', 'distribution-graph-tab-location']"
			>
				Location
			</kv-tab>
			<kv-tab
				for-panel="gender-stat-panel"
				data-testid="gender-stat-panel-tab"
				v-kv-track-event="[trackCategory, 'click', 'distribution-graph-tab-gender']"
			>
				Gender
			</kv-tab>
			<kv-tab
				for-panel="sector-stat-panel"
				data-testid="sector-stat-panel-tab"
				v-kv-track-event="[trackCategory, 'click', 'distribution-graph-tab-sector']"
			>
				Sector
			</kv-tab>
			<kv-tab
				for-panel="partner-stat-panel"
				data-testid="partner-stat-panel-tab"
				v-kv-track-event="[trackCategory, 'click', 'distribution-graph-tab-lending-partner']"
			>
				Lending partner
			</kv-tab>
		</template>
		<template #tabPanels>
			<kv-tab-panel id="location-stat-panel" ref="locationPanel">
				<component
					:is="chartType"
					class="tw-mb-4"
					:loading="locationLoading"
					:values="locationStats"
					@click="handleChartClick"
				/>
				<distribution-table :values="locationStats" measure-name="Location" />
				<kv-button
					v-if="!locationLoading && inPortfolio"
					to="/portfolio/lending-stats"
					variant="secondary"
					v-kv-track-event="['portfolio', 'click', 'location-distribution-graph-more-details']"
				>
					More details
				</kv-button>
			</kv-tab-panel>
			<kv-tab-panel id="gender-stat-panel" ref="genderPanel">
				<component :is="chartType" class="tw-mb-4" :loading="genderLoading" :values="genderStats" />
				<distribution-table :values="genderStats" measure-name="Gender" />
			</kv-tab-panel>
			<kv-tab-panel id="sector-stat-panel" ref="sectorPanel">
				<component :is="chartType" class="tw-mb-4" :loading="sectorLoading" :values="sectorStats" />
				<distribution-table :values="sectorStats" measure-name="Sector" />
			</kv-tab-panel>
			<kv-tab-panel id="partner-stat-panel" ref="partnerPanel">
				<component :is="chartType" class="tw-mb-4" :loading="partnerLoading" :values="partnerStats" />
				<distribution-table :values="partnerStats" measure-name="Lending partner" />
			</kv-tab-panel>
		</template>
	</kv-tabs>
</template>

<script>
import DistributionTable from '#src/pages/Portfolio/ImpactDashboard/DistributionTable';
import KvPieChart from '@kiva/kv-components/dist/components/KvPieChart';
import KvTreeMapChart from '@kiva/kv-components/dist/components/KvTreeMapChart';
import KvButton from '@kiva/kv-components/dist/components/KvButton';
import KvTab from '@kiva/kv-components/dist/components/KvTab';
import KvTabs from '@kiva/kv-components/dist/components/KvTabs';
import KvTabPanel from '@kiva/kv-components/dist/components/KvTabPanel';

export default {
	name: 'StatsTable',
	components: {
		DistributionTable,
		KvPieChart,
		KvTab,
		KvTabs,
		KvTabPanel,
		KvButton,
	},
	emits: ['click'],
	props: {
		locationLoading: {
			type: Boolean,
			default: false,
		},
		locationStats: {
			type: Array,
			default: () => ([])
		},
		genderLoading: {
			type: Boolean,
			default: false,
		},
		genderStats: {
			type: Array,
			default: () => ([])
		},
		sectorLoading: {
			type: Boolean,
			default: false,
		},
		sectorStats: {
			type: Array,
			default: () => ([])
		},
		partnerLoading: {
			type: Boolean,
			default: false,
		},
		partnerStats: {
			type: Array,
			default: () => ([])
		},
		chart: {
			type: String,
			default: 'treemap',
			validator: value => ['pie', 'treemap'].includes(value),
		},
		trackCategory: {
			type: String,
			default: 'portfolio',
		}
	},
	computed: {
		chartType() {
			switch (this.chart) {
				case 'pie':
					return KvPieChart;
				case 'treemap':
				default:
					return KvTreeMapChart;
			}
		},
		inPortfolio() {
			return this.$route?.name?.includes('portfolio');
		},
	},
	methods: {
		handleChartClick(label) {
			this.$emit('click', label);
		},
	},
};
</script>
