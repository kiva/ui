import {
	getBorrowerMessageAuthor,
	getBorrowerMessagePhoto,
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

		it('uses the partner name for partner messages, which are not about one loan', () => {
			expect(getBorrowerMessageAuthor({ type: 'partner', loan })).toBe('NWTF');
			expect(getBorrowerMessageAuthor({ type: 'partner', loan: { name: 'Maria' } })).toBe('');
		});
	});

	describe('getBorrowerMessagePhoto', () => {
		const messageImage = { default: 'update.jpg' };
		const loanImage = { default: 'loan.jpg' };
		const partnerImage = { default: 'partner.jpg' };
		const withImages = {
			image: messageImage,
			loan: { ...loan, image: loanImage, partner: { ...loan.partner, image: partnerImage } },
		};

		it('uses the message image, then the loan image', () => {
			expect(getBorrowerMessagePhoto(withImages))
				.toEqual({ ...messageImage, alt: 'Photo from Maria\'s message' });
			expect(getBorrowerMessagePhoto({ ...withImages, image: null }))
				.toEqual({ ...loanImage, alt: 'Photo of Maria' });
		});

		it('uses the message image, then the partner image, for partner messages', () => {
			const partnerMessage = { ...withImages, type: 'partner' };

			expect(getBorrowerMessagePhoto(partnerMessage))
				.toEqual({ ...messageImage, alt: 'Photo from NWTF\'s message' });
			expect(getBorrowerMessagePhoto({ ...partnerMessage, image: null }))
				.toEqual({ ...partnerImage, alt: 'Photo of NWTF' });
		});

		it('describes the photo without a name', () => {
			const unnamed = { ...withImages, loan: { ...withImages.loan, name: '' } };

			expect(getBorrowerMessagePhoto(unnamed).alt).toBe('Photo from this message');
			expect(getBorrowerMessagePhoto({ ...unnamed, image: null }).alt).toBe('Borrower photo');
		});

		it('returns null when there is no image', () => {
			expect(getBorrowerMessagePhoto({ loan })).toBeNull();
			expect(getBorrowerMessagePhoto({ type: 'partner', loan: { ...loan, image: loanImage } })).toBeNull();
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

		it('titles partner messages with the partner name', () => {
			expect(getBorrowerMessageTitle({ type: 'partner', loan })).toBe('Update from NWTF');
			expect(getBorrowerMessageTitle({ type: 'partner', loan: { name: 'Maria' } })).toBe('Borrower Message');
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
