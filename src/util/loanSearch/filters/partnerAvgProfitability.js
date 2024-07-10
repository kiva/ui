import { getMinMaxRangeFilter, getMinMaxRangeQueryParam, createMinMaxRange } from '@/util/loanSearch/minMaxRange';
import { getMinMaxRangeFromQueryParam } from '@/util/loanSearch/queryParseUtils';
import { filterUiType, getDisplayedNumber } from '@/util/loanSearch/filterUtils';

/**
 * The min average profitability value
 */
export const MIN = -160;

/**
 * The max average profitability rate value
 */
export const MAX = 90;

const IS_PERCENTAGE = false;
const DISPLAYED_UNIT = '%';
const STEP = 1;

export default {
	uiConfig: {
		type: filterUiType.rangeSlider,
		hasAccordion: false,
		topLine: true,
		bottomLine: false,
		title: 'Profitability',
		itemHeaderKey: undefined,
		placeholder: undefined,
		facetsKey: undefined,
		stateKey: 'partnerAvgProfitability',
		eventAction: 'change-partnerAvgProfitability-filter',
		allOptionsTitle: undefined,
		valueMap: undefined,
		isPercentage: IS_PERCENTAGE,
		displayedUnit: DISPLAYED_UNIT,
	},
	getOptions: () => ({ min: MIN, max: MAX, step: STEP }),
	showSavedSearch: loanSearchState => !!loanSearchState.partnerAvgProfitability,
	getFilterChips: loanSearchState => {
		if (loanSearchState.partnerAvgProfitability) {
			const minDisplayed = getDisplayedNumber(
				loanSearchState.partnerAvgProfitability.min,
				IS_PERCENTAGE,
				DISPLAYED_UNIT,
				STEP
			);

			const maxDisplayed = getDisplayedNumber(
				loanSearchState.partnerAvgProfitability.max,
				IS_PERCENTAGE,
				DISPLAYED_UNIT,
				STEP
			);

			return [{
				name: `Profitability: ${minDisplayed} to ${maxDisplayed}`,
				__typename: 'PartnerAvgProfitability'
			}];
		}
		return [];
	},
	getRemovedFacet: () => ({ partnerAvgProfitability: null }),
	getSavedSearch: loanSearchState => ({
		// Create new simple object that can be saved to legacy "MinMaxRangeInput" type
		profitability: loanSearchState?.partnerAvgProfitability
			? {
				min: loanSearchState.partnerAvgProfitability.min,
				max: loanSearchState.partnerAvgProfitability.max
			} : null,
	}),
	getFlssFilter: loanSearchState => ({
		...(loanSearchState?.partnerAvgProfitability && {
			partnerAvgProfitability: { range: getMinMaxRangeFilter(loanSearchState.partnerAvgProfitability) }
		})
	}),
	getValidatedSearchState: loanSearchState => {
		const min = loanSearchState?.partnerAvgProfitability?.min ?? MIN;
		const max = loanSearchState?.partnerAvgProfitability?.max ?? MAX;
		return {
			partnerAvgProfitability: loanSearchState?.partnerAvgProfitability
				? createMinMaxRange(min >= MIN ? min : MIN, max <= MAX ? max : MAX)
				: null
		};
	},
	getFilterFromQuery: query => ({
		partnerAvgProfitability: getMinMaxRangeFromQueryParam(query.profitability) ?? null
	}),
	getQueryFromFilter: loanSearchState => ({
		...(loanSearchState.partnerAvgProfitability && {
			profitability: getMinMaxRangeQueryParam(loanSearchState.partnerAvgProfitability)
		})
	}),
};
