import {
	getIdsFromQueryParam,
	getEnumNameFromQueryParam,
	getBooleanValueFromQueryParam,
	getMinMaxRangeFromQueryParam,
} from '@/util/loanSearch/queryParseUtils';
import { createMinMaxRange } from '@/util/loanSearch/minMaxRange';
import { mockAllFacets } from '../../../fixtures/mockLoanSearchData';

describe('queryParseUtils.js', () => {
	describe('getEnumNameFromQueryParam', () => {
		const facets = [{ name: 'a' }, { name: 'b' }];

		it('should handle empty', () => {
			expect(getEnumNameFromQueryParam(undefined, [])).toBe(undefined);
			expect(getEnumNameFromQueryParam('', [])).toBe(undefined);
			expect(getEnumNameFromQueryParam('asd', undefined)).toBe(undefined);
		});

		it('should return undefined when no match', () => {
			expect(getEnumNameFromQueryParam('asd', [])).toBe(undefined);
			expect(getEnumNameFromQueryParam('', [{ name: 'asd' }])).toBe(undefined);
		});

		it('should get name', () => {
			expect(getEnumNameFromQueryParam('a', facets)).toBe('a');
		});

		it('should get name regardless of casing', () => {
			expect(getEnumNameFromQueryParam('A', facets)).toBe('a');
			expect(getEnumNameFromQueryParam('a', facets.map(f => ({ name: f.name.toUpperCase() })))).toBe('A');
		});

		it('should get mapped value', () => {
			expect(getEnumNameFromQueryParam('asd', facets, {})).toBe(undefined);
			expect(getEnumNameFromQueryParam('asd', facets, { a: 'asd' })).toBe('a');
		});
	});

	describe('getBooleanValueFromQueryParam', () => {
		it('should handle non-boolean', () => {
			expect(getBooleanValueFromQueryParam('')).toBe(null);
			expect(getBooleanValueFromQueryParam('asd')).toBe(null);
		});

		it('should get boolean', () => {
			expect(getBooleanValueFromQueryParam('true')).toBe(true);
			expect(getBooleanValueFromQueryParam('false')).toBe(false);
		});

		it('should get boolean regardless of casing', () => {
			expect(getBooleanValueFromQueryParam('True')).toBe(true);
			expect(getBooleanValueFromQueryParam('FALSE')).toBe(false);
		});
	});

	describe('getMinMaxRangeFromQueryParam', () => {
		it('should handle bad param', () => {
			expect(getMinMaxRangeFromQueryParam()).toBe(undefined);
			expect(getMinMaxRangeFromQueryParam('')).toBe(undefined);
			expect(getMinMaxRangeFromQueryParam('1,')).toBe(undefined);
			expect(getMinMaxRangeFromQueryParam(',1')).toBe(undefined);
		});

		it('should get range', () => {
			expect(getMinMaxRangeFromQueryParam('1,3')).toEqual(createMinMaxRange(1, 3));
			expect(getMinMaxRangeFromQueryParam('0,400')).toEqual(createMinMaxRange(0, 400));
		});
	});

	describe('getIdsFromQueryParam', () => {
		it('should handle empty', () => {
			expect(getIdsFromQueryParam()).toBe(undefined);
			expect(getIdsFromQueryParam('')).toBe(undefined);
			expect(getIdsFromQueryParam('asd,asd', ['ASD'], undefined)).toEqual([]);
			expect(getIdsFromQueryParam('asd~qwe', ['ASD'], undefined)).toEqual([]);
			expect(getIdsFromQueryParam('1,2', undefined)).toEqual([1, 2]);
			expect(getIdsFromQueryParam('asd,asd', undefined)).toEqual([]);
			expect(getIdsFromQueryParam('asd~qwe', undefined)).toEqual([]);
		});

		it('should handle sector FLSS and legacy single sector', () => {
			const sector = '1';

			const result = getIdsFromQueryParam(sector, mockAllFacets.sectorNames, mockAllFacets.sectorFacets);

			expect(result).toEqual([1]);
		});

		it('should handle sector FLSS and legacy list', () => {
			const sector = '1,2';

			const result = getIdsFromQueryParam(sector, mockAllFacets.sectorNames, mockAllFacets.sectorFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle sector FLSS and legacy list trailing separator', () => {
			const sector = '1,2,';

			const result = getIdsFromQueryParam(sector, mockAllFacets.sectorNames, mockAllFacets.sectorFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle sector Algolia single sector', () => {
			const sector = 'Sector 1';

			const result = getIdsFromQueryParam(sector, mockAllFacets.sectorNames, mockAllFacets.sectorFacets);

			expect(result).toEqual([1]);
		});

		it('should handle sector Algolia list', () => {
			const sector = 'Sector 1~Sector 2';

			const result = getIdsFromQueryParam(sector, mockAllFacets.sectorNames, mockAllFacets.sectorFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle sector Algolia list trailing separator', () => {
			const sector = 'Sector 1~Sector 2~';

			const result = getIdsFromQueryParam(sector, mockAllFacets.sectorNames, mockAllFacets.sectorFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle theme FLSS and legacy single sector', () => {
			const attribute = '1';

			const result = getIdsFromQueryParam(attribute, mockAllFacets.themeNames, mockAllFacets.themeFacets);

			expect(result).toEqual([1]);
		});

		it('should handle theme FLSS and legacy list', () => {
			const attribute = '1,2';

			const result = getIdsFromQueryParam(attribute, mockAllFacets.themeNames, mockAllFacets.themeFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle theme FLSS and legacy list trailing separator', () => {
			const attribute = '1,2,';

			const result = getIdsFromQueryParam(attribute, mockAllFacets.themeNames, mockAllFacets.themeFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle theme Algolia single sector', () => {
			const attribute = 'Theme 1';

			const result = getIdsFromQueryParam(attribute, mockAllFacets.themeNames, mockAllFacets.themeFacets);

			expect(result).toEqual([1]);
		});

		it('should handle theme Algolia list', () => {
			const attribute = 'Theme 1~Theme 2';

			const result = getIdsFromQueryParam(attribute, mockAllFacets.themeNames, mockAllFacets.themeFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle theme Algolia list trailing separator', () => {
			const attribute = 'Theme 1~Theme 2~';

			const result = getIdsFromQueryParam(attribute, mockAllFacets.themeNames, mockAllFacets.themeFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle theme name single sector', () => {
			const query = 'Theme 1';

			const result = getIdsFromQueryParam(query, mockAllFacets.themeNames, mockAllFacets.themeFacets);

			expect(result).toEqual([1]);
		});

		it('should handle theme name list', () => {
			const query = 'Theme 1,Theme 2';

			const result = getIdsFromQueryParam(query, mockAllFacets.themeNames, mockAllFacets.themeFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle tag FLSS and legacy single sector', () => {
			const tag = '1';

			const result = getIdsFromQueryParam(tag, mockAllFacets.tagNames, mockAllFacets.tagFacets);

			expect(result).toEqual([1]);
		});

		it('should handle tag FLSS and legacy list', () => {
			const tag = '1,2';

			const result = getIdsFromQueryParam(tag, mockAllFacets.tagNames, mockAllFacets.tagFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle tag FLSS and legacy list trailing separator', () => {
			const tag = '1,2,';

			const result = getIdsFromQueryParam(tag, mockAllFacets.tagNames, mockAllFacets.tagFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle tag Algolia single sector', () => {
			const tag = 'Tag 1';

			const result = getIdsFromQueryParam(tag, mockAllFacets.tagNames, mockAllFacets.tagFacets);

			expect(result).toEqual([1]);
		});

		it('should handle tag Algolia list', () => {
			const tag = 'Tag 1~Tag 2';

			const result = getIdsFromQueryParam(tag, mockAllFacets.tagNames, mockAllFacets.tagFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle tag Algolia list trailing separator', () => {
			const tag = 'Tag 1~Tag 2~';

			const result = getIdsFromQueryParam(tag, mockAllFacets.tagNames, mockAllFacets.tagFacets);

			expect(result).toEqual([1, 2]);
		});
	});
});
