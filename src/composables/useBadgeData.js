import { ref, computed } from 'vue';
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';
import logReadQueryError from '#src/util/logReadQueryError';

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
		levelName: entry?.fields?.challengeName ?? '',
		challengeName: (entry?.fields?.challengeName ?? '').replace(/\s*✨\d+✨/, ''),
		imageUrl: entry?.fields?.badgeImage?.fields?.file?.url ?? '',
	});

	/**
	 * Calls Apollo to get the badge achievement service data
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
		if (allAchievementData && allContentfulData) {
			// Currently only targeting specific tiered badges
			allAchievementData.forEach(achievementData => {
				const contentfulData = allContentfulData.filter(entry => entry.id === achievementData.id);

				// Ensure badges are defined in both locations
				if (achievementData && contentfulData) {
					const sortedTiers = [...(achievementData.tiers ?? [])].map((t, i) => {
						const tier = JSON.parse(JSON.stringify(t));
						// Ensure achievement data includes numerical level of tier
						tier.level = i + 1;
						return tier;
					});

					sortedTiers.sort((a, b) => a.target - b.target);

					// Get specific properties used in the UI
					const completedTiers = sortedTiers.filter(t => !!t.completedDate);
					const hasStarted = completedTiers.length > 0;
					const level = hasStarted ? completedTiers[completedTiers.length - 1].level : undefined;

					// Combine the achievement service and Contentful data
					badges.push({
						id: achievementData.id,
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
	 *   "contentfulData": [
	 *     {
	 *       "id": "",
	 *       "level": 1,
	 *       "levelName": "",
	 *       "imageUrl": ""
	 *     },
	 *     ...
	 *   ],
	 *   "achievementData": {
	 *     "id": "",
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

	return {
		fetchAchievementData,
		fetchContentfulData,
		combineBadgeData,
		getContentfulLevelData,
		getCurrentTierData,
		badgeAchievementData,
		badgeData
	};
}
