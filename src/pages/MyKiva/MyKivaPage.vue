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
			:goals-entrypoint-enable="goalsEntrypointEnable"
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

const NEXT_STEPS_EXP_KEY = 'mykiva_next_steps';
const THANK_YOU_PAGE_GOALS_ENABLE_KEY = 'thankyou_page_goals_enable';

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
	data() {
		return {
			heroContentfulData: [],
			heroSlides: [],
			heroTieredAchievements: [],
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
		};
	},
	apollo: {
		preFetch(_, client, { route }) {
			const loanId = route?.query?.loanId ?? null;

			return Promise.all([
				client.query({ query: myKivaQuery }),
				client.query({ query: lendingStatsQuery }),
				client.query({ query: userAchievementProgressQuery }),
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
				this.lender = myKivaQueryResult.my?.lender ?? null;
				this.lender = {
					...this.lender,
					public: this.userInfo.userAccount?.public ?? false,
					inviterName: this.userInfo.userAccount?.inviterName ?? null,
				};
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
			} catch (e) {
				logReadQueryError(e, 'MyKivaPage myKivaQuery');
			}
		},
	},
	created() {
		try {
			this.fetchMyKivaData();
			const achievementsResult = this.apollo.readQuery({
				query: userAchievementProgressQuery
			});
			this.heroTieredAchievements = achievementsResult.userAchievementProgress?.tieredLendingAchievements ?? [];
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
	},
	mounted() {
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
		} catch (error) {
			logReadQueryError(error, 'MyKivaPage userPreferences watchQuery');
		}
	},
};
</script>
