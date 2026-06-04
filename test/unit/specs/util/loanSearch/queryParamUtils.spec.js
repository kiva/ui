import { hasExcludedQueryParams } from '#src/util/loanSearch/queryParamUtils';

describe('queryParamUtils.js', () => {
	describe('hasExcludedQueryParams', () => {
		it('should return true', () => {
			expect(hasExcludedQueryParams({ city_state: [] })).toBe(true);
			expect(hasExcludedQueryParams({ loanTags: [] })).toBe(true);
			expect(hasExcludedQueryParams({ state: [] })).toBe(true);
			expect(hasExcludedQueryParams({ loanLimit: [] })).toBe(true);
		});

		it('should return false', () => {
			expect(hasExcludedQueryParams({ test: [] })).toBe(false);
		});

		it('should handle empty query object', () => {
			expect(hasExcludedQueryParams({})).toBe(false);
		});

		it('should handle multiple excluded params', () => {
			expect(hasExcludedQueryParams({ city_state: [], loanTags: [], test: [] })).toBe(true);
		});
	});
});
