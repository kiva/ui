<template>
	<www-page main-class="tw-bg-secondary tw-overflow-hidden tw-relative" class="tw-relative">
		<my-kiva-page-content
			:is-hero-enabled="isHeroEnabled"
			:user-info="userInfo"
			:lender="lender"
			:loans="loans"
			:total-loans="totalLoans"
			:hero-slides="heroSlides"
			:hero-contentful-data="heroContentfulData"
			:hero-tiered-achievements="heroTieredAchievements"
			:lending-stats="lendingStats"
			:transactions="transactions"
			:is-next-steps-exp="isNextStepsExp"
			:user-lent-to-all-regions="userLentToAllRegions"
			:enable-ai-loan-pills="enableAILoanPills"
			:my-giving-funds="myGivingFunds"
		/>
	</www-page>
</template>

<script>
import { readBoolSetting } from '#src/util/settingsUtils';
import logReadQueryError from '#src/util/logReadQueryError';
import { CONTENTFUL_CAROUSEL_KEY, MY_KIVA_HERO_ENABLE_KEY } from '#src/util/myKivaUtils';
import myKivaQuery from '#src/graphql/query/myKiva.graphql';
import lendingStatsQuery from '#src/graphql/query/myLendingStats.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';
import uiConfigSettingQuery from '#src/graphql/query/uiConfigSetting.graphql';
import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import MyKivaPageContent from '#src/pages/MyKiva/MyKivaPageContent';
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import { gql } from 'graphql-tag';
import aiLoanPillsTest from '#src/plugins/ai-loan-pills-mixin';
import borrowerProfileSideSheetQuery from '#src/graphql/query/borrowerProfileSideSheet.graphql';
import myGivingFundsQuery from '#src/graphql/query/portfolio/myGivingFunds.graphql';

const NEXT_STEPS_EXP_KEY = 'mykiva_next_steps';

const getRegionsWithLoanStatus = (countryFacets, countriesLentTo) => {
	const allRegions = [
		...new Set(countryFacets.map(facet => facet.country?.region).filter(Boolean))
	];
	const regionsWithLoanStatus = allRegions.map(region => {
		const hasLoans = countriesLentTo.some(item => item?.region === region);
		return { name: region, hasLoans };
	});
	const userLentToAllRegions = regionsWithLoanStatus.filter(region => region?.hasLoans).every(Boolean) || false;
	return { userLentToAllRegions };
};

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
			isHeroEnabled: false,
			isNextStepsExp: false,
			lender: null,
			lendingStats: {},
			loans: [],
			totalLoans: 0,
			transactions: [],
			userInfo: {},
			userLentToAllRegions: false,
			myGivingFunds: {},
		};
	},
	apollo: {
		preFetch(config, client, { route }) {
			const loanId = route?.query?.loanId ?? null;

			return Promise.all([
				client.query({ query: myKivaQuery }),
				client.query({ query: lendingStatsQuery }),
				client.query({ query: uiConfigSettingQuery, variables: { key: MY_KIVA_HERO_ENABLE_KEY } }),
				client.query({ query: experimentAssignmentQuery, variables: { id: NEXT_STEPS_EXP_KEY } }),
				client.query({ query: userAchievementProgressQuery }),
				loanId
					? client.query({ query: borrowerProfileSideSheetQuery, variables: { loanId: Number(loanId) } })
					: Promise.resolve(null),
				client.query({ query: myGivingFundsQuery }),
			]).then(result => {
				const heroCarouselUiSetting = result[2];
				const isHeroEnabled = readBoolSetting(heroCarouselUiSetting, 'data.general.uiConfigSetting.value');
				const myKivaStatsExp = result[3];
				const isMyKivaStatsExp = myKivaStatsExp?.data?.experiment?.version === 'b';
				const isMyKivaNextStepsExp = result[4]?.data?.experiment?.version !== 'b';
				const statsResult = result[1]?.data || {};
				const countryFacets = statsResult.lend?.countryFacets ?? [];
				const countriesLentTo = statsResult.my?.lendingStats?.countriesLentTo ?? [];
				const { userLentToAllRegions } = getRegionsWithLoanStatus(countryFacets, countriesLentTo);
				if ((isHeroEnabled && !isMyKivaStatsExp) || userLentToAllRegions || isMyKivaNextStepsExp) {
					return Promise.all([
						client.query({
							query: contentfulEntriesQuery,
							variables: { contentType: 'carousel', contentKey: CONTENTFUL_CAROUSEL_KEY },
						}),
						client.query({
							query: contentfulEntriesQuery,
							variables: { contentType: 'challenge', limit: 200 }
						}),
					]).catch(error => {
						logReadQueryError(error, 'myKivaPage Hero Data Prefetch');
					});
				}
			}).catch(error => {
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
				if (bpSidesheetLoan?.lend?.loan) {
					const bpLoanId = bpSidesheetLoan.lend.loan.id;
					const filteredLoans = this.loans.filter(loan => loan.id !== bpLoanId);
					this.loans = [bpSidesheetLoan.lend.loan, ...filteredLoans];
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

				const myGivingFundsQueryResult = this.apollo.readQuery({ query: myGivingFundsQuery });
				this.myGivingFunds = myGivingFundsQueryResult.my?.givingFunds ?? {};
				console.log('giving', this.myGivingFunds);
			} catch (e) {
				logReadQueryError(e, 'MyKivaPage myKivaQuery');
			}
		},
	},
	created() {
		try {
			const uiSettingsQueryResult = this.apollo.readQuery({
				query: uiConfigSettingQuery,
				variables: {
					key: MY_KIVA_HERO_ENABLE_KEY,
				}
			});
			this.isHeroEnabled = readBoolSetting(uiSettingsQueryResult, 'general.uiConfigSetting.value');
			const nextStepsExpData = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'event-tracking',
				NEXT_STEPS_EXP_KEY,
				'EXP-MP-1984-Sept2025'
			);
			this.isNextStepsExp = nextStepsExpData.version === 'b';
			this.fetchMyKivaData();
			const achievementsResult = this.apollo.readQuery({
				query: userAchievementProgressQuery
			});
			this.heroTieredAchievements = achievementsResult.userAchievementProgress?.tieredLendingAchievements ?? [];
			if (this.isHeroEnabled || this.userLentToAllRegions || this.isNextStepsExp) {
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
			}
		} catch (e) {
			logReadQueryError(e, 'MyKivaPage myKivaPrefetch');
		}
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
	}
};
</script>
