import { filterUiType, transformRadioGroupOptions, getFilterKeyFromValue } from '@/util/loanSearch/filterUtils';
import { getBooleanValueFromQueryParam } from '@/util/loanSearch/queryParseUtils';

// Is individual option keys
export const INDIVIDUAL_KEY = 'INDIVIDUAL';
export const GROUP_KEY = 'GROUP';

/**
 * Maps the is individual keys to display names
 */
export const isIndividualDisplayMap = {
	[INDIVIDUAL_KEY]: 'Individual',
	[GROUP_KEY]: 'Group',
};

/**
 * Maps the is individual keys to values
 */
const isIndividualValueMap = {
	[INDIVIDUAL_KEY]: true,
	[GROUP_KEY]: false,
};

/**
 * Prepares the is individual options to be used by a radio group
 *
 * @returns The transformed radio group options
 */
export function transformIsIndividualOptions() {
	const options = [{ name: INDIVIDUAL_KEY }, { name: GROUP_KEY }];
	const order = [INDIVIDUAL_KEY, GROUP_KEY];
	return transformRadioGroupOptions(options, order, isIndividualDisplayMap, isIndividualValueMap);
}

/**
 * Gets the is individual filter value based on the query param
 *
 * @param {string} param The query param to parse
 * @returns The is individual filter value
 */
export function getIsIndividualFromQueryParam(param) {
	const value = getBooleanValueFromQueryParam(param);

	// Reverse the "isGroup" param that is used to match legacy filters
	return typeof value === 'boolean' ? !value : null;
}

export default {
	uiConfig: {
		type: filterUiType.radioGroup,
		hasAccordion: false,
		topLine: false,
		bottomLine: false,
		title: undefined,
		itemHeaderKey: undefined,
		placeholder: undefined,
		facetsKey: 'isIndividual',
		stateKey: 'isIndividual',
		eventAction: 'click-isIndividual-filter',
		allOptionsTitle: undefined,
		valueMap: isIndividualValueMap,
		isPercentage: false,
		displayedUnit: undefined,
	},
	getOptions: () => transformIsIndividualOptions(),
	showSavedSearch: loanSearchState => loanSearchState.isIndividual !== null,
	getFilterChips: loanSearchState => {
		if (typeof loanSearchState.isIndividual !== 'undefined' && loanSearchState.isIndividual !== null) {
			return [{
				name: isIndividualDisplayMap[getFilterKeyFromValue(
					loanSearchState.isIndividual,
					isIndividualValueMap
				)],
				__typename: 'IsIndividual'
			}];
		}
		return [];
	},
	getRemovedFacet: () => ({ isIndividual: null }),
	getSavedSearch: loanSearchState => ({
		// Reverse "isIndividual" to match legacy "isGroup" query param
		isGroup: loanSearchState?.isIndividual !== null ? !loanSearchState.isIndividual : null
	}),
	getFlssFilter: loanSearchState => ({
		...(typeof loanSearchState?.isIndividual !== 'undefined' && loanSearchState.isIndividual !== null && {
			isIndividual: { eq: loanSearchState.isIndividual }
		})
	}),
	getValidatedSearchState: loanSearchState => ({
		isIndividual: typeof loanSearchState?.isIndividual === 'boolean' ? loanSearchState?.isIndividual : null
	}),
	getFilterFromQuery: query => ({ isIndividual: getIsIndividualFromQueryParam(query.isGroup) }),
	getQueryFromFilter: loanSearchState => ({
		// Reverse "isIndividual" to match legacy "isGroup" query param
		...(typeof loanSearchState.isIndividual === 'boolean' && {
			isGroup: (!loanSearchState.isIndividual).toString()
		})
	}),
};
