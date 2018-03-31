/**
 * Returns an alphabetical comparison function to be used by Array.prototype.sort()
 *
 * @returns {function}
 */
export function abc() {
	return (a, b) => (a < b ? -1 : 1);
}

/**
 * Returns a comparison function to be used by Array.prototype.sort(). The comparison funciton will
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
