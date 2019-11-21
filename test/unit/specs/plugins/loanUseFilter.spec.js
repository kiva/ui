import loanUseFilter, { shortenedLoanUse, borrowerCountLanguage, helpedLanguage } from '@/plugins/loan-use-filter';

describe('loanUseFilter', () => {
	describe('helpedLanguage', () => {
		it('Should return the proper verbiage depending on status', () => {
			expect(helpedLanguage('fundraising')).toBe('helps');
			expect(helpedLanguage('inactive')).toBe('helps');
			expect(helpedLanguage('reviewed')).toBe('helps');
			expect(helpedLanguage('active')).toBe('helped');
			expect(helpedLanguage(null)).toBe('helped');
			expect(helpedLanguage(undefined)).toBe('helped');
		});
	});
	describe('borrowerCountLanguage', () => {
		it('Should return `a member` if count is greater than 1', () => {
			expect(borrowerCountLanguage(1)).toBe('');
			expect(borrowerCountLanguage(5)).toBe('a member ');
			expect(borrowerCountLanguage(0)).toBe('');
			expect(borrowerCountLanguage('string')).toBe('');
		});
	});
	describe('shortenedLoanUse', () => {
		it('Should return string depending on use, name and max length', () => {
			expect(shortenedLoanUse('loan use', 'Loan name', 12)).toBe('loan use');
			expect(shortenedLoanUse('', 'loan name', 10))
				.toBe('For the borrower\'s privacy, this loan has been made anonymous.');
			expect(shortenedLoanUse('Loan Title', 'Loan Title', 100)).toBe('Loan Title');
			expect(shortenedLoanUse('this is a very very long loan use',
				'the loan name is also very long', 5)).toBe('this ...');
		});
	});
	describe('loanUseFilter', () => {
		it('Combined filter should work', () => {
			expect(loanUseFilter('loan use', 'loan name', 'fundraising', 500.50, 35, 10))
				.toBe('A loan of $501 helps a member loan use');
		});
		it('Combined filter should work with missing params and default values', () => {
			expect(loanUseFilter('loan use', undefined, 'fundraising', 500.50, 35, 10)).toBe('A loan of $501 helps a member loan use');
			expect(loanUseFilter('loan use', 'loan name', undefined, 500.50, 35, 10)).toBe('A loan of $501 helped a member loan use');
			expect(loanUseFilter('loan use', 'loan name', 'fundraising', undefined, 35, 10)).toBe('A loan of $0 helps a member loan use');
			expect(loanUseFilter('loan use', 'loan name', 'fundraising', 500.50, undefined, 10)).toBe('A loan of $501 helps loan use');
			expect(loanUseFilter('loan use', 'loan name', 'fundraising', 500.50, 35, undefined)).toBe('A loan of $501 helps a member ...');
		});
	});
});
