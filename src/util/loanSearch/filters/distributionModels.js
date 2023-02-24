import { filterUiType, transformRadioGroupOptions } from '@/util/loanSearch/filterUtils';
import { getEnumNameFromQueryParam } from '@/util/loanSearch/queryParseUtils';

// Distribution model enum keys
export const FIELDPARTNER_KEY = 'FIELDPARTNER';
export const DIRECT_KEY = 'DIRECT';

/**
 * Maps the distribution model enum names to display names
 */
export const distributionModelDisplayMap = {
	[FIELDPARTNER_KEY]: 'Partner',
	[DIRECT_KEY]: 'Direct',
};

/**
 * Maps the FLSS enum values to the lend API enum values
 */
const distributionModelEnumMap = {
	[FIELDPARTNER_KEY]: 'fieldPartner',
	[DIRECT_KEY]: 'direct'
};

/**
 * Maps the FLSS enum values to the legacy query values
 */
const distributionModelQueryMap = {
	[FIELDPARTNER_KEY]: 'field_partner',
	[DIRECT_KEY]: 'direct'
};

/**
 * Prepares the distribution model options to be used by a radio group
 *
 * @param {Array<Object>} distributionModels The distribution models to transform
 * @returns {Array<Object>} The transformed radio group options
 */
export function transformDistributionModelOptions(distributionModels) {
	return transformRadioGroupOptions(distributionModels, [FIELDPARTNER_KEY, DIRECT_KEY], distributionModelDisplayMap);
}

export default {
	uiConfig: {
		type: filterUiType.radioGroup,
		hasAccordion: false,
		topLine: true,
		bottomLine: false,
		title: 'Loan distribution',
		itemHeaderKey: undefined,
		placeholder: undefined,
		facetsKey: 'distributionModels',
		stateKey: 'distributionModel',
		eventAction: 'click-distributionModel-filter',
		allOptionsTitle: undefined,
		valueMap: undefined,
		isPercentage: false,
		displayedUnit: undefined,
	},
	getOptions: (allFacets = {}) => transformDistributionModelOptions(allFacets.distributionModelFacets),
	showSavedSearch: loanSearchState => !!loanSearchState.distributionModel,
	getFilterChips: (loanSearchState, allFacets) => {
		if (loanSearchState.distributionModel) {
			const distributionModelFacet = allFacets.distributionModelFacets
				?.find(f => f.name === loanSearchState.distributionModel);
			return [{
				name: distributionModelDisplayMap[distributionModelFacet?.name.toUpperCase()],
				__typename: 'DistributionModel'
			}];
		}
		return [];
	},
	getRemovedFacet: () => ({ distributionModel: null }),
	getSavedSearch: loanSearchState => ({
		distributionModel: distributionModelEnumMap[loanSearchState?.distributionModel?.toUpperCase()]
	}),
	getFlssFilter: loanSearchState => ({
		...(loanSearchState?.distributionModel && { distributionModel: { eq: loanSearchState.distributionModel } })
	}),
	getValidatedSearchState: (loanSearchState, allFacets) => ({
		distributionModel: allFacets.distributionModels.includes(loanSearchState?.distributionModel?.toUpperCase())
			? loanSearchState.distributionModel
			: null
	}),
	getFilterFromQuery: (query, allFacets) => ({
		distributionModel: getEnumNameFromQueryParam(
			query.distributionModel,
			allFacets?.distributionModelFacets,
			distributionModelQueryMap
		) ?? null
	}),
	getQueryFromFilter: loanSearchState => ({
		...(loanSearchState.distributionModel && {
			distributionModel: distributionModelQueryMap[loanSearchState.distributionModel]
		})
	}),
};
