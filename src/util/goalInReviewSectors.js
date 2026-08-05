export const OTHER_SECTOR_LABEL = 'Other';

/**
 * Maps `GoalSummary.sectors` into chart-ready values, collapsing entries with no
 * sector name into a single "Other (n)" bucket flagged with `isOther`.
 *
 * @param {Array} sectors `{ sector { name }, loanCount }` entries, loan count descending.
 * @returns {Array<{label: string, value: number, isOther?: boolean}>} Sector entries.
 */
export function getSectorChartValues(sectors = []) {
	const named = [];
	let otherCount = 0;

	(sectors ?? []).forEach(entry => {
		const value = Number(entry?.loanCount) || 0;
		if (value <= 0) {
			return;
		}
		const label = entry?.sector?.name;
		if (label) {
			named.push({ label, value });
		} else {
			otherCount += value;
		}
	});

	return otherCount > 0
		? [...named, { label: `${OTHER_SECTOR_LABEL} (${otherCount})`, value: otherCount, isOther: true }]
		: named;
}

/**
 * Counts the named sectors, excluding the "Other" bucket.
 *
 * @param {Array<{isOther?: boolean}>} sectorValues Output of getSectorChartValues.
 * @returns {number} Number of named sectors.
 */
export function getNamedSectorCount(sectorValues = []) {
	return (sectorValues ?? []).filter(sector => !sector.isOther).length;
}
