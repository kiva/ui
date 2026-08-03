/**
 * Sector-distribution helpers for GoalInReviewSlide3's "Sectors Funded" donut.
 *
 * Source data is `userAchievementProgress.tieredLendingAchievements`, where each
 * achievement holds `loanPurchases[].loan.sector`. A single loan can appear under
 * multiple achievements, so loans are de-duplicated by id before grouping.
 */

/** Bucket label for loans whose sector is null/missing. */
export const OTHER_SECTOR_LABEL = 'Other';

/**
 * Groups tiered lending achievements into chart-ready sector values.
 *
 * Loans are de-duplicated by id and grouped by `loan.sector.name`. Loans with no
 * sector are collapsed into an "Other" bucket, appended last and labelled with
 * its loan count (e.g. "Other (3)"); `isOther` flags it so the headline count can
 * exclude it regardless of the display label. The value is the loan count per
 * sector. Note: KvPieChartV2 re-sorts segments by value for display.
 *
 * @param {Array} tieredLendingAchievements Achievements with nested loanPurchases.
 * @returns {Array<{label: string, value: number, isOther?: boolean}>} Sector entries.
 */
export function getSectorChartValues(tieredLendingAchievements = []) {
	const sectorCounts = new Map();
	const seenLoanIds = new Set();
	let otherCount = 0;

	(tieredLendingAchievements ?? []).forEach(achievement => {
		(achievement?.loanPurchases ?? []).forEach(purchase => {
			const loan = purchase?.loan;
			if (!loan || loan.id == null) {
				return;
			}
			if (seenLoanIds.has(loan.id)) {
				return;
			}
			seenLoanIds.add(loan.id);

			const name = loan.sector?.name;
			if (name) {
				sectorCounts.set(name, (sectorCounts.get(name) ?? 0) + 1);
			} else {
				otherCount += 1;
			}
		});
	});

	const values = Array.from(sectorCounts, ([label, value]) => ({ label, value }));
	if (otherCount > 0) {
		values.push({ label: `${OTHER_SECTOR_LABEL} (${otherCount})`, value: otherCount, isOther: true });
	}
	return values;
}

/**
 * Counts the distinct named sectors backed, excluding the "Other" bucket — used
 * for the "You backed N sectors" headline.
 *
 * @param {Array<{isOther?: boolean}>} sectorValues Output of getSectorChartValues.
 * @returns {number} Number of named sectors.
 */
export function getNamedSectorCount(sectorValues = []) {
	return (sectorValues ?? []).filter(sector => !sector.isOther).length;
}
