<template>
	<www-page main-class="tw-bg-secondary">
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>
		<kv-page-container>
			<kv-grid class="tw-grid-cols-12 tw--mx-2.5 md:tw-mx-0">
				<the-portfolio-tertiary-menu class="tw-pt-2 tw-col-span-3 tw-hidden md:tw-block" />
				<div class="tw-col-span-12 md:tw-col-span-9 tw-pt-3">
					<account-overview />
					<lending-insights />
					<recent-loans-list />
					<education-module v-if="showEdModule" @hide-module="hideModule" />
					<kiva-credit-stats />
					<account-updates />
					<your-teams />
					<distribution-graphs />
				</div>
			</kv-grid>
		</kv-page-container>
	</www-page>
</template>

<script>
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import { trackExperimentVersion } from '@/util/experiment/experimentUtils';
import WwwPage from '@/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import ThePortfolioTertiaryMenu from '@/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import AccountOverview from './AccountOverview';
import AccountUpdates from './AccountUpdates';
import DistributionGraphs from './DistributionGraphs';
import KivaCreditStats from './KivaCreditStats';
import LendingInsights from './LendingInsights';
import RecentLoansList from './RecentLoansList';
import YourTeams from './YourTeams';
import EducationModule from './EducationModule';

export default {
	name: 'ImpactDashboardPage',
	inject: ['apollo', 'cookieStore'],
	components: {
		AccountOverview,
		AccountUpdates,
		DistributionGraphs,
		EducationModule,
		KivaCreditStats,
		KvGrid,
		KvPageContainer,
		LendingInsights,
		RecentLoansList,
		TheMyKivaSecondaryMenu,
		ThePortfolioTertiaryMenu,
		WwwPage,
		YourTeams,
	},
	data() {
		return {
			showEdModule: true
		};
	},
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: experimentAssignmentQuery,
				variables: {
					id: 'impact_dashboard',
				},
			}).then(({ data }) => {
				if (data?.experiment?.version !== 'b') {
					return Promise.reject({ path: '/portfolio' });
				}
			});
		},
	},
	methods: {
		hideModule(payload) {
			this.showEdModule = payload;
		}
	},
	mounted() {
		// Impact Dashboard page redesign experiment MARS-344 MARS-348
		trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'Portfolio',
			'impact_dashboard',
			'EXP-MARS-344-Mar2023'
		);
	}
};
</script>
