import getCategoryName from '#src/util/categoryUtils';

describe('categoryUtils.js', () => {
	describe('getCategoryName', () => {
		it('should return "loans to women" for categoryId 5', () => {
			expect(getCategoryName(5, 'Women')).toBe('loans to women');
		});

		it('should return "loans to women" for categoryId 52', () => {
			expect(getCategoryName(52, 'Female Education')).toBe('loans to women');
		});

		it('should return "COVID-19 loans" for categoryId 96', () => {
			expect(getCategoryName(96, 'COVID-19')).toBe('COVID-19 loans');
		});

		it('should return "shelter loans" for categoryId 93', () => {
			expect(getCategoryName(93, 'Shelter')).toBe('shelter loans');
		});

		it('should return "arts loans" for categoryId 89', () => {
			expect(getCategoryName(89, 'Arts')).toBe('arts loans');
		});

		it('should return "agriculture loans" for categoryId 87', () => {
			expect(getCategoryName(87, 'Agriculture')).toBe('agriculture loans');
		});

		it('should return "technology loans" for categoryId 102', () => {
			expect(getCategoryName(102, 'Technology')).toBe('technology loans');
		});

		it('should return "education loans" for categoryId 4', () => {
			expect(getCategoryName(4, 'Education')).toBe('education loans');
		});

		it('should return "health loans" for categoryId 25', () => {
			expect(getCategoryName(25, 'Health')).toBe('health loans');
		});

		it('should return "loans to refugees and IDPs" for categoryId 32', () => {
			expect(getCategoryName(32, 'Refugees/Displaced')).toBe('loans to refugees and IDPs');
		});

		it('should remove text in square brackets for default case', () => {
			expect(getCategoryName(999, 'Food [Special]')).toBe('Food');
		});

		it('should remove text in square brackets with spaces', () => {
			expect(getCategoryName(100, 'Retail [Best Sellers]')).toBe('Retail');
		});

		it('should return the name as-is for default case without brackets', () => {
			expect(getCategoryName(200, 'Food')).toBe('Food');
		});

		it('should handle empty name for default case', () => {
			expect(getCategoryName(300, '')).toBe('');
		});

		it('should handle null/undefined by converting to string', () => {
			expect(getCategoryName(400, null)).toBe('null');
			expect(getCategoryName(400, undefined)).toBe('undefined');
		});
	});
});
