<template>
	<div>
		<my-kiva-page
			v-if="showMyKivaPage"
		/>
		<www-page
			v-else
			main-class="tw-bg-secondary"
		>
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
	</div>
</template>

<script>
import WwwPage from '#src/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '#src/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import ThePortfolioTertiaryMenu from '#src/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';
import { gql } from 'graphql-tag';
import { readBoolSetting } from '#src/util/settingsUtils';
import portfolioQuery from '#src/graphql/query/portfolioQuery.graphql';
import badgeGoalMixin from '#src/plugins/badge-goal-mixin';
import { getIsMyKivaEnabled } from '#src/util/myKivaUtils';
import { KvGrid, KvPageContainer } from '@kiva/kv-components';
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
import MyKivaPage from '../MyKiva/MyKivaPage';

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
		MyKivaPage,
	},
	data() {
		return {
			post: null,
			showTeamChallenge: false,
			teamsChallengeEnable: false,
			allowedTeams: [],
			userPreferences: null,
			showMyKivaPage: false,
		};
	},
	mixins: [badgeGoalMixin],
	apollo: {
		preFetch(config, client) {
			return Promise.all([
				client.query({ query: portfolioQuery }),
			]);
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
		},
	},
	created() {
		const portfolioQueryData = this.apollo.readQuery({ query: portfolioQuery });
		const userData = portfolioQueryData?.my ?? {};
		const generalData = portfolioQueryData?.general ?? {};
		const loanCount = userData.lender?.loanCount ?? 0;
		this.showMyKivaPage = getIsMyKivaEnabled(
			this.apollo,
			this.$kvTrackEvent,
			generalData,
			userData?.userPreferences?.preferences ?? null,
			loanCount
		);

		if (!this.showMyKivaPage) {
			const teamsChallengeEnable = readBoolSetting(portfolioQueryData, 'general.team_challenge_enable.value');
			const userTeams = portfolioQueryData?.my?.teams?.values ?? [];
			let allowedTeamsSettings = portfolioQueryData?.general?.challenge_allowed_teams?.value ?? '""';
			allowedTeamsSettings = JSON.parse(allowedTeamsSettings);
			this.allowedTeams = userTeams.filter(t => {
				return allowedTeamsSettings.includes(t.team.teamPublicId);
			});

			this.showTeamChallenge = teamsChallengeEnable && this.allowedTeams.length > 0;
			this.userPreferences = portfolioQueryData?.my?.userPreferences ?? null;
		}
	},
	async mounted() {
		if (!this.showMyKivaPage) {
			this.loadEducationPost();

			if (this.$route?.query?.goal_saved) {
				const badgeName = this.$route?.query?.goal_saved ?? '';

				if (!this.userPreferences?.id) {
					const createPreferences = await this.createUserPreferences();
					this.userPreferences = createPreferences?.data?.my?.createUserPreferences ?? {};
				}

				this.storeGoal({ userPreferences: this.userPreferences, badgeName }).then(() => {
					this.$showTipMsg('Goal saved');
				}).catch(() => {
					this.$showTipMsg('There was a problem saving your goal', 'error');
				});
			}
		}
	}
};
</script>
