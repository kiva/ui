import _isEqual from 'lodash/isEqual';
import _omit from 'lodash/omit';

// Return a LoanSearchCriteria object with default values
export default function LoanSearchCriteria() {
	return {
		__typename: 'LoanSearchCriteria',
		queryString: '',
		filters: {
			__typename: 'LoanSearchFilters',
			arrearsRate: {
				__typename: 'MinMaxRange',
				min: null,
				max: null,
			},
			theme: [],
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
			// loanLimit
			partner: [],
			riskRating: {
				__typename: 'MinMaxRange',
				min: 0,
				max: 5,
			},
			sector: [],
		},
	};
}

// Return a cleaned criteria suitable for input
export function getInputCriteria(criteria) {
	return _omit(criteria, [
		'__typename',
		'filters.__typename',
		'filters.arrearsRate.__typename',
		'filters.defaultRate.__typename',
		'filters.lenderTerm.__typename',
		'filters.riskRating.__typename',
	]);
}

// Return true if the two given loan search critera values are the same
export function criteriaAreEqual(a, b) {
	return _isEqual(a, b);
}
