import { ref, computed } from 'vue';
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import { gql } from 'graphql-tag';
import { defaultBadges } from '#src/util/achievementUtils';

export const ID_EQUITY = 'equity';
export const ID_WOMENS_EQUALITY = 'womens-equality';
export const ID_US_ECONOMIC_EQUALITY = 'us-economic-equality';
export const ID_CLIMATE_ACTION = 'climate-action';
export const ID_REFUGEE_EQUALITY = 'refugee-equality';
export const ID_BASIC_NEEDS = 'basic-needs';
export const US_ECONOMIC_EQUALITY_FILTER = 'country=PR,US';
export const CLIMATE_ACTION_FILTER = 'tag=8,9';
export const REFUGEE_EQUALITY_FILTER = 'attribute=28';
export const WOMENS_EQUALITY_FILTER = 'gender=female';
export const BASIC_NEEDS_FILTER = 'sector=6,10';
export const MY_IMPACT_JOURNEYS_ID = 'my-impact-journeys';
export const MY_ACHIEVEMENTS_ID = 'my-achievements';

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
		levelName: entry?.fields?.levelName ?? '',
		challengeName: entry?.fields?.challengeName ?? '',
		imageUrl: entry?.fields?.badgeImage?.fields?.file?.url ?? '',
		shareFact: entry?.fields?.shareFact ?? '',
		shareFactFootnote: entry?.fields?.shareFactFootnote ?? '',
		shareFactUrl: entry?.fields?.shareFactUrl ?? '',
	});

	/**
	 * Calls Apollo to get the badge achievement service data
	 *
	 * @param apollo The current instance of Apollo
	 * @param publicId Whether to get achievement data for a specific user
	 */
	const fetchAchievementData = (apollo, publicId = null) => {
		apollo.query({ query: userAchievementProgressQuery, variables: { publicId } })
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
					const hasStarted = completedTiers.length > 0 || achievementData?.totalProgressToAchievement > 0;
					const level = hasStarted ? completedTiers?.[completedTiers.length - 1]?.level : undefined;

					// Clean up milestone progress date format
					const { milestoneProgress } = achievementData;
					const milestoneProgressArr = milestoneProgress?.map(m => ({
						...m,
						// Date is in format "2024-10-22T18:49:21Z[UTC]"
						earnedAtDate: m.earnedAtDate?.replace('[UTC]', ''),
					}));

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
							milestoneProgress: milestoneProgressArr,
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
	 * Gets the active (inprogress or completed final) tier for the provided badge
	 *
	 * @param badge The badge to get the active tier for
	 * @returns The active tier of the badge
	 */
	const getActiveTierData = badge => {
		const levelIndex = (badge.level === badge.achievementData.tiers.length ? badge.level - 1 : badge.level) ?? 0;
		const currentTier = badge.achievementData.tiers[levelIndex];
		/**
		 * {
		 *   "id": "",
		 *   "challengeName": "",
		 *   "level": 1,
		 *   "levelName": "",
		 *   "shareFact": "",
		 *   "shareFactFootnote": "",
		 *   "shareFactUrl": "",
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
	 *       "shareFact": "",
	 *       "shareFactFootnote": "",
	 *       "shareFactUrl": "",
	 *       "challengeName": "",
	 *       "imageUrl": ""
	 *     },
	 *     ...
	 *   ],
	 *   "achievementData": {
	 *     "id": "",
	 *     "description": "",
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
	 * Returns the formatted name for the provided Contentful data
	 *
	 * @param contentfulData The Contentful data for the badge and/or badge level
	 * @returns Formatted badge and/or badge level name
	 */
	const getLevelName = contentfulData => {
		const levelText = contentfulData?.levelName ? ` (level ${contentfulData?.levelName})` : '';
		const challengeName = contentfulData?.challengeName ?? '';
		return levelText ? `${challengeName}${levelText}` : challengeName;
	};

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
		const contentfulData = badge?.contentfulData?.[tierIndex]
			// The TY page provides a badge object with a single contentfulData property
			|| (typeof badge?.contentfulData?.length === 'undefined' ? badge.contentfulData : undefined);

		return {
			...badge,
			contentfulData,
			achievementData,
			tierName: getLevelName(contentfulData) || badge.challengeName,
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

	/**
	 * Gets the badge data visible tiers to ensure the user doesn't get overwhelmed
	 *
	 * @param combinedBadgeData The combined data for the badge
	 * @returns The badge data with tiers to show to the user
	 */
	const getBadgeWithVisibleTiers = combinedBadgeData => {
		const currentTier = getActiveTierData(combinedBadgeData);
		const visibleData = JSON.parse(JSON.stringify(combinedBadgeData));

		if (currentTier.level < 4) {
			visibleData.contentfulData.splice(3);
			visibleData.achievementData.tiers.splice(3);
		} else if (currentTier.level > 3 && currentTier.level < 6) {
			visibleData.contentfulData.splice(5);
			visibleData.achievementData.tiers.splice(5);
		}

		return visibleData;
	};

	/**
	 * Get the badge key and check if it has a valid format
	 *
	 * @param badgeKey The badge key to validate
	 * @returns Whether the badge key is valid or not
	 */
	const isBadgeKeyValid = badgeKey => {
		return badgeKey.includes('badge_')
			&& badgeKey.includes('social_share')
			&& defaultBadges.some(
				badgeName => badgeKey.includes(badgeName)
			);
	};

	/**
	 * Gets the last completed level of the provided badge
	 *
	 * @param badge The data of the badge
	 * @returns The last completed level
	 */
	const getLastCompletedBadgeLevelData = badge => {
		if (badge?.achievementData?.milestoneProgress?.length) {
			const earnedAtDate = badge.achievementData?.milestoneProgress?.[0]?.earnedAtDate;
			if (earnedAtDate) {
				const contentfulData = badge.contentfulData?.[0] ?? {};
				return {
					...badge,
					contentfulData,
					levelName: getLevelName(contentfulData),
				};
			}
		} else if (badge?.achievementData?.tiers?.length) {
			const tiers = JSON.parse(JSON.stringify(badge.achievementData.tiers));
			// Sort by completed date descending
			tiers.sort((a, b) => {
				// Handle when tiers were achieved at the same time
				if (a.completedDate === b.completedDate) {
					return b.level - a.level;
				}
				return new Date(b.completedDate) - new Date(a.completedDate);
			});
			const levelIndex = tiers[0].level - 1;
			const contentfulData = badge.contentfulData[levelIndex];
			return {
				...badge,
				contentfulData,
				achievementData: tiers[0],
				levelName: getLevelName(contentfulData),
			};
		}
		return {};
	};

	/**
	 * Gets the highest priority badge for displaying to the user
	 *
	 * @param badges The badges to get the highest priority badge from
	 * @returns The highest priority badge
	 */
	const getHighestPriorityDisplayBadge = badges => {
		const badgeOrder = [
			ID_EQUITY,
			ID_WOMENS_EQUALITY,
			ID_US_ECONOMIC_EQUALITY,
			ID_BASIC_NEEDS,
			ID_CLIMATE_ACTION,
			ID_REFUGEE_EQUALITY
		];
		let displayedBadge;
		if (badges?.length) {
			const sortedBadges = JSON.parse(JSON.stringify(badges));
			sortedBadges.sort((a, b) => badgeOrder.indexOf(a.id) - badgeOrder.indexOf(b.id));
			for (let i = 0; i < sortedBadges.length; i += 1) {
				const badge = sortedBadges[i];
				if (!displayedBadge || (badge.level ?? 1) > displayedBadge.level) {
					displayedBadge = badge;
				}
			}
		}
		return displayedBadge ?? {};
	};

	/**
	 * Get completed badges of a user
	 *
	 * @param badges The badges to get the completed badges from
	 * @returns Completed badges
	 */
	const getCompletedBadges = badges => {
		const completedBadgesArr = [];

		badges?.forEach(badge => {
			if (badge?.achievementData?.tiers?.length) {
				const { tiers } = badge.achievementData;
				tiers.forEach(tier => {
					if (tier.completedDate) {
						completedBadgesArr.push({
							...badge,
							earnedAtDate: tier.completedDate,
							level: tier.level,
						});
					}
				});
			}
			if (badge?.achievementData?.milestoneProgress?.length) {
				const earnedAtDate = badge.achievementData?.milestoneProgress?.[0]?.earnedAtDate;
				if (earnedAtDate) {
					completedBadgesArr.push({
						...badge,
						earnedAtDate,
						level: 0,
					});
				}
			}
		});

		return completedBadgesArr;
	};

	/**
	 * Get completed badges sorted by earned date
	 *
	 * @returns Completed badges sorted by earned date
	 */
	const completedBadges = computed(() => {
		const completedBadgesArr = getCompletedBadges(badgeData.value);

		completedBadgesArr.sort((a, b) => {
			return new Date(a.earnedAtDate) - new Date(b.earnedAtDate);
		});

		return completedBadgesArr;
	});

	return {
		fetchAchievementData,
		fetchContentfulData,
		fetchLoanIdData,
		combineBadgeData,
		getContentfulLevelData,
		getActiveTierData,
		getTierBadgeDataByLevel,
		getFilteredUrl,
		getBadgeWithVisibleTiers,
		getLastCompletedBadgeLevelData,
		getHighestPriorityDisplayBadge,
		getCompletedBadges,
		badgeAchievementData,
		badgeContentfulData,
		badgeData,
		badgeLoanIdData,
		isBadgeKeyValid,
		completedBadges,
		getLevelName,
	};
}
