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
