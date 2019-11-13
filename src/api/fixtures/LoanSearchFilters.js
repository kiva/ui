import _isEqual from 'lodash/isEqual';
import _pick from 'lodash/pick';
import MinMaxRange, {
	getCacheableRange,
	getInputRange,
	getSearchableRange,
} from './MinMaxRange';

// Return a LoanSearchFilters object with default values
export default function LoanSearchFilters() {
	const riskRating = MinMaxRange();
	riskRating.min = 0;
	riskRating.max = 5;

	return {
		__typename: 'LoanSearchFilters',
		arrearsRate: MinMaxRange(),
		theme: null,
		country: [],
		defaultRate: MinMaxRange(),
		gender: null,
		isGroup: null,
		lenderTerm: MinMaxRange(),
		loanLimit: null,
		partner: null,
		riskRating,
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
		result.arrearsRate = getCacheableRange(filters.arrearsRate);
	}
	if (filters.defaultRate) {
		result.defaultRate = getCacheableRange(filters.defaultRate);
	}
	if (filters.lenderTerm) {
		result.lenderTerm = getCacheableRange(filters.lenderTerm);
	}
	if (filters.riskRating) {
		result.riskRating = getCacheableRange(filters.riskRating);
	}
	return result;
}

// Return a cleaned filters object suitable for a query variable
export function getInputFilters(filters) {
	return {
		..._pick(filters, [
			'theme',
			'country',
			'gender',
			'isGroup',
			'loanLimit',
			'partner',
			'sector',
		]),
		arrearsRate: getInputRange(filters.arrearsRate),
		defaultRate: getInputRange(filters.defaultRate),
		lenderTerm: getInputRange(filters.lenderTerm),
		riskRating: getInputRange(filters.riskRating),
	};
}

// Return filters that can be used in a loan search
export function getSearchableFilters(filters) {
	const result = _pick(filters, [
		'theme',
		'country',
		'gender',
		'isGroup',
		'partner',
		'sector',
	]);
	if (filters) {
		const arrearsRate = getSearchableRange(filters.arrearsRate);
		if (arrearsRate) {
			result.arrearsRate = arrearsRate;
		}
		const defaultRate = getSearchableRange(filters.defaultRate);
		if (defaultRate) {
			result.defaultRate = defaultRate;
		}
		const lenderTerm = getSearchableRange(filters.lenderTerm);
		if (lenderTerm) {
			result.lenderTerm = lenderTerm;
		}
		const riskRating = getSearchableRange(filters.riskRating);
		if (riskRating) {
			result.riskRating = riskRating;
		}
	}

	return result;
}

// Return true if the two given loan search filters objects are the same
export function filtersAreEqual(a, b) {
	return _isEqual(a, b);
}
