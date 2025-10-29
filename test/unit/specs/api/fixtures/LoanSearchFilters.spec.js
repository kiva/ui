import LoanSearchFilters, {
	getCacheableFilters,
	getInputFilters,
	getSearchableFilters,
	filtersAreEqual,
} from '../../../../../src/api/fixtures/LoanSearchFilters';

describe('LoanSearchFilters.js', () => {
	describe('LoanSearchFilters constructor', () => {
		it('should return a LoanSearchFilters object with default values', () => {
			const filters = LoanSearchFilters();

			expect(filters).toHaveProperty('__typename', 'LoanSearchFilters');
			expect(filters.arrearsRate).toEqual({ __typename: 'MinMaxRange', min: null, max: null });
			expect(filters.defaultRate).toEqual({ __typename: 'MinMaxRange', min: null, max: null });
			expect(filters.lenderTerm).toEqual({ __typename: 'MinMaxRange', min: null, max: null });
			expect(filters.riskRating).toEqual({ __typename: 'MinMaxRange', min: 0, max: 5 });
			expect(filters.theme).toBeNull();
			expect(filters.country).toEqual([]);
			expect(filters.gender).toBeNull();
			expect(filters.isGroup).toBeNull();
			expect(filters.loanLimit).toBeNull();
			expect(filters.partner).toBeNull();
			expect(filters.sector).toBeNull();
			expect(filters.loanTags).toBeNull();
		});
	});

	describe('getCacheableFilters', () => {
		it('should add __typename to filters object', () => {
			const filters = {
				gender: 'female',
				country: ['US'],
			};
			const result = getCacheableFilters(filters);

			expect(result).toHaveProperty('__typename', 'LoanSearchFilters');
			expect(result.gender).toBe('female');
			expect(result.country).toEqual(['US']);
		});

		it('should add __typename to range objects', () => {
			const filters = {
				arrearsRate: { min: 0, max: 5 },
				defaultRate: { min: 1, max: 3 },
				lenderTerm: { min: 6, max: 12 },
				riskRating: { min: 2, max: 4 },
			};
			const result = getCacheableFilters(filters);

			expect(result.arrearsRate).toHaveProperty('__typename', 'MinMaxRange');
			expect(result.defaultRate).toHaveProperty('__typename', 'MinMaxRange');
			expect(result.lenderTerm).toHaveProperty('__typename', 'MinMaxRange');
			expect(result.riskRating).toHaveProperty('__typename', 'MinMaxRange');
		});

		it('should handle filters without range objects', () => {
			const filters = {
				gender: 'male',
				sector: 'Agriculture',
			};
			const result = getCacheableFilters(filters);

			expect(result).toHaveProperty('__typename', 'LoanSearchFilters');
			expect(result.gender).toBe('male');
			expect(result.sector).toBe('Agriculture');
		});
	});

	describe('getInputFilters', () => {
		it('should extract basic filter fields', () => {
			const filters = {
				theme: 'Education',
				country: ['KE', 'UG'],
				gender: 'female',
				isGroup: false,
				loanLimit: 100,
				partner: 'Partner1',
				sector: 'Agriculture',
				loanTags: ['tag1'],
			};
			const result = getInputFilters(filters);

			expect(result.theme).toBe('Education');
			expect(result.country).toEqual(['KE', 'UG']);
			expect(result.gender).toBe('female');
			expect(result.isGroup).toBe(false);
			expect(result.loanLimit).toBe(100);
			expect(result.partner).toBe('Partner1');
			expect(result.sector).toBe('Agriculture');
			expect(result.loanTags).toEqual(['tag1']);
		});

		it('should process range objects correctly', () => {
			const filters = {
				arrearsRate: { min: 0, max: 2 },
				defaultRate: { min: 1, max: 3 },
				lenderTerm: { min: 6, max: 12 },
				riskRating: { min: 2, max: 4 },
			};
			const result = getInputFilters(filters);

			expect(result.arrearsRate).toEqual({ min: 0, max: 2 });
			expect(result.defaultRate).toEqual({ min: 1, max: 3 });
			expect(result.lenderTerm).toEqual({ min: 6, max: 12 });
			expect(result.riskRating).toEqual({ min: 2, max: 4 });
		});

		it('should return null for ranges with no numeric values', () => {
			const filters = {
				arrearsRate: { min: null, max: null },
				defaultRate: { min: null, max: null },
			};
			const result = getInputFilters(filters);

			expect(result.arrearsRate).toBeNull();
			expect(result.defaultRate).toBeNull();
		});
	});

	describe('getSearchableFilters', () => {
		it('should include searchable fields', () => {
			const filters = {
				theme: 'Environment',
				country: ['BR'],
				gender: 'male',
				isGroup: true,
				partner: 'Partner2',
				sector: 'Retail',
				loanTags: ['tag2'],
				distributionModel: 'direct',
				dafEligible: true,
				status: 'active',
				matcherAccountId: '123',
			};
			const result = getSearchableFilters(filters);

			expect(result.theme).toBe('Environment');
			expect(result.country).toEqual(['BR']);
			expect(result.gender).toBe('male');
			expect(result.isGroup).toBe(true);
			expect(result.partner).toBe('Partner2');
			expect(result.sector).toBe('Retail');
			expect(result.loanTags).toEqual(['tag2']);
			expect(result.distributionModel).toBe('direct');
			expect(result.dafEligible).toBe(true);
			expect(result.status).toBe('active');
			expect(result.matcherAccountId).toBe('123');
		});

		it('should only include ranges with numeric values', () => {
			const filters = {
				arrearsRate: { min: 0, max: 5 },
				defaultRate: { min: null, max: null },
				lenderTerm: { min: 10, max: null },
				riskRating: { min: null, max: 3 },
			};
			const result = getSearchableFilters(filters);

			expect(result.arrearsRate).toEqual({ min: 0, max: 5 });
			expect(result.defaultRate).toBeUndefined();
			expect(result.lenderTerm).toEqual({ min: 10 });
			expect(result.riskRating).toEqual({ max: 3 });
		});

		it('should handle filters without ranges', () => {
			const filters = {
				gender: 'female',
				country: ['US'],
			};
			const result = getSearchableFilters(filters);

			expect(result.gender).toBe('female');
			expect(result.country).toEqual(['US']);
		});
	});

	describe('filtersAreEqual', () => {
		it('should return true for identical filters', () => {
			const filtersA = {
				gender: 'female',
				country: ['US'],
				arrearsRate: { min: 0, max: 5 },
			};
			const filtersB = {
				gender: 'female',
				country: ['US'],
				arrearsRate: { min: 0, max: 5 },
			};

			expect(filtersAreEqual(filtersA, filtersB)).toBe(true);
		});

		it('should return false for different filters', () => {
			const filtersA = { gender: 'female' };
			const filtersB = { gender: 'male' };

			expect(filtersAreEqual(filtersA, filtersB)).toBe(false);
		});

		it('should return true when both are undefined', () => {
			expect(filtersAreEqual(undefined, undefined)).toBe(true);
		});

		it('should return false when one is undefined', () => {
			const filters = { gender: 'female' };

			expect(filtersAreEqual(filters, undefined)).toBe(false);
		});

		it('should handle deep comparison of nested objects', () => {
			const filtersA = {
				arrearsRate: { min: 1, max: 5 },
				country: ['KE', 'UG'],
			};
			const filtersB = {
				arrearsRate: { min: 1, max: 5 },
				country: ['KE', 'UG'],
			};

			expect(filtersAreEqual(filtersA, filtersB)).toBe(true);
		});

		it('should detect differences in nested objects', () => {
			const filtersA = {
				arrearsRate: { min: 1, max: 5 },
			};
			const filtersB = {
				arrearsRate: { min: 2, max: 5 },
			};

			expect(filtersAreEqual(filtersA, filtersB)).toBe(false);
		});
	});
});
