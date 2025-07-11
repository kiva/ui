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
		/>
	</www-page>
</template>

<script>
import { readBoolSetting } from '#src/util/settingsUtils';
import logReadQueryError from '#src/util/logReadQueryError';
import { CONTENTFUL_CAROUSEL_KEY, MY_KIVA_HERO_ENABLE_KEY, AVOID_TRANSACTION_LOANS_KEY } from '#src/util/myKivaUtils';
import myKivaQuery from '#src/graphql/query/myKiva.graphql';
import lendingStatsQuery from '#src/graphql/query/myLendingStats.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';
import uiConfigSettingQuery from '#src/graphql/query/uiConfigSetting.graphql';
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import MyKivaPageContent from '#src/pages/MyKiva/MyKivaPageContent';

/**
 * Options API parent needed to ensure WWwPage children options API preFetch works,
 * specifically for header component data preFetch
 */
export default {
	name: 'MyKivaPage',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		MyKivaPageContent,
	},
	data() {
		return {
			isHeroEnabled: false,
			userInfo: {},
			loans: [],
			totalLoans: 0,
			lender: null,
			heroContentfulData: [],
			heroTieredAchievements: [],
			lendingStats: {},
			transactions: [],
		};
	},
	apollo: {
		preFetch(config, client) {
			return Promise.all([
				client.query({ query: myKivaQuery }),
				client.query({ query: lendingStatsQuery }),
				client.query({ query: uiConfigSettingQuery, variables: { key: MY_KIVA_HERO_ENABLE_KEY } }),
			]).then(result => {
				const heroCarouselUiSetting = result[2];
				const isHeroEnabled = readBoolSetting(heroCarouselUiSetting, 'data.general.uiConfigSetting.value');

				if (isHeroEnabled) {
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
				const result = this.apollo.readQuery({ query: myKivaQuery });

				this.userInfo = result.my ?? {};
				this.lender = result.my?.lender ?? null;
				this.lender = {
					...this.lender,
					public: this.userInfo.userAccount?.public ?? false,
					inviterName: this.userInfo.userAccount?.inviterName ?? null,
				};

				const transactions = this.userInfo?.transactions?.values?.filter(t => {
					return t.type !== AVOID_TRANSACTION_LOANS_KEY;
				});

				this.loans = transactions?.map(t => t.loan) ?? [];
				this.totalLoans = result.my?.loans?.totalCount ?? 0;

				const statsResult = this.apollo.readQuery({ query: lendingStatsQuery });

				this.lendingStats = {
					...statsResult.my?.lendingStats,
					...statsResult.my?.userStats,
				};
				this.transactions = result.my?.transactions?.values ?? [];
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

			if (this.isHeroEnabled) {
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

		this.fetchMyKivaData();
	},
};
</script>
