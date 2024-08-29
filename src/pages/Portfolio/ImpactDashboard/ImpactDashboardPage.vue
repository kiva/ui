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
import WwwPage from '@/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import ThePortfolioTertiaryMenu from '@/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';
import { gql } from '@apollo/client';
import { readBoolSetting } from '@/util/settingsUtils';
import portfolioQuery from '@/graphql/query/portfolioQuery.graphql';
import badgeGoalMixin from '@/plugins/badge-goal-mixin';
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
			userPreferences: null,
		};
	},
	mixins: [badgeGoalMixin],
	apollo: {
		preFetch(config, client) {
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
		this.userPreferences = portfolioQueryData.my?.userPreferences ?? null;
	},
	mounted() {
		this.loadEducationPost();

		if (this.$route?.query?.goal_saved) {
			const badgeName = this.route?.query?.goal_saved ?? '';

			if (!this.userPreferences?.id) {
				this.createUserPreferences().then(({ data }) => {
					this.userPreferences = data?.my?.createUserPreferences ?? null;
				});
			}

			this.storeGoal({ userPreferences: this.userPreferences, badgeName }).then(() => {
				this.$showTipMsg('Goal saved');
			}).catch(() => {
				this.$showTipMsg('There was a problem saving your goal', 'error');
			});
		}
	}
};
</script>
