import { hasLoanFunFactFootnote } from '#src/util/myKivaUtils';

describe('myKivaUtils.js', () => {
	describe('hasLoanFunFactFootnote', () => {
		it('should return true for loan in United States', () => {
			const loan = {
				geocode: {
					country: {
						region: 'North America',
						name: 'United States'
					}
				}
			};

			const result = hasLoanFunFactFootnote(loan);

			expect(result).toBe(true);
		});

		it('should return false for loan in North America but not United States', () => {
			const loan = {
				geocode: {
					country: {
						region: 'North America',
						name: 'Mexico'
					}
				}
			};

			const result = hasLoanFunFactFootnote(loan);

			expect(result).toBe(false);
		});

		it('should return true for loan in Central America', () => {
			const loan = {
				geocode: {
					country: {
						region: 'Central America'
					}
				}
			};

			const result = hasLoanFunFactFootnote(loan);

			expect(result).toBe(true);
		});

		it('should return true for loan in Africa', () => {
			const loan = {
				geocode: {
					country: {
						region: 'Africa'
					}
				}
			};

			const result = hasLoanFunFactFootnote(loan);

			expect(result).toBe(true);
		});

		it('should return true for loan in Asia', () => {
			const loan = {
				geocode: {
					country: {
						region: 'Asia'
					}
				}
			};

			const result = hasLoanFunFactFootnote(loan);

			expect(result).toBe(true);
		});

		it('should return false for loan in Middle East', () => {
			const loan = {
				geocode: {
					country: {
						region: 'Middle East'
					}
				}
			};

			const result = hasLoanFunFactFootnote(loan);

			expect(result).toBe(false);
		});
	});
});
