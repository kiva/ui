import { ref, computed } from 'vue';
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import { gql } from 'graphql-tag';

export const ID_WOMENS_EQUALITY = 'womens-equality';
export const ID_US_ECONOMIC_EQUALITY = 'us-economic-equality';
export const ID_CLIMATE_ACTION = 'climate-action';
export const ID_REFUGEE_EQUALITY = 'refugee-equality';
export const ID_BASIC_NEEDS = 'basic-needs';
export const US_ECONOMIC_EQUALITY_FILTER = 'country=PR,US';
export const CLIMATE_ACTION_FILTER = 'tag=9';
export const REFUGEE_EQUALITY_FILTER = 'attribute=28';
export const WOMENS_EQUALITY_FILTER = 'gender=female';
export const BASIC_NEEDS_FILTER = 'sector=6,10';

/**
 * Utilities for loading and combining tiered badge data
 *
 * @returns Badge data and utilities
 */
export default function useBadgeData() {
	const badgeAchievementData = ref();
	const badgeContentfulData = ref();
	const badgeLoanIdData = ref();

	/**
	 * Gets a cleaned up version of Contentful badge data
	 *
	 * @param entry The Contentful entry
	 * @returns The cleaned up Contentful badge data
	 */
	const getContentfulLevelData = entry => ({
		id: entry?.fields?.key?.replace(/-level-\d+/, '') ?? '',
		level: +(entry?.fields?.key?.replace(/\D/g, '') ?? ''),
		levelName: entry?.fields?.challengeName ?? '',
		challengeName: (entry?.fields?.challengeName ?? '').replace(/\s*✨\d+✨/, ''),
		imageUrl: entry?.fields?.badgeImage?.fields?.file?.url ?? '',
	});

	/**
	 * Calls Apollo to get the badge achievement service data
	 *
	 * @param apollo The current instance of Apollo
	 */
	const fetchAchievementData = apollo => {
		apollo.query({ query: userAchievementProgressQuery })
			.then(result => {
				badgeAchievementData.value = [
					...(result.data?.userAchievementProgress?.lendingAchievements ?? []),
					...(result.data?.userAchievementProgress?.tieredLendingAchievements ?? [])
				];
			}).catch(e => {
				logReadQueryError(e, 'useBadgeData userAchievementProgressQuery');
			});
	};

	/**
	 * Calls Apollo to get the badge Contentful data
	 *
	 * @param apollo The current instance of Apollo
	 */
	const fetchContentfulData = apollo => {
		apollo.query({
			query: contentfulEntriesQuery,
			variables: {
				contentType: 'challenge',
				limit: 200,
			}
		})
			.then(result => {
				badgeContentfulData.value = (result.data?.contentful?.entries?.items ?? [])
					.map(entry => getContentfulLevelData(entry));
			}).catch(e => {
				logReadQueryError(e, 'useBadgeData contentfulEntriesQuery');
			});
	};

	/**
	 * Calls Apollo to get the badge Contentful data
	 *
	 * @param apollo The current instance of Apollo
	 * @param combinedBadgeData The combined data for the badge
	 */
	const fetchLoanIdData = (apollo, combinedBadgeData) => {
		apollo.query({
			query: gql`query badgeLoanIds($filters: [FundraisingLoanSearchFilterInput!], $limit: Int!) {
				fundraisingLoans(filters: $filters, limit: $limit) {
					values {
						id
					}
				}
			}`,
			variables: {
				filters: combinedBadgeData.achievementData.matchingLoans.filters,
				limit: 6,
			}
		})
			.then(result => {
				badgeLoanIdData.value = (result?.data?.fundraisingLoans?.values ?? []).map(l => l.id);
			}).catch(e => {
				logReadQueryError(e, 'useBadgeData badgeLoanIds');
			});
	};

	/**
	 * Combines the badge data into a more usable form
	 *
	 * @param allAchievementData All of the data for the user from the achievement service
	 * @param allContentfulData All of the badge data from Contentful
	 * @returns Combined and cleaned up badge data
	 */
	const combineBadgeData = (allAchievementData, allContentfulData) => {
		const badges = [];

		// Ensure data loaded from both achievement service and Contentful
		if (allAchievementData?.length > 0 && allContentfulData?.length > 0) {
			// Currently only targeting specific tiered badges
			allAchievementData.forEach(achievementData => {
				const contentfulData = allContentfulData.filter(entry => entry.id === achievementData.id);

				// Ensure badges are defined in both locations
				if (achievementData && contentfulData.length > 0) {
					const sortedTiers = [...(achievementData.tiers ?? [])].map((t, i) => {
						const tier = JSON.parse(JSON.stringify(t));
						// Ensure achievement data includes numerical level of tier
						tier.level = i + 1;
						return tier;
					});

					sortedTiers.sort((a, b) => a.target - b.target);
					contentfulData.sort((a, b) => a.level - b.level);

					// Get specific properties used in the UI
					const completedTiers = sortedTiers.filter(t => !!t.completedDate);
					const hasStarted = completedTiers.length > 0;
					const level = hasStarted ? completedTiers[completedTiers.length - 1].level : undefined;

					// Combine the achievement service and Contentful data
					badges.push({
						id: achievementData.id,
						challengeName: contentfulData[0].challengeName,
						description: achievementData.description,
						contentfulData,
						achievementData: {
							...achievementData,
							tiers: sortedTiers.map(t => ({
								...t,
								// Date is in format "2024-10-22T18:49:21Z[UTC]"
								completedDate: t.completedDate?.replace('[UTC]', ''),
							})),
						},
						hasStarted,
						level,
					});
				}
			});
		}

		return badges;
	};

	/**
	 * Gets the current (incomplete) tier for the provided badge
	 *
	 * @param badge The badge to get the current tier for
	 * @returns The current tier of the badge
	 */
	const getCurrentTierData = badge => {
		let currentTier;
		badge.achievementData.tiers.forEach(t => {
			if (!currentTier) {
				currentTier = t;
			} else if (!!currentTier.completedDate && !t.completedDate) {
				currentTier = t;
			}
		});
		/**
		 * {
		 *   "id": "",
		 *   "challengeName": "",
		 *   "level": 1,
		 *   "levelName": "",
		 *   "imageUrl": "",
		 *   "target": 1,
		 *   "tierStatement": "",
		 *   "learnMoreURL": ""
		 * }
		 */
		return {
			...badge.contentfulData.find(t => t.level === currentTier.level),
			...currentTier,
		};
	};

	/**
	 * {
	 *   "id": "",
	 *   "challengeName": "",
	 *   "description": "",
	 *   "contentfulData": [
	 *     {
	 *       "id": "",
	 *       "level": 1,
	 *       "levelName": "",
	 *       "challengeName": "",
	 *       "imageUrl": ""
	 *     },
	 *     ...
	 *   ],
	 *   "achievementData": {
	 *     "id": "",
	 *     "totalProgressToAchievement": 0,
	 *     "matchingLoans": {
	 *       "filters": [],
	 *     },
	 *     "tiers": [
	 *       {
	 *         "target": 1,
	 *         "tierStatement": "",
	 *         "completedDate": null,
	 *         "learnMoreURL": "",
	 *         "level": 1
	 *       },
	 *       ...
	 *     ]
	 *   },
	 *   "hasStarted": false,
	 *   "level": undefined
	 * }
	 */
	const badgeData = computed(() => combineBadgeData(badgeAchievementData.value, badgeContentfulData.value));

	/**
	 * Gets the badge data with specific contentful and achievement data for the tier
	 *
	 * @param badge The badge to get the specific tier for
	 * @param level The numerical level of the tier to get
	 * @returns The badge data with specific contentful and achievement data for the tier
	 */
	const getTierBadgeDataByLevel = (badge, level) => {
		const tierIndex = badge?.achievementData?.tiers?.findIndex(t => t?.level === level);
		const achievementData = badge?.achievementData?.tiers?.[tierIndex];
		const contentfulData = badge?.contentfulData?.[tierIndex];

		return {
			...badge,
			contentfulData,
			achievementData,
		};
	};

	/**
	 * Gets the URL params of the badge to be used in lend/filter
	 *
	 * @param combineBadgeData The combined data for the badge
	 * @returns The URL params
	 */
	const getFilteredUrl = combinedBadgeData => {
		switch (combinedBadgeData.id) {
			case ID_WOMENS_EQUALITY:
				return WOMENS_EQUALITY_FILTER;
			case ID_US_ECONOMIC_EQUALITY:
				return US_ECONOMIC_EQUALITY_FILTER;
			case ID_CLIMATE_ACTION:
				return CLIMATE_ACTION_FILTER;
			case ID_REFUGEE_EQUALITY:
				return REFUGEE_EQUALITY_FILTER;
			case ID_BASIC_NEEDS:
			default:
				return BASIC_NEEDS_FILTER;
		}
	};

	return {
		fetchAchievementData,
		fetchContentfulData,
		fetchLoanIdData,
		combineBadgeData,
		getContentfulLevelData,
		getCurrentTierData,
		getTierBadgeDataByLevel,
		getFilteredUrl,
		badgeAchievementData,
		badgeData,
		badgeLoanIdData,
	};
}
