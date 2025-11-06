import tags, { transformTagName, transformTags } from '#src/util/loanSearch/filters/tags';
import { FLSS_QUERY_TYPE } from '#src/util/loanSearch/filterUtils';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('tags.js', () => {
	describe('tags', () => {
		describe('getOptions', () => {
			it('should return transformed tags', () => {
				const filteredFacets = { tags: [{ key: 1, value: 100 }] };
				const result = tags.getOptions(mockAllFacets, filteredFacets);

				expect(result).toEqual(expect.any(Array));
			});

			it('should handle empty filtered facets', () => {
				const result = tags.getOptions(mockAllFacets, { tags: [] });

				expect(result).toEqual(expect.any(Array));
			});
		});

		describe('getFilterChips', () => {
			it('should handle undefined', () => {
				expect(tags.getFilterChips({}, mockAllFacets)).toEqual([]);
			});

			it('should return chips', () => {
				const result = tags.getFilterChips({ tagId: [1] }, mockAllFacets);

				const expected = [{ id: 1, name: 'Tag 1', __typename: 'Tag' }];

				expect(result).toEqual(expected);
			});

			it('should filter out tag not found in facets', () => {
				const result = tags.getFilterChips({ tagId: [999] }, mockAllFacets);

				expect(result).toEqual([]);
			});

			it('should filter out invalid tags but keep valid ones', () => {
				const result = tags.getFilterChips({ tagId: [1, 999, 2] }, mockAllFacets);

				const expected = [
					{ ...mockAllFacets.tagFacets[0], name: 'Tag 1' },
					{ ...mockAllFacets.tagFacets[1], name: 'Tag 2' }
				];
				expect(result).toEqual(expected);
			});
		});

		describe('getRemovedFacet', () => {
			it('should remove facet', () => {
				expect(tags.getRemovedFacet({ tagId: [1] }, { id: 1 })).toEqual({ tagId: [] });
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = tags.getValidatedSearchState({ tagId: [1] }, undefined, FLSS_QUERY_TYPE);

				expect(result).toEqual({ tagId: [] });
			});

			it('should handle empty', () => {
				const result = tags.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ tagId: [] });
			});

			it('should validate tag', () => {
				const state = { tagId: ['asd'] };

				const result = tags.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ tagId: [] });
			});
		});

		describe('getFilterFromQuery', () => {
			it('it should handle undefined facets', () => {
				const query = { tag: '1,2' };

				const result = tags.getFilterFromQuery(query, undefined, mockState.pageLimit, FLSS_QUERY_TYPE);

				expect(result).toEqual({ tagId: [1, 2] });
			});

			it('it should get filter', () => {
				const query = { tag: '1,2' };

				const result = tags.getFilterFromQuery(query, mockAllFacets, mockState.pageLimit, FLSS_QUERY_TYPE);

				expect(result).toEqual({ tagId: [1, 2] });
			});

			it('it should get filter from tags query param', () => {
				const query = { tags: '1,2' };

				const result = tags.getFilterFromQuery(query, mockAllFacets, mockState.pageLimit, FLSS_QUERY_TYPE);

				expect(result).toEqual({ tagId: [1, 2] });
			});
		});

		describe('getSavedSearch', () => {
			it('should return loanTags from state', () => {
				const state = { tagId: [1, 2] };

				const result = tags.getSavedSearch(state);

				expect(result).toEqual({ loanTags: [1, 2] });
			});
		});

		describe('getQueryFromFilter', () => {
			it('should push tag IDs', () => {
				const state = { tagId: [1, 2] };

				const result = tags.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ tag: '1,2' });
			});

			it('should not push empty tag ID', () => {
				const state = { tagId: [] };

				const result = tags.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({});
			});
		});

		describe('getFlssFilter', () => {
			it('should handle missing', () => {
				expect(tags.getFlssFilter({})).toEqual({});
			});

			it('should handle empty', () => {
				expect(tags.getFlssFilter({ tagId: [] })).toEqual({});
			});

			it('should return filters', () => {
				expect(tags.getFlssFilter({ tagId: [1] })).toEqual({ tagId: { any: [1] } });
			});
		});
	});

	describe('transformTagName', () => {
		it('should handle empty', () => {
			expect(transformTagName()).toEqual('');
		});

		it('should remove #', () => {
			expect(transformTagName('#test')).toEqual('test');
		});

		it('should leave name without leading # as is', () => {
			expect(transformTagName('test#')).toEqual('test#');
		});
	});

	describe('transformTags', () => {
		it('should handle empty', () => {
			expect(transformTags([])).toEqual([]);
		});

		it('should transform and sort', () => {
			const flssTags = [
				{ key: 1, value: 5 },
				{ key: 2, value: 6 },
				{ key: 3, value: 7 }
			];

			const allTags = [
				{ id: 1, name: 'tag', vocabularyId: 2 },
				{ id: 2, name: '#tag2', vocabularyId: 2 },
				{ id: 3, name: 'asd', vocabularyId: 2 }
			];

			const result = transformTags(flssTags, allTags);

			expect(result).toEqual([
				{ id: 3, name: 'asd', numLoansFundraising: 7 },
				{ id: 1, name: 'tag', numLoansFundraising: 5 },
				{ id: 2, name: 'tag2', numLoansFundraising: 6 }
			]);
		});

		it('should only return public tags', () => {
			const flssTags = [
				{ key: 1, value: 5 },
				{ key: 2, value: 6 },
				{ key: 3, value: 7 }
			];

			const allTags = [
				{ id: 1, name: 'tag', vocabularyId: 2 },
				{ id: 2, name: '#tag2', vocabularyId: 1 },
				{ id: 3, name: 'asd', vocabularyId: 2 }
			];

			const result = transformTags(flssTags, allTags);

			expect(result).toEqual([
				{ id: 3, name: 'asd', numLoansFundraising: 7 },
				{ id: 1, name: 'tag', numLoansFundraising: 5 }
			]);
		});

		it('should filter transform tags with number casting', () => {
			const flssTags = [
				{ key: '1', value: 5 },
				{ key: '2', value: 6 },
				{ key: '3', value: 7 }
			];

			const allTags = [
				{ id: 1, name: 'tag', vocabularyId: 2 },
				{ id: 2, name: '#tag2', vocabularyId: 2 },
				{ id: 3, name: 'asd', vocabularyId: 2 }
			];

			const result = transformTags(flssTags, allTags);

			expect(result).toEqual([
				{ id: 3, name: 'asd', numLoansFundraising: 7 },
				{ id: 1, name: 'tag', numLoansFundraising: 5 },
				{ id: 2, name: 'tag2', numLoansFundraising: 6 }
			]);
		});

		it('should skip tags not found in allTags', () => {
			const flssTags = [
				{ key: 1, value: 5 },
				{ key: 999, value: 10 }, // Not in allTags
			];

			const allTags = [
				{ id: 1, name: 'tag', vocabularyId: 2 },
			];

			const result = transformTags(flssTags, allTags);

			expect(result).toEqual([
				{ id: 1, name: 'tag', numLoansFundraising: 5 },
			]);
		});

		it('should handle undefined allTags parameter', () => {
			const flssTags = [
				{ key: 1, value: 5 },
			];

			const result = transformTags(flssTags);

			expect(result).toEqual([]);
		});
	});

	describe('getRemovedFacet', () => {
		it('should handle tagId as falsy value (0)', () => {
			// The bug: loanSearchState?.tagId ?? 0 will return 0 instead of []
			// This test ensures it's handled correctly
			const loanSearchState = { tagId: [1, 2] };
			const facet = { id: 1 };

			const result = tags.getRemovedFacet(loanSearchState, facet);

			expect(result).toEqual({ tagId: [2] });
		});
	});
});
