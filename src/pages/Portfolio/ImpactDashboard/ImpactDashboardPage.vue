<template>
	<div>
		<my-kiva-page
			v-if="showMyKivaPage"
		/>
		<www-page
			v-else
			main-class="tw-bg-secondary tw-overflow-hidden"
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
						<your-donations />
						<LoanCards
							v-if="filteredLoans.length > 0"
						/>
						<education-module v-if="post" :post="post" />
						<kiva-credit-stats />
						<account-updates />
						<your-teams />
						<distribution-graphs />
					</div>
				</kv-grid>
			</kv-page-container>
			<div
				v-if="showLoanFootnote"
				class="tw-bg-white tw-text-small tw-py-4 md:tw-py-2.5"
			>
				<kv-page-container>
					<section>
						*Borrowers of Kiva Lending Partners surveyed by 60 Decibels.
					</section>
				</kv-page-container>
			</div>
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
import { getIsMyKivaEnabled, hasLoanFunFactFootnote } from '#src/util/myKivaUtils';
import { KvGrid, KvPageContainer } from '@kiva/kv-components';
import MyKivaPage from '#src/pages/MyKiva/MyKivaPage';
import {
	PAYING_BACK,
	FUNDED,
	FUNDRAISING,
	RAISED
} from '#src/api/fixtures/LoanStatusEnum';
import AccountOverview from './AccountOverview';
import AccountUpdates from './AccountUpdates';
import DistributionGraphs from './DistributionGraphs';
import KivaCreditStats from './KivaCreditStats';
import LendingInsights from './LendingInsights';
import YourTeams from './YourTeams';
import EducationModule from './EducationModule';
import YourDonations from './YourDonations';
import TeamChallenge from './TeamChallenge';
import LoanCards from './LoanCards';

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
		TheMyKivaSecondaryMenu,
		ThePortfolioTertiaryMenu,
		WwwPage,
		YourTeams,
		YourDonations,
		TeamChallenge,
		MyKivaPage,
		LoanCards,
	},
	data() {
		return {
			post: null,
			showTeamChallenge: false,
			teamsChallengeEnable: false,
			allowedTeams: [],
			userPreferences: null,
			showMyKivaPage: false,
			loans: [],
			filteredLoans: [],
			showLoanFootnote: false,
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
		this.loans = userData?.loans?.values ?? [];
		if (this.loans.length > 0) {
			this.filteredLoans = this.loans
				.filter(loan => [FUNDED, FUNDRAISING, PAYING_BACK, RAISED].includes(loan?.status))
				.slice(0, 6);

			this.showLoanFootnote = this.filteredLoans.some(l => hasLoanFunFactFootnote(l));
		}

		// User will always see old portfolio page when MyKiva is rolled out to all users
		const myKivaAllUsersEnabled = readBoolSetting(portfolioQueryData, 'general.my_kiva_all_users.value');
		const isMykivaEnabled = getIsMyKivaEnabled(
			this.apollo,
			this.$kvTrackEvent,
			myKivaAllUsersEnabled,
			this.cookieStore,
		);
		if (!myKivaAllUsersEnabled) {
			this.showMyKivaPage = isMykivaEnabled;
		}

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
