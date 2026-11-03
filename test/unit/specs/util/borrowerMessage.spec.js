import {
	getBorrowerMessageAuthor,
	getBorrowerMessageSubject,
	getBorrowerMessageTitle,
} from '#src/util/borrowerMessage';

const loan = { name: 'Maria', partner: { name: 'NWTF' } };

describe('borrowerMessage', () => {
	describe('getBorrowerMessageAuthor', () => {
		it('uses the loan name, not the raw author username', () => {
			expect(getBorrowerMessageAuthor({ authorName: 'staff */*/', loan })).toBe('Maria');
		});

		it('falls back to the partner name, then nothing', () => {
			expect(getBorrowerMessageAuthor({ loan: { ...loan, name: '' } })).toBe('NWTF');
			expect(getBorrowerMessageAuthor({ loan: {} })).toBe('');
		});
	});

	describe('getBorrowerMessageTitle', () => {
		it.each([
			['Maria', 'Update for Maria\'s Loan'],
			['Chris', 'Update for Chris\' Loan'],
			['Cielo Frazao\'s Group', 'Update for Cielo Frazao\'s Group Loan'],
			['', 'Borrower Message'],
		])('titles a loan named %j', (name, title) => {
			expect(getBorrowerMessageTitle({ loan: { name } })).toBe(title);
		});
	});

	describe('getBorrowerMessageSubject', () => {
		it('prefers the translated subject as plain text', () => {
			expect(getBorrowerMessageSubject({ subject: 'Hola', subjectTranslated: '<b>Hi</b> &amp; bye', loan }))
				.toBe('Hi & bye');
			expect(getBorrowerMessageSubject({ subject: 'Hola', subjectTranslated: '', loan })).toBe('Hola');
		});

		it('falls back to the title when the subject is empty', () => {
			expect(getBorrowerMessageSubject({ subject: '', subjectTranslated: '', loan }))
				.toBe('Update for Maria\'s Loan');
		});
	});
});
