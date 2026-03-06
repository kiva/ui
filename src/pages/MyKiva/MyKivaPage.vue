<template>
	<www-page main-class="tw-bg-secondary tw-overflow-hidden tw-relative" class="tw-relative">
		<my-kiva-page-content
			:user-info="userInfo"
			:lender="lender"
			:loans="loans"
			:total-loans="totalLoans"
			:hero-slides="heroSlides"
			:hero-badge-data="heroBadgeData"
			:hero-tiered-achievements="heroTieredAchievements"
			:lending-stats="lendingStats"
			:transactions="transactions"
			:user-lent-to-all-regions="userLentToAllRegions"
			:enable-ai-loan-pills="enableAILoanPills"
			:sidesheet-loan="sidesheetLoan"
			:is-next-steps-exp-enabled="true"
			:goals-v2-enabled="goalsV2Enabled"
			:show-new-badge-section="showNewBadgeSection"
			:post-lending-next-steps-enable="postLendingNextStepsEnable"
			:latest-loan="latestLoan"
			:goal-refresh-key="goalRefreshKey"
			:show-my-giving-funds-card="showMyGivingFundsCard"
			:next-steps-experiment-variant="nextStepsExperimentVariant"
			:goal-editing-enable="goalEditingEnable"
		/>
	</www-page>
</template>

<script>
import logReadQueryError from '#src/util/logReadQueryError';
import { CONTENTFUL_CAROUSEL_KEY } from '#src/util/myKivaUtils';
import myKivaQuery from '#src/graphql/query/myKiva.graphql';
import lendingStatsQuery from '#src/graphql/query/myLendingStats.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import MyKivaPageContent from '#src/pages/MyKiva/MyKivaPageContent';
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import { gql } from 'graphql-tag';
import aiLoanPillsTest from '#src/plugins/ai-loan-pills-mixin';
import borrowerProfileSideSheetQuery from '#src/graphql/query/borrowerProfileSideSheet.graphql';
import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';
import { initializeExperiment } from '#src/util/experiment/experimentUtils';
import { readBoolSetting } from '#src/util/settingsUtils';
import useGoalData, { LAST_YEAR_KEY, isGoalsV2Enabled } from '#src/composables/useGoalData';
import {
	FRESH_PROGRESS_LOAN_PURCHASE_LIMIT,
} from '#src/composables/useBadgeData';
import {
	buildLatestLoanData,
	buildLenderData,
	buildRegionsData,
	buildHeroBadgeData,
	buildContentfulData,
	applyFreshProgress,
} from '#src/composables/useMyKivaJourneyData';
import { inject, provide } from 'vue';

const CURRENT_YEAR = new Date().getFullYear();
const NEXT_STEPS_REDIRECT_EXP_KEY = 'mykiva_next_steps_redirect';
const THANK_YOU_PAGE_GOALS_ENABLE_KEY = 'thankyou_page_goals_enable';
const NEW_BADGE_SECTION_KEY = 'new_badge_section_enable';
const POST_LENDING_NEXT_STEPS_KEY = 'post_lending_next_steps_enable';
const GOAL_EDITING_KEY = 'goal_editing_enable';

/**
 * Options API parent needed to ensure WWwPage children options API preFetch works,
 * specifically for header component data preFetch
 */
export default {
	name: 'MyKivaPage',
	inject: ['apollo', 'cookieStore'],
	mixins: [aiLoanPillsTest],
	components: {
		MyKivaPageContent,
		WwwPage,
	},
	setup() {
		const apollo = inject('apollo');

		const goalDataComposable = useGoalData({ apollo });
		provide('goalData', goalDataComposable);

		return {
			fixIncorrectlyCompletedGoals: goalDataComposable.fixIncorrectlyCompletedGoals,
			loadGoalData: goalDataComposable.loadGoalData,
			renewAnnualGoal: goalDataComposable.renewAnnualGoal,
			setHideGoalCardPreference: goalDataComposable.setHideGoalCardPreference,
		};
	},
	data() {
		return {
			heroBadgeContentfulData: [],
			heroSlides: [],
			heroTieredAchievements: [],
			currentYearTieredAchievements: [],
			lender: null,
			lendingStats: {},
			loans: [],
			totalLoans: 0,
			transactions: [],
			userInfo: {},
			userLentToAllRegions: false,
			sidesheetLoan: {},
			goalsEntrypointEnable: false,
			showNewBadgeSection: false,
			postLendingNextStepsEnable: false,
			latestLoan: null,
			goalRefreshKey: 0,
			showMyGivingFundsCard: false,
			nextStepsExperimentVariant: null,
			goalEditingEnable: false,
			recentTransactionLoans: [],
		};
	},
	computed: {
		goalsV2Enabled() {
			return isGoalsV2Enabled(this.goalsEntrypointEnable);
		},
		heroBadgeData() {
			return buildHeroBadgeData(this.heroTieredAchievements, this.heroBadgeContentfulData);
		},
	},
	apollo: {
		preFetch(_, client, { route }) {
			const loanId = route?.query?.loanId ?? null;

			return Promise.all([
				client.query({ query: myKivaQuery }),
				client.query({ query: lendingStatsQuery }),
				client.query({
					query: userAchievementProgressQuery,
					variables: {
						year: LAST_YEAR_KEY,
						loanPurchasesLimit: FRESH_PROGRESS_LOAN_PURCHASE_LIMIT,
					},
					fetchPolicy: 'network-only',
				}),
				client.query({
					query: userAchievementProgressQuery,
					variables: {
						year: CURRENT_YEAR,
						loanPurchasesLimit: FRESH_PROGRESS_LOAN_PURCHASE_LIMIT,
					},
					fetchPolicy: 'network-only',
				}),
				loanId
					? client.query({ query: borrowerProfileSideSheetQuery, variables: { loanId: Number(loanId) } })
					: Promise.resolve(null),
				client.query({
					query: contentfulEntriesQuery,
					variables: { contentType: 'carousel', contentKey: CONTENTFUL_CAROUSEL_KEY },
				}),
				client.query({
					query: contentfulEntriesQuery,
					variables: { contentType: 'challenge', limit: 200 }
				}),
				client.query({
					query: experimentAssignmentQuery,
					variables: { id: NEXT_STEPS_REDIRECT_EXP_KEY },
				}),
			]).catch(error => {
				logReadQueryError(error, 'myKivaPage Prefetch');
			});
		},
	},
	methods: {
		applyMyKivaFreshProgress() {
			const result = applyFreshProgress(this.heroTieredAchievements, this.transactions);
			this.heroTieredAchievements = result.achievements;
			this.recentTransactionLoans = result.recentTransactionLoans;
		},
		readTieredAchievementsFromCache(year) {
			try {
				const queryResult = this.apollo.readQuery({
					query: userAchievementProgressQuery,
					variables: { year, loanPurchasesLimit: FRESH_PROGRESS_LOAN_PURCHASE_LIMIT },
				});
				return queryResult?.userAchievementProgress?.tieredLendingAchievements ?? [];
			} catch (error) {
				return [];
			}
		},
		fetchMyKivaData() {
			try {
				const myKivaQueryResult = this.apollo.readQuery({ query: myKivaQuery });
				const lendingStatsQueryResult = this.apollo.readQuery({ query: lendingStatsQuery });
				const loanId = this.$router.currentRoute?.value?.query?.loanId ?? null;
				const bpSidesheetLoan = loanId ? this.apollo.readQuery({
					query: borrowerProfileSideSheetQuery,
					variables: { loanId: Number(loanId) }
				}) : null;
				this.userInfo = myKivaQueryResult.my ?? {};
				this.lender = buildLenderData(myKivaQueryResult.my);
				// show giving funds card if user has any giving fund participation
				this.showMyGivingFundsCard = (
					(this.userInfo?.givingFundParticipation?.totalCount ?? 0) > 0
					|| (this.userInfo?.givingFundParticipation?.totalAmount ?? 0) > 0
				);
				this.loans = myKivaQueryResult.my?.loans?.values ?? [];
				this.sidesheetLoan = bpSidesheetLoan?.lend?.loan ?? { id: 0 };
				const isSideSheetLoanInLoans = this.loans.some(loan => loan?.id === this.sidesheetLoan.id);
				if (!isSideSheetLoanInLoans && this.sidesheetLoan.id) {
					this.loans = [this.sidesheetLoan, ...this.loans];
				} else if (this.sidesheetLoan.id) {
					// Ensure sidesheet loan is first in the list if already present
					const loanIndex = this.loans.findIndex(item => item.id === this.sidesheetLoan.id);
					const processedLoans = [...this.loans];
					const [removedLoan] = processedLoans.splice(loanIndex, 1);
					if (removedLoan) {
						processedLoans.unshift(removedLoan);
					}
					this.loans = processedLoans;
				}

				this.totalLoans = myKivaQueryResult.my?.loans?.totalCount ?? 0;

				// Build regionsData
				const { regionsData, userLentToAllRegions } = buildRegionsData(lendingStatsQueryResult);
				this.userLentToAllRegions = userLentToAllRegions;
				this.lendingStats = {
					...lendingStatsQueryResult.my?.lendingStats,
					...lendingStatsQueryResult.my?.userStats,
					regionsData,
				};
				this.transactions = myKivaQueryResult.my?.transactions?.values ?? [];

				this.goalsEntrypointEnable = readBoolSetting(myKivaQueryResult, `general.${THANK_YOU_PAGE_GOALS_ENABLE_KEY}.value`) ?? false; // eslint-disable-line max-len
				this.showNewBadgeSection = readBoolSetting(myKivaQueryResult, `general.${NEW_BADGE_SECTION_KEY}.value`) ?? false; // eslint-disable-line max-len
				this.postLendingNextStepsEnable = readBoolSetting(myKivaQueryResult, `general.${POST_LENDING_NEXT_STEPS_KEY}.value`) ?? false; // eslint-disable-line max-len
				this.goalEditingEnable = readBoolSetting(myKivaQueryResult, `general.${GOAL_EDITING_KEY}.value`) ?? false; // eslint-disable-line max-len

				this.latestLoan = buildLatestLoanData(myKivaQueryResult.my);
			} catch (e) {
				logReadQueryError(e, 'MyKivaPage myKivaQuery');
			}
		},
	},
	created() {
		try {
			this.fetchMyKivaData();
			this.heroTieredAchievements = this.readTieredAchievementsFromCache(LAST_YEAR_KEY);
			this.currentYearTieredAchievements = this.readTieredAchievementsFromCache(CURRENT_YEAR);
			// Apply centralized fresh progress during creation to avoid initial stale render.
			this.applyMyKivaFreshProgress();
			const contentfulChallengeResult = this.apollo.readQuery({
				query: contentfulEntriesQuery,
				variables: { contentType: 'challenge', limit: 200 }
			});
			const slidesResult = this.apollo.readQuery({
				query: contentfulEntriesQuery,
				variables: {
					contentType: 'carousel',
					contentKey: CONTENTFUL_CAROUSEL_KEY,
				}
			});
			const contentfulData = buildContentfulData(slidesResult, contentfulChallengeResult);
			this.heroSlides = contentfulData.heroSlides;
			this.heroBadgeContentfulData = contentfulData.heroBadgeContentfulData;
		} catch (e) {
			logReadQueryError(e, 'MyKivaPage created');
		}

		initializeExperiment(
			this.cookieStore,
			this.apollo,
			this.$route,
			NEXT_STEPS_REDIRECT_EXP_KEY,
			version => {
				this.nextStepsExperimentVariant = version;
			},
			this.$kvTrackEvent,
			'EXP-MP-2417-Feb2026'
		);
	},
	async mounted() {
		try {
			this.apollo.watchQuery({
				query: gql`
					query UserPreferences {
						my {
							id
							userPreferences {
								preferences
								id
							}
						}
					}
				`,
			}).subscribe({
				next: ({ data }) => {
					this.userInfo = { ...this.userInfo, userPreferences: data?.my?.userPreferences };
				},
			});

			// Goals V2 (yearly progress) is enabled if flag is true OR year >= 2026
			if (this.goalsV2Enabled) {
				// Param to force goals renewal in an specific year
				const { renewYear } = this.$route.query;
				const { showRenewedAnnualGoalToast } = await this.renewAnnualGoal(
					renewYear ? new Date(`${renewYear}-01-15T00:00:00Z`) : undefined
				);

				// Fix goals incorrectly marked as completed due to progress double-counting bug
				const { wasFixed } = await this.fixIncorrectlyCompletedGoals({
					freshProgressLoans: this.recentTransactionLoans,
					tieredAchievements: this.currentYearTieredAchievements,
					transactions: this.transactions,
				});

				if (showRenewedAnnualGoalToast || wasFixed) {
					if (showRenewedAnnualGoalToast) {
						// eslint-disable-next-line max-len
						this.$showTipMsg('It\'s time for your 2026 impact goal - a fresh start and new opportunity to make a difference.');
					}
					// Ensure goal card is shown again after renewal or fix
					await this.setHideGoalCardPreference(false);
					// Trigger goal data refresh in child components
					this.goalRefreshKey += 1;
				}
			}
		} catch (error) {
			logReadQueryError(error, 'MyKivaPage userPreferences watchQuery');
		}

		await this.loadGoalData({
			year: CURRENT_YEAR,
			yearlyProgress: this.goalsV2Enabled,
			freshProgressLoans: this.recentTransactionLoans,
			tieredAchievements: this.currentYearTieredAchievements,
			transactions: this.transactions,
		});
	},
};
</script>
