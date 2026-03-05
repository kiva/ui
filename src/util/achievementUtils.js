import { getRichTextUiSettingsData } from '#src/util/myKiva/myKivaContentfulUtils';

/**
 * Challenge keys from Contentful
 */
const WOMEN_KEY = 'womens-equality';
const US_EQUALITY_KEY = 'us-economic-equality';
const CLIMATE_KEY = 'climate-action';
const REFUGEE_KEY = 'refugee-equality';
const BASIC_NEEDS_KEY = 'basic-needs';

export const defaultBadges = [
	WOMEN_KEY,
	US_EQUALITY_KEY,
	BASIC_NEEDS_KEY,
	CLIMATE_KEY,
	REFUGEE_KEY,
];

/**
 * missingMilestones
 * Returns what a user needs to complete the achievement AFTER this checkout
 *
 * @param {Array} achievementsQueryResult The array of milestones from the request result from the achievementsQuery
 * @param {Object} achievementName String of achievement name as stored in the achievement service
 *
 * @returns {array} Array of milestones still needed
 */
export function missingMilestones(achievementsQueryResult = [], achievementName = '') {
	// filter out all achievements by achievementName
	const achievementMilestones = achievementsQueryResult
		.filter(milestone => milestone.achievement === achievementName);

	// filter out all milestones that have been completed in the past or will be complete after this checkout
	const missingMilestonesArray = achievementMilestones
		.filter(milestone => milestone.status !== 'COMPLETABLE' && milestone.status !== 'ALREADY_COMPLETE');

	return missingMilestonesArray;
}

/**
 * Checks if a slide is a non-badge slide (i.e. not one of the default achievement badges)
 *
 * @param {Object} slide The contentful slide object
 * @returns {Boolean} True if the slide is NOT a badge slide
 */
export const isNonBadgeSlide = slide => {
	const data = getRichTextUiSettingsData(slide);
	return !defaultBadges.includes(data.achievementKey);
};

/**
 * Build achievement slides from badge data and contentful slides
 *
 * @param {Object} options
 * @param {Array} options.badgesData - Combined badge + contentful data (from combineBadgeData)
 * @param {Array} options.slides - Contentful carousel slides
 * @param {Boolean} options.includeMilestoneDiff - Whether to include milestoneDiff
 * @param {Function} options.isTieredAchievementComplete - From useBadgeData
 * @param {Function} options.getActiveTierData - From useBadgeData
 * @returns {Array} Achievement slide objects
 */
export const buildAchievementSlides = ({
	badgesData,
	slides,
	getActiveTierData,
	isTieredAchievementComplete,
	includeMilestoneDiff = false,
	sortByMilestoneDiff = false,
}) => {
	const achievementSlides = [];
	defaultBadges.forEach(badgeKey => {
		const achievementContent = (badgesData ?? []).find(achievement => badgeKey === achievement.id);
		if (!achievementContent) return;
		if (isTieredAchievementComplete(achievementContent.achievementData)) return;

		const tier = getActiveTierData(achievementContent);
		if (!tier?.target) return;

		const contentfulData = achievementContent.contentfulData.find(cData => cData.level === tier.level);
		const slideData = slides.find(slide => {
			return getRichTextUiSettingsData(slide)?.achievementKey === badgeKey;
		});

		if (slideData) {
			achievementSlides.push({
				...slideData,
				...(includeMilestoneDiff && {
					milestoneDiff: Math.max(
						tier.target - (achievementContent.achievementData?.totalProgressToAchievement ?? 0),
						0
					),
				}),
				target: tier.target,
				totalProgressToAchievement: achievementContent.achievementData?.totalProgressToAchievement,
				badgeImgUrl: contentfulData?.imageUrl,
				badgeKey,
			});
		}
	});

	if (sortByMilestoneDiff) {
		achievementSlides.sort((a, b) => a.milestoneDiff - b.milestoneDiff);
	}

	return achievementSlides;
};
