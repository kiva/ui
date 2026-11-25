import { readListSetting } from '#src/util/settingsUtils';

/**
 * @typedef {object} BreakdownItem
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {BreakdownItem & { loanCount: number }} LentToItem
 */

const isNumeric = value => value !== '' && !Number.isNaN(Number(value));

/**
 * Reads a comma-separated excluded list setting, converting numeric entries to numbers.
 *
 * @param {object} data Query data holding the setting
 * @param {string} path Path to the setting's value
 * @returns {Array<number|string>}
 */
export function readExcludedList(data, path) {
	return readListSetting(data, path).map(entry => (isNumeric(entry) ? Number(entry) : entry));
}

/**
 * Removes excluded items. The list holds either names or ids, judged by its first entry.
 *
 * @param {BreakdownItem[]} items
 * @param {Array<number|string>} excluded Output of readExcludedList
 * @returns {BreakdownItem[]}
 */
export function filterExcluded(items, excluded) {
	if (!excluded.length) return items;

	const key = typeof excluded[0] === 'number' ? 'id' : 'name';
	const excludedSet = new Set(excluded);
	return items.filter(item => !excludedSet.has(item[key]));
}

/**
 * The items a lender has loans in, from a statsPer… collection's values.
 *
 * @param {object[]} values Rows with `loanCount` and the item under `key`
 * @param {string} key Field holding the item, e.g. 'sector'
 * @returns {LentToItem[]}
 */
export function lentToItems(values, key) {
	return values
		.filter(row => row?.loanCount > 0 && row[key])
		.map(row => ({ id: row[key].id, name: row[key].name, loanCount: row.loanCount }));
}

/**
 * The available items a lender has no loans in, by name.
 *
 * @param {BreakdownItem[]} available
 * @param {LentToItem[]} lentTo
 * @returns {BreakdownItem[]}
 */
export function notLentToItems(available, lentTo) {
	const lentIds = new Set(lentTo.map(item => item.id));
	return available
		.filter(item => !lentIds.has(item.id))
		.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
}

/**
 * Chart values from a statsPer… collection's values, in the order given. Rows whose item has no
 * name are summed into one "Other (n)" value, last.
 *
 * @param {object[]} values Rows with `loanCount` and the item under `key`
 * @param {string} key Field holding the item, e.g. 'sector'
 * @returns {Array<{ label: string, value: number, isOther?: boolean }>}
 */
export function getBreakdownChartValues(values, key) {
	const named = [];
	let otherCount = 0;

	(values ?? []).forEach(row => {
		const value = Number(row?.loanCount) || 0;
		if (value <= 0) return;

		const label = row?.[key]?.name;
		if (label) {
			named.push({ label, value });
		} else {
			otherCount += value;
		}
	});

	return otherCount > 0
		? [...named, { label: `Other (${otherCount})`, value: otherCount, isOther: true }]
		: named;
}
