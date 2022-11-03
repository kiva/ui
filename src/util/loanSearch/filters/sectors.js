import { filterUiType } from '@/util/loanSearch/filterUtils';
import _orderBy from 'lodash/orderBy';
import { getIdsFromQueryParam } from '@/util/loanSearch/queryParseUtils';

/**
 * Transforms filtered sectors into a form usable by the filters
 *
 * @param {Array<Object>} filteredSectors The sector IDs from FLSS
 * @param {Array<Object>} allSectors The sectors from lend API
 * @returns {Array<Object>} Sectors with number of loans fundraising
 */
export function transformSectors(filteredSectors, allSectors = []) {
	const transformed = [];

	filteredSectors.forEach(({ key: id, value: numLoansFundraising }) => {
		const lookupSector = allSectors.find(s => s.id === +id);
		if (!lookupSector) return;
		const sector = { id: lookupSector.id, name: lookupSector.name, numLoansFundraising };
		transformed.push(sector);
	});

	return _orderBy(transformed, 'name');
}

export default {
	uiConfig: {
		type: filterUiType.checkboxList,
		hasAccordion: true,
		topLine: false,
		bottomLine: false,
		title: 'Sectors',
		itemHeaderKey: undefined,
		placeholder: undefined,
		facetsKey: 'sectors',
		stateKey: 'sectorId',
		eventAction: 'click-sector-filter',
		allOptionsTitle: undefined,
		valueMap: undefined,
	},
	getOptions: (allFacets = {}, filteredFacets = {}) => {
		return transformSectors(filteredFacets.sectors, allFacets.sectorFacets);
	},
	showSavedSearch: loanSearchState => loanSearchState.sectorId.length > 0,
	getFilterChips: (loanSearchState, allFacets) => {
		if (loanSearchState.sectorId?.length) {
			return loanSearchState.sectorId.map(sectorId => {
				return allFacets.sectorFacets?.find(facet => {
					return facet.id === sectorId;
				});
			});
		}
		return [];
	},
	getRemovedFacet: (loanSearchState, facet) => ({
		sectorId: [...loanSearchState.sectorId?.filter(id => facet.id !== id)]
	}),
	getSavedSearch: loanSearchState => ({ sector: loanSearchState?.sectorId }),
	getFlssFilter: loanSearchState => ({
		...(loanSearchState?.sectorId?.length && { sectorId: { any: loanSearchState.sectorId } })
	}),
	getValidatedSearchState: (loanSearchState, allFacets) => ({
		sectorId: loanSearchState?.sectorId?.filter(s => allFacets.sectorIds.includes(s)) ?? []
	}),
	getFilterFromQuery: (query, allFacets) => ({
		sectorId: getIdsFromQueryParam(query.sector, allFacets.sectorNames, allFacets.sectorFacets) ?? []
	}),
	getQueryFromFilter: loanSearchState => ({
		...(loanSearchState.sectorId?.length && { sector: loanSearchState.sectorId.join() })
	}),
};
