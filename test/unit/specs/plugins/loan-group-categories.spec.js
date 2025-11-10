import loanGroupCategoriesMixin from '#src/plugins/loan-group-categories';

describe('loan-group-categories', () => {
	describe('data', () => {
		it('should return an object with lendingCategories array', () => {
			const data = loanGroupCategoriesMixin.data();
			expect(data).toHaveProperty('lendingCategories');
			expect(Array.isArray(data.lendingCategories)).toBe(true);
		});

		it('should have 8 lending categories', () => {
			const data = loanGroupCategoriesMixin.data();
			expect(data.lendingCategories).toHaveLength(8);
		});

		describe('lending category structure', () => {
			let categories;

			beforeAll(() => {
				categories = loanGroupCategoriesMixin.data().lendingCategories;
			});

			it('should have valid structure for all categories', () => {
				categories.forEach(category => {
					expect(category).toHaveProperty('value');
					expect(category).toHaveProperty('label');
					expect(category).toHaveProperty('shortName');
					expect(category).toHaveProperty('marketingName');
					expect(category).toHaveProperty('marketingOrder');
					expect(category).toHaveProperty('expLoansIds');

					expect(typeof category.value).toBe('string');
					expect(typeof category.label).toBe('string');
					expect(typeof category.shortName).toBe('string');
					expect(typeof category.marketingName).toBe('string');
					expect(typeof category.marketingOrder).toBe('number');
					expect(Array.isArray(category.expLoansIds)).toBe(true);
					expect(category.expLoansIds).toHaveLength(3);
				});
			});

			it('should have unique values', () => {
				const values = categories.map(c => c.value);
				const uniqueValues = new Set(values);
				expect(values.length).toBe(uniqueValues.size);
			});

			it('should have unique marketingOrder values', () => {
				const orders = categories.map(c => c.marketingOrder);
				const uniqueOrders = new Set(orders);
				expect(orders.length).toBe(uniqueOrders.size);
			});
		});
	});
});
