<template>
	<www-page main-class="tw-bg-secondary tw-overflow-hidden tw-relative" class="tw-relative">
		<my-kiva-page-content
			:user-info="userInfo"
			:lender="lender"
			:loans="loans"
			:total-loans="totalLoans"
			:hero-slides="heroSlides"
			:hero-contentful-data="heroContentfulData"
			:hero-tiered-achievements="heroTieredAchievements"
			:lending-stats="lendingStats"
			:transactions="transactions"
			:user-lent-to-all-regions="userLentToAllRegions"
			:enable-ai-loan-pills="enableAILoanPills"
			:sidesheet-loan="sidesheetLoan"
			:is-next-steps-exp-enabled="isNextStepsExpEnabled"
			:goals-v2-enabled="goalsV2Enabled"
			:show-new-badge-section="showNewBadgeSection"
			:post-lending-next-steps-enable="postLendingNextStepsEnable"
			:latest-loan="latestLoan"
			:goal-refresh-key="goalRefreshKey"
			:show-my-giving-funds-card="showMyGivingFundsCard"
			:next-steps-experiment-variant="nextStepsExperimentVariant"
		/>
	</www-page>
</template>

<script>
import logReadQueryError from '#src/util/logReadQueryError';
import { CONTENTFUL_CAROUSEL_KEY, getRecentTransactionLoans } from '#src/util/myKivaUtils';
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
import { inject, provide } from 'vue';

const CURRENT_YEAR = new Date().getFullYear();
const NEXT_STEPS_EXP_KEY = 'mykiva_next_steps';
const NEXT_STEPS_REDIRECT_EXP_KEY = 'mykiva_next_steps_redirect';
const THANK_YOU_PAGE_GOALS_ENABLE_KEY = 'thankyou_page_goals_enable';
const NEW_BADGE_SECTION_KEY = 'new_badge_section_enable';
const POST_LENDING_NEXT_STEPS_KEY = 'post_lending_next_steps_enable';

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
			heroContentfulData: [],
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
			isNextStepsExpEnabled: undefined,
			goalsEntrypointEnable: false,
			showNewBadgeSection: false,
			postLendingNextStepsEnable: false,
			latestLoan: null,
			goalRefreshKey: 0,
			showMyGivingFundsCard: false,
			isLoggedIn: false,
			nextStepsExperimentVariant: null,
		};
	},
	computed: {
		goalsV2Enabled() {
			return isGoalsV2Enabled(this.goalsEntrypointEnable);
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
					variables: { year: LAST_YEAR_KEY },
					fetchPolicy: 'network-only',
				}),
				client.query({
					query: userAchievementProgressQuery,
					variables: { year: CURRENT_YEAR },
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
					variables: { id: NEXT_STEPS_EXP_KEY },
				}),
			]).catch(error => {
				logReadQueryError(error, 'myKivaPage Prefetch');
			});
		},
	},
	methods: {
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
				this.isLoggedIn = !!this.userInfo?.id;
				this.lender = myKivaQueryResult.my?.lender ?? null;
				this.lender = {
					...this.lender,
					public: this.userInfo.userAccount?.public ?? false,
					inviterName: this.userInfo.userAccount?.inviterName ?? null,
				};
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
				const countryFacets = lendingStatsQueryResult.lend?.countryFacets ?? [];
				const regionCounts = new Map();
				const regionCountries = new Map();
				countryFacets.forEach(facet => {
					const region = facet.country?.region;
					const isoCode = facet.country?.isoCode;
					if (region) {
						regionCounts.set(region, (regionCounts.get(region) || 0) + (facet.count || 0));
						if (isoCode) {
							const currentCountries = regionCountries.get(region) || [];
							regionCountries.set(region, [...currentCountries, isoCode]);
						}
					}
				});
				const allRegions = [...regionCounts.keys()];
				const regionsData = allRegions.map(region => ({
					name: region,
					hasLoans: lendingStatsQueryResult
						.my?.lendingStats?.countriesLentTo
						.some(item => item?.region === region),
					count: regionCounts.get(region) || 0,
					countries: regionCountries.get(region) || []
				}));
				this.userLentToAllRegions = regionsData.map(region => region.hasLoans).every(Boolean) || false;
				this.lendingStats = {
					...lendingStatsQueryResult.my?.lendingStats,
					...lendingStatsQueryResult.my?.userStats,
					regionsData,
				};
				this.transactions = myKivaQueryResult.my?.transactions?.values ?? [];

				this.goalsEntrypointEnable = readBoolSetting(myKivaQueryResult, `general.${THANK_YOU_PAGE_GOALS_ENABLE_KEY}.value`) ?? false; // eslint-disable-line max-len
				this.showNewBadgeSection = readBoolSetting(myKivaQueryResult, `general.${NEW_BADGE_SECTION_KEY}.value`) ?? false; // eslint-disable-line max-len
				this.postLendingNextStepsEnable = readBoolSetting(myKivaQueryResult, `general.${POST_LENDING_NEXT_STEPS_KEY}.value`) ?? false; // eslint-disable-line max-len

				this.latestLoan = myKivaQueryResult.my?.latestLoan?.values?.[0]?.loan ? {
					...myKivaQueryResult.my.latestLoan.values[0].loan,
					amount: myKivaQueryResult.my.latestLoan.values[0]?.amount || null,
					/* there is an edge case where an user have a promo credit in his/her account and purchase a loan,
					the final transaction is split out. As each item share the same transaction id we include the others
					items to sum their amounts and get the total amount lent */
					// eslint-disable-next-line max-len
					...(myKivaQueryResult.my?.latestLoan?.values?.length > 1 ? { otherLoans: myKivaQueryResult.my.latestLoan.values.slice(1) } : {})
				} : null;
			} catch (e) {
				logReadQueryError(e, 'MyKivaPage myKivaQuery');
			}
		},
	},
	created() {
		try {
			this.fetchMyKivaData();
			const achievementsResult = this.apollo.readQuery({
				query: userAchievementProgressQuery,
				variables: { year: LAST_YEAR_KEY }
			});
			this.heroTieredAchievements = achievementsResult.userAchievementProgress?.tieredLendingAchievements ?? [];
			const currentYearResult = this.apollo.readQuery({
				query: userAchievementProgressQuery,
				variables: { year: CURRENT_YEAR }
			});
			// eslint-disable-next-line max-len
			this.currentYearTieredAchievements = currentYearResult.userAchievementProgress?.tieredLendingAchievements ?? [];
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
			this.heroSlides = slidesResult.contentful?.entries?.items?.[0]?.fields?.slides ?? [];
			this.heroContentfulData = contentfulChallengeResult.contentful?.entries?.items ?? [];
		} catch (e) {
			logReadQueryError(e, 'MyKivaPage created');
		}

		initializeExperiment(
			this.cookieStore,
			this.apollo,
			this.$route,
			NEXT_STEPS_EXP_KEY,
			version => {
				this.isNextStepsExpEnabled = version === 'b';
			},
			this.$kvTrackEvent,
			'EXP-MP-1984-Sept2025',
		);

		initializeExperiment(
			this.cookieStore,
			this.apollo,
			this.$route,
			NEXT_STEPS_REDIRECT_EXP_KEY,
			version => {
				this.nextStepsExperimentVariant = version;
			},
			this.$kvTrackEvent,
			'EXP-MP-2417-Feb2026',
			'event-tracking'
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
				const { wasFixed } = await this.fixIncorrectlyCompletedGoals();

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

		// Load goal data with fresh progress from recent transaction loans
		if (this.isNextStepsExpEnabled) {
			const recentTransactionLoans = getRecentTransactionLoans(this.transactions);
			await this.loadGoalData({
				year: CURRENT_YEAR,
				yearlyProgress: this.goalsV2Enabled,
				freshProgressLoans: recentTransactionLoans,
				tieredAchievements: this.currentYearTieredAchievements,
				transactions: this.transactions
			});
		}
	},
};
</script>
