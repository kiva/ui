import { ref, computed } from 'vue';
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import { defaultBadges } from '#src/util/achievementUtils';

export const ID_EQUITY = 'equity';
export const ID_WORLD_REFUGEE_DAY_24 = 'wrd-2024-challenge';
export const ID_WORLD_REFUGEE_DAY = 'wrd-23-challenge';
export const ID_EARTH_DAY = 'earthday-23-challenge';
export const ID_EARTH_DAY_24 = 'earth-day-2024-challenge';
export const ID_IWD = 'iwd-challenge';
export const ID_IWD_24 = 'iwd-2024-challenge';
export const ID_CLIMATE = 'climate-challenge';
export const ID_ROAD_3BB = '2BB-23-Roadto3BB';
export const ID_2BB = '2BB-23-Thanks';
export const ID_WOMENS_EQUALITY = 'womens-equality';
export const ID_US_ECONOMIC_EQUALITY = 'us-economic-equality';
export const ID_CLIMATE_ACTION = 'climate-action';
export const ID_REFUGEE_EQUALITY = 'refugee-equality';
export const ID_BASIC_NEEDS = 'basic-needs';
export const ID_SUPPORT_ALL = 'support-all';
export const FILTERS = {
	[ID_WOMENS_EQUALITY]: { gender: ['female'] },
	[ID_US_ECONOMIC_EQUALITY]: { country: ['PR', 'US'] },
	[ID_CLIMATE_ACTION]: { tag: ['8', '9'] },
	[ID_REFUGEE_EQUALITY]: { attribute: ['28'] },
	[ID_BASIC_NEEDS]: { sector: ['6', '10', '20', '21'] },
};
export const CATEGORIES = {
	[ID_WOMENS_EQUALITY]: 'women',
	[ID_US_ECONOMIC_EQUALITY]: 'kiva-u-s',
	[ID_CLIMATE_ACTION]: 'eco-friendly',
	[ID_REFUGEE_EQUALITY]: 'refugees-and-i-d-ps',
	[ID_BASIC_NEEDS]: 'basic-needs',
};

export const CATEGORY_TARGETS = {
	[ID_WOMENS_EQUALITY]: 'woman',
	[ID_US_ECONOMIC_EQUALITY]: 'entrepreneur',
	[ID_CLIMATE_ACTION]: 'person',
	[ID_REFUGEE_EQUALITY]: 'refugee',
	[ID_BASIC_NEEDS]: 'person',
	[ID_SUPPORT_ALL]: 'person',
};

export const MAX_TIERED_BADGE_LOANS = 100;

const COUNTRIES_ISO_CODE = ['PR', 'US'];
const WOMENS_EQUALITY_FILTER = 'female';
const REFUGEE_THEME = 'refugees/displaced';
const BASIC_NEEDS_SECTORS = [6, 10, 20, 21];
const BASIC_NEEDS_THEME = 'water and sanitation';
const CLIMATE_ACTION_THEME = 'clean energy';
const CLIMATE_ACTION_TAGS = ['#eco-friendly', '#sustainable ag'];

/**
 * Get journeys by loan using defined search filters in vue-admin
 *
 * @param loan The loan to filter
 * @returns The journeys by loan array
 */
export const getJourneysByLoan = loan => {
	const journeys = [];

	if (COUNTRIES_ISO_CODE.includes(loan?.geocode?.country?.isoCode)) {
		journeys.push(ID_US_ECONOMIC_EQUALITY);
	}

	if (loan?.gender === WOMENS_EQUALITY_FILTER) {
		journeys.push(ID_WOMENS_EQUALITY);
	}

	if (loan?.themes?.some(theme => theme?.toLowerCase() === REFUGEE_THEME)) {
		journeys.push(ID_REFUGEE_EQUALITY);
	}

	// eslint-disable-next-line max-len
	if (BASIC_NEEDS_SECTORS.includes(loan?.sector?.id) || loan?.themes?.some(theme => theme?.toLowerCase() === BASIC_NEEDS_THEME)) {
		journeys.push(ID_BASIC_NEEDS);
	}

	// eslint-disable-next-line max-len
	if (loan?.tags?.some(tag => CLIMATE_ACTION_TAGS.includes(tag?.toLowerCase())) || loan?.themes?.some(theme => theme?.toLowerCase() === CLIMATE_ACTION_THEME)) {
		journeys.push(ID_CLIMATE_ACTION);
	}

	return journeys;
};

/**
 * Calculates fresh progress adjustments by comparing carousel loans with achievement service loans
 *
 * @param loans Array of carousel loans to check against achievement service
 * @param tieredAchievements Array of tiered achievements from achievement service
 * @returns Map of badgeId to count of missing loans (all-time progress only)
 */
export const calculateFreshProgressAdjustments = (loans, tieredAchievements) => {
	if (!loans?.length || !tieredAchievements?.length) {
		return {};
	}

	// Get loan IDs that achievement service already knows about
	const achievementServiceLoanIds = new Set();
	tieredAchievements.forEach(achievement => {
		const loanPurchases = achievement.loanPurchases || [];
		loanPurchases.forEach(purchase => {
			if (purchase?.loan?.id) {
				achievementServiceLoanIds.add(purchase.loan.id);
			}
		});
	});

	// Find carousel loans that are NOT in achievement service
	const missingLoans = loans.filter(loan => loan?.id && !achievementServiceLoanIds.has(loan.id));

	// Count missing loans by category (all-time only for badges)
	const adjustments = {};

	missingLoans.forEach(loan => {
		if (!loan) return;

		const journeys = getJourneysByLoan(loan);
		journeys.forEach(journeyId => {
			adjustments[journeyId] = (adjustments[journeyId] || 0) + 1;
		});
	});

	return adjustments;
};

/**
 * Utilities for loading and combining tiered badge data
 *
 * @returns Badge data and utilities
 */
export default function useBadgeData() {
	const badgeAchievementData = ref();
	const badgeContentfulData = ref();

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
	 * @returns Promise that resolves when data is loaded
	 */
	const fetchAchievementData = async (apollo, publicId = null) => {
		try {
			const result = await apollo.query({
				query: userAchievementProgressQuery,
				variables: { publicId },
				fetchPolicy: 'network-only'
			});
			badgeAchievementData.value = [
				...(result.data?.userAchievementProgress?.lendingAchievements ?? []),
				...(result.data?.userAchievementProgress?.tieredLendingAchievements ?? [])
			];
		} catch (e) {
			logReadQueryError(e, 'useBadgeData userAchievementProgressQuery');
		}
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
		 *   "id": string,
		 *   "challengeName": string,
		 *   "level": number,
		 *   "levelName": string,
		 *   "shareFact": string,
		 *   "shareFactFootnote": string,
		 *   "shareFactUrl": string,
		 *   "imageUrl": string,
		 *   "target": number,
		 *   "tierStatement": string,
		 *   "learnMoreURL": string,
		 *   "completedDate": string,
		 * }
		 */
		return {
			...badge.contentfulData.find(t => t.level === currentTier?.level),
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
			// Fallback shouldn't be used but added just in case
			tierName: getLevelName(contentfulData) || badge.challengeName,
		};
	};

	/**
	 * Returns the loan finding URL for the provided badge and current route
	 *
	 * @param badgeId The ID of the badge
	 * @param currentRoute The current route
	 * @returns The URL for loan finding
	 */
	const getLoanFindingUrl = (badgeId, currentRoute) => {
		const FILTER_PAGE = '/lend/filter';
		const categorySlug = CATEGORIES[badgeId] || '';
		const CATEGORY_PAGE = categorySlug ? `/lend-by-category/${categorySlug}` : FILTER_PAGE;
		const routePath = currentRoute?.path;

		if (routePath === CATEGORY_PAGE) {
			return undefined;
		}

		if (routePath === FILTER_PAGE) {
			const routeQuery = JSON.parse(JSON.stringify(currentRoute?.query ?? {}));
			const filters = FILTERS[badgeId];

			Object.keys(filters).forEach(key => { routeQuery[key] = filters[key]; });

			return `${FILTER_PAGE}?${new URLSearchParams(routeQuery).toString()}`;
		}

		return CATEGORY_PAGE;
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

	/**
	 * Get explanation for an earned badge
	 *
	 * @param badgeId The Id of the badge
	 * @param target The badge tier target
	 * @returns reason for a completed badge
	 */
	const getEarnedBadgeExplanation = (badgeId, target) => {
		switch (badgeId) {
			case ID_WOMENS_EQUALITY:
				return `for helping ${target} women`;
			case ID_CLIMATE_ACTION:
				return `for helping ${target} climate stewards with eco-friendly projects`;
			case ID_US_ECONOMIC_EQUALITY:
				return `for helping ${target} people in the United States or Puerto Rico`;
			case ID_BASIC_NEEDS:
				return `for helping ${target} people in need of housing, healthcare, clean water or sanitation`;
			case ID_REFUGEE_EQUALITY:
				return `for helping ${target} refugees or displaced people`;
			case ID_EQUITY:
				return 'for helping your first person on kiva';
			case ID_WORLD_REFUGEE_DAY:
			case ID_WORLD_REFUGEE_DAY_24:
				return 'for helping a refugee on world refugee day';
			case ID_EARTH_DAY:
			case ID_EARTH_DAY_24:
				return 'for contributing to a climate project on earth day';
			case ID_IWD:
			case ID_IWD_24:
				return 'for helping a woman on international women’s day';
			case ID_CLIMATE:
				return 'for contributing to 3 eco-friendly projects';
			case ID_ROAD_3BB:
				return 'for helping us kickstart our goal to reach $3b in total impact';
			case ID_2BB:
				return 'for helping us reach $2b in total impact';
			default:
				return '';
		}
	};

	/**
	 * Applies fresh progress adjustments to achievement data array
	 *
	 * @param achievements The achievements array to adjust
	 * @param freshProgressAdjustments Map of badgeId to progress adjustment count
	 * @returns The adjusted achievements array (new array with modified copies)
	 */
	const applyFreshProgressAdjustments = (achievements, freshProgressAdjustments) => {
		if (!achievements?.length || !freshProgressAdjustments || Object.keys(freshProgressAdjustments).length === 0) {
			return achievements?.map(a => ({ ...a })) || [];
		}

		// Create mutable copies and apply adjustments
		// Apollo cache objects are read-only, so we need to create new objects
		return achievements.map(achievement => {
			// Only apply adjustments to tiered achievements (which have totalProgressToAchievement)
			// Regular lendingAchievements don't have this field and shouldn't be adjusted
			const adjustment = freshProgressAdjustments[achievement.id];
			if (adjustment && achievement.totalProgressToAchievement !== undefined) {
				const currentProgress = achievement.totalProgressToAchievement || 0;
				const newProgress = currentProgress + adjustment;
				// Return new object with adjusted progress (all-time only)
				return {
					...achievement,
					totalProgressToAchievement: newProgress
				};
			}
			// Return copy of achievement without adjustments
			return { ...achievement };
		});
	};

	/**
	 * Updates the existing badge data with fresh progress adjustments from loans not yet in achievement service
	 *
	 * @param loans Array of carousel loans to check for missing progress
	 * @param tieredAchievements Array of tiered achievements from achievement service
	 * @returns The calculated adjustments object (map of badgeId to count)
	 */
	const updateBadgeDataWithFreshProgress = (loans, tieredAchievements) => {
		if (!loans?.length || !tieredAchievements?.length || !badgeAchievementData.value?.length) {
			return {};
		}

		// Calculate fresh progress adjustments (all-time only)
		const adjustments = calculateFreshProgressAdjustments(loans, tieredAchievements);

		// Apply adjustments to existing badge data
		if (Object.keys(adjustments).length > 0) {
			badgeAchievementData.value = applyFreshProgressAdjustments(badgeAchievementData.value, adjustments);
		}

		return adjustments;
	};

	/**
	 * Get badge headline
	 *
	 * @param badge The badge to filter loans by
	 * @returns badge headline
	 */
	const getTierBadgeHeadline = badgeId => {
		switch (badgeId) {
			case ID_WOMENS_EQUALITY:
				return 'lending to women';
			case ID_CLIMATE_ACTION:
				return 'supporting climate solutions';
			case ID_US_ECONOMIC_EQUALITY:
				return 'lending to U.S entrepreneurs';
			case ID_BASIC_NEEDS:
				return 'supporting basic needs';
			case ID_REFUGEE_EQUALITY:
				return 'lending to refugees';
			default:
				return 'lending';
		}
	};

	/**
	 * Get caption for the level of the tier
	 *
	 * @param tier The tier to get the caption for
	 * @returns The caption for the level of the tier
	 */
	const getLevelCaption = tier => {
		switch (tier.level) {
			case 1:
				return 'One';
			case 2:
				return 'Two';
			case 3:
				return 'Three';
			case 4:
				return 'Four';
			case 5:
				return 'Five';
			case 6:
				return 'Six';
			case 7:
				return 'Seven';
			case 8:
				return 'Eight';
			case 9:
				return 'Nine';
			case 10:
				return 'Ten';
			default:
				return tier.level;
		}
	};

	/**
	 * Get all categories loan count with totalProgressToAchievement
	 *
	 * @param tieredLendingAchievements The tiered lending achievements with loans
	 * @returns An object mapping category IDs to their loan counts
	 */
	const getAllCategoryLoanCounts = tieredLendingAchievements => {
		return tieredLendingAchievements?.reduce((acc, curr) => {
			acc[curr.id] = curr.totalProgressToAchievement ?? 0;
			return acc;
		}, {}) ?? {
			[ID_WOMENS_EQUALITY]: 0,
			[ID_US_ECONOMIC_EQUALITY]: 0,
			[ID_BASIC_NEEDS]: 0,
			[ID_CLIMATE_ACTION]: 0,
			[ID_REFUGEE_EQUALITY]: 0,
		};
	};

	/**
	 * Check if all achievements are completed
	 *
	 * @param badges The badges to check
	 * @returns Whether all achievements are completed
	 */
	const allAchievementsCompleted = badges => {
		if (!badges?.length) {
			return false;
		}
		const tieredBadges = badges.filter(badge => badge?.tiers?.length);
		return tieredBadges.every(badge => {
			const tiers = badge?.tiers;
			if (tiers?.length) {
				return tiers.every(tier => !!tier.completedDate);
			}
			return false;
		});
	};

	return {
		badgeAchievementData,
		badgeContentfulData,
		badgeData,
		combineBadgeData,
		completedBadges,
		fetchAchievementData,
		fetchContentfulData,
		getActiveTierData,
		getCompletedBadges,
		getContentfulLevelData,
		getEarnedBadgeExplanation,
		getHighestPriorityDisplayBadge,
		getLastCompletedBadgeLevelData,
		getLevelName,
		getLoanFindingUrl,
		getTierBadgeDataByLevel,
		getTierBadgeHeadline,
		ID_SUPPORT_ALL,
		ID_BASIC_NEEDS,
		ID_CLIMATE_ACTION,
		ID_REFUGEE_EQUALITY,
		ID_US_ECONOMIC_EQUALITY,
		ID_WOMENS_EQUALITY,
		isBadgeKeyValid,
		getLevelCaption,
		getAllCategoryLoanCounts,
		allAchievementsCompleted,
		updateBadgeDataWithFreshProgress,
	};
}
