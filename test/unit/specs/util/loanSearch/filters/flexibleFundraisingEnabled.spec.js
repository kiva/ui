import flexibleFundraisingEnabled, {
	FIXED_KEY,
	FLEXIBLE_KEY,
	displayMap,
	valueMap,
	facetsKey,
	typeName,
} from '../../../../../../src/util/loanSearch/filters/flexibleFundraisingEnabled';

describe('flexibleFundraisingEnabled.js', () => {
	describe('default', () => {
		describe('getOptions', () => {
			it('should transform and sort', () => {
				expect(flexibleFundraisingEnabled.getOptions()).toEqual([
					{ name: FIXED_KEY, title: displayMap[FIXED_KEY], value: valueMap[FIXED_KEY] },
					{ name: FLEXIBLE_KEY, title: displayMap[FLEXIBLE_KEY], value: valueMap[FLEXIBLE_KEY] },
				]);
			});
		});

		describe('getOptions', () => {
			it('should return whether to show saved search', () => {
				expect(flexibleFundraisingEnabled.showSavedSearch({ [facetsKey]: null })).toBe(false);
				expect(flexibleFundraisingEnabled.showSavedSearch({ [facetsKey]: false })).toBe(true);
				expect(flexibleFundraisingEnabled.showSavedSearch({ [facetsKey]: true })).toBe(true);
			});
		});

		describe('getFilterChips', () => {
			it('should handle undefined', () => {
				expect(flexibleFundraisingEnabled.getFilterChips({})).toEqual([]);
			});

			it('should handle null', () => {
				expect(flexibleFundraisingEnabled.getFilterChips({ [facetsKey]: null })).toEqual([]);
			});

			it('should return chips', () => {
				const result = flexibleFundraisingEnabled.getFilterChips({ [facetsKey]: false });

				expect(result).toEqual([{ name: displayMap[FIXED_KEY], __typename: typeName }]);
			});
		});

		describe('getRemovedFacet', () => {
			it('should remove facet', () => {
				expect(flexibleFundraisingEnabled.getRemovedFacet()).toEqual({ [facetsKey]: null });
			});
		});

		describe('getSavedSearch', () => {
			it('should get saved search', () => {
				expect(flexibleFundraisingEnabled.getSavedSearch()).toEqual({});
				expect(flexibleFundraisingEnabled.getSavedSearch()).toEqual({});
			});
		});

		describe('getFlssFilter', () => {
			it('should get FLSS filter', () => {
				expect(flexibleFundraisingEnabled.getFlssFilter(undefined)).toEqual({});
				expect(flexibleFundraisingEnabled.getFlssFilter({})).toEqual({});
				expect(flexibleFundraisingEnabled.getFlssFilter({ [facetsKey]: null })).toEqual({});
				expect(flexibleFundraisingEnabled.getFlssFilter({ [facetsKey]: true }))
					.toEqual({ [facetsKey]: { eq: true } });
			});
		});

		describe('getValidatedSearchState', () => {
			it('should get validated search state', () => {
				expect(flexibleFundraisingEnabled.getValidatedSearchState({})).toEqual({ [facetsKey]: null });
				expect(flexibleFundraisingEnabled.getValidatedSearchState({})).toEqual({ [facetsKey]: null });
				expect(flexibleFundraisingEnabled.getValidatedSearchState({ [facetsKey]: true }))
					.toEqual({ [facetsKey]: true });
				expect(flexibleFundraisingEnabled.getValidatedSearchState({ [facetsKey]: 'asd' }))
					.toEqual({ [facetsKey]: null });
			});
		});

		describe('getFilterFromQuery', () => {
			it('it should get filter', () => {
				const query = { [facetsKey]: 'true' };

				const result = flexibleFundraisingEnabled.getFilterFromQuery(query);

				expect(result).toEqual({ [facetsKey]: true });
			});

			it('should handle different casing', () => {
				const query = { [facetsKey]: 'TRUE' };

				const result = flexibleFundraisingEnabled.getFilterFromQuery(query);

				expect(result).toEqual({ [facetsKey]: true });
			});
		});

		describe('getQueryFromFilter', () => {
			it('should get query object', () => {
				expect(flexibleFundraisingEnabled.getQueryFromFilter({})).toEqual({});
				expect(flexibleFundraisingEnabled.getQueryFromFilter({ [facetsKey]: 'asd' })).toEqual({});
				expect(flexibleFundraisingEnabled.getQueryFromFilter({ [facetsKey]: false }))
					.toEqual({ [facetsKey]: 'false' });
			});
		});
	});
});
