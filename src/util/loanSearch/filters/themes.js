import { filterUiType } from '@/util/loanSearch/filterUtils';
import _orderBy from 'lodash/orderBy';
import { getIdsFromQueryParam } from '@/util/loanSearch/queryParseUtils';

/**
 * The themes/attributes that are always visible in the filter UI
 */
export const visibleThemeIds = [2, 6, 8, 11, 14, 28, 29, 30, 32, 36];

/**
 * Transforms filtered themes into a form usable by the filters
 *
 * @param {Array<Object>} filteredThemes The themes from FLSS
 * @param {Array<Object>} allThemes The themes from lend API
 * @returns {Array<Object>} Themes with number of loans fundraising
 */
export function transformThemes(filteredThemes, allThemes = []) {
	const transformed = [];

	// Always show certain themes regardless of whether there are applicable loans
	visibleThemeIds.forEach(id => {
		const themeFromLend = allThemes.find(a => a.id === id);

		if (!themeFromLend) return;

		// Case insensitive matching since lend and FLSS APIs can use different casing for themes
		const themeFromFlss = filteredThemes.find(t => t.key.toUpperCase() === themeFromLend.name.toUpperCase());

		const theme = { id, name: themeFromLend.name, numLoansFundraising: themeFromFlss?.value ?? 0 };

		transformed.push(theme);
	});

	return _orderBy(transformed, 'name');
}

export default {
	uiConfig: {
		type: filterUiType.checkboxList,
		hasAccordion: true,
		topLine: false,
		bottomLine: false,
		title: 'Attributes',
		itemHeaderKey: undefined,
		placeholder: undefined,
		facetsKey: 'themes',
		stateKey: 'themeId',
		eventAction: 'click-theme-filter',
		allOptionsTitle: undefined,
		valueMap: undefined,
		isPercentage: false,
		displayedUnit: undefined,
	},
	getOptions: (allFacets = {}, filteredFacets = {}) => {
		return transformThemes(filteredFacets.themes, allFacets.themeFacets);
	},
	showSavedSearch: loanSearchState => loanSearchState.themeId.length > 0,
	getFilterChips: (loanSearchState, allFacets) => {
		if (loanSearchState.themeId?.length) {
			return loanSearchState.themeId.map(id => {
				return allFacets.themeFacets?.find(facet => facet.id === id);
			});
		}
		return [];
	},
	getRemovedFacet: (loanSearchState, facet) => ({
		themeId: [...loanSearchState.themeId?.filter(id => facet.id !== id)]
	}),
	getSavedSearch: (loanSearchState, allFacets) => ({
		theme: loanSearchState?.themeId.map(themeId => allFacets.themeFacets.find(t => t.id === themeId).name)
	}),
	getFlssFilter: loanSearchState => ({
		...(loanSearchState?.themeId?.length && { themeId: { any: loanSearchState.themeId } })
	}),
	getValidatedSearchState: (loanSearchState, allFacets) => ({
		themeId: loanSearchState?.themeId?.filter(t => allFacets?.themeIds?.includes(t)) ?? []
	}),
	getFilterFromQuery: (query, allFacets) => ({
		themeId: getIdsFromQueryParam(
			query.attribute || query.attributes || query.theme,
			allFacets?.themeNames, allFacets?.themeFacets
		) ?? []
	}),
	getQueryFromFilter: loanSearchState => ({
		...(loanSearchState.themeId?.length && { attribute: loanSearchState.themeId.join() })
	}),
};
