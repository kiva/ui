import FullBorrowerProfile from '#src/components/BorrowerProfile/FullBorrowerProfile';

const { isAnonymized, isPrivileged, showComments } = FullBorrowerProfile.computed;

// Evaluates a computed with a mock `this` context, resolving other computeds it depends on.
function evalShowComments({ privileged = false, anonymizationLevel = 'none' } = {}) {
	const context = {
		loanData: {
			anonymizationLevel,
			userProperties: { isPrivileged: privileged },
		},
	};
	context.isAnonymized = isAnonymized.call(context);
	context.isPrivileged = isPrivileged.call(context);
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

	describe('isPrivileged', () => {
		it('defaults to false when userProperties are missing', () => {
			expect(isPrivileged.call({ loanData: {} })).toBe(false);
			expect(isPrivileged.call({})).toBe(false);
		});
	});

	describe('showComments', () => {
		describe('privileged user', () => {
			it('shows when the loan is not anonymized', () => {
				expect(evalShowComments({ privileged: true, anonymizationLevel: 'none' })).toBe(true);
			});

			it('treats a missing anonymizationLevel as none', () => {
				expect(evalShowComments({ privileged: true, anonymizationLevel: undefined })).toBe(true);
			});

			it('hides on a full/pii anonymized loan', () => {
				expect(evalShowComments({ privileged: true, anonymizationLevel: 'full' })).toBe(false);
				expect(evalShowComments({ privileged: true, anonymizationLevel: 'pii' })).toBe(false);
			});
		});

		describe('non-privileged user', () => {
			it('hides regardless of anonymization', () => {
				expect(evalShowComments({ privileged: false, anonymizationLevel: 'none' })).toBe(false);
				expect(evalShowComments({ privileged: false, anonymizationLevel: 'full' })).toBe(false);
				expect(evalShowComments({ privileged: false, anonymizationLevel: 'pii' })).toBe(false);
			});
		});
	});
});
