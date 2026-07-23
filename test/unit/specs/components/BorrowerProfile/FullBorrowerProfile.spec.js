import FullBorrowerProfile from '#src/components/BorrowerProfile/FullBorrowerProfile';

const { isAnonymized, isFundraising, showComments } = FullBorrowerProfile.computed;

// Evaluates a computed with a mock `this` context, resolving other computeds it depends on.
function evalShowComments({ isLoggedIn = false, status = 'fundraising', anonymizationLevel = 'none' } = {}) {
	const context = {
		isLoggedIn,
		loanData: { status, anonymizationLevel },
	};
	context.isAnonymized = isAnonymized.call(context);
	context.isFundraising = isFundraising.call(context);
	return showComments.call(context);
}

describe('FullBorrowerProfile comment section visibility', () => {
	describe('isAnonymized', () => {
		it.each([
			['full', true],
			['pii', true],
			['none', false],
			[undefined, false],
			['', false],
		])('anonymizationLevel "%s" -> %s', (level, expected) => {
			expect(isAnonymized.call({ loanData: { anonymizationLevel: level } })).toBe(expected);
		});
	});

	describe('showComments', () => {
		describe('logged-in user', () => {
			it('shows unless the loan is anonymized, regardless of status', () => {
				expect(evalShowComments({ isLoggedIn: true, status: 'fundraising' })).toBe(true);
				expect(evalShowComments({ isLoggedIn: true, status: 'ended' })).toBe(true);
				expect(evalShowComments({ isLoggedIn: true, status: 'payingBack' })).toBe(true);
			});

			it('hides on a full/pii anonymized loan', () => {
				expect(evalShowComments({ isLoggedIn: true, anonymizationLevel: 'full' })).toBe(false);
				expect(evalShowComments({ isLoggedIn: true, anonymizationLevel: 'pii' })).toBe(false);
			});
		});

		describe('logged-out visitor', () => {
			it('shows only on a fundraising loan with no anonymization', () => {
				expect(evalShowComments({ isLoggedIn: false, status: 'fundraising', anonymizationLevel: 'none' }))
					.toBe(true);
			});

			it('hides when the loan is not fundraising', () => {
				expect(evalShowComments({ isLoggedIn: false, status: 'ended' })).toBe(false);
				expect(evalShowComments({ isLoggedIn: false, status: 'payingBack' })).toBe(false);
			});

			it('hides when the loan has any anonymization', () => {
				expect(evalShowComments({ isLoggedIn: false, anonymizationLevel: 'full' })).toBe(false);
				expect(evalShowComments({ isLoggedIn: false, anonymizationLevel: 'pii' })).toBe(false);
			});

			it('treats a missing anonymizationLevel as none', () => {
				expect(evalShowComments({ isLoggedIn: false, anonymizationLevel: undefined })).toBe(true);
			});
		});
	});
});
