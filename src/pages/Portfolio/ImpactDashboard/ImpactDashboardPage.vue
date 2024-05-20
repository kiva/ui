<template>
	<www-page main-class="tw-bg-secondary">
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>
		<kv-page-container>
			<kv-grid class="tw-grid-cols-12 tw--mx-2.5 md:tw-mx-0" data-testid="portfolio">
				<the-portfolio-tertiary-menu class="tw-pt-2 tw-col-span-3 tw-hidden md:tw-block" />
				<div
					class="tw-col-span-12 md:tw-col-span-9"
					:class="{ 'tw-pt-3' : !showTeamChallenge }"
				>
					<team-challenge
						v-if="showTeamChallenge"
						:allowed-teams="allowedTeams"
					/>
					<account-overview :class="{ 'tw-pt-2' : showTeamChallenge }" />
					<lending-insights />
					<recent-loans-list />
					<your-donations />
					<education-module v-if="post" :post="post" />
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
import WwwPage from '#src/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '#src/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import ThePortfolioTertiaryMenu from '#src/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';
import { gql } from '@apollo/client/index';
import { readBoolSetting } from '#src/util/settingsUtils';
import portfolioQuery from '#src/graphql/query/portfolioQuery.graphql';
import KvGrid from '@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '@kiva/kv-components/vue/KvPageContainer';
import AccountOverview from './AccountOverview';
import AccountUpdates from './AccountUpdates';
import DistributionGraphs from './DistributionGraphs';
import KivaCreditStats from './KivaCreditStats';
import LendingInsights from './LendingInsights';
import RecentLoansList from './RecentLoansList';
import YourTeams from './YourTeams';
import EducationModule from './EducationModule';
import YourDonations from './YourDonations';
import TeamChallenge from './TeamChallenge';

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
		YourDonations,
		TeamChallenge,
	},
	data() {
		return {
			post: null,
			showTeamChallenge: false,
			teamsChallengeEnable: false,
			allowedTeams: [],
		};
	},
	apollo: {
		async preFetch(config, client) {
			return client.query({ query: portfolioQuery });
		},
	},
	methods: {
		loadEducationPost() {
			// Donation Education Module Experiment MARS-497
			this.apollo.query({
				query: gql`query ContentfulBlogPosts (
						$customFields: String,
						$limit: Int
					) {
						contentful {
							blogPosts: entries(contentType:"blogPost", customFields:$customFields, limit:$limit)
						}
					}`,
				variables: {
					customFields: 'metadata.tags.sys.id[in]=impact-page|order=-fields.originalPublishDate'
				},
			}).then(({ data }) => {
				this.post = data?.contentful?.blogPosts?.items?.[0]?.fields ?? null;
			});
		}
	},
	created() {
		const portfolioQueryData = this.apollo.readQuery({ query: portfolioQuery });
		const teamsChallengeEnable = readBoolSetting(portfolioQueryData, 'general.team_challenge_enable.value');
		const userTeams = portfolioQueryData.my?.teams?.values ?? [];
		let allowedTeamsSettings = portfolioQueryData.general?.challenge_allowed_teams?.value ?? '';
		allowedTeamsSettings = JSON.parse(allowedTeamsSettings);
		this.allowedTeams = userTeams.filter(t => {
			return allowedTeamsSettings.includes(t.team.teamPublicId);
		});

		this.showTeamChallenge = teamsChallengeEnable && this.allowedTeams.length > 0;
	},
	mounted() {
		this.loadEducationPost();
	}
};
</script>
