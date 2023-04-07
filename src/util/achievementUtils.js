import achievementMilestonesQuery from '@/graphql/query/achievementMilestones.graphql';

export const EARTHDAY_23_CHALLENGE_KEY = 'earthday-23-challenge';
export const IWD_CHALLENGE_KEY = 'iwd-challenge';
export const CLIMATE_CHALLENGE_KEY = 'climate-challenge';

/**
 * achievementsQuery query
 * Checks for Challenge Achievement status
 *
 * @param {Object} apollo Apollo Client instance
 * @param {Object} loanIdsArray Array of loan ids as ints
 *
 * @returns {Promise}
 */
export function achievementsQuery(apollo, loanIdsArray) {
	// Convert array of loan ids to array of strings
	const loanIds = loanIdsArray.map(loanId => loanId.toString());
	// Fetch FTD Status
	return apollo.query({
		query: achievementMilestonesQuery,
		variables: {
			loanIds
		}
	});
}

/**
 * achievementsQueryFromCache query
 * Checks for Challenge Achievement status
 *
 * @param {Object} apollo Apollo Client instance
 * @param {Object} loanIdsArray Array of loan ids as ints
 *
 * @returns {Promise}
 */
export function achievementsQueryFromCache(apollo, loanIdsArray) {
	// Convert array of loan ids to array of strings
	const loanIds = loanIdsArray.map(loanId => loanId.toString());
	// Fetch FTD Status
	return apollo.readQuery({
		query: achievementMilestonesQuery,
		variables: {
			loanIds
		}
	});
}

/**
 * hasMadeAchievementsProgression
 * Checks for Challenge Achievement status
 *
 * @param {Array} achievementsQueryResult The array of milestones from the request result from the achievementsQuery
 * @param {Object} achievementName String of achievement name as stored in the achievement service
 *
 * @returns {Boolean} Does this query result represent progress towards this achievement?
 */
export function hasMadeAchievementsProgression(achievementsQueryResult = [], achievementName = '') {
	// filter out all achievements by achievementName
	const achievementMilestones = achievementsQueryResult
		.filter(milestone => milestone.achievement === achievementName);

	// If any of the achievementMilestones have the status
	// "COMPLETABLE", or "NEW_PROGRESS" then we have progress
	// towards this achievement
	return achievementMilestones
		.some(milestone => milestone.status === 'COMPLETABLE' || milestone.status === 'NEW_PROGRESS');
}

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
