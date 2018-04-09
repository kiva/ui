/**
 * Returns an alphabetical comparison function to be used by Array.prototype.sort()
 *
 * @returns {function}
 */
export function abc() {
	return (a, b) => (a < b ? -1 : 1);
}

/**
 * Returns a comparison function to be used by Array.prototype.sort(). The comparison function will
 * sort elements to match their relative position in the given list.
 *
 * const list = ['a', 'b', 'c', 'd'];
 * const arrayToSort = ['d', 'a'];
 * arrayToSort.sort(indexIn(list)); // will return ['a','d']
 *
 * @param {array} list
 * @param {string} [key] - compare property 'key' of elements rather than the elements themselves
 * @returns {function}
 */
export function indexIn(list, key) {
	if (!Array.isArray(list)) {
		throw new TypeError('list must be an array');
	}
	return (a, b) => {
		const as = key ? a[key] : a;
		const bs = key ? b[key] : b;
		return list.indexOf(as) < list.indexOf(bs) ? -1 : 1;
	};
}

/**
 * Returns a comparison function to be used by Array.prototype.sort(). The comparison function will
 * report elements that start with the given query to come first, and otherwise compares elements
 * alphabetically.
 *
 * @param {string} query
 * @param {string} [key] - compare property 'key' of elements rather than the elements themselves
 * @returns {function}
 */
export function startsWith(query, key) {
	const q = query.toLowerCase();
	return (a, b) => {
		const as = (key ? a[key] : a).toLowerCase();
		const bs = (key ? b[key] : b).toLowerCase();
		const ai = as.indexOf(q);
		const bi = bs.indexOf(q);
		if (ai === 0) return bi === 0 ? abc()(as, bs) : -1;
		return bi === 0 ? 1 : abc()(as, bs);
	};
}
