import * as comparators from '../../../../src/util/comparators';

describe('comparators.js', () => {
	describe('abc', () => {
		it('returns a function', () => {
			expect(comparators.abc()).toBeInstanceOf(Function);
		});

		it('sorts arrays alphabtically', () => {
			const initial = ['blair', 'drew', 'alex', 'cameron'];
			const expected = ['alex', 'blair', 'cameron', 'drew'];
			expect(initial.sort(comparators.abc())).toEqual(expected);
		});
	});

	describe('indexIn', () => {
		it('returns a function', () => {
			expect(comparators.indexIn([])).toBeInstanceOf(Function);
		});

		it('throws an error if not called with an array', () => {
			expect(() => comparators.indexIn()).toThrow();
		});

		it('sorts elements into same order as they appear in another array', () => {
			const list = ['blair', 'alex', 'drew', 'cameron'];
			const initial = ['alex', 'cameron', 'drew'];
			const expected = ['alex', 'drew', 'cameron'];
			expect(initial.sort(comparators.indexIn(list))).toEqual(expected);
		});

		it('uses a property of each element to sort, instead of the element, if given a property name', () => {
			const list = ['blair', 'alex', 'drew', 'cameron'];
			const initial = [
				{ label: 'alex' },
				{ label: 'cameron' },
				{ label: 'drew' },
			];
			const expected = [
				{ label: 'alex' },
				{ label: 'drew' },
				{ label: 'cameron' },
			];
			expect(initial.sort(comparators.indexIn(list, 'label'))).toEqual(expected);
		});
	});

	describe('startsWith', () => {
		it('returns a function', () => {
			expect(comparators.startsWith('')).toBeInstanceOf(Function);
		});

		it('throws an error if not called with a query string', () => {
			expect(() => comparators.startsWith()).toThrow();
		});

		it('handles case-insensitive matching', () => {
			const initial = ['Israel', 'isle', 'ISLAND'];
			const result = initial.sort(comparators.startsWith('IS'));
			// All three start with 'is' (case-insensitive), should be alphabetically sorted
			expect(result[0].toLowerCase()).toMatch(/^is/);
			expect(result[1].toLowerCase()).toMatch(/^is/);
			expect(result[2].toLowerCase()).toMatch(/^is/);
		});

		it('sorts elements starting with a query string first, then alphabetically', () => {
			const initial = ['Malawi', 'Easter Island', 'Isle of Wight', 'Hilton Head Island, SC', 'Israel'];
			const expected = ['Isle of Wight', 'Israel', 'Easter Island', 'Hilton Head Island, SC', 'Malawi'];
			expect(initial.sort(comparators.startsWith('is'))).toEqual(expected);
		});

		it('uses a property of each element to sort, instead of the element, if given a property name', () => {
			const initial = [
				{ label: 'Easter Island' },
				{ label: 'Malawi' },
				{ label: 'Israel' },
				{ label: 'Isle of Wight' },
				{ label: 'Hilton Head Island, SC' },
			];
			const expected = [
				{ label: 'Isle of Wight' },
				{ label: 'Israel' },
				{ label: 'Easter Island' },
				{ label: 'Hilton Head Island, SC' },
				{ label: 'Malawi' },
			];
			expect(initial.sort(comparators.startsWith('is', 'label'))).toEqual(expected);
		});
	});
});
