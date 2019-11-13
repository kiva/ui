import _isEqual from 'lodash/isEqual';
import _omit from 'lodash/omit';

// Return a LoanSearchFilters object with default values
export default function LoanSearchFilters() {
	return {
		__typename: 'LoanSearchFilters',
		arrearsRate: {
			__typename: 'MinMaxRange',
			min: null,
			max: null,
		},
		theme: null,
		country: [],
		defaultRate: {
			__typename: 'MinMaxRange',
			min: null,
			max: null,
		},
		gender: null,
		isGroup: null,
		lenderTerm: {
			__typename: 'MinMaxRange',
			min: null,
			max: null,
		},
		loanLimit: null,
		partner: null,
		riskRating: {
			__typename: 'MinMaxRange',
			min: 0,
			max: 5,
		},
		sector: null,
	};
}

// Return a filters object suitable to write to the cache
export function getCacheableFilters(filters) {
	const result = {
		...filters,
		__typename: 'LoanSearchFilters',
	};
	if (filters.arrearsRate) {
		result.arrearsRate = {
			...filters.arrearsRate,
			__typename: 'MinMaxRange',
		};
	}
	if (filters.defaultRate) {
		result.defaultRate = {
			...filters.defaultRate,
			__typename: 'MinMaxRange',
		};
	}
	if (filters.lenderTerm) {
		result.lenderTerm = {
			...filters.lenderTerm,
			__typename: 'MinMaxRange',
		};
	}
	if (filters.riskRating) {
		result.riskRating = {
			...filters.riskRating,
			__typename: 'MinMaxRange',
		};
	}
	return result;
}

// Return a cleaned filters object suitable for a query variable
export function getInputFilters(filters) {
	return _omit(filters, [
		'__typename',
		'arrearsRate.__typename',
		'defaultRate.__typename',
		'lenderTerm.__typename',
		'riskRating.__typename',
	]);
}

// Return filters that can be used in a loan search
export function getSearchableFilters(filters) {
	return _omit(getInputFilters(filters), [
		'loanLimit',
	]);
}

// Return true if the two given loan search filters objects are the same
export function filtersAreEqual(a, b) {
	return _isEqual(a, b);
}
