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
			:is-lending-stats-exp="isLendingStatsExp"
			:user-lent-to-all-regions="userLentToAllRegions"
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
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import MyKivaPageContent from '#src/pages/MyKiva/MyKivaPageContent';

const LENDING_STATS_EXP_KEY = 'mykiva_lending_stats';

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
			isLendingStatsExp: false,
			lender: null,
			lendingStats: {},
			loans: [],
			totalLoans: 0,
			transactions: [],
			userInfo: {},
			userLentToAllRegions: false,
		};
	},
	apollo: {
		preFetch(config, client) {
			return Promise.all([
				client.query({ query: myKivaQuery }),
				client.query({ query: lendingStatsQuery }),
				client.query({ query: uiConfigSettingQuery, variables: { key: MY_KIVA_HERO_ENABLE_KEY } }),
				client.query({ query: experimentAssignmentQuery, variables: { id: LENDING_STATS_EXP_KEY } }),
			]).then(result => {
				const heroCarouselUiSetting = result[2];
				const isHeroEnabled = readBoolSetting(heroCarouselUiSetting, 'data.general.uiConfigSetting.value');
				const myKivaStatsExp = result[3];
				const isMyKivaStatsExp = myKivaStatsExp?.data?.experiment?.version === 'b';
				const statsResult = result[1]?.data || {};
				const countryFacets = statsResult.lend?.countryFacets ?? [];
				const countriesLentTo = statsResult.my?.lendingStats?.countriesLentTo ?? [];
				const { userLentToAllRegions } = getRegionsWithLoanStatus(countryFacets, countriesLentTo);
				if ((isHeroEnabled && !isMyKivaStatsExp) || userLentToAllRegions) {
					return Promise.all([
						client.query({
							query: contentfulEntriesQuery,
							variables: { contentType: 'carousel', contentKey: CONTENTFUL_CAROUSEL_KEY },
						}),
						client.query({
							query: contentfulEntriesQuery,
							variables: { contentType: 'challenge', limit: 200 }
						}),
						client.query({ query: userAchievementProgressQuery })
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
				this.userInfo = myKivaQueryResult.my ?? {};
				this.lender = myKivaQueryResult.my?.lender ?? null;
				this.lender = {
					...this.lender,
					public: this.userInfo.userAccount?.public ?? false,
					inviterName: this.userInfo.userAccount?.inviterName ?? null,
				};
				this.loans = myKivaQueryResult.my?.loans?.values ?? [];
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
			const lendingStatsExpData = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				LENDING_STATS_EXP_KEY,
				'EXP-MP-1729-Jul2025'
			);
			this.isLendingStatsExp = lendingStatsExpData.version === 'b';
			this.fetchMyKivaData();
			if ((this.isHeroEnabled && !this.isLendingStatsExp) || this.userLentToAllRegions) {
				const contentfulChallengeResult = this.apollo.readQuery({
					query: contentfulEntriesQuery,
					variables: { contentType: 'challenge', limit: 200 }
				});
				const achievementsResult = this.apollo.readQuery({
					query: userAchievementProgressQuery
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
				this.heroTieredAchievements = achievementsResult.userAchievementProgress?.tieredLendingAchievements ?? []; // eslint-disable-line max-len
			}
		} catch (e) {
			logReadQueryError(e, 'MyKivaPage myKivaPrefetch');
		}
	},
};
</script>
