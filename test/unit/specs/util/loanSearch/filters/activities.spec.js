import activities from '#src/util/loanSearch/filters/activities';

describe('activities.js', () => {
	describe('activities', () => {
		describe('getFlssFilter', () => {
			it('should handle missing', () => {
				expect(activities.getFlssFilter({})).toEqual({});
			});

			it('should handle empty', () => {
				expect(activities.getFlssFilter({ activityId: null })).toEqual({});
			});

			it('should return filters', () => {
				expect(activities.getFlssFilter({ activityId: [1] })).toEqual({ activityId: { any: [1] } });
			});
		});

		describe('getFilterChips', () => {
			it('should return activity facets for selected activity IDs', () => {
				const loanSearchState = { activityId: [1, 2] };
				const allFacets = {
					activityFacets: [
						{ id: 1, name: 'Agriculture' },
						{ id: 2, name: 'Education' },
						{ id: 3, name: 'Health' }
					]
				};

				const result = activities.getFilterChips(loanSearchState, allFacets);

				expect(result).toEqual([
					{ id: 1, name: 'Agriculture' },
					{ id: 2, name: 'Education' }
				]);
			});

			it('should return empty array when no activity IDs selected', () => {
				const loanSearchState = {};
				const allFacets = { activityFacets: [{ id: 1, name: 'Agriculture' }] };

				const result = activities.getFilterChips(loanSearchState, allFacets);

				expect(result).toEqual([]);
			});

			it('should filter out activity not found in facets', () => {
				const loanSearchState = { activityId: [999] };
				const allFacets = {
					activityFacets: [
						{ id: 1, name: 'Agriculture' },
						{ id: 2, name: 'Education' }
					]
				};

				const result = activities.getFilterChips(loanSearchState, allFacets);

				expect(result).toEqual([]);
			});

			it('should filter out invalid activities but keep valid ones', () => {
				const loanSearchState = { activityId: [1, 999, 2] };
				const allFacets = {
					activityFacets: [
						{ id: 1, name: 'Agriculture' },
						{ id: 2, name: 'Education' }
					]
				};

				const result = activities.getFilterChips(loanSearchState, allFacets);

				expect(result).toEqual([
					{ id: 1, name: 'Agriculture' },
					{ id: 2, name: 'Education' }
				]);
			});
		});

		describe('getRemovedFacet', () => {
			it('should remove specified facet from activityId array', () => {
				const loanSearchState = { activityId: [1, 2, 3] };
				const facet = { id: 2 };

				const result = activities.getRemovedFacet(loanSearchState, facet);

				expect(result).toEqual({ activityId: [1, 3] });
			});

			it('should handle undefined activityId', () => {
				const loanSearchState = {};
				const facet = { id: 1 };

				const result = activities.getRemovedFacet(loanSearchState, facet);

				expect(result).toEqual({ activityId: [] });
			});
		});

		describe('getValidatedSearchState', () => {
			it('should filter activityId to only include valid IDs from facets', () => {
				const loanSearchState = { activityId: [1, 2, 3, 4] };
				const allFacets = { activityIds: [1, 3] };

				const result = activities.getValidatedSearchState(loanSearchState, allFacets);

				expect(result).toEqual({ activityId: [1, 3] });
			});

			it('should return empty array when no valid IDs', () => {
				const loanSearchState = { activityId: [5, 6] };
				const allFacets = { activityIds: [1, 2, 3] };

				const result = activities.getValidatedSearchState(loanSearchState, allFacets);

				expect(result).toEqual({ activityId: [] });
			});

			it('should filter activityId with mixed valid and invalid IDs', () => {
				const loanSearchState = { activityId: [1, 99, 2, 88, 3] };
				const allFacets = { activityIds: [1, 2, 3, 4, 5] };

				const result = activities.getValidatedSearchState(loanSearchState, allFacets);

				// Line 42: filter callback that checks includes() for each activityId
				expect(result).toEqual({ activityId: [1, 2, 3] });
				expect(result.activityId.length).toBe(3);
			});
		});

		describe('getQueryFromFilter', () => {
			it('should return query with activity parameter when IDs present', () => {
				const loanSearchState = { activityId: [1, 2, 3] };

				const result = activities.getQueryFromFilter(loanSearchState);

				expect(result).toEqual({ activity: '1,2,3' });
			});

			it('should return empty object when no activityId', () => {
				const loanSearchState = {};

				const result = activities.getQueryFromFilter(loanSearchState);

				expect(result).toEqual({});
			});

			it('should return empty object when activityId is null', () => {
				const loanSearchState = { activityId: null };

				const result = activities.getQueryFromFilter(loanSearchState);

				expect(result).toEqual({});
			});

			it('should return empty object when activityId is empty array', () => {
				const loanSearchState = { activityId: [] };

				const result = activities.getQueryFromFilter(loanSearchState);

				expect(result).toEqual({});
			});
		});

		describe('getValidatedSearchState', () => {
			it('should return empty array when activityId is undefined', () => {
				const loanSearchState = {};
				const allFacets = { activityIds: [1, 2, 3] };

				const result = activities.getValidatedSearchState(loanSearchState, allFacets);

				expect(result).toEqual({ activityId: [] });
			});

			it('should return empty array when activityId is empty array', () => {
				const loanSearchState = { activityId: [] };
				const allFacets = { activityIds: [1, 2, 3] };

				const result = activities.getValidatedSearchState(loanSearchState, allFacets);

				// Line 42: filter runs on empty array, returns empty
				expect(result).toEqual({ activityId: [] });
			});

			it('should return empty array when allFacets.activityIds is undefined', () => {
				const loanSearchState = { activityId: [1, 2] };
				const allFacets = {};

				const result = activities.getValidatedSearchState(loanSearchState, allFacets);

				expect(result).toEqual({ activityId: [] });
			});

			it('should return empty array when loanSearchState.activityId is null', () => {
				const loanSearchState = { activityId: null };
				const allFacets = { activityIds: [1, 2, 3] };

				const result = activities.getValidatedSearchState(loanSearchState, allFacets);

				expect(result).toEqual({ activityId: [] });
			});

			it('should return empty array when allFacets.activityIds is null', () => {
				const loanSearchState = { activityId: [1, 2] };
				const allFacets = { activityIds: null };

				const result = activities.getValidatedSearchState(loanSearchState, allFacets);

				expect(result).toEqual({ activityId: [] });
			});
		});

		describe('getSavedSearch', () => {
			it('should return empty object', () => {
				expect(activities.getSavedSearch()).toEqual({});
			});
		});

		describe('showSavedSearch', () => {
			it('should return false', () => {
				expect(activities.showSavedSearch()).toBe(false);
			});
		});

		describe('getOptions', () => {
			it('should return empty array', () => {
				expect(activities.getOptions()).toEqual([]);
			});
		});

		describe('getFilterFromQuery', () => {
			it('should parse activity query param to activityId array', () => {
				const query = { activity: '1,2,3' };
				const allFacets = {
					activityNames: ['AGRICULTURE', 'EDUCATION', 'HEALTH'],
					activityFacets: [
						{ id: 1, name: 'Agriculture' },
						{ id: 2, name: 'Education' },
						{ id: 3, name: 'Health' }
					]
				};

				const result = activities.getFilterFromQuery(query, allFacets);

				// Line 42-44: getFilterFromQuery calls getIdsFromQueryParam to convert query string
				expect(result.activityId).toEqual([1, 2, 3]);
			});

			it('should return empty array when query has no activity parameter', () => {
				const query = {};
				const allFacets = { activityNames: [], activityFacets: [] };

				const result = activities.getFilterFromQuery(query, allFacets);

				expect(result.activityId).toEqual([]);
			});

			it('should handle activity names in query', () => {
				const query = { activity: 'agriculture,education' };
				const allFacets = {
					activityNames: ['AGRICULTURE', 'EDUCATION'],
					activityFacets: [
						{ id: 1, name: 'Agriculture' },
						{ id: 2, name: 'Education' }
					]
				};

				const result = activities.getFilterFromQuery(query, allFacets);

				// getIdsFromQueryParam handles name-to-ID conversion
				expect(result.activityId).toEqual([1, 2]);
			});
		});
	});
});
