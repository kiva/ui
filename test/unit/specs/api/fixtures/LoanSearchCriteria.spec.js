import LoanSearchCriteria, {
	getCacheableCriteria,
	getInputCriteria,
	getSearchableCriteria,
	criteriaAreEqual,
} from '../../../../../src/api/fixtures/LoanSearchCriteria';

describe('LoanSearchCriteria.js', () => {
	describe('LoanSearchCriteria constructor', () => {
		it('should return a LoanSearchCriteria object with default values', () => {
			const criteria = LoanSearchCriteria();

			expect(criteria).toHaveProperty('__typename', 'LoanSearchCriteria');
			expect(criteria.queryString).toBe('');
			expect(criteria.filters).toBeDefined();
			expect(criteria.filters).toHaveProperty('__typename', 'LoanSearchFilters');
		});
	});

	describe('getCacheableCriteria', () => {
		it('should add __typename to criteria object', () => {
			const criteria = {
				queryString: 'women farmers',
			};
			const result = getCacheableCriteria(criteria);

			expect(result).toHaveProperty('__typename', 'LoanSearchCriteria');
			expect(result.queryString).toBe('women farmers');
		});

		it('should process filters if present', () => {
			const criteria = {
				queryString: 'test',
				filters: {
					gender: 'female',
					arrearsRate: { min: 0, max: 5 },
				},
			};
			const result = getCacheableCriteria(criteria);

			expect(result.filters).toHaveProperty('__typename', 'LoanSearchFilters');
			expect(result.filters.arrearsRate).toHaveProperty('__typename', 'MinMaxRange');
		});

		it('should preserve all properties', () => {
			const criteria = {
				queryString: 'agriculture',
				filters: {
					sector: 'Agriculture',
				},
				customProp: 'test',
			};
			const result = getCacheableCriteria(criteria);

			expect(result.queryString).toBe('agriculture');
			expect(result.filters.sector).toBe('Agriculture');
			expect(result.customProp).toBe('test');
		});
	});

	describe('getInputCriteria', () => {
		it('should extract queryString and process filters', () => {
			const criteria = {
				queryString: 'education',
				filters: {
					gender: 'male',
					country: ['KE'],
					arrearsRate: { min: 0, max: 3 },
				},
			};
			const result = getInputCriteria(criteria);

			expect(result.queryString).toBe('education');
			expect(result.filters).toBeDefined();
			expect(result.filters.gender).toBe('male');
			expect(result.filters.country).toEqual(['KE']);
		});

		it('should handle criteria with only queryString', () => {
			const criteria = {
				queryString: 'test search',
				filters: {},
			};
			const result = getInputCriteria(criteria);

			expect(result.queryString).toBe('test search');
			expect(result.filters).toBeDefined();
		});

		it('should handle empty queryString', () => {
			const criteria = {
				queryString: '',
				filters: {
					gender: 'female',
				},
			};
			const result = getInputCriteria(criteria);

			expect(result.queryString).toBe('');
			expect(result.filters.gender).toBe('female');
		});

		it('should exclude __typename and other props', () => {
			const criteria = {
				queryString: 'test',
				filters: { gender: 'female' },
				__typename: 'LoanSearchCriteria',
				extraProp: 'should not appear',
			};
			const result = getInputCriteria(criteria);

			expect(result.queryString).toBe('test');
			expect(result.filters).toBeDefined();
			expect(result).not.toHaveProperty('__typename');
			expect(result).not.toHaveProperty('extraProp');
		});
	});

	describe('getSearchableCriteria', () => {
		it('should process filters for search', () => {
			const criteria = {
				queryString: 'test', // Should be excluded from searchable
				filters: {
					gender: 'female',
					country: ['US'],
					arrearsRate: { min: 0, max: 5 },
				},
			};
			const result = getSearchableCriteria(criteria);

			expect(result.filters).toBeDefined();
			expect(result.filters.gender).toBe('female');
			expect(result.filters.country).toEqual(['US']);
			expect(result.filters.arrearsRate).toEqual({ min: 0, max: 5 });
		});

		it('should only return filters', () => {
			const criteria = {
				queryString: 'should not appear',
				filters: {
					sector: 'Agriculture',
				},
			};
			const result = getSearchableCriteria(criteria);

			expect(result.filters).toBeDefined();
			expect(result).not.toHaveProperty('queryString');
		});

		it('should handle empty filters', () => {
			const criteria = {
				filters: {},
			};
			const result = getSearchableCriteria(criteria);

			expect(result.filters).toBeDefined();
		});
	});

	describe('criteriaAreEqual', () => {
		it('should return true for identical criteria', () => {
			const criteriaA = {
				queryString: 'women',
				filters: {
					gender: 'female',
					country: ['US'],
				},
			};
			const criteriaB = {
				queryString: 'women',
				filters: {
					gender: 'female',
					country: ['US'],
				},
			};

			expect(criteriaAreEqual(criteriaA, criteriaB)).toBe(true);
		});

		it('should return false when queryStrings differ', () => {
			const criteriaA = {
				queryString: 'agriculture',
				filters: {},
			};
			const criteriaB = {
				queryString: 'education',
				filters: {},
			};

			expect(criteriaAreEqual(criteriaA, criteriaB)).toBe(false);
		});

		it('should return false when filters differ', () => {
			const criteriaA = {
				queryString: 'test',
				filters: { gender: 'female' },
			};
			const criteriaB = {
				queryString: 'test',
				filters: { gender: 'male' },
			};

			expect(criteriaAreEqual(criteriaA, criteriaB)).toBe(false);
		});

		it('should return true when both are undefined', () => {
			expect(criteriaAreEqual(undefined, undefined)).toBe(true);
		});

		it('should return true when both are null', () => {
			expect(criteriaAreEqual(null, null)).toBe(true);
		});

		it('should return false when only one is undefined', () => {
			const criteria = {
				queryString: 'test',
				filters: {},
			};

			expect(criteriaAreEqual(criteria, undefined)).toBe(false);
			expect(criteriaAreEqual(undefined, criteria)).toBe(false);
		});

		it('should handle deep comparison of filters', () => {
			const criteriaA = {
				queryString: 'test',
				filters: {
					arrearsRate: { min: 1, max: 5 },
					country: ['KE', 'UG'],
				},
			};
			const criteriaB = {
				queryString: 'test',
				filters: {
					arrearsRate: { min: 1, max: 5 },
					country: ['KE', 'UG'],
				},
			};

			expect(criteriaAreEqual(criteriaA, criteriaB)).toBe(true);
		});
	});
});
