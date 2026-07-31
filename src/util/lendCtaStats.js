/*
 * Pure helpers for the Lend CTA stats slot: which stats can show, which one
 * is displayed, and the rotation order.
 */

/**
 * Get the stats the slot can currently show, in display order.
 *
 * @param {object} inputs
 * @param {string} inputs.status - Loan status
 * @param {number} inputs.numLenders - Lender count for the loan
 * @param {string} inputs.matchingText - Matching partner text, empty when unmatched
 * @param {boolean} inputs.matchAtRisk - Whether the remaining amount can no longer cover a match
 * @param {boolean} inputs.multiMatchingResolved - Whether the multi matching setting has been read
 * @param {boolean} inputs.enableMultiMatching - The multi matching setting
 * @returns {string[]} Possible stats
 */
export function getPossibleStats({
	status,
	numLenders,
	matchingText,
	matchAtRisk,
	multiMatchingResolved,
	enableMultiMatching,
}) {
	const stats = [];
	if (status === 'fundraising' && numLenders > 0) {
		stats.push('lenderCount');
	}
	if (status === 'fundraising'
		&& !!matchingText
		&& !matchAtRisk
		&& multiMatchingResolved
		&& !enableMultiMatching) {
		stats.push('matchingText');
	}
	return stats;
}

/**
 * Get the stat to display: the cycled stat while it is still available,
 * otherwise the first available stat, so the slot never renders empty
 * between rotation ticks.
 *
 * @param {string[]} possibleStats - Stats from getPossibleStats
 * @param {string} currentStat - The cycled stat
 * @returns {string} The stat to display, or '' when there is nothing to show
 */
export function getDisplayedStat(possibleStats, currentStat) {
	return possibleStats.includes(currentStat) ? currentStat : (possibleStats[0] ?? '');
}

/**
 * Get the stat that follows the displayed one, wrapping around.
 *
 * @param {string[]} possibleStats - Stats from getPossibleStats
 * @param {string} displayedStat - Stat from getDisplayedStat
 * @returns {string} The next stat, or '' when there is nothing to show
 */
export function getNextStat(possibleStats, displayedStat) {
	if (!possibleStats.length) {
		return '';
	}
	const nextIndex = (possibleStats.indexOf(displayedStat) + 1) % possibleStats.length;
	return possibleStats[nextIndex];
}

/**
 * Get the stat the rotation should cycle to: the first call locks in the
 * displayed stat so it holds a full rotation interval, later calls advance.
 *
 * @param {string[]} possibleStats - Stats from getPossibleStats
 * @param {string} currentStat - The cycled stat, '' before any cycling
 * @returns {string} The stat to cycle to, or '' when there is nothing to show
 */
export function getNextSlotStat(possibleStats, currentStat) {
	if (!currentStat) {
		return getDisplayedStat(possibleStats, currentStat);
	}
	return getNextStat(possibleStats, getDisplayedStat(possibleStats, currentStat));
}
