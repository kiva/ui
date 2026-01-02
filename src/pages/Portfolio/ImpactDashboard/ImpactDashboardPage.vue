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
						<GoalEntrypoint
							v-if="goalsV2Enabled && isEmptyGoal"
						/>
						<lending-insights />
						<my-giving-funds-card
							v-if="myGivingFundsCount > 0 || numberOfFundsContributedTo > 0"
							:my-funds-count="myGivingFundsCount"
							:contributed-funds-count="numberOfFundsContributedTo"
							class="tw-mb-3 tw-mx-2 md:tw-mx-0"
						/>
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
import { inject } from 'vue';

import WwwPage from '#src/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '#src/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import ThePortfolioTertiaryMenu from '#src/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';
import { gql } from 'graphql-tag';
import { readBoolSetting } from '#src/util/settingsUtils';
import { isGoalsV2Enabled, GOAL_STATUS } from '#src/composables/useGoalData';
import portfolioQuery from '#src/graphql/query/portfolioQuery.graphql';
import badgeGoalMixin from '#src/plugins/badge-goal-mixin';
import { getIsMyKivaEnabled, hasLoanFunFactFootnote } from '#src/util/myKivaUtils';
import { KvGrid, KvPageContainer } from '@kiva/kv-components';
import MyKivaPage from '#src/pages/MyKiva/MyKivaPage';
import MyGivingFundsCard from '#src/components/GivingFunds/MyGivingFundsCard';
import useGivingFund from '#src/composables/useGivingFund';
import logReadQueryError from '#src/util/logReadQueryError';

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
import GoalEntrypoint from './GoalEntrypoint';

const THANK_YOU_PAGE_GOALS_ENABLE_KEY = 'thankyou_page_goals_enable';

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
		MyGivingFundsCard,
		TheMyKivaSecondaryMenu,
		ThePortfolioTertiaryMenu,
		WwwPage,
		YourTeams,
		YourDonations,
		TeamChallenge,
		MyKivaPage,
		LoanCards,
		GoalEntrypoint
	},
	data() {
		return {
			allowedTeams: [],
			filteredLoans: [],
			loans: [],
			myGivingFundsCount: 0,
			numberOfFundsContributedTo: 0,
			post: null,
			showLoanFootnote: false,
			showMyKivaPage: false,
			showTeamChallenge: false,
			teamsChallengeEnable: false,
			userPreferences: null,
			goalsEntrypointEnable: false,
			goalsV2Enabled: false,
			isEmptyGoal: true,
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
		},
	},
	setup() {
		const apollo = inject('apollo');

		const {
			getFundsContributedToIds,
			fetchMyGivingFundsCount,
		} = useGivingFund(apollo);

		return {
			getFundsContributedToIds,
			fetchMyGivingFundsCount,
		};
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

			this.goalsEntrypointEnable = readBoolSetting(portfolioQueryData, `general.${THANK_YOU_PAGE_GOALS_ENABLE_KEY}.value`) ?? false; // eslint-disable-line max-len
			// Goals V2 (yearly progress) is enabled if flag is true OR year >= 2026
			this.goalsV2Enabled = isGoalsV2Enabled(this.goalsEntrypointEnable);
			if (this.goalsV2Enabled) {
				const parsedPrefs = JSON.parse(this.userPreferences?.preferences || '{}');
				const goals = parsedPrefs.goals || [];
				this.isEmptyGoal = !goals.some(goal => goal.status === GOAL_STATUS.IN_PROGRESS);
			}
		}

		this.fetchMyGivingFundsCount()
			.then(response => {
				this.myGivingFundsCount = response.givingFunds.totalCount;
			})
			.catch(error => {
				logReadQueryError(error, 'MyKivaPageContent fetchMyGivingFundsCount');
			});
		this.getFundsContributedToIds(parseInt(userData?.id, 10) || null)
			.then(fundIds => {
				this.numberOfFundsContributedTo = fundIds.length;
			})
			.catch(error => {
				logReadQueryError(error, 'MyKivaPageContent getFundsContributedToIds');
			});
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
