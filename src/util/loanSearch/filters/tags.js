import { filterUiType } from '@/util/loanSearch/filterUtils';
import _orderBy from 'lodash/orderBy';
import { getIdsFromQueryParam } from '@/util/loanSearch/queryParseUtils';

/**
 * Transforms tag names for display
 *
 * @param {string} name The tag name to transform
 * @returns The transformed tag name
 */
export function transformTagName(name = '') {
	// Public tags start with a '#' which we don't want to display
	return name[0] === '#' ? name.substring(1) : name;
}

/**
 * Transforms tags into a form usable by the filters
 *
 * @param {Array<Object>} filteredTags The tag IDs from FLSS
 * @param {Array<Object>} allTags The tags from lend API
 * @returns {Array<Object>} Tags usable by the filters
 */
export function transformTags(filteredTags, allTags = []) {
	// Public tags have vocabularyId of 2
	const publicTags = allTags.filter(t => t.vocabularyId === 2);

	const transformed = [];

	filteredTags.forEach(({ key: id, value: numLoansFundraising }) => {
		const lookupTag = publicTags.find(t => t.id === +id);
		if (!lookupTag) return;
		const tag = { id: lookupTag.id, name: transformTagName(lookupTag.name), numLoansFundraising };
		transformed.push(tag);
	});

	return _orderBy(transformed, 'name');
}

export default {
	uiConfig: {
		type: filterUiType.checkboxList,
		hasAccordion: true,
		topLine: false,
		bottomLine: false,
		title: 'Tags',
		itemHeaderKey: undefined,
		placeholder: undefined,
		facetsKey: 'tags',
		stateKey: 'tagId',
		eventAction: 'click-tag-filter',
		allOptionsTitle: undefined,
		valueMap: undefined,
	},
	getOptions: (allFacets = {}, filteredFacets = {}) => transformTags(filteredFacets.tags, allFacets.tagFacets),
	showSavedSearch: loanSearchState => loanSearchState.tagId.length > 0,
	getFilterChips: (loanSearchState, allFacets) => {
		if (loanSearchState.tagId?.length) {
			return loanSearchState.tagId.map(id => {
				const tagFacet = allFacets.tagFacets?.find(facet => facet.id === id);

				return {
					...tagFacet,
					name: transformTagName(tagFacet?.name)
				};
			});
		}
		return [];
	},
	getRemovedFacet: (loanSearchState, facet) => ({
		tagId: [...loanSearchState.tagId?.filter(id => facet.id !== id)]
	}),
	getSavedSearch: loanSearchState => ({ loanTags: loanSearchState?.tagId }),
	getFlssFilter: loanSearchState => ({
		...(loanSearchState?.tagId?.length && { tagId: { any: loanSearchState.tagId } })
	}),
	getValidatedSearchState: (loanSearchState, allFacets) => ({
		tagId: loanSearchState?.tagId?.filter(t => allFacets.tagIds.includes(t)) ?? []
	}),
	getFilterFromQuery: (query, allFacets) => ({
		tagId: getIdsFromQueryParam(query.tag || query.tags, allFacets.tagNames, allFacets.tagFacets) ?? []
	}),
	getQueryFromFilter: loanSearchState => ({
		...(loanSearchState.tagId?.length && { tag: loanSearchState.tagId.join() })
	}),
};
