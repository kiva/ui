import { onMounted, ref, computed } from 'vue';
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import { defaultBadges } from '#src/util/achievementUtils';

/**
 * Utilities for loading and combining tiered badge data
 *
 * @param apollo The current Apollo client instance
 * @returns Cleaned up tiered badge data
 */
export default function useBadgeData(apollo) {
	const badgeAchievementData = ref();
	const badgeContentfulData = ref();

	const getContentfulLevelData = entry => ({
		id: entry?.fields?.key?.replace(/-level-\d+/, '') ?? '',
		level: +(entry?.fields?.key?.replace(/\D/g, '') ?? ''),
		levelName: entry?.fields?.challengeName ?? '',
		imageUrl: entry?.fields?.badgeImage?.fields?.file?.url ?? '',
	});

	const fetchAchievementData = () => {
		apollo.query({ query: userAchievementProgressQuery })
			.then(result => {
				badgeAchievementData.value = result.data?.userAchievementProgress?.tieredLendingAchievements ?? [];
			}).catch(e => {
				logReadQueryError(e, 'useBadgeData userAchievementProgressQuery');
			});
	};

	const fetchContentfulData = () => {
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
	const badgeData = computed(() => {
		const badges = [];

		// Ensure data loaded from both achievement service and Contentful
		if (badgeAchievementData.value && badgeContentfulData.value) {
			// Currently only targeting specific tiered badges
			defaultBadges.forEach(badgeKey => {
				const achievementData = badgeAchievementData.value.find(entry => entry.id === badgeKey);
				const contentfulData = badgeContentfulData.value.filter(entry => entry.id === badgeKey);

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
						contentfulData,
						achievementData: {
							...achievementData,
							tiers: sortedTiers,
						},
						hasStarted,
						level,
					});
				}
			});
		}
		return badges;
	});

	onMounted(() => {
		fetchAchievementData();
		fetchContentfulData();
	});

	return { badgeAchievementData, badgeData };
}
