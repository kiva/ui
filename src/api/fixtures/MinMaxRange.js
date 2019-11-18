import _isNumber from 'lodash/isNumber';

// Return a MinMaxRange object with default values
export default function MinMaxRange() {
	return {
		__typename: 'MinMaxRange',
		min: null,
		max: null,
	};
}

// Return a range object suitable to write to the cache
export function getCacheableRange(range) {
	return {
		...range,
		__typename: 'MinMaxRange',
	};
}

// Return a cleaned range object suitable for a query variable
export function getInputRange(range) {
	if (range && (_isNumber(range.min) || _isNumber(range.max))) {
		return {
			min: range.min,
			max: range.max,
		};
	}
	return null;
}

// Return range that can be used in a loan search
export function getSearchableRange(range) {
	let result;

	// only set min if it is defined
	if (range && _isNumber(range.min)) {
		result = result || {};
		result.min = range.min;
	}
	// only set max if it is defined
	if (range && _isNumber(range.max)) {
		result = result || {};
		result.max = range.max;
	}

	return result;
}

// Return true if the two given min max range objects are the same
export function rangesAreEqual(a, b) {
	if (!a && !b) return true;
	if (!a || !b) return false;
	if (a.min !== b.min) return false;
	if (a.max !== b.max) return false;
	return true;
}
