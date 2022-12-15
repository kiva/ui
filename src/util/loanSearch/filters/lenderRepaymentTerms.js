import { filterUiType, transformRadioGroupOptions, getFilterKeyFromValue } from '@/util/loanSearch/filterUtils';
import { createMinMaxRange, getMinMaxRangeFilter, getMinMaxRangeQueryParam } from '@/util/loanSearch/minMaxRange';
import { getMinMaxRangeFromQueryParam } from '@/util/loanSearch/queryParseUtils';

// Lender repayment term option keys
export const EIGHT_MONTHS_KEY = 'EIGHT_MONTHS';
export const SIXTEEN_MONTHS_KEY = 'SIXTEEN_MONTHS';
export const TWO_YEARS_KEY = 'TWO_YEARS';
export const MORE_THAN_TWO_YEARS_KEY = 'MORE_THAN_TWO_YEARS';

/**
 * Maps the lender repayment term keys to display names
 */
export const lenderRepaymentTermDisplayMap = {
	[EIGHT_MONTHS_KEY]: '8 mths or less',
	[SIXTEEN_MONTHS_KEY]: '16 mths or less',
	[TWO_YEARS_KEY]: '2 yrs or less',
	[MORE_THAN_TWO_YEARS_KEY]: '2 yrs or more'
};

/**
 * Maps the lender repayment term keys to values
 */
export const lenderRepaymentTermValueMap = {
	[EIGHT_MONTHS_KEY]: createMinMaxRange(0, 8),
	[SIXTEEN_MONTHS_KEY]: createMinMaxRange(0, 16),
	[TWO_YEARS_KEY]: createMinMaxRange(0, 24),
	[MORE_THAN_TWO_YEARS_KEY]: createMinMaxRange(24, 400),
};

/**
 * Prepares the lender repayment term options to be used by a radio group
 *
 * @returns The transformed radio group options
 */
export function transformLenderRepaymentTermOptions() {
	const options = [
		{ name: EIGHT_MONTHS_KEY },
		{ name: SIXTEEN_MONTHS_KEY },
		{ name: TWO_YEARS_KEY },
		{ name: MORE_THAN_TWO_YEARS_KEY }
	];
	const order = [EIGHT_MONTHS_KEY, SIXTEEN_MONTHS_KEY, TWO_YEARS_KEY, MORE_THAN_TWO_YEARS_KEY];
	return transformRadioGroupOptions(options, order, lenderRepaymentTermDisplayMap, lenderRepaymentTermValueMap);
}

export default {
	uiConfig: {
		type: filterUiType.radioGroup,
		hasAccordion: false,
		topLine: false,
		bottomLine: false,
		title: 'Loan length',
		itemHeaderKey: undefined,
		placeholder: undefined,
		facetsKey: 'lenderRepaymentTerms',
		stateKey: 'lenderRepaymentTerm',
		eventAction: 'click-lenderRepaymentTerm-filter',
		allOptionsTitle: undefined,
		valueMap: lenderRepaymentTermValueMap,
		isPercentage: false,
		displayedUnit: undefined,
	},
	getOptions: () => transformLenderRepaymentTermOptions(),
	showSavedSearch: loanSearchState => !!loanSearchState.lenderRepaymentTerm,
	getFilterChips: loanSearchState => {
		if (loanSearchState.lenderRepaymentTerm) {
			return [{
				name: lenderRepaymentTermDisplayMap[getFilterKeyFromValue(
					loanSearchState.lenderRepaymentTerm,
					lenderRepaymentTermValueMap
				)],
				__typename: 'LenderRepaymentTerm'
			}];
		}
		return [];
	},
	getRemovedFacet: () => ({ lenderRepaymentTerm: null }),
	getSavedSearch: loanSearchState => ({
		// Create new simple object that can be saved to legacy "MinMaxRangeInput" type
		lenderTerm: loanSearchState?.lenderRepaymentTerm
			? {
				min: loanSearchState.lenderRepaymentTerm.min,
				max: loanSearchState.lenderRepaymentTerm.max
			} : null,
	}),
	getFlssFilter: loanSearchState => ({
		...(loanSearchState?.lenderRepaymentTerm && {
			lenderRepaymentTerm: { range: getMinMaxRangeFilter(loanSearchState.lenderRepaymentTerm) }
		})
	}),
	getValidatedSearchState: loanSearchState => ({
		lenderRepaymentTerm: getFilterKeyFromValue(
			loanSearchState?.lenderRepaymentTerm,
			lenderRepaymentTermValueMap
		)
			? { ...loanSearchState.lenderRepaymentTerm, __typename: 'MinMaxRange' }
			: null
	}),
	getFilterFromQuery: query => ({
		lenderRepaymentTerm: getMinMaxRangeFromQueryParam(query.lenderTerm) ?? null
	}),
	getQueryFromFilter: loanSearchState => ({
		...(loanSearchState.lenderRepaymentTerm && {
			lenderTerm: getMinMaxRangeQueryParam(loanSearchState.lenderRepaymentTerm)
		})
	}),
};
