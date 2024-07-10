import { getMinMaxRangeFilter, getMinMaxRangeQueryParam, createMinMaxRange } from '@/util/loanSearch/minMaxRange';
import { getMinMaxRangeFromQueryParam } from '@/util/loanSearch/queryParseUtils';
import { filterUiType } from '@/util/loanSearch/filterUtils';

/**
 * The min risk rating value
 */
export const MIN = 0;

/**
 * The max risk rating value
 */
export const MAX = 5;

export default {
	uiConfig: {
		type: filterUiType.rangeSlider,
		hasAccordion: false,
		topLine: true,
		bottomLine: false,
		title: 'Risk rating',
		itemHeaderKey: undefined,
		placeholder: undefined,
		facetsKey: undefined,
		stateKey: 'partnerRiskRating',
		eventAction: 'change-partnerRiskRating-filter',
		allOptionsTitle: undefined,
		valueMap: undefined,
		isPercentage: false,
		displayedUnit: undefined,
	},
	getOptions: () => ({ min: MIN, max: MAX, step: 0.5 }),
	showSavedSearch: loanSearchState => !!loanSearchState.partnerRiskRating,
	getFilterChips: loanSearchState => {
		if (loanSearchState.partnerRiskRating) {
			return [{
				name: `Risk rating: ${
					loanSearchState.partnerRiskRating.min
				} to ${loanSearchState.partnerRiskRating.max}`,
				__typename: 'PartnerRiskRating'
			}];
		}
		return [];
	},
	getRemovedFacet: () => ({ partnerRiskRating: null }),
	getSavedSearch: loanSearchState => ({
		// Create new simple object that can be saved to legacy "MinMaxRangeInput" type
		riskRating: loanSearchState?.partnerRiskRating
			? {
				min: loanSearchState.partnerRiskRating.min,
				max: loanSearchState.partnerRiskRating.max
			} : null,
	}),
	getFlssFilter: loanSearchState => ({
		...(loanSearchState?.partnerRiskRating && {
			partnerRiskRating: { range: getMinMaxRangeFilter(loanSearchState.partnerRiskRating) }
		})
	}),
	getValidatedSearchState: loanSearchState => {
		const min = loanSearchState?.partnerRiskRating?.min ?? MIN;
		const max = loanSearchState?.partnerRiskRating?.max ?? MAX;
		return {
			partnerRiskRating: loanSearchState?.partnerRiskRating
				? createMinMaxRange(min >= MIN ? min : MIN, max <= MAX ? max : MAX)
				: null
		};
	},
	getFilterFromQuery: query => ({
		partnerRiskRating: getMinMaxRangeFromQueryParam(query.riskRating) ?? null
	}),
	getQueryFromFilter: loanSearchState => ({
		...(loanSearchState.partnerRiskRating && {
			riskRating: getMinMaxRangeQueryParam(loanSearchState.partnerRiskRating)
		})
	}),
};
