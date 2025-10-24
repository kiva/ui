import {
	describe, it, expect
} from 'vitest';
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

			it('should have all marketingOrders from 1-8', () => {
				const orders = categories.map(c => c.marketingOrder).sort((a, b) => a - b);
				expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
			});
		});

		describe('specific categories', () => {
			let categories;

			beforeAll(() => {
				categories = loanGroupCategoriesMixin.data().lendingCategories;
			});

			it('should have a "default" category', () => {
				const defaultCategory = categories.find(c => c.value === 'default');
				expect(defaultCategory).toBeDefined();
				expect(defaultCategory.label).toBe('Support all borrowers');
				expect(defaultCategory.shortName).toBe('all borrowers');
				expect(defaultCategory.marketingName).toBe('Everyone');
			});

			it('should have a "women" category', () => {
				const womenCategory = categories.find(c => c.value === 'women');
				expect(womenCategory).toBeDefined();
				expect(womenCategory.label).toBe('Support women');
				expect(womenCategory.shortName).toBe('women');
				expect(womenCategory.marketingName).toBe('Women');
			});

			it('should have an "agriculture" category', () => {
				const agricultureCategory = categories.find(c => c.value === 'agriculture');
				expect(agricultureCategory).toBeDefined();
				expect(agricultureCategory.label).toBe('Support farmers');
				expect(agricultureCategory.shortName).toBe('farmers');
				expect(agricultureCategory.marketingName).toBe('Farmers');
			});

			it('should have a "refugees" category', () => {
				const refugeesCategory = categories.find(c => c.value === 'refugees');
				expect(refugeesCategory).toBeDefined();
				expect(refugeesCategory.label).toBe('Support refugees');
				expect(refugeesCategory.shortName).toBe('refugees');
				expect(refugeesCategory.marketingName).toBe('Refugees');
			});

			it('should have an "education" category', () => {
				const educationCategory = categories.find(c => c.value === 'education');
				expect(educationCategory).toBeDefined();
				expect(educationCategory.label).toBe('Support students');
				expect(educationCategory.shortName).toBe('students');
				expect(educationCategory.marketingName).toBe('Students');
			});

			it('should have an "eco_friendly" category', () => {
				const ecoCategory = categories.find(c => c.value === 'eco_friendly');
				expect(ecoCategory).toBeDefined();
				expect(ecoCategory.label).toBe('Support earth friendly loans');
				expect(ecoCategory.shortName).toBe('earth friendly loans');
				expect(ecoCategory.marketingName).toBe('Earth friendly');
			});

			it('should have a "us_borrowers" category', () => {
				const usCategory = categories.find(c => c.value === 'us_borrowers');
				expect(usCategory).toBeDefined();
				expect(usCategory.label).toBe('Support US borrowers');
				expect(usCategory.shortName).toBe('US borrowers');
				expect(usCategory.marketingName).toBe('US Borrowers');
			});

			it('should have a "disaster_relief_covid" category', () => {
				const covidCategory = categories.find(c => c.value === 'disaster_relief_covid');
				expect(covidCategory).toBeDefined();
				expect(covidCategory.label).toBe('COVID-19 Coronavirus');
				expect(covidCategory.shortName).toBe('the global COVID—19 response');
				expect(covidCategory.marketingName).toBe('COVID-19');
			});
		});
	});
});
