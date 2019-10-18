import _pick from 'lodash/pick';
import LoanSearchFilters, {
	filtersAreEqual,
	getCacheableFilters,
	getInputFilters,
} from './LoanSearchFilters';

// Return a LoanSearchCriteria object with default values
export default function LoanSearchCriteria() {
	return {
		__typename: 'LoanSearchCriteria',
		queryString: '',
		filters: LoanSearchFilters(),
	};
}

// Return a criteria suitable to write to the cache
export function getCacheableCriteria(criteria) {
	const result = {
		...criteria,
		__typename: 'LoanSearchCriteria',
	};
	if (criteria.filters) {
		result.filters = getCacheableFilters(criteria.filters);
	}
	return result;
}

// Return a cleaned criteria suitable for a query variable
export function getInputCriteria({ filters, ...criteria }) {
	const cleanCriteria = _pick(criteria, [
		'queryString'
	]);
	return {
		...cleanCriteria,
		filters: getInputFilters(filters),
	};
}

// Return true if the two given loan search criteria values are the same
export function criteriaAreEqual(a, b) {
	if (!a && !b) return true; // if both are undefined, return true
	if (!a || !b) return false; // if only one is undefined, return false
	if (a.queryString !== b.queryString) return false;
	if (!filtersAreEqual(a.filters, b.filters)) return false;
	return true;
}
