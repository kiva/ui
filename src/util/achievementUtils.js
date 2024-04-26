import achievementMilestonesQuery from '@/graphql/query/achievementMilestones.graphql';

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
 * achievementProgression
 * Check to see if the user has made progress towards an achievement,
 * if they have -- return the key of the first achievement they have progressed
 *
 * @param {Array} achievementsQueryResult The array of milestones from the request result from the achievementsQuery
 *
 * @returns {String} Achievement key
 */
export function achievementProgression(achievementsQueryResult = []) {
	// filter out all milestones by status
	// if any of the achievementMilestones have the status
	// "COMPLETABLE", or "NEW_PROGRESS" then we have progress
	// towards this achievement
	const achievementMilestones = achievementsQueryResult
		.filter(milestone => milestone.status === 'COMPLETABLE' || milestone.status === 'NEW_PROGRESS');

	// return the first achievement key or null
	return achievementMilestones.length > 0 ? achievementMilestones[0].achievement : null;
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
